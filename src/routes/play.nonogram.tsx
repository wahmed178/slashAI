import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/nonogram")({ component: Nonogram });

/**
 * Nonogram (Picross) — every puzzle is a hand-drawn 10×10 picture. The numbers
 * above and beside the grid describe the runs of filled squares in each row and
 * column, exactly like the printed puzzles. Left click fills, right click marks
 * a square as empty.
 */

const SIZE = 10;

/** '#' is filled, '.' is empty — each row is 10 characters */
const PICTURES: { name: string; rows: string[] }[] = [
  { name: "Heart", rows: ["...####...", ".########.", "##########", "##########", "##########", ".########.", "..######..", "...####...", "....##....", ".........."] },
  { name: "House", rows: ["....##....", "...####...", "..######..", ".########.", "##########", "#........#", "#..####..#", "#..#..#..#", "#..#..#..#", "##########"] },
  { name: "Tree", rows: ["....##....", "...####...", "..######..", ".########.", "..######..", ".########.", "##########", "...####...", "...####...", "..######.."] },
  { name: "Cat", rows: ["##......##", "####..####", "##########", "#..####..#", "##########", "#.#....#.#", "##########", ".########.", "..######..", ".........."] },
  { name: "Arrow", rows: ["....##....", "...###....", "..####....", ".#####....", "##########", "##########", ".#####....", "..####....", "...###....", "....##...."] },
  { name: "Star", rows: ["....##....", "....##....", "..######..", "##########", ".########.", "..######..", "..##..##..", ".##....##.", "..........", ".........."] },
  { name: "Fish", rows: ["..........", "...####...", ".########.", "##########", "#.########", "##########", ".########.", "...####...", "..........", ".........."] },
  { name: "Key", rows: ["..####....", ".##..##...", ".##..##...", "..####....", "...#......", "...#......", "...#..#...", "...#......", "...#..#...", "...#......"] },
  { name: "Umbrella", rows: ["...####...", ".########.", "##########", "##########", "....##....", "....##....", "....##....", "....##....", "..###.....", ".........."] },
  { name: "Boat", rows: ["..........", "....##....", "....##....", "....##....", "..######..", ".########.", "##########", "##########", ".########.", ".........."] },
  { name: "Rocket", rows: ["....##....", "...####...", "...####...", "...####...", "...####...", "..######..", ".########.", "##.####.##", "...####...", "....##...."] },
];

type Cell = 0 | 1 | 2; // empty · filled · marked-empty

function runs(line: boolean[]): number[] {
  const out: number[] = [];
  let count = 0;
  for (const v of line) {
    if (v) count++;
    else if (count) {
      out.push(count);
      count = 0;
    }
  }
  if (count) out.push(count);
  return out.length ? out : [0];
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
};

function Nonogram() {
  const [order, setOrder] = useState(() => shuffle(PICTURES.map((_, i) => i)));
  const [pick, setPick] = useState(0);
  const [grid, setGrid] = useState<Cell[]>(() => Array(SIZE * SIZE).fill(0));
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai.nonogram.solved") ?? "[]");
    } catch {
      return [];
    }
  });
  const timer = useRef<number | null>(null);

  const picture = PICTURES[order[pick % order.length]!]!;
  const target = useMemo(
    () => picture.rows.join("").split("").map((c) => c === "#"),
    [picture],
  );

  const rowClues = useMemo(() => {
    const out: number[][] = [];
    for (let r = 0; r < SIZE; r++) out.push(runs(target.slice(r * SIZE, r * SIZE + SIZE)));
    return out;
  }, [target]);

  const colClues = useMemo(() => {
    const out: number[][] = [];
    for (let c = 0; c < SIZE; c++) out.push(runs(Array.from({ length: SIZE }, (_, r) => target[r * SIZE + c]!)));
    return out;
  }, [target]);

  const reset = useCallback((nextPick: number) => {
    setPick(nextPick);
    setGrid(Array(SIZE * SIZE).fill(0));
    setWon(false);
    setSeconds(0);
    setMistakes(0);
  }, []);

  useEffect(() => {
    if (won) return;
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [won]);

  const newPuzzle = useCallback(() => {
    const next = pick + 1;
    if (next >= order.length) setOrder(shuffle(PICTURES.map((_, i) => i)));
    reset(next);
  }, [pick, order.length, reset]);

  const toggle = (i: number, mark: boolean) => {
    if (won) return;
    setGrid((prev) => {
      const next = [...prev];
      const current = next[i]!;
      const value: Cell = mark ? (current === 2 ? 0 : 2) : current === 1 ? 0 : 1;
      next[i] = value;
      if (!mark && value === 1 && !target[i]) setMistakes((m) => m + 1);
      const complete = next.every((v, idx) => (v === 1) === target[idx]);
      if (complete) {
        setWon(true);
        setSolved((s) => {
          if (s.includes(order[pick % order.length]!)) return s;
          const ns = [...s, order[pick % order.length]!];
          localStorage.setItem("slashai.nonogram.solved", JSON.stringify(ns));
          return ns;
        });
      }
      return next;
    });
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title="Nonogram">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖼️ Nonogram</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the run-length clues to reveal a hidden picture. Click to fill, right-click to mark a square as empty.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[16px] font-black text-foreground tabular-nums">{fmt(seconds)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mistakes</p>
            <p className="text-[16px] font-black text-red-400">{mistakes}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Solved</p>
            <p className="text-[16px] font-black text-primary">
              {solved.length}/{PICTURES.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Picture</p>
            <p className="text-[13px] font-black text-foreground">{won ? picture.name : "???"}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface p-3">
          <div className="mx-auto" style={{ width: "max-content" }}>
            {/* column clues */}
            <div className="flex">
              <span style={{ width: 72 }} />
              {colClues.map((clue, c) => (
                <span
                  key={c}
                  className="flex flex-col items-center justify-end text-[10px] font-bold text-muted-foreground"
                  style={{ width: 26, height: 66 }}
                >
                  {clue.map((n, i) => (
                    <span key={i} className="leading-[13px]">
                      {n}
                    </span>
                  ))}
                </span>
              ))}
            </div>

            {rowClues.map((clue, r) => (
              <div key={r} className="flex items-center">
                <span className="flex items-center justify-end gap-1 pr-2 text-[10px] font-bold text-muted-foreground" style={{ width: 72 }}>
                  {clue.map((n, i) => (
                    <span key={i}>{n}</span>
                  ))}
                </span>
                {Array.from({ length: SIZE }, (_, c) => {
                  const i = r * SIZE + c;
                  const v = grid[i]!;
                  return (
                    <button
                      key={c}
                      onClick={() => toggle(i, false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggle(i, true);
                      }}
                      className={`grid place-items-center border text-[11px] transition-colors ${
                        v === 1
                          ? "border-black/30 bg-[#2dd4bf]"
                          : v === 2
                            ? "border-border bg-surface text-muted-foreground"
                            : "border-border bg-background hover:bg-primary/10"
                      }`}
                      style={{
                        width: 26,
                        height: 26,
                        borderRightWidth: c % 5 === 4 ? 2 : 1,
                        borderBottomWidth: r % 5 === 4 ? 2 : 1,
                        borderRightColor: c % 5 === 4 ? "rgba(226,232,240,0.4)" : undefined,
                        borderBottomColor: r % 5 === 4 ? "rgba(226,232,240,0.4)" : undefined,
                      }}
                      aria-label={`Row ${r + 1} column ${c + 1}`}
                    >
                      {v === 2 ? "✕" : ""}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {won && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <p className="text-[15px] font-bold text-emerald-400">🎉 It was a {picture.name.toLowerCase()}!</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Solved in {fmt(seconds)} with {mistakes} mistake{mistakes === 1 ? "" : "s"}.
            </p>
          </div>
        )}

        <div className="flex justify-center gap-2">
          <button onClick={newPuzzle} className="rounded-lg bg-primary px-5 py-2 text-[12.5px] font-bold text-background">
            Next picture →
          </button>
          <button
            onClick={() => reset(pick)}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Clear grid
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Eleven hand-drawn pictures. Right-click (or long-press) marks a square you know is empty.
        </p>
      </div>
    </AppShell>
  );
}
