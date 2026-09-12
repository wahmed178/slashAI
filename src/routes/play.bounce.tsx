import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/bounce")({ component: Bounce });

function Bounce() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [x, setX] = useState(50); // percent across the bar
  const [dir, setDir] = useState(1);
  const [speed, setSpeed] = useState(0.9);
  const [zone, setZone] = useState({ start: 42, width: 16 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.bounce.best") ?? 0));
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    if (state !== "playing") return;
    const tick = (t: number) => {
      raf.current = requestAnimationFrame(tick);
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 16.7;
      last.current = t;
      setX((prev) => {
        let nx = prev + dir * speed * dt;
        if (nx >= 100) { nx = 100; setDir(-1); }
        if (nx <= 0) { nx = 0; setDir(1); }
        return nx;
      });
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [state, dir, speed]);

  const start = () => {
    setScore(0);
    setSpeed(0.9);
    setZone({ start: 42, width: 16 });
    setX(0);
    setDir(1);
    setState("playing");
  };

  const drop = () => {
    const hit = x >= zone.start && x <= zone.start + zone.width;
    if (!hit) {
      setState("over");
      if (score > best) {
        setBest(score);
        localStorage.setItem("slashai.bounce.best", String(score));
      }
      return;
    }
    // perfect centre = bonus
    const centre = zone.start + zone.width / 2;
    const perfect = Math.abs(x - centre) < zone.width * 0.15;
    setScore((s) => s + (perfect ? 2 : 1));
    // zone shrinks, speed rises
    setZone((z) => {
      const nw = Math.max(4, z.width * 0.9);
      let ns = Math.random() * (95 - nw);
      return { start: ns, width: nw };
    });
    setSpeed((s) => Math.min(3.2, s + 0.12));
  };

  return (
    <AppShell title="Bounce">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏀 Bounce</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stop the ball inside the zone. Every hit shrinks the zone and speeds the ball.</p>
      </header>
      <div className="mx-auto max-w-md space-y-6">
        {state === "idle" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-5xl">🏀</p>
              <p className="mt-3 text-sm text-muted-foreground">One tap. Perfect timing. How long can you keep the streak alive?</p>
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">▶ Start</button>
          </div>
        )}
        {state !== "idle" && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">Streak <b className="text-foreground">{score}</b></span>
              <span className="text-muted-foreground">Best <b className="text-foreground">{best}</b></span>
            </div>
            <div className="relative h-16 overflow-hidden rounded-2xl border border-border bg-surface">
              <div
                className="absolute inset-y-3 rounded-xl bg-primary/25 ring-1 ring-primary/60"
                style={{ left: `${zone.start}%`, width: `${zone.width}%` }}
              />
              <div
                className="absolute inset-y-3 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(88,166,255,0.7)]"
                style={{ left: `calc(${x}% - 4px)` }}
              />
            </div>
            {state === "playing" && (
              <button onClick={drop} className="h-14 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground transition-transform active:scale-95">
                DROP
              </button>
            )}
            {state === "over" && (
              <div className="space-y-4 text-center">
                <div className="rounded-2xl border border-border bg-surface p-8">
                  <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Streak ended</p>
                  <p className="mt-2 text-5xl font-black text-foreground">{score}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{score >= 20 ? "Frame-perfect 🖱️🏆" : score >= 10 ? "Sharp reflexes ⚡" : "The zone is tiny, we know 😅"}</p>
                </div>
                <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Play again</button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
