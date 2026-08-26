import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Route as RouteIcon, Timer, Users } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  ALL_ROADMAPS as ROADMAPS,
  ROADMAP_TOTAL,
  type Roadmap,
} from "@/lib/roadmaps";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmaps")({
  head: () => ({
    meta: [
      { title: `Founder roadmaps — ${ROADMAP_TOTAL} visual paths | SlashAI` },
      {
        name: "description",
        content:
          "Step-by-step founder roadmaps: validate an idea in 14 days, ship an MVP in 30, get your first 100 users, learn AI engineering, prep fundraising and launch like a pro.",
      },
      { property: "og:title", content: "Founder Roadmaps — SlashAI" },
      {
        property: "og:description",
        content: "Visual, phase-by-phase paths for the journeys every builder repeats.",
      },
    ],
  }),
  component: RoadmapsPage,
});

function Meta({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

function Timeline({ roadmap }: { roadmap: Roadmap }) {
  return (
    <ol className="mt-4 space-y-5 border-l border-border/70 pl-4">
      {roadmap.phases.map((phase) => (
        <li key={phase.name} className="relative">
          <span
            aria-hidden
            className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background"
          />
          <h3 className="text-sm font-bold tracking-wide text-primary uppercase">{phase.name}</h3>
          <ul className="mt-2 space-y-2.5">
            {phase.steps.map((step, i) => (
              <li key={step.title} className="flex gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function RoadmapsPage() {
  const [openId, setOpenId] = useState<string | null>(ROADMAPS[0]?.id ?? null);

  return (
    <AppShell hideHeaderSearch title="Roadmaps" wide>
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <RouteIcon className="size-6 text-primary" aria-hidden />
          Founder Roadmaps
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {ROADMAP_TOTAL} visual paths for the journeys every builder repeats — pick one, follow the
          phases.
        </p>
      </header>

      <div className="mt-5 space-y-3 pb-8">
        {ROADMAPS.map((r) => {
          const open = openId === r.id;
          const steps = r.phases.reduce((n, p) => n + p.steps.length, 0);
          return (
            <article key={r.id} className="panel overflow-hidden rounded-2xl">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => {
                  feedback("tap");
                  setOpenId(open ? null : r.id);
                }}
                className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-foreground">{r.title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.tagline}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Meta icon={Timer}>{r.duration}</Meta>
                    <Meta icon={Users}>{r.audience}</Meta>
                    <Meta icon={RouteIcon}>
                      {r.phases.length} phases · {steps} steps
                    </Meta>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/60 px-4 pb-4 pt-1">
                    <Timeline roadmap={r} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
