import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tools")({
  component: ToolsLayout,
  // The generic SlashKits title/description must only apply to the /tools
  // index page — child tool pages get their own titles from the central
  // registry in src/lib/seo.ts (emit them here only when no child matched).
  head: ({ matches }: { matches: Array<{ pathname: string }> }) => {
    if (matches.some((m) => m.pathname !== "/tools")) return {};
    return {
      meta: [
        { title: "SlashKits - 150+ Free Browser Tools" },
        {
          name: "description",
          content:
            "Run 140+ free browser tools without uploading anything: calculators, converters, generators, PDF tools, Islamic tools and more. Free forever, no account.",
        },
      ],
    };
  },
});

function ToolsLayout() {
  return <Outlet />;
}
