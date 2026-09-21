import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/word-search")({ component: WordSearch });

/**
 * Word Search — every grid is generated fresh from a themed word list, with
 * words hidden in all eight directions. Drag (or swipe) from the first letter
 * to the last to claim a word. Real themes, real vocabulary.
 */

const THEMES: Record<string, string[]> = {
  Animals: ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "TIGER", "RABBIT", "OTTER", "ZEBRA", "PANDA", "KOALA"],
  Countries: ["INDIA", "BRAZIL", "CANADA", "JAPAN", "KENYA", "SPAIN", "NEPAL", "EGYPT", "CHILE", "NORWAY"],
  India: ["MUMBAI", "DELHI", "JAIPUR", "KERALA", "GOA", "TAJMAHAL", "HIMALAYA", "BENGALURU", "LUCKNOW", "VARANASI"],
  Fruits: ["MANGO", "BANANA", "GRAPE", "PAPAYA", "CHERRY", "GUAVA", "ORANGE", "LYCHEE", "MELON", "APPLE"],
  Space: ["GALAXY", "NEBULA", "COMET", "ORBIT", "SATURN", "ROCKET", "METEOR", "PLANET", "ECLIPSE", "ASTEROID"],
  Sports: ["CRICKET", "TENNIS", "HOCKEY", "BOXING", "CYCLING", "RUGBY", "GOLF", "SQUASH", "KABADDI", "ROWING"],
  Music: ["GUITAR", "PIANO", "VIOLIN", "DRUM", "FLUTE", "TABLA", "SITAR", "HARMONY", "RHYTHM", "MELODY"],
  Coding: ["VARIABLE", "FUNCTION", "ARRAY", "LOOP", "COMPILER", "BOOLEAN", "CACHE", "STACK", "QUERY", "SERVER"],
  Food: ["BIRYANI", "SAMOSA", "PASTA", "SUSHI", "PIZZA", "DOSA", "NOODLE", "TACOS", "CURRY", "SALAD"],
  Ocean: ["CORAL", "WHALE", "SHARK", "OCTOPUS", "SEAWEED", "TURTLE", "JELLYFISH", "PLANKTON", "STINGRAY", "LAGOON"],
  Weather: ["MONSOON", "THUNDER", "LIGHTNING", "DRIZZLE", "TSUNAMI", "CYCLONE", "HAILSTORM", "BREEZE", "FROST", "HUMID"],
  School: ["NOTEBOOK", "LIBRARY", "TEACHER", "HOMEWORK", "RECESS", "PENCIL", "GEOMETRY", "CHEMISTRY", "HISTORY", "ALGEBRA"],
};

const DIRS: [number, number][] = [
  [0, 1], [1, 0], [1, 1], [1, -1],
  [0, -1], [-1, 0], [-1, -1], [-1, 1],
];

interface Placed { word: string; cells: number[] }

function buildPuzzle(theme: string, size = 12): { grid: string[]; placed: Placed[] } {
  const words = THEMES[theme]!;
  const grid: string[] = Array(size * size).fill("");
  const placed: Placed[] = [];

  for (const word of words) {
    let done = false;
    for (let attempt = 0; attempt < 200 && !done; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * 8)]!;
      const r0 = Math.floor(Math.random() * size);
      const c0 = Math.floor(Math.random() * size);
      const endR = r0 + dr * (word.length - 1);
      const endC = c0 + dc * (word.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

      const cells: number[] = [];
      let ok = true;
      for (let k = 0; k < word.length; k++) {
        const idx = (r0 + dr * k) * size + (c0 + dc * k);
        const existing = grid[idx];
        const letter = word[k]!;
        // crossing another word is fine, but only where the letters agree
        if (existing && existing !== letter) {
          ok = false;
          break;
        }
        cells.push(idx);
      }
      if (!ok) continue;
      // reject if this exact line is already used by another word
      if (placed.some((p) => p.cells[0] === cells[0] && p.cells[p.cells.length - 1] === cells[cells.length - 1])) continue;

      for (let k = 0; k < word.length; k++) {
        grid[(r0 + dr * k) * size + (c0 + dc * k)] = word[k]!;
      }
      placed.push({ word, cells });
      done = true;
    }
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i]) grid[i] = alphabet[Math.floor(Math.random() * 26)]!;
  }
  return { grid, placed };
}

function WordSearch() {
  const themeNames = Object.keys(THEMES);
  const [theme, setTheme] = useState(themeNames[0]!);
  const [puzzle, setPuzzle] = useState(() => buildPuzzle(themeNames[0]!));
  const [found, setFound] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const SIZE = 12;

  const newGame = useCallback((t: string) => {
    setTheme(t);
    setPuzzle(buildPuzzle(t));
    setFound([]);
    setDragStart(null);
    setDragEnd(null);
    setSeconds(0);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const line = useMemo(() => {
    if (dragStart === null || dragEnd === null) return [] as number[];
    const r0 = Math.floor(dragStart / SIZE);
    const c0 = dragStart % SIZE;
    const r1 = Math.floor(dragEnd / SIZE);
    const c1 = dragEnd % SIZE;
    const dr = Math.sign(r1 - r0);
    const dc = Math.sign(c1 - c0);
    const len = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(r1 - r0) !== Math.abs(c1 - c0)) return [];
    const cells: number[] = [];
    for (let k = 0; k < len; k++) cells.push((r0 + dr * k) * SIZE + (c0 + dc * k));
    return cells;
  }, [dragStart, dragEnd]);

  const release = useCallback(() => {
    if (line.length > 1) {
      const word = line.map((i) => puzzle.grid[i]!).join("");
      const reversed = [...word].reverse().join("");
      const hit = puzzle.placed.find((p) => (p.word === word || p.word === reversed) && !found.includes(p.word));
      if (hit) {
        const next = [...found, hit.word];
        setFound(next);
        if (next.length === puzzle.placed.length) setRunning(false);
      }
    }
    setDragStart(null);
    setDragEnd(null);
    draggingRef.current = false;
  }, [line, puzzle, found]);

  const cellFromPoint = (clientX: number, clientY: number): number | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cellW = rect.width / SIZE;
    const cellH = rect.height / SIZE;
    const c = Math.floor((clientX - rect.left) / cellW);
    const r = Math.floor((clientY - rect.top) / cellH);
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null;
    return r * SIZE + c;
  };

  const foundCells = useMemo(() => {
    const s = new Set<number>();
    for (const p of puzzle.placed) {
      if (found.includes(p.word)) for (const i of p.cells) s.add(i);
    }
    return s;
  }, [puzzle, found]);

  const hoverCells = new Set(line);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title="Word Search">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔍 Word Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Twelve themes, words hidden in all eight directions. Drag from the first letter to the last to claim one.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2 text-[12px]">
          <span className="text-muted-foreground">
            {theme} · <b className="text-foreground">{found.length}</b>/{puzzle.placed.length} found
          </span>
          <span className="font-semibold text-primary tabular-nums">{fmt(seconds)}</span>
        </div>

        <div
          ref={gridRef}
          className="mx-auto grid w-full max-w-[460px] touch-none select-none overflow-hidden rounded-xl border border-border bg-surface"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          onPointerDown={(e) => {
            const i = cellFromPoint(e.clientX, e.clientY);
            if (i === null) return;
            draggingRef.current = true;
            setDragStart(i);
            setDragEnd(i);
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return;
            const i = cellFromPoint(e.clientX, e.clientY);
            if (i !== null) setDragEnd(i);
          }}
          onPointerUp={release}
          onPointerLeave={release}
        >
          {puzzle.grid.map((letter, i) => {
            const isFound = foundCells.has(i);
            const isHover = hoverCells.has(i);
            return (
              <span
                key={i}
                className={`grid aspect-square cursor-pointer place-items-center text-[13px] font-bold transition-colors sm:text-[15px] ${
                  isFound
                    ? "bg-emerald-500/25 text-emerald-300"
                    : isHover
                      ? "bg-primary/30 text-foreground"
                      : "text-foreground/85"
                }`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {puzzle.placed.map((p) => (
            <span
              key={p.word}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
                found.includes(p.word) ? "bg-emerald-500/20 text-emerald-300 line-through" : "border border-border bg-surface text-muted-foreground"
              }`}
            >
              {p.word}
            </span>
          ))}
        </div>

        {found.length === puzzle.placed.length && (
          <p className="text-center text-[13px] font-bold text-emerald-400">
            🎉 All {puzzle.placed.length} words found in {fmt(seconds)}!
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-1.5">
          {themeNames.map((t) => (
            <button
              key={t}
              onClick={() => newGame(t)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                theme === t ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => newGame(theme)}
          className="mx-auto block rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-primary/10"
        >
          ↻ Shuffle this theme
        </button>
      </div>
    </AppShell>
  );
}
