import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { categoryIcon } from "@/components/library/icons";
import { COLLECTIONS } from "@/lib/collections";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — SlashAI" },
      {
        name: "description",
        content:
          "Curated, use-case based sets of AI slash commands for students, creators, professionals, entrepreneurs and everyday life.",
      },
      { property: "og:title", content: "Collections — SlashAI" },
      {
        property: "og:description",
        content: "Curated starting points into the SlashAI command catalog.",
      },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <AppShell wide>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Collections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated starting points built from existing commands. Every collection is open to
          everyone.
        </p>
      </header>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => {
          const Icon = categoryIcon(c.icon);
          return (
            <Link
              key={c.id}
              to="/collections/$id"
              params={{ id: c.id }}
              className="panel group flex min-h-24 items-start gap-3 rounded-xl p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-foreground">
                  {c.title}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                  {c.blurb}
                </span>
                <span className="mt-1 block text-xs text-primary">{c.count} commands</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
