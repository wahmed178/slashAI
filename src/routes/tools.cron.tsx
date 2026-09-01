import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/cron")({ component: CronExplainer });

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every day at 9 AM", expr: "0 9 * * *" },
  { label: "Every Monday", expr: "0 9 * * 1" },
  { label: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
  { label: "Every 1st of month", expr: "0 0 1 * *" },
  { label: "Every Sunday midnight", expr: "0 0 * * 0" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function explainCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression — expected 5 fields: minute hour day-of-month month day-of-week";

  const min = parts[0] ?? "*";
  const hour = parts[1] ?? "*";
  const dom = parts[2] ?? "*";
  const month = parts[3] ?? "*";
  const dow = parts[4] ?? "*";
  const bits: string[] = [];

  if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every minute";
  if (min === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every hour, at minute 0";
  if (min === "0" && hour === "0" && dom === "*" && month === "*" && dow === "*") return "Every day at midnight";

  if (dow !== "*") {
    if (dow.includes("-")) {
      const parts = dow.split("-").map(Number);
      const a = parts[0] ?? 0;
      const b = parts[1] ?? 6;
      const range = [];
      for (let i = a; i <= b; i++) range.push(DAYS[i % 7]);
      bits.push(`Every ${range.join(", ")}`);
    } else {
      bits.push(`Every ${DAYS[Number(dow) % 7]}`);
    }
  }

  if (hour !== "*") {
    if (hour.includes(",")) bits.push(`at hours ${hour}`);
    else bits.push(`at ${hour}:00`);
  } else if (min !== "*") {
    bits.push(`at minute ${min}`);
  }

  if (dom !== "*") bits.push(`on day ${dom} of the month`);
  if (month !== "*") bits.push(`in month ${month}`);

  return bits.length > 0 ? bits.join(" ") : expr;
}

function CronExplainer() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const explanation = useMemo(() => explainCron(expr), [expr]);

  return (
    <AppShell title="Cron Explainer">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">⏰ Cron Expression Explainer</h1><p className="mt-1 text-sm text-muted-foreground">Type a cron expression → see it in plain English. Or pick a preset.</p></header>
      <div className="mx-auto max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Cron Expression (min hour dom month dow)</label>
          <input value={expr} onChange={e => setExpr(e.target.value)} placeholder="0 9 * * 1-5"
            className="h-10 w-full rounded-xl border border-border bg-surface px-4 font-mono text-sm focus:border-primary/60 focus:outline-none" />
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">{explanation}</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-foreground">Common Presets</p>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map(p => (
              <button key={p.expr} onClick={() => setExpr(p.expr)} className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs transition-colors hover:border-primary/40">
                <p className="font-medium text-foreground">{p.label}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{p.expr}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-[10px] text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Format: <code className="font-mono">min hour dom month dow</code></p>
          <p>min: 0-59 | hour: 0-23 | dom: 1-31 | month: 1-12 | dow: 0-6 (Sun-Sat)</p>
          <p className="mt-1">Use * for "any", commas for lists (1,3,5), ranges (1-5), steps (*/5)</p>
        </div>
      </div>
    </AppShell>
  );
}
