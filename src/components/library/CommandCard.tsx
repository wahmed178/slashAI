import { Star, Copy, ArrowUpRight } from "lucide-react";
import { Highlight } from "./Highlight";
import { categoryIcon } from "./icons";
import { CATEGORY_ICONS, type SlashCommand } from "@/lib/commands";
import { cn } from "@/lib/utils";

interface Props {
  command: SlashCommand;
  query: string;
  view: "grid" | "list";
  compact: boolean;
  favorite: boolean;
  onOpen: (cmd: SlashCommand) => void;
  onToggleFavorite: (id: string) => void;
  onCopy: (cmd: SlashCommand) => void;
}

const difficultyStyles: Record<string, string> = {
  easy: "border-chart-2/40 text-chart-2",
  medium: "border-chart-3/40 text-chart-3",
  advanced: "border-chart-5/40 text-chart-5",
};

export function CommandCard({
  command,
  query,
  view,
  compact,
  favorite,
  onOpen,
  onToggleFavorite,
  onCopy,
}: Props) {
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open ${command.command}`}
      onClick={() => onOpen(command)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(command);
        }
      }}
      className={cn(
        "group panel relative cursor-pointer rounded-xl outline-none transition-colors",
        "hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "p-3" : "p-4",
        view === "list" && "flex items-start gap-4",
      )}
    >
      <div className={cn("flex items-start gap-3", view === "list" ? "min-w-0 flex-1" : "")}>
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-mono text-sm font-semibold tracking-tight text-foreground">
            <Highlight text={command.command} query={query} />
          </h3>
          <p
            className={cn(
              "mt-1 text-sm text-muted-foreground",
              compact || view === "list" ? "line-clamp-1" : "line-clamp-2",
            )}
          >
            <Highlight text={command.description} query={query} />
          </p>
          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {command.category}
              </span>
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[11px] capitalize",
                  difficultyStyles[command.difficulty],
                )}
              >
                {command.difficulty}
              </span>
              {command.tags.slice(0, view === "list" ? 4 : 2).map((tag) => (
                <span key={tag} className="text-[11px] text-muted-foreground/80">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(command.id);
          }}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Star className={cn("size-4", favorite && "fill-primary text-primary")} />
        </button>
        <button
          type="button"
          aria-label={`Copy ${command.command}`}
          onClick={(e) => {
            e.stopPropagation();
            onCopy(command);
          }}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Copy className="size-4" />
        </button>
        <span className="hidden rounded-md p-1.5 text-muted-foreground sm:block">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </article>
  );
}
