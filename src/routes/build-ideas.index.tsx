import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Lightbulb, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { IdeaCard } from "@/components/library/IdeaCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IDEA_CATEGORIES } from "@/lib/build-ideas-types";
import {
  BUILD_TYPES,
  BUSINESS_MODELS,
  DIFFICULTIES,
  EMPTY_FILTERS,
  IDEA_TOTAL,
  SUITABLE_FOR,
  filterIdeas,
  type IdeaFilters,
  type IdeaSort,
} from "@/lib/build-ideas";
import { useIdeaLibrary } from "@/hooks/use-build-ideas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build-ideas/")({
  head: () => ({
    meta: [
      { title: `${IDEA_TOTAL} startup ideas you can actually build | SlashAI` },
      {
        name: "description",
        content: `Browse ${IDEA_TOTAL} researched product ideas with the problem, target users, MVP scope, tech stack, pricing and a first-10-customers plan for each one.`,
      },
      { property: "og:title", content: "Build Ideas Library — SlashAI" },
      {
        property: "og:description",
        content:
          "Researched product ideas with MVP scope, monetization and acquisition plans — free to browse, offline ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BuildIdeasIndex,
});

const SORTS: { id: IdeaSort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "opportunity", label: "Highest opportunity" },
  { id: "saved", label: "Most saved" },
  { id: "easiest", label: "Easiest to build" },
];

const PAGE = 24;

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={cn(
                "min-h-8 rounded-full border px-3 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function BuildIdeasIndex() {
  const [filters, setFilters] = useState<IdeaFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<IdeaSort>("newest");
  const [visible, setVisible] = useState(PAGE);
  const [panelOpen, setPanelOpen] = useState(false);
  const { saved, toggleSaved } = useIdeaLibrary();

  const results = useMemo(() => filterIdeas(filters, sort, saved), [filters, sort, saved]);

  const activeCount =
    filters.categories.length +
    filters.difficulties.length +
    filters.models.length +
    filters.types.length +
    filters.suitable.length;

  function toggle<K extends keyof Omit<IdeaFilters, "query">>(key: K, value: IdeaFilters[K][number]) {
    setVisible(PAGE);
    setFilters((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value as string)
        ? list.filter((x) => x !== value)
        : [...list, value as string];
      return { ...prev, [key]: next } as IdeaFilters;
    });
  }

  return (
    <AppShell wide hideHeaderSearch title="Build Ideas">
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Lightbulb className="size-6 text-primary" aria-hidden /> Build Ideas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {IDEA_TOTAL} researched product ideas. Every one states the problem, who pays, the MVP
          scope, a stack, pricing and how to find the first ten customers.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to="/build-ideas/validate">
              <Sparkles className="size-4" /> Validate your own idea
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/build-ideas/projects">
              <FolderKanban className="size-4" /> My projects
            </Link>
          </Button>
        </div>
      </header>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={filters.query}
          onChange={(e) => {
            setVisible(PAGE);
            setFilters((prev) => ({ ...prev, query: e.target.value }));
          }}
          placeholder="Search ideas, problems, features, tags…"
          aria-label="Search build ideas"
          className="flex-1"
        />
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as IdeaSort)}
            aria-label="Sort ideas"
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={() => setPanelOpen((v) => !v)}>
            <SlidersHorizontal className="size-4" /> Filters
            {activeCount ? <Badge variant="secondary">{activeCount}</Badge> : null}
          </Button>
        </div>
      </div>

      {panelOpen ? (
        <div className="panel mt-3 space-y-4 rounded-xl p-4">
          <FilterGroup
            label="Category"
            options={IDEA_CATEGORIES}
            selected={filters.categories}
            onToggle={(v) => toggle("categories", v)}
          />
          <FilterGroup
            label="Difficulty"
            options={DIFFICULTIES}
            selected={filters.difficulties}
            onToggle={(v) => toggle("difficulties", v)}
          />
          <FilterGroup
            label="Business model"
            options={BUSINESS_MODELS}
            selected={filters.models}
            onToggle={(v) => toggle("models", v)}
          />
          <FilterGroup
            label="Build type"
            options={BUILD_TYPES}
            selected={filters.types}
            onToggle={(v) => toggle("types", v)}
          />
          <FilterGroup
            label="Suitable for"
            options={SUITABLE_FOR}
            selected={filters.suitable}
            onToggle={(v) => toggle("suitable", v)}
          />
          {activeCount ? (
            <Button variant="ghost" size="sm" onClick={() => setFilters({ ...EMPTY_FILTERS, query: filters.query })}>
              <X className="size-4" /> Clear filters
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 text-xs text-muted-foreground">
        {results.length} {results.length === 1 ? "idea" : "ideas"}
        {filters.query ? ` for “${filters.query}”` : ""}
      </p>

      {results.length === 0 ? (
        <div className="panel mt-4 rounded-xl p-8 text-center">
          <p className="text-sm font-semibold text-foreground">No ideas match that yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader search term, or clear a filter or two.
          </p>
          <Button className="mt-4" variant="secondary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
            Reset everything
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                saved={saved.includes(idea.id)}
                onToggleSave={toggleSaved}
              />
            ))}
          </div>
          {visible < results.length ? (
            <div className="mt-5 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                Load more ideas
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AppShell>
  );
}
