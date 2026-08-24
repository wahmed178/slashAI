import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BuildIdea } from "@/lib/build-ideas-types";

export function IdeaScore({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
      <Gauge className="size-3.5" aria-hidden />
      {score}/10
    </span>
  );
}

export function IdeaCard({
  idea,
  saved,
  onToggleSave,
}: {
  idea: BuildIdea;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="panel group flex flex-col gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-tight text-foreground">{idea.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="-mt-1 -mr-1 shrink-0"
          aria-label={saved ? `Remove ${idea.title} from saved ideas` : `Save ${idea.title}`}
          onClick={() => onToggleSave(idea.id)}
        >
          {saved ? (
            <BookmarkCheck className="size-4 text-primary" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{idea.shortDescription}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{idea.category}</Badge>
        <Badge variant="outline">{idea.difficulty}</Badge>
        <Badge variant="outline">{idea.businessModel}</Badge>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <IdeaScore score={idea.opportunityScore} />
        <Button asChild size="sm">
          <Link to="/build-ideas/$slug" params={{ slug: idea.slug }}>
            View idea
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function IdeaCardSkeleton() {
  return (
    <div className="panel flex flex-col gap-3 rounded-xl p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
