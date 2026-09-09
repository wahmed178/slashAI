import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/life-stats")({ component: LifeStats });

const fmt = new Intl.NumberFormat("en-US");

/** average figures (public health / sleep research ballparks) */
const AVG = {
  sleepHoursPerDay: 8,
  mealsPerDay: 3,
  stepsPerDay: 5000,
  blinksPerMin: 15,
  awakeHoursPerDay: 16,
  heartbeatsPerMin: 72,
  breathsPerMin: 16,
  hairGrowthMmPerDay: 0.35,
  nailGrowthMmPerDay: 0.1,
  laughsPerDay: 15,
  dreamsPerNight: 4,
  workDaysPerYear: 230,
  workHoursPerDay: 8,
  schoolYearsOfLife: 14,
};

function LifeStats() {
  const [ageYears, setAgeYears] = useState(25);

  const stats = useMemo(() => {
    const days = ageYears * 365.25;
    const hours = days * 24;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    return [
      { icon: "💓", label: "Heartbeats", value: minutes * AVG.heartbeatsPerMin },
      { icon: "🫁", label: "Breaths taken", value: minutes * AVG.breathsPerMin },
      { icon: "😴", label: "Days asleep", value: (days * AVG.sleepHoursPerDay) / 24 },
      { icon: "💤", label: "Dreams dreamt", value: (days * AVG.dreamsPerNight) / 365.25 },
      { icon: "👁️", label: "Blinks", value: (hours * 60) * AVG.blinksPerMin * (AVG.awakeHoursPerDay / 24) },
      { icon: "🍽️", label: "Meals eaten", value: days * AVG.mealsPerDay },
      { icon: "🚶", label: "Steps walked", value: days * AVG.stepsPerDay },
      { icon: "🌍", label: "Kilometres around Earth", value: (days * AVG.stepsPerDay * 0.000762) / 40075 },
      { icon: "📏", label: "Metres of hair grown", value: (days * AVG.hairGrowthMmPerDay) / 1000 },
      { icon: "😂", label: "Laughs", value: days * AVG.laughsPerDay },
      { icon: "💼", label: "Working hours", value: (ageYears / 60) * AVG.workDaysPerYear * AVG.workHoursPerDay * 60 },
      { icon: "⏳", label: "Seconds experienced", value: seconds },
    ];
  }, [ageYears]);

  return (
    <AppShell title="Your Life in Numbers">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📊 Your Life in Numbers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What your body has already done, estimated from lifetime averages.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Your age: <span className="font-bold text-foreground">{ageYears} years</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={ageYears}
            onChange={(e) => setAgeYears(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-xl">{s.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tabular-nums text-foreground">{fmt.format(Math.round(s.value))}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Estimates use population averages (8h sleep, 72bpm, 5,000 steps/day). Your real numbers are your own.
        </p>
      </div>
    </AppShell>
  );
}
