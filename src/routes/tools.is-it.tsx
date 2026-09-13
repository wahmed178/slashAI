import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/is-it")({ component: IsIt });

type Answer = { yes: boolean; note: string; emoji: string };

/** All answers computed locally from the clock — no APIs, works offline. */
function computeAnswer(q: string, now: Date): Answer {
  switch (q) {
    case "christmas": {
      const yes = now.getMonth() === 11 && now.getDate() === 25;
      if (yes) return { yes: true, emoji: "🎄", note: "Merry Christmas! Yes. Finally." };
      const dec25 = new Date(now.getFullYear(), 11, 25);
      if (now > dec25) dec25.setFullYear(dec25.getFullYear() + 1);
      const days = Math.ceil((dec25.getTime() - now.getTime()) / 86_400_000);
      return { yes: false, emoji: "🎄", note: `No. ${days} day${days === 1 ? "" : "s"} to go.` };
    }
    case "friday": {
      const yes = now.getDay() === 5;
      return {
        yes,
        emoji: "🎉",
        note: yes ? "Yes. Go home. You've earned it." : "No. Hang in there.",
      };
    }
    case "weekend": {
      const yes = now.getDay() === 0 || now.getDay() === 6;
      return { yes, emoji: "🛋️", note: yes ? "Yes. Do nothing guilt-free." : "No. But it's coming." };
    }
    case "leap": {
      const y = now.getFullYear();
      const yes = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      return { yes, emoji: "🗓️", note: yes ? `Yes — ${y} has a February 29th.` : `No — ${y} is a common year.` };
    }
    case "fullmoon": {
      // synodic month ≈ 29.53059 days from a known full moon (2000-01-06)
      const KNOWN = Date.UTC(2000, 0, 6, 18, 14);
      const cycles = (now.getTime() - KNOWN) / (29.530_588_853 * 86_400_000);
      const frac = cycles - Math.floor(cycles);
      const daysToFull = Math.min(frac, 1 - frac) * 29.530_588_853;
      const yes = daysToFull < 1;
      return {
        yes,
        emoji: "🌕",
        note: yes
          ? "Yes. Look up tonight. Howl responsibly."
          : `No — about ${Math.max(1, Math.round(daysToFull))} day(s) away.`,
      };
    }
    default:
      return { yes: false, emoji: "🤷", note: "No." };
  }
}

const QUESTIONS = [
  { id: "christmas", label: "Is it Christmas?" },
  { id: "friday", label: "Is it Friday?" },
  { id: "weekend", label: "Is it the weekend?" },
  { id: "leap", label: "Is it a leap year?" },
  { id: "fullmoon", label: "Is it a full moon?" },
] as const;

function IsIt() {
  const [q, setQ] = useState<string>("friday");
  const [now, setNow] = useState(() => new Date());

  // re-answer live so "Is it Friday?" flips at midnight
  useMemo(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const answer = computeAnswer(q, now);

  return (
    <AppShell title="Is It…?" wide>
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">❓ Is It…?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deeply committed one-question websites, gathered into one. Ask, receive, accept.
        </p>
      </header>

      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {QUESTIONS.map((item) => (
          <button
            key={item.id}
            onClick={() => setQ(item.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              q === item.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-md text-center">
        <p className="text-6xl">{answer.emoji}</p>
        <p
          className="mt-4 text-4xl font-black tracking-tight"
          style={{ color: answer.yes ? "var(--primary)" : "var(--foreground)" }}
        >
          {answer.yes ? "YES" : "NO"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{answer.note}</p>
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        Homage to isitchristmas.com & isitfridayyet.net — the internet's most committed websites.
      </p>
    </AppShell>
  );
}
