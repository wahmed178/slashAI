import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, n as Button, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recent-DzQSrLZn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecentPage() {
	const { recents, hydrated, clearRecents } = useLibrary();
	const commands = (0, import_react.useMemo)(() => recents.map((id) => getCommand(id)).filter((c) => Boolean(c)), [recents]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-black tracking-tight text-foreground",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 truncate text-sm text-muted-foreground",
					children: hydrated ? `${commands.length} recently used` : "Loading…"
				})]
			}), commands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				onClick: clearRecents,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Clear"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: commands.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands }) : hydrated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing used yet",
				hint: "Commands you open or copy show up here so you can get back to them fast.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						children: "Find a command"
					})
				})
			})
		})]
	});
}
//#endregion
export { RecentPage as component };
