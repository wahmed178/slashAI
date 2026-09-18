import { useState, useEffect, useMemo } from "react";
import { Check, Copy, RotateCcw, Sparkles, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { recordCopyHistory } from "@/lib/ux";
import { cn } from "@/lib/utils";
import type { SlashCommand } from "@/lib/commands";

interface Props {
  command: SlashCommand;
  onCustomizedCopy?: (text: string) => void;
  className?: string;
}

/** Extracts all bracketed placeholders like `[your topic]` or `[amount]`. */
export function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\[[^\]\n]{1,60}\]/g);
  if (!matches) return [];
  // Return unique placeholder keys
  return Array.from(new Set(matches));
}

export function CommandVariableEditor({ command, onCustomizedCopy, className }: Props) {
  const slug = command.id;
  const storageKey = `slash_customized_${slug}`;

  // Use the example or the command text, prioritizing the one with placeholders
  const baseText = useMemo(() => {
    if (extractPlaceholders(command.example).length > 0) {
      return command.example;
    }
    if (extractPlaceholders(command.command).length > 0) {
      return command.command;
    }
    return command.example || command.command;
  }, [command]);

  const placeholders = useMemo(() => extractPlaceholders(baseText), [baseText]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState<string | null>(null);

  // Load saved customization from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        // Check if saved is a custom string or JSON
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            setValues(parsed);
            return;
          }
        } catch {
          // If stored as full customized string, keep it
        }
      }
    } catch {
      // ignore
    }
    setValues({});
    setCopied(false);
  }, [command, storageKey]);

  // Compute the customized text by replacing all placeholders with their user values
  const customizedText = useMemo(() => {
    let result = baseText;
    for (const ph of placeholders) {
      const val = values[ph]?.trim();
      if (val) {
        // Replace all occurrences of this placeholder
        result = result.split(ph).join(val);
      }
    }
    return result;
  }, [baseText, placeholders, values]);

  const hasEdits = Object.values(values).some((v) => v && v.trim().length > 0);

  const handleValueChange = (placeholder: string, nextVal: string) => {
    const updated = { ...values, [placeholder]: nextVal };
    setValues(updated);

    // Save customized version in localStorage under slash_customized_[slug]
    try {
      let customResult = baseText;
      for (const ph of placeholders) {
        const val = updated[ph]?.trim();
        if (val) {
          customResult = customResult.split(ph).join(val);
        }
      }
      window.localStorage.setItem(storageKey, customResult);
    } catch {
      // quota or private mode
    }
  };

  const handleReset = () => {
    setValues({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    toast.success("Reset variables to defaults");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customizedText);
      setCopied(true);
      recordCopyHistory({
        id: command.id,
        name: command.command,
        category: command.category,
        text: customizedText,
      });
      toast.success("Copied customized command!");
      onCustomizedCopy?.(customizedText);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard blocked by browser");
    }
  };

  if (placeholders.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-3 rounded-xl border border-amber-500/25 bg-surface p-4", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-amber-400/20 text-amber-300">
            <SlidersHorizontal className="size-3.5" />
          </span>
          <h4 className="text-xs font-semibold tracking-wide text-foreground uppercase">
            Customize Variables <span className="text-amber-400 font-normal">({placeholders.length})</span>
          </h4>
        </div>

        {hasEdits && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset
          </Button>
        )}
      </header>

      <p className="text-xs text-muted-foreground">
        Click on any <span className="rounded bg-amber-400/20 px-1 py-0.5 text-amber-300 font-mono">[variable]</span> below or fill in the values to customize this command before running.
      </p>

      {/* Quick interactive fields for each variable */}
      <div className="grid gap-2 sm:grid-cols-2">
        {placeholders.map((ph) => {
          const cleanLabel = ph.slice(1, -1);
          const currentVal = values[ph] ?? "";
          return (
            <div key={ph} className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-amber-300/90 font-mono truncate">
                {ph}
              </label>
              <input
                type="text"
                value={currentVal}
                placeholder={`Type ${cleanLabel}...`}
                onChange={(e) => handleValueChange(ph, e.target.value)}
                onFocus={() => setActivePlaceholder(ph)}
                onBlur={() => setActivePlaceholder(null)}
                className="w-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors"
              />
            </div>
          );
        })}
      </div>

      {/* Live customized preview with highlighted inline pills */}
      <div className="mt-3 rounded-lg border border-border bg-muted p-3">
        <div className="flex items-center justify-between pb-1.5 text-[11px] font-medium text-muted-foreground">
          <span>Live preview</span>
          {hasEdits && <span className="text-amber-400 font-semibold">● Customized</span>}
        </div>
        <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
          {renderHighlightedText(baseText, values, (ph) => setActivePlaceholder(ph))}
        </div>
      </div>

      {/* Copy customized command button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button
          onClick={handleCopy}
          className="gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied customized command!" : "Copy customized command"}
        </Button>
        <span className="text-[11px] text-muted-foreground">
          Saved temporarily on this device
        </span>
      </div>
    </section>
  );
}

/** Renders text with [placeholders] replaced by highlighted amber pills */
function renderHighlightedText(
  text: string,
  values: Record<string, string>,
  onFocusPh: (ph: string) => void
) {
  const parts: React.ReactNode[] = [];
  const regex = /\[[^\]\n]{1,60}\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;
    const placeholder = match[0];

    // Push preceding text
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const value = values[placeholder]?.trim();
    parts.push(
      <span
        key={`${placeholder}-${start}`}
        onClick={() => onFocusPh(placeholder)}
        title={`Click to edit ${placeholder}`}
        className={cn(
          "inline-block rounded px-1.5 py-0.5 font-mono font-medium transition-colors cursor-pointer",
          value
            ? "bg-amber-400/30 text-amber-200 border border-amber-400/50"
            : "bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30"
        )}
      >
        {value || placeholder}
      </span>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
