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
      <div className="mt-3 flex flex-wrap gap-2">
        {([
          ["/roadmaps", "Founder roadmaps"],
          ["/generators", "Founder tools"],
          ["/live", "Live dashboard"],
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
  { label: "Write something", q: "write draft", icon: PenLine },
  { label: "Study or revise", q: "study explain", icon: GraduationCap },
  { label: "Write or fix code", q: "code debug", icon: Code2 },
  { label: "Work with an image", q: "image edit", icon: ImageIcon },
  { label: "Handle a document", q: "document summarize", icon: FileText },
  { label: "Do research", q: "research sources", icon: SearchIcon },
  { label: "Get work done", q: "email plan meeting", icon: Briefcase },
  { label: "Make something creative", q: "creative idea", icon: Wand2 },
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

  return (
    <AppShell hideHeaderSearch title="SlashAI">
      {showOnboarding && <Onboarding />}

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
        <div className="mt-2.5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {INTENTS.map((intent) => (
            <Link
              key={intent.label}
              to="/search"
              search={{ q: intent.q }}
              className="panel flex items-center gap-2.5 rounded-xl p-3 transition-colors hover:border-primary/50"
            >
              <intent.icon className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate text-sm font-medium text-foreground">{intent.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Quick Links Grid ─── */}
      <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
        <Link to="/assistant" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Bot className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Assistant</span>
            <span className="block truncate text-xs text-muted-foreground">Workflows and tasks</span>
          </span>
        </Link>
        <Link to="/find" search={{ q: "" }} className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Wand2 className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Advanced search</span>
            <span className="block truncate text-xs text-muted-foreground">Keywords to shortlist</span>
          </span>
        </Link>
        <Link to="/generators" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Zap className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Generators</span>
            <span className="block truncate text-xs text-muted-foreground">25 AI-powered tools</span>
          </span>
        </Link>
        <Link to="/roadmaps" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Map className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Roadmaps</span>
            <span className="block truncate text-xs text-muted-foreground">20 visual guides</span>
          </span>
        </Link>
        <Link to="/live" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Radio className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Live</span>
            <span className="block truncate text-xs text-muted-foreground">News, weather, scores</span>
          </span>
        </Link>
        <Link to="/glossary" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <BookOpen className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Glossary</span>
            <span className="block truncate text-xs text-muted-foreground">{GLOSSARY_TOTAL}+ terms explained</span>
          </span>
        </Link>
        <Link to="/movies" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Film className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Movies</span>
            <span className="block truncate text-xs text-muted-foreground">Regional film finder</span>
          </span>
        </Link>
        <Link to="/youtube" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Youtube className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">YouTube & Music</span>
            <span className="block truncate text-xs text-muted-foreground">Search and play</span>
          </span>
        </Link>
        <Link to="/discover" className="panel lift flex items-center gap-2.5 rounded-xl p-3.5">
          <Globe className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Discover</span>
            <span className="block truncate text-xs text-muted-foreground">Tools, GitHub, learning</span>
          </span>
        </Link>
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
        hint="Hand-picked, with a last-checked date on every entry."
        action={
          <Link
            to="/whats-new"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <ResourceGrid resources={weeklyFinds} />
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
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.slice(0, 6).map((c) => {
            const Icon = categoryIcon(c.icon);
            return (
              <Link
                key={c.id}
                to="/collections/$id"
                params={{ id: c.id }}
                className="panel flex min-h-16 items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {c.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.count} commands
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="Hubs" hint="Everything gathered for one kind of person.">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["students", "Student Hub", "Free software, study tools and student offers"],
            ["professionals", "Professional Hub", "Work, writing, planning and research"],
            ["developers", "Developer Hub", "APIs, editors and open-source picks"],
            ["creators", "Creator Hub", "Capture, edit and design without watermarks"],
            ["founders", "Founders Hub", "Idea to first paying customer"],
            ["india", "India Hub", "Free tools, courses and resources for Indian builders"],
            ["finance", "Finance Hub", "Free tools for investors and traders"],
            ["designers", "Designers Hub", "Free design tools, assets and learning"],
            ["health", "Health Hub", "Evidence-based tools for fitness and wellbeing"],
          ].map(([id, title, blurb]) => (
            <Link
              key={id}
              to="/hub/$audience"
              params={{ audience: id! }}
              className="panel flex min-h-16 items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/50"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
                <span className="block truncate text-xs text-muted-foreground">{blurb}</span>
              </span>
            </Link>
          ))}
        </div>
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

      {/* ─── Bottom Tab Bar (mobile) ─── */}
      <nav className="bottom-tab-bar md:hidden" aria-label="Main navigation">
        <Link to="/" activeProps={{ "data-active": "true" }} className="[&[data-active='true']]:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Home
        </Link>
        <Link to="/search" activeProps={{ "data-active": "true" }}>
          <SearchIcon className="size-5" />
          Search
        </Link>
        <Link to="/discover" activeProps={{ "data-active": "true" }}>
          <Compass className="size-5" />
          Discover
        </Link>
        <Link to="/favorites" activeProps={{ "data-active": "true" }}>
          <Star className="size-5" />
          Saved
        </Link>
      </nav>
    </AppShell>
  );
}
