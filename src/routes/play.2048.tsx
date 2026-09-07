import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/2048")({ component: Game2048 });

const N = 4;
const BEST_KEY = "2048-best";
type Grid = number[];

const TILE_STYLES: Record<number, string> = {
  2: "bg-[#2a3441] text-foreground",
  4: "bg-[#334155] text-foreground",
  8: "bg-[#0e7490] text-white",
  16: "bg-[#0891b2] text-white",
  32: "bg-[#14b8a6] text-white",
  64: "bg-[#10b981] text-white",
  128: "bg-[#f59e0b] text-white",
  256: "bg-[#f97316] text-white",
  512: "bg-[#ef4444] text-white",
  1024: "bg-[#e11d48] text-white",
  2048: "bg-[#a855f7] text-white",
};

function emptyGrid(): Grid {
  const g: Grid = Array(N * N).fill(0);
  return addTile(addTile(g));
}

function addTile(g: Grid): Grid {
  const empty = g.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
  if (empty.length === 0) return g;
  const idx = empty[Math.floor(Math.random() * empty.length)]!;
  const next = [...g];
  next[idx] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

/** collapse a single row to the left, merging once per tile */
function slide(row: number[]): { row: number[]; gained: number } {
  const tiles = row.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i! + 1]) {
      const merged = tiles[i]! * 2;
      out.push(merged);
      gained += merged;
      i++;
    } else out.push(tiles[i]!);
  }
  while (out.length < N) out.push(0);
  return { row: out, gained };
}

function rowsOf(g: Grid): number[][] {
  return Array.from({ length: N }, (_, r) => g.slice(r * N, r * N + N));
}
function flatRows(rows: number[][]): Grid {
  return rows.flat();
}
const reverseRows = (rows: number[][]) => rows.map((r) => [...r].reverse());
const transpose = (rows: number[][]) => rows[0]!.map((_, c) => rows.map((r) => r[c]!));

function move(g: Grid, dir: "left" | "right" | "up" | "down"): { grid: Grid; gained: number; moved: boolean } {
  let rows = rowsOf(g);
  // every direction is reduced to "slide each row left":
  // right flips rows, up transposes columns, down transposes + flips
  const useCols = dir === "up" || dir === "down";
  let flip = dir === "right" || dir === "down";
  if (useCols) rows = transpose(rows);
  if (flip) rows = reverseRows(rows);
  let gained = 0;
  rows = rows.map((r) => {
    const res = slide(r);
    gained += res.gained;
    return res.row;
  });
  if (flip) rows = reverseRows(rows);
  if (useCols) rows = transpose(rows);
  const grid = flatRows(rows);
  return { grid, gained, moved: grid.some((v, i) => v !== g[i]) };
}

function canMove(g: Grid): boolean {
  return (["left", "right", "up", "down"] as const).some((d) => move(g, d).moved);
}

function Game2048() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(BEST_KEY)) || 0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wonDismissed, setWonDismissed] = useState(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const doMove = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      if (over) return;
      const res = move(grid, dir);
      if (!res.moved) return;
      const next = addTile(res.grid);
      const ns = score + res.gained;
      setGrid(next);
      setScore(ns);
      setBest((b) => {
        const nb = Math.max(b, ns);
        localStorage.setItem(BEST_KEY, String(nb));
        return nb;
      });
      if (next.includes(2048) && !won) setWon(true);
      else if (!canMove(next)) setOver(true);
    },
    [grid, score, over, won],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      doMove(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]!;
      touchRef.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchRef.current;
      if (!start) return;
      const t = e.changedTouches[0]!;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      touchRef.current = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [doMove]);

  function reset() {
    setGrid(emptyGrid());
    setScore(0);
    setOver(false);
    setWon(false);
    setWonDismissed(false);
  }

  return (
    <AppShell title="2048">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 2048</h1>
        <p className="mt-1 text-sm text-muted-foreground">Swipe or use arrow keys. Merge equal tiles - reach 2048!</p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 rounded-xl border border-border bg-surface px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
            <p className="text-[18px] font-black text-foreground">{score}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</p>
            <p className="text-[18px] font-black text-primary">{Math.max(best, score)}</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[400px] rounded-xl border border-border bg-surface p-2">
          <div className="grid grid-cols-4 gap-2">
            {grid.map((v, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-lg font-black ${
                  v === 0 ? "bg-[#0a0d12]" : (TILE_STYLES[v] ?? "bg-[#7c3aed] text-white")
                } ${v > 999 ? "text-[16px]" : v > 99 ? "text-[20px]" : "text-[24px]"}`}
              >
                {v || ""}
              </div>
            ))}
          </div>
          {(over || (won && !wonDismissed)) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 text-center">
              <p className="text-[22px] font-black text-foreground">{won && !over ? "🎉 You made 2048!" : "Game over"}</p>
              <p className="text-[13px] text-muted-foreground">Score: {score}</p>
              {won && !over ? (
                <div className="flex gap-2">
                  <button onClick={() => setWonDismissed(true)} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Keep going
                  </button>
                  <button onClick={reset} className="rounded-xl border border-border bg-surface-elevated px-5 py-2.5 text-[13px] font-bold text-foreground hover:bg-primary/10">
                    New game
                  </button>
                </div>
              ) : (
                <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                  New game
                </button>
              )}
            </div>
          )}
        </div>

        <button onClick={reset} className="mx-auto flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-medium text-foreground hover:bg-primary/10">
          <RotateCcw className="size-3.5" /> New game
        </button>
      </div>
    </AppShell>
  );
}
