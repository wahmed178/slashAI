import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, ExternalLink, Bookmark, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  TRENDING_COMMANDS,
  ALL_CATEGORIES,
  CATEGORY_DOT_COLORS,
  getCommandOfWeek,
  type TrendingCommand,
  type CommandCategory,
} from "@/lib/trending-commands";

/* ═══════════════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════════════ */
function CopyBtn({ text, className = "" }: { text: string; className?: string }) {
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
      onClick={(e) => { e.stopPropagation(); copy(); }}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        copied
          ? "bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/30"
          : "bg-[#21262d] text-[#e6edf3] border border-[#30363d] hover:border-[#58a6ff]/40 hover:text-[#58a6ff]"
      } ${className}`}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND OF THE WEEK HERO
   ═══════════════════════════════════════════════════════════════════ */
function CommandOfTheWeek() {
  const cmd = getCommandOfWeek();
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#21262d] px-2.5 py-1 text-[11px] font-medium text-[#8b949e]">
            <span
              className="inline-block size-2 rounded-full"
              style={{ background: CATEGORY_DOT_COLORS[cmd.category] }}
            />
            Command of the Week
          </span>
          <h2
            className="mt-3 font-mono text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(88,166,255,0.15)" }}
          >
            {cmd.command}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#8b949e]">
            {cmd.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cmd.worksIn.map((w) => (
              <span
                key={w}
                className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyBtn text={cmd.command} className="h-9 px-4" />
          {cmd.worksIn[0] && (
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(cmd.command)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#58a6ff]/15 px-3 text-xs font-medium text-[#58a6ff] transition-colors hover:bg-[#58a6ff]/25"
              onClick={(e) => e.stopPropagation()}
            >
              Try it <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND CARD
   ═══════════════════════════════════════════════════════════════════ */
function CommandCard({
  cmd,
  onOpen,
}: {
  cmd: TrendingCommand;
  onOpen: (cmd: TrendingCommand) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(cmd)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(cmd); } }}
      className="group flex cursor-pointer flex-col rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#8b949e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]/50"
    >
      {/* Category + rank */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: CATEGORY_DOT_COLORS[cmd.category] }}
        />
        <span className="text-[11px] text-[#8b949e]">{cmd.category}</span>
        <span className="ml-auto text-[10px] text-[#8b949e]/60">#{cmd.trendingRank}</span>
      </div>

      {/* Command name — the hero element */}
      <code className="font-mono text-2xl font-bold tracking-tight text-[#e6edf3]">
        {cmd.command}
      </code>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#8b949e]">
        {cmd.description}
      </p>

      {/* Works in badges */}
      <div className="mt-3 flex flex-wrap gap-1">
        {cmd.worksIn.map((w) => (
          <span
            key={w}
            className="rounded-md border border-[#30363d] bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]"
          >
            {w}
          </span>
        ))}
      </div>

      {/* Bottom: copy button + save */}
      <div className="mt-auto flex items-center gap-2 pt-3">
        <CopyBtn text={cmd.command} />
        <button
          type="button"
          className="ml-auto rounded-md p-1.5 text-[#8b949e]/50 transition-colors hover:text-[#e6edf3]"
          onClick={(e) => e.stopPropagation()}
          aria-label="Save command"
        >
          <Bookmark className="size-3.5" />
        </button>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND DETAIL DRAWER
   ═══════════════════════════════════════════════════════════════════ */
function CommandDrawer({
  cmd,
  onClose,
}: {
  cmd: TrendingCommand | null;
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cmd) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmd, onClose]);

  if (!cmd) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[80vh] w-full flex-col overflow-y-auto rounded-t-2xl border-t border-[#30363d] bg-[#161b22]/98 p-6 backdrop-blur-xl sm:mx-4 sm:max-w-lg sm:rounded-2xl sm:border"
      >
        {/* Drag handle */}
        <div className="mb-4 flex justify-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#30363d]" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-[#8b949e] transition-colors hover:text-[#e6edf3]"
        >
          <X className="size-4" />
        </button>

        {/* Category badge */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ background: CATEGORY_DOT_COLORS[cmd.category] }}
          />
          <span className="text-[11px] text-[#8b949e]">{cmd.category}</span>
          <span className="text-[10px] text-[#8b949e]/60">#{cmd.trendingRank}</span>
        </div>

        {/* Command name */}
        <code className="font-mono text-3xl font-bold text-[#e6edf3]">
          {cmd.command}
        </code>

        {/* Works in */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cmd.worksIn.map((w) => (
            <span
              key={w}
              className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]"
            >
              {w}
            </span>
          ))}
        </div>

        {/* What it does */}
        <section className="mt-5">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
            What it does
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-[#e6edf3]">
            {cmd.description}
          </p>
        </section>

        {/* How to use */}
        <section className="mt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
            How to use it
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-[#e6edf3]">
            {cmd.howToUse}
          </p>
        </section>

        {/* Example */}
        <section className="mt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
            Example
          </h4>
          <div className="mt-1.5 overflow-x-auto rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
            <code className="whitespace-pre-wrap font-mono text-[13px] text-[#e6edf3]">
              {cmd.example}
            </code>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <CopyBtn text={cmd.command} className="h-9 px-4" />
          {cmd.worksIn.includes("ChatGPT") && (
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(cmd.command)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#58a6ff]/15 px-3 text-xs font-medium text-[#58a6ff] transition-colors hover:bg-[#58a6ff]/25"
            >
              ChatGPT <ExternalLink className="size-3" />
            </a>
          )}
          {cmd.worksIn.includes("Claude") && (
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(cmd.command)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#a78bfa]/15 px-3 text-xs font-medium text-[#a78bfa] transition-colors hover:bg-[#a78bfa]/25"
            >
              Claude <ExternalLink className="size-3" />
            </a>
          )}
          {cmd.worksIn.includes("Midjourney") && (
            <a
              href={`https://www.midjourney.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#fbbf24]/15 px-3 text-xs font-medium text-[#fbbf24] transition-colors hover:bg-[#fbbf24]/25"
            >
              Midjourney <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending /commands — SlashAI" },
      {
        name: "description",
        content:
          "80 viral slash modifiers going viral on ChatGPT, Midjourney, Claude, and social media. /bokeh /cinematic /eli5 /fix — copy, paste, create.",
      },
    ],
  }),
  component: TrendingPage,
});

function TrendingPage() {
  const [activeCategory, setActiveCategory] = useState<CommandCategory | "All">("All");
  const [drawerCmd, setDrawerCmd] = useState<TrendingCommand | null>(null);

  const filteredCommands = useMemo(() => {
    if (activeCategory === "All") return TRENDING_COMMANDS;
    return TRENDING_COMMANDS.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <AppShell wide hideHeaderSearch title="Trending /commands">
      {/* Hero */}
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#e6edf3] sm:text-3xl">
          Trending /commands
        </h1>
        <p className="mt-1 text-sm text-[#8b949e]">
          The slash modifiers going viral this week — copy, paste, create.
        </p>
      </header>

      {/* Command of the Week */}
      <div className="mt-5">
        <CommandOfTheWeek />
      </div>

      {/* Filter row */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory("All")}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
            activeCategory === "All"
              ? "border-[#58a6ff]/40 bg-[#58a6ff]/15 text-[#58a6ff]"
              : "border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]"
          }`}
        >
          All ({TRENDING_COMMANDS.length})
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const count = TRENDING_COMMANDS.filter((c) => c.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                activeCategory === cat
                  ? "border-[#58a6ff]/40 bg-[#58a6ff]/15 text-[#58a6ff]"
                  : "border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              <span
                className="size-2 rounded-full"
                style={{ background: CATEGORY_DOT_COLORS[cat] }}
              />
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Command grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCommands.map((cmd) => (
          <CommandCard key={cmd.slug} cmd={cmd} onOpen={setDrawerCmd} />
        ))}
      </div>

      {/* Drawer */}
      <CommandDrawer cmd={drawerCmd} onClose={() => setDrawerCmd(null)} />
    </AppShell>
  );
}
