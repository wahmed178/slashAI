/// <reference types="vite/client" />
import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

/**
 * Client entry for the static (SPA) build Freebuff hosts.
 *
 * TanStack Start's default entry calls `hydrateRoot(document, ...)` because
 * it expects server-rendered markup. Freebuff serves `dist/` as a plain
 * static site with an empty `<div id="root">`, so there is nothing to
 * hydrate and the app never mounts. A previous fix rewrote the built,
 * minified bundle with a regex to call `createRoot` instead - but the
 * bundler had already tree-shaken `createRoot` out of the build (nothing
 * referenced it), so the rewritten call site hit `undefined` and threw
 * "createRoot is not a function", leaving a blank page.
 *
 * Owning the entry fixes that at the source: `createRoot` is a real import
 * here, so it is part of the bundle, and there is no minified output to
 * pattern-match against.
 */
function mount() {
  const container = document.getElementById("root") ?? document.body;
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  startTransition(() => {
    createRoot(container).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>,
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
