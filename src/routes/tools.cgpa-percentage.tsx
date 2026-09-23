import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/cgpa-percentage")({ component: CgpaPercentage });

interface Formula {
  key: string;
  label: string;
  /** CGPA -> percentage */
  toPct: (cg: number) => number;
  /** percentage -> CGPA (algebraic inverse) */
  toCg: (pct: number) => number;
  note: string;
}

const FORMULAS: Formula[] = [
  { key: "ugc", label: "UGC / AICTE — most Indian universities & CBSE", toPct: (c) => c * 9.5, toCg: (p) => p / 9.5, note: "Percentage = CGPA × 9.5" },
  { key: "anna", label: "Anna University", toPct: (c) => c * 10, toCg: (p) => p / 10, note: "Percentage = CGPA × 10" },
  { key: "vtu", label: "VTU / JNTU (Kakatiya-style)", toPct: (c) => (c - 0.75) * 10, toCg: (p) => p / 10 + 0.75, note: "Percentage = (CGPA − 0.75) × 10" },
  { key: "gtu", label: "Gujarat Technological University", toPct: (c) => (c - 0.5) * 10, toCg: (p) => p / 10 + 0.5, note: "Percentage = (CGPA − 0.5) × 10" },
  { key: "mumbai7", label: "Mumbai University (7-point)", toPct: (c) => 7.1 * c + 11, toCg: (p) => (p - 11) / 7.1, note: "Percentage = 7.1 × CGPA + 11" },
  {
    key: "linear",
    label: "Custom scale (CGPA out of Max)",
    toPct: (c) => (c / 10) * 100,
    toCg: (p) => (p / 100) * 10,
    note: "Percentage = (CGPA ÷ Max CGPA) × 100 — set Max below",
  },
];

function CgpaPercentage() {
  const [formulaKey, setFormulaKey] = useState<string>(FORMULAS[0]!.key);
  const formula = FORMULAS.find((f) => f.key === formulaKey) ?? FORMULAS[0]!;
  const [maxCg, setMaxCg] = useState("10");
  const [cgpa, setCgpa] = useState("");
  const [percent, setPercent] = useState("");

  const effFormula = useMemo(() => {
    if (formula.key !== "linear") return formula;
    const max = Math.max(1, parseFloat(maxCg) || 10);
    return {
      ...formula,
      toPct: (c: number) => (c / max) * 100,
      toCg: (p: number) => (p / 100) * max,
      note: `Percentage = (CGPA ÷ ${max}) × 100`,
    } satisfies Formula;
  }, [formula, maxCg]);

  const cgNum = parseFloat(cgpa);
  const pctNum = parseFloat(percent);
  const fromCgpa = Number.isFinite(cgNum) && cgNum >= 0;
  const fromPct = Number.isFinite(pctNum) && pctNum >= 0;

  const pctResult = fromCgpa ? effFormula.toPct(cgNum) : null;
  const cgResult = fromPct ? effFormula.toCg(pctNum) : null;

  const grade = (pct: number) =>
    pct >= 90 ? "O / A+ (Outstanding)" : pct >= 80 ? "A (Excellent)" : pct >= 70 ? "B+ (Very Good)" : pct >= 60 ? "B (Good)" : pct >= 50 ? "C (Average)" : pct >= 40 ? "D / P (Pass)" : "F (Fail)";

  return (
    <AppShell title="CGPA to Percentage">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎓 CGPA ⇄ Percentage</h1>
        <p className="mt-1 text-sm text-muted-foreground">Converts both ways using the exact formula your board or university publishes.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <label className="block">
          <span className="text-xs text-muted-foreground">Formula</span>
          <select
            value={formula.key}
            onChange={(e) => setFormulaKey(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground focus:outline-none"
          >
            {FORMULAS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
          <span className="mt-1 block text-xs text-primary">{effFormula.note}</span>
        </label>

        {formula.key === "linear" && (
          <label className="block">
            <span className="text-xs text-muted-foreground">Maximum CGPA on your scale</span>
            <input value={maxCg} onChange={(e) => setMaxCg(e.target.value)} type="number" min={1} step="0.5"
              className="mt-1 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground focus:outline-none" />
          </label>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-semibold text-foreground">CGPA → Percentage</div>
            <input
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 8.6"
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none"
            />
            <div className="mt-3 min-h-14 rounded-xl bg-primary/10 p-3 text-center">
              {pctResult !== null ? (
                <>
                  <div className="text-2xl font-black text-primary">{pctResult.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground">{grade(pctResult)}</div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Enter your CGPA</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-semibold text-foreground">Percentage → CGPA</div>
            <input
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 81.7"
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none"
            />
            <div className="mt-3 min-h-14 rounded-xl bg-primary/10 p-3 text-center">
              {cgResult !== null ? (
                <>
                  <div className="text-2xl font-black text-primary">{cgResult.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">CGPA (out of {formula.key === "linear" ? parseFloat(maxCg) || 10 : 10})</div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Enter your percentage</span>
              )}
            </div>
          </div>
        </div>

        {fromCgpa && fromPct && (
          <p className="text-center text-xs text-amber-400">Both boxes are filled — each side converts independently. Clear one to chain a round-trip.</p>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
