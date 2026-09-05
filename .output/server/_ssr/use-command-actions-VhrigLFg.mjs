import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as trackInteraction, I as useLibrary, _ as commandTemplate, g as commandPath } from "./slashkits-CB7bx4DD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-command-actions-VhrigLFg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Small, non-intrusive celebrations at the moments that matter. */
var COPY_MILESTONES = {
	1: "Nice — your first command 🎉",
	10: "10 commands copied. You're building a habit 💪",
	50: "50 copies — official SlashAI power user ⚡",
	100: "100 commands. That's a lot of saved time 🏆"
};
/** Clipboard + share + "recently used" behaviour, shared by the grid, modal and detail page. */
function useCommandActions() {
	const { recordUse, recordCopy } = useLibrary();
	const copy = (0, import_react.useCallback)(async (text, message) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(message);
		} catch {
			toast.error("Clipboard blocked by the browser — select the text and copy manually");
		}
	}, []);
	/** copy + recent + milestone toast + intelligence, used by every "copy" affordance */
	const track = (0, import_react.useCallback)((cmd, text, message) => {
		recordUse(cmd.id);
		trackInteraction(cmd.id, "copy");
		const milestone = COPY_MILESTONES[recordCopy()];
		if (milestone) window.setTimeout(() => toast(milestone), 500);
		copy(text, message);
	}, [
		copy,
		recordUse,
		recordCopy
	]);
	const copyCommand = (0, import_react.useCallback)((cmd) => track(cmd, cmd.command, `${cmd.command} copied`), [track]);
	const copyPrompt = (0, import_react.useCallback)((cmd, text) => track(cmd, text ?? commandTemplate(cmd), "Full prompt copied"), [track]);
	const runCommand = (0, import_react.useCallback)((cmd, text) => track(cmd, text ?? commandTemplate(cmd), `${cmd.command} template copied — ready to edit`), [track]);
	/** open a command's detail page — feeds the intelligence graph + scores */
	const openCommand = (0, import_react.useCallback)((cmd) => {
		recordUse(cmd.id);
		trackInteraction(cmd.id, "open");
	}, [recordUse]);
	return {
		copy,
		copyCommand,
		copyPrompt,
		runCommand,
		shareCommand: (0, import_react.useCallback)(async (cmd) => {
			const url = typeof window === "undefined" ? commandPath(cmd) : new URL(commandPath(cmd), window.location.origin).toString();
			if (typeof navigator !== "undefined" && typeof navigator.share === "function") try {
				await navigator.share({
					title: `${cmd.command} — SlashAI`,
					text: cmd.description,
					url
				});
				return;
			} catch (error) {
				if (error?.name === "AbortError") return;
			}
			await copy(url, "Link copied — share it anywhere");
		}, [copy]),
		openCommand
	};
}
//#endregion
export { useCommandActions as t };
