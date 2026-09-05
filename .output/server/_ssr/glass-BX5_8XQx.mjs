import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-BX5_8XQx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* The paid "Glass" tier no longer exists — every feature is free.
* Redirect anywhere pointing at the old waitlist page back home.
*/
function GlassRedirect() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		navigate({
			to: "/",
			replace: true
		});
	}, [navigate]);
	return null;
}
//#endregion
export { GlassRedirect as component };
