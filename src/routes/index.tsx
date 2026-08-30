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
  Compass,
  Radar as RadarIcon,
  PenLine,
  GraduationCap,
  Code2,
  Image as ImageIcon,
  FileText,
  Briefcase,
  Search as SearchIcon,
  Wand2,
  Radio,
  Dices,
  Bot,
  Film,
  Youtube,
  Zap,
  Globe,
  BookOpen,
  Map,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { LiveTicker } from "@/components/library/LiveTicker";
import { SearchBox } from "@/components/library/SearchBox";
import { Discover } from "@/components/library/Discover";
import { Onboarding } from "@/components/library/Onboarding";
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
import trendingToolsData from "@/../src/data/trending-tools.json";

/* ─────────────── Stats Bar (static — cannot fail) ─────────────── */
/* ─────────────── Stats Bar ─────────────── */
function StatsBar() {
  const stats = [
    { number: "5,635", label: "COMMANDS", color: "var(--primary)", icon: "📊" },
    { number: "319", label: "RESOURCES", color: "var(--primary)", icon: "📦" },
    { number: "25", label: "GENERATORS", color: "#d29922", icon: "⚡" },
    { number: "20", label: "ROADMAPS", color: "#3fb950", icon: "🗺️" },
    { number: "138", label: "GLOSSARY", color: "#a78bfa", icon: "📖" },
  ];
  return (
    <div className="mt-6 rounded-[10px] border border-sidebar-border bg-surface px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-4 sm:gap-6" style={{ minWidth: "min-content" }}>
        {stats.map((stat, i) => (
          <span key={stat.label} className="flex items-center gap-2.5 flex-shrink-0">
            {i > 0 && <div className="hidden sm:block h-[24px] w-px bg-surface-elevated" />}
            <span className="text-[18px]">{stat.icon}</span>
            <div>
              <span className="block text-[18px] sm:text-[22px] font-bold text-foreground" style={{ fontFamily: "var(--font-mono, monospace)" }}>{stat.number}</span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.06em] text-muted-foreground">{stat.label}</span>
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Feature Highlight Cards ─────────────── */
const FEATURES = [
  {
    icon: SearchIcon,
    title: "AI Commands",
    desc: "5,635 copy-ready slash prompts",
    to: "/search",
  },
  {
    icon: Zap,
    title: "Founder Tools",
    desc: "25 AI-powered generators",
    to: "/generators",
  },
  {
    icon: Radio,
    title: "Live Dashboard",
    desc: "Markets, news, weather & more",
    to: "/live",
  },
  {
    icon: Compass,
    title: "Free Resources",
    desc: "317+ curated tools & APIs",
    to: "/discover",
  },
] as const;

function FeatureHighlights() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FEATURES.map((f) => (
        <Link
          key={f.title}
          to={f.to}
          className="group panel relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
        >
          <f.icon className="size-6 text-primary" aria-hidden />
          <h3 className="mt-3 text-sm font-bold text-foreground group-hover:text-primary">
            {f.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
          <ArrowRight className="absolute right-3 bottom-3 size-4 text-muted-foreground opacity-0 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>
      ))}
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
      { title: `SlashAI — find the right AI command in seconds` },
      {
        name: "description",
        content: `A calm, searchable library of ${VERIFIED_TOTAL} AI slash commands. Search by what you want to accomplish, save favourites and work offline.`,
      },
      { property: "og:title", content: "SlashAI — AI slash command library" },
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

function HomePage() {
  const { hydrated, favorites, recents, settings } = useLibrary();


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
  const showOnboarding = hydrated && !settings.onboarded;

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
      {showOnboarding && <Onboarding />}

      {/* ─── Live Ticker ─── */}
      <LiveTicker />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-surface border border-sidebar-border p-6 pt-8 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: text */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-primary">
              YOUR AI COMMAND VAULT — FREE FOREVER
            </span>
            <h1 className="mt-4 text-[32px] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[36px]">
              Find the right AI command
              <br />
              <span className="text-primary">in seconds</span>
            </h1>
            <p className="mt-3 text-[14px] text-muted-foreground">
              {VERIFIED_TOTAL.toLocaleString()} commands · {RESOURCE_TOTAL} curated resources · Free forever
            </p>

            {/* Search bar */}
            <form
              className="mt-5 flex h-[48px] max-w-[460px] items-center gap-3 rounded-[8px] border border-sidebar-border bg-surface px-4 transition-colors focus-within:border-primary"
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q") as string;
                if (q?.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
              }}
            >
              <SearchIcon className="size-[16px] shrink-0 text-muted-foreground" aria-hidden />
              <input
                name="q"
                type="text"
                placeholder="Search commands, tools, topics..."
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
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
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-sidebar-border bg-surface px-3.5 py-1.5 text-[12px] text-muted-foreground transition-all duration-150 hover:border-[rgba(45,212,191,0.3)] hover:text-foreground"
              >
                More ↓
              </button>
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

      {/* ─── Feature Highlights ─── */}
      <FeatureHighlights />

      {/* ─── Explore more ─── */}
      <section className="mt-10">
        <h2 className="text-[22px] font-semibold text-foreground">Explore more</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { to: "/assistant", emoji: "🤖", title: "AI Assistant", desc: "Free providers available", bg: "linear-gradient(135deg, #1a1f2e, #0f1929)" },
            { to: "/generators", emoji: "⚡", title: "Generators", desc: "25 AI tools", bg: "linear-gradient(135deg, #1a1f14, #0f1a0a)" },
            { to: "/roadmaps", emoji: "🗺️", title: "Roadmaps", desc: "20 guides", bg: "linear-gradient(135deg, #1a1428, #0f0a1a)" },
            { to: "/live", emoji: "📡", title: "Live", desc: "Markets & more", bg: "linear-gradient(135deg, #1a1a14, #1a0f0a)", badge: "Hot" },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative flex flex-col justify-end rounded-[12px] border border-sidebar-border p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border min-h-[140px]"
              style={{ background: card.bg }}
            >
              {card.badge && (
                <span className="absolute top-3 right-3 rounded-full bg-[#f85149] px-2 py-0.5 text-[10px] font-bold text-white">
                  {card.badge}
                </span>
              )}
              <span className="text-[36px]">{card.emoji}</span>
              <span className="mt-2 block text-[16px] font-bold text-foreground">{card.title}</span>
              <span className="mt-0.5 block text-[12px] text-muted-foreground">{card.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section
        title="Command of the day"
        hint="One fresh pick a day, plus a reroll whenever you want one."
      >
        <Discover />
      </Section>

      <YourWeekDigest />

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
                  <span className="block truncate text-sm font-semibold text-foreground">{tool.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{tool.description}</span>
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
        hint="Curated starting points — every collection is open to everyone."
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
        <Link
          to="/tools"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          See all 22 tools <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <Section title="Hubs" hint="Everything gathered for one kind of person.">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {([
            { to: "/hub/students", emoji: "\u{1F393}", title: "Student Hub", desc: "Courses & tools" },
            { to: "/hub/developers", emoji: "\u{1F4BB}", title: "Developer Hub", desc: "APIs & open-source" },
            { to: "/hub/creators", emoji: "\u{1F3A8}", title: "Creator Hub", desc: "Design & content" },
            { to: "/hub/professionals", emoji: "\u{1F4BC}", title: "Professional Hub", desc: "Productivity" },
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

      {/* ─── Stay in the loop ─── */}
      <section className="mt-10 overflow-hidden rounded-[12px] border border-sidebar-border bg-surface">
        <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h2 className="text-[24px] font-bold text-foreground">Stay in the loop</h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Get the best AI commands, tools & resources straight to your inbox.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 flex-1 rounded-[6px] border border-sidebar-border bg-background px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="button"
                className="h-10 rounded-[6px] bg-primary px-5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <span style={{ fontSize: "80px", filter: "drop-shadow(0 0 30px rgba(45,212,191,0.3))", animation: "float 4s ease-in-out infinite" }}>📬</span>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mt-12 border-t border-sidebar-border py-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-[12px] text-muted-foreground">© 2024 SlashAI. All rights reserved.</p>
          <div className="flex gap-4">
            {["About", "Privacy", "Terms", "Contact"].map((link) => (
              <Link key={link} to="/about" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/wahmed178/slashAI" target="_blank" rel="noopener" className="text-[18px] text-muted-foreground hover:text-foreground transition-colors">
              🐙
            </a>
          </div>
        </div>
      </footer>


    </AppShell>
  );
}
