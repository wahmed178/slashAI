import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { categoryIcon } from "@/components/library/icons";
import { CATEGORY_TREE, SUBCATEGORY_TOTAL, VERIFIED_TOTAL } from "@/lib/commands";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Explore categories — SlashAI" },
      {
        name: "description",
        content: `Browse ${VERIFIED_TOTAL} AI slash commands across ${CATEGORY_TREE.length} categories and ${SUBCATEGORY_TOTAL} subcategories.`,
      },
      { property: "og:title", content: "Explore categories — SlashAI" },
      {
        property: "og:description",
        content: `Category-first browsing across ${CATEGORY_TREE.length} SlashAI categories.`,
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <AppShell wide>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Explore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {CATEGORY_TREE.length} categories · {SUBCATEGORY_TOTAL} subcategories ·{" "}
          {VERIFIED_TOTAL.toLocaleString()} commands
        </p>
      </header>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_TREE.map((c) => {
          const Icon = categoryIcon(c.icon);
          return (
            <Link
              key={c.category}
              to="/explore/$category"
              params={{ category: c.category }}
              className="panel group flex min-h-20 items-center gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-foreground">
                  {c.category}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {c.count} commands · {c.subcategories.length} subcategories
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
