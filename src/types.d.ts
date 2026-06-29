/// <reference types="react" />
/// <reference types="react-dom" />

declare var React: any;
declare var ReactDOM: any;

interface HistoryEntry {
  id: string;
  latex: string;
  createdAt: number;
  thumbnailPath?: string;
}

interface ElectronAPI {
  openFileDialog: () => Promise<{ imageBase64: string } | null>;
  recognizeImage: (imageBase64: string) => void;
  startScreenshot: () => void;
  minimizeWindow: () => void;
  closeWindow: () => void;
  loadHistory: () => Promise<HistoryEntry[]>;
  saveHistory: (entries: HistoryEntry[]) => void;
  getThumbnailDataUrl: (id: string) => Promise<string | null>;
  getSidecarStatus: () => string;
  onSidecarStatusChange: (cb: (s: string) => void) => (() => void);
  onRecognitionResult: (cb: (r: any) => void) => (() => void);
  onTriggerScreenshot: (cb: () => void) => (() => void);
  copyLatexAsWord: (latex: string) => Promise<{ success: boolean; error?: string }>;
  copyLatexAsText: (latex: string) => Promise<{ success: boolean }>;
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<void>;
}


declare function HistoryPanel(props: { entries: any[]; onDelete: (id: string) => void; onClear: () => void }): any;
interface Window {
  electronAPI?: ElectronAPI;
  katexRender?: (latex: string, dm?: boolean) => string;
}