import { y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c._slug-B_MoZEjQ.js
var $$splitComponentImporter = () => import("./c._slug-BtybTxi5.mjs");
var Route = createFileRoute("/c/$slug")({
	head: ({ params }) => {
		const command = getCommand(params.slug);
		const title = command ? `${command.command} — ${command.title} | SlashAI` : "Command not found | SlashAI";
		const description = command ? `${command.description} ${command.category} / ${command.subcategory}.` : "This slash command is not in the SlashAI library.";
		return {
			meta: [
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
				},
				...command ? [] : [{
					name: "robots",
					content: "noindex"
				}]
			],
			links: [{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
