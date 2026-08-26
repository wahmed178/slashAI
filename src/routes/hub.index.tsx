import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, GraduationCap, Code, Paintbrush, Rocket, IndianRupee, Stethoscope, Briefcase } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/hub/")({
  head: () => ({
    meta: [
      { title: "Hubs — SlashAI" },
      { name: "description", content: "Role-based hubs with curated resources for every type of builder." },
    ],
  }),
  component: HubIndexPage,
});

const HUBS = [
  { audience: "students", label: "Student Hub", icon: GraduationCap, desc: "Courses, tools, and resources for learners" },
  { audience: "developers", label: "Developer Hub", icon: Code, desc: "APIs, tools, and tutorials for devs" },
  { audience: "creators", label: "Creator Hub", icon: Paintbrush, desc: "Content creation tools and channels" },
  { audience: "professionals", label: "Professional Hub", icon: Briefcase, desc: "Productivity tools for working professionals" },
  { audience: "founders", label: "Founder Hub", icon: Rocket, desc: "Validate, build, ship, grow — from idea to revenue" },
  { audience: "india", label: "India Hub", icon: IndianRupee, desc: "Free tools, courses and APIs for Indian builders" },
  { audience: "finance", label: "Finance Hub", icon: Globe, desc: "Investing, personal finance, and crypto tools" },
  { audience: "designers", label: "Designers Hub", icon: Paintbrush, desc: "Free design tools, assets and learning" },
  { audience: "health", label: "Health Hub", icon: Stethoscope, desc: "Fitness, nutrition and wellbeing tools" },
];

function HubIndexPage() {
  return (
    <AppShell wide hideHeaderSearch title="Hubs">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#e6edf3] sm:text-3xl">Hubs</h1>
        <p className="mt-1 text-sm text-[#8b949e]">
          Role-based hubs with curated resources for every type of builder.
        </p>
      </header>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.audience}
              to="/hub/$audience"
              params={{ audience: hub.audience }}
              className="group flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition-all duration-150 hover:border-[#58a6ff]/40 hover:-translate-y-0.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#21262d] text-[#58a6ff]">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e6edf3]">{hub.label}</p>
                <p className="mt-0.5 text-xs text-[#8b949e]">{hub.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
