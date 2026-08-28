import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

const CITIES = [
  { name: "Hyderabad", tz: "Asia/Kolkata", flag: "\u{1F1EE}\u{1F1F3}" },
  { name: "Dubai", tz: "Asia/Dubai", flag: "\u{1F1E6}\u{1F1EA}" },
  { name: "London", tz: "Europe/London", flag: "\u{1F1EC}\u{1F1E7}" },
  { name: "New York", tz: "America/New_York", flag: "\u{1F1FA}\u{1F1F8}" },
  { name: "Tokyo", tz: "Asia/Tokyo", flag: "\u{1F1EF}\u{1F1F5}" },
  { name: "Karachi", tz: "Asia/Karachi", flag: "\u{1F1F5}\u{1F1F0}" },
  { name: "Dhaka", tz: "Asia/Dhaka", flag: "\u{1F1E9}\u{1F1E9}" },
  { name: "Riyadh", tz: "Asia/Riyadh", flag: "\u{1F1F8}\u{1F1E6}" },
  { name: "Singapore", tz: "Asia/Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { name: "Sydney", tz: "Australia/Sydney", flag: "\u{1F1E6}\u{1F1FA}" },
  { name: "Toronto", tz: "America/Toronto", flag: "\u{1F1E8}\u{1F1E6}" },
  { name: "Paris", tz: "Europe/Paris", flag: "\u{1F1EB}\u{1F1F7}" },
];

export const Route = createFileRoute("/tools/world-clock")({
  head: () => ({ meta: [{ title: "World Clock \u2014 SlashAI" }] }),
  component: WorldClock,
});

function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  return (
    <AppShell title="World Clock" back={{ to: "/tools", label: "Tools" }}>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {CITIES.map((city) => {
          const time = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
          const date = now.toLocaleDateString("en-US", { timeZone: city.tz, weekday: "short", month: "short", day: "numeric" });
          const offset = now.toLocaleTimeString("en-US", { timeZone: city.tz, timeZoneName: "short" }).split(" ").pop();
          return (
            <div key={city.name} className="rounded-[10px] border border-border bg-surface p-4 text-center">
              <span className="text-xl">{city.flag}</span>
              <p className="mt-1.5 text-sm font-semibold text-foreground">{city.name}</p>
              <p className="mt-1 font-mono text-xl font-bold text-primary">{time}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{offset}</p>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
