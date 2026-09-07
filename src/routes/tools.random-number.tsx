import { createFileRoute, redirect } from "@tanstack/react-router";

/** Random Number Generator moved to SlashPlay - keep old tool links working */
export const Route = createFileRoute("/tools/random-number")({
  beforeLoad: () => {
    throw redirect({ to: "/play/random-number", replace: true });
  },
});
