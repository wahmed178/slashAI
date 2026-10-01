import { lazy, Suspense, useEffect, useState } from "react";

/**
 * SlashBar launcher — a full-screen overlay opened from the bottom dock, and
 * the site's single hub.
 *
 * The UI lives in ./SlashBarLauncher and is loaded on demand. It needs the
 * full 5,704-command catalog to show real per-category counts, and the app
 * shell is downloaded on every page, so importing it from here put ~6 MB of
 * catalog in the initial bundle and left the site blank for about nine
 * seconds while the main thread parsed it. The shell now stays small and the
 * catalog arrives only if the overlay is actually opened.
 */
const SlashBarLauncher = lazy(() => import("./SlashBarLauncher"));

export function SlashBarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  // lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Suspense
      fallback={
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="SlashBar launcher"
        >
          <p className="text-sm text-muted-foreground">Loading SlashBar…</p>
        </div>
      }
    >
      <SlashBarLauncher onClose={onClose} />
    </Suspense>
  );
}
