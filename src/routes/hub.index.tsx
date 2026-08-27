import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, GraduationCap, Code, Paintbrush, Rocket, IndianRupee, Stethoscope, Briefcase, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/hub/")({
  head: () => ({
    meta: [
      { title: "Hubs \u2014 SlashAI" },
      { name: "description", content: "Role-based hubs with curated resources for every type of builder." },
    ],
  }),
  component: HubIndexPage,
});

const HUBS = [
  { audience: "students", label: "Student Hub", icon: GraduationCap, desc: "Courses, tools, and resources for learners", count: "60+", built: true },
  { audience: "developers", label: "Developer Hub", icon: Code, desc: "APIs, tools, and tutorials for devs", count: "80+", built: true },
  { audience: "creators", label: "Creator Hub", icon: Paintbrush, desc: "Content creation tools and channels", count: "40+", built: true },
  { audience: "professionals", label: "Professional Hub", icon: Briefcase, desc: "Productivity tools for working professionals", count: "50+", built: true },
  { audience: "founders", label: "Founder Hub", icon: Rocket, desc: "Validate, build, ship, grow \u2014 from idea to revenue", count: "30+", built: true },
  { audience: "india", label: "India Hub", icon: IndianRupee, desc: "Free tools, courses and APIs for Indian builders", count: "25+", built: true },
  { audience: "finance", label: "Finance Hub", icon: TrendingUp, desc: "Investing, personal finance, and crypto tools", count: "20+", built: true },
  { audience: "designers", label: "Designers Hub", icon: Paintbrush, desc: "Free design tools, assets and learning", count: "15+", built: true },
  { audience: "health", label: "Health Hub", icon: Stethoscope, desc: "Fitness, nutrition and wellbeing tools", count: "10+", built: true },
];

function HubIndexPage() {
  return (
    <AppShell wide hideHeaderSearch title="Hubs">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Hubs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Role-based hubs with curated resources for every type of builder.
        </p>
      </header>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.audience}
              to="/hub/$audience"
              params={{ audience: hub.audience }}
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
              <span className="mt-3 inline-flex items-center rounded border px-2 py-0.5 text-[11px]" style={{ background: "#21262d", borderColor: "#30363d", color: "#8b949e" }}>
                {hub.count} resources
              </span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
