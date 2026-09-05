import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tools")({
  component: ToolsLayout,
  head: () => ({
    meta: [
      {
        title: "SlashKits — 150+ Free Browser Tools",
      },
      {
        name: "description",
        content:
          "Run 150+ free browser tools without uploading anything: calculators, converters, generators, PDF tools, Islamic tools and more. Free forever, no account.",
      },
    ],
  }),
});

function ToolsLayout() {
  return <Outlet />;
}
