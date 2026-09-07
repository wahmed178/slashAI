import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/word-guess")({ component: WordGuess });

const WORDS = [
  "ABOUT", "BRAVE", "CHASE", "DREAM", "EAGER", "FLAME", "GLIDE", "HONOR", "IVORY", "JOKER",
  "KNACK", "LEMON", "MIRTH", "NOBLE", "OASIS", "PRIDE", "QUEST", "RAPID", "STORM", "TIGER",
  "ULTRA", "VIVID", "WHALE", "XENON", "YACHT", "ZEBRA", "ANGLE", "BLEND", "CRISP", "DRIFT",
  "ELBOW", "FROST", "GRAPE", "HOVER", "INPUT", "JUICE", "KOALA", "LUCKY", "MANGO", "NORTH",
  "OLIVE", "PLAZA", "QUARK", "RIDGE", "SOLAR", "TRACE", "URBAN", "VAPOR", "WIDOW", "YIELD",
  "ZESTY", "AMBER", "BRAID", "CLOUD", "DONOR", "EPOCH", "FLINT", "GHOST", "HASTE", "IDEAL",
];

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const TRIES = 6;

type Feedback = "hit" | "near" | "miss";

function grade(guess: string, answer: string): Feedback[] {
  const result: Feedback[] = Array(guess.length).fill("miss");
  const pool = answer.split("");
  // greens first
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "hit";
      pool[i] = "";
    }
  }
  // then yellows
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "hit") continue;
    const idx = pool.indexOf(guess[i]!);
    if (idx >= 0 && guess[i] !== answer[i]) {
      result[i] = "near";
      pool[idx] = "";
    }
  }
  return result;
}

const FEED_STYLES: Record<Feedback, string> = {
  hit: "bg-primary text-background border-primary",
  near: "bg-amber-500/80 text-background border-amber-500",
  miss: "bg-surface-elevated text-muted-foreground border-border",
};

function WordGuess() {
  const [answer, setAnswer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]!);
  const [rows, setRows] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("wordguess-streak")) || 0);

  const gradeCache = rows.map((r) => grade(r, answer));
  const letterStates: Record<string, Feedback> = {};
  for (let r = 0; r < rows.length; r++) {
    const g = rows[r]!;
    for (let i = 0; i < g.length; i++) {
      const f = gradeCache[r]![i]!;
      const cur = letterStates[g[i]!];
      if (f === "hit" || cur === undefined || (f === "near" && cur === "miss")) letterStates[g[i]!] = f;
    }
  }

  function submit() {
    if (status !== "playing") return;
    if (draft.length !== 5) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const nextRows = [...rows, draft];
    setRows(nextRows);
    setDraft("");
    if (draft === answer) {
      setStatus("won");
      const s = streak + 1;
      setStreak(s);
      localStorage.setItem("wordguess-streak", String(s));
    } else if (nextRows.length >= TRIES) {
      setStatus("lost");
      setStreak(0);
      localStorage.setItem("wordguess-streak", "0");
    }
  }

  function press(k: string) {
    if (status !== "playing") return;
    if (k === "↵") return submit();
    if (k === "⌫") return setDraft((d) => d.slice(0, -1));
    if (draft.length < 5) setDraft((d) => d + k);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") press("↵");
      else if (e.key === "Backspace") press("⌫");
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, status, rows]);

  function next() {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]!);
    setRows([]);
    setDraft("");
    setStatus("playing");
  }

  return (
    <AppShell title="Word Guess">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📝 Word Guess</h1>
        <p className="mt-1 text-sm text-muted-foreground">Crack the 5-letter word in {TRIES} tries. 🟩 right spot · 🟨 wrong spot.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <p className="text-center text-[12px] text-muted-foreground">
          Streak: <b className="text-primary">{streak}</b>
        </p>

        {/* grid */}
        <div className={`mx-auto grid w-fit gap-1.5 ${shake ? "animate-bounce" : ""}`}>
          {Array.from({ length: TRIES }, (_, r) => {
            const word = rows[r] ?? (r === rows.length ? draft : "");
            const filled = rows[r] !== undefined;
            return (
              <div key={r} className="flex gap-1.5">
                {Array.from({ length: 5 }, (_, c) => {
                  const ch = word[c] ?? "";
                  return (
                    <span
                      key={c}
                      className={`flex size-11 items-center justify-center rounded-lg border-2 text-[18px] font-black uppercase sm:size-12 ${
                        filled ? FEED_STYLES[gradeCache[r]![c]!] : ch ? "border-foreground/40 text-foreground" : "border-border text-foreground"
                      }`}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {status === "won" && (
          <p className="text-center text-[15px] font-black text-primary">
            🎉 Nailed it{rows.length === 1 ? " in one guess!" : ` in ${rows.length} tries!`}
          </p>
        )}
        {status === "lost" && <p className="text-center text-[15px] font-black text-rose-400">The word was {answer}.</p>}

        {/* keyboard */}
        <div className="space-y-1.5">
          {KEYS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {ri === 2 && (
                <button onClick={() => press("↵")} className="rounded-md bg-primary/20 px-2.5 text-[11px] font-bold text-primary hover:bg-primary/30">
                  ↵
                </button>
              )}
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  disabled={status !== "playing"}
                  className={`h-11 min-w-[8.5%] flex-1 rounded-md text-[13px] font-bold transition-colors ${
                    letterStates[k] ? FEED_STYLES[letterStates[k]] : "border border-border bg-surface text-foreground hover:bg-primary/10"
                  }`}
                >
                  {k}
                </button>
              ))}
              {ri === 2 && (
                <button onClick={() => press("⌫")} className="rounded-md bg-primary/20 px-2.5 text-[11px] font-bold text-primary hover:bg-primary/30">
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>

        {status !== "playing" && (
          <button onClick={next} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
            <RotateCcw className="size-3.5" /> Next word
          </button>
        )}
      </div>
    </AppShell>
  );
}
