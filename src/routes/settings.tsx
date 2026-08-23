import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rows3,
  Rows4,
  Keyboard,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Info,
  Check,
  Zap,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { useLibrary, ACCENTS, THEMES, FIXED_ACCENT_THEMES } from "@/hooks/use-library";
import { CATEGORY_TREE, VERIFIED_TOTAL } from "@/lib/commands";
import { INTERESTS } from "@/lib/collections";
import { APP_DETAILS, CHANGELOG } from "@/lib/app-meta";
import { cn } from "@/lib/utils";

const SHORTCUTS: [string, string][] = [
  ["/  or  Ctrl K", "Focus search"],
  ["Esc", "Close suggestions or dialog"],
  ["Enter", "Search the catalog"],
];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SlashAI" },
      {
        name: "description",
        content: "Theme, accent colour, density, interests and on-device backup for SlashAI.",
      },
      { property: "og:title", content: "Settings — SlashAI" },
      { property: "og:description", content: "Personalise SlashAI — all stored on your device." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

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

function SettingsPage() {
  const {
    settings,
    updateSettings,
    clearRecents,
    clearSearches,
    recents,
    recentSearches,
    favorites,
    exportBackup,
    importBackup,
    openWhatsNew,
  } = useLibrary();
  const fileRef = useRef<HTMLInputElement>(null);
  const accentLocked = FIXED_ACCENT_THEMES.includes(settings.theme);

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

  const toggleInterest = (id: string) =>
    updateSettings({
      interests: settings.interests.includes(id)
        ? settings.interests.filter((x) => x !== id)
        : [...settings.interests, id],
      onboarded: true,
    });

  return (
    <AppShell hideHeaderSearch title="Settings">
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stored on this device — no account needed.
        </p>
      </header>

      <Section title="Theme">
        <div className="grid gap-2 sm:grid-cols-2">
          {THEMES.map((t) => {
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

      <Section title="Accent colour">
        <div className="flex flex-wrap gap-2.5">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={settings.accent === a.id}
              disabled={accentLocked}
              onClick={() => updateSettings({ accent: a.id })}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 transition-transform active:scale-95",
                settings.accent === a.id ? "border-foreground" : "border-transparent",
                accentLocked && "cursor-not-allowed opacity-40",
              )}
              style={{ backgroundColor: a.swatch }}
            >
              {settings.accent === a.id && <Check className="size-4 text-background" aria-hidden />}
            </button>
          ))}
        </div>
        {accentLocked && (
          <p className="mt-2 text-xs text-muted-foreground">
            The {settings.theme} theme brings its own colour. Switch to Dark, Light or AMOLED to
            pick an accent.
          </p>
        )}
      </Section>

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

      <Section title="Interests (optional)">
        <p className="mb-2 text-xs text-muted-foreground">
          Used only on this device to shape the “For you” row on Home.
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
      </Section>

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

      <Section title="Local data">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={recents.length === 0}
            onClick={clearRecents}
          >
            <Trash2 className="size-3.5" /> Clear recents
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={recentSearches.length === 0}
            onClick={clearSearches}
          >
            <Trash2 className="size-3.5" /> Clear searches
          </Button>
        </div>
      </Section>

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
      </Section>

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
            ["Created by", APP_DETAILS.creator],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">{APP_DETAILS.storage}</p>
        <Button asChild variant="ghost" size="sm" className="mt-2">
          <Link to="/about">About SlashAI</Link>
        </Button>
      </Section>
    </AppShell>
  );
}
