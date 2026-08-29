import { useMemo, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, ExternalLink, ArrowRight } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { ResourceCardEnhanced } from "@/components/library/ResourceCardEnhanced";
import {
  TRENDING_COMMANDS,
  ALL_CATEGORIES,
  CATEGORY_DOT_COLORS,
  getCommandOfWeek,
  type TrendingCommand,
  type CommandCategory,
} from "@/lib/trending-commands";
import { GENERATORS } from "@/lib/generators";
import { ALL_ROADMAPS } from "@/lib/roadmaps";
import { ALL_GLOSSARY } from "@/lib/glossary";
import { COLLECTIONS } from "@/lib/collections";
import { resourcesBySection } from "@/lib/resources";

/* ═══════════════════════════════════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════════════════════════════════ */
type FilterTab = "All" | "Commands" | "Resources" | "Generators" | "Roadmaps" | "Glossary" | "Collections";
const TABS: FilterTab[] = ["All", "Commands", "Resources", "Generators", "Roadmaps", "Glossary", "Collections"];

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
      className={`copy-feedback flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${className}`}
      style={{
        background: copied ? "rgba(63,185,80,0.15)" : "#21262d",
        border: `1px solid ${copied ? "rgba(63,185,80,0.3)" : "#30363d"}`,
        color: copied ? "#3fb950" : "#e6edf3",
      }}
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
            <span className="inline-block size-2 rounded-full" style={{ background: CATEGORY_DOT_COLORS[cmd.category] }} />
            Command of the Week
          </span>
          <h2 className="mt-3 font-mono text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">
            {cmd.command}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#8b949e]">{cmd.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cmd.worksIn.map((w) => (
              <span key={w} className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]">{w}</span>
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
function CommandCard({ cmd }: { cmd: TrendingCommand }) {
  return (
    <article className="flex flex-col rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full" style={{ background: CATEGORY_DOT_COLORS[cmd.category] }} />
        <span className="text-[11px] text-[#8b949e]">{cmd.category}</span>
      </div>
      <code className="font-mono text-[20px] font-bold tracking-tight text-[#e6edf3]">{cmd.command}</code>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#8b949e]">{cmd.description}</p>
      <div className="mt-auto flex flex-wrap gap-1 pt-2">
        {cmd.worksIn.map((w) => (
          <span key={w} className="rounded-md border border-[#30363d] bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">{w}</span>
        ))}
      </div>
      <div className="mt-3">
        <CopyBtn text={cmd.command} className="w-full justify-center" />
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending on SlashAI" },
      {
        name: "description",
        content: "What people are copying, saving and building with right now — commands, resources, generators, roadmaps, glossary.",
      },
    ],
  }),
  component: TrendingPage,
});

function TrendingPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [activeCategory, setActiveCategory] = useState<CommandCategory | "All">("All");

  /* data */
  const topCommands = useMemo(() => {
    if (activeCategory === "All") return TRENDING_COMMANDS.slice(0, 12);
    return TRENDING_COMMANDS.filter((c) => c.category === activeCategory).slice(0, 12);
  }, [activeCategory]);

  const popularResources = useMemo(() => {
    const apis = resourcesBySection("free-apis");
    const ai = resourcesBySection("ai");
    const tools = resourcesBySection("free-tools");
    return [...ai.slice(0, 3), ...apis.slice(0, 3), ...tools.slice(0, 2)].slice(0, 8);
  }, []);

  const glossarySpotlight = useMemo(() => {
    const seed = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return ALL_GLOSSARY.filter((_, i) => i % 7 === seed % 7).slice(0, 6);
  }, []);

  const showSection = (tab: FilterTab) => activeTab === "All" || activeTab === tab;

  return (
    <AppShell wide hideHeaderSearch title="Trending">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Trending on SlashAI</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What people are copying, saving and building with right now.
        </p>
      </header>

      {/* Command of the Week */}
      {showSection("Commands") && (
        <div className="mt-5"><CommandOfTheWeek /></div>
      )}

      {/* Filter tabs */}
      <div className="sticky top-0 z-30 -mx-4 mt-4 overflow-x-auto border-b border-border bg-background/90 px-4 pb-2 pt-2 backdrop-blur-md scrollbar-none">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{
                borderColor: activeTab === tab ? "rgba(88,166,255,0.4)" : "#30363d",
                background: activeTab === tab ? "rgba(88,166,255,0.15)" : "#21262d",
                color: activeTab === tab ? "#58a6ff" : "#8b949e",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ──────── Section: Trending /commands ──────── */}
      {showSection("Commands") && (
        <section className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Trending /commands</h2>
            <Link to="/trending" className="text-xs font-medium text-primary hover:underline">See all →</Link>
          </div>

          {/* Category filter pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150"
              style={{
                borderColor: activeCategory === "All" ? "rgba(88,166,255,0.4)" : "#30363d",
                background: activeCategory === "All" ? "rgba(88,166,255,0.15)" : "#21262d",
                color: activeCategory === "All" ? "#58a6ff" : "#8b949e",
              }}
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
                  className="flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150"
                  style={{
                    borderColor: activeCategory === cat ? "rgba(88,166,255,0.4)" : "#30363d",
                    background: activeCategory === cat ? "rgba(88,166,255,0.15)" : "#21262d",
                    color: activeCategory === cat ? "#58a6ff" : "#8b949e",
                  }}
                >
                  <span className="size-2 rounded-full" style={{ background: CATEGORY_DOT_COLORS[cat] }} />
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topCommands.map((cmd) => (
              <CommandCard key={cmd.slug} cmd={cmd} />
            ))}
          </div>
        </section>
      )}

      {/* ──────── Section: Trending Resources ──────── */}
      {showSection("Resources") && (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Trending Resources</h2>
            <Link to="/discover" className="text-xs font-medium text-primary hover:underline">See all resources →</Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {popularResources.map((r) => (
              <ResourceCardEnhanced key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {/* ──────── Section: Trending Generators ──────── */}
      {showSection("Generators") && (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Founder Generators</h2>
            <Link to="/generators" className="text-xs font-medium text-primary hover:underline">Use a generator →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {GENERATORS.slice(0, 10).map((gen) => (
              <Link
                key={gen.id}
                to="/generators/$id"
                params={{ id: gen.id }}
                className="group flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="text-[24px]">{gen.emoji}</span>
                <p className="mt-2 text-[14px] font-semibold text-foreground group-hover:text-primary">{gen.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{gen.tagline}</p>
                <span className="mt-auto pt-3 inline-flex h-8 items-center justify-center rounded-md border text-[11px] font-medium transition-colors" style={{ borderColor: "#58a6ff40", color: "#58a6ff" }}>
                  Use →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ──────── Section: Trending Roadmaps ──────── */}
      {showSection("Roadmaps") && (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Founder Roadmaps</h2>
            <Link to="/roadmaps" className="text-xs font-medium text-primary hover:underline">See all roadmaps →</Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_ROADMAPS.slice(0, 6).map((rm) => {
              const totalSteps = rm.phases.reduce((sum, p) => sum + p.steps.length, 0);
              return (
                <Link
                  key={rm.id}
                  to="/roadmaps"
                  className="group flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <p className="text-[15px] font-semibold text-foreground group-hover:text-primary">{rm.title}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{rm.tagline}</p>
                  <p className="mt-2 text-[12px] text-muted-foreground">
                    {totalSteps} steps \u00b7 {rm.phases.length} phases \u00b7 {rm.duration}
                  </p>
                  <span className="mt-3 inline-flex h-9 items-center justify-center rounded-md border text-[12px] font-medium transition-colors" style={{ borderColor: "#58a6ff40", color: "#58a6ff" }}>
                    Follow →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ──────── Section: Glossary Spotlight ──────── */}
      {showSection("Glossary") && (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Glossary Spotlight</h2>
            <Link to="/glossary" className="text-xs font-medium text-primary hover:underline">Explore all {ALL_GLOSSARY.length} terms →</Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {glossarySpotlight.map((term) => (
              <Link
                key={term.term}
                to="/glossary"
                className="group rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <code className="font-mono text-[16px] font-bold text-[#58a6ff]">{term.term}</code>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{term.category}</p>
                <p className="mt-1.5 line-clamp-2 text-[12px] text-muted-foreground">{term.def}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ──────── Section: Popular Collections ──────── */}
      {showSection("Collections") && (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Popular Collections</h2>
            <Link to="/collections" className="text-xs font-medium text-primary hover:underline">See all collections →</Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLLECTIONS.slice(0, 6).map((col) => (
              <Link
                key={col.id}
                to="/collections/$id"
                params={{ id: col.id }}
                className="flex items-center gap-2 rounded-md border bg-[#21262d] px-4 py-2.5 text-[13px] font-medium text-[#e6edf3] transition-colors hover:border-[#58a6ff40]"
                style={{ borderColor: "#30363d" }}
              >
                <span className="text-[18px]">{col.icon}</span>
                {col.title}
                <span className="ml-1 rounded bg-[#30363d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">{col.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ──────── Section: From the Live Dashboard ──────── */}
      {showSection("All") && (
        <section className="mt-7 mb-8">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">From the Live Dashboard</h2>
            <Link to="/live" className="text-xs font-medium text-primary hover:underline">Open Live Dashboard →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: "NIFTY 50", value: "Loading\u2026", color: "#3fb950" },
              { label: "BTC/INR", value: "Loading\u2026", color: "#f0b90b" },
              { label: "Next Prayer", value: "Fajr", color: "#58a6ff" },
              { label: "Weather", value: "Hyderabad", color: "#d29922" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 text-center">
                <p className="text-[11px] text-[#8b949e]">{stat.label}</p>
                <p className="mt-1 text-[20px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
