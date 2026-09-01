import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/gradient")({ component: GradientGenerator });

const PRESETS = [
  { name: "Sunset", colors: ["#ff512f", "#f09819"] }, { name: "Ocean", colors: ["#2193b0", "#6dd5ed"] },
  { name: "Purple", colors: ["#667eea", "#764ba2"] }, { name: "Emerald", colors: ["#11998e", "#38ef7d"] },
  { name: "Fire", colors: ["#f12711", "#f5af19"] }, { name: "Night", colors: ["#0f0c29", "#302b63", "#24243e"] },
  { name: "Pink", colors: ["#ee9ca7", "#ffdde1"] }, { name: "Cyan", colors: ["#00d2ff", "#3a7bd5"] },
];

function GradientGenerator() {
  const [colors, setColors] = useState(["#667eea", "#764ba2"]);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const css = type === "linear"
    ? `background: linear-gradient(${angle}deg, ${colors.join(", ")});`
    : `background: radial-gradient(circle, ${colors.join(", ")});`;
  const tailwind = `bg-gradient-to-br from-[${colors[0]}] to-[${colors[1] || colors[0]}]`;

  const addColor = () => { if (colors.length < 5) setColors(c => [...c, "#ffffff"]); };
  const updateColor = (i: number, val: string) => { const c = [...colors]; c[i] = val; setColors(c); };
  const removeColor = (i: number) => { if (colors.length > 2) setColors(c => c.filter((_, idx) => idx !== i)); };
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <AppShell title="Gradient Generator">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 CSS Gradient Generator</h1><p className="mt-1 text-sm text-muted-foreground">Pick colors, choose direction, copy as CSS or Tailwind.</p></header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Colors</h3>
            <div className="space-y-1.5">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c} onChange={e => updateColor(i, e.target.value)} className="size-8 cursor-pointer rounded-lg border border-border" />
                  <input value={c} onChange={e => updateColor(i, e.target.value)} className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 font-mono text-xs focus:outline-none" />
                  {colors.length > 2 && <button onClick={() => removeColor(i)} className="text-xs text-muted-foreground hover:text-red-400">×</button>}
                </div>
              ))}
            </div>
            {colors.length < 5 && <button onClick={addColor} className="mt-2 h-7 w-full rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">+ Add color</button>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">Type</label>
              <div className="flex gap-1">{(["linear", "radial"] as const).map(t => (
                <button key={t} onClick={() => setType(t)} className={`flex-1 rounded-lg border px-2 py-1 text-[10px] ${type === t ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{t}</button>
              ))}</div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-1"><p className="text-[10px] font-medium text-foreground">CSS</p><button onClick={() => copy(css)} className="text-[10px] text-primary">Copy</button></div>
            <pre className="whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 font-mono text-[10px] text-foreground">{css}</pre>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-1"><p className="text-[10px] font-medium text-foreground">Tailwind</p><button onClick={() => copy(tailwind)} className="text-[10px] text-primary">Copy</button></div>
            <pre className="whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 font-mono text-[10px] text-foreground">{tailwind}</pre>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-64 rounded-2xl border border-border" style={{ background: type === "linear" ? `linear-gradient(${angle}deg, ${colors.join(", ")})` : `radial-gradient(circle, ${colors.join(", ")})` }} />
          <div>
            <p className="mb-2 text-xs font-medium text-foreground">Presets</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => setColors(p.colors)} className="group relative h-12 overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/40">
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.colors.join(", ")})` }} />
                  <span className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[8px] text-white opacity-0 group-hover:opacity-100">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
