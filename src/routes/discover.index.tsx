import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Radar, Repeat2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { categoryIcon } from "@/components/library/icons";
import {
  ALTERNATIVES,
  NEWEST_RESOURCES,
  RESOURCE_TOTAL,
  SECTIONS,
  resourcesBySection,
} from "@/lib/resources";
import { VERIFIED_TOTAL } from "@/lib/commands";

export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover — AI, free tools, GitHub and learning | SlashAI" },
      {
        name: "description",
        content: `A hand-curated hub of ${RESOURCE_TOTAL} free tools, open-source projects, courses and channels, alongside ${VERIFIED_TOTAL} AI slash commands.`,
      },
      { property: "og:title", content: "Discover — SlashAI" },
      {
        property: "og:description",
        content: "Curated AI tools, free utilities, GitHub gems, courses and practical tricks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DiscoverIndex,
});

function DiscoverIndex() {
  return (
    <AppShell wide hideHeaderSearch title="Discover">
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Discover</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {RESOURCE_TOTAL} curated resources · {VERIFIED_TOTAL.toLocaleString()} AI commands ·
          researched by hand, updated in batches.
        </p>
      </header>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => {
          const Icon = categoryIcon(s.icon);
          const count = resourcesBySection(s.id).length;
          return (
            <Link
              key={s.id}
              to="/discover/$section"
              params={{ section: s.id }}
              className="panel group flex items-start gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-foreground">{s.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{s.blurb}</span>
                <span className="mt-1 block text-[11px] text-primary">
                  {s.id === "ai"
                    ? `${count} resources + the command library`
                    : `${count} resources`}
                </span>
              </span>
              <ChevronRight
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        <Link
          to="/radar"
          className="panel flex items-center gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
        >
          <Radar className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-semibold text-foreground">Free Radar</span>
        </Link>
        <Link
          to="/alternatives"
          className="panel flex items-center gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
        >
          <Repeat2 className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-semibold text-foreground">
            Free alternatives ({ALTERNATIVES.length})
          </span>
        </Link>
        <Link
          to="/whats-new"
          className="panel flex items-center gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
        >
          <Sparkles className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-semibold text-foreground">What&apos;s new</span>
        </Link>
      </div>

      <section className="mt-9">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Recently added</h2>
        <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
          Newest entries in the curated catalog.
        </p>
        <ResourceGrid resources={NEWEST_RESOURCES} />
      </section>
    </AppShell>
  );
}
