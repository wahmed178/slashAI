import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Compass,
  Flame,
  Heart,
  Lightbulb,
  NotebookPen,
  Send,
  Trash2,
  Trophy,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { evaluateBadges } from "@/lib/badges";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";
import { useLibrary, type JournalEntry } from "@/hooks/use-library";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Build journal & achievements — SlashAI" },
      {
        name: "description",
        content:
          "Log your build progress day by day, keep your streak alive, and unlock achievements as you copy, save and ship.",
      },
      { property: "og:title", content: "Build journal — SlashAI" },
      {
        property: "og:description",
        content: "A local-first build-in-public journal with streaks and achievement badges.",
      },
    ],
  }),
  component: JournalPage,
});

const MOOD_META = {
  win: { label: "Win", emoji: "🎉", cls: "text-emerald-400" },
  progress: { label: "Progress", emoji: "🚀", cls: "text-primary" },
  struggle: { label: "Stuck", emoji: "🧱", cls: "text-amber-400" },
  idea: { label: "Idea", emoji: "💡", cls: "text-sky-400" },
} as const;

type Mood = JournalEntry["mood"];

const BADGE_ICONS = {
  flame: Flame,
  copy: Send,
  heart: Heart,
  compass: Compass,
  pen: NotebookPen,
  trophy: Trophy,
  calendar: CalendarDays,
} as const;

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function EntryCard({ entry, onDelete }: { entry: JournalEntry; onDelete: (id: string) => void }) {
  const meta = MOOD_META[entry.mood];
  return (
    <article className="panel rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span aria-hidden>{meta.emoji}</span>
          <span className={meta.cls}>{meta.label}</span>
          {entry.title ? <span className="truncate text-foreground">· {entry.title}</span> : null}
        </p>
        <button
          type="button"
          aria-label="Delete entry"
          onClick={() => {
            feedback("tap");
            onDelete(entry.id);
          }}
          className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
        {entry.body}
      </p>
    </article>
  );
}

function Composer() {
  const { addJournal } = useLibrary();
  const [mood, setMood] = useState<Mood>("progress");
  const [body, setBody] = useState("");

  const submit = () => {
    const text = body.trim();
    if (!text) return;
    addJournal({ mood, title: "", body: text });
    setBody("");
    feedback("win");
  };

  return (
    <section className="panel rounded-2xl p-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {(Object.keys(MOOD_META) as Mood[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mood === m}
            onClick={() => {
              feedback("tap");
              setMood(m);
            }}
            className={cn(
              "min-h-9 shrink-0 rounded-full border px-3.5 text-sm transition-colors",
              mood === m
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {MOOD_META[m].emoji} {MOOD_META[m].label}
          </button>
        ))}
      </div>
      <Textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What did you build, learn or break today?"
        aria-label="Journal entry"
        className="mt-1 resize-none"
      />
      <div className="mt-2 flex justify-end">
        <Button size="sm" onClick={submit} disabled={!body.trim()}>
          <Send className="size-4" aria-hidden /> Log it
        </Button>
      </div>
    </section>
  );
}

function JournalTab() {
  const { journal, deleteJournal } = useLibrary();

  const grouped = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const e of [...journal].sort((a, b) => b.date.localeCompare(a.date))) {
      const arr = map.get(e.date);
      if (arr) arr.push(e);
      else map.set(e.date, [e]);
    }
    return [...map.entries()];
  }, [journal]);

  return (
    <>
      <Composer />
      {grouped.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No entries yet. One honest line a day beats a perfect update next month.
        </p>
      ) : (
        <div className="mt-5 space-y-5 pb-8">
          {grouped.map(([date, entries]) => (
            <section key={date}>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                <CalendarDays className="size-3.5 text-primary" aria-hidden />
                {formatDate(date)}
              </h3>
              <div className="space-y-2.5">
                {entries.map((e) => (
                  <EntryCard key={e.id} entry={e} onDelete={deleteJournal} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function BadgesTab() {
  const { streak, stats, favorites, journal } = useLibrary();
  const badges = useMemo(
    () =>
      evaluateBadges({
        streak,
        stats,
        favoritesCount: favorites.length,
        journalCount: journal.length,
        journalDays: new Set(journal.map((e) => e.date)).size,
      }),
    [streak, stats, favorites.length, journal],
  );
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <div className="pb-8">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <span className="font-bold text-foreground">{unlocked}</span> of {badges.length} unlocked
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {badges.map((b) => {
          const Icon = BADGE_ICONS[b.icon];
          return (
            <article
              key={b.id}
              className={cn(
                "panel flex items-start gap-3 rounded-xl p-4",
                b.unlocked && "border-primary/50",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  b.unlocked ? "bg-accent text-primary" : "bg-surface-elevated text-muted-foreground/50",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "text-sm font-bold",
                    b.unlocked ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {b.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{b.hint}</p>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(b.progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated"
                >
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", b.unlocked ? "bg-primary" : "bg-primary/40")}
                    style={{ width: `${Math.round(b.progress * 100)}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function JournalPage() {
  return (
    <AppShell hideHeaderSearch title="Build journal" wide>
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <NotebookPen className="size-6 text-primary" aria-hidden />
          Build Journal
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log progress in public — stored on this device, yours alone.
        </p>
      </header>

      <Tabs defaultValue="journal" className="mt-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="journal" className="flex-1 sm:flex-none">
            Journal
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex-1 sm:flex-none">
            Achievements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="mt-4">
          <JournalTab />
        </TabsContent>
        <TabsContent value="badges" className="mt-4">
          <BadgesTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
