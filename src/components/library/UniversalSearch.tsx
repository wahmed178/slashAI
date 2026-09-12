import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Command as CommandIcon, Wrench, Gamepad2, Globe, ArrowRight } from "lucide-react";

import { VoiceSearchButton } from "./VoiceSearchButton";
import { Highlight } from "./Highlight";
import { useLibrary } from "@/hooks/use-library";
import { suggestions, VERIFIED_TOTAL, CATEGORY_ICONS } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { ALL_PLAY_GAMES } from "@/lib/slashplay";
import { cn } from "@/lib/utils";

export interface UniversalSugg {
  kind: "command" | "tool" | "game" | "web";
  id: string;
  label: string;
  sub: string;
  icon: string;
  to: string;
  mono?: boolean;
}

interface Props {
  size?: "md" | "lg";
  /** start with this query already typed and the panel open */
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
}

const KIND_STYLE: Record<UniversalSugg["kind"], { chip: string; Icon: typeof CommandIcon }> = {
  command: { chip: "text-primary", Icon: CommandIcon },
  tool: { chip: "text-emerald-400", Icon: Wrench },
  game: { chip: "text-fuchsia-400", Icon: Gamepad2 },
  web: { chip: "text-muted-foreground", Icon: Globe },
};

/** Build the unified result list for a query: commands + tools + games + web. */
export function universalResults(q: string): UniversalSugg[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const out: UniversalSugg[] = [];

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

  out.push({
    kind: "web",
    id: "web",
    label: `Search the web for "${q.trim()}"`,
    sub: "Free results - opens the Slash search engine",
    icon: "🌐",
    to: `/web-search?q=${encodeURIComponent(q.trim())}`,
  });

  return out;
}

/**
 * The one universal search: live results across commands, tools, games and
 * the web. Used on the homepage hero and on /tools/finder.
 */
export function UniversalSearch({ size = "md", initialQuery, autoFocus, className }: Props) {
  const navigate = useNavigate();
  const { recentSearches, recordSearch } = useLibrary();
  const [q, setQ] = useState(initialQuery ?? "");
  const [open, setOpen] = useState(Boolean(initialQuery));
  const [active, setActive] = useState(0);
  const [voiceInterim, setVoiceInterim] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // "/" or Ctrl/Cmd-K focuses search
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

  // click outside closes
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const results = useMemo(() => universalResults(q), [q]);

  useEffect(() => setActive(0), [q]);

  const go = (s: UniversalSugg) => {
    setOpen(false);
    recordSearch(q.trim());
    if (s.kind === "web") {
      window.location.assign(s.to);
      return;
    }
    void navigate({ to: s.to });
  };

  const submitAll = () => {
    if (!q.trim()) return;
    recordSearch(q.trim());
    void navigate({ to: "/tools/finder", search: { q: q.trim() } });
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
      else submitAll();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const h = size === "lg" ? "h-[52px]" : "h-11";
  const text = size === "lg" ? "text-[15px]" : "text-sm";
  const icon = size === "lg" ? "size-5" : "size-4";

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-surface px-4 transition-colors",
          h,
          open && q ? "border-primary/70" : "border-border",
        )}
      >
        <Search className={cn(icon, "shrink-0 text-muted-foreground")} aria-hidden />
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
          autoFocus={autoFocus}
          placeholder={`Search ${VERIFIED_TOTAL.toLocaleString()} commands, tools, games…`}
          className={cn("min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground", text)}
        />
        <VoiceSearchButton
          size="sm"
          onInterim={(t) => {
            setVoiceInterim(t);
            setVoiceActive(true);
          }}
          onResult={(t) => {
            setVoiceInterim("");
            setVoiceActive(false);
            setQ(t);
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

      {/* live results panel */}
      {open && q.trim() && (
        <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-1">
          {results.length === 1 && results[0]!.kind === "web" && (
            <p className="px-4 pb-1 pt-2 text-center text-[12px] text-muted-foreground">
              Nothing in the library matched “{q.trim()}” - the web is one tap away.
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
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-elevated text-[13px]">{s.icon}</span>
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
          {/* full results link */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submitAll}
            className="mt-0.5 flex w-full items-center justify-center gap-1.5 border-t border-border px-3 py-2.5 text-[12.5px] font-semibold text-primary transition-colors hover:bg-accent"
          >
            See everything matching “{q.trim().length > 24 ? q.trim().slice(0, 24) + "…" : q.trim()}”
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}

      {/* recent searches when empty */}
      {open && !q.trim() && recentSearches.length > 0 && (
        <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-2">
          <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
          {recentSearches.slice(0, 5).map((term) => (
            <button
              key={term}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQ(term);
                setOpen(true);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent"
            >
              <span className="text-xs text-muted-foreground">🕘</span>
              <span className="truncate text-xs text-foreground">{term}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
