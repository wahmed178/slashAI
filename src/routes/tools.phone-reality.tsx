import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/phone-reality")({ component: PhoneReality });

/**
 * Phone Reality Check — screen-time numbers are abstract ("4h 12m"), so this
 * turns the current usage into the unit that actually lands: years of your
 * one life, km of thumb-scroll, and what you'd get back by shaving an hour.
 * Pure arithmetic, fully local, no judgement copy — the maths does the work.
 */

function PhoneReality() {
  const [hours, setHours] = useState(4);
  const [minutes, setMinutes] = useState(30);
  const [age, setAge] = useState(28);
  const [lifeExp, setLifeExp] = useState(72);

  const dailyMinutes = hours * 60 + minutes;

  const numbers = useMemo(() => {
    if (dailyMinutes <= 0) return null;
    const remainingYears = Math.max(1, lifeExp - age);
    const remainingMinutes = remainingYears * 365.25 * dailyMinutes;

    // waking-life share (assume ~16 waking hours)
    const wakingShare = Math.round((dailyMinutes / (16 * 60)) * 100);

    // scroll: average thumb-scroll ~ 1.2 m/min of active feed time
    const scrollKmPerYear = ((dailyMinutes * 1.2 * 365.25) / 1000).toFixed(0);

    // a "shaved hour" scenario: 60 min back
    const savedMinutes = Math.min(60, dailyMinutes);
    const savedDaysPerYear = (savedMinutes * 365.25) / (24 * 60);
    const savedYearsOverLife = ((savedMinutes * remainingYears * 365.25) / (60 * 24 * 365.25)).toFixed(1);

    // books at 1 book ≈ 6 hours of reading; languages at 400h to conversational
    const booksEquivalent = Math.round((savedMinutes * 365.25) / 360);
    const languagesPossible = Math.floor((savedMinutes * remainingYears * 365.25) / (400 * 60));

    return {
      yearsLeftOnPhone: (remainingMinutes / (60 * 24 * 365.25)).toFixed(1),
      wakingShare,
      scrollKmPerYear,
      savedMinutes,
      savedDaysPerYear: savedDaysPerYear.toFixed(0),
      savedYearsOverLife,
      booksEquivalent,
      languagesPossible,
      remainingYears,
    };
  }, [dailyMinutes, age, lifeExp]);

  return (
    <AppShell title="Phone Reality Check">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📵 Phone Reality Check</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          "4 hours a day" hides the truth. This converts your screen time into the only units that matter —
          years of your life, kilometres of scrolling, and what you'd get back by keeping one hour a day
          for yourself. No data leaves this page; iOS and Android both show your daily average in settings.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground">Daily screen time</label>
              <span className="font-black text-primary">
                {hours}h {minutes}m
              </span>
            </div>
            <input type="range" min={0} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            <input
              type="range"
              min={0}
              max={55}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Your age</label>
              <input
                type="number"
                min={8}
                max={90}
                value={age}
                onChange={(e) => setAge(Math.max(1, Number(e.target.value) || 0))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Life expectancy (yrs)</label>
              <input
                type="number"
                min={40}
                max={100}
                value={lifeExp}
                onChange={(e) => setLifeExp(Math.max(40, Number(e.target.value) || 0))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {numbers && (
          <>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">at this rate, the rest of your life on the phone is</p>
              <p className="mt-2 text-5xl font-black text-foreground">{numbers.yearsLeftOnPhone} years</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                — {numbers.wakingShare}% of every waking day for the next {numbers.remainingYears} years
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <p className="text-xl font-black text-foreground">{numbers.scrollKmPerYear} km</p>
                <p className="text-[11px] text-muted-foreground">scrolled per year — thumb travel</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <p className="text-xl font-black text-foreground">{numbers.savedDaysPerYear} days</p>
                <p className="text-[11px] text-muted-foreground">recovered per year if you keep 1h/day</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <p className="text-xl font-black text-foreground">{numbers.savedYearsOverLife} years</p>
                <p className="text-[11px] text-muted-foreground">returned over your remaining life</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <p className="text-xl font-black text-foreground">{numbers.booksEquivalent} books</p>
                <p className="text-[11px] text-muted-foreground">readable per year with that 1 hour</p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <p className="text-sm font-bold text-foreground">
                One hour a day is enough to reach conversational level in {numbers.languagesPossible} foreign language
                {numbers.languagesPossible === 1 ? "" : "s"} before you turn {lifeExp}.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">~400 focused hours gets a language to conversational — that's all this means.</p>
            </div>

            <p className="px-2 text-[11px] leading-relaxed text-muted-foreground">
              The maths: your daily minutes × days remaining, waking share vs 16 waking hours, ~1.2 m/min average
              thumb scroll, 360h per book, 400h per conversational language. It's arithmetic, not therapy — if the
              numbers annoy you, that's the tool working.
            </p>
          </>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}
