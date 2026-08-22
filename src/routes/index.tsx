import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Star,
  History,
  Flame,
  Compass,
  Radar as RadarIcon,
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
        content: `Search ${VERIFIED_TOTAL} copy-ready AI slash commands by task, category or collection.`,
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
    <section className="mt-9">
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
    <div className="grid gap-2 sm:grid-cols-2">
      {commands.map((c) => {
        const Icon = categoryIcon(CATEGORY_ICONS[c.category]);
        return (
          <Link
            key={c.id}
            to="/c/$slug"
            params={{ slug: c.id }}
            className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface px-3 transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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

      <section className="pt-3 pb-1">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {greeting()}
          {name ? `, ${name}` : ""}
          {hydrated && streak.count > 1 && (
            <span className="flex items-center gap-1 text-primary">
              <Flame className="size-3.5" aria-hidden /> {streak.count}-day streak
            </span>
          )}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          What are you working on?
        </h1>
        <div className="mt-4 flex">
          <SearchBox size="lg" placeholder="Describe the task, or type a command…" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {VERIFIED_TOTAL.toLocaleString()} commands · {RESOURCE_TOTAL} curated resources · press{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono">/</kbd> anywhere to
          search
        </p>
      </section>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
        <Link
          to="/whats-new"
          className="panel flex items-center gap-2.5 rounded-xl p-3.5 transition-colors hover:border-primary/50"
        >
          <Sparkles className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">What&apos;s new</span>
            <span className="block truncate text-xs text-muted-foreground">
              This week&apos;s free finds
            </span>
          </span>
        </Link>
        <Link
          to="/radar"
          className="panel flex items-center gap-2.5 rounded-xl p-3.5 transition-colors hover:border-primary/50"
        >
          <RadarIcon className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Free Radar</span>
            <span className="block truncate text-xs text-muted-foreground">
              Offers with the conditions stated
            </span>
          </span>
        </Link>
        <Link
          to="/discover"
          className="panel flex items-center gap-2.5 rounded-xl p-3.5 transition-colors hover:border-primary/50"
        >
          <Compass className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Discover</span>
            <span className="block truncate text-xs text-muted-foreground">
              Tools, GitHub, learning
            </span>
          </span>
        </Link>
      </div>

      <>
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
            ].map(([id, title, blurb]) => (
              <Link
                key={id}
                to="/hub/$audience"
                params={{ audience: id! }}
                className="panel flex min-h-16 items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </>

      <p className="mt-10 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden /> Everything is stored on this device — no
        account, works offline.
      </p>
    </AppShell>
  );
}
