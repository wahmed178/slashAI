/**
 * Opens the "Shorten link" popup from anywhere.
 *
 * Kept in its own module so the provider is a single instance regardless of how
 * a consumer imports it, and so the hook can be used by any component.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ShortenLinkDialog } from "./ShortenLinkDialog";

interface ShortenApi {
  /** open the popup; pass a url to shorten something other than this page */
  open: (url?: string) => void;
  /** the link currently being shortened, or null when the popup is closed */
  url: string | null;
  /** let the dialog edit the link as the user types */
  setUrl: (url: string) => void;
  close: () => void;
}

const ShortenContext = createContext<ShortenApi>({
  open: () => {},
  url: null,
  setUrl: () => {},
  close: () => {},
});

export function ShortenProvider({
  children,
  initialUrl = null,
}: {
  children: ReactNode;
  /** open the popup straight away on a given link */
  initialUrl?: string | null;
}) {
  const [url, setUrl] = useState<string | null>(initialUrl);

  const open = useCallback((next?: string) => {
    // no argument means "shorten the page I am on"
    setUrl(next ?? (typeof window === "undefined" ? "" : window.location.href));
  }, []);
  const close = useCallback(() => setUrl(null), []);

  const api = useMemo<ShortenApi>(() => ({ open, url, setUrl, close }), [open, url, close]);

  return (
    <ShortenContext.Provider value={api}>
      {children}
      {url !== null && <ShortenLinkDialog />}
    </ShortenContext.Provider>
  );
}

/**
 * `const shorten = useShortenLink();` then `shorten.open()` for this page, or
 * `shorten.open(someLongUrl)` for a specific link.
 */
export function useShortenLink() {
  return useContext(ShortenContext);
}
