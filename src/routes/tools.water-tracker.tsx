import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/water-tracker")({ component: WaterTracker });

const KEY = "slashai.water";
const GLASS = 250; // ml per glass

function today() {
  return new Date().toISOString().slice(0, 10);
}

interface Data {
  date: string;
  goal: number;
  ml: number;
}

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Data;
      if (d.date === today()) return d;
    }
  } catch {
    /* fresh start */
  }
  return { date: today(), goal: 3000, ml: 0 };
}

function WaterTracker() {
  const [data, setData] = useState<Data>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const glasses = Math.floor(data.ml / GLASS);
  const totalGlasses = Math.ceil(data.goal / GLASS);
  const pct = Math.min(100, Math.round((data.ml / data.goal) * 100));

  const add = (ml: number) =>
    setData((d) => ({ ...d, ml: Math.max(0, d.ml + ml) }));

  return (
    <AppShell title="Water Tracker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💧 Water Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Daily hydration goal with one-tap logging - saved on this device.</p>
      </header>
      <div className="mx-auto max-w-md space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto flex h-44 w-32 flex-col justify-end overflow-hidden rounded-b-3xl rounded-t-lg border-2 border-primary/40">
            <div
              className="bg-gradient-to-t from-[#38bdf8] to-[#7dd3fc] transition-all duration-300"
              style={{ height: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-2xl font-black text-foreground">
            {(data.ml / 1000).toFixed(2)}L <span className="text-sm font-semibold text-muted-foreground">/ {(data.goal / 1000).toFixed(1)}L</span>
          </p>
          <p className="text-[12px] text-muted-foreground">
            {pct >= 100 ? "Goal complete - beautifully done! 🎉" : `${data.goal - data.ml} ml to go`}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Glass", ml: GLASS },
            { label: "Bottle", ml: 500 },
            { label: "+Custom", ml: 750 },
            { label: "Undo", ml: -GLASS },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => add(b.ml)}
              className="h-12 rounded-xl border border-border bg-surface text-[12px] font-semibold text-foreground transition-colors hover:border-primary"
            >
              {b.label}
              <span className="block text-[10px] text-muted-foreground">
                {b.ml > 0 ? `+${b.ml}ml` : b.ml < 0 ? `${b.ml}ml` : "750ml"}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            {glasses} of {totalGlasses} glasses
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: totalGlasses }, (_, i) => (
              <span key={i} className={`size-4 rounded ${i < glasses ? "bg-[#38bdf8]" : "bg-surface-elevated"}`} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Daily goal:</span>
          {[2000, 2500, 3000, 4000].map((g) => (
            <button
              key={g}
              onClick={() => setData((d) => ({ ...d, goal: g }))}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold ${data.goal === g ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}
            >
              {g / 1000}L
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
