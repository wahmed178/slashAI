import { f as getResource } from "./resources-sbNg_EgT.mjs";
import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._id-B-Bay6Ep.js
var $$splitComponentImporter = () => import("./r._id-BVT-7QUf.mjs");
var $$splitNotFoundComponentImporter = () => import("./r._id-DVxhY72O.mjs");
var Route = createFileRoute("/r/$id")({
	loader: ({ params }) => {
		const resource = getResource(params.id);
		if (!resource) throw notFound();
		return { resource };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Unavailable — SlashAI" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { resource } = loaderData;
		const title = `${resource.name} — ${resource.pricing} | SlashAI`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: resource.description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: resource.description
			},
			{
				property: "og:type",
				content: "article"
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
