import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._category._subcategory-CoaBiaPn.js
var $$splitComponentImporter = () => import("./explore._category._subcategory-ChL-bqUt.mjs");
var Route = createFileRoute("/explore/$category/$subcategory")({
	head: ({ params }) => {
		const title = `${params.subcategory} — ${params.category} | SlashAI`;
		const description = `AI slash commands for ${params.subcategory} inside the ${params.category} category.`;
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
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
