import { useNavigate } from "@tanstack/react-router";

import { CommandCard } from "./CommandCard";
import { useLibrary } from "@/hooks/use-library";
import { useCommandActions } from "@/hooks/use-command-actions";
import { cn } from "@/lib/utils";
import type { SlashCommand } from "@/lib/commands";

interface Props {
  commands: SlashCommand[];
  query?: string;
  className?: string;
}

/** Shared card grid — every card links to the /c/$slug detail route. */
export function CommandGrid({ commands, query = "", className }: Props) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, settings } = useLibrary();
  const { copyCommand, openCommand } = useCommandActions();

  return (
    <div
      className={cn(
        "grid gap-3",
        settings.view === "grid" && "sm:grid-cols-2 xl:grid-cols-3",
        settings.density === "compact" && "gap-2",
        className,
      )}
    >
      {commands.map((c) => (
        <CommandCard
          key={c.id}
          command={c}
          query={query}
          view={settings.view}
          compact={settings.density === "compact"}
          favorite={isFavorite(c.id)}
          onOpen={(cmd) => {
            openCommand(cmd);
            void navigate({ to: "/c/$slug", params: { slug: cmd.id } });
          }}
          onToggleFavorite={toggleFavorite}
          onCopy={copyCommand}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center rounded-xl px-6 py-14 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
