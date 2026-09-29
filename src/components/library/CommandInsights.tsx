/**
 * The "why you'd want this" half of a command page: what it is actually for,
 * how much work it is, what sits next to it, and the hashtags to post it with.
 *
 * Every number and every line here comes from the catalogue's own fields. There
 * are no quotes and no invented adoption figures, because there is no backend
 * to have collected any.
 */
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Hash, Sparkles, TrendingUp, Clock3, Copy, Check, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categoryIcon } from "@/components/library/icons";
import { CATEGORY_ICONS, type SlashCommand } from "@/lib/commands";
import {
  commandEffort,
  commandHashtags,
  freshCommands,
  hashtagString,
  isFresh,
  nicheNeighbours,
  nicheSize,
  trendingCommands,
  commandUseCase,
} from "@/lib/command-insights";

import { cn } from "@/lib/utils";

interface Props {
  command: SlashCommand;
}

/* ─────────────────────────── use cases ─────────────────────────── */

function UseCases({ command }: { command: SlashCommand }) {
  const useCase = commandUseCase(command);
  const effort = commandEffort(command);
  const neighbours = useMemo(() => nicheNeighbours(command), [command]);
  const siblings = nicheSize(command);
  if (!useCase) return null;

  const Icon = categoryIcon(CATEGORY_ICONS[command.category]);

  return (
    <section aria-labelledby="use-cases-heading" className="space-y-3">
      <h4
        id="use-cases-heading"
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        <Target className="size-3.5 text-primary" aria-hidden />
        When to reach for this
      </h4>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm leading-relaxed font-medium text-foreground">{useCase.headline}</p>
        <ul className="mt-2.5 space-y-1.5">
          {useCase.jobs.map((job) => (
            <li key={job} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
              <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-primary" />
              {job}
            </li>
          ))}
        </ul>

        <dl className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:grid-cols-4">
          <div>
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">Area</dt>
            <dd className="mt-0.5 flex items-center gap-1 text-[12px] text-foreground">
              <Icon className="size-3 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{command.subcategory || command.category}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">Effort</dt>
            <dd className="mt-0.5 text-[12px] text-foreground">
              {effort.variables > 0
                ? `${effort.variables} ${effort.variables === 1 ? "blank" : "blanks"} to fill`
                : "No blanks to fill"}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Difficulty
            </dt>
            <dd className="mt-0.5 text-[12px] text-foreground capitalize">{effort.difficulty}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">Niche</dt>
            <dd className="mt-0.5 text-[12px] text-foreground tabular-nums">
              {siblings > 0 ? `${siblings} commands here` : "One of a kind"}
            </dd>
          </div>
        </dl>
      </div>

      {neighbours.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] text-muted-foreground">
            Closest commands in the same niche
          </p>
          <div className="flex flex-wrap gap-1.5">
            {neighbours.map((n) => (
              <Link
                key={n.id}
                to="/c/$slug"
                params={{ slug: n.id }}
                className="ripple-press rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {n.command}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── hashtags ─────────────────────────── */

function Hashtags({ command }: { command: SlashCommand }) {
  const [copied, setCopied] = useState(false);
  const tags = useMemo(() => commandHashtags(command), [command]);

  const copyAll = async () => {
    const text = `${command.command} — ${command.description}\n\n${hashtagString(command)}\nhttps://slashai.in/c/${command.id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Command + hashtags copied — paste it anywhere");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not access the clipboard");
    }
  };

  const shareTo = (network: "x" | "instagram") => {
    const text = `${command.command} — ${command.description} ${hashtagString(command, 5)}`;
    const url = `https://slashai.in/c/${command.id}`;
    const target =
      network === "x"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        : `https://www.instagram.com/`;
    window.open(target, "_blank", "noopener,noreferrer");
    if (network === "instagram") {
      // Instagram has no web intent API, so the caption is on the clipboard and
      // the app is opened for the user to paste it.
      void navigator.clipboard
        ?.writeText(`${text}\n${url}`)
        .then(() => toast.success("Caption copied — paste it into Instagram"))
        .catch(() => toast("Caption ready to copy from the button above"));
    }
  };

  return (
    <section aria-labelledby="hashtags-heading" className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4
          id="hashtags-heading"
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          <Hash className="size-3.5 text-primary" aria-hidden />
          Hashtags
        </h4>
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3 text-primary" aria-hidden />
          ) : (
            <Copy className="size-3" aria-hidden />
          )}
          {copied ? "Copied" : "Copy with hashtags"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag}
            to="/search"
            search={{ q: tag }}
            className="ripple-press inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">Post it:</span>
        <button
          type="button"
          onClick={() => shareTo("x")}
          className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          𝕏 / Twitter
        </button>
        <button
          type="button"
          onClick={() => shareTo("instagram")}
          className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Instagram
        </button>
      </div>
    </section>
  );
}

/* ─────────────────── fresh & trending right now ─────────────────── */

function CommandPicks() {
  const picks = useMemo(() => {
    const fresh = freshCommands(5);
    const trending = trendingCommands(5);
    const seen = new Set<string>();
    const out: { command: SlashCommand; kind: "fresh" | "trending" }[] = [];
    for (const c of [...fresh, ...trending]) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      out.push({ command: c, kind: isFresh(c, 45) ? "fresh" : "trending" });
      if (out.length >= 6) break;
    }
    return out;
  }, []);

  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="picks-heading" className="space-y-2.5">
      <h4
        id="picks-heading"
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        <TrendingUp className="size-3.5 text-primary" aria-hidden />
        Fresh and trending
      </h4>
      <p className="text-[11px] text-muted-foreground">
        Ordered by the catalogue&apos;s own <code className="font-mono">addedAt</code> and{" "}
        <code className="font-mono">popularity</code> fields — not by live traffic, which SlashAI
        never sees. Some <code className="font-mono">addedAt</code> values in the source data sit in
        the future, so treat &ldquo;newest&rdquo; as newest-in-catalogue rather than as a verified
        publication date.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {picks.map(({ command, kind }) => (
          <Link
            key={command.id}
            to="/c/$slug"
            params={{ slug: command.id }}
            className="group spotlight flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/40"
            data-spotlight
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {command.command}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {command.title}
              </span>
            </span>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                kind === "fresh"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-amber-500/15 text-amber-400",
              )}
            >
              {kind === "fresh" ? (
                <Sparkles className="size-2.5" aria-hidden />
              ) : (
                <Clock3 className="size-2.5" aria-hidden />
              )}
              {kind === "fresh" ? "Newest" : "Top"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── exported panel ─────────────────────────── */

export function CommandInsights({ command }: Props) {
  return (
    <div className="space-y-6">
      <UseCases command={command} />
      <CommandPicks />
      <Hashtags command={command} />
    </div>
  );
}
