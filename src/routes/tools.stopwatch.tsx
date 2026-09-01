import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/stopwatch")({ component: Stopwatch });

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTime((t) => t + 10), 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cent).padStart(2, "0")}`;
  };

  const lap = () => { setLaps((p) => [time, ...p]); };
  const reset = () => { setTime(0); setLaps([]); setRunning(false); };

  return (
    <AppShell title="Stopwatch">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏱️ Stopwatch</h1>
        <p className="mt-1 text-sm text-muted-foreground">Precision stopwatch with lap times.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="text-center py-8">
          <p className="text-5xl font-mono font-bold text-foreground">{formatTime(time)}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setRunning(!running)} className={`w-24 rounded-xl py-3 text-sm font-semibold ${running ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-primary text-background"}`}>{running ? "Pause" : "Start"}</button>
          {running && <button onClick={lap} className="w-24 rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground">Lap</button>}
          {!running && time > 0 && <button onClick={reset} className="w-24 rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground">Reset</button>}
        </div>
        {laps.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            {laps.map((l, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">Lap {laps.length - i}</span>
                <span className="font-mono text-foreground">{formatTime(l)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
