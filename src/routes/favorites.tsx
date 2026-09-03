import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { useLibrary } from "@/hooks/use-library";
import { getCommand, type SlashCommand } from "@/lib/commands";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — SlashAI" },
      { name: "description", content: "The AI slash commands you saved on this device." },
      { property: "og:title", content: "Favorites — SlashAI" },
      { property: "og:description", content: "Your saved SlashAI commands, kept on-device." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, hydrated } = useLibrary();
  const commands = useMemo(
    () => favorites.map((id) => getCommand(id)).filter((c): c is SlashCommand => Boolean(c)),
    [favorites],
  );

  return (
    <AppShell wide>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hydrated ? `${commands.length} saved on this device` : "Loading…"}
        </p>
      </header>

      <Link
        to="/graph"
        className="mt-4 flex items-center gap-3 rounded-[10px] border border-primary/20 bg-primary/[0.04] p-3.5 transition-all duration-150 hover:border-primary/40 hover:bg-primary/[0.07]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[16px]">🕸️</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold text-foreground">See these as a Knowledge Graph</span>
          <span className="block text-[12px] text-muted-foreground">
            Commands, resources, collections and notes mapped by how they connect.
          </span>
        </span>
        <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">→</span>
      </Link>

      <div className="mt-5">
        {!hydrated ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="panel h-28 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : commands.length > 0 ? (
          <CommandGrid commands={commands} />
        ) : (
          <EmptyState
            title="No favorites yet"
            hint="Tap the star on any command to keep it here for later."
            action={
              <Button asChild variant="secondary">
                <Link to="/explore">Browse categories</Link>
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
