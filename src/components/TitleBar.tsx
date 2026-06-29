"use strict";
function TitleBar(props: { sidecarStatus: string }) {
    const statusColor = props.sidecarStatus === "running" ? "var(--success)" : props.sidecarStatus === "starting" ? "#f39c12" : "var(--error)";
    return React.createElement("div", {
      style: { height: "var(--titlebar-h)", display: "flex", alignItems: "center", background: "var(--bg2)", borderBottom: "1px solid var(--border)", boxShadow: "inset 0 -1px 0 rgba(96,165,250,0.08)", padding: "0 12px", WebkitAppRegion: "drag", flexShrink: 0, position: "relative", zIndex: 20 }
    },
      // Sigma icon with glow
      React.createElement("div", { style: { width: 26, height: 26, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(96,165,250,0.1)", marginRight: 8 } },
        React.createElement("span", { style: { color: "var(--accent)", fontSize: 15, fontWeight: 700, lineHeight: 1 } }, "\u03a3")
      ),
      // Title
      React.createElement("span", { style: { flex: 1, fontSize: 12, fontWeight: 600, color: "var(--fg2)", letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 8 } },
        "Formula Recognizer",
        React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: statusColor, display: "inline-block", flexShrink: 0, transition: "background var(--transition)", boxShadow: "0 0 6px " + (props.sidecarStatus === "running" ? "rgba(34,197,94,0.4)" : "transparent") } })
      ),
      // Window controls
      React.createElement("div", { style: { display: "flex", gap: 2 } },
        React.createElement("button", {
          style: { WebkitAppRegion: "no-drag", background: "none", border: "none", color: "var(--fg2)", cursor: "pointer", width: 32, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 14, transition: "all var(--transition)" },
          onClick: function() { window.electronAPI?.minimizeWindow(); },
        },
          React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none" },
            React.createElement("rect", { x: "0.5", y: "0.5", width: "13", height: "13", rx: "3", stroke: "currentColor", strokeWidth: "0.5", fill: "transparent", opacity: 0.2 }),
            React.createElement("path", { d: "M4 7h6", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" })
          ),
          React.createElement("div", { style: { position: "absolute", inset: 0, borderRadius: 4, background: "var(--bg3)", opacity: 0, transition: "opacity var(--transition)" },
            // hover via CSS :hover won't work in inline, but we use pseudo approach
          })
        ),
        React.createElement("button", {
          style: { WebkitAppRegion: "no-drag", background: "none", border: "none", color: "var(--fg2)", cursor: "pointer", width: 32, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 14, transition: "all var(--transition)" },
          onClick: function() { window.electronAPI?.closeWindow(); },
        },
          React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none" },
            React.createElement("rect", { x: "0.5", y: "0.5", width: "13", height: "13", rx: "3", stroke: "currentColor", strokeWidth: "0.5", fill: "transparent", opacity: 0.2 }),
            React.createElement("path", { d: "M4 4l6 6M10 4l-6 6", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" })
          ),
        ),
      ),
    );
}
