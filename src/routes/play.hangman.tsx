import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/hangman")({ component: Hangman });

const WORDS: { word: string; hint: string }[] = [
  { word: "PYTHON", hint: "Programming language" },
  { word: "KEYBOARD", hint: "You type on it" },
  { word: "GALAXY", hint: "Milky Way, for one" },
  { word: "VOLCANO", hint: "It erupts" },
  { word: "PENGUIN", hint: "Bird that swims" },
  { word: "DIAMOND", hint: "Hardest gem" },
  { word: "LIBRARY", hint: "Full of books" },
  { word: "THUNDER", hint: "Follows lightning" },
  { word: "PANCAKE", hint: "Breakfast stack" },
  { word: "JUNGLE", hint: "Dense forest" },
  { word: "COMPASS", hint: "Always points north" },
  { word: "MIRROR", hint: "It reflects" },
  { word: "TURTLE", hint: "Slow and shelled" },
  { word: "ORCHESTRA", hint: "Many musicians" },
  { word: "BLIZZARD", hint: "Fierce snowstorm" },
  { word: "LANTERN", hint: "Portable light" },
  { word: "PICTURE", hint: "Worth 1,000 words" },
  { word: "SANDWICH", hint: "Filling between bread" },
  { word: "TRIANGLE", hint: "Three sides" },
  { word: "CAMERA", hint: "Captures moments" },
  { word: "RAINBOW", hint: "Seven colors" },
  { word: "ENGINE", hint: "Heart of a car" },
  { word: "PUZZLE", hint: "It has pieces" },
  { word: "VOLLEYBALL", hint: "Net sport" },
  { word: "CHOCOLATE", hint: "Sweet cocoa treat" },
  { word: "STADIUM", hint: "Big sports arena" },
  { word: "WHISPER", hint: "Very quiet talk" },
  { word: "OCTOPUS", hint: "Eight arms" },
  { word: "MAGNET", hint: "Attracts iron" },
  { word: "ANCHOR", hint: "Holds a ship" },
  { word: "AVENGER", hint: "Marvel hero type" },
  { word: "BICYCLE", hint: "Two wheels" },
  { word: "CACTUS", hint: "Prickly desert plant" },
  { word: "DOLPHIN", hint: "Clever sea mammal" },
  { word: "ELEPHANT", hint: "Largest land animal" },
  { word: "FIREWORK", hint: "Lights up the sky" },
  { word: "GLACIER", hint: "Slow river of ice" },
  { word: "HURRICANE", hint: "Massive storm" },
  { word: "ISLAND", hint: "Land in water" },
  { word: "JAVASCRIPT", hint: "Language of the web" },
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const STAGES = 6;

function Hangman() {
  const [entry, setEntry] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]!);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [score, setScore] = useState({ wins: 0, losses: 0 });

  const word = entry.word;
  const wrong = guessed.filter((g) => !word.includes(g));
  const lives = STAGES - wrong.length;
  const won = word.split("").every((ch) => guessed.includes(ch));
  const lost = lives <= 0;

  function guess(letter: string) {
    if (won || lost || guessed.includes(letter)) return;
    setGuessed((g) => [...g, letter]);
  }

  useEffect(() => {
    if (won) setScore((s) => ({ ...s, wins: s.wins + 1 }));
    else if (lost) setScore((s) => ({ ...s, losses: s.losses + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won, lost]);

  function next() {
    setEntry(WORDS[Math.floor(Math.random() * WORDS.length)]!);
    setGuessed([]);
  }

  // simple hangman figure built from characters
  const figure = [
    "  +---+",
    "  |   |",
    wrong.length >= 1 ? "  O   |" : "      |",
    wrong.length >= 3 ? " /|\\  |" : wrong.length >= 2 ? "  |   |" : "      |",
    wrong.length >= 5 ? " / \\  |" : wrong.length >= 4 ? " /    |" : "      |",
    "      |",
    "=========",
  ];

  return (
    <AppShell title="Hangman">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔤 Hangman</h1>
        <p className="mt-1 text-sm text-muted-foreground">Guess the word one letter at a time - {STAGES} wrong guesses and you're out.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-surface px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wins</p>
            <p className="text-[18px] font-black text-primary">{score.wins}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Losses</p>
            <p className="text-[18px] font-black text-rose-400">{score.losses}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
          <pre className="text-[11px] leading-[1.35] text-muted-foreground sm:text-[13px]">{figure.join("\n")}</pre>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Hint</p>
            <p className="mt-0.5 text-[14px] font-semibold text-foreground">{won || lost ? word : entry.hint}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Lives: <b className="text-primary">{"❤️".repeat(Math.max(lives, 0))}{"🤍".repeat(Math.max(STAGES - Math.max(lives, 0), 0))}</b></p>
          </div>
        </div>

        {/* word display */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {word.split("").map((ch, i) => (
            <span
              key={i}
              className={`flex h-11 w-8 items-center justify-center border-b-2 text-[18px] font-black sm:w-9 ${
                guessed.includes(ch) || lost
                  ? guessed.includes(ch)
                    ? "border-primary text-primary"
                    : "border-rose-400 text-rose-400"
                  : "border-border text-transparent"
              }`}
            >
              {guessed.includes(ch) || lost ? ch : "?"}
            </span>
          ))}
        </div>

        {won && <p className="text-center text-[15px] font-black text-primary">🎉 You got it!</p>}
        {lost && <p className="text-center text-[15px] font-black text-rose-400">It was "{word}". Next one's yours.</p>}

        {/* keyboard */}
        <div className="grid grid-cols-7 gap-1.5">
          {ALPHA.map((letter) => {
            const used = guessed.includes(letter);
            const hit = used && word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => guess(letter)}
                disabled={used || won || lost}
                className={`rounded-lg py-2 text-[13px] font-bold transition-colors ${
                  hit
                    ? "bg-primary/20 text-primary"
                    : used
                      ? "bg-surface-elevated text-muted-foreground line-through"
                      : "border border-border bg-surface text-foreground hover:bg-primary/10"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <button onClick={next} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
          <RotateCcw className="size-3.5" /> {won || lost ? "Next word" : "Skip word"}
        </button>
      </div>
    </AppShell>
  );
}
