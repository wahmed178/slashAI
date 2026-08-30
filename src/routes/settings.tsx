import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SlashAI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsRedirect,
});

function SettingsRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/me", replace: true });
  }, [navigate]);
  return null;
}
