import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Flame,
  Heart,
  History,
  Info,
  Moon,
  MoonStar,
  Settings as SettingsIcon,
  Sun,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { useLibrary, type Theme } from "@/hooks/use-library";
import { INTERESTS } from "@/lib/collections";
import { PERSONAS, getPersona } from "@/lib/personas";
import { getCommand, type SlashCommand } from "@/lib/commands";
import { streakMessage } from "@/lib/engagement";
import { APP_DETAILS } from "@/lib/app-meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Your profile — SlashAI" },
      {
        name: "description",
        content:
          "Your persona, interests, streak, saved commands and appearance — all stored on this device.",
      },
      { property: "og:title", content: "Your SlashAI profile" },
      {
        property: "og:description",
        content: "Personalise SlashAI: persona, interests, theme and saved commands.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MePage,
});

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "amoled", label: "AMOLED", icon: MoonStar },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MePage() {
  const {
    hydrated,
    settings,
    updateSettings,
    favorites,
    recents,
    streak,
    stats,
    clearAllData,
  } = useLibrary();
  const [editingPersona, setEditingPersona] = useState(false);

  const persona = getPersona(settings.persona);
  const resolve = (ids: string[]) =>
    ids
      .slice(0, 6)
      .map((id) => getCommand(id))
      .filter((c): c is SlashCommand => Boolean(c));

  const saved = resolve(favorites);
  const recent = resolve(recents);

  const toggleInterest = (id: string) =>
    updateSettings({
      interests: settings.interests.includes(id)
        ? settings.interests.filter((x) => x !== id)
        : [...settings.interests, id],
    });

  return (
    <AppShell hideHeaderSearch title="Me" wide>
      <header className="flex items-center gap-3 pt-2">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl">
          {persona ? persona.emoji : <UserRound className="size-6 text-primary" aria-hidden />}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {persona ? persona.label : "Your profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {hydrated ? `${favorites.length} saved · ${stats.copies} copied` : "\u00a0"}
          </p>
        </div>
      </header>

      {hydrated && streak.count > 0 && (
        <div className="panel mt-5 flex items-center gap-3 rounded-2xl p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Flame className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Day {streak.count} streak {streak.count >= 3 && "🔥"}
            </p>
            <p className="text-xs text-muted-foreground">
              {streakMessage(streak.count)} Best: {streak.best} day
              {streak.best === 1 ? "" : "s"}.
            </p>
          </div>
        </div>
      )}

      <Section title="Your persona">
        {persona && !editingPersona ? (
          <div className="panel flex items-center gap-3 rounded-xl p-3">
            <span className="text-xl">{persona.emoji}</span>
            <p className="min-w-0 flex-1 text-sm text-muted-foreground">{persona.pitch}</p>
            <Button variant="ghost" size="sm" onClick={() => setEditingPersona(true)}>
              Change
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PERSONAS.map((p) => {
              const on = settings.persona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    updateSettings({ persona: on ? "" : p.id });
                    setEditingPersona(false);
                  }}
                  className={cn(
                    "flex min-h-14 items-center gap-2 rounded-xl border px-3 text-left text-sm transition-colors",
                    on
                      ? "border-primary bg-accent text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="text-lg" aria-hidden>
                    {p.emoji}
                  </span>
                  <span className="min-w-0">{p.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Your interests">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = settings.interests.includes(i.id);
            return (
              <button
                key={i.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleInterest(i.id)}
                className={cn(
                  "flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
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
      </Section>

      <Section title="Appearance">
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={settings.theme === t.id}
              onClick={() => updateSettings({ theme: t.id })}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm transition-colors",
                settings.theme === t.id
                  ? "border-primary bg-accent text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-4" aria-hidden />
              {t.label}
            </button>
          ))}
          <Button asChild variant="ghost" className="gap-1.5">
            <Link to="/settings">
              <SettingsIcon className="size-4" /> More settings
            </Link>
          </Button>
        </div>
      </Section>

      <Section title="Saved commands">
        {saved.length > 0 ? (
          <>
            <CommandGrid commands={saved} />
            <Button asChild variant="ghost" size="sm" className="mt-2 gap-1.5">
              <Link to="/favorites">
                <Heart className="size-3.5" /> All {favorites.length} saved
              </Link>
            </Button>
          </>
        ) : (
          <EmptyState
            title="Nothing saved yet"
            hint="Tap the heart on any command to keep it here."
            action={
              <Button asChild>
                <Link to="/explore">Explore commands</Link>
              </Button>
            }
          />
        )}
      </Section>

      {recent.length > 0 && (
        <Section title="Recent">
          <CommandGrid commands={recent} />
          <Button asChild variant="ghost" size="sm" className="mt-2 gap-1.5">
            <Link to="/recent">
              <History className="size-3.5" /> Full history
            </Link>
          </Button>
        </Section>
      )}

      <Section title="Language">
        <p className="panel rounded-xl p-3 text-sm text-muted-foreground">
          SlashAI is English-only today. Hindi and Urdu are planned — the commands themselves work
          in any language: add “reply in Hindi” to any prompt.
        </p>
      </Section>

      <Section title="Data">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="gap-1.5">
            <Link to="/settings">Backup &amp; restore</Link>
          </Button>
          <Button
            variant="outline"
            className="gap-1.5 text-destructive"
            onClick={() => {
              if (!confirm("Clear saved commands, history and settings on this device?")) return;
              clearAllData();
              toast.success("All local data cleared");
            }}
          >
            <Trash2 className="size-4" /> Clear all data
          </Button>
          <Button asChild variant="ghost" className="gap-1.5">
            <Link to="/about">
              <Info className="size-4" /> About SlashAI
            </Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {APP_DETAILS.storage} v{APP_DETAILS.version}
        </p>
      </Section>
    </AppShell>
  );
}
