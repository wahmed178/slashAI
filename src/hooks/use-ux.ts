import { useEffect, useState } from "react";
import { LAST_COPY_EVENT, UX_CHANGE_EVENT, getLastCopied } from "@/lib/ux";

/** True only after hydration, so localStorage reads never break SSR. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Re-renders the calling component whenever any personalisation helper writes
 * to localStorage (copy counts, saved items, progress, best scores...).
 */
export function useUxTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(UX_CHANGE_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(UX_CHANGE_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return tick;
}

/** The most recently copied command text, live-updating. */
export function useLastCopied(): string | null {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setValue(getLastCopied());
    sync();
    window.addEventListener(LAST_COPY_EVENT, sync);
    return () => window.removeEventListener(LAST_COPY_EVENT, sync);
  }, []);
  return value;
}
