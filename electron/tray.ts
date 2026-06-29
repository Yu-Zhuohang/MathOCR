import { Tray, Menu, app, nativeImage, BrowserWindow } from "electron";

let tray: Tray | null = null;
let mainWindowRef: BrowserWindow | null = null;

export function createTray(mainWindow: BrowserWindow) {
  mainWindowRef = mainWindow;
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEoSURBVDiNpZMxTsNAEEX/rNeOAwUlHVdA4gJcAokLUNDRcAQkLkCBaOgouQIVHZyAgoKSK0QiJI5jr3cohuxarJOU/NJo5s+b2dEuqcpJUZQ3AL4BzNXsDwBqZv3eYAAAgABEhHme3wH4EpH3qqo+AKiqNhHBGMMYwxgj3HsfKaWnlNLzPM8fq6oK+/2eeyml01rrY9d1YRgGjDGIiFrrQkTGGJvNZj+O41VZlrwjIvM8fxZFUW6324+qqphzDlorcs6Rc4aIYLfbUUR4OBw4Z4yglBIRQVVVeDgcsNvtEHMeInJdluVt27bknEMpBcYYpJQwmUzQNA2cc3DnHCIiAJBSwnQ6Rdd1UBWqKpRSMMbAOYe+76Fq0DQN5vM5XNdBRKCqyDnDOYeu6zBNE6qK2Wz2D5BSQkoJqkpEBAD8AgvVdYSYC/+OAAAAAElFTkSuQmCC"
  );
  tray = new Tray(icon);
  tray.setToolTip("Formula Recognizer");

  const contextMenu = Menu.buildFromTemplate([
    { label: "Screenshot (Ctrl+Shift+Alt+F)", click: () => mainWindow?.webContents.send("trigger-screenshot") },
    { type: "separator" },
    { label: "Show Window", click: () => { mainWindow.show(); mainWindow.focus(); } },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else { mainWindow.show(); mainWindow.focus(); }
  });

  return tray;
}
