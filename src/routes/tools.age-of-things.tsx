import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/age-of-things")({
  component: AgeOfThings,
});

const THINGS = [
  { name: "Islam", year: 622, icon: "🕌" },
  { name: "Google", year: 1998, icon: "🔍" },
  { name: "iPhone", year: 2007, icon: "📱" },
  { name: "Bitcoin", year: 2009, icon: "₿" },
  { name: "YouTube", year: 2005, icon: "▶️" },
  { name: "WhatsApp", year: 2009, icon: "💬" },
  { name: "Python", year: 1991, icon: "🐍" },
  { name: "Taj Mahal", year: 1653, icon: "🏛️" },
  { name: "USA", year: 1776, icon: "🇺🇸" },
  { name: "Instagram", year: 2010, icon: "📸" },
  { name: "Twitter/X", year: 2006, icon: "🐦" },
  { name: "Netflix", year: 1997, icon: "🎬" },
  { name: "Facebook", year: 2004, icon: "👤" },
  { name: "Airbnb", year: 2008, icon: "🏠" },
  { name: "Tesla", year: 2003, icon: "🚗" },
  { name: "Bitcoin Whitepaper", year: 2008, icon: "📄" },
  { name: "WordPress", year: 2003, icon: "📝" },
  { name: "Linux", year: 1991, icon: "🐧" },
  { name: "Amazon", year: 1994, icon: "📦" },
  { name: "Apple Macintosh", year: 1984, icon: "💻" },
  { name: "World Wide Web", year: 1991, icon: "🌐" },
  { name: "Microsoft", year: 1975, icon: "🪟" },
  { name: "NASA", year: 1958, icon: "🚀" },
  { name: "Pizza Hut", year: 1958, icon: "🍕" },
  { name: "Coca-Cola", year: 1892, icon: "🥤" },
  { name: "Toyota", year: 1937, icon: "🚘" },
  { name: "McDonald's", year: 1940, icon: "🍔" },
  { name: "IKEA", year: 1943, icon: "🛋️" },
  { name: "Samsung", year: 1938, icon: "📺" },
  { name: "WWII Ended", year: 1945, icon: "🕊️" },
];

const FUN_FACTS: Record<string, string> = {
  iPhone: "Older than the first iPad by 3 years",
  Bitcoin: "Created the year of the Great Recession",
  YouTube: "The first video was uploaded April 23, 2005",
  Google: "Founded in a garage in Menlo Park",
  Python: "Named after Monty Python, not the snake",
  Taj_Mahal: "Took 22 years to build, employs 20,000 workers",
  USA: "Declares independence 170 years after Taj Mahal",
  Islam: "One of the youngest major world religions",
  Linux: "Created by a Finnish student as a hobby project",
  Microsoft: "Started by dropping out of Harvard",
};

function AgeOfThings() {
  const [query, setQuery] = useState("");
  const now = new Date();

  const calculateAge = (year: number) => {
    const years = now.getFullYear() - year;
    const months = now.getMonth();
    const days = now.getDate();
    return { years, months, days };
  };

  const filtered = THINGS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => a.year - b.year);

  return (
    <AppShell title="How Old Is Everything">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏳ How Old Is Everything?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Type anything — see exactly how old it is with fun comparisons.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: iPhone, Islam, Python, Taj Mahal..."
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50" />

        <div className="space-y-2">
          {sorted.map((t) => {
            const age = calculateAge(t.year);
            const sameYear = THINGS.filter((o) => o.year === t.year && o.name !== t.name);
            return (
              <div key={t.name} className="rounded-xl border border-border bg-surface p-4 transition-all hover:border-[#484f58]">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">Est. {t.year}</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-primary">{age.years} years, {age.months} months, {age.days} days</p>
                    {sameYear.length > 0 && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Same year as: {sameYear.map((s) => s.name).join(", ")}
                      </p>
                    )}
                    {Object.entries(FUN_FACTS).find(([k]) => t.name.includes(k))?.[1] && (
                      <p className="mt-1 text-[11px] text-primary/80">💡 {Object.entries(FUN_FACTS).find(([k]) => t.name.includes(k))?.[1]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
