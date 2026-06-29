import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import * as log from "electron-log";
import { getSidecarManager } from "./sidecar";
import { getOverlayManager } from "./overlay";
import { registerIpcHandlers } from "./ipc-handlers";
import { createTray } from "./tray";

log.info("[main] App starting");

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

function createMainWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 960, height: 640, minWidth: 800, minHeight: 520,
    frame: false, show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  mainWindow.webContents.on("did-finish-load", () => log.info("[renderer] Page loaded"));
  mainWindow.webContents.on("did-fail-load", (_e, code, desc) => log.error("[renderer] Load failed: " + code + " " + desc));
  mainWindow.webContents.on("dom-ready", () => log.info("[renderer] DOM ready"));
  mainWindow.webContents.on("console-message", (_e, level, msg) => {
    const lvl = ["verbose","info","warning","error"][level] || "log";
    log.info("[renderer:" + lvl + "] " + msg);
  });
  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.webContents.on("did-finish-load", () => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      log.info("[main] Force-showing window");
      mainWindow.show();
    }
  });
  mainWindow.on("close", (e) => {
    if (!isQuitting) { e.preventDefault(); mainWindow?.hide(); }
  });
  return mainWindow;
}

app.whenReady().then(async () => {
  log.info("[main] App ready");
  const win = createMainWindow();
  registerIpcHandlers(win);
  createTray(win);

  const sidecar = getSidecarManager();
  sidecar.setOnStatusChange((status) => {
    win.webContents.send("sidecar-status", status);
    log.info("[main] Sidecar status: " + status);
  });
  sidecar.setOnReady(() => log.info("[main] Sidecar ready"));
  sidecar.start();

  if (process.platform === "win32") app.setAppUserModelId("com.formula-recognizer.app");

  globalShortcut.register("CommandOrControl+Shift+Alt+F", () => {
    mainWindow?.webContents.send("trigger-screenshot");
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("will-quit", async () => {
  globalShortcut.unregisterAll();
  await getSidecarManager().shutdown();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});