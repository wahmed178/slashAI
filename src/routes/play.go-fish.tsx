import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/go-fish")({ component: GoFish });

type Player = 1 | 2;

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function freshDeck(): string[] {
  const d: string[] = [];
  for (const s of SUITS) for (const r of RANKS) d.push(`${r}${s}`);
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j]!, d[i]!];
  }
  return d;
}

const rankOf = (card: string) => (card.startsWith("10") ? "10" : card[0]!);
const isRed = (card: string) => card.includes("♥") || card.includes("♦");

function extractBooks(hand: string[]): { hand: string[]; books: string[] } {
  const books: string[] = [];
  let h = [...hand];
  for (const r of RANKS) {
    if (h.filter((c) => rankOf(c) === r).length === 4) {
      books.push(r);
      h = h.filter((c) => rankOf(c) !== r);
    }
  }
  return { hand: h, books };
}

function GoFish() {
  const [hands, setHands] = useState<Record<Player, string[]>>({ 1: [], 2: [] });
  const [books, setBooks] = useState<Record<Player, string[]>>({ 1: [], 2: [] });
  const [deck, setDeck] = useState<string[]>([]);
  const [turn, setTurn] = useState<Player>(1);
  const [phase, setPhase] = useState<"deal" | "handoff" | "play" | "over">("deal");
  const [message, setMessage] = useState("Deal cards to start.");
  const [winner, setWinner] = useState<Player | null>(null);

  function reset() {
    setHands({ 1: [], 2: [] });
    setBooks({ 1: [], 2: [] });
    setDeck([]);
    setTurn(1);
    setPhase("deal");
    setMessage("Deal cards to start.");
    setWinner(null);
  }

  function deal() {
    const d = freshDeck();
    const h1 = d.splice(0, 7);
    const h2 = d.splice(0, 7);
    const b1 = extractBooks(h1);
    const b2 = extractBooks(h2);
    setHands({ 1: b1.hand, 2: b2.hand });
    setBooks({ 1: b1.books, 2: b2.books });
    setDeck(d);
    setTurn(1);
    setPhase("play");
    setMessage("Player 1: tap a card to ask Player 2 for that rank.");
  }

  function passTurn(next: Player, msg: string) {
    setMessage(msg);
    setTurn(next);
    setPhase("handoff");
  }

  function ask(rank: string) {
    const me = turn;
    const foe: Player = me === 1 ? 2 : 1;
    const foeCards = hands[foe] ?? [];
    const taken = foeCards.filter((c) => rankOf(c) === rank);

    const nextHands: Record<Player, string[]> = {
      1: [...(hands[1] ?? [])],
      2: [...(hands[2] ?? [])],
    };
    nextHands[foe] = nextHands[foe]!.filter((c) => rankOf(c) !== rank);
    nextHands[me] = nextHands[me]!.filter((c) => rankOf(c) !== rank); // drop duplicates of rank for rebuild below

    if (taken.length > 0) {
      nextHands[me] = [...nextHands[me]!, ...taken];
      const b = extractBooks(nextHands[me]!);
      nextHands[me] = b.hand;
      const newBooks = { ...books, [me]: [...(books[me] ?? []), ...b.books] };
      setHands(nextHands);
      setBooks(newBooks);
      setMessage(
        `Player ${foe} handed over ${taken.length} ${rank}${taken.length > 1 ? "'s" : "'"}! Go again.`,
      );
      checkEnd(nextHands, newBooks, deck);
      return;
    }

    // go fish
    if (deck.length === 0) {
      const ended = checkEnd(nextHands, books, deck);
      if (ended) return;
      passTurn(foe, `No ${rank}'s and the pond is empty. Player ${foe}'s turn.`);
      return;
    }
    const d = [...deck];
    const drawn = d.pop()!;
    setDeck(d);
    if (rankOf(drawn) === rank) {
      nextHands[me] = [...nextHands[me]!, drawn];
      const b = extractBooks(nextHands[me]!);
      nextHands[me] = b.hand;
      const newBooks = { ...books, [me]: [...(books[me] ?? []), ...b.books] };
      setHands(nextHands);
      setBooks(newBooks);
      setMessage(`Go fish... you drew the ${drawn}! Lucky - go again.`);
      checkEnd(nextHands, newBooks, d);
      return;
    }
    nextHands[me] = [...nextHands[me]!, drawn];
    const b = extractBooks(nextHands[me]!);
    nextHands[me] = b.hand;
    setHands(nextHands);
    const ended = checkEnd(nextHands, books, d);
    if (!ended) passTurn(foe, `Go fish - drew ${drawn}. Pass to Player ${foe}.`);
  }

  function checkEnd(hs: Record<Player, string[]>, bs: Record<Player, string[]>, d: string[]) {
    const totalBooks = (bs[1]?.length ?? 0) + (bs[2]?.length ?? 0);
    const done =
      totalBooks === 13 ||
      (d.length === 0 && ((hs[1]?.length ?? 0) === 0 || (hs[2]?.length ?? 0) === 0));
    if (!done) return false;
    const s1 = bs[1]?.length ?? 0;
    const s2 = bs[2]?.length ?? 0;
    setWinner(s1 === s2 ? null : s1 > s2 ? 1 : 2);
    setPhase("over");
    return true;
  }

  // keep the active player's hand stocked while the pond has cards
  useEffect(() => {
    if (phase !== "play") return;
    const me = hands[turn] ?? [];
    if (me.length > 0 || deck.length === 0) return;
    const d = [...deck];
    const drawn = d.pop()!;
    const nh: Record<Player, string[]> = { ...hands, [turn]: [...me, drawn] };
    const b = extractBooks(nh[turn]!);
    nh[turn] = b.hand;
    const nb: Record<Player, string[]> = { ...books, [turn]: [...(books[turn] ?? []), ...b.books] };
    setDeck(d);
    setHands(nh);
    setBooks(nb);
    setMessage(`Player ${turn}'s hand was empty - auto-drew a card.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, hands, deck]);

  const myHand = [...(hands[turn] ?? [])].sort((a, b) => RANKS.indexOf(rankOf(a)) - RANKS.indexOf(rankOf(b)));

  if (phase === "deal") {
    return (
      <AppShell title="Go Fish">
        <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 text-center">
          <span className="text-[52px]">🐟</span>
          <h2 className="text-xl font-bold text-foreground">Go Fish</h2>
          <p className="text-sm text-muted-foreground">
            Ask your rival for ranks you already hold. Collect all four of a kind to score a book - most books wins.
          </p>
          <button onClick={deal} className="rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-background hover:bg-primary/90">
            Deal cards
          </button>
        </div>
      </AppShell>
    );
  }

  if (phase === "handoff") {
    return (
      <AppShell title="Go Fish">
        <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-5 text-center">
          <span className="text-[40px]">🤝</span>
          <h2 className="text-xl font-bold text-foreground">Pass to Player {turn}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
          <button onClick={() => setPhase("play")} className="rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-background hover:bg-primary/90">
            I'm Player {turn} - Show my hand
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Go Fish">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🐟 Go Fish</h1>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {phase === "over" ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-[40px]">🏆</p>
            <p className="text-[18px] font-black text-primary">
              {winner ? `Player ${winner} wins!` : "It's a draw!"}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Books - Player 1: {books[1]?.length ?? 0} · Player 2: {books[2]?.length ?? 0}
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-[13px] font-bold text-foreground">
              Player {turn}'s hand - tap a card to ask for its rank
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {myHand.map((card, i) => (
                <button
                  key={`${card}-${i}`}
                  onClick={() => ask(rankOf(card))}
                  className={`flex h-[74px] w-[52px] flex-col items-center justify-center rounded-lg border border-border bg-surface text-[15px] font-black transition-all hover:-translate-y-1 hover:border-primary/60 ${
                    isRed(card) ? "text-[#f87171]" : "text-foreground"
                  }`}
                >
                  {card.slice(0, card.length - 1)}
                  <span className="text-[16px]">{card.slice(-1)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-[12px] text-muted-foreground">
          <span>
            🐟 Pond: <b className="text-foreground">{deck.length}</b> · P1:{" "}
            <b className="text-foreground">{books[1]?.length ?? 0}</b> books · P2:{" "}
            <b className="text-foreground">{books[2]?.length ?? 0}</b> books
          </span>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-2 font-medium text-foreground hover:bg-primary/10">
            <RotateCcw className="size-3.5" /> New game
          </button>
        </div>

        {/* books won */}
        <div className="grid grid-cols-2 gap-2">
          {([1, 2] as const).map((p) => (
            <div key={p} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] font-bold text-muted-foreground">Player {p} books</p>
              <p className="mt-1 flex flex-wrap gap-1 text-[12px] font-bold text-foreground">
                {(books[p]?.length ?? 0) === 0 ? "-" : (books[p] ?? []).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
