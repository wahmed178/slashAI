import { createFileRoute, redirect } from "@tanstack/react-router";

/** Typing Speed Test moved to SlashPlay - keep old tool links working */
export const Route = createFileRoute("/tools/typing-test")({
  beforeLoad: () => {
    throw redirect({ to: "/play/typing-test", replace: true });
  },
});
