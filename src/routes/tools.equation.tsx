import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/equation")({
  component: MathEquationRenderer,
});

function MathEquationRenderer() {
  const [latex, setLatex] = useState("\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
  const [rendered, setRendered] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadKaTeX = () => {
    if ((window as any).katex) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    script.onload = () => setRendered((r) => !r);
    document.head.appendChild(script);
  };

  loadKaTeX();

  const renderLatex = () => {
    try {
      const katex = (window as any).katex;
      if (katex && containerRef.current) {
        katex.render(latex, containerRef.current, { throwOnError: false, displayMode: true });
      }
    } catch {}
  };

  // Trigger render when latex changes or katex loads
  useState(() => { setTimeout(renderLatex, 100); });

  const copyAs = async (type: string) => {
    let text = latex;
    if (type === "unicode") {
      text = latex.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/[\\{}]/g, "").replace(/sqrt/, "√").replace(/pm/, "±").replace(/\^(\d+)/g, "^$1");
    }
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <AppShell title="Math Equation Renderer">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 Math Equation Renderer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Type LaTeX, see beautiful equations. Uses KaTeX (free, no server).</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <textarea
          value={latex}
          onChange={(e) => { setLatex(e.target.value); setTimeout(renderLatex, 50); }}
          placeholder="Type LaTeX math notation..."
          className="h-24 w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
        />

        {/* Rendered output */}
        <div className="rounded-xl border border-border bg-surface p-8">
          <div ref={containerRef} className="text-center text-foreground min-h-[60px] flex items-center justify-center" />
        </div>

        {/* Copy options */}
        <div className="flex gap-2">
          <button onClick={() => copyAs("latex")} className="flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Copy LaTeX</button>
          <button onClick={() => copyAs("unicode")} className="flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Copy Unicode</button>
        </div>

        {/* Common templates */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Quick Templates</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Quadratic formula", tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
              { label: "Integral", tex: "\\int_{a}^{b} f(x) \\, dx" },
              { label: "Sum", tex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" },
              { label: "Matrix", tex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
              { label: "Limit", tex: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0" },
              { label: "Derivative", tex: "\\frac{d}{dx} x^n = nx^{n-1}" },
            ].map((t) => (
              <button key={t.label} onClick={() => { setLatex(t.tex); setTimeout(renderLatex, 50); }}
                className="rounded-lg border border-border bg-surface-elevated p-2 text-left text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
