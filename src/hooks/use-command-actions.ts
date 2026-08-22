import { useCallback } from "react";
import { toast } from "sonner";

import { useLibrary } from "@/hooks/use-library";
import { commandPath, commandTemplate, type SlashCommand } from "@/lib/commands";

/** Clipboard + share + "recently used" behaviour, shared by the grid, modal and detail page. */
export function useCommandActions() {
  const { recordUse } = useLibrary();

  const copy = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Clipboard blocked by the browser — select the text and copy manually");
    }
  }, []);

  const copyCommand = useCallback(
    (cmd: SlashCommand) => {
      recordUse(cmd.id);
      void copy(cmd.command, `${cmd.command} copied`);
    },
    [copy, recordUse],
  );

  const copyPrompt = useCallback(
    (cmd: SlashCommand, text?: string) => {
      recordUse(cmd.id);
      void copy(text ?? commandTemplate(cmd), "Full prompt copied");
    },
    [copy, recordUse],
  );

  const runCommand = useCallback(
    (cmd: SlashCommand, text?: string) => {
      recordUse(cmd.id);
      void copy(text ?? commandTemplate(cmd), `${cmd.command} template copied — ready to edit`);
    },
    [copy, recordUse],
  );

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

  return { copy, copyCommand, copyPrompt, runCommand, shareCommand };
}
