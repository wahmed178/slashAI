// Vite configuration for SlashAI (TanStack Start + Nitro SSR + PWA).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// `vite dev` must run as a pure SPA: no SSR, no server module graph.
//
// Why: the dev server kept two full module graphs alive at once (client + SSR)
// across ~550 modules, which ran the 2 GB sandbox container into its cgroup
// ceiling. SSR also fought the client entry - src/client.tsx mounts with
// createRoot on document.body because Freebuff serves a static shell with an
// empty #root, so server-rendering produced a second, competing React tree in
// the same document (the `<html> cannot be a child of <body>` error).
//
// Production is untouched: `vite build` still SSRs through Nitro.
//
// `installDevServerMiddleware` is only read inside TanStack Start's
// `configureServer` hook, so setting it unconditionally only affects `vite dev`.
// `appType` is what must be dev-gated, and the config wrapper only accepts an
// options object here (its function form returns a plain Vite config and would
// drop the TanStack options), so the dev check runs at config-load time.
const isDev = process.argv.includes("dev");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Own the client entry too. The default one calls hydrateRoot(document, ...)
    // because it expects server-rendered markup; Freebuff serves a static SPA
    // shell with an empty #root, so the app must mount with createRoot instead.
    client: { entry: "client" },
    // In dev there is no server entry to run: stop TanStack Start from
    // installing the SSR request middleware that imports the server graph.
    vite: { installDevServerMiddleware: false },
  },
  vite: {
    // Dev only: serve the static shell from index.html instead of SSR.
    // (Vite 8 types the root `ssr` option as `SSROptions`, an object, so a
    // literal `ssr: false` is rejected by tsc; `appType: "spa"` is Vite's
    // supported switch for "no SSR, serve the SPA shell".)
    ...(isDev ? { appType: "spa" as const } : {}),
    // Dev-only: skip Vite's startup crawl. With 350+ routes the crawl pulls the
    // whole module graph into the dev server before the first request, which is
    // most of its idle footprint. Modules are still transformed on demand.
    server: {
      preTransformRequests: false,
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      VitePWA({
        // The app shell + the whole static command catalog are cached for offline use.
        strategies: "generateSW",
        // Nitro v3 redirects the client build away from the default dist/:
        // on Vercel it emits into .vercel/output/static, locally into
        // .output/public. The PWA plugin defaults to globbing dist/, which is
        // empty on a clean Vercel build and crashed workbox with "Couldn't
        // find configuration for either precaching or runtime caching".
        // Point it at the real client output for each environment.
        outDir: process.env["VERCEL"] ? ".vercel/output/static" : ".output/public",
        // "prompt" (not "autoUpdate"): the plugin force-injects workbox
        // skipWaiting + clientsClaim under "autoUpdate", which lets a new SW
        // hijack live pages mid-load and delete the asset cache underneath
        // them - the cause of unstyled stale-shell pages after deploys.
        // We register the SW ourselves (register-sw.ts), so this flag only
        // controls that injection. Updates apply on the next reload.
        registerType: "prompt",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
          // the command catalog chunk is large; keep it precached for offline use
          maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
          cleanupOutdatedCaches: true,
          // never seize control of a live page; explicit for clarity
          skipWaiting: false,
          clientsClaim: false,
          // Deliberately NO skipWaiting/clientsClaim and NO runtimeCaching:
          // - The precache is the single source of truth. Workbox installs the
          //   complete new asset set BEFORE activating, so a page can never
          //   mix an old index.html with new (404ing) hashed CSS/JS. The old
          //   combo (skipWaiting + cleanupOutdatedCaches + a NetworkFirst
          //   page cache) served stale shells whose hashed CSS no longer
          //   existed, rendering the site unstyled until data was cleared.
          // - Without skipWaiting the new SW activates on the next reload,
          //   so users get updates one refresh later instead of a broken
          //   mid-session page. cleanupOutdatedCaches removes superseded
          //   precache versions on activation.
        },
      }),
    ],
  },
});