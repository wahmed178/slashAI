import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Compass,
  Heart,
  History,
  Settings as SettingsIcon,
  Info,
  Menu,
  ChevronLeft,
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
import { cn } from "@/lib/utils";
import { SearchBox } from "./SearchBox";
import { OfflineBadge } from "./OfflineBadge";

/** mobile bottom bar — four essentials only */
const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/discover", label: "Discover", icon: Compass, exact: false },
  { to: "/favorites", label: "Saved", icon: Heart, exact: false },
  { to: "/search", label: "Search", icon: SearchIcon, exact: false },
] as const;

/** nested under Discover in the sidebar and the drawer */
const DISCOVER_CHILDREN = [
  { to: "/discover/ai", label: "AI", icon: Sparkles },
  { to: "/discover/free-tools", label: "Free Tools", icon: Wrench },
  { to: "/discover/github", label: "GitHub", icon: Github },
  { to: "/discover/learn", label: "Learn", icon: GraduationCap },
  { to: "/discover/resources", label: "Resources", icon: Layers },
  { to: "/discover/youtube", label: "YouTube", icon: Youtube },
  { to: "/discover/tips", label: "Tips & Tricks", icon: Lightbulb },
  { to: "/radar", label: "Free Radar", icon: Radar },
] as const;

const SECONDARY = [
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/recent", label: "Recent", icon: History },
  { to: "/me", label: "Me", icon: UserRound },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/about", label: "About", icon: Info },
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
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        if (router.history.canGoBack()) router.history.back();
        else void navigate({ to, search: true as never });
      }}
      className="-ml-1 flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ChevronLeft className="size-5" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">Back to {label}</span>
    </button>
  );
}

function NavList({
  onNavigate,
  showSecondary = true,
}: {
  onNavigate?: () => void;
  showSecondary?: boolean;
}) {
  const { favorites, recents } = useLibrary();
  const counts: Record<string, number> = {
    "/favorites": favorites.length,
    "/recent": recents.length,
  };

  const cls =
    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none";

  return (
    <nav className="space-y-1" aria-label="Primary">
      {PRIMARY.filter((item) => item.to !== "/search").map((item) => (
        <div key={item.to}>
          <Link
            to={item.to}
            activeOptions={{ exact: item.exact, includeSearch: false }}
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
          {item.to === "/discover" && (
            <div className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-2">
              {DISCOVER_CHILDREN.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  activeProps={{ className: "text-sidebar-accent-foreground" }}
                  onClick={onNavigate}
                  className="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                >
                  <child.icon className="size-4 shrink-0" aria-hidden />
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

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

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex xl:w-64">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-4 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="size-5" aria-hidden />
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
            "mx-auto w-full flex-1 px-4 pt-5 pb-28 md:pb-10",
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
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("size-5", active && "stroke-[2.4]")} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
