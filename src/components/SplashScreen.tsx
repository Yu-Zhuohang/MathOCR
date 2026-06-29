function SplashScreen(props: { status: string; onScreenshot: () => void }) {
  const isRunning = props.status === "running";
  const isLoading = props.status === "starting";

  const barRef = React.useRef(null);

  React.useEffect(() => {
    if (isRunning) return;
    let cancelled = false;
    const animate = () => {
      if (cancelled) return;
      const el = barRef.current;
      if (!el) { requestAnimationFrame(animate); return; }
      const t = performance.now() / 1000;
      const cycle = 2.5;
      const pct = ((t % cycle) / cycle) * 200 - 100;
      el.style.transform = "translateX(" + pct + "%)";
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { cancelled = true; };
  }, [isRunning]);

  const label = isRunning ? "Ready"
    : isLoading ? "Loading Model"
    : "Starting";

  const loadingMsgs = ["Loading recognition engine", "this may take 30-60 seconds"];
  const [dots, setDots] = React.useState(0);
  const [subLabelIndex, setSubLabelIndex] = React.useState(0);

  React.useEffect(() => {
    if (isRunning) return;
    let tick = 0;
    const t = setInterval(() => {
      tick++;
      setDots((d: number) => (d + 1) % 4);
      if (tick % 20 === 0) setSubLabelIndex((i: number) => (i + 1) % 2);
    }, 600);
    return () => clearInterval(t);
  }, [isRunning]);

  const subLabel = isRunning
    ? "Press Ctrl+Shift+Alt+F to capture a formula, or upload an image"
    : isLoading
      ? loadingMsgs[subLabelIndex]
      : "Initializing...";

  return React.createElement("div", {
    style: {
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 28, padding: 40,
      animation: "fadeIn 500ms ease-out",
      userSelect: "none",
    }
  },

    React.createElement("div", {
      style: {
        width: 80, height: 80, borderRadius: 20,
        background: "var(--bg2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid " + (isRunning ? "var(--success)" : "var(--accent)"),
        boxShadow: isRunning ? "0 0 30px rgba(34,197,94,0.2)" : "0 0 25px rgba(96,165,250,0.15)",
        transition: "all 0.6s",
        animation: isRunning ? "none" : "glowPulse 2s ease-in-out infinite",
      }
    },
      React.createElement("span", {
        style: { color: isRunning ? "var(--success)" : "var(--accent)", fontSize: 36, fontWeight: 700, lineHeight: 1, transition: "color 0.6s" }
      }, "Σ")
    ),

    React.createElement("div", {
      style: { fontSize: 17, fontWeight: 600, color: "var(--fg)", letterSpacing: 0.3 }
    }, label),

    React.createElement("div", {
      key: subLabelIndex,
      style: { fontSize: 12, color: "var(--fg2)", textAlign: "center", lineHeight: 1.7, maxWidth: 380, animation: "fadeIn 600ms ease-out" }
    }, subLabel + (!isRunning ? "•".repeat(dots) : "")),

    !isRunning
      ? React.createElement("div", {
          style: { width: 240, height: 4, background: "var(--bg3)", borderRadius: 3, overflow: "hidden", marginTop: 4 }
        },
          React.createElement("div", {
            ref: barRef,
            style: {
              width: "60%", height: "100%",
              background: "linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--accent) 60%, transparent 100%)",
              borderRadius: 3, willChange: "transform",
            }
          })
        )
      : null,

    isRunning
      ? React.createElement("button", {
          style: {
            marginTop: 12, padding: "11px 32px",
            border: "none", borderRadius: "var(--radius)",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: "var(--accent)", color: "#fff",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 20px rgba(96,165,250,0.3)",
            transition: "all 0.2s",
            transform: "translateY(0)",
          },
          onMouseOver: "this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 24px rgba(96,165,250,0.4)'",
          onMouseOut: "this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(96,165,250,0.3)'",
          onClick: props.onScreenshot,
        },
          React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
            React.createElement("circle", { cx: 12, cy: 13, r: 4 })
          ),
          "Take Screenshot"
        )
      : null
  );
}
