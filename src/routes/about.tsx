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
      <article className="mx-auto max-w-xl space-y-10 pt-2">
        {/* Section 1: What SlashAI is */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[#e6edf3]">
            About SlashAI
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            SlashAI is a free, offline-first library of 5,635 AI commands
            and 317+ curated resources — built for builders, students,
            creators, and curious people everywhere. No account. No tracking.
            Everything is stored on your device.
          </p>
        </header>

        {/* Section 2: What is always free */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Always free
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Every command. Every resource. Every generator (within daily limits).
            Every hub. Free forever, no credit card, no data collection.
          </p>
        </section>

        {/* Section 3: How it works */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            How it works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            Press <code className="rounded bg-[#21262d] px-1.5 py-0.5 font-mono text-[13px] text-[#e6edf3]">/</code> anywhere to search commands. Use Discover to browse
            free tools and APIs. Use Hubs for curated resources by role. Use
            Generators for AI-powered founder tools. Everything works offline
            after first load.
          </p>
        </section>

        {/* Section 4: Built with */}
        <section>
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            Built with
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">React</a>{" "}·{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">Vercel</a>{" "}·{" "}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">Claude API</a>{" "}·{" "}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">Open-Meteo</a>{" "}·{" "}
            <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">CoinGecko</a>{" "}·{" "}
            <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">Aladhan</a>{" "}·{" "}
            <a href="https://quran.cloud" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">AlQuran.cloud</a>{" "}·{" "}
            <a href="https://thesportsdb.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">TheSportsDB</a>{" "}·{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">Hacker News</a>{" "}·{" "}
            <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">NASA APOD</a>{" "}·{" "}
            <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">USGS</a>{" "}·{" "}
            <a href="https://openaq.org" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]">OpenAQ</a>
          </p>
        </section>

        {/* Section 5: Changelog link */}
        <section>
          <Link
            to="/changelog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff] transition-all hover:translate-x-[3px] hover:text-[#79c0ff]"
          >
            See what has changed →
          </Link>
        </section>

        {/* Section 6: Suggest a resource */}
        <section>
          <a
            href="https://github.com/wahmed178/slashAI/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff] transition-all hover:translate-x-[3px] hover:text-[#79c0ff]"
          >
            Found something we missed? Open an issue on GitHub →
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#30363d] py-6 text-center text-xs text-[#8b949e]/60">
          Built with care by Waseem Ahmed · Hyderabad, India
        </footer>
      </article>
    </AppShell>
  );
}
