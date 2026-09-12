import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/interest-calculator")({ component: InterestCalculator });

function InterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");

  const { simple, compound, diff } = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const s = p * r * t;
    const c = p * Math.pow(1 + r, t) - p;
    return { simple: s, compound: c, diff: c - s };
  }, [principal, rate, years]);

  const inr = (n: number) =>
    "₹" + Math.round(n).toLocaleString("en-IN");

  return (
    <AppShell title="Interest Calculator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📈 Interest Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Simple vs compound interest, side by side.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        {[
          { label: "Principal amount", value: principal, set: setPrincipal, pre: "₹" },
          { label: "Interest rate (% per year)", value: rate, set: setRate, pre: "%" },
          { label: "Time period (years)", value: years, set: setYears, pre: "y" },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1 block text-xs text-muted-foreground">{f.label}</label>
            <input
              type="number"
              inputMode="decimal"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-lg font-bold focus:outline-none focus:border-primary"
            />
          </div>
        ))}
        <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Simple interest earned</span>
            <span className="font-bold text-foreground">{inr(simple)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Compound interest earned</span>
            <span className="font-bold text-primary">{inr(compound)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-sm">
            <span className="text-muted-foreground">Compounding advantage</span>
            <span className="font-bold text-emerald-400">+{inr(diff)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-sm">
            <span className="text-muted-foreground">Total value (compound)</span>
            <span className="text-lg font-bold text-foreground">
              {inr((parseFloat(principal) || 0) + compound)}
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
