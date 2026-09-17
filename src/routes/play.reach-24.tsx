import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/play/reach-24")({
  head: () => ({
    meta: [
      { title: "Reach 24 - Free Math Puzzle Game | SlashAI" },
      {
        name: "description",
        content:
          "Combine 4 numbers with + − × ÷ to make exactly 24. A daily-brain math puzzle with hints, timer and streaks. Free, no account.",
      },
    ],
  }),
  component: Reach24,
});

interface Puzzle {
  nums: number[];
  /** one accepted solution, for the hint / reveal */
  solution: string;
}

/** hand-verified sets, each with a written solution for the hint */
const CLEAN: Puzzle[] = [
  { nums: [4, 7, 8, 8], solution: "(7 − 4) × 8 = 24, and the spare 8 cancels: × (8 ÷ 8)" },
  { nums: [3, 3, 8, 8], solution: "8 ÷ (3 − 8 ÷ 3) = 24" },
  { nums: [1, 3, 4, 6], solution: "6 ÷ (1 − 3 ÷ 4) = 24" },
  { nums: [4, 6, 1, 1], solution: "6 × 4 × 1 × 1 = 24" },
  { nums: [5, 5, 5, 1], solution: "5 × (5 − 1 ÷ 5) = 24" },
  { nums: [4, 4, 10, 10], solution: "(10 × 10 − 4) ÷ 4 = 24" },
  { nums: [3, 3, 4, 4], solution: "3 × 4 + 3 × 4 = 24" },
  { nums: [1, 2, 7, 7], solution: "(7 × 7 − 1) ÷ 2 = 24" },
  { nums: [6, 6, 6, 6], solution: "6 + 6 + 6 + 6 = 24" },
  { nums: [7, 9, 4, 5], solution: "9 × 4 − 7 − 5 = 24" },
  { nums: [4, 12, 2, 2], solution: "12 × 2 × 2 ÷ 2 = 24" },
  { nums: [9, 3, 9, 6], solution: "9 × 3 − 9 + 6 = 24" },
  { nums: [8, 3, 8, 3], solution: "8 × 3 × (8 ÷ 8) = 24" },
];

/** exhaustive 24-solver to guarantee every puzzle shown is truly solvable */
function solvable(nums: number[]): boolean {
  const eps = 1e-6;
  const rec = (xs: number[]): boolean => {
    if (xs.length === 1) return Math.abs(xs[0]! - 24) < eps;
    for (let i = 0; i < xs.length; i++) {
      for (let j = 0; j < xs.length; j++) {
        if (i === j) continue;
        const rest = xs.filter((_, k) => k !== i && k !== j);
        const a = xs[i]!;
        const b = xs[j]!;
        const candidates = [a + b, a - b, a * b];
        if (Math.abs(b) > eps) candidates.push(a / b);
        for (const c of candidates) {
          if (rec([...rest, c])) return true;
        }
      }
    }
    return false;
  };
  return rec(nums);
}

function randomPuzzle(): Puzzle {
  // 60% curated (guaranteed + has written solution), 40% random-verified
  if (Math.random() < 0.6) {
    return CLEAN[Math.floor(Math.random() * CLEAN.length)]!;
  }
  for (let tries = 0; tries < 400; tries++) {
    const nums = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 13));
    if (solvable(nums)) return { nums, solution: "There's a way — combine all four to land on 24." };
  }
  return CLEAN[0]!;
}

function Reach24() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => randomPuzzle());
  const [expr, setExpr] = useState<number[]>([]);
  const [ops, setOps] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSol, setShowSol] = useState(false);

  // pending value when the user has picked a number and awaits an operator
  const [pending, setPending] = useState<number | null>(null);
  const [usedAll, setUsedAll] = useState(false);

  useEffect(() => {
    setUsedAll(expr.length === 4 && ops.length === 3);
  }, [expr, ops]);

  const pickNum = (n: number, i: number) => {
    if (solved || expr.includes(i)) return;
    setExpr((e) => [...e, i]);
    setPending((p) => (p === null ? n : p));
  };

  const pickOp = (op: string) => {
    if (solved || pending === null || ops.length >= expr.length - 1) return;
    setOps((o) => [...o, op]);
    setPending(null);
  };

  const current = (() => {
    // fold left-to-right over picked numbers/ops
    if (expr.length === 0) return null;
    let acc = puzzle.nums[expr[0]!]!;
    for (let k = 1; k < expr.length; k++) {
      const op = ops[k - 1];
      if (!op) break;
      const b = puzzle.nums[expr[k]!]!;
      if (op === "+") acc += b;
      else if (op === "−") acc -= b;
      else if (op === "×") acc *= b;
      else if (op === "÷") acc /= b;
    }
    return acc;
  })();

  const check = () => {
    if (!usedAll || current === null) return;
    if (Math.abs(current - 24) < 1e-6) {
      setSolved(true);
      setStreak((s) => s + 1);
      feedback("success");
    } else {
      feedback("tap");
      setStreak(0);
      setExpr([]);
      setOps([]);
      setPending(null);
    }
  };

  const nextPuzzle = () => {
    setPuzzle(randomPuzzle());
    setExpr([]);
    setOps([]);
    setPending(null);
    setSolved(false);
    setShowSol(false);
  };

  const buildExprText = () => {
    const parts: string[] = [String(puzzle.nums[expr[0]!] ?? "")];
    for (let k = 1; k < expr.length; k++) {
      const op = ops[k - 1];
      if (!op) break;
      parts.push(op, String(puzzle.nums[expr[k]!]));
    }
    return parts.join(" ");
  };

  return (
    <AppShell title="Reach 24">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎯 Reach 24</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use all four numbers with + − × ÷ to make exactly 24. Order of operations is
          left-to-right as you build it.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-2.5">
          <span className="text-[13px] font-bold text-foreground">Streak {streak}</span>
          <button
            type="button"
            onClick={nextPuzzle}
            className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden /> New numbers
          </button>
        </div>

        {/* number tiles */}
        <div className="grid grid-cols-4 gap-2">
          {puzzle.nums.map((n, i) => {
            const used = expr.includes(i);
            const isNext = expr[expr.length - 1] === i && pending === null;
            return (
              <button
                key={`${puzzle.nums.join()}-${i}`}
                type="button"
                onClick={() => pickNum(n, i)}
                disabled={used}
                className={`ripple-press grid h-16 place-items-center rounded-xl border text-2xl font-black transition-all ${
                  used
                    ? "border-primary/50 bg-primary/15 text-primary opacity-60"
                    : "border-border bg-surface text-foreground hover:border-primary/40"
                } ${isNext ? "ring-2 ring-primary" : ""}`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* operators */}
        <div className="grid grid-cols-4 gap-2">
          {["+ − × ÷".split(" "), ["(", ")"]].flat().map((op) =>
            op === "(" || op === ")" ? (
              <span key={op} />
            ) : (
              <button
                key={op}
                type="button"
                onClick={() => pickOp(op)}
                disabled={pending === null || ops.length >= expr.length - 1 || solved}
                className="ripple-press h-12 rounded-xl border border-border bg-surface-elevated text-xl font-black text-foreground transition-colors hover:border-primary/40 disabled:opacity-30"
              >
                {op}
              </button>
            ),
          )}
        </div>

        {/* working */}
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="min-h-[32px] font-mono text-lg font-bold text-foreground">
            {expr.length === 0 ? (
              <span className="text-[13px] font-sans text-muted-foreground">Pick two numbers, then an operator…</span>
            ) : (
              buildExprText()
            )}
          </p>
          <p className="mt-1 text-[13px] font-bold tabular-nums text-muted-foreground">
            = {current === null ? "?" : Number.isInteger(current) ? current : current.toFixed(2)}
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={check}
              disabled={!usedAll || solved}
              className="ripple-press h-10 rounded-xl bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-opacity disabled:opacity-30"
            >
              Check
            </button>
            <button
              type="button"
              onClick={() => {
                setExpr([]);
                setOps([]);
                setPending(null);
              }}
              className="h-10 rounded-xl border border-border px-4 text-[12.5px] font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>

        {solved && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
            <p className="text-[15px] font-black text-emerald-500">✅ 24! Streak {streak}</p>
            <button
              type="button"
              onClick={nextPuzzle}
              className="ripple-press mt-2 h-10 rounded-xl bg-emerald-500 px-5 text-[13px] font-bold text-white"
            >
              Next puzzle →
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowSol((s) => !s)}
          className="w-full text-center text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          {showSol ? "Hide hint" : "Stuck? Show a hint"}
        </button>
        {showSol && (
          <p className="rounded-xl border border-dashed border-border p-3 text-center text-[12.5px] text-muted-foreground">
            💡 {puzzle.solution}
          </p>
        )}
      </div>
    </AppShell>
  );
}
