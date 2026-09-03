import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Link2,
  Link2Off,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Workflow as WorkflowIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/library/AppShell";
import { categoryIcon } from "@/components/library/icons";
import {
  CATEGORY_ICONS,
  VERIFIED_TOTAL,
  commandTemplate,
  filterCommands,
  getCommand,
  type SlashCommand,
} from "@/lib/commands";
import { trackInteraction } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "AI Workflows — chain commands — SlashAI" },
      {
        name: "description",
        content:
          "Build a step-by-step AI workflow by chaining SlashAI commands into one copy-ready prompt. Save, reorder and reuse your chains — all on your device.",
      },
      { property: "og:title", content: "AI Workflows — SlashAI" },
      {
        property: "og:description",
        content: "Chain commands into one runnable prompt — no account, free forever.",
      },
    ],
  }),
  component: WorkflowPage,
});

/* ------------------------------- storage -------------------------------- */

interface WorkflowStep {
  commandId: string;
  /** When on, this step consumes the output of the previous step. */
  carry: boolean;
}

interface SavedWorkflow {
  id: string;
  name: string;
  updatedAt: number;
  steps: WorkflowStep[];
}

const SAVED_KEY = "slashai-workflows";
const ACTIVE_KEY = "slashai-workflow-active";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readSaved(): SavedWorkflow[] {
  const list = readJSON<SavedWorkflow[]>(SAVED_KEY, []);
  return Array.isArray(list)
    ? list
        .filter(
          (w): w is SavedWorkflow =>
            Boolean(w) && typeof w.id === "string" && typeof w.name === "string" && Array.isArray(w.steps),
        )
        .map((w) => ({
          ...w,
          steps: w.steps.filter(
            (s): s is WorkflowStep => Boolean(s) && typeof s.commandId === "string",
          ),
        }))
    : [];
}

function writeSaved(list: SavedWorkflow[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch {
    /* storage full — saving is optional */
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ----------------------------- prompt builder ---------------------------- */

/** One step's block inside the chained prompt. */
function stepBlock(cmd: SlashCommand, no: number, total: number, carry: boolean, prev?: SlashCommand) {
  const inputLine = carry && prev
    ? `Input: <paste the OUTPUT from STEP ${no - 1} (${prev.command}) here — the previous step's final answer>`
    : "Input: <paste your input here>";
  return [
    `STEP ${no} of ${total} — ${cmd.command}  [${cmd.category}]`,
    `# ${cmd.title}`,
    `What it does: ${cmd.description}`,
    `How to use: ${cmd.howToUse}`,
    "",
    inputLine,
    "Goal: <what a great result looks like>",
    "Constraints: <tone, length, format>",
    "",
    "--- Example of this step ---",
    cmd.example,
  ].join("\n");
}

function buildChainPrompt(name: string, resolved: { cmd: SlashCommand; carry: boolean }[]) {
  if (resolved.length === 0) return "";
  const total = resolved.length;
  const blocks = resolved.map(({ cmd, carry }, i) => {
    const prev = i > 0 ? resolved[i - 1]!.cmd : undefined;
    return stepBlock(cmd, i + 1, total, carry, prev);
  });
  return [
    `WORKFLOW — ${name.trim() || "Untitled chain"} (${total} step${total > 1 ? "s" : ""})`,
    "",
    "Run this as ONE continuous session in your AI chat: finish STEP 1 first, then let every later step build on the output you already got. Never restart the conversation between steps.",
    "",
    blocks.join("\n\n"),
    "",
    "---",
    "Built with SlashAI AI Workflows",
  ].join("\n");
}

/* --------------------------------- page --------------------------------- */

const QUICK_QUERIES = ["summarize", "plan", "write", "research", "rewrite", "email", "brainstorm", "code"];

const EMPTY: WorkflowStep[] = [];

function WorkflowPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>(EMPTY);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<SavedWorkflow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState("");
  const [copiedChain, setCopiedChain] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);

  // hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const active = readJSON<{ name: string; steps: WorkflowStep[] } | null>(ACTIVE_KEY, null);
    if (active && Array.isArray(active.steps)) {
      setName(active.name ?? "");
      setSteps(
        active.steps
          .filter((s): s is WorkflowStep => Boolean(s) && typeof s.commandId === "string")
          .map((s) => ({ commandId: s.commandId, carry: Boolean(s.carry) })),
      );
    }
    setSaved(readSaved());
    setHydrated(true);
  }, []);

  // autosave the working chain so a reload never loses it
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(ACTIVE_KEY, JSON.stringify({ name, steps }));
    } catch {
      /* ignore */
    }
  }, [name, steps, hydrated]);

  const resolved = useMemo(
    () =>
      steps
        .map((s, i) => ({ cmd: getCommand(s.commandId), carry: s.carry, index: i }))
        .filter((x): x is { cmd: SlashCommand; carry: boolean; index: number } => Boolean(x.cmd)),
    [steps],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const list = filterCommands({
      q: query,
      category: "all",
      type: "all",
      difficulty: "all",
      sort: "relevance",
      onlyFavorites: false,
      favorites: [],
    });
    return list.slice(0, 14);
  }, [query]);

  const addCommand = (cmd: SlashCommand) => {
    setSteps((prev) => [...prev, { commandId: cmd.id, carry: false }]);
    trackInteraction(cmd.id, "open", query);
    toast(`${cmd.command} added to the chain`);
  };

  const removeAt = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target]!, next[i]!];
      return next;
    });
  };

  const toggleCarry = (i: number) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, carry: i > 0 ? !s.carry : false } : s)),
    );
  };

  const copyText = async (text: string, what: string, key?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast(`${what} copied`);
      if (key === "chain") {
        setCopiedChain(true);
        window.setTimeout(() => setCopiedChain(false), 1600);
      } else if (key) {
        setCopiedId(key);
        window.setTimeout(() => setCopiedId(null), 1600);
      }
    } catch {
      toast("Couldn't copy — clipboard not available");
    }
  };

  const saveWorkflow = () => {
    if (steps.length === 0) {
      toast("Add at least one command first");
      return;
    }
    const title = name.trim() || `Workflow — ${resolved[0]?.cmd.command ?? ""}`.trim();
    const wf: SavedWorkflow = { id: activeId ?? uid(), name: title, updatedAt: Date.now(), steps };
    const list = [...readSaved().filter((w) => w.id !== wf.id), wf].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
    writeSaved(list);
    setSaved(list);
    setActiveId(wf.id);
    setName(title);
    toast("Workflow saved on this device");
  };

  const loadWorkflow = (wf: SavedWorkflow) => {
    setSteps(wf.steps.map((s) => ({ commandId: s.commandId, carry: Boolean(s.carry) })));
    setName(wf.name);
    setActiveId(wf.id);
    setSaved(readSaved());
    toast(`Loaded “${wf.name}”`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteWorkflow = (id: string) => {
    const list = readSaved().filter((w) => w.id !== id);
    writeSaved(list);
    setSaved(list);
    if (activeId === id) setActiveId(null);
    toast("Workflow deleted");
  };

  const clearChain = () => {
    setSteps([]);
    setActiveId(null);
    setName("");
    toast("Chain cleared");
  };

  const chainText = useMemo(
    () => buildChainPrompt(name, resolved.map((r) => ({ cmd: r.cmd, carry: r.carry }))),
    [name, resolved],
  );

  const charCount = chainText.length;
  const tokenEstimate = Math.max(1, Math.round(charCount / 4));

  const inChainCount = (id: string) => steps.filter((s) => s.commandId === id).length;

  const handleDrop = (toIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === toIndex) return;
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <AppShell wide title="AI Workflows">
      <header className="pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
            <WorkflowIcon className="size-6 text-primary" aria-hidden /> AI Workflows
          </h1>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            New
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Chain SlashAI commands into a single runnable prompt. Pick the steps, set the order, and let
          each step build on the previous one — then copy the whole workflow into any AI chat.
        </p>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* ─────── Step picker ─────── */}
        <section className="panel rounded-xl p-3 sm:p-4 lg:sticky lg:top-4 lg:self-start">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <Search className="size-3.5 text-primary" aria-hidden /> Add a step
          </h2>

          <div className="mt-2 flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-primary/60">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder={`Search ${VERIFIED_TOTAL.toLocaleString()} commands…`}
              className="w-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {query.trim() ? (
            <ul className="mt-2 flex max-h-[420px] flex-col gap-1 overflow-y-auto pr-0.5">
              {results.length === 0 ? (
                <li className="rounded-lg border border-border bg-surface px-3 py-6 text-center text-xs text-muted-foreground">
                  No command matches “{query}”.
                </li>
              ) : (
                results.map((cmd) => {
                  const Icon = categoryIcon(CATEGORY_ICONS[cmd.category]);
                  const inChain = inChainCount(cmd.id);
                  return (
                    <li key={cmd.id}>
                      <button
                        type="button"
                        onClick={() => addCommand(cmd)}
                        className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-mono text-[13px] font-semibold text-foreground">
                            {cmd.command}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {cmd.title} · {cmd.category}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors",
                            inChain > 0
                              ? "bg-primary/15 text-primary"
                              : "bg-surface-elevated text-muted-foreground",
                          )}
                        >
                          {inChain > 0 ? (
                            <span className="text-[11px] font-bold">{inChain}×</span>
                          ) : (
                            <Plus className="size-4" aria-hidden />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          ) : (
            <div className="mt-3">
              <p className="text-[11px] text-muted-foreground">Try one of these:</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {QUICK_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-border bg-surface/60 p-4 text-center">
                <Sparkles className="mx-auto size-5 text-primary" aria-hidden />
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Search for what you want each step to do — <em>summarize</em>, <em>rewrite</em>,{" "}
                  <em>plan</em>… — then tap a result to add it.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ─────── Workflow canvas ─────── */}
        <section className="min-w-0">
          {/* name + actions */}
          <div className="panel rounded-xl p-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name this workflow (e.g. Research → Draft → Polish)"
                className="h-10 min-w-[180px] flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => void copyText(chainText, "Workflow prompt", "chain")}
                disabled={resolved.length === 0}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copiedChain ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span className="hidden sm:inline">{copiedChain ? "Copied!" : "Copy chain prompt"}</span>
                <span className="sm:hidden">Copy</span>
              </button>
              <button
                type="button"
                onClick={saveWorkflow}
                disabled={steps.length === 0}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save className="size-4" /> Save
              </button>
              {steps.length > 0 && (
                <button
                  type="button"
                  onClick={clearChain}
                  className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:text-red-400"
                >
                  <Trash2 className="size-4" /> Clear
                </button>
              )}
            </div>

            {steps.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                <span>
                  <strong className="text-foreground">{steps.length}</strong> step{steps.length > 1 ? "s" : ""}
                </span>
                <span>
                  ≈ <strong className="text-foreground">{charCount.toLocaleString()}</strong> characters · ~
                  <strong className="text-foreground">{tokenEstimate.toLocaleString()}</strong> tokens
                </span>
                <span className="hidden sm:inline">Drag cards or use ↑ ↓ to reorder</span>
              </div>
            )}

            {saved.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2">
                <span className="text-[11px] text-muted-foreground">Saved:</span>
                {saved.map((wf) => (
                  <span
                    key={wf.id}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                      activeId === wf.id
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-surface text-muted-foreground",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => loadWorkflow(wf)}
                      className="font-medium hover:text-foreground"
                    >
                      {wf.name}
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${wf.name}`}
                      onClick={() => deleteWorkflow(wf.id)}
                      className="rounded-full p-0.5 hover:bg-accent hover:text-red-400"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* steps */}
          {resolved.length === 0 ? (
            <div className="panel mt-4 flex flex-col items-center rounded-xl px-6 py-14 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <WorkflowIcon className="size-7" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-bold text-foreground">Build your first chain</h2>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                Search for a command on the left and tap it to add a step. Steps run top to bottom —
                add “uses previous output” when a step needs the result of the one before it.
              </p>
              <div className="mt-4 flex gap-1.5">
                {["STEP 1", "STEP 2", "STEP 3"].map((s, i) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {s}
                    {i < 2 && <ArrowDown className="size-3 text-primary" aria-hidden />}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <ol className="mt-4 flex flex-col gap-2">
              {resolved.map(({ cmd, carry, index }, i) => {
                const Icon = categoryIcon(CATEGORY_ICONS[cmd.category]);
                const prevCmd = i > 0 ? resolved[i - 1]!.cmd : undefined;
                return (
                  <li
                    key={`${cmd.id}-${index}`}
                    draggable
                    onDragStart={(e) => {
                      dragIndex.current = i;
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(i);
                    }}
                    className="panel group flex items-start gap-3 rounded-xl p-3 transition-colors hover:border-primary/40 sm:items-center"
                  >
                    {/* number + grip */}
                    <div className="flex shrink-0 flex-col items-center gap-1 self-center sm:flex-row sm:gap-0.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 font-mono text-[12px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="cursor-grab text-muted-foreground/70 transition-colors group-hover:text-foreground sm:ml-1 active:cursor-grabbing">
                        <GripVertical className="size-4" aria-hidden />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="truncate font-mono text-sm font-bold text-primary">
                          {cmd.command}
                        </span>
                        <span className="rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {cmd.category}
                        </span>
                        {carry && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            <Link2 className="size-3" aria-hidden /> feeds from step {i}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{cmd.description}</p>
                      {prevCmd && (
                        <p className="mt-1 line-clamp-1 font-mono text-[10px] text-muted-foreground/70">
                          ↓ {prevCmd.command}
                        </p>
                      )}

                      {/* carry toggle */}
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleCarry(i)}
                          aria-pressed={carry}
                          className={cn(
                            "mt-1.5 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                            carry
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border bg-surface text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {carry ? (
                            <Link2 className="size-3.5" aria-hidden />
                          ) : (
                            <Link2Off className="size-3.5" aria-hidden />
                          )}
                          {carry ? "Uses" : "Use"} output of step {i} as its input
                        </button>
                      )}
                    </div>

                    {/* controls */}
                    <div className="flex shrink-0 items-center gap-0.5 self-center">
                      <span className="hidden sm:block">
                        <Icon className="size-4 text-muted-foreground" aria-hidden />
                      </span>
                      <div className="ml-1 flex flex-col sm:flex-row">
                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={i === resolved.length - 1}
                          onClick={() => move(i, 1)}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Copy ${cmd.command} template`}
                        onClick={() => {
                          void copyText(commandTemplate(cmd), `${cmd.command} template`, cmd.id);
                          trackInteraction(cmd.id, "copy");
                        }}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {copiedId === cmd.id ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove step ${i + 1}`}
                        onClick={() => removeAt(i)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {/* output footer */}
          {resolved.length > 0 && (
            <div className="panel mt-4 rounded-xl p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">How it works:</span> copy the chain
                  prompt, paste it into any AI chat, then complete each step in order — steps marked{" "}
                  <span className="text-primary">“uses output”</span> expect you to paste the previous
                  answer where the prompt says.
                </p>
                <button
                  type="button"
                  onClick={() => void copyText(chainText, "Workflow prompt", "chain")}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
                >
                  {copiedChain ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copiedChain ? "Copied!" : "Copy chain prompt"}
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Everything stays on this device — no account, no uploads.{" "}
            <Link to="/search" className="text-primary hover:underline">
              Or browse all {VERIFIED_TOTAL.toLocaleString()} commands →
            </Link>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
