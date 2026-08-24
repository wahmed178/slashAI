import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { CommandGrid } from "@/components/library/CommandGrid";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { categoryIcon } from "@/components/library/icons";
import { resolveIntent } from "@/lib/intent";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find")({
  validateSearch: (raw: Record<string, unknown>) => ({
    q: typeof raw["q"] === "string" ? raw["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Advanced search — turn any keyword into a shortlist | SlashAI" },
      {
        name: "description",
        content:
          "Type what you want in plain words. SlashAI shortlists the exact features, commands, ideas and resources that fit — plus a ready-to-copy prompt.",
      },
      { property: "og:title", content: "Advanced search — keyword to shortlist | SlashAI" },
      {
        property: "og:description",
        content: "One box, instant feature shortlist and a copy-ready prompt for your AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindPage,
});

const EXAMPLES = [
  "make a study plan for my exams",
  "free tools to edit a podcast",
  "startup idea for local shops",
  "watch telugu movies legally",
  "cricket score and weather today",
  "write cold emails that convert",
];

function FindPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/find" });
  const [draft, setDraft] = useState(q);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => resolveIntent(q), [q]);

  const submit = (term: string) => {
    feedback("tap");
    setDraft(term);
    void navigate({ search: { q: term } });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(result.prompt);
      feedback("win");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <AppShell wide hideHeaderSearch title="Advanced search">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Say what you want
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Plain words in — the right features, commands and a ready prompt out.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft.trim());
        }}
        className="glass flex flex-col gap-2 rounded-2xl p-3 sm:flex-row sm:p-4"
      >
        <div className="relative min-w-0 flex-1">
          <Wand2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            aria-label="Describe what you want"
            placeholder="e.g. plan my week, upscale an old photo, find free design tools…"
            className="h-12 w-full rounded-xl border border-border bg-surface pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
          />
        </div>
        <Button type="submit" className="min-h-12 gap-1.5">
          <Sparkles className="size-4" /> Shortlist
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => submit(ex)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>

      {!q.trim() ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Start typing above — everything in SlashAI is searchable from this one box.
        </p>
      ) : (
        <div className="mt-7 space-y-8">
          <section>
            <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Best features for “{q}”
            </h2>
            {result.features.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {result.features.map(({ feature, hits }) => {
                  const Icon = categoryIcon(feature.icon);
                  return (
                    <Link
                      key={feature.id}
                      to={feature.to as never}
                      className="glass lift flex items-start gap-3 rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                        <Icon className="size-4.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {feature.label} <ArrowRight className="size-3.5 text-muted-foreground" />
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {feature.blurb}
                        </span>
                        {hits.length > 0 && (
                          <span className="mt-1.5 block truncate text-[11px] text-muted-foreground/80">
                            matched: {hits.join(", ")}
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No feature matched directly — the command matches below are usually what you want.
              </p>
            )}
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Ready-to-copy prompt
              </h2>
              <Button size="sm" variant={copied ? "secondary" : "default"} className="gap-1.5" onClick={copyPrompt}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy prompt"}
              </Button>
            </div>
            <pre
              className={cn(
                "glass overflow-x-auto rounded-2xl p-4 font-mono text-[12.5px] leading-relaxed text-foreground",
              )}
            >
              {result.prompt}
            </pre>
          </section>

          {result.commands.length > 0 && (
            <section>
              <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Matching commands ({result.commands.length})
              </h2>
              <CommandGrid commands={result.commands} query={q} />
            </section>
          )}

          {result.ideas.length > 0 && (
            <section>
              <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Build ideas
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.ideas.map((idea) => (
                  <Link
                    key={idea.id}
                    to="/build-ideas/$slug"
                    params={{ slug: idea.slug }}
                    className="glass lift rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <h3 className="text-sm font-semibold text-foreground">{idea.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {idea.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {result.resources.length > 0 && (
            <section>
              <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Free resources
              </h2>
              <ResourceGrid resources={result.resources} />
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}
