import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as RADAR, o as RADAR_KINDS } from "./resources-sbNg_EgT.mjs";
import { Y as Radar } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/radar-DATZOQ9q.js
var import_jsx_runtime = require_jsx_runtime();
function RadarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Free Radar",
		back: {
			to: "/discover",
			label: "Discover"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
					className: "size-6 text-primary",
					"aria-hidden": true
				}), " Free Radar"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Things worth grabbing while they are free. Every conditional offer states who qualifies and when it was last checked."
			})]
		}), RADAR_KINDS.map((kind) => {
			const items = RADAR.filter((x) => x.radar === kind);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-base font-bold tracking-tight text-foreground",
					children: kind
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: items })]
			}, kind);
		})]
	});
}
//#endregion
export { RadarPage as component };
