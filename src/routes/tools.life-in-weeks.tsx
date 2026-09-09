import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/life-in-weeks")({ component: LifeInWeeks });

const LIFE_YEARS = 90;
const WEEKS_PER_YEAR = 52;

const fmt = new Intl.NumberFormat("en-US");

function stageOf(year: number): { label: string; color: string } {
  if (year < 5) return { label: "Early childhood", color: "bg-sky-400/70" };
  if (year < 12) return { label: "Childhood", color: "bg-cyan-400/70" };
  if (year < 18) return { label: "School", color: "bg-teal-400/70" };
  if (year < 23) return { label: "Study", color: "bg-emerald-400/70" };
  if (year < 30) return { label: "Twenties", color: "bg-lime-400/70" };
  if (year < 40) return { label: "Career", color: "bg-amber-400/70" };
  if (year < 55) return { label: "Family & growth", color: "bg-orange-400/70" };
  if (year < 68) return { label: "Prime", color: "bg-rose-400/70" };
  return { label: "Reflection", color: "bg-violet-400/70" };
}

function LifeInWeeks() {
  const [birthInput, setBirthInput] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const birth = birthInput ? new Date(birthInput) : null;
  const valid = birth !== null && !Number.isNaN(birth.getTime()) && birth.getTime() < now.getTime();

  const msPerWeek = 7 * 24 * 3600 * 1000;
  const livedMs = valid ? now.getTime() - birth!.getTime() : 0;
  const livedYears = valid ? livedMs / (365.25 * 24 * 3600 * 1000) : 0;
  const livedWeeks = valid ? Math.floor(livedMs / msPerWeek) : 0;
  const lifeFraction = valid ? Math.min(1, livedYears / LIFE_YEARS) : 0;
  const lifePct = valid ? (lifeFraction * 100).toFixed(2) : "0";

  const weeksInYearProgress = valid ? ((livedMs % (365.25 * 24 * 3600 * 1000)) / msPerWeek) % 1 : 0;

  // calendar grid: LIFE_YEARS rows x WEEKS_PER_YEAR columns
  const totalWeeks = LIFE_YEARS * WEEKS_PER_YEAR;

  return (
    <AppShell title="Life in Weeks">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🗓️ Life in Weeks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every box is one week of a {LIFE_YEARS}-year life. This is your life, one cell at a time.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Your date of birth</label>
          <input
            type="date"
            value={birthInput}
            max={now.toISOString().slice(0, 10)}
            onChange={(e) => setBirthInput(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
          {valid && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/60 p-2">
                <p className="text-lg font-bold tabular-nums text-foreground">{livedYears.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">years lived</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-2">
                <p className="text-lg font-bold tabular-nums text-foreground">{fmt.format(livedWeeks)}</p>
                <p className="text-[10px] text-muted-foreground">weeks lived</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-2">
                <p className="text-lg font-bold tabular-nums text-primary">{lifePct}%</p>
                <p className="text-[10px] text-muted-foreground">of a {LIFE_YEARS}-year life</p>
              </div>
            </div>
          )}
        </div>

        {valid && (
          <>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                The year so far - you are {Math.round(weeksInYearProgress * 100)}% through week{" "}
                {Math.floor((livedMs % (365.25 * 24 * 3600 * 1000)) / msPerWeek) + 1} of this year
              </p>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${weeksInYearProgress * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(0, 1fr))` }}
                role="img"
                aria-label={`Grid of ${fmt.format(totalWeeks)} weeks, ${fmt.format(livedWeeks)} filled`}
              >
                {Array.from({ length: totalWeeks }, (_, i) => {
                  const filled = i < livedWeeks;
                  const isCurrent = i === livedWeeks;
                  return (
                    <div
                      key={i}
                      title={`Week ${i + 1}`}
                      className={`aspect-square rounded-[1px] ${
                        isCurrent ? "bg-primary ring-1 ring-primary/60" : filled ? "bg-primary/35" : "bg-muted/50"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-[1px] bg-primary/35" /> weeks lived
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-[1px] bg-primary ring-1 ring-primary/60" /> this week
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-[1px] bg-muted/50" /> weeks ahead
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Life stages</p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {[5, 12, 18, 23, 30, 40, 55, 68, 90].map((yr, idx, arr) => {
                  const prev = idx === 0 ? 0 : arr[idx - 1]!;
                  const s = stageOf(yr);
                  return (
                    <div key={yr} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className={`inline-block size-2 rounded-full ${s.color}`} />
                      <span>
                        {prev}-{yr}: {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
