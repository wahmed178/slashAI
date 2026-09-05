import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/is-url/index.js
var require_is_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Expose `isUrl`.
	*/
	module.exports = isUrl;
	/**
	* RegExps.
	* A URL must match #1 and then at least one of #2/#3.
	* Use two levels of REs to avoid REDOS.
	*/
	var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
	var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
	var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
	/**
	* Loosely validate a URL `string`.
	*
	* @param {String} string
	* @return {Boolean}
	*/
	function isUrl(string) {
		if (typeof string !== "string") return false;
		var match = string.match(protocolAndDomainRE);
		if (!match) return false;
		var everythingAfterProtocol = match[1];
		if (!everythingAfterProtocol) return false;
		if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) return true;
		return false;
	}
}));
//#endregion
export { require_is_url as t };
