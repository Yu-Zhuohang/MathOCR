/// <reference types="react" />

function HistoryPanel(props: { entries: any[]; onDelete: (id: string) => void; onClear: () => void }) {
  const [selectedId, setSelectedId] = React.useState(null);
  const selected = props.entries.find(function(e) { return e.id === selectedId; });
  const [toast, setToast] = React.useState("");
  const timer: any = React.useRef(null);
  function showToast(msg: string) { setToast(msg); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(function() { setToast(""); }, 2000); }

  const headerStyle = { padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--fg)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" };
  const itemBase: any = { padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", transition: "background var(--transition)" };
  const iconBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "none", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "var(--fg)", background: "var(--bg)", transition: "all var(--transition)" };
  function IconSvg(p: { d: string }) { return React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: p.d })); }

  return React.createElement("div", { style: { flex: 1, display: "flex", overflow: "hidden" } },
    React.createElement("div", { style: { width: "var(--sidebar-w)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--bg2)" } },
      React.createElement("div", { style: headerStyle },
        React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } },
          React.createElement("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("circle", { cx: 12, cy: 12, r: 10 }), React.createElement("polyline", { points: "12 6 12 12 16 14" })
          ),
          "History",
          props.entries.length > 0 ? React.createElement("span", { style: { fontSize: 10, color: "var(--fg2)", marginLeft: 4, fontFamily: "var(--font-mono)" } }, "(" + props.entries.length + ")") : null
        ),
        props.entries.length > 0 ? React.createElement("button", { style: { background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: 11, padding: "2px 4px", borderRadius: 3 }, onClick: props.onClear }, "Clear") : null
      ),
      React.createElement("div", { style: { flex: 1, overflowY: "auto" } },
        props.entries.length === 0
          ? React.createElement("div", { style: { padding: 24, textAlign: "center", fontSize: 12, color: "var(--fg2)", lineHeight: 1.7 } },
              React.createElement("div", { style: { marginBottom: 8, opacity: 0.4 } },
                React.createElement("svg", { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" },
                  React.createElement("circle", { cx: 12, cy: 12, r: 10 }), React.createElement("polyline", { points: "12 6 12 12 16 14" })
                )
              ),
              "No history yet", React.createElement("br"), "Take a screenshot to start"
            )
          : props.entries.map(function(e: any) {
              return React.createElement("div", {
                key: e.id,
                style: Object.assign({}, itemBase, { background: e.id === selectedId ? "var(--bg3)" : "transparent" }),
                onClick: function() { setSelectedId(e.id); }
              },
                React.createElement("div", { style: { fontSize: 11, color: "var(--fg2)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("span", null, new Date(e.createdAt).toLocaleString()),
                  React.createElement("button", {
                    style: { background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: "2px 4px", fontSize: 11, borderRadius: 3 },
                    onClick: function(ev: any) { ev.stopPropagation(); props.onDelete(e.id); },
                    title: "Delete"
                  },
                    React.createElement("svg", { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
                      React.createElement("polyline", { points: "3 6 5 6 21 6" }),
                      React.createElement("path", { d: "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" })
                    )
                  )
                ),
                React.createElement("div", { style: { fontSize: 12, color: "var(--fg)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, e.latex)
              );
            })
      )
    ),
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } },
      React.createElement("div", { style: { padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--fg2)", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("span", { style: { width: 3, height: 12, borderRadius: 2, background: "var(--accent)", opacity: 0.6 } }),
        "LaTeX"
      ),
      React.createElement("textarea", {
        style: { width: "100%", height: 100, flexShrink: 0, background: "var(--bg)", color: "var(--fg)", border: "none", borderBottom: "1px solid var(--border)", outline: "none", resize: "none", fontFamily: "'Consolas', 'Courier New', monospace", fontSize: 13, padding: "8px 14px", lineHeight: 1.6 },
        value: selected ? selected.latex : "",
        readOnly: true,
        placeholder: "Select a history entry to view LaTeX",
        spellCheck: false
      }),
      React.createElement("div", { style: { padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--fg2)", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("span", { style: { width: 3, height: 12, borderRadius: 2, background: "var(--accent)", opacity: 0.6 } }),
        "Preview"
      ),
      React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "auto" } },
        selected
          ? React.createElement(PreviewPane, { latex: selected.latex })
          : React.createElement("div", { style: { color: "var(--fg2)", fontSize: 12, textAlign: "center" } },
              React.createElement("span", null, "Select a history item"),
              React.createElement("br"),
              React.createElement("span", { style: { color: "var(--fg2)", opacity: 0.6 } }, "to view formula preview")
            )
      ),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 } },
        React.createElement("button", {
          style: Object.assign({}, iconBtn, { opacity: selected ? 1 : 0.5, cursor: selected ? "pointer" : "not-allowed" }),
          disabled: !selected,
          onClick: function() { if (!selected) return; window.electronAPI?.copyLatexAsText(selected.latex); showToast("LaTeX copied!"); },
        },
          React.createElement(IconSvg, { d: "M7 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4M5 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" }),
          "Copy LaTeX",
        ),
        React.createElement("button", {
          style: Object.assign({}, iconBtn, { opacity: selected ? 1 : 0.5, cursor: selected ? "pointer" : "not-allowed" }),
          disabled: !selected,
          onClick: async function() { if (!selected) return; var r = await window.electronAPI?.copyLatexAsWord(selected.latex); showToast(r?.success ? "Copied! Paste into Word (Ctrl+V)" : "Copy failed"); },
        },
          React.createElement(IconSvg, { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4zM14 2v6h6" }),
          "Copy MathML (Word)",
        ),
        toast ? React.createElement("div", { style: { position: "fixed", bottom: 52, left: "50%", transform: "translateX(-50%)", background: "var(--bg3)", color: "var(--fg)", padding: "8px 18px", borderRadius: "var(--radius)", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 9999, animation: "fadeIn 200ms", whiteSpace: "nowrap", pointerEvents: "none" } }, toast) : null
      )
    )
  );
}