import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Briefcase, Search } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { categoryIcon } from "@/components/library/icons";
import { VERIFIED_TOTAL, CATEGORY_TREE } from "@/lib/commands";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      // Real count, from the same catalogue the page renders (this head() wins
      // over the root SEO layer, so it has to stay honest on its own).
      { title: `${VERIFIED_TOTAL.toLocaleString("en-US")} Free AI Prompts for ChatGPT, Claude & Gemini | SlashAI` },
      {
        name: "description",
        content: `A free library of ${VERIFIED_TOTAL.toLocaleString("en-US")} copy-ready AI prompts for writing, coding, marketing, design, study and business - organised by category, with examples. No sign-up.`,
      },
    ],
  }),
  component: PromptsPage,
});

function PromptsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <AppShell hideHeaderSearch title="Free AI Prompts">
      <div className="mx-auto max-w-3xl space-y-8 pt-2 pb-10">
        {/* Hero */}
        <header>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <BookOpen className="size-3" aria-hidden /> Free prompt library
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {VERIFIED_TOTAL.toLocaleString()}+ free AI prompts for ChatGPT, Claude &amp; Gemini
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Stop guessing what to type. Every prompt here is a structured,
            copy-ready template with a description, how-to-use note and a
            worked example — organised into {CATEGORY_TREE.length} categories.
            Copy, fill in the blanks, paste into any AI tool. Free forever, no
            account.
          </p>
        </header>

        {/* Search into the real catalog */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${VERIFIED_TOTAL.toLocaleString("en-US")} prompts - e.g. essay, invoice, instagram caption…`}
              aria-label="Search AI prompts"
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

        {/* Audiences */}
        <section aria-labelledby="prompts-audiences">
          <h2 id="prompts-audiences" className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Prompts by who you are
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              to="/prompts/students"
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">For students</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
                  Study plans, active-recall quizzes, essay outlines, exam prep
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  Open student prompts <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
            <Link
              to="/prompts/business"
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">For business</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
                  Marketing copy, emails, business plans, customer analysis
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  Open business prompts <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* Category grid → explore */}
        <section aria-labelledby="prompts-categories">
          <h2 id="prompts-categories" className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Browse all {CATEGORY_TREE.length} categories
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORY_TREE.map((cat) => {
              const Icon = categoryIcon(cat.icon);
              return (
                <Link
                  key={cat.category}
                  to="/explore/$category"
                  params={{ category: cat.category }}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-primary/40"
                >
                  <Icon aria-hidden className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-semibold text-foreground">{cat.category}</span>
                    <span className="block text-[10.5px] text-muted-foreground">{cat.count} prompts</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <FaqSection />
      </div>
    </AppShell>
  );
}
