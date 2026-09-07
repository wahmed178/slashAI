import { createFileRoute, redirect } from "@tanstack/react-router";

/** Dice Roller moved to SlashPlay - keep old tool links working */
export const Route = createFileRoute("/tools/dice")({
  beforeLoad: () => {
    throw redirect({ to: "/play/dice", replace: true });
  },
});
