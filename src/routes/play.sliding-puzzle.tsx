import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/sliding-puzzle")({ component: SlidingPuzzle });

/**
 * Sliding Puzzle — the classic 8, 15 and 24 puzzle. Tiles are shuffled by
 * making thousands of legal moves from the solved state, so every board you
 * meet is guaranteed solvable (a random shuffle is not).
 */

const SIZES = [3, 4, 5] as const;
type Size = (typeof SIZES)[number];

function solved(size: number): number[] {
  const total = size * size;
  return [...Array.from({ length: total - 1 }, (_, i) => i + 1), 0];
}

function neighbours(size: number, blank: number): number[] {
  const r = Math.floor(blank / size);
  const c = blank % size;
  const out: number[] = [];
  if (r > 0) out.push(blank - size);
  if (r < size - 1) out.push(blank + size);
  if (c > 0) out.push(blank - 1);
  if (c < size - 1) out.push(blank + 1);
  return out;
}

/** shuffle by legal moves only — the result is always solvable */
function shuffle(size: number): number[] {
  let board = solved(size);
  let blank = board.indexOf(0);
  let previous = -1;
  for (let i = 0; i < size * size * 120; i++) {
    const options = neighbours(size, blank).filter((n) => n !== previous);
    const pick = options[Math.floor(Math.random() * options.length)]!;
    const next = [...board];
    next[blank] = next[pick]!;
    next[pick] = 0;
    board = next;
    previous = blank;
    blank = pick;
  }
  return board;
}

function SlidingPuzzle() {
  const [size, setSize] = useState<Size>(4);
  const [board, setBoard] = useState<number[]>(() => shuffle(4));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const timer = useRef<number | null>(null);
  const [best, setBest] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai.slide.best") ?? "{}");
    } catch {
      return {};
    }
  });

  const newGame = useCallback((s: Size) => {
    setSize(s);
    setBoard(shuffle(s));
    setMoves(0);
    setSeconds(0);
    setWon(false);
  }, []);

  useEffect(() => {
    if (won) return;
    timer.current = window.setInterval(() => setSeconds((t) => t + 1), 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [won]);

  const move = useCallback(
    (index: number) => {
      if (won) return;
      const blank = board.indexOf(0);
      if (!neighbours(size, blank).includes(index)) return;
      const next = [...board];
      next[blank] = next[index]!;
      next[index] = 0;
      setBoard(next);
      setMoves((m) => m + 1);
      const target = solved(size);
      if (next.every((v, i) => v === target[i])) {
        setWon(true);
        const total = moves + 1;
        setBest((b) => {
          const key = String(size);
          const prev = b[key];
          if (prev !== undefined && prev <= total) return b;
          const nb = { ...b, [key]: total };
          localStorage.setItem("slashai.slide.best", JSON.stringify(nb));
          return nb;
        });
      }
    },
    [board, size, won, moves],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      const blank = board.indexOf(0);
      const r = Math.floor(blank / size);
      const c = blank % size;
      // pressing an arrow slides the tile from that side into the gap
      const map: Record<string, number | null> = {
        ArrowUp: r < size - 1 ? blank + size : null,
        ArrowDown: r > 0 ? blank - size : null,
        ArrowLeft: c < size - 1 ? blank + 1 : null,
        ArrowRight: c > 0 ? blank - 1 : null,
      };
      const target = map[e.key];
      if (target === null || target === undefined) return;
      e.preventDefault();
      move(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, size, won, move]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const solvedCount = board.filter((v, i) => v !== 0 && v === i + 1).length;

  return (
    <AppShell title="Sliding Puzzle">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 Sliding Puzzle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Slide the tiles back into order. Shuffles are made from legal moves only, so every board is solvable.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Moves</p>
            <p className="text-[16px] font-black text-foreground">{moves}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Placed</p>
            <p className="text-[16px] font-black text-foreground">
              {solvedCount}/{size * size - 1}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[16px] font-black text-foreground tabular-nums">{fmt(seconds)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</p>
            <p className="text-[16px] font-black text-amber-400">{best[String(size)] ?? "–"}</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-border bg-surface p-3">
          <div
            className="mx-auto grid w-full max-w-[400px] gap-1.5"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {board.map((v, i) => {
              const correct = v !== 0 && v === i + 1;
              return (
                <button
                  key={i}
                  onClick={() => move(i)}
                  disabled={v === 0}
                  className={`grid aspect-square place-items-center rounded-lg text-[18px] font-black transition-all duration-100 sm:text-[22px] ${
                    v === 0
                      ? "bg-transparent"
                      : correct
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-surface-elevated text-foreground hover:bg-primary/20 active:scale-95"
                  }`}
                >
                  {v === 0 ? "" : v}
                </button>
              );
            })}
          </div>

          {won && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/80 px-6 text-center">
              <p className="text-[22px] font-black text-foreground">🎉 Solved!</p>
              <p className="text-[13px] text-muted-foreground">
                {moves} moves · {fmt(seconds)}
              </p>
              <button onClick={() => newGame(size)} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                ↻ Shuffle again
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => newGame(s)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                size === s ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}×{s}
            </button>
          ))}
          <button
            onClick={() => newGame(size)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            ↻ Shuffle
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Arrow keys slide the tile next to the gap. Green means the tile is home.
        </p>
      </div>
    </AppShell>
  );
}
