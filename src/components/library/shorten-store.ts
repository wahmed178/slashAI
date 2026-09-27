/**
 * The shorten-link context and its hook, with no JSX in this file.
 *
 * The separation is deliberate. The dialog needs `useShortenLink`, and the
 * provider needs to render the dialog — so when both lived in one module the
 * two imported each other in a cycle, which resolved under Bun's SSR but left
 * the dialog `undefined` in the browser build and threw the moment somebody
 * opened the popup. Keeping the context in a plain module makes the imports
 * point one way: dialog -> store, provider -> dialog + store.
 */
import { createContext, useContext } from "react";

export interface ShortenApi {
  /** open the popup; pass a url to shorten something other than this page */
  open: (url?: string) => void;
  /** the link currently being shortened, or null when the popup is closed */
  url: string | null;
  /** let the dialog edit the link as the user types */
  setUrl: (url: string) => void;
  close: () => void;
}

export const ShortenContext = createContext<ShortenApi>({
  open: () => {},
  url: null,
  setUrl: () => {},
  close: () => {},
});

/**
 * `const shorten = useShortenLink();` then `shorten.open()` for this page, or
 * `shorten.open(someLongUrl)` for a specific link.
 */
export function useShortenLink(): ShortenApi {
  return useContext(ShortenContext);
}
