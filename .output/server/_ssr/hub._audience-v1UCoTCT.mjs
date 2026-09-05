import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hub._audience-v1UCoTCT.js
var $$splitComponentImporter = () => import("./hub._audience-XYzGMQlx.mjs");
var $$splitNotFoundComponentImporter = () => import("./hub._audience-BMutT43Z.mjs");
var HUBS = {
	students: {
		audience: "Students",
		title: "Student Hub",
		blurb: "Free software, study tools, courses and student offers.",
		collection: "for-students"
	},
	professionals: {
		audience: "Professionals",
		title: "Professional Hub",
		blurb: "Productivity, writing, research and planning tools for everyday desk work.",
		collection: "for-professionals"
	},
	developers: {
		audience: "Developers",
		title: "Developer Hub",
		blurb: "Editors, APIs, open-source projects and references worth keeping bookmarked."
	},
	creators: {
		audience: "Creators",
		title: "Creator Hub",
		blurb: "Editing, capture, design and asset tools that do not watermark your work.",
		collection: "for-creators"
	},
	founders: {
		audience: "Founders",
		title: "Founders Hub",
		blurb: "Everything to go from idea to first paying customer."
	},
	india: {
		audience: "India",
		title: "India Hub",
		blurb: "Free tools, courses and resources for Indian builders."
	},
	finance: {
		audience: "Finance",
		title: "Finance Hub",
		blurb: "Free tools for investors, traders and money-minded builders."
	},
	designers: {
		audience: "Designers",
		title: "Designers Hub",
		blurb: "Free design tools, assets and learning for UI/UX designers."
	},
	health: {
		audience: "Health",
		title: "Health Hub",
		blurb: "Evidence-based free tools for fitness, nutrition and wellbeing."
	}
};
var Route = createFileRoute("/hub/$audience")({
	loader: ({ params }) => {
		const hub = HUBS[params.audience];
		if (!hub) throw notFound();
		return { hub };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Unavailable — SlashAI" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { hub } = loaderData;
		return { meta: [
			{ title: `${hub.title} — free curated resources | SlashAI` },
			{
				name: "description",
				content: hub.blurb
			},
			{
				property: "og:title",
				content: `${hub.title} — SlashAI`
			},
			{
				property: "og:description",
				content: hub.blurb
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
