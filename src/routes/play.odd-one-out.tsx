import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/play/odd-one-out")({
  head: () => ({
    meta: [
      { title: "Odd One Out - Free Browser Game | SlashAI" },
      {
        name: "description",
        content:
          "One emoji is different from the rest — find it before the clock runs out. The grid grows and colours get closer every level. Free, no download.",
      },
    ],
  }),
  component: OddOneOut,
});

const PALETTE = ["#f87171", "#60a5fa", "#4ade80", "#fbbf24", "#a78bfa", "#fb923c", "#22d3ee", "#f472b6"];

interface Board {
  size: number;
  oddIndex: number;
  base: string;
  odd: string;
  emoji: string;
}

const EMOJIS = ["😀", "🍎", "🐸", "⭐", "🚗", "🐶", "🎈", "🌵", "🍕", "🐙"];

function makeBoard(level: number): Board {
  const size = Math.min(2 + Math.floor(level / 2), 7); // 2x2 → 7x7
  const total = size * size;
  const oddIndex = Math.floor(Math.random() * total);
  const base = PALETTE[level % PALETTE.length]!;
  // colour distance shrinks as levels climb (clamped so it stays winnable)
  const closeness = Math.min(0.72, 0.14 + level * 0.03);
  const odd = shiftHue(base, level % 2 === 0 ? closeness : -closeness);
  return { size, oddIndex, base, odd, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]! };
}

/** shift a hex colour's lightness to make a near-identical neighbour */
function shiftHue(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => {
    const target = amount > 0 ? 255 : 0;
    return Math.round(c + (target - c) * Math.abs(amount));
  };
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function OddOneOut() {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState<Board>(() => makeBoard(1));
  const [timeLeft, setTimeLeft] = useState(10);
  const [best, setBest] = useState(() => Number(localStorage.getItem("odd-one-out-best") ?? 0));
  const [over, setOver] = useState(false);
  const timerRef = useRef(0);

  const startLevel = (lvl: number) => {
    setBoard(makeBoard(lvl));
    setTimeLeft(Math.max(3.5, 10 - lvl * 0.35));
    setOver(false);
  };

  useEffect(() => {
    if (over) return;
    const started = performance.now();
    const budget = Math.max(3.5, 10 - level * 0.35) * 1000;
    const tick = () => {
      const leftMs = budget - (performance.now() - started);
      setTimeLeft(Math.max(0, leftMs / 1000));
      if (leftMs <= 0) {
        setOver(true);
        setBest((b) => {
          if (level - 1 > b) {
            localStorage.setItem("odd-one-out-best", String(level - 1));
            return level - 1;
          }
          return b;
        });
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timerRef.current);
  }, [level, over]);

  const pick = (i: number) => {
    if (over) return;
    if (i === board.oddIndex) {
      feedback("success");
      setLevel((l) => {
        const next = l + 1;
        startLevel(next);
        return next;
      });
    } else {
      // wrong tap: small time penalty instead of instant death
      setTimeLeft((t) => Math.max(0.3, t - 1.5));
      feedback("tap");
    }
  };

  const restart = () => {
    setLevel(1);
    startLevel(1);
  };

  return (
    <AppShell title="Odd One Out">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔍 Odd One Out</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One tile is a slightly different shade. Tap it before time runs out — wrong taps cost 1.5s.
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
          <span className="text-[13px] font-bold text-foreground">Level {level}</span>
          <span className="text-[13px] font-semibold text-muted-foreground">
            Best: <b className="text-primary tabular-nums">{best}</b>
          </span>
          <span className={`text-[13px] font-black tabular-nums ${timeLeft < 2.5 ? "text-rose-500" : "text-foreground"}`}>
            {timeLeft.toFixed(1)}s
          </span>
        </div>

        <div
          className="grid gap-1.5 rounded-2xl border border-border bg-surface p-3"
          style={{ gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))` }}
          role="grid"
          aria-label={`Find the different tile among ${board.size * board.size}`}
        >
          {Array.from({ length: board.size * board.size }, (_, i) => (
            <button
              key={`${level}-${i}`}
              type="button"
              onClick={() => pick(i)}
              aria-label={`Tile ${i + 1}`}
              className="ripple-press grid aspect-square place-items-center rounded-lg text-[18px] transition-transform active:scale-95 sm:text-[22px]"
              style={{ background: i === board.oddIndex ? board.odd : board.base }}
            >
              <span aria-hidden className="opacity-30">{board.emoji}</span>
            </button>
          ))}
        </div>

        {over && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-[16px] font-black text-foreground">⏱️ Time's up at level {level}!</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              You reached level {level} — best {best}. Shades get closer and clocks get shorter every
              level.
            </p>
            <button
              type="button"
              onClick={restart}
              className="ripple-press mt-3 h-10 rounded-xl bg-primary px-6 text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
