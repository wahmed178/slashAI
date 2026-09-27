/**
 * Provides the "shorten link" popup to the whole app.
 *
 * Mounted once, high in the tree (AppShell), so any component can open the
 * popup. The context itself lives in `shorten-store` and the dialog is a
 * separate module, which keeps the imports one-way — see the note there.
 */
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ShortenContext, type ShortenApi } from "./shorten-store";
import { ShortenLinkDialog } from "./ShortenLinkDialog";

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
