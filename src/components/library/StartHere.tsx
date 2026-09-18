import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useLibrary } from "@/hooks/use-library";

/**
 * "Start Here" — three one-tap starting points for a first-time visitor.
 * Picking one also records the matching persona, so the rest of Discover
 * stays tailored without asking anyone to sign in.
 */
const PATHS = [
  {
    id: "student",
    emoji: "🎓",
    label: "I'm a student",
    hint: "Essays, research, revision and career prep",
    audience: "students",
  },
  {
    id: "professional",
    emoji: "💼",
    label: "I'm a professional",
    hint: "Emails, reports, meetings and career growth",
    audience: "professionals",
  },
  {
    id: "developer",
    emoji: "💻",
    label: "I'm a developer",
    hint: "APIs, coding commands and dev resources",
    audience: "developers",
  },
] as const;

export function StartHere() {
  const { updateSettings } = useLibrary();

  return (
    <section className="panel rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className="text-[15px] font-bold text-foreground">Start here</h2>
        <span className="text-[12px] text-muted-foreground">
          Pick who you are — we'll point you at the right shelf. No account needed.
        </span>
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {PATHS.map((p) => (
          <Link
            key={p.id}
            to="/hub/$audience"
            params={{ audience: p.audience }}
            onClick={() => updateSettings({ persona: p.id })}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-[20px]" aria-hidden>
              {p.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-semibold text-foreground">{p.label}</span>
              <span className="block text-[11.5px] leading-snug text-muted-foreground">{p.hint}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}
