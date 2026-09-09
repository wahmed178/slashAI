import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/would-you-rather")({ component: WouldYouRather });

interface Dilemma {
  a: string;
  b: string;
  emojiA: string;
  emojiB: string;
}

const DILEMMAS: Dilemma[] = [
  { a: "Have the ability to fly", b: "Be invisible", emojiA: "🕊️", emojiB: "👻" },
  { a: "Live without music", b: "Live without movies", emojiA: "🎵", emojiB: "🎬" },
  { a: "Always be 10 minutes late", b: "Always be 20 minutes early", emojiA: "⏰", emojiB: "🕒" },
  { a: "Have unlimited money", b: "Have unlimited time", emojiA: "💰", emojiB: "⏳" },
  { a: "Never use social media again", b: "Never watch TV again", emojiA: "📵", emojiB: "📺" },
  { a: "Be able to talk to animals", b: "Speak every human language", emojiA: "🐾", emojiB: "🗣️" },
  { a: "Live in the mountains", b: "Live by the beach", emojiA: "🏔️", emojiB: "🏖️" },
  { a: "Never have a hangover", b: "Never gain weight", emojiA: "🍺", emojiB: "⚖️" },
  { a: "Have perfect memory", b: "Have perfect intuition", emojiA: "🧠", emojiB: "🔮" },
  { a: "Give up coffee forever", b: "Give up dessert forever", emojiA: "☕", emojiB: "🍰" },
  { a: "Know when you'll die", b: "Know how you'll die", emojiA: "🕰️", emojiB: "💀" },
  { a: "Be a famous inventor", b: "Be a famous artist", emojiA: "💡", emojiB: "🎨" },
  { a: "Teleport anywhere instantly", b: "Read minds at will", emojiA: "🌀", emojiB: "🧠" },
  { a: "Eat only pizza forever", b: "Eat only sushi forever", emojiA: "🍕", emojiB: "🍣" },
  { a: "Lose all your photos", b: "Lose all your messages", emojiA: "📸", emojiB: "💬" },
  { a: "Time travel to the past", b: "Travel to the future", emojiA: "⏪", emojiB: "⏩" },
  { a: "Be the funniest person alive", b: "Be the smartest person alive", emojiA: "😂", emojiB: "🧠" },
  { a: "Never do laundry again", b: "Never wash dishes again", emojiA: "🧺", emojiB: "🍽️" },
  { a: "Live 100 years in the past", b: "Live 100 years in the future", emojiA: "🏛️", emojiB: "🚀" },
  { a: "Have a pause button for life", b: "Have a rewind button", emojiA: "⏸️", emojiB: "⏪" },
  { a: "Only wear one color forever", b: "Only eat one cuisine forever", emojiA: "🎨", emojiB: "🍜" },
  { a: "Be a talented singer", b: "Be a talented dancer", emojiA: "🎤", emojiB: "🕺" },
  { a: "Have free flights forever", b: "Have free hotels forever", emojiA: "✈️", emojiB: "🏨" },
  { a: "Know all world secrets", b: "Have all world leaders owe you a favor", emojiA: "🤫", emojiB: "🤝" },
  { a: "Work alone forever", b: "Work in a crowded open office forever", emojiA: "🚪", emojiB: "👥" },
  { a: "Live without the internet", b: "Live without air conditioning", emojiA: "🌐", emojiB: "❄️" },
  { a: "Be a kid your whole life", b: "Be an adult your whole life", emojiA: "🧒", emojiB: "🧑" },
  { a: "Have a personal chef", b: "Have a personal driver", emojiA: "👨‍🍳", emojiB: "🚗" },
  { a: "Have the ability to teleport", b: "Have the ability to heal", emojiA: "🌀", emojiB: "✨" },
  { a: "Fight one horse-sized duck", b: "Fight 100 duck-sized horses", emojiA: "🦢", emojiB: "🐎" },
];

function WouldYouRather() {
  const [order, setOrder] = useState<number[]>(() => shuffle());
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<"a" | "b" | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [turn, setTurn] = useState<1 | 2>(1);

  function shuffle(): number[] {
    const arr = DILEMMAS.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }

  const q = DILEMMAS[order[index] ?? 0] ?? DILEMMAS[0]!;

  const pick = (side: "a" | "b") => {
    if (chosen) return;
    setChosen(side);
    if (turn === 1) setP1Score((s) => s + 1);
    else setP2Score((s) => s + 1);
  };

  const next = () => {
    setChosen(null);
    setTurn((t) => (t === 1 ? 2 : 1));
    if (index + 1 >= order.length) {
      setOrder(shuffle());
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const reset = () => {
    setOrder(shuffle());
    setIndex(0);
    setChosen(null);
    setP1Score(0);
    setP2Score(0);
    setTurn(1);
  };

  const total = p1Score + p2Score;

  return (
    <AppShell title="Would You Rather">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🤔 Would You Rather</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pass-and-play. The player whose turn it is picks one side, defends their choice out loud, then passes the phone.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm">
          <span className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${turn === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>
            Player 1: {p1Score}
          </span>
          <span className="text-[11px] text-muted-foreground">{total} answered</span>
          <span className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${turn === 2 ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>
            Player 2: {p2Score}
          </span>
        </div>

        <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground">
          PLAYER {turn}'S TURN
        </p>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {(["a", "b"] as const).map((side) => {
            const emoji = side === "a" ? q.emojiA : q.emojiB;
            const text = side === "a" ? q.a : q.b;
            const active = chosen === side;
            return (
              <button
                key={side}
                onClick={() => pick(side)}
                disabled={chosen !== null}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/10 shadow-lg"
                    : chosen === null
                      ? "border-border bg-surface hover:-translate-y-0.5 hover:border-primary/50"
                      : "border-border bg-surface opacity-50"
                }`}
              >
                <span className="text-4xl">{emoji}</span>
                <span className="text-sm font-semibold text-foreground">{text}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="rounded-xl bg-muted/60 p-3.5 text-center">
            <p className="text-sm text-foreground">
              Player {turn} chose <b>{chosen === "a" ? q.a : q.b}</b>. Other player: cross-examine!
            </p>
            <button
              onClick={next}
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Next question
            </button>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset match
          </button>
        </div>
      </div>
    </AppShell>
  );
}
