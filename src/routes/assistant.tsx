import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  BookOpen,
  Check,
  CircleAlert,
  Copy,
  Eraser,
  Info,
  Quote,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Highlight } from "@/components/library/Highlight";
import { Button } from "@/components/ui/button";
import {
  RAG_KINDS,
  answerQuery,
  corpusSize,
  warmUp,
  type RagAnswer,
  type RagKind,
  type RagTurn,
} from "@/lib/rag";
import { readStorage, writeStorage, UX_KEYS } from "@/lib/ux";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  validateSearch: (raw: Record<string, unknown>) => ({
    q: typeof raw["q"] === "string" ? raw["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Slash Ask - grounded answers from SlashAI's own catalogue | SlashAI" },
      {
        name: "description",
        content:
          "Ask a question and get quoted, cited passages from SlashAI's commands, tools, games and guides. Runs entirely in your browser - no model, no account, nothing invented.",
      },
      { property: "og:title", content: "Slash Ask - answers with citations, not guesses" },
      {
        property: "og:description",
        content:
          "A retriever over SlashAI's own catalogue. Every sentence is quoted and linked back to the page it came from.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

const STARTERS = [
  "what is RAG",
  "how do I chain AI prompts",
  "free tool to compress an image",
  "how to play cricket",
  "how many commands are there",
  "how do I write a good cold email",
  "best free video editor",
  "what should I learn to become a data analyst",
];

const nf = new Intl.NumberFormat("en-IN");

interface Message {
  id: string;
  query: string;
  answer: RagAnswer;
}

const MODE_STYLE: Record<RagAnswer["mode"], { chip: string; label: string; Icon: LucideIcon }> = {
  grounded: {
    chip: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    label: "Answered from the catalogue",
    Icon: Check,
  },
  partial: {
    chip: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    label: "Only partly covered",
    Icon: CircleAlert,
  },
  gap: {
    chip: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    label: "Not in the catalogue",
    Icon: CircleAlert,
  },
};

/** Plain-text rendering of an answer, for the copy button. */
function answerText(a: RagAnswer): string {
  const lines = [a.lead];
  if (a.facts.length) {
    lines.push("", ...a.facts.map((f) => `- ${nf.format(f.value)} ${f.label} (${f.to})`));
  }
  for (const p of a.passages) {
    lines.push("", `[${p.n}] ${p.doc.title} - ${p.doc.to}`, `"${p.text}"`);
  }
  if (a.missing.length) lines.push("", `Not found anywhere: ${a.missing.join(", ")}`);
  return lines.join("\n");
}

function AssistantPage() {
  // A question handed over from the universal search box, e.g. /assistant?q=...
  const { q } = Route.useSearch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState(q);
  const [kinds, setKinds] = useState<RagKind[]>([]);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // localStorage is read in an effect, never in a useState initialiser, or the
  // server render throws and the whole route drops to client-side rendering.
  useEffect(() => {
    const raw = readStorage(UX_KEYS.askThread);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed.slice(-12));
      } catch {
        /* a corrupt thread is not worth breaking the page over */
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(UX_KEYS.askThread, JSON.stringify(messages.slice(-12)));
  }, [messages, ready]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Tokenising every passage takes a moment. Do it now rather than inside the
  // first click handler, where it would just look like a frozen composer.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(warmUp, 60);
    return () => window.clearTimeout(id);
  }, [ready]);

  const ask = useCallback(
    (raw: string) => {
      const query = raw.trim();
      if (!query) return;
      feedback("tap");
      const history: RagTurn[] = messages.map((m) => ({ query: m.query, terms: m.answer.covered }));
      const answer = answerQuery(query, {
        history,
        kinds: kinds.length ? kinds : undefined,
        limit: 4,
      });
      setMessages((prev) =>
        [...prev, { id: `${Date.now()}-${prev.length}`, query, answer }].slice(-12),
      );
      setDraft("");
    },
    [messages, kinds],
  );

  const copy = async (m: Message) => {
    try {
      await navigator.clipboard.writeText(answerText(m.answer));
      feedback("copy");
      setCopied(m.id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const toggleKind = (kind: RagKind) => {
    feedback("tick");
    setKinds((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));
  };

  return (
    <AppShell title="Slash Ask">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-4">
        <header>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🔎
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Slash Ask
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Ask anything about SlashAI&apos;s own catalogue. It answers by quoting real pages and
            linking each one — it does not generate text, so it cannot make something up.
          </p>
        </header>

        {/* ── filters ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Search in:</span>
          {RAG_KINDS.map((k) => {
            const on = kinds.includes(k.id);
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => toggleKind(k.id)}
                aria-pressed={on}
                title={k.blurb}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  on
                    ? "border-primary/40 bg-primary/15 text-foreground"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span aria-hidden>{k.icon}</span> {k.label}
              </button>
            );
          })}
          {kinds.length > 0 && (
            <button
              type="button"
              onClick={() => setKinds([])}
              className="rounded-full px-2 py-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              clear
            </button>
          )}
        </div>

        {/* ── thread ──────────────────────────────────────────────────── */}
        {messages.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-sm font-medium text-foreground">Try one of these</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const style = MODE_STYLE[m.answer.mode];
              return (
                <article key={m.id} className="flex flex-col gap-2">
                  <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {m.query}
                  </p>

                  <div className="rounded-xl rounded-bl-sm border border-border bg-card p-3.5">
                    <div
                      className={cn(
                        "mb-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        style.chip,
                      )}
                    >
                      <style.Icon className="size-3" aria-hidden />
                      {style.label}
                    </div>

                    <p className="text-sm leading-relaxed text-foreground">{m.answer.lead}</p>

                    {m.answer.facts.length > 0 && (
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.answer.facts.map((f) => (
                          <li key={f.id}>
                            <Link
                              to={f.to}
                              className="inline-flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:border-primary/40"
                            >
                              <span className="text-base font-semibold text-foreground">
                                {nf.format(f.value)}
                              </span>
                              <span className="text-muted-foreground">{f.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {m.answer.passages.length > 0 && (
                      <ol className="mt-3 flex flex-col gap-2.5">
                        {m.answer.passages.map((p) => (
                          <li key={p.n} className="border-l-2 border-border pl-3">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                                {p.n}
                              </span>
                              <Link
                                to={p.doc.to}
                                className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
                              >
                                <span aria-hidden>{p.doc.icon}</span> {p.doc.title}
                              </Link>
                              <span className="text-[11px] text-muted-foreground">
                                {p.doc.kicker}
                              </span>
                            </div>
                            <p className="mt-1 flex gap-1.5 text-[13px] leading-relaxed text-muted-foreground">
                              <Quote className="mt-0.5 size-3 shrink-0 opacity-60" aria-hidden />
                              <span>
                                <Highlight text={p.text} query={m.answer.resolved} />
                              </span>
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}

                    {m.answer.missing.length > 0 && m.answer.mode !== "gap" && (
                      <p className="mt-2.5 text-[11px] text-muted-foreground">
                        Not found anywhere in the catalogue:{" "}
                        <span className="font-medium text-foreground">
                          {m.answer.missing.join(", ")}
                        </span>
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-2">
                      <button
                        type="button"
                        onClick={() => copy(m)}
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copied === m.id ? (
                          <Check className="size-3" aria-hidden />
                        ) : (
                          <Copy className="size-3" aria-hidden />
                        )}
                        {copied === m.id ? "Copied" : "Copy answer"}
                      </button>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Timer className="size-3" aria-hidden />
                        {m.answer.ms < 1 ? "<1" : Math.round(m.answer.ms)} ms over{" "}
                        {nf.format(m.answer.considered)} passages
                      </span>
                      {m.answer.carried.length > 0 && (
                        <span className="text-[11px] text-muted-foreground">
                          followed up on{" "}
                          <span className="font-medium text-foreground">
                            {m.answer.carried.join(", ")}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            <div ref={endRef} />
          </div>
        )}

        {/* ── composer ────────────────────────────────────────────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
          className="sticky bottom-2 flex gap-2 rounded-xl border border-border bg-background p-2 shadow-lg"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about any command, tool, game or guide…"
            aria-label="Ask Slash Ask a question"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            <ArrowUp className="size-3.5" aria-hidden />
            Ask
          </Button>
        </form>

        {/* ── how this works ──────────────────────────────────────────── */}
        <details className="rounded-xl border border-border/60 bg-card/40 p-3.5 text-sm">
          <summary className="cursor-pointer list-none text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Info className="size-3.5" aria-hidden />
              How this works — and what it deliberately cannot do
            </span>
          </summary>
          <div className="mt-2.5 flex flex-col gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <p>
              Slash Ask is a <strong className="text-foreground">retriever, not a model</strong>.{" "}
              There is no language model behind it and nothing is sent anywhere. Your question is
              matched against{" "}
              <strong className="text-foreground">{nf.format(corpusSize())} passages</strong> built
              from the {RAG_KINDS.length} parts of SlashAI already on this site, using Okapi BM25
              with a stemmed keyword index.
            </p>
            <p>
              The answer text is{" "}
              <strong className="text-foreground">copied out of the source</strong>, sentence by
              sentence — never written. That is why every claim above carries a numbered link: if a
              quote is wrong, the page it came from is wrong too, and you can see it immediately.
            </p>
            <p>
              When the catalogue does not cover a question, it says so and names the terms that
              matched nothing, instead of producing a confident paragraph that came from nowhere.
              That is the trade-off: it can only tell you what SlashAI already knows.
            </p>
            <p className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <BookOpen className="size-3" aria-hidden />
              <Link to="/glossary" className="underline-offset-2 hover:underline">
                The RAG &amp; memory glossary
              </Link>
              <span aria-hidden>·</span>
              <Link
                to="/blog/$slug"
                params={{ slug: "how-to-chain-ai-prompts-like-a-senior-engineer" }}
                className="underline-offset-2 hover:underline"
              >
                How chaining AI prompts works
              </Link>
            </p>
          </div>
        </details>

        {messages.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                feedback("tap");
                setMessages([]);
              }}
              className="text-muted-foreground"
            >
              <Eraser className="size-3.5" aria-hidden />
              Clear this thread
            </Button>
          </div>
        )}

        <p className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 size-3 shrink-0" aria-hidden />
          The thread is stored in this browser only, and is cleared whenever you clear it. Nothing
          is uploaded, logged or tied to an account.
        </p>
      </div>
    </AppShell>
  );
}
