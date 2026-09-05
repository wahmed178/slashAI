import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getCollection } from "./collections-OIdjX1d6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._id-BHaYYZ4i.js
var $$splitComponentImporter = () => import("./collections._id-BlvTnpds.mjs");
var Route = createFileRoute("/collections/$id")({
	head: ({ params }) => {
		const collection = getCollection(params.id);
		if (!collection) return { meta: [{ title: "Collection not found — SlashAI" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${collection.title} — SlashAI collection`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: collection.blurb
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: collection.blurb
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
