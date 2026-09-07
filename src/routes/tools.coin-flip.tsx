import { createFileRoute, redirect } from "@tanstack/react-router";

/** Coin Flipper moved to SlashPlay - keep old tool links working */
export const Route = createFileRoute("/tools/coin-flip")({
  beforeLoad: () => {
    throw redirect({ to: "/play/coin-flip", replace: true });
  },
});
