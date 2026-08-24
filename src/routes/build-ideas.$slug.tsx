import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Hammer, ListChecks, ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { BuildSpecDrawer } from "@/components/library/BuildSpecDrawer";
import { IdeaScore } from "@/components/library/IdeaCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findIdea, relatedIdeas } from "@/lib/build-ideas";
import { useIdeaLibrary } from "@/hooks/use-build-ideas";

export const Route = createFileRoute("/build-ideas/$slug")({
  loader: ({ params }) => {
    const idea = findIdea(params.slug);
    if (!idea) throw notFound();
    return { idea };
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    if (!idea) return {};
    return {
      meta: [
        { title: `${idea.title} — build idea with MVP scope | SlashAI` },
        { name: "description", content: idea.shortDescription },
        { property: "og:title", content: `${idea.title} — SlashAI Build Ideas` },
        { property: "og:description", content: idea.shortDescription },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: IdeaDetail,
});

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel mt-4 rounded-xl p-4">
      <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
        {icon}
        {title}
      </h2>
      <div className="mt-2 space-y-2 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function IdeaDetail() {
  const { idea } = Route.useLoaderData();
  const { saved, toggleSaved, upsertProject } = useIdeaLibrary();
  const [specOpen, setSpecOpen] = useState(false);
  const isSaved = saved.includes(idea.id);
  const related = relatedIdeas(idea);

  return (
    <AppShell hideHeaderSearch title={idea.title} back={{ to: "/build-ideas", label: "Build Ideas" }}>
      <header className="pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{idea.category}</Badge>
          <Badge variant="outline">{idea.difficulty}</Badge>
          <Badge variant="outline">{idea.buildType}</Badge>
          <Badge variant="outline">{idea.suitableFor}</Badge>
          <IdeaScore score={idea.opportunityScore} />
        </div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground">{idea.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{idea.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setSpecOpen(true);
              upsertProject({
                ideaId: idea.id,
                slug: idea.slug,
                title: idea.title,
                stage: "Planning",
              });
            }}
          >
            <Hammer className="size-4" /> Build this
          </Button>
          <Button variant="secondary" onClick={() => toggleSaved(idea.id)}>
            {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {isSaved ? "Saved" : "Save idea"}
          </Button>
        </div>
      </header>

      <Section title="Problem & target users">
        <p>{idea.problem}</p>
        <p>
          <strong className="text-foreground">Who it&apos;s for:</strong> {idea.targetUsers}
        </p>
      </Section>

      <Section title="Proposed solution">
        <p>{idea.proposedSolution}</p>
      </Section>

      <section className="panel mt-4 rounded-xl p-4">
        <h2 className="text-base font-bold tracking-tight text-foreground">Features</h2>
        <Tabs defaultValue="key" className="mt-3">
          <TabsList>
            <TabsTrigger value="key">Key</TabsTrigger>
            <TabsTrigger value="mvp">MVP</TabsTrigger>
            <TabsTrigger value="future">Future</TabsTrigger>
          </TabsList>
          <TabsContent value="key" className="mt-3 text-sm text-muted-foreground">
            <Bullets items={idea.keyFeatures} />
          </TabsContent>
          <TabsContent value="mvp" className="mt-3 text-sm text-muted-foreground">
            <Bullets items={idea.mvpFeatures} />
          </TabsContent>
          <TabsContent value="future" className="mt-3 text-sm text-muted-foreground">
            <Bullets items={idea.futureFeatures} />
          </TabsContent>
        </Tabs>
      </section>

      <Section title="Difficulty & tech stack">
        <p>
          <strong className="text-foreground">Difficulty:</strong> {idea.difficulty}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {idea.techStack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Monetization & pricing">
        <Bullets items={idea.monetizationOptions} />
        <p>
          <strong className="text-foreground">Suggested pricing:</strong> {idea.pricingSuggestions}
        </p>
      </Section>

      <Section title="Customer acquisition">
        <p>{idea.customerAcquisition}</p>
        <p>
          <strong className="text-foreground">First 10 customers:</strong> {idea.first10Customers}
        </p>
      </Section>

      <Section title="Build steps" icon={<ListChecks className="size-4 text-primary" aria-hidden />}>
        <ol className="ml-4 list-decimal space-y-1">
          {idea.buildSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title="Risks & challenges" icon={<ShieldAlert className="size-4 text-primary" aria-hidden />}>
        <Bullets items={idea.risks} />
      </Section>

      <div className="panel mt-4 flex flex-col gap-3 rounded-xl p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-base font-bold text-foreground">Ready to build it?</p>
          <p className="text-sm text-muted-foreground">
            Get a full product spec plus a paste-ready prompt for your AI app builder.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => setSpecOpen(true)}>
            <Hammer className="size-4" /> Build this
          </Button>
          <Button variant="secondary" onClick={() => toggleSaved(idea.id)}>
            {isSaved ? "Saved" : "Save idea"}
          </Button>
        </div>
      </div>

      {related.length ? (
        <section className="mt-8">
          <h2 className="mb-2 text-base font-bold tracking-tight text-foreground">
            More {idea.category} ideas
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/build-ideas/$slug"
                params={{ slug: r.slug }}
                className="panel rounded-xl p-4 transition-colors hover:border-primary/50"
              >
                <span className="block text-sm font-bold text-foreground">{r.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{r.shortDescription}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <BuildSpecDrawer idea={idea} open={specOpen} onOpenChange={setSpecOpen} />
    </AppShell>
  );
}
