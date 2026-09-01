import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/prayer-schedule")({
  component: PrayerSchedule,
});

interface PrayerTime {
  date: string; fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string;
}

function PrayerSchedule() {
  const [city, setCity] = useState("Karachi");
  const [year, setYear] = useState(new Date().getFullYear());
  const [schedule, setSchedule] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const m = month + 1;
      const r = await fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${m}?city=${city}&country=Pakistan&method=2`);
      const d = await r.json();
      if (d.data) {
        setSchedule(d.data.map((day: any) => ({
          date: day.date.readable,
          fajr: day.timings.Fajr.split(" ")[0],
          sunrise: day.timings.Sunrise.split(" ")[0],
          dhuhr: day.timings.Dhuhr.split(" ")[0],
          asr: day.timings.Asr.split(" ")[0],
          maghrib: day.timings.Maghrib.split(" ")[0],
          isha: day.timings.Isha.split(" ")[0],
        })));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchSchedule(); }, [city, year, month]);

  const downloadCSV = () => {
    const csv = "Date,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha\n" + schedule.map((s) => `${s.date},${s.fajr},${s.sunrise},${s.dhuhr},${s.asr},${s.maghrib},${s.isha}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `prayer-times-${city}-${year}-${month + 1}.csv`; a.click();
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <AppShell title="Prayer Schedule">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕌 Prayer Time Schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full month prayer times via Aladhan API. Export as CSV.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex gap-2">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City name" className="flex-1 h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50" />
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none">
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none">
            {[2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">Loading prayer times...</div>
        ) : schedule.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">No data. Try a different city.</div>
        ) : (
          <>
            <button onClick={downloadCSV} className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">📥 Export CSV</button>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Fajr</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Sunrise</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Dhuhr</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Asr</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Maghrib</th>
                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Isha</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-surface" : "bg-transparent"}`}>
                      <td className="px-3 py-1.5 text-foreground">{s.date}</td>
                      <td className="px-3 py-1.5 text-center text-primary">{s.fajr}</td>
                      <td className="px-3 py-1.5 text-center text-foreground">{s.sunrise}</td>
                      <td className="px-3 py-1.5 text-center text-foreground">{s.dhuhr}</td>
                      <td className="px-3 py-1.5 text-center text-foreground">{s.asr}</td>
                      <td className="px-3 py-1.5 text-center text-primary">{s.maghrib}</td>
                      <td className="px-3 py-1.5 text-center text-foreground">{s.isha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
