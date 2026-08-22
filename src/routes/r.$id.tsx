import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Flag, ListChecks, Repeat2, Tag } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import { PricingBadge, ResourceGrid, VisitButton } from "@/components/library/ResourceCard";
import { Button } from "@/components/ui/button";
import { getResource, RESOURCES, sectionDef } from "@/lib/resources";

export const Route = createFileRoute("/r/$id")({
  loader: ({ params }) => {
    const resource = getResource(params.id);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { resource } = loaderData;
    const title = `${resource.name} — ${resource.pricing} | SlashAI`;
    return {
      meta: [
        { title },
        { name: "description", content: resource.description },
        { property: "og:title", content: title },
        { property: "og:description", content: resource.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: ResourceNotFound,
  component: ResourcePage,
});

function ResourceNotFound() {
  return (
    <AppShell hideHeaderSearch title="Not found" back={{ to: "/discover", label: "Discover" }}>
      <EmptyState
        title="That resource isn’t in the catalog"
        hint="It may have been renamed or removed during a curation pass."
        action={
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        }
      />
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function ResourcePage() {
  const { resource } = Route.useLoaderData();
  const def = sectionDef(resource.section);

  const related = RESOURCES.filter(
    (x) =>
      x.id !== resource.id && (x.category === resource.category || x.section === resource.section),
  ).slice(0, 6);

  const reportUrl = `mailto:?subject=${encodeURIComponent(
    `SlashAI — broken resource: ${resource.name}`,
  )}&body=${encodeURIComponent(`Resource id: ${resource.id}\nURL: ${resource.url}\nWhat changed: `)}`;

  return (
    <AppShell
      hideHeaderSearch
      title={resource.name}
      back={{ to: `/discover/${resource.section}`, label: def?.label ?? "Discover" }}
    >
      <nav aria-label="Breadcrumb" className="pt-2 text-xs text-muted-foreground">
        <Link to="/discover" className="hover:text-foreground">
          Discover
        </Link>{" "}
        /{" "}
        <Link
          to="/discover/$section"
          params={{ section: resource.section }}
          className="hover:text-foreground"
        >
          {def?.label}
        </Link>{" "}
        / <span className="text-foreground">{resource.category}</span>
      </nav>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground">{resource.name}</h1>
          <PricingBadge pricing={resource.pricing} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <VisitButton url={resource.url} />
          {resource.commandQuery && (
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/search" search={{ q: resource.commandQuery }}>
                Matching commands
              </Link>
            </Button>
          )}
        </div>
      </header>

      {resource.eligibility && (
        <p className="panel mt-4 rounded-xl border-primary/30 bg-accent/40 p-3 text-sm text-foreground">
          Eligibility: {resource.eligibility}
        </p>
      )}
      {resource.region && (
        <p className="mt-2 text-xs text-muted-foreground">Availability: {resource.region}</p>
      )}

      {resource.steps && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <ListChecks className="size-4 text-primary" aria-hidden /> How to do it
          </h2>
          <ol className="mt-2 space-y-2">
            {resource.steps.map((s, i) => (
              <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </section>
      )}

      {resource.notes && (
        <section className="panel mt-6 rounded-xl p-4">
          <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            Editorial note
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{resource.notes}</p>
        </section>
      )}

      {resource.alternativeTo && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Repeat2 className="size-4 text-primary" aria-hidden />A practical free alternative to{" "}
          <span className="font-medium text-foreground">{resource.alternativeTo.join(", ")}</span>
        </p>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Details</h2>
        <dl className="panel divide-y divide-border rounded-xl text-sm">
          <Row label="Type" value={resource.type} />
          <Row label="Category" value={resource.category} />
          <Row label="Audience" value={resource.audience.join(", ")} />
          {resource.platform && <Row label="Platform" value={resource.platform.join(", ")} />}
          {resource.owner && <Row label="Owner" value={resource.owner} />}
          {resource.language && <Row label="Language" value={resource.language} />}
          {resource.license && <Row label="License" value={resource.license} />}
          {resource.difficulty && <Row label="Difficulty" value={resource.difficulty} />}
          <Row label="Status" value={resource.status} />
          <Row label="Added" value={resource.addedDate} />
          <Row label="Last updated" value={resource.lastUpdated} />
          <Row label="Last verified" value={resource.lastVerified} />
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          Metadata is curated manually; anything we could not verify is left out rather than
          guessed.
        </p>
      </section>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {resource.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            <Tag className="size-3" aria-hidden />
            {t}
          </span>
        ))}
      </div>

      <a
        href={reportUrl}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <Flag className="size-3.5" aria-hidden /> Report a broken or changed link
      </a>

      {related.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-3 text-lg font-bold tracking-tight text-foreground">Related</h2>
          <ResourceGrid resources={related} />
        </section>
      )}
    </AppShell>
  );
}
