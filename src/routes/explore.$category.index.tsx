import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid } from "@/components/library/CommandGrid";
import { categoryIcon } from "@/components/library/icons";
import { CATEGORY_TREE, COMMANDS } from "@/lib/commands";

export const Route = createFileRoute("/explore/$category/")({
  head: ({ params }) => {
    const node = CATEGORY_TREE.find((c) => c.category === params.category);
    if (!node) {
      return {
        meta: [{ title: "Category not found — SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${node.category} commands — SlashAI`;
    const description = `${node.count} AI slash commands in ${node.category}, grouped into ${node.subcategories.length} subcategories.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    const node = CATEGORY_TREE.find((c) => c.category === params.category);
    if (!node) throw notFound();
    return null;
  },
  notFoundComponent: CategoryMissing,
  component: CategoryPage,
});

function CategoryMissing() {
  return (
    <AppShell back={{ to: "/explore", label: "Explore" }} hideHeaderSearch title="Not found">
      <div className="panel mt-6 rounded-xl px-6 py-14 text-center">
        <h1 className="text-lg font-semibold text-foreground">Category not found</h1>
        <Button asChild variant="secondary" className="mt-4">
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function CategoryPage() {
  const { category } = Route.useParams();
  const node = CATEGORY_TREE.find((c) => c.category === category);
  if (!node) return <CategoryMissing />;

  const Icon = categoryIcon(node.icon);
  const popular = COMMANDS.filter((c) => c.category === category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <AppShell wide back={{ to: "/explore", label: "Explore" }} hideHeaderSearch title={category}>
      <header className="flex items-start gap-3 pt-2">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">{node.category}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {node.count} commands · {node.subcategories.length} subcategories
          </p>
        </div>
      </header>

      <h2 className="mt-7 mb-3 text-lg font-bold tracking-tight text-foreground">Subcategories</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {node.subcategories.map((s) => (
          <Link
            key={s.subcategory}
            to="/explore/$category/$subcategory"
            params={{ category: node.category, subcategory: s.subcategory }}
            className="group flex min-h-14 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 transition-colors hover:border-primary/50"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {s.subcategory}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{s.count}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-bold tracking-tight text-foreground">
        Popular in {node.category}
      </h2>
      <CommandGrid commands={popular} />
    </AppShell>
  );
}
