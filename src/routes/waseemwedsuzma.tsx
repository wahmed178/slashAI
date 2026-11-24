import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Short public link for the wedding invitation: /waseemwedsuzma.
 *
 * The invite itself is a standalone self-contained page served as a static
 * asset from public/waseemwedsuzma.html — it is not an app route and must not
 * be wrapped in AppShell. This route only maps the clean URL onto the file.
 * (`href`, not `to`: `to` is typed against the route tree, and the static file
 * is not a route.)
 */
export const Route = createFileRoute("/waseemwedsuzma")({
  beforeLoad: () => {
    throw redirect({ href: "/waseemwedsuzma.html", replace: true });
  },
});
