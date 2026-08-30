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
import { GLOSSARY_TOTAL } from "@/lib/glossary";

/* ─────────────── Stats Bar (static — cannot fail) ─────────────── */
function StatsBar() {
  const stats = [
    { number: "5,635", label: "Commands" },
    { number: "319", label: "Resources" },
    { number: "25", label: "Generators" },
    { number: "20", label: "Roadmaps" },
    { number: "138", label: "Glossary" },
  ];
  return (
    <div className="overflow-x-auto scrollbar-none" style={{ borderTop: "1px solid #30363d", borderBottom: "1px solid #30363d", margin: "24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "16px 0", minWidth: "min-content" }}>
        {stats.map((stat, i) => (
          <span key={stat.label} style={{ display: "contents" }}>
            {i > 0 && <div style={{ width: "1px", height: "28px", background: "#30363d", flexShrink: 0 }} />}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
              <span className="text-[16px] sm:text-[22px]" style={{ fontWeight: "700", color: "#e6edf3", fontFamily: "var(--font-mono, monospace)", lineHeight: 1 }}>{stat.number}</span>
              <span className="text-[9px] sm:text-[11px]" style={{ color: "#8b949e", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
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
        <div className="mt-3 rounded-[10px] border border-[#30363d] bg-[#161b22] p-5 text-center">
          <div className="text-[32px]">⚡</div>
          <p className="mt-2 text-[15px] font-semibold text-[#e6edf3]">Your stats appear here</p>
          <p className="mt-1 text-[13px] text-[#8b949e]">Copy a command to start your streak</p>
          <Link to="/search" className="mt-3 inline-block rounded-[6px] border border-[#30363d] bg-[#21262d] px-5 py-2 text-[13px] text-[#58a6ff] no-underline transition-colors hover:border-[#484f58]">
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

/* ─────────────── Intent chips ─────────────── */
const INTENTS = [
  { label: "Write something", q: "write draft", emoji: "\u{270D}\u{FE0F}" },
  { label: "Write or fix code", q: "code debug", emoji: "\u{1F4BB}" },
  { label: "Handle a document", q: "document summarize", emoji: "\u{1F4C4}" },
  { label: "Do research", q: "research sources", emoji: "\u{1F50D}" },
  { label: "Get work done", q: "email plan meeting", emoji: "\u{1F4BC}" },
  { label: "Make something creative", q: "creative idea", emoji: "\u{1F3A8}" },
] as const;

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
          <span className="inline-block h-[18px] w-[3px] shrink-0 rounded-[2px] bg-[#58a6ff]" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-[#e6edf3]">{title}</h2>
            {hint && <p className="mt-0.5 truncate text-xs text-[#8b949e]">{hint}</p>}
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
      <section
        className="relative overflow-hidden rounded-2xl bg-surface p-6 pt-8 sm:p-8 hero-dots"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(88,166,255,0.04) 0%, transparent 70%), var(--color-surface, #161b22)' }}
      >
        <div className="relative z-10">
          <p className="text-center text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
            Your AI command vault — free forever
          </p>
          <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Find the right AI command
            <br />
            <span className="text-primary">in seconds</span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {VERIFIED_TOTAL.toLocaleString()} commands · {RESOURCE_TOTAL} curated resources · free forever
          </p>

          {/* Search bar */}
          <form
            className="mx-auto mt-5 flex h-[52px] max-w-[560px] items-center gap-3 rounded-[10px] border border-border bg-surface px-4 transition-colors focus-within:border-[#58a6ff]"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q") as string;
              if (q?.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
            }}
          >
            <SearchIcon className="size-[18px] shrink-0 text-muted-foreground" aria-hidden />
            <input
              name="q"
              type="text"
              placeholder="Search 5,635 commands..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </form>

          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            Press <kbd className="inline-flex h-5 min-w-[24px] items-center justify-center rounded border border-border border-b-2 border-b-[#484f58] bg-[#21262d] px-1.5 font-mono text-[12px] text-muted-foreground">/</kbd> anywhere to search
          </p>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <StatsBar />

      {/* ─── Feature Highlights ─── */}
      <FeatureHighlights />

      {/* ─── I want to… ─── */}
      <section className="mt-8">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          I want to…
        </h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {INTENTS.map((intent) => (
            <Link
              key={intent.label}
              to="/search"
              search={{ q: intent.q }}
              className="flex min-h-[44px] items-center gap-1.5 rounded-[20px] border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-[13px] text-[#e6edf3] transition-all duration-150 hover:border-[#484f58] hover:bg-[#21262d]"
            >
              <span className="text-[14px]" aria-hidden>{intent.emoji}</span>
              {intent.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Quick Links Grid (icon cards) ─── */}
      <div className="mt-6 grid grid-cols-4 items-stretch gap-2.5">
        {([
          ["/assistant", "\u{1F916}", "AI Assistant", "OpenRouter powered"],
          ["/generators", "\u{26A1}", "Generators", "25 AI tools"],
          ["/roadmaps", "\u{1F5FA}\u{FE0F}", "Roadmaps", "20 guides"],
          ["/live", "\u{1F4E1}", "Live", "Markets & more"],
          ["/glossary", "\u{1F4D6}", "Glossary", `${GLOSSARY_TOTAL}+ terms`],
          ["/quiz", "\u{1F9E0}", "Quiz", "Daily challenge"],
          ["/deals", "\u{1F6CD}\u{FE0F}", "Deals", "Daily deals"],
          ["/discover", "\u{1F9ED}", "Discover", "Tools & APIs"],
        ] as const).map(([to, emoji, label, sub]) => (
          <Link
            key={to}
            to={to as string}
            className="group flex flex-col items-center justify-center rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
          >
            <span className="text-[26px]" aria-hidden>{emoji}</span>
            <span className="mt-2 block text-[13px] font-semibold text-[#e6edf3] group-hover:text-[#58a6ff]">{label}</span>
            <span className="mt-0.5 block text-[11px] text-[#8b949e]">{sub}</span>
          </Link>
        ))}
      </div>



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
            const iconMap: Record<string, string> = { "For Women": "👩", "For Men": "👨", "For Students": "🎓", "For Creators": "🎨", "For Professionals": "💼", "For Entrepreneurs": "🚀" };
            return (
              <Link
                key={c.id}
                to="/collections/$id"
                params={{ id: c.id }}
                className="flex shrink-0 flex-col items-center rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58] sm:w-[calc(33.333%-7px)]"
              >
                <span className="text-[28px]">{iconMap[c.title] || c.icon}</span>
                <span className="mt-2 block text-[14px] font-semibold text-[#e6edf3]">{c.title}</span>
                <span className="mt-0.5 block text-[12px] text-[#8b949e]">{c.count} commands</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ─── SlashAI Tools (Free) ─── */}
      <Section
        title="SlashKits"
        hint="22 free browser tools — calculators, converters, screensavers. Runs in-browser. No upload."
        action={
          <Link
            to="/tools"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All tools <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {([
            { to: "/tools/image-compress", emoji: "\u{1F5BC}\u{FE0F}", title: "Image Compressor", desc: "Reduce image size" },
            { to: "/tools/sip-calculator", emoji: "\u{1F4B0}", title: "SIP Calculator", desc: "Mutual fund returns" },
            { to: "/tools/gst-calculator", emoji: "\u{1F9FE}", title: "GST Calculator", desc: "Add/remove GST" },
            { to: "/tools/world-clock", emoji: "\u{1F30D}", title: "World Clock", desc: "12 cities live" },
            { to: "/tools/pomodoro", emoji: "\u{1F345}", title: "Pomodoro Timer", desc: "25/5/15 focus" },
            { to: "/tools/flip-clock", emoji: "\u{23F1}\u{FE0F}", title: "Flip Clock", desc: "Full-screen retro" },
            { to: "/tools/csv-to-json", emoji: "\u{1F4CA}", title: "CSV ↔ JSON", desc: "Bi-directional" },
            { to: "/tools/new-tab", emoji: "\u{1F3E0}", title: "New Tab", desc: "Beautiful homepage" },
          ]).map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex flex-col items-center justify-center rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
            >
              <span className="text-[24px]" aria-hidden>{tool.emoji}</span>
              <span className="mt-2 block text-[14px] font-semibold text-[#e6edf3]">{tool.title}</span>
              <span className="mt-0.5 block text-[12px] text-[#8b949e]">{tool.desc}</span>
            </Link>
          ))}
        </div>
        <Link
          to="/tools"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
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
              className="group flex items-center gap-3 rounded-[10px] border border-[#30363d] bg-[#161b22] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#21262d] text-[22px]" aria-hidden>{hub.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-[#e6edf3]">{hub.title}</span>
                <span className="block text-[11px] text-[#8b949e] truncate">{hub.desc}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-[#8b949e] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[#e6edf3]" aria-hidden />
            </Link>
          ))}
        </div>
        <Link
          to="/hub"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
        >
          See all hubs <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="mt-12 border-t border-border pt-6 pb-24 md:pb-6">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link to="/search" className="text-muted-foreground hover:text-foreground">Commands</Link></li>
              <li><Link to="/discover" className="text-muted-foreground hover:text-foreground">Discover</Link></li>
              <li><Link to="/generators" className="text-muted-foreground hover:text-foreground">Generators</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-foreground">SlashKits</Link></li>
              <li><Link to="/roadmaps" className="text-muted-foreground hover:text-foreground">Roadmaps</Link></li>
              <li><Link to="/glossary" className="text-muted-foreground hover:text-foreground">Glossary</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link to="/live" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link to="/journal" className="text-muted-foreground hover:text-foreground">Journal</Link></li>
              <li><Link to="/collections" className="text-muted-foreground hover:text-foreground">Collections</Link></li>
              <li><Link to="/favorites" className="text-muted-foreground hover:text-foreground">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Learn</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link to="/explore" className="text-muted-foreground hover:text-foreground">Explore</Link></li>
              <li><Link to="/hub/$audience" params={{ audience: "students" }} className="text-muted-foreground hover:text-foreground">Student Hub</Link></li>
              <li><Link to="/hub/$audience" params={{ audience: "developers" }} className="text-muted-foreground hover:text-foreground">Developer Hub</Link></li>
              <li><Link to="/hub/$audience" params={{ audience: "founders" }} className="text-muted-foreground hover:text-foreground">Founders Hub</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Info</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/whats-new" className="text-muted-foreground hover:text-foreground">What's New</Link></li>
              <li><Link to="/settings" className="text-muted-foreground hover:text-foreground">Settings</Link></li>
              <li><a href="https://github.com/wahmed178/slashAI" target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground">GitHub</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Built with ❤️ — free forever, no account needed. Everything stays on this device.
        </p>
      </footer>


    </AppShell>
  );
}
