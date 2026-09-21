import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Play } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { OPS } from "@/lib/toolkit/ops";
import { TOOL_SECTION_ORDER, TOOL_BY_SLUG, toolsInSection, type DeclarativeTool } from "@/lib/toolkit/catalog";

/**
 * ToolRunner — the single UI behind every declarative tool. It reads the tool
 * definition, renders its options and input box, then calls the matching
 * operation in lib/toolkit/ops. Some ops are async (Web Crypto), so the run
 * function always awaits.
 */
export function ToolRunner({ tool }: { tool: DeclarativeTool }) {
  const [input, setInput] = useState(tool.sample ?? "");
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((tool.options ?? []).map((o) => [o.key, o.values[0]![0]])),
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const op = OPS[tool.op];

  const run = useMemo(
    () =>
      async (value: string, opts: Record<string, string>) => {
        if (!op) {
          setError(`No implementation registered for "${tool.op}".`);
          return;
        }
        setRunning(true);
        setError("");
        try {
          const result = await op(value, opts);
          setOutput(result);
        } catch (e) {
          setError((e as Error).message);
          setOutput("");
        } finally {
          setRunning(false);
        }
      },
    [op, tool.op],
  );

  // run once on mount so the tool never looks broken
  useEffect(() => {
    void run(tool.sample ?? "", Object.fromEntries((tool.options ?? []).map((o) => [o.key, o.values[0]![0]])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.slug]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — the text is selectable anyway */
    }
  };

  const section = TOOL_SECTION_ORDER.find((s) => s.title === tool.section);
  const related = toolsInSection(tool.section)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 6);

  return (
    <AppShell wide title={tool.name}>
      <header className="page-enter pt-2">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> All tools
        </Link>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-[28px]">{tool.icon}</span>
          {tool.name}
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted-foreground">{tool.desc}</p>
        <p className="mt-1 text-[11.5px] text-muted-foreground/85">
          {section ? `${section.icon} ${tool.section} · ` : ""}Runs entirely in your browser — nothing is uploaded.
        </p>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Input</h2>
            {!tool.noInput && (
              <button
                type="button"
                onClick={() => setInput(tool.sample ?? "")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Reset sample
              </button>
            )}
          </div>

          {!tool.noInput && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder={tool.placeholder ?? "Paste your text here…"}
              className="mt-2 h-52 w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-[12.5px] leading-relaxed text-foreground outline-none focus:border-primary/60"
            />
          )}

          {tool.noInput && (
            <p className="mt-2 text-[13px] text-muted-foreground">
              This tool needs no input — pick your options and hit run.
            </p>
          )}

          {tool.options && tool.options.length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {tool.options.map((o) => (
                <label key={o.key} className="block">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{o.label}</span>
                  <select
                    value={options[o.key] ?? o.values[0]![0]}
                    onChange={(e) => setOptions((prev) => ({ ...prev, [o.key]: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[12.5px] text-foreground outline-none focus:border-primary/60"
                  >
                    {o.values.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => void run(input, options)}
            disabled={running}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Play className="size-3.5" aria-hidden /> {running ? "Working…" : "Run"}
          </button>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Result</h2>
            {output && (
              <button
                type="button"
                onClick={() => void copy()}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {error ? (
            <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-[12.5px] text-red-300">{error}</p>
          ) : (
            <pre className="mt-2 h-52 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 font-mono text-[12.5px] leading-relaxed text-foreground">
              {output || "—"}
            </pre>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
            <span>{section?.icon}</span> More in {tool.section}
          </h2>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                to={`/tools/${t.slug}` as string}
                className="flex items-start gap-3 rounded-[10px] border border-border bg-surface p-3.5 transition-colors hover:border-primary/40"
              >
                <span className="text-[20px]">{t.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-foreground">{t.name}</span>
                  <span className="mt-0.5 block text-[12px] text-muted-foreground line-clamp-2">{t.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

/** Used by the dynamic route when a slug does not match any tool. */
export function ToolNotFound({ slug }: { slug: string }) {
  const suggestions = toolsInSection("Data & Code").slice(0, 3);
  return (
    <AppShell wide title="Tool not found">
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-[40px]">🧭</p>
        <h1 className="mt-3 text-xl font-bold text-foreground">No tool called “{slug}”</h1>
        <p className="mt-2 text-[13.5px] text-muted-foreground">
          That link is broken or the tool has been renamed. Everything we ship is listed on the tools page.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/tools" className="rounded-lg bg-primary px-4 py-2 text-[12.5px] font-bold text-background">
            Browse all tools
          </Link>
          {suggestions.map((t) => (
            <Link
              key={t.slug}
              to={`/tools/${t.slug}` as string}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-[12.5px] font-semibold text-foreground"
            >
              {t.icon} {t.name}
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function toolExists(slug: string): boolean {
  return TOOL_BY_SLUG.has(slug);
}
