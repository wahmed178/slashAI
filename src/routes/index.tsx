import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Copy,
  NotebookPen,
  Sparkles,
  Star,
  History,
  Flame,
  Search as SearchIcon,
  Terminal,
  Package,
  Zap,
  Map,
  BookOpen,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { LiveTicker } from "@/components/library/LiveTicker";
import { SearchBox } from "@/components/library/SearchBox";
import { VoiceSearchButton } from "@/components/library/VoiceSearchButton";
import { Discover } from "@/components/library/Discover";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { categoryIcon } from "@/components/library/icons";
import { useLibrary } from "@/hooks/use-library";
import {
  CATEGORY_ICONS,
  CATEGORY_TREE,
  VERIFIED_TOTAL,
  getCommand,
  type SlashCommand,
} from "@/lib/commands";
import { COLLECTIONS, recommendedCommands } from "@/lib/collections";
import { DROPS, RESOURCE_TOTAL, dropItems } from "@/lib/resources";
import {
  HOME_MOST_USED_THRESHOLD,
  interactionCount,
  onIntelligenceChange,
  resolveCommands,
  topPersonalCommands,
} from "@/lib/intelligence";
import trendingToolsData from "@/../src/data/trending-tools.json";
import { ALL_ROADMAPS } from "@/lib/roadmaps";
import { GLOSSARY_TOTAL } from "@/lib/glossary";
import { ALL_SLASH_TOOLS, SLASH_TOOL_COUNT, toolOfTheDay as heroToolOfTheDay } from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";
import { TOOLS } from "@/lib/tools";

const HERO_TOOL = heroToolOfTheDay();
const GENERATOR_TOTAL = ALL_SLASH_TOOLS.filter((t) =>
  t.name.toLowerCase().includes("generator"),
).length;

/** Truncate at a word boundary so titles never cut mid-word */
const truncateWords = (s: string, n: number) =>
  s.length > n ? s.slice(0, s.lastIndexOf(" ", n)).trimEnd() + "…" : s;

/* ─────────────── Stats Bar (live counts, cannot fail) ─────────────── */
function StatsBar() {
  const stats = [
    { number: VERIFIED_TOTAL.toLocaleString(), label: "COMMANDS", color: "var(--primary)", icon: Terminal },
    { number: RESOURCE_TOTAL.toLocaleString(), label: "RESOURCES", color: "var(--primary)", icon: Package },
    { number: GENERATOR_TOTAL.toLocaleString(), label: "GENERATORS", color: "#fbbf24", icon: Sparkles },
    { number: ALL_ROADMAPS.length.toLocaleString(), label: "ROADMAPS", color: "#3fb950", icon: Map },
    { number: GLOSSARY_TOTAL.toLocaleString(), label: "GLOSSARY", color: "#a78bfa", icon: BookOpen },
  ];
  return (
    <div className="mt-6 rounded-[10px] border border-sidebar-border bg-surface px-3 py-3 sm:px-6 sm:py-4">
      <div className="grid grid-cols-5 items-center gap-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <span key={stat.label} className="flex items-center gap-1 sm:gap-2.5 justify-center">
              {i > 0 && <div className="hidden sm:block h-[24px] w-px bg-surface-elevated" />}
              <Icon className="size-4 sm:size-[18px] shrink-0" style={{ color: stat.color }} aria-hidden />
              <div className="text-center">
                <span className="block text-[14px] sm:text-[22px] font-bold text-foreground leading-tight" style={{ fontFamily: "var(--font-mono, monospace)" }}>{stat.number}</span>
                <span className="block text-[7px] sm:text-[10px] uppercase tracking-[0.04em] sm:tracking-[0.06em] text-muted-foreground leading-tight">{stat.label}</span>
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── Your Week Stats ─────────────── */
function YourWeekDigest() {
  const { streak, stats, favorites, journal } = useLibrary();
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 7);
    return d.toISOString().slice(0, 10);
  }, []);
  const entriesThisWeek = journal.filter((e) => e.date >= weekAgo).length;

  const tiles = [
    { icon: Flame, label: "Streak", value: streak.count, to: "/journal" },
    { icon: Copy, label: "Copied", value: stats.copies, to: "/recent" },
    { icon: Star, label: "Saved", value: favorites.length, to: "/favorites" },
    { icon: NotebookPen, label: "Logs", value: entriesThisWeek, to: "/journal" },
  ] as const;

  const allZero = tiles.every((t) => t.value === 0);

  return (
    <section className="panel mt-6 rounded-2xl p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Activity className="size-3.5 text-primary" aria-hidden /> Your week
        </h2>

      </header>
      {allZero ? (
        <div className="mt-3 rounded-[10px] border border-border bg-surface p-5 text-center">
          <div className="text-[32px]">⚡</div>
          <p className="mt-2 text-[15px] font-semibold text-foreground">Your stats appear here</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Copy a command to start your streak</p>
          <Link to="/search" className="mt-3 inline-block rounded-[6px] border border-border bg-surface-elevated px-5 py-2 text-[13px] text-primary no-underline transition-colors hover:border-border">
            Browse commands →
          </Link>
        </div>
      ) : (
      <div className="mt-3 grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.to}
            className="rounded-xl bg-surface-elevated p-2.5 text-center transition-colors hover:bg-accent"
          >
            <t.icon className="mx-auto size-4 text-primary" aria-hidden />
            <span className="mt-1 block text-lg font-black leading-none text-foreground">
              {t.value}
            </span>
            <span className="mt-1 block truncate text-[11px] text-muted-foreground">{t.label}</span>
          </Link>
        ))}
      </div>
      )}

    </section>
  );
}

/* ─────────────── Route ─────────────── */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SlashAI - Find the Right AI Command in Seconds" },
      {
        name: "description",
        content: `A calm, searchable library of ${VERIFIED_TOTAL} AI slash commands. Search by what you want to accomplish, save favourites and work offline.`,
      },
      { property: "og:title", content: "SlashAI - AI slash command library" },
      {
        property: "og:description",
        content: `Search ${VERIFIED_TOTAL} copy-ready AI slash commands by task, category or collection. Free forever, no account needed.`,
      },
      { name: "theme-color", content: "#12161c" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "SlashAI" },
    ],
    links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
  }),
  component: HomePage,
});

function Section({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 animate-fade-in-up sm:mt-12">
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-block h-[18px] w-[3px] shrink-0 rounded-[2px] bg-primary" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function CommandRow({ commands }: { commands: SlashCommand[] }) {
  return (
    <div className="stagger-children grid gap-2 sm:grid-cols-2">
      {commands.map((c) => {
        const Icon = categoryIcon(CATEGORY_ICONS[c.category]);
        return (
          <Link
            key={c.id}
            to="/c/$slug"
            params={{ slug: c.id }}
            className="ripple-press flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface px-3 transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Icon className="size-4.5 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-sm text-foreground">{c.command}</span>
              <span className="block truncate text-xs text-muted-foreground">{c.title}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ─────────────── Your Most Used (intelligence engine) ─────────────── */
function MostUsedCommands() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(interactionCount());
    update();
    return onIntelligenceChange(update);
  }, []);

  if (count < HOME_MOST_USED_THRESHOLD) return null;

  const commands = resolveCommands(topPersonalCommands(5), getCommand);
  if (commands.length === 0) return null;

  return (
    <Section
      title="Your most used"
      hint="Ranked from the commands you copy, open and save on this device."
      action={
        <Link
          to="/search"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Sparkles className="size-4" aria-hidden /> Search
        </Link>
      }
    >
      <CommandRow commands={commands} />
    </Section>
  );
}

function HomePage() {
  const { hydrated, favorites, recents, settings } = useLibrary();
  const [heroQuery, setHeroQuery] = useState("");


  const recentCommands = useMemo(
    () =>
      recents
        .slice(0, 4)
        .map((id) => getCommand(id))
        .filter((c): c is SlashCommand => Boolean(c)),
    [recents],
  );

  const favoriteCommands = useMemo(
    () =>
      favorites
        .slice(0, 4)
        .map((id) => getCommand(id))
        .filter((c): c is SlashCommand => Boolean(c)),
    [favorites],
  );

  const forYou = useMemo(
    () => (hydrated ? recommendedCommands(settings.interests, recents, favorites, 4) : []),
    [hydrated, settings.interests, recents, favorites],
  );

  const { streak } = useLibrary();

  const weeklyFinds = useMemo(() => {
    const weekly = DROPS.find((d) => d.cadence === "Weekly");
    return weekly ? dropItems(weekly).slice(0, 6) : [];
  }, []);

  // Auto-updated trending tools from GitHub Actions
  const trendingTools = useMemo(() => {
    const items = (trendingToolsData as any).items || [];
    return items.slice(0, 5);
  }, []);
  const trendingUpdated = (trendingToolsData as any).updated || '';

  return (
    <AppShell hideHeaderSearch title="SlashAI">
      {/* ─── Live Ticker ─── */}
      <LiveTicker />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-surface border border-sidebar-border p-4 pt-6 sm:p-8">
        <div className="flex flex-col gap-4 overflow-hidden md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Left: text */}
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[9px] sm:text-[11px] uppercase tracking-[0.05em] sm:tracking-[0.08em] text-primary">
              YOUR AI COMMAND VAULT - FREE FOREVER
            </span>
            <h1 className="mt-3 text-[26px] font-bold leading-[1.15] tracking-tight text-foreground sm:mt-4 sm:text-[36px]">
              Find the right AI command
              <br />
              <span className="bg-gradient-to-r from-[#2dd4bf] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">in seconds</span>
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground sm:mt-3 sm:text-[14px]">
              {VERIFIED_TOTAL.toLocaleString()} commands · {RESOURCE_TOTAL} curated resources · Free forever
            </p>

            {/* Search bar */}
            <form
              className="mt-5 flex h-[48px] max-w-[460px] items-center gap-3 rounded-[8px] border border-sidebar-border bg-surface px-4 transition-colors focus-within:border-primary"
              onSubmit={(e) => {
                e.preventDefault();
                if (heroQuery.trim()) window.location.assign(`/tools/finder?q=${encodeURIComponent(heroQuery.trim())}`);
              }}
            >
              <SearchIcon className="size-[16px] shrink-0 text-muted-foreground" aria-hidden />
              <input
                name="q"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                type="text"
                placeholder="Search commands, tools, games, topics..."
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <VoiceSearchButton
                size="sm"
                onResult={(t) => {
                  setHeroQuery(t);
                  window.location.assign(`/tools/finder?q=${encodeURIComponent(t.trim())}`);
                }}
              />
              <span className="flex h-5 items-center rounded border border-border bg-surface-elevated px-1.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </span>
            </form>

            {/* Intent chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { emoji: "✍️", label: "Write something" },
                { emoji: "💻", label: "Code something" },
                { emoji: "🔍", label: "Do research" },
                { emoji: "💼", label: "Get work done" },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  to="/search"
                  search={{ q: chip.label.toLowerCase() }}
                  className="flex items-center gap-1.5 rounded-full border border-sidebar-border bg-surface px-3.5 py-1.5 text-[12px] text-muted-foreground transition-all duration-150 hover:border-[rgba(45,212,191,0.3)] hover:text-foreground"
                >
                  <span>{chip.emoji}</span>
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: 3D CSS cube (desktop only) */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className="flex items-center justify-center"
              style={{
                width: "180px",
                height: "180px",
                background: "radial-gradient(circle at 30% 30%, rgba(45,212,191,0.3) 0%, rgba(88,166,255,0.15) 40%, rgba(45,212,191,0.05) 70%, transparent 100%)",
                border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: "24px",
                transform: "rotate(15deg)",
                boxShadow: "0 0 60px rgba(45,212,191,0.15), inset 0 0 40px rgba(45,212,191,0.05)",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: "64px", filter: "drop-shadow(0 0 20px #2dd4bf)" }}>⚡</span>
            </div>
          </div>
        </div>
        <style>{`@keyframes float { 0%, 100% { transform: rotate(15deg) translateY(0px); } 50% { transform: rotate(15deg) translateY(-10px); } }`}</style>
      </section>

      {/* ─── Stats Bar ─── */}
      <StatsBar />

      {/* ─── Feature cards ─── */}
      <section className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[
          { to: "/explore", emoji: "⌨️", title: "AI Commands", desc: `${VERIFIED_TOTAL.toLocaleString()} copy-ready prompts` },
          { to: "/hub/founders", emoji: "🚀", title: "Founder Tools", desc: "Validate, build & ship free" },
          { to: "/live", emoji: "📡", title: "Live Dashboard", desc: "Markets, weather, cricket" },
          { to: "/discover", emoji: "📦", title: "Free Resources", desc: `${RESOURCE_TOTAL}+ verified picks` },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="flex flex-col rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
          >
            <span className="text-[24px]">{card.emoji}</span>
            <span className="mt-2 text-[13px] font-semibold text-foreground">{card.title}</span>
            <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{card.desc}</span>
          </Link>
        ))}
      </section>

      {/* ─── Explore more - 2×4 grid ─── */}
      <section className="mt-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { to: "/ai-tools", emoji: "🤖", title: "AI Assistant", desc: `${TOOLS.length} curated AI tools` },
            { to: "/tools", emoji: "⚡", title: "Generators", desc: `${GENERATOR_TOTAL} instant generators` },
            { to: "/roadmaps", emoji: "🗺️", title: "Roadmaps", desc: `${ALL_ROADMAPS.length} step-by-step guides` },
            { to: "/live", emoji: "📡", title: "Live", desc: "Markets, weather, prayer times" },
            { to: "/quiz", emoji: "🧠", title: "Daily Quiz", desc: "24 categories, fresh daily" },
            { to: "/radar", emoji: "🛍️", title: "Deals & Offers", desc: "Free offers, checked daily" },
            { to: "/glossary", emoji: "📖", title: "Glossary", desc: `${GLOSSARY_TOTAL} AI & startup terms` },
            { to: "/discover", emoji: "🧭", title: "Discover", desc: `${RESOURCE_TOTAL}+ free resources` },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group flex flex-col items-center justify-center rounded-[10px] border border-border bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58] min-h-[120px]"
            >
              <span className="text-[26px]">{card.emoji}</span>
              <span className="mt-2 block text-[13px] font-semibold text-foreground">{card.title}</span>
              <span className="mt-0.5 block max-w-full truncate text-[11px] text-muted-foreground">{card.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Tool of the Day (rotates daily via date seed) ─── */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-sidebar-border bg-surface">
        <div className="flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
              ⭐ Tool of the day
            </span>
            <h2 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">{HERO_TOOL.name}</h2>
            <p className="mt-1.5 text-[14px] text-muted-foreground">{HERO_TOOL.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground">100% Free</span>
              <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground">Browser only</span>
            </div>
            <Link
              to={`/tools/${HERO_TOOL.slug}` as string}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
            >
              Try it now <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="hidden md:flex size-32 items-center justify-center rounded-2xl bg-surface-elevated text-6xl">
            {HERO_TOOL.icon}
          </div>
        </div>
      </section>

      {/* ─── Your week digest ─── */}
      <YourWeekDigest />

      <Section
        title="Command of the day"
        hint="One fresh pick a day, plus a reroll whenever you want one."
      >
        <Discover />
      </Section>

      <MostUsedCommands />

      <Section
        title="This week's free finds"
        hint={trendingUpdated ? `Auto-updated ${trendingUpdated}` : "Hand-picked, with a last-checked date on every entry."}
        action={
          <Link
            to="/whats-new"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        {trendingTools.length > 0 ? (
          <div className="flex flex-col gap-2">
            {trendingTools.map((tool: any, i: number) => (
              <a
                key={i}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-bold text-primary">
                  {tool.name?.[0] || '?'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {truncateWords(String(tool.name ?? ""), 60)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {truncateWords(String(tool.description ?? ""), 110)}
                  </span>
                </span>
                <span className="shrink-0 rounded border border-border bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">
                  {tool.source}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <ResourceGrid resources={weeklyFinds} />
        )}
      </Section>

      {/* ─── SlashKits preview (GingerBook-style showcase) ─── */}
      <Section
        title="SlashKits"
        hint={`${SLASH_TOOL_COUNT}+ free browser tools - nothing uploads, no account needed.`}
        action={
          <Link
            to="/tools"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all {SLASH_TOOL_COUNT}+ tools <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { slug: "image-compress", icon: "🖼️", name: "Image Compressor", desc: "Reduce size in-browser" },
            { slug: "qr-code", icon: "📱", name: "QR Generator", desc: "URLs, WiFi, text" },
            { slug: "pomodoro", icon: "🍅", name: "Pomodoro Timer", desc: "25/5/15 focus" },
            { slug: "spelling", icon: "✍️", name: "Grammar Checker", desc: "Offline spell check" },
            { slug: "whiteboard", icon: "🖊️", name: "Whiteboard", desc: "Sketch & export" },
            { slug: "api-tester", icon: "🔌", name: "API Tester", desc: "Test REST APIs" },
          ].map((tool) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}` as string}
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58] min-h-[110px]"
            >
              <span className="text-[26px]">{tool.icon}</span>
              <span className="mt-1.5 block text-[12px] font-semibold text-foreground leading-tight">{tool.name}</span>
              <span className="mt-0.5 block max-w-full truncate text-[10px] text-muted-foreground leading-tight">{tool.desc}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─── SlashPlay (games showcase) ─── */}
      <Section
        title="SlashPlay"
        hint={`${PLAY_GAME_COUNT} free browser games - pass-and-play, vs AI, and solo.`}
        action={
          <Link
            to="/play"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all {PLAY_GAME_COUNT} games <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { slug: "cricket", icon: "🏏", name: "Cricket", desc: "Hit sixes" },
            { slug: "2048", icon: "🔢", name: "2048", desc: "Merge to 2048" },
            { slug: "snake", icon: "🐍", name: "Snake", desc: "Arcade classic" },
            { slug: "simon", icon: "🎵", name: "Simon", desc: "Memory colors" },
            { slug: "tic-tac-toe", icon: "❌", name: "Tic Tac Toe", desc: "Vs AI or a friend" },
            { slug: "minesweeper", icon: "💣", name: "Minesweeper", desc: "Clear the grid" },
          ].map((game) => (
            <Link
              key={game.slug}
              to={`/play/${game.slug}` as string}
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 min-h-[110px]"
            >
              <span className="text-[26px]">{game.icon}</span>
              <span className="mt-1.5 block text-[12px] font-semibold text-foreground leading-tight">{game.name}</span>
              <span className="mt-0.5 block max-w-full truncate text-[10px] text-muted-foreground leading-tight">{game.desc}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─── Free Resources (GingerBook-style promo) ─── */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-sidebar-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-[#fbbf24]">
              🎓 Free Learning
            </span>
            <h2 className="mt-3 text-xl font-bold text-foreground">Free courses &amp; resources</h2>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Curated free courses from top platforms - no hidden fees, no credit card required.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { emoji: "🎨", label: "Free Courses", to: "/discover/learn" },
                { emoji: "💻", label: "Free Dev Courses", to: "/hub/developers" },
                { emoji: "📈", label: "Free Business Courses", to: "/hub/founders" },
                { emoji: "✍️", label: "Free Writing Tools", to: "/search?q=write" },
                { emoji: "🔍", label: `${VERIFIED_TOTAL.toLocaleString()} AI Commands`, to: "/explore" },
                { emoji: "📦", label: `${RESOURCE_TOTAL}+ Free Resources`, to: "/discover" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-[12px] font-medium text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {recentCommands.length > 0 && (
        <Section
          title="Continue where you left off"
          action={
            <Link
              to="/recent"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <History className="size-4" aria-hidden /> All
            </Link>
          }
        >
          <CommandRow commands={recentCommands} />
        </Section>
      )}

      {favoriteCommands.length > 0 && (
        <Section
          title="Your favorites"
          action={
            <Link
              to="/favorites"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Star className="size-4" aria-hidden /> All
            </Link>
          }
        >
          <CommandRow commands={favoriteCommands} />
        </Section>
      )}

      {forYou.length > 0 && (
        <Section title="For you" hint="Based on what you saved and opened on this device.">
          <CommandRow commands={forYou} />
        </Section>
      )}

      <Section
        title="Collections"
        hint="Curated starting points - every collection is open to everyone."
        action={
          <Link
            to="/collections"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {COLLECTIONS.slice(0, 6).map((c) => {
            const borderColors: Record<string, string> = {
              "For Women": "rgba(244,114,182,0.4)",
              "For Men": "rgba(96,165,250,0.4)",
              "For Students": "rgba(251,191,36,0.4)",
              "For Creators": "rgba(251,146,60,0.4)",
              "For Professionals": "rgba(52,211,153,0.4)",
              "For Entrepreneurs": "rgba(167,139,250,0.4)",
            };
            const iconMap: Record<string, string> = { "For Women": "👩", "For Men": "👨", "For Students": "🎓", "For Creators": "🎨", "For Professionals": "💼", "For Entrepreneurs": "🚀" };
            return (
              <Link
                key={c.id}
                to="/collections/$id"
                params={{ id: c.id }}
                className="flex shrink-0 flex-col items-center rounded-[12px] bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 w-[150px] sm:w-auto"
                style={{ border: `1px solid ${borderColors[c.title] || "#21262d"}` }}
              >
                <span className="text-[32px]">{iconMap[c.title] || c.icon}</span>
                <span className="mt-2 block text-[13px] font-semibold text-foreground">{c.title}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{c.count} commands</span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="Hubs" hint="Everything gathered for one kind of person.">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {([
            { to: "/hub/students", emoji: "\u{1F393}", title: "Student Hub", desc: "Courses & tools" },
            { to: "/hub/developers", emoji: "\u{1F4BB}", title: "Developer Hub", desc: "APIs & open-source" },
            { to: "/hub/creators", emoji: "\u{1F3A8}", title: "Creator Hub", desc: "Design & content" },
            { to: "/hub/professionals", emoji: "\u{1F4BC}", title: "Professional Hub", desc: "Productivity" },
            { to: "/hub/founders", emoji: "\u{1F680}", title: "Founders Hub", desc: "Idea to first customer" },
            { to: "/hub/islam", emoji: "☪", title: "Islam Hub", desc: "Quran, Hadith & learning" },
          ]).map((hub) => (
            <Link
              key={hub.to}
              to={hub.to}
              className="group flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[22px]" aria-hidden>{hub.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-foreground">{hub.title}</span>
                <span className="block text-[11px] text-muted-foreground truncate">{hub.desc}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
            </Link>
          ))}
        </div>
        <Link
          to="/hub"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          See all hubs <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="mt-14 border-t border-sidebar-border pt-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            {
              title: "AI Tools",
              links: [
                { label: "Commands", to: "/explore" },
                { label: "Generators", to: "/tools" },
                { label: "Roadmaps", to: "/roadmaps" },
                { label: "Glossary", to: "/glossary" },
                { label: "AI Assistant", to: "/ai-tools" },
              ],
            },
            {
              title: "Explore",
              links: [
                { label: "Discover", to: "/discover" },
                { label: "Live Dashboard", to: "/live" },
                { label: "Deals & Offers", to: "/radar" },
                { label: "What's New", to: "/whats-new" },
                { label: "Daily Quiz", to: "/quiz" },
              ],
            },
            {
              title: "Tools & Play",
              links: [
                { label: "SlashKits", to: "/tools" },
                { label: "SlashPlay", to: "/play" },
                { label: "SlashBar", to: "/slash" },
                { label: "Journal", to: "/journal" },
                { label: "Settings", to: "/me" },
              ],
            },
            {
              title: "Info",
              links: [
                { label: "About", to: "/about" },
                { label: "Changelog", to: "/changelog" },
                { label: "Islam Hub", to: "/hub/islam" },
                { label: "All Hubs", to: "/hub" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-sidebar-border py-5 sm:flex-row">
          <p className="text-[12px] text-muted-foreground">© {new Date().getFullYear()} SlashAI · Free forever · No account needed</p>
          <a href="https://github.com/wahmed178/slashAI" target="_blank" rel="noopener" aria-label="SlashAI on GitHub" className="text-[18px] text-muted-foreground transition-colors hover:text-foreground">
            🐙
          </a>
        </div>
      </footer>

    </AppShell>
  );
}
