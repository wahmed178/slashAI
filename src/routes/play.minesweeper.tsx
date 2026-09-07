import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Flag } from "lucide-react";

export const Route = createFileRoute("/play/minesweeper")({ component: Minesweeper });

interface Diff {
  key: string;
  label: string;
  size: number;
  mines: number;
}
const DIFFS: Diff[] = [
  { key: "easy", label: "Easy", size: 9, mines: 10 },
  { key: "hard", label: "Hard", size: 12, mines: 25 },
];

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
}

function neighbors(i: number, size: number): number[] {
  const r = Math.floor(i / size);
  const c = i % size;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) out.push(nr * size + nc);
    }
  }
  return out;
}

function buildBoard(size: number, mines: number, safeIndex: number | null): Cell[] {
  const board: Cell[] = Array.from({ length: size * size }, () => ({
    mine: false, revealed: false, flagged: false, count: 0,
  }));
  // place mines, avoiding the first-clicked cell and its neighbors
  const banned = new Set<number>(safeIndex === null ? [] : [safeIndex, ...neighbors(safeIndex, size)]);
  const spots = Array.from({ length: size * size }, (_, i) => i).filter((i) => !banned.has(i));
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j]!, spots[i]!];
  }
  for (const idx of spots.slice(0, mines)) board[idx]!.mine = true;
  for (let i = 0; i < board.length; i++) {
    board[i]!.count = neighbors(i, size).filter((n) => board[n]!.mine).length;
  }
  return board;
}

const NUM_COLORS = ["", "text-sky-400", "text-emerald-400", "text-amber-400", "text-orange-400", "text-rose-400", "text-fuchsia-400", "text-violet-400", "text-primary"];

function Minesweeper() {
  const [diff, setDiff] = useState<Diff>(DIFFS[0]!);
  const [board, setBoard] = useState<Cell[]>(() => Array.from({ length: 81 }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })));
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [seconds, setSeconds] = useState(0);
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flagged = board.filter((c) => c.flagged).length;

  useEffect(() => {
    if (!started || status !== "playing") return;
    const id = setInterval(() => setSeconds((s) => Math.min(s + 1, 999)), 1000);
    return () => clearInterval(id);
  }, [started, status]);

  function newGame(d: Diff = diff) {
    setDiff(d);
    setBoard(Array.from({ length: d.size * d.size }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })));
    setStarted(false);
    setStatus("playing");
    setSeconds(0);
  }

  function reveal(board: Cell[], index: number, size: number) {
    const cell = board[index]!;
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    if (cell.count === 0 && !cell.mine) {
      for (const n of neighbors(index, size)) {
        if (!board[n]!.revealed && !board[n]!.flagged) reveal(board, n, size);
      }
    }
  }

  function tap(i: number) {
    if (status !== "playing") return;
    let b = board.map((c) => ({ ...c }));
    if (!started) {
      b = buildBoard(diff.size, diff.mines, i);
      setStarted(true);
    }
    const cell = b[i]!;
    if (cell.flagged) return;
    if (cell.mine) {
      b.forEach((c) => {
        if (c.mine) c.revealed = true;
      });
      setBoard(b);
      setStatus("lost");
      return;
    }
    reveal(b, i, diff.size);
    setBoard(b);
    const safe = b.filter((c) => !c.mine);
    if (safe.every((c) => c.revealed)) setStatus("won");
  }

  function toggleFlag(i: number) {
    if (status !== "playing") return;
    setBoard((prev) =>
      prev.map((c, idx) => (idx === i && !c.revealed ? { ...c, flagged: !c.flagged } : c)),
    );
  }

  const onTouchStart = (i: number) => {
    longPress.current = setTimeout(() => {
      toggleFlag(i);
      longPress.current = null;
    }, 400);
  };
  const clearLongPress = () => {
    if (longPress.current) {
      clearTimeout(longPress.current);
      longPress.current = null;
    }
  };

  return (
    <AppShell title="Minesweeper">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💣 Minesweeper</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap to reveal, long-press (or right-click) to flag.</p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {DIFFS.map((d) => (
              <button
                key={d.key}
                onClick={() => newGame(d)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  diff.key === d.key ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button onClick={() => newGame()} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-primary/10">
            <RotateCcw className="size-3" /> New
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Flag className="size-3.5 text-rose-400" /> <b className="text-foreground">{diff.mines - flagged}</b> left
          </span>
          <span className="text-[17px]">{status === "won" ? "😎" : status === "lost" ? "😵" : "🙂"}</span>
          <span className="text-muted-foreground">⏱ <b className="text-foreground">{seconds}s</b></span>
        </div>

        {status !== "playing" && (
          <p className={`text-center text-[14px] font-bold ${status === "won" ? "text-primary" : "text-rose-400"}`}>
            {status === "won" ? `Cleared in ${seconds}s - flawless!` : "Boom! Hit a mine."}
          </p>
        )}

        <div
          className="mx-auto w-full max-w-[420px] rounded-xl border border-border bg-surface p-1.5"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${diff.size}, 1fr)` }}>
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => tap(i)}
                onContextMenu={(e) => { e.preventDefault(); toggleFlag(i); }}
                onTouchStart={() => onTouchStart(i)}
                onTouchEnd={clearLongPress}
                onTouchMove={clearLongPress}
                className={`flex aspect-square items-center justify-center rounded-[3px] text-[11px] font-black sm:text-[13px] ${
                  cell.revealed
                    ? cell.mine
                      ? "bg-rose-500/70"
                      : "bg-surface-elevated"
                    : "bg-[#12233a] hover:bg-primary/25 active:bg-primary/40"
                } ${cell.revealed && !cell.mine ? NUM_COLORS[cell.count] ?? "" : "text-foreground"}`}
              >
                {cell.flagged ? "🚩" : cell.revealed ? (cell.mine ? "💣" : cell.count || "") : ""}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
