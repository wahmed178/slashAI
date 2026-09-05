import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DSyYfJsl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.functions-BpW3u4I2.js
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var generateSpec = createServerFn({ method: "POST" }).validator((data) => objectType({
	title: stringType().min(1),
	short: stringType(),
	problem: stringType(),
	targetUsers: stringType(),
	solution: stringType(),
	keyFeatures: arrayType(stringType()),
	mvpFeatures: arrayType(stringType()),
	techStack: arrayType(stringType()),
	businessModel: stringType(),
	buildType: stringType()
}).parse(data)).handler(createSsrRpc("3defee5be99cd424ad2b4dd2e0d25275eccc4f7194138d745e7636b5664aef9c"));
var validateIdea = createServerFn({ method: "POST" }).validator((data) => objectType({ idea: stringType().min(20).max(4e3) }).parse(data)).handler(createSsrRpc("5d908154b3b8cfc336906c42202dcb3ec4f3e27cfa34efb76a217d6aba6c59f1"));
//#endregion
export { generateSpec as n, validateIdea as r, Skeleton as t };
