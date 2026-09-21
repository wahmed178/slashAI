import { createFileRoute } from "@tanstack/react-router";

import { ToolRunner, ToolNotFound } from "@/components/tools/ToolRunner";
import { TOOL_BY_SLUG } from "@/lib/toolkit/catalog";

/**
 * Dynamic toolkit route. Static /tools/<slug> routes are authored pages and
 * always win over this one; anything without its own file is served from the
 * declarative catalogue in lib/toolkit.
 */
export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) => {
    const tool = TOOL_BY_SLUG.get(params.slug);
    if (!tool) return { meta: [{ title: "Tool not found | SlashAI" }] };
    return {
      meta: [
        { title: `${tool.name} — ${tool.desc} | SlashAI` },
        { name: "description", content: `${tool.desc}. Free, in-browser, nothing uploaded, no account needed.` },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) return <ToolNotFound slug={slug} />;
  return <ToolRunner tool={tool} />;
}
