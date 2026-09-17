import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/play/capitals")({
  head: () => ({
    meta: [
      { title: "World Capitals Quiz - Free Browser Game | SlashAI" },
      {
        name: "description",
        content:
          "Name the capital of 60+ countries across every continent. Four options, streaks, region filters. Free geography quiz, no account.",
      },
    ],
  }),
  component: CapitalsGame,
});

interface Q {
  country: string;
  capital: string;
  region: Region;
}

type Region = "Europe" | "Asia" | "Africa" | "Americas" | "Oceania" | "Mixed";

const DATA: Q[] = [
  { country: "France", capital: "Paris", region: "Europe" },
  { country: "Germany", capital: "Berlin", region: "Europe" },
  { country: "Italy", capital: "Rome", region: "Europe" },
  { country: "Spain", capital: "Madrid", region: "Europe" },
  { country: "Portugal", capital: "Lisbon", region: "Europe" },
  { country: "Netherlands", capital: "Amsterdam", region: "Europe" },
  { country: "Belgium", capital: "Brussels", region: "Europe" },
  { country: "Austria", capital: "Vienna", region: "Europe" },
  { country: "Switzerland", capital: "Bern", region: "Europe" },
  { country: "Poland", capital: "Warsaw", region: "Europe" },
  { country: "Sweden", capital: "Stockholm", region: "Europe" },
  { country: "Norway", capital: "Oslo", region: "Europe" },
  { country: "Denmark", capital: "Copenhagen", region: "Europe" },
  { country: "Finland", capital: "Helsinki", region: "Europe" },
  { country: "Greece", capital: "Athens", region: "Europe" },
  { country: "Czechia", capital: "Prague", region: "Europe" },
  { country: "Hungary", capital: "Budapest", region: "Europe" },
  { country: "Ireland", capital: "Dublin", region: "Europe" },
  { country: "Ukraine", capital: "Kyiv", region: "Europe" },
  { country: "Japan", capital: "Tokyo", region: "Asia" },
  { country: "China", capital: "Beijing", region: "Asia" },
  { country: "South Korea", capital: "Seoul", region: "Asia" },
  { country: "India", capital: "New Delhi", region: "Asia" },
  { country: "Pakistan", capital: "Islamabad", region: "Asia" },
  { country: "Bangladesh", capital: "Dhaka", region: "Asia" },
  { country: "Indonesia", capital: "Jakarta", region: "Asia" },
  { country: "Thailand", capital: "Bangkok", region: "Asia" },
  { country: "Vietnam", capital: "Hanoi", region: "Asia" },
  { country: "Malaysia", capital: "Kuala Lumpur", region: "Asia" },
  { country: "Philippines", capital: "Manila", region: "Asia" },
  { country: "Turkey", capital: "Ankara", region: "Asia" },
  { country: "Iran", capital: "Tehran", region: "Asia" },
  { country: "Iraq", capital: "Baghdad", region: "Asia" },
  { country: "Saudi Arabia", capital: "Riyadh", region: "Asia" },
  { country: "United Arab Emirates", capital: "Abu Dhabi", region: "Asia" },
  { country: "Qatar", capital: "Doha", region: "Asia" },
  { country: "Kazakhstan", capital: "Astana", region: "Asia" },
  { country: "Nepal", capital: "Kathmandu", region: "Asia" },
  { country: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", region: "Asia" },
  { country: "Egypt", capital: "Cairo", region: "Africa" },
  { country: "Nigeria", capital: "Abuja", region: "Africa" },
  { country: "Kenya", capital: "Nairobi", region: "Africa" },
  { country: "Ethiopia", capital: "Addis Ababa", region: "Africa" },
  { country: "South Africa", capital: "Pretoria", region: "Africa" },
  { country: "Morocco", capital: "Rabat", region: "Africa" },
  { country: "Algeria", capital: "Algiers", region: "Africa" },
  { country: "Ghana", capital: "Accra", region: "Africa" },
  { country: "Tanzania", capital: "Dodoma", region: "Africa" },
  { country: "United States", capital: "Washington, D.C.", region: "Americas" },
  { country: "Canada", capital: "Ottawa", region: "Americas" },
  { country: "Mexico", capital: "Mexico City", region: "Americas" },
  { country: "Brazil", capital: "Brasília", region: "Americas" },
  { country: "Argentina", capital: "Buenos Aires", region: "Americas" },
  { country: "Chile", capital: "Santiago", region: "Americas" },
  { country: "Colombia", capital: "Bogotá", region: "Americas" },
  { country: "Peru", capital: "Lima", region: "Americas" },
  { country: "Cuba", capital: "Havana", region: "Americas" },
  { country: "Australia", capital: "Canberra", region: "Oceania" },
  { country: "New Zealand", capital: "Wellington", region: "Oceania" },
  { country: "Fiji", capital: "Suva", region: "Oceania" },
  { country: "Papua New Guinea", capital: "Port Moresby", region: "Oceania" },
];

const REGIONS: Region[] = ["Mixed", "Europe", "Asia", "Africa", "Americas", "Oceania"];

interface Round {
  q: Q;
  options: string[];
}

function buildRound(pool: Q[]): Round {
  const q = pool[Math.floor(Math.random() * pool.length)]!;
  const distractors = pool
    .filter((p) => p.capital !== q.capital)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((p) => p.capital);
  const options = [...distractors, q.capital].sort(() => Math.random() - 0.5);
  return { q, options };
}

function CapitalsGame() {
  const [region, setRegion] = useState<Region>("Mixed");
  const [round, setRound] = useState<Round | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("capitals-best") ?? 0));

  const pool = useMemo(() => (region === "Mixed" ? DATA : DATA.filter((d) => d.region === region)), [region]);

  const nextRound = () => {
    setRound(buildRound(pool));
    setPicked(null);
  };

  // new round when region changes or on first load
  useEffect(() => {
    setRound(buildRound(pool));
    setPicked(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const answer = (opt: string) => {
    if (picked || !round) return;
    setPicked(opt);
    setAsked((a) => a + 1);
    if (opt === round.q.capital) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next > best) {
          setBest(next);
          localStorage.setItem("capitals-best", String(next));
        }
        return next;
      });
      feedback("success");
    } else {
      setStreak(0);
      feedback("tap");
    }
  };

  const reset = () => {
    setScore(0);
    setAsked(0);
    setStreak(0);
    nextRound();
  };

  return (
    <AppShell title="World Capitals Quiz">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌍 World Capitals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What's the capital of…? {DATA.length} countries, streak scoring, region filters.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* region filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
                region === r ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* score row */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-2.5 text-[13px]">
          <span className="font-bold text-foreground">
            {score}<span className="text-muted-foreground">/{asked}</span>
          </span>
          <span className="font-semibold text-muted-foreground">
            streak {streak} · best {best}
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
        </div>

        {/* question */}
        {round && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Capital of
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">{round.q.country}</p>

            <div className="mt-4 space-y-2">
              {round.options.map((opt) => {
                const isAnswer = opt === round.q.capital;
                const isPicked = picked === opt;
                const revealed = picked !== null;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => answer(opt)}
                    disabled={revealed}
                    className={`w-full rounded-xl border px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all ${
                      revealed && isAnswer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-foreground"
                        : revealed && isPicked
                          ? "border-rose-500/50 bg-rose-500/10 text-foreground"
                          : revealed
                            ? "border-border bg-surface text-muted-foreground"
                            : "border-border bg-surface text-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked && (
              <button
                type="button"
                onClick={nextRound}
                className="ripple-press mt-4 h-11 w-full rounded-xl bg-primary text-[13.5px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Next country →
              </button>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          Capitals only — the largest city is often not the capital (Canberra, not Sydney).
        </p>
      </div>
    </AppShell>
  );
}
