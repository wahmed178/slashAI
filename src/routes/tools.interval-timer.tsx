import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/interval-timer")({ component: IntervalTimer });

type Phase = { name: "Work" | "Rest"; seconds: number };

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* audio not available */
  }
}

function IntervalTimer() {
  const [work, setWork] = useState(30);
  const [rest, setRest] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [left, setLeft] = useState(30);
  const timer = useRef<number | null>(null);

  const phases: Phase[] = [
    { name: "Work", seconds: work },
    { name: "Rest", seconds: rest },
  ];

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setLeft((prev) => {
        if (prev > 1) return prev - 1;
        beep();
        // move to next phase / round
        setPhaseIdx((pi) => {
          const next = (pi + 1) % 2;
          if (next === 0) {
            setRound((r) => {
              if (r + 1 > rounds) {
                setRunning(false);
                return r;
              }
              return r + 1;
            });
          }
          return next;
        });
        return phases[(phaseIdx + 1) % 2]!.seconds;
      });
    }, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running, phaseIdx, work, rest, rounds]);

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setRound(1);
    setLeft(work);
  };

  const phase = phases[phaseIdx]!;
  const progress = left / Math.max(1, phase.seconds);
  const done = round > rounds;

  return (
    <AppShell title="Interval Timer">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔔 Interval Timer</h1>
        <p className="mt-1 text-sm text-muted-foreground">HIIT work/rest intervals with beeps - Tabata ready.</p>
      </header>
      <div className="mx-auto max-w-md space-y-5">
        {!running && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Work (s)", value: work, set: setWork, max: 300 },
              { label: "Rest (s)", value: rest, set: setRest, max: 120 },
              { label: "Rounds", value: rounds, set: setRounds, max: 30 },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => f.set(Math.max(1, f.value - 5))} className="size-7 rounded border border-border text-sm">−</button>
                  <span className="w-8 font-bold text-foreground">{f.value}</span>
                  <button onClick={() => f.set(Math.min(f.max, f.value + 5))} className="size-7 rounded border border-border text-sm">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`relative overflow-hidden rounded-2xl border p-6 text-center transition-colors ${phase.name === "Work" ? "border-primary/40 bg-primary/5" : "border-border bg-surface"}`}>
          {done ? (
            <>
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Complete</p>
              <p className="mt-2 text-4xl">🎉</p>
              <p className="mt-2 text-lg font-bold text-foreground">{rounds} rounds done!</p>
            </>
          ) : (
            <>
              <p className="text-[13px] font-semibold uppercase tracking-widest" style={{ color: phase.name === "Work" ? "var(--primary)" : "var(--muted-foreground)" }}>
                {phase.name} · Round {round}/{rounds}
              </p>
              <p className="mt-1 text-6xl font-black tabular-nums text-foreground">{left}</p>
              <div className="mx-auto mt-4 h-2 w-full max-w-[240px] overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => (done ? reset() : setRunning((r) => !r))}
            className="h-12 flex-1 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            {done ? "↻ Restart" : running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={reset} className="h-12 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            Reset
          </button>
        </div>
      </div>
    </AppShell>
  );
}
