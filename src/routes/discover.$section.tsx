import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FREE_STATUSES,
  resourcesBySection,
  sectionCategories,
  sectionDef,
  type Pricing,
  type ResourceSection,
} from "@/lib/resources";

interface Search {
  cat?: string;
  price?: string;
}

export const Route = createFileRoute("/discover/$section")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    cat: typeof raw["cat"] === "string" ? raw["cat"] : "all",
    price: typeof raw["price"] === "string" ? raw["price"] : "all",
  }),
  loader: ({ params }) => {
    const def = sectionDef(params.section);
    if (!def) throw notFound();
    return { def };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { def } = loaderData;
    const title = `${def.label} — curated free resources | SlashAI`;
    return {
      meta: [
        { title },
        { name: "description", content: def.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: def.blurb },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: SectionNotFound,
  component: SectionPage,
});

function SectionNotFound() {
  return (
    <AppShell hideHeaderSearch title="Not found" back={{ to: "/discover", label: "Discover" }}>
      <EmptyState
        title="That section doesn’t exist"
        hint="Pick one of the curated areas from Discover instead."
        action={
          <Button asChild>
            <Link to="/discover">Go to Discover</Link>
          </Button>
        }
      />
    </AppShell>
  );
}

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

function SectionPage() {
  const { def } = Route.useLoaderData();
  const { cat = "all", price = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover/$section" });

  const set = (patch: Search) => void navigate({ search: (p) => ({ ...p, ...patch }) });

  const all = resourcesBySection(def.id as ResourceSection);
  const cats = sectionCategories(def.id as ResourceSection);
  const list = all.filter(
    (x) => (cat === "all" || x.category === cat) && (price === "all" || x.pricing === price),
  );

  return (
    <AppShell wide hideHeaderSearch title={def.label} back={{ to: "/discover", label: "Discover" }}>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">{def.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{def.blurb}</p>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={cat === "all"} onClick={() => set({ cat: "all" })}>
          All ({all.length})
        </Chip>
        {cats.map((c) => (
          <Chip
            key={c.category}
            active={cat === c.category}
            onClick={() => set({ cat: c.category })}
          >
            {c.category} ({c.count})
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Chip active={price === "all"} onClick={() => set({ price: "all" })}>
          Any status
        </Chip>
        {FREE_STATUSES.filter((p) => all.some((x) => x.pricing === p)).map((p: Pricing) => (
          <Chip key={p} active={price === p} onClick={() => set({ price: p })}>
            {p}
          </Chip>
        ))}
      </div>

      {def.id === "ai" && (
        <div className="panel mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            AI Commands live in the full slash-command library.
          </p>
          <Button asChild size="sm">
            <Link to="/explore">Browse commands</Link>
          </Button>
        </div>
      )}

      <div className="mt-5">
        {list.length > 0 ? (
          <ResourceGrid resources={list} />
        ) : (
          <EmptyState
            title="Nothing here with those filters"
            hint="Clear the status filter or pick another category."
            action={
              <Button variant="secondary" onClick={() => set({ cat: "all", price: "all" })}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
