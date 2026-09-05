import { t as __commonJSMin } from "../_runtime.mjs";
import { f as globalthis_default, p as init_globalthis } from "./@tanstack/router-core+[...].mjs";
//#region node_modules/underscore/underscore-umd.js
var require_underscore_umd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	init_globalthis();
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define("underscore", factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, function() {
			var current = global._;
			var exports$1 = global._ = factory();
			exports$1.noConflict = function() {
				global._ = current;
				return exports$1;
			};
		}());
	})(exports, (function() {
		var VERSION = "1.13.8";
		var root = typeof self == "object" && self.self === self && self || typeof globalthis_default == "object" && globalthis_default.global === globalthis_default && globalthis_default || Function("return this")() || {};
		var ArrayProto = Array.prototype, ObjProto = Object.prototype;
		var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
		var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
		var supportsArrayBuffer = typeof ArrayBuffer !== "undefined", supportsDataView = typeof DataView !== "undefined";
		var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create, nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
		var _isNaN = isNaN, _isFinite = isFinite;
		var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
		var nonEnumerableProps = [
			"valueOf",
			"isPrototypeOf",
			"toString",
			"propertyIsEnumerable",
			"hasOwnProperty",
			"toLocaleString"
		];
		var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
		function restArguments(func, startIndex) {
			startIndex = startIndex == null ? func.length - 1 : +startIndex;
			return function() {
				var length = Math.max(arguments.length - startIndex, 0), rest = Array(length), index = 0;
				for (; index < length; index++) rest[index] = arguments[index + startIndex];
				switch (startIndex) {
					case 0: return func.call(this, rest);
					case 1: return func.call(this, arguments[0], rest);
					case 2: return func.call(this, arguments[0], arguments[1], rest);
				}
				var args = Array(startIndex + 1);
				for (index = 0; index < startIndex; index++) args[index] = arguments[index];
				args[startIndex] = rest;
				return func.apply(this, args);
			};
		}
		function isObject(obj) {
			var type = typeof obj;
			return type === "function" || type === "object" && !!obj;
		}
		function isNull(obj) {
			return obj === null;
		}
		function isUndefined(obj) {
			return obj === void 0;
		}
		function isBoolean(obj) {
			return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
		}
		function isElement(obj) {
			return !!(obj && obj.nodeType === 1);
		}
		function tagTester(name) {
			var tag = "[object " + name + "]";
			return function(obj) {
				return toString.call(obj) === tag;
			};
		}
		var isString = tagTester("String");
		var isNumber = tagTester("Number");
		var isDate = tagTester("Date");
		var isRegExp = tagTester("RegExp");
		var isError = tagTester("Error");
		var isSymbol = tagTester("Symbol");
		var isArrayBuffer = tagTester("ArrayBuffer");
		var isFunction = tagTester("Function");
		var nodelist = root.document && root.document.childNodes;
		if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") isFunction = function(obj) {
			return typeof obj == "function" || false;
		};
		var isFunction$1 = isFunction;
		var hasObjectTag = tagTester("Object");
		var hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag(/* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8)))), isIE11 = typeof Map !== "undefined" && hasObjectTag(/* @__PURE__ */ new Map());
		var isDataView = tagTester("DataView");
		function alternateIsDataView(obj) {
			return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
		}
		var isDataView$1 = hasDataViewBug ? alternateIsDataView : isDataView;
		var isArray = nativeIsArray || tagTester("Array");
		function has$1(obj, key) {
			return obj != null && hasOwnProperty.call(obj, key);
		}
		var isArguments = tagTester("Arguments");
		(function() {
			if (!isArguments(arguments)) isArguments = function(obj) {
				return has$1(obj, "callee");
			};
		})();
		var isArguments$1 = isArguments;
		function isFinite$1(obj) {
			return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
		}
		function isNaN$1(obj) {
			return isNumber(obj) && _isNaN(obj);
		}
		function constant(value) {
			return function() {
				return value;
			};
		}
		function createSizePropertyCheck(getSizeProperty) {
			return function(collection) {
				var sizeProperty = getSizeProperty(collection);
				return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
			};
		}
		function shallowProperty(key) {
			return function(obj) {
				return obj == null ? void 0 : obj[key];
			};
		}
		var getByteLength = shallowProperty("byteLength");
		var isBufferLike = createSizePropertyCheck(getByteLength);
		var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
		function isTypedArray(obj) {
			return nativeIsView ? nativeIsView(obj) && !isDataView$1(obj) : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
		}
		var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);
		var getLength = shallowProperty("length");
		function emulatedSet(keys) {
			var hash = {};
			for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
			return {
				contains: function(key) {
					return hash[key] === true;
				},
				push: function(key) {
					hash[key] = true;
					return keys.push(key);
				}
			};
		}
		function collectNonEnumProps(obj, keys) {
			keys = emulatedSet(keys);
			var nonEnumIdx = nonEnumerableProps.length;
			var constructor = obj.constructor;
			var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;
			var prop = "constructor";
			if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);
			while (nonEnumIdx--) {
				prop = nonEnumerableProps[nonEnumIdx];
				if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) keys.push(prop);
			}
		}
		function keys(obj) {
			if (!isObject(obj)) return [];
			if (nativeKeys) return nativeKeys(obj);
			var keys = [];
			for (var key in obj) if (has$1(obj, key)) keys.push(key);
			if (hasEnumBug) collectNonEnumProps(obj, keys);
			return keys;
		}
		function isEmpty(obj) {
			if (obj == null) return true;
			var length = getLength(obj);
			if (typeof length == "number" && (isArray(obj) || isString(obj) || isArguments$1(obj))) return length === 0;
			return getLength(keys(obj)) === 0;
		}
		function isMatch(object, attrs) {
			var _keys = keys(attrs), length = _keys.length;
			if (object == null) return !length;
			var obj = Object(object);
			for (var i = 0; i < length; i++) {
				var key = _keys[i];
				if (attrs[key] !== obj[key] || !(key in obj)) return false;
			}
			return true;
		}
		function _$1(obj) {
			if (obj instanceof _$1) return obj;
			if (!(this instanceof _$1)) return new _$1(obj);
			this._wrapped = obj;
		}
		_$1.VERSION = VERSION;
		_$1.prototype.value = function() {
			return this._wrapped;
		};
		_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
		_$1.prototype.toString = function() {
			return String(this._wrapped);
		};
		function toBufferView(bufferSource) {
			return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, getByteLength(bufferSource));
		}
		var tagDataView = "[object DataView]";
		function isEqual(a, b) {
			var todo = [{
				a,
				b
			}];
			var aStack = [], bStack = [];
			while (todo.length) {
				var frame = todo.pop();
				if (frame === true) {
					aStack.pop();
					bStack.pop();
					continue;
				}
				a = frame.a;
				b = frame.b;
				if (a === b) {
					if (a !== 0 || 1 / a === 1 / b) continue;
					return false;
				}
				if (a == null || b == null) return false;
				if (a !== a) {
					if (b !== b) continue;
					return false;
				}
				var type = typeof a;
				if (type !== "function" && type !== "object" && typeof b != "object") return false;
				if (a instanceof _$1) a = a._wrapped;
				if (b instanceof _$1) b = b._wrapped;
				var className = toString.call(a);
				if (className !== toString.call(b)) return false;
				if (hasDataViewBug && className == "[object Object]" && isDataView$1(a)) {
					if (!isDataView$1(b)) return false;
					className = tagDataView;
				}
				switch (className) {
					case "[object RegExp]":
					case "[object String]":
						if ("" + a === "" + b) continue;
						return false;
					case "[object Number]":
						todo.push({
							a: +a,
							b: +b
						});
						continue;
					case "[object Date]":
					case "[object Boolean]":
						if (+a === +b) continue;
						return false;
					case "[object Symbol]":
						if (SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b)) continue;
						return false;
					case "[object ArrayBuffer]":
					case tagDataView:
						todo.push({
							a: toBufferView(a),
							b: toBufferView(b)
						});
						continue;
				}
				var areArrays = className === "[object Array]";
				if (!areArrays && isTypedArray$1(a)) {
					if (getByteLength(a) !== getByteLength(b)) return false;
					if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) continue;
					areArrays = true;
				}
				if (!areArrays) {
					if (typeof a != "object" || typeof b != "object") return false;
					var aCtor = a.constructor, bCtor = b.constructor;
					if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor && isFunction$1(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return false;
				}
				var length = aStack.length;
				while (length--) if (aStack[length] === a) {
					if (bStack[length] === b) break;
					return false;
				}
				if (length >= 0) continue;
				aStack.push(a);
				bStack.push(b);
				todo.push(true);
				if (areArrays) {
					length = a.length;
					if (length !== b.length) return false;
					while (length--) todo.push({
						a: a[length],
						b: b[length]
					});
				} else {
					var _keys = keys(a), key;
					length = _keys.length;
					if (keys(b).length !== length) return false;
					while (length--) {
						key = _keys[length];
						if (!has$1(b, key)) return false;
						todo.push({
							a: a[key],
							b: b[key]
						});
					}
				}
			}
			return true;
		}
		function allKeys(obj) {
			if (!isObject(obj)) return [];
			var keys = [];
			for (var key in obj) keys.push(key);
			if (hasEnumBug) collectNonEnumProps(obj, keys);
			return keys;
		}
		function ie11fingerprint(methods) {
			var length = getLength(methods);
			return function(obj) {
				if (obj == null) return false;
				if (getLength(allKeys(obj))) return false;
				for (var i = 0; i < length; i++) if (!isFunction$1(obj[methods[i]])) return false;
				return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
			};
		}
		var forEachName = "forEach", hasName = "has", commonInit = ["clear", "delete"], mapTail = [
			"get",
			hasName,
			"set"
		];
		var mapMethods = commonInit.concat(forEachName, mapTail), weakMapMethods = commonInit.concat(mapTail), setMethods = ["add"].concat(commonInit, forEachName, hasName);
		var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");
		var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");
		var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");
		var isWeakSet = tagTester("WeakSet");
		function values(obj) {
			var _keys = keys(obj);
			var length = _keys.length;
			var values = Array(length);
			for (var i = 0; i < length; i++) values[i] = obj[_keys[i]];
			return values;
		}
		function pairs(obj) {
			var _keys = keys(obj);
			var length = _keys.length;
			var pairs = Array(length);
			for (var i = 0; i < length; i++) pairs[i] = [_keys[i], obj[_keys[i]]];
			return pairs;
		}
		function invert(obj) {
			var result = {};
			var _keys = keys(obj);
			for (var i = 0, length = _keys.length; i < length; i++) result[obj[_keys[i]]] = _keys[i];
			return result;
		}
		function functions(obj) {
			var names = [];
			for (var key in obj) if (isFunction$1(obj[key])) names.push(key);
			return names.sort();
		}
		function createAssigner(keysFunc, defaults) {
			return function(obj) {
				var length = arguments.length;
				if (defaults) obj = Object(obj);
				if (length < 2 || obj == null) return obj;
				for (var index = 1; index < length; index++) {
					var source = arguments[index], keys = keysFunc(source), l = keys.length;
					for (var i = 0; i < l; i++) {
						var key = keys[i];
						if (!defaults || obj[key] === void 0) obj[key] = source[key];
					}
				}
				return obj;
			};
		}
		var extend = createAssigner(allKeys);
		var extendOwn = createAssigner(keys);
		var defaults = createAssigner(allKeys, true);
		function ctor() {
			return function() {};
		}
		function baseCreate(prototype) {
			if (!isObject(prototype)) return {};
			if (nativeCreate) return nativeCreate(prototype);
			var Ctor = ctor();
			Ctor.prototype = prototype;
			var result = new Ctor();
			Ctor.prototype = null;
			return result;
		}
		function create(prototype, props) {
			var result = baseCreate(prototype);
			if (props) extendOwn(result, props);
			return result;
		}
		function clone(obj) {
			if (!isObject(obj)) return obj;
			return isArray(obj) ? obj.slice() : extend({}, obj);
		}
		function tap(obj, interceptor) {
			interceptor(obj);
			return obj;
		}
		function toPath$1(path) {
			return isArray(path) ? path : [path];
		}
		_$1.toPath = toPath$1;
		function toPath(path) {
			return _$1.toPath(path);
		}
		function deepGet(obj, path) {
			var length = path.length;
			for (var i = 0; i < length; i++) {
				if (obj == null) return void 0;
				obj = obj[path[i]];
			}
			return length ? obj : void 0;
		}
		function get(object, path, defaultValue) {
			var value = deepGet(object, toPath(path));
			return isUndefined(value) ? defaultValue : value;
		}
		function has(obj, path) {
			path = toPath(path);
			var length = path.length;
			for (var i = 0; i < length; i++) {
				var key = path[i];
				if (!has$1(obj, key)) return false;
				obj = obj[key];
			}
			return !!length;
		}
		function identity(value) {
			return value;
		}
		function matcher(attrs) {
			attrs = extendOwn({}, attrs);
			return function(obj) {
				return isMatch(obj, attrs);
			};
		}
		function property(path) {
			path = toPath(path);
			return function(obj) {
				return deepGet(obj, path);
			};
		}
		function optimizeCb(func, context, argCount) {
			if (context === void 0) return func;
			switch (argCount == null ? 3 : argCount) {
				case 1: return function(value) {
					return func.call(context, value);
				};
				case 3: return function(value, index, collection) {
					return func.call(context, value, index, collection);
				};
				case 4: return function(accumulator, value, index, collection) {
					return func.call(context, accumulator, value, index, collection);
				};
			}
			return function() {
				return func.apply(context, arguments);
			};
		}
		function baseIteratee(value, context, argCount) {
			if (value == null) return identity;
			if (isFunction$1(value)) return optimizeCb(value, context, argCount);
			if (isObject(value) && !isArray(value)) return matcher(value);
			return property(value);
		}
		function iteratee(value, context) {
			return baseIteratee(value, context, Infinity);
		}
		_$1.iteratee = iteratee;
		function cb(value, context, argCount) {
			if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
			return baseIteratee(value, context, argCount);
		}
		function mapObject(obj, iteratee, context) {
			iteratee = cb(iteratee, context);
			var _keys = keys(obj), length = _keys.length, results = {};
			for (var index = 0; index < length; index++) {
				var currentKey = _keys[index];
				results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
			}
			return results;
		}
		function noop() {}
		function propertyOf(obj) {
			if (obj == null) return noop;
			return function(path) {
				return get(obj, path);
			};
		}
		function times(n, iteratee, context) {
			var accum = Array(Math.max(0, n));
			iteratee = optimizeCb(iteratee, context, 1);
			for (var i = 0; i < n; i++) accum[i] = iteratee(i);
			return accum;
		}
		function random(min, max) {
			if (max == null) {
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random() * (max - min + 1));
		}
		var now = Date.now || function() {
			return (/* @__PURE__ */ new Date()).getTime();
		};
		function createEscaper(map) {
			var escaper = function(match) {
				return map[match];
			};
			var source = "(?:" + keys(map).join("|") + ")";
			var testRegexp = RegExp(source);
			var replaceRegexp = RegExp(source, "g");
			return function(string) {
				string = string == null ? "" : "" + string;
				return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
			};
		}
		var escapeMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#x27;",
			"`": "&#x60;"
		};
		var _escape = createEscaper(escapeMap);
		var _unescape = createEscaper(invert(escapeMap));
		var templateSettings = _$1.templateSettings = {
			evaluate: /<%([\s\S]+?)%>/g,
			interpolate: /<%=([\s\S]+?)%>/g,
			escape: /<%-([\s\S]+?)%>/g
		};
		var noMatch = /(.)^/;
		var escapes = {
			"'": "'",
			"\\": "\\",
			"\r": "r",
			"\n": "n",
			"\u2028": "u2028",
			"\u2029": "u2029"
		};
		var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
		function escapeChar(match) {
			return "\\" + escapes[match];
		}
		var bareIdentifier = /^\s*(\w|\$)+\s*$/;
		function template(text, settings, oldSettings) {
			if (!settings && oldSettings) settings = oldSettings;
			settings = defaults({}, settings, _$1.templateSettings);
			var matcher = RegExp([
				(settings.escape || noMatch).source,
				(settings.interpolate || noMatch).source,
				(settings.evaluate || noMatch).source
			].join("|") + "|$", "g");
			var index = 0;
			var source = "__p+='";
			text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
				source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
				index = offset + match.length;
				if (escape) source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
				else if (interpolate) source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
				else if (evaluate) source += "';\n" + evaluate + "\n__p+='";
				return match;
			});
			source += "';\n";
			var argument = settings.variable;
			if (argument) {
				if (!bareIdentifier.test(argument)) throw new Error("variable is not a bare identifier: " + argument);
			} else {
				source = "with(obj||{}){\n" + source + "}\n";
				argument = "obj";
			}
			source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
			var render;
			try {
				render = new Function(argument, "_", source);
			} catch (e) {
				e.source = source;
				throw e;
			}
			var template = function(data) {
				return render.call(this, data, _$1);
			};
			template.source = "function(" + argument + "){\n" + source + "}";
			return template;
		}
		function result(obj, path, fallback) {
			path = toPath(path);
			var length = path.length;
			if (!length) return isFunction$1(fallback) ? fallback.call(obj) : fallback;
			for (var i = 0; i < length; i++) {
				var prop = obj == null ? void 0 : obj[path[i]];
				if (prop === void 0) {
					prop = fallback;
					i = length;
				}
				obj = isFunction$1(prop) ? prop.call(obj) : prop;
			}
			return obj;
		}
		var idCounter = 0;
		function uniqueId(prefix) {
			var id = ++idCounter + "";
			return prefix ? prefix + id : id;
		}
		function chain(obj) {
			var instance = _$1(obj);
			instance._chain = true;
			return instance;
		}
		function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
			if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
			var self = baseCreate(sourceFunc.prototype);
			var result = sourceFunc.apply(self, args);
			if (isObject(result)) return result;
			return self;
		}
		var partial = restArguments(function(func, boundArgs) {
			var placeholder = partial.placeholder;
			var bound = function() {
				var position = 0, length = boundArgs.length;
				var args = Array(length);
				for (var i = 0; i < length; i++) args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
				while (position < arguments.length) args.push(arguments[position++]);
				return executeBound(func, bound, this, this, args);
			};
			return bound;
		});
		partial.placeholder = _$1;
		var bind = restArguments(function(func, context, args) {
			if (!isFunction$1(func)) throw new TypeError("Bind must be called on a function");
			var bound = restArguments(function(callArgs) {
				return executeBound(func, bound, context, this, args.concat(callArgs));
			});
			return bound;
		});
		var isArrayLike = createSizePropertyCheck(getLength);
		function flatten$1(input, depth, strict) {
			if (!depth && depth !== 0) depth = Infinity;
			var output = [], idx = 0, i = 0, length = getLength(input) || 0, stack = [];
			while (true) {
				if (i >= length) {
					if (!stack.length) break;
					var frame = stack.pop();
					i = frame.i;
					input = frame.v;
					length = getLength(input);
					continue;
				}
				var value = input[i++];
				if (stack.length >= depth) output[idx++] = value;
				else if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
					stack.push({
						i,
						v: input
					});
					i = 0;
					input = value;
					length = getLength(input);
				} else if (!strict) output[idx++] = value;
			}
			return output;
		}
		var bindAll = restArguments(function(obj, keys) {
			keys = flatten$1(keys, false, false);
			var index = keys.length;
			if (index < 1) throw new Error("bindAll must be passed function names");
			while (index--) {
				var key = keys[index];
				obj[key] = bind(obj[key], obj);
			}
			return obj;
		});
		function memoize(func, hasher) {
			var memoize = function(key) {
				var cache = memoize.cache;
				var address = "" + (hasher ? hasher.apply(this, arguments) : key);
				if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
				return cache[address];
			};
			memoize.cache = {};
			return memoize;
		}
		var delay = restArguments(function(func, wait, args) {
			return setTimeout(function() {
				return func.apply(null, args);
			}, wait);
		});
		var defer = partial(delay, _$1, 1);
		function throttle(func, wait, options) {
			var timeout, context, args, result;
			var previous = 0;
			if (!options) options = {};
			var later = function() {
				previous = options.leading === false ? 0 : now();
				timeout = null;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			};
			var throttled = function() {
				var _now = now();
				if (!previous && options.leading === false) previous = _now;
				var remaining = wait - (_now - previous);
				context = this;
				args = arguments;
				if (remaining <= 0 || remaining > wait) {
					if (timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					previous = _now;
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				} else if (!timeout && options.trailing !== false) timeout = setTimeout(later, remaining);
				return result;
			};
			throttled.cancel = function() {
				clearTimeout(timeout);
				previous = 0;
				timeout = context = args = null;
			};
			return throttled;
		}
		function debounce(func, wait, immediate) {
			var timeout, previous, args, result, context;
			var later = function() {
				var passed = now() - previous;
				if (wait > passed) timeout = setTimeout(later, wait - passed);
				else {
					timeout = null;
					if (!immediate) result = func.apply(context, args);
					if (!timeout) args = context = null;
				}
			};
			var debounced = restArguments(function(_args) {
				context = this;
				args = _args;
				previous = now();
				if (!timeout) {
					timeout = setTimeout(later, wait);
					if (immediate) result = func.apply(context, args);
				}
				return result;
			});
			debounced.cancel = function() {
				clearTimeout(timeout);
				timeout = args = context = null;
			};
			return debounced;
		}
		function wrap(func, wrapper) {
			return partial(wrapper, func);
		}
		function negate(predicate) {
			return function() {
				return !predicate.apply(this, arguments);
			};
		}
		function compose() {
			var args = arguments;
			var start = args.length - 1;
			return function() {
				var i = start;
				var result = args[start].apply(this, arguments);
				while (i--) result = args[i].call(this, result);
				return result;
			};
		}
		function after(times, func) {
			return function() {
				if (--times < 1) return func.apply(this, arguments);
			};
		}
		function before(times, func) {
			var memo;
			return function() {
				if (--times > 0) memo = func.apply(this, arguments);
				if (times <= 1) func = null;
				return memo;
			};
		}
		var once = partial(before, 2);
		function findKey(obj, predicate, context) {
			predicate = cb(predicate, context);
			var _keys = keys(obj), key;
			for (var i = 0, length = _keys.length; i < length; i++) {
				key = _keys[i];
				if (predicate(obj[key], key, obj)) return key;
			}
		}
		function createPredicateIndexFinder(dir) {
			return function(array, predicate, context) {
				predicate = cb(predicate, context);
				var length = getLength(array);
				var index = dir > 0 ? 0 : length - 1;
				for (; index >= 0 && index < length; index += dir) if (predicate(array[index], index, array)) return index;
				return -1;
			};
		}
		var findIndex = createPredicateIndexFinder(1);
		var findLastIndex = createPredicateIndexFinder(-1);
		function sortedIndex(array, obj, iteratee, context) {
			iteratee = cb(iteratee, context, 1);
			var value = iteratee(obj);
			var low = 0, high = getLength(array);
			while (low < high) {
				var mid = Math.floor((low + high) / 2);
				if (iteratee(array[mid]) < value) low = mid + 1;
				else high = mid;
			}
			return low;
		}
		function createIndexFinder(dir, predicateFind, sortedIndex) {
			return function(array, item, idx) {
				var i = 0, length = getLength(array);
				if (typeof idx == "number") if (dir > 0) i = idx >= 0 ? idx : Math.max(idx + length, i);
				else length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
				else if (sortedIndex && idx && length) {
					idx = sortedIndex(array, item);
					return array[idx] === item ? idx : -1;
				}
				if (item !== item) {
					idx = predicateFind(slice.call(array, i, length), isNaN$1);
					return idx >= 0 ? idx + i : -1;
				}
				for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) if (array[idx] === item) return idx;
				return -1;
			};
		}
		var indexOf = createIndexFinder(1, findIndex, sortedIndex);
		var lastIndexOf = createIndexFinder(-1, findLastIndex);
		function find(obj, predicate, context) {
			var key = (isArrayLike(obj) ? findIndex : findKey)(obj, predicate, context);
			if (key !== void 0 && key !== -1) return obj[key];
		}
		function findWhere(obj, attrs) {
			return find(obj, matcher(attrs));
		}
		function each(obj, iteratee, context) {
			iteratee = optimizeCb(iteratee, context);
			var i, length;
			if (isArrayLike(obj)) for (i = 0, length = obj.length; i < length; i++) iteratee(obj[i], i, obj);
			else {
				var _keys = keys(obj);
				for (i = 0, length = _keys.length; i < length; i++) iteratee(obj[_keys[i]], _keys[i], obj);
			}
			return obj;
		}
		function map(obj, iteratee, context) {
			iteratee = cb(iteratee, context);
			var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
			for (var index = 0; index < length; index++) {
				var currentKey = _keys ? _keys[index] : index;
				results[index] = iteratee(obj[currentKey], currentKey, obj);
			}
			return results;
		}
		function createReduce(dir) {
			var reducer = function(obj, iteratee, memo, initial) {
				var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
				if (!initial) {
					memo = obj[_keys ? _keys[index] : index];
					index += dir;
				}
				for (; index >= 0 && index < length; index += dir) {
					var currentKey = _keys ? _keys[index] : index;
					memo = iteratee(memo, obj[currentKey], currentKey, obj);
				}
				return memo;
			};
			return function(obj, iteratee, memo, context) {
				var initial = arguments.length >= 3;
				return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
			};
		}
		var reduce = createReduce(1);
		var reduceRight = createReduce(-1);
		function filter(obj, predicate, context) {
			var results = [];
			predicate = cb(predicate, context);
			each(obj, function(value, index, list) {
				if (predicate(value, index, list)) results.push(value);
			});
			return results;
		}
		function reject(obj, predicate, context) {
			return filter(obj, negate(cb(predicate)), context);
		}
		function every(obj, predicate, context) {
			predicate = cb(predicate, context);
			var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
			for (var index = 0; index < length; index++) {
				var currentKey = _keys ? _keys[index] : index;
				if (!predicate(obj[currentKey], currentKey, obj)) return false;
			}
			return true;
		}
		function some(obj, predicate, context) {
			predicate = cb(predicate, context);
			var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
			for (var index = 0; index < length; index++) {
				var currentKey = _keys ? _keys[index] : index;
				if (predicate(obj[currentKey], currentKey, obj)) return true;
			}
			return false;
		}
		function contains(obj, item, fromIndex, guard) {
			if (!isArrayLike(obj)) obj = values(obj);
			if (typeof fromIndex != "number" || guard) fromIndex = 0;
			return indexOf(obj, item, fromIndex) >= 0;
		}
		var invoke = restArguments(function(obj, path, args) {
			var contextPath, func;
			if (isFunction$1(path)) func = path;
			else {
				path = toPath(path);
				contextPath = path.slice(0, -1);
				path = path[path.length - 1];
			}
			return map(obj, function(context) {
				var method = func;
				if (!method) {
					if (contextPath && contextPath.length) context = deepGet(context, contextPath);
					if (context == null) return void 0;
					method = context[path];
				}
				return method == null ? method : method.apply(context, args);
			});
		});
		function pluck(obj, key) {
			return map(obj, property(key));
		}
		function where(obj, attrs) {
			return filter(obj, matcher(attrs));
		}
		function max(obj, iteratee, context) {
			var result = -Infinity, lastComputed = -Infinity, value, computed;
			if (iteratee == null || typeof iteratee == "number" && typeof obj[0] != "object" && obj != null) {
				obj = isArrayLike(obj) ? obj : values(obj);
				for (var i = 0, length = obj.length; i < length; i++) {
					value = obj[i];
					if (value != null && value > result) result = value;
				}
			} else {
				iteratee = cb(iteratee, context);
				each(obj, function(v, index, list) {
					computed = iteratee(v, index, list);
					if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
						result = v;
						lastComputed = computed;
					}
				});
			}
			return result;
		}
		function min(obj, iteratee, context) {
			var result = Infinity, lastComputed = Infinity, value, computed;
			if (iteratee == null || typeof iteratee == "number" && typeof obj[0] != "object" && obj != null) {
				obj = isArrayLike(obj) ? obj : values(obj);
				for (var i = 0, length = obj.length; i < length; i++) {
					value = obj[i];
					if (value != null && value < result) result = value;
				}
			} else {
				iteratee = cb(iteratee, context);
				each(obj, function(v, index, list) {
					computed = iteratee(v, index, list);
					if (computed < lastComputed || computed === Infinity && result === Infinity) {
						result = v;
						lastComputed = computed;
					}
				});
			}
			return result;
		}
		var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
		function toArray(obj) {
			if (!obj) return [];
			if (isArray(obj)) return slice.call(obj);
			if (isString(obj)) return obj.match(reStrSymbol);
			if (isArrayLike(obj)) return map(obj, identity);
			return values(obj);
		}
		function sample(obj, n, guard) {
			if (n == null || guard) {
				if (!isArrayLike(obj)) obj = values(obj);
				return obj[random(obj.length - 1)];
			}
			var sample = toArray(obj);
			var length = getLength(sample);
			n = Math.max(Math.min(n, length), 0);
			var last = length - 1;
			for (var index = 0; index < n; index++) {
				var rand = random(index, last);
				var temp = sample[index];
				sample[index] = sample[rand];
				sample[rand] = temp;
			}
			return sample.slice(0, n);
		}
		function shuffle(obj) {
			return sample(obj, Infinity);
		}
		function sortBy(obj, iteratee, context) {
			var index = 0;
			iteratee = cb(iteratee, context);
			return pluck(map(obj, function(value, key, list) {
				return {
					value,
					index: index++,
					criteria: iteratee(value, key, list)
				};
			}).sort(function(left, right) {
				var a = left.criteria;
				var b = right.criteria;
				if (a !== b) {
					if (a > b || a === void 0) return 1;
					if (a < b || b === void 0) return -1;
				}
				return left.index - right.index;
			}), "value");
		}
		function group(behavior, partition) {
			return function(obj, iteratee, context) {
				var result = partition ? [[], []] : {};
				iteratee = cb(iteratee, context);
				each(obj, function(value, index) {
					behavior(result, value, iteratee(value, index, obj));
				});
				return result;
			};
		}
		var groupBy = group(function(result, value, key) {
			if (has$1(result, key)) result[key].push(value);
			else result[key] = [value];
		});
		var indexBy = group(function(result, value, key) {
			result[key] = value;
		});
		var countBy = group(function(result, value, key) {
			if (has$1(result, key)) result[key]++;
			else result[key] = 1;
		});
		var partition = group(function(result, value, pass) {
			result[pass ? 0 : 1].push(value);
		}, true);
		function size(obj) {
			if (obj == null) return 0;
			return isArrayLike(obj) ? obj.length : keys(obj).length;
		}
		function keyInObj(value, key, obj) {
			return key in obj;
		}
		var pick = restArguments(function(obj, keys) {
			var result = {}, iteratee = keys[0];
			if (obj == null) return result;
			if (isFunction$1(iteratee)) {
				if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
				keys = allKeys(obj);
			} else {
				iteratee = keyInObj;
				keys = flatten$1(keys, false, false);
				obj = Object(obj);
			}
			for (var i = 0, length = keys.length; i < length; i++) {
				var key = keys[i];
				var value = obj[key];
				if (iteratee(value, key, obj)) result[key] = value;
			}
			return result;
		});
		var omit = restArguments(function(obj, keys) {
			var iteratee = keys[0], context;
			if (isFunction$1(iteratee)) {
				iteratee = negate(iteratee);
				if (keys.length > 1) context = keys[1];
			} else {
				keys = map(flatten$1(keys, false, false), String);
				iteratee = function(value, key) {
					return !contains(keys, key);
				};
			}
			return pick(obj, iteratee, context);
		});
		function initial(array, n, guard) {
			return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
		}
		function first(array, n, guard) {
			if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
			if (n == null || guard) return array[0];
			return initial(array, array.length - n);
		}
		function rest(array, n, guard) {
			return slice.call(array, n == null || guard ? 1 : n);
		}
		function last(array, n, guard) {
			if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
			if (n == null || guard) return array[array.length - 1];
			return rest(array, Math.max(0, array.length - n));
		}
		function compact(array) {
			return filter(array, Boolean);
		}
		function flatten(array, depth) {
			return flatten$1(array, depth, false);
		}
		var difference = restArguments(function(array, rest) {
			rest = flatten$1(rest, true, true);
			return filter(array, function(value) {
				return !contains(rest, value);
			});
		});
		var without = restArguments(function(array, otherArrays) {
			return difference(array, otherArrays);
		});
		function uniq(array, isSorted, iteratee, context) {
			if (!isBoolean(isSorted)) {
				context = iteratee;
				iteratee = isSorted;
				isSorted = false;
			}
			if (iteratee != null) iteratee = cb(iteratee, context);
			var result = [];
			var seen = [];
			for (var i = 0, length = getLength(array); i < length; i++) {
				var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
				if (isSorted && !iteratee) {
					if (!i || seen !== computed) result.push(value);
					seen = computed;
				} else if (iteratee) {
					if (!contains(seen, computed)) {
						seen.push(computed);
						result.push(value);
					}
				} else if (!contains(result, value)) result.push(value);
			}
			return result;
		}
		var union = restArguments(function(arrays) {
			return uniq(flatten$1(arrays, true, true));
		});
		function intersection(array) {
			var result = [];
			var argsLength = arguments.length;
			for (var i = 0, length = getLength(array); i < length; i++) {
				var item = array[i];
				if (contains(result, item)) continue;
				var j;
				for (j = 1; j < argsLength; j++) if (!contains(arguments[j], item)) break;
				if (j === argsLength) result.push(item);
			}
			return result;
		}
		function unzip(array) {
			var length = array && max(array, getLength).length || 0;
			var result = Array(length);
			for (var index = 0; index < length; index++) result[index] = pluck(array, index);
			return result;
		}
		var zip = restArguments(unzip);
		function object(list, values) {
			var result = {};
			for (var i = 0, length = getLength(list); i < length; i++) if (values) result[list[i]] = values[i];
			else result[list[i][0]] = list[i][1];
			return result;
		}
		function range(start, stop, step) {
			if (stop == null) {
				stop = start || 0;
				start = 0;
			}
			if (!step) step = stop < start ? -1 : 1;
			var length = Math.max(Math.ceil((stop - start) / step), 0);
			var range = Array(length);
			for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
			return range;
		}
		function chunk(array, count) {
			if (count == null || count < 1) return [];
			var result = [];
			var i = 0, length = array.length;
			while (i < length) result.push(slice.call(array, i, i += count));
			return result;
		}
		function chainResult(instance, obj) {
			return instance._chain ? _$1(obj).chain() : obj;
		}
		function mixin(obj) {
			each(functions(obj), function(name) {
				var func = _$1[name] = obj[name];
				_$1.prototype[name] = function() {
					var args = [this._wrapped];
					push.apply(args, arguments);
					return chainResult(this, func.apply(_$1, args));
				};
			});
			return _$1;
		}
		each([
			"pop",
			"push",
			"reverse",
			"shift",
			"sort",
			"splice",
			"unshift"
		], function(name) {
			var method = ArrayProto[name];
			_$1.prototype[name] = function() {
				var obj = this._wrapped;
				if (obj != null) {
					method.apply(obj, arguments);
					if ((name === "shift" || name === "splice") && obj.length === 0) delete obj[0];
				}
				return chainResult(this, obj);
			};
		});
		each([
			"concat",
			"join",
			"slice"
		], function(name) {
			var method = ArrayProto[name];
			_$1.prototype[name] = function() {
				var obj = this._wrapped;
				if (obj != null) obj = method.apply(obj, arguments);
				return chainResult(this, obj);
			};
		});
		var _ = mixin({
			__proto__: null,
			VERSION,
			restArguments,
			isObject,
			isNull,
			isUndefined,
			isBoolean,
			isElement,
			isString,
			isNumber,
			isDate,
			isRegExp,
			isError,
			isSymbol,
			isArrayBuffer,
			isDataView: isDataView$1,
			isArray,
			isFunction: isFunction$1,
			isArguments: isArguments$1,
			isFinite: isFinite$1,
			isNaN: isNaN$1,
			isTypedArray: isTypedArray$1,
			isEmpty,
			isMatch,
			isEqual,
			isMap,
			isWeakMap,
			isSet,
			isWeakSet,
			keys,
			allKeys,
			values,
			pairs,
			invert,
			functions,
			methods: functions,
			extend,
			extendOwn,
			assign: extendOwn,
			defaults,
			create,
			clone,
			tap,
			get,
			has,
			mapObject,
			identity,
			constant,
			noop,
			toPath: toPath$1,
			property,
			propertyOf,
			matcher,
			matches: matcher,
			times,
			random,
			now,
			escape: _escape,
			unescape: _unescape,
			templateSettings,
			template,
			result,
			uniqueId,
			chain,
			iteratee,
			partial,
			bind,
			bindAll,
			memoize,
			delay,
			defer,
			throttle,
			debounce,
			wrap,
			negate,
			compose,
			after,
			before,
			once,
			findKey,
			findIndex,
			findLastIndex,
			sortedIndex,
			indexOf,
			lastIndexOf,
			find,
			detect: find,
			findWhere,
			each,
			forEach: each,
			map,
			collect: map,
			reduce,
			foldl: reduce,
			inject: reduce,
			reduceRight,
			foldr: reduceRight,
			filter,
			select: filter,
			reject,
			every,
			all: every,
			some,
			any: some,
			contains,
			includes: contains,
			include: contains,
			invoke,
			pluck,
			where,
			max,
			min,
			shuffle,
			sample,
			sortBy,
			groupBy,
			indexBy,
			countBy,
			partition,
			toArray,
			size,
			pick,
			omit,
			first,
			head: first,
			take: first,
			initial,
			last,
			rest,
			tail: rest,
			drop: rest,
			compact,
			flatten,
			without,
			uniq,
			unique: uniq,
			union,
			intersection,
			difference,
			unzip,
			transpose: unzip,
			zip,
			object,
			range,
			chunk,
			mixin,
			"default": _$1
		});
		_._ = _;
		return _;
	}));
}));
//#endregion
//#region node_modules/lop/lib/TokenIterator.js
var require_TokenIterator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var TokenIterator = module.exports = function(tokens, startIndex) {
		this._tokens = tokens;
		this._startIndex = startIndex || 0;
	};
	TokenIterator.prototype.head = function() {
		return this._tokens[this._startIndex];
	};
	TokenIterator.prototype.tail = function(startIndex) {
		return new TokenIterator(this._tokens, this._startIndex + 1);
	};
	TokenIterator.prototype.toArray = function() {
		return this._tokens.slice(this._startIndex);
	};
	TokenIterator.prototype.end = function() {
		return this._tokens[this._tokens.length - 1];
	};
	TokenIterator.prototype.to = function(end) {
		var start = this.head().source;
		var endToken = end.head() || end.end();
		return start.to(endToken.source);
	};
}));
//#endregion
//#region node_modules/lop/lib/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var TokenIterator = require_TokenIterator();
	exports.Parser = function(options) {
		var parseTokens = function(parser, tokens) {
			return parser(new TokenIterator(tokens));
		};
		return { parseTokens };
	};
}));
//#endregion
//#region node_modules/option/index.js
var require_option = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.none = Object.create({
		value: function() {
			throw new Error("Called value on none");
		},
		isNone: function() {
			return true;
		},
		isSome: function() {
			return false;
		},
		map: function() {
			return exports.none;
		},
		flatMap: function() {
			return exports.none;
		},
		filter: function() {
			return exports.none;
		},
		toArray: function() {
			return [];
		},
		orElse: callOrReturn,
		valueOrElse: callOrReturn
	});
	function callOrReturn(value) {
		if (typeof value == "function") return value();
		else return value;
	}
	exports.some = function(value) {
		return new Some(value);
	};
	var Some = function(value) {
		this._value = value;
	};
	Some.prototype.value = function() {
		return this._value;
	};
	Some.prototype.isNone = function() {
		return false;
	};
	Some.prototype.isSome = function() {
		return true;
	};
	Some.prototype.map = function(func) {
		return new Some(func(this._value));
	};
	Some.prototype.flatMap = function(func) {
		return func(this._value);
	};
	Some.prototype.filter = function(predicate) {
		return predicate(this._value) ? this : exports.none;
	};
	Some.prototype.toArray = function() {
		return [this._value];
	};
	Some.prototype.orElse = function(value) {
		return this;
	};
	Some.prototype.valueOrElse = function(value) {
		return this._value;
	};
	exports.isOption = function(value) {
		return value === exports.none || value instanceof Some;
	};
	exports.fromNullable = function(value) {
		if (value == null) return exports.none;
		return new Some(value);
	};
}));
//#endregion
//#region node_modules/lop/lib/parsing-results.js
var require_parsing_results = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		failure: function(errors, remaining) {
			if (errors.length < 1) throw new Error("Failure must have errors");
			return new Result({
				status: "failure",
				remaining,
				errors
			});
		},
		error: function(errors, remaining) {
			if (errors.length < 1) throw new Error("Failure must have errors");
			return new Result({
				status: "error",
				remaining,
				errors
			});
		},
		success: function(value, remaining, source) {
			return new Result({
				status: "success",
				value,
				source,
				remaining,
				errors: []
			});
		},
		cut: function(remaining) {
			return new Result({
				status: "cut",
				remaining,
				errors: []
			});
		}
	};
	var Result = function(options) {
		this._value = options.value;
		this._status = options.status;
		this._hasValue = options.value !== void 0;
		this._remaining = options.remaining;
		this._source = options.source;
		this._errors = options.errors;
	};
	Result.prototype.map = function(func) {
		if (this._hasValue) return new Result({
			value: func(this._value, this._source),
			status: this._status,
			remaining: this._remaining,
			source: this._source,
			errors: this._errors
		});
		else return this;
	};
	Result.prototype.changeRemaining = function(remaining) {
		return new Result({
			value: this._value,
			status: this._status,
			remaining,
			source: this._source,
			errors: this._errors
		});
	};
	Result.prototype.isSuccess = function() {
		return this._status === "success" || this._status === "cut";
	};
	Result.prototype.isFailure = function() {
		return this._status === "failure";
	};
	Result.prototype.isError = function() {
		return this._status === "error";
	};
	Result.prototype.isCut = function() {
		return this._status === "cut";
	};
	Result.prototype.value = function() {
		return this._value;
	};
	Result.prototype.remaining = function() {
		return this._remaining;
	};
	Result.prototype.source = function() {
		return this._source;
	};
	Result.prototype.errors = function() {
		return this._errors;
	};
}));
//#endregion
//#region node_modules/lop/lib/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.error = function(options) {
		return new Error(options);
	};
	var Error = function(options) {
		this.expected = options.expected;
		this.actual = options.actual;
		this._location = options.location;
	};
	Error.prototype.describe = function() {
		return (this._location ? this._location.describe() + ":\n" : "") + "Expected " + this.expected + "\nbut got " + this.actual;
	};
	Error.prototype.lineNumber = function() {
		return this._location.lineNumber();
	};
	Error.prototype.characterNumber = function() {
		return this._location.characterNumber();
	};
}));
//#endregion
//#region node_modules/lop/lib/lazy-iterators.js
var require_lazy_iterators = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.fromArray = function(array) {
		var index = 0;
		var hasNext = function() {
			return index < array.length;
		};
		return new LazyIterator({
			hasNext,
			next: function() {
				if (!hasNext()) throw new Error("No more elements");
				else return array[index++];
			}
		});
	};
	var LazyIterator = function(iterator) {
		this._iterator = iterator;
	};
	LazyIterator.prototype.map = function(func) {
		var iterator = this._iterator;
		return new LazyIterator({
			hasNext: function() {
				return iterator.hasNext();
			},
			next: function() {
				return func(iterator.next());
			}
		});
	};
	LazyIterator.prototype.filter = function(condition) {
		var iterator = this._iterator;
		var moved = false;
		var hasNext = false;
		var next;
		var moveIfNecessary = function() {
			if (moved) return;
			moved = true;
			hasNext = false;
			while (iterator.hasNext() && !hasNext) {
				next = iterator.next();
				hasNext = condition(next);
			}
		};
		return new LazyIterator({
			hasNext: function() {
				moveIfNecessary();
				return hasNext;
			},
			next: function() {
				moveIfNecessary();
				var toReturn = next;
				moved = false;
				return toReturn;
			}
		});
	};
	LazyIterator.prototype.first = function() {
		var iterator = this._iterator;
		if (this._iterator.hasNext()) return iterator.next();
		else return null;
	};
	LazyIterator.prototype.toArray = function() {
		var result = [];
		while (this._iterator.hasNext()) result.push(this._iterator.next());
		return result;
	};
}));
//#endregion
//#region node_modules/lop/lib/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var options = require_option();
	var results = require_parsing_results();
	var errors = require_errors();
	var lazyIterators = require_lazy_iterators();
	exports.token = function(tokenType, value) {
		var matchValue = value !== void 0;
		return function(input) {
			var token = input.head();
			if (token && token.name === tokenType && (!matchValue || token.value === value)) return results.success(token.value, input.tail(), token.source);
			else return describeTokenMismatch(input, describeToken({
				name: tokenType,
				value
			}));
		};
	};
	exports.tokenOfType = function(tokenType) {
		return exports.token(tokenType);
	};
	exports.firstOf = function(name, parsers) {
		if (!_.isArray(parsers)) parsers = Array.prototype.slice.call(arguments, 1);
		return function(input) {
			return lazyIterators.fromArray(parsers).map(function(parser) {
				return parser(input);
			}).filter(function(result) {
				return result.isSuccess() || result.isError();
			}).first() || describeTokenMismatch(input, name);
		};
	};
	exports.then = function(parser, func) {
		return function(input) {
			var result = parser(input);
			if (!result.map) console.log(result);
			return result.map(func);
		};
	};
	exports.sequence = function() {
		var parsers = Array.prototype.slice.call(arguments, 0);
		var rule = function(input) {
			var result = _.foldl(parsers, function(memo, parser) {
				var result = memo.result;
				var hasCut = memo.hasCut;
				if (!result.isSuccess()) return {
					result,
					hasCut
				};
				var subResult = parser(result.remaining());
				if (subResult.isCut()) return {
					result,
					hasCut: true
				};
				else if (subResult.isSuccess()) {
					var values;
					if (parser.isCaptured) values = result.value().withValue(parser, subResult.value());
					else values = result.value();
					var remaining = subResult.remaining();
					var source = input.to(remaining);
					return {
						result: results.success(values, remaining, source),
						hasCut
					};
				} else if (hasCut) return {
					result: results.error(subResult.errors(), subResult.remaining()),
					hasCut
				};
				else return {
					result: subResult,
					hasCut
				};
			}, {
				result: results.success(new SequenceValues(), input),
				hasCut: false
			}).result;
			var source = input.to(result.remaining());
			return result.map(function(values) {
				return values.withValue(exports.sequence.source, source);
			});
		};
		rule.head = function() {
			var firstCapture = _.find(parsers, isCapturedRule);
			return exports.then(rule, exports.sequence.extract(firstCapture));
		};
		rule.map = function(func) {
			return exports.then(rule, function(result) {
				return func.apply(this, result.toArray());
			});
		};
		function isCapturedRule(subRule) {
			return subRule.isCaptured;
		}
		return rule;
	};
	var SequenceValues = function(values, valuesArray) {
		this._values = values || {};
		this._valuesArray = valuesArray || [];
	};
	SequenceValues.prototype.withValue = function(rule, value) {
		if (rule.captureName && rule.captureName in this._values) throw new Error("Cannot add second value for capture \"" + rule.captureName + "\"");
		else {
			var newValues = _.clone(this._values);
			newValues[rule.captureName] = value;
			return new SequenceValues(newValues, this._valuesArray.concat([value]));
		}
	};
	SequenceValues.prototype.get = function(rule) {
		if (rule.captureName in this._values) return this._values[rule.captureName];
		else throw new Error("No value for capture \"" + rule.captureName + "\"");
	};
	SequenceValues.prototype.toArray = function() {
		return this._valuesArray;
	};
	exports.sequence.capture = function(rule, name) {
		var captureRule = function() {
			return rule.apply(this, arguments);
		};
		captureRule.captureName = name;
		captureRule.isCaptured = true;
		return captureRule;
	};
	exports.sequence.extract = function(rule) {
		return function(result) {
			return result.get(rule);
		};
	};
	exports.sequence.applyValues = function(func) {
		var rules = Array.prototype.slice.call(arguments, 1);
		return function(result) {
			var values = rules.map(function(rule) {
				return result.get(rule);
			});
			return func.apply(this, values);
		};
	};
	exports.sequence.source = { captureName: "☃source☃" };
	exports.sequence.cut = function() {
		return function(input) {
			return results.cut(input);
		};
	};
	exports.optional = function(rule) {
		return function(input) {
			var result = rule(input);
			if (result.isSuccess()) return result.map(options.some);
			else if (result.isFailure()) return results.success(options.none, input);
			else return result;
		};
	};
	exports.zeroOrMoreWithSeparator = function(rule, separator) {
		return repeatedWithSeparator(rule, separator, false);
	};
	exports.oneOrMoreWithSeparator = function(rule, separator) {
		return repeatedWithSeparator(rule, separator, true);
	};
	var zeroOrMore = exports.zeroOrMore = function(rule) {
		return function(input) {
			var values = [];
			var result;
			while ((result = rule(input)) && result.isSuccess()) {
				input = result.remaining();
				values.push(result.value());
			}
			if (result.isError()) return result;
			else return results.success(values, input);
		};
	};
	exports.oneOrMore = function(rule) {
		return exports.oneOrMoreWithSeparator(rule, noOpRule);
	};
	function noOpRule(input) {
		return results.success(null, input);
	}
	var repeatedWithSeparator = function(rule, separator, isOneOrMore) {
		return function(input) {
			var result = rule(input);
			if (result.isSuccess()) {
				var mainRule = exports.sequence.capture(rule, "main");
				var remainingResult = zeroOrMore(exports.then(exports.sequence(separator, mainRule), exports.sequence.extract(mainRule)))(result.remaining());
				return results.success([result.value()].concat(remainingResult.value()), remainingResult.remaining());
			} else if (isOneOrMore || result.isError()) return result;
			else return results.success([], input);
		};
	};
	exports.leftAssociative = function(leftRule, rightRule, func) {
		var rights;
		if (func) rights = [{
			func,
			rule: rightRule
		}];
		else rights = rightRule;
		rights = rights.map(function(right) {
			return exports.then(right.rule, function(rightValue) {
				return function(leftValue, source) {
					return right.func(leftValue, rightValue, source);
				};
			});
		});
		var repeatedRule = exports.firstOf.apply(null, ["rules"].concat(rights));
		return function(input) {
			var start = input;
			var leftResult = leftRule(input);
			if (!leftResult.isSuccess()) return leftResult;
			var repeatedResult = repeatedRule(leftResult.remaining());
			while (repeatedResult.isSuccess()) {
				var remaining = repeatedResult.remaining();
				var source = start.to(repeatedResult.remaining());
				var right = repeatedResult.value();
				leftResult = results.success(right(leftResult.value(), source), remaining, source);
				repeatedResult = repeatedRule(leftResult.remaining());
			}
			if (repeatedResult.isError()) return repeatedResult;
			return leftResult;
		};
	};
	exports.leftAssociative.firstOf = function() {
		return Array.prototype.slice.call(arguments, 0);
	};
	exports.nonConsuming = function(rule) {
		return function(input) {
			return rule(input).changeRemaining(input);
		};
	};
	var describeToken = function(token) {
		if (token.value) return token.name + " \"" + token.value + "\"";
		else return token.name;
	};
	function describeTokenMismatch(input, expected) {
		var error;
		var token = input.head();
		if (token) error = errors.error({
			expected,
			actual: describeToken(token),
			location: token.source
		});
		else error = errors.error({
			expected,
			actual: "end of tokens"
		});
		return results.failure([error], input);
	}
}));
//#endregion
//#region node_modules/lop/lib/StringSource.js
var require_StringSource = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(string, description) {
		return {
			asString: function() {
				return string;
			},
			range: function(startIndex, endIndex) {
				return new StringSourceRange(string, description, startIndex, endIndex);
			}
		};
	};
	var StringSourceRange = function(string, description, startIndex, endIndex) {
		this._string = string;
		this._description = description;
		this._startIndex = startIndex;
		this._endIndex = endIndex;
	};
	StringSourceRange.prototype.to = function(otherRange) {
		return new StringSourceRange(this._string, this._description, this._startIndex, otherRange._endIndex);
	};
	StringSourceRange.prototype.describe = function() {
		var position = this._position();
		return (this._description ? this._description + "\n" : "") + "Line number: " + position.lineNumber + "\nCharacter number: " + position.characterNumber;
	};
	StringSourceRange.prototype.lineNumber = function() {
		return this._position().lineNumber;
	};
	StringSourceRange.prototype.characterNumber = function() {
		return this._position().characterNumber;
	};
	StringSourceRange.prototype._position = function() {
		var self = this;
		var index = 0;
		var nextNewLine = function() {
			return self._string.indexOf("\n", index);
		};
		var lineNumber = 1;
		while (nextNewLine() !== -1 && nextNewLine() < this._startIndex) {
			index = nextNewLine() + 1;
			lineNumber += 1;
		}
		var characterNumber = this._startIndex - index + 1;
		return {
			lineNumber,
			characterNumber
		};
	};
}));
//#endregion
//#region node_modules/lop/lib/Token.js
var require_Token = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(name, value, source) {
		this.name = name;
		this.value = value;
		if (source) this.source = source;
	};
}));
//#endregion
//#region node_modules/lop/lib/bottom-up.js
var require_bottom_up = /* @__PURE__ */ __commonJSMin(((exports) => {
	var rules = require_rules();
	var results = require_parsing_results();
	exports.parser = function(name, prefixRules, infixRuleBuilders) {
		var self = {
			rule,
			leftAssociative,
			rightAssociative
		};
		var infixRules = new InfixRules(infixRuleBuilders.map(createInfixRule));
		var prefixRule = rules.firstOf(name, prefixRules);
		function createInfixRule(infixRuleBuilder) {
			return {
				name: infixRuleBuilder.name,
				rule: lazyRule(infixRuleBuilder.ruleBuilder.bind(null, self))
			};
		}
		function rule() {
			return createRule(infixRules);
		}
		function leftAssociative(name) {
			return createRule(infixRules.untilExclusive(name));
		}
		function rightAssociative(name) {
			return createRule(infixRules.untilInclusive(name));
		}
		function createRule(infixRules) {
			return apply.bind(null, infixRules);
		}
		function apply(infixRules, tokens) {
			var leftResult = prefixRule(tokens);
			if (leftResult.isSuccess()) return infixRules.apply(leftResult);
			else return leftResult;
		}
		return self;
	};
	function InfixRules(infixRules) {
		function untilExclusive(name) {
			return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
		}
		function untilInclusive(name) {
			return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
		}
		function ruleNames() {
			return infixRules.map(function(rule) {
				return rule.name;
			});
		}
		function apply(leftResult) {
			var currentResult;
			var source;
			while (true) {
				currentResult = applyToTokens(leftResult.remaining());
				if (currentResult.isSuccess()) {
					source = leftResult.source().to(currentResult.source());
					leftResult = results.success(currentResult.value()(leftResult.value(), source), currentResult.remaining(), source);
				} else if (currentResult.isFailure()) return leftResult;
				else return currentResult;
			}
		}
		function applyToTokens(tokens) {
			return rules.firstOf("infix", infixRules.map(function(infix) {
				return infix.rule;
			}))(tokens);
		}
		return {
			apply,
			untilExclusive,
			untilInclusive
		};
	}
	exports.infix = function(name, ruleBuilder) {
		function map(func) {
			return exports.infix(name, function(parser) {
				var rule = ruleBuilder(parser);
				return function(tokens) {
					return rule(tokens).map(function(right) {
						return function(left, source) {
							return func(left, right, source);
						};
					});
				};
			});
		}
		return {
			name,
			ruleBuilder,
			map
		};
	};
	var lazyRule = function(ruleBuilder) {
		var rule;
		return function(input) {
			if (!rule) rule = ruleBuilder();
			return rule(input);
		};
	};
}));
//#endregion
//#region node_modules/lop/lib/regex-tokeniser.js
var require_regex_tokeniser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Token = require_Token();
	var StringSource = require_StringSource();
	exports.RegexTokeniser = RegexTokeniser;
	function RegexTokeniser(rules) {
		rules = rules.map(function(rule) {
			return {
				name: rule.name,
				regex: new RegExp(rule.regex.source, "g")
			};
		});
		function tokenise(input, description) {
			var source = new StringSource(input, description);
			var index = 0;
			var tokens = [];
			while (index < input.length) {
				var result = readNextToken(input, index, source);
				index = result.endIndex;
				tokens.push(result.token);
			}
			tokens.push(endToken(input, source));
			return tokens;
		}
		function readNextToken(string, startIndex, source) {
			for (var i = 0; i < rules.length; i++) {
				var regex = rules[i].regex;
				regex.lastIndex = startIndex;
				var result = regex.exec(string);
				if (result) {
					var endIndex = startIndex + result[0].length;
					if (result.index === startIndex && endIndex > startIndex) {
						var value = result[1];
						var token = new Token(rules[i].name, value, source.range(startIndex, endIndex));
						return {
							token,
							endIndex
						};
					}
				}
			}
			var endIndex = startIndex + 1;
			var token = new Token("unrecognisedCharacter", string.substring(startIndex, endIndex), source.range(startIndex, endIndex));
			return {
				token,
				endIndex
			};
		}
		function endToken(input, source) {
			return new Token("end", null, source.range(input.length, input.length));
		}
		return { tokenise };
	}
}));
//#endregion
//#region node_modules/lop/index.js
var require_lop = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.Parser = require_parser().Parser;
	exports.rules = require_rules();
	exports.errors = require_errors();
	exports.results = require_parsing_results();
	exports.StringSource = require_StringSource();
	exports.Token = require_Token();
	exports.bottomUp = require_bottom_up();
	exports.RegexTokeniser = require_regex_tokeniser().RegexTokeniser;
	exports.rule = function(ruleBuilder) {
		var rule;
		return function(input) {
			if (!rule) rule = ruleBuilder();
			return rule(input);
		};
	};
}));
//#endregion
export { require_underscore_umd as n, require_lop as t };
