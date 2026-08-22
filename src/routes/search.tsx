import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AppShell } from "@/components/library/AppShell";
import { SearchBox } from "@/components/library/SearchBox";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { useLibrary } from "@/hooks/use-library";
import {
  CATEGORY_TREE,
  TYPES,
  filterCommands,
  type SortKey,
  type FilterState,
} from "@/lib/commands";
import { searchResources } from "@/lib/resources";
import { cn } from "@/lib/utils";

interface SearchParams {
  q?: string;
  cat?: string;
  sub?: string;
  type?: string;
  diff?: string;
  sort?: SortKey;
  page?: number;
}

const SORTS: SortKey[] = ["relevance", "name", "category", "popularity", "newest"];

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): SearchParams => ({
    q: typeof raw["q"] === "string" ? raw["q"] : "",
    cat: typeof raw["cat"] === "string" ? raw["cat"] : "all",
    sub: typeof raw["sub"] === "string" ? raw["sub"] : "all",
    type: typeof raw["type"] === "string" ? raw["type"] : "all",
    diff: typeof raw["diff"] === "string" ? raw["diff"] : "all",
    sort: SORTS.includes(raw["sort"] as SortKey) ? (raw["sort"] as SortKey) : "relevance",
    page: Number(raw["page"]) > 0 ? Number(raw["page"]) : 1,
  }),
  head: () => ({
    meta: [
      { title: "Search commands — SlashAI" },
      {
        name: "description",
        content: "Search the full SlashAI catalog by task, command name, tag or category.",
      },
      { property: "og:title", content: "Search commands — SlashAI" },
      {
        property: "og:description",
        content: "Fast, typo-tolerant search across every AI slash command in SlashAI.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-3.5 text-sm transition-colors",
        active
          ? "border-primary bg-accent text-foreground"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { favorites, settings } = useLibrary();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = search.q ?? "";
  const cat = search.cat ?? "all";
  const sub = search.sub ?? "all";
  const page = search.page ?? 1;

  const set = (patch: Partial<SearchParams>) =>
    void navigate({ search: (prev) => ({ ...prev, page: 1, ...patch }) });

  const results = useMemo(() => {
    const state: FilterState = {
      q,
      category: cat,
      subcategory: sub,
      type: search.type ?? "all",
      difficulty: search.diff ?? "all",
      sort: search.sort ?? "relevance",
      onlyFavorites: false,
      favorites,
    };
    return filterCommands(state);
  }, [q, cat, sub, search.type, search.diff, search.sort, favorites]);

  const resourceHits = useMemo(() => searchResources(q, 6), [q]);

  const pageSize = settings.pageSize;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * pageSize, current * pageSize);

  const activeFilters =
    (search.type ?? "all") !== "all" ||
    (search.diff ?? "all") !== "all" ||
    (search.sort ?? "relevance") !== "relevance";

  const subcategories = CATEGORY_TREE.find((c) => c.category === cat)?.subcategories ?? [];

  return (
    <AppShell wide hideHeaderSearch title="Search">
      <SearchBox size="lg" value={q} onChange={(v) => set({ q: v })} autoFocus />

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="min-w-0 truncate text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length.toLocaleString()}</span>{" "}
          {results.length === 1 ? "command" : "commands"}
          {q ? ` for “${q}”` : ""}
        </p>
        <Button
          variant={activeFilters ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal className="size-4" /> Filters
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={cat === "all"} onClick={() => set({ cat: "all", sub: "all" })}>
          All categories
        </Chip>
        {CATEGORY_TREE.slice(0, 8).map((c) => (
          <Chip
            key={c.category}
            active={cat === c.category}
            onClick={() => set({ cat: c.category, sub: "all" })}
          >
            {c.category}
          </Chip>
        ))}
      </div>

      {cat !== "all" && subcategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip active={sub === "all"} onClick={() => set({ sub: "all" })}>
            All of {cat}
          </Chip>
          {subcategories.map((s) => (
            <Chip key={s.subcategory} active={sub === s.subcategory} onClick={() => set({ sub: s.subcategory })}>
              {s.subcategory}
            </Chip>
          ))}
        </div>
      )}

      {resourceHits.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Curated resources ({resourceHits.length})
          </h2>
          <ResourceGrid resources={resourceHits} />
        </section>
      )}

      <div className="mt-5">

        {visible.length > 0 ? (
          <CommandGrid commands={visible} query={q} />
        ) : (
          <EmptyState
            title="No commands match that yet"
            hint="Try fewer words, a different spelling, or clear the filters."
            action={
              <Button
                variant="secondary"
                className="gap-1.5"
                onClick={() =>
                  void navigate({
                    search: { q: "", cat: "all", sub: "all", type: "all", diff: "all", sort: "relevance", page: 1 },
                  })
                }
              >
                <X className="size-4" /> Reset search
              </Button>
            }
          />
        )}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => void navigate({ search: (p) => ({ ...p, page: current - 1 }) })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {current} of {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={current >= pages}
            onClick={() => void navigate({ search: (p) => ({ ...p, page: current + 1 }) })}
          >
            Next
          </Button>
        </div>
      )}

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow the results, then close this panel.</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 px-4 pb-10">
            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Sort by
              </p>
              <div className="flex flex-wrap gap-2">
                {SORTS.map((s) => (
                  <Chip key={s} active={(search.sort ?? "relevance") === s} onClick={() => set({ sort: s })}>
                    {s}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Type
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip active={(search.type ?? "all") === "all"} onClick={() => set({ type: "all" })}>
                  Any
                </Chip>
                {TYPES.map((t) => (
                  <Chip key={t} active={search.type === t} onClick={() => set({ type: t })}>
                    {t}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "easy", "medium", "advanced"].map((d) => (
                  <Chip
                    key={d}
                    active={(search.diff ?? "all") === d}
                    onClick={() => set({ diff: d })}
                  >
                    {d === "all" ? "Any" : d}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip active={cat === "all"} onClick={() => set({ cat: "all", sub: "all" })}>
                  All
                </Chip>
                {CATEGORY_TREE.map((c) => (
                  <Chip
                    key={c.category}
                    active={cat === c.category}
                    onClick={() => set({ cat: c.category, sub: "all" })}
                  >
                    {c.category}
                  </Chip>
                ))}
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
