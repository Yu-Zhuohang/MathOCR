function LaTeXEditor(props: { value: string; onChange: (val: string) => void }) {
  return React.createElement("textarea", {
    style: { width: "100%", height: "100%", background: "var(--bg)", color: "var(--fg)", border: "none", outline: "none", resize: "none", fontFamily: "'Consolas', 'Courier New', monospace", fontSize: 14, padding: 12, lineHeight: 1.6 },
    value: props.value,
    onChange: (e: any) => props.onChange(e.target.value),
    placeholder: "LaTeX will appear here after recognition...",
    spellCheck: false
  });
}
