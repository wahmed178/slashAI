import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/library/AppShell";
import { Markdown } from "@/components/library/Markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runGenerator } from "@/lib/generators.functions";
import { FREE_DAILY_RUNS, GENERATORS, getGenerator, recordRun, readRunCount } from "@/lib/generators";

export const Route = createFileRoute("/generators/$id")({
  beforeLoad: ({ params }) => {
    if (!getGenerator(params.id)) throw notFound();
  },
  head: ({ params }) => {
    const gen = getGenerator(params.id);
    return {
      meta: [
        { title: `${gen ? gen.title : "Generator"} — SlashAI` },
        { name: "description", content: gen ? gen.tagline : "AI generator" },
      ],
    };
  },
  component: GeneratorPage,
});

function GeneratorPage() {
  const { id } = Route.useParams();
  const gen = getGenerator(id)!;
  const run = useServerFn(runGenerator);

  const initial = useMemo(() => {
    const out: Record<string, string> = {};
    for (const f of gen.fields) out[f.name] = f.type === "select" ? (f.options?.[0] ?? "") : "";
    return out;
  }, [gen]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = gen.fields.every((f) => !f.required || (values[f.name]?.trim().length ?? 0) > 2);

  async function submit() {
    const used = readRunCount();
    if (used >= FREE_DAILY_RUNS) {
      setError(
        `You've used all ${FREE_DAILY_RUNS} free generations today. They reset at midnight UTC.`,
      );
      return;
    }
    setLoading(true);
    setError(null);
    setMarkdown(null);
    try {
      const res = await run({ data: { id, fields: values } });
      setMarkdown(res.markdown);
      recordRun();
    } catch (e) {
      setError(
        e instanceof Error && e.message.length < 160
          ? e.message
          : "Generation failed. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title={gen.title} back={{ to: "/generators", label: "AI Toolkit" }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {gen.emoji}
        </span>
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground">{gen.title}</h1>
          <p className="text-sm text-muted-foreground">{gen.tagline}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {gen.fields.map((f) => (
          <label key={f.name} className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              {f.label}
              {f.required ? <span className="ml-0.5 text-primary">*</span> : null}
            </span>
            {f.type === "textarea" ? (
              <Textarea
                rows={3}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            ) : f.type === "select" ? (
              <Select
                {...(values[f.name] ? { value: values[f.name] } : {})}
                onValueChange={(val) => setValues((v) => ({ ...v, [f.name]: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Choose ${f.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {(f.options ?? []).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            )}
          </label>
        ))}

        <Button onClick={submit} disabled={!valid || loading} className="min-h-11 w-full">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Generating…
            </>
          ) : (
            <>Generate with Claude</>
          )}
        </Button>

        {error ? (
          <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="panel animate-pulse rounded-2xl p-6 text-sm text-muted-foreground">
            Thinking through your brief…
          </div>
        ) : null}

        {markdown ? (
          <section aria-label="Generated result">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                Your draft
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(markdown);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="mr-1.5 size-3.5" aria-hidden /> Copy
              </Button>
            </div>
            <article className="panel mt-2 rounded-2xl p-5">
              <Markdown source={markdown} />
            </article>
          </section>
        ) : null}

        <Link
          to="/generators"
          className="flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> All generators
        </Link>
        <div className="pb-2 text-center text-xs text-muted-foreground">
          {GENERATORS.length} generators · {FREE_DAILY_RUNS} free runs per day
        </div>
      </div>
    </AppShell>
  );
}
