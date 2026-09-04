import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles, TrendingUp, Star, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import {
  TOOLS, TOOL_CATEGORIES, CATEGORY_ICONS,
  type AiTool, type ToolCategory,
} from "@/lib/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({
    meta: [
      { title: "AI Tools Directory — 100+ Free & Freemium Tools — SlashAI" },
      {
        name: "description",
        content:
          "Discover 100+ curated AI tools with real free tiers. Browse writing, image, video, coding, design, voice, marketing and more tools in one directory.",
      },
      { property: "og:title", content: "AI Tools Directory — SlashAI" },
      { property: "og:description", content: "100+ curated AI tools with genuinely usable free tiers." },
    ],
  }),
  component: AiToolsPage,
});

const PRICING_COLORS: Record<string, string> = {
  Free: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Freemium: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Paid: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Open Source": "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

function ToolCard({ tool }: { tool: AiTool }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:bg-surface/80">
      {tool.featured && (
        <div className="absolute -top-px -right-px rounded-bl-xl rounded-tr-2xl bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          Featured
        </div>
      )}
      {tool.trending && !tool.featured && (
        <div className="absolute -top-px -right-px rounded-bl-xl rounded-tr-2xl bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
          Trending
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-lg">
          {tool.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{tool.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{tool.vendor}</p>
        </div>
        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", PRICING_COLORS[tool.pricing] ?? PRICING_COLORS['Freemium'])}>
          {tool.pricing}
        </span>
      </div>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">{tool.bestFor}</p>
      <p className="mt-1 text-[11px] text-primary/70">Free: {tool.freeTier}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {tool.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Button asChild size="sm" className="h-8 flex-1 gap-1.5 text-xs">
          <a href={tool.url} target="_blank" rel="noreferrer noopener">
            Visit <ExternalLink className="size-3" />
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
          <Link to="/search" search={{ q: tool.query, cat: "all", sub: "all", sort: "relevance" }}>
            <Search className="size-3" /> Commands
          </Link>
        </Button>
      </div>
    </article>
  );
}

function AiToolsPage() {
  const [filter, setFilter] = useState<ToolCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "pricing">("name");

  const [toolOfDay] = useState(() => {
    const today = new Date().getDate();
    return TOOLS[today % TOOLS.length]!;
  });

  const featured = useMemo(() => TOOLS.filter((t) => t.featured), []);
  const trending = useMemo(() => TOOLS.filter((t) => t.trending), []);

  const filtered = useMemo(() => {
    let list = filter === "All" ? TOOLS : TOOLS.filter((t) => t.category === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.vendor.toLowerCase().includes(q) ||
          t.bestFor.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q)),
      );
    }
    if (sortBy === "pricing") {
      const order = { Free: 0, "Open Source": 1, Freemium: 2, Paid: 3 };
      list = [...list].sort((a, b) => (order[a.pricing] ?? 0) - (order[b.pricing] ?? 0));
    }
    return list;
  }, [filter, search, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TOOLS.length };
    for (const t of TOOLS) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <AppShell hideHeaderSearch wide>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-surface to-primary/5 px-6 py-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,transparent_60%)] opacity-[0.04]" />
        <div className="relative">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            AI Tools Directory
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Discover {TOOLS.length}+ curated AI tools with a genuinely usable free tier.
            Pick one, then bring a SlashAI command with you.
          </p>
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by name, category, or use case..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-foreground">
                ✕
              </button>
            )}
          </div>
          <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>🔥 {TOOLS.length} tools</span>
            <span>·</span>
            <span>{Object.keys(categoryCounts).length - 1} categories</span>
            <span>·</span>
            <span>{TOOLS.filter((t) => t.pricing === "Free").length} completely free</span>
            <span>·</span>
            <span>{TOOLS.filter((t) => t.pricing === "Open Source").length} open source</span>
          </div>
        </div>
      </section>

      {/* Tool of the Day */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="size-4 text-yellow-500" />
          <h2 className="text-sm font-bold text-foreground">Tool of the Day</h2>
        </div>
        <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent p-5">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-2xl">
              {toolOfDay.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{toolOfDay.name}</h3>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", PRICING_COLORS[toolOfDay.pricing])}>
                  {toolOfDay.pricing}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{toolOfDay.bestFor}</p>
              <p className="mt-1 text-xs text-primary">Free tier: {toolOfDay.freeTier}</p>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" className="gap-1.5">
                  <a href={toolOfDay.url} target="_blank" rel="noreferrer noopener">
                    Try it free <ExternalLink className="size-3" />
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link to="/search" search={{ q: toolOfDay.query, cat: "all", sub: "all", sort: "relevance" }}>
                    <Search className="size-3" /> See commands
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && !search && filter === "All" && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Featured Tools</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && !search && filter === "All" && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-4 text-orange-400" />
            <h2 className="text-sm font-bold text-foreground">Trending Now</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      {!search && filter === "All" && (
        <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-center text-sm font-bold text-foreground">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Search", desc: "Browse 100+ AI tools by category, name, or use case.", icon: "🔍" },
              { step: "2", title: "Discover", desc: "Find the best free tools matched to your task with real free-tier limits.", icon: "💡" },
              { step: "3", title: "Create", desc: "Follow the step-by-step process and launch your next project for free.", icon: "🚀" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm">
                  {s.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">
            {filter === "All" ? "All Tools" : `${filter} Tools`}
            <span className="ml-2 font-normal text-muted-foreground">({filtered.length})</span>
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "pricing")}
            className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground"
          >
            <option value="name">Sort: A → Z</option>
            <option value="pricing">Sort: Free first</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="-mx-4 mb-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2">
          {(["All", ...TOOL_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "min-h-8 shrink-0 snap-start rounded-full border px-3 text-xs font-medium transition-colors",
                filter === c
                  ? "border-primary bg-accent text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {c !== "All" && <span className="mr-1">{CATEGORY_ICONS[c]}</span>}
              {c} ({categoryCounts[c] ?? 0})
            </button>
          ))}
        </div>

        {/* Tool grid */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No tools found matching your search.</p>
            <button onClick={() => { setSearch(""); setFilter("All"); }} className="mt-2 text-xs text-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 pb-8 text-center text-[11px] text-muted-foreground/60">
        SlashAI is not affiliated with any of these tools and earns nothing from these links.
        Free tiers change — check the tool's own pricing page before relying on one.
      </p>
    </AppShell>
  );
}
