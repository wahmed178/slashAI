import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X, Command as CommandIcon, Wrench, Gamepad2, Globe, ArrowRight } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { VoiceSearchButton } from "@/components/library/VoiceSearchButton";
import { useLibrary } from "@/hooks/use-library";
import { suggestions, VERIFIED_TOTAL, CATEGORY_ICONS } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { ALL_PLAY_GAMES } from "@/lib/slashplay";
import { Highlight } from "@/components/library/Highlight";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/finder")({
  validateSearch: (raw: Record<string, unknown>) => ({
    q: typeof raw["q"] === "string" ? raw["q"] : "",
  }),
  component: ToolFinder,
});

interface Sugg {
  kind: "command" | "tool" | "game" | "web";
  id: string;
  label: string;
  sub: string;
  icon: string;
  to: string;
  mono?: boolean;
}

const WEB_SHORTCUTS: { test: RegExp; label: string; to: string }[] = [
  { test: /\b(image|images|photo|png|jpg|wallpaper)\b/i, label: "Search images", to: "https://duckduckgo.com/?q=SEARCH&iax=images&ia=images" },
  { test: /\b(video|youtube|watch|tutorial|song|movie)\b/i, label: "Search videos", to: "https://duckduckgo.com/?q=SEARCH&iax=videos&ia=videos" },
  { test: /\b(news|latest|update)\b/i, label: "Search news", to: "https://duckduckgo.com/?q=SEARCH&iar=news&ia=news" },
];

function ToolFinder() {
  const { q: initialQ } = Route.useSearch();
  const { recentSearches, recordSearch } = useLibrary();
  const [q, setQ] = useState(initialQ ?? "");
  const [seeded] = useState(Boolean(initialQ));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [voiceInterim, setVoiceInterim] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // keyboard shortcut: "/" or Ctrl/Cmd-K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside closes the panel
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // arrive with ?q= → panel open and search recorded
  useEffect(() => {
    if (seeded && initialQ) {
      setOpen(true);
      recordSearch(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results: Sugg[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const out: Sugg[] = [];

    // 1) commands (up to 5)
    for (const c of suggestions(q, 5)) {
      out.push({
        kind: "command",
        id: `c-${c.id}`,
        label: c.command,
        sub: c.title,
        icon: CATEGORY_ICONS[c.category] ?? "⌨️",
        to: `/c/${c.id}`,
        mono: true,
      });
    }

    // 2) tools (up to 4)
    const ql = query.replace(/\s+/g, " ");
    const tools = ALL_SLASH_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(ql) ||
        t.desc.toLowerCase().includes(ql) ||
        t.slug.toLowerCase().includes(ql.replace(/\s/g, "-")),
    ).slice(0, 4);
    for (const t of tools) {
      out.push({
        kind: "tool",
        id: `t-${t.slug}`,
        label: t.name,
        sub: t.desc,
        icon: t.icon,
        to: t.hub ? t.slug : `/tools/${t.slug}`,
      });
    }

    // 3) games (up to 3)
    const games = ALL_PLAY_GAMES.filter(
      (g) => g.name.toLowerCase().includes(ql) || g.desc.toLowerCase().includes(ql),
    ).slice(0, 3);
    for (const g of games) {
      out.push({
        kind: "game",
        id: `g-${g.slug}`,
        label: g.name,
        sub: g.desc,
        icon: g.icon,
        to: `/play/${g.slug}`,
      });
    }

    // 4) one web-search escape hatch
    out.push({
      kind: "web",
      id: "web",
      label: `Search the web for "${q.trim()}"`,
      sub: "Free results - opens in a new tab",
      icon: "🌐",
      to: `/web-search?q=${encodeURIComponent(q.trim())}`,
    });

    return out;
  }, [q]);

  useEffect(() => setActive(0), [q]);

  const go = (s: Sugg) => {
    setOpen(false);
    if (s.kind === "web") {
      window.location.href = s.to;
      return;
    }
    window.location.assign(s.to);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const KIND_STYLE: Record<Sugg["kind"], { chip: string; Icon: typeof CommandIcon }> = {
    command: { chip: "text-primary", Icon: CommandIcon },
    tool: { chip: "text-emerald-400", Icon: Wrench },
    game: { chip: "text-fuchsia-400", Icon: Gamepad2 },
    web: { chip: "text-muted-foreground", Icon: Globe },
  };

  return (
    <AppShell wide hideHeaderSearch title="Find Anything">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">🔍 Find Anything</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          One search across {VERIFIED_TOTAL.toLocaleString()} commands, {ALL_SLASH_TOOLS.length} tools, {ALL_PLAY_GAMES.length} games - and the web.
        </p>
      </header>

      <div ref={boxRef} className="relative mx-auto mt-6 max-w-2xl">
        <div
          className={cn(
            "flex h-[52px] items-center gap-3 rounded-xl border bg-surface px-4 transition-colors",
            open ? "border-primary/70" : "border-border",
          )}
        >
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={voiceActive && voiceInterim ? voiceInterim : q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
            type="text"
            role="searchbox"
            aria-label="Search everything"
            placeholder="Search commands, tools, games… or anything"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <VoiceSearchButton
            size="sm"
            onInterim={(t) => {
              setVoiceInterim(t);
              setVoiceActive(true);
            }}
            onResult={(text) => {
              setVoiceInterim("");
              setVoiceActive(false);
              setQ(text);
              setOpen(true);
            }}
          />
          {q && !voiceActive && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* suggestion panel */}
        {open && q.trim() && (
          <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-1">
            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nothing matched “{q.trim()}” - try the web search below.
              </p>
            )}
            {results.map((s, i) => {
              const { chip, Icon } = KIND_STYLE[s.kind];
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(s)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    i === active ? "bg-accent" : "",
                  )}
                >
                  {s.kind === "command" ? (
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-elevated text-[13px]">{s.icon}</span>
                  ) : (
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-elevated text-[13px]">{s.icon}</span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[13.5px] font-semibold text-foreground", s.mono && "font-mono")}>
                      <Highlight text={s.label} query={q} />
                    </span>
                    <span className="block truncate text-[12px] text-muted-foreground">{s.sub}</span>
                  </span>
                  <Icon className={cn("size-3.5 shrink-0", chip)} />
                </button>
              );
            })}
          </div>
        )}

        {/* recent searches when empty */}
        {open && !q.trim() && recentSearches.length > 0 && (
          <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-2">
            <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
            {recentSearches.slice(0, 6).map((term) => (
              <button
                key={term}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQ(term);
                  setOpen(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-accent"
              >
                <span className="text-xs text-muted-foreground">🕘</span>
                <span className="truncate text-xs text-foreground">{term}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* quick idea chips */}
      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {[
          { label: "🎯 password-game", to: "/play/password-game" },
          { label: "🖼️ image compressor", to: "/tools/image-compress" },
          { label: "💰 SIP calculator", to: "/tools/sip-calculator" },
          { label: "🧠 daily quiz", to: "/quiz" },
          { label: "📌 QR code", to: "/tools/qr-code" },
          { label: "🐍 snake", to: "/play/snake" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* deep links */}
      <div className="mx-auto mt-10 grid max-w-2xl gap-2 sm:grid-cols-3">
        {[
          { to: "/search", icon: "⌨️", title: "Command search", desc: "Filters, categories, 45 topics" },
          { to: "/tools", icon: "🧰", title: "Browse all tools", desc: "The full SlashKits library" },
          { to: "/web-search", icon: "🌐", title: "Web search", desc: "Free results, category pickers" },
        ].map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
          >
            <span className="text-[22px]">{d.icon}</span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold text-foreground">{d.title}</span>
              <span className="block truncate text-[12px] text-muted-foreground">{d.desc}</span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
