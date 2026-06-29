import { dialog, clipboard } from "electron";
import { ipcMain, BrowserWindow, app, nativeImage } from "electron";
import { getSidecarManager } from "./sidecar";
import { getOverlayManager } from "./overlay";
import Store from "electron-store";
import * as path from "path";
import * as fs from "fs";
import * as log from "electron-log";

const store = new Store({ schema: { entries: { type: "array", default: [] as any[] } } });

function trimHistory() {
  const entries = (store.get("entries") || []) as any[];
  const keptIds = new Set(entries.map((e: any) => e.id));
  const thumbDir = path.join(app.getPath("userData"), "thumbnails");
  try {
    if (fs.existsSync(thumbDir)) {
      for (const file of fs.readdirSync(thumbDir)) {
        const id = file.replace(".png", "");
        if (!keptIds.has(id)) fs.unlinkSync(path.join(thumbDir, file));
      }
    }
  } catch { /* ignore */ }
}

function saveThumbnail(id: string, imageBase64: string) {
  try {
    const thumbDir = path.join(app.getPath("userData"), "thumbnails");
    fs.mkdirSync(thumbDir, { recursive: true });
    const thumbPath = path.join(thumbDir, `${id}.png`);
    const imgBuffer = Buffer.from(imageBase64, "base64");
    fs.writeFileSync(thumbPath, imgBuffer);
    return `thumbnails/${id}.png`;
  } catch (e) {
    log.error("[ipc] Failed to save thumbnail:", e);
    return undefined;
  }
}

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  const sidecar = getSidecarManager();
  const overlay = getOverlayManager();

  ipcMain.handle("start-screenshot", async () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.hide();
    const result = await overlay.open();
    mainWindow.show();
    if (!result) { mainWindow.webContents.send("recognition-result", { cancelled: true }); return; }
    if (result?.imageBase64 && sidecar.getStatus() === "running") {
      try {
        const res = await sidecar.call("recognize", { image: result.imageBase64 }, 120000);
        const latex = (res as any).latex;
        if (latex) {
          mainWindow.webContents.send("recognition-result", { latex, imageBase64: result.imageBase64 });
          const entries = (store.get("entries") || []) as any[];
          const id = crypto.randomUUID();
          const thumbnailPath = saveThumbnail(id, result.imageBase64);
          store.set("entries", [
            { id, latex, thumbnailPath, createdAt: Date.now() },
            ...entries,
          ].slice(0, 200));
          trimHistory();
        } else {
          mainWindow.webContents.send("recognition-result", { error: "No formula detected", imageBase64: result.imageBase64 });
        }
      } catch (err: any) {
        mainWindow.webContents.send("recognition-result", { error: err.message, imageBase64: result.imageBase64 });
      }
    } else if (result?.imageBase64 && sidecar.getStatus() !== "running") {
      mainWindow.webContents.send("recognition-result", { error: "Engine not ready", imageBase64: result.imageBase64 });
    }
  });

  ipcMain.handle("copy-latex-as-word", async (_event, latex: string) => {
    try {
      const katex = require("katex");
      const mathmlFull = katex.renderToString(latex, {
        output: "mathml", throwOnError: false, displayMode: true,
      });
      // Extract <math> tag from KaTeX output
      const mathStart = mathmlFull.indexOf("<math");
      const mathEnd = mathmlFull.lastIndexOf("</math>") + "</math>".length;
      const mathml = mathStart >= 0 ? mathmlFull.substring(mathStart, mathEnd) : mathmlFull;

      log.info("[ipc] Copy MathML: " + mathml.substring(0, 80) + "...");

      // One atomic clipboard write: both HTML (for Word) and plain text (for everywhere)
      // Word reads CF_HTML, detects MathML in <body>, renders as formula
      const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>${mathml}</body>
</html>`;
      clipboard.write({ html, text: mathml });

      return { success: true };
    } catch (e: any) {
      log.error("[ipc] Copy MathML failed: " + e.message);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle("copy-latex-as-text", async (_event, latex: string) => {
    clipboard.writeText(latex);
    return { success: true };
  });


  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp", "gif", "webp"] }]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const data = fs.readFileSync(result.filePaths[0]);
    log.info("[ipc] File selected: " + result.filePaths[0]);
    return { imageBase64: data.toString("base64") };
  });

  ipcMain.handle("recognize-image", async (_event, imageBase64: string) => {
    if (sidecar.getStatus() !== "running") return { error: "Engine not ready" };
    try {
      const res = await sidecar.call("recognize", { image: imageBase64 }, 120000);
      const latex = (res as any).latex;
      if (latex) {
        mainWindow.webContents.send("recognition-result", { latex, imageBase64 });
      } else {
        mainWindow.webContents.send("recognition-result", { error: "No formula detected", imageBase64 });
      }
    } catch (err: any) {
      mainWindow.webContents.send("recognition-result", { error: err.message, imageBase64 });
    }
  });

  ipcMain.handle("get-sidecar-status", () => sidecar.getStatus());

  ipcMain.handle("load-history", () => {
    return (store.get("entries") || []) as any[];
  });

  ipcMain.handle("save-history", (_event, entries: any[]) => {
    store.set("entries", entries.slice(0, 200));
    trimHistory();
  });

  ipcMain.handle("get-thumbnail-data-url", async (_event, id: string) => {
    const thumbPath = path.join(app.getPath("userData"), "thumbnails", `${id}.png`);
    if (!fs.existsSync(thumbPath)) return null;
    return nativeImage.createFromPath(thumbPath).toDataURL();
  });

  ipcMain.handle("minimize-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.handle("close-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
}
