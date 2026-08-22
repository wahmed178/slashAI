import { useEffect, useState } from "react";
import { Star, Copy, Wand2, Hash, Share2, Shuffle, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryIcon } from "./icons";
import { useCommandActions } from "@/hooks/use-command-actions";
import {
  CATEGORY_ICONS,
  commandTemplate,
  getRandomCommand,
  relatedCommands,
  type SlashCommand,
} from "@/lib/commands";
import { cn } from "@/lib/utils";

interface Props {
  command: SlashCommand;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCommand: (cmd: SlashCommand) => void;
}

export function CommandDetailContent({
  command,
  favorite,
  onToggleFavorite,
  onOpenCommand,
}: Props) {
  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
  const related = relatedCommands(command);
  const { copyCommand, copyPrompt, runCommand, shareCommand } = useCommandActions();
  const [template, setTemplate] = useState(() => commandTemplate(command));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTemplate(commandTemplate(command));
    setCopied(false);
  }, [command]);

  const flash = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5">
      {/* prominent slash command */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-accent/50 px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <code className="min-w-0 flex-1 font-mono text-lg font-semibold break-all text-foreground">
          {command.command}
        </code>
        <Button
          size="sm"
          variant="secondary"
          className="gap-1.5"
          onClick={() => {
            copyCommand(command);
            flash();
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>{command.category}</span>
        <span aria-hidden>/</span>
        <span>{command.subcategory}</span>
        <span className="rounded-md border border-border px-1.5 py-0.5 capitalize">
          {command.difficulty}
        </span>
        <span className="rounded-md border border-border px-1.5 py-0.5 capitalize">
          {command.type}
        </span>
      </div>

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
        <p className="mt-1.5 text-sm text-foreground">{command.howToUse}</p>
      </section>

      <section>
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Example
        </h4>
        <pre className="mt-1.5 overflow-x-auto rounded-lg border border-border bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
          {command.example}
        </pre>
      </section>

      <section>
        <label
          htmlFor="command-template"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Editable template
        </label>
        <textarea
          id="command-template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          spellCheck={false}
          rows={8}
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
        />
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
      </section>

      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Related commands
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() =>
                onOpenCommand(
                  related[Math.floor(Math.random() * related.length)] ??
                    getRandomCommand(command.id),
                )
              }
            >
              <Shuffle className="size-3.5" /> Random related
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {related.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpenCommand(r)}
                className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {r.command}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button onClick={() => runCommand(command, template)} className="gap-1.5">
          <Wand2 className="size-4" /> Use command
        </Button>
        <Button variant="outline" onClick={() => copyPrompt(command, template)} className="gap-1.5">
          <Copy className="size-4" /> Copy full prompt
        </Button>
        <Button variant="outline" onClick={() => void shareCommand(command)} className="gap-1.5">
          <Share2 className="size-4" /> Share
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
    </div>
  );
}
