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
} from "lucide-react";

const NAV_ITEMS: Array<{ to: string; label: string; icon: any; exact?: boolean; badge?: string }> = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Commands", icon: Terminal },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tools", label: "SlashKits", icon: Wrench, badge: "New" },
  { to: "/hub", label: "Hubs", icon: LayoutGrid },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/generators", label: "Generators", icon: Zap },
  { to: "/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/live", label: "Live", icon: Radio, badge: "Hot" },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
  { to: "/deals", label: "Deals", icon: Tag },
];

const SECONDARY_ITEMS: Array<{ to: string; label: string; icon: any }> = [
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/favorites", label: "Saved", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
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
    <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-[#21262d] bg-[#0f1117] md:flex">
      {/* Logo */}
      <div className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 px-2 focus-visible:outline-none">
          <span className="text-[22px]">⚡</span>
          <span className="text-[18px] font-bold text-[#f0f6fc]">SlashAI</span>
          <svg className="ml-1 size-3.5 text-[#8b949e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
      </div>

      <div className="h-px bg-[#21262d]" />

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
                  ? "bg-[rgba(45,212,191,0.1)] text-[#f0f6fc] border-l-2 border-l-[#2dd4bf] pl-2"
                  : "text-[#8b949e] hover:bg-[#1c2128] hover:text-[#f0f6fc] border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon
                className={`size-[18px] shrink-0 ${active ? "text-[#2dd4bf]" : ""}`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
                    item.badge === "Hot"
                      ? "bg-[#f85149] text-white"
                      : "bg-[#2dd4bf] text-[#0a0a0f]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-[#21262d]" />

        {SECONDARY_ITEMS.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${
                active
                  ? "bg-[rgba(45,212,191,0.1)] text-[#f0f6fc] border-l-2 border-l-[#2dd4bf] pl-2"
                  : "text-[#8b949e] hover:bg-[#1c2128] hover:text-[#f0f6fc] border-l-2 border-l-transparent pl-2"
              }`}
            >
              <item.icon
                className={`size-[18px] shrink-0 ${active ? "text-[#2dd4bf]" : ""}`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade to Pro card */}
      <div className="mx-3 mb-3">
        <div className="rounded-[10px] border border-[rgba(45,212,191,0.2)] bg-gradient-to-br from-[#1a1f2e] to-[#1f2a1f] p-3.5">
          <span className="text-[20px]">👑</span>
          <p className="mt-1.5 text-[13px] font-bold text-[#f0f6fc]">Upgrade to Pro</p>
          <p className="mt-1 text-[11px] leading-tight text-[#8b949e]">
            Unlock premium tools, unlimited access & more.
          </p>
          <Link
            to="/glass"
            className="mt-2.5 flex h-[32px] w-full items-center justify-center rounded-[6px] bg-[#2dd4bf] text-[12px] font-bold text-[#0a0a0f] transition-colors hover:bg-[#25b8a6]"
          >
            Upgrade Now
          </Link>
        </div>
      </div>

      {/* User indicator */}
      <div className="flex items-center gap-2.5 border-t border-[#21262d] px-3 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2dd4bf] text-[14px] font-bold text-[#0a0a0f]">
          S
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-[#f0f6fc]">Slash User</p>
          <p className="text-[11px] text-[#8b949e]">Free Plan</p>
        </div>
        <Settings className="size-4 shrink-0 text-[#8b949e]" />
      </div>
    </aside>
  );
}
