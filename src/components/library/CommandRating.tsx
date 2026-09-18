import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  className?: string;
}

/** Deterministic starting counts so each command has consistent baseline community counts. */
function getBaseRating(slug: string): { up: number; down: number } {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const up = 18 + (hash % 38);
  const down = 1 + ((hash >> 3) % 4);
  return { up, down };
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function CommandRating({ slug, className }: Props) {
  const storageKey = `slash_rating_${slug}`;
  const base = getBaseRating(slug);

  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [ratedAt, setRatedAt] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setRating(null);
        setRatedAt(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.vote === "up" || parsed.vote === "down")) {
          setRating(parsed.vote);
          setRatedAt(typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now());
          return;
        }
      } catch {
        // Handle plain string "up" | "down"
        if (raw === "up" || raw === "down") {
          setRating(raw);
          setRatedAt(Date.now());
          return;
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const isLocked = Boolean(ratedAt && Date.now() - ratedAt < TWENTY_FOUR_HOURS_MS);

  const upCount = base.up + (rating === "up" ? 1 : 0);
  const downCount = base.down + (rating === "down" ? 1 : 0);

  const handleRate = (choice: "up" | "down") => {
    if (isLocked) {
      toast.info("You already rated this command recently. Thanks for your feedback!");
      return;
    }

    const payload = { vote: choice, timestamp: Date.now() };
    setRating(choice);
    setRatedAt(payload.timestamp);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // quota or private mode
    }

    toast.success(choice === "up" ? "Thanks! Marked as helpful 👍" : "Feedback noted 👎");
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-foreground">Was this command helpful?</span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {isLocked ? "Feedback saved (locked 24h)" : "Client-side vote"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Thumbs up (current count: ${upCount})`}
          onClick={() => handleRate("up")}
          disabled={isLocked && rating !== "up"}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
            rating === "up"
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400 shadow-sm"
              : isLocked
              ? "border-border bg-muted/40 text-muted-foreground/60 cursor-not-allowed"
              : "border-border bg-surface-elevated text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-300"
          )}
        >
          <span>👍</span>
          <span>{upCount}</span>
        </button>

        <button
          type="button"
          aria-label={`Thumbs down (current count: ${downCount})`}
          onClick={() => handleRate("down")}
          disabled={isLocked && rating !== "down"}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
            rating === "down"
              ? "border-rose-500/60 bg-rose-500/15 text-rose-400 shadow-sm"
              : isLocked
              ? "border-border bg-muted/40 text-muted-foreground/60 cursor-not-allowed"
              : "border-border bg-surface-elevated text-muted-foreground hover:border-rose-500/40 hover:text-rose-300"
          )}
        >
          <span>👎</span>
          <span>{downCount}</span>
        </button>
      </div>
    </div>
  );
}
