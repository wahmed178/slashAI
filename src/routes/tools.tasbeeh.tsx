import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/tasbeeh")({
  component: TasbeehCounter,
});

const PRESET_DHIKR = [
  { label: "SubhanAllah", target: 33 },
  { label: "Alhamdulillah", target: 33 },
  { label: "Allahu Akbar", target: 34 },
  { label: "Astaghfirullah", target: 100 },
  { label: "La ilaha illallah", target: 100 },
  { label: "Hasbiyallahu la ilaha illa Huwa", target: 100 },
  { label: "SubhanAllahi wa bihamdihi", target: 100 },
  { label: "La hawla wa la quwwata illa billah", target: 100 },
];

function TasbeehCounter() {
  const [dhikr, setDhikr] = useState<{label: string; target: number}>(PRESET_DHIKR[0]!);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(dhikr.target);
  const [history, setHistory] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.tasbeeh") || "{}"); } catch { return {}; }
  });

  const playClick = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.05;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  const vibrate = useCallback(() => {
    try { navigator.vibrate?.(15); } catch {}
  }, []);

  const tap = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      if (next >= target) {
        // Completed!
        setHistory((h) => {
          const newH = { ...h, [dhikr.label]: (h[dhikr.label] || 0) + 1 };
          try { localStorage.setItem("slashai.tasbeeh", JSON.stringify(newH)); } catch {}
          return newH;
        });
        vibrate();
        return 0;
      }
      return next;
    });
    playClick();
    vibrate();
  }, [target, dhikr, playClick, vibrate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); tap(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tap]);

  const selectDhikr = (d: typeof PRESET_DHIKR[0]) => {
    setDhikr(d);
    setTarget(d.target);
    setCount(0);
  };

  const progress = target > 0 ? (count / target) * 100 : 0;

  return (
    <AppShell title="Tasbeeh Counter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📿 Digital Tasbeeh</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap anywhere or press Space to count. Vibration + sound on mobile.</p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        {/* Dhikr selector */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {PRESET_DHIKR.slice(0, 5).map((d) => (
            <button key={d.label} onClick={() => selectDhikr(d)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${dhikr.label === d.label ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <button onClick={tap}
          className="w-full rounded-2xl border border-border bg-surface p-8 transition-all active:scale-95 active:border-primary/50">
          <p className="text-[10px] font-medium text-muted-foreground mb-2">{dhikr.label}</p>
          <p className="text-7xl font-bold text-foreground">{count}</p>
          <p className="text-sm text-muted-foreground mt-2">/ {target}</p>
          <div className="mt-4 h-2 rounded-full bg-surface-elevated overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </button>

        {/* Target */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Target Count</p>
          <div className="flex gap-2">
            {[33, 99, 100].map((t) => (
              <button key={t} onClick={() => { setTarget(t); setCount(0); }}
                className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${target === t ? "bg-primary text-background" : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
            <input type="number" value={target} onChange={(e) => { setTarget(Number(e.target.value) || 1); setCount(0); }}
              className="w-20 h-9 rounded-lg border border-border bg-surface-elevated px-2 text-center text-xs focus:outline-none" />
          </div>
        </div>

        {/* History */}
        {Object.keys(history).length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Today's Sessions</p>
            <div className="space-y-1">
              {Object.entries(history).map(([label, total]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5">
                  <span className="text-xs text-foreground">{label}</span>
                  <span className="text-xs font-medium text-primary">{total}×</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
