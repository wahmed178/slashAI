import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Gauge, ShieldCheck } from "lucide-react";

import { getPlayGame, PLAY_SECTIONS, gameMeta, type PlayGame } from "@/lib/slashplay";
import { getSlashTool, similarTools, type SlashTool } from "@/lib/slashkits";

type Kind = "tool" | "game";

const TOOL_STEPS = [
  "Open the tool — it runs entirely in your browser, nothing is uploaded.",
  "Enter or paste your input and follow the on-screen controls.",
  "Copy or download the result. Add it to Saved to find it again.",
];

const GAME_STEPS = [
  "Read the goal at the top of the screen (most games explain themselves inline).",
  "Use tap / swipe on mobile, or the arrow keys and space on a desktop.",
  "Beat your own score — personal bests are stored on your device.",
];

function similarGames(slug: string, limit = 3): PlayGame[] {
  const section = PLAY_SECTIONS.find((s) => s.games.some((g) => g.slug === slug));
  const pool = section ? section.games : (PLAY_SECTIONS[0]?.games ?? []);
  const picked = pool.filter((g) => g.slug !== slug).slice(0, limit);
  if (picked.length >= limit) return picked;
  const extra = (PLAY_SECTIONS[0]?.games ?? []).filter(
    (g) => g.slug !== slug && !picked.some((p) => p.slug === g.slug),
  );
  return [...picked, ...extra].slice(0, limit);
}

/**
 * The shared "what is this / how do I use it / what else is like it" block.
 * AppShell renders it underneath every tool and game screen, so all 150+
 * catalogue pages get consistent onboarding without touching each route file.
 */
export function CatalogueExtras({ kind, slug }: { kind: Kind; slug: string }) {
  const tool: SlashTool | undefined = kind === "tool" ? getSlashTool(slug) : undefined;
  const game: PlayGame | undefined = kind === "game" ? getPlayGame(slug) : undefined;

  // unknown slug (or a hub link) — nothing honest to add
  if (kind === "tool" && !tool) return null;
  if (kind === "game" && !game) return null;

  const name = tool?.name ?? game?.name ?? "";
  const steps = kind === "tool" ? TOOL_STEPS : GAME_STEPS;
  const similar = kind === "tool" ? similarTools(slug) : similarGames(slug);
  const meta = game ? gameMeta(game.slug) : null;

  return (
    <div className="mt-8 space-y-4 border-t border-border pt-6">
      {kind === "tool" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden />
            🔒 Runs in your browser · Nothing uploaded
          </span>
          <span aria-hidden className="hidden text-muted-foreground/40 sm:inline">
            •
          </span>
          <span>No account · Free forever · Works offline</span>
        </div>
      )}

      <section>
        <h2 className="text-[13px] font-bold tracking-wide text-foreground uppercase">
          {kind === "tool" ? `How to use ${name}` : `How to play ${name}`}
        </h2>
        <ol className="mt-2 space-y-1.5">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
              <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        {meta && (
          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden /> about {meta.minutes} min to play
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-3.5" aria-hidden /> 🎯 {meta.level}
            </span>
            <span>{game?.players} · pass-and-play, one device</span>
          </p>
        )}
      </section>

      {similar.length > 0 && (
        <section>
          <h2 className="text-[13px] font-bold tracking-wide text-foreground uppercase">
            {kind === "tool" ? "Similar tools" : "Similar games"}
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {similar.map((item) => (
              <Link
                key={item.slug}
                to={(kind === "tool" ? `/tools/${item.slug}` : `/play/${item.slug}`) as string}
                className="group flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/50"
              >
                <span className="text-[20px]" aria-hidden>
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {item.desc}
                  </span>
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
