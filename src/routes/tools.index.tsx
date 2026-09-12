import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { X, Search, Star, StarOff } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import {
  TOOL_SECTIONS,
  SLASH_TOOL_COUNT,
  toolOfTheDay,
  type SlashTool,
} from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";
import { RANDOM_POOL_SIZE } from "@/lib/random-pick";
import { kitSectionColor } from "@/lib/category-colors";
import { useLibrary } from "@/hooks/use-library";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: `SlashKits - ${SLASH_TOOL_COUNT} free browser tools | SlashAI` },
      {
        name: "description",
        content: `SlashKits: ${SLASH_TOOL_COUNT} free browser tools - image compress, calculators, noise, tasbeeh, timers, screensavers. No upload, no account.`,
      },
    ],
  }),
  component: ToolsIndex,
});

const FILTERS = ["All", ...TOOL_SECTIONS.map((s) => s.title)] as const;

type FilterType = (typeof FILTERS)[number];

const DAY_TOOL = toolOfTheDay();

function matches(tool: SlashTool, q: string) {
  const text = `${tool.name} ${tool.desc}`.toLowerCase();
  return q.split(/\s+/).every((word) => text.includes(word));
}

// Pre-render the section list so the count badge is available at build time
const TOOL_SECTIONS_PRERENDER = TOOL_SECTIONS;

function ToolsIndex() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const { toolFavorites, isToolFavorite, toggleToolFavorite } = useLibrary();

  const visibleSections = filter === "All" ? TOOL_SECTIONS_PRERENDER : TOOL_SECTIONS_PRERENDER.filter((s) => s.title === filter);

  // count matching tools across every visible section (or globally while searching)
  const matchingTools = !q
    ? visibleSections.flatMap((s) => s.tools)
    : TOOL_SECTIONS.flatMap((s) => s.tools).filter((t) => matches(t, q));
  const foundCount = q ? TOOL_SECTIONS.reduce((acc, s) => acc + [...s.tools, ...(s.hubTools ?? [])].filter((t) => matches(t, q)).length, 0) : matchingTools.length;

  return (
    <AppShell wide title="SlashKits">
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#2dd4bf] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          SlashKits
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {SLASH_TOOL_COUNT}+ free browser tools — calculators, converters, file tools and more.
          Nothing uploads. No account needed. <span className="text-[12px] font-semibold">All free · Works offline</span>
        </p>
      </header>

      <Link
        to="/random"
        search={{ go: true }}
        className="group mt-3 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[16px] transition-transform duration-150 group-hover:rotate-12">🎲</span>
        <span className="min-w-0">
          <span className="block text-[13px] font-bold text-foreground">Feeling lucky?</span>
          <span className="block text-[11px] text-muted-foreground">One tap to a random tool - from all {RANDOM_POOL_SIZE} destinations</span>
        </span>
        <span className="ml-auto shrink-0 text-[11px] font-semibold text-primary">Roll the dice →</span>
      </Link>

      {/* SlashPlay cross-link - tinted with the Multiplayer colour */}
      <Link
        to="/play"
        className="mt-4 flex items-center gap-3 overflow-hidden rounded-xl border p-4 transition-colors"
        style={{
          borderColor: "rgba(251,113,133,0.28)",
          background: "linear-gradient(135deg, rgba(251,113,133,0.09), rgba(168,85,247,0.07))",
        }}
      >
        <span className="text-[26px]">🎮</span>
        <span className="flex-1">
          <span className="block text-[14px] font-bold text-foreground">Looking for games?</span>
          <span className="block text-[12px] text-muted-foreground">SlashPlay has {PLAY_GAME_COUNT} of them - tic tac toe, battleship, blackjack, snake and more.</span>
        </span>
        <span className="text-[12px] font-bold" style={{ color: "#fb7185" }}>Play →</span>
      </Link>

      {/* Tool of the Day - rotates on a daily date seed */}
      <div
        className="mt-4 overflow-hidden rounded-xl border p-4 sm:p-5"
        style={{
          borderColor: "rgba(251,191,36,0.3)",
          background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(244,114,182,0.06))",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">⭐</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#fbbf24" }}>Tool of the Day</span>
          <span className="text-[10px] text-muted-foreground">· changes daily</span>
        </div>
        <div className="mt-2.5 flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface text-3xl">{DAY_TOOL.icon}</span>
          <div className="flex-1">
            <span className="block text-[16px] font-bold text-foreground">{DAY_TOOL.name}</span>
            <span className="mt-0.5 block text-[13px] text-muted-foreground">{DAY_TOOL.desc}</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">100% Free</span>
              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">Browser only</span>
            </div>
            <a href={`/tools/${DAY_TOOL.slug}`} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-background transition-colors hover:bg-primary/90">
              Try it now →
            </a>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools by name or use case…"
          aria-label="Search tools"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {q && (
        <p className="mt-2 text-xs text-muted-foreground">
          {foundCount === 1 ? "1 tool found" : `${foundCount} tools found`}
          {filter !== "All" ? ` in ${filter}` : ""}
        </p>
      )}

      {/* Filter chips - the active chip takes its section colour */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => {
          const cc = f === "All" ? undefined : kitSectionColor(f);
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={
                active && cc
                  ? { background: cc.hex, borderColor: cc.hex, color: "oklch(0.15 0.02 255)" }
                  : undefined
              }
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                active
                  ? "bg-primary text-background"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "All" ? `All (${SLASH_TOOL_COUNT})` : `${TOOL_SECTIONS.find((s) => s.title === f)?.icon} ${f}`}
            </button>
          );
        })}
      </div>

      {/* No matches while searching */}
      {q && foundCount === 0 && (
        <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm font-semibold text-foreground">
            No tools match “{search.trim()}”
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Try: compress / calculate / timer / Islamic</p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-border bg-surface-elevated px-4 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
          >
            Clear search
          </button>
        </div>
      )}

      {/* While searching, hide sections that have no matches; otherwise keep the normal category view */}
      {visibleSections
        .map((section) => {
          const tools = q
            ? [...section.tools, ...(section.hubTools || [])].filter((t) => matches(t, q))
            : [...section.tools, ...(section.hubTools || [])];
          return { section, tools };
        })
        .filter(({ tools }) => tools.length > 0)
        .map(({ section, tools }, si) => {
          const cc = kitSectionColor(section.title);
          return (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/[^a-z]/g, "")}
              className={si === 0 ? "mt-4" : "mt-10"}
              style={{ "--cat": cc.hex } as React.CSSProperties}
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase" style={{ color: cc.hex }}>
                <span className="text-lg">{section.icon}</span> {section.title}
              </h2>
              <div className="cat-rule mt-1.5 w-24" />
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`}
                    className="cat cat-glow group flex items-start gap-3 rounded-[10px] border bg-surface p-4"
                  >
                    <span className="cat-tile flex size-10 shrink-0 items-center justify-center rounded-lg text-[22px]">
                      {tool.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-foreground">
                          {tool.name}
                        </span>
                        <span className="cat-chip shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold">
                          Free
                        </span>
                        {tool.noUpload ? (
                          <span className="rounded border px-1.5 py-0.5 text-[9px] font-medium text-green" style={{ background: "rgba(63,185,80,0.08)", borderColor: "rgba(63,185,80,0.3)" }}>
                            No upload
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted-foreground line-clamp-1">
                        {tool.desc}
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleToolFavorite(tool.slug);
                        }}
                        aria-label={isToolFavorite(tool.slug) ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
                        className={`shrink-0 rounded-md p-1.5 transition-colors hover:text-foreground ${isToolFavorite(tool.slug) ? "text-amber-400" : "text-muted-foreground hover:text-amber-300"}`}
                      >
                        {isToolFavorite(tool.slug) ? (
                          <Star className="size-4 fill-current" />
                        ) : (
                          <StarOff className="size-4" />
                        )}
                      </button>
                      <span className="cat-text mt-1 shrink-0 text-[13px] transition-colors">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
    </AppShell>
  );
}
