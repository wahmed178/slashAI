import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { KitView } from "@/components/tools/KitView";
import { getKit, KIT_COUNT } from "@/lib/kits/registry";

export const Route = createFileRoute("/tools/kit/$slug")({
  head: ({ params }) => {
    const kit = getKit(params.slug);
    return {
      meta: [
        {
          title: kit
            ? `${kit.name} — Free Online Tool | SlashAI`
            : `Instant Tool Kits | SlashAI`,
        },
        {
          name: "description",
          content: kit
            ? `${kit.desc}. Free on SlashAI — no upload, no account, works offline.`
            : `${KIT_COUNT}+ instant tool kits: converters, reference tables, cheat sheets and curated web tools. Free forever.`,
        },
      ],
    };
  },
  component: KitPage,
});

function KitPage() {
  const { slug } = Route.useParams();
  const kit = getKit(slug);

  if (!kit) {
    return (
      <AppShell title="Kit not found">
        <div className="mx-auto max-w-xl py-16 text-center">
          <div className="text-5xl">🧰</div>
          <h1 className="mt-4 text-2xl font-bold">That kit doesn't exist</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the kit collection — converters, study tables, cheat sheets and more.
          </p>
          <Link
            to="/tools"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <ArrowLeft className="size-4" /> All tools
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={kit.name}>
      <div className="mx-auto max-w-2xl">
        <Link
          to="/tools"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All tools
        </Link>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {kit.icon} {kit.name}
            </h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {kit.group}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{kit.desc}</p>
        </header>

        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <KitView kit={kit} />
        </section>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          One of {KIT_COUNT}+ instant kits on SlashAI — free forever, nothing uploaded, no account.
        </p>
      </div>
    </AppShell>
  );
}
