import { Star, Copy, Wand2, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categoryIcon } from "./icons";
import { CATEGORY_ICONS, relatedCommands, type SlashCommand } from "@/lib/commands";
import { cn } from "@/lib/utils";

interface Props {
  command: SlashCommand | undefined;
  open: boolean;
  favorite: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onCopyCommand: (cmd: SlashCommand) => void;
  onCopyPrompt: (cmd: SlashCommand) => void;
  onUse: (cmd: SlashCommand) => void;
  onSelectRelated: (cmd: SlashCommand) => void;
}

export function CommandDetail({
  command,
  open,
  favorite,
  onOpenChange,
  onToggleFavorite,
  onCopyCommand,
  onCopyPrompt,
  onUse,
  onSelectRelated,
}: Props) {
  if (!command) return null;
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
  const related = relatedCommands(command);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <div className="flex items-start gap-3 pr-8">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <DialogTitle className="font-mono text-base break-all">{command.command}</DialogTitle>
              <DialogDescription className="mt-0.5">
                {command.title} · {command.category} / {command.subcategory}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[52vh]">
          <div className="space-y-5 px-5 py-4">
            <section>
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                What it does
              </h4>
              <p className="mt-1.5 text-sm text-foreground">{command.description}</p>
            </section>

            <section>
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                How to use
              </h4>
              <p className="mt-1.5 text-sm text-foreground">{command.usage}</p>
            </section>

            <section>
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Example
              </h4>
              <pre className="mt-1.5 overflow-x-auto rounded-lg border border-border bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
                {command.example}
              </pre>
            </section>

            <section className="flex flex-wrap items-center gap-1.5">
              {command.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  <Hash className="size-3" aria-hidden />
                  {tag}
                </span>
              ))}
              <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground capitalize">
                {command.difficulty}
              </span>
              <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground capitalize">
                {command.type}
              </span>
            </section>

            {related.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Related commands
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSelectRelated(r)}
                      className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {r.command}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-elevated px-5 py-3">
          <Button onClick={() => onUse(command)} className="gap-1.5">
            <Wand2 className="size-4" /> Use command
          </Button>
          <Button variant="secondary" onClick={() => onCopyCommand(command)} className="gap-1.5">
            <Copy className="size-4" /> Copy command
          </Button>
          <Button variant="outline" onClick={() => onCopyPrompt(command)} className="gap-1.5">
            <Copy className="size-4" /> Copy full prompt
          </Button>
          <Button
            variant="ghost"
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(command.id)}
            className="gap-1.5"
          >
            <Star className={cn("size-4", favorite && "fill-primary text-primary")} />
            {favorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
