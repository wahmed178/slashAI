/**
 * A single fixed layer behind the whole app: two soft light pools that chase
 * the pointer and a faint grid that drifts the other way.
 *
 * The point is that every page on SlashAI - browse grids, tool pages, game
 * pages - reacts to the mouse without a single component opting in. The
 * tracking runs on one rAF loop that eases toward the last known pointer
 * position and then stops, so an idle page costs nothing.
 *
 * It sits at z-index 0 and every route renders above it; it never intercepts
 * pointer events.
 */
import { useEffect } from "react";

import { bindSpotlight, motionDisabled } from "@/hooks/use-motion";

/** How hard the pools chase the pointer. Lower = lazier, heavier light. */
const EASE = 0.08;

export function AmbientBackdrop() {
  useEffect(() => {
    const unbindSpotlight = bindSpotlight();
    const root = document.documentElement;

    // Reduced motion: the CSS parks the pools in fixed positions, so there is
    // nothing to track. Skip the loop entirely.
    if (motionDisabled()) {
      root.style.setProperty("--pointer-x", "50vw");
      root.style.setProperty("--pointer-y", "34vh");
      return unbindSpotlight;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.34;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;

      root.style.setProperty("--pointer-x", `${currentX.toFixed(1)}px`);
      root.style.setProperty("--pointer-y", `${currentY.toFixed(1)}px`);
      // Normalised -1..1, used to parallax the grid against the pointer.
      root.style.setProperty(
        "--pointer-nx",
        (currentX / Math.max(1, window.innerWidth) - 0.5).toFixed(3),
      );
      root.style.setProperty(
        "--pointer-ny",
        (currentY / Math.max(1, window.innerHeight) - 0.5).toFixed(3),
      );

      const settled = Math.abs(targetX - currentX) < 0.5 && Math.abs(targetY - currentY) < 0.5;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      unbindSpotlight();
    };
  }, []);

  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-pool ambient-pool-a" />
      <div className="ambient-pool ambient-pool-b" />
      <div className="ambient-grid" />
    </div>
  );
}

export default AmbientBackdrop;
