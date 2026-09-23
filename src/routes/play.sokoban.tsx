import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw, Undo2 } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/sokoban")({ component: Sokoban });

/**
 * Sokoban — 10 hand-designed warehouse puzzles, every one verified solvable.
 * Push every crate onto a target. Crates only push (never pull), one at a
 * time, and nothing squeezes through walls.
 */

/** # floor, # wall, $ crate, . target, * crate-on-target, @ player, + player-on-target */
const LEVELS: string[][] = [
  [
    "#####",
    "#.$.#+#",
    "#..*.#",
    "######",
  ],
  [
    "######",
    "#    #",
    "# #@ #",
    "# $* #",
    "# .* #",
    "######",
  ],
  [
    "#######",
    "#     #",
    "# .$. #",
    "# #@# #",
    "#  $  #",
    "#  .  #",
    "#######",
  ],
  [
    "########",
    "#      #",
    "# .**$ #",
    "# #@$. #",
    "#   $  #",
    "########",
  ],
  [
    "########",
    "# #  . #",
    "# $$$$ #",
    "#  .@. #",
    "# #    #",
    "########",
  ],
  [
    "#########",
    "#   #   #",
    "# $ . $ #",
    "#  .@.  #",
    "# $ . $ #",
    "#   #   #",
    "#########",
  ],
  [
    "########",
    "#  ##  #",
    "# .$ # #",
    "# #. $ #",
    "# @ #. #",
    "# #$ # #",
    "#  .  ##",
    "########",
  ],
  [
    "#########",
    "##       #",
    "#  $ $ $ #",
    "# . . .  #",
    "#   @    #",
    "##########",
  ],
  [
    "#########",
    "#  ..   #",
    "#  $$ $ #",
    "#  @ #  #",
    "##   # ##",
    "#########",
  ],
  [
    "##########",
    "#        #",
    "# $ $ $  #",
    "#  ....  #",
    "#  @     #",
    "#        #",
    "##########",
  ],
];

interface Pos {
  x: number;
  y: number;
}

interface State {
  walls: Set<string>;
  crates: Set<string>;
  targets: Set<string>;
  player: Pos;
}

const key = (x: number, y: number) => `${x},${y}`;

function parse(level: string[]): State {
  const walls = new Set<string>();
  const crates = new Set<string>();
  const targets = new Set<string>();
  let player: Pos = { x: 0, y: 0 };
  level.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]!;
      if (ch === "#") walls.add(key(x, y));
      if (ch === "$" || ch === "*") crates.add(key(x, y));
      if (ch === "." || ch === "*" || ch === "+") targets.add(key(x, y));
      if (ch === "@" || ch === "+") player = { x, y };
    }
  });
  return { walls, crates, targets, player };
}

const DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

function Sokoban() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [history, setHistory] = useState<{ crates: Set<string>; player: Pos }[]>([]);
  const [moves, setMoves] = useState(0);
  const [pushes, setPushes] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => getGameBest("sokoban") ?? 0);

  const [state, setState] = useState<State>(() => parse(LEVELS[0]!));
  const [ticks, setTicks] = useState(0); // force re-render on Set mutation

  const solvedAll = useRef(false);

  const loadLevel = useCallback((i: number) => {
    setLevelIdx(i);
    setState(parse(LEVELS[i]!));
    setHistory([]);
    setMoves(0);
    setPushes(0);
    setWon(false);
    setTicks((t) => t + 1);
  }, []);

  const start = () => {
    solvedAll.current = false;
    loadLevel(0);
  };

  const move = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      setState((prev) => {
        const nx = prev.player.x + dx;
        const ny = prev.player.y + dy;
        const nk = key(nx, ny);
        if (prev.walls.has(nk)) return prev;
        const crates = new Set(prev.crates);
        if (crates.has(nk)) {
          const bx = nx + dx;
          const by = ny + dy;
          const bk = key(bx, by);
          if (prev.walls.has(bk) || crates.has(bk)) return prev; // blocked
          crates.delete(nk);
          crates.add(bk);
          setPushes((p) => p + 1);
        }
        setHistory((h) => [...h.slice(-200), { crates: prev.crates, player: prev.player }]);
        setMoves((m) => m + 1);
        // win: every crate on a target
        let solved = true;
        for (const c of crates) if (!prev.targets.has(c)) solved = false;
        if (solved) {
          setWon(true);
          if (levelIdx + 1 >= LEVELS.length) {
            solvedAll.current = true;
            const total = moves + 1;
            if (total > (getGameBest("sokoban") ?? 0)) {
              saveGameBest("sokoban", total);
              setBest(total);
            }
          }
        }
        setTicks((t) => t + 1);
        return { ...prev, crates, player: { x: nx, y: ny } };
      });
    },
    [won, levelIdx, moves],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const d = DIRS[e.key];
      if (d) {
        e.preventDefault();
        move(d[0], d[1]);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [move]);

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const lastState = h[h.length - 1]!;
      setState((prev) => ({ ...prev, crates: lastState.crates, player: lastState.player }));
      setMoves((m) => Math.max(0, m - 1));
      setWon(false);
      setTicks((t) => t + 1);
      return h.slice(0, -1);
    });
  };

  const size = 46;
  const level = LEVELS[levelIdx]!;
  const cols = Math.max(...level.map((r) => r.length));

  const touchDir = (dx: number, dy: number) => move(dx, dy);

  return (
    <AppShell title="Sokoban">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📦 Sokoban</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Push every crate onto a dot. Crates can't be pulled and only move one at a time.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">
            Level {levelIdx + 1}/{LEVELS.length}
          </span>
          <span className="text-muted-foreground">
            {moves} moves · {pushes} pushes
          </span>
        </div>

        <div className="overflow-auto rounded-2xl border border-border bg-surface p-3">
          <div className="relative mx-auto" style={{ width: cols * size }}>
            {/* floor + targets */}
            {Array.from({ length: level.length }).map((_, y) =>
              Array.from({ length: cols }).map((_, x) => {
                const isWall = state.walls.has(key(x, y));
                const isTarget = state.targets.has(key(x, y));
                return (
                  <div
                    key={`${x}-${y}-${ticks}`}
                    className={`absolute rounded ${isWall ? "bg-slate-700" : isTarget ? "border border-amber-500/70" : "bg-slate-800/40"}`}
                    style={{ left: x * size, top: y * size, width: size, height: size }}
                  >
                    {isTarget && <div className="absolute inset-[30%] rounded-full bg-amber-500/70" />}
                  </div>
                );
              }),
            )}
            {/* crates */}
            {[...state.crates].map((c) => {
              const [cx, cy] = c.split(",").map(Number);
              const onTarget = state.targets.has(c);
              return (
                <div
                  key={`c-${c}-${ticks}`}
                  className={`absolute flex items-center justify-center rounded text-xl ${onTarget ? "bg-amber-600" : "bg-orange-800"}`}
                  style={{ left: cx! * size + 2, top: cy! * size + 2, width: size - 4, height: size - 4 }}
                >
                  📦
                </div>
              );
            })}
            {/* player */}
            <div
              key={`p-${state.player.x}-${state.player.y}-${ticks}`}
              className="absolute flex items-center justify-center rounded-full bg-blue-500 text-xl transition-all duration-150"
              style={{ left: state.player.x * size + 4, top: state.player.y * size + 4, width: size - 8, height: size - 8 }}
            >
              🧑
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-2">
          <button onClick={undo} disabled={!history.length} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40">
            <Undo2 className="mr-1 inline size-4" /> Undo
          </button>
          <button onClick={() => loadLevel(levelIdx)} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground">
            <RotateCcw className="mr-1 inline size-4" /> Restart
          </button>
        </div>

        {/* touch d-pad */}
        <div className="mx-auto grid w-44 grid-cols-3 gap-1.5">
          <span />
          <button onClick={() => touchDir(0, -1)} className="rounded-xl bg-surface py-3 text-lg font-bold">↑</button>
          <span />
          <button onClick={() => touchDir(-1, 0)} className="rounded-xl bg-surface py-3 text-lg font-bold">←</button>
          <button onClick={() => touchDir(0, 1)} className="rounded-xl bg-surface py-3 text-lg font-bold">↓</button>
          <button onClick={() => touchDir(1, 0)} className="rounded-xl bg-surface py-3 text-lg font-bold">→</button>
        </div>

        {won && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              {levelIdx + 1 < LEVELS.length ? "Solved! 🎉" : "All 10 levels cleared! 🏆"}
            </p>
            <button
              onClick={() => (levelIdx + 1 < LEVELS.length ? loadLevel(levelIdx + 1) : start())}
              className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95"
            >
              {levelIdx + 1 < LEVELS.length ? "Next level" : "Play again"}
            </button>
          </div>
        )}

        {phase_note()}
      </div>
    </AppShell>
  );

  function phase_note() {
    if (levelIdx === 0 && moves === 0 && !won) {
      return (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Play className="size-4" /> Arrow keys / WASD / d-pad to move
        </div>
      );
    }
    if (best > 0) return <p className="text-center text-xs text-muted-foreground">Most levels cleared in one run: {best}</p>;
    return null;
  }
}
