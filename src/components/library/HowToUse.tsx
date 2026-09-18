import { useEffect, useState } from "react";
import { Check, ChevronDown, ClipboardPaste, MousePointerClick, Sparkles, SquarePen } from "lucide-react";

import { isFirstTimeVisitor, markVisited } from "@/lib/ux";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Click Copy",
    body: "Tap the copy button on the command card or detail page.",
  },
  {
    icon: Sparkles,
    title: "Open ChatGPT, Gemini or Claude",
    body: "Any free AI assistant works — pick your favourite.",
  },
  {
    icon: SquarePen,
    title: "Replace anything in [brackets]",
    body: "Square-bracket placeholders are the only parts you edit.",
  },
  {
    icon: Check,
    title: "Hit enter and get your result",
    body: "You get a finished answer — no prompt engineering needed.",
  },
] as const;

interface Props {
  className?: string;
  /** force the panel open regardless of first-visit state */
  defaultOpen?: boolean;
}

/**
 * The four-step "How to use this command" guide. Auto-expanded for first-time
 * visitors (localStorage `slash_first_visit`), collapsed afterwards.
 */
export function HowToUse({ className, defaultOpen }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
      return;
    }
    if (isFirstTimeVisitor()) {
      setOpen(true);
      // one look is enough — every later visit starts collapsed
      markVisited();
    }
  }, [defaultOpen]);

  return (
    <section className={cn("panel overflow-hidden rounded-xl", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center gap-2 px-3.5 py-2 text-left"
      >
        <ClipboardPaste className="size-4 shrink-0 text-primary" aria-hidden />
        <span className="flex-1 text-[12.5px] font-semibold tracking-wide text-foreground">
          How to use this command
        </span>
        <span className="hidden text-[11px] text-muted-foreground sm:inline">
          Copy → paste → edit → done
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ol className="space-y-2 border-t border-border px-3.5 py-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
                  <step.icon className="size-3.5 text-primary" aria-hidden />
                  {step.title}
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
