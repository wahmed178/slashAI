/**
 * Store host routing, kept free of any SDK imports.
 *
 * `StoreHostGate` sits in the root route, so anything it imports statically is
 * in the initial bundle of every page. It used to pull `@/lib/stores` - and
 * through it the whole Supabase client - just to ask "is this a store
 * subdomain?". These helpers answer that question on their own.
 *
 * `stores.ts` re-exports everything here, so existing importers are unaffected.
 */

function envString(key: string): string {
  const meta = (import.meta as { env?: Record<string, string | undefined> }).env;
  // Browser builds read Vite's import.meta.env; scripts (bun) fall back to the
  // process environment. Never read the .env files directly.
  const fromProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.[key];
  const raw = meta?.[key] ?? fromProcess;
  return typeof raw === "string" ? raw.trim() : "";
}

/** Root the store subdomains hang off: `<slug>.slashai.in`. */
export const STORES_ROOT_DOMAIN =
  envString("VITE_STORES_ROOT_DOMAIN").toLowerCase() || "slashai.in";

/**
 * Slugs that must never belong to a store: they would shadow a real SlashAI
 * route (`/stores/dashboard`) or a host that matters (www, api, mail...).
 */
export const RESERVED_SLUGS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "administrator",
  "dashboard",
  "stores",
  "store",
  "mail",
  "email",
  "blog",
  "docs",
  "help",
  "support",
  "static",
  "assets",
  "cdn",
  "dev",
  "staging",
  "test",
  "status",
  "new",
  "manage",
  "live",
  "hub",
  "tools",
  "play",
  "learn",
  "slash",
  "me",
  "about",
  "signin",
  "login",
  "auth",
  "billing",
  "pay",
  "checkout",
  "shop",
  "shops",
  "my",
  "shopify",
  "slashai",
]);

/** Same rule as `stores.slug check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$')`. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug) && !/--/.test(slug);
}

/**
 * The store slug when the current host is a store subdomain, else null.
 * `acme.slashai.in` → "acme"; `slashai.in` / `www.slashai.in` → null.
 * `acme.localhost` works too, so local development can fake subdomains.
 */
export function storeHostSlug(hostname?: string | null): string | null {
  const raw = hostname ?? (typeof window === "undefined" ? "" : window.location.hostname);
  const host = raw.toLowerCase().replace(/\.$/, "").split(":")[0] ?? "";
  if (!host) return null;

  const roots = [STORES_ROOT_DOMAIN, "localhost"];
  for (const root of roots) {
    const suffix = `.${root}`;
    if (!host.endsWith(suffix)) continue;
    const sub = host.slice(0, -suffix.length);
    if (!sub || sub.includes(".")) continue; // one level only: acme.slashai.in
    if (RESERVED_SLUGS.has(sub) || !isValidSlug(sub)) return null;
    return sub;
  }
  return null;
}
