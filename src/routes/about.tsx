import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SlashAI" },
      {
        name: "description",
        content:
          "What SlashAI is, why it exists, and what's always free.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell hideHeaderSearch title="About">
      <article className="mx-auto max-w-2xl space-y-10 pt-2">
        {/* Hero */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3] sm:text-4xl">
            About SlashAI
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#8b949e]">
            A free, offline-first library of AI commands, curated resources,
            and founder tools — built for builders, students, creators, and
            curious people everywhere.
          </p>
        </header>

        {/* What it is */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            What SlashAI is
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            SlashAI is a searchable library of 5,635 AI slash commands — the
            short modifiers like <code className="rounded bg-[#21262d] px-1.5 py-0.5 font-mono text-[13px] text-[#e6edf3]">/bokeh</code>,{" "}
            <code className="rounded bg-[#21262d] px-1.5 py-0.5 font-mono text-[13px] text-[#e6edf3]">/eli5</code>,{" "}
            <code className="rounded bg-[#21262d] px-1.5 py-0.5 font-mono text-[13px] text-[#e6edf3]">/cinematic</code>{" "}
            that transform how AI tools respond. Paste them into ChatGPT,
            Claude, Midjourney, Gemini, or any AI assistant — and get
            dramatically better output in one step.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            Beyond commands, SlashAI includes 317+ curated free resources
            (APIs, tools, YouTube channels, courses), 25 AI-powered generators
            for founders, 20 step-by-step roadmaps, a 560+ term glossary, a
            live dashboard with real-time data, and role-based hubs for
            students, developers, creators, and professionals.
          </p>
        </section>

        {/* Why it exists */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Why it exists
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Finding the right AI command is hard. Discovering good free tools
            takes hours. Most people use AI at 30% of its potential because
            they don't know the right modifiers, prompts, or workflows exist.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            SlashAI solves both problems in one calm place. Search 5,635
            commands by category, copy with one click, and get back to
            building. Every resource is hand-checked, every API is free with
            no credit card required, and everything works offline.
          </p>
        </section>

        {/* What's free — always */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            What's free — always
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Every command. Every resource. Every generator (within daily
            limits). Every hub. Every roadmap. Every glossary term.
            Free forever. No account required. No tracking. No data
            collection. Everything is stored locally on your device.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            The commands library works completely offline after first load.
            Your saved commands, reading history, and preferences never leave
            your browser.
          </p>
        </section>

        {/* Glass tier */}
        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            ✦ Glass — coming soon
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Glass is a premium tier for power users — unlimited generator
            runs, cross-device sync, team workspaces, and advanced search.
            The free tier remains fully functional. Glass is planned from
            ₹299/month ($4/month) with early access pricing.
          </p>
          <Link
            to="/glass"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
          >
            Join the waitlist →
          </Link>
        </section>

        {/* Built with */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Built with
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            React · Vercel · TanStack Start · Tailwind CSS · Claude API ·
            Open-Meteo · CoinGecko · Aladhan · TheSportsDB · Hacker News ·
            NASA APOD · USGS · ExchangeRate-API · Free Dictionary API ·
            Yahoo Finance · OpenAQ · WhereTheISS.at · AMFI NAV India
          </p>
        </section>

        {/* Suggest */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Suggest a resource
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Found something we missed?{" "}
            <a
              href="https://github.com/wahmed178/slashAI/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
            >
              Open an issue on GitHub →
            </a>
          </p>
        </section>

        {/* Stay updated */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Stay updated
          </h2>
          <div className="mt-2 flex gap-3">
            <Link
              to="/changelog"
              className="text-sm font-medium text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
            >
              Changelog →
            </Link>
            <a
              href="https://github.com/wahmed178/slashAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
            >
              GitHub →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#30363d] py-8 text-center text-xs text-[#8b949e]/60">
          Built with care by Waseem Ahmed · Hyderabad, India
        </footer>
      </article>
    </AppShell>
  );
}
