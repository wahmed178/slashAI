import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/hijri")({
  component: HijriCalendar,
});

const HIJRI_MONTHS = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
const ISLAMIC_EVENTS: Record<string, string> = {
  "1-1": "Islamic New Year", "1-10": "Day of Ashura", "1-12": "Mawlid al-Nabi",
  "3-12": "Mawlid al-Nabi (Sunni)", "7-27": "Laylat al-Mi'raj", "8-15": "Laylat al-Bara'at",
  "9-1": "Ramadan Begins", "9-27": "Laylat al-Qadr", "10-1": "Eid al-Fitr",
  "12-10": "Eid al-Adha", "12-9": "Day of Arafah",
};

function HijriCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriData, setHijriData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/gToH/${String(currentDate.getDate()).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`)
      .then((r) => r.json())
      .then((d) => setHijriData(d.data))
      .catch(() => {});
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <AppShell title="Hijri Calendar">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌙 Hijri Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Interactive monthly calendar with both Hijri and Gregorian dates. Islamic events highlighted.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground hover:text-foreground">← Prev</button>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{months[month]} {year}</p>
            {hijriData && <p className="text-xs text-primary">{HIJRI_MONTHS[hijriData.hijri.month.number - 1]} {hijriData.hijri.year} AH</p>}
          </div>
          <button onClick={nextMonth} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Next →</button>
        </div>

        {/* Calendar grid */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              return (
                <button key={day} onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  className={`aspect-square rounded-lg text-center text-sm transition-colors ${isToday ? "bg-primary text-background font-bold" : selectedDay === day ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-elevated"}`}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day info */}
        {selectedDay && hijriData && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-bold text-foreground">{months[month]} {selectedDay}, {year}</p>
            <p className="text-xs text-primary">{hijriData.hijri.day} {HIJRI_MONTHS[hijriData.hijri.month.number - 1]} {hijriData.hijri.year} AH</p>
            {hijriData.hijri.holidays?.length > 0 && (
              <p className="mt-1 text-xs text-green">{hijriData.hijri.holidays.join(", ")}</p>
            )}
          </div>
        )}

        {/* Upcoming events */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Islamic Events</p>
          <div className="space-y-1">
            {Object.entries(ISLAMIC_EVENTS).map(([key, event]) => {
              const parts = key.split("-").map(Number); const m = parts[0] ?? 1; const d = parts[1] ?? 1;
              return (
                <div key={key} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5">
                  <span className="text-xs text-foreground">{event}</span>
                  <span className="text-[10px] text-muted-foreground">{HIJRI_MONTHS[m - 1]} {d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
