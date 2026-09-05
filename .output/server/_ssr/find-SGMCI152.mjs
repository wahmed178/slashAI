import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/find-SGMCI152.js
var $$splitComponentImporter = () => import("./find-CsoEOeAe.mjs");
var Route = createFileRoute("/find")({
	validateSearch: (raw) => ({ q: typeof raw["q"] === "string" ? raw["q"] : "" }),
	head: () => ({ meta: [
		{ title: "Advanced search — turn any keyword into a shortlist | SlashAI" },
		{
			name: "description",
			content: "Type what you want in plain words. SlashAI shortlists the exact features, commands, ideas and resources that fit — plus a ready-to-copy prompt."
		},
		{
			property: "og:title",
			content: "Advanced search — keyword to shortlist | SlashAI"
		},
		{
			property: "og:description",
			content: "One box, instant feature shortlist and a copy-ready prompt for your AI."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
