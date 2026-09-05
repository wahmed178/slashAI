import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Terminal,
  Compass,
  Wrench,
  LayoutGrid,
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
  Layers,
  History,
  Palette,
  Workflow,
  Share2,
  Cpu,
} from "lucide-react";

const NAV_ITEMS: Array<{ to: string; label: string; icon: any; exact?: boolean; badge?: string }> = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/trending", label: "Trending", icon: Flame, badge: "New" },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tools", label: "SlashKits", icon: Wrench },
  { to: "/ai-tools", label: "AI Tools", icon: Cpu, badge: "100+" },
  { to: "/hub", label: "Hubs", icon: LayoutGrid },
  { to: "/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/workflow", label: "AI Workflows", icon: Workflow, badge: "New" },
  { to: "/live", label: "Live", icon: Radio, badge: "Hot" },
  { to: "/quiz", label: "Daily Quiz", icon: Sparkles },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/deals", label: "Deals", icon: Tag },
  { to: "/designs", label: "Designs", icon: Palette },
];

const SECONDARY_ITEMS: Array<{ to: string; label: string; icon: any; badge?: string }> = [
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/graph", label: "Knowledge Graph", icon: Share2, badge: "New" },
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
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background">
          S
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-foreground">Slash User</p>
          <p className="text-[11px] text-muted-foreground">No account · Local only</p>
        </div>
        <Link to="/me">
          <Settings className="size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
