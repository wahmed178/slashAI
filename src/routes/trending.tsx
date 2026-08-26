import { useMemo, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Copy, Check, ExternalLink, Play } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  VIRAL_PROMPTS,
  CATEGORY_GRADIENTS,
  CATEGORY_EMOJI,
  type PromptCategory,
} from "@/lib/viral-prompts";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "50 Trending AI Prompts — SlashAI" },
      {
        name: "description",
        content:
          "50 viral AI prompts that actually work — image prompts, writing formulas, work hacks, thinking frameworks. Copy and paste into ChatGPT, Claude or Midjourney.",
      },
      { property: "og:title", content: "Trending Prompts — SlashAI" },
    ],
  }),
  component: TrendingPage,
});

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
      style={{
        background: copied ? "#3fb950" : "var(--primary)",
        color: "#fff",
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const FILTERS = ["All", "Image Prompt", "Writing", "Work", "Think", "Social Media", "Code", "Money"] as const;

function TrendingPage() {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return VIRAL_PROMPTS;
    return VIRAL_PROMPTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <AppShell hideHeaderSearch title="Trending Prompts">
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Flame className="size-6 text-orange-500" aria-hidden />
          Trending Prompts
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {VIRAL_PROMPTS.length} viral prompts that actually work — copy and paste into your AI tool.
        </p>
      </header>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all"
            style={{
              borderColor: filter === f ? "var(--primary)" : "var(--border)",
              background: filter === f ? "color-mix(in oklab, var(--primary) 15%, transparent)" : "var(--surface)",
              color: filter === f ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            {f !== "All" && <span>{CATEGORY_EMOJI[f as PromptCategory]}</span>}
            {f}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const encoded = encodeURIComponent(p.prompt);
          return (
            <div
              key={p.id}
              className="relative overflow-hidden rounded-2xl p-4"
              style={{ background: CATEGORY_GRADIENTS[p.category] }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {p.badge}
                </span>
                {p.viral && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    🔥
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-lg font-black text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-white/80">{p.teaser}</p>

              <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(0,0,0,0.4)" }}>
                <p className="text-xs leading-relaxed text-white/85 whitespace-pre-wrap">"{p.prompt}"</p>
              </div>

              <p className="mt-2 text-[11px] text-white/50">Works with: {p.worksWith}</p>

              <div className="mt-3 flex flex-col gap-1.5">
                <CopyBtn text={p.prompt} />
                <div className="flex gap-1.5">
                  <a
                    href={`https://chat.openai.com/?q=${encoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-white/20 text-[11px] font-medium text-white hover:bg-white/30"
                  >
                    <Play className="size-3" /> ChatGPT
                  </a>
                  <a
                    href={`https://claude.ai/new?q=${encoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-white/20 text-[11px] font-medium text-white hover:bg-white/30"
                  >
                    <ExternalLink className="size-3" /> Claude
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
