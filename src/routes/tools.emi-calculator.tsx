import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/emi-calculator")({
  head: () => ({ meta: [{ title: "EMI Calculator — SlashAI" }] }),
  component: EmiCalculator,
});

function formatINR(n: number) { return "\u20b9" + Math.round(n).toLocaleString("en-IN"); }

function EmiCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
    return { emi, total: emi * n, interest: emi * n - principal };
  }, [principal, rate, tenure]);

  const principalPct = result.total > 0 ? (principal / result.total) * 100 : 50;

  return (
    <AppShell title="EMI Calculator" back={{ to: "/tools", label: "SlashKit" }}>
      <div className="mt-4 space-y-5">
        <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Loan amount</span><span className="font-mono font-medium text-primary">{formatINR(principal)}</span>
            </label>
            <input type="range" min={10000} max={10000000} step={10000} value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Annual interest rate</span><span className="font-mono font-medium text-primary">{rate}%</span>
            </label>
            <input type="range" min={1} max={24} step={0.5} value={rate}
              onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Loan tenure</span><span className="font-mono font-medium text-primary">{tenure} years</span>
            </label>
            <input type="range" min={1} max={30} value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))} className="mt-2 w-full accent-[#58a6ff]" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="relative mx-auto size-40">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#21262d" strokeWidth="14" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#58a6ff" strokeWidth="14"
                strokeDasharray={`${principalPct * 3.14} ${(100 - principalPct) * 3.14}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-primary">{formatINR(result.emi)}</span>
              <span className="text-[11px] text-muted-foreground">Monthly EMI</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Principal: <span className="font-medium text-foreground">{formatINR(principal)}</span></p>
            <p className="text-sm text-muted-foreground">Total interest: <span className="font-medium text-green">{formatINR(result.interest)}</span></p>
            <p className="text-sm text-muted-foreground">Total payable: <span className="font-medium text-foreground">{formatINR(result.total)}</span></p>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-primary"></span> Principal</span>
            <span className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-green"></span> Interest</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
