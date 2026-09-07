import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/math-duel")({ component: MathDuel });

const TARGET = 10;

interface Round {
  text: string;
  ans: number;
  opts: number[];
}

function makeQuestion(total: number) {
  const hard = total >= TARGET - 3;
  const pick = Math.random();
  if (pick < 0.38) {
    const max = hard ? 60 : 20;
    const a = 2 + Math.floor(Math.random() * max);
    const b = 2 + Math.floor(Math.random() * max);
    return { text: `${a} + ${b}`, ans: a + b };
  }
  if (pick < 0.72) {
    const a = 5 + Math.floor(Math.random() * (hard ? 70 : 25));
    const b = 1 + Math.floor(Math.random() * (a - 1));
    return { text: `${a} - ${b}`, ans: a - b };
  }
  const a = 2 + Math.floor(Math.random() * (hard ? 9 : 5));
  const b = 2 + Math.floor(Math.random() * (hard ? 9 : 4));
  return { text: `${a} × ${b}`, ans: a * b };
}

function makeOptions(ans: number) {
  const set = new Set<number>([ans]);
  while (set.size < 3) {
    const delta = 1 + Math.floor(Math.random() * 5);
    const cand = Math.random() < 0.5 ? ans - delta : ans + delta;
    if (cand >= 0) set.add(cand);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

function newRound(total: number): Round {
  const q = makeQuestion(total);
  return { ...q, opts: makeOptions(q.ans) };
}

function MathDuel() {
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [round, setRound] = useState<Round>(() => newRound(0));
  const [flash, setFlash] = useState<{ p: 0 | 1; ok: boolean } | null>(null);
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const busy = useRef(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function reset() {
    window.clearTimeout(timer.current);
    setScores([0, 0]);
    setRound(newRound(0));
    setFlash(null);
    setWinner(null);
    busy.current = false;
  }

  function tap(p: 0 | 1, v: number) {
    if (busy.current || winner !== null) return;
    busy.current = true;
    const ok = v === round.ans;
    const scorer: 0 | 1 = ok ? p : p === 0 ? 1 : 0;
    setFlash({ p: scorer, ok });
    const next: [number, number] = [scores[0]!, scores[1]!];
    next[scorer] = next[scorer]! + 1;
    setScores(next);
    timer.current = window.setTimeout(() => {
      if (next[scorer]! >= TARGET) {
        setWinner(scorer);
      } else {
        setRound(newRound(next[0]! + next[1]!));
        setFlash(null);
      }
      busy.current = false;
    }, 480);
  }

  // reshuffle only when the round changes, never on flash re-renders
  const topRow = round.opts;
  const bottomRow = useMemo(() => [...round.opts].sort(() => Math.random() - 0.5), [round]);

  function pad(p: 0 | 1, opts: number[]) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {opts.map((v, i) => {
          const isFlash = flash?.p === p;
          return (
            <button
              key={`${v}-${i}`}
              onClick={() => tap(p, v)}
              disabled={winner !== null}
              className={`rounded-xl border py-3.5 text-[17px] font-bold transition-colors ${
                isFlash && flash.ok
                  ? "border-primary bg-primary/20 text-primary"
                  : isFlash
                    ? "border-[#f87171]/40 bg-[#f87171]/10 text-[#f87171]"
                    : "border-border bg-surface text-foreground hover:border-primary/40"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <AppShell title="Math Duel">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">➗ Math Duel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Same question, two pads. Tap the correct answer first to score - a wrong answer hands your
          rival the point. First to {TARGET} wins.
        </p>
      </header>

      <div className="relative mx-auto max-w-md space-y-3">
        {/* Player 2 (top) */}
        <div className="rounded-2xl border border-[#f87171]/25 bg-[#f87171]/5 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#f87171]">🔴 Player 2</span>
            <span className="text-[15px] font-black text-foreground">{scores[1]}</span>
          </div>
          {pad(1, topRow)}
        </div>

        {/* Equation */}
        <div className="rounded-2xl border border-border bg-surface py-5 text-center">
          <p className="text-[30px] font-black tracking-wide text-foreground">{round.text} = ?</p>
          {flash && (
            <p className={`mt-1.5 text-[12px] font-bold ${flash.ok ? "text-primary" : "text-[#f87171]"}`}>
              {flash.ok ? `Player ${flash.p + 1} scores!` : `Wrong - point to Player ${flash.p + 1}`}
            </p>
          )}
        </div>

        {/* Player 1 (bottom) */}
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[15px] font-black text-foreground">{scores[0]}</span>
            <span className="text-[12px] font-bold text-primary">Player 1 🔵</span>
          </div>
          {pad(0, bottomRow)}
        </div>

        {winner !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/70">
            <p className="text-[20px] font-black text-foreground">Player {winner + 1} wins! 🎉</p>
            <p className="text-[13px] text-muted-foreground">{scores[0]} - {scores[1]}</p>
            <button onClick={reset} className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
              <RotateCcw className="size-3.5" /> Rematch
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
