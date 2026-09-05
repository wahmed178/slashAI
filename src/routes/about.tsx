import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { VERIFIED_TOTAL, CATEGORY_TREE } from "@/lib/commands";
import { RESOURCE_TOTAL } from "@/lib/resources";
import { ALL_ROADMAPS } from "@/lib/roadmaps";
import { GLOSSARY_TOTAL } from "@/lib/glossary";
import { SLASH_TOOL_COUNT } from "@/lib/slashkits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SlashAI" },
      {
        name: "description",
        content:
          "What SlashAI is, what you get free, how it works, and what it's built with.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell hideHeaderSearch title="About">
      <article className="mx-auto max-w-xl space-y-10 pt-2">
        {/* Section 1: What it is */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            About SlashAI
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            SlashAI is a free, offline-capable library of {VERIFIED_TOTAL.toLocaleString()} AI slash
            commands and {RESOURCE_TOTAL} curated resources, built for builders, students, creators
            and curious people everywhere.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            No account. No tracking. No payment.
            Everything works. Everything is free.
          </p>
        </header>

        {/* Section 2: What you get — free, always */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            What you get — free, always
          </h2>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>{VERIFIED_TOTAL.toLocaleString()} copy-ready AI slash commands</p>
            <p>{RESOURCE_TOTAL} curated free resources — tools, APIs, channels</p>
            <p>{SLASH_TOOL_COUNT} browser-based tools in SlashKits</p>
            <p>{ALL_ROADMAPS.length} step-by-step founder roadmaps</p>
            <p>{GLOSSARY_TOTAL}-term AI and startup glossary across {CATEGORY_TREE.length} categories</p>
            <p>Live dashboard — markets, cricket, prayer, weather</p>
            <p>Daily quiz across 24 categories</p>
            <p>12 curated hubs — role-based and language-focused</p>
            <p>Islam Hub — Quran, Hadith, prayer tools</p>
          </div>
        </section>

        {/* Section 3: How it works */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How it works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Press <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[13px] text-foreground">/</code> anywhere to search commands.
            Use Discover to browse free tools, APIs and channels.
            Use Hubs to find resources curated for your role.
            Use SlashKits for {SLASH_TOOL_COUNT} browser tools — nothing uploads.
            All your saved items stay on your device.
          </p>
        </section>

        {/* Section 4: Built with */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Built with
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            React · TanStack Start · Vercel · Inter font
            Open-Meteo · CoinGecko · Aladhan · TheSportsDB
            HackerNews · AlQuran.cloud · NASA APOD
            Open Trivia Database · Frankfurter · OpenAQ
          </p>
        </section>

        {/* Section 5: Suggest a resource */}
        <section>
          <a
            href="https://github.com/wahmed178/slashAI/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:translate-x-[3px] hover:text-primary/80"
          >
            Found something we missed? Open an issue on GitHub →
          </a>
        </section>
      </article>
    </AppShell>
  );
}
