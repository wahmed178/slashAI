import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Terminal,
  Compass,
  Wrench,
  Gamepad2,
  LayoutGrid,
  Zap,
  Map,
  Radio,
  BookOpen,
  Bookmark,
  Settings,
  Share2,
  NotebookPen,
  Sparkles,
  Flame,
  Layers,
  History as HistoryIcon,
  Palette,
  Menu,
  ChevronLeft,
  Moon,
  Sun,
  Bell,
  Search as SearchIcon,
  Cpu,
  Dices,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useLibrary } from "@/hooks/use-library";
import { getSlashTool } from "@/lib/slashkits";
import { getPlayGame } from "@/lib/slashplay";
import { appBySlug } from "@/lib/slashbar";
import { SearchBox } from "./SearchBox";
import { OfflineBanner } from "./OfflineBanner";
import { InstallBanner } from "./InstallBanner";
import { CookieBanner } from "./CookieBanner";
import { DesktopSidebar } from "./DesktopSidebar";
import { NAV_GROUPS } from "./nav-groups";

/** Shared nav items - same as DesktopSidebar */

/**
 * Mobile bottom bar - Instagram-style: Home · Discovery · SlashBar (centre) ·
 * centre as the elevated action, tools/games reachable from there.
 */
const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/discover", label: "Discovery", icon: Compass, exact: false },
  { to: "/slash", label: "SlashBar", icon: Zap, exact: false, center: true },
  { to: "/hub", label: "Hubs", icon: LayoutGrid, exact: false },
  { to: "/explore", label: "Commands", icon: Terminal, exact: false },
] as const;



function isActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to;
  if (to === "/hub") return pathname.startsWith("/hub");
  if (to === "/slash") return pathname.startsWith("/slash") || pathname.startsWith("/tools") || pathname.startsWith("/play");
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
      pathname.startsWith("/radar")
    );
  if (to === "/tools") return pathname.startsWith("/tools");
  if (to === "/play") return pathname.startsWith("/play");
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

function Breadcrumbs({ pathname }: { pathname: string }) {
  const crumbs = breadcrumbsFor(pathname);
  if (!crumbs) return null;
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

function DrawerGroupLeaves({
  group,
  pathname,
  onNavigate,
  active,
}: {
  group: (typeof NAV_GROUPS)[number];
  pathname: string;
  onNavigate?: (() => void) | undefined;
  active: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const open = expanded || active;
  if (group.leaves.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-0.5 flex h-[26px] w-full items-center gap-1.5 rounded-[6px] px-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        <span className="flex-1 text-left">{open && !expanded ? "Hide sections" : "All sections"}</span>
      </button>
      {open && (
        <div className="mb-1.5 ml-[18px] mt-0.5 flex flex-col gap-0.5 border-l border-surface-elevated pl-2.5">
          {group.leaves.map((leaf) => {
            const leafActive = pathname === leaf.to;
            return (
              <Link
                key={leaf.to}
                to={leaf.to}
                onClick={onNavigate}
                className={`flex h-[32px] items-center gap-2 rounded-[6px] px-2 text-[13px] transition-all duration-150 ${
                  leafActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <span className="flex-1 truncate">{leaf.label}</span>
                {leaf.badge && (
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
                      leaf.badge === "Hot" ? "bg-red-500 text-white" : "bg-surface-elevated text-muted-foreground"
                    }`}
                  >
                    {leaf.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function DrawerNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-4 py-4">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="text-[22px]">⚡</span>
          <span className="text-[18px] font-bold text-foreground">SlashAI</span>
        </Link>
      </div>
      <div className="h-px bg-surface-elevated" />

      {/* Grouped nav - same sub-folder tree as desktop */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => {
          const groupActive = group.match(pathname);
          const Icon = group.icon;

          if (group.leaves.length === 0 && group.to) {
            return (
              <Link
                key={group.id}
                to={group.to}
                onClick={onNavigate}
                className={`flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${
                  groupActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <Icon className={`size-[18px] shrink-0 ${groupActive ? "text-primary" : ""}`} strokeWidth={groupActive ? 2.2 : 1.8} />
                <span className="flex-1">{group.label}</span>
              </Link>
            );
          }

          return (
            <div key={group.id}>
              <Link
                to={group.to ?? "#"}
                onClick={onNavigate}
                className={`flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${
                  groupActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <Icon className={`size-[18px] shrink-0 ${groupActive ? "text-primary" : ""}`} strokeWidth={groupActive ? 2.2 : 1.8} />
                <span className="flex-1">{group.label}</span>
                {group.badge && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-background">
                    {group.badge}
                  </span>
                )}
              </Link>

              {/* Sub-folder: collapsed behind a toggle, auto-expanded when active */}
              <DrawerGroupLeaves group={group} pathname={pathname} onNavigate={onNavigate} active={groupActive} />
            </div>
          );
        })}
      </nav>

      {/* User indicator */}
      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background">S</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-foreground">Slash User</p>
          <p className="text-[11px] text-muted-foreground">No account · Local only</p>
        </div>
        <Link to="/me" onClick={onNavigate}>
          <Settings className="size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
      </div>
    </div>
  );
}

function ThemeToggleButton() {
  const { settings, updateSettings } = useLibrary();
  const isLight = settings.theme === "light";

  const toggle = () => {
    updateSettings({ theme: isLight ? "dark" : "light" });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="hidden md:flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {isLight ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
    </button>
  );
}

export function AppShell({ children, title, back, hideHeaderSearch, wide }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { settings } = useLibrary();

  // Every page must have a real browser-tab title. Pages that set `head()`
  // meta manage their own <title>; this effect only fills the gaps (tools
  // without head(), hubs, dynamic pages) so no route renders untitled.
  useEffect(() => {
    if (title) {
      document.title = `${title} - SlashAI`;
    } else {
      document.title = "SlashAI - Free AI Commands, Tools & Resources";
    }
  }, [title, pathname]);

  return (
    <div className="flex min-h-screen w-full" style={{ background: "var(--background)" }}>
      {/* desktop sidebar */}
      <DesktopSidebar />

      {/* mobile drawer holds the secondary destinations */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[82vw] max-w-xs overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>SlashAI navigation menu</SheetDescription>
          </SheetHeader>
          <DrawerNavList onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-sidebar-border bg-background/80 backdrop-blur-[10px]">
          <div className="flex h-[52px] items-center gap-3 px-4 md:px-8">
            {/* Mobile: hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="-ml-1 md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            {/* Mobile: logo */}
            <Link to="/" className="md:hidden flex items-center gap-2">
              <span className="text-[18px]">⚡</span>
              <span className="text-[16px] font-bold text-foreground">SlashAI</span>
            </Link>

            {/* Desktop: search bar */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex h-[36px] w-[320px] items-center gap-2 rounded-[6px] border border-sidebar-border bg-surface px-3 transition-colors focus-within:border-primary">
                <SearchIcon className="size-[14px] shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search 5,635 commands..."
                  className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                  onFocus={() => window.location.href = '/search'}
                  readOnly
                />
                <span className="flex h-5 items-center rounded border border-border bg-surface-elevated px-1.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right side - same on mobile and desktop */}
            <div className="ml-auto flex items-center gap-2">
              <Link to="/changelog" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground" aria-label="Notifications & updates">
                <Bell className="size-[20px]" />
              </Link>
              <Link to="/favorites" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground" aria-label="Saved items">
                <Bookmark className="size-[20px]" />
              </Link>
              <Link to="/me" className="flex size-8 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background transition-opacity hover:opacity-90" aria-label="Profile">
                {settings.displayName.trim() ? settings.displayName.trim().charAt(0).toUpperCase() : "U"}
              </Link>
            </div>
          </div>
        </header>

        {/* offline + install strips - dismissed installs stay gone, offline re-appears on every disconnect */}
        <InstallBanner />
        <OfflineBanner />
        <CookieBanner />

        <main className="flex-1 overflow-y-auto animate-slide-in-up">
          <div className="w-full px-4 py-6 md:px-8 md:py-8 pb-28 md:pb-10">
            <Breadcrumbs pathname={pathname} />
            {children}
          </div>
        </main>
      </div>

      {/* mobile bottom navigation - Instagram-style: feed · Hub centre · utilities */}
      <nav
        aria-label="Primary"
        className="nav-float fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-sidebar-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-[14px] md:hidden"
        style={{ height: 'calc(62px + env(safe-area-inset-bottom))' }}
      >
        {PRIMARY.map((item) => {
          // Route-based active state - derived from current pathname, not internal state
          const active = (() => {
            if (item.exact) return pathname === item.to;
            const p = item.to as string;
            if (p === "/hub") return pathname.startsWith("/hub");
            if (p === "/slash") return pathname.startsWith("/slash") || pathname.startsWith("/tools") || pathname.startsWith("/play");
            if (p === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
            if (p === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar");
            return pathname.startsWith(p);
          })();

          // ── SlashBar: elevated centre action (Instagram '+' slot) ──
          if ((item as { center?: boolean }).center) {
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="ripple-press flex min-h-[62px] flex-1 items-center justify-center"
              >
                <span
                  className="nav-hub-btn flex flex-col items-center justify-center gap-[2px] rounded-2xl px-4 py-1.5 text-[9px] font-bold text-background shadow-lg shadow-primary/25"
                  style={
                    active
                      ? { background: "linear-gradient(135deg, #2dd4bf, #38bdf8 55%, #a78bfa)" }
                      : undefined
                  }
                >
                  <item.icon className="size-[20px]" aria-hidden strokeWidth={2.2} />
                  {item.label}
                </span>
              </Link>
            );
          }

          // ── Regular tabs: icon + label, smooth pill on active ──
          return (
            <Link
              key={item.to}
              to={item.to}
              className="ripple-press relative flex min-h-[62px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium"
              style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              <span
                className={`flex items-center justify-center rounded-full px-3.5 py-1 transition-all duration-200 ${
                  active ? "bg-primary/12" : "bg-transparent"
                }`}
              >
                <item.icon
                  className="size-[22px]"
                  aria-hidden
                  strokeWidth={active ? 2.4 : 1.8}
                />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
