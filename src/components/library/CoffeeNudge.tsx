import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Coffee, Copy, Check, X, ArrowRight, Heart } from "lucide-react";
import { toast } from "sonner";

import {
  initVisitTracking,
  shouldShowCoffeeNudge,
  dismissCoffeeNudge,
  COFFEE_EVENT,
} from "@/lib/coffee-nudge";

const UPI_ID = "wahmed178-1@okhdfcbank";

export function CoffeeNudge() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    initVisitTracking();
    const check = () => {
      setVisible(shouldShowCoffeeNudge(pathname));
    };

    check();

    window.addEventListener(COFFEE_EVENT, check);
    return () => window.removeEventListener(COFFEE_EVENT, check);
  }, [pathname]);

  const handleDismiss = () => {
    dismissCoffeeNudge();
    setVisible(false);
  };

  const handleCopyUpi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied: " + UPI_ID);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Please copy manually: " + UPI_ID);
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Support SlashAI"
      className="page-enter fixed bottom-20 left-3 right-3 z-40 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 rounded-2xl border border-amber-500/40 bg-surface/95 p-4 shadow-2xl backdrop-blur-md transition-all"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-[#FFDD00] text-black shadow-sm shrink-0">
            <Coffee className="size-4.5" aria-hidden />
          </span>
          <div>
            <h4 className="text-[13.5px] font-bold text-foreground flex items-center gap-1.5">
              Enjoying SlashAI?
              <Heart className="size-3 text-rose-500 fill-rose-500" aria-hidden />
            </h4>
            <p className="text-[11px] text-muted-foreground">Keep it 100% free, private & ad-free</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss support prompt"
          className="rounded-lg p-1 text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
        You&apos;ve used SlashAI commands and tools quite a bit! If it has saved you time, consider buying Waseem a coffee or supporting via UPI.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          to="/coffee"
          onClick={handleDismiss}
          className="ripple-press flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-xl bg-[#FFDD00] px-3 text-[12px] font-black text-black shadow-sm transition-transform active:scale-95 hover:brightness-105"
        >
          <Coffee className="size-3.5" aria-hidden />
          <span>Buy a Coffee</span>
          <ArrowRight className="size-3 opacity-60" aria-hidden />
        </Link>

        <button
          type="button"
          onClick={handleCopyUpi}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-2.5 text-[11.5px] font-semibold text-foreground transition-colors hover:border-primary/40 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-primary" aria-hidden /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden /> UPI
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-[11px] text-muted-foreground hover:text-foreground px-1"
        >
          Later
        </button>
      </div>
    </aside>
  );
}
