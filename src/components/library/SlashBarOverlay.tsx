import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

import { SLASH_APPS, type SlashApp } from "@/lib/slashbar";

/**
 * SlashBar launcher — a full-screen overlay (opened from the centre bottom-nav
 * button) that shows ONLY the Slash original apps from SLASH_APPS (single
 * source of truth), organised into clear sections with a live search filter.
 *
 * Every entry links to the app's real destination (its link override or
 * /slash/<slug>) — no placeholders, no mixed-in tools.
 */

interface AppButton {
  name: string;
  emoji: string;
  desc: string;
  to: string;
}

interface LauncherSection {
  title: string;
  items: AppButton[];
}

/** Section assignment by SLASH_APPS slug — every app appears exactly once. */
const SECTION_SLUGS: { title: string; slugs: string[] }[] = [
  {
    title: "⚡ Flagship",
    slugs: ["kits", "play", "slashgram"],
  },
  {
    title: "🧪 Learn & Think",
    slugs: ["labs", "learning", "brain-boosters", "courses", "thinks"],
  },
  {
    title: "💼 Work & Money",
    slugs: ["jobs", "simulator", "life-hacks"],
  },
  {
    title: "✨ Create & Fun",
    slugs: ["romantic", "create", "image", "speak", "fun"],
  },
  {
    title: "🛍️ Shop & Daily Life",
    slugs: ["gadgets", "shopping", "offers", "mini-store", "mens", "nearby"],
  },
  {
    title: "🔍 Search & Connect",
    slugs: ["search-engine", "facts", "community", "how-to-zone"],
  },
];

function appTo(app: SlashApp): string {
  return app.link ?? `/slash/${app.slug}`;
}

function buildSections(): LauncherSection[] {
  const bySlug = new Map(SLASH_APPS.map((a) => [a.slug, a]));
  const used = new Set<string>();
  const sections: LauncherSection[] = [];

  for (const { title, slugs } of SECTION_SLUGS) {
    const items: AppButton[] = [];
    for (const slug of slugs) {
      const app = bySlug.get(slug);
      if (!app) continue; // slug renamed/removed — skip silently
      used.add(slug);
      items.push({ name: app.name, emoji: app.emoji, desc: app.desc, to: appTo(app) });
    }
    if (items.length > 0) sections.push({ title, items });
  }

  // Safety net: any app not assigned to a section still shows up.
  const rest = SLASH_APPS.filter((a) => !used.has(a.slug));
  if (rest.length > 0) {
    sections.push({
      title: "🎩 More Slash Apps",
      items: rest.map((app) => ({ name: app.name, emoji: app.emoji, desc: app.desc, to: appTo(app) })),
    });
  }

  return sections;
}

const SECTIONS: LauncherSection[] = buildSections();
const ALL_ITEMS: AppButton[] = SECTIONS.flatMap((s) => s.items);

export function SlashBarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const touchStartY = useRef<number | null>(null);

  // lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q
        ? ALL_ITEMS.filter((a) => `${a.name} ${a.desc}`.toLowerCase().includes(q))
        : [],
    [q],
  );

  if (!open) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStartY.current;
    if (dy > 90) onClose(); // swipe down to dismiss
    touchStartY.current = null;
  };

  return (
    <div
      className="slashbar-overlay fixed inset-0 z-[60] flex flex-col overflow-hidden bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="SlashBar launcher"
    >
      {/* header — swipe down on the handle to dismiss */}
      <div className="shrink-0 border-b border-sidebar-border" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button
          type="button"
          aria-label="Drag down to close"
          onClick={onClose}
          className="mx-auto mt-2 block h-1.5 w-12 rounded-full bg-muted-foreground/30"
        />
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">⚡ SlashBar</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {ALL_ITEMS.length} Slash originals — tap anything to open
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close SlashBar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* search */}
        <div className="relative px-4 pb-4">
          <Search className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps..."
            aria-label="Search apps"
            className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-1">
        {q ? (
          <>
            <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              {matches.length} app{matches.length === 1 ? "" : "s"} found
            </p>
            {matches.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {matches.map((a) => (
                  <AppTile key={a.to + a.name} app={a} onOpen={onClose} />
                ))}
              </div>
            ) : (
              <div className="mt-16 text-center">
                <div className="text-[32px]">🔍</div>
                <p className="mt-2 text-[15px] font-semibold text-foreground">
                  No apps found for &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Try &ldquo;play&rdquo;, &ldquo;facts&rdquo;, &ldquo;romantic&rdquo; or &ldquo;shop&rdquo;
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {SECTIONS.map((section) => (
              <section key={section.title} className="mt-5 first:mt-2">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {section.title}
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {section.items.map((a) => (
                    <AppTile key={a.to + a.name} app={a} onOpen={onClose} />
                  ))}
                </div>
              </section>
            ))}
            <p className="mt-8 text-center text-[11px] text-muted-foreground">
              Everything runs in your browser — free forever, no account needed.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function AppTile({ app, onOpen }: { app: AppButton; onOpen: () => void }) {
  return (
    <Link
      to={app.to as string}
      onClick={onOpen}
      className="ripple-press flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface px-2 py-3.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 active:scale-[0.97]"
    >
      <span className="text-[26px] leading-none" aria-hidden>
        {app.emoji}
      </span>
      <span className="line-clamp-2 w-full text-[11px] font-semibold leading-tight text-foreground">
        {app.name}
      </span>
      <span className="line-clamp-1 w-full text-[9.5px] leading-tight text-muted-foreground">
        {app.desc}
      </span>
    </Link>
  );
}
