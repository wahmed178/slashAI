import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /promo was merged into /about (which now carries the full About page with
 * FAQ). Kept as a redirect so old links and bookmarks keep working.
 */
export const Route = createFileRoute("/promo")({
  beforeLoad: () => {
    throw redirect({ to: "/about", replace: true });
  },
});
