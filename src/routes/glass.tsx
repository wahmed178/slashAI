import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/glass")({
  head: () => ({
    meta: [
      { title: "SlashAI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GlassRedirect,
});

/**
 * The paid "Glass" tier no longer exists — every feature is free.
 * Redirect anywhere pointing at the old waitlist page back home.
 */
function GlassRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true });
  }, [navigate]);
  return null;
}
