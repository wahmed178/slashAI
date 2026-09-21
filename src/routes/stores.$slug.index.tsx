import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { Storefront } from "@/components/stores/Storefront";

export const Route = createFileRoute("/stores/$slug/")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((word) => (word ? word[0]!.toUpperCase() + word.slice(1) : word))
      .join(" ");
    return {
      meta: [
        { title: `${name} — store on SlashAI` },
        {
          name: "description",
          content: `Shop ${name}: products, prices and stock, with orders confirmed on WhatsApp. Free storefront hosted on SlashAI — no account needed to buy.`,
        },
      ],
    };
  },
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  return (
    <AppShell hideHeaderSearch title="Store">
      <Storefront slug={slug} />
    </AppShell>
  );
}
