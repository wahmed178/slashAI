import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/snakes-ladders")({ component: SnakesLadders });

const LADDERS: Record<number, number> = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92 };
const SNAKES: Record<number, number> = { 27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41 };

// serpentine numbering: row 0 is 100..91 left to right, row 1 is 81..90 left to right, ...
function cellNumber(row: number, col: number) {
  const base = 100 - row * 10;
  return row % 2 === 0 ? base - col : base - 9 + col;
}

function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

function SnakesLadders() {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [turn, setTurn] = useState<0 | 1>(0);
  const [die, setDie] = useState<number | null>(null);
  const [msg, setMsg] = useState("Roll to start - first to square 100 (exact roll) wins.");
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [rolling, setRolling] = useState(false);

  function reset() {
    setPos([0, 0]);
    setTurn(0);
    setDie(null);
    setMsg("Roll to start - first to square 100 (exact roll) wins.");
    setWinner(null);
    setRolling(false);
  }

  function roll() {
    if (rolling || winner !== null) return;
    setRolling(true);
    const d = rollDie();
    setDie(d);
    const p = turn;
    const cur = pos[p]!;
    window.setTimeout(() => {
      if (cur + d > 100) {
        setMsg(`Player ${p + 1} rolled ${d} - needs exactly ${100 - cur} to finish. Stay at ${cur}.`);
        setTurn(p === 0 ? 1 : 0);
        setRolling(false);
        return;
      }
      let to = cur + d;
      let note = `Player ${p + 1} rolled ${d} and moved to ${to}`;
      const ladder = LADDERS[to];
      const snake = SNAKES[to];
      if (ladder) {
        to = ladder;
        note += `, then climbed a ladder to ${to}! 🪜`;
      } else if (snake) {
        to = snake;
        note += `, but a snake bit them down to ${to}. 🐍`;
      } else {
        note += ".";
      }
      const next: [number, number] = [pos[0]!, pos[1]!];
      next[p] = to;
      setPos(next);
      if (to === 100) {
        setMsg(note);
        setWinner(p);
        setRolling(false);
        return;
      }
      setMsg(note);
      setTurn(p === 0 ? 1 : 0);
      setRolling(false);
    }, 420);
  }

  const p = turn;
  const pName = winner !== null ? `Player ${winner + 1}` : `Player ${p + 1}`;
  const pColor = winner !== null ? (winner === 0 ? "text-[#2dd4bf]" : "text-[#f87171]") : p === 0 ? "text-[#2dd4bf]" : "text-[#f87171]";

  return (
    <AppShell title="Snakes and Ladders">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🪜 Snakes and Ladders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Two players, one device. Roll, climb the ladders, avoid the snakes, land exactly on 100.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <span className="text-[12px]">
            <span className="font-bold text-[#2dd4bf]">🔵 P1</span> <span className="text-muted-foreground">at {pos[0] === 0 ? "start" : pos[0]}</span>
          </span>
          <span className="text-[12px]">
            <span className="font-bold text-[#f87171]">P2 🔴</span> <span className="text-muted-foreground">at {pos[1] === 0 ? "start" : pos[1]}</span>
          </span>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-10 overflow-hidden rounded-xl border border-border">
            {Array.from({ length: 10 }, (_, row) =>
              Array.from({ length: 10 }, (_, col) => {
                const n = cellNumber(row, col);
                const isLadder = Boolean(LADDERS[n]);
                const isSnake = Boolean(SNAKES[n]);
                const p1Here = pos[0] === n;
                const p2Here = pos[1] === n;
                return (
                  <div
                    key={n}
                    className={`relative flex items-center justify-center border border-[#1c2431] text-[8px] ${
                      isLadder ? "bg-[#12331f]" : isSnake ? "bg-[#331216]" : "bg-[#10151c]"
                    }`}
                  >
                    <span className="absolute top-0.5 left-1 text-[7px] text-muted-foreground/70">{n}</span>
                    {isLadder && <span className="absolute top-1 right-0.5 text-[8px] opacity-70">🪜</span>}
                    {isSnake && <span className="absolute top-1 right-0.5 text-[8px] opacity-70">🐍</span>}
                    {(p1Here || p2Here) && (
                      <span className="flex gap-0.5 text-[11px]">
                        {p1Here && <span>🔵</span>}
                        {p2Here && <span>🔴</span>}
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
          {winner !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70">
              <p className="text-[20px] font-black text-foreground">Player {winner + 1} wins! 🎉</p>
              <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                Play again
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
          <p className={`text-[12px] font-semibold ${pColor}`}>
            {winner !== null ? `${pName} wins!` : `${pName}'s turn`}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-surface-elevated text-[18px] font-bold text-foreground">
              {die ?? "?"}
            </span>
            <button
              onClick={roll}
              disabled={rolling || winner !== null}
              className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-background transition-opacity hover:bg-primary/90 disabled:opacity-50"
            >
              {rolling ? "..." : "🎲 Roll"}
            </button>
            <button onClick={reset} className="rounded-lg border border-border bg-surface p-2 text-muted-foreground hover:text-foreground" aria-label="Restart">
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground">{msg}</p>
      </div>
    </AppShell>
  );
}
