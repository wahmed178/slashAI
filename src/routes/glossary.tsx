import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  GLOSSARY_TOTAL,
  type GlossaryCategory,
} from "@/lib/glossary";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: `AI glossary — ${GLOSSARY_TOTAL} terms in plain English | SlashAI` },
      {
        name: "description",
        content: `${GLOSSARY_TOTAL} AI terms explained simply — LLMs, RAG, fine-tuning, agents, safety and shipping. No jargon walls.`,
      },
      { property: "og:title", content: "AI Glossary — SlashAI" },
      {
        property: "og:description",
        content: "Every AI term a builder runs into, explained in one read each.",
      },
    ],
  }),
  component: GlossaryPage,
});

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<GlossaryCategory | "All">("All");

  const list = useMemo(() => {
    const q = normalize(query);
    return GLOSSARY.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!q) return true;
      return normalize(t.term).includes(q) || normalize(t.def).includes(q);
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [query, cat]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const t of list) {
      const letter = t.term[0]?.toUpperCase() ?? "#";
      const arr = map.get(letter);
      if (arr) arr.push(t);
      else map.set(letter, [t]);
    }
    return [...map.entries()];
  }, [list]);

  return (
    <AppShell hideHeaderSearch title="Glossary" wide>
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <BookOpen className="size-6 text-primary" aria-hidden />
          AI Glossary
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {GLOSSARY_TOTAL} terms, one clear definition each — foundations to shipping.
        </p>
      </header>

      <label className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 focus-within:border-primary/60">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms or definitions…"
          aria-label="Search the glossary"
          className="min-h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-3 -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {(["All", ...GLOSSARY_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => {
              feedback("tap");
              setCat(c);
            }}
            className={cn(
              "min-h-9 shrink-0 snap-start rounded-full border px-3.5 text-sm transition-colors",
              cat === c
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No matching terms"
            hint={`Try a shorter search — or browse “All” across ${GLOSSARY_TOTAL} entries.`}
          />
        </div>
      ) : (
        <>
          <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
            {list.length} {list.length === 1 ? "term" : "terms"}
          </p>
          <div className="mt-2 space-y-6 pb-8">
            {grouped.map(([letter, terms]) => (
              <section key={letter}>
                <h2 className="sticky top-[52px] z-10 -mx-1 mb-2 bg-background/85 px-1 py-1 text-sm font-black tracking-widest text-primary backdrop-blur-sm">
                  {letter}
                </h2>
                <dl className="panel divide-y divide-border overflow-hidden rounded-xl">
                  {terms.map((t) => (
                    <div key={t.term} className="px-4 py-3">
                      <dt className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-foreground">
                        {t.term}
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                          {t.category}
                        </span>
                      </dt>
                      <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {t.def}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
