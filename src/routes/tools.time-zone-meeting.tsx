import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/time-zone-meeting")({ component: TimeZoneMeeting });

const ZONES = [
  { city: "Delhi", tz: "Asia/Kolkata" },
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "São Paulo", tz: "America/Sao_Paulo" },
];

function fmt(hour: number, tz: string, base: Date): { label: string; good: boolean } {
  const d = new Date(base);
  d.setHours(hour, 0, 0, 0);
  const str = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, timeZone: tz });
  const h = parseInt(d.toLocaleTimeString("en-US", { hour: "numeric", hour12: false, timeZone: tz }), 10);
  return { label: str, good: h >= 8 && h < 20 };
}

function TimeZoneMeeting() {
  const [selected, setSelected] = useState<string[]>(["Asia/Kolkata", "America/New_York", "Europe/London"]);
  const base = useMemo(() => new Date(), []);

  const rows = ZONES.filter((z) => selected.includes(z.tz));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const toggle = (tz: string) =>
    setSelected((p) => (p.includes(tz) ? p.filter((x) => x !== tz) : [...p, tz]));

  return (
    <AppShell title="Meeting Time Planner">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌐 Meeting Time Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find the slot that is awake and reasonable for every city.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {ZONES.map((z) => (
            <button
              key={z.tz}
              onClick={() => toggle(z.tz)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                selected.includes(z.tz)
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {z.city}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 bg-surface px-3 py-2 text-left font-semibold text-muted-foreground">City</th>
                {hours.map((h) => (
                  <th key={h} className="px-1 py-2 font-mono text-[9px] text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((z) => (
                <tr key={z.tz} className="border-b border-border last:border-0">
                  <td className="sticky left-0 bg-surface px-3 py-2 font-semibold text-foreground">{z.city}</td>
                  {hours.map((h) => {
                    const { label, good } = fmt(h, z.tz, base);
                    return (
                      <td key={h} title={label} className="px-0.5 py-1 text-center">
                        <span className={`inline-block size-4 rounded-sm ${good ? "bg-primary/60" : "bg-surface-elevated"}`} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground">
          <span className="mr-1 inline-block size-3 rounded-sm bg-primary/60 align-middle" /> everyone is awake (8:00–20:00 local) · grey = asleep. Pick a column that is blue for all rows.
        </p>
      </div>
    </AppShell>
  );
}
