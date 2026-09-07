import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/higher-lower")({ component: HigherLower });

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITS = [
  { s: "♠", red: false },
  { s: "♥", red: true },
  { s: "♦", red: true },
  { s: "♣", red: false },
];

interface Card {
  rank: string;
  suit: string;
  red: boolean;
}

function drawCard(): Card {
  const r = RANKS[Math.floor(Math.random() * RANKS.length)]!;
  const s = SUITS[Math.floor(Math.random() * SUITS.length)]!;
  return { rank: r, suit: s.s, red: s.red };
}

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-higher-lower-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function HigherLower() {
  const [card, setCard] = useState<Card>(drawCard);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(loadBest);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Will the next card be higher or lower? Aces are high.");

  function guess(dir: "higher" | "lower") {
    if (over) return;
    const next = drawCard();
    if (next.rank === card.rank) {
      setCard(next);
      setMsg(`Same rank - push. Your streak of ${streak} survives.`);
      return;
    }
    const a = RANKS.indexOf(card.rank);
    const b = RANKS.indexOf(next.rank);
    const ok = dir === "higher" ? b > a : b < a;
    if (ok) {
      const ns = streak + 1;
      setCard(next);
      setStreak(ns);
      setMsg(`Correct! ${next.rank}${next.suit}. Keep going.`);
      if (ns > best) {
        setBest(ns);
        try {
          localStorage.setItem("play-higher-lower-best", String(ns));
        } catch {
          /* storage unavailable */
        }
      }
    } else {
      setCard(next);
      setOver(true);
      setMsg(`${next.rank}${next.suit} - wrong! Streak ended at ${streak}.`);
    }
  }

  function reset() {
    setCard(drawCard());
    setStreak(0);
    setOver(false);
    setMsg("Will the next card be higher or lower? Aces are high.");
  }

  return (
    <AppShell title="Higher or Lower">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📈 Higher or Lower</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One card, one gut call. Build the longest streak you can.
        </p>
      </header>

      <div className="mx-auto max-w-sm space-y-3">
        <div className="flex items-center justify-around rounded-xl border border-border bg-surface py-2.5 text-center">
          <div>
            <p className="text-[17px] font-bold text-foreground">{streak}</p>
            <p className="text-[10px] text-muted-foreground">Streak</p>
          </div>
          <div>
            <p className="text-[17px] font-bold text-primary">{best}</p>
            <p className="text-[10px] text-muted-foreground">Best</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex aspect-[3/4] max-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-surface shadow-lg">
            <span className={`text-[56px] leading-none ${card.red ? "text-[#f87171]" : "text-foreground"}`}>
              {card.suit}
            </span>
            <span className={`mt-2 text-[34px] font-black ${card.red ? "text-[#f87171]" : "text-foreground"}`}>
              {card.rank}
            </span>
          </div>
          {over && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/70">
              <p className="text-[20px] font-black text-foreground">Streak over 😬</p>
              <p className="text-[13px] text-muted-foreground">
                {streak} in a row - best {best}
              </p>
              <button onClick={reset} className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                <RotateCcw className="size-3.5" /> New game
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => guess("higher")}
            disabled={over}
            className="rounded-xl bg-primary py-3.5 text-[14px] font-bold text-background transition-opacity hover:bg-primary/90 disabled:opacity-40"
          >
            ⬆️ Higher
          </button>
          <button
            onClick={() => guess("lower")}
            disabled={over}
            className="rounded-xl border border-border bg-surface py-3.5 text-[14px] font-bold text-foreground transition-colors hover:border-primary/40 disabled:opacity-40"
          >
            ⬇️ Lower
          </button>
        </div>

        <p className="text-center text-[12px] text-muted-foreground">{msg}</p>
      </div>
    </AppShell>
  );
}
