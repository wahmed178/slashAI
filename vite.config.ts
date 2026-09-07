// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      VitePWA({
        // The app shell + the whole static command catalog are cached for offline use.
        strategies: "generateSW",
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
