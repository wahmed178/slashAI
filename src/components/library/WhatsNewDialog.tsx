import { Sparkles, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibrary } from "@/hooks/use-library";
import { LATEST_RELEASE } from "@/lib/app-meta";

/** Shown once after the app updates to a new version. */
export function WhatsNewDialog() {
  const { showWhatsNew, dismissWhatsNew } = useLibrary();

  return (
    <Dialog open={showWhatsNew} onOpenChange={(o) => !o && dismissWhatsNew()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <DialogTitle className="text-left">What's new — v{LATEST_RELEASE.version}</DialogTitle>
          <DialogDescription className="text-left">{LATEST_RELEASE.title}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[45vh] pr-3">
          <ul className="space-y-2.5">
            {LATEST_RELEASE.changes.map((c) => (
              <li key={c} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <DialogFooter>
          <Button className="w-full" onClick={dismissWhatsNew}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
