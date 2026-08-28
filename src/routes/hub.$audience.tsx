import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import { ResourceCardEnhanced } from "@/components/library/ResourceCardEnhanced";
import { Button } from "@/components/ui/button";
import { audienceResources, type Audience, type Resource } from "@/lib/resources";
import { FOUNDERS_RESOURCES } from "@/lib/hub-founders";
import { INDIA_RESOURCES } from "@/lib/hub-india";
import { FINANCE_RESOURCES } from "@/lib/hub-finance";
import { HEALTH_RESOURCES } from "@/lib/hub-health";
import type { HubResource } from "@/lib/hub-founders";

/* ──────────── section grouping for each hub ──────────── */
interface HubSection {
  icon: string;
  title: string;
  discoverLink?: string;
  match: (r: Resource) => boolean;
}

const HUB_SECTION_MAP: Record<string, HubSection[]> = {
  students: [
    { icon: "\u{1F916}", title: "AI Study Tools", match: (r) => r.category === "AI Tools" || r.category === "AI Search" || r.category === "Free AI Chat" },
    { icon: "\u{1F4BB}", title: "Free Courses", match: (r) => r.type === "Course" || r.category === "Courses" },
    { icon: "\u{1F4DA}", title: "Learning Platforms & Roadmaps", match: (r) => r.type === "Tutorial" || r.type === "Cheat Sheet" },
    { icon: "\u{1F419}", title: "GitHub Resources", match: (r) => r.type === "GitHub" },
    { icon: "\u{1F6E0}\u{FE0F}", title: "Student Tools", match: (r) => r.type === "Software" || r.type === "Website" },
    { icon: "\u{1F3AC}", title: "YouTube Channels", match: (r) => r.type === "YouTube" },
    { icon: "\u{1F4D6}", title: "Free Reading & Wikis", match: (r) => r.type === "Wiki" || r.category === "Subreddits" },
    { icon: "\u{1F4A1}", title: "Tips & Tricks", match: (r) => r.type === "Trick" },
  ],
  developers: [
    { icon: "\u{1F916}", title: "AI Coding Tools", match: (r) => r.category === "AI Coding" || r.category === "AI Tools" || r.category === "Free AI Chat" },
    { icon: "\u{1F9E0}", title: "Local AI & Open Models", match: (r) => r.category === "Open Models" || r.category === "AI Models" },
    { icon: "\u{1F4E1}", title: "Free APIs", match: (r) => r.type === "API" },
    { icon: "\u{1F419}", title: "GitHub Must-Haves", match: (r) => r.type === "GitHub" },
    { icon: "\u{1F4DA}", title: "Developer Learning", match: (r) => r.type === "Course" || r.type === "Tutorial" || r.type === "Cheat Sheet" },
    { icon: "\u{1F4D6}", title: "Docs & References", match: (r) => r.type === "Wiki" || r.type === "Website" },
    { icon: "\u{1F3AC}", title: "YouTube (Dev)", match: (r) => r.type === "YouTube" },
    { icon: "\u{1F4AC}", title: "Communities", match: (r) => r.category === "Subreddits" || r.type === "Subreddit" },
  ],
  creators: [
    { icon: "\u{1F916}", title: "AI Creative Tools", match: (r) => r.category === "AI Image" || r.category === "AI Video" || r.category === "AI Audio" || r.category === "AI Tools" },
    { icon: "\u{1F3A8}", title: "Design & Editing (Free)", match: (r) => r.category === "Image" || r.category === "Video" || r.category === "Audio" },
    { icon: "\u{1F4F8}", title: "Free Stock & Assets", match: (r) => r.tags.includes("stock") || r.tags.includes("images") || r.tags.includes("photos") },
    { icon: "\u{1F3AC}", title: "YouTube (Creators)", match: (r) => r.type === "YouTube" },
    { icon: "\u{270D}\u{FE0F}", title: "Writing & Content Tools", match: (r) => r.category === "Text" || r.category === "Productivity" },
    { icon: "\u{1F3B5}", title: "Free Music & Audio", match: (r) => r.type === "Software" && (r.tags.includes("music") || r.tags.includes("audio")) },
  ],
  professionals: [
    { icon: "\u{1F916}", title: "AI Work Tools", match: (r) => r.category === "AI Tools" || r.category === "AI Coding" },
    { icon: "\u{1F4DD}", title: "Productivity & Planning", match: (r) => r.category === "Productivity" },
    { icon: "\u{1F4CA}", title: "Data & Analysis", match: (r) => r.type === "Dataset" || r.category.includes("Data") },
    { icon: "\u{1F393}", title: "Professional Learning", match: (r) => r.type === "Course" },
    { icon: "\u{1F4BC}", title: "Career & Job Tools", match: (r) => r.category.includes("Resume") || r.category.includes("Job") || r.tags.includes("career") },
    { icon: "\u{1F3AC}", title: "YouTube (Professional)", match: (r) => r.type === "YouTube" },
  ],
  founders: [
    { icon: "\u{1F916}", title: "AI Business Tools", match: (r) => r.category === "AI Tools" || r.category === "AI Research" },
    { icon: "\u{1F680}", title: "Startup Resources", match: (r) => r.tags.includes("startup") || r.tags.includes("business") || r.tags.includes("saas") },
    { icon: "\u{1F4DA}", title: "Founder Learning", match: (r) => r.type === "Course" || r.type === "Tutorial" },
    { icon: "\u{1F4B0}", title: "Finance & Payments", match: (r) => r.category === "Finance" || r.tags.includes("finance") || r.tags.includes("payments") },
    { icon: "\u{1F3AC}", title: "YouTube (Founders)", match: (r) => r.type === "YouTube" },
  ],
  india: [
    { icon: "\u{1F916}", title: "AI Tools for India", match: (r) => r.category === "AI Tools" || r.category === "Free AI Chat" },
    { icon: "\u{1F4E1}", title: "Indian APIs & Data", match: (r) => r.tags.includes("india") || r.tags.includes("indian") },
    { icon: "\u{1F393}", title: "Indian Courses & Platforms", match: (r) => r.type === "Course" },
    { icon: "\u{1F3AC}", title: "YouTube (India)", match: (r) => r.type === "YouTube" },
    { icon: "\u{1F4BC}", title: "Indian Professional Tools", match: (r) => r.type === "Software" || r.type === "Website" },
  ],
  finance: [
    { icon: "\u{1F4CA}", title: "Stock & Crypto Tools", match: (r) => r.tags.includes("crypto") || r.tags.includes("stock") || r.tags.includes("trading") },
    { icon: "\u{1F916}", title: "AI Finance Tools", match: (r) => r.category === "AI Tools" },
    { icon: "\u{1F4E1}", title: "Finance APIs", match: (r) => r.type === "API" },
    { icon: "\u{1F393}", title: "Financial Learning", match: (r) => r.type === "Course" || r.type === "Tutorial" },
    { icon: "\u{1F3AC}", title: "YouTube (Finance)", match: (r) => r.type === "YouTube" },
  ],
  designers: [
    { icon: "\u{1F3A8}", title: "Design Tools", match: (r) => r.category === "Image" || r.category === "Video" || r.tags.includes("design") },
    { icon: "\u{1F916}", title: "AI Design Tools", match: (r) => r.category === "AI Image" || r.category === "AI Tools" },
    { icon: "\u{1F4DA}", title: "Design Learning", match: (r) => r.type === "Course" || r.type === "Tutorial" },
    { icon: "\u{1F3AC}", title: "YouTube (Design)", match: (r) => r.type === "YouTube" },
  ],
  health: [
    { icon: "\u{1F3C3}", title: "Fitness & Workout Tools", match: (r) => r.tags.includes("fitness") || r.tags.includes("workout") || r.tags.includes("exercise") },
    { icon: "\u{1F34E}", title: "Nutrition & Diet", match: (r) => r.tags.includes("nutrition") || r.tags.includes("diet") || r.tags.includes("food") },
    { icon: "\u{1F916}", title: "AI Health Tools", match: (r) => r.category === "AI Tools" },
    { icon: "\u{1F393}", title: "Health Learning", match: (r) => r.type === "Course" || r.type === "Tutorial" },
  ],
};

const HUBS: Record<string, { audience: Audience; title: string; blurb: string; collection?: string }> = {
  students: { audience: "Students", title: "Student Hub", blurb: "Free software, study tools, courses and student offers.", collection: "for-students" },
  professionals: { audience: "Professionals", title: "Professional Hub", blurb: "Productivity, writing, research and planning tools for everyday desk work.", collection: "for-professionals" },
  developers: { audience: "Developers", title: "Developer Hub", blurb: "Editors, APIs, open-source projects and references worth keeping bookmarked." },
  creators: { audience: "Creators", title: "Creator Hub", blurb: "Editing, capture, design and asset tools that do not watermark your work.", collection: "for-creators" },
  founders: { audience: "Founders", title: "Founders Hub", blurb: "Everything to go from idea to first paying customer." },
  india: { audience: "India", title: "India Hub", blurb: "Free tools, courses and resources for Indian builders." },
  finance: { audience: "Finance", title: "Finance Hub", blurb: "Free tools for investors, traders and money-minded builders." },
  designers: { audience: "Designers", title: "Designers Hub", blurb: "Free design tools, assets and learning for UI/UX designers." },
  health: { audience: "Health", title: "Health Hub", blurb: "Evidence-based free tools for fitness, nutrition and wellbeing." },
};

export const Route = createFileRoute("/hub/$audience")({
  loader: ({ params }) => {
    const hub = HUBS[params.audience];
    if (!hub) throw notFound();
    return { hub };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable \u2014 SlashAI" }, { name: "robots", content: "noindex" }] };
    }
    const { hub } = loaderData;
    return {
      meta: [
        { title: `${hub.title} \u2014 free curated resources | SlashAI` },
        { name: "description", content: hub.blurb },
        { property: "og:title", content: `${hub.title} \u2014 SlashAI` },
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
        hint="Try the Student or Developer hub from Discover."
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
  const slug = hub.audience.toLowerCase();
  // Use dedicated data files for new hubs, audienceResources for existing ones
  const dedicatedMap: Record<string, HubResource[]> = {
    founders: FOUNDERS_RESOURCES,
    india: INDIA_RESOURCES,
    finance: FINANCE_RESOURCES,
    health: HEALTH_RESOURCES,
  };
  const dedicated = dedicatedMap[slug];
  const allResources: Resource[] = dedicated
    ? dedicated.map((r) => ({
        ...r,
        type: r.type as Resource["type"],
        section: "resources" as const,
        subcategory: r.category,
        audience: [hub.audience as Audience],
        platform: [],
        addedDate: "2026-08-27",
        lastUpdated: "2026-08-27",
        lastVerified: r.lastVerified,
        status: "Active" as const,
        tags: r.tags,
      }))
    : audienceResources(hub.audience);
  const sectionDefs = HUB_SECTION_MAP[hub.audience] || [];

  /* group resources into sections, with an "Other" fallback */
  const grouped = useMemo(() => {
    const sections: { icon: string; title: string; items: Resource[] }[] = [];
    const matched = new Set<string>();

    for (const def of sectionDefs) {
      const items = allResources.filter((r) => {
        if (matched.has(r.id)) return false;
        const ok = def.match(r);
        if (ok) matched.add(r.id);
        return ok;
      });
      if (items.length > 0) {
        sections.push({ icon: def.icon, title: def.title, items });
      }
    }

    /* leftover resources go into "More" */
    const remaining = allResources.filter((r) => !matched.has(r.id));
    if (remaining.length > 0) {
      sections.push({ icon: "\u{1F4E6}", title: "More Resources", items: remaining });
    }

    return sections;
  }, [allResources, sectionDefs]);

  return (
    <AppShell wide hideHeaderSearch title={hub.title} back={{ to: "/hub", label: "Hubs" }}>
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">{hub.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{hub.blurb}</p>
        {hub.collection && (
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to="/collections/$id" params={{ id: hub.collection }}>
              Matching commands
            </Link>
          </Button>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {allResources.length} resources
        </p>
      </header>

      {/* Grouped sections */}
      <div className="mt-6">
        {grouped.map((section, i) => (
          <section key={section.title} className={i > 0 ? "mt-7" : ""}>
            {/* Section header */}
            <div className="hub-section-header">
              <span className="text-[20px]" aria-hidden>{section.icon}</span>
              <h2 className="min-w-0 flex-1 text-[18px] font-semibold text-foreground">
                {section.title}
              </h2>
              <span className="shrink-0 text-[12px] text-muted-foreground">
                {section.items.length} resources
              </span>
            </div>

            {/* Resource cards */}
            <div className="flex flex-col gap-2">
              {section.items.map((r) => (
                <ResourceCardEnhanced key={r.id} resource={r} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {grouped.length === 0 && (
        <EmptyState
          title="No resources yet"
          hint="Resources for this hub are being curated."
        />
      )}
    </AppShell>
  );
}
