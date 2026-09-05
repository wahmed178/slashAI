import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, n as booleanType, s as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DSyYfJsl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media.functions-C2IgkuG3.js
/** Keyless YouTube/music search, played back through youtube-nocookie embeds. */
var searchVideos = createServerFn({ method: "GET" }).validator((data) => objectType({
	q: stringType().trim().min(1).max(120),
	music: booleanType()
}).parse(data)).handler(createSsrRpc("59180df7147d94597df04df2fa82f08640106efddb7f7238ea4c3747ecf35ff8"));
/** Free-text movie search across IMDb metadata. */
var searchMovies = createServerFn({ method: "GET" }).validator((data) => objectType({ q: stringType().trim().max(120) }).parse(data)).handler(createSsrRpc("30c3c3597cb134434640d65e769e77007ef193e10e9c98ad003c65ff9a5a9ded"));
/** Curated regional shelf (Hindi, Telugu, Urdu, Nepali, …). */
var regionalMovies = createServerFn({ method: "GET" }).validator((data) => objectType({ lang: stringType().trim().max(20) }).parse(data)).handler(createSsrRpc("9388c57f5727b6fb43758c94e482fd686534025cfd3cba298c85f2ee88648de4"));
createServerFn({ method: "GET" }).validator((data) => objectType({ id: stringType().trim().max(20) }).parse(data)).handler(createSsrRpc("bd7a45ea515e84ba8f81ffa42eb9f61a0bde903d933044e9f5f638fe92bb9ab7"));
//#endregion
export { searchMovies as n, searchVideos as r, regionalMovies as t };
