import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/connect-four")({ component: ConnectFour });

const COLS = 7;
const ROWS = 6;
type Disc = 1 | 2 | null;
type Mode = "2p" | "ai";

function winningLine(b: Disc[]): number[] | null {
  const dirs: Array<[number, number]> = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = b[r * COLS + c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells = [r * COLS + c];
        let ok = true;
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr * COLS + nc] !== p) {
            ok = false;
            break;
          }
          cells.push(nr * COLS + nc);
        }
        if (ok) return cells;
      }
    }
  }
  return null;
}

function lowestOpen(b: Disc[], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) if (!b[r * COLS + col]) return r;
  return -1;
}

/** heuristic AI: win now, block, prefer center, avoid gifting a win */
function aiPick(b: Disc[], ai: 1 | 2): number {
  const human: 1 | 2 = ai === 1 ? 2 : 1;
  const open = [...Array(COLS).keys()].filter((c) => lowestOpen(b, c) >= 0);
  const wouldWin = (col: number, p: 1 | 2) => {
    const r = lowestOpen(b, col);
    if (r < 0) return false;
    const next = [...b];
    next[r * COLS + col] = p;
    return winningLine(next) !== null;
  };
  // 1) win, 2) block
  for (const p of [ai, human] as const) {
    for (const c of open) if (wouldWin(c, p)) return c;
  }
  // 3) avoid moves that let the opponent win on top
  const safe = open.filter((c) => {
    const r = lowestOpen(b, c);
    const next = [...b];
    next[r * COLS + c] = ai;
    const rr = lowestOpen(next, c);
    if (rr < 0) return true;
    const after = [...next];
    after[rr * COLS + c] = human;
    return winningLine(after) === null;
  });
  const pool = safe.length ? safe : open;
  // 4) center preference
  const centerDist = (c: number) => Math.abs(c - 3);
  pool.sort((a, z) => centerDist(a) - centerDist(z));
  return pool[0]!;
}

function ConnectFour() {
  const [mode, setMode] = useState<Mode>("ai");
  const [board, setBoard] = useState<Disc[]>(Array(COLS * ROWS).fill(null));
  const [turn, setTurn] = useState<1 | 2>(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });

  const line = useMemo(() => winningLine(board), [board]);
  const full = board.every(Boolean);
  const gameOver = Boolean(line) || full;
  const aiTurn = mode === "ai" && turn === 2 && !gameOver;

  function drop(col: number) {
    if (gameOver || aiTurn) return;
    const r = lowestOpen(board, col);
    if (r < 0) return;
    play(r * COLS + col);
  }

  function play(idx: number) {
    const next = [...board];
    next[idx] = turn;
    setBoard(next);
    if (winningLine(next)) setScore((s) => (turn === 1 ? { ...s, p1: s.p1 + 1 } : { ...s, p2: s.p2 + 1 }));
    setTurn(turn === 1 ? 2 : 1);
  }

  useEffect(() => {
    if (!aiTurn) return;
    const t = setTimeout(() => {
      const col = aiPick(board, 2);
      const r = lowestOpen(board, col);
      if (r >= 0) play(r * COLS + col);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiTurn, board]);

  function reset() {
    setBoard(Array(COLS * ROWS).fill(null));
    setTurn(1);
  }

  const status = line
    ? `${line && board[line[0]!] === 1 ? "Player 1" : "Player 2"} wins!`
    : full
      ? "Board full - draw!"
      : mode === "ai"
        ? turn === 1
          ? "Your turn (red)"
          : "AI thinking..."
        : `Player ${turn}'s turn`;

  return (
    <AppShell title="Connect Four">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔴 Connect Four</h1>
        <p className="mt-1 text-sm text-muted-foreground">Drop discs and line up four in any direction.</p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex justify-center gap-1.5">
          {([["ai", "🤖 Vs AI"], ["2p", "👥 2 Players"]] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); }}
              className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                mode === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className={`text-center text-[15px] font-bold ${line ? "text-primary" : "text-foreground"}`}>{status}</p>

        <div className="overflow-x-auto">
          <div
            className="mx-auto grid w-fit gap-1 rounded-xl border border-border bg-surface p-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {board.map((disc, i) => {
              const col = i % COLS;
              const isWin = line?.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => drop(col)}
                  disabled={gameOver || aiTurn}
                  aria-label={`Column ${col + 1} row ${Math.floor(i / COLS) + 1}`}
                  className={`flex size-9 items-center justify-center rounded-full border transition-all sm:size-11 ${
                    isWin ? "border-primary ring-2 ring-primary/50" : "border-border"
                  } bg-[#0a0d12]`}
                >
                  {disc && (
                    <span
                      className={`size-7 rounded-full shadow-inner sm:size-9 ${
                        disc === 1 ? "bg-[#f87171]" : "bg-[#fbbf24]"
                      } ${isWin ? "animate-pulse" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex gap-4 text-center">
            <span className="text-[12px] text-muted-foreground">🔴 P1 <b className="block text-[16px] text-foreground">{score.p1}</b></span>
            <span className="text-[12px] text-muted-foreground">🟡 P2 <b className="block text-[16px] text-foreground">{score.p2}</b></span>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-primary/10">
            <RotateCcw className="size-3.5" /> New game
          </button>
        </div>
      </div>
    </AppShell>
  );
}
