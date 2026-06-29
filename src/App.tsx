/// <reference types="react" />

function App() {
  const [activeTool, setActiveTool] = React.useState("screenshot");
  const [history, setHistory] = React.useState([]);
  const [currentLatex, setCurrentLatex] = React.useState("");
  const [currentImage, setCurrentImage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [sidecarStatus, setSidecarStatus] = React.useState("starting");
  const [error, setError] = React.useState(null);
  const [infoMsg, setInfoMsg] = React.useState("");
  const [editorToast, setEditorToast] = React.useState("");
  const etimer: any = React.useRef(null);

  const handleScreenshotRef = React.useRef(() => {});
  handleScreenshotRef.current = React.useCallback(() => {
    setIsLoading(true); setError(null);
    window.electronAPI?.startScreenshot();
  }, []);

  React.useEffect(() => {
    window.electronAPI?.loadHistory().then(setHistory);
    const unsubStatus = window.electronAPI?.onSidecarStatusChange(setSidecarStatus);
    const pollTimer = setInterval(async () => {
      try { const s = await window.electronAPI?.getSidecarStatus(); if (s) setSidecarStatus(s); } catch {}
    }, 2000);
    const unsubResult = window.electronAPI?.onRecognitionResult((result: any) => {
      setIsLoading(false);
      if (result.imageBase64) setCurrentImage(result.imageBase64);
      if (result.error) { setError(result.error); return; }
      setCurrentLatex(result.latex); setError(null);
      var entry = { id: Date.now().toString(), latex: result.latex, createdAt: Date.now() };
      setHistory(function(prev: any[]) {
        var updated = [entry].concat(prev).slice(0, 100);
        if (window.electronAPI) window.electronAPI.saveHistory(updated);
        return updated;
      });
    });
    const unsubShortcut = window.electronAPI?.onTriggerScreenshot(() => handleScreenshotRef.current());
    return () => {
      if (typeof unsubStatus === "function") unsubStatus();
      clearInterval(pollTimer);
      if (typeof unsubResult === "function") unsubResult();
      if (typeof unsubShortcut === "function") unsubShortcut();
    };
  }, []);

  const handleScreenshot = React.useCallback(() => {
    setIsLoading(true); setError(null);
    window.electronAPI?.startScreenshot();
  }, []);

  const handleSelectHistory = React.useCallback((entry: any) => setCurrentLatex(entry.latex), []);
  const handleClearHistory = React.useCallback(() => { setHistory([]); window.electronAPI?.saveHistory([]); }, []);
  const handleDeleteEntry = React.useCallback((id: string) => {
    setHistory((prev: any[]) => { const u = prev.filter((e: any) => e.id !== id); window.electronAPI?.saveHistory(u); return u; });
  }, []);

  const handleToolSelect = React.useCallback(async (id: string) => {
    setActiveTool(id);
    setError(null);
    setInfoMsg("");
    if (id === "upload") {
      setIsLoading(true);
      try {
        const file = await window.electronAPI?.openFileDialog();
        if (!file?.imageBase64) { setIsLoading(false); return; }
        setCurrentImage(file.imageBase64);
        setActiveTool("screenshot");
        await window.electronAPI?.recognizeImage(file.imageBase64);
      } catch (e: any) { setError(e.message); setIsLoading(false); }
    }
  }, []);

  if (sidecarStatus === "starting" || sidecarStatus === "stopped") {
    return React.createElement(React.Fragment, null,
      React.createElement(TitleBar, { sidecarStatus }),
      React.createElement(SplashScreen, { status: sidecarStatus, onScreenshot: handleScreenshot })
    );
  }

  return React.createElement(React.Fragment, null,
    React.createElement(TitleBar, { sidecarStatus }),
    React.createElement("div", { style: { display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - var(--titlebar-h))" } },
      React.createElement(NavigationBar, { activeTool, onSelect: handleToolSelect, entries: history, onHistorySelect: handleSelectHistory, onClearHistory: handleClearHistory, onDeleteEntry: handleDeleteEntry }),
      activeTool === "screenshot" || activeTool === "upload" ? React.createElement(React.Fragment, null,
        React.createElement(MainContent, { latex: currentLatex, imageBase64: currentImage, onLatexChange: setCurrentLatex, onScreenshot: handleScreenshot, isLoading, sidecarStatus, error, onClearError: () => setError(null) })
      ) : null,
      infoMsg ? React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 40 } },
        React.createElement("div", { style: { background: "var(--bg2)", borderRadius: 8, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 } },
          React.createElement("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "var(--fg2)", strokeWidth: 1.5, strokeLinecap: "round" },
            React.createElement("circle", { cx: 12, cy: 12, r: 10 }), React.createElement("line", { x1: 12, y1: 16, x2: 12, y2: 12 }), React.createElement("line", { x1: 12, y1: 8, x2: 12.01, y2: 8 })
          )
        ),
        React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "var(--fg2)" } }, infoMsg)
      ) : null,
      activeTool === "editor" ? React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } },
        React.createElement("div", { style: { padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "var(--fg2)", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", gap: 6 } },
          React.createElement("span", { style: { width: 3, height: 12, borderRadius: 2, background: "var(--accent)", opacity: 0.6 } }),
          "LaTeX Editor"
        ),
        React.createElement("div", { style: { display: "flex", flex: 1, overflow: "hidden" } },
          React.createElement("textarea", {
            style: { width: "50%", height: "100%", background: "var(--bg)", color: "var(--fg)", border: "none", borderRight: "1px solid var(--border)", outline: "none", resize: "none", fontFamily: "Consolas, 'Courier New', monospace", fontSize: 14, padding: 12, lineHeight: 1.6 },
            value: currentLatex,
            onChange: (e: any) => setCurrentLatex(e.target.value),
            placeholder: "Enter LaTeX formula here...",
            spellCheck: false
          }),
          React.createElement("div", { style: { width: "50%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" } },
            React.createElement(PreviewPane, { latex: currentLatex })
          )
        ),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 } },
          React.createElement("button", {
            style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, opacity: currentLatex ? 1 : 0.5, cursor: currentLatex ? "pointer" : "not-allowed", color: "var(--fg)", background: "var(--bg)", transition: "all var(--transition)" },
            onClick: function() { if (!currentLatex) return; window.electronAPI?.copyLatexAsText(currentLatex); setEditorToast("LaTeX copied!"); if (etimer.current) clearTimeout(etimer.current); etimer.current = setTimeout(function() { setEditorToast(""); }, 2000); },
            disabled: !currentLatex,
          },
            React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M7 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4M5 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" })),
            "Copy LaTeX",
          ),
          React.createElement("button", {
            style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, opacity: currentLatex ? 1 : 0.5, cursor: currentLatex ? "pointer" : "not-allowed", color: "var(--fg)", background: "var(--bg)", transition: "all var(--transition)" },
            onClick: function() { if (!currentLatex) return; window.electronAPI?.copyLatexAsWord(currentLatex); setEditorToast("Copied! Paste into Word (Ctrl+V)"); if (etimer.current) clearTimeout(etimer.current); etimer.current = setTimeout(function() { setEditorToast(""); }, 2000); },
            disabled: !currentLatex,
          },
            React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4zM14 2v6h6" })),
            "Copy MathML (Word)",
          ),
        ),
        editorToast ? React.createElement("div", { style: { position: "fixed", bottom: 52, left: "50%", transform: "translateX(-50%)", background: "var(--bg3)", color: "var(--fg)", padding: "8px 18px", borderRadius: "var(--radius)", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 9999, animation: "fadeIn 200ms", whiteSpace: "nowrap", pointerEvents: "none" } }, editorToast) : null
      ) : null,
      activeTool === "history" ? React.createElement(HistoryPanel, { entries: history, onDelete: handleDeleteEntry, onClear: handleClearHistory }) : null,
    )
  );
}