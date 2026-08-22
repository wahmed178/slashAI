import { Link } from "@tanstack/react-router";
import { Copy, Flame, Heart, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryIcon } from "./icons";
import { useLibrary } from "@/hooks/use-library";
import { useCommandActions } from "@/hooks/use-command-actions";
import { CATEGORY_ICONS, type SlashCommand } from "@/lib/commands";
import { copyCount, formatCount, isTrending } from "@/lib/engagement";
import { cn } from "@/lib/utils";

/** Full-width feed card — one command, one glance, three actions. */
export function FeedCard({ command, index = 0 }: { command: SlashCommand; index?: number }) {
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
  const { isFavorite, toggleFavorite, settings } = useLibrary();
  const { copyCommand, runCommand } = useCommandActions();
  const favorite = isFavorite(command.id);
  const trending = isTrending(command);

  return (
    <article
      className="panel feed-in rounded-2xl p-4"
      style={settings.reducedMotion ? undefined : { animationDelay: `${Math.min(index, 6) * 45}ms` }}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="size-3.5 text-primary" aria-hidden />
          {command.category}
        </span>
        {trending && (
          <span className="flex items-center gap-1 rounded-full border border-chart-3/40 px-2 py-0.5 text-chart-3">
            <Flame className="size-3" aria-hidden /> Trending
          </span>
        )}
      </div>

      <Link
        to="/c/$slug"
        params={{ slug: command.id }}
        className="mt-2.5 block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <h3 className="font-mono text-lg font-semibold break-all text-foreground">
          {command.command}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {command.description}
        </p>
      </Link>

      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        <Button size="sm" className="gap-1.5" onClick={() => runCommand(command)}>
          <Wand2 className="size-3.5" /> Use
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => copyCommand(command)}>
          <Copy className="size-3.5" /> Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from saved" : "Save command"}
          onClick={() => toggleFavorite(command.id)}
          className="gap-1.5"
        >
          <Heart className={cn("size-4", favorite && "fill-primary text-primary")} />
          {favorite ? "Saved" : "Save"}
        </Button>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span>📋 Copied {formatCount(copyCount(command))} times</span>
        <span className="capitalize">{command.difficulty}</span>
        <span>{command.subcategory}</span>
      </p>
    </article>
  );
}
