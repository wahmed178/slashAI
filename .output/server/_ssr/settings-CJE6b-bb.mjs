import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CJE6b-bb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function SettingsRedirect() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		navigate({
			to: "/me",
			replace: true
		});
	}, [navigate]);
	return null;
}
//#endregion
export { SettingsRedirect as component };
