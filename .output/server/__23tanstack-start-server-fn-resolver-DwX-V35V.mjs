//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DwX-V35V.js
var manifest = {
	"0a990cae3c31c623a6ac6158c5f89b0d405f39c2be8225325c35b59a6c71a99e": {
		functionName: "getWeather_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"1bc887bfa1ab3d839f45c5ca60023f6c34dadc9c420bf54dd442702af13d53d7": {
		functionName: "getForex_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"2fc7204499561c00291c4f98a87cadbc4773e92064af74d3a8f5e5acf1183727": {
		functionName: "getIndiaNews_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"30c3c3597cb134434640d65e769e77007ef193e10e9c98ad003c65ff9a5a9ded": {
		functionName: "searchMovies_createServerFn_handler",
		importer: () => import("./_ssr/media.functions-CdES8qKn.mjs")
	},
	"33e7fc2a150c04f07e3eafcde029e94b700f7e9a2703453a64e311427a38e093": {
		functionName: "getCrypto_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"3de91ee12c38e61e20c22a8fa890a5614a376b695ca6cc2d1d111285b08c7284": {
		functionName: "getMatches_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"3defee5be99cd424ad2b4dd2e0d25275eccc4f7194138d745e7636b5664aef9c": {
		functionName: "generateSpec_createServerFn_handler",
		importer: () => import("./_ssr/build-ideas.functions-gOCCFSB5.mjs")
	},
	"4a3c30f789c20a5174b92a6dfb336042fee950f4efe411d18c4d1b4fb5fbff8e": {
		functionName: "getPrayerTimes_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"59180df7147d94597df04df2fa82f08640106efddb7f7238ea4c3747ecf35ff8": {
		functionName: "searchVideos_createServerFn_handler",
		importer: () => import("./_ssr/media.functions-CdES8qKn.mjs")
	},
	"5d908154b3b8cfc336906c42202dcb3ec4f3e27cfa34efb76a217d6aba6c59f1": {
		functionName: "validateIdea_createServerFn_handler",
		importer: () => import("./_ssr/build-ideas.functions-gOCCFSB5.mjs")
	},
	"72e59b5dc7bf00dfc5823aeee2f889360ad616f3e6b2fd6b66db8f4644e649e5": {
		functionName: "getNews_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"903e952a32b77fda772c5dd4b46cf99f1c2249ec5aab61d34a15c2614f221803": {
		functionName: "getStocks_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"9388c57f5727b6fb43758c94e482fd686534025cfd3cba298c85f2ee88648de4": {
		functionName: "regionalMovies_createServerFn_handler",
		importer: () => import("./_ssr/media.functions-CdES8qKn.mjs")
	},
	"a7bff83ff8d3cbe7497bbfc6cba6cfd56d987f9a471cc201fef3fc07467065f8": {
		functionName: "getCommodities_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"b2add670000f93d5d2bc2e8fe0d8c843e00ccb367ed0b40f8b516602d0a1f415": {
		functionName: "getAirQuality_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"bd7a45ea515e84ba8f81ffa42eb9f61a0bde903d933044e9f5f638fe92bb9ab7": {
		functionName: "movieDetail_createServerFn_handler",
		importer: () => import("./_ssr/media.functions-CdES8qKn.mjs")
	},
	"da3275b77468df0d891e0789b43199ecfb404e1995c92bfc6d65d25c232e3fd9": {
		functionName: "getSpace_createServerFn_handler",
		importer: () => import("./_ssr/live.functions-260l0ZOK.mjs")
	},
	"feec07b1db669a751b6f29024ff26053d66345e81c5d707ed4c070c164228953": {
		functionName: "runGenerator_createServerFn_handler",
		importer: () => import("./_ssr/generators.functions-DSi3kHVo.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
