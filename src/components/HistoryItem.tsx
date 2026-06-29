/// <reference types="react" />

function HistoryItem(props: { entry: HistoryEntry; isActive: boolean; onClick: () => void; onDelete: (id: string) => void }) {
  const timeStr = React.useMemo(() => {
    const d = new Date(props.entry.createdAt);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }, [props.entry.createdAt]);

  const [hovered, setHovered] = React.useState(false);
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const itemStyle = { padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid var(--border)", background: props.isActive ? "var(--bg3)" : "transparent", transition: "background var(--transition)", position: "relative" as const, animation: "fadeIn 200ms" } as const;

  React.useEffect(() => {
    if (props.entry.thumbnailPath) {
      window.electronAPI?.getThumbnailDataUrl(props.entry.id).then(url => {
        if (url) setThumbnailUrl(url);
      });
    }
  }, [props.entry.id, props.entry.thumbnailPath]);

  return React.createElement("div", { style: itemStyle, onClick: props.onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) },
    thumbnailUrl && hovered ? React.createElement("div", { style: { position: "absolute" as const, left: "100%", top: 0, marginLeft: 4, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 4, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.4)", animation: "fadeIn 100ms" } },
      React.createElement("img", { src: thumbnailUrl, style: { width: 160, height: "auto", borderRadius: 3, display: "block" } }),
    ) : null,
    React.createElement("div", { style: { fontSize: 11, color: "var(--fg2)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" } },
      React.createElement("span", null, timeStr),
      React.createElement("span", { style: { fontSize: 10, color: "var(--fg2)", fontFamily: "var(--font-mono)", opacity: 0.7 } }, props.entry.latex.length > 20 ? props.entry.latex.substring(0, 20) + "..." : props.entry.latex),
      hovered ? React.createElement("button", {
        style: { background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: "2px 4px", fontSize: 11, borderRadius: 3, position: "absolute" as const, top: 4, right: 4 },
        onClick: (e: any) => { e.stopPropagation(); props.onDelete(props.entry.id); },
        title: "Delete",
      },
        React.createElement("svg", { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
          React.createElement("polyline", { points: "3 6 5 6 21 6" }),
          React.createElement("path", { d: "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" }),
        )
      ) : null,
    ),
  );
}