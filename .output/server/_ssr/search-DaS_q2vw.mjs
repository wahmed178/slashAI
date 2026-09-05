import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DaS_q2vw.js
var SORTS = [
	"relevance",
	"name",
	"category",
	"popularity",
	"newest"
];
var $$splitComponentImporter = () => import("./search-Dty4E6JO.mjs");
var Route = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw["q"] === "string" ? raw["q"] : "",
		cat: typeof raw["cat"] === "string" ? raw["cat"] : "all",
		sub: typeof raw["sub"] === "string" ? raw["sub"] : "all",
		type: typeof raw["type"] === "string" ? raw["type"] : "all",
		diff: typeof raw["diff"] === "string" ? raw["diff"] : "all",
		sort: SORTS.includes(raw["sort"]) ? raw["sort"] : "relevance",
		page: Number(raw["page"]) > 0 ? Number(raw["page"]) : 1
	}),
	head: () => ({ meta: [
		{ title: "Search commands — SlashAI" },
		{
			name: "description",
			content: "Search the full SlashAI catalog by task, command name, tag or category."
		},
		{
			property: "og:title",
			content: "Search commands — SlashAI"
		},
		{
			property: "og:description",
			content: "Fast, typo-tolerant search across every AI slash command in SlashAI."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { SORTS as n, Route as t };
