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
import { personaGreetingName } from "@/lib/personas";
import { GLOSSARY_TOTAL } from "@/lib/glossary";

/* ─────────────── animated counter hook ─────────────── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(      ([entry]) => {
          if (!entry?.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { value, ref };
}

/* ─────────────── Stats Bar ─────────────── */
function StatsBar() {
  const cmds = useCountUp(VERIFIED_TOTAL);
  const resources = useCountUp(RESOURCE_TOTAL);
  const generators = useCountUp(25);
  const roadmaps = useCountUp(20);
  const terms = useCountUp(GLOSSARY_TOTAL);

  const stats = [
    { label: "Commands", ...cmds },
    { label: "Resources", ...resources },
    { label: "Generators", ...generators },
    { label: "Roadmaps", ...roadmaps },
    { label: "Glossary", ...terms },
  ];

  return (
    <div ref={cmds.ref} className="mt-8 grid grid-cols-5 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="stat-card rounded-xl bg-surface p-3 text-center">
          <span ref={s.ref} className="block text-xl font-black text-primary sm:text-2xl">
            {s.value.toLocaleString()}
          </span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">{s.label}</span>
        </div>
      ))}
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
          className="group panel relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50"
        >
          <f.icon className="size-6 text-primary" aria-hidden />
          <h3 className="mt-3 text-sm font-bold text-foreground group-hover:text-primary">
            {f.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
          <ArrowRight className="absolute right-3 bottom-3 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
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
        <Link
          to="/glossary"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          Learn a term <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      {allZero ? (
        <p className="mt-3 text-center text-[13px] text-muted-foreground">
          Start by copying a command — your stats appear here.
        </p>
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
      <div className="mt-3 flex flex-wrap gap-2">
        {([
          ["/roadmaps", "Founder roadmaps"],
          ["/generators", "Founder tools"],
          ["/live", "Live dashboard"],
          ["/quiz", "Daily Quiz"],
        ] as const).map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="min-h-9 rounded-full border border-border bg-surface px-3 text-sm leading-9 text-muted-foreground transition-colors hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Intent chips ─────────────── */
const INTENTS = [
  { label: "Write something", q: "write draft", emoji: "\u{270D}\u{FE0F}" },
  { label: "Study or revise", q: "study explain", emoji: "\u{1F4DA}" },
  { label: "Write or fix code", q: "code debug", emoji: "\u{1F4BB}" },
  { label: "Work with an image", q: "image edit", emoji: "\u{1F5BC}\u{FE0F}" },
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
    <section className="mt-9 animate-fade-in-up">
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold tracking-tight text-foreground">{title}</h2>
          {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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

  const quickCategories = useMemo(
    () => [...CATEGORY_TREE].sort((a, b) => b.count - a.count).slice(0, 6),
    [],
  );

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
  const name = personaGreetingName(settings.persona);
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
      <section className="relative overflow-hidden rounded-2xl bg-surface p-6 pt-8 sm:p-8 hero-dots">
        <div className="relative z-10">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {greeting()}
            {name ? `, ${name}` : ""}
            {hydrated && streak.count > 1 && (
              <span className="flex items-center gap-1 text-primary">
                <Flame className="size-3.5" aria-hidden /> {streak.count}-day streak
              </span>
            )}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Find the right AI command
            <br />
            <span className="text-primary">in seconds</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {VERIFIED_TOTAL.toLocaleString()} commands · {RESOURCE_TOTAL} curated resources · free forever
          </p>
          <div className="mt-5 flex search-glow rounded-xl">
            <SearchBox size="lg" placeholder="Describe the task, or type a command…" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press <kbd className="rounded border border-border bg-muted px-1 font-mono">/</kbd> anywhere to search
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
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-[13px] text-foreground transition-all duration-150 hover:border-primary/60 hover:text-white"
            >
              <span className="text-[14px]" aria-hidden>{intent.emoji}</span>
              {intent.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Quick Links Grid (icon cards) ─── */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
        {([
          ["/assistant", "\u{1F916}", "Assistant", "Workflows"],
          ["/find", "\u{1F50D}", "Search", "Advanced"],
          ["/generators", "\u{26A1}", "Generators", "25 AI tools"],
          ["/roadmaps", "\u{1F5FA}\u{FE0F}", "Roadmaps", "20 guides"],
          ["/live", "\u{1F4E1}", "Live", "News & scores"],
          ["/glossary", "\u{1F4D6}", "Glossary", `${GLOSSARY_TOTAL}+ terms`],
          ["/tools", "\u{1F527}", "Tools", "22 free browser utilities"],
          ["/quiz", "\u{1F9E0}", "Quiz", "Daily brain challenge"],
          ["/discover", "\u{1F9ED}", "Discover", "Tools & APIs"],
        ] as const).map(([to, emoji, label, sub]) => (
          <Link
            key={to}
            to={to as string}
            className="group flex flex-col items-center rounded-[10px] border border-border bg-surface p-3.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
          >
            <span className="text-[24px]" aria-hidden>{emoji}</span>
            <span className="mt-2 block text-[13px] font-semibold text-foreground group-hover:text-primary">{label}</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">{sub}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {quickCategories.map((c) => {
          const Icon = categoryIcon(c.icon);
          return (
            <Link
              key={c.category}
              to="/explore/$category"
              params={{ category: c.category }}
              className="flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{c.category}</span>
            </Link>
          );
        })}
        <Link
          to="/explore"
          className="flex min-h-10 items-center gap-1.5 rounded-full border border-primary/40 bg-accent px-3.5 text-sm font-medium text-foreground"
        >
          All categories <ArrowRight className="size-4" aria-hidden />
        </Link>
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
          {COLLECTIONS.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to="/collections/$id"
              params={{ id: c.id }}
              className="flex shrink-0 flex-col items-center rounded-[10px] border border-border bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 sm:w-[calc(33.333%-7px)]"
            >
              <span className="text-[28px]">{c.icon}</span>
              <span className="mt-2 block text-[14px] font-semibold text-foreground">{c.title}</span>
              <span className="mt-0.5 block text-[12px] text-muted-foreground">{c.count} commands</span>
            </Link>
          ))}
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {([
            { to: "/tools/image-compress", emoji: "\u{1F5BC}\u{FE0F}", title: "Image Compressor", desc: "Reduce image size" },
            { to: "/tools/sip-calculator", emoji: "\u{1F4B0}", title: "SIP Calculator", desc: "Mutual fund returns" },
            { to: "/tools/gst-calculator", emoji: "\u{1F9FE}", title: "GST Calculator", desc: "Add/remove GST" },
            { to: "/tools/world-clock", emoji: "\u{1F30D}", title: "World Clock", desc: "12 cities live" },
            { to: "/tools/pomodoro", emoji: "\u{1F345}", title: "Pomodoro Timer", desc: "25/5/15 focus" },
            { to: "/tools/flip-clock", emoji: "\u{23F1}\u{FE0F}", title: "Flip Clock", desc: "Full-screen retro" },
            { to: "/tools/csv-to-json", emoji: "\u{1F4CA}", title: "CSV \u2194 JSON", desc: "Bi-directional" },
            { to: "/tools/new-tab", emoji: "\u{1F3E0}", title: "New Tab", desc: "Beautiful homepage" },
          ]).map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex items-center gap-3 rounded-[10px] border border-[#30363d] bg-[#161b22] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#21262d] text-[22px]" aria-hidden>{tool.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-[#e6edf3]">{tool.title}</span>
                <span className="block text-[11px] text-[#8b949e] truncate">{tool.desc}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-[#8b949e] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[#e6edf3]" aria-hidden />
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
            { to: "/hub/islam", emoji: "\u262A\uFE0F", title: "Islam Hub", desc: "Quran, Hadith & learning" },
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
