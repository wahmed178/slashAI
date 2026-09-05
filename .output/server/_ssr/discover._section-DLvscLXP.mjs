import { g as sectionDef } from "./resources-sbNg_EgT.mjs";
import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover._section-DLvscLXP.js
var $$splitComponentImporter = () => import("./discover._section-vCl4K09_.mjs");
var $$splitNotFoundComponentImporter = () => import("./discover._section-DuRCN77X.mjs");
var Route = createFileRoute("/discover/$section")({
	validateSearch: (raw) => ({
		cat: typeof raw["cat"] === "string" ? raw["cat"] : "all",
		price: typeof raw["price"] === "string" ? raw["price"] : "all"
	}),
	loader: ({ params }) => {
		const def = sectionDef(params.section);
		if (!def) throw notFound();
		return { def };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Unavailable — SlashAI" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { def } = loaderData;
		const title = `${def.label} — curated free resources | SlashAI`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: def.blurb
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: def.blurb
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
