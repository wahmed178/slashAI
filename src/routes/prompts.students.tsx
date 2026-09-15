import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Copy, GraduationCap, Search } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { COMMANDS, type SlashCommand } from "@/lib/commands";
import { useCommandActions } from "@/hooks/use-command-actions";

export const Route = createFileRoute("/prompts/students")({
  head: () => ({
    meta: [
      { title: "Best Free ChatGPT Prompts for Students (2026) | SlashAI" },
      {
        name: "description",
        content:
          "Copy-ready AI prompts for students: study plans, active recall quizzes, essay outlines, exam prep and research help - free, no account, works in ChatGPT, Claude and Gemini.",
      },
    ],
  }),
  component: StudentPromptsPage,
});

const CATEGORIES = ["Learning & Education", "Writing & Communication", "Research & Knowledge"];

const PICKS: Record<string, string[]> = {
  "Learning & Education": ["study-plan", "explain-like-im-12", "active-recall", "feynman-technique", "exam-prep"],
  "Writing & Communication": ["essay-outline", "summarize", "improve-writing", "citation-formatter"],
  "Research & Knowledge": ["fact-check-topic", "research-notes", "literature-review"],
};

const BLURBS: Record<string, string> = {
  "Learning & Education": "Turn any topic into a study plan, quiz yourself and learn faster",
  "Writing & Communication": "Essay structure, clear writing and fast summaries",
  "Research & Knowledge": "Check facts, organise sources and take better notes",
};

function StudentPromptsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const pool = COMMANDS.filter((c) => c.category === cat);
      const picks = pool.filter((c) => PICKS[cat]?.includes(c.id));
      const rest = pool.filter((c) => !PICKS[cat]?.includes(c.id));
      const ordered = [...picks, ...rest].slice(0, 12);
      return { cat, commands: ordered, total: pool.length };
    }).filter((s) => s.commands.length > 0);
  }, []);

  return (
    <AppShell hideHeaderSearch title="Student Prompts">
      <div className="mx-auto max-w-3xl space-y-8 pt-2 pb-10">
        <header>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <GraduationCap className="size-3" aria-hidden /> For students
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Free AI prompts for studying - ChatGPT, Claude &amp; Gemini
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Study plans, active-recall quizzes, essay outlines, exam prep and
            research help - copy-ready and free. Built for learning, not
            plagiarism: these prompts make AI your tutor, not your ghostwriter.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all study prompts - e.g. quiz me, essay, notes…"
              aria-label="Search study prompts"
              className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {sections.map((s) => (
          <section key={s.cat} aria-labelledby={`sec-${s.cat}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`sec-${s.cat}`} className="text-base font-bold text-foreground">
                {s.cat}
              </h2>
              <Link
                to="/explore/$category"
                params={{ category: s.cat }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                All {s.total} <ArrowRight className="size-3" aria-hidden />
              </Link>
            </div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{BLURBS[s.cat]}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {s.commands.map((c) => (
                <PromptRow key={c.id} cmd={c} />
              ))}
            </ul>
          </section>
        ))}

        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-[13px] text-muted-foreground">
            These are 36 hand-picks - the full library has thousands more.
          </p>
          <Link
            to="/prompts"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
          >
            Browse all prompts <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function PromptRow({ cmd }: { cmd: SlashCommand }) {
  const { copyCommand } = useCommandActions();
  const [copied, setCopied] = useState(false);

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="min-w-0 flex-1">
        <Link
          to="/c/$slug"
          params={{ slug: cmd.id }}
          className="block truncate font-mono text-[13px] font-semibold text-primary hover:underline"
        >
          {cmd.command}
        </Link>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
          {cmd.description}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${cmd.command}`}
        onClick={() => {
          copyCommand(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="mt-0.5 shrink-0 rounded-lg border border-border bg-surface-elevated p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Copy
          aria-hidden
          className={`size-3.5 ${copied ? "text-primary" : ""}`}
        />
      </button>
    </li>
  );
}
