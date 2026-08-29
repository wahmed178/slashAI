import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

const ZODIAC = [
  { start: [1, 20], end: [2, 18], name: "Aquarius", sign: "\u2652" },
  { start: [2, 19], end: [3, 20], name: "Pisces", sign: "\u2653" },
  { start: [3, 21], end: [4, 19], name: "Aries", sign: "\u2648" },
  { start: [4, 20], end: [5, 20], name: "Taurus", sign: "\u2649" },
  { start: [5, 21], end: [6, 20], name: "Gemini", sign: "\u264A" },
  { start: [6, 21], end: [7, 22], name: "Cancer", sign: "\u264B" },
  { start: [7, 23], end: [8, 22], name: "Leo", sign: "\u264C" },
  { start: [8, 23], end: [9, 22], name: "Virgo", sign: "\u264D" },
  { start: [9, 23], end: [10, 22], name: "Libra", sign: "\u264E" },
  { start: [10, 23], end: [11, 21], name: "Scorpio", sign: "\u264F" },
  { start: [11, 22], end: [12, 21], name: "Sagittarius", sign: "\u2650" },
  { start: [12, 22], end: [1, 19], name: "Capricorn", sign: "\u2651" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const Route = createFileRoute("/tools/age-calculator")({
  head: () => ({ meta: [{ title: "Age Calculator — SlashAI" }] }),
  component: AgeCalculator,
});

function AgeCalculator() {
  const [dob, setDob] = useState("1995-06-15");

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    if (birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalMonths = Math.floor(totalDays / 30);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const zodiac = ZODIAC.find((z) => {
      const sm = z.start[0]!; const sd = z.start[1]!;
      const em = z.end[0]!; const ed = z.end[1]!;
      const mm = now.getMonth() + 1;
      const dd = now.getDate();
      if (sm <= em) return (mm > sm || (mm === sm && dd >= sd)) && (mm < em || (mm === em && dd <= ed));
      return (mm > sm || (mm === sm && dd >= sd)) || (mm < em || (mm === em && dd <= ed));
    });

    return { years, months, days, totalDays, totalMonths, totalHours, dayBorn: DAYS[birth.getDay()], daysUntil, zodiac };
  }, [dob]);

  return (
    <AppShell title="Age Calculator" back={{ to: "/tools", label: "SlashKits" }}>
      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="text-sm text-foreground">Date of birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>

        {result && (
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <p className="text-2xl font-bold text-primary">{result.years} years, {result.months} months, {result.days} days</p>
            <p className="text-sm text-muted-foreground">Next birthday in <span className="font-medium text-foreground">{result.daysUntil} days</span></p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                ["Months", result.totalMonths.toLocaleString()],
                ["Days", result.totalDays.toLocaleString()],
                ["Hours", result.totalHours.toLocaleString()],
                ["Born on", result.dayBorn],
              ].map(([label, val]) => (
                <div key={label} className="rounded-lg bg-surface-elevated p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{val}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            {result.zodiac && (
              <div className="flex items-center gap-2 rounded-lg bg-surface-elevated p-3">
                <span className="text-2xl">{result.zodiac.sign}</span>
                <span className="text-sm font-medium text-foreground">{result.zodiac.name}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
