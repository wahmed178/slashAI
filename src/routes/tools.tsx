import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Free AI tools directory — SlashAI" },
      {
        name: "description",
        content:
          "A curated directory of AI tools with a genuinely usable free tier — for writing, images, coding, research, design and voice.",
      },
      { property: "og:title", content: "Free AI tools — SlashAI" },
      {
        property: "og:description",
        content: "The best free AI tools in one place, each paired with commands you can copy.",
      },
    ],
  }),
  component: ToolsPage,
});

function initials(name: string) {
  return name
    .split(/[\s./]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function ToolsPage() {
  const [filter, setFilter] = useState<ToolCategory | "All">("All");
  const list = filter === "All" ? TOOLS : TOOLS.filter((t) => t.category === filter);

  return (
    <AppShell hideHeaderSearch title="Tools" wide>
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Wrench className="size-6 text-primary" aria-hidden />
          Free AI tools
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {TOOLS.length} tools with a real free tier. Pick one, then bring a SlashAI command with
          you.
        </p>
      </header>

      <div className="mt-4 -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {(["All", ...TOOL_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={cn(
              "min-h-9 shrink-0 snap-start rounded-full border px-3.5 text-sm transition-colors",
              filter === c
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((tool) => (
          <article key={tool.id} className="panel flex flex-col rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent font-mono text-sm font-bold text-primary">
                {initials(tool.name)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-foreground">{tool.name}</h2>
                <p className="truncate text-xs text-muted-foreground">{tool.vendor}</p>
              </div>
            </div>

            <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex gap-1.5">
                <dt className="font-medium text-foreground">Best for:</dt>
                <dd className="min-w-0">{tool.bestFor}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-medium text-foreground">Free tier:</dt>
                <dd className="min-w-0">{tool.freeTier}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-medium text-foreground">Level:</dt>
                <dd>{tool.difficulty}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Button asChild size="sm" className="gap-1.5">
                <a href={tool.url} target="_blank" rel="noreferrer noopener">
                  Open tool <ArrowUpRight className="size-3.5" />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link
                  to="/search"
                  search={{ q: tool.query, cat: "all", sub: "all", sort: "relevance" }}
                >
                  <Search className="size-3.5" /> See commands
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        SlashAI is not affiliated with any of these tools and earns nothing from these links. Free
        tiers change — check the tool's own pricing page before relying on one.
      </p>
    </AppShell>
  );
}
