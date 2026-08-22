import { useEffect, useState } from "react";
import { CalendarDays, Shuffle, Star, Copy, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryIcon } from "./icons";
import { useCommandActions } from "@/hooks/use-command-actions";
import {
  CATEGORY_ICONS,
  FEATURED,
  getDailyCommand,
  getRandomCommand,
  todayKey,
  type SlashCommand,
} from "@/lib/commands";
import { cn } from "@/lib/utils";

interface WidgetProps {
  label: string;
  hint: string;
  icon: typeof CalendarDays;
  command: SlashCommand;
  favorite: boolean;
  onOpen: (cmd: SlashCommand) => void;
  onToggleFavorite: (id: string) => void;
  onRefresh?: () => void;
}

function CommandWidget({
  label,
  hint,
  icon: Badge,
  command,
  favorite,
  onOpen,
  onToggleFavorite,
  onRefresh,
}: WidgetProps) {
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
  const { copyCommand } = useCommandActions();

  return (
    <section className="panel flex flex-col rounded-xl p-4">
      <div className="flex items-center gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
          <Badge className="size-3.5" aria-hidden /> {label}
        </p>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 gap-1.5 text-xs"
            onClick={onRefresh}
          >
            <RefreshCw className="size-3.5" /> Shuffle
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpen(command)}
        className="mt-3 flex items-start gap-3 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-sm font-semibold text-foreground">
            {command.command}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {command.category} / {command.subcategory}
          </span>
        </span>
      </button>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{command.description}</p>
      <p className="mt-1 hidden text-xs text-muted-foreground/80 sm:block">{hint}</p>

      <div className="mt-3 flex items-center gap-1.5">
        <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => onOpen(command)}>
          Open
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
          onClick={() => onToggleFavorite(command.id)}
        >
          <Star className={cn("size-4", favorite && "fill-primary text-primary")} />
        </Button>
      </div>
    </section>
  );
}

interface Props {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (cmd: SlashCommand) => void;
}

export function DashboardWidgets({ isFavorite, onToggleFavorite, onOpen }: Props) {
  const [daily, setDaily] = useState<SlashCommand>(() => getDailyCommand("2026-01-01"));
  const [random, setRandom] = useState<SlashCommand>(() => getDailyCommand("random-seed"));

  // resolve the real date and a real random pick after hydration to keep SSR stable
  useEffect(() => {
    setDaily(getDailyCommand(todayKey()));
    setRandom(getRandomCommand());
  }, []);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <CommandWidget
        label="Command of the day"
        hint="Everyone sees the same pick today — it changes at midnight UTC."
        icon={CalendarDays}
        command={daily}
        favorite={isFavorite(daily.id)}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
      <CommandWidget
        label="Random command"
        hint="A fresh pick from the whole catalog. Press R anywhere to reroll."
        icon={Shuffle}
        command={random}
        favorite={isFavorite(random.id)}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
        onRefresh={() => setRandom(getRandomCommand(random.id))}
      />

      <section className="panel rounded-xl p-4 md:col-span-2 xl:col-span-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          <Sparkles className="size-3.5" aria-hidden /> Featured commands
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FEATURED.slice(0, 12).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onOpen(f)}
              className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {f.command}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
