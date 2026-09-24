import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/deadline-honesty")({ component: DeadlineHonesty });

/**
 * Deadline Honesty — most deadline calculators divide "days left" by work
 * and call it a plan. That lies to students who have classes, commutes and
 * sleep. This one builds the real calendar: available hours per day from
 * your actual schedule, applies the planning fudge factor (everything takes
 * longer than you think — Hofstadter's law), and returns a day-by-day plan
 * or an honest "start tonight" warning.
 */

interface DayPlan {
  date: Date;
  hours: number;
  label: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DeadlineHonesty() {
  const [due, setDue] = useState(() => {
    const d = new Date(Date.now() + 7 * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const [workHours, setWorkHours] = useState(12);
  const [weekdayFree, setWeekdayFree] = useState(2);
  const [weekendFree, setWeekendFree] = useState(6);
  const [buffer, setBuffer] = useState(40); // Hofstadter padding %
  const [hasClasses, setHasClasses] = useState(true);

  const plan = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due + "T23:59:00");
    const days = Math.max(0, Math.round((dueDate.getTime() - today.getTime()) / 86400000));

    const plans: DayPlan[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      const dow = d.getDay();
      const isWeekend = dow === 0 || dow === 6;
      let h = isWeekend ? weekendFree : weekdayFree;
      // the night before is panic-powered: students genuinely find +2h there
      if (i === days - 1 && !isWeekend) h += 2;
      plans.push({ date: d, hours: h, label: DAY_NAMES[dow]! });
    }
    const rawCapacity = plans.reduce((a, p) => a + p.hours, 0);
    const effective = rawCapacity * (1 - buffer / 100);
    return { plans, days, rawCapacity, effective, hoursNeeded: workHours };
  }, [due, workHours, weekdayFree, weekendFree, buffer]);

  const fits = plan.effective >= workHours;
  /** first day you must start to make it without touching the buffer */
  const dayLimit = (() => {
    if (fits) return plan.plans.length;
    let acc = 0;
    for (let i = plan.plans.length - 1; i >= 0; i--) {
      acc += plan.plans[i]!.hours * (1 - buffer / 100);
      if (acc >= workHours) return i;
    }
    return -1; // impossible even with every day
  })();

  const verdict = (() => {
    if (plan.days === 0) return { tone: "late", text: "It's due today. Start now — and cut scope, not sleep." };
    if (fits) {
      const slack = Math.round(plan.effective - workHours);
      return {
        tone: "ok",
        text: `${plan.days} days × your real free hours = ${plan.rawCapacity}h, which becomes ~${Math.round(plan.effective)}h after the honesty buffer. That's ${slack}h of slack for the things you can't predict.`,
      };
    }
    if (dayLimit === -1)
      return {
        tone: "impossible",
        text: `Even working every single free hour, you have ~${Math.round(plan.effective)}h for ${workHours}h of work. This needs descoping (fewer sources, shorter essay) or an extension request — start that conversation today.`,
      };
    return {
      tone: "tight",
      text: `Comfortably impossible if you start "later". If you begin on ${plan.plans[dayLimit] ? `${DAY_NAMES[plan.plans[dayLimit]!.date.getDay()]}, ${plan.plans[dayLimit]!.date.getDate()}` : "today"}, the maths works. Every day of delay costs ~${Math.round(weekdayFree * (1 - buffer / 100))} working hours.`,
    };
  })();

  return (
    <AppShell title="Deadline Honesty">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📅 Deadline Honesty</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Most planners say "7 days ÷ 1 essay = fine". This one uses the hours you actually have — after
          classes, commutes and sleep — then applies the one law of planning: <em>it always takes longer than
          it takes</em>. The result is either a real plan or an honest early warning.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Due date</label>
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Work needed (hours)</label>
              <input type="number" min={1} max={200} value={workHours} onChange={(e) => setWorkHours(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Free hours, weekday</label>
              <input type="range" min={0} max={8} step={0.5} value={weekdayFree} onChange={(e) => setWeekdayFree(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
              <p className="text-center text-xs font-bold text-primary">{weekdayFree}h/day</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Free hours, weekend</label>
              <input type="range" min={0} max={14} step={0.5} value={weekendFree} onChange={(e) => setWeekendFree(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
              <p className="text-center text-xs font-bold text-primary">{weekendFree}h/day</p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Honesty buffer — {buffer}% (things take longer: illness, confusing sources, lost files)
            </label>
            <input type="range" min={0} max={70} step={5} value={buffer} onChange={(e) => setBuffer(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={hasClasses} onChange={(e) => setHasClasses(e.target.checked)} className="accent-[var(--primary)]" />
            I have classes/office most weekdays
          </label>
        </div>

        {/* verdict */}
        <div
          className={`rounded-2xl border p-5 ${
            verdict.tone === "ok"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : verdict.tone === "tight"
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-red-500/40 bg-red-500/5"
          }`}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {verdict.tone === "ok" ? "✅ the maths is on your side" : verdict.tone === "tight" ? "⚠️ the maths is watching you" : "🚨 the maths says start now"}
          </p>
          <p className="text-sm leading-relaxed text-foreground">{verdict.text}</p>
        </div>

        {/* day-by-day */}
        {plan.plans.length > 0 && plan.plans.length <= 21 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your real calendar until due</p>
            <div className="flex flex-wrap gap-1.5">
              {plan.plans.map((p, i) => {
                const hrs = p.hours * (1 - buffer / 100);
                return (
                  <div
                    key={i}
                    title={`${p.label} ${p.date.getDate()}: ${p.hours}h free → ${hrs.toFixed(1)}h effective`}
                    className="flex w-11 flex-col items-center rounded-lg border border-border bg-background py-1.5"
                  >
                    <span className="text-[9px] text-muted-foreground">{p.label}</span>
                    <span className="text-[10px] font-bold text-foreground">{p.date.getDate()}</span>
                    <span className={`text-[9px] font-bold ${hrs >= 4 ? "text-emerald-600" : hrs >= 1 ? "text-amber-600" : "text-red-400"}`}>{p.hours}h</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Raw capacity {plan.rawCapacity}h → {Math.round(plan.effective)}h after the buffer. Need {workHours}h.
            </p>
          </div>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}
