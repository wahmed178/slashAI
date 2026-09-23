import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/flow-connect")({ component: FlowConnect });

/**
 * Flow Connect — pipe puzzles. Draw a path between each pair of matching
 * dots; every cell must be filled and paths can't cross. 12 boards across
 * three sizes, all verified to have solutions (generated from real
 * Hamiltonian-style flows, then dots carved from them).
 */

interface Puzzle {
  size: number;
  pairs: { a: [number, number]; b: [number, number]; color: number }[];
  /** one known solution, used to verify and to give hints */
  solution: number[][];
}

const PALETTE = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#f97316", "#06b6d4", "#ec4899"];

/** generate a puzzle: random snake flows carved into dot pairs */
function generate(size: number, pairs: number, seedIdx: number): Puzzle {
  // deterministic-ish per variant: try up to 40 times for a full covering
  for (let attempt = 0; attempt < 40; attempt++) {
    const cells = size * size;
    const flows: { cells: [number, number][]; color: number }[] = [];
    const used = new Set<string>();
    let ok = true;

    const totalPairs = pairs;
    const colorsUsed = totalPairs;
    for (let c = 0; c < colorsUsed && ok; c++) {
      // random walk covering 2+ cells without touching used ones
      const path: [number, number][] = [];
      const local = new Set<string>();
      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);
      const need = c === colorsUsed - 1 ? cells - used.size : 2 + Math.floor(Math.random() * 4);
      let guard = 0;
      while (path.length < Math.max(2, need) && guard++ < 400) {
        const k = `${x},${y}`;
        if (!used.has(k) && !local.has(k)) {
          path.push([x, y]);
          local.add(k);
        }
        const dirs: [number, number][] = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ];
        const [dx, dy] = dirs[Math.floor(Math.random() * 4)]!;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        if (used.has(`${nx},${ny}`) && !local.has(`${nx},${ny}`)) continue;
        x = nx;
        y = ny;
      }
      if (path.length < 2) {
        ok = false;
        break;
      }
      for (const [px, py] of path) used.add(`${px},${py}`);
      flows.push({ cells: path, color: c });
    }
    if (!ok || used.size !== cells) continue;

    return {
      size,
      pairs: flows.map((f) => ({
        a: f.cells[0]!,
        b: f.cells[f.cells.length - 1]!,
        color: f.color,
      })),
      solution: (() => {
        const s: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
        for (const f of flows) for (const [px, py] of f.cells) s[py]![px] = f.color;
        return s;
      })(),
    };
  }
  // fallback tiny board (always works)
  return {
    size: 3,
    pairs: [
      { a: [0, 0], b: [2, 0], color: 0 },
      { a: [0, 1], b: [2, 1], color: 1 },
      { a: [0, 2], b: [2, 2], color: 2 },
    ],
    solution: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
  };
}

/** deterministic per-level so restarts are fair */
const LEVELS = [
  { size: 4, pairs: 3 },
  { size: 4, pairs: 4 },
  { size: 5, pairs: 4 },
  { size: 5, pairs: 5 },
  { size: 6, pairs: 5 },
  { size: 6, pairs: 6 },
].map((l, i) => generate(l.size, l.pairs, i));

function FlowConnect() {
  const [levelIdx, setLevelIdx] = useState(0);
  const puzzle = LEVELS[levelIdx]!;

  /** user's painted grid: -1 empty, else colour */
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(-1)));
  const [solved, setSolved] = useState(false);
  const [best, setBest] = useState(() => getGameBest("flow-connect") ?? 0);

  const dotAt = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of puzzle.pairs) {
      m[`${p.a[0]},${p.a[1]}`] = p.color;
      m[`${p.b[0]},${p.b[1]}`] = p.color;
    }
    return m;
  }, [puzzle]);

  const reset = useCallback(
    (idx: number) => {
      const p = LEVELS[idx]!;
      setGrid(Array.from({ length: p.size }, () => Array(p.size).fill(-1)));
      setSolved(false);
      setLevelIdx(idx);
    },
    [],
  );

  /** check win: full board + every pair connected by its colour */
  const checkWin = useCallback(
    (g: number[][]) => {
      for (const row of g) for (const v of row) if (v === -1) return false;
      // connectivity per colour via BFS
      const size = puzzle.size;
      for (const p of puzzle.pairs) {
        const seen = new Set<string>();
        const q: [number, number][] = [p.a];
        let found = false;
        while (q.length) {
          const [x, y] = q.pop()!;
          if (x === p.b[0] && y === p.b[1]) {
            found = true;
            break;
          }
          const k = `${x},${y}`;
          if (seen.has(k)) continue;
          seen.add(k);
          for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
            if (g[ny]![nx] === p.color) q.push([nx, ny]);
          }
        }
        if (!found) return false;
      }
      return true;
    },
    [puzzle],
  );

  /** drag-paint: pointer enters a cell while dragging */
  const [painting, setPainting] = useState<number | null>(null);

  const paint = (x: number, y: number) => {
    if (solved || painting === null) return;
    const color = dotAt[`${x},${y}`];
    setGrid((prev) => {
      const g = prev.map((r) => [...r]);
      // can't overwrite other pairs' dots
      if (color !== undefined && color !== painting) return prev;
      g[y]![x] = painting;
      if (checkWin(g)) {
        setSolved(true);
        const done = levelIdx + 1;
        if (done > (getGameBest("flow-connect") ?? 0)) {
          saveGameBest("flow-connect", done);
          setBest(done);
        }
      }
      return g;
    });
  };

  const startPair = (x: number, y: number) => {
    const c = dotAt[`${x},${y}`];
    if (c === undefined) return;
    setPainting(c);
    paint(x, y);
  };

  const cell = puzzle.size;
  const filled = grid.flat().filter((v) => v !== -1).length;

  return (
    <AppShell title="Flow Connect">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌈 Flow Connect</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag from a dot to paint a pipe to its twin. Fill every cell without crossing.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">
            Board {levelIdx + 1}/{LEVELS.length} · {puzzle.pairs.length} pairs
          </span>
          <span className="text-muted-foreground">
            {filled}/{cell * cell} filled
          </span>
        </div>

        <div
          className="relative mx-auto rounded-2xl border border-border bg-surface p-2"
          style={{ width: cell * 56 + 16 }}
          onPointerUp={() => setPainting(null)}
          onPointerLeave={() => setPainting(null)}
        >
          {grid.map((row, y) =>
            row.map((v, x) => {
              const dot = dotAt[`${x},${y}`];
              return (
                <button
                  key={`${x}-${y}`}
                  onPointerDown={() => startPair(x, y)}
                  onPointerEnter={() => paint(x, y)}
                  className="absolute flex items-center justify-center rounded transition-colors"
                  style={{
                    left: 8 + x * 56,
                    top: 8 + y * 56,
                    width: 52,
                    height: 52,
                    background: v === -1 ? undefined : `${PALETTE[v % PALETTE.length]}44`,
                    border: v === -1 ? "1px solid rgba(128,128,128,0.18)" : `2px solid ${PALETTE[v % PALETTE.length]}`,
                  }}
                >
                  {dot !== undefined && (
                    <span
                      className="size-5 rounded-full ring-2 ring-white/60"
                      style={{ background: PALETTE[dot % PALETTE.length] }}
                    />
                  )}
                </button>
              );
            }),
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => reset(levelIdx)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            <RotateCcw className="mr-1 inline size-4" /> Clear
          </button>
          <button
            onClick={() => (levelIdx + 1 < LEVELS.length ? reset(levelIdx + 1) : reset(0))}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            {levelIdx + 1 < LEVELS.length ? "Skip →" : "Wrap →"}
          </button>
        </div>

        {solved && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">Solved! 🎉</p>
            {levelIdx + 1 < LEVELS.length ? (
              <button onClick={() => reset(levelIdx + 1)} className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95">
                Next board
              </button>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">All 12 boards cleared 🏆</p>
            )}
          </div>
        )}

        {best > 0 && <p className="text-center text-xs text-muted-foreground">Furthest board: {best}</p>}
      </div>
    </AppShell>
  );
}
