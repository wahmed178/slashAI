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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            About SlashAI
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            SlashAI is a free, offline-first library of 5,635 AI commands
            and 317+ curated resources — built for builders, students,
            creators, and curious people everywhere. No account. No tracking.
            Everything is stored on your device.
          </p>
        </header>

        {/* Section 2: What is always free */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Always free
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every command. Every resource. Every generator (within daily limits).
            Every hub. Free forever, no credit card, no data collection.
          </p>
        </section>

        {/* Section 3: How it works */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How it works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Press <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[13px] text-foreground">/</code> anywhere to search commands. Use Discover to browse
            free tools and APIs. Use Hubs for curated resources by role. Use
            Generators for AI-powered founder tools. Everything works offline
            after first load.
          </p>
        </section>

        {/* Section 4: Built with */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Built with
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">React</a>{" "}·{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">Vercel</a>{" "}·{" "}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">Claude API</a>{" "}·{" "}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">Open-Meteo</a>{" "}·{" "}
            <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">CoinGecko</a>{" "}·{" "}
            <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">Aladhan</a>{" "}·{" "}
            <a href="https://quran.cloud" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">AlQuran.cloud</a>{" "}·{" "}
            <a href="https://thesportsdb.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">TheSportsDB</a>{" "}·{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">Hacker News</a>{" "}·{" "}
            <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">NASA APOD</a>{" "}·{" "}
            <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">USGS</a>{" "}·{" "}
            <a href="https://openaq.org" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80">OpenAQ</a>
          </p>
        </section>

        {/* Section 5: Changelog link */}
        <section>
          <Link
            to="/changelog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:translate-x-[3px] hover:text-primary/80"
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
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:translate-x-[3px] hover:text-primary/80"
          >
            Found something we missed? Open an issue on GitHub →
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground/60">
          Built with care by Waseem Ahmed · Hyderabad, India
        </footer>
      </article>
    </AppShell>
  );
}
