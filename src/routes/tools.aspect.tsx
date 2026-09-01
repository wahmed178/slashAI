import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/aspect")({ component: AspectRatioCalc });

const RATIOS = ["16:9", "4:3", "1:1", "9:16", "21:9", "4:5", "3:2", "5:4"];

function AspectRatioCalc() {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [ratio, setRatio] = useState("");

  const width = parseFloat(w) || 0;
  const height = parseFloat(h) || 0;
  const [rw, rh] = ratio ? ratio.split(":").map(Number) : [0, 0];

  let resultW = width, resultH = height;
  if (width && !height && rw && rh) resultH = Math.round((width * rh) / rw);
  else if (!width && height && rw && rh) resultW = Math.round((height * rw) / rh);
  else if (width && height) { const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a; const g = gcd(width, height); }

  const detectedRatio = width && height ? (() => { const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a; const g = gcd(width, height); return `${width / g}:${height / g}`; })() : "";

  return (
    <AppShell title="Aspect Ratio">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">📐 Aspect Ratio Calculator</h1><p className="mt-1 text-sm text-muted-foreground">Input any two values — get the third instantly.</p></header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Width (px)</label>
            <input type="number" value={w} onChange={e => { setW(e.target.value); setRatio(""); }} placeholder="1920"
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Height (px)</label>
            <input type="number" value={h} onChange={e => { setH(e.target.value); setRatio(""); }} placeholder="1080"
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Ratio</label>
            <input value={ratio} onChange={e => { setRatio(e.target.value); setW(""); setH(""); }} placeholder="16:9"
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none" />
          </div>
        </div>
        {(detectedRatio || ratio) && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-lg font-bold text-foreground">{detectedRatio || ratio}</p>
            {width && height && <p className="mt-1 text-xs text-muted-foreground">{width}×{height} pixels</p>}
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-medium text-foreground">Common Ratios</p>
          <div className="grid grid-cols-4 gap-1.5">
            {RATIOS.map(r => (
              <button key={r} onClick={() => { setRatio(r); if (width) { const parts = r.split(":"); const rw = Number(parts[0]); const rh = Number(parts[1]); if (rw && rh) setH(String(Math.round((width * rh) / rw))); } }}
                className="rounded-lg border border-border bg-surface px-2 py-2 text-center text-xs transition-colors hover:border-primary/40">
                <p className="font-medium text-foreground">{r}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
