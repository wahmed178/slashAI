import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Dices } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { SLASH_APPS } from "@/lib/slashbar";
import { SLASH_TOOL_COUNT } from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";

export const Route = createFileRoute("/slash/")({
  head: () => ({
    meta: [
      { title: "SlashBar - every Slash app in one rail | SlashAI" },
      {
        name: "description",
        content:
          "SlashKits, SlashPlay, SlashGram, Labs, Learning, Brain Boosters and more - one rail, everything working, everything free.",
      },
    ],
  }),
  component: SlashBarPage,
});

function SlashBarPage() {
  const navigate = useNavigate();

  const roll = () => {
    const app = SLASH_APPS[Math.floor(Math.random() * SLASH_APPS.length)] ?? SLASH_APPS[0];
    if (!app) return;
    const path = app.link ?? `/slash/${app.slug}`;
    navigate({ to: path, replace: true });
  };

  return (
    <AppShell wide hideHeaderSearch title="SlashBar">
      <header className="page-enter pt-2">
        <h1 className="bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#f472b6] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          ⚡ SlashBar
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SLASH_APPS.length} Slash apps in one rail. Pick one, everything inside actually works.
        </p>
      </header>

      {/* the rail - Instagram-style stories bar */}
      <div
        className="stagger-children mt-4 flex gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {SLASH_APPS.map((app) => {
          const inner = (
            <>
              <span
                className="grid size-[64px] place-items-center rounded-full p-[2.5px]"
                style={{
                  background: `conic-gradient(from 210deg, ${app.tint.hex}, ${"#a78bfa"}, ${"#f472b6"}, ${app.tint.hex})`,
                }}
              >
                <span className="grid size-full place-items-center rounded-full bg-background text-[24px]">
                  {app.emoji}
                </span>
              </span>
              <span className="w-[72px] truncate text-center text-[10px] font-medium text-muted-foreground">
                {app.name.replace("Slash ", "").replace("SlashKits", "Kits").replace("SlashPlay", "Play")}
              </span>
            </>
          );
          return app.link ? (
            <Link
              key={app.slug}
              to={app.link}
              className="ripple-press flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              {inner}
            </Link>
          ) : (
            <Link
              key={app.slug}
              to="/slash/$app"
              params={{ app: app.slug }}
              className="ripple-press flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              {inner}
            </Link>
          );
        })}
      </div>

      {/* app grid with descriptions */}
      <div className="stagger-children mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {SLASH_APPS.map((app) => {
          const body = (
            <>
              <span className="flex items-center gap-2">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-[20px]"
                  style={{ background: `color-mix(in oklab, ${app.tint.hex} 14%, transparent)` }}
                >
                  {app.emoji}
                </span>
                <span className="min-w-0">
                  <span className="cat-text block truncate text-[13.5px] font-bold">{app.name}</span>
                  <span className="block text-[10.5px] font-semibold text-muted-foreground">
                    {app.link
                      ? app.slug === "kits"
                        ? `${SLASH_TOOL_COUNT}+ tools`
                        : `${PLAY_GAME_COUNT} games`
                      : `${app.widgets.length} widgets`}
                  </span>
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block text-[12px] leading-snug text-muted-foreground">
                {app.desc}
              </span>
            </>
          );
          return app.link ? (
            <Link
              key={app.slug}
              to={app.link}
              style={{ "--cat": app.tint.hex } as React.CSSProperties}
              className="cat cat-glow ripple-press rounded-xl border bg-surface p-3.5"
            >
              {body}
            </Link>
          ) : (
            <Link
              key={app.slug}
              to="/slash/$app"
              params={{ app: app.slug }}
              style={{ "--cat": app.tint.hex } as React.CSSProperties}
              className="cat cat-glow ripple-press rounded-xl border bg-surface p-3.5"
            >
              {body}
            </Link>
          );
        })}
      </div>

      {/* random roll */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={roll}
          className="ripple-press inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary"
        >
          <Dices className="size-4" aria-hidden />
          Open a random Slash app
        </button>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        New apps land here first. Everything runs in your browser - free forever.
      </p>
    </AppShell>
  );
}
