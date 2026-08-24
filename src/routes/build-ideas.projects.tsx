import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Trash2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BUILD_IDEAS } from "@/lib/build-ideas";
import {
  PROJECT_STAGES,
  readValidations,
  useIdeaLibrary,
  type ProjectStage,
  type ValidationRecord,
} from "@/hooks/use-build-ideas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build-ideas/projects")({
  head: () => ({
    meta: [
      { title: "My projects — saved ideas and build tracker | SlashAI" },
      {
        name: "description",
        content:
          "Your saved build ideas and projects, tracked from idea to launch with notes — stored on your device, no account needed.",
      },
      { property: "og:title", content: "My projects — SlashAI" },
      {
        property: "og:description",
        content: "Track saved ideas from idea to launch, on-device and offline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { ready, saved, removeSaved, projects, upsertProject, removeProject } = useIdeaLibrary();
  const [validations, setValidations] = useState<ValidationRecord[]>([]);

  useEffect(() => setValidations(readValidations()), []);

  const savedIdeas = BUILD_IDEAS.filter((i) => saved.includes(i.id));

  return (
    <AppShell
      wide
      hideHeaderSearch
      title="My projects"
      back={{ to: "/build-ideas", label: "Build Ideas" }}
    >
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <FolderKanban className="size-6 text-primary" aria-hidden /> My projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything here lives on this device — no login required. It travels with your JSON backup
          from Settings.
        </p>
      </header>

      <section className="mt-6">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Saved ideas ({savedIdeas.length})
        </h2>
        {!ready ? null : savedIdeas.length === 0 ? (
          <div className="panel mt-2 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-foreground">Nothing saved yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the bookmark on any idea to keep it here.
            </p>
            <Button asChild className="mt-4" size="sm" variant="secondary">
              <Link to="/build-ideas">Browse ideas</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {savedIdeas.map((idea) => (
              <div key={idea.id} className="panel flex flex-col gap-2 rounded-xl p-4">
                <Link
                  to="/build-ideas/$slug"
                  params={{ slug: idea.slug }}
                  className="text-sm font-bold text-foreground hover:text-primary"
                >
                  {idea.title}
                </Link>
                <p className="text-xs text-muted-foreground">{idea.shortDescription}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <Badge variant="secondary">{idea.category}</Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        upsertProject({
                          ideaId: idea.id,
                          slug: idea.slug,
                          title: idea.title,
                          stage: "Idea",
                        })
                      }
                    >
                      Track
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${idea.title}`}
                      onClick={() => removeSaved(idea.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Projects ({projects.length})
        </h2>
        {!ready ? null : projects.length === 0 ? (
          <div className="panel mt-2 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-foreground">No projects tracked</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hit “Build this” on an idea, or “Track” on a saved one, to start a tracker.
            </p>
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            {projects.map((project) => (
              <article key={project.ideaId} className="panel rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    to="/build-ideas/$slug"
                    params={{ slug: project.slug }}
                    className="text-sm font-bold text-foreground hover:text-primary"
                  >
                    {project.title}
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove project ${project.title}`}
                    onClick={() => removeProject(project.ideaId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {PROJECT_STAGES.map((stage) => {
                    const current = PROJECT_STAGES.indexOf(project.stage);
                    const index = PROJECT_STAGES.indexOf(stage);
                    const done = index <= current;
                    return (
                      <button
                        key={stage}
                        type="button"
                        aria-pressed={project.stage === stage}
                        onClick={() =>
                          upsertProject({ ideaId: project.ideaId, stage: stage as ProjectStage })
                        }
                        className={cn(
                          "min-h-8 rounded-full border px-3 text-xs font-medium transition-colors",
                          project.stage === stage
                            ? "border-primary bg-primary text-primary-foreground"
                            : done
                              ? "border-primary/40 text-primary"
                              : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  className="mt-3"
                  rows={3}
                  placeholder="Notes — what's next, what's blocked, what you learned…"
                  aria-label={`Notes for ${project.title}`}
                  defaultValue={project.notes}
                  onBlur={(e) => upsertProject({ ideaId: project.ideaId, notes: e.target.value })}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      {validations.length ? (
        <section className="mt-8">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Saved validations ({validations.length})
          </h2>
          <div className="mt-2 space-y-2">
            {validations.map((v) => (
              <div key={v.id} className="panel rounded-xl p-4">
                <p className="text-sm text-foreground">{v.input}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Analysed {new Date(v.createdAt).toLocaleDateString()} · AI-generated analysis, not
                  guaranteed market research.
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
