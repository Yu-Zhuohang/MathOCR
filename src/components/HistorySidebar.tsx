function HistorySidebar(props: { entries: HistoryEntry[]; onSelect: (e: HistoryEntry) => void; onClear: () => void; onDelete: (id: string) => void }) {
  const [activeId, setActiveId] = React.useState(null);

  const sidebarStyle = { width: "var(--sidebar-w)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--bg2)" } as const;
  const headerStyle = { padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "var(--fg)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" } as const;

  return React.createElement("div", { style: sidebarStyle },
    React.createElement("div", { style: headerStyle },
      React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
          React.createElement("circle", { cx: 12, cy: 12, r: 10 }), React.createElement("polyline", { points: "12 6 12 12 16 14" })
        ),
        "History",
        props.entries.length > 0 ? React.createElement("span", { style: { fontSize: 10, color: "var(--fg2)", marginLeft: 4, fontFamily: "var(--font-mono)" } }, "(" + props.entries.length + ")") : null
      ),
      props.entries.length > 0 ? React.createElement("button", { style: { background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: 11, padding: "2px 4px", borderRadius: 3, transition: "background var(--transition)" }, onClick: props.onClear }, "Clear") : null
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
        : props.entries.map((e: any) => React.createElement(HistoryItem, { key: e.id, entry: e, isActive: e.id === activeId, onClick: () => { setActiveId(e.id); props.onSelect(e); }, onDelete: props.onDelete }))
    )
  );
}
