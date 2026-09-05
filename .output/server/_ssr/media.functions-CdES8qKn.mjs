import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { a as objectType, n as booleanType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media.functions-CdES8qKn.js
var searchVideos_createServerFn_handler = createServerRpc({
	id: "59180df7147d94597df04df2fa82f08640106efddb7f7238ea4c3747ecf35ff8",
	name: "searchVideos",
	filename: "src/lib/media.functions.ts"
}, (opts) => searchVideos.__executeServer(opts));
var searchVideos = createServerFn({ method: "GET" }).validator((data) => objectType({
	q: stringType().trim().min(1).max(120),
	music: booleanType()
}).parse(data)).handler(searchVideos_createServerFn_handler, async ({ data }) => {
	const { runVideoSearch } = await import("./media.server-CUIBVsVq.mjs");
	return runVideoSearch(data.q, data.music);
});
var searchMovies_createServerFn_handler = createServerRpc({
	id: "30c3c3597cb134434640d65e769e77007ef193e10e9c98ad003c65ff9a5a9ded",
	name: "searchMovies",
	filename: "src/lib/media.functions.ts"
}, (opts) => searchMovies.__executeServer(opts));
var searchMovies = createServerFn({ method: "GET" }).validator((data) => objectType({ q: stringType().trim().max(120) }).parse(data)).handler(searchMovies_createServerFn_handler, async ({ data }) => {
	const { runMovieSearch } = await import("./media.server-CUIBVsVq.mjs");
	return data.q ? runMovieSearch(data.q) : [];
});
var regionalMovies_createServerFn_handler = createServerRpc({
	id: "9388c57f5727b6fb43758c94e482fd686534025cfd3cba298c85f2ee88648de4",
	name: "regionalMovies",
	filename: "src/lib/media.functions.ts"
}, (opts) => regionalMovies.__executeServer(opts));
var regionalMovies = createServerFn({ method: "GET" }).validator((data) => objectType({ lang: stringType().trim().max(20) }).parse(data)).handler(regionalMovies_createServerFn_handler, async ({ data }) => {
	const { runRegionalShelf } = await import("./media.server-CUIBVsVq.mjs");
	return runRegionalShelf(data.lang);
});
var movieDetail_createServerFn_handler = createServerRpc({
	id: "bd7a45ea515e84ba8f81ffa42eb9f61a0bde903d933044e9f5f638fe92bb9ab7",
	name: "movieDetail",
	filename: "src/lib/media.functions.ts"
}, (opts) => movieDetail.__executeServer(opts));
var movieDetail = createServerFn({ method: "GET" }).validator((data) => objectType({ id: stringType().trim().max(20) }).parse(data)).handler(movieDetail_createServerFn_handler, async ({ data }) => {
	const { runMovieDetail } = await import("./media.server-CUIBVsVq.mjs");
	return runMovieDetail(data.id);
});
//#endregion
export { movieDetail_createServerFn_handler, regionalMovies_createServerFn_handler, searchMovies_createServerFn_handler, searchVideos_createServerFn_handler };
