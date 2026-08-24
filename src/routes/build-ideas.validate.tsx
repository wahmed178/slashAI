import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/library/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { validateIdea } from "@/lib/build-ideas.functions";
import { saveValidation } from "@/hooks/use-build-ideas";

export const Route = createFileRoute("/build-ideas/validate")({
  head: () => ({
    meta: [
      { title: "Idea validator — score your startup idea in seconds | SlashAI" },
      {
        name: "description",
        content:
          "Describe your idea and get a structured read on problem clarity, competition, monetization potential, build difficulty and differentiation.",
      },
      { property: "og:title", content: "Idea Validator — SlashAI" },
      {
        property: "og:description",
        content: "A structured second opinion on your idea before you spend a weekend building it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ValidatePage,
});

interface Validation {
  problemClarity: { score: number; notes: string };
  targetCustomer: { customer: string; notes: string };
  competition: { level: string; notes: string };
  monetization: { score: number; notes: string };
  buildDifficulty: { score: number; notes: string };
  acquisitionDifficulty: { score: number; notes: string };
  differentiation: string[];
  overallScore: number;
  recommendation: string;
  reason: string;
}

function ScoreCard({ title, score, notes }: { title: string; score: number; notes: string }) {
  return (
    <div className="panel rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="text-lg font-black text-primary">{score}/10</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{notes}</p>
    </div>
  );
}

function ValidatePage() {
  const run = useServerFn(validateIdea);
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<Validation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await run({ data: { idea: idea.trim() } });
      const parsed = JSON.parse(res.json.replace(/^```json\s*|```$/g, "").trim()) as Validation;
      setResult(parsed);
    } catch (e) {
      setError(
        e instanceof Error && e.message.length < 160
          ? e.message
          : "Could not analyse that idea. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      hideHeaderSearch
      title="Idea validator"
      back={{ to: "/build-ideas", label: "Build Ideas" }}
    >
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Sparkles className="size-6 text-primary" aria-hidden /> Idea validator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your idea in a few sentences — the problem, who it&apos;s for, and how you&apos;d
          charge. You&apos;ll get a structured read before you spend a weekend on it.
        </p>
      </header>

      <div className="panel mt-4 space-y-3 rounded-xl p-4">
        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={6}
          placeholder="A tool that watches a freelancer's invoices and chases late payers automatically over email and WhatsApp…"
          aria-label="Describe your idea"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => void submit()} disabled={loading || idea.trim().length < 20}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Validate idea
          </Button>
          <span className="text-xs text-muted-foreground">
            {idea.trim().length < 20 ? "Add a little more detail (20+ characters)." : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="panel space-y-2 rounded-xl p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="panel mt-4 space-y-3 rounded-xl p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="size-4 text-primary" aria-hidden /> {error}
          </p>
          <Button variant="secondary" size="sm" onClick={() => void submit()}>
            Try again
          </Button>
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-4">
          <div className="panel flex flex-col gap-2 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Overall opportunity
              </p>
              <p className="text-3xl font-black text-foreground">{result.overallScore}/10</p>
            </div>
            <div className="sm:text-right">
              <Badge variant="secondary">{result.recommendation}</Badge>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{result.reason}</p>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <ScoreCard
              title="Problem clarity"
              score={result.problemClarity.score}
              notes={result.problemClarity.notes}
            />
            <ScoreCard
              title="Monetization potential"
              score={result.monetization.score}
              notes={result.monetization.notes}
            />
            <ScoreCard
              title="Build difficulty"
              score={result.buildDifficulty.score}
              notes={result.buildDifficulty.notes}
            />
            <ScoreCard
              title="Acquisition difficulty"
              score={result.acquisitionDifficulty.score}
              notes={result.acquisitionDifficulty.notes}
            />
            <div className="panel rounded-xl p-4">
              <h3 className="text-sm font-bold text-foreground">Target customer</h3>
              <p className="mt-1 text-sm font-medium text-primary">{result.targetCustomer.customer}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.targetCustomer.notes}</p>
            </div>
            <div className="panel rounded-xl p-4">
              <h3 className="text-sm font-bold text-foreground">Competition</h3>
              <p className="mt-1 text-sm font-medium text-primary">{result.competition.level}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.competition.notes}</p>
            </div>
          </div>

          <div className="panel rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground">Differentiation opportunities</h3>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              {result.differentiation.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                saveValidation({
                  id: `val-${Date.now()}`,
                  input: idea.trim(),
                  result,
                  createdAt: new Date().toISOString(),
                });
                toast.success("Saved to My projects");
              }}
            >
              Save this analysis
            </Button>
            <p className="text-xs text-muted-foreground">
              AI-generated analysis. Not guaranteed market research.
            </p>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
