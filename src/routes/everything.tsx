import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { UniversalSearch } from "@/components/library/UniversalSearch";
import { SLASH_APPS } from "@/lib/slashbar";
import { TOOL_SECTIONS, ALL_SLASH_TOOLS, SLASH_TOOL_COUNT } from "@/lib/slashkits";
import { PLAY_SECTIONS, ALL_PLAY_GAMES, PLAY_GAME_COUNT } from "@/lib/slashplay";
import { VERIFIED_TOTAL } from "@/lib/commands";
import { RESOURCE_TOTAL } from "@/lib/resources";

export const Route = createFileRoute("/everything")({
  head: () => ({
    meta: [
      {
        title: "Explore Everything - every SlashAI app, tool and game on one page | SlashAI",
      },
      {
        name: "description",
        content:
          "One page with everything SlashAI has: 26 Slash apps, 140+ browser tools, 47 games, hubs, commands and live dashboards. All free, no account.",
      },
    ],
  }),
  component: ExploreEverything,
});

const HUBS = [
  { to: "/hub/students", emoji: "🎓", label: "Student Hub" },
  { to: "/hub/developers", emoji: "💻", label: "Developer Hub" },
  { to: "/hub/creators", emoji: "🎨", label: "Creator Hub" },
  { to: "/hub/professionals", emoji: "💼", label: "Professional Hub" },
  { to: "/hub/founders", emoji: "🚀", label: "Founders Hub" },
  { to: "/hub/india", emoji: "🇮🇳", label: "India Hub" },
  { to: "/hub/designers", emoji: "🖌️", label: "Designers Hub" },
  { to: "/hub/finance", emoji: "💰", label: "Finance Hub" },
  { to: "/hub/health", emoji: "🏥", label: "Health Hub" },
  { to: "/hub/fun", emoji: "🎉", label: "Fun Sites" },
  { to: "/hub/islam", emoji: "☪️", label: "Islam Hub" },
  { to: "/hub/urdu", emoji: "📖", label: "Urdu Hub" },
  { to: "/hub/quotes", emoji: "❝", label: "Quotes Hub" },
  { to: "/hub/arabic", emoji: "🕌", label: "Arabic Hub" },
];

const MORE = [
  { to: "/explore", emoji: "⌨️", label: "AI Commands", desc: `${VERIFIED_TOTAL.toLocaleString()} copy-ready prompts` },
  { to: "/ai-tools", emoji: "🤖", label: "AI Tools", desc: "100+ curated AI directory" },
  { to: "/workflow", emoji: "🔗", label: "AI Workflows", desc: "Chain commands into one prompt" },
  { to: "/discover", emoji: "🧭", label: "Discovery", desc: `${RESOURCE_TOTAL}+ free resources` },
  { to: "/web-search", emoji: "🌐", label: "Search Engine", desc: "Free meta search, zero tracking" },
  { to: "/live", emoji: "📡", label: "Live Dashboard", desc: "Markets, weather, prayer, space" },
  { to: "/quiz", emoji: "🧠", label: "Daily Quiz", desc: "24 categories, streaks" },
  { to: "/roadmaps", emoji: "🗺️", label: "Roadmaps", desc: "Founder step-by-step guides" },
  { to: "/glossary", emoji: "📖", label: "Glossary", desc: "AI & startup terms" },
  { to: "/journal", emoji: "📝", label: "Journal", desc: "Build log, streaks, badges" },
  { to: "/trending", emoji: "🔥", label: "Trending", desc: "What's hot right now" },
  { to: "/promo", emoji: "📣", label: "About SlashAI", desc: "What this site is, in one page" },
  { to: "/random", emoji: "🎲", label: "Random", desc: "One tap, anywhere" },
];

function matches(q: string, ...text: string[]) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return text.join(" ").toLowerCase().includes(needle);
}

function ExploreEverything() {
  const [filter, setFilter] = useState("");
  const q = filter;
  const filtered = useMemo(() => q.trim().length > 0, [q]);

  const apps = SLASH_APPS.filter((a) => matches(q, a.name, a.desc));
  const gameSections = PLAY_SECTIONS.map((s) => ({
    ...s,
    games: s.games.filter((g) => matches(q, g.name, g.desc)),
  })).filter((s) => s.games.length > 0);
  const kitSections = TOOL_SECTIONS.map((s) => ({
    ...s,
    tools: [...s.tools, ...(s.hubTools ?? [])].filter((t) => matches(q, t.name, t.desc)),
  })).filter((s) => s.tools.length > 0);
  const hubs = HUBS.filter((h) => matches(q, h.label));
  const more = MORE.filter((m) => matches(q, m.label, m.desc));

  const totalVisible =
    apps.length +
    gameSections.reduce((a, s) => a + s.games.length, 0) +
    kitSections.reduce((a, s) => a + s.tools.length, 0) +
    hubs.length +
    more.length;

  return (
    <AppShell wide hideHeaderSearch title="Explore Everything">
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#2dd4bf] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          🧭 Everything
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every app, tool, game and hub in one place — {SLASH_APPS.length} Slash apps ·{" "}
          {SLASH_TOOL_COUNT}+ tools · {PLAY_GAME_COUNT} games · all free.
        </p>
      </header>

      {/* the universal search, top of the page */}
      <div className="relative z-30 mt-4 max-w-[560px]">
        <UniversalSearch size="lg" />
      </div>

      {/* page filter */}
      <div className="relative mt-3 max-w-[560px]">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter this page by name…"
          aria-label="Filter this page"
          className="h-10 w-full rounded-xl border border-border bg-surface pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        {filter && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => setFilter("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {filtered && (
        <p className="mt-2 text-xs text-muted-foreground">{totalVisible} items on this page match “{q.trim()}”</p>
      )}

      {/* ─── Slash apps ─── */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">⚡ Slash apps</h2>
        <div className="cat-rule mt-1.5 w-24" />
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {apps.map((app) => (
            <Link
              key={app.slug}
              to={app.link ?? "/slash/$app"}
              params={app.link ? undefined : { app: app.slug }}
              style={{ "--cat": app.tint.hex } as React.CSSProperties}
              className="cat cat-glow ripple-press flex items-start gap-3 rounded-xl border bg-surface p-3.5"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl text-[20px]"
                style={{ background: `color-mix(in oklab, ${app.tint.hex} 14%, transparent)` }}
              >
                {app.emoji}
              </span>
              <span className="min-w-0">
                <span className="cat-text block truncate text-[13.5px] font-bold">{app.name}</span>
                <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-snug text-muted-foreground">
                  {app.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SlashPlay games ─── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
          🎮 SlashPlay — {PLAY_GAME_COUNT} games
        </h2>
        <div className="cat-rule mt-1.5 w-24" />
        {gameSections.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No games match “{q.trim()}”.</p>
        ) : (
          gameSections.map((s) => (
            <div key={s.title} className="mt-4">
              <h3 className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
                {s.icon} {s.title}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {s.games.map((g) => (
                  <Link
                    key={g.slug}
                    to="/play/$game"
                    params={{ game: g.slug }}
                    className="ripple-press flex items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span className="text-[20px]">{g.icon}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-foreground">{g.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{g.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
        <Link to="/play" className="mt-3 inline-block text-[12.5px] font-semibold text-primary hover:underline">
          Open SlashPlay →
        </Link>
      </section>

      {/* ─── SlashKits tools ─── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
          🧰 SlashKits — {SLASH_TOOL_COUNT}+ tools
        </h2>
        <div className="cat-rule mt-1.5 w-24" />
        {kitSections.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No tools match “{q.trim()}”.</p>
        ) : (
          kitSections.map((s) => (
            <div key={s.title} className="mt-4">
              <h3 className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
                {s.icon} {s.title}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {s.tools.map((t) => (
                  <Link
                    key={t.slug}
                    to={t.slug.startsWith("/") ? t.slug : `/tools/${t.slug}`}
                    className="ripple-press flex items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span className="text-[20px]">{t.icon}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-foreground">{t.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{t.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
        <Link to="/tools" className="mt-3 inline-block text-[12.5px] font-semibold text-primary hover:underline">
          Open SlashKits →
        </Link>
      </section>

      {/* ─── Hubs ─── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">🗂️ Hubs</h2>
        <div className="cat-rule mt-1.5 w-24" />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {hubs.map((h) => (
            <Link
              key={h.to}
              to={h.to}
              className="ripple-press flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="text-[22px]">{h.emoji}</span>
              <span className="truncate text-[13px] font-semibold text-foreground">{h.label}</span>
            </Link>
          ))}
        </div>
        <Link to="/hub" className="mt-3 inline-block text-[12.5px] font-semibold text-primary hover:underline">
          Open Hubs →
        </Link>
      </section>

      {/* ─── More ─── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">✨ More to explore</h2>
        <div className="cat-rule mt-1.5 w-24" />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {more.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="ripple-press flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="text-[22px]">{m.emoji}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-foreground">{m.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{m.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-[11px] text-muted-foreground">
        {ALL_SLASH_TOOLS.length > 0
          ? `${ALL_SLASH_TOOLS.length} entries listed · everything runs in your browser · free forever`
          : ""}
      </p>
    </AppShell>
  );
}
