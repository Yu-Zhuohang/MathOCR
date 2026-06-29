interface NavItem {
  id: string;
  label: string;
  shortcut: string;
  svg: string;
}

var NAV_ITEMS: NavItem[] = [
  { id: "screenshot", label: "Screenshot", shortcut: "Ctrl+Shift+Alt+F", svg: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { id: "upload", label: "Upload Image", shortcut: "", svg: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" },
  { id: "history", label: "History", shortcut: "", svg: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { id: "editor", label: "LaTeX Editor", shortcut: "", svg: "M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" },
];

function NavIcon(p: any) {
  return React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: p.d }));
}

function NavigationBar(props: any) {
  var activeTool = props.activeTool;
  var onSelect = props.onSelect;
  var [hoveredId, setHoveredId] = React.useState("");
  var [tooltipPos, setTooltipPos] = React.useState({ top: 0 });
  var btnRefs = React.useRef({});

  function handleMouseEnter(id: any) {
    if (btnRefs.current[id]) {
      var r = btnRefs.current[id].getBoundingClientRect();
      setTooltipPos({ top: r.top + r.height / 2 });
    }
    setHoveredId(id);
  }

  var navStyle = { width: 48, background: "var(--bg3)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 2, flexShrink: 0, position: "relative", zIndex: 10 };
  var btnBase = { width: 36, height: 36, border: "none", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "none", color: "var(--fg2)", transition: "all 150ms", position: "relative" };

  return React.createElement("div", { style: { display: "flex", flexShrink: 0, height: "100%" } },
    React.createElement("div", { style: navStyle },
      NAV_ITEMS.map(function(item: any) {
        return React.createElement(React.Fragment, { key: item.id },
          React.createElement("button", {
            ref: function(el: any) { btnRefs.current[item.id] = el; },
            style: Object.assign({}, btnBase, {
              background: activeTool === item.id ? "var(--accent)" : hoveredId === item.id ? "var(--bg2)" : "none",
              color: activeTool === item.id ? "#fff" : hoveredId === item.id ? "var(--fg)" : "var(--fg2)",
            }),
            onClick: function() { onSelect(item.id); },
            onMouseEnter: function() { handleMouseEnter(item.id); },
            onMouseLeave: function() { setHoveredId(""); },
          }, React.createElement(NavIcon, { d: item.svg })),
          hoveredId === item.id
            ? React.createElement("div", { style: { position: "fixed", left: 52, top: tooltipPos.top, transform: "translateY(-50%)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "5px 10px", fontSize: 12, color: "var(--fg)", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 100ms" } },
              React.createElement("span", null, item.label),
              item.shortcut ? React.createElement("span", { style: { fontSize: 10, color: "var(--fg2)", background: "var(--bg2)", padding: "1px 5px", borderRadius: 3, fontFamily: "var(--font-mono)" } }, item.shortcut) : null
            )
            : null
        );
      })
    )
  );
}