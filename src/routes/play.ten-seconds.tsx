import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/ten-seconds")({ component: TenSeconds });

const TARGET = 10.0;
const BEST_KEY = "ten-seconds-best";

function TenSeconds() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(() => {
    const v = localStorage.getItem(BEST_KEY);
    return v ? Number(v) : null;
  });
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      setElapsed((Date.now() - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const begin = () => {
    startRef.current = Date.now();
    setElapsed(0);
    setPhase("running");
  };

  const stop = () => {
    if (phase !== "running") return;
    const t = (Date.now() - startRef.current) / 1000;
    setElapsed(t);
    setPhase("done");
    const diff = Math.abs(t - TARGET);
    if (best === null || diff < Math.abs(best - TARGET)) {
      setBest(t);
      localStorage.setItem(BEST_KEY, String(t));
    }
  };

  const reset = () => {
    setPhase("idle");
    setElapsed(0);
  };

  const diff = Math.abs(elapsed - TARGET);
  const verdict =
    phase === "done"
      ? diff < 0.05
        ? "INHUMAN. Are you a machine?"
        : diff < 0.15
          ? "Insane precision!"
          : diff < 0.4
            ? "Very close."
            : diff < 1
              ? "Respectable."
              : "Wildly off. Try counting in your head."
      : "";

  const barPct = Math.min(100, (elapsed / (TARGET * 1.5)) * 100);

  return (
    <AppShell title="Ten Seconds">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏱️ Ten Seconds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Press start, then stop the timer at exactly 10.00 seconds. No counting out loud.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-5xl font-bold tabular-nums text-foreground">
            {elapsed.toFixed(2)}<span className="text-2xl text-muted-foreground">s</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">target: exactly 10.00s</p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-[width] ${Math.abs(elapsed - TARGET) < 0.1 && phase === "running" ? "bg-emerald-500" : "bg-primary"}`}
              style={{ width: `${barPct}%` }}
            />
          </div>

          {phase === "idle" && (
            <button
              onClick={begin}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start
            </button>
          )}
          {phase === "running" && (
            <button
              onClick={stop}
              className="mt-5 w-full rounded-xl bg-rose-500 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              STOP!
            </button>
          )}
          {phase === "done" && (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-foreground">{verdict}</p>
              <p className="text-xs text-muted-foreground">
                You were <b className="text-primary">{diff.toFixed(2)}s</b> off. Best attempt: {best !== null && <span className="tabular-nums">{best.toFixed(2)}s</span>}
              </p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <RotateCcw className="size-3.5" /> Try again
              </button>
            </div>
          )}
        </div>

        {best !== null && (
          <p className="text-center text-[11px] text-muted-foreground">
            Your closest stop so far: <b className="text-primary tabular-nums">{best.toFixed(2)}s</b> ({Math.abs(best - TARGET).toFixed(2)}s off)
          </p>
        )}
      </div>
    </AppShell>
  );
}
