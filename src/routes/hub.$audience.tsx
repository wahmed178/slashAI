/**
 * `/hub/$audience` — retired.
 *
 * The hubs duplicated what SlashBar now does, and they only ever listed
 * resources. Each one is now a SlashBar category that also carries the
 * commands, tools, games and guides that belong to the same audience, so this
 * route redirects rather than 404s: these URLs are in the sitemap and may
 * already have inbound links, and a 301-equivalent keeps that equity.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

import { HUB_REDIRECTS } from "@/lib/slashbar-categories";

export const Route = createFileRoute("/hub/$audience")({
  beforeLoad: ({ params }) => {
    const slug = HUB_REDIRECTS[params.audience];
    if (slug) throw redirect({ to: "/slashbar/$category", params: { category: slug } });
    // An audience with no category (and not a real hub) goes to the launcher
    // rather than rendering a dead end.
    throw redirect({ to: "/slash" });
  },
});
