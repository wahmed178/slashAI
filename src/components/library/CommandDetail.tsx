import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandDetailContent } from "./CommandDetailContent";
import type { SlashCommand } from "@/lib/commands";

interface Props {
  command: SlashCommand | undefined;
  open: boolean;
  favorite: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onSelectRelated: (cmd: SlashCommand) => void;
}

export function CommandDetail({
  command,
  open,
  favorite,
  onOpenChange,
  onToggleFavorite,
  onSelectRelated,
}: Props) {
  if (!command) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="pr-8 text-base">{command.title}</DialogTitle>
          <DialogDescription>
            {command.category} / {command.subcategory}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[76vh]">
          <div className="px-5 py-4">
            <CommandDetailContent
              command={command}
              favorite={favorite}
              onToggleFavorite={onToggleFavorite}
              onOpenCommand={onSelectRelated}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
