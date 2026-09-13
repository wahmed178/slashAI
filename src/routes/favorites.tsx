import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { useLibrary } from "@/hooks/use-library";
import { getCommand, type SlashCommand } from "@/lib/commands";
import { TOOL_SECTIONS } from "@/lib/slashkits";
import { PLAY_SECTIONS } from "@/lib/slashplay";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites - SlashAI" },
      { name: "description", content: "The AI slash commands, tools and games you saved on this device." },
      { property: "og:title", content: "Favorites - SlashAI" },
      { property: "og:description", content: "Your saved SlashAI commands, tools and games, kept on-device." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavoritesPage,
});

const ALL_TOOLS = TOOL_SECTIONS.flatMap((s) => [...s.tools, ...(s.hubTools ?? [])]);
const ALL_GAMES = PLAY_SECTIONS.flatMap((s) => s.games);

function ToolChip({ slug }: { slug: string }) {
  const tool = ALL_TOOLS.find((t) => t.slug === slug);
  if (!tool) return null;
  return (
    <Link
      to={tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`}
      className="flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[20px]">{tool.icon}</span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-foreground">{tool.name}</span>
        <span className="block text-[12px] text-muted-foreground">{tool.desc}</span>
      </span>
    </Link>
  );
}

function GameChip({ slug }: { slug: string }) {
  const game = ALL_GAMES.find((g) => g.slug === slug);
  if (!game) return null;
  return (
    <Link
      to={`/play/${game.slug}` as string}
      className="flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3"
    >
      <span className="text-[22px]">{game.icon}</span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-foreground">{game.name}</span>
        <span className="block text-[12px] text-muted-foreground">{game.desc}</span>
      </span>
    </Link>
  );
}

function FavoritesPage() {
  const { favorites, toolFavorites, hydrated } = useLibrary();
  const commands = useMemo(
    () => favorites.map((id) => getCommand(id)).filter((c): c is SlashCommand => Boolean(c)),
    [favorites],
  );
  const tools = useMemo(
    () => toolFavorites.filter((slug) => ALL_TOOLS.some((t) => t.slug === slug)),
    [toolFavorites],
  );
  const games = useMemo(
    () => toolFavorites.filter((slug) => ALL_GAMES.some((g) => g.slug === slug)),
    [toolFavorites],
  );
  const total = commands.length + tools.length + games.length;

  return (
    <AppShell wide>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hydrated ? `${total} saved on this device` : "Loading…"}
        </p>
      </header>

      {tools.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            🧰 Tools ({tools.length})
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{tools.map((slug) => <ToolChip key={slug} slug={slug} />)}</div>
        </section>
      )}

      {games.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            🎮 Games ({games.length})
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{games.map((slug) => <GameChip key={slug} slug={slug} />)}</div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          ⚡ Commands ({commands.length})
        </h2>
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
              hint="Tap the star on any command, tool or game to keep it here for later."
              action={
                <Button asChild variant="secondary">
                  <Link to="/explore">Browse categories</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

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
    </AppShell>
  );
}
