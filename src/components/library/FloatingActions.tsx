import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";

import { useLastCopied } from "@/hooks/use-ux";
import { getLastCopied, clearLastCopied } from "@/lib/ux";

/** How long the re-copy pill lingers after a copy with no further activity. */
const COPY_PILL_MS = 15_000;
/** Scroll distance before the back-to-top button appears. */
const TOP_THRESHOLD = 400;

/**
 * Two small floating controls that sit just above the bottom dock:
 * a "copy the last command again" pill and a back-to-top button.
 */
export function FloatingActions() {
  const last = useLastCopied();
  const [showTop, setShowTop] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [recopied, setRecopied] = useState(false);
  const hideTimer = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > TOP_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // every new copy re-arms the pill (unless disabled in settings); it fades out after a quiet spell
  useEffect(() => {
    if (!last) {
      setShowCopy(false);
      return;
    }
    if (typeof window !== "undefined" && window.localStorage.getItem("slashai.hideCopyPill") === "true") {
      setShowCopy(false);
      return;
    }
    setShowCopy(true);
    setRecopied(false);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowCopy(false), COPY_PILL_MS);
    return () => window.clearTimeout(hideTimer.current);
  }, [last]);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCopy(false);
    clearLastCopied();
    toast.info("Dismissed. You can disable this permanently in Settings (/me)");
  };

  const recopy = () => {
    const text = last ?? getLastCopied();
    if (!text) return;
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setRecopied(true);
        window.setTimeout(() => setRecopied(false), 1800);
        toast.success("Copied again");
      })
      .catch(() => toast.error("Clipboard blocked by the browser"));
  };

  const preview = (last ?? "").replace(/\s+/g, " ").trim();

  return (
    <div
      className="pointer-events-none fixed right-4 z-20 flex flex-col items-end gap-2"
      style={{ bottom: "calc(74px + env(safe-area-inset-bottom))" }}
    >
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full border border-border bg-surface/95 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
      )}

      {showCopy && preview && (
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-primary/40 bg-surface/95 py-1 pr-1.5 pl-2 shadow-lg backdrop-blur transition-colors hover:border-primary">
          <button
            type="button"
            onClick={recopy}
            aria-label="Copy the last command again"
            title={preview}
            className="flex max-w-[min(65vw,280px)] items-center gap-2 text-left"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              {recopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] font-bold tracking-wider text-primary uppercase">
                {recopied ? "Copied" : "Copy again"}
              </span>
              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                {preview.slice(0, 40)}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            title="Dismiss"
            className="ml-1 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
