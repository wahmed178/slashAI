import { createFileRoute } from "@tanstack/react-router";
import { Repeat2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { PricingBadge } from "@/components/library/ResourceCard";
import { Link } from "@tanstack/react-router";
import { ALTERNATIVES } from "@/lib/resources";

export const Route = createFileRoute("/alternatives")({
  head: () => ({
    meta: [
      { title: "Free alternatives to paid software | SlashAI" },
      {
        name: "description",
        content:
          "Free and open-source stand-ins for popular paid tools, with the licence model stated and no claims of feature parity.",
      },
      { property: "og:title", content: "Free alternatives — SlashAI" },
      {
        property: "og:description",
        content: "Open-source and free-tier replacements for common paid software.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AlternativesPage,
});

function AlternativesPage() {
  const groups = new Map<string, typeof ALTERNATIVES>();
  for (const x of ALTERNATIVES) {
    for (const paid of x.alternativeTo ?? []) {
      groups.set(paid, [...(groups.get(paid) ?? []), x]);
    }
  }

  return (
    <AppShell
      wide
      hideHeaderSearch
      title="Free alternatives"
      back={{ to: "/discover", label: "Discover" }}
    >
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Repeat2 className="size-6 text-primary" aria-hidden /> Free alternatives
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Practical replacements, not identical products — check the feature you rely on before you
          switch.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        {[...groups.entries()].map(([paid, items]) => (
          <section key={paid} className="panel rounded-xl p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Instead of <span className="text-foreground">{paid}</span>
            </h2>
            <ul className="mt-2 divide-y divide-border">
              {items.map((x) => (
                <li key={x.id}>
                  <Link
                    to="/r/$id"
                    params={{ id: x.id }}
                    className="flex min-h-14 items-center gap-3 py-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {x.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {x.description}
                      </span>
                    </span>
                    <PricingBadge pricing={x.pricing} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
