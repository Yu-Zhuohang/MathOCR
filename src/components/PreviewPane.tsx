function PreviewPane(props: { latex: string }) {
  const html = React.useMemo(() => {
    if (!props.latex) return null;
    const k = (window as any).katex;
    if (!k) return "<pre style='color:var(--fg2)'>KaTeX not available</pre>";
    try { return k.renderToString(props.latex, { throwOnError: false, displayMode: true, output: "html" }); }
    catch (e: any) { return "<pre style='color:var(--error);font-size:12px'>Error: " + e.message.replace(/</g,"&lt;") + "</pre>"; }
  }, [props.latex]);

  const emptyStyle = { flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: 20, background: "var(--bg)", overflow: "auto", gap: 8 } as const;
  const hasContentStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)", overflow: "auto", animation: "slideUp 300ms" } as const;

  if (!props.latex) return React.createElement("div", { style: emptyStyle },
    React.createElement("div", { style: { background: "var(--bg2)", borderRadius: 8, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" } },
      React.createElement("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "var(--fg2)", strokeWidth: 1.5, strokeLinecap: "round" },
        React.createElement("path", { d: "M4 7V4h16v3" }), React.createElement("path", { d: "M9 20h6" }), React.createElement("path", { d: "M12 4v16" })
      )
    ),
    React.createElement("span", { style: { color: "var(--fg2)", fontSize: 12, lineHeight: 1.5, textAlign: "center" } },
      "Take a screenshot", React.createElement("br"), "to see formula preview"
    )
  );
  return React.createElement("div", { style: hasContentStyle, dangerouslySetInnerHTML: { __html: html! } });
}
