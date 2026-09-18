import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { useUxTick } from "@/hooks/use-ux";
import { COMMANDS, type SlashCommand } from "@/lib/commands";
import { TOOL_SECTIONS, type SlashTool } from "@/lib/slashkits";
import { PLAY_SECTIONS, type PlayGame } from "@/lib/slashplay";
import { uxInteractions, favouriteTags } from "@/lib/ux";

interface Suggestion {
  key: string;
  title: string;
  desc: string;
  emoji: string;
  to: string;
  kind: string;
}

const MAX = 4;

/**
 * "You might like" — after the visitor has used the site a little, suggest
 * things from the shelves they already gravitate towards. Entirely local:
 * it reads the interaction log in localStorage and never phones home.
 */
function buildSuggestions(): { tags: string[]; items: Suggestion[] } {
  const tags = favouriteTags(3);
  if (tags.length === 0) return { tags, items: [] };

  const seen = new Set(uxInteractions().map((e) => e.id));
  const items: Suggestion[] = [];

  const toolSections = TOOL_SECTIONS.filter((s) => tags.includes(s.title));
  const playSections = PLAY_SECTIONS.filter((s) => tags.includes(s.title));

  for (const section of toolSections) {
    for (const tool of section.tools as SlashTool[]) {
      if (items.length >= MAX) break;
      if (seen.has(tool.slug) || tool.hub) continue;
      items.push({
        key: `tool-${tool.slug}`,
        title: tool.name,
        desc: tool.desc,
        emoji: tool.icon,
        to: `/tools/${tool.slug}`,
        kind: "Tool",
      });
    }
  }

  for (const section of playSections) {
    for (const game of section.games as PlayGame[]) {
      if (items.length >= MAX) break;
      if (seen.has(game.slug)) continue;
      items.push({
        key: `game-${game.slug}`,
        title: game.name,
        desc: game.desc,
        emoji: game.icon,
        to: `/play/${game.slug}`,
        kind: "Game",
      });
    }
  }

  // top up with commands from a matching category
  if (items.length < MAX) {
    const wanted = new Set(tags.map((t) => t.toLowerCase()));
    const matches: SlashCommand[] = COMMANDS.filter(
      (c) => wanted.has(c.category.toLowerCase()) && !seen.has(c.id),
    ).slice(0, MAX - items.length);
    for (const cmd of matches) {
      items.push({
        key: `cmd-${cmd.id}`,
        title: cmd.command,
        desc: cmd.description,
        emoji: "⚡",
        to: `/c/${cmd.id}`,
        kind: cmd.category,
      });
    }
  }

  return { tags, items };
}

export function YouMightLike() {
  // re-read whenever the interaction log changes
  useUxTick();
  const { tags, items } = buildSuggestions();

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden />
          You might like
        </h2>
        <span className="text-[11.5px] text-muted-foreground">
          Based on what you opened on this device
          {tags.length > 0 ? ` · ${tags.slice(0, 2).join(", ")}` : ""}
        </span>
      </div>
      <div className="stagger-children mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.to as string}
            className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-[19px]" aria-hidden>
              {item.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-[13px] font-semibold text-foreground">{item.title}</span>
                <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
                  {item.kind}
                </span>
              </span>
              <span className="mt-0.5 block line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                {item.desc}
              </span>
            </span>
            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}
