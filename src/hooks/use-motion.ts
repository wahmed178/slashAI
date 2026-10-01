/**
 * Interaction hooks.
 *
 * These are the only place in the app that talks to the pointer or the
 * scroll position, and every one of them degrades to "do nothing" when the
 * user has asked for reduced motion - either through the OS
 * (`prefers-reduced-motion`) or through the in-app setting, which mirrors to
 * `<html data-motion="reduced">`.
 *
 * Two deliberate constraints, because this renders on the server:
 *   - nothing reads `window` / `localStorage` at module scope or in a
 *     `useState` initialiser;
 *   - the hidden start-state for scroll reveals is gated behind a `.js-reveal`
 *     class that is only ever added after mount, so a failed bundle can never
 *     leave the server HTML stuck at `opacity: 0`.
 */
import { useCallback, useEffect, useRef, useState } from "react";

/* ──────────── environment ──────────── */

/** OS-level reduced-motion preference. Safe to call during SSR (returns true). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The in-app switch from Settings, which writes `data-motion` on <html>. */
function inAppReducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset["motion"] === "reduced";
}

/** True when either the OS or the in-app setting asks for stillness. */
export function motionDisabled(): boolean {
  return inAppReducedMotion() || prefersReducedMotion();
}

let revealRootEnabled = false;

/**
 * Marks the document as JS-capable, which is what actually arms the
 * `opacity: 0` start-state in CSS. Idempotent.
 */
function enableRevealRoot() {
  if (revealRootEnabled || typeof document === "undefined") return;
  revealRootEnabled = true;
  document.documentElement.classList.add("js-reveal");
}

/* ──────────── scroll reveal ──────────── */

export interface RevealOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Negative bottom margin delays the trigger until the element is committed. */
  rootMargin?: string;
  /** Stop observing after the first reveal. */
  once?: boolean;
}

/**
 * Fades + lifts an element the first time it scrolls into view.
 * Returns the ref to attach and whether it has already revealed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): { ref: React.RefObject<T | null>; revealed: boolean } {
  const { threshold = 0.12, rootMargin = "0px 0px -6% 0px", once = true } = options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Motion off, or no observer support: show it immediately.
    if (motionDisabled() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      setRevealed(true);
      return;
    }

    enableRevealRoot();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          setRevealed(true);
          if (once) io.unobserve(entry.target);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, revealed };
}

/* ──────────── count-up ──────────── */

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Rolls a number up from zero to `target` once `active` flips true. Runs on
 * rAF and cancels itself, so it costs nothing while idle.
 */
export function useCountUp(target: number, active: boolean, durationMs = 1400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (motionDisabled()) {
      setValue(target);
      return;
    }
    if (target === 0) {
      setValue(0);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(from + (target - from) * easeOutExpo(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, durationMs]);

  return value;
}

/* ──────────── rotating headline word ──────────── */

/** Cycles through `words`, pausing on the last entry instead of looping. */
export function useRotatingWord(words: readonly string[], intervalMs = 2400): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2 || motionDisabled()) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1 < words.length ? i + 1 : i));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [words.length, intervalMs]);

  return index;
}

/* ──────────── pointer tilt ──────────── */

export interface TiltOptions {
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  /** Rounding in degrees; fewer, larger steps feel more mechanical. */
  step?: number;
}

/**
 * Rotates an element in 3D toward the pointer. Writes CSS variables rather
 * than `style.transform` so the transform stays owned by the stylesheet.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = {},
): React.RefObject<T | null> {
  const { max = 8, step = 1 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motionDisabled() || !window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const round = (n: number) => Math.round(n / step) * step;
      el.style.setProperty("--tilt-x", `${round(-py * max * 2)}deg`);
      el.style.setProperty("--tilt-y", `${round(px * max * 2)}deg`);
    };
    const onEnter = () => el.classList.add("is-tilting");
    const onLeave = () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, step]);

  return ref;
}

/* ──────────── magnet ──────────── */

/** Drags a button toward the pointer, up to `strength` px on each axis. */
export function useMagnet<T extends HTMLElement = HTMLButtonElement>(
  strength = 6,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motionDisabled() || !window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      el.style.setProperty(
        "--magnet-x",
        `${((e.clientX - r.left) / r.width - 0.5) * strength * 2}px`,
      );
      el.style.setProperty(
        "--magnet-y",
        `${((e.clientY - r.top) / r.height - 0.5) * strength * 2}px`,
      );
    };
    const onEnter = () => el.classList.add("is-pulling");
    const onLeave = () => {
      el.classList.remove("is-pulling");
      el.style.setProperty("--magnet-x", "0px");
      el.style.setProperty("--magnet-y", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}

/* Deleted: bindSpotlight(). It ran a delegated `pointermove` that called
   closest() + getBoundingClientRect() on every card under the cursor and wrote
   two custom properties per move, which forced style and layout work on the
   main thread for as long as the mouse was moving. The `.spotlight` hover
   highlight in CSS is static and still works without it. */

/* ──────────── key-hold hook ──────────── */

/** True while `key` is held down. Used for keyboard shortcut affordances. */
export function useKeyHeld(key: string): boolean {
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) setHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) setHeld(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [key]);
  return held;
}

/* ──────────── staggered reveal helper ──────────── */

/** CSS custom property value that offsets a reveal by `i * step` ms. */
export function revealDelay(i: number, step = 60): React.CSSProperties {
  return { "--reveal-delay": `${i * step}ms` } as React.CSSProperties;
}

/** Stable callback ref factory, for lists where a single ref will not do. */
export function useCallbackRef<T>() {
  return useCallback((node: T | null) => node, []);
}
