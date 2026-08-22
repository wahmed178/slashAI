import { Star, History, Settings, Terminal, LayoutGrid, X } from "lucide-react";
import { categoryIcon } from "./icons";
import { CATEGORY_COUNTS, COMMANDS } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  category: string;
  onCategory: (category: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  recentsCount: number;
  onOpenRecents: () => void;
  onOpenSettings: () => void;
  onClose?: (() => void) | undefined;
}

export function SidebarContents({
  category,
  onCategory,
  onlyFavorites,
  onToggleFavorites,
  favoritesCount,
  recentsCount,
  onOpenRecents,
  onOpenSettings,
  onClose,
}: Props) {
  const item = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
    );

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Terminal className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">SlashAI</p>
          <p className="truncate text-xs text-muted-foreground">{COMMANDS.length} commands</p>
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="space-y-1 px-2 py-3">
        <button
          type="button"
          className={item(category === "all" && !onlyFavorites)}
          onClick={() => onCategory("all")}
        >
          <LayoutGrid className="size-4" /> All commands
          <span className="ml-auto text-xs text-muted-foreground">{COMMANDS.length}</span>
        </button>
        <button type="button" className={item(onlyFavorites)} onClick={onToggleFavorites}>
          <Star className={cn("size-4", onlyFavorites && "fill-primary text-primary")} /> Favorites
          <span className="ml-auto text-xs text-muted-foreground">{favoritesCount}</span>
        </button>
        <button type="button" className={item(false)} onClick={onOpenRecents}>
          <History className="size-4" /> Recently used
          <span className="ml-auto text-xs text-muted-foreground">{recentsCount}</span>
        </button>
      </div>

      <p className="px-4 pt-1 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        Categories
      </p>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 pb-4">
          {CATEGORY_COUNTS.map((c) => {
            const Icon = categoryIcon(c.icon);
            return (
              <button
                key={c.category}
                type="button"
                className={item(category === c.category && !onlyFavorites)}
                onClick={() => onCategory(c.category)}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{c.category}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.count}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-2">
        <button type="button" className={item(false)} onClick={onOpenSettings}>
          <Settings className="size-4" /> Settings
        </button>
      </div>
    </div>
  );
}
