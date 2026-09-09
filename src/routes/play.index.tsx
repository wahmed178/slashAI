import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import {
  PLAY_SECTIONS,
  PLAY_GAME_COUNT,
  playModeCounts,
  type PlayGame,
} from "@/lib/slashplay";
import { RANDOM_POOL_SIZE } from "@/lib/random-pick";
import { playSectionColor } from "@/lib/category-colors";

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: `SlashPlay - ${PLAY_GAME_COUNT} free browser games | SlashAI` },
      {
        name: "description",
        content: `SlashPlay: ${PLAY_GAME_COUNT} free browser games - tic tac toe, connect four, battleship, blackjack, snake, 2048 and more. Multiplayer pass-and-play, no download, works offline.`,
      },
    ],
  }),
  component: PlayIndex,
});

const FILTERS = ["All", ...PLAY_SECTIONS.map((s) => s.title)] as const;
type FilterType = (typeof FILTERS)[number];

const MODES = playModeCounts();

function matches(game: PlayGame, q: string) {
  const text = `${game.name} ${game.desc} ${game.players}`.toLowerCase();
  return q.split(/\s+/).every((word) => text.includes(word));
}

function GameCard({ game, color }: { game: PlayGame; color: string }) {
  return (
    <Link
      to={`/play/${game.slug}` as string}
      style={{ "--cat": color } as React.CSSProperties}
      className="cat cat-glow group flex flex-col rounded-xl border bg-surface p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="cat-tile flex size-9 items-center justify-center rounded-lg text-[24px] leading-none">{game.icon}</span>
        <span className="cat-chip rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide">
          {game.players}
        </span>
      </div>
      <span className="mt-2.5 block text-[13px] font-bold text-foreground">{game.name}</span>
      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{game.desc}</span>
      <span className="cat-text mt-2.5 text-[11px] font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Play now →
      </span>
    </Link>
  );
}

function PlayIndex() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const visibleSections =
    filter === "All" ? PLAY_SECTIONS : PLAY_SECTIONS.filter((s) => s.title === filter);

  const filtered = q
    ? PLAY_SECTIONS.map((s) => ({
        ...s,
        games: s.games.filter((g) => matches(g, q)),
      })).filter((s) => s.games.length > 0)
    : visibleSections;

  const foundCount = q
    ? PLAY_SECTIONS.reduce((acc, s) => acc + s.games.filter((g) => matches(g, q)).length, 0)
    : PLAY_SECTIONS.reduce((acc, s) => (filter === "All" || s.title === filter ? acc + s.games.length : acc), 0);

  return (
    <AppShell wide title="SlashPlay">
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#fb7185] via-[#f472b6] to-[#a78bfa] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          🎮 SlashPlay
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {PLAY_GAME_COUNT} games that run instantly in your browser. No downloads, works offline.
        </p>
      </header>

      <Link
        to="/random"
        search={{ go: true }}
        className="group mt-3 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[16px] transition-transform duration-150 group-hover:rotate-12">🎲</span>
        <span className="min-w-0">
          <span className="block text-[13px] font-bold text-foreground">Bored? Roll the dice</span>
          <span className="block text-[11px] text-muted-foreground">Jump into a random tool or game - {RANDOM_POOL_SIZE} destinations in the pool</span>
        </span>
        <span className="ml-auto shrink-0 text-[11px] font-semibold text-primary">Feeling lucky →</span>
      </Link>

      {/* Multiplayer spotlight - tinted with the Multiplayer colour */}
      <div
        className="mt-4 overflow-hidden rounded-xl border p-4 sm:p-5"
        style={{
          borderColor: "rgba(251,113,133,0.28)",
          background: "linear-gradient(135deg, rgba(251,113,133,0.09), rgba(244,114,182,0.06))",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🎯</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#fb7185" }}>Pass and Play</span>
          <span className="text-[10px] text-muted-foreground">· share one device, take turns</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PLAY_SECTIONS[0]!.games.slice(0, 5).map((g) => (
            <Link
              key={g.slug}
              to={`/play/${g.slug}` as string}
              className="flex flex-col items-center rounded-lg bg-surface px-2 py-3 text-center transition-colors hover:bg-surface-elevated"
            >
              <span className="text-[24px]">{g.icon}</span>
              <span className="mt-1 block text-[11px] font-semibold text-foreground leading-tight">{g.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Games", value: PLAY_GAME_COUNT, icon: "🎮" },
          { label: "Multiplayer", value: MODES.multiplayer, icon: "👥" },
          { label: "Vs AI modes", value: MODES.vsAi, icon: "🤖" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="text-[17px] font-bold text-foreground">
              {s.icon} {s.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search games..."
          className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-10 text-[13px] text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter chips - the active chip takes its section colour */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => {
          const cc = f === "All" ? undefined : playSectionColor(f);
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={
                active && cc
                  ? { background: cc.hex, borderColor: cc.hex, color: "oklch(0.15 0.02 255)" }
                  : undefined
              }
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                active
                  ? "bg-primary text-background"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {foundCount === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No games match "{search}".</p>
      ) : (
        filtered.map((section) => {
          const cc = playSectionColor(section.title);
          return (
            <section
              key={section.title}
              className="mt-7"
              style={{ "--cat": cc.hex } as React.CSSProperties}
            >
              <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold" style={{ color: cc.hex }}>
                <span>{section.icon}</span>
                {section.title}
                <span className="text-[11px] font-medium text-muted-foreground">
                  {section.games.length} game{section.games.length === 1 ? "" : "s"}
                </span>
              </h2>
              <div className="cat-rule -mt-1.5 mb-2.5 w-24" />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {section.games.map((game) => (
                  <GameCard key={game.slug} game={game} color={cc.hex} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Multiplayer games are pass-and-play: share one device and take turns. Everything saves locally - your scores never leave your browser.
      </p>
    </AppShell>
  );
}
