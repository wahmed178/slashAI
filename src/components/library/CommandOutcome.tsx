/**
 * "How did this land?" — the honest replacement for a community vote counter.
 *
 * The previous version of this widget derived 18-55 upvotes per command from a
 * string hash and labelled them "community counts". SlashAI has no backend, so
 * those numbers were not community counts at all: they were invented, and
 * SlashAI's own rule is that every figure on the site has to be real. So this
 * records what actually happened — the reader's own outcome, on their own
 * device — and says plainly that nobody else can see it.
 *
 * That is a smaller claim than a testimonial wall, and it is the only version
 * of it that would survive a user checking.
 */
import { useEffect, useState } from "react";
import { Check, Pencil, ThumbsUp, Meh, ThumbsDown, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  COMMAND_OUTCOME_HINTS,
  COMMAND_OUTCOME_LABELS,
  getCommandOutcome,
  setCommandOutcome,
  clearCommandOutcome,
  timeAgo,
  UX_CHANGE_EVENT,
  type CommandOutcome,
} from "@/lib/ux";

interface Props {
  commandId: string;
  className?: string;
}

const OPTIONS: { id: CommandOutcome; icon: typeof ThumbsUp; tone: string }[] = [
  { id: "landed", icon: ThumbsUp, tone: "emerald" },
  { id: "partial", icon: Meh, tone: "amber" },
  { id: "miss", icon: ThumbsDown, tone: "rose" },
];

const TONES: Record<string, string> = {
  emerald: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400 hover:border-emerald-500/80",
  amber: "border-amber-500/60 bg-amber-500/15 text-amber-400 hover:border-amber-500/80",
  rose: "border-rose-500/60 bg-rose-500/15 text-rose-400 hover:border-rose-500/80",
};

export function CommandOutcome({ commandId, className }: Props) {
  const [record, setRecord] = useState<ReturnType<typeof getCommandOutcome>>(null);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  // Local state is read after mount only: localStorage does not exist during
  // SSR, and reading it in a useState initialiser would force client-only
  // rendering for this whole route.
  useEffect(() => {
    const sync = () => {
      const current = getCommandOutcome(commandId);
      setRecord(current);
      setNote(current?.note ?? "");
    };
    sync();
    window.addEventListener(UX_CHANGE_EVENT, sync);
    return () => window.removeEventListener(UX_CHANGE_EVENT, sync);
  }, [commandId]);

  const choose = (outcome: CommandOutcome) => {
    setCommandOutcome(commandId, outcome, note);
    setRecord(getCommandOutcome(commandId));
    setOpenNote(false);
    setEditing(false);
    toast.success(`Saved on this device: ${COMMAND_OUTCOME_LABELS[outcome].toLowerCase()}`);
  };

  const saveNote = () => {
    if (!record) return;
    setCommandOutcome(commandId, record.outcome, note);
    setRecord(getCommandOutcome(commandId));
    setEditing(false);
    setOpenNote(false);
  };

  const undo = () => {
    clearCommandOutcome(commandId);
    setRecord(null);
    setNote("");
    toast("Cleared");
  };

  const ChosenIcon = record ? (OPTIONS.find((o) => o.id === record.outcome)?.icon ?? Check) : null;
  const chosenTone = record
    ? (OPTIONS.find((o) => o.id === record.outcome)?.tone ?? "emerald")
    : "";

  return (
    <section
      className={cn("rounded-xl border border-border bg-surface px-4 py-3", className)}
      aria-label="Your feedback on this command"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-semibold tracking-wide text-foreground uppercase">
          How did this land?
        </h4>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <EyeOff className="size-3" aria-hidden />
          Only you see this — stored on this device
        </span>
      </div>

      {record ? (
        <div className="mt-2.5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold",
                TONES[chosenTone],
              )}
            >
              {ChosenIcon && <ChosenIcon className="size-3.5" aria-hidden />}
              {COMMAND_OUTCOME_LABELS[record.outcome]}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {COMMAND_OUTCOME_HINTS[record.outcome]} · {timeAgo(record.at)}
            </span>
          </div>

          {record.note && !editing ? (
            <p className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[13px] text-foreground">
              “{record.note}”
            </p>
          ) : null}

          {openNote && (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={180}
                placeholder="What happened? What would you change about the prompt?"
                className="w-full resize-y rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[13px] text-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={saveNote}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-background hover:bg-primary/90"
                >
                  <Check className="size-3.5" aria-hidden /> Save note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNote(record.note ?? "");
                    setOpenNote(false);
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {note.length}/180
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {!openNote && (
              <button
                type="button"
                onClick={() => setOpenNote(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3" aria-hidden />
                {record.note ? "Edit note" : "Add a note"}
              </button>
            )}
            {editing ? null : <span className="text-[11px] text-muted-foreground">Change it:</span>}
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                aria-pressed={record.outcome === o.id}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                  record.outcome === o.id
                    ? TONES[o.tone]
                    : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground",
                )}
              >
                {COMMAND_OUTCOME_LABELS[o.id]}
              </button>
            ))}
            <button
              type="button"
              onClick={undo}
              className="rounded-lg px-2 py-1.5 text-xs text-muted-foreground/80 hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2.5 space-y-2">
          <p className="text-[13px] text-muted-foreground">
            Paste this command into your AI tool, then come back and say how it went. Your answer
            stays in this browser — SlashAI has no server and no account, so there is nothing to
            send it to and nobody who would read it.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                  "border-border bg-surface-elevated text-muted-foreground",
                  o.tone === "emerald" && "hover:border-emerald-500/50 hover:text-emerald-400",
                  o.tone === "amber" && "hover:border-amber-500/50 hover:text-amber-400",
                  o.tone === "rose" && "hover:border-rose-500/50 hover:text-rose-400",
                )}
              >
                <o.icon className="size-3.5" aria-hidden />
                {COMMAND_OUTCOME_LABELS[o.id]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpenNote(true)}
              className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Add a note instead
            </button>
          </div>
          {openNote && (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={180}
                placeholder="What happened? What would you change about the prompt?"
                className="w-full resize-y rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[13px] text-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={() => {
                    choose("partial");
                    setOpenNote(true);
                    setEditing(true);
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-background hover:bg-primary/90 disabled:opacity-50"
                >
                  Save note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNote("");
                    setOpenNote(false);
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
