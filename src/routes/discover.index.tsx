import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X, LoaderCircle } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  SECTIONS,
  RESOURCES,
  RESOURCE_TOTAL,
  searchResources,
} from "@/lib/resources";
import { TOOL_SECTIONS } from "@/lib/slashkits";
import { PLAY_SECTIONS } from "@/lib/slashplay";
import { SLASH_APPS } from "@/lib/slashbar";
import {
  CAT_PALETTE,
  kitSectionColor,
  playSectionColor,
  type CatColor,
} from "@/lib/category-colors";

export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover - every tool, game and resource on one feed | SlashAI" },
      {
        name: "description",
        content: `Explore ${RESOURCE_TOTAL}+ resources, ${TOOL_SECTIONS.reduce((a, s) => a + s.tools.length, 0)} tools and ${PLAY_SECTIONS.reduce((a, s) => a + s.games.length, 0)} games - an endless discovery feed, all free.`,
      },
    ],
  }),
  component: DiscoverPage,
});

/* ──────────── feed model ──────────── */

interface FeedItem {
  key: string;
  kind: "resource" | "tool" | "game";
  title: string;
  desc: string;
  emoji: string;
  badge: string;
  to: string;
  external: boolean;
  tint: CatColor;
  rank: number;
}

const PAGE = 24;

/* section id → tint for resource tiles (stable, distinct colours) */
const SECTION_TINTS: Record<string, CatColor> = {
  ai: CAT_PALETTE.violet,
  "free-tools": CAT_PALETTE.teal,
  "free-ai": CAT_PALETTE.cyan,
  "free-apis": CAT_PALETTE.sky,
  github: CAT_PALETTE.indigo,
  learn: CAT_PALETTE.blue,
  resources: CAT_PALETTE.lime,
  youtube: CAT_PALETTE.red,
  reddit: CAT_PALETTE.orange,
  websites: CAT_PALETTE.green,
  "free-time": CAT_PALETTE.fuchsia,
  tips: CAT_PALETTE.amber,
};

function buildFeed(): FeedItem[] {
  const items: FeedItem[] = [];

  // resources - newest first so the feed feels fresh
  const resources = [...RESOURCES].sort((a, b) =>
    b.addedDate.localeCompare(a.addedDate),
  );
  for (const r of resources) {
    items.push({
      key: `res-${r.id}`,
      kind: "resource",
      title: r.name,
      desc: r.description,
      emoji: "",
      badge: r.pricing,
      to: `/r/${r.id}`,
      external: false,
      tint: SECTION_TINTS[r.section] ?? CAT_PALETTE.teal,
      rank: 1,
    });
  }

  // tools - tinted with their SlashKits section colour
  for (const s of TOOL_SECTIONS) {
    const tint = kitSectionColor(s.title);
    for (const t of s.tools) {
      items.push({
        key: `tool-${t.slug}`,
        kind: "tool",
        title: t.name,
        desc: t.desc,
        emoji: t.icon,
        badge: "Tool",
        to: `/tools/${t.slug}`,
        external: false,
        tint,
        rank: 2,
      });
    }
  }

  // games - tinted with their SlashPlay section colour
  for (const s of PLAY_SECTIONS) {
    const tint = playSectionColor(s.title);
    for (const g of s.games) {
      items.push({
        key: `game-${g.slug}`,
        kind: "game",
        title: g.name,
        desc: g.desc,
        emoji: g.icon,
        badge: `🎮 ${g.players}`,
        to: `/play/${g.slug}`,
        external: false,
        tint,
        rank: 2,
      });
    }
  }

  // slash apps - the whole SlashBar rail is discoverable too
  for (const app of SLASH_APPS) {
    const appPath = app.link ?? `/slash/${app.slug}`;
    if (app.link) continue; // SlashKits/SlashPlay already in the feed as tools/games
    items.push({
      key: `slash-${app.slug}`,
      kind: "tool",
      title: app.name,
      desc: app.desc,
      emoji: app.emoji,
      badge: "⚡ Slash",
      to: appPath,
      external: false,
      tint: app.tint,
      rank: 2,
    });
  }

  return items;
}

const FEED = buildFeed();

/* ──────────── stories row data ──────────── */

const STORIES = [
  ...SECTIONS.map((s) => ({
    label: s.label,
    emoji: { ai: "🤖", "free-tools": "🛠️", "free-ai": "✨", "free-apis": "📡", github: "🐙", learn: "🎓", resources: "📦", youtube: "🎬", reddit: "💬", websites: "🌐", "free-time": "🎮", tips: "💡" }[s.id] ?? "📦",
    to: `/discover/${s.id}`,
    tint: SECTION_TINTS[s.id] ?? CAT_PALETTE.teal,
  })),
  { label: "SlashKits", emoji: "🧰", to: "/tools", tint: CAT_PALETTE.teal },
  { label: "SlashPlay", emoji: "🎮", to: "/play", tint: CAT_PALETTE.rose },
  { label: "SlashBar", emoji: "⚡", to: "/slash", tint: CAT_PALETTE.amber },
  { label: "Fun Sites", emoji: "🎪", to: "/hub/fun", tint: CAT_PALETTE.orange },
];

/* ──────────── page ──────────── */

function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "tools" | "games" | "resources">("all");
  const [shown, setShown] = useState(PAGE);
  const q = search.trim().toLowerCase();

  const feed = useMemo(() => {
    let items = FEED;
    if (filter === "tools") items = items.filter((i) => i.kind === "tool");
    if (filter === "games") items = items.filter((i) => i.kind === "game");
    if (filter === "resources") items = items.filter((i) => i.kind === "resource");
    if (q) {
      items = items.filter((i) =>
        `${i.title} ${i.desc} ${i.badge}`.toLowerCase().includes(q),
      );
    }
    return items;
  }, [filter, q]);

  const visible = feed.slice(0, q ? feed.length : shown);

  return (
    <AppShell wide hideHeaderSearch title="Discover">
      {/* ── header ── */}
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#f472b6] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Discover
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {RESOURCE_TOTAL}+ resources · every tool · every game - one endless feed.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          <span className="text-primary">{RESOURCE_TOTAL} resources</span>
          <span>·</span>
          <span>{TOOL_SECTIONS.reduce((a, s) => a + s.tools.length, 0)} tools</span>
          <span>·</span>
          <span>{PLAY_SECTIONS.reduce((a, s) => a + s.games.length, 0)} games</span>
          <span>·</span>
          <span className="text-[#3fb950]">All free</span>
        </div>
      </header>

      {/* ── search (IG-style pill) ── */}
      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the feed…"
          className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="ripple-press absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── stories row ── */}
      {!q && (
        <div
          className="stagger-children mt-4 flex gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {STORIES.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="ripple-press flex w-[68px] shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className="grid size-[62px] place-items-center rounded-full p-[2.5px]"
                style={{
                  background: `conic-gradient(from 210deg, ${s.tint.hex}, ${CAT_PALETTE.violet.hex}, ${CAT_PALETTE.pink.hex}, ${s.tint.hex})`,
                }}
              >
                <span className="grid size-full place-items-center rounded-full bg-background text-[24px]">
                  {s.emoji}
                </span>
              </span>
              <span className="w-full truncate text-center text-[10px] font-medium text-muted-foreground">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* ── filter chips ── */}
      <div
        className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {(
          [
            { id: "all", label: "All" },
            { id: "tools", label: "🧰 Tools" },
            { id: "games", label: "🎮 Games" },
            { id: "resources", label: "📡 Resources" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`ripple-press shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
              filter === f.id
                ? "bg-foreground text-background"
                : "border border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── feed grid ── */}
      {visible.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm font-semibold text-foreground">Nothing in the feed for “{search.trim()}”.</p>
          <p className="mt-1 text-xs text-muted-foreground">Try “AI”, “game”, “timer” or clear the search.</p>
        </div>
      ) : (
        <div className="stagger-children mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((item) => (
            <FeedTile key={item.key} item={item} />
          ))}
        </div>
      )}

      {/* ── load more ── */}
      {!q && shown < feed.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShown((n) => n + PAGE)}
            className="ripple-press inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary"
          >
            <LoaderCircle className="size-4" aria-hidden />
            Load more ({feed.length - shown} left)
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Everything here is free. Tap any tile to jump straight in.
      </p>
    </AppShell>
  );
}

/* ──────────── feed tile (the "post") ──────────── */

/** Favicon with a guaranteed-visible fallback: letter avatar tinted by category. */
function Favicon({ host, tint, name }: { host: string; tint: CatColor; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-lg text-[17px] font-black"
        style={{
          background: `color-mix(in oklab, ${tint.hex} 30%, transparent)`,
          color: tint.hex,
          border: `1px solid color-mix(in oklab, ${tint.hex} 45%, transparent)`,
        }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-10 rounded-lg bg-background/60 p-1.5"
    />
  );
}

function FeedTile({ item }: { item: FeedItem }) {
  return (
    <Link
      to={item.to}
      style={{ "--cat": item.tint.hex } as React.CSSProperties}
      className="cat cat-glow ripple-press group flex flex-col overflow-hidden rounded-xl border bg-surface"
    >
      {/* thumbnail area - tinted gradient like a post cover */}
      <span
        className="relative flex aspect-square items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(140deg, color-mix(in oklab, var(--cat) 26%, transparent), color-mix(in oklab, var(--cat) 8%, transparent) 55%, transparent)`,
        }}
      >
        {item.kind === "resource" ? (
          <Favicon host={hostOf(item.to)} tint={item.tint} name={item.title} />
        ) : (
          <span className="text-[40px] leading-none drop-shadow-sm transition-transform duration-200 group-hover:scale-110">
            {item.emoji || "✨"}
          </span>
        )}
        <span className="cat-chip absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold">
          {item.badge}
        </span>
      </span>
      {/* caption */}
      <span className="flex flex-1 flex-col p-2.5">
        <span className="truncate text-[12.5px] font-bold text-foreground">{item.title}</span>
        <span className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-muted-foreground">
          {item.desc}
        </span>
      </span>
    </Link>
  );
}

/** best-effort domain from a route path (for favicon thumbnails) */
const ID_TO_HOST = new Map(
  RESOURCES.map((r) => {
    try {
      return [r.id, new URL(r.url).hostname] as const;
    } catch {
      return [r.id, "slashai.app"] as const;
    }
  }),
);

function hostOf(path: string): string {
  return ID_TO_HOST.get(path.replace("/r/", "")) ?? "slashai.app";
}
