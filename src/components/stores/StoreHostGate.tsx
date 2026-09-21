/**
 * Serves a storefront when the app is opened on a store subdomain.
 *
 * `acme.slashai.in` (and `acme.localhost` for local work) should show the
 * Acme store — not the SlashAI homepage. The gate wraps the router outlet in
 * `__root.tsx` and, when the host is a store subdomain, renders that store
 * standalone instead: its own slim header, its own footer credit, no SlashAI
 * bottom dock. Every other host is untouched, so `slashai.in` behaves exactly
 * as before.
 *
 * The host is read in a lazy `useState` initialiser so the correct screen is
 * already in the first client render. Server-rendered HTML for a subdomain is
 * the normal app shell, so if the subdomain domain is not wired up in Vercel
 * yet, the worst case is a brief flash of the app before the store appears.
 */
import { useState, type ReactNode } from "react";

import { Storefront } from "./Storefront";
import { storeHostSlug } from "@/lib/stores";

export function StoreHostGate({ children }: { children: ReactNode }) {
  // Resolved once per page load; the host never changes mid-session.
  const [slug] = useState<string | null>(() => storeHostSlug());

  if (!slug) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <Storefront slug={slug} standalone />
    </div>
  );
}
