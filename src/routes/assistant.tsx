import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Check, Copy, ListChecks, Plus, Send, Trash2, User } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { categoryIcon } from "@/components/library/icons";
import { resolveIntent, type IntentResult } from "@/lib/intent";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "SlashAI assistant — workflows and tasks from one question" },
      {
        name: "description",
        content:
          "Ask in plain words and the SlashAI assistant answers from inside the app: a step-by-step workflow, the right commands, a copy-ready prompt and tasks you can tick off.",
      },
      { property: "og:title", content: "SlashAI assistant — workflows and tasks" },
      {
        property: "og:description",
        content: "An offline-friendly in-app bot that plans the work and tracks it for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type TaskStatus = "todo" | "doing" | "done";

interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: string;
}

interface Turn {
  id: string;
  question: string;
  result: IntentResult;
}

const TASKS_KEY = "slashai.tasks.v1";
const SHORTCUTS = [
  "plan my week around 3 priorities",
  "help me study for an exam in 5 days",
  "write a launch post for my app",
  "clean up and upscale old photos",
  "find free tools for video editing",
];

const STATUS_ORDER: TaskStatus[] = ["todo", "doing", "done"];
const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  doing: "In progress",
  done: "Done",
};

/** Tolerates the pre-1.5 `{ done: boolean }` shape so saved tasks survive. */
function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TASKS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, i) => {
      const t = item as Partial<Task> & { done?: boolean };
      return {
        id: t.id ?? `legacy-${i}`,
        text: String(t.text ?? ""),
        status: t.status ?? (t.done ? "done" : "todo"),
        createdAt: t.createdAt ?? new Date().toISOString(),
      };
    });
  } catch {
    return [];
  }
}

/** Markdown export used for both copy-to-clipboard and file download. */
function workflowMarkdown(turn: Turn): string {
  const { result, question } = turn;
  const lines = [
    `# Workflow — ${question}`,
    "",
    "## Steps",
    ...result.steps.map((s, i) => `${i + 1}. ${s}`),
  ];
  if (result.commands.length > 0) {
    lines.push("", "## Commands", ...result.commands.slice(0, 8).map((c) => `- ${c.command} — ${c.title}`));
  }
  if (result.features.length > 0) {
    lines.push("", "## In-app features", ...result.features.slice(0, 6).map((f) => `- ${f.feature.label} (${f.feature.to})`));
  }
  lines.push("", "## Prompt", "```", result.prompt, "```", "", "_Generated with SlashAI_");
  return lines.join("\n");
}

function download(filename: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "workflow";

function AssistantPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDraft, setTaskDraft] = useState("");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const threadEnd = useRef<HTMLDivElement>(null);

  useEffect(() => setTasks(loadTasks()), []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length]);

  const open = useMemo(() => tasks.filter((t) => t.status !== "done").length, [tasks]);
  const visibleTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter],
  );

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    feedback("tap");
    setTurns((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, question: q, result: resolveIntent(q) },
    ]);
    setDraft("");
  };

  const addTask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    feedback("tap");
    setTasks((prev) => [
      { id: `${Date.now()}-${prev.length}`, text: t, status: "todo", createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const cycleStatus = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = STATUS_ORDER[(STATUS_ORDER.indexOf(t.status) + 1) % 3]!;
        feedback(next === "done" ? "win" : "tap");
        return { ...t, status: next };
      }),
    );

  /** Reorder within the full list, using the item's real index. */
  const move = (id: string, dir: -1 | 1) =>
    setTasks((prev) => {
      const i = prev.findIndex((t) => t.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      feedback("win");
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const exportTasks = () => {
    if (tasks.length === 0) return;
    const body = [
      "# SlashAI tasks",
      "",
      ...tasks.map(
        (t) => `- [${t.status === "done" ? "x" : " "}] ${t.text} _(${STATUS_LABEL[t.status]})_`,
      ),
    ].join("\n");
    download("slashai-tasks.md", body);
    feedback("win");
  };


  return (
    <AppShell wide hideHeaderSearch title="Assistant">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          In-app assistant
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          It answers from inside SlashAI — a workflow, the right commands, a prompt to copy, and
          tasks you can save. No account, no credits, works offline.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="glass min-h-64 space-y-4 rounded-2xl p-3 sm:p-4">
            {turns.length === 0 && (
              <div className="px-1 py-6 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-accent text-primary">
                  <Bot className="size-5" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">Ask me anything</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  Try a shortcut below, or describe the job in your own words.
                </p>
              </div>
            )}

            {turns.map((turn) => (
              <article key={turn.id} className="space-y-3">
                <p className="ml-auto flex w-fit max-w-[85%] items-center gap-2 rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                  <User className="size-3.5 shrink-0 opacity-80" aria-hidden />
                  {turn.question}
                </p>

                <div className="rounded-2xl rounded-bl-sm border border-border bg-surface p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Bot className="size-3.5" aria-hidden /> Here's the workflow
                  </p>

                  <ol className="mt-2.5 space-y-2">
                    {turn.result.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-accent text-[11px] font-semibold text-primary">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">{step}</span>
                        <button
                          type="button"
                          aria-label={`Save step ${i + 1} as a task`}
                          onClick={() => addTask(step)}
                          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>

                  {turn.result.features.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {turn.result.features.slice(0, 4).map(({ feature }) => {
                        const Icon = categoryIcon(feature.icon);
                        return (
                          <Link
                            key={feature.id}
                            to={feature.to as never}
                            className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50"
                          >
                            <Icon className="size-3.5 text-primary" aria-hidden /> {feature.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {turn.result.commands.length > 0 && (
                    <div className="mt-3.5">
                      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        Commands to use
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {turn.result.commands.slice(0, 5).map((c) => (
                          <Link
                            key={c.id}
                            to="/c/$slug"
                            params={{ slug: c.id }}
                            className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11.5px] text-foreground hover:border-primary/50"
                          >
                            {c.command}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={copied === turn.id ? "secondary" : "default"}
                      className="gap-1.5"
                      onClick={() => void copy(turn.id, turn.result.prompt)}
                    >
                      {copied === turn.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied === turn.id ? "Copied" : "Copy prompt"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => turn.result.steps.forEach((s) => addTask(s))}
                    >
                      <ListChecks className="size-4" /> Save all as tasks
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/find" search={{ q: turn.question }}>
                        Open full shortlist
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            <div ref={threadEnd} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Ask the assistant"
              placeholder="What are you trying to get done?"
              className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
            />
            <Button type="submit" className="min-h-12 gap-1.5">
              <Send className="size-4" /> Ask
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {SHORTCUTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <ListChecks className="size-4 text-primary" aria-hidden /> Tasks
              </h2>
              <span className="text-xs text-muted-foreground">{open} open</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask(taskDraft);
                setTaskDraft("");
              }}
              className="mt-3 flex gap-2"
            >
              <input
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                aria-label="New task"
                placeholder="Add a task…"
                className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              />
              <Button type="submit" size="icon" aria-label="Add task" className="size-10">
                <Plus className="size-4" />
              </Button>
            </form>

            <ul className="mt-3 space-y-1.5">
              {tasks.length === 0 && (
                <li className="py-4 text-center text-sm text-muted-foreground">
                  No tasks yet — save a workflow step to start.
                </li>
              )}
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-2 rounded-lg border border-border bg-surface p-2"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={t.done}
                    aria-label={t.done ? `Mark "${t.text}" as open` : `Complete "${t.text}"`}
                    onClick={() => {
                      feedback(t.done ? "tap" : "win");
                      setTasks((prev) =>
                        prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                      );
                    }}
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                      t.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-transparent hover:border-primary/60",
                    )}
                  >
                    <Check className="size-3.5" />
                  </button>
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-sm",
                      t.done ? "text-muted-foreground line-through" : "text-foreground",
                    )}
                  >
                    {t.text}
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete "${t.text}"`}
                    onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {tasks.some((t) => t.done) && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
              >
                Clear completed
              </Button>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
