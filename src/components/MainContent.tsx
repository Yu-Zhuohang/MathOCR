/// <reference types="react" />

function MainContent(props: {
  latex: string;
  imageBase64: string;
  onLatexChange: (v: string) => void;
  onScreenshot: () => void;
  isLoading: boolean;
  sidecarStatus: string;
  error: string | null;
  onClearError: () => void;
}) {
  const screenshotArea = React.createElement("div", {
    style: {
      height: 200, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg2)", borderBottom: "1px solid var(--border)",
      position: "relative" as const, overflow: "hidden",
    },
  },
    props.isLoading
      ? React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "var(--fg2)" } },
          React.createElement("div", { style: { width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
          React.createElement("span", { style: { fontSize: 13 } }, "Recognizing..."),
        )
      : props.imageBase64
        ? React.createElement("img", {
            src: "data:image/png;base64," + props.imageBase64,
            style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" as const, borderRadius: 4 },
          })
        : React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--fg2)", opacity: 0.6 } },
            React.createElement("svg", { width: 36, height: 36, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" },
              React.createElement("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 }),
              React.createElement("circle", { cx: 8.5, cy: 8.5, r: 1.5 }),
              React.createElement("polyline", { points: "21 15 16 10 5 21" }),
            ),
            React.createElement("span", { style: { fontSize: 13 } }, props.sidecarStatus === "running" ? "Press Ctrl+Shift+Alt+F to capture a formula" : "Waiting for engine..."),
          )
  );


  const contentArea = React.createElement("div", {
    style: { flex: 1, display: "flex", overflow: "hidden" },
  },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)" } },
      React.createElement("div", { style: { padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "var(--fg2)", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("span", { style: { width: 3, height: 12, borderRadius: 2, background: "var(--accent)", opacity: 0.6 } }),
        "LaTeX",
      ),
      React.createElement(LaTeXEditor, { value: props.latex, onChange: props.onLatexChange }),
    ),
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column" } },
      React.createElement("div", { style: { padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "var(--fg2)", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("span", { style: { width: 3, height: 12, borderRadius: 2, background: "var(--accent)", opacity: 0.6 } }),
        "Preview",
      ),
      React.createElement(PreviewPane, { latex: props.latex }),
    ),
  );

  return React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } },
    screenshotArea,
    contentArea,
    React.createElement(ActionBar, {
      latex: props.latex,
      imageBase64: props.imageBase64,
      onScreenshot: props.onScreenshot,
      isLoading: props.isLoading,
      sidecarStatus: props.sidecarStatus,
      error: props.error,
      onClearError: props.onClearError,
    }),
  );
}