import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Terminal,
  Compass,
  Wrench,
  LayoutGrid,
  Bot,
  Zap,
  Map,
  Radio,
  BookOpen,
  Tag,
  Bookmark,
  Settings,
  Share2,
  NotebookPen,
  Sparkles,
  Flame,
  Youtube,
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
import { SearchBox } from "./SearchBox";
import { OfflineBanner } from "./OfflineBanner";
import { InstallBanner } from "./InstallBanner";
import { DesktopSidebar } from "./DesktopSidebar";

/** Shared nav items — same as DesktopSidebar */
const NAV_ITEMS: Array<{ to: string; label: string; icon: any; exact?: boolean; badge?: string }> = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/trending", label: "Trending", icon: Flame, badge: "New" },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tools", label: "SlashKits", icon: Wrench },
  { to: "/ai-tools", label: "AI Tools", icon: Cpu, badge: "100+" },
  { to: "/hub", label: "Hubs", icon: LayoutGrid },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/hunyuan", label: "Hunyuan AI", icon: Zap },
  { to: "/generators", label: "Generators", icon: Zap },
  { to: "/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/live", label: "Live", icon: Radio, badge: "Hot" },
  { to: "/youtube", label: "YouTube", icon: Youtube },
  { to: "/quiz", label: "Daily Quiz", icon: Sparkles },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/deals", label: "Deals", icon: Tag },
  { to: "/designs", label: "Designs", icon: Palette },
];

const SECONDARY_ITEMS: Array<{ to: string; label: string; icon: any; badge?: string }> = [
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/graph", label: "Knowledge Graph", icon: Share2, badge: "New" },
  { to: "/recent", label: "Recent", icon: HistoryIcon },
  { to: "/favorites", label: "Saved", icon: Bookmark },
  { to: "/me", label: "Profile & Settings", icon: Settings },
];

/** mobile bottom bar — five essentials */
const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal, exact: false },
  { to: "/discover", label: "Discover", icon: Compass, exact: false },
  { to: "/tools", label: "SlashKits", icon: Wrench, exact: false },
  { to: "/hub", label: "Hubs", icon: LayoutGrid, exact: false },
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
      pathname.startsWith("/radar")
    );
  if (to === "/tools") return pathname.startsWith("/tools");
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

/* ─────────── Breadcrumbs — Home › Section › Page ─────────── */
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
  generators: { label: "Generators", to: "/generators" },
  roadmaps: { label: "Roadmaps", to: "/roadmaps" },
  glossary: { label: "Glossary", to: "/glossary" },
  quiz: { label: "Quiz", to: "/quiz" },
  deals: { label: "Deals", to: "/deals" },
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

  if (first === "tools") {
    const tool = segs[1] ? getSlashTool(segs[1]) : undefined;
    if (!segs[1]) return [{ label: "Home", to: "/" }, { label: "SlashKits" }];
    return [
      { label: "Home", to: "/" },
      { label: "SlashKits", to: "/tools" },
      { label: tool?.name ?? humanize(segs[1]) },
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
    // page they came from — whether that's explore, search results, a
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

      {/* Main nav — same flat list as desktop */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${
                active
                  ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon className={`size-[18px] shrink-0 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${item.badge === "Hot" ? "bg-red-500 text-white" : "bg-primary text-background"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-surface-elevated" />

        {SECONDARY_ITEMS.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${
                active
                  ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon className={`size-[18px] shrink-0 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-background">
                  {item.badge}
                </span>
              )}
            </Link>
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
      document.title = `${title} — SlashAI`;
    } else {
      document.title = "SlashAI — Free AI Commands, Tools & Resources";
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
        <header className="sticky top-0 z-30 border-b border-sidebar-border bg-[rgba(10,10,15,0.8)] backdrop-blur-[10px]">
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

            {/* Right side — same on mobile and desktop */}
            <div className="ml-auto flex items-center gap-2">
              <Link to="/changelog" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground" aria-label="Notifications & updates">
                <Bell className="size-[20px]" />
              </Link>
              <Link to="/favorites" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground" aria-label="Saved items">
                <Bookmark className="size-[20px]" />
              </Link>
              <Link to="/me" className="flex size-8 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background transition-opacity hover:opacity-90" aria-label="Profile">
                S
              </Link>
            </div>
          </div>
        </header>

        {/* offline + install strips — dismissed installs stay gone, offline re-appears on every disconnect */}
        <InstallBanner />
        <OfflineBanner />

        <main className="flex-1 overflow-y-auto animate-slide-in-up">
          <div className="w-full px-4 py-6 md:px-8 md:py-8 pb-28 md:pb-10">
            <Breadcrumbs pathname={pathname} />
            {children}
          </div>
        </main>
      </div>

      {/* mobile bottom navigation — five essential destinations */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-sidebar-border bg-[rgba(10,10,15,0.97)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[10px] md:hidden"
        style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }}
      >
        {PRIMARY.map((item) => {
          // Route-based active state — derived from current pathname, not internal state
          const active = (() => {
            if (item.exact) return pathname === item.to;
            const p = item.to;
            if (p === "/hub") return pathname.startsWith("/hub");
            if (p === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
            if (p === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar") || pathname.startsWith("/deals");
            if (p === "/tools") return pathname.startsWith("/tools");
            return pathname.startsWith(p);
          })();
          return (
            <Link
              key={item.to}
              to={item.to}
              className="ripple-press flex min-h-[56px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium transition-colors"
              style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              {/* Active dot indicator */}
              <div className="relative flex flex-col items-center">
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
                )}
                <item.icon
                  className="size-[22px]"
                  aria-hidden
                  strokeWidth={active ? 2.4 : 1.8}
                />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
