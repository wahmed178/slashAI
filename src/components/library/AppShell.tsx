import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  MessagesSquare,
  Globe,
  Coffee,
  Home,
  Compass,
  Heart,
  History,
  Settings as SettingsIcon,
  Info,
  Menu,
  ChevronLeft,
  ChevronDown,
  Terminal,
  Layers,
  Wrench,
  UserRound,
  Search as SearchIcon,
  Sparkles,
  Github,
  GraduationCap,
  Youtube,
  Lightbulb,
  Radar,
  Dices,
  Radio,
  Wand2,
  Film,
  Rocket,
  BookOpen,
  Route as RouteIcon,
  NotebookPen,
  Flame,
  TrendingUp,
  Bookmark,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useLibrary, ICONS } from "@/hooks/use-library";
import { cn } from "@/lib/utils";
import { SearchBox } from "./SearchBox";
import { OfflineBadge } from "./OfflineBadge";

/** mobile bottom bar — five essentials */
const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal, exact: false },
  { to: "/discover", label: "Discover", icon: Compass, exact: false },
  { to: "/hub", label: "Hubs", icon: LayoutGrid, exact: false },
  { to: "/favorites", label: "Saved", icon: Bookmark, exact: false },
] as const;

/** nested under Discover in the sidebar and the drawer */
const DISCOVER_CHILDREN = [
  { section: "ai", label: "AI", icon: Sparkles },
  { section: "free-ai", label: "Free AI", icon: Bot },
  { section: "free-tools", label: "Free Tools", icon: Wrench },
  { section: "github", label: "GitHub", icon: Github },
  { section: "learn", label: "Learn", icon: GraduationCap },
  { section: "resources", label: "Resources", icon: Layers },
  { section: "youtube", label: "YouTube", icon: Youtube },
  { section: "reddit", label: "Reddit", icon: MessagesSquare },
  { section: "websites", label: "Websites", icon: Globe },
  { section: "free-time", label: "Free Time", icon: Coffee },
  { section: "tips", label: "Tips & Tricks", icon: Lightbulb },
] as const;

/** Sidebar groups — organized into collapsible sections */
interface SidebarItem {
  to: string;
  label: string;
  icon: typeof Terminal;
}
interface SidebarGroup {
  id: string;
  label: string;
  icon: typeof Terminal;
  children: SidebarItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    id: "commands",
    label: "Commands",
    icon: Terminal,
    children: [
      { to: "/explore", label: "Explore all", icon: SearchIcon },
      { to: "/trending", label: "Trending /commands", icon: Flame },
      { to: "/find", label: "Advanced search", icon: Wand2 },
    ],
  },
  {
    id: "build",
    label: "Build",
    icon: Rocket,
    children: [
      { to: "/generators", label: "Founder tools", icon: Rocket },
      { to: "/roadmaps", label: "Founder roadmaps", icon: RouteIcon },
      { to: "/journal", label: "Build journal", icon: NotebookPen },
      { to: "/tools", label: "AI tools directory", icon: Wrench },
      { to: "/assistant", label: "Assistant", icon: Bot },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    icon: BookOpen,
    children: [
      { to: "/glossary", label: "AI Glossary", icon: BookOpen },
      { to: "/collections", label: "Collections", icon: Layers },
      { to: "/alternatives", label: "Free alternatives", icon: Wand2 },
    ],
  },
  {
    id: "hubs",
    label: "Hubs",
    icon: LayoutGrid,
    children: [
      { to: "/hub/students", label: "Students", icon: GraduationCap },
      { to: "/hub/developers", label: "Developers", icon: Terminal },
      { to: "/hub/creators", label: "Creators", icon: Sparkles },
      { to: "/hub/professionals", label: "Professionals", icon: UserRound },
      { to: "/hub/islam", label: "Islam Hub", icon: Globe },
    ],
  },
  {
    id: "live",
    label: "Live & Media",
    icon: Radio,
    children: [
      { to: "/live", label: "Live dashboard", icon: Radio },
      { to: "/youtube", label: "YouTube & Music", icon: Youtube },
      { to: "/movies", label: "Movies", icon: Film },
      { to: "/play", label: "Play", icon: Dices },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    children: [
      { to: "/me", label: "Me", icon: UserRound },
      { to: "/recent", label: "Recent", icon: History },
      { to: "/favorites", label: "Saved", icon: Bookmark },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    children: [
      { to: "/settings", label: "Settings", icon: SettingsIcon },
      { to: "/about", label: "About", icon: Info },
      { to: "/changelog", label: "Changelog", icon: Info },
      { to: "/glass", label: "✦ Glass", icon: Sparkles },
    ],
  },
] as const;

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

const subLinkCls =
  "flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

function NavList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { favorites, recents } = useLibrary();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [discoverOpen, setDiscoverOpen] = useState(() => pathname.startsWith("/discover"));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of SIDEBAR_GROUPS) {
      // Auto-expand groups that contain the current route
      if (g.children.some((c) => pathname.startsWith(c.to))) {
        initial[g.id] = true;
      }
    }
    return initial;
  });
  const counts: Record<string, number> = {
    "/favorites": favorites.length,
    "/recent": recents.length,
  };

  const toggleGroup = (id: string) => setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const cls =
    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none";

  return (
    <nav className="space-y-1" aria-label="Primary">
      {/* ── Home ── */}
      <Link
        to="/"
        activeOptions={{ exact: true, includeSearch: false }}
        activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        onClick={onNavigate}
        className={cls}
      >
        <Home className="size-4.5 shrink-0" aria-hidden />
        Home
      </Link>

      {/* ── Discover (top-level, collapsible categories) ── */}
      <div>
        <div className="flex items-center gap-1">
          <Link
            to="/discover"
            activeOptions={{ exact: true, includeSearch: false }}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            onClick={onNavigate}
            className={cn(cls, "flex-1")}
          >
            <Compass className="size-4.5 shrink-0" aria-hidden />
            Discover
          </Link>
          <button
            type="button"
            aria-expanded={discoverOpen}
            aria-label={discoverOpen ? "Collapse Discover" : "Expand Discover"}
            onClick={() => setDiscoverOpen((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          >
            <ChevronDown
              className={cn("size-4 transition-transform duration-200", !discoverOpen && "-rotate-90")}
              aria-hidden
            />
          </button>
        </div>
        {discoverOpen && (
          <div className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-2">
            {DISCOVER_CHILDREN.map((child) => (
              <Link
                key={child.section}
                to="/discover/$section"
                params={{ section: child.section }}
                activeProps={{ className: "text-sidebar-accent-foreground" }}
                onClick={onNavigate}
                className={subLinkCls}
              >
                <child.icon className="size-4 shrink-0" aria-hidden />
                {child.label}
              </Link>
            ))}
            <Link
              to="/radar"
              activeProps={{ className: "text-sidebar-accent-foreground" }}
              onClick={onNavigate}
              className={subLinkCls}
            >
              <Radar className="size-4 shrink-0" aria-hidden />
              Free Radar
            </Link>
          </div>
        )}
      </div>

      {/* ── Saved ── */}
      <Link
        to="/favorites"
        activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        onClick={onNavigate}
        className={cls}
      >
        <Bookmark className="size-4.5 shrink-0" aria-hidden />
        Saved
        {counts["/favorites"] ? (
          <span className="ml-auto text-xs text-muted-foreground">{counts["/favorites"]}</span>
        ) : null}
      </Link>

      <div className="my-1.5 border-t border-sidebar-border" role="presentation" />

      {/* ── Grouped sections ── */}
      {SIDEBAR_GROUPS.map((group) => {
        const isOpen = openGroups[group.id] ?? false;
        const isGroupActive = group.children.some((c) =>
          c.to === "/" ? pathname === "/" : pathname.startsWith(c.to),
        );
        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className={cn(
                "flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-sidebar-accent/40",
                isGroupActive ? "text-sidebar-accent-foreground" : "text-muted-foreground/70",
              )}
            >
              <group.icon className="size-3.5 shrink-0" aria-hidden />
              <span className="flex-1 text-left">{group.label}</span>
              <ChevronDown
                className={cn("size-3.5 transition-transform duration-200", !isOpen && "-rotate-90")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="mt-0.5 ml-3 space-y-0.5 border-l border-sidebar-border pl-2">
                {group.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    activeProps={{ className: "text-sidebar-accent-foreground" }}
                    onClick={onNavigate}
                    className={cn(
                      subLinkCls,
                      counts[child.to] && "justify-between",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <child.icon className="size-4 shrink-0" aria-hidden />
                      {child.label}
                    </span>
                    {counts[child.to] ? (
                      <span className="text-xs text-muted-foreground">{counts[child.to]}</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
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
      className="hidden md:flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[#21262d] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {isLight ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
    </button>
  );
}

export function AppShell({ children, title, back, hideHeaderSearch, wide }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { settings } = useLibrary();
  const currentIcon = ICONS.find((i) => i.id === settings.appIcon) ?? ICONS[0]!;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex xl:w-64">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-4 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">
            {currentIcon.emoji}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-sidebar-foreground">
              SlashAI
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Curated AI & free finds
            </span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <NavList />
        </div>
        <div className="border-t border-sidebar-border px-4 py-3">
          <OfflineBadge />
        </div>
      </aside>

      {/* mobile drawer holds the secondary destinations */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[82vw] max-w-xs overflow-y-auto p-0">
          <SheetHeader className="px-4 pt-4 text-left">
            <SheetTitle>SlashAI</SheetTitle>
            <SheetDescription>Navigate the library</SheetDescription>
          </SheetHeader>
          <div className="px-2 py-3">
            <NavList onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
          <div
            className={cn(
              "mx-auto flex items-center gap-2 px-4 py-2.5",
              wide ? "max-w-6xl" : "max-w-5xl",
            )}
          >
            {back ? (
              <BackButton to={back.to} label={back.label} />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="-ml-1 md:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
            )}

            {hideHeaderSearch ? (
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {title ?? "SlashAI"}
              </p>
            ) : (
              <SearchBox placeholder="Search commands…" />
            )}

            {/* Theme toggle — desktop header only */}
            <ThemeToggleButton />

            {back && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
            )}
          </div>
        </header>

        <main
          className={cn(
            "mx-auto w-full flex-1 px-4 pt-5 pb-28 md:pb-10 animate-slide-in-up",
            wide ? "max-w-6xl" : "max-w-5xl",
          )}
        >
          {children}
        </main>
      </div>

      {/* mobile bottom navigation — five essential destinations */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#30363d] bg-[rgba(13,17,23,0.97)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[10px] md:hidden"
        style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }}
      >
        {PRIMARY.map((item) => {
          // Route-based active state — derived from current pathname, not internal state
          const active = (() => {
            if (item.exact) return pathname === item.to;
            const p = item.to;
            if (p === "/hub") return pathname.startsWith("/hub");
            if (p === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
            if (p === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar");
            if (p === "/favorites") return pathname.startsWith("/favorites") || pathname.startsWith("/recent");
            return pathname.startsWith(p);
          })();
          return (
            <Link
              key={item.to}
              to={item.to}
              className="ripple-press flex min-h-[56px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium transition-colors"
              style={{ color: active ? '#58a6ff' : '#8b949e' }}
            >
              {/* Active dot indicator */}
              <div className="relative flex flex-col items-center">
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[#58a6ff]" />
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
