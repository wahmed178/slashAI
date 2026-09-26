import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Compass,
  LayoutGrid,
  Zap,
  Bookmark,
  Settings,
  ChevronLeft,
  Dices,
  Activity,
  Moon,
  Sun,
  Info,
  Search as SearchIcon,
  X,
  Star,
} from "lucide-react";

import { useLibrary } from "@/hooks/use-library";
import { getSlashTool, toolSection } from "@/lib/slashkits";
import { gameSection, getPlayGame } from "@/lib/slashplay";
import { appBySlug, ALL_SLASH_APPS } from "@/lib/slashbar";
import { pickRandom } from "@/lib/random-pick";
import { OfflineBanner } from "./OfflineBanner";
import { InstallBanner } from "./InstallBanner";
import { CookieBanner } from "./CookieBanner";
import { SlashBarOverlay } from "./SlashBarOverlay";
import { CatalogueExtras } from "./CatalogueExtras";
import { FloatingActions } from "./FloatingActions";
import { bumpToolClick, recordUxInteraction } from "@/lib/ux";

/**
 * Bottom dock: Home · Discovery · 🎲 Random (elevated shiny centre, instant roll) ·
 * Hubs · ⚡ Slash (side tab, opens the full-screen SlashBar overlay).
 */
const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/discover", label: "Discovery", icon: Compass, exact: false },
  { to: "", label: "Random", icon: Dices, random: true },
  { to: "/hub", label: "Hubs", icon: LayoutGrid, exact: false },
  { to: "", label: "Slash", icon: Zap, slash: true },
] as const;


function isActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to;
  if (to === "/hub") return pathname.startsWith("/hub");
  if (to === "/explore")
    return (
      pathname.startsWith("/explore") ||
      pathname.startsWith("/search") ||
      pathname.startsWith("/find") ||
      pathname.startsWith("/c/")
    );
  if (to === "/discover")
    return (
      pathname.startsWith("/discover") ||
      pathname.startsWith("/r/") ||
      pathname.startsWith("/whats-new") ||
      pathname.startsWith("/radar") ||
      pathname.startsWith("/trending")
    );
  return pathname.startsWith(to);
}

interface Props {
  children: ReactNode;
  /** page title shown in the mobile header */
  title?: string;
  /** renders a hierarchical back control; `to` is the fallback destination */
  back?: { to: string; label: string };
  /** hide the compact header search (Home renders the large one instead) */
  hideHeaderSearch?: boolean;
  /** widen the content column for dense list pages */
  wide?: boolean;
  /**
   * Screen-reader-only <h1> for pages whose UI has no visible heading
   * (canvas-based tools, screensavers...). Keeps exactly one H1 per page
   * for accessibility and SEO without changing the visual design.
   */
  srH1?: string;
}

/* ─────────── Breadcrumbs - Home › Section › Page ─────────── */
const HUB_NAMES: Record<string, string> = {
  students: "Student Hub",
  developers: "Developer Hub",
  creators: "Creator Hub",
  professionals: "Professional Hub",
  founders: "Founders Hub",
  india: "India Hub",
  finance: "Finance Hub",
  designers: "Designers Hub",
  health: "Health Hub",
  islam: "Islam Hub",
  urdu: "Urdu Hub",
  arabic: "Arabic Hub",
};

const TOP_LEVEL_NAMES: Record<string, { label: string; to?: string }> = {
  learn: { label: "Courses", to: "/learn" },
  roadmaps: { label: "Roadmaps", to: "/roadmaps" },
  glossary: { label: "Glossary", to: "/glossary" },
  quiz: { label: "Quiz", to: "/quiz" },
  live: { label: "Live Dashboard", to: "/live" },
  "ai-tools": { label: "AI Tools", to: "/ai-tools" },
  workflow: { label: "AI Workflows", to: "/workflow" },
};

function humanize(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

interface Crumb {
  label: string;
  to?: string;
}

function breadcrumbsFor(pathname: string): Crumb[] | null {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length === 0) return null;
  const first = segs[0]!;

  if (first === "random") {
    return [{ label: "Home", to: "/" }, { label: "Random" }];
  }
  if (first === "tools") {
    const tool = segs[1] ? getSlashTool(segs[1]) : undefined;
    if (!segs[1]) return [{ label: "Home", to: "/" }, { label: "SlashKits" }];
    return [
      { label: "Home", to: "/" },
      { label: "SlashKits", to: "/tools" },
      { label: tool?.name ?? humanize(segs[1]) },
    ];
  }
  if (first === "play") {
    const game = segs[1] ? getPlayGame(segs[1]) : undefined;
    if (!segs[1]) return [{ label: "Home", to: "/" }, { label: "SlashPlay" }];
    return [
      { label: "Home", to: "/" },
      { label: "SlashPlay", to: "/play" },
      { label: game?.name ?? humanize(segs[1]) },
    ];
  }
  if (first === "slash") {
    const app = segs[1] ? appBySlug(segs[1]) : undefined;
    if (!segs[1]) return [{ label: "Home", to: "/" }, { label: "SlashBar" }];
    return [
      { label: "Home", to: "/" },
      { label: "SlashBar", to: "/slash" },
      { label: app?.name ?? humanize(segs[1]) },
    ];
  }
  if (first === "hub") {
    if (!segs[1]) return [{ label: "Home", to: "/" }, { label: "Hubs" }];
    return [
      { label: "Home", to: "/" },
      { label: "Hubs", to: "/hub" },
      { label: HUB_NAMES[segs[1]!] ?? humanize(segs[1]!) },
    ];
  }
  if (first === "c" && segs[1]) {
    return [
      { label: "Home", to: "/" },
      { label: "Commands", to: "/explore" },
      { label: `/${humanize(segs[1])}` },
    ];
  }
  if (first === "r") {
    return [{ label: "Home", to: "/" }, { label: "Discover", to: "/discover" }, { label: "Resource" }];
  }
  const top = TOP_LEVEL_NAMES[first];
  if (top && segs.length === 1) {
    return [{ label: "Home", to: "/" }, { label: top.label }];
  }
  return null;
}

function Breadcrumbs({ pathname, trailing }: { pathname: string; trailing?: ReactNode }) {
  const crumbs = breadcrumbsFor(pathname);
  if (!crumbs) {
    return trailing ? <div className="mb-4">{trailing}</div> : null;
  }
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[12px] text-muted-foreground scrollbar-none">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {c.to && !last ? (
              <Link to={c.to} className="transition-colors hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-foreground/80" : ""}>{c.label}</span>
            )}
          </span>
        );
      })}
      {trailing && <span className="ml-1.5 inline-flex shrink-0 items-center">{trailing}</span>}
    </nav>
  );
}

function BackButton({ to, label }: { to: string; label: string }) {
  const goBack = () => {
    // Use native browser history so the user always returns to whatever
    // page they came from - whether that's explore, search results, a
    // collection, or another command. When there is no previous page
    // (deep link / first visit) the browser stays put.
    window.history.back();
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="-ml-1 flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ChevronLeft className="size-5" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">Back to {label}</span>
    </button>
  );
}

function ThemeToggleButton() {
  const { settings, updateSettings } = useLibrary();
  // four-way cycle: dark → light → amoled → brutal → dark (glass stays a Designs pick)
  const CYCLE = ["dark", "light", "amoled", "brutal"] as const;
  const idx = CYCLE.indexOf(settings.theme as (typeof CYCLE)[number]);
  const next = CYCLE[(idx + 1 + CYCLE.length) % CYCLE.length] ?? "dark";
  const ICONS = {
    dark: <Moon className="size-[18px]" />,
    light: <Sun className="size-[18px]" />,
    amoled: <span className="text-[15px] leading-none">⬛</span>,
    brutal: <span className="text-[15px] font-black leading-none" style={{ color: "var(--primary)" }}>◼</span>,
  } as const;
  const LABELS: Record<string, string> = { dark: "Dark", light: "Light", amoled: "AMOLED", brutal: "Brutal" };

  return (
    <button
      type="button"
      onClick={() => updateSettings({ theme: next })}
      aria-label={`Theme: ${LABELS[settings.theme] ?? settings.theme}. Switch to ${LABELS[next]}`}
      title={`Theme: ${LABELS[settings.theme] ?? settings.theme} → ${LABELS[next]}`}
      className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {ICONS[settings.theme as keyof typeof ICONS] ?? <Moon className="size-[18px]" />}
    </button>
  );
}

/** the exact tool/game/app screen open right now, so AppShell can star it */
function screenItem(pathname: string): { slug: string; kind: "tool" | "game" | "app" } | null {
  const segs = pathname.split("/").filter(Boolean);
  if (segs[0] === "tools" && segs[1]) {
    return getSlashTool(segs[1]) ? { slug: segs[1]!, kind: "tool" } : null;
  }
  if (segs[0] === "play" && segs[1]) {
    return getPlayGame(segs[1]) ? { slug: segs[1]!, kind: "game" } : null;
  }
  if (segs[0] === "slash" && segs[1]) {
    return appBySlug(segs[1]) || ALL_SLASH_APPS.some((a) => a.slug === segs[1])
      ? { slug: segs[1]!, kind: "app" }
      : null;
  }
  return null;
}

const KIND_LABEL: Record<"tool" | "game" | "app", string> = {
  tool: "tool",
  game: "game",
  app: "app",
};

/** small Save pill that sits next to the page label on tool/game/app screens */
function ScreenStar({ fav, label, onToggle }: { fav: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={fav}
      aria-label={fav ? `Remove this ${label} from Saved` : `Save this ${label} to Saved`}
      title={fav ? "Saved — tap to remove" : `Save this ${label} to your favorites`}
      className="ripple-press inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[11px] font-semibold transition-colors"
      style={{
        borderColor: fav ? "color-mix(in oklab, var(--primary) 40%, transparent)" : "var(--border)",
        background: fav ? "color-mix(in oklab, var(--primary) 12%, transparent)" : "var(--surface)",
        color: fav ? "var(--primary)" : "var(--muted-foreground)",
      }}
    >
      <Star className="size-3" fill={fav ? "currentColor" : "none"} />
      {fav ? "Saved" : "Save"}
    </button>
  );
}

export function AppShell({ children, title, back, hideHeaderSearch, wide, srH1 }: Props) {
  const [slashbarOpen, setSlashbarOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isToolFavorite, toggleToolFavorite } = useLibrary();

  // Count each tool/game screen once per browser session — that powers the
  // 🔥 Popular badge without a backend, and keeps a page refresh honest.
  const trackKey = screenItem(pathname)?.slug ?? "";
  useEffect(() => {
    if (!trackKey) return;
    const skey = `slashai-counted:${trackKey}`;
    try {
      if (sessionStorage.getItem(skey)) return;
      sessionStorage.setItem(skey, "1");
    } catch {
      /* private mode — count it anyway */
    }
    const item = screenItem(pathname);
    if (!item) return;
    bumpToolClick(item.slug);
    // the section/category tag feeds the homepage "You might like" row
    const tag =
      item.kind === "game" ? gameSection(item.slug)?.title : toolSection(item.slug)?.title;
    recordUxInteraction(item.kind === "game" ? "game" : "tool", item.slug, tag);
  }, [trackKey, pathname]);

  // Did the matched route contribute its own head()? The root always
  // contributes one (canonical/OG), so look for a non-root match with meta.
  const matches = useRouterState({ select: (s) => s.matches });
  const hasSeoHead = matches.some(
    (m) => m.routeId !== "__root__" && Array.isArray(m.meta) && m.meta.length > 0,
  );

  // the current screen (tool / game / slash app) can be starred straight
  // from the header — same localStorage list the Saved page reads
  const screen = screenItem(pathname);
  const screenFav = screen ? isToolFavorite(screen.slug) : false;
  const kindLabel = screen ? KIND_LABEL[screen.kind] : "item";

  const onStarScreen = () => {
    if (!screen) return;
    toggleToolFavorite(screen.slug);
  };

  // Fill the browser-tab title only when the route has no SEO head of its
  // own (a route-level head() always sets a description). Writing the title
  // unconditionally used to overwrite richer SSR titles like
  // "Command - Title | SlashAI" on hydration.
  useEffect(() => {
    if (hasSeoHead) return;
    if (title) {
      document.title = `${title} - SlashAI`;
    } else {
      document.title = "SlashAI - Free AI Commands, Tools & Resources";
    }
  }, [hasSeoHead, title, pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col" style={{ background: "var(--background)" }}>
      <header className="sticky top-0 z-30 border-b border-sidebar-border bg-background/80 backdrop-blur-[10px]">
        <div className={`mx-auto flex h-[52px] w-full items-center gap-2 px-4 md:gap-3 md:px-6 ${wide ? "max-w-[1700px]" : "max-w-[1500px]"}`}>
          {back && <BackButton to={back.to} label={back.label} />}

          {/* logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 transition-transform active:scale-95">
            <div className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#818cf8] p-0.5 shadow-[0_0_12px_rgba(45,212,191,0.25)] transition-shadow group-hover:shadow-[0_0_16px_rgba(45,212,191,0.4)]">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#12161c]">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19L14 5" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                  <path d="M13 2L4 13H11L9 22L20 10H13L15 2Z" fill="url(#headerBrandGrad)" />
                  <defs>
                    <linearGradient id="headerBrandGrad" x1="4" y1="22" x2="20" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8" />
                      <stop offset="0.5" stopColor="#2dd4bf" />
                      <stop offset="1" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="flex items-center text-[16.5px] font-black tracking-tight text-foreground">
              Slash<span className="bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          {/* live dashboard — mini icon pill beside the logo */}
          <Link
            to="/live"
            title="Live Dashboard"
            aria-label="Live Dashboard"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-sidebar-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground min-[480px]:flex"
          >
            <Activity className="size-3.5 text-primary" aria-hidden />
            <span className="hidden lg:inline">Live Dashboard</span>
          </Link>

          {/* header command search — sits at the top on every screen */}
          {!hideHeaderSearch && (
            <div className="hidden min-[420px]:flex min-w-0 flex-1 justify-center px-2">
              <Link
                to="/search"
                className="flex h-[34px] w-full max-w-[460px] items-center gap-2 rounded-[6px] border border-sidebar-border bg-surface px-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <SearchIcon className="size-[14px] shrink-0" />
                <span className="flex-1 truncate text-[13px]">Search commands…</span>
                <span className="hidden h-5 shrink-0 items-center rounded border border-border bg-surface-elevated px-1.5 font-mono text-[10px] sm:flex">
                  /
                </span>
              </Link>
            </div>
          )}

          {/* right side - quick links, same on every screen */}
          <div className="ml-auto flex items-center gap-0.5">
            <ThemeToggleButton />
            <Link
              to="/about"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              aria-label="About SlashAI"
            >
              <Info className="size-[19px]" />
            </Link>
            <Link
              to="/favorites"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              aria-label="Saved items"
            >
              <Bookmark className="size-[19px]" />
            </Link>
            <Link
              to="/me"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-[19px]" />
            </Link>
            {/* small close (X) button for full-screen tool/game pages - no back prop */}
            {!back && (pathname.startsWith("/tools/") || pathname.startsWith("/play/")) && (
              <button
                type="button"
                onClick={() => window.history.back()}
                aria-label={pathname.startsWith("/play/") ? "Close game" : "Close tool"}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="size-[19px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* offline + install strips - dismissed installs stay gone, offline re-appears on every disconnect */}
      <InstallBanner />
      <OfflineBanner />
      <CookieBanner />

      <main className={`mx-auto w-full flex-1 animate-slide-in-up ${wide ? "max-w-[1700px]" : "max-w-[1500px]"}`}>
        <div className="w-full px-4 py-6 md:px-6 md:py-8" style={{ paddingBottom: "calc(62px + env(safe-area-inset-bottom) + 20px)" }}>
          {/* the Save pill lives next to the page label (breadcrumbs), not the header */}
          <Breadcrumbs
            pathname={pathname}
            trailing={screen ? <ScreenStar fav={screenFav} label={kindLabel} onToggle={onStarScreen} /> : undefined}
          />
          {srH1 && <h1 className="sr-only">{srH1}</h1>}
          {children}
          {/* consistent onboarding + cross-links on every tool & game page */}
          {screen && (screen.kind === "tool" || screen.kind === "game") && (
            <CatalogueExtras kind={screen.kind} slug={screen.slug} />
          )}
        </div>
      </main>

      {/* floating "copy again" pill + back-to-top, above the dock */}
      <FloatingActions />

      {/* bottom dock navigation - the ONLY navigation (no sidebar, no drawer):
          Home · Discovery · 🎲 Random (centre) · Hubs · ⚡ Slash (overlay) */}
      <nav
        aria-label="Primary"
        className="nav-float fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-sidebar-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-[14px]"
        style={{ height: "calc(62px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-[760px] items-stretch">
          {PRIMARY.map((item) => {
            const isRandom = (item as { random?: boolean }).random === true;
            const isSlash = (item as { slash?: boolean }).slash === true;

            // Route-based active state - derived from current pathname, not internal state
            const active = (() => {
              if (isRandom || isSlash) return false; // action buttons, never route-active
              if ((item as { exact?: boolean }).exact) return pathname === item.to;
              const p = item.to as string;
              if (p === "/hub") return pathname.startsWith("/hub");
              if (p === "/discover")
                return (
                  pathname.startsWith("/discover") ||
                  pathname.startsWith("/r/") ||
                  pathname.startsWith("/whats-new") ||
                  pathname.startsWith("/radar") ||
                  pathname.startsWith("/trending")
                );
              return pathname.startsWith(p);
            })();

            // ── Random: elevated shiny centre button - instant roll to a random destination ──
            if (isRandom) {
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label="Random — jump somewhere fun"
                  title="Surprise me"
                  onClick={() => {
                    const pick = pickRandom(pathname);
                    window.location.assign(pick.path);
                  }}
                  className="ripple-press relative flex min-h-[62px] flex-1 flex-col items-center justify-end pb-[8px] text-[10px] font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span className="nav-random-btn mb-[3px] flex size-[46px] items-center justify-center rounded-full text-background">
                    <item.icon className="size-[23px]" aria-hidden strokeWidth={2.2} />
                  </span>
                  {item.label}
                </button>
              );
            }

            // ── Slash: side tab that opens the full-screen SlashBar overlay ──
            if (isSlash) {
              const slashActive = pathname.startsWith("/slash");
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label="Open SlashBar"
                  aria-haspopup="dialog"
                  onClick={() => setSlashbarOpen(true)}
                  className="ripple-press relative flex min-h-[62px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium"
                  style={{ color: slashActive ? "var(--primary)" : "var(--muted-foreground)" }}
                >
                  {slashActive && (
                    <span
                      aria-hidden
                      className="absolute top-[7px] h-[3px] w-[16px] rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                  )}
                  <item.icon className="size-[22px]" aria-hidden strokeWidth={slashActive ? 2.4 : 1.8} />
                  {item.label}
                </button>
              );
            }

            // ── Regular tabs: icon + label, accent dot on active ──
            return (
              <Link
                key={item.to}
                to={item.to as "/"}
                className="ripple-press relative flex min-h-[62px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-[7px] h-[3px] w-[16px] rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                )}
                <item.icon
                  className="size-[22px]"
                  aria-hidden
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* full-screen SlashBar launcher overlay (centre button) */}
      <SlashBarOverlay open={slashbarOpen} onClose={() => setSlashbarOpen(false)} />
    </div>
  );
}
