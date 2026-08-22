import { createFileRoute } from "@tanstack/react-router";
import { Radar as RadarIcon } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { RADAR, RADAR_KINDS } from "@/lib/resources";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Free Radar — new free tools, offers and courses | SlashAI" },
      {
        name: "description",
        content:
          "Newly spotted free AI tools, student offers, open-source projects and free courses, each with the conditions stated plainly.",
      },
      { property: "og:title", content: "Free Radar — SlashAI" },
      {
        property: "og:description",
        content: "Free finds with honest eligibility and a verification date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RadarPage,
});

function RadarPage() {
  return (
    <AppShell wide hideHeaderSearch title="Free Radar" back={{ to: "/discover", label: "Discover" }}>
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <RadarIcon className="size-6 text-primary" aria-hidden /> Free Radar
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Things worth grabbing while they are free. Every conditional offer states who qualifies
          and when it was last checked.
        </p>
      </header>

      {RADAR_KINDS.map((kind) => {
        const items = RADAR.filter((x) => x.radar === kind);
        return (
          <section key={kind} className="mt-8">
            <h2 className="mb-3 text-base font-bold tracking-tight text-foreground">{kind}</h2>
            <ResourceGrid resources={items} />
          </section>
        );
      })}
    </AppShell>
  );
}
