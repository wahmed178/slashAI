import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Settings } from "lucide-react";

import { NAV_GROUPS } from "./nav-groups";

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function DesktopSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of NAV_GROUPS) {
      if (g.match(pathname)) initial[g.id] = true;
    }
    return initial;
  });

  return (
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 px-2 focus-visible:outline-none">
          <span className="text-[22px]">⚡</span>
          <span className="text-[18px] font-bold text-foreground">SlashAI</span>
        </Link>
      </div>

      <div className="h-px bg-surface-elevated" />

      {/* Grouped nav with sub-folders */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => {
          const groupActive = group.match(pathname);
          const expanded = open[group.id] ?? false;
          const Icon = group.icon;

          // simple link (no leaves)
          if (group.leaves.length === 0 && group.to) {
            const active = isActive(pathname, group.to) || groupActive;
            return (
              <Link
                key={group.id}
                to={group.to}
                className={`flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <Icon className={`size-[18px] shrink-0 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.2 : 1.8} />
                <span className="flex-1">{group.label}</span>
              </Link>
            );
          }

          return (
            <div key={group.id}>
              <div className="flex items-center">
                <Link
                  to={group.to ?? "#"}
                  className={`flex h-[36px] min-w-0 flex-1 items-center gap-2.5 rounded-l-[6px] px-2.5 text-[13px] transition-all duration-150 ${
                    groupActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                  }`}
                >
                  <Icon className={`size-[18px] shrink-0 ${groupActive ? "text-primary" : ""}`} strokeWidth={groupActive ? 2.2 : 1.8} />
                  <span className="flex-1 truncate">{group.label}</span>
                  {group.badge && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-background">
                      {group.badge}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${group.label}`}
                  aria-expanded={expanded}
                  onClick={() => setOpen((prev) => ({ ...prev, [group.id]: !expanded }))}
                  className={`flex h-[36px] w-[26px] shrink-0 items-center justify-center rounded-r-[6px] transition-all duration-150 ${
                    groupActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                  }`}
                >
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {expanded && (
                <div className="dropdown-reveal mb-1.5 ml-[18px] mt-0.5 flex flex-col gap-0.5 border-l border-surface-elevated pl-2.5">
                  {group.to && (
                    <Link
                      to={group.to}
                      onClick={() => setOpen((prev) => ({ ...prev, [group.id]: true }))}
                      className={`flex h-[30px] items-center rounded-[6px] px-2 text-[12.5px] font-medium transition-all duration-150 ${
                        pathname === group.to
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                      }`}
                    >
                      Overview
                    </Link>
                  )}
                  {group.leaves.map((leaf) => {
                    const active = pathname === leaf.to;
                    return (
                      <Link
                        key={leaf.to}
                        to={leaf.to}
                        className={`flex h-[30px] items-center gap-2 rounded-[6px] px-2 text-[12.5px] transition-all duration-150 ${
                          active
                            ? "text-primary"
                            : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                        }`}
                      >
                        <span className="flex-1 truncate">{leaf.label}</span>
                        {leaf.badge && (
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
                              leaf.badge === "Hot"
                                ? "bg-red-500 text-white"
                                : "bg-surface-elevated text-muted-foreground"
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
            </div>
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
          <Settings className="size-4 shrink-0 text-muted-foreground transition-colors hover:text-foreground" />
        </Link>
      </div>
    </aside>
  );
}
