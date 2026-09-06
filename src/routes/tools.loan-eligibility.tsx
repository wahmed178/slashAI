import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/loan-eligibility")({ component: LoanEligibility });

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function LoanEligibility() {
  const [income, setIncome] = useState(60000);
  const [obligations, setObligations] = useState(5000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);

  // Banks typically allow 40-50% of net income for EMIs; we use 45% minus existing obligations.
  const capacity = Math.max(0, income * 0.45 - obligations);
  const months = years * 12;
  const r = rate / 1200;
  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)  =>  P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const eligible = r > 0 ? (capacity * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months)) : capacity * months;
  const totalInterest = eligible > 0 ? capacity * months - eligible : 0;

  return (
    <AppShell title="Loan Eligibility Checker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏦 Loan Eligibility Checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Estimate how much loan your income supports, at a 45% EMI cap.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div>
            <label className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Monthly net income</span><span className="text-foreground">{fmt.format(income)}</span></label>
            <input type="range" min={10000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Existing EMIs / obligations</span><span className="text-foreground">{fmt.format(obligations)}</span></label>
            <input type="range" min={0} max={200000} step={1000} value={obligations} onChange={(e) => setObligations(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Interest rate</span><span className="text-foreground">{rate}% p.a.</span></label>
            <input type="range" min={5} max={20} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Tenure</span><span className="text-foreground">{years} years</span></label>
            <input type="range" min={1} max={30} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Eligible loan</p>
            <p className="mt-1 text-xl font-black text-primary">{fmt.format(Math.round(eligible))}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Max monthly EMI</p>
            <p className="mt-1 text-xl font-black text-foreground">{fmt.format(Math.round(capacity))}</p>
          </div>
        </div>
        <p className="text-center text-[11.5px] text-muted-foreground">
          Estimated interest over {years} years: {fmt.format(Math.round(Math.max(0, totalInterest)))}. Indicative only - actual eligibility depends on credit score and lender policy.
        </p>
      </div>
    </AppShell>
  );
}
