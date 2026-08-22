import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Star, History, Check, Flame, LayoutList, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { SearchBox } from "@/components/library/SearchBox";
import { Discover } from "@/components/library/Discover";
import { Onboarding } from "@/components/library/Onboarding";
import { HomeFeed } from "@/components/library/HomeFeed";
import { categoryIcon } from "@/components/library/icons";
import { useLibrary } from "@/hooks/use-library";
import {
  CATEGORY_ICONS,
  CATEGORY_TREE,
  VERIFIED_TOTAL,
  getCommand,
  type SlashCommand,
} from "@/lib/commands";
import { COLLECTIONS, INTERESTS, recommendedCommands } from "@/lib/collections";
import { personaGreetingName } from "@/lib/personas";
import { cn } from "@/lib/utils";

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

function InterestsPrompt() {
  const { settings, updateSettings } = useLibrary();
  const [picked, setPicked] = useState<string[]>(settings.interests);

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="panel mt-8 rounded-2xl p-4">
      <h2 className="text-base font-bold text-foreground">What are you interested in?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Optional, stored only on this device. It shapes what shows up under “For you”.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {INTERESTS.map((i) => {
          const on = picked.includes(i.id);
          return (
            <button
              key={i.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(i.id)}
              className={cn(
                "flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
                on
                  ? "border-primary bg-accent text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {on && <Check className="size-3.5" aria-hidden />}
              {i.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => updateSettings({ interests: picked, onboarded: true })}>
          Save
        </Button>
        <Button variant="ghost" onClick={() => updateSettings({ onboarded: true })}>
          Skip
        </Button>
      </div>
    </section>
  );
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
    () =>
      hydrated ? recommendedCommands(settings.interests, recents, favorites, 4) : [],
    [hydrated, settings.interests, recents, favorites],
  );

  const { updateSettings, streak } = useLibrary();
  const showOnboarding = hydrated && !settings.onboarded;
  const name = personaGreetingName(settings.persona);
  const feed = settings.homeMode === "feed";

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
          {VERIFIED_TOTAL.toLocaleString()} commands · press{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono">/</kbd> anywhere to
          search
        </p>
      </section>

      <div
        role="tablist"
        aria-label="Home layout"
        className="mt-5 inline-flex rounded-xl border border-border bg-surface p-1"
      >
        {(
          [
            { id: "calm", label: "Calm", icon: LayoutList },
            { id: "feed", label: "Feed", icon: Rows3 },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={settings.homeMode === m.id}
            onClick={() => updateSettings({ homeMode: m.id })}
            className={cn(
              "flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors",
              settings.homeMode === m.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <m.icon className="size-4" aria-hidden /> {m.label}
          </button>
        ))}
      </div>

      {feed && <div className="mt-3"><HomeFeed /></div>}
      {!feed && (
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

      

      <Section title="Discover" hint="One fresh pick a day, plus a reroll whenever you want one.">
        <Discover />
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

      <p className="mt-10 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden /> Everything is stored on this device — no
        account, works offline.
      </p>
    </AppShell>
  );
}
