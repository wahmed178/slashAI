import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Plus, Trash2, Play, Pause, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tools/multi-timer")({
  head: () => ({ meta: [{ title: "Multi Timer — SlashAI" }] }),
  component: MultiTimer,
});

type Timer = {
  id: string;
  label: string;
  total: number; // seconds
  remaining: number;
  running: boolean;
};

function MultiTimer() {
  const [timers, setTimers] = useState<Timer[]>(() => {
    try { return JSON.parse(localStorage.getItem("multi_timers") || "[]"); } catch { return []; }
  });
  const [newLabel, setNewLabel] = useState("");
  const [newMinutes, setNewMinutes] = useState(5);
  const intervalsRef = useRef<Record<string, number>>({});

  const saveTimers = useCallback((next: Timer[]) => {
    setTimers(next);
    try { localStorage.setItem("multi_timers", JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    return () => { Object.values(intervalsRef.current).forEach(clearInterval); };
  }, []);

  const addTimer = () => {
    const timer: Timer = {
      id: crypto.randomUUID(),
      label: newLabel || `Timer ${timers.length + 1}`,
      total: newMinutes * 60,
      remaining: newMinutes * 60,
      running: false,
    };
    saveTimers([...timers, timer]);
    setNewLabel("");
  };

  const removeTimer = (id: string) => {
    if (intervalsRef.current[id]) { clearInterval(intervalsRef.current[id]); delete intervalsRef.current[id]; }
    saveTimers(timers.filter((t) => t.id !== id));
  };

  const toggleTimer = (id: string) => {
    setTimers((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      if (t.running) {
        // Pause
        clearInterval(intervalsRef.current[id]);
        delete intervalsRef.current[id];
        return { ...t, running: false };
      }
      // Start
      const interval = window.setInterval(() => {
        setTimers((current) => {
          const next = current.map((ct) => {
            if (ct.id !== id || !ct.running) return ct;
            if (ct.remaining <= 1) {
              clearInterval(intervalsRef.current[id]);
              delete intervalsRef.current[id];
              // Notify
              try { new Notification(`${ct.label} done!`); } catch { /* ignore */ }
              try {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                osc.type = "sine";
                osc.frequency.value = 523;
                osc.connect(ctx.destination);
                osc.start();
                setTimeout(() => { osc.stop(); ctx.close(); }, 500);
              } catch { /* ignore */ }
              return { ...ct, remaining: 0, running: false };
            }
            return { ...ct, remaining: ct.remaining - 1 };
          });
          return next;
        });
      }, 1000);
      intervalsRef.current[id] = interval;
      return { ...t, running: true };
    }));
  };

  const resetTimer = (id: string) => {
    if (intervalsRef.current[id]) { clearInterval(intervalsRef.current[id]); delete intervalsRef.current[id]; }
    setTimers((prev) => prev.map((t) => t.id === id ? { ...t, remaining: t.total, running: false } : t));
  };

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <AppShell title="Multi Timer">
      <div className="mx-auto max-w-2xl space-y-5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Multi Timer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Run multiple timers simultaneously — browser notifications when done.</p>
        </div>

        {/* Add timer */}
        <div className="flex items-center gap-2">
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTimer()} placeholder="Label (e.g., Pasta)" className="h-10 flex-1 rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          <div className="flex items-center gap-1">
            <input type="number" min={1} max={999} value={newMinutes} onChange={(e) => setNewMinutes(parseInt(e.target.value) || 1)} className="h-10 w-16 rounded-lg border border-border bg-surface px-2 text-center text-sm text-foreground focus:outline-none" />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
          <button onClick={addTimer} className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90"><Plus className="size-4" /> Add</button>
        </div>

        {/* Timer list */}
        <div className="space-y-2">
          {timers.map((t) => {
            const pct = t.total > 0 ? ((t.total - t.remaining) / t.total) * 100 : 0;
            const isDone = t.remaining === 0;
            return (
              <div key={t.id} className={`rounded-[10px] border bg-surface p-4 transition-all ${isDone ? "border-green/40 bg-green/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTimer(t.id)} className={`flex size-10 items-center justify-center rounded-full transition-all ${t.running ? "bg-yellow/10 text-yellow" : "bg-primary/10 text-primary"}`}>
                      {t.running ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className={`font-mono text-2xl font-bold ${isDone ? "text-green" : "text-foreground"}`}>
                        {format(t.remaining)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => resetTimer(t.id)} className="text-muted-foreground hover:text-foreground"><RotateCcw className="size-4" /></button>
                    <button onClick={() => removeTimer(t.id)} className="text-muted-foreground hover:text-red"><Trash2 className="size-4" /></button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isDone ? "bg-green" : t.running ? "bg-primary" : "bg-muted-foreground/30"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {timers.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No timers yet. Add one above.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
