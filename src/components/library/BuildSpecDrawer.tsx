import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown, extractPrompt } from "@/components/library/Markdown";
import { generateSpec } from "@/lib/build-ideas.functions";
import { readSpecCache, writeSpecCache } from "@/hooks/use-build-ideas";
import type { BuildIdea } from "@/lib/build-ideas-types";

export function BuildSpecDrawer({
  idea,
  open,
  onOpenChange,
}: {
  idea: BuildIdea;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const run = useServerFn(generateSpec);
  const [spec, setSpec] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await run({
        data: {
          title: idea.title,
          short: idea.shortDescription,
          problem: idea.problem,
          targetUsers: idea.targetUsers,
          solution: idea.proposedSolution,
          keyFeatures: idea.keyFeatures,
          mvpFeatures: idea.mvpFeatures,
          techStack: idea.techStack,
          businessModel: idea.businessModel,
          buildType: idea.buildType,
        },
      });
      setSpec(res.markdown);
      writeSpecCache(idea.slug, res.markdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the specification.");
    } finally {
      setLoading(false);
    }
  }, [idea, run]);

  useEffect(() => {
    if (!open) return;
    const cached = readSpecCache(idea.slug);
    if (cached) {
      setSpec(cached);
      return;
    }
    if (!spec && !loading) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idea.slug]);

  const prompt = spec ? extractPrompt(spec) : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="text-left">
          <SheetTitle>Build spec — {idea.title}</SheetTitle>
          <SheetDescription>
            A full product specification plus a paste-ready prompt. Generated once, then kept on
            this device so it opens instantly and works offline.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-8">
          {prompt ? (
            <Button
              className="w-full"
              onClick={async () => {
                await navigator.clipboard.writeText(prompt);
                setCopied(true);
                toast.success("Prompt copied — paste it into Lovable");
                setTimeout(() => setCopied(false), 1600);
              }}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              Copy Lovable prompt
            </Button>
          ) : null}

          {loading && !spec ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : null}

          {error ? (
            <div className="panel space-y-3 rounded-xl p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="size-4 text-primary" aria-hidden /> {error}
              </p>
              <Button variant="secondary" size="sm" onClick={() => void load()}>
                Try again
              </Button>
            </div>
          ) : null}

          {spec ? <Markdown source={spec} /> : null}

          {spec ? (
            <Button variant="ghost" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null} Regenerate
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
