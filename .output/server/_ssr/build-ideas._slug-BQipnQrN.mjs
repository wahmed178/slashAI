import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as findIdea } from "./build-ideas-u3AZgoYC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas._slug-BQipnQrN.js
var $$splitComponentImporter = () => import("./build-ideas2._slug-CfaVvDQ7.mjs");
var Route = createFileRoute("/build-ideas/$slug")({
	loader: ({ params }) => {
		const idea = findIdea(params.slug);
		if (!idea) throw notFound();
		return { idea };
	},
	head: ({ loaderData }) => {
		const idea = loaderData?.idea;
		if (!idea) return {};
		return { meta: [
			{ title: `${idea.title} — build idea with MVP scope | SlashAI` },
			{
				name: "description",
				content: idea.shortDescription
			},
			{
				property: "og:title",
				content: `${idea.title} — SlashAI Build Ideas`
			},
			{
				property: "og:description",
				content: idea.shortDescription
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
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
