import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/hourly-to-salary")({
  head: () => ({
    meta: [
      { title: "Hourly to Salary Calculator - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Convert hourly pay to daily, weekly, monthly and yearly salary - or salary back to hourly. Adjust for hours per week and unpaid leave. Free, private.",
      },
    ],
  }),
  component: HourlyTool,
});

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function HourlyTool() {
  const [mode, setMode] = useState<"hourly" | "annual">("hourly");
  const [hourly, setHourly] = useState("18");
  const [annual, setAnnual] = useState("36000");
  const [hoursWeek, setHoursWeek] = useState(40);
  const [weeksYear, setWeeksYear] = useState(52);

  const hw = Math.max(1, hoursWeek);
  const wy = Math.max(1, weeksYear);

  const rows = useMemo(() => {
    if (mode === "hourly") {
      const h = Number(hourly) || 0;
      const annualV = h * hw * wy;
      return [
        { l: "Hourly", v: h },
        { l: "Daily (8h)", v: h * 8 },
        { l: "Weekly", v: h * hw },
        { l: "Monthly", v: annualV / 12 },
        { l: "Yearly", v: annualV },
      ];
    }
    const a = Number(annual) || 0;
    const hourlyV = a / (hw * wy);
    return [
      { l: "Hourly", v: hourlyV },
      { l: "Daily (8h)", v: hourlyV * 8 },
      { l: "Weekly", v: a / wy },
      { l: "Monthly", v: a / 12 },
      { l: "Yearly", v: a },
    ];
  }, [mode, hourly, annual, hw, wy]);

  return (
    <AppShell title="Hourly to Salary">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏱️ Hourly ↔ Salary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convert pay in either direction, with your real hours and unpaid weeks factored in.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(
            [
              ["hourly", "I'm paid hourly"],
              ["annual", "I have a salary"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`h-9 flex-1 rounded-lg text-[12.5px] font-bold transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          {mode === "hourly" ? (
            <>
              <label className="block text-[12px] font-semibold text-muted-foreground">Hourly rate</label>
              <input
                type="number"
                min={0}
                step="any"
                value={hourly}
                onChange={(e) => setHourly(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </>
          ) : (
            <>
              <label className="block text-[12px] font-semibold text-muted-foreground">Annual salary</label>
              <input
                type="number"
                min={0}
                step="any"
                value={annual}
                onChange={(e) => setAnnual(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </>
          )}

          <label className="mt-3 block text-[12px] font-semibold text-muted-foreground">
            Hours per week: <b className="text-foreground">{hw}</b>
          </label>
          <input
            type="range"
            min={1}
            max={80}
            value={hoursWeek}
            onChange={(e) => setHoursWeek(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--primary)]"
          />

          <label className="mt-3 block text-[12px] font-semibold text-muted-foreground">
            Paid weeks per year: <b className="text-foreground">{wy}</b>{" "}
            {wy < 52 && <span className="text-muted-foreground">({52 - wy} unpaid weeks off)</span>}
          </label>
          <input
            type="range"
            min={1}
            max={52}
            value={weeksYear}
            onChange={(e) => setWeeksYear(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--primary)]"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {rows.map((r, i) => (
            <div
              key={r.l}
              className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border/60" : ""} ${
                (mode === "hourly" && r.l === "Yearly") || (mode === "annual" && r.l === "Hourly")
                  ? "bg-primary/8"
                  : ""
              }`}
            >
              <span className="text-[12.5px] font-semibold text-muted-foreground">{r.l}</span>
              <span className="text-[14.5px] font-black tabular-nums text-foreground">{fmt(r.v)}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Gross pay before tax. Every calculation runs in your browser — nothing is sent anywhere.
        </p>
      </div>
    </AppShell>
  );
}
