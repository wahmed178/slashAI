import { useState } from "react";
import { Check } from "lucide-react";

import { QUICK_TARGETS, targetUrl, type AiTarget } from "@/lib/ai-targets";
import { setLastCopied } from "@/lib/ux";
import { cn } from "@/lib/utils";

interface Props {
  /** the exact text to copy before opening the assistant */
  prompt: string;
  className?: string;
  compact?: boolean;
}

/**
 * Three quick-launch buttons — "Try in ChatGPT / Gemini / Claude".
 * Each one copies the command first (so it is ready to paste) and then opens
 * the assistant, with the prompt pre-filled where the URL supports it.
 */
export function TryInRow({ prompt, className, compact }: Props) {
  const [armed, setArmed] = useState<string | null>(null);

  const launch = (target: AiTarget) => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        /* clipboard blocked — the assistant still opens */
      }
      setLastCopied(prompt);
      setArmed(target.id);
      window.setTimeout(() => setArmed(null), 4000);
      window.open(targetUrl(target, prompt), "_blank", "noopener,noreferrer");
    })();
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => launch(t)}
            aria-label={`Copy this command and try it in ${t.name}`}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-[12px] font-medium text-muted-foreground transition-colors",
              "hover:border-primary/50 hover:bg-surface-elevated hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              armed === t.id && "border-primary/60 text-primary",
            )}
          >
            <span aria-hidden>{t.emoji ?? "✨"}</span>
            {armed === t.id ? (
              <>
                <Check className="size-3.5" aria-hidden /> Copied — paste it
              </>
            ) : (
              <>Try in {t.name}</>
            )}
          </button>
        ))}
      </div>
      {!compact && (
        <p className="text-[11px] text-muted-foreground">
          The command is copied to your clipboard before the assistant opens.
        </p>
      )}
    </div>
  );
}
