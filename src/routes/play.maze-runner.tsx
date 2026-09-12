import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/maze-runner")({ component: MazeRunner });

type Cell = { walls: { n: boolean; e: boolean; s: boolean; w: boolean }; seen: boolean };
type Maze = Cell[][];

function generateMaze(size: number): Maze {
  const grid: Maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ walls: { n: true, e: true, s: true, w: true }, seen: false })),
  );
  const stack: [number, number][] = [[0, 0]];
  grid[0]![0]!.seen = true;
  const dirs: [number, number, keyof Cell["walls"], keyof Cell["walls"]][] = [
    [-1, 0, "n", "s"],
    [0, 1, "e", "w"],
    [1, 0, "s", "n"],
    [0, -1, "w", "e"],
  ];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]!;
    const options = dirs
      .map(([dx, dy, wall, opp]) => ({ nx: x + dx, ny: y + dy, wall, opp }))
      .filter(({ nx, ny }) => nx >= 0 && ny >= 0 && nx < size && ny < size && !grid[ny]![nx]!.seen);
    if (!options.length) {
      stack.pop();
      continue;
    }
    const pick = options[Math.floor(Math.random() * options.length)]!;
    grid[y]![x]!.walls[pick.wall] = false;
    grid[pick.ny]![pick.nx]!.walls[pick.opp] = false;
    grid[pick.ny]![pick.nx]!.seen = true;
    stack.push([pick.nx, pick.ny]);
  }
  return grid;
}

const SIZES = { Easy: 8, Medium: 12, Hard: 16 } as const;
type Level = keyof typeof SIZES;

function MazeRunner() {
  const [level, setLevel] = useState<Level>("Medium");
  const [maze, setMaze] = useState<Maze>(() => generateMaze(SIZES.Medium));
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const size = SIZES[level];

  const reset = useCallback((lv: Level = level) => {
    setMaze(generateMaze(SIZES[lv]));
    setPos([0, 0]);
    setWon(false);
    setMoves(0);
  }, [level]);

  const move = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      setPos(([x, y]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) return [x, y];
        const wall = dy === -1 ? "n" : dx === 1 ? "e" : dy === 1 ? "s" : "w";
        if (maze[y]![x]!.walls[wall]) return [x, y];
        setMoves((m) => m + 1);
        if (nx === size - 1 && ny === size - 1) setWon(true);
        return [nx, ny];
      });
    },
    [maze, size, won],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        move(dir[0]!, dir[1]!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const cellPx = useMemo(() => Math.max(16, Math.floor(320 / size)), [size]);

  return (
    <AppShell title="Maze Runner">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌀 Maze Runner</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every maze is freshly generated. Reach the green corner.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex gap-2">
          {(Object.keys(SIZES) as Level[]).map((lv) => (
            <button
              key={lv}
              onClick={() => { setLevel(lv); reset(lv); }}
              className={`h-9 flex-1 rounded-lg text-[12px] font-semibold ${level === lv ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground"}`}
            >
              {lv} {SIZES[lv]}×{SIZES[lv]}
            </button>
          ))}
          <button onClick={() => reset()} className="h-9 rounded-lg border border-border bg-surface px-3 text-[12px] font-semibold">↻ New</button>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-3">
          <div
            className="relative mx-auto"
            style={{ width: size * cellPx, height: size * cellPx }}
          >
            {/* walls */}
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${x},${y}`} className="absolute" style={{ left: x * cellPx, top: y * cellPx, width: cellPx, height: cellPx }}>
                  {cell.walls.n && <span className="absolute left-0 top-0 h-px w-full bg-border" />}
                  {cell.walls.w && <span className="absolute left-0 top-0 h-full w-px bg-border" />}
                  {cell.walls.e && x === size - 1 && <span className="absolute right-0 top-0 h-full w-px bg-border" />}
                  {cell.walls.s && y === size - 1 && <span className="absolute bottom-0 left-0 h-px w-full bg-border" />}
                </div>
              )),
            )}
            {/* goal */}
            <span
              className="absolute grid place-items-center rounded-sm bg-emerald-500/20 text-[10px]"
              style={{ left: (size - 1) * cellPx, top: (size - 1) * cellPx, width: cellPx, height: cellPx }}
            >
              🏁
            </span>
            {/* player */}
            <span
              className="absolute rounded-full bg-primary transition-all duration-100"
              style={{ left: pos[0] * cellPx + cellPx * 0.22, top: pos[1] * cellPx + cellPx * 0.22, width: cellPx * 0.56, height: cellPx * 0.56 }}
            />
          </div>
        </div>
        {won && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
            <p className="text-lg font-black text-emerald-400">Escaped! 🎉</p>
            <p className="text-[13px] text-muted-foreground">{moves} moves on {level} ({size}×{size})</p>
          </div>
        )}
        {/* touch controls */}
        <div className="mx-auto grid w-40 grid-cols-3 gap-1.5">
          <span />
          <button onClick={() => move(0, -1)} className="h-11 rounded-lg border border-border bg-surface text-lg">↑</button>
          <span />
          <button onClick={() => move(-1, 0)} className="h-11 rounded-lg border border-border bg-surface text-lg">←</button>
          <button onClick={() => move(0, 1)} className="h-11 rounded-lg border border-border bg-surface text-lg">↓</button>
          <button onClick={() => move(1, 0)} className="h-11 rounded-lg border border-border bg-surface text-lg">→</button>
        </div>
      </div>
    </AppShell>
  );
}
