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
  FolderKanban,
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
  { to: "/trending", label: "Tools", icon: Sparkles, exact: false },
  { to: "/hub", label: "Hubs", icon: Globe, exact: false },
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

const SECONDARY = [
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/generators", label: "Founder tools", icon: Rocket },
  { to: "/roadmaps", label: "Founder roadmaps", icon: RouteIcon },
  { to: "/journal", label: "Build journal", icon: NotebookPen },
  { to: "/tools", label: "AI tools directory", icon: Wrench },
  { to: "/glossary", label: "AI Glossary", icon: BookOpen },
  { to: "/find", label: "Advanced search", icon: Wand2 },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/youtube", label: "YouTube & Music", icon: Youtube },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/play", label: "Play", icon: Dices },

  { to: "/recent", label: "Recent", icon: History },
  { to: "/me", label: "Me", icon: UserRound },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/about", label: "About", icon: Info },
  { to: "/trending", label: "Trending /commands", icon: Flame },
  { to: "/changelog", label: "Changelog", icon: Info },
  { to: "/glass", label: "✦ Glass", icon: Sparkles },
  { to: "/hub", label: "Hubs", icon: Globe },
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

const IDEA_CHILDREN = [
  { to: "/build-ideas", label: "Browse ideas", icon: Lightbulb },
  { to: "/build-ideas/validate", label: "Validate an idea", icon: Sparkles },
  { to: "/build-ideas/projects", label: "My projects", icon: FolderKanban },
] as const;

const subLinkCls =
  "flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

function NavList({
  onNavigate,
  showSecondary = true,
}: {
  onNavigate?: () => void;
  showSecondary?: boolean;
}) {
  const { favorites, recents } = useLibrary();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [discoverOpen, setDiscoverOpen] = useState(() => pathname.startsWith("/discover"));
  const [ideasOpen, setIdeasOpen] = useState(() => pathname.startsWith("/build-ideas"));
  const counts: Record<string, number> = {
    "/favorites": favorites.length,
    "/recent": recents.length,
  };

  const cls =
    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none";

  return (
    <nav className="space-y-1" aria-label="Primary">
      {PRIMARY.map((item) => (
        <div key={item.to}>
          <div className="flex items-center gap-1">
            <Link
              to={item.to}
              activeOptions={{ exact: item.exact, includeSearch: false }}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              onClick={onNavigate}
              className={cn(cls, "flex-1")}
            >
              <item.icon className="size-4.5 shrink-0" aria-hidden />
              {item.label}
              {counts[item.to] ? (
                <span className="ml-auto text-xs text-muted-foreground">{counts[item.to]}</span>
              ) : null}
            </Link>
            {item.to === "/discover" && (
              <button
                type="button"
                aria-expanded={discoverOpen}
                aria-controls="discover-subnav"
                aria-label={discoverOpen ? "Collapse Discover" : "Expand Discover"}
                onClick={() => setDiscoverOpen((v) => !v)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
              >
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    !discoverOpen && "-rotate-90",
                  )}
                  aria-hidden
                />
              </button>
            )}
          </div>
          {item.to === "/discover" && discoverOpen && (
            <div
              id="discover-subnav"
              className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-2"
            >
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
      ))}

      {/* Build Ideas — its own collapsible group */}
      <div>
        <div className="flex items-center gap-1">
          <Link
            to="/build-ideas"
            activeOptions={{ exact: true, includeSearch: false }}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            onClick={onNavigate}
            className={cn(cls, "flex-1")}
          >
            <Lightbulb className="size-4.5 shrink-0" aria-hidden />
            Build Ideas
          </Link>
          <button
            type="button"
            aria-expanded={ideasOpen}
            aria-controls="ideas-subnav"
            aria-label={ideasOpen ? "Collapse Build Ideas" : "Expand Build Ideas"}
            onClick={() => setIdeasOpen((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          >
            <ChevronDown
              className={cn("size-4 transition-transform duration-200", !ideasOpen && "-rotate-90")}
              aria-hidden
            />
          </button>
        </div>
        {ideasOpen && (
          <div
            id="ideas-subnav"
            className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-2"
          >
            {IDEA_CHILDREN.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                activeOptions={{ exact: true, includeSearch: false }}
                activeProps={{ className: "text-sidebar-accent-foreground" }}
                onClick={onNavigate}
                className={subLinkCls}
              >
                <child.icon className="size-4 shrink-0" aria-hidden />
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {showSecondary && (
        <>
          <div className="my-2 border-t border-sidebar-border" role="presentation" />
          {SECONDARY.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              onClick={onNavigate}
              className={cls}
            >
              <item.icon className="size-4.5 shrink-0" aria-hidden />
              {item.label}
              {counts[item.to] ? (
                <span className="ml-auto text-xs text-muted-foreground">{counts[item.to]}</span>
              ) : null}
            </Link>
          ))}
        </>
      )}
    </nav>
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

      {/* mobile bottom navigation — four essential destinations only */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        {PRIMARY.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "ripple-press flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-5 transition-transform duration-200",
                  active && "stroke-[2.4] scale-110",
                )}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
