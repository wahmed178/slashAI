import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { StoreManager } from "@/components/stores/StoreManager";

interface DashboardSearch {
  /** optional deep link: /stores/dashboard?store=<slug> */
  store?: string | undefined;
}

export const Route = createFileRoute("/stores/dashboard")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => ({
    store: typeof search["store"] === "string" ? search["store"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your store — SlashAI Stores" },
      {
        name: "description",
        content:
          "Run your SlashAI store: products, orders and store settings in one place. Free, no commission, orders handed off to WhatsApp.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { store } = Route.useSearch();
  return (
    <AppShell hideHeaderSearch title="Your store">
      <div className="pt-2">
        <StoreManager initialSlug={store} />
      </div>
    </AppShell>
  );
}
