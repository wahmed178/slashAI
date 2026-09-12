import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/tap-the-difference")({ component: TapTheDifference });

const GRID = 6;
const ROUND_TIME = 20;

interface Tile {
  base: string;
  shadow: string;
  radius: number;
}

function randomTile(): Tile {
  const hues = [210, 160, 20, 280, 340, 45];
  const h = hues[Math.floor(Math.random() * hues.length)]!;
  return {
    base: `hsl(${h} 45% ${28 + Math.random() * 14}%)`,
    shadow: `hsl(${h} 50% 18%)`,
    radius: Math.floor(Math.random() * 14),
  };
}

function TapTheDifference() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState(1);
  const [oddIdx, setOddIdx] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.diff.best") ?? 0));
  const timer = useRef<number | null>(null);

  const startRound = (r: number) => {
    const t = Array.from({ length: GRID * GRID }, randomTile);
    // the odd one differs slightly in lightness; difference shrinks as rounds rise
    const odd = Math.floor(Math.random() * t.length);
    const delta = Math.max(1.5, 9 - r * 0.7);
    const m = /^hsl\((\d+) 45% ([\d.]+)%\)$/.exec(t[odd]!.base);
    if (m) {
      const l = Math.min(70, parseFloat(m[2]!) + delta);
      t[odd] = { ...t[odd]!, base: `hsl(${m[1]} 45% ${l}%)` };
    }
    setTiles(t);
    setOddIdx(odd);
  };

  const start = () => {
    setScore(0);
    setRound(1);
    setTimeLeft(ROUND_TIME);
    setState("playing");
    startRound(1);
  };

  useEffect(() => {
    if (state !== "playing") return;
    timer.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          setState("over");
          return 0;
        }
        return Math.round((t - 0.1) * 10) / 10;
      });
    }, 100);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [state]);

  useEffect(() => {
    if (state === "over" && score > best) {
      setBest(score);
      localStorage.setItem("slashai.diff.best", String(score));
    }
  }, [state]);

  const tap = (i: number) => {
    if (i !== oddIdx) {
      setTimeLeft((t) => Math.max(0.1, t - 2));
      return;
    }
    const bonus = Math.max(1, Math.round(timeLeft / 4));
    setScore((s) => s + bonus);
    const next = round + 1;
    setRound(next);
    startRound(next);
  };

  return (
    <AppShell title="Tap the Difference">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">👁️ Tap the Difference</h1>
        <p className="mt-1 text-sm text-muted-foreground">One tile is a shade off. Find it fast - wrong taps cost 2 seconds.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        {state === "idle" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-5xl">🔎</p>
              <p className="mt-3 text-sm text-muted-foreground">20 seconds, unlimited rounds. Each find scores more the faster you spot it. Wrong tiles burn the clock.</p>
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">▶ Start</button>
          </div>
        )}
        {state === "playing" && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">Round <b className="text-foreground">{round}</b> · Score <b className="text-foreground">{score}</b></span>
              <span className={timeLeft <= 5 ? "text-red-400" : "text-muted-foreground"}>⏱ {timeLeft.toFixed(1)}s</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {tiles.map((t, i) => (
                <button
                  key={i}
                  onClick={() => tap(i)}
                  className="aspect-square transition-transform duration-150 active:scale-90"
                  style={{ background: t.base, borderRadius: t.radius, boxShadow: `inset 0 -2px 0 ${t.shadow}` }}
                  aria-label={`tile ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        {state === "over" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Eagle eyes score</p>
              <p className="mt-2 text-5xl font-black text-foreground">{score}</p>
              <p className="mt-1 text-sm text-muted-foreground">{round} rounds cleared · Best: {best}</p>
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Play again</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
