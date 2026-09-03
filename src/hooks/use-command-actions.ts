import { useCallback } from "react";
import { toast } from "sonner";

import { useLibrary } from "@/hooks/use-library";
import { commandPath, commandTemplate, type SlashCommand } from "@/lib/commands";
import { trackInteraction } from "@/lib/intelligence";

/** Small, non-intrusive celebrations at the moments that matter. */
const COPY_MILESTONES: Record<number, string> = {
  1: "Nice — your first command 🎉",
  10: "10 commands copied. You're building a habit 💪",
  50: "50 copies — official SlashAI power user ⚡",
  100: "100 commands. That's a lot of saved time 🏆",
};

/** Clipboard + share + "recently used" behaviour, shared by the grid, modal and detail page. */
export function useCommandActions() {
  const { recordUse, recordCopy } = useLibrary();

  const copy = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Clipboard blocked by the browser — select the text and copy manually");
    }
  }, []);

  /** copy + recent + milestone toast + intelligence, used by every "copy" affordance */
  const track = useCallback(
    (cmd: SlashCommand, text: string, message: string) => {
      recordUse(cmd.id);
      trackInteraction(cmd.id, "copy");
      const total = recordCopy();
      const milestone = COPY_MILESTONES[total];
      if (milestone) window.setTimeout(() => toast(milestone), 500);
      void copy(text, message);
    },
    [copy, recordUse, recordCopy],
  );

  const copyCommand = useCallback(
    (cmd: SlashCommand) => track(cmd, cmd.command, `${cmd.command} copied`),
    [track],
  );

  const copyPrompt = useCallback(
    (cmd: SlashCommand, text?: string) =>
      track(cmd, text ?? commandTemplate(cmd), "Full prompt copied"),
    [track],
  );

  const runCommand = useCallback(
    (cmd: SlashCommand, text?: string) =>
      track(cmd, text ?? commandTemplate(cmd), `${cmd.command} template copied — ready to edit`),
    [track],
  );

  /** open a command's detail page — feeds the intelligence graph + scores */
  const openCommand = useCallback((cmd: SlashCommand) => {
    recordUse(cmd.id);
    trackInteraction(cmd.id, "open");
  }, [recordUse]);

  const shareCommand = useCallback(
    async (cmd: SlashCommand) => {
      const url =
        typeof window === "undefined"
          ? commandPath(cmd)
          : new URL(commandPath(cmd), window.location.origin).toString();
      const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
      if (canShare) {
        try {
          await navigator.share({ title: `${cmd.command} — SlashAI`, text: cmd.description, url });
          return;
        } catch (error) {
          if ((error as DOMException)?.name === "AbortError") return;
        }
      }
      await copy(url, "Link copied — share it anywhere");
    },
    [copy],
  );

  return { copy, copyCommand, copyPrompt, runCommand, shareCommand, openCommand };
}
