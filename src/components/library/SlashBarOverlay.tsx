import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

/**
 * SlashBar launcher — a full-screen overlay (opened from the centre bottom-nav
 * button) that shows every SlashAI destination as an app-drawer grid, organised
 * into 7 clear sections with a live search filter.
 *
 * Every entry links to a real, working route — no placeholders.
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

const SECTIONS: LauncherSection[] = [
  {
    title: "⚡ AI & Commands",
    items: [
      { name: "Search Engine", emoji: "🔍", desc: "Web, image & video search", to: "/web-search" },
      { name: "Commands", emoji: "⌨️", desc: "5,650 AI slash commands", to: "/explore" },
      { name: "AI Tools", emoji: "🤖", desc: "100+ curated AI tools", to: "/ai-tools" },
      { name: "Roadmaps", emoji: "🗺️", desc: "20 step-by-step guides", to: "/roadmaps" },
      { name: "Glossary", emoji: "📖", desc: "560+ AI terms", to: "/glossary" },
      { name: "Workflows", emoji: "🔗", desc: "Chain commands together", to: "/workflow" },
    ],
  },
  {
    title: "🛠️ Tools & Utilities",
    items: [
      { name: "SlashKits", emoji: "🧰", desc: "150+ browser tools", to: "/tools" },
      { name: "Scanner", emoji: "📷", desc: "Scan docs to PDF", to: "/tools/scanner" },
      { name: "Notepad", emoji: "📝", desc: "Quick local notes", to: "/tools/notes" },
      { name: "Grammar", emoji: "🔤", desc: "Spelling & style check", to: "/tools/spelling" },
      { name: "Converter", emoji: "🌡️", desc: "All-unit converter", to: "/tools/unit-converter" },
      { name: "Gradient", emoji: "🎨", desc: "CSS gradient maker", to: "/tools/gradient" },
      { name: "Contract", emoji: "📄", desc: "Simple contract drafts", to: "/tools/contract" },
      { name: "API Tester", emoji: "🔌", desc: "Test any HTTP API", to: "/tools/api-tester" },
      { name: "Whiteboard", emoji: "⌨️", desc: "Sketch & export", to: "/tools/whiteboard" },
    ],
  },
  {
    title: "🎮 Play & Fun",
    items: [
      { name: "SlashPlay", emoji: "🕹️", desc: "All 40+ games", to: "/play" },
      { name: "Cricket", emoji: "🏏", desc: "Time the sixes", to: "/play/cricket" },
      { name: "Tic Tac Toe", emoji: "❌", desc: "Vs AI or a friend", to: "/play/tic-tac-toe" },
      { name: "2048", emoji: "🔢", desc: "Merge to 2048", to: "/play/2048" },
      { name: "Minesweeper", emoji: "💣", desc: "Classic mine hunt", to: "/play/minesweeper" },
      { name: "Simon", emoji: "🎵", desc: "Memory sequence", to: "/play/simon" },
    ],
  },
  {
    title: "📊 Life & Finance",
    items: [
      { name: "SIP Calc", emoji: "💰", desc: "Mutual fund returns", to: "/tools/sip-calculator" },
      { name: "EMI Calc", emoji: "🏦", desc: "Loan EMI planner", to: "/tools/emi-calculator" },
      { name: "GST Calc", emoji: "💸", desc: "Add or remove GST", to: "/tools/gst-calculator" },
      { name: "Budget", emoji: "📅", desc: "50/30/20 planner", to: "/tools/budget" },
      { name: "BMI", emoji: "⚖️", desc: "Body mass index", to: "/tools/bmi-calculator" },
      { name: "Calories", emoji: "🥗", desc: "Daily macro needs", to: "/tools/calorie" },
    ],
  },
  {
    title: "🕌 Islamic & South Asia",
    items: [
      { name: "Prayer Times", emoji: "🕌", desc: "Today's schedule", to: "/tools/prayer-schedule" },
      { name: "Tasbeeh", emoji: "📿", desc: "Digital counter", to: "/tools/tasbeeh" },
      { name: "Qibla", emoji: "🧭", desc: "Find Mecca's direction", to: "/tools/qibla" },
      { name: "Quran", emoji: "📖", desc: "Word search & verses", to: "/tools/quran-search" },
      { name: "Hijri", emoji: "🌙", desc: "Islamic calendar", to: "/tools/hijri" },
      { name: "Islam Hub", emoji: "☪️", desc: "53 curated resources", to: "/hub/islam" },
    ],
  },
  {
    title: "📡 Live & News",
    items: [
      { name: "Live", emoji: "📡", desc: "Markets, weather, prayer", to: "/live" },
      { name: "Trending", emoji: "🔥", desc: "80 viral commands", to: "/trending" },
      { name: "Free Radar", emoji: "🛍️", desc: "Offers & freebies", to: "/radar" },
      { name: "Daily Quiz", emoji: "🧠", desc: "24 categories daily", to: "/quiz" },
      { name: "What's New", emoji: "🆕", desc: "Weekly free finds", to: "/whats-new" },
      { name: "India Hub", emoji: "🇮🇳", desc: "Resources for builders", to: "/hub/india" },
    ],
  },
  {
    title: "🎨 Create & Slash World",
    items: [
      { name: "Meme Maker", emoji: "😂", desc: "Generate memes", to: "/tools/meme" },
      { name: "Sticker", emoji: "🎭", desc: "WhatsApp stickers", to: "/tools/sticker" },
      { name: "Certificate", emoji: "🏆", desc: "Make certificates", to: "/tools/certificate" },
      { name: "Watermark", emoji: "💧", desc: "Protect your images", to: "/tools/watermark" },
      { name: "SlashGram", emoji: "📸", desc: "Fictional social world", to: "/slash/slashgram" },
      { name: "Hubs", emoji: "🗂️", desc: "All 13 hubs", to: "/hub" },
    ],
  },
];

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
              Your launch pad — tap anything to open
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
                  Try &ldquo;quiz&rdquo;, &ldquo;quran&rdquo;, &ldquo;calculator&rdquo; or &ldquo;games&rdquo;
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
