import { r as getGenerator } from "./generators-BQMEiZJM.mjs";
import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generators._id-C9x5K1Ji.js
var $$splitComponentImporter = () => import("./generators._id-3iftnJ4p.mjs");
var Route = createFileRoute("/generators/$id")({
	beforeLoad: ({ params }) => {
		if (!getGenerator(params.id)) throw notFound();
	},
	head: ({ params }) => {
		const gen = getGenerator(params.id);
		return { meta: [{ title: `${gen ? gen.title : "Generator"} — SlashAI` }, {
			name: "description",
			content: gen ? gen.tagline : "AI generator"
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
