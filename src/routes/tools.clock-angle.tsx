import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/clock-angle")({ component: ClockAngle });

function ClockAngle() {
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(0);

  const angle = (() => {
    const minuteAngle = minute * 6;
    const hourAngle = ((hour % 12) + minute / 60) * 30;
    const diff = Math.abs(hourAngle - minuteAngle);
    return Math.min(diff, 360 - diff);
  })();

  const hourHandDeg = ((hour % 12) + minute / 60) * 30;
  const minuteHandDeg = minute * 6;

  return (
    <AppShell title="Clock Angle Calculator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕐 Clock Angle Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">The smaller angle between clock hands at any time.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Hour (0-23)</label>
            <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Math.min(23, Math.max(0, Number(e.target.value))))} className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Minute (0-59)</label>
            <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value))))} className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" />
          </div>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-border bg-surface p-5">
          <svg viewBox="0 0 120 120" className="size-44">
            <circle cx="60" cy="60" r="55" fill="none" stroke="var(--border)" strokeWidth="2" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <circle key={i} cx={60 + 48 * Math.sin(a)} cy={60 - 48 * Math.cos(a)} r="2" fill="var(--muted-foreground)" />;
            })}
            <line x1="60" y1="60" x2={60 + 26 * Math.sin((hourHandDeg * Math.PI) / 180)} y2={60 - 26 * Math.cos((hourHandDeg * Math.PI) / 180)} stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="60" x2={60 + 40 * Math.sin((minuteHandDeg * Math.PI) / 180)} y2={60 - 40 * Math.cos((minuteHandDeg * Math.PI) / 180)} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="60" r="3" fill="var(--foreground)" />
          </svg>
          <p className="mt-3 text-3xl font-black text-primary">{angle.toFixed(1)}&deg;</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")} - smaller angle between the hands
          </p>
        </div>

        <div className="flex justify-center gap-1.5">
          {[3, 6, 9, 12].map((h) => (
            <button key={h} type="button" onClick={() => { setHour(h); setMinute(0); }} className="min-h-[32px] rounded-md border border-border px-3 text-[12.5px] hover:text-primary">
              {h}:00
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
