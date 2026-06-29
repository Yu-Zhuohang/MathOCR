import { ChildProcess, spawn } from "child_process";
import { app } from "electron";
import * as path from "path";
import * as log from "electron-log";

export type SidecarStatus = "stopped" | "starting" | "running" | "crashed" | "shutting_down";

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timer: NodeJS.Timeout;
}

export class SidecarManager {
  private process: ChildProcess | null = null;
  private status: SidecarStatus = "stopped";
  private buffer = "";
  private requestId = 0;
  private pending = new Map<number, PendingRequest>();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private startupTimer: NodeJS.Timeout | null = null;
  private restartCount = 0;
  private readonly maxRestarts = 3;
  private onStatusChange: ((status: SidecarStatus) => void) | null = null;
  private onReady: (() => void) | null = null;

  setOnStatusChange(cb: (status: SidecarStatus) => void) { this.onStatusChange = cb; }
  setOnReady(cb: () => void) { this.onReady = cb; }
  getStatus(): SidecarStatus { return this.status; }

  private getEnginePath(): string {
    if (app.isPackaged) {
      const ext = process.platform === "win32" ? ".exe" : "";
      return path.join(process.resourcesPath, "engine", `recognition-engine${ext}`);
    }
    return path.join(__dirname, "..", "..", "engine", "server.py");
  }

  private getPythonCommand(): { cmd: string; args: string[] } {
    var p = app.isPackaged
      ? path.join(process.resourcesPath, "engine", "server.py")
      : path.join(__dirname, "..", "..", "engine", "server.py");
    return { cmd: this.findPython(), args: [p] };
  }

  private findPython(): string {
    var candidates = process.platform === "win32"
      ? ["py", "python", "python3"]
      : ["python3", "python"];
    for (var cmd of candidates) {
      try {
        require("child_process").execSync(cmd + " --version", { stdio: "pipe", timeout: 3000 });
        return cmd;
      } catch {}
    }
    // Check common Python installation paths on Windows
    if (process.platform === "win32") {
      var localAppData = process.env.LOCALAPPDATA || "";
      var systemRoot = process.env.SYSTEMROOT || "";
      var commonPaths = [
        localAppData + "\\Microsoft\\WindowsApps\\python.exe",
        localAppData + "\\Programs\\Python\\Python311\\python.exe",
        localAppData + "\\Programs\\Python\\Python312\\python.exe",
        localAppData + "\\Programs\\Python\\Python313\\python.exe",
        localAppData + "\\Programs\\Python\\Python310\\python.exe",
        "C:\\Python311\\python.exe",
        "C:\\Python312\\python.exe",
        "C:\\Python313\\python.exe",
        "C:\\Python310\\python.exe",
        systemRoot + "\\py.exe",
        systemRoot + "\\System32\\py.exe",
      ];
      for (var p of commonPaths) {
        try {
          if (require("fs").existsSync(p)) {
            return "\"" + p + "\"";
          }
        } catch {}
      }
    }
    return "";
  }

  private setStatus(s: SidecarStatus) {
    this.status = s;
    if (this.onStatusChange) this.onStatusChange(s);
  }

  start() {
    if (this.process) return;
    this.setStatus("starting");

    var enginePath = this.getEnginePath();

    // Packaged mode: try standalone recognition-engine.exe first, fallback to python + server.py
    if (app.isPackaged) {
      try {
        if (require("fs").existsSync(enginePath)) {
          log.info("[sidecar] Starting engine exe: " + enginePath);
          this.process = spawn(enginePath, [], {
            stdio: ["pipe", "pipe", "pipe"],
          });
          this.process.stdout?.on("data", (data) => this.handleOutput(data.toString()));
          this.process.stderr?.on("data", (data) => log.error("[sidecar:err] " + data.toString()));
          this.process.on("exit", (code) => { log.info("[sidecar] Exited with code " + code); this.handleCrash(); });
          this.process.on("error", (err) => { log.error("[sidecar] Spawn error: " + err.message); this.handleCrash(); });
          this.startupTimer = setTimeout(() => {
            if (this.status === "starting") {
              this.setStatus("crashed");
              if (this.process) { this.process.kill(); this.process = null; }
              this.handleCrash();
            }
          }, 120000);
          return;
        }
        log.info("[sidecar] Engine exe not found at " + enginePath + ", falling back to python + server.py");
      } catch (e: any) {
        log.info("[sidecar] Engine exe error, falling back: " + e.message);
      }
    }

    // Robust path resolution: try multiple locations
    var fs = require("fs");
    var serverPath = "";
    // 1) Packaged mode via process.resourcesPath (electron-builder)
    if (process.resourcesPath) {
      var p1 = path.join(process.resourcesPath, "engine", "server.py");
      if (fs.existsSync(p1)) { serverPath = p1; }
    }
    // 2) Manual packaging: __dirname = resources/app/dist/electron -> 4 levels up = app root
    if (!serverPath) {
      var p2 = path.resolve(__dirname, "..", "..", "..", "..", "resources", "engine", "server.py");
      if (fs.existsSync(p2)) { serverPath = p2; }
    }
    // 3) Dev mode: fallback
    if (!serverPath) {
      serverPath = path.resolve(__dirname, "..", "..", "engine", "server.py");
    }
    var py = this.findPython();
    if (!py) {
      log.error("[sidecar] Python not found! Please install Python 3.11+ with: pip install -r engine/requirements.txt");
      this.setStatus("crashed");
      return;
    }
    log.info("[sidecar] Starting: " + py + " " + serverPath);
    try {
      this.process = spawn(py, [serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      });
      this.process.stdout?.on("data", (data) => this.handleOutput(data.toString()));
      this.process.stderr?.on("data", (data) => log.error("[sidecar:err] " + data.toString()));
      this.process.on("exit", (code) => { log.info("[sidecar] Exited with code " + code); this.handleCrash(); });
      this.process.on("error", (err) => { log.error("[sidecar] Spawn error: " + err.message); this.handleCrash(); });
      this.startupTimer = setTimeout(() => {
        if (this.status === "starting") {
          this.setStatus("crashed");
          if (this.process) { this.process.kill(); this.process = null; }
          this.handleCrash();
        }
      }, 120000);
    } catch (e: any) {
      log.error("[sidecar] Failed to start: " + e.message);
      this.handleCrash();
    }
  }

  private handleOutput(data: string) {
    this.buffer += data;
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.method === "ready") {
          if (msg.params?.error) {
            log.error("[sidecar] Ready error: " + msg.params.error);
            this.setStatus("crashed");
            return;
          }
          if (this.startupTimer) clearTimeout(this.startupTimer);
          this.startupTimer = null;
          this.restartCount = 0;
          this.setStatus("running");
          this.startHeartbeat();
          if (this.onReady) this.onReady();
          log.info("[sidecar] Ready");
          return;
        }
        if (msg.method === "log") {
          log.info("[sidecar:log] " + (msg.params?.message || ""));
          return;
        }
        const pending = this.pending.get(msg.id);
        if (pending) {
          clearTimeout(pending.timer);
          this.pending.delete(msg.id);
          if (msg.error) pending.reject(new Error(msg.error.message || "Unknown error"));
          else pending.resolve(msg.result);
        }
      } catch { /* not JSON, ignore */ }
    }
  }

  private handleCrash() {
    if (this.startupTimer) { clearTimeout(this.startupTimer); this.startupTimer = null; }
    this.stopHeartbeat();
    if (this.status === "running") this.setStatus("crashed");
    if (this.restartCount < this.maxRestarts) {
      this.restartCount++;
      const delay = this.restartCount * 1000;
      setTimeout(() => this.start(), delay);
    } else if (this.status !== "shutting_down") {
      this.setStatus("crashed");
    }
  }

  async call(method: string, params: any = {}, timeoutMs = 30000): Promise<any> {
    if (this.status !== "running") {
      throw new Error("Sidecar not running (status: " + this.status + ")");
    }
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const request = { jsonrpc: "2.0", method, params, id };
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("Request timed out: " + method));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      if (this.process?.stdin) {
        this.process.stdin.write(JSON.stringify(request) + "\n");
      } else {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(new Error("No stdin available"));
      }
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.call("ping", {}, 30000).catch(() => {
        log.warn("[sidecar] Heartbeat failed, marking as crashed");
        this.setStatus("crashed");
      });
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  async shutdown() {
    this.setStatus("shutting_down");
    if (this.startupTimer) clearTimeout(this.startupTimer);
    this.stopHeartbeat();
    if (this.process) {
      try { await this.call("shutdown", {}, 5000); } catch {}
      this.process.kill();
      this.process = null;
    }
  }
}

let instance: SidecarManager | null = null;
export function getSidecarManager(): SidecarManager {
  if (!instance) instance = new SidecarManager();
  return instance;
}
