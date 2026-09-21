import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/mastermind")({ component: Mastermind });

/**
 * Mastermind — break a hidden colour code in ten guesses. The little pegs tell
 * you how many colours are right in the right place (black) and how many are
 * right but in the wrong place (white) — the real 1970s scoring, not a lookup.
 */

const COLOURS = [
  { key: "R", hex: "#ef4444", name: "Red" },
  { key: "G", hex: "#22c55e", name: "Green" },
  { key: "B", hex: "#3b82f6", name: "Blue" },
  { key: "Y", hex: "#eab308", name: "Yellow" },
  { key: "P", hex: "#a855f7", name: "Purple" },
  { key: "O", hex: "#f97316", name: "Orange" },
];

const RULES = { Easy: { len: 4, palette: 4, guesses: 10 }, Medium: { len: 4, palette: 5, guesses: 10 }, Hard: { len: 5, palette: 6, guesses: 8 } } as const;
type Level = keyof typeof RULES;

interface Guess { code: string[]; exact: number; partial: number }

function score(secret: string[], guess: string[]): { exact: number; partial: number } {
  let exact = 0;
  const sLeft: string[] = [];
  const gLeft: string[] = [];
  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) exact += 1;
    else {
      sLeft.push(secret[i]!);
      gLeft.push(guess[i]!);
    }
  }
  let partial = 0;
  for (const c of gLeft) {
    const idx = sLeft.indexOf(c);
    if (idx >= 0) {
      partial += 1;
      sLeft.splice(idx, 1);
    }
  }
  return { exact, partial };
}

function Mastermind() {
  const [level, setLevel] = useState<Level>("Medium");
  const [secret, setSecret] = useState<string[]>(() => newCode(level));
  const [current, setCurrent] = useState<string[]>([]);
  const [history, setHistory] = useState<Guess[]>([]);
  const [state, setState] = useState<"playing" | "won" | "lost">("playing");
  const [wins, setWins] = useState(() => Number(localStorage.getItem("slashai.mastermind.wins")) || 0);

  function palette(l: Level) {
    return COLOURS.slice(0, RULES[l].palette);
  }
  function newCode(l: Level): string[] {
    const p = palette(l).map((c) => c.key);
    return Array.from({ length: RULES[l].len }, () => p[Math.floor(Math.random() * p.length)]!);
  }

  const restart = useCallback((l: Level) => {
    setLevel(l);
    setSecret(newCode(l));
    setCurrent([]);
    setHistory([]);
    setState("playing");
  }, []);

  const submit = () => {
    if (state !== "playing") return;
    if (current.length !== RULES[level].len) return;
    const s = score(secret, current);
    const next = [...history, { code: current, ...s }];
    setHistory(next);
    setCurrent([]);
    if (s.exact === RULES[level].len) {
      setState("won");
      const n = wins + 1;
      setWins(n);
      localStorage.setItem("slashai.mastermind.wins", String(n));
      return;
    }
    if (next.length >= RULES[level].guesses) setState("lost");
  };

  const colourOf = (k: string) => COLOURS.find((c) => c.key === k)?.hex ?? "#64748b";
  const slots = RULES[level].len;

  return (
    <AppShell title="Mastermind">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧠 Mastermind</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crack the hidden code. Black peg = right colour, right spot. White peg = right colour, wrong spot.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Guess</p>
            <p className="text-[18px] font-black text-foreground">
              {history.length}/{RULES[level].guesses}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Colours</p>
            <p className="text-[18px] font-black text-foreground">{RULES[level].palette}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Solves</p>
            <p className="text-[18px] font-black text-primary">{wins}</p>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl border border-border bg-surface p-3">
          {secret.map((k, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-[11px] font-bold text-muted-foreground">#{i + 1}</span>
              <span
                className="size-7 rounded-full border border-black/40"
                style={{ background: state === "playing" ? "#1f2937" : colourOf(k) }}
              />
            </div>
          ))}
          <p className="pt-1 text-[10.5px] text-muted-foreground">
            {state === "playing" ? "The code is hidden until the round ends." : `The code was ${secret.join(" ")}.`}
          </p>
        </div>

        {/* history */}
        <div className="space-y-1.5">
          {history
            .slice()
            .reverse()
            .map((g, ri) => (
              <div key={ri} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
                {g.code.map((k, i) => (
                  <span key={i} className="size-6 rounded-full border border-black/40" style={{ background: colourOf(k) }} />
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="rounded bg-foreground/15 px-1.5 py-0.5 text-foreground">{g.exact} ●</span>
                  <span className="rounded bg-foreground/8 px-1.5 py-0.5 text-muted-foreground">{g.partial} ○</span>
                </span>
              </div>
            ))}
        </div>

        {/* current row */}
        {state === "playing" && (
          <>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-3">
              {Array.from({ length: slots }, (_, i) => (
                <span
                  key={i}
                  className="size-9 rounded-full border border-dashed border-border"
                  style={{ background: current[i] ? colourOf(current[i]!) : "transparent" }}
                />
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {palette(level).map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    if (current.length < slots) setCurrent([...current, c.key]);
                  }}
                  aria-label={c.name}
                  className="size-10 rounded-full border-2 border-black/30 transition-transform hover:scale-110 active:scale-95"
                  style={{ background: c.hex }}
                />
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrent([])}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setCurrent(current.slice(0, -1))}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Undo
              </button>
              <button
                onClick={submit}
                disabled={current.length !== slots}
                className="rounded-lg bg-primary px-5 py-2 text-[12px] font-bold text-background disabled:opacity-40"
              >
                Check code
              </button>
            </div>
          </>
        )}

        {state !== "playing" && (
          <div className={`rounded-xl border p-4 text-center ${state === "won" ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}`}>
            <p className={`text-[15px] font-bold ${state === "won" ? "text-emerald-400" : "text-red-400"}`}>
              {state === "won" ? `🏆 Cracked it in ${history.length} guess${history.length === 1 ? "" : "es"}!` : "😤 Out of guesses"}
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">The code was {secret.join(" ")}.</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1.5">
          {(Object.keys(RULES) as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => restart(l)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => restart(level)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            ↻ New code
          </button>
        </div>
      </div>
    </AppShell>
  );
}
