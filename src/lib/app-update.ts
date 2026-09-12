/**
 * Self-healing app updates.
 *
 * The PWA precaches an app shell; Vercel deletes old hashed /assets on every
 * deploy, and storage pressure can evict CacheStorage entries. If a device
 * then runs a shell older than the deployed assets, a lazy route chunk 404s
 * and the app can crash before any UI renders ("This page didn't load").
 *
 * Two mechanisms prevent that state from ever sticking:
 *
 * 1. installChunkErrorRecovery() — any chunk/preload failure triggers ONE
 *    hard recovery per session: drop the service worker + every cache and
 *    reload. The next load fetches the current deploy from the network.
 * 2. setupServiceWorkerUpdates() — a waiting service worker is told to
 *    SKIP_WAITING immediately; when it takes control we reload once so the
 *    page is never left running a superseded asset set.
 *
 * Session flags make both paths single-shot, so a genuinely offline device
 * just sees the normal error page instead of a reload loop.
 */

const RECOVERED_KEY = "slashai-chunk-recovered";
const SW_UPDATED_KEY = "slashai-sw-updated";

/** Broader set of failure signals that suggest a stale bundle / resource load. */
export function isChunkLoadError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    /dynamically imported module/i.test(message) ||
    /failed to fetch dynamically/i.test(message) ||
    /error loading dynamically/i.test(message) ||
    /importing a module script failed/i.test(message) ||
    /vite:preloadError/i.test(message) ||
    /loading chunk/i.test(message) ||
    /preload.*failed/i.test(message) ||
    /failed to load resource/i.test(m) ||
    /net::err/i.test(m) ||
    /failed to fetch/i.test(m) ||
    /networkerror when attempting to fetch/i.test(m) ||
    /unable to fetch resource/i.test(m) ||
    /not found/i.test(m) && /chunk|assets|js\/|\.js/i.test(m)
  );
}

export function recoveredThisSession(): boolean {
  try {
    return sessionStorage.getItem(RECOVERED_KEY) !== null;
  } catch {
    return false;
  }
}

/** Hard-recover: unregister the SW, drop every cache, reload once. */
export async function hardReloadFresh(): Promise<void> {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map((r) => r.unregister()));
    }
  } catch {
    /* best effort - the reload below is what matters */
  }
  try {
    sessionStorage.setItem(RECOVERED_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  window.location.reload();
}

/** Listen on every error channel for stale-bundle failures; recover once. */
export function installChunkErrorRecovery(): void {
  if (typeof window === "undefined") return;

  const recover = (message: string) => {
    if (!isChunkLoadError(message)) return;
    if (recoveredThisSession()) return;
    void hardReloadFresh();
  };

  window.addEventListener(
    "vite:preloadError",
    (e) => {
      e.preventDefault();
      recover("vite:preloadError");
    },
    { passive: false },
  );
  window.addEventListener("unhandledrejection", (e) => {
    const msg = e.reason instanceof Error ? e.reason.message : String(e.reason ?? "");
    recover(msg);
  });
  // capture: true - resource-load failures (script/link) don't bubble
  window.addEventListener(
    "error",
    (e) => {
      const msg = e instanceof ErrorEvent ? e.message : "resource load failed";
      recover(msg);
    },
    { capture: true },
  );
}

/**
 * Activate waiting service workers promptly and refresh once they take
 * control, so users never keep running a superseded asset set after a deploy.
 */
export function setupServiceWorkerUpdates(): void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Only reload when this takeover is an UPDATE (we asked the waiting
    // worker to skip waiting), never on a first install claim.
    let shouldReload = false;
    try {
      shouldReload = sessionStorage.getItem(SW_UPDATED_KEY) === "1";
      if (shouldReload) sessionStorage.setItem(SW_UPDATED_KEY, "0");
    } catch {
      shouldReload = false;
    }
    if (shouldReload) window.location.reload();
  });

  navigator.serviceWorker.ready
    .then((reg) => {
      const nudge = (worker: ServiceWorker | null) => {
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            try {
              sessionStorage.setItem(SW_UPDATED_KEY, "1");
            } catch {
              /* ignore */
            }
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          try {
            sessionStorage.setItem(SW_UPDATED_KEY, "1");
          } catch {
            /* ignore */
          }
          worker.postMessage({ type: "SKIP_WAITING" });
        }
      };
      nudge(reg.waiting ?? reg.installing);
      reg.addEventListener("updatefound", () => nudge(reg.installing));
    })
    .catch(() => {
      /* offline support is optional */
    });
}

/**
 * Bfcache / resume recovery: when a mobile browser restores a frozen page
 * (e.g. after the WebView was backgrounded and dropped), the app can arrive
 * in a broken state. Listen for pageshow and, on the first bfcache restore,
 * attempt a single hard reload if anything looks stale.
 */
export function installBfcacheRecovery(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    if (recoveredThisSession()) return;
    // A persisted page coming back often means the cached bundle is stale.
    void hardReloadFresh();
  }, { once: true });
}
