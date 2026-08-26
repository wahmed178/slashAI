import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Badge } from "@/components/ui/badge";
import { GENERATORS, FREE_DAILY_RUNS, readRunCount } from "@/lib/generators";

export const Route = createFileRoute("/generators/")({
  head: () => ({
    meta: [
      { title: "Founder AI toolkit — names, MVPs, decks & more | SlashAI" },
      {
        name: "description",
        content:
          "Ten focused Claude-powered generators for startup work: business names, MVP plans, landing copy, pitch decks, cold email, SOPs, OKRs and more.",
      },
      { property: "og:title", content: "Founder AI Toolkit — SlashAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GeneratorsIndex,
});

function GeneratorsIndex() {
  const runs = typeof window !== "undefined" ? readRunCount() : 0;
  const left = Math.max(0, FREE_DAILY_RUNS - runs);

  return (
    <AppShell hideHeaderSearch title="AI Toolkit">
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Sparkles className="size-6 text-primary" aria-hidden />
          Founder AI toolkit
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Ten focused generators that do one job well. Powered by Claude — every output is built
          from your inputs.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">Free tier</Badge>
          <span>
            {left} of {FREE_DAILY_RUNS} generations left today · resets at midnight UTC
          </span>
        </div>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {GENERATORS.map((g) => (
          <Link
            key={g.id}
            to="/generators/$id"
            params={{ id: g.id }}
            className="panel group flex flex-col rounded-2xl p-4 transition-transform active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden>
              {g.emoji}
            </span>
            <h2 className="mt-2.5 font-bold text-foreground group-hover:text-primary">{g.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{g.tagline}</p>
            <span className="mt-3 text-xs font-medium text-primary/80">{g.fields.length} inputs → full draft</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
