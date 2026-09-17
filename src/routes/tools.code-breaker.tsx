import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/tools/code-breaker")({
  head: () => ({
    meta: [
      { title: "Code Breaker (Mastermind) - Free Browser Game Tool | SlashAI" },
      {
        name: "description",
        content:
          "Crack the hidden 4-colour code in 8 guesses. Black pegs for right colour + position, white for right colour wrong spot. Free, no account.",
      },
    ],
  }),
  component: CodeBreakerTool,
});

const COLORS = [
  { hex: "#f87171", name: "Red" },
  { hex: "#60a5fa", name: "Blue" },
  { hex: "#4ade80", name: "Green" },
  { hex: "#fbbf24", name: "Yellow" },
  { hex: "#a78bfa", name: "Purple" },
  { hex: "#fb923c", name: "Orange" },
];

const CODE_LEN = 4;
const MAX_GUESSES = 8;

function randomCode(): number[] {
  const code: number[] = [];
  for (let i = 0; i < CODE_LEN; i++) code.push(Math.floor(Math.random() * COLORS.length));
  return code;
}

interface Guess {
  pegs: number[];
  black: number;
  white: number;
}

function scoreGuess(code: number[], guess: number[]): { black: number; white: number } {
  let black = 0;
  const codeLeft: number[] = [];
  const guessLeft: number[] = [];
  for (let i = 0; i < CODE_LEN; i++) {
    if (guess[i] === code[i]) black += 1;
    else {
      codeLeft.push(code[i]!);
      guessLeft.push(guess[i]!);
    }
  }
  let white = 0;
  const pool = new Map<number, number>();
  for (const c of codeLeft) pool.set(c, (pool.get(c) ?? 0) + 1);
  for (const g of guessLeft) {
    const n = pool.get(g) ?? 0;
    if (n > 0) {
      white += 1;
      pool.set(g, n - 1);
    }
  }
  return { black, white };
}

function CodeBreakerTool() {
  const [code, setCode] = useState<number[]>(randomCode);
  const [guess, setGuess] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [won, setWon] = useState(false);
  const [reveal, setReveal] = useState(false);

  const maxPegs = useMemo(() => Math.max(...guesses.map((g) => g.pegs.length), 0), [guesses]);
  void maxPegs;

  const addPeg = (c: number) => {
    if (won || guesses.length >= MAX_GUESSES) return;
    if (guess.length >= CODE_LEN) return;
    feedback("tap");
    setGuess((g) => [...g, c]);
  };

  const submit = () => {
    if (guess.length !== CODE_LEN) return;
    const s = scoreGuess(code, guess);
    const next = [...guesses, { pegs: guess, black: s.black, white: s.white }];
    setGuesses(next);
    setGuess([]);
    if (s.black === CODE_LEN) {
      setWon(true);
      feedback("success");
    }
  };

  const newGame = () => {
    setCode(randomCode());
    setGuess([]);
    setGuesses([]);
    setWon(false);
    setReveal(false);
  };

  const solved = won;
  const failed = !won && guesses.length >= MAX_GUESSES;

  return (
    <AppShell title="Code Breaker">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔐 Code Breaker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crack the hidden 4-colour code in {MAX_GUESSES} guesses. Colours can repeat.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* status */}
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          {solved ? (
            <p className="text-[15px] font-black text-emerald-500">🏆 Cracked it in {guesses.length}!</p>
          ) : failed ? (
            <div>
              <p className="text-[15px] font-black text-rose-500">Out of guesses</p>
              <div className="mt-2 flex justify-center gap-2">
                {code.map((c, i) => (
                  <span
                    key={i}
                    className="size-7 rounded-full border border-border"
                    style={{ background: COLORS[c]!.hex }}
                    aria-label={COLORS[c]!.name}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              Guess {guesses.length + 1} of {MAX_GUESSES}
              {reveal && (
                <span className="ml-2 flex justify-center gap-2">
                  {code.map((c, i) => (
                    <span key={i} className="size-5 rounded-full" style={{ background: COLORS[c]!.hex }} />
                  ))}
                </span>
              )}
            </p>
          )}
        </div>

        {/* board */}
        <div className="space-y-2">
          {[...guesses].reverse().map((g, ri) => (
            <div key={ri} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="w-5 shrink-0 text-center text-[11px] font-bold text-muted-foreground">
                {guesses.length - ri}
              </span>
              <div className="flex gap-1.5">
                {g.pegs.map((c, i) => (
                  <span
                    key={i}
                    className="size-7 rounded-full border border-border"
                    style={{ background: COLORS[c]!.hex }}
                  />
                ))}
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                {Array.from({ length: g.black }, (_, i) => (
                  <span key={`b${i}`} className="size-3 rounded-full bg-foreground" title="right colour, right spot" />
                ))}
                {Array.from({ length: g.white }, (_, i) => (
                  <span key={`w${i}`} className="size-3 rounded-full border-2 border-foreground bg-transparent" title="right colour, wrong spot" />
                ))}
                {g.black === 0 && g.white === 0 && (
                  <span className="text-[10.5px] text-muted-foreground">nothing matches</span>
                )}
              </div>
            </div>
          ))}
          {guesses.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12.5px] text-muted-foreground">
              Pick 4 colours below to make your first guess
            </p>
          )}
        </div>

        {/* palette + submit */}
        {!solved && !failed && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-wrap justify-center gap-2.5">
              {COLORS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => addPeg(i)}
                  aria-label={`Add ${c.name}`}
                  className="size-10 rounded-full border-2 border-border transition-transform hover:scale-110 active:scale-95"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="mr-2 flex gap-1.5">
                {Array.from({ length: CODE_LEN }, (_, i) => (
                  <span
                    key={i}
                    className={`size-7 rounded-full border ${guess[i] !== undefined ? "border-border" : "border-dashed border-border"}`}
                    style={{ background: guess[i] !== undefined ? COLORS[guess[i]!]!.hex : "transparent" }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGuess((g) => g.slice(0, -1))}
                disabled={guess.length === 0}
                className="h-9 rounded-lg border border-border px-3 text-[12px] font-bold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={guess.length !== CODE_LEN}
                className="ripple-press h-9 rounded-lg bg-primary px-4 text-[12.5px] font-bold text-primary-foreground transition-opacity disabled:opacity-30"
              >
                Guess
              </button>
            </div>
          </div>
        )}

        {(solved || failed) && (
          <button
            type="button"
            onClick={newGame}
            className="ripple-press h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Play again
          </button>
        )}

        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-[13px] font-bold text-foreground">Peg legend</h2>
          <p className="mt-1.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <span className="size-3 rounded-full bg-foreground" /> right colour, right position
          </p>
          <p className="mt-1 flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <span className="size-3 rounded-full border-2 border-foreground" /> right colour, wrong position
          </p>
        </div>
      </div>
    </AppShell>
  );
}
