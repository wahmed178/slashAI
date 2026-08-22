import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Shuffle, Star, Copy, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryIcon } from "./icons";
import { useLibrary } from "@/hooks/use-library";
import { useCommandActions } from "@/hooks/use-command-actions";
import {
  CATEGORY_ICONS,
  getDailyCommand,
  getRandomCommand,
  todayKey,
  type SlashCommand,
} from "@/lib/commands";
import { cn } from "@/lib/utils";

function DiscoverCard({
  label,
  icon: Badge,
  command,
  onRefresh,
}: {
  label: string;
  icon: typeof CalendarDays;
  command: SlashCommand;
  onRefresh?: () => void;
}) {
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
  const { copyCommand } = useCommandActions();
  const { isFavorite, toggleFavorite } = useLibrary();
  const favorite = isFavorite(command.id);

  return (
    <article className="panel flex flex-col rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
          <Badge className="size-3.5" aria-hidden /> {label}
        </p>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 gap-1.5 text-xs"
            onClick={onRefresh}
          >
            <RefreshCw className="size-3.5" /> Surprise me
          </Button>
        )}
      </div>

      <Link
        to="/c/$slug"
        params={{ slug: command.id }}
        className="mt-3 flex items-start gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-base font-semibold text-foreground">
            {command.command}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">{command.category}</span>
        </span>
      </Link>

      <p className="mt-2.5 line-clamp-2 text-sm text-muted-foreground">{command.description}</p>

      <div className="mt-3 flex items-center gap-1.5">
        <Button asChild size="sm" variant="secondary">
          <Link to="/c/$slug" params={{ slug: command.id }}>
            Open
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => copyCommand(command)}
        >
          <Copy className="size-3.5" /> Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite(command.id)}
        >
          <Star className={cn("size-4", favorite && "fill-primary text-primary")} />
        </Button>
      </div>
    </article>
  );
}

/** The calm, finite discovery pair: one deterministic daily pick + one reroll. */
export function Discover() {
  const [daily, setDaily] = useState<SlashCommand>(() => getDailyCommand("2026-01-01"));
  const [random, setRandom] = useState<SlashCommand>(() => getDailyCommand("random-seed"));

  // resolve the real date and a real random pick after hydration to keep SSR stable
  useEffect(() => {
    setDaily(getDailyCommand(todayKey()));
    setRandom(getRandomCommand());
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <DiscoverCard label="Command of the day" icon={CalendarDays} command={daily} />
      <DiscoverCard
        label="Random command"
        icon={Shuffle}
        command={random}
        onRefresh={() => setRandom(getRandomCommand(random.id))}
      />
    </div>
  );
}
