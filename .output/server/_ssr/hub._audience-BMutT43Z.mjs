import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState } from "./CommandGrid-DFmNY4E7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hub._audience-BMutT43Z.js
var import_jsx_runtime = require_jsx_runtime();
function HubNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideHeaderSearch: true,
		title: "Not found",
		back: {
			to: "/discover",
			label: "Discover"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No hub with that name",
			hint: "Try the Student or Developer hub from Discover.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/discover",
					children: "Go to Discover"
				})
			})
		})
	});
}
//#endregion
export { HubNotFound as notFoundComponent };
