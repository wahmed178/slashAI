/**
 * `/hub` — retired. SlashBar is the single hub now.
 *
 * Redirects to the SlashBar launcher, which lists both the 27 interactive apps
 * and the 14 content categories.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hub/")({
  beforeLoad: () => {
    throw redirect({ to: "/slash" });
  },
});
