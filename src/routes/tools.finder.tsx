import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { UniversalSearch } from "@/components/library/UniversalSearch";
import { useLibrary } from "@/hooks/use-library";
import { VERIFIED_TOTAL } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { ALL_PLAY_GAMES } from "@/lib/slashplay";
import { useEffect } from "react";

export const Route = createFileRoute("/tools/finder")({
  validateSearch: (raw: Record<string, unknown>) => ({
    q: typeof raw["q"] === "string" ? raw["q"] : "",
  }),
  component: ToolFinder,
});

function ToolFinder() {
  const { q: initialQ } = Route.useSearch();
  const { recordSearch } = useLibrary();

  // arrive with ?q= → record the search (panel itself opens via initialQuery)
  useEffect(() => {
    if (initialQ) recordSearch(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell wide hideHeaderSearch title="Find Anything">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">🔍 Find Anything</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          One search across {VERIFIED_TOTAL.toLocaleString()} commands, {ALL_SLASH_TOOLS.length} tools, {ALL_PLAY_GAMES.length} games - and the web.
        </p>
      </header>

      <div className="relative z-30 mx-auto mt-6 max-w-2xl">
        <UniversalSearch size="lg" initialQuery={initialQ || undefined} autoFocus />
      </div>

      {/* quick idea chips */}
      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {[
          { label: "🎯 password-game", to: "/play/password-game" },
          { label: "🖼️ image compressor", to: "/tools/image-compress" },
          { label: "💰 SIP calculator", to: "/tools/sip-calculator" },
          { label: "🧠 daily quiz", to: "/quiz" },
          { label: "📌 QR code", to: "/tools/qr-code" },
          { label: "🐍 snake", to: "/play/snake" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* deep links */}
      <div className="mx-auto mt-10 grid max-w-2xl gap-2 sm:grid-cols-3">
        {[
          { to: "/search", icon: "⌨️", title: "Command search", desc: "Filters, categories, 45 topics" },
          { to: "/tools", icon: "🧰", title: "Browse all tools", desc: "The full SlashKits library" },
          { to: "/web-search", icon: "🌐", title: "Web search", desc: "Free results, category pickers" },
        ].map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
          >
            <span className="text-[22px]">{d.icon}</span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold text-foreground">{d.title}</span>
              <span className="block truncate text-[12px] text-muted-foreground">{d.desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
