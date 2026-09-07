import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/memory-match")({ component: MemoryMatch });

const EMOJIS = ["🐙", "🦋", "🌵", "🍄", "🐬", "🦊", "🌻", "🍕", "🚀", "🎸", "🧊", "🪐"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  done: boolean;
}

function buildDeck(pairs: number): Card[] {
  const picked = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs);
  return [...picked, ...picked]
    .map((emoji, id) => ({ id, emoji, flipped: false, done: false }))
    .sort(() => Math.random() - 0.5)
    .map((c, i) => ({ ...c, id: i }));
}

function MemoryMatch() {
  const [mode, setMode] = useState<"1p" | "2p">("1p");
  const [pairs, setPairs] = useState(8);
  const [cards, setCards] = useState<Card[]>(() => buildDeck(8));
  const [open, setOpen] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function newGame(m: "1p" | "2p" = mode, p: number = pairs) {
    setMode(m);
    setPairs(p);
    setCards(buildDeck(p));
    setOpen([]);
    setLock(false);
    setTurn(1);
    setScores([0, 0]);
    setMoves(0);
    setWon(false);
  }

  function flip(id: number) {
    if (lock) return;
    const card = cards[id]!;
    if (card.flipped || card.done) return;
    const nextOpen = [...open, id];
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setOpen(nextOpen);
    if (nextOpen.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = nextOpen as [number, number];
    const ca = cards[a]!;
    const cb = cards[b]!;
    setLock(true);
    if (ca.emoji === cb.emoji) {
      // match
      setTimeout(() => {
        setCards((cs) =>
          cs.map((c) => (c.id === a || c.id === b ? { ...c, done: true, flipped: true } : c)),
        );
        setOpen([]);
        setLock(false);
        if (mode === "2p") setScores((s) => (turn === 1 ? ([s[0]! + 1, s[1]!] as [number, number]) : ([s[0]!, s[1]! + 1] as [number, number])));
      }, 350);
    } else {
      setTimeout(() => {
        setCards((cs) => cs.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
        setOpen([]);
        setLock(false);
        if (mode === "2p") setTurn((t) => (t === 1 ? 2 : 1));
      }, 750);
    }
  }

  // win detection
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.done)) setWon(true);
  }, [cards]);

  const matched = cards.filter((c) => c.done).length / 2;

  return (
    <AppShell title="Memory Match">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧩 Memory Match</h1>
        <p className="mt-1 text-sm text-muted-foreground">Flip two cards and find the pairs. Fewer moves, better memory.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {([["1p", "🧠 Solo"], ["2p", "👥 2 Players"]] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => newGame(m)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                mode === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" />
          {[6, 8, 10].map((p) => (
            <button
              key={p}
              onClick={() => newGame(mode, p)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                pairs === p ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {p} pairs
            </button>
          ))}
        </div>

        {won ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-[40px]">🎉</p>
            <p className="text-[18px] font-black text-primary">
              {mode === "2p"
                ? scores[0] === scores[1]
                  ? "It's a tie!"
                  : `Player ${scores[0]! > scores[1]! ? 1 : 2} wins!`
                : `Cleared in ${moves} moves!`}
            </p>
            {mode === "2p" && (
              <p className="mt-1 text-[13px] text-muted-foreground">
                P1: {scores[0]} pairs · P2: {scores[1]} pairs
              </p>
            )}
            <button onClick={() => newGame()} className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
              Play again
            </button>
          </div>
        ) : (
          <>
            {mode === "2p" && (
              <p className="text-center text-[13px] font-bold text-foreground">
                Player {turn}'s turn · P1: {scores[0]} · P2: {scores[1]}
              </p>
            )}
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => flip(card.id)}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-[26px] transition-all duration-200 sm:text-[32px] ${
                    card.done
                      ? "border-primary/40 bg-primary/10 opacity-60"
                      : card.flipped
                        ? "border-primary/50 bg-surface-elevated"
                        : "border-border bg-surface hover:bg-surface-elevated"
                  }`}
                >
                  {card.flipped || card.done ? card.emoji : "❓"}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-[12px] text-muted-foreground">
              <span>Pairs: <b className="text-foreground">{matched}/{pairs}</b> · Moves: <b className="text-foreground">{moves}</b></span>
              <button onClick={() => newGame()} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 font-medium text-foreground hover:bg-primary/10">
                <RotateCcw className="size-3" /> Restart
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
