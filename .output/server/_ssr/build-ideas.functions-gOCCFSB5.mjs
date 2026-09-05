import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { i as specPrompt, n as VALIDATE_SYSTEM, r as askOpenRouter, t as SPEC_SYSTEM } from "./build-ideas.server-6O_xPNy0.mjs";
import { a as objectType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.functions-gOCCFSB5.js
var generateSpec_createServerFn_handler = createServerRpc({
	id: "3defee5be99cd424ad2b4dd2e0d25275eccc4f7194138d745e7636b5664aef9c",
	name: "generateSpec",
	filename: "src/lib/build-ideas.functions.ts"
}, (opts) => generateSpec.__executeServer(opts));
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
}).parse(data)).handler(generateSpec_createServerFn_handler, async ({ data }) => ({ markdown: await askOpenRouter(SPEC_SYSTEM, specPrompt(data)) }));
var validateIdea_createServerFn_handler = createServerRpc({
	id: "5d908154b3b8cfc336906c42202dcb3ec4f3e27cfa34efb76a217d6aba6c59f1",
	name: "validateIdea",
	filename: "src/lib/build-ideas.functions.ts"
}, (opts) => validateIdea.__executeServer(opts));
var validateIdea = createServerFn({ method: "POST" }).validator((data) => objectType({ idea: stringType().min(20).max(4e3) }).parse(data)).handler(validateIdea_createServerFn_handler, async ({ data }) => ({ json: await askOpenRouter(VALIDATE_SYSTEM, `Evaluate this startup idea:\n\n${data.idea}`) }));
//#endregion
export { generateSpec_createServerFn_handler, validateIdea_createServerFn_handler };
