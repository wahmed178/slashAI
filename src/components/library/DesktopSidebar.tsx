import { useState, useEffect } from "react";
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
  NotebookPen,
  Sparkles,
  Flame,
  Youtube,
  Layers,
  History,
} from "lucide-react";

const NAV_ITEMS: Array<{ to: string; label: string; icon: any; exact?: boolean; badge?: string }> = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/trending", label: "Trending", icon: Flame, badge: "New" },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tools", label: "SlashKits", icon: Wrench },
  { to: "/hub", label: "Hubs", icon: LayoutGrid },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/generators", label: "Generators", icon: Zap },
  { to: "/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/live", label: "Live", icon: Radio, badge: "Hot" },
  { to: "/youtube", label: "YouTube", icon: Youtube },
  { to: "/quiz", label: "Daily Quiz", icon: Sparkles },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/deals", label: "Deals", icon: Tag },
];

const SECONDARY_ITEMS: Array<{ to: string; label: string; icon: any }> = [
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/recent", label: "Recent", icon: History },
  { to: "/favorites", label: "Saved", icon: Bookmark },
  { to: "/me", label: "Profile & Settings", icon: Settings },
];

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

export function DesktopSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isGlass, setIsGlass] = useState(false);

  useEffect(() => {
    try {
      setIsGlass(localStorage.getItem("slashai-glass-user") === "true");
    } catch { /* ignore */ }
  }, []);

  return (
    <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 px-2 focus-visible:outline-none">
          <span className="text-[22px]">⚡</span>
          <span className="text-[18px] font-bold text-foreground">SlashAI</span>
          <svg className="ml-1 size-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
      </div>

      <div className="h-px bg-surface-elevated" />

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${
                active
                  ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon
                className={`size-[18px] shrink-0 ${active ? "text-primary" : ""}`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
                    item.badge === "Hot"
                      ? "bg-red-500 text-white"
                      : "bg-primary text-background"
                  }`}
                >
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
              className={`flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${
                active
                  ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon
                className={`size-[18px] shrink-0 ${active ? "text-primary" : ""}`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade to Pro / Glass Member card */}
      <div className="mx-3 mb-3">
        {isGlass ? (
          <div className="rounded-[10px] border border-primary/30 bg-primary/[0.06] p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[16px]">✦</span>
              <p className="text-[13px] font-bold text-primary">Glass Member</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground">
              Active — enjoy unlimited access.
            </p>
          </div>
        ) : (
          <div className="rounded-[10px] border border-primary/20 bg-gradient-to-br from-surface to-primary/5 p-3.5">
            <span className="text-[20px]">👑</span>
            <p className="mt-1.5 text-[13px] font-bold text-foreground">Upgrade to Pro</p>
            <p className="mt-1 text-[11px] leading-tight text-muted-foreground">
              Unlock premium tools, unlimited access & more.
            </p>
            <Link
              to="/glass"
              className="mt-2.5 flex h-[32px] w-full items-center justify-center rounded-[6px] bg-primary text-[12px] font-bold text-background transition-colors hover:bg-primary/90"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>

      {/* User indicator */}
      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background">
          S
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-foreground">Slash User</p>
          <p className="text-[11px] text-muted-foreground">{isGlass ? "✦ Glass Plan" : "Free Plan"}</p>
        </div>
        <Link to="/me">
          <Settings className="size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
