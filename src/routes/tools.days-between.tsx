import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/days-between")({
  head: () => ({
    meta: [
      { title: "Days Between Dates - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Count days, weeks, weekdays and months between any two dates. Also add or subtract days from a date. Free, no upload, works offline.",
      },
    ],
  }),
  component: DaysBetweenTool,
});

const MS_DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

function DaysBetweenTool() {
  const today = new Date();
  const [from, setFrom] = useState(iso(today));
  const [to, setTo] = useState(iso(new Date(today.getTime() + 30 * MS_DAY)));
  const [mode, setMode] = useState<"between" | "add">("between");
  const [offset, setOffset] = useState(30);
  const [dir, setDir] = useState<"after" | "before">("after");

  const result = useMemo(() => {
    const a = new Date(`${from}T00:00:00`);
    const b = new Date(`${to}T00:00:00`);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    const diffDays = Math.round((b.getTime() - a.getTime()) / MS_DAY);
    const absDays = Math.abs(diffDays);

    // weekday count (excluding Sat/Sun) - walk day by day, cheap for decades
    let weekdays = 0;
    const step = diffDays >= 0 ? 1 : -1;
    const cur = new Date(a);
    for (let i = 0; i < absDays; i++) {
      cur.setDate(cur.getDate() + step);
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) weekdays += 1;
    }

    // whole months between (calendar-aware approximation: same day-of-month)
    let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    if (b.getDate() < a.getDate()) months -= diffDays >= 0 ? 1 : -1;
    months = Math.abs(months);

    const weeks = absDays / 7;
    return { diffDays, absDays, weekdays, months, weeks };
  }, [from, to]);

  const addResult = useMemo(() => {
    const a = new Date(`${from}T00:00:00`);
    if (Number.isNaN(a.getTime())) return null;
    const out = new Date(a);
    out.setDate(out.getDate() + (dir === "after" ? offset : -offset));
    return out;
  }, [from, offset, dir]);

  return (
    <AppShell title="Days Between Dates">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📅 Days Between Dates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exact days, weekdays and months between two dates — or a date offset from today.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        {/* mode switch */}
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(
            [
              ["between", "Days between"],
              ["add", "Add / subtract"],
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
          <label className="block text-[12px] font-semibold text-muted-foreground">
            {mode === "add" ? "Start date" : "From date"}
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />

          {mode === "between" ? (
            <>
              <label className="mt-3 block text-[12px] font-semibold text-muted-foreground">To date</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setDir(dir === "after" ? "before" : "after")}
                className="h-11 shrink-0 rounded-xl border border-border bg-background px-3 text-[13px] font-bold text-foreground"
              >
                {dir === "after" ? "+" : "−"}
              </button>
              <input
                type="number"
                min={1}
                max={36500}
                value={offset}
                onChange={(e) => setOffset(Math.max(1, Math.min(36500, Number(e.target.value) || 0)))}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                aria-label="Number of days"
              />
              <span className="grid h-11 shrink-0 place-items-center text-[12.5px] text-muted-foreground">days</span>
            </div>
          )}
        </div>

        {mode === "between" && result && (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { v: result.absDays.toLocaleString(), l: "total days" },
              { v: result.weekdays.toLocaleString(), l: "weekdays" },
              { v: result.weeks.toFixed(1), l: "weeks" },
              { v: result.months.toLocaleString(), l: "months" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-surface p-4 text-center">
                <p className="text-xl font-black tabular-nums text-foreground">{s.v}</p>
                <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.l}
                </p>
              </div>
            ))}
            <p className="col-span-2 text-center text-[11.5px] text-muted-foreground">
              {result.diffDays === 0
                ? "Same date"
                : result.diffDays > 0
                  ? `${result.diffDays.toLocaleString()} days after ${from}`
                  : `${Math.abs(result.diffDays).toLocaleString()} days before ${to}`}
            </p>
          </div>
        )}

        {mode === "add" && addResult && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <CalendarDays className="mx-auto size-6 text-primary" aria-hidden />
            <p className="mt-2 text-2xl font-black text-foreground">{iso(addResult)}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {offset.toLocaleString()} day{offset === 1 ? "" : "s"} {dir} {from} ·{" "}
              {addResult.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
