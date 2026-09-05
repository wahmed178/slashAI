import { i as CATEGORY_TREE } from "./slashkits-CB7bx4DD.mjs";
import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._category.index-BvcIRnP_.js
var $$splitComponentImporter = () => import("./explore._category.index-B-pQIX8r.mjs");
var $$splitNotFoundComponentImporter = () => import("./explore._category.index-D8gfCoQA.mjs");
var Route = createFileRoute("/explore/$category/")({
	head: ({ params }) => {
		const node = CATEGORY_TREE.find((c) => c.category === params.category);
		if (!node) return { meta: [{ title: "Category not found — SlashAI" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${node.category} commands — SlashAI`;
		const description = `${node.count} AI slash commands in ${node.category}, grouped into ${node.subcategories.length} subcategories.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	loader: ({ params }) => {
		if (!CATEGORY_TREE.find((c) => c.category === params.category)) throw notFound();
		return null;
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
