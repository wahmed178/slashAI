import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/blackjack")({ component: Blackjack });

type Card = { rank: string; suit: string };

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];
const BAL_KEY = "blackjack-chips";

function freshShoe(): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < 4; d++) for (const s of SUITS) for (const r of RANKS) cards.push({ rank: r, suit: s });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j]!, cards[i]!];
  }
  return cards;
}

function handValue(cards: Card[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c.rank === "A") {
      aces++;
      total += 11;
    } else if (["J", "Q", "K", "10"].includes(c.rank)) total += 10;
    else total += Number(c.rank);
  }
  let soft = false;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  if (aces > 0 && total === 21) soft = true;
  return { total, soft };
}

const isRed = (c: Card) => c.suit === "♥" || c.suit === "♦";
const cardLabel = (c: Card) => `${c.rank}${c.suit}`;

type Phase = "bet" | "player" | "dealer" | "done";

function Blackjack() {
  const [balance, setBalance] = useState<number>(() => {
    const v = Number(localStorage.getItem(BAL_KEY));
    return Number.isFinite(v) && v > 0 ? v : 100;
  });
  const [shoe, setShoe] = useState<Card[]>(freshShoe);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [bet, setBet] = useState(10);
  const [phase, setPhase] = useState<Phase>("bet");
  const [message, setMessage] = useState("Place your bet.");
  const [revealDealer, setRevealDealer] = useState(false);

  useEffect(() => {
    localStorage.setItem(BAL_KEY, String(balance));
  }, [balance]);

  function deal() {
    if (bet > balance) {
      setMessage("Not enough chips for that bet.");
      return;
    }
    const p: Card[] = [];
    const d: Card[] = [];
    let s = shoe.length < 15 ? freshShoe() : [...shoe];
    p.push(s.shift()!);
    d.push(s.shift()!);
    p.push(s.shift()!);
    d.push(s.shift()!);
    setShoe(s);
    setPlayer(p);
    setDealer(d);
    setRevealDealer(false);
    setBalance((b) => b - bet);
    const pv = handValue(p).total;
    const dv = handValue(d).total;
    if (pv === 21 && dv === 21) {
      setPhase("done");
      setRevealDealer(true);
      setBalance((b) => b + bet);
      setMessage("Both blackjack - push, bet returned.");
    } else if (pv === 21) {
      setPhase("done");
      setRevealDealer(true);
      setBalance((b) => b + bet + Math.floor(bet * 1.5));
      setMessage(`🖤 Blackjack! You win ${Math.floor(bet * 1.5)} chips.`);
    } else if (dv === 21) {
      setPhase("done");
      setRevealDealer(true);
      setMessage("Dealer blackjack. Better luck next hand.");
    } else {
      setPhase("player");
      setMessage("Hit, stand or double down.");
    }
  }

  /** draw n cards, returning the cards and the remaining shoe (reshuffles when low) */
  function drawCards(count: number, from: Card[]): [Card[], Card[]] {
    let s = from.length < 15 ? freshShoe() : [...from];
    const out: Card[] = [];
    for (let i = 0; i < count; i++) out.push(s.shift()!);
    return [out, s];
  }

  function hit() {
    const [drawn, s] = drawCards(1, shoe);
    const p = [...player, drawn[0]!];
    setPlayer(p);
    setShoe(s);
    const { total } = handValue(p);
    if (total > 21) {
      setPhase("done");
      setRevealDealer(true);
      setMessage(`Bust with ${total}. Dealer takes it.`);
    } else if (total === 21) {
      dealerPlay(p, s);
    } else {
      setMessage("Hit or stand?");
    }
  }

  /** dealer draws to 17, then settles the bet at `stake` chips */
  function dealerPlay(p: Card[], shoeOverride: Card[], stake: number = bet) {
    let d = [...dealer];
    let s = [...shoeOverride];
    while (handValue(d).total < 17) {
      if (s.length === 0) s = freshShoe();
      d.push(s.shift()!);
    }
    setShoe(s);
    setDealer(d);
    setRevealDealer(true);
    const pv = handValue(p).total;
    const dv = handValue(d).total;
    if (dv > 21) {
      setBalance((b) => b + stake * 2);
      setMessage(`Dealer busts with ${dv} - you win ${stake} chips!`);
    } else if (pv > dv) {
      setBalance((b) => b + stake * 2);
      setMessage(`${pv} vs ${dv} - you win ${stake} chips!`);
    } else if (pv < dv) {
      setMessage(`${pv} vs ${dv} - dealer wins.`);
    } else {
      setBalance((b) => b + stake);
      setMessage(`Push at ${pv} - bet returned.`);
    }
    setPhase("done");
  }

  function double() {
    if (bet > balance) {
      setMessage("Not enough chips to double.");
      return;
    }
    setBalance((b) => b - bet);
    const nb = bet * 2;
    setBet(nb);
    const [drawn, s] = drawCards(1, shoe);
    const p = [...player, drawn[0]!];
    setPlayer(p);
    setShoe(s);
    const { total } = handValue(p);
    if (total > 21) {
      setPhase("done");
      setRevealDealer(true);
      setMessage(`Doubled and bust with ${total}.`);
    } else {
      setMessage(`Doubled to ${nb} chips.`);
      dealerPlay(p, s, nb);
    }
  }

  function newRound() {
    setPlayer([]);
    setDealer([]);
    setBet(10);
    setPhase("bet");
    setRevealDealer(false);
    setMessage("Place your bet.");
  }

  function resetChips() {
    setBalance(100);
    newRound();
  }

  const pv = handValue(player);
  const dv = handValue(dealer);

  const Hand = ({ cards, hideSecond }: { cards: Card[]; hideSecond?: boolean }) => (
    <div className="flex min-h-[86px] gap-1.5">
      {cards.map((c, i) => (
        <div
          key={`${cardLabel(c)}-${i}`}
          className={`flex h-[86px] w-[62px] flex-col items-center justify-center rounded-lg border border-border bg-surface text-[15px] font-black shadow-lg ${
            isRed(c) ? "text-[#f87171]" : "text-foreground"
          } ${hideSecond && i === 1 ? "animate-pulse bg-[#12233a] text-transparent" : ""}`}
        >
          {hideSecond && i === 1 ? "?" : c.rank}
          <span className="text-[16px]">{hideSecond && i === 1 ? "" : c.suit}</span>
        </div>
      ))}
    </div>
  );

  return (
    <AppShell title="Blackjack">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">♠️ Blackjack</h1>
        <p className="mt-1 text-sm text-muted-foreground">Get closer to 21 than the dealer without busting. Blackjack pays 3:2.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* table */}
        <div className="rounded-2xl border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.04)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dealer {revealDealer && dealer.length > 0 ? `- ${dv.total}` : dealer.length > 0 ? `- ${dealer[0]!.rank === "A" ? 11 : handValue([dealer[0]!]).total}+` : ""}
            </p>
          </div>
          <Hand cards={dealer} hideSecond={!revealDealer && phase !== "bet"} />
          <div className="my-3 border-t border-dashed border-border" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            You {player.length > 0 ? `- ${pv.total}${pv.soft ? " (soft)" : ""}` : ""}
          </p>
          <Hand cards={player} />
        </div>

        {phase === "bet" && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-center text-[13px] text-muted-foreground">Bet: <b className="text-[16px] text-primary">{bet}</b> chips · Balance: <b className="text-foreground">{balance}</b></p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {[5, 10, 25, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setBet((b) => Math.min(b + v, Math.max(balance, 1)))}
                  className="rounded-full bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary hover:bg-primary/20"
                >
                  +{v}
                </button>
              ))}
              <button onClick={() => setBet(10)} className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
                Clear
              </button>
            </div>
            <button onClick={deal} disabled={balance <= 0} className="mt-3 w-full rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90 disabled:opacity-40">
              Deal
            </button>
          </div>
        )}

        {(phase === "player" || phase === "done") && (
          <div className="space-y-2">
            {phase === "player" && (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={hit} className="rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">Hit</button>
                <button onClick={() => dealerPlay(player, shoe)} className="rounded-xl border border-border bg-surface-elevated py-2.5 text-[13px] font-bold text-foreground hover:bg-primary/10">Stand</button>
                <button onClick={double} disabled={balance < bet} className="rounded-xl border border-border bg-surface-elevated py-2.5 text-[13px] font-bold text-foreground hover:bg-primary/10 disabled:opacity-40">Double</button>
              </div>
            )}
            {phase === "done" && (
              <>
                <p className="text-center text-[14px] font-bold text-foreground">{message}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={newRound} className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    <RotateCcw className="size-3.5" /> Next hand
                  </button>
                  <button onClick={resetChips} className="rounded-xl border border-border bg-surface-elevated py-2.5 text-[13px] font-bold text-muted-foreground hover:text-foreground">
                    Reset chips (100)
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {phase === "player" && <p className="text-center text-[12px] text-amber-400">{message}</p>}
        {phase === "dealer" && <p className="text-center text-[12px] text-amber-400">Dealer plays...</p>}
      </div>
    </AppShell>
  );
}
