import { useEffect } from "react";

import SlashBarLauncher from "./SlashBarLauncher";

/**
 * SlashBar launcher — a full-screen overlay opened from the bottom dock, and
 * the site's single hub.
 *
 * The UI used to sit behind `lazy(() => import("./SlashBarLauncher"))` because
 * the launcher counted every category's rows by walking the 5.4 MB command
 * catalogue. That meant a tap on ⚡ Slash showed a "Loading SlashBar…" panel
 * while the phone fetched and parsed several megabytes. The counts are now
 * generated literals (`src/lib/slashbar-counts.ts`), so the launcher is small
 * enough to ship with the shell and the overlay opens instantly — there is no
 * suspense boundary and therefore no loading screen to see.
 */
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

  return <SlashBarLauncher onClose={onClose} />;
}
