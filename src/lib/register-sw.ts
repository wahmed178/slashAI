/**
 * Single registrar for the offline app-shell service worker.
 *
 * Registration is refused in dev, inside iframes, in Lovable previews and when
 * `?sw=off` is present — and in those cases any stale `/sw.js` registration is
 * removed so the preview always serves fresh code.
 */
const BLOCKED_HOSTS = ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"] as const;

function isBlockedHost(hostname: string) {
  return BLOCKED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
}

function shouldRegister(): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!import.meta.env.PROD) return false;
  if (window.self !== window.top) return false;
  const { hostname, search } = window.location;
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return false;
  if (isBlockedHost(hostname)) return false;
  if (new URLSearchParams(search).has("sw") && new URLSearchParams(search).get("sw") === "off")
    return false;
  return true;
}

async function unregisterAppWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith("/sw.js"))
      .map((r) => r.unregister()),
  );
}

export function registerServiceWorker() {
  if (!shouldRegister()) {
    void unregisterAppWorker();
    return;
  }
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* offline support is optional — never break the app over it */
    });
  });
}
