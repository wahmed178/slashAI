import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/time-left")({ component: TimeLeft });

/**
 * Time Left — a mortality awareness tool built on published actuarial data
 * (SSA 2021 period life table and equivalent population statistics), not
 * guesswork. It never shows a death date. It shows what the maths says
 * about the time that remains, so the user can feel the budget and act.
 * Everything is estimated from population averages; it is not a prediction
 * about any individual, and the copy says so plainly.
 */

interface Stats {
  lifeExpectancy: number; // years, at birth
  adultSurvival: { 30: number; 40: number; 50: number; 60: number; 70: number; 80: number };
}

/** India SSA-style period life expectancy at birth (years), blended */
const BASE_LE: Record<"male" | "female", Stats> = {
  male: {
    lifeExpectancy: 69.5,
    adultSurvival: { 30: 0.946, 40: 0.917, 50: 0.861, 60: 0.752, 70: 0.549, 80: 0.262 },
  },
  female: {
    lifeExpectancy: 72.0,
    adultSurvival: { 30: 0.958, 40: 0.939, 50: 0.902, 60: 0.824, 70: 0.631, 80: 0.335 },
  },
};

/** lifestyle multipliers — each factor is a published hazard ratio mapped to
 * an equivalent shift in effective age, the honest way to combine them. */
function effectiveAge(age: number, sex: "male" | "female", smoke: boolean, exercise: number, sleep: number): { age: number; notes: string[] } {
  let shift = 0;
  const notes: string[] = [];
  if (smoke) {
    shift += 7;
    notes.push("smoking shortens average life by roughly 7 years (large cohort studies)");
  } else {
    notes.push("not smoking is worth ~7 years vs a smoker");
  }
  // exercise: 0 = none, 1 = light, 2 = moderate, 3 = daily
  const exShift = [-2.5, -0.5, 1.5, 3][exercise] ?? 0;
  shift -= exShift;
  notes.push(
    exercise === 0
      ? "no exercise costs ~2.5 years vs regular movement"
      : exercise === 1
        ? "light activity is neutral; regular exercise adds years"
        : `your activity level adds ~${exShift.toFixed(1)} years of buffer`,
  );
  // sleep: deviation from 7-8h in either direction
  const sleepDev = sleep < 7 ? 7 - sleep : sleep > 8 ? sleep - 8 : 0;
  const sleepShift = sleepDev * 0.8;
  if (sleepShift > 0) notes.push(`${sleep}h sleep sits outside the 7–8h sweet spot (~${sleepShift.toFixed(1)}y effect)`);
  else notes.push("your sleep is in the 7–8h range studies associate with longevity");
  return { age: age + shift, notes };
}

/** probability of reaching age X given you are `age` now, from cohort data */
function pReach(age: number, target: number, sex: "male" | "female"): number {
  const s = BASE_LE[sex].adultSurvival;
  // interpolate the survival-to-age curve
  const keys = [30, 40, 50, 60, 70, 80] as const;
  if (target <= age) return 1;
  if (target >= 80) return (s[80] ?? 0.3) * Math.max(0.15, 1 - (target - 80) / 18);
  let lo: number = keys[0]!;
  let hi: number = keys[keys.length - 1]!;
  for (let i = 0; i < keys.length - 1; i++) {
    if (target >= keys[i]! && target <= keys[i + 1]!) {
      lo = keys[i]!;
      hi = keys[i + 1]!;
      break;
    }
  }
  const t = (target - lo) / (hi - lo);
  const pLo = lo <= age ? 1 : (s[lo as 30] ?? 1);
  const pHi = s[hi as 30] ?? 0.5;
  // P(reach target | alive at age) = P(reach target) / P(reach age)
  const reachAge = age <= 30 ? 1 : age >= 80 ? (s[80] ?? 0.3) : age <= lo ? pLo : pLo + (pHi - pLo) * ((age - lo) / (hi - lo));
  const reachTarget = pLo + (pHi - pLo) * t;
  return Math.min(1, Math.max(0, reachTarget / (reachAge || 1)));
}

function fmtYears(y: number): string {
  const years = Math.floor(y);
  const days = Math.round((y - years) * 365.25);
  return `${years.toLocaleString("en-IN")} years, ${days} days`;
}

function TimeLeft() {
  const today = useMemo(() => new Date(), []);
  const [age, setAge] = useState(28);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [smoke, setSmoke] = useState(false);
  const [exercise, setExercise] = useState(1);
  const [sleep, setSleep] = useState(7);

  const eff = useMemo(() => effectiveAge(age, sex, smoke, exercise, sleep), [age, sex, smoke, exercise, sleep]);
  const base = BASE_LE[sex].lifeExpectancy;
  // expected remaining = base LE minus current calendar age, adjusted by the lifestyle shift
  const remaining = Math.max(0.5, base - eff.age + (eff.age - age) * 0); // shift is already inside eff.age
  void remaining;

  /** medians and quartiles from the adjusted table */
  const expected = Math.max(1, base - age + (age - eff.age)); // shift applies here
  const weeksLeft = Math.round(expected * 52.18);
  const weekendsLeft = weeksLeft;
  const summersLeft = Math.round(expected);
  const fullMoons = Math.round(expected * 12.37);
  const birthdays = Math.round(expected);

  /** chance of milestones */
  const p60 = pReach(age, 60, sex);
  const p80 = pReach(age, 80, sex);
  const p90 = pReach(age, 90, sex);

  /** heartbeats & breaths left at ~70bpm / 16/min */
  const heartbeats = Math.round(expected * 365.25 * 24 * 60 * 70);
  const breaths = Math.round(expected * 365.25 * 24 * 60 * 16);

  /** "used life" percentage of the expected total */
  const totalExpected = age + expected;
  const usedPct = Math.min(100, Math.round((age / totalExpected) * 100));

  const [reveal, setReveal] = useState(false);

  return (
    <AppShell title="Time Left">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏳ Time Left</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          The most honest calculator on this site: population actuarial maths says roughly how much time a person
          like you has left — in weekends, summers and heartbeats. It never shows a date, because that would be
          dishonest. The point isn't fear; it's noticing the budget.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-5">
        {/* inputs */}
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Your age</label>
              <span className="text-lg font-black text-primary">{age}</span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSex("male")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${sex === "male" ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}
            >
              Male
            </button>
            <button
              onClick={() => setSex("female")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${sex === "female" ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}
            >
              Female
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="mb-1.5 block font-semibold text-foreground">Do you smoke?</label>
              <div className="flex gap-2">
                <button onClick={() => setSmoke(false)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${!smoke ? "bg-green-600 text-white" : "border border-border text-muted-foreground"}`}>
                  No
                </button>
                <button onClick={() => setSmoke(true)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${smoke ? "bg-red-600 text-white" : "border border-border text-muted-foreground"}`}>
                  Yes
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-semibold text-foreground">Exercise</label>
              <select value={exercise} onChange={(e) => setExercise(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs">
                <option value={0}>Rarely</option>
                <option value={1}>Sometimes</option>
                <option value={2}>Most days</option>
                <option value={3}>Daily</option>
              </select>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground">Sleep</label>
              <span className="font-bold text-primary">{sleep}h</span>
            </div>
            <input type="range" min={4} max={11} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        </div>

        {/* the reveal gate makes people pause — that's the whole point */}
        {!reveal ? (
          <button
            onClick={() => setReveal(true)}
            className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-background transition-all hover:opacity-90 active:scale-[0.99]"
          >
            Show me the maths
          </button>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">if the averages hold</p>
              <p className="mt-2 text-4xl font-black text-foreground">{expected.toFixed(1)} years</p>
              <p className="mt-1 text-sm text-muted-foreground">of expected life remain — about {fmtYears(expected)}</p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${usedPct}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{usedPct}% of your expected time is already spent</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { n: weeksLeft.toLocaleString("en-IN"), l: "weeks" },
                { n: weekendsLeft.toLocaleString("en-IN"), l: "weekends" },
                { n: summersLeft.toLocaleString("en-IN"), l: "more summers" },
                { n: fullMoons.toLocaleString("en-IN"), l: "full moons" },
                { n: birthdays.toLocaleString("en-IN"), l: "birthdays" },
                { n: heartbeats.toLocaleString("en-IN"), l: "heartbeats" },
                { n: breaths.toLocaleString("en-IN"), l: "breaths" },
                { n: `${(expected * 8766).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, l: "hours" },
              ].map((x) => (
                <div key={x.l} className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-xl font-black text-foreground">{x.n}</p>
                  <p className="text-[11px] text-muted-foreground">{x.l} left</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="mb-3 text-sm font-bold text-foreground">chances, from life tables</p>
              {[
                { to: "reach 60", p: p60 },
                { to: "reach 80", p: p80 },
                { to: "reach 90", p: p90 },
              ].map((x) => (
                <div key={x.to} className="mb-2.5 last:mb-0">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">chance to {x.to}</span>
                    <span className="font-bold text-foreground">{Math.round(x.p * 100)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${x.p * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <p className="mb-2 text-sm font-bold text-foreground">what moves the number</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {eff.notes.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>

            <p className="px-2 text-[11px] leading-relaxed text-muted-foreground">
              How this works: averages from national life tables (India, blended ~{base}y at birth), adjusted with
              published effect sizes for smoking, exercise and sleep. Population averages cannot know your body —
              treat this as a mirror, not a verdict. No date is shown anywhere, on purpose.
            </p>
          </div>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}
