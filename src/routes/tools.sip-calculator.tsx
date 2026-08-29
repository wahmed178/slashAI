import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/sip-calculator")({
  head: () => ({ meta: [{ title: "SIP Calculator \u2014 SlashAI" }] }),
  component: SipCalculator,
});

function formatINR(n: number): string {
  return "\u20b9" + Math.round(n).toLocaleString("en-IN");
}

function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const invested = monthly * n;
    const future = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
    return { invested, returns: future - invested, total: future };
  }, [monthly, rate, years]);

  const invPct = result.total > 0 ? (result.invested / result.total) * 100 : 50;

  return (
    <AppShell title="SIP Calculator" back={{ to: "/tools", label: "SlashKit" }}>
      <div className="mt-4 space-y-5">
        {/* Inputs */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Monthly investment</span>
              <span className="font-mono font-medium text-primary">{formatINR(monthly)}</span>
            </label>
            <input type="range" min={500} max={100000} step={500} value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Expected annual return</span>
              <span className="font-mono font-medium text-primary">{rate}%</span>
            </label>
            <input type="range" min={1} max={30} value={rate}
              onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Investment period</span>
              <span className="font-mono font-medium text-primary">{years} years</span>
            </label>
            <input type="range" min={1} max={40} value={years}
              onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          {/* Donut chart */}
          <div className="relative mx-auto size-40">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#21262d" strokeWidth="14" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#58a6ff" strokeWidth="14"
                strokeDasharray={`${invPct * 3.14} ${(100 - invPct) * 3.14}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-primary">{formatINR(result.total)}</span>
              <span className="text-[11px] text-muted-foreground">Total value</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Total invested: <span className="font-medium text-foreground">{formatINR(result.invested)}</span></p>
            <p className="text-sm text-muted-foreground">Estimated returns: <span className="font-medium text-green">{formatINR(result.returns)}</span></p>
          </div>

          <div className="mt-3 flex justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-primary"></span> Invested</span>
            <span className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-green"></span> Returns</span>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Estimated returns based on assumed rate. Actual returns may vary. Not financial advice.
        </p>
      </div>
    </AppShell>
  );
}
