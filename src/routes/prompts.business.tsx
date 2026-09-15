import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Copy, Search } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { COMMANDS, type SlashCommand } from "@/lib/commands";
import { useCommandActions } from "@/hooks/use-command-actions";

export const Route = createFileRoute("/prompts/business")({
  head: () => ({
    meta: [
      { title: "Free AI Prompts for Small Business & Marketing | SlashAI" },
      {
        name: "description",
        content:
          "Free copy-ready AI prompts for small business: marketing copy, emails, business plans, customer analysis and pricing - works in free ChatGPT, Claude and Gemini.",
      },
    ],
  }),
  component: BusinessPromptsPage,
});

const CATEGORIES = [
  "Marketing & SEO",
  "Business & Management",
  "Sales & CRM",
  "Content & Social Media",
];

const BLURBS: Record<string, string> = {
  "Marketing & SEO": "Ads, landing pages, SEO briefs and email campaigns",
  "Business & Management": "Plans, pricing, strategy and decision frameworks",
  "Sales & CRM": "Outreach, follow-ups and proposal copy that converts",
  "Content & Social Media": "Posts, captions and content calendars in minutes",
};

function BusinessPromptsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const pool = COMMANDS.filter((c) => c.category === cat);
      return { cat, commands: pool.slice(0, 12), total: pool.length };
    }).filter((s) => s.commands.length > 0);
  }, []);

  return (
    <AppShell hideHeaderSearch title="Business Prompts">
      <div className="mx-auto max-w-3xl space-y-8 pt-2 pb-10">
        <header>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <Briefcase className="size-3" aria-hidden /> For business
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Free AI prompts for small business, marketing &amp; sales
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Marketing copy, email sequences, business plans, customer-feedback
            analysis and pricing strategy - copy-ready, structured templates
            that work in the free tiers of ChatGPT, Claude and Gemini. No
            account, no paywall.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all business prompts - e.g. ads, email, pricing…"
              aria-label="Search business prompts"
              className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {sections.map((s) => (
          <section key={s.cat} aria-labelledby={`sec-${s.cat}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`sec-${s.cat}`} className="text-base font-bold text-foreground">
                {s.cat}
              </h2>
              <Link
                to="/explore/$category"
                params={{ category: s.cat }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                All {s.total} <ArrowRight className="size-3" aria-hidden />
              </Link>
            </div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{BLURBS[s.cat]}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {s.commands.map((c) => (
                <PromptRow key={c.id} cmd={c} />
              ))}
            </ul>
          </section>
        ))}

        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-[13px] text-muted-foreground">
            Just the highlights - the full library covers every business task.
          </p>
          <Link
            to="/prompts"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
          >
            Browse all prompts <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function PromptRow({ cmd }: { cmd: SlashCommand }) {
  const { copyCommand } = useCommandActions();
  const [copied, setCopied] = useState(false);

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="min-w-0 flex-1">
        <Link
          to="/c/$slug"
          params={{ slug: cmd.id }}
          className="block truncate font-mono text-[13px] font-semibold text-primary hover:underline"
        >
          {cmd.command}
        </Link>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
          {cmd.description}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${cmd.command}`}
        onClick={() => {
          copyCommand(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="mt-0.5 shrink-0 rounded-lg border border-border bg-surface-elevated p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Copy
          aria-hidden
          className={`size-3.5 ${copied ? "text-primary" : ""}`}
        />
      </button>
    </li>
  );
}
