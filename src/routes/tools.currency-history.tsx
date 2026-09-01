import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/currency-history")({
  component: CurrencyHistory,
});

const PAIRS = ["USD/INR", "EUR/INR", "AED/INR", "GBP/INR", "USD/EUR", "USD/GBP"] as const;
const PERIODS = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
] as const;

function CurrencyHistory() {
  const [pair, setPair] = useState<string>("USD/INR");
  const [period, setPeriod] = useState(30);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const [base, quote] = pair.split("/");
    const end = new Date().toISOString().split("T")[0];
    const start = new Date(Date.now() - period * 86400000).toISOString().split("T")[0];
    setLoading(true);
    fetch(`https://api.frankfurter.app/${start}..${end}?from=${base}&to=${quote}`)
      .then((r) => r.json())
      .then((data) => {
        setRates(data.rates || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pair, period]);

  const entries = Object.entries(rates).sort(([a], [b]) => a.localeCompare(b));
  const values = entries.map(([, v]) => { const vals = Object.values(v as any); return (vals[0] as number) || 0; });
  const current = values.length > 0 ? values[values.length - 1] : 0;
  const high = values.length > 0 ? Math.max(...values) : 0;
  const low = values.length > 0 ? Math.min(...values) : 0;
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const maxVal = high || 1;
  const minVal = low || 0;
  const range = maxVal - minVal || 1;

  const buildPath = () => {
    if (values.length < 2) return "";
    const w = 100;
    const h = 60;
    return values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - minVal) / range) * h;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
  };

  return (
    <AppShell title="Currency Rate History">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💱 Currency Rate History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Exchange rate charts powered by Frankfurter API (free, no key).</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {PAIRS.map((p) => (
            <button key={p} onClick={() => setPair(p)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${pair === p ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>{p}</button>
          ))}
        </div>

        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button key={p.days} onClick={() => setPeriod(p.days)}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${period === p.days ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>{p.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">Loading rates...</div>
        ) : values.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">No data available</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="text-lg font-bold text-foreground">{(current ?? 0).toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">Current</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="text-lg font-bold text-green">{high.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">High</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="text-lg font-bold text-red-400">{low.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">Low</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="text-lg font-bold text-foreground">{avg.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">Average</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <svg viewBox="0 0 100 60" className="w-full h-40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${buildPath()} L100,60 L0,60 Z`} fill="url(#grad)" />
                <path d={buildPath()} fill="none" stroke="var(--primary)" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="text-xs text-muted-foreground text-center">Data: Frankfurter API · {entries.length} data points</div>
          </>
        )}
      </div>
    </AppShell>
  );
}
