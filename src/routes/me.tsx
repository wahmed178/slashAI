import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Flame,
  History,
  Info,
  Keyboard,
  LayoutGrid,
  List,
  Moon,
  MoonStar,
  Rows3,
  Rows4,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Trash2,
  Download,
  Upload,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { useLibrary, THEMES, type Theme } from "@/hooks/use-library";
import { INTERESTS } from "@/lib/collections";
import { PERSONAS, getPersona } from "@/lib/personas";
import { getCommand, type SlashCommand } from "@/lib/commands";
import { streakMessage } from "@/lib/engagement";
import { APP_DETAILS, CHANGELOG } from "@/lib/app-meta";
import { CATEGORY_TREE, VERIFIED_TOTAL } from "@/lib/commands";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — SlashAI" },
      {
        name: "description",
        content:
          "Your persona, interests, streak, theme, layout, backup and saved commands — all stored on this device.",
      },
      { property: "og:title", content: "Profile & Settings — SlashAI" },
      {
        property: "og:description",
        content: "Personalise SlashAI: persona, interests, theme, layout and more.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MePage,
});

const SHORTCUTS: [string, string][] = [
  ["/  or  Ctrl K", "Focus search"],
  ["Esc", "Close suggestions or dialog"],
  ["Enter", "Search the catalog"],
];

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
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
    clearRecents,
    clearFavorites,
    clearSearches,
    recentSearches,
    exportBackup,
    importBackup,
    openWhatsNew,
  } = useLibrary();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingPersona, setEditingPersona] = useState(false);

  const persona = getPersona(settings.persona);
  // every theme is free — nothing is gated
  const visibleThemes = THEMES;

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
      onboarded: true,
    });

  const download = () => {
    const blob = new Blob([JSON.stringify(exportBackup(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slashai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup file saved");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const result = importBackup(await file.text());
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <AppShell hideHeaderSearch title="Profile" wide>
      {/* ── Profile Header ── */}
      <header className="flex items-center gap-3 pt-2">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl">
          {persona ? persona.emoji : <UserRound className="size-6 text-primary" aria-hidden />}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {persona ? persona.label : "Your profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {hydrated
              ? `${favorites.length} saved · ${stats.copies} copied`
              : " "}
          </p>
        </div>
        <div className="ml-auto">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/about">
              <Info className="size-4" /> About
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Streak ── */}
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

      {/* ── Persona ── */}
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

      {/* ── Interests ── */}
      <Section title="Interests">
        <p className="mb-2 text-xs text-muted-foreground">
          Used only on this device to shape the "For you" row on Home.
        </p>
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

      {/* ── Theme ── */}
      <Section title="Theme">
        <div className="grid gap-2 sm:grid-cols-2">
          {visibleThemes.map((t) => {
            const active = settings.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => updateSettings({ theme: t.id })}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors active:scale-[0.99]",
                  active
                    ? "border-primary bg-accent"
                    : "border-border bg-surface hover:border-primary/40",
                )}
              >
                <span
                  className="size-8 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: t.swatch }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{t.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{t.hint}</span>
                </span>
                {active && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Layout ── */}
      <Section title="Layout">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={settings.view === "grid" ? "default" : "outline"}
            onClick={() => updateSettings({ view: "grid" })}
            className="gap-1.5"
          >
            <LayoutGrid className="size-4" /> Grid
          </Button>
          <Button
            variant={settings.view === "list" ? "default" : "outline"}
            onClick={() => updateSettings({ view: "list" })}
            className="gap-1.5"
          >
            <List className="size-4" /> List
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            variant={settings.density === "comfortable" ? "default" : "outline"}
            onClick={() => updateSettings({ density: "comfortable" })}
            className="gap-1.5"
          >
            <Rows3 className="size-4" /> Comfortable
          </Button>
          <Button
            variant={settings.density === "compact" ? "default" : "outline"}
            onClick={() => updateSettings({ density: "compact" })}
            className="gap-1.5"
          >
            <Rows4 className="size-4" /> Compact
          </Button>
        </div>
      </Section>

      {/* ── Motion ── */}
      <Section
        title={
          <>
            <Zap className="size-3.5" /> Motion
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!settings.reducedMotion ? "default" : "outline"}
            onClick={() => updateSettings({ reducedMotion: false })}
          >
            Smooth
          </Button>
          <Button
            variant={settings.reducedMotion ? "default" : "outline"}
            onClick={() => updateSettings({ reducedMotion: true })}
          >
            Off
          </Button>
        </div>
      </Section>

      {/* ── Results per page ── */}
      <Section title="Results per page">
        <div className="grid grid-cols-3 gap-2">
          {[24, 48, 96].map((n) => (
            <Button
              key={n}
              variant={settings.pageSize === n ? "default" : "outline"}
              onClick={() => updateSettings({ pageSize: n })}
            >
              {n}
            </Button>
          ))}
        </div>
      </Section>

      {/* ── Saved Commands ── */}
      <Section title="Saved commands">
        {saved.length > 0 ? (
          <>
            <CommandGrid commands={saved} />
            <Button asChild variant="ghost" size="sm" className="mt-2 gap-1.5">
              <Link to="/favorites">
                <SettingsIcon className="size-3.5" /> All {favorites.length} saved
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

      {/* ── Recent ── */}
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

      {/* ── Backup & restore ── */}
      <Section title="Backup & restore">
        <p className="mb-2 text-xs text-muted-foreground">
          Save your {favorites.length} favourite{favorites.length === 1 ? "" : "s"}, history and
          settings to a file, then load it on another device.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="gap-1.5" onClick={download}>
            <Download className="size-4" /> Backup
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" /> Restore
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </Section>

      {/* ── Privacy & data ── */}
      <Section title="Privacy & data">
        <p className="mb-2 text-xs text-muted-foreground">
          Everything lives in this browser. No account, no uploads, no tracking.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={recentSearches.length === 0}
            onClick={() => {
              clearSearches();
              toast.success("Search history cleared");
            }}
          >
            <Trash2 className="size-3.5" /> Clear search history ({recentSearches.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={recents.length === 0}
            onClick={() => {
              clearRecents();
              toast.success("Recently opened cleared");
            }}
          >
            <Trash2 className="size-3.5" /> Clear recently opened ({recents.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={favorites.length === 0}
            onClick={() => {
              clearFavorites();
              toast.success("Saved commands cleared");
            }}
          >
            <Trash2 className="size-3.5" /> Clear saved commands ({favorites.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive"
            onClick={() => {
              if (!confirm("Clear saved commands, history, journal and settings on this device? This cannot be undone.")) return;
              clearAllData();
              toast.success("All local data cleared");
            }}
          >
            <Trash2 className="size-4" /> Clear everything
          </Button>
        </div>
      </Section>

      {/* ── Keyboard shortcuts ── */}
      <Section
        title={
          <>
            <Keyboard className="size-3.5" /> Keyboard shortcuts
          </>
        }
      >
        <ul className="space-y-1.5">
          {SHORTCUTS.map(([keys, label]) => (
            <li key={keys} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-muted-foreground">{label}</span>
              <kbd className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {keys}
              </kbd>
            </li>
          ))}
        </ul>
        <Button asChild variant="ghost" size="sm" className="mt-2">
          <Link to="/keyboard">Full shortcut reference →</Link>
        </Button>
      </Section>

      {/* ── Updates ── */}
      <Section
        title={
          <>
            <Sparkles className="size-3.5" /> Updates
          </>
        }
      >
        <div className="space-y-3">
          {CHANGELOG.map((r) => (
            <div key={r.version} className="panel rounded-xl p-3">
              <p className="flex items-center justify-between text-sm font-semibold text-foreground">
                v{r.version}
                <span className="text-xs font-normal text-muted-foreground">{r.date}</span>
              </p>
              <p className="mt-0.5 text-xs text-primary">{r.title}</p>
              <ul className="mt-2 space-y-1.5">
                {r.changes.map((c) => (
                  <li key={c} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={openWhatsNew}>
          Show update popup again
        </Button>
      </Section>

      {/* ── App details ── */}
      <Section
        title={
          <>
            <Info className="size-3.5" /> App details
          </>
        }
      >
        <dl className="panel divide-y divide-border rounded-xl text-sm">
          {[
            ["App", APP_DETAILS.name],
            ["Version", `v${APP_DETAILS.version}`],
            ["Commands", VERIFIED_TOTAL.toLocaleString()],
            ["Categories", String(CATEGORY_TREE.length)],
            ["Model", "Free forever · No account · No tracking"],
            ["Created by", APP_DETAILS.creator],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">{APP_DETAILS.storage}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link to="/changelog" className="text-primary hover:underline">Changelog</Link>
          <a href="https://github.com/wahmed178/slashAI" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>
          <Link to="/about" className="text-primary hover:underline">About</Link>
        </div>
      </Section>
    </AppShell>
  );
}
