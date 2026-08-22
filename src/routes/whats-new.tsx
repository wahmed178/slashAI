import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Sparkles } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { CHANGELOG } from "@/lib/app-meta";
import { DROPS, NEWEST_RESOURCES, dropItems } from "@/lib/resources";

export const Route = createFileRoute("/whats-new")({
  head: () => ({
    meta: [
      { title: "What's new — weekly finds and app updates | SlashAI" },
      {
        name: "description",
        content:
          "Weekly free finds, monthly resource drops, special collections and the SlashAI app changelog in one place.",
      },
      { property: "og:title", content: "What's new — SlashAI" },
      {
        property: "og:description",
        content: "Weekly, monthly and yearly curated drops plus release notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WhatsNewPage,
});

const CADENCE_ORDER = ["Weekly", "Monthly", "Special", "Yearly"] as const;

function WhatsNewPage() {
  return (
    <AppShell
      wide
      hideHeaderSearch
      title="What's new"
      back={{ to: "/discover", label: "Discover" }}
    >
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Sparkles className="size-6 text-primary" aria-hidden /> What&apos;s new
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated drops are compiled by hand — weekly finds, a monthly batch, special occasions and
          a yearly toolkit.
        </p>
      </header>

      {CADENCE_ORDER.map((cadence) => {
        const drops = DROPS.filter((d) => d.cadence === cadence);
        if (drops.length === 0) return null;
        return (
          <section key={cadence} className="mt-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground">{cadence}</h2>
            {drops.map((d) => (
              <div key={d.id} className="mt-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {d.title}
                  <span className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                    <CalendarClock className="size-3.5" aria-hidden /> {d.published}
                  </span>
                </p>
                <p className="mt-0.5 mb-2.5 text-xs text-muted-foreground">{d.blurb}</p>
                <ResourceGrid resources={dropItems(d)} />
              </div>
            ))}
          </section>
        );
      })}

      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Recently added</h2>
        <div className="mt-3">
          <ResourceGrid resources={NEWEST_RESOURCES} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-foreground">App updates</h2>
        <div className="mt-3 space-y-3">
          {CHANGELOG.map((r) => (
            <div key={r.version} className="panel rounded-xl p-4">
              <p className="flex items-center justify-between text-sm font-semibold text-foreground">
                v{r.version}
                <span className="text-xs font-normal text-muted-foreground">{r.date}</span>
              </p>
              <p className="mt-0.5 text-xs text-primary">{r.title}</p>
              <ul className="mt-2 space-y-1.5">
                {r.changes.map((c) => (
                  <li key={c} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
