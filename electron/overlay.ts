import { BrowserWindow, screen, desktopCapturer, nativeImage } from "electron";
import * as log from "electron-log";
import * as path from "path";
import * as fs from "fs";

export class OverlayManager {
  private overlayWindow: BrowserWindow | null = null;
  private _resolved = false;

  async open(): Promise<{ imageBase64: string } | null> {
    if (this.overlayWindow) return null;

    const cursorPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPoint);
    const { x, y, width, height } = display.bounds;
    const scaleFactor = display.scaleFactor;
    const physicalW = Math.round(width * scaleFactor);
    const physicalH = Math.round(height * scaleFactor);

    this.overlayWindow = new BrowserWindow({
      x, y, width, height,
      transparent: true, frame: false, resizable: false,
      skipTaskbar: true, alwaysOnTop: true,
      webPreferences: { contextIsolation: false, nodeIntegration: true },
    });
    log.info("[overlay] Created " + width + "x" + height + " @" + scaleFactor + "x");

    const htmlPath = path.join(__dirname, "overlay.html");
    const html = fs.readFileSync(htmlPath, "utf-8");
    const overlayWin = this.overlayWindow!;
    overlayWin.loadURL("data:text/html;base64," + Buffer.from(html).toString("base64"));

    return new Promise((resolve) => {
      this._resolved = false;

      const pollTimer = setInterval(async () => {
        const w = this.overlayWindow;
        if (!w) { clearInterval(pollTimer); return; }
        try {
          const sel = await w.webContents.executeJavaScript("window.__r__");
          if (sel !== undefined) {
            clearInterval(pollTimer);
            await this._capture(sel, physicalW, physicalH, resolve, overlayWin);
            if (overlayWin && !overlayWin.isDestroyed()) {
              try { overlayWin.close(); } catch { }
            }
          }
        } catch { /* poll retry */ }
      }, 200);

      overlayWin.on("closed", () => {
        clearInterval(pollTimer);
        this.overlayWindow = null;
        if (!this._resolved) { this._resolved = true; resolve(null); }
      });

      setTimeout(() => {
        clearInterval(pollTimer);
        if (overlayWin && !overlayWin.isDestroyed()) {
          overlayWin.close();
        }
      }, 120000);
    });
  }

  private async _capture(
    sel: { x: number; y: number; width: number; height: number } | null,
    fullW: number, fullH: number, resolve: (v: any) => void,
    overlayWin: BrowserWindow
  ) {
    if (!sel || sel.width < 10 || sel.height < 10 || (sel as any).cancelled) {
      log.info("[overlay] Selection too small or cancelled");
      if (!this._resolved) { this._resolved = true; resolve(null); }
      return;
    }
    log.info("[overlay] Selection: " + JSON.stringify(sel));
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: fullW, height: fullH }
      });
      if (sources.length > 0) {
        const fullImg = nativeImage.createFromDataURL(sources[0].thumbnail.toDataURL());
        const imgSize = fullImg.getSize();
        log.info("[overlay] Full capture: " + imgSize.width + "x" + imgSize.height);
        const cropped = fullImg.crop(sel);
        const croppedSize = cropped.getSize();
        const b64 = cropped.toPNG().toString("base64");
        log.info("[overlay] Cropped: " + croppedSize.width + "x" + croppedSize.height + ", " + b64.length + " bytes");
        if (!this._resolved) { this._resolved = true; resolve({ imageBase64: b64 }); }
        return;
      }
    } catch (e: any) {
      log.error("[overlay] Capture error: " + e.message);
    }
    if (!this._resolved) { this._resolved = true; resolve(null); }
  }
}

let instance: OverlayManager | null = null;
export function getOverlayManager(): OverlayManager {
  if (!instance) instance = new OverlayManager();
  return instance;
}
