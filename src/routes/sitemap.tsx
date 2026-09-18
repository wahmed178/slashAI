import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { CATEGORY_TREE, VERIFIED_TOTAL } from "@/lib/commands";
import { SLASH_TOOL_COUNT } from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";
import { COLLECTIONS } from "@/lib/collections";
import { slugify } from "@/lib/explore-slugs";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [{ title: "Sitemap - SlashAI" }, { name: "robots", content: "noindex" }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  const topLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: `Explore - ${VERIFIED_TOTAL} AI commands` },
    { to: "/tools", label: `SlashKits - ${SLASH_TOOL_COUNT} free browser tools` },
    { to: "/play", label: `SlashPlay - ${PLAY_GAME_COUNT} free browser games` },
    { to: "/hub", label: "Hubs - curated resource hubs" },
    { to: "/collections", label: `Collections - ${COLLECTIONS.length} curated command sets` },
    { to: "/trending", label: "Trending" },
    { to: "/live", label: "Live Dashboard" },
    { to: "/quiz", label: "Daily Quiz" },
    { to: "/build-ideas", label: "Build Ideas Library" },
    { to: "/roadmaps", label: "Founder Roadmaps" },
    { to: "/learn", label: "Slash Courses" },
    { to: "/glossary", label: "AI Glossary" },
    { to: "/ai-tools", label: "AI Tools Directory" },
    { to: "/blog", label: "Blog" },
    { to: "/suggest", label: "Suggest a Command" },
    { to: "/history", label: "Copy History" },
    { to: "/about", label: "About" },
    { to: "/changelog", label: "Changelog" },
  ];

  return (
    <AppShell wide hideHeaderSearch title="Sitemap">
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Sitemap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every public section of SlashAI. For search engines, the machine-readable list lives at{" "}
          <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>.
        </p>
      </header>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {topLinks.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="flex min-h-11 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-base font-bold text-foreground">Command categories</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_TREE.map((c) => (
          <li key={c.category}>
            <Link
              to="/explore/$category"
              params={{ category: slugify(c.category) }}
              className="flex min-h-11 items-center rounded-xl border border-border bg-surface px-3.5 text-[13px] text-foreground transition-colors hover:border-primary/50"
            >
              <span className="min-w-0 truncate">{c.category}</span>
              <span className="ml-auto pl-2 text-xs text-muted-foreground">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
