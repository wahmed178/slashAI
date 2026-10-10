import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  X,
  Command as CommandIcon,
  Wrench,
  Gamepad2,
  Globe,
  Newspaper,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { VoiceSearchButton } from "./VoiceSearchButton";
import { Highlight } from "./Highlight";
import { useLibrary } from "@/hooks/use-library";
import { suggestions, CATEGORY_ICONS } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { ALL_PLAY_GAMES } from "@/lib/slashplay";
import { ALL_SLASH_APPS } from "@/lib/slashbar";
import { TOOLS as AI_TOOLS } from "@/lib/tools";
import { DECLARATIVE_TOOLS } from "@/lib/toolkit/catalog";
import { ALL_BLOG_POSTS } from "@/lib/blog-guides";
import { cn } from "@/lib/utils";

export type UniversalKind = "command" | "tool" | "aitool" | "game" | "app" | "blog" | "web";

export interface UniversalSugg {
  kind: UniversalKind;
  id: string;
  label: string;
  sub: string;
  icon: string;
  to: string;
  mono?: boolean;
  /** opens off-site in a new tab instead of routing inside the app */
  external?: boolean;
}

interface Props {
  size?: "md" | "lg";
  /** start with this query already typed and the panel open */
  initialQuery?: string | undefined;
  autoFocus?: boolean;
  className?: string;
}

const KIND_STYLE: Record<UniversalKind, { chip: string; Icon: LucideIcon; label: string }> = {
  command: { chip: "text-primary", Icon: CommandIcon, label: "Command" },
  tool: { chip: "text-emerald-400", Icon: Wrench, label: "Tool" },
  aitool: { chip: "text-sky-400", Icon: Sparkles, label: "AI tool" },
  game: { chip: "text-fuchsia-400", Icon: Gamepad2, label: "Game" },
  app: { chip: "text-amber-400", Icon: LayoutGrid, label: "App" },
  blog: { chip: "text-violet-400", Icon: Newspaper, label: "Guide" },
  web: { chip: "text-muted-foreground", Icon: Globe, label: "Web" },
};

/** How many of each kind the panel will ever show — no single kind can crowd the rest out. */
const PER_KIND: Record<UniversalKind, number> = {
  command: 6,
  tool: 4,
  aitool: 3,
  game: 3,
  app: 2,
  blog: 4,
  web: 1,
};

const PANEL_MAX = 14;

const UNIVERSAL_SEARCH_DEBOUNCE_MS = 120;

// Debounce the homepage search so `universalResults()` — the full catalogue
// scan across commands, tools, AI tools, games, apps, guides and web — only
// runs after the user pauses typing, never on every keystroke release.
function useDebouncedValue<T>(value: T, delayMs = UNIVERSAL_SEARCH_DEBOUNCE_MS): T {
  const [deferred, setDeferred] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDeferred(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return deferred;
}

/**
 * Memoize `universalResults` across renders so a given query string is scored
 * exactly once, even though the debounced value changes on every keystroke.
 *
 * The cache is bounded to the most recent 30 queries because the panel only
 * ever shows the top 14 rows and intermediate queries during a burst are the
 * ones that matter. Older entries fall out automatically.
 */
const UNIVERSAL_RESULTS_CACHE = new Map<string, UniversalSugg[]>();
const UNIVERSAL_CACHE_MAX = 30;

function cachedUniversalResults(q: string, compute: () => UniversalSugg[]): UniversalSugg[] {
  const hit = UNIVERSAL_RESULTS_CACHE.get(q);
  if (hit) return hit;
  const value = compute();
  if (UNIVERSAL_RESULTS_CACHE.size >= UNIVERSAL_CACHE_MAX) {
    const oldest = UNIVERSAL_RESULTS_CACHE.keys().next().value;
    if (oldest) UNIVERSAL_RESULTS_CACHE.delete(oldest);
  }
  UNIVERSAL_RESULTS_CACHE.set(q, value);
  return value;
}

/**
 * Score one catalogue item against the query.
 *
 * Name matches dominate; description/category/tag hits only break ties between
 * items that already matched on the query somewhere. Returns 0 for "no match",
 * so callers can just filter on truthiness.
 *
 * Performance: the `extras` are pre-lowercased by callers so we never allocate
 * on the hot path. `tokens` are already lowercased by the caller.
 */
function scoreItem(name: string, tokens: string[], whole: string, extras: string[]): number {
  let score = 0;
  let matched = 0;

  for (const t of tokens) {
    if (name === t) { score += 100; matched += 1; }
    else if (name.startsWith(t)) { score += 70; matched += 1; }
    else if (name.includes(t)) { score += 45; matched += 1; }
    else {
      for (let i = 0; i < extras.length; i++) {
        if (extras[i]!.includes(t)) { score += 16; matched += 1; break; }
      }
    }
  }

  if (matched === 0) return 0;

  // The full multi-word query landing inside the name is the strongest signal.
  if (tokens.length > 1 && name.includes(whole)) score += 60;
  // Reward matching more of what the user actually typed.
  score += matched * 10;

  return score;
}

const _emptyExtras: string[] = [];

/**
 * Build the unified result list for a query: commands, SlashKits and
 * declarative tools, AI tools, games, Slash apps, blog guides and the web.
 *
 * Everything is scored on one scale and sorted together, so an exact tool name
 * outranks a weak command hit and no single kind can monopolise the panel.
 */
export function universalResults(q: string): UniversalSugg[] {
  const whole = q.trim().toLowerCase();
  if (!whole) return [];
  const tokens = whole.split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length === 0) return [];

  const buckets = new Map<UniversalKind, { sugg: UniversalSugg; score: number }[]>();
  const push = (kind: UniversalKind, sugg: UniversalSugg, score: number) => {
    if (score <= 0) return;
    const list = buckets.get(kind) ?? [];
    list.push({ sugg, score });
    buckets.set(kind, list);
  };

  // ── Commands ────────────────────────────────────────────────────────────
  // suggestions() is the existing typo-tolerant matcher; we only need its top
  // slice, and we re-score them so an exact match elsewhere can outrank them.
  const commandHits = suggestions(q, PER_KIND.command);
  for (const c of commandHits) {
    const base = scoreItem(c.command, tokens, whole, [
      c.title.toLowerCase(),
      c.description.toLowerCase(),
      c.category.toLowerCase(),
      (c.subcategory ?? "").toLowerCase(),
      ...(c.tags ?? []).map((t) => t.toLowerCase()),
    ]);
    // A fuzzy match that never appears in the text still deserves to show,
    // but must sit below anything that matched by name.
    push(
      "command",
      {
        kind: "command",
        id: `c-${c.id}`,
        label: c.command,
        sub: c.title,
        icon: CATEGORY_ICONS[c.category] ?? "⌨️",
        to: `/c/${c.id}`,
        mono: true,
      },
      Math.max(base, 12) + 20,
    );
  }

  // ── SlashKits tools ─────────────────────────────────────────────────────
  for (const t of ALL_SLASH_TOOLS) {
    const s = scoreItem(t.name, tokens, whole, [t.desc.toLowerCase(), t.slug.toLowerCase()]);

    push(
      "tool",
      {
        kind: "tool",
        id: `t-${t.slug}`,
        label: t.name,
        sub: t.desc,
        icon: t.icon,
        to: t.hub ? t.slug : `/tools/${t.slug}`,
      },
      s,
    );
  }

  // ── Declarative tools (the other half of the /tools catalogue) ──────────
  for (const t of DECLARATIVE_TOOLS) {
    const s = scoreItem(t.name, tokens, whole, [t.desc.toLowerCase(), t.slug.toLowerCase(), t.section.toLowerCase()]);
    push(
      "tool",
      {
        kind: "tool",
        id: `td-${t.slug}`,
        label: t.name,
        sub: t.desc,
        icon: t.icon,
        to: `/tools/${t.slug}`,
      },
      s,
    );
  }

  // ── AI tools directory ──────────────────────────────────────────────────
  for (const t of AI_TOOLS) {
    const s = scoreItem(t.name, tokens, whole, [
      t.vendor.toLowerCase(),
      t.bestFor.toLowerCase(),
      t.category.toLowerCase(),
      ...t.tags.map((tg) => tg.toLowerCase()),
    ]);
    push(
      "aitool",
      {
        kind: "aitool",
        id: `a-${t.id}`,
        label: t.name,
        sub: `${t.vendor} · ${t.bestFor}`,
        icon: t.icon,
        to: t.url,
        external: true,
      },
      s,
    );
  }

  // ── Games ───────────────────────────────────────────────────────────────
  for (const g of ALL_PLAY_GAMES) {
    const s = scoreItem(g.name, tokens, whole, [g.desc.toLowerCase(), g.slug.toLowerCase()]);
    push(
      "game",
      {
        kind: "game",
        id: `g-${g.slug}`,
        label: g.name,
        sub: g.desc,
        icon: g.icon,
        to: `/play/${g.slug}`,
      },
      s,
    );
  }

  // ── Slash apps ──────────────────────────────────────────────────────────
  for (const a of ALL_SLASH_APPS) {
    const s = scoreItem(a.name, tokens, whole, [a.desc.toLowerCase(), a.slug.toLowerCase()]);
    push(
      "app",
      {
        kind: "app",
        id: `s-${a.slug}`,
        label: a.name,
        sub: a.desc,
        icon: a.emoji,
        to: a.link ?? `/slash/${a.slug}`,
      },
      s,
    );
  }

  // ── Blog guides ─────────────────────────────────────────────────────────
  for (const b of ALL_BLOG_POSTS) {
    const s = scoreItem(b.title, tokens, whole, [b.desc.toLowerCase(), b.tag.toLowerCase(), b.summary.toLowerCase()]);
    push(
      "blog",
      {
        kind: "blog",
        id: `b-${b.slug}`,
        label: b.title,
        sub: `${b.tag} · ${b.readTime}`,
        icon: b.emoji,
        to: `/blog/${b.slug}`,
      },
      s,
    );
  }

  // ── Merge: cap each kind, then rank everything together on one scale ────
  const capped: { sugg: UniversalSugg; score: number }[] = [];
  for (const [kind, list] of buckets) {
    list.sort((a, b) => b.score - a.score);
    capped.push(...list.slice(0, PER_KIND[kind]));
  }
  capped.sort((a, b) => b.score - a.score);
  return capped.slice(0, PANEL_MAX).map((c) => c.sugg);
}

/**
 * The one universal search: live results across commands, tools, AI tools,
 * games, apps, guides and the web. Used on the homepage hero and /tools/finder.
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

  const deferredQ = useDebouncedValue(q);
  const results = useMemo(
    () => cachedUniversalResults(deferredQ, () => universalResults(deferredQ)),
    [deferredQ],
  );

  useEffect(() => setActive(0), [q]);

  const go = (s: UniversalSugg) => {
    setOpen(false);
    recordSearch(q.trim());
    if (s.external) {
      window.open(s.to, "_blank", "noopener,noreferrer");
      return;
    }
    void navigate({ to: s.to });
  };

  const openFinder = () => {
    if (!q.trim()) return;
    recordSearch(q.trim());
    void navigate({ to: "/tools/finder", search: { q: q.trim() } });
  };

  const openCommandsOnly = () => {
    if (!q.trim()) return;
    recordSearch(q.trim());
    void navigate({
      to: "/search",
      search: { q: q.trim(), cat: "all", sub: "all", sort: "relevance" },
    });
  };

  // Third exit: hand the question to Slash Ask, which answers it with quoted
  // passages and citations instead of a list of links.
  const openAsk = () => {
    if (!q.trim()) return;
    recordSearch(q.trim());
    void navigate({ to: "/assistant", search: { q: q.trim() } });
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
      else openFinder();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const h = size === "lg" ? "h-[52px]" : "h-11";
  const text = size === "lg" ? "text-[15px]" : "text-sm";
  const icon = size === "lg" ? "size-5" : "size-4";
  const term = q.trim();
  const short = term.length > 24 ? term.slice(0, 24) + "…" : term;

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
          aria-label="Search commands, tools, AI tools, games and guides"
          autoFocus={autoFocus}
          placeholder={`Search commands, tools, AI tools, games…`}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            text,
          )}
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

      {/* live results panel.
          Deliberately no `key` on the panel: remounting it on every keystroke
          replayed the entrance animation across all rows, which is what made
          typing feel janky. */}
      {open && term && (
        <div className="panel animate-fade-in-up absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-1">
          {results.length === 0 && (
            <p className="px-4 py-3 text-center text-[12.5px] text-muted-foreground">
              Nothing in SlashAI matches “{short}”. Try a different word, or search the web.
            </p>
          )}
          {results.map((s, i) => {
            const { chip, Icon, label: kindLabel } = KIND_STYLE[s.kind];
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
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-elevated text-[13px]">
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[13.5px] font-semibold text-foreground",
                      s.mono && "font-mono",
                    )}
                  >
                    <Highlight text={s.label} query={term} />
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">{s.sub}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className={cn("hidden text-[10px] font-semibold sm:inline", chip)}>
                    {kindLabel}
                  </span>
                  <Icon className={cn("size-3.5 shrink-0", chip)} />
                </span>
              </button>
            );
          })}
          {/* two exits: the universal finder, or commands only */}
          <div className="mt-0.5 flex border-t border-border">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={openFinder}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold text-primary transition-colors hover:bg-accent"
            >
              See everything matching “{short}”
              <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={openCommandsOnly}
              className="flex items-center justify-center gap-1.5 border-l border-border px-3 py-2.5 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <CommandIcon className="size-3.5" aria-hidden />
              Commands only
            </button>
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openAsk}
            className="flex w-full items-center gap-1.5 border-t border-border px-3 py-2.5 text-left text-[12.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Sparkles className="size-3.5" aria-hidden />
            Ask SlashAI for a cited answer
          </button>
          <a
            href={`/web-search?q=${encodeURIComponent(term)}`}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 border-t border-border px-3 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Globe className="size-3.5" aria-hidden />
            Or search the web for “{short}”
          </a>
        </div>
      )}

      {/* recent searches when empty */}
      {open && !term && recentSearches.length > 0 && (
        <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-2">
          <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent
          </p>
          {recentSearches.slice(0, 5).map((t) => (
            <button
              key={t}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQ(t);
                setOpen(true);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent"
            >
              <span className="text-xs text-muted-foreground">🕘</span>
              <span className="truncate text-xs text-foreground">{t}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

