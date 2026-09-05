import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/l._username-LpBmZ6-A.js
var $$splitComponentImporter = () => import("./l._username-DBLN-r3N.mjs");
var Route = createFileRoute("/l/$username")({
	head: ({ params }) => ({ meta: [{ title: `${params.username} — Link Page | SlashAI` }, {
		name: "description",
		content: `Connect with ${params.username} — all their links in one place.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
