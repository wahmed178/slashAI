import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { ResourceCardEnhanced } from "@/components/library/ResourceCardEnhanced";
import {
  SECTIONS,
  resourcesBySection,
  RESOURCE_TOTAL,
  NEWEST_RESOURCES,
} from "@/lib/resources";

/* ──────────── category icon map ──────────── */
const CATEGORY_ICONS: Record<string, string> = {
  ai: "\u{1F916}",
  "free-tools": "\u{1F6E0}\u{FE0F}",
  "free-ai": "\u{2728}",
  "free-apis": "\u{1F4E1}",
  github: "\u{1F419}",
  learn: "\u{1F393}",
  resources: "\u{1F4E6}",
  youtube: "\u{1F3AC}",
  reddit: "\u{1F4AC}",
  websites: "\u{1F310}",
  "free-time": "\u{1F3AE}",
  tips: "\u{1F4A1}",
};

/* ──────────── section with count ──────────── */
const sectionsWithCounts = SECTIONS.map((s) => ({
  ...s,
  count: resourcesBySection(s.id).length,
}));

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover \u2014 AI tools, APIs, courses, channels | SlashAI" },
      {
        name: "description",
        content: `Explore ${RESOURCE_TOTAL}+ free tools, APIs, courses, and channels \u2014 curated for builders, developers and creators.`,
      },
      { property: "og:title", content: "Discover \u2014 SlashAI" },
      { property: "og:description", content: "Curated tools, APIs, courses for builders." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [search, setSearch] = useState("");

  /* filter categories + recently added by search */
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sectionsWithCounts;
    const q = search.toLowerCase();
    return sectionsWithCounts.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.blurb.toLowerCase().includes(q) ||
        s.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }, [search]);

  const filteredRecent = useMemo(() => {
    const list = NEWEST_RESOURCES.slice(0, 8);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <AppShell wide hideHeaderSearch title="Discover">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Discover
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {RESOURCE_TOTAL}+ free tools, APIs, courses and channels \u2014 curated for builders.
        </p>
      </header>

      {/* Search bar */}
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools, APIs, courses, channels\u2026"
          className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Category grid */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Browse categories
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {filteredSections.map((section) => (
            <Link
              key={section.id}
              to="/discover/$section"
              params={{ section: section.id }}
              className="group rounded-[10px] border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span className="text-[32px]" aria-hidden>
                {CATEGORY_ICONS[section.id] || "\u{1F4E6}"}
              </span>
              <p className="mt-2 text-[16px] font-semibold text-foreground">
                {section.label}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">
                {section.blurb}
              </p>
              <span className="mt-3 inline-flex items-center rounded border px-2 py-0.5 text-[11px]" style={{ background: "#21262d", borderColor: "#30363d", color: "#8b949e" }}>
                {section.count} resources
              </span>
            </Link>
          ))}
        </div>
        {filteredSections.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No categories match your search.
          </p>
        )}
      </section>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* Recently added */}
      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Recently added
          </h2>
          <Link
            to="/discover"
            className="text-xs font-medium text-primary hover:underline"
          >
            See all new \u2192
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {filteredRecent.map((r) => (
            <ResourceCardEnhanced key={r.id} resource={r} />
          ))}
        </div>
        {filteredRecent.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No recently added items match your search.
          </p>
        )}
      </section>

      {/* All resources link */}
      <div className="mt-8 text-center">
        <Link
          to="/discover/$section"
          params={{ section: "free-apis" }}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Explore all resources →
        </Link>
      </div>
    </AppShell>
  );
}
