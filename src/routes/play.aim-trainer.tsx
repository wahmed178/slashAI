import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/aim-trainer")({ component: AimTrainer });

const TARGETS = 30;
const BEST_KEY = "aim-trainer-best";

interface Dot {
  id: number;
  x: number; // percentage 0-100
  y: number;
  size: number;
}

function randomDot(id: number): Dot {
  return {
    id,
    x: 8 + Math.random() * 84,
    y: 8 + Math.random() * 84,
    size: 44 + Math.random() * 26,
  };
}

function AimTrainer() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [dot, setDot] = useState<Dot>(() => randomDot(0));
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(() => {
    const v = localStorage.getItem(BEST_KEY);
    return v ? Number(v) : null;
  });
  const startRef = useRef(0);
  const idRef = useRef(1);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setElapsed((Date.now() - startRef.current) / 1000), 50);
    return () => clearInterval(t);
  }, [phase]);

  const begin = () => {
    setHits(0);
    setMisses(0);
    setElapsed(0);
    startRef.current = Date.now();
    setDot(randomDot(idRef.current++));
    setPhase("playing");
  };

  const hit = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (phase !== "playing") return;
    const h = hits + 1;
    setHits(h);
    if (h >= TARGETS) {
      const total = (Date.now() - startRef.current) / 1000;
      setElapsed(total);
      setPhase("done");
      if (best === null || total < best) {
        setBest(total);
        localStorage.setItem(BEST_KEY, String(total));
      }
    } else {
      setDot(randomDot(idRef.current++));
    }
  };

  const miss = useCallback(() => {
    if (phase === "playing") setMisses((m) => m + 1);
  }, [phase]);

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  const reset = () => {
    setPhase("idle");
    setHits(0);
    setMisses(0);
    setElapsed(0);
  };

  return (
    <AppShell title="Aim Trainer">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎯 Aim Trainer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pop {TARGETS} targets as fast as you can. Clicks off-target count as misses.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Hits: <b className="text-foreground tabular-nums">{hits}</b>/{TARGETS}</span>
          <span>Misses: <b className="text-foreground tabular-nums">{misses}</b></span>
          <span>Accuracy: <b className="text-foreground tabular-nums">{accuracy}%</b></span>
          <span>Time: <b className="text-foreground tabular-nums">{elapsed.toFixed(1)}s</b></span>
        </div>

        <div
          className="relative h-80 overflow-hidden rounded-2xl border border-border bg-surface sm:h-96"
          onPointerDown={miss}
        >
          {phase === "idle" && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Ready when you are.</p>
                <button
                  onClick={(e) => { e.stopPropagation(); begin(); }}
                  className="mt-3 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {phase === "playing" && (
            <button
              key={dot.id}
              onPointerDown={hit}
              className="absolute rounded-full bg-primary/90 shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-90"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: dot.size,
                height: dot.size,
                transform: "translate(-50%, -50%)",
              }}
              aria-label="Target"
            />
          )}

          {phase === "done" && (
            <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums text-primary">{elapsed.toFixed(2)}s</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {elapsed / TARGETS < 0.5 ? "Reflexes of a caffeinated cat." : elapsed / TARGETS < 0.75 ? "Sharp shooting." : "Warm-up complete."}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(elapsed / TARGETS).toFixed(2)}s per target · {accuracy}% accuracy
                </p>
                {best !== null && best <= elapsed && (
                  <p className="mt-1 text-xs font-bold text-primary">New personal best!</p>
                )}
                {best !== null && best > elapsed && (
                  <p className="mt-1 text-xs text-muted-foreground">Best: <span className="tabular-nums">{best.toFixed(2)}s</span></p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); begin(); }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <RotateCcw className="size-3.5" /> Go again
                </button>
              </div>
            </div>
          )}
        </div>

        {best !== null && (
          <p className="text-center text-[11px] text-muted-foreground">
            Personal best: <b className="text-primary tabular-nums">{best.toFixed(2)}s</b> for {TARGETS} targets
          </p>
        )}
      </div>
    </AppShell>
  );
}
