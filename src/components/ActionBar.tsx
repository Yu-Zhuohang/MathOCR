/// <reference types="react" />

function ActionBar(props: {
  latex: string;
  imageBase64: string;
  onScreenshot: () => void;
  isLoading: boolean;
  sidecarStatus: string;
  error: string | null;
  onClearError: () => void;
}) {
  const canScreenshot = props.sidecarStatus === "running" && !props.isLoading;

  const barStyle = { display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 } as const;
  const iconBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "var(--fg)", background: "var(--bg)", transition: "all var(--transition)" } as const;
  const accBtn = { ...iconBtn, background: "var(--accent)", color: "#fff" } as const;
  const toastStyle = { position: "fixed", bottom: 52, left: "50%", transform: "translateX(-50%)", background: "var(--bg3)", color: "var(--fg)", padding: "8px 18px", borderRadius: "var(--radius)", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 9999, animation: "fadeIn 200ms", whiteSpace: "nowrap", pointerEvents: "none" } as const;
  const [toastMsg, setToastMsg] = React.useState("");
  const toastTimer: any = React.useRef(null);

  function IconSvg(p: { d: string; w?: number }) { return React.createElement("svg", { width: p.w || 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: p.d })) }

  const copyAsWord = React.useCallback(async () => {
    if (!props.latex) return;
    try {
      const result = await window.electronAPI?.copyLatexAsWord(props.latex);
      if (result?.success) {
        setToastMsg("Copied! Paste into Word (Ctrl+V)");
      } else {
        setToastMsg("Copy failed: " + (result?.error || "Unknown error"));
      }
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(function() { setToastMsg(""); }, 2500);
    } catch (e: any) {
      console.error("[actionbar] Word copy failed:", e);
      setToastMsg("Copy error: " + (e.message || e));
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(function() { setToastMsg(""); }, 2500);
    }
  }, [props.latex]);

  const copyLatex = React.useCallback(() => {
    if (!props.latex) return;
    window.electronAPI?.copyLatexAsText(props.latex);
  }, [props.latex]);

  const buttons = React.createElement("div", { style: barStyle },
    React.createElement("button", {
      style: { ...(canScreenshot ? accBtn : { ...iconBtn, opacity: 0.5, cursor: "not-allowed" }) },
      onClick: canScreenshot ? props.onScreenshot : undefined,
      disabled: !canScreenshot,
      title: "Screenshot (Ctrl+Shift+Alt+F)",
    },
      React.createElement(IconSvg, { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" }),
      props.isLoading ? "Recognizing..." : "Screenshot",
    ),
    React.createElement("button", {
      style: { ...iconBtn, opacity: props.latex ? 1 : 0.5, cursor: props.latex ? "pointer" : "not-allowed" },
      onClick: copyLatex,
      disabled: !props.latex,
      title: "Copy LaTeX code",
    },
      React.createElement(IconSvg, { d: "M7 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4M5 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" }),
      "Copy LaTeX",
    ),
    React.createElement("button", {
      style: { ...iconBtn, opacity: props.latex ? 1 : 0.5, cursor: props.latex ? "pointer" : "not-allowed" },
      onClick: copyAsWord,
      disabled: !props.latex,
      title: "Copy as MathML (paste into Word)",
    },
      React.createElement(IconSvg, { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4zM14 2v6h6" }),
      "Copy MathML",
    ),
    props.error ? React.createElement("div", { style: { fontSize: 11, color: "var(--error)", background: "rgba(231,76,60,0.08)", padding: "4px 10px", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 6, animation: "fadeIn 200ms" } },
      React.createElement("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 }, React.createElement("circle", { cx: 12, cy: 12, r: 10 }), React.createElement("line", { x1: 12, y1: 8, x2: 12, y2: 12 }), React.createElement("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 })),
      props.error,
      React.createElement("button", { style: { background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 4 }, onClick: props.onClearError, title: "Dismiss" }, "\u00d7"),
    ) : null,
    React.createElement("div", { style: { fontSize: 11, color: "var(--fg2)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 } },
      props.isLoading ? React.createElement("span", { style: { width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", animation: "pulse 1s infinite" } }) : null,
      props.isLoading ? "Processing..." :
      props.sidecarStatus === "running" ? "Ready" :
      props.sidecarStatus === "starting" ? "Starting..." :
      props.sidecarStatus === "crashed" ? "Crashed" : "",
    ),
  );
  return React.createElement(React.Fragment, null, buttons, toastMsg ? React.createElement("div", { style: toastStyle }, toastMsg) : null);
}
