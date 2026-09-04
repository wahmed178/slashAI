import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Code, Paintbrush, Briefcase, Rocket, IndianRupee, Stethoscope, TrendingUp, Globe, Languages } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { audienceResources, type Audience } from "@/lib/resources";
import { FOUNDERS_RESOURCES } from "@/lib/hub-founders";
import { INDIA_RESOURCES } from "@/lib/hub-india";
import { FINANCE_RESOURCES } from "@/lib/hub-finance";
import { HEALTH_RESOURCES } from "@/lib/hub-health";

export const Route = createFileRoute("/hub/")({
  head: () => ({
    meta: [
      { title: "Hubs — SlashAI" },
      { name: "description", content: "Role-based and language hubs with curated free resources." },
    ],
  }),
  component: HubIndexPage,
});

interface HubCard {
  audience: string;
  label: string;
  icon: any;
  desc: string;
  /** audience key on Resource.audience for hubs served from the main catalogue */
  audienceKey?: Audience;
  /** hub served from its own data file */
  dedicated?: "founders" | "india" | "finance" | "health";
  /** fixed count for the standalone hub pages */
  staticCount?: number;
  countLabel?: string;
}

const HUB_DEDICATED: Record<"founders" | "india" | "finance" | "health", { label: string; icon: any; desc: string; list: unknown[] }> = {
  founders: { label: "Founders Hub", icon: Rocket, desc: "Validate, build, ship, grow — from idea to revenue", list: FOUNDERS_RESOURCES },
  india: { label: "India Hub", icon: IndianRupee, desc: "Free tools, courses and APIs for Indian builders", list: INDIA_RESOURCES },
  finance: { label: "Finance Hub", icon: TrendingUp, desc: "Investing, personal finance, and crypto tools", list: FINANCE_RESOURCES },
  health: { label: "Health Hub", icon: Stethoscope, desc: "Fitness, nutrition and wellbeing tools", list: HEALTH_RESOURCES },
};

const HUBS: HubCard[] = [
  { audience: "students", label: "Student Hub", icon: GraduationCap, desc: "Courses, tools, and resources for learners", audienceKey: "Students" },
  { audience: "developers", label: "Developer Hub", icon: Code, desc: "APIs, tools, and tutorials for devs", audienceKey: "Developers" },
  { audience: "creators", label: "Creator Hub", icon: Paintbrush, desc: "Content creation tools and channels", audienceKey: "Creators" },
  { audience: "professionals", label: "Professional Hub", icon: Briefcase, desc: "Productivity tools for working professionals", audienceKey: "Professionals" },
  { audience: "founders", label: "Founders Hub", icon: Rocket, desc: "From idea to launch — free resources", dedicated: "founders" },
  { audience: "india", label: "India Hub", icon: IndianRupee, desc: "Free tools, courses and APIs for Indian builders", dedicated: "india" },
  { audience: "islam", label: "Islam Hub", icon: Globe, desc: "Quran, Hadith, prayer, learning and daily tools — all free", staticCount: 53 },
  { audience: "urdu", label: "Urdu Hub", icon: Languages, desc: "Urdu poetry, dictionaries, fonts and learning", staticCount: 8 },
  { audience: "arabic", label: "Arabic Hub", icon: Languages, desc: "Arabic alphabet, courses, keyboard and phrases", staticCount: 4, countLabel: "4 curated + alphabet" },
  { audience: "designers", label: "Designers Hub", icon: Paintbrush, desc: "Free design tools, assets and learning", audienceKey: "Designers" },
  { audience: "finance", label: "Finance Hub", icon: TrendingUp, desc: "Markets, crypto and money tools", dedicated: "finance" },
  { audience: "health", label: "Health Hub", icon: Stethoscope, desc: "Evidence-based health and fitness tools", dedicated: "health" },
];

function countFor(hub: HubCard): number {
  if (hub.dedicated) return HUB_DEDICATED[hub.dedicated].list.length;
  if (hub.audienceKey) return audienceResources(hub.audienceKey).length;
  return hub.staticCount ?? 0;
}

function HubIndexPage() {
  return (
    <AppShell wide hideHeaderSearch title="Hubs">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Hubs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Role-based and language hubs with curated free resources — every link verified, nothing behind a paywall.
        </p>
      </header>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          const count = countFor(hub);
          const isStatic = ["islam", "urdu", "arabic"].includes(hub.audience);
          const linkProps = isStatic
            ? { to: `/hub/${hub.audience}` as const }
            : { to: "/hub/$audience" as const, params: { audience: hub.audience } };
          return (
            <Link
              key={hub.audience}
              {...linkProps}
              className="group flex flex-col items-center rounded-[10px] border border-border bg-surface p-5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-surface-elevated text-primary">
                <Icon className="size-6" />
              </span>
              <p className="mt-3 text-[16px] font-semibold text-foreground">
                {hub.label}
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">
                {hub.desc}
              </p>
              <span className="mt-3 inline-flex items-center rounded border px-2 py-0.5 text-[11px]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                {hub.countLabel ?? `${count} resources`}
              </span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
