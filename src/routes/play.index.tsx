import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X, Star, StarOff, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import {
  PLAY_SECTIONS,
  PLAY_GAME_COUNT,
  NEW_GAME_SLUGS,
  SCORING_GAMES,
  gameMeta,
  playModeCounts,
  randomGameSlug,
  dailyPack,
  FIELD_TRIP_SITES,
  randomFieldTrip,
  type PlayGame,
} from "@/lib/slashplay";
import { PACKS, PACK_GROUP_ORDER, packCards, packLevel, type PackCard } from "@/lib/packs/registry";
import { usePackBest } from "@/components/games/PackPlayer";
import { getGameBest, isNewItem } from "@/lib/ux";
import { useUxTick } from "@/hooks/use-ux";
import { RANDOM_POOL_SIZE } from "@/lib/random-pick";
import { playSectionColor } from "@/lib/category-colors";
import { useLibrary } from "@/hooks/use-library";

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: `SlashPlay - ${TOTAL_GAMES} free browser games | SlashAI` },
      {
        name: "description",
        content: `SlashPlay: ${TOTAL_GAMES} free browser games - tic tac toe, snake, 2048, cricket, 500+ quiz, word, memory and puzzle packs. Multiplayer pass-and-play, no download, works offline.`,
      },
    ],
  }),
  component: PlayIndex,
});

const FILTERS = ["All", ...PLAY_SECTIONS.map((s) => s.title), ...PACK_GROUP_ORDER.map((g) => g.title)] as const;
type FilterType = (typeof FILTERS)[number];

/** Filter tabs stay route-free: filtering is pure client-side state. */

const MODES = playModeCounts();
/** static games + generated packs = everything playable */
const TOTAL_GAMES = PLAY_GAME_COUNT + PACKS.length;

/** pack groups rendered in the same shape as static sections */
const PACK_SECTIONS = PACK_GROUP_ORDER.map((g) => ({
  title: g.title,
  icon: g.icon,
  blurb: g.blurb,
  games: packCards(g.title),
}));

function packMatches(card: PackCard, q: string) {
  const text = `${card.name} ${card.desc}`.toLowerCase();
  return q.split(/\s+/).every((word) => text.includes(word));
}

function matches(game: PlayGame, q: string) {
  const text = `${game.name} ${game.desc} ${game.players}`.toLowerCase();
  return q.split(/\s+/).every((word) => text.includes(word));
}

function GameCard({ game, color }: { game: PlayGame; color: string }) {
  const { isToolFavorite, toggleToolFavorite } = useLibrary();
  const saved = isToolFavorite(game.slug);
  const meta = gameMeta(game.slug);
  const best = SCORING_GAMES.has(game.slug) ? getGameBest(game.slug) : null;
  return (
    <Link
      to={`/play/${game.slug}` as string}
      style={{ "--cat": color } as React.CSSProperties}
      className="cat cat-glow group flex flex-col rounded-xl border bg-surface p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="cat-tile flex size-9 items-center justify-center rounded-lg text-[24px] leading-none">{game.icon}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleToolFavorite(game.slug); }}
            aria-label={saved ? `Remove ${game.name} from saved` : `Save ${game.name}`}
            className={`shrink-0 rounded-md p-1 transition-colors ${saved ? "text-amber-400" : "text-muted-foreground hover:text-amber-300"}`}
          >
            {saved ? <Star className="size-3.5 fill-current" /> : <StarOff className="size-3.5" />}
          </button>
          <span className="cat-chip rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide">
            {game.players}
          </span>
        </div>
      </div>
      <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[13px] font-bold text-foreground">{game.name}</span>
        {isNewItem(game.added) && (
          <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
            🆕 New
          </span>
        )}
      </span>
      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{game.desc}</span>
      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground/90">
        <span>⏱ {meta.minutes} min</span>
        <span>🎯 {meta.level}</span>
        {best !== null && <span className="font-semibold text-amber-400">🏆 Your best: {best}</span>}
      </span>
      <span className="cat-text mt-2.5 text-[11px] font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Play now →
      </span>
    </Link>
  );
}/** One-tap random game — no filters, no thinking. */
function SurpriseMe() {
  const roll = () => {
    const slug = randomGameSlug();
    if (slug) window.location.assign(`/play/${slug}`);
  };
  return (
    <button
      type="button"
      onClick={roll}
      className="group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
      style={{
        borderColor: "rgba(168,85,247,0.35)",
        background: "linear-gradient(135deg, rgba(168,85,247,0.10), rgba(251,113,133,0.07))",
      }}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-[16px] transition-transform duration-150 group-hover:rotate-12">🎲</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold text-foreground">Surprise me</span>
        <span className="block text-[11px] text-muted-foreground">
          One tap opens a random game from all {TOTAL_GAMES}
        </span>
      </span>
      <span className="shrink-0 text-[11px] font-semibold" style={{ color: "#c084fc" }}>
        Roll →
      </span>
    </button>
  );
}

/** Today's featured pack — rotates every day, deterministic. */
function DailyPack() {
  const pack = dailyPack();
  return (
    <Link
      to={`/play/${pack.slug}` as string}
      className="group mt-3 flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 transition-colors hover:border-amber-500/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[16px] transition-transform duration-150 group-hover:scale-110">{pack.icon}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold text-foreground">Today's puzzle — {pack.name}</span>
        <span className="block text-[11px] text-muted-foreground">{pack.desc}</span>
      </span>
      <span className="ml-auto shrink-0 text-[11px] font-semibold text-amber-500">Play today's →</span>
    </Link>
  );
}

/** Pack card — mirrors GameCard but reads the pack best-score store. */
function PackCardItem({ card }: { card: PackCard }) {
  const [best] = usePackBest(card.slug);
  return (
    <Link
      to={`/play/${card.slug}` as string}
      className="cat cat-glow group flex flex-col rounded-xl border bg-surface p-3.5"
      style={{ "--cat": "#a78bfa" } as React.CSSProperties}
    >
      <span className="cat-tile flex size-9 items-center justify-center rounded-lg text-[24px] leading-none">{card.icon}</span>
      <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[13px] font-bold text-foreground">{card.name}</span>
        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">🆕 New</span>
      </span>
      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{card.desc}</span>
      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground/90">
        <span>⏱ {packMinutesFor(card)} min</span>
        <span>🎯 {packLevelFromCard(card)}</span>
        {best !== null && <span className="font-semibold text-amber-400">🏆 Your best: {best}</span>}
      </span>
      <span className="cat-text mt-2.5 text-[11px] font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Play now →
      </span>
    </Link>
  );
}

function packMinutesFor(card: PackCard): number {
  return PACKS.find((p) => p.slug === card.slug)?.minutes ?? 3;
}
function packLevelFromCard(card: PackCard): string {
  const p = PACKS.find((x) => x.slug === card.slug);
  return p ? packLevel(p) : "Easy";
}

function PlayIndex() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  // one subscription for the whole grid — cards read bests/clicks on render
  useUxTick();
  const q = search.trim().toLowerCase();

  const visibleSections =
    filter === "All" ? PLAY_SECTIONS : PLAY_SECTIONS.filter((s) => s.title === filter);

  const visiblePackSections =
    filter === "All" ? PACK_SECTIONS : PACK_SECTIONS.filter((s) => s.title === filter);

  const filtered = q
    ? [
        ...PLAY_SECTIONS.map((s) => ({
          ...s,
          games: s.games.filter((g) => matches(g, q)),
        })).filter((s) => s.games.length > 0),
        ...PACK_SECTIONS.map((s) => ({
          ...s,
          games: s.games.filter((g) => packMatches(g, q)),
        })).filter((s) => s.games.length > 0),
      ]
    : [...visibleSections, ...visiblePackSections];

  const foundCount = q
    ? PLAY_SECTIONS.reduce((acc, s) => acc + s.games.filter((g) => matches(g, q)).length, 0) +
      PACK_SECTIONS.reduce((acc, s) => acc + s.games.filter((g) => packMatches(g, q)).length, 0)
    : [...visibleSections, ...visiblePackSections].reduce((acc, s) => acc + s.games.length, 0);

  return (
    <AppShell wide title="SlashPlay">
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#fb7185] via-[#f472b6] to-[#a78bfa] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          🎮 SlashPlay
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {TOTAL_GAMES} free browser games — classics, quizzes and 500+ fresh packs. Solo, vs AI, and
          pass-and-play multiplayer. No downloads needed. <span className="text-[12px] font-semibold">Works offline</span>
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

      <div className="mt-3">
        <SurpriseMe />
      </div>

      <DailyPack />

      {/* New games - only while something is genuinely fresh */}
      {filter === "All" && !q && (
        <section className="mt-5">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-emerald-500">
            <span>🆕</span> New Games
            <span className="text-[11px] font-medium text-muted-foreground">
              freshly added to SlashPlay
            </span>
          </h2>
          <div className="cat-rule mt-1.5 mb-2.5 w-24" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {PLAY_SECTIONS.flatMap((s) => s.games)
              .filter(
                (g) => NEW_GAME_SLUGS.includes(g.slug as (typeof NEW_GAME_SLUGS)[number]) || isNewItem(g.added),
              )
              .slice(0, 3)
              .map((g) => (
                <GameCard key={`new-${g.slug}`} game={g} color="#34d399" />
              ))}
          </div>
        </section>
      )}

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
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Games", value: TOTAL_GAMES, icon: "🎮" },
          { label: "Packs", value: PACKS.length, icon: "🧩" },
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
          placeholder="Search games…"
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
          const isPack = (PACK_SECTIONS as { title: string }[]).some((s) => s.title === section.title);
          return (
            <section
              key={section.title}
              className="mt-7"
              style={{ "--cat": isPack ? "#a78bfa" : playSectionColor(section.title).hex } as React.CSSProperties}
            >
              {isPack ? (
                <>
                  <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-[#a78bfa]">
                    <span>{section.icon}</span>
                    {section.title}
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {section.games.length} pack{section.games.length === 1 ? "" : "s"} · {PACK_GROUP_ORDER.find((g) => g.title === section.title)?.blurb}
                    </span>
                  </h2>
                  <div className="cat-rule -mt-1.5 mb-2.5 w-24" />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                    {(section.games as PackCard[]).map((card) => (
                      <PackCardItem key={card.slug} card={card} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold" style={{ color: playSectionColor(section.title).hex }}>
                    <span>{section.icon}</span>
                    {section.title}
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {section.games.length} game{section.games.length === 1 ? "" : "s"}
                    </span>
                  </h2>
                  <div className="cat-rule -mt-1.5 mb-2.5 w-24" />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                    {section.games.map((game) => (
                      <GameCard key={game.slug} game={game as PlayGame} color={playSectionColor(section.title).hex} />
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        })
      )}

      {filter === "All" && !q && <FieldTrip />}

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Multiplayer games are pass-and-play: share one device and take turns. Everything saves locally - your scores never leave your browser.
      </p>
    </AppShell>
  );
}

/** Take a field trip — curated useless-web destinations, each explained. */
function FieldTrip() {
  const [site, setSite] = useState<(typeof FIELD_TRIP_SITES)[number] | null>(null);
  const roll = () => setSite(randomFieldTrip());
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-400">
        <span>🚌</span> Take a field trip
        <span className="text-[11px] font-medium text-muted-foreground">the best of the useless web — explained before you click</span>
      </h2>
      <div className="cat-rule mt-1.5 mb-2.5 w-24" />
      <button
        type="button"
        onClick={roll}
        className="group flex w-full items-center gap-3 rounded-xl border border-sky-500/25 bg-sky-500/5 px-4 py-3 text-left transition-colors hover:border-sky-500/50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[16px] transition-transform duration-150 group-hover:-rotate-12">🎯</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold text-foreground">Take me somewhere fun</span>
          <span className="block text-[11px] text-muted-foreground">Random pick from {FIELD_TRIP_SITES.length} hand-picked internet oddities</span>
        </span>
        <span className="shrink-0 text-[11px] font-semibold text-sky-400">Go →</span>
      </button>
      {site && (
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-start gap-3 rounded-xl border bg-surface p-3.5 transition-colors hover:bg-surface-elevated"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-foreground">
              {site.name} <ExternalLink className="inline size-3 text-muted-foreground" />
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{site.what}</span>
            <span className="mt-1 block text-[10px] text-muted-foreground/80">{site.group}{site.kidsOk ? " · kid-friendly" : ""}</span>
          </span>
        </a>
      )}
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {FIELD_TRIP_SITES.slice(0, 8).map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border bg-surface p-3 transition-colors hover:bg-surface-elevated"
          >
            <span className="block text-[12px] font-bold text-foreground">
              {s.name} <ExternalLink className="inline size-3 text-muted-foreground" />
            </span>
            <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">{s.what}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
