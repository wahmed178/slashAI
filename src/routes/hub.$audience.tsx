import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import { ResourceGrid } from "@/components/library/ResourceCard";
import { Button } from "@/components/ui/button";
import { audienceResources, type Audience } from "@/lib/resources";

const HUBS: Record<
  string,
  { audience: Audience; title: string; blurb: string; collection?: string }
> = {
  students: {
    audience: "Students",
    title: "Student Hub",
    blurb:
      "Free software, study tools, courses and student offers. Eligibility is shown wherever an offer is conditional.",
    collection: "for-students",
  },
  professionals: {
    audience: "Professionals",
    title: "Professional Hub",
    blurb:
      "Productivity, writing, research, planning and presentation tools for everyday desk work.",
    collection: "for-professionals",
  },
  developers: {
    audience: "Developers",
    title: "Developer Hub",
    blurb: "Editors, APIs, open-source projects and references worth keeping bookmarked.",
  },
  creators: {
    audience: "Creators",
    title: "Creator Hub",
    blurb: "Editing, capture, design and asset tools that do not watermark your work.",
    collection: "for-creators",
  },
  researchers: {
    audience: "Researchers",
    title: "Researcher Hub",
    blurb: "Literature search, citation management and writing tools.",
  },
  "job-seekers": {
    audience: "Job Seekers",
    title: "Job Seeker Hub",
    blurb: "Resume building, salary research and interview preparation.",
  },
  founders: {
    audience: "Founders",
    title: "Founders Hub",
    blurb: "Everything to go from idea to first paying customer.",
  },
  india: {
    audience: "India",
    title: "India Hub",
    blurb: "Free tools, courses and resources for Indian builders.",
  },
  finance: {
    audience: "Finance",
    title: "Finance Hub",
    blurb: "Free tools for investors, traders and money-minded builders.",
  },
  designers: {
    audience: "Designers",
    title: "Designers Hub",
    blurb: "Free design tools, assets and learning for UI/UX designers.",
  },
  health: {
    audience: "Health",
    title: "Health Hub",
    blurb: "Evidence-based free tools for fitness, nutrition and wellbeing.",
  },
};

export const Route = createFileRoute("/hub/$audience")({
  loader: ({ params }) => {
    const hub = HUBS[params.audience];
    if (!hub) throw notFound();
    return { hub };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — SlashAI" }, { name: "robots", content: "noindex" }] };
    }
    const { hub } = loaderData;
    return {
      meta: [
        { title: `${hub.title} — free curated resources | SlashAI` },
        { name: "description", content: hub.blurb },
        { property: "og:title", content: `${hub.title} — SlashAI` },
        { property: "og:description", content: hub.blurb },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: HubNotFound,
  component: HubPage,
});

function HubNotFound() {
  return (
    <AppShell hideHeaderSearch title="Not found" back={{ to: "/discover", label: "Discover" }}>
      <EmptyState
        title="No hub with that name"
        hint="Try the Student or Professional hub from Discover."
        action={
          <Button asChild>
            <Link to="/discover">Go to Discover</Link>
          </Button>
        }
      />
    </AppShell>
  );
}

function HubPage() {
  const { hub } = Route.useLoaderData();
  const list = audienceResources(hub.audience);

  return (
    <AppShell wide hideHeaderSearch title={hub.title} back={{ to: "/discover", label: "Discover" }}>
      <header className="pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">{hub.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{hub.blurb}</p>
        {hub.collection && (
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to="/collections/$id" params={{ id: hub.collection }}>
              Matching commands
            </Link>
          </Button>
        )}
      </header>

      <div className="mt-6">
        <ResourceGrid resources={list} />
      </div>
    </AppShell>
  );
}
