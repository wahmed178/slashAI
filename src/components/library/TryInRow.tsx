import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { QUICK_TARGETS, targetUrl, type AiTarget } from "@/lib/ai-targets";
import { setLastCopied, recordCopyHistory } from "@/lib/ux";
import { cn } from "@/lib/utils";

interface Props {
  /** the exact text to copy before opening the assistant */
  prompt: string;
  className?: string;
  compact?: boolean;
}

const BRAND_THEMES: Record<string, string> = {
  chatgpt:
    "border-emerald-500/30 text-emerald-400 hover:border-emerald-500/70 hover:bg-emerald-500/10 active:border-emerald-500",
  gemini:
    "border-sky-500/30 text-sky-400 hover:border-sky-500/70 hover:bg-sky-500/10 active:border-sky-500",
  claude:
    "border-amber-500/30 text-amber-400 hover:border-amber-500/70 hover:bg-amber-500/10 active:border-amber-500",
};

/**
 * Three quick-launch buttons — "Try in ChatGPT / Gemini / Claude".
 * Each one copies the command first and then opens the assistant in a new tab.
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
      recordCopyHistory({
        id: target.id,
        name: `Try in ${target.name}`,
        category: "AI Launch",
        text: prompt,
      });
      setArmed(target.id);
      toast.success(`Copied! Opening ${target.name}...`);
      window.setTimeout(() => setArmed(null), 4000);
      window.open(targetUrl(target, prompt), "_blank", "noopener,noreferrer");
    })();
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 w-full">
        {QUICK_TARGETS.map((t) => {
          const brandStyle = BRAND_THEMES[t.id] ?? "border-border text-muted-foreground hover:text-foreground";
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => launch(t)}
              aria-label={`Copy this command and try it in ${t.name}`}
              className={cn(
                "inline-flex min-h-9.5 items-center justify-center gap-1.5 rounded-xl border bg-surface px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                brandStyle,
                armed === t.id && "ring-2 ring-primary border-transparent"
              )}
            >
              <span aria-hidden className="text-sm">{t.emoji ?? "✨"}</span>
              <span className="truncate">
                {armed === t.id ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Check className="size-3.5" aria-hidden /> Copied
                  </span>
                ) : (
                  <>{t.name}</>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {!compact && (
        <p className="text-[11px] text-muted-foreground">
          Command is automatically copied to your clipboard before the assistant opens.
        </p>
      )}
    </div>
  );
}
