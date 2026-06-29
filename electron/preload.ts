import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  recognize: (imageBase64: string) =>
    ipcRenderer.invoke("recognize", imageBase64),
  getSidecarStatus: () => ipcRenderer.invoke("get-sidecar-status"),
  onSidecarStatusChange: (callback: (status: string) => void) => {
    const h = (_e: any, s: string) => {
      console.log("[preload] sidecar status:", s);
      callback(s);
    };
    ipcRenderer.on("sidecar-status", h);
    console.log("[preload] onSidecarStatusChange registered");
    return () => ipcRenderer.removeListener("sidecar-status", h);
  },
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  recognizeImage: (imageBase64: string) => ipcRenderer.invoke("recognize-image", imageBase64),
  startScreenshot: () => ipcRenderer.invoke("start-screenshot"),
  onRecognitionResult: (callback: (result: any) => void) => {
    const h = (_e: any, r: any) => {
      console.log("[preload] recognition result:", JSON.stringify(r));
      callback(r);
    };
    ipcRenderer.on("recognition-result", h);
    console.log("[preload] onRecognitionResult registered");
    return () => ipcRenderer.removeListener("recognition-result", h);
  },
  onTriggerScreenshot: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("trigger-screenshot", handler);
    return () => ipcRenderer.removeListener("trigger-screenshot", handler);
  },
  loadHistory: () => ipcRenderer.invoke("load-history"),
  saveHistory: (entries: any[]) => ipcRenderer.invoke("save-history", entries),
  getThumbnailDataUrl: (id: string) => ipcRenderer.invoke("get-thumbnail-data-url", id),
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  copyLatexAsWord: (latex: string) => ipcRenderer.invoke("copy-latex-as-word", latex),
  copyLatexAsText: (latex: string) => ipcRenderer.invoke("copy-latex-as-text", latex),
});