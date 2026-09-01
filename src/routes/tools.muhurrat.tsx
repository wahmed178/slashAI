import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/muhurrat")({ component: MuhurratFinder });

const ISLAMIC_EVENTS = [
  { name: "Ramadan Start", month: 9, day: 1, emoji: "🌙" },
  { name: "Laylat al-Qadr", month: 9, day: 27, emoji: "✨" },
  { name: "Eid al-Fitr", month: 10, day: 1, emoji: "🎉" },
  { name: "Eid al-Adha", month: 12, day: 10, emoji: "🕋" },
  { name: "Islamic New Year", month: 1, day: 1, emoji: "📅" },
  { name: "Mawlid al-Nabi", month: 3, day: 12, emoji: "🌟" },
];

const HIJRI_MONTHS = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];

function gregorianToHijri(date: Date): string {
  const jd = Math.floor(365.25 * (date.getFullYear() + 4716)) + Math.floor(30.6001 * (date.getMonth() + 2 < 3 ? date.getMonth() + 14 : date.getMonth() + 2)) + date.getDate() - 1524.5;
  const l = Math.floor(jd - 1948439.5 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const lr = l - 10631 * n + 354;
  const j = Math.floor((10985 - lr) / 5316) * Math.floor((50 * lr) / 17719) + Math.floor(lr / 5670) * Math.floor((43 * lr) / 15238);
  const ld = lr - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hm = Math.floor((24 * ld) / 709);
  const hd = ld - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return `${hd} ${HIJRI_MONTHS[hm - 1] || "?"} ${hy} AH`;
}

function MuhurratFinder() {
  const [view, setView] = useState<"today" | "events" | "ramadan">("today");
  const today = useMemo(() => new Date(), []);
  const hijriDate = useMemo(() => gregorianToHijri(today), [today]);

  const nextEvent = useMemo(() => {
    const now = new Date();
    const thisYear = now.getFullYear();
    for (const evt of ISLAMIC_EVENTS) {
      const d = new Date(thisYear, evt.month - 1, evt.day);
      if (d >= now) return { ...evt, date: d };
    }
    const first = ISLAMIC_EVENTS[0]!;
    return { ...first, date: new Date(thisYear + 1, first.month - 1, first.day) };
  }, []);

  const daysUntil = Math.ceil((nextEvent.date.getTime() - today.getTime()) / 86400000);

  return (
    <AppShell title="Muhurrat Finder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌙 Islamic Date Finder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hijri dates, Islamic events, and Ramadan timetable.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted-foreground">Today (Hijri)</p>
          <p className="mt-1 text-lg font-bold text-foreground">{hijriDate}</p>
          <p className="text-xs text-muted-foreground">{today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">Next Event</p>
          <p className="mt-1 text-lg font-bold text-foreground">{nextEvent.emoji} {nextEvent.name}</p>
          <p className="text-sm text-primary">{daysUntil > 0 ? `In ${daysUntil} days` : "Today!"}</p>
          <p className="text-xs text-muted-foreground">{nextEvent.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Upcoming Events</p>
          <div className="space-y-2">
            {ISLAMIC_EVENTS.map((evt, i) => {
              const d = new Date(today.getFullYear(), evt.month - 1, evt.day);
              if (d < today) d.setFullYear(d.getFullYear() + 1);
              const days = Math.ceil((d.getTime() - today.getTime()) / 86400000);
              return (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{evt.emoji} {evt.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
                  </div>
                  <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">{days} days</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
