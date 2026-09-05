import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { n as require_underscore_umd, t as require_lop } from "./lop+option+underscore.mjs";
import { t as require_promise } from "./bluebird.mjs";
import { t as require_base64_js } from "./base64-js.mjs";
import { t as require_lib$2 } from "./jszip+[...].mjs";
import { n as require_dom, t as require_lib$3 } from "./xmldom__xmldom.mjs";
import { t as require_dist } from "./dingbat-to-unicode.mjs";
import processModule from "node:process";
import { Buffer } from "node:buffer";
//#region node_modules/mammoth/lib/promises.js
var require_promises = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var bluebird = require_promise()();
	exports.defer = defer;
	exports.when = bluebird.resolve;
	exports.resolve = bluebird.resolve;
	exports.all = bluebird.all;
	exports.props = bluebird.props;
	exports.reject = bluebird.reject;
	exports.promisify = bluebird.promisify;
	exports.mapSeries = bluebird.mapSeries;
	exports.attempt = bluebird.attempt;
	exports.nfcall = function(func) {
		var args = Array.prototype.slice.call(arguments, 1);
		return bluebird.promisify(func).apply(null, args);
	};
	bluebird.prototype.fail = bluebird.prototype.caught;
	bluebird.prototype.also = function(func) {
		return this.then(function(value) {
			var returnValue = _.extend({}, value, func(value));
			return bluebird.props(returnValue);
		});
	};
	function defer() {
		var resolve;
		var reject;
		var promise = new bluebird.Promise(function(resolveArg, rejectArg) {
			resolve = resolveArg;
			reject = rejectArg;
		});
		return {
			resolve,
			reject,
			promise
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/documents.js
var require_documents = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var types = exports.types = {
		document: "document",
		paragraph: "paragraph",
		run: "run",
		text: "text",
		tab: "tab",
		checkbox: "checkbox",
		hyperlink: "hyperlink",
		noteReference: "noteReference",
		image: "image",
		note: "note",
		commentReference: "commentReference",
		comment: "comment",
		table: "table",
		tableRow: "tableRow",
		tableCell: "tableCell",
		"break": "break",
		bookmarkStart: "bookmarkStart"
	};
	function Document(children, options) {
		options = options || {};
		return {
			type: types.document,
			children,
			notes: options.notes || new Notes({}),
			comments: options.comments || []
		};
	}
	function Paragraph(children, properties) {
		properties = properties || {};
		var indent = properties.indent || {};
		return {
			type: types.paragraph,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null,
			numbering: properties.numbering || null,
			alignment: properties.alignment || null,
			indent: {
				start: indent.start || null,
				end: indent.end || null,
				firstLine: indent.firstLine || null,
				hanging: indent.hanging || null
			}
		};
	}
	function Run(children, properties) {
		properties = properties || {};
		return {
			type: types.run,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null,
			isBold: !!properties.isBold,
			isUnderline: !!properties.isUnderline,
			isItalic: !!properties.isItalic,
			isStrikethrough: !!properties.isStrikethrough,
			isAllCaps: !!properties.isAllCaps,
			isSmallCaps: !!properties.isSmallCaps,
			verticalAlignment: properties.verticalAlignment || verticalAlignment.baseline,
			font: properties.font || null,
			fontSize: properties.fontSize || null,
			highlight: properties.highlight || null
		};
	}
	var verticalAlignment = {
		baseline: "baseline",
		superscript: "superscript",
		subscript: "subscript"
	};
	function Text(value) {
		return {
			type: types.text,
			value
		};
	}
	function Tab() {
		return { type: types.tab };
	}
	function Checkbox(options) {
		return {
			type: types.checkbox,
			checked: options.checked
		};
	}
	function Hyperlink(children, options) {
		return {
			type: types.hyperlink,
			children,
			href: options.href,
			anchor: options.anchor,
			targetFrame: options.targetFrame
		};
	}
	function NoteReference(options) {
		return {
			type: types.noteReference,
			noteType: options.noteType,
			noteId: options.noteId
		};
	}
	function Notes(notes) {
		this._notes = _.indexBy(notes, function(note) {
			return noteKey(note.noteType, note.noteId);
		});
	}
	Notes.prototype.resolve = function(reference) {
		return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
	};
	Notes.prototype.findNoteByKey = function(key) {
		return this._notes[key] || null;
	};
	function Note(options) {
		return {
			type: types.note,
			noteType: options.noteType,
			noteId: options.noteId,
			body: options.body
		};
	}
	function commentReference(options) {
		return {
			type: types.commentReference,
			commentId: options.commentId
		};
	}
	function comment(options) {
		return {
			type: types.comment,
			commentId: options.commentId,
			body: options.body,
			authorName: options.authorName,
			authorInitials: options.authorInitials
		};
	}
	function noteKey(noteType, id) {
		return noteType + "-" + id;
	}
	function Image(options) {
		return {
			type: types.image,
			read: function(encoding) {
				if (encoding) return options.readImage(encoding);
				else return options.readImage().then(function(arrayBuffer) {
					return Buffer.from(arrayBuffer);
				});
			},
			readAsArrayBuffer: function() {
				return options.readImage();
			},
			readAsBase64String: function() {
				return options.readImage("base64");
			},
			readAsBuffer: function() {
				return options.readImage().then(function(arrayBuffer) {
					return Buffer.from(arrayBuffer);
				});
			},
			altText: options.altText,
			contentType: options.contentType
		};
	}
	function Table(children, properties) {
		properties = properties || {};
		return {
			type: types.table,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null
		};
	}
	function TableRow(children, options) {
		options = options || {};
		return {
			type: types.tableRow,
			children,
			isHeader: options.isHeader || false
		};
	}
	function TableCell(children, options) {
		options = options || {};
		return {
			type: types.tableCell,
			children,
			colSpan: options.colSpan == null ? 1 : options.colSpan,
			rowSpan: options.rowSpan == null ? 1 : options.rowSpan
		};
	}
	function Break(breakType) {
		return {
			type: types["break"],
			breakType
		};
	}
	function BookmarkStart(options) {
		return {
			type: types.bookmarkStart,
			name: options.name
		};
	}
	exports.document = exports.Document = Document;
	exports.paragraph = exports.Paragraph = Paragraph;
	exports.run = exports.Run = Run;
	exports.text = exports.Text = Text;
	exports.tab = exports.Tab = Tab;
	exports.checkbox = exports.Checkbox = Checkbox;
	exports.Hyperlink = Hyperlink;
	exports.noteReference = exports.NoteReference = NoteReference;
	exports.Notes = Notes;
	exports.Note = Note;
	exports.commentReference = commentReference;
	exports.comment = comment;
	exports.Image = Image;
	exports.Table = Table;
	exports.TableRow = TableRow;
	exports.TableCell = TableCell;
	exports.lineBreak = Break("line");
	exports.pageBreak = Break("page");
	exports.columnBreak = Break("column");
	exports.BookmarkStart = BookmarkStart;
	exports.verticalAlignment = verticalAlignment;
}));
//#endregion
//#region node_modules/mammoth/lib/results.js
var require_results = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	exports.Result = Result;
	exports.success = success;
	exports.warning = warning;
	exports.error = error;
	function Result(value, messages) {
		this.value = value;
		this.messages = messages || [];
	}
	Result.prototype.map = function(func) {
		return new Result(func(this.value), this.messages);
	};
	Result.prototype.flatMap = function(func) {
		var funcResult = func(this.value);
		return new Result(funcResult.value, combineMessages([this, funcResult]));
	};
	Result.prototype.flatMapThen = function(func) {
		var that = this;
		return func(this.value).then(function(otherResult) {
			return new Result(otherResult.value, combineMessages([that, otherResult]));
		});
	};
	Result.combine = function(results) {
		return new Result(_.flatten(_.pluck(results, "value")), combineMessages(results));
	};
	function success(value) {
		return new Result(value, []);
	}
	function warning(message) {
		return {
			type: "warning",
			message
		};
	}
	function error(exception) {
		return {
			type: "error",
			message: exception.message,
			error: exception
		};
	}
	function combineMessages(results) {
		var messages = [];
		_.flatten(_.pluck(results, "messages"), true).forEach(function(message) {
			if (!containsMessage(messages, message)) messages.push(message);
		});
		return messages;
	}
	function containsMessage(messages, message) {
		return _.find(messages, isSameMessage.bind(null, message)) !== void 0;
	}
	function isSameMessage(first, second) {
		return first.type === second.type && first.message === second.message;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/zipfile.js
var require_zipfile = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64js = require_base64_js();
	var JSZip = require_lib$2();
	exports.openArrayBuffer = openArrayBuffer;
	exports.splitPath = splitPath;
	exports.joinPath = joinPath;
	function openArrayBuffer(arrayBuffer) {
		return JSZip.loadAsync(arrayBuffer).then(function(zipFile) {
			function exists(name) {
				return zipFile.file(name) !== null;
			}
			function read(name, encoding) {
				return zipFile.file(name).async("uint8array").then(function(array) {
					if (encoding === "base64") return base64js.fromByteArray(array);
					else if (encoding) return new TextDecoder(encoding).decode(array);
					else return array;
				});
			}
			function write(name, contents) {
				zipFile.file(name, contents);
			}
			function toArrayBuffer() {
				return zipFile.generateAsync({ type: "arraybuffer" });
			}
			return {
				exists,
				read,
				write,
				toArrayBuffer
			};
		});
	}
	function splitPath(path) {
		var lastIndex = path.lastIndexOf("/");
		if (lastIndex === -1) return {
			dirname: "",
			basename: path
		};
		else return {
			dirname: path.substring(0, lastIndex),
			basename: path.substring(lastIndex + 1)
		};
	}
	function joinPath() {
		var nonEmptyPaths = Array.prototype.filter.call(arguments, function(path) {
			return path;
		});
		var relevantPaths = [];
		nonEmptyPaths.forEach(function(path) {
			if (/^\//.test(path)) relevantPaths = [path];
			else relevantPaths.push(path);
		});
		return relevantPaths.join("/");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/xml/nodes.js
var require_nodes = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	exports.Element = Element;
	exports.element = function(name, attributes, children) {
		return new Element(name, attributes, children);
	};
	exports.text = function(value) {
		return {
			type: "text",
			value
		};
	};
	var emptyElement = exports.emptyElement = {
		first: function() {
			return null;
		},
		firstOrEmpty: function() {
			return emptyElement;
		},
		attributes: {},
		children: []
	};
	function Element(name, attributes, children) {
		this.type = "element";
		this.name = name;
		this.attributes = attributes || {};
		this.children = children || [];
	}
	Element.prototype.first = function(name) {
		return _.find(this.children, function(child) {
			return child.name === name;
		});
	};
	Element.prototype.firstOrEmpty = function(name) {
		return this.first(name) || emptyElement;
	};
	Element.prototype.getElementsByTagName = function(name) {
		return toElementList(_.filter(this.children, function(child) {
			return child.name === name;
		}));
	};
	Element.prototype.text = function() {
		if (this.children.length === 0) return "";
		else if (this.children.length !== 1 || this.children[0].type !== "text") throw new Error("Not implemented");
		return this.children[0].value;
	};
	var elementListPrototype = { getElementsByTagName: function(name) {
		return toElementList(_.flatten(this.map(function(element) {
			return element.getElementsByTagName(name);
		}, true)));
	} };
	function toElementList(array) {
		return _.extend(array, elementListPrototype);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/xml/xmldom.js
var require_xmldom = /* @__PURE__ */ __commonJSMin(((exports) => {
	var xmldom = require_lib$3();
	var dom = require_dom();
	function parseFromString(string) {
		var error = null;
		var document = new xmldom.DOMParser({ errorHandler: function(level, message) {
			error = {
				level,
				message
			};
		} }).parseFromString(string);
		if (error === null) return document;
		else throw new Error(error.level + ": " + error.message);
	}
	exports.parseFromString = parseFromString;
	exports.Node = dom.Node;
}));
//#endregion
//#region node_modules/mammoth/lib/xml/reader.js
var require_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	var promises = require_promises();
	var _ = require_underscore_umd();
	var xmldom = require_xmldom();
	var nodes = require_nodes();
	var Element = nodes.Element;
	exports.readString = readString;
	var Node = xmldom.Node;
	function readString(xmlString, namespaceMap) {
		namespaceMap = namespaceMap || {};
		try {
			var document = xmldom.parseFromString(xmlString, "text/xml");
		} catch (error) {
			return promises.reject(error);
		}
		if (document.documentElement.tagName === "parsererror") return promises.resolve(new Error(document.documentElement.textContent));
		function convertNode(node) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE: return convertElement(node);
				case Node.TEXT_NODE: return nodes.text(node.nodeValue);
			}
		}
		function convertElement(element) {
			var convertedName = convertName(element);
			var convertedChildren = [];
			_.forEach(element.childNodes, function(childNode) {
				var convertedNode = convertNode(childNode);
				if (convertedNode) convertedChildren.push(convertedNode);
			});
			var convertedAttributes = Object.create(null);
			_.forEach(element.attributes, function(attribute) {
				convertedAttributes[convertName(attribute)] = attribute.value;
			});
			return new Element(convertedName, convertedAttributes, convertedChildren);
		}
		function convertName(node) {
			if (node.namespaceURI) {
				var mappedPrefix = namespaceMap[node.namespaceURI];
				var prefix;
				if (mappedPrefix) prefix = mappedPrefix + ":";
				else prefix = "{" + node.namespaceURI + "}";
				return prefix + node.localName;
			} else return node.localName;
		}
		return promises.resolve(convertNode(document.documentElement));
	}
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/Utility.js
var require_Utility = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
		assign = function() {
			var i, key, len, source, sources, target = arguments[0];
			sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
			if (isFunction(Object.assign)) Object.assign.apply(null, arguments);
			else for (i = 0, len = sources.length; i < len; i++) {
				source = sources[i];
				if (source != null) for (key in source) {
					if (!hasProp.call(source, key)) continue;
					target[key] = source[key];
				}
			}
			return target;
		};
		isFunction = function(val) {
			return !!val && Object.prototype.toString.call(val) === "[object Function]";
		};
		isObject = function(val) {
			var ref;
			return !!val && ((ref = typeof val) === "function" || ref === "object");
		};
		isArray = function(val) {
			if (isFunction(Array.isArray)) return Array.isArray(val);
			else return Object.prototype.toString.call(val) === "[object Array]";
		};
		isEmpty = function(val) {
			var key;
			if (isArray(val)) return !val.length;
			else {
				for (key in val) {
					if (!hasProp.call(val, key)) continue;
					return false;
				}
				return true;
			}
		};
		isPlainObject = function(val) {
			var ctor, proto;
			return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
		};
		getValue = function(obj) {
			if (isFunction(obj.valueOf)) return obj.valueOf();
			else return obj;
		};
		module.exports.assign = assign;
		module.exports.isFunction = isFunction;
		module.exports.isObject = isObject;
		module.exports.isArray = isArray;
		module.exports.isEmpty = isEmpty;
		module.exports.isPlainObject = isPlainObject;
		module.exports.getValue = getValue;
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		module.exports = (function() {
			function XMLAttribute(parent, name, value) {
				this.options = parent.options;
				this.stringify = parent.stringify;
				this.parent = parent;
				if (name == null) throw new Error("Missing attribute name. " + this.debugInfo(name));
				if (value == null) throw new Error("Missing attribute value. " + this.debugInfo(name));
				this.name = this.stringify.attName(name);
				this.value = this.stringify.attValue(value);
			}
			XMLAttribute.prototype.clone = function() {
				return Object.create(this);
			};
			XMLAttribute.prototype.toString = function(options) {
				return this.options.writer.set(options).attribute(this);
			};
			XMLAttribute.prototype.debugInfo = function(name) {
				name = name || this.name;
				if (name == null) return "parent: <" + this.parent.name + ">";
				else return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
			};
			return XMLAttribute;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLAttribute, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
		XMLNode = require_XMLNode();
		XMLAttribute = require_XMLAttribute();
		module.exports = (function(superClass) {
			extend(XMLElement, superClass);
			function XMLElement(parent, name, attributes) {
				XMLElement.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing element name. " + this.debugInfo());
				this.name = this.stringify.eleName(name);
				this.attributes = {};
				if (attributes != null) this.attribute(attributes);
				if (parent.isDocument) {
					this.isRoot = true;
					this.documentObject = parent;
					parent.rootObject = this;
				}
			}
			XMLElement.prototype.clone = function() {
				var att, attName, clonedSelf = Object.create(this), ref1;
				if (clonedSelf.isRoot) clonedSelf.documentObject = null;
				clonedSelf.attributes = {};
				ref1 = this.attributes;
				for (attName in ref1) {
					if (!hasProp.call(ref1, attName)) continue;
					att = ref1[attName];
					clonedSelf.attributes[attName] = att.clone();
				}
				clonedSelf.children = [];
				this.children.forEach(function(child) {
					var clonedChild = child.clone();
					clonedChild.parent = clonedSelf;
					return clonedSelf.children.push(clonedChild);
				});
				return clonedSelf;
			};
			XMLElement.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (name != null) name = getValue(name);
				if (isObject(name)) for (attName in name) {
					if (!hasProp.call(name, attName)) continue;
					attValue = name[attName];
					this.attribute(attName, attValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					if (!this.options.skipNullAttributes || value != null) this.attributes[name] = new XMLAttribute(this, name, value);
				}
				return this;
			};
			XMLElement.prototype.removeAttribute = function(name) {
				var attName, i, len;
				if (name == null) throw new Error("Missing attribute name. " + this.debugInfo());
				name = getValue(name);
				if (Array.isArray(name)) for (i = 0, len = name.length; i < len; i++) {
					attName = name[i];
					delete this.attributes[attName];
				}
				else delete this.attributes[name];
				return this;
			};
			XMLElement.prototype.toString = function(options) {
				return this.options.writer.set(options).element(this);
			};
			XMLElement.prototype.att = function(name, value) {
				return this.attribute(name, value);
			};
			XMLElement.prototype.a = function(name, value) {
				return this.attribute(name, value);
			};
			return XMLElement;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLCData, superClass);
			function XMLCData(parent, text) {
				XMLCData.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing CDATA text. " + this.debugInfo());
				this.text = this.stringify.cdata(text);
			}
			XMLCData.prototype.clone = function() {
				return Object.create(this);
			};
			XMLCData.prototype.toString = function(options) {
				return this.options.writer.set(options).cdata(this);
			};
			return XMLCData;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLComment, superClass);
			function XMLComment(parent, text) {
				XMLComment.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing comment text. " + this.debugInfo());
				this.text = this.stringify.comment(text);
			}
			XMLComment.prototype.clone = function() {
				return Object.create(this);
			};
			XMLComment.prototype.toString = function(options) {
				return this.options.writer.set(options).comment(this);
			};
			return XMLComment;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDeclaration, superClass);
			function XMLDeclaration(parent, version, encoding, standalone) {
				var ref;
				XMLDeclaration.__super__.constructor.call(this, parent);
				if (isObject(version)) ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
				if (!version) version = "1.0";
				this.version = this.stringify.xmlVersion(version);
				if (encoding != null) this.encoding = this.stringify.xmlEncoding(encoding);
				if (standalone != null) this.standalone = this.stringify.xmlStandalone(standalone);
			}
			XMLDeclaration.prototype.toString = function(options) {
				return this.options.writer.set(options).declaration(this);
			};
			return XMLDeclaration;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDAttList, superClass);
			function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				XMLDTDAttList.__super__.constructor.call(this, parent);
				if (elementName == null) throw new Error("Missing DTD element name. " + this.debugInfo());
				if (attributeName == null) throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
				if (!attributeType) throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
				if (!defaultValueType) throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
				if (defaultValueType.indexOf("#") !== 0) defaultValueType = "#" + defaultValueType;
				if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				this.elementName = this.stringify.eleName(elementName);
				this.attributeName = this.stringify.attName(attributeName);
				this.attributeType = this.stringify.dtdAttType(attributeType);
				this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
				this.defaultValueType = defaultValueType;
			}
			XMLDTDAttList.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdAttList(this);
			};
			return XMLDTDAttList;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDEntity, superClass);
			function XMLDTDEntity(parent, pe, name, value) {
				XMLDTDEntity.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD entity name. " + this.debugInfo(name));
				if (value == null) throw new Error("Missing DTD entity value. " + this.debugInfo(name));
				this.pe = !!pe;
				this.name = this.stringify.eleName(name);
				if (!isObject(value)) this.value = this.stringify.dtdEntityValue(value);
				else {
					if (!value.pubID && !value.sysID) throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
					if (value.pubID && !value.sysID) throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
					if (value.pubID != null) this.pubID = this.stringify.dtdPubID(value.pubID);
					if (value.sysID != null) this.sysID = this.stringify.dtdSysID(value.sysID);
					if (value.nData != null) this.nData = this.stringify.dtdNData(value.nData);
					if (this.pe && this.nData) throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
				}
			}
			XMLDTDEntity.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdEntity(this);
			};
			return XMLDTDEntity;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDElement, superClass);
			function XMLDTDElement(parent, name, value) {
				XMLDTDElement.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD element name. " + this.debugInfo());
				if (!value) value = "(#PCDATA)";
				if (Array.isArray(value)) value = "(" + value.join(",") + ")";
				this.name = this.stringify.eleName(name);
				this.value = this.stringify.dtdElementValue(value);
			}
			XMLDTDElement.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdElement(this);
			};
			return XMLDTDElement;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDNotation, superClass);
			function XMLDTDNotation(parent, name, value) {
				XMLDTDNotation.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD notation name. " + this.debugInfo(name));
				if (!value.pubID && !value.sysID) throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
				this.name = this.stringify.eleName(name);
				if (value.pubID != null) this.pubID = this.stringify.dtdPubID(value.pubID);
				if (value.sysID != null) this.sysID = this.stringify.dtdSysID(value.sysID);
			}
			XMLDTDNotation.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdNotation(this);
			};
			return XMLDTDNotation;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDNotation = require_XMLDTDNotation();
		module.exports = (function(superClass) {
			extend(XMLDocType, superClass);
			function XMLDocType(parent, pubID, sysID) {
				var ref, ref1;
				XMLDocType.__super__.constructor.call(this, parent);
				this.name = "!DOCTYPE";
				this.documentObject = parent;
				if (isObject(pubID)) ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
				if (sysID == null) ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
				if (pubID != null) this.pubID = this.stringify.dtdPubID(pubID);
				if (sysID != null) this.sysID = this.stringify.dtdSysID(sysID);
			}
			XMLDocType.prototype.element = function(name, value) {
				var child = new XMLDTDElement(this, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.entity = function(name, value) {
				var child = new XMLDTDEntity(this, false, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.pEntity = function(name, value) {
				var child = new XMLDTDEntity(this, true, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.notation = function(name, value) {
				var child = new XMLDTDNotation(this, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.toString = function(options) {
				return this.options.writer.set(options).docType(this);
			};
			XMLDocType.prototype.ele = function(name, value) {
				return this.element(name, value);
			};
			XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
			};
			XMLDocType.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};
			XMLDocType.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};
			XMLDocType.prototype.not = function(name, value) {
				return this.notation(name, value);
			};
			XMLDocType.prototype.up = function() {
				return this.root() || this.documentObject;
			};
			return XMLDocType;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLRaw, superClass);
			function XMLRaw(parent, text) {
				XMLRaw.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing raw text. " + this.debugInfo());
				this.value = this.stringify.raw(text);
			}
			XMLRaw.prototype.clone = function() {
				return Object.create(this);
			};
			XMLRaw.prototype.toString = function(options) {
				return this.options.writer.set(options).raw(this);
			};
			return XMLRaw;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLText, superClass);
			function XMLText(parent, text) {
				XMLText.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing element text. " + this.debugInfo());
				this.value = this.stringify.eleText(text);
			}
			XMLText.prototype.clone = function() {
				return Object.create(this);
			};
			XMLText.prototype.toString = function(options) {
				return this.options.writer.set(options).text(this);
			};
			return XMLText;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLProcessingInstruction, superClass);
			function XMLProcessingInstruction(parent, target, value) {
				XMLProcessingInstruction.__super__.constructor.call(this, parent);
				if (target == null) throw new Error("Missing instruction target. " + this.debugInfo());
				this.target = this.stringify.insTarget(target);
				if (value) this.value = this.stringify.insValue(value);
			}
			XMLProcessingInstruction.prototype.clone = function() {
				return Object.create(this);
			};
			XMLProcessingInstruction.prototype.toString = function(options) {
				return this.options.writer.set(options).processingInstruction(this);
			};
			return XMLProcessingInstruction;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDummy, superClass);
			function XMLDummy(parent) {
				XMLDummy.__super__.constructor.call(this, parent);
				this.isDummy = true;
			}
			XMLDummy.prototype.clone = function() {
				return Object.create(this);
			};
			XMLDummy.prototype.toString = function(options) {
				return "";
			};
			return XMLDummy;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty, getValue = ref.getValue;
		XMLElement = null;
		XMLCData = null;
		XMLComment = null;
		XMLDeclaration = null;
		XMLDocType = null;
		XMLRaw = null;
		XMLText = null;
		XMLProcessingInstruction = null;
		XMLDummy = null;
		module.exports = (function() {
			function XMLNode(parent) {
				this.parent = parent;
				if (this.parent) {
					this.options = this.parent.options;
					this.stringify = this.parent.stringify;
				}
				this.children = [];
				if (!XMLElement) {
					XMLElement = require_XMLElement();
					XMLCData = require_XMLCData();
					XMLComment = require_XMLComment();
					XMLDeclaration = require_XMLDeclaration();
					XMLDocType = require_XMLDocType();
					XMLRaw = require_XMLRaw();
					XMLText = require_XMLText();
					XMLProcessingInstruction = require_XMLProcessingInstruction();
					XMLDummy = require_XMLDummy();
				}
			}
			XMLNode.prototype.element = function(name, attributes, text) {
				var childNode, item, j, k, key, lastChild = null, len, len1, ref1, ref2, val;
				if (attributes === null && text == null) ref1 = [{}, null], attributes = ref1[0], text = ref1[1];
				if (attributes == null) attributes = {};
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
				if (name != null) name = getValue(name);
				if (Array.isArray(name)) for (j = 0, len = name.length; j < len; j++) {
					item = name[j];
					lastChild = this.element(item);
				}
				else if (isFunction(name)) lastChild = this.element(name.apply());
				else if (isObject(name)) for (key in name) {
					if (!hasProp.call(name, key)) continue;
					val = name[key];
					if (isFunction(val)) val = val.apply();
					if (isObject(val) && isEmpty(val)) val = null;
					if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
					else if (!this.options.separateArrayItems && Array.isArray(val)) for (k = 0, len1 = val.length; k < len1; k++) {
						item = val[k];
						childNode = {};
						childNode[key] = item;
						lastChild = this.element(childNode);
					}
					else if (isObject(val)) {
						lastChild = this.element(key);
						lastChild.element(val);
					} else lastChild = this.element(key, val);
				}
				else if (this.options.skipNullNodes && text === null) lastChild = this.dummy();
				else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) lastChild = this.text(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) lastChild = this.cdata(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) lastChild = this.comment(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) lastChild = this.raw(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
				else lastChild = this.node(name, attributes, text);
				if (lastChild == null) throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
				return lastChild;
			};
			XMLNode.prototype.insertBefore = function(name, attributes, text) {
				var child, i, removed;
				if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i);
				child = this.parent.element(name, attributes, text);
				Array.prototype.push.apply(this.parent.children, removed);
				return child;
			};
			XMLNode.prototype.insertAfter = function(name, attributes, text) {
				var child, i, removed;
				if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i + 1);
				child = this.parent.element(name, attributes, text);
				Array.prototype.push.apply(this.parent.children, removed);
				return child;
			};
			XMLNode.prototype.remove = function() {
				var i;
				if (this.isRoot) throw new Error("Cannot remove the root element. " + this.debugInfo());
				i = this.parent.children.indexOf(this);
				[].splice.apply(this.parent.children, [i, i - i + 1].concat([]));
				return this.parent;
			};
			XMLNode.prototype.node = function(name, attributes, text) {
				var child, ref1;
				if (name != null) name = getValue(name);
				attributes || (attributes = {});
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
				child = new XMLElement(this, name, attributes);
				if (text != null) child.text(text);
				this.children.push(child);
				return child;
			};
			XMLNode.prototype.text = function(value) {
				var child = new XMLText(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.cdata = function(value) {
				var child = new XMLCData(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.comment = function(value) {
				var child = new XMLComment(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.commentBefore = function(value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i);
				this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.commentAfter = function(value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i + 1);
				this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.raw = function(value) {
				var child = new XMLRaw(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.dummy = function() {
				var child = new XMLDummy(this);
				this.children.push(child);
				return child;
			};
			XMLNode.prototype.instruction = function(target, value) {
				var insTarget, insValue, instruction, j, len;
				if (target != null) target = getValue(target);
				if (value != null) value = getValue(value);
				if (Array.isArray(target)) for (j = 0, len = target.length; j < len; j++) {
					insTarget = target[j];
					this.instruction(insTarget);
				}
				else if (isObject(target)) for (insTarget in target) {
					if (!hasProp.call(target, insTarget)) continue;
					insValue = target[insTarget];
					this.instruction(insTarget, insValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					instruction = new XMLProcessingInstruction(this, target, value);
					this.children.push(instruction);
				}
				return this;
			};
			XMLNode.prototype.instructionBefore = function(target, value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i);
				this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.instructionAfter = function(target, value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i + 1);
				this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.declaration = function(version, encoding, standalone) {
				var doc = this.document(), xmldec = new XMLDeclaration(doc, version, encoding, standalone);
				if (doc.children[0] instanceof XMLDeclaration) doc.children[0] = xmldec;
				else doc.children.unshift(xmldec);
				return doc.root() || doc;
			};
			XMLNode.prototype.doctype = function(pubID, sysID) {
				var child, doc = this.document(), doctype = new XMLDocType(doc, pubID, sysID), i, j, k, len, len1, ref1 = doc.children, ref2;
				for (i = j = 0, len = ref1.length; j < len; i = ++j) {
					child = ref1[i];
					if (child instanceof XMLDocType) {
						doc.children[i] = doctype;
						return doctype;
					}
				}
				ref2 = doc.children;
				for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
					child = ref2[i];
					if (child.isRoot) {
						doc.children.splice(i, 0, doctype);
						return doctype;
					}
				}
				doc.children.push(doctype);
				return doctype;
			};
			XMLNode.prototype.up = function() {
				if (this.isRoot) throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
				return this.parent;
			};
			XMLNode.prototype.root = function() {
				var node = this;
				while (node) if (node.isDocument) return node.rootObject;
				else if (node.isRoot) return node;
				else node = node.parent;
			};
			XMLNode.prototype.document = function() {
				var node = this;
				while (node) if (node.isDocument) return node;
				else node = node.parent;
			};
			XMLNode.prototype.end = function(options) {
				return this.document().end(options);
			};
			XMLNode.prototype.prev = function() {
				var i = this.parent.children.indexOf(this);
				while (i > 0 && this.parent.children[i - 1].isDummy) i = i - 1;
				if (i < 1) throw new Error("Already at the first node. " + this.debugInfo());
				return this.parent.children[i - 1];
			};
			XMLNode.prototype.next = function() {
				var i = this.parent.children.indexOf(this);
				while (i < this.parent.children.length - 1 && this.parent.children[i + 1].isDummy) i = i + 1;
				if (i === -1 || i === this.parent.children.length - 1) throw new Error("Already at the last node. " + this.debugInfo());
				return this.parent.children[i + 1];
			};
			XMLNode.prototype.importDocument = function(doc) {
				var clonedRoot = doc.root().clone();
				clonedRoot.parent = this;
				clonedRoot.isRoot = false;
				this.children.push(clonedRoot);
				return this;
			};
			XMLNode.prototype.debugInfo = function(name) {
				var ref1, ref2;
				name = name || this.name;
				if (name == null && !((ref1 = this.parent) != null ? ref1.name : void 0)) return "";
				else if (name == null) return "parent: <" + this.parent.name + ">";
				else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) return "node: <" + name + ">";
				else return "node: <" + name + ">, parent: <" + this.parent.name + ">";
			};
			XMLNode.prototype.ele = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLNode.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLNode.prototype.txt = function(value) {
				return this.text(value);
			};
			XMLNode.prototype.dat = function(value) {
				return this.cdata(value);
			};
			XMLNode.prototype.com = function(value) {
				return this.comment(value);
			};
			XMLNode.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};
			XMLNode.prototype.doc = function() {
				return this.document();
			};
			XMLNode.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};
			XMLNode.prototype.dtd = function(pubID, sysID) {
				return this.doctype(pubID, sysID);
			};
			XMLNode.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLNode.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLNode.prototype.t = function(value) {
				return this.text(value);
			};
			XMLNode.prototype.d = function(value) {
				return this.cdata(value);
			};
			XMLNode.prototype.c = function(value) {
				return this.comment(value);
			};
			XMLNode.prototype.r = function(value) {
				return this.raw(value);
			};
			XMLNode.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};
			XMLNode.prototype.u = function() {
				return this.up();
			};
			XMLNode.prototype.importXMLBuilder = function(doc) {
				return this.importDocument(doc);
			};
			return XMLNode;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var bind = function(fn, me) {
			return function() {
				return fn.apply(me, arguments);
			};
		}, hasProp = {}.hasOwnProperty;
		module.exports = (function() {
			function XMLStringifier(options) {
				this.assertLegalChar = bind(this.assertLegalChar, this);
				var key, ref, value;
				options || (options = {});
				this.noDoubleEncoding = options.noDoubleEncoding;
				ref = options.stringify || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this[key] = value;
				}
			}
			XMLStringifier.prototype.eleName = function(val) {
				val = "" + val || "";
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.eleText = function(val) {
				val = "" + val || "";
				return this.assertLegalChar(this.elEscape(val));
			};
			XMLStringifier.prototype.cdata = function(val) {
				val = "" + val || "";
				val = val.replace("]]>", "]]]]><![CDATA[>");
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.comment = function(val) {
				val = "" + val || "";
				if (val.match(/--/)) throw new Error("Comment text cannot contain double-hypen: " + val);
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.raw = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.attName = function(val) {
				return val = "" + val || "";
			};
			XMLStringifier.prototype.attValue = function(val) {
				val = "" + val || "";
				return this.attEscape(val);
			};
			XMLStringifier.prototype.insTarget = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.insValue = function(val) {
				val = "" + val || "";
				if (val.match(/\?>/)) throw new Error("Invalid processing instruction value: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlVersion = function(val) {
				val = "" + val || "";
				if (!val.match(/1\.[0-9]+/)) throw new Error("Invalid version number: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlEncoding = function(val) {
				val = "" + val || "";
				if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw new Error("Invalid encoding: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlStandalone = function(val) {
				if (val) return "yes";
				else return "no";
			};
			XMLStringifier.prototype.dtdPubID = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdSysID = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdElementValue = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdAttType = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdAttDefault = function(val) {
				if (val != null) return "" + val || "";
				else return val;
			};
			XMLStringifier.prototype.dtdEntityValue = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdNData = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.convertAttKey = "@";
			XMLStringifier.prototype.convertPIKey = "?";
			XMLStringifier.prototype.convertTextKey = "#text";
			XMLStringifier.prototype.convertCDataKey = "#cdata";
			XMLStringifier.prototype.convertCommentKey = "#comment";
			XMLStringifier.prototype.convertRawKey = "#raw";
			XMLStringifier.prototype.assertLegalChar = function(str) {
				var res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
				if (res) throw new Error("Invalid character in string: " + str + " at index " + res.index);
				return str;
			};
			XMLStringifier.prototype.elEscape = function(str) {
				var ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
			};
			XMLStringifier.prototype.attEscape = function(str) {
				var ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
			};
			return XMLStringifier;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var hasProp = {}.hasOwnProperty;
		module.exports = (function() {
			function XMLWriterBase(options) {
				var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
				options || (options = {});
				this.pretty = options.pretty || false;
				this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
				if (this.pretty) {
					this.indent = (ref1 = options.indent) != null ? ref1 : "  ";
					this.newline = (ref2 = options.newline) != null ? ref2 : "\n";
					this.offset = (ref3 = options.offset) != null ? ref3 : 0;
					this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
				} else {
					this.indent = "";
					this.newline = "";
					this.offset = 0;
					this.dontprettytextnodes = 0;
				}
				this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : "";
				if (this.spacebeforeslash === true) this.spacebeforeslash = " ";
				this.newlinedefault = this.newline;
				this.prettydefault = this.pretty;
				ref6 = options.writer || {};
				for (key in ref6) {
					if (!hasProp.call(ref6, key)) continue;
					value = ref6[key];
					this[key] = value;
				}
			}
			XMLWriterBase.prototype.set = function(options) {
				var key, ref, value;
				options || (options = {});
				if ("pretty" in options) this.pretty = options.pretty;
				if ("allowEmpty" in options) this.allowEmpty = options.allowEmpty;
				if (this.pretty) {
					this.indent = "indent" in options ? options.indent : "  ";
					this.newline = "newline" in options ? options.newline : "\n";
					this.offset = "offset" in options ? options.offset : 0;
					this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
				} else {
					this.indent = "";
					this.newline = "";
					this.offset = 0;
					this.dontprettytextnodes = 0;
				}
				this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : "";
				if (this.spacebeforeslash === true) this.spacebeforeslash = " ";
				this.newlinedefault = this.newline;
				this.prettydefault = this.pretty;
				ref = options.writer || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this[key] = value;
				}
				return this;
			};
			XMLWriterBase.prototype.space = function(level) {
				var indent;
				if (this.pretty) {
					indent = (level || 0) + this.offset + 1;
					if (indent > 0) return new Array(indent).join(this.indent);
					else return "";
				} else return "";
			};
			return XMLWriterBase;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLElement = require_XMLElement();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDummy = require_XMLDummy();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLWriterBase = require_XMLWriterBase();
		module.exports = (function(superClass) {
			extend(XMLStringWriter, superClass);
			function XMLStringWriter(options) {
				XMLStringWriter.__super__.constructor.call(this, options);
			}
			XMLStringWriter.prototype.document = function(doc) {
				var child, i, len, r, ref;
				this.textispresent = false;
				r = "";
				ref = doc.children;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					if (child instanceof XMLDummy) continue;
					r += (function() {
						switch (false) {
							case !(child instanceof XMLDeclaration): return this.declaration(child);
							case !(child instanceof XMLDocType): return this.docType(child);
							case !(child instanceof XMLComment): return this.comment(child);
							case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child);
							default: return this.element(child, 0);
						}
					}).call(this);
				}
				if (this.pretty && r.slice(-this.newline.length) === this.newline) r = r.slice(0, -this.newline.length);
				return r;
			};
			XMLStringWriter.prototype.attribute = function(att) {
				return " " + att.name + "=\"" + att.value + "\"";
			};
			XMLStringWriter.prototype.cdata = function(node, level) {
				return this.space(level) + "<![CDATA[" + node.text + "]]>" + this.newline;
			};
			XMLStringWriter.prototype.comment = function(node, level) {
				return this.space(level) + "<!-- " + node.text + " -->" + this.newline;
			};
			XMLStringWriter.prototype.declaration = function(node, level) {
				var r = this.space(level);
				r += "<?xml version=\"" + node.version + "\"";
				if (node.encoding != null) r += " encoding=\"" + node.encoding + "\"";
				if (node.standalone != null) r += " standalone=\"" + node.standalone + "\"";
				r += this.spacebeforeslash + "?>";
				r += this.newline;
				return r;
			};
			XMLStringWriter.prototype.docType = function(node, level) {
				var child, i, len, r, ref;
				level || (level = 0);
				r = this.space(level);
				r += "<!DOCTYPE " + node.root().name;
				if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
				else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
				if (node.children.length > 0) {
					r += " [";
					r += this.newline;
					ref = node.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						r += (function() {
							switch (false) {
								case !(child instanceof XMLDTDAttList): return this.dtdAttList(child, level + 1);
								case !(child instanceof XMLDTDElement): return this.dtdElement(child, level + 1);
								case !(child instanceof XMLDTDEntity): return this.dtdEntity(child, level + 1);
								case !(child instanceof XMLDTDNotation): return this.dtdNotation(child, level + 1);
								case !(child instanceof XMLCData): return this.cdata(child, level + 1);
								case !(child instanceof XMLComment): return this.comment(child, level + 1);
								case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child, level + 1);
								default: throw new Error("Unknown DTD node type: " + child.constructor.name);
							}
						}).call(this);
					}
					r += "]";
				}
				r += this.spacebeforeslash + ">";
				r += this.newline;
				return r;
			};
			XMLStringWriter.prototype.element = function(node, level) {
				var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
				level || (level = 0);
				textispresentwasset = false;
				if (this.textispresent) {
					this.newline = "";
					this.pretty = false;
				} else {
					this.newline = this.newlinedefault;
					this.pretty = this.prettydefault;
				}
				space = this.space(level);
				r = "";
				r += space + "<" + node.name;
				ref = node.attributes;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					r += this.attribute(att);
				}
				if (node.children.length === 0 || node.children.every(function(e) {
					return e.value === "";
				})) if (this.allowEmpty) r += "></" + node.name + ">" + this.newline;
				else r += this.spacebeforeslash + "/>" + this.newline;
				else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
					r += ">";
					r += node.children[0].value;
					r += "</" + node.name + ">" + this.newline;
				} else {
					if (this.dontprettytextnodes) {
						ref1 = node.children;
						for (i = 0, len = ref1.length; i < len; i++) {
							child = ref1[i];
							if (child.value != null) {
								this.textispresent++;
								textispresentwasset = true;
								break;
							}
						}
					}
					if (this.textispresent) {
						this.newline = "";
						this.pretty = false;
						space = this.space(level);
					}
					r += ">" + this.newline;
					ref2 = node.children;
					for (j = 0, len1 = ref2.length; j < len1; j++) {
						child = ref2[j];
						r += (function() {
							switch (false) {
								case !(child instanceof XMLCData): return this.cdata(child, level + 1);
								case !(child instanceof XMLComment): return this.comment(child, level + 1);
								case !(child instanceof XMLElement): return this.element(child, level + 1);
								case !(child instanceof XMLRaw): return this.raw(child, level + 1);
								case !(child instanceof XMLText): return this.text(child, level + 1);
								case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child, level + 1);
								case !(child instanceof XMLDummy): return "";
								default: throw new Error("Unknown XML node type: " + child.constructor.name);
							}
						}).call(this);
					}
					if (textispresentwasset) this.textispresent--;
					if (!this.textispresent) {
						this.newline = this.newlinedefault;
						this.pretty = this.prettydefault;
					}
					r += space + "</" + node.name + ">" + this.newline;
				}
				return r;
			};
			XMLStringWriter.prototype.processingInstruction = function(node, level) {
				var r = this.space(level) + "<?" + node.target;
				if (node.value) r += " " + node.value;
				r += this.spacebeforeslash + "?>" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.raw = function(node, level) {
				return this.space(level) + node.value + this.newline;
			};
			XMLStringWriter.prototype.text = function(node, level) {
				return this.space(level) + node.value + this.newline;
			};
			XMLStringWriter.prototype.dtdAttList = function(node, level) {
				var r = this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType;
				if (node.defaultValueType !== "#DEFAULT") r += " " + node.defaultValueType;
				if (node.defaultValue) r += " \"" + node.defaultValue + "\"";
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.dtdElement = function(node, level) {
				return this.space(level) + "<!ELEMENT " + node.name + " " + node.value + this.spacebeforeslash + ">" + this.newline;
			};
			XMLStringWriter.prototype.dtdEntity = function(node, level) {
				var r = this.space(level) + "<!ENTITY";
				if (node.pe) r += " %";
				r += " " + node.name;
				if (node.value) r += " \"" + node.value + "\"";
				else {
					if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
					else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
					if (node.nData) r += " NDATA " + node.nData;
				}
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.dtdNotation = function(node, level) {
				var r = this.space(level) + "<!NOTATION " + node.name;
				if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
				else if (node.pubID) r += " PUBLIC \"" + node.pubID + "\"";
				else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.openNode = function(node, level) {
				var att, name, r, ref;
				level || (level = 0);
				if (node instanceof XMLElement) {
					r = this.space(level) + "<" + node.name;
					ref = node.attributes;
					for (name in ref) {
						if (!hasProp.call(ref, name)) continue;
						att = ref[name];
						r += this.attribute(att);
					}
					r += (node.children ? ">" : "/>") + this.newline;
					return r;
				} else {
					r = this.space(level) + "<!DOCTYPE " + node.rootNodeName;
					if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
					else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
					r += (node.children ? " [" : ">") + this.newline;
					return r;
				}
			};
			XMLStringWriter.prototype.closeNode = function(node, level) {
				level || (level = 0);
				switch (false) {
					case !(node instanceof XMLElement): return this.space(level) + "</" + node.name + ">" + this.newline;
					case !(node instanceof XMLDocType): return this.space(level) + "]>" + this.newline;
				}
			};
			return XMLStringWriter;
		})(XMLWriterBase);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isPlainObject = require_Utility().isPlainObject;
		XMLNode = require_XMLNode();
		XMLStringifier = require_XMLStringifier();
		XMLStringWriter = require_XMLStringWriter();
		module.exports = (function(superClass) {
			extend(XMLDocument, superClass);
			function XMLDocument(options) {
				XMLDocument.__super__.constructor.call(this, null);
				this.name = "?xml";
				options || (options = {});
				if (!options.writer) options.writer = new XMLStringWriter();
				this.options = options;
				this.stringify = new XMLStringifier(options);
				this.isDocument = true;
			}
			XMLDocument.prototype.end = function(writer) {
				var writerOptions;
				if (!writer) writer = this.options.writer;
				else if (isPlainObject(writer)) {
					writerOptions = writer;
					writer = this.options.writer.set(writerOptions);
				}
				return writer.document(this);
			};
			XMLDocument.prototype.toString = function(options) {
				return this.options.writer.set(options).document(this);
			};
			return XMLDocument;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
		XMLElement = require_XMLElement();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLAttribute = require_XMLAttribute();
		XMLStringifier = require_XMLStringifier();
		XMLStringWriter = require_XMLStringWriter();
		module.exports = (function() {
			function XMLDocumentCB(options, onData, onEnd) {
				var writerOptions;
				this.name = "?xml";
				options || (options = {});
				if (!options.writer) options.writer = new XMLStringWriter(options);
				else if (isPlainObject(options.writer)) {
					writerOptions = options.writer;
					options.writer = new XMLStringWriter(writerOptions);
				}
				this.options = options;
				this.writer = options.writer;
				this.stringify = new XMLStringifier(options);
				this.onDataCallback = onData || function() {};
				this.onEndCallback = onEnd || function() {};
				this.currentNode = null;
				this.currentLevel = -1;
				this.openTags = {};
				this.documentStarted = false;
				this.documentCompleted = false;
				this.root = null;
			}
			XMLDocumentCB.prototype.node = function(name, attributes, text) {
				var ref1, ref2;
				if (name == null) throw new Error("Missing node name.");
				if (this.root && this.currentLevel === -1) throw new Error("Document can only have one root node. " + this.debugInfo(name));
				this.openCurrent();
				name = getValue(name);
				if (attributes === null && text == null) ref1 = [{}, null], attributes = ref1[0], text = ref1[1];
				if (attributes == null) attributes = {};
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
				this.currentNode = new XMLElement(this, name, attributes);
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				if (text != null) this.text(text);
				return this;
			};
			XMLDocumentCB.prototype.element = function(name, attributes, text) {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.dtdElement.apply(this, arguments);
				else return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (!this.currentNode || this.currentNode.children) throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
				if (name != null) name = getValue(name);
				if (isObject(name)) for (attName in name) {
					if (!hasProp.call(name, attName)) continue;
					attValue = name[attName];
					this.attribute(attName, attValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					if (!this.options.skipNullAttributes || value != null) this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
				}
				return this;
			};
			XMLDocumentCB.prototype.text = function(value) {
				var node;
				this.openCurrent();
				node = new XMLText(this, value);
				this.onData(this.writer.text(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.cdata = function(value) {
				var node;
				this.openCurrent();
				node = new XMLCData(this, value);
				this.onData(this.writer.cdata(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.comment = function(value) {
				var node;
				this.openCurrent();
				node = new XMLComment(this, value);
				this.onData(this.writer.comment(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.raw = function(value) {
				var node;
				this.openCurrent();
				node = new XMLRaw(this, value);
				this.onData(this.writer.raw(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.instruction = function(target, value) {
				var i, insTarget, insValue, len, node;
				this.openCurrent();
				if (target != null) target = getValue(target);
				if (value != null) value = getValue(value);
				if (Array.isArray(target)) for (i = 0, len = target.length; i < len; i++) {
					insTarget = target[i];
					this.instruction(insTarget);
				}
				else if (isObject(target)) for (insTarget in target) {
					if (!hasProp.call(target, insTarget)) continue;
					insValue = target[insTarget];
					this.instruction(insTarget, insValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					node = new XMLProcessingInstruction(this, target, value);
					this.onData(this.writer.processingInstruction(node, this.currentLevel + 1), this.currentLevel + 1);
				}
				return this;
			};
			XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
				var node;
				this.openCurrent();
				if (this.documentStarted) throw new Error("declaration() must be the first node.");
				node = new XMLDeclaration(this, version, encoding, standalone);
				this.onData(this.writer.declaration(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
				this.openCurrent();
				if (root == null) throw new Error("Missing root node name.");
				if (this.root) throw new Error("dtd() must come before the root node.");
				this.currentNode = new XMLDocType(this, pubID, sysID);
				this.currentNode.rootNodeName = root;
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				return this;
			};
			XMLDocumentCB.prototype.dtdElement = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDElement(this, name, value);
				this.onData(this.writer.dtdElement(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var node;
				this.openCurrent();
				node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.onData(this.writer.dtdAttList(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.entity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity(this, false, name, value);
				this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.pEntity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity(this, true, name, value);
				this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.notation = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDNotation(this, name, value);
				this.onData(this.writer.dtdNotation(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.up = function() {
				if (this.currentLevel < 0) throw new Error("The document node has no parent.");
				if (this.currentNode) {
					if (this.currentNode.children) this.closeNode(this.currentNode);
					else this.openNode(this.currentNode);
					this.currentNode = null;
				} else this.closeNode(this.openTags[this.currentLevel]);
				delete this.openTags[this.currentLevel];
				this.currentLevel--;
				return this;
			};
			XMLDocumentCB.prototype.end = function() {
				while (this.currentLevel >= 0) this.up();
				return this.onEnd();
			};
			XMLDocumentCB.prototype.openCurrent = function() {
				if (this.currentNode) {
					this.currentNode.children = true;
					return this.openNode(this.currentNode);
				}
			};
			XMLDocumentCB.prototype.openNode = function(node) {
				if (!node.isOpen) {
					if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) this.root = node;
					this.onData(this.writer.openNode(node, this.currentLevel), this.currentLevel);
					return node.isOpen = true;
				}
			};
			XMLDocumentCB.prototype.closeNode = function(node) {
				if (!node.isClosed) {
					this.onData(this.writer.closeNode(node, this.currentLevel), this.currentLevel);
					return node.isClosed = true;
				}
			};
			XMLDocumentCB.prototype.onData = function(chunk, level) {
				this.documentStarted = true;
				return this.onDataCallback(chunk, level + 1);
			};
			XMLDocumentCB.prototype.onEnd = function() {
				this.documentCompleted = true;
				return this.onEndCallback();
			};
			XMLDocumentCB.prototype.debugInfo = function(name) {
				if (name == null) return "";
				else return "node: <" + name + ">";
			};
			XMLDocumentCB.prototype.ele = function() {
				return this.element.apply(this, arguments);
			};
			XMLDocumentCB.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.txt = function(value) {
				return this.text(value);
			};
			XMLDocumentCB.prototype.dat = function(value) {
				return this.cdata(value);
			};
			XMLDocumentCB.prototype.com = function(value) {
				return this.comment(value);
			};
			XMLDocumentCB.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};
			XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};
			XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
				return this.doctype(root, pubID, sysID);
			};
			XMLDocumentCB.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLDocumentCB.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.t = function(value) {
				return this.text(value);
			};
			XMLDocumentCB.prototype.d = function(value) {
				return this.cdata(value);
			};
			XMLDocumentCB.prototype.c = function(value) {
				return this.comment(value);
			};
			XMLDocumentCB.prototype.r = function(value) {
				return this.raw(value);
			};
			XMLDocumentCB.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};
			XMLDocumentCB.prototype.att = function() {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.attList.apply(this, arguments);
				else return this.attribute.apply(this, arguments);
			};
			XMLDocumentCB.prototype.a = function() {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.attList.apply(this, arguments);
				else return this.attribute.apply(this, arguments);
			};
			XMLDocumentCB.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};
			XMLDocumentCB.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};
			XMLDocumentCB.prototype.not = function(name, value) {
				return this.notation(name, value);
			};
			return XMLDocumentCB;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLElement = require_XMLElement();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDummy = require_XMLDummy();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLWriterBase = require_XMLWriterBase();
		module.exports = (function(superClass) {
			extend(XMLStreamWriter, superClass);
			function XMLStreamWriter(stream, options) {
				XMLStreamWriter.__super__.constructor.call(this, options);
				this.stream = stream;
			}
			XMLStreamWriter.prototype.document = function(doc) {
				var child, i, j, len, len1, ref = doc.children, ref1, results;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					child.isLastRootNode = false;
				}
				doc.children[doc.children.length - 1].isLastRootNode = true;
				ref1 = doc.children;
				results = [];
				for (j = 0, len1 = ref1.length; j < len1; j++) {
					child = ref1[j];
					if (child instanceof XMLDummy) continue;
					switch (false) {
						case !(child instanceof XMLDeclaration):
							results.push(this.declaration(child));
							break;
						case !(child instanceof XMLDocType):
							results.push(this.docType(child));
							break;
						case !(child instanceof XMLComment):
							results.push(this.comment(child));
							break;
						case !(child instanceof XMLProcessingInstruction):
							results.push(this.processingInstruction(child));
							break;
						default: results.push(this.element(child));
					}
				}
				return results;
			};
			XMLStreamWriter.prototype.attribute = function(att) {
				return this.stream.write(" " + att.name + "=\"" + att.value + "\"");
			};
			XMLStreamWriter.prototype.cdata = function(node, level) {
				return this.stream.write(this.space(level) + "<![CDATA[" + node.text + "]]>" + this.endline(node));
			};
			XMLStreamWriter.prototype.comment = function(node, level) {
				return this.stream.write(this.space(level) + "<!-- " + node.text + " -->" + this.endline(node));
			};
			XMLStreamWriter.prototype.declaration = function(node, level) {
				this.stream.write(this.space(level));
				this.stream.write("<?xml version=\"" + node.version + "\"");
				if (node.encoding != null) this.stream.write(" encoding=\"" + node.encoding + "\"");
				if (node.standalone != null) this.stream.write(" standalone=\"" + node.standalone + "\"");
				this.stream.write(this.spacebeforeslash + "?>");
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.docType = function(node, level) {
				var child, i, len, ref;
				level || (level = 0);
				this.stream.write(this.space(level));
				this.stream.write("<!DOCTYPE " + node.root().name);
				if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
				else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
				if (node.children.length > 0) {
					this.stream.write(" [");
					this.stream.write(this.endline(node));
					ref = node.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						switch (false) {
							case !(child instanceof XMLDTDAttList):
								this.dtdAttList(child, level + 1);
								break;
							case !(child instanceof XMLDTDElement):
								this.dtdElement(child, level + 1);
								break;
							case !(child instanceof XMLDTDEntity):
								this.dtdEntity(child, level + 1);
								break;
							case !(child instanceof XMLDTDNotation):
								this.dtdNotation(child, level + 1);
								break;
							case !(child instanceof XMLCData):
								this.cdata(child, level + 1);
								break;
							case !(child instanceof XMLComment):
								this.comment(child, level + 1);
								break;
							case !(child instanceof XMLProcessingInstruction):
								this.processingInstruction(child, level + 1);
								break;
							default: throw new Error("Unknown DTD node type: " + child.constructor.name);
						}
					}
					this.stream.write("]");
				}
				this.stream.write(this.spacebeforeslash + ">");
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.element = function(node, level) {
				var att, child, i, len, name, ref, ref1, space;
				level || (level = 0);
				space = this.space(level);
				this.stream.write(space + "<" + node.name);
				ref = node.attributes;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					this.attribute(att);
				}
				if (node.children.length === 0 || node.children.every(function(e) {
					return e.value === "";
				})) if (this.allowEmpty) this.stream.write("></" + node.name + ">");
				else this.stream.write(this.spacebeforeslash + "/>");
				else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
					this.stream.write(">");
					this.stream.write(node.children[0].value);
					this.stream.write("</" + node.name + ">");
				} else {
					this.stream.write(">" + this.newline);
					ref1 = node.children;
					for (i = 0, len = ref1.length; i < len; i++) {
						child = ref1[i];
						switch (false) {
							case !(child instanceof XMLCData):
								this.cdata(child, level + 1);
								break;
							case !(child instanceof XMLComment):
								this.comment(child, level + 1);
								break;
							case !(child instanceof XMLElement):
								this.element(child, level + 1);
								break;
							case !(child instanceof XMLRaw):
								this.raw(child, level + 1);
								break;
							case !(child instanceof XMLText):
								this.text(child, level + 1);
								break;
							case !(child instanceof XMLProcessingInstruction):
								this.processingInstruction(child, level + 1);
								break;
							case !(child instanceof XMLDummy): break;
							default: throw new Error("Unknown XML node type: " + child.constructor.name);
						}
					}
					this.stream.write(space + "</" + node.name + ">");
				}
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.processingInstruction = function(node, level) {
				this.stream.write(this.space(level) + "<?" + node.target);
				if (node.value) this.stream.write(" " + node.value);
				return this.stream.write(this.spacebeforeslash + "?>" + this.endline(node));
			};
			XMLStreamWriter.prototype.raw = function(node, level) {
				return this.stream.write(this.space(level) + node.value + this.endline(node));
			};
			XMLStreamWriter.prototype.text = function(node, level) {
				return this.stream.write(this.space(level) + node.value + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdAttList = function(node, level) {
				this.stream.write(this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType);
				if (node.defaultValueType !== "#DEFAULT") this.stream.write(" " + node.defaultValueType);
				if (node.defaultValue) this.stream.write(" \"" + node.defaultValue + "\"");
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdElement = function(node, level) {
				this.stream.write(this.space(level) + "<!ELEMENT " + node.name + " " + node.value);
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdEntity = function(node, level) {
				this.stream.write(this.space(level) + "<!ENTITY");
				if (node.pe) this.stream.write(" %");
				this.stream.write(" " + node.name);
				if (node.value) this.stream.write(" \"" + node.value + "\"");
				else {
					if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
					else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
					if (node.nData) this.stream.write(" NDATA " + node.nData);
				}
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdNotation = function(node, level) {
				this.stream.write(this.space(level) + "<!NOTATION " + node.name);
				if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
				else if (node.pubID) this.stream.write(" PUBLIC \"" + node.pubID + "\"");
				else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.endline = function(node) {
				if (!node.isLastRootNode) return this.newline;
				else return "";
			};
			return XMLStreamWriter;
		})(XMLWriterBase);
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/node_modules/xmlbuilder/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref = require_Utility();
		assign = ref.assign, isFunction = ref.isFunction;
		XMLDocument = require_XMLDocument();
		XMLDocumentCB = require_XMLDocumentCB();
		XMLStringWriter = require_XMLStringWriter();
		XMLStreamWriter = require_XMLStreamWriter();
		module.exports.create = function(name, xmldec, doctype, options) {
			var doc, root;
			if (name == null) throw new Error("Root element needs a name.");
			options = assign({}, xmldec, doctype, options);
			doc = new XMLDocument(options);
			root = doc.element(name);
			if (!options.headless) {
				doc.declaration(options);
				if (options.pubID != null || options.sysID != null) doc.doctype(options);
			}
			return root;
		};
		module.exports.begin = function(options, onData, onEnd) {
			var ref1;
			if (isFunction(options)) {
				ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
				options = {};
			}
			if (onData) return new XMLDocumentCB(options, onData, onEnd);
			else return new XMLDocument(options);
		};
		module.exports.stringWriter = function(options) {
			return new XMLStringWriter(options);
		};
		module.exports.streamWriter = function(stream, options) {
			return new XMLStreamWriter(stream, options);
		};
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/lib/xml/writer.js
var require_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var xmlbuilder = require_lib$1();
	exports.writeString = writeString;
	function writeString(root, namespaces) {
		var uriToPrefix = _.invert(namespaces);
		var nodeWriters = {
			element: writeElement,
			text: writeTextNode
		};
		function writeNode(builder, node) {
			return nodeWriters[node.type](builder, node);
		}
		function writeElement(builder, element) {
			var elementBuilder = builder.element(mapElementName(element.name), element.attributes);
			element.children.forEach(function(child) {
				writeNode(elementBuilder, child);
			});
		}
		function mapElementName(name) {
			var longFormMatch = /^\{(.*)\}(.*)$/.exec(name);
			if (longFormMatch) {
				var prefix = uriToPrefix[longFormMatch[1]];
				return prefix + (prefix === "" ? "" : ":") + longFormMatch[2];
			} else return name;
		}
		function writeDocument(root) {
			var builder = xmlbuilder.create(mapElementName(root.name), {
				version: "1.0",
				encoding: "UTF-8",
				standalone: true
			});
			_.forEach(namespaces, function(uri, prefix) {
				var key = "xmlns" + (prefix === "" ? "" : ":" + prefix);
				builder.attribute(key, uri);
			});
			root.children.forEach(function(child) {
				writeNode(builder, child);
			});
			return builder.end();
		}
		return writeDocument(root);
	}
	function writeTextNode(builder, node) {
		builder.text(node.value);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/xml/index.js
var require_xml = /* @__PURE__ */ __commonJSMin(((exports) => {
	var nodes = require_nodes();
	exports.Element = nodes.Element;
	exports.element = nodes.element;
	exports.emptyElement = nodes.emptyElement;
	exports.text = nodes.text;
	exports.readString = require_reader().readString;
	exports.writeString = require_writer().writeString;
}));
//#endregion
//#region node_modules/mammoth/lib/docx/office-xml-reader.js
var require_office_xml_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var promises = require_promises();
	var xml = require_xml();
	exports.read = read;
	exports.readXmlFromZipFile = readXmlFromZipFile;
	var xmlNamespaceMap = {
		"http://schemas.openxmlformats.org/wordprocessingml/2006/main": "w",
		"http://schemas.openxmlformats.org/officeDocument/2006/relationships": "r",
		"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing": "wp",
		"http://schemas.openxmlformats.org/drawingml/2006/main": "a",
		"http://schemas.openxmlformats.org/drawingml/2006/picture": "pic",
		"http://purl.oclc.org/ooxml/wordprocessingml/main": "w",
		"http://purl.oclc.org/ooxml/officeDocument/relationships": "r",
		"http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing": "wp",
		"http://purl.oclc.org/ooxml/drawingml/main": "a",
		"http://purl.oclc.org/ooxml/drawingml/picture": "pic",
		"http://schemas.openxmlformats.org/package/2006/content-types": "content-types",
		"http://schemas.openxmlformats.org/package/2006/relationships": "relationships",
		"http://schemas.openxmlformats.org/markup-compatibility/2006": "mc",
		"urn:schemas-microsoft-com:vml": "v",
		"urn:schemas-microsoft-com:office:word": "office-word",
		"http://schemas.microsoft.com/office/word/2010/wordml": "wordml"
	};
	function read(xmlString) {
		return xml.readString(xmlString, xmlNamespaceMap).then(function(document) {
			return collapseAlternateContent(document)[0];
		});
	}
	function readXmlFromZipFile(docxFile, path) {
		if (docxFile.exists(path)) return docxFile.read(path, "utf-8").then(stripUtf8Bom).then(read);
		else return promises.resolve(null);
	}
	function stripUtf8Bom(xmlString) {
		return xmlString.replace(/^\uFEFF/g, "");
	}
	function collapseAlternateContent(node) {
		if (node.type === "element") if (node.name === "mc:AlternateContent") return node.firstOrEmpty("mc:Fallback").children;
		else {
			node.children = _.flatten(node.children.map(collapseAlternateContent, true));
			return [node];
		}
		else return [node];
	}
}));
//#endregion
//#region node_modules/mammoth/lib/transforms.js
var require_transforms = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	exports.paragraph = paragraph;
	exports.run = run;
	exports._elements = elements;
	exports._elementsOfType = elementsOfType;
	exports.getDescendantsOfType = getDescendantsOfType;
	exports.getDescendants = getDescendants;
	function paragraph(transform) {
		return elementsOfType("paragraph", transform);
	}
	function run(transform) {
		return elementsOfType("run", transform);
	}
	function elementsOfType(elementType, transform) {
		return elements(function(element) {
			if (element.type === elementType) return transform(element);
			else return element;
		});
	}
	function elements(transform) {
		return function transformElement(element) {
			if (element.children) {
				var children = _.map(element.children, transformElement);
				element = _.extend(element, { children });
			}
			return transform(element);
		};
	}
	function getDescendantsOfType(element, type) {
		return getDescendants(element).filter(function(descendant) {
			return descendant.type === type;
		});
	}
	function getDescendants(element) {
		var descendants = [];
		visitDescendants(element, function(descendant) {
			descendants.push(descendant);
		});
		return descendants;
	}
	function visitDescendants(element, visit) {
		if (element.children) element.children.forEach(function(child) {
			visitDescendants(child, visit);
			visit(child);
		});
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/uris.js
var require_uris = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.uriToZipEntryName = uriToZipEntryName;
	exports.replaceFragment = replaceFragment;
	function uriToZipEntryName(base, uri) {
		if (uri.charAt(0) === "/") return uri.substr(1);
		else return base + "/" + uri;
	}
	function replaceFragment(uri, fragment) {
		var hashIndex = uri.indexOf("#");
		if (hashIndex !== -1) uri = uri.substring(0, hashIndex);
		return uri + "#" + fragment;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/body-reader.js
var require_body_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.createBodyReader = createBodyReader;
	exports._readNumberingProperties = readNumberingProperties;
	var dingbatToUnicode = require_dist();
	var _ = require_underscore_umd();
	var documents = require_documents();
	var Result = require_results().Result;
	var warning = require_results().warning;
	var xml = require_xml();
	var transforms = require_transforms();
	var uris = require_uris();
	function createBodyReader(options) {
		return {
			readXmlElement: function(element) {
				return new BodyReader(options).readXmlElement(element);
			},
			readXmlElements: function(elements) {
				return new BodyReader(options).readXmlElements(elements);
			}
		};
	}
	function BodyReader(options) {
		var complexFieldStack = [];
		var currentInstrText = [];
		var deletedParagraphContents = [];
		var relationships = options.relationships;
		var contentTypes = options.contentTypes;
		var docxFile = options.docxFile;
		var files = options.files;
		var numbering = options.numbering;
		var styles = options.styles;
		function readXmlElements(elements) {
			return combineResults(elements.map(readXmlElement));
		}
		function readXmlElement(element) {
			if (element.type === "element") {
				var handler = xmlElementReaders[element.name];
				if (handler) return handler(element);
				else if (!Object.prototype.hasOwnProperty.call(ignoreElements, element.name)) return emptyResultWithMessages([warning("An unrecognised element was ignored: " + element.name)]);
			}
			return emptyResult();
		}
		function readParagraphProperties(element) {
			return readParagraphStyle(element).map(function(style) {
				return {
					type: "paragraphProperties",
					styleId: style.styleId,
					styleName: style.name,
					alignment: element.firstOrEmpty("w:jc").attributes["w:val"],
					numbering: readNumberingProperties(style.styleId, element.firstOrEmpty("w:numPr"), numbering),
					indent: readParagraphIndent(element.firstOrEmpty("w:ind"))
				};
			});
		}
		function readParagraphIndent(element) {
			return {
				start: element.attributes["w:start"] || element.attributes["w:left"],
				end: element.attributes["w:end"] || element.attributes["w:right"],
				firstLine: element.attributes["w:firstLine"],
				hanging: element.attributes["w:hanging"]
			};
		}
		function readRunProperties(element) {
			return readRunStyle(element).map(function(style) {
				var fontSizeString = element.firstOrEmpty("w:sz").attributes["w:val"];
				var fontSize = /^[0-9]+$/.test(fontSizeString) ? parseInt(fontSizeString, 10) / 2 : null;
				return {
					type: "runProperties",
					styleId: style.styleId,
					styleName: style.name,
					verticalAlignment: element.firstOrEmpty("w:vertAlign").attributes["w:val"],
					font: element.firstOrEmpty("w:rFonts").attributes["w:ascii"],
					fontSize,
					isBold: readBooleanElement(element.first("w:b")),
					isUnderline: readUnderline(element.first("w:u")),
					isItalic: readBooleanElement(element.first("w:i")),
					isStrikethrough: readBooleanElement(element.first("w:strike")),
					isAllCaps: readBooleanElement(element.first("w:caps")),
					isSmallCaps: readBooleanElement(element.first("w:smallCaps")),
					highlight: readHighlightValue(element.firstOrEmpty("w:highlight").attributes["w:val"])
				};
			});
		}
		function readUnderline(element) {
			if (element) {
				var value = element.attributes["w:val"];
				return value !== void 0 && value !== "false" && value !== "0" && value !== "none";
			} else return false;
		}
		function readBooleanElement(element) {
			if (element) {
				var value = element.attributes["w:val"];
				return value !== "false" && value !== "0";
			} else return false;
		}
		function readBooleanAttributeValue(value) {
			return value !== "false" && value !== "0";
		}
		function readHighlightValue(value) {
			if (!value || value === "none") return null;
			else return value;
		}
		function readParagraphStyle(element) {
			return readStyle(element, "w:pStyle", "Paragraph", styles.findParagraphStyleById);
		}
		function readRunStyle(element) {
			return readStyle(element, "w:rStyle", "Run", styles.findCharacterStyleById);
		}
		function readTableStyle(element) {
			return readStyle(element, "w:tblStyle", "Table", styles.findTableStyleById);
		}
		function readStyle(element, styleTagName, styleType, findStyleById) {
			var messages = [];
			var styleElement = element.first(styleTagName);
			var styleId = null;
			var name = null;
			if (styleElement) {
				styleId = styleElement.attributes["w:val"];
				if (styleId) {
					var style = findStyleById(styleId);
					if (style) name = style.name;
					else messages.push(undefinedStyleWarning(styleType, styleId));
				}
			}
			return elementResultWithMessages({
				styleId,
				name
			}, messages);
		}
		function readFldChar(element) {
			var type = element.attributes["w:fldCharType"];
			if (type === "begin") {
				complexFieldStack.push({
					type: "begin",
					fldChar: element
				});
				currentInstrText = [];
			} else if (type === "end") {
				var complexFieldEnd = complexFieldStack.pop();
				if (complexFieldEnd.type === "begin") complexFieldEnd = parseCurrentInstrText(complexFieldEnd);
				if (complexFieldEnd.type === "checkbox") return elementResult(documents.checkbox({ checked: complexFieldEnd.checked }));
			} else if (type === "separate") {
				var complexField = parseCurrentInstrText(complexFieldStack.pop());
				complexFieldStack.push(complexField);
			}
			return emptyResult();
		}
		function currentHyperlinkOptions() {
			var topHyperlink = _.last(complexFieldStack.filter(function(complexField) {
				return complexField.type === "hyperlink";
			}));
			return topHyperlink ? topHyperlink.options : null;
		}
		function parseCurrentInstrText(complexField) {
			return parseInstrText(currentInstrText.join(""), complexField.type === "begin" ? complexField.fldChar : xml.emptyElement);
		}
		function parseInstrText(instrText, fldChar) {
			var linkResult = /^\s*HYPERLINK\s+(\\l\s+)?(?:"(.*)"|([^\\]\S*))/.exec(instrText);
			if (linkResult) {
				var location = linkResult[2] === void 0 ? linkResult[3] : linkResult[2];
				return {
					type: "hyperlink",
					options: linkResult[1] === void 0 ? { href: location } : { anchor: location }
				};
			}
			if (/\s*FORMCHECKBOX\s*/.exec(instrText)) {
				var checkboxElement = fldChar.firstOrEmpty("w:ffData").firstOrEmpty("w:checkBox");
				var checkedElement = checkboxElement.first("w:checked");
				return {
					type: "checkbox",
					checked: checkedElement == null ? readBooleanElement(checkboxElement.first("w:default")) : readBooleanElement(checkedElement)
				};
			}
			return { type: "unknown" };
		}
		function readInstrText(element) {
			currentInstrText.push(element.text());
			return emptyResult();
		}
		function readSymbol(element) {
			var font = element.attributes["w:font"];
			var char = element.attributes["w:char"];
			var unicodeCharacter = dingbatToUnicode.hex(font, char);
			if (unicodeCharacter == null && /^F0..$/.test(char)) unicodeCharacter = dingbatToUnicode.hex(font, char.substring(2));
			if (unicodeCharacter == null) return emptyResultWithMessages([warning("A w:sym element with an unsupported character was ignored: char " + char + " in font " + font)]);
			else return elementResult(new documents.Text(unicodeCharacter.string));
		}
		function noteReferenceReader(noteType) {
			return function(element) {
				var noteId = element.attributes["w:id"];
				return elementResult(new documents.NoteReference({
					noteType,
					noteId
				}));
			};
		}
		function readCommentReference(element) {
			return elementResult(documents.commentReference({ commentId: element.attributes["w:id"] }));
		}
		function readChildElements(element) {
			return readXmlElements(element.children);
		}
		var xmlElementReaders = {
			"w:p": function(element) {
				var paragraphPropertiesElement = element.firstOrEmpty("w:pPr");
				if (!!paragraphPropertiesElement.firstOrEmpty("w:rPr").first("w:del")) {
					element.children.forEach(function(child) {
						deletedParagraphContents.push(child);
					});
					return emptyResult();
				} else {
					var childrenXml = element.children;
					if (deletedParagraphContents.length > 0) {
						childrenXml = deletedParagraphContents.concat(childrenXml);
						deletedParagraphContents = [];
					}
					return ReadResult.map(readParagraphProperties(paragraphPropertiesElement), readXmlElements(childrenXml), function(properties, children) {
						return new documents.Paragraph(children, properties);
					}).insertExtra();
				}
			},
			"w:r": function(element) {
				return ReadResult.map(readRunProperties(element.firstOrEmpty("w:rPr")), readXmlElements(element.children), function(properties, children) {
					var hyperlinkOptions = currentHyperlinkOptions();
					if (hyperlinkOptions !== null) children = [new documents.Hyperlink(children, hyperlinkOptions)];
					return new documents.Run(children, properties);
				});
			},
			"w:fldChar": readFldChar,
			"w:instrText": readInstrText,
			"w:t": function(element) {
				return elementResult(new documents.Text(element.text()));
			},
			"w:tab": function(element) {
				return elementResult(new documents.Tab());
			},
			"w:noBreakHyphen": function() {
				return elementResult(new documents.Text("‑"));
			},
			"w:softHyphen": function(element) {
				return elementResult(new documents.Text("­"));
			},
			"w:sym": readSymbol,
			"w:hyperlink": function(element) {
				var relationshipId = element.attributes["r:id"];
				var anchor = element.attributes["w:anchor"];
				return readXmlElements(element.children).map(function(children) {
					function create(options) {
						var targetFrame = element.attributes["w:tgtFrame"] || null;
						return new documents.Hyperlink(children, _.extend({ targetFrame }, options));
					}
					if (relationshipId) {
						var href = relationships.findTargetByRelationshipId(relationshipId);
						if (anchor) href = uris.replaceFragment(href, anchor);
						return create({ href });
					} else if (anchor) return create({ anchor });
					else return children;
				});
			},
			"w:tbl": readTable,
			"w:tr": readTableRow,
			"w:tc": readTableCell,
			"w:footnoteReference": noteReferenceReader("footnote"),
			"w:endnoteReference": noteReferenceReader("endnote"),
			"w:commentReference": readCommentReference,
			"w:br": function(element) {
				var breakType = element.attributes["w:type"];
				if (breakType == null || breakType === "textWrapping") return elementResult(documents.lineBreak);
				else if (breakType === "page") return elementResult(documents.pageBreak);
				else if (breakType === "column") return elementResult(documents.columnBreak);
				else return emptyResultWithMessages([warning("Unsupported break type: " + breakType)]);
			},
			"w:bookmarkStart": function(element) {
				var name = element.attributes["w:name"];
				if (name === "_GoBack") return emptyResult();
				else return elementResult(new documents.BookmarkStart({ name }));
			},
			"mc:AlternateContent": function(element) {
				return readChildElements(element.firstOrEmpty("mc:Fallback"));
			},
			"w:sdt": function(element) {
				return readXmlElements(element.firstOrEmpty("w:sdtContent").children).map(function(content) {
					var checkbox = element.firstOrEmpty("w:sdtPr").first("wordml:checkbox");
					if (checkbox) {
						var checkedElement = checkbox.first("wordml:checked");
						var isChecked = !!checkedElement && readBooleanAttributeValue(checkedElement.attributes["wordml:val"]);
						var documentCheckbox = documents.checkbox({ checked: isChecked });
						var hasCheckbox = false;
						var replacedContent = content.map(transforms._elementsOfType(documents.types.text, function(text) {
							if (text.value.length > 0 && !hasCheckbox) {
								hasCheckbox = true;
								return documentCheckbox;
							} else return text;
						}));
						if (hasCheckbox) return replacedContent;
						else return documentCheckbox;
					} else return content;
				});
			},
			"w:ins": readChildElements,
			"w:object": readChildElements,
			"w:smartTag": readChildElements,
			"w:drawing": readChildElements,
			"w:pict": function(element) {
				return readChildElements(element).toExtra();
			},
			"v:roundrect": readChildElements,
			"v:shape": readChildElements,
			"v:textbox": readChildElements,
			"w:txbxContent": readChildElements,
			"wp:inline": readDrawingElement,
			"wp:anchor": readDrawingElement,
			"v:imagedata": readImageData,
			"v:group": readChildElements,
			"v:rect": readChildElements
		};
		return {
			readXmlElement,
			readXmlElements
		};
		function readTable(element) {
			var propertiesResult = readTableProperties(element.firstOrEmpty("w:tblPr"));
			return readXmlElements(element.children).flatMap(calculateRowSpans).flatMap(function(children) {
				return propertiesResult.map(function(properties) {
					return documents.Table(children, properties);
				});
			});
		}
		function readTableProperties(element) {
			return readTableStyle(element).map(function(style) {
				return {
					styleId: style.styleId,
					styleName: style.name
				};
			});
		}
		function readTableRow(element) {
			var properties = element.firstOrEmpty("w:trPr");
			if (!!properties.first("w:del")) return emptyResult();
			var isHeader = !!properties.first("w:tblHeader");
			return readXmlElements(element.children).map(function(children) {
				return documents.TableRow(children, { isHeader });
			});
		}
		function readTableCell(element) {
			return readXmlElements(element.children).map(function(children) {
				var properties = element.firstOrEmpty("w:tcPr");
				var gridSpan = properties.firstOrEmpty("w:gridSpan").attributes["w:val"];
				var colSpan = gridSpan ? parseInt(gridSpan, 10) : 1;
				var cell = documents.TableCell(children, { colSpan });
				cell._vMerge = readVMerge(properties);
				return cell;
			});
		}
		function readVMerge(properties) {
			var element = properties.first("w:vMerge");
			if (element) {
				var val = element.attributes["w:val"];
				return val === "continue" || !val;
			} else return null;
		}
		function calculateRowSpans(rows) {
			if (_.any(rows, function(row) {
				return row.type !== documents.types.tableRow;
			})) {
				removeVMergeProperties(rows);
				return elementResultWithMessages(rows, [warning("unexpected non-row element in table, cell merging may be incorrect")]);
			}
			if (_.any(rows, function(row) {
				return _.any(row.children, function(cell) {
					return cell.type !== documents.types.tableCell;
				});
			})) {
				removeVMergeProperties(rows);
				return elementResultWithMessages(rows, [warning("unexpected non-cell element in table row, cell merging may be incorrect")]);
			}
			var columns = {};
			rows.forEach(function(row) {
				var cellIndex = 0;
				row.children.forEach(function(cell) {
					if (cell._vMerge && columns[cellIndex]) columns[cellIndex].rowSpan++;
					else {
						columns[cellIndex] = cell;
						cell._vMerge = false;
					}
					cellIndex += cell.colSpan;
				});
			});
			rows.forEach(function(row) {
				row.children = row.children.filter(function(cell) {
					return !cell._vMerge;
				});
				row.children.forEach(function(cell) {
					delete cell._vMerge;
				});
			});
			return elementResult(rows);
		}
		function removeVMergeProperties(rows) {
			rows.forEach(function(row) {
				transforms.getDescendantsOfType(row, documents.types.tableCell).forEach(function(cell) {
					delete cell._vMerge;
				});
			});
		}
		function readDrawingElement(element) {
			return combineResults(element.getElementsByTagName("a:graphic").getElementsByTagName("a:graphicData").getElementsByTagName("pic:pic").getElementsByTagName("pic:blipFill").getElementsByTagName("a:blip").map(readBlip.bind(null, element)));
		}
		function readBlip(element, blip) {
			var propertiesElement = element.firstOrEmpty("wp:docPr");
			var properties = propertiesElement.attributes;
			var altText = isBlank(properties.descr) ? properties.title : properties.descr;
			var blipImageFile = findBlipImageFile(blip);
			if (blipImageFile === null) return emptyResultWithMessages([warning("Could not find image file for a:blip element")]);
			return readImage(blipImageFile, altText).map(function(imageElement) {
				var relationshipId = propertiesElement.firstOrEmpty("a:hlinkClick").attributes["r:id"];
				if (relationshipId) {
					var href = relationships.findTargetByRelationshipId(relationshipId);
					return new documents.Hyperlink([imageElement], { href });
				} else return imageElement;
			});
		}
		function isBlank(value) {
			return value == null || /^\s*$/.test(value);
		}
		function findBlipImageFile(blip) {
			var embedRelationshipId = blip.attributes["r:embed"];
			var linkRelationshipId = blip.attributes["r:link"];
			if (embedRelationshipId) return findEmbeddedImageFile(embedRelationshipId);
			else if (linkRelationshipId) {
				var imagePath = relationships.findTargetByRelationshipId(linkRelationshipId);
				return {
					path: imagePath,
					read: files.read.bind(files, imagePath)
				};
			} else return null;
		}
		function readImageData(element) {
			var relationshipId = element.attributes["r:id"];
			if (relationshipId) return readImage(findEmbeddedImageFile(relationshipId), element.attributes["o:title"]);
			else return emptyResultWithMessages([warning("A v:imagedata element without a relationship ID was ignored")]);
		}
		function findEmbeddedImageFile(relationshipId) {
			var path = uris.uriToZipEntryName("word", relationships.findTargetByRelationshipId(relationshipId));
			return {
				path,
				read: docxFile.read.bind(docxFile, path)
			};
		}
		function readImage(imageFile, altText) {
			var contentType = contentTypes.findContentType(imageFile.path);
			return elementResultWithMessages(documents.Image({
				readImage: imageFile.read,
				altText,
				contentType
			}), supportedImageTypes[contentType] ? [] : warning("Image of type " + contentType + " is unlikely to display in web browsers"));
		}
		function undefinedStyleWarning(type, styleId) {
			return warning(type + " style with ID " + styleId + " was referenced but not defined in the document");
		}
	}
	function readNumberingProperties(styleId, element, numbering) {
		var level = element.firstOrEmpty("w:ilvl").attributes["w:val"];
		var numId = element.firstOrEmpty("w:numId").attributes["w:val"];
		if (level !== void 0 && numId !== void 0) return numbering.findLevel(numId, level);
		if (styleId != null) {
			var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
			if (levelByStyleId != null) return levelByStyleId;
		}
		if (numId !== void 0) return numbering.findLevel(numId, "0");
		return null;
	}
	var supportedImageTypes = {
		"image/png": true,
		"image/gif": true,
		"image/jpeg": true,
		"image/svg+xml": true,
		"image/tiff": true
	};
	var ignoreElements = {
		"office-word:wrap": true,
		"v:shadow": true,
		"v:shapetype": true,
		"w:annotationRef": true,
		"w:bookmarkEnd": true,
		"w:sectPr": true,
		"w:proofErr": true,
		"w:lastRenderedPageBreak": true,
		"w:commentRangeStart": true,
		"w:commentRangeEnd": true,
		"w:del": true,
		"w:footnoteRef": true,
		"w:endnoteRef": true,
		"w:pPr": true,
		"w:rPr": true,
		"w:tblPr": true,
		"w:tblGrid": true,
		"w:trPr": true,
		"w:tcPr": true
	};
	function emptyResultWithMessages(messages) {
		return new ReadResult(null, null, messages);
	}
	function emptyResult() {
		return new ReadResult(null);
	}
	function elementResult(element) {
		return new ReadResult(element);
	}
	function elementResultWithMessages(element, messages) {
		return new ReadResult(element, null, messages);
	}
	function ReadResult(element, extra, messages) {
		this.value = element || [];
		this.extra = extra || [];
		this._result = new Result({
			element: this.value,
			extra
		}, messages);
		this.messages = this._result.messages;
	}
	ReadResult.prototype.toExtra = function() {
		return new ReadResult(null, joinElements(this.extra, this.value), this.messages);
	};
	ReadResult.prototype.insertExtra = function() {
		var extra = this.extra;
		if (extra && extra.length) return new ReadResult(joinElements(this.value, extra), null, this.messages);
		else return this;
	};
	ReadResult.prototype.map = function(func) {
		var result = this._result.map(function(value) {
			return func(value.element);
		});
		return new ReadResult(result.value, this.extra, result.messages);
	};
	ReadResult.prototype.flatMap = function(func) {
		var result = this._result.flatMap(function(value) {
			return func(value.element)._result;
		});
		return new ReadResult(result.value.element, joinElements(this.extra, result.value.extra), result.messages);
	};
	ReadResult.map = function(first, second, func) {
		return new ReadResult(func(first.value, second.value), joinElements(first.extra, second.extra), first.messages.concat(second.messages));
	};
	function combineResults(results) {
		var result = Result.combine(_.pluck(results, "_result"));
		return new ReadResult(_.flatten(_.pluck(result.value, "element")), _.filter(_.flatten(_.pluck(result.value, "extra")), identity), result.messages);
	}
	function joinElements(first, second) {
		return _.flatten([first, second]);
	}
	function identity(value) {
		return value;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/document-xml-reader.js
var require_document_xml_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.DocumentXmlReader = DocumentXmlReader;
	var documents = require_documents();
	var Result = require_results().Result;
	function DocumentXmlReader(options) {
		var bodyReader = options.bodyReader;
		function convertXmlToDocument(element) {
			var body = element.first("w:body");
			if (body == null) throw new Error("Could not find the body element: are you sure this is a docx file?");
			var result = bodyReader.readXmlElements(body.children).map(function(children) {
				return new documents.Document(children, {
					notes: options.notes,
					comments: options.comments
				});
			});
			return new Result(result.value, result.messages);
		}
		return { convertXmlToDocument };
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/relationships-reader.js
var require_relationships_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.readRelationships = readRelationships;
	exports.defaultValue = new Relationships([]);
	exports.Relationships = Relationships;
	function readRelationships(element) {
		var relationships = [];
		element.children.forEach(function(child) {
			if (child.name === "relationships:Relationship") {
				var relationship = {
					relationshipId: child.attributes.Id,
					target: child.attributes.Target,
					type: child.attributes.Type
				};
				relationships.push(relationship);
			}
		});
		return new Relationships(relationships);
	}
	function Relationships(relationships) {
		var targetsByRelationshipId = Object.create(null);
		relationships.forEach(function(relationship) {
			targetsByRelationshipId[relationship.relationshipId] = relationship.target;
		});
		var targetsByType = Object.create(null);
		relationships.forEach(function(relationship) {
			if (!targetsByType[relationship.type]) targetsByType[relationship.type] = [];
			targetsByType[relationship.type].push(relationship.target);
		});
		return {
			findTargetByRelationshipId: function(relationshipId) {
				return targetsByRelationshipId[relationshipId];
			},
			findTargetsByType: function(type) {
				return targetsByType[type] || [];
			}
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/content-types-reader.js
var require_content_types_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.readContentTypesFromXml = readContentTypesFromXml;
	var fallbackContentTypes = {
		"png": "png",
		"gif": "gif",
		"jpeg": "jpeg",
		"jpg": "jpeg",
		"tif": "tiff",
		"tiff": "tiff",
		"bmp": "bmp"
	};
	exports.defaultContentTypes = contentTypes({}, {});
	function readContentTypesFromXml(element) {
		var extensionDefaults = Object.create(null);
		var overrides = Object.create(null);
		element.children.forEach(function(child) {
			if (child.name === "content-types:Default") extensionDefaults[child.attributes.Extension] = child.attributes.ContentType;
			if (child.name === "content-types:Override") {
				var name = child.attributes.PartName;
				if (name.charAt(0) === "/") name = name.substring(1);
				overrides[name] = child.attributes.ContentType;
			}
		});
		return contentTypes(overrides, extensionDefaults);
	}
	function contentTypes(overrides, extensionDefaults) {
		return { findContentType: function(path) {
			var overrideContentType = overrides[path];
			if (overrideContentType) return overrideContentType;
			else {
				var pathParts = path.split(".");
				var extension = pathParts[pathParts.length - 1];
				if (Object.prototype.hasOwnProperty.call(extensionDefaults, extension)) return extensionDefaults[extension];
				else {
					var fallback = fallbackContentTypes[extension.toLowerCase()];
					if (fallback) return "image/" + fallback;
					else return null;
				}
			}
		} };
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/numbering-xml.js
var require_numbering_xml = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	exports.readNumberingXml = readNumberingXml;
	exports.Numbering = Numbering;
	exports.defaultNumbering = new Numbering({}, {});
	function Numbering(nums, abstractNums, styles) {
		var allLevels = _.flatten(_.values(abstractNums).map(function(abstractNum) {
			return _.values(abstractNum.levels);
		}));
		var levelsByParagraphStyleId = _.indexBy(allLevels.filter(function(level) {
			return level.paragraphStyleId != null;
		}), "paragraphStyleId");
		function findLevel(numId, level) {
			return findLevelWithSeenNumIds(numId, level, Object.create(null));
		}
		function findLevelWithSeenNumIds(numId, level, seenNumIds) {
			if (seenNumIds[numId]) return null;
			seenNumIds[numId] = true;
			var num = nums[numId];
			if (!num) return null;
			var abstractNum = abstractNums[num.abstractNumId];
			if (!abstractNum) return null;
			else if (abstractNum.numStyleLink == null) return abstractNums[num.abstractNumId].levels[level];
			else return findLevelWithSeenNumIds(styles.findNumberingStyleById(abstractNum.numStyleLink).numId, level, seenNumIds);
		}
		function findLevelByParagraphStyleId(styleId) {
			return levelsByParagraphStyleId[styleId] || null;
		}
		return {
			findLevel,
			findLevelByParagraphStyleId
		};
	}
	function readNumberingXml(root, options) {
		if (!options || !options.styles) throw new Error("styles is missing");
		var abstractNums = readAbstractNums(root);
		return new Numbering(readNums(root, abstractNums), abstractNums, options.styles);
	}
	function readAbstractNums(root) {
		var abstractNums = Object.create(null);
		root.getElementsByTagName("w:abstractNum").forEach(function(element) {
			var id = element.attributes["w:abstractNumId"];
			abstractNums[id] = readAbstractNum(element);
		});
		return abstractNums;
	}
	function readAbstractNum(element) {
		var levels = Object.create(null);
		var levelWithoutIndex = null;
		element.getElementsByTagName("w:lvl").forEach(function(levelElement) {
			var levelIndex = levelElement.attributes["w:ilvl"];
			var isOrdered = levelElement.firstOrEmpty("w:numFmt").attributes["w:val"] !== "bullet";
			var paragraphStyleId = levelElement.firstOrEmpty("w:pStyle").attributes["w:val"];
			if (levelIndex === void 0) levelWithoutIndex = {
				isOrdered,
				level: "0",
				paragraphStyleId
			};
			else levels[levelIndex] = {
				isOrdered,
				level: levelIndex,
				paragraphStyleId
			};
		});
		if (levelWithoutIndex !== null && levels[levelWithoutIndex.level] === void 0) levels[levelWithoutIndex.level] = levelWithoutIndex;
		return {
			levels,
			numStyleLink: element.firstOrEmpty("w:numStyleLink").attributes["w:val"]
		};
	}
	function readNums(root) {
		var nums = Object.create(null);
		root.getElementsByTagName("w:num").forEach(function(element) {
			var numId = element.attributes["w:numId"];
			nums[numId] = { abstractNumId: element.first("w:abstractNumId").attributes["w:val"] };
		});
		return nums;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/styles-reader.js
var require_styles_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.readStylesXml = readStylesXml;
	exports.Styles = Styles;
	exports.defaultStyles = new Styles({}, {});
	function Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles) {
		return {
			findParagraphStyleById: function(styleId) {
				return paragraphStyles[styleId];
			},
			findCharacterStyleById: function(styleId) {
				return characterStyles[styleId];
			},
			findTableStyleById: function(styleId) {
				return tableStyles[styleId];
			},
			findNumberingStyleById: function(styleId) {
				return numberingStyles[styleId];
			}
		};
	}
	Styles.EMPTY = new Styles({}, {}, {}, {});
	function readStylesXml(root) {
		var paragraphStyles = Object.create(null);
		var characterStyles = Object.create(null);
		var tableStyles = Object.create(null);
		var numberingStyles = Object.create(null);
		root.getElementsByTagName("w:style").forEach(function(styleElement) {
			var style = readStyleElement(styleElement);
			var styleSet;
			switch (style.type) {
				case "paragraph":
					styleSet = paragraphStyles;
					break;
				case "character":
					styleSet = characterStyles;
					break;
				case "table":
					styleSet = tableStyles;
					break;
				case "numbering": styleSet = numberingStyles;
			}
			if (styleSet && styleSet[style.styleId] === void 0) styleSet[style.styleId] = style;
		});
		return new Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles);
	}
	function readStyleElement(styleElement) {
		var type = styleElement.attributes["w:type"];
		if (type === "numbering") return readNumberingStyleElement(type, styleElement);
		else return {
			type,
			styleId: readStyleId(styleElement),
			name: styleName(styleElement)
		};
	}
	function styleName(styleElement) {
		var nameElement = styleElement.first("w:name");
		return nameElement ? nameElement.attributes["w:val"] : null;
	}
	function readNumberingStyleElement(type, styleElement) {
		var styleId = readStyleId(styleElement);
		return {
			type,
			numId: styleElement.firstOrEmpty("w:pPr").firstOrEmpty("w:numPr").firstOrEmpty("w:numId").attributes["w:val"],
			styleId
		};
	}
	function readStyleId(styleElement) {
		return styleElement.attributes["w:styleId"];
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/notes-reader.js
var require_notes_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	var documents = require_documents();
	var Result = require_results().Result;
	exports.createFootnotesReader = createReader.bind(exports, "footnote");
	exports.createEndnotesReader = createReader.bind(exports, "endnote");
	function createReader(noteType, bodyReader) {
		function readNotesXml(element) {
			return Result.combine(element.getElementsByTagName("w:" + noteType).filter(isFootnoteElement).map(readFootnoteElement));
		}
		function isFootnoteElement(element) {
			var type = element.attributes["w:type"];
			return type !== "continuationSeparator" && type !== "separator";
		}
		function readFootnoteElement(footnoteElement) {
			var id = footnoteElement.attributes["w:id"];
			return bodyReader.readXmlElements(footnoteElement.children).map(function(body) {
				return documents.Note({
					noteType,
					noteId: id,
					body
				});
			});
		}
		return readNotesXml;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/comments-reader.js
var require_comments_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	var documents = require_documents();
	var Result = require_results().Result;
	function createCommentsReader(bodyReader) {
		function readCommentsXml(element) {
			return Result.combine(element.getElementsByTagName("w:comment").map(readCommentElement));
		}
		function readCommentElement(element) {
			var id = element.attributes["w:id"];
			function readOptionalAttribute(name) {
				return (element.attributes[name] || "").trim() || null;
			}
			return bodyReader.readXmlElements(element.children).map(function(body) {
				return documents.comment({
					commentId: id,
					body,
					authorName: readOptionalAttribute("w:author"),
					authorInitials: readOptionalAttribute("w:initials")
				});
			});
		}
		return readCommentsXml;
	}
	exports.createCommentsReader = createCommentsReader;
}));
//#endregion
//#region node_modules/path-is-absolute/index.js
var require_path_is_absolute = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function posix(path) {
		return path.charAt(0) === "/";
	}
	function win32(path) {
		var result = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(path);
		var device = result[1] || "";
		var isUnc = Boolean(device && device.charAt(1) !== ":");
		return Boolean(result[2] || isUnc);
	}
	module.exports = processModule.platform === "win32" ? win32 : posix;
	module.exports.posix = posix;
	module.exports.win32 = win32;
}));
//#endregion
//#region node_modules/mammoth/lib/docx/files.js
var require_files = /* @__PURE__ */ __commonJSMin(((exports) => {
	var fs$1 = __require("node:fs");
	var url = __require("node:url");
	var os = __require("node:os");
	var dirname = __require("node:path").dirname;
	var resolvePath = __require("node:path").resolve;
	var isAbsolutePath = require_path_is_absolute();
	var promises = require_promises();
	exports.Files = Files;
	exports.uriToPath = uriToPath;
	function Files(options) {
		options = options || {};
		if (!options.externalFileAccess) return { read: function(uri) {
			return promises.reject(/* @__PURE__ */ new Error("could not read external image '" + uri + "', external file access is disabled"));
		} };
		var base = options.relativeToFile ? dirname(options.relativeToFile) : null;
		function read(uri, encoding) {
			return resolveUri(uri).then(function(path) {
				return readFile(path, encoding).caught(function(error) {
					var message = "could not open external image: '" + uri + "' (document directory: '" + base + "')\n" + error.message;
					return promises.reject(new Error(message));
				});
			});
		}
		function resolveUri(uri) {
			var path = uriToPath(uri);
			if (isAbsolutePath(path)) return promises.resolve(path);
			else if (base) return promises.resolve(resolvePath(base, path));
			else return promises.reject(/* @__PURE__ */ new Error("could not find external image '" + uri + "', path of input document is unknown"));
		}
		return { read };
	}
	var readFile = promises.promisify(fs$1.readFile.bind(fs$1));
	function uriToPath(uriString, platform) {
		if (!platform) platform = os.platform();
		var uri = url.parse(uriString);
		if (isLocalFileUri(uri) || isRelativeUri(uri)) {
			var path = decodeURIComponent(uri.path);
			if (platform === "win32" && /^\/[a-z]:/i.test(path)) return path.slice(1);
			else return path;
		} else throw new Error("Could not convert URI to path: " + uriString);
	}
	function isLocalFileUri(uri) {
		return uri.protocol === "file:" && (!uri.host || uri.host === "localhost");
	}
	function isRelativeUri(uri) {
		return !uri.protocol && !uri.host;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/docx-reader.js
var require_docx_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.read = read;
	exports._findPartPaths = findPartPaths;
	var promises = require_promises();
	var documents = require_documents();
	var Result = require_results().Result;
	var zipfile = require_zipfile();
	var readXmlFromZipFile = require_office_xml_reader().readXmlFromZipFile;
	var createBodyReader = require_body_reader().createBodyReader;
	var DocumentXmlReader = require_document_xml_reader().DocumentXmlReader;
	var relationshipsReader = require_relationships_reader();
	var contentTypesReader = require_content_types_reader();
	var numberingXml = require_numbering_xml();
	var stylesReader = require_styles_reader();
	var notesReader = require_notes_reader();
	var commentsReader = require_comments_reader();
	var Files = require_files().Files;
	function read(docxFile, input, options) {
		input = input || {};
		options = options || {};
		var files = new Files({
			externalFileAccess: options.externalFileAccess,
			relativeToFile: input.path
		});
		return promises.props({
			contentTypes: readContentTypesFromZipFile(docxFile),
			partPaths: findPartPaths(docxFile),
			docxFile,
			files
		}).also(function(result) {
			return { styles: readStylesFromZipFile(docxFile, result.partPaths.styles) };
		}).also(function(result) {
			return { numbering: readNumberingFromZipFile(docxFile, result.partPaths.numbering, result.styles) };
		}).also(function(result) {
			return {
				footnotes: readXmlFileWithBody(result.partPaths.footnotes, result, function(bodyReader, xml) {
					if (xml) return notesReader.createFootnotesReader(bodyReader)(xml);
					else return new Result([]);
				}),
				endnotes: readXmlFileWithBody(result.partPaths.endnotes, result, function(bodyReader, xml) {
					if (xml) return notesReader.createEndnotesReader(bodyReader)(xml);
					else return new Result([]);
				}),
				comments: readXmlFileWithBody(result.partPaths.comments, result, function(bodyReader, xml) {
					if (xml) return commentsReader.createCommentsReader(bodyReader)(xml);
					else return new Result([]);
				})
			};
		}).also(function(result) {
			return { notes: result.footnotes.flatMap(function(footnotes) {
				return result.endnotes.map(function(endnotes) {
					return new documents.Notes(footnotes.concat(endnotes));
				});
			}) };
		}).then(function(result) {
			return readXmlFileWithBody(result.partPaths.mainDocument, result, function(bodyReader, xml) {
				return result.notes.flatMap(function(notes) {
					return result.comments.flatMap(function(comments) {
						return new DocumentXmlReader({
							bodyReader,
							notes,
							comments
						}).convertXmlToDocument(xml);
					});
				});
			});
		});
	}
	function findPartPaths(docxFile) {
		return readPackageRelationships(docxFile).then(function(packageRelationships) {
			var mainDocumentPath = findPartPath({
				docxFile,
				relationships: packageRelationships,
				relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
				basePath: "",
				fallbackPath: "word/document.xml"
			});
			if (!docxFile.exists(mainDocumentPath)) throw new Error("Could not find main document part. Are you sure this is a valid .docx file?");
			return xmlFileReader({
				filename: relationshipsFilename(mainDocumentPath),
				readElement: relationshipsReader.readRelationships,
				defaultValue: relationshipsReader.defaultValue
			})(docxFile).then(function(documentRelationships) {
				function findPartRelatedToMainDocument(name) {
					return findPartPath({
						docxFile,
						relationships: documentRelationships,
						relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/" + name,
						basePath: zipfile.splitPath(mainDocumentPath).dirname,
						fallbackPath: "word/" + name + ".xml"
					});
				}
				return {
					mainDocument: mainDocumentPath,
					comments: findPartRelatedToMainDocument("comments"),
					endnotes: findPartRelatedToMainDocument("endnotes"),
					footnotes: findPartRelatedToMainDocument("footnotes"),
					numbering: findPartRelatedToMainDocument("numbering"),
					styles: findPartRelatedToMainDocument("styles")
				};
			});
		});
	}
	function findPartPath(options) {
		var docxFile = options.docxFile;
		var relationships = options.relationships;
		var relationshipType = options.relationshipType;
		var basePath = options.basePath;
		var fallbackPath = options.fallbackPath;
		var validTargets = relationships.findTargetsByType(relationshipType).map(function(target) {
			return stripPrefix(zipfile.joinPath(basePath, target), "/");
		}).filter(function(target) {
			return docxFile.exists(target);
		});
		if (validTargets.length === 0) return fallbackPath;
		else return validTargets[0];
	}
	function stripPrefix(value, prefix) {
		if (value.substring(0, prefix.length) === prefix) return value.substring(prefix.length);
		else return value;
	}
	function xmlFileReader(options) {
		return function(zipFile) {
			return readXmlFromZipFile(zipFile, options.filename).then(function(element) {
				return element ? options.readElement(element) : options.defaultValue;
			});
		};
	}
	function readXmlFileWithBody(filename, options, func) {
		return xmlFileReader({
			filename: relationshipsFilename(filename),
			readElement: relationshipsReader.readRelationships,
			defaultValue: relationshipsReader.defaultValue
		})(options.docxFile).then(function(relationships) {
			var bodyReader = new createBodyReader({
				relationships,
				contentTypes: options.contentTypes,
				docxFile: options.docxFile,
				numbering: options.numbering,
				styles: options.styles,
				files: options.files
			});
			return readXmlFromZipFile(options.docxFile, filename).then(function(xml) {
				return func(bodyReader, xml);
			});
		});
	}
	function relationshipsFilename(filename) {
		var split = zipfile.splitPath(filename);
		return zipfile.joinPath(split.dirname, "_rels", split.basename + ".rels");
	}
	var readContentTypesFromZipFile = xmlFileReader({
		filename: "[Content_Types].xml",
		readElement: contentTypesReader.readContentTypesFromXml,
		defaultValue: contentTypesReader.defaultContentTypes
	});
	function readNumberingFromZipFile(zipFile, path, styles) {
		return xmlFileReader({
			filename: path,
			readElement: function(element) {
				return numberingXml.readNumberingXml(element, { styles });
			},
			defaultValue: numberingXml.defaultNumbering
		})(zipFile);
	}
	function readStylesFromZipFile(zipFile, path) {
		return xmlFileReader({
			filename: path,
			readElement: stylesReader.readStylesXml,
			defaultValue: stylesReader.defaultStyles
		})(zipFile);
	}
	var readPackageRelationships = xmlFileReader({
		filename: "_rels/.rels",
		readElement: relationshipsReader.readRelationships,
		defaultValue: relationshipsReader.defaultValue
	});
}));
//#endregion
//#region node_modules/mammoth/lib/docx/style-map.js
var require_style_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var promises = require_promises();
	var xml = require_xml();
	exports.writeStyleMap = writeStyleMap;
	exports.readStyleMap = readStyleMap;
	var schema = "http://schemas.zwobble.org/mammoth/style-map";
	var styleMapPath = "mammoth/style-map";
	var styleMapAbsolutePath = "/" + styleMapPath;
	function writeStyleMap(docxFile, styleMap) {
		docxFile.write(styleMapPath, styleMap);
		return updateRelationships(docxFile).then(function() {
			return updateContentTypes(docxFile);
		});
	}
	function updateRelationships(docxFile) {
		var path = "word/_rels/document.xml.rels";
		var relationshipsUri = "http://schemas.openxmlformats.org/package/2006/relationships";
		var relationshipElementName = "{" + relationshipsUri + "}Relationship";
		return docxFile.read(path, "utf8").then(xml.readString).then(function(relationshipsContainer) {
			var relationships = relationshipsContainer.children;
			addOrUpdateElement(relationships, relationshipElementName, "Id", {
				"Id": "rMammothStyleMap",
				"Type": schema,
				"Target": styleMapAbsolutePath
			});
			var namespaces = { "": relationshipsUri };
			return docxFile.write(path, xml.writeString(relationshipsContainer, namespaces));
		});
	}
	function updateContentTypes(docxFile) {
		var path = "[Content_Types].xml";
		var contentTypesUri = "http://schemas.openxmlformats.org/package/2006/content-types";
		var overrideName = "{" + contentTypesUri + "}Override";
		return docxFile.read(path, "utf8").then(xml.readString).then(function(typesElement) {
			var children = typesElement.children;
			addOrUpdateElement(children, overrideName, "PartName", {
				"PartName": styleMapAbsolutePath,
				"ContentType": "text/prs.mammoth.style-map"
			});
			var namespaces = { "": contentTypesUri };
			return docxFile.write(path, xml.writeString(typesElement, namespaces));
		});
	}
	function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
		var existingElement = _.find(elements, function(element) {
			return element.name === name && element.attributes[identifyingAttribute] === attributes[identifyingAttribute];
		});
		if (existingElement) existingElement.attributes = attributes;
		else elements.push(xml.element(name, attributes));
	}
	function readStyleMap(docxFile) {
		if (docxFile.exists(styleMapPath)) return docxFile.read(styleMapPath, "utf8");
		else return promises.resolve(null);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/html/ast.js
var require_ast = /* @__PURE__ */ __commonJSMin(((exports) => {
	var htmlPaths = require_html_paths();
	function nonFreshElement(tagName, attributes, children) {
		return elementWithTag(htmlPaths.element(tagName, attributes, { fresh: false }), children);
	}
	function freshElement(tagName, attributes, children) {
		return elementWithTag(htmlPaths.element(tagName, attributes, { fresh: true }), children);
	}
	function elementWithTag(tag, children) {
		return {
			type: "element",
			tag,
			children: children || []
		};
	}
	function text(value) {
		return {
			type: "text",
			value
		};
	}
	var forceWrite = { type: "forceWrite" };
	exports.freshElement = freshElement;
	exports.nonFreshElement = nonFreshElement;
	exports.elementWithTag = elementWithTag;
	exports.text = text;
	exports.forceWrite = forceWrite;
	var voidTagNames = {
		"br": true,
		"hr": true,
		"img": true,
		"input": true
	};
	function isVoidElement(node) {
		return node.children.length === 0 && voidTagNames[node.tag.tagName];
	}
	exports.isVoidElement = isVoidElement;
}));
//#endregion
//#region node_modules/mammoth/lib/html/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _ = require_underscore_umd();
	var ast = require_ast();
	function simplify(nodes) {
		return collapse(removeEmpty(nodes));
	}
	function collapse(nodes) {
		var children = [];
		nodes.map(collapseNode).forEach(function(child) {
			appendChild(children, child);
		});
		return children;
	}
	function collapseNode(node) {
		return collapsers[node.type](node);
	}
	var collapsers = {
		element: collapseElement,
		text: identity,
		forceWrite: identity
	};
	function collapseElement(node) {
		return ast.elementWithTag(node.tag, collapse(node.children));
	}
	function identity(value) {
		return value;
	}
	function appendChild(children, child) {
		var lastChild = children[children.length - 1];
		if (child.type === "element" && !child.tag.fresh && lastChild && lastChild.type === "element" && child.tag.matchesElement(lastChild.tag)) {
			if (child.tag.separator) appendChild(lastChild.children, ast.text(child.tag.separator));
			child.children.forEach(function(grandChild) {
				appendChild(lastChild.children, grandChild);
			});
		} else children.push(child);
	}
	function removeEmpty(nodes) {
		return flatMap(nodes, function(node) {
			return emptiers[node.type](node);
		});
	}
	function flatMap(values, func) {
		return _.flatten(_.map(values, func), true);
	}
	var emptiers = {
		element: elementEmptier,
		text: textEmptier,
		forceWrite: neverEmpty
	};
	function neverEmpty(node) {
		return [node];
	}
	function elementEmptier(element) {
		var children = removeEmpty(element.children);
		if (children.length === 0 && !ast.isVoidElement(element)) return [];
		else return [ast.elementWithTag(element.tag, children)];
	}
	function textEmptier(node) {
		if (node.value.length === 0) return [];
		else return [node];
	}
	module.exports = simplify;
}));
//#endregion
//#region node_modules/mammoth/lib/html/index.js
var require_html = /* @__PURE__ */ __commonJSMin(((exports) => {
	var ast = require_ast();
	exports.freshElement = ast.freshElement;
	exports.nonFreshElement = ast.nonFreshElement;
	exports.elementWithTag = ast.elementWithTag;
	exports.text = ast.text;
	exports.forceWrite = ast.forceWrite;
	exports.simplify = require_simplify();
	function write(writer, nodes) {
		nodes.forEach(function(node) {
			writeNode(writer, node);
		});
	}
	function writeNode(writer, node) {
		toStrings[node.type](writer, node);
	}
	var toStrings = {
		element: generateElementString,
		text: generateTextString,
		forceWrite: function() {}
	};
	function generateElementString(writer, node) {
		if (ast.isVoidElement(node)) writer.selfClosing(node.tag.tagName, node.tag.attributes);
		else {
			writer.open(node.tag.tagName, node.tag.attributes);
			write(writer, node.children);
			writer.close(node.tag.tagName);
		}
	}
	function generateTextString(writer, node) {
		writer.text(node.value);
	}
	exports.write = write;
}));
//#endregion
//#region node_modules/mammoth/lib/styles/html-paths.js
var require_html_paths = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var html = require_html();
	exports.topLevelElement = topLevelElement;
	exports.elements = elements;
	exports.element = element;
	function topLevelElement(tagName, attributes) {
		return elements([element(tagName, attributes, { fresh: true })]);
	}
	function elements(elementStyles) {
		return new HtmlPath(elementStyles.map(function(elementStyle) {
			if (_.isString(elementStyle)) return element(elementStyle);
			else return elementStyle;
		}));
	}
	function HtmlPath(elements) {
		this._elements = elements;
	}
	HtmlPath.prototype.wrap = function wrap(children) {
		var result = children();
		for (var index = this._elements.length - 1; index >= 0; index--) result = this._elements[index].wrapNodes(result);
		return result;
	};
	function element(tagName, attributes, options) {
		options = options || {};
		return new Element(tagName, attributes, options);
	}
	function Element(tagName, attributes, options) {
		var tagNames = Object.create(null);
		if (_.isArray(tagName)) {
			tagName.forEach(function(tagName) {
				tagNames[tagName] = true;
			});
			tagName = tagName[0];
		} else tagNames[tagName] = true;
		this.tagName = tagName;
		this.tagNames = tagNames;
		this.attributes = attributes || {};
		this.fresh = options.fresh;
		this.separator = options.separator;
	}
	Element.prototype.matchesElement = function(element) {
		return this.tagNames[element.tagName] && _.isEqual(this.attributes || {}, element.attributes || {});
	};
	Element.prototype.wrap = function wrap(generateNodes) {
		return this.wrapNodes(generateNodes());
	};
	Element.prototype.wrapNodes = function wrapNodes(nodes) {
		return [html.elementWithTag(this, nodes)];
	};
	exports.empty = elements([]);
	exports.ignore = { wrap: function() {
		return [];
	} };
}));
//#endregion
//#region node_modules/mammoth/lib/images.js
var require_images = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var promises = require_promises();
	var Html = require_html();
	exports.imgElement = imgElement;
	function imgElement(func) {
		return function(element, messages) {
			return promises.when(func(element)).then(function(result) {
				var attributes = {};
				if (element.altText) attributes.alt = element.altText;
				_.extend(attributes, result);
				return [Html.freshElement("img", attributes)];
			});
		};
	}
	exports.inline = exports.imgElement;
	exports.dataUri = imgElement(function(element) {
		return element.readAsBase64String().then(function(imageBuffer) {
			return { src: "data:" + element.contentType + ";base64," + imageBuffer };
		});
	});
	function imageFilenameExtension(image) {
		return image.contentType.split(/\/|\\/)[1];
	}
	exports.imageFilenameExtension = imageFilenameExtension;
}));
//#endregion
//#region node_modules/mammoth/lib/writers/html-writer.js
var require_html_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	exports.writer = writer;
	function writer(options) {
		options = options || {};
		if (options.prettyPrint) return prettyWriter();
		else return simpleWriter();
	}
	var indentedElements = {
		div: true,
		p: true,
		ul: true,
		li: true
	};
	function prettyWriter() {
		var indentationLevel = 0;
		var indentation = "  ";
		var stack = [];
		var start = true;
		var inText = false;
		var writer = simpleWriter();
		function open(tagName, attributes) {
			if (indentedElements[tagName]) indent();
			stack.push(tagName);
			writer.open(tagName, attributes);
			if (indentedElements[tagName]) indentationLevel++;
			start = false;
		}
		function close(tagName) {
			if (indentedElements[tagName]) {
				indentationLevel--;
				indent();
			}
			stack.pop();
			writer.close(tagName);
		}
		function text(value) {
			startText();
			var text = isInPre() ? value : value.replace("\n", "\n  ");
			writer.text(text);
		}
		function selfClosing(tagName, attributes) {
			indent();
			writer.selfClosing(tagName, attributes);
		}
		function insideIndentedElement() {
			return stack.length === 0 || indentedElements[stack[stack.length - 1]];
		}
		function startText() {
			if (!inText) {
				indent();
				inText = true;
			}
		}
		function indent() {
			inText = false;
			if (!start && insideIndentedElement() && !isInPre()) {
				writer._append("\n");
				for (var i = 0; i < indentationLevel; i++) writer._append(indentation);
			}
		}
		function isInPre() {
			return _.some(stack, function(tagName) {
				return tagName === "pre";
			});
		}
		return {
			asString: writer.asString,
			open,
			close,
			text,
			selfClosing
		};
	}
	function simpleWriter() {
		var fragments = [];
		function open(tagName, attributes) {
			var attributeString = generateAttributeString(attributes);
			fragments.push("<" + tagName + attributeString + ">");
		}
		function close(tagName) {
			fragments.push("</" + tagName + ">");
		}
		function selfClosing(tagName, attributes) {
			var attributeString = generateAttributeString(attributes);
			fragments.push("<" + tagName + attributeString + " />");
		}
		function generateAttributeString(attributes) {
			return _.map(attributes, function(value, key) {
				return " " + key + "=\"" + escapeHtmlAttribute(value) + "\"";
			}).join("");
		}
		function text(value) {
			fragments.push(escapeHtmlText(value));
		}
		function append(html) {
			fragments.push(html);
		}
		function asString() {
			return fragments.join("");
		}
		return {
			asString,
			open,
			close,
			text,
			selfClosing,
			_append: append
		};
	}
	function escapeHtmlText(value) {
		return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	function escapeHtmlAttribute(value) {
		return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/writers/markdown-writer.js
var require_markdown_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	function symmetricMarkdownElement(end) {
		return markdownElement(end, end);
	}
	function markdownElement(start, end) {
		return function() {
			return {
				start,
				end
			};
		};
	}
	function markdownLink(attributes) {
		var href = attributes.href || "";
		if (href) return {
			start: "[",
			end: "](" + href + ")",
			anchorPosition: "before"
		};
		else return {};
	}
	function markdownImage(attributes) {
		var src = attributes.src || "";
		var altText = attributes.alt || "";
		if (src || altText) return { start: "![" + altText + "](" + src + ")" };
		else return {};
	}
	function markdownList(options) {
		return function(attributes, list) {
			return {
				start: list ? "\n" : "",
				end: list ? "" : "\n",
				list: {
					isOrdered: options.isOrdered,
					indent: list ? list.indent + 1 : 0,
					count: 0
				}
			};
		};
	}
	function markdownListItem(attributes, list, listItem) {
		list = list || {
			indent: 0,
			isOrdered: false,
			count: 0
		};
		list.count++;
		listItem.hasClosed = false;
		var bullet = list.isOrdered ? list.count + "." : "-";
		return {
			start: repeatString("	", list.indent) + bullet + " ",
			end: function() {
				if (!listItem.hasClosed) {
					listItem.hasClosed = true;
					return "\n";
				}
			}
		};
	}
	var htmlToMarkdown = {
		"p": markdownElement("", "\n\n"),
		"br": markdownElement("", "  \n"),
		"ul": markdownList({ isOrdered: false }),
		"ol": markdownList({ isOrdered: true }),
		"li": markdownListItem,
		"strong": symmetricMarkdownElement("__"),
		"em": symmetricMarkdownElement("*"),
		"a": markdownLink,
		"img": markdownImage
	};
	(function() {
		for (var i = 1; i <= 6; i++) htmlToMarkdown["h" + i] = markdownElement(repeatString("#", i) + " ", "\n\n");
	})();
	function repeatString(value, count) {
		return new Array(count + 1).join(value);
	}
	function markdownWriter() {
		var fragments = [];
		var elementStack = [];
		var list = null;
		var listItem = {};
		function open(tagName, attributes) {
			attributes = attributes || {};
			var element = (htmlToMarkdown[tagName] || function() {
				return {};
			})(attributes, list, listItem);
			elementStack.push({
				end: element.end,
				list
			});
			if (element.list) list = element.list;
			var anchorBeforeStart = element.anchorPosition === "before";
			if (anchorBeforeStart) writeAnchor(attributes);
			fragments.push(element.start || "");
			if (!anchorBeforeStart) writeAnchor(attributes);
		}
		function writeAnchor(attributes) {
			if (attributes.id) fragments.push("<a id=\"" + attributes.id + "\"></a>");
		}
		function close(tagName) {
			var element = elementStack.pop();
			list = element.list;
			var end = _.isFunction(element.end) ? element.end() : element.end;
			fragments.push(end || "");
		}
		function selfClosing(tagName, attributes) {
			open(tagName, attributes);
			close(tagName);
		}
		function text(value) {
			fragments.push(escapeMarkdown(value));
		}
		function asString() {
			return fragments.join("");
		}
		return {
			asString,
			open,
			close,
			text,
			selfClosing
		};
	}
	exports.writer = markdownWriter;
	function escapeMarkdown(value) {
		return value.replace(/\\/g, "\\\\").replace(/([\`\*_\{\}\[\]\(\)\#\+\-\.\!])/g, "\\$1");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/writers/index.js
var require_writers = /* @__PURE__ */ __commonJSMin(((exports) => {
	var htmlWriter = require_html_writer();
	var markdownWriter = require_markdown_writer();
	exports.writer = writer;
	function writer(options) {
		options = options || {};
		if (options.outputFormat === "markdown") return markdownWriter.writer();
		else return htmlWriter.writer(options);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/document-to-html.js
var require_document_to_html = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var promises = require_promises();
	var documents = require_documents();
	var htmlPaths = require_html_paths();
	var results = require_results();
	var images = require_images();
	var Html = require_html();
	var writers = require_writers();
	exports.DocumentConverter = DocumentConverter;
	function DocumentConverter(options) {
		return { convertToHtml: function(element) {
			return new DocumentConversion(options, _.indexBy(element.type === documents.types.document ? element.comments : [], "commentId")).convertToHtml(element);
		} };
	}
	function DocumentConversion(options, comments) {
		var noteNumber = 1;
		var noteReferences = [];
		var referencedComments = [];
		options = _.extend({ ignoreEmptyParagraphs: true }, options);
		var idPrefix = options.idPrefix === void 0 ? "" : options.idPrefix;
		var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;
		var defaultParagraphStyle = htmlPaths.topLevelElement("p");
		var styleMap = options.styleMap || [];
		function convertToHtml(document) {
			var messages = [];
			var html = elementToHtml(document, messages, Object.create(null));
			var deferredNodes = [];
			walkHtml(html, function(node) {
				if (node.type === "deferred") deferredNodes.push(node);
			});
			var deferredValues = Object.create(null);
			return promises.mapSeries(deferredNodes, function(deferred) {
				return deferred.value().then(function(value) {
					deferredValues[deferred.id] = value;
				});
			}).then(function() {
				function replaceDeferred(nodes) {
					return flatMap(nodes, function(node) {
						if (node.type === "deferred") return deferredValues[node.id];
						else if (node.children) return [_.extend({}, node, { children: replaceDeferred(node.children) })];
						else return [node];
					});
				}
				var writer = writers.writer({
					prettyPrint: options.prettyPrint,
					outputFormat: options.outputFormat
				});
				Html.write(writer, Html.simplify(replaceDeferred(html)));
				return new results.Result(writer.asString(), messages);
			});
		}
		function convertElements(elements, messages, options) {
			return flatMap(elements, function(element) {
				return elementToHtml(element, messages, options);
			});
		}
		function elementToHtml(element, messages, options) {
			if (!options) throw new Error("options not set");
			var handler = elementConverters[element.type];
			if (handler) return handler(element, messages, options);
			else return [];
		}
		function convertParagraph(element, messages, options) {
			return htmlPathForParagraph(element, messages).wrap(function() {
				var content = convertElements(element.children, messages, options);
				if (ignoreEmptyParagraphs) return content;
				else return [Html.forceWrite].concat(content);
			});
		}
		function htmlPathForParagraph(element, messages) {
			var style = findStyle(element);
			if (style) return style.to;
			else {
				if (element.styleId) messages.push(unrecognisedStyleWarning("paragraph", element));
				return defaultParagraphStyle;
			}
		}
		function convertRun(run, messages, options) {
			var nodes = function() {
				return convertElements(run.children, messages, options);
			};
			var paths = [];
			if (run.highlight !== null) {
				var path = findHtmlPath({
					type: "highlight",
					color: run.highlight
				});
				if (path) paths.push(path);
			}
			if (run.isSmallCaps) paths.push(findHtmlPathForRunProperty("smallCaps"));
			if (run.isAllCaps) paths.push(findHtmlPathForRunProperty("allCaps"));
			if (run.isStrikethrough) paths.push(findHtmlPathForRunProperty("strikethrough", "s"));
			if (run.isUnderline) paths.push(findHtmlPathForRunProperty("underline"));
			if (run.verticalAlignment === documents.verticalAlignment.subscript) paths.push(htmlPaths.element("sub", {}, { fresh: false }));
			if (run.verticalAlignment === documents.verticalAlignment.superscript) paths.push(htmlPaths.element("sup", {}, { fresh: false }));
			if (run.isItalic) paths.push(findHtmlPathForRunProperty("italic", "em"));
			if (run.isBold) paths.push(findHtmlPathForRunProperty("bold", "strong"));
			var stylePath = htmlPaths.empty;
			var style = findStyle(run);
			if (style) stylePath = style.to;
			else if (run.styleId) messages.push(unrecognisedStyleWarning("run", run));
			paths.push(stylePath);
			paths.forEach(function(path) {
				nodes = path.wrap.bind(path, nodes);
			});
			return nodes();
		}
		function findHtmlPathForRunProperty(elementType, defaultTagName) {
			var path = findHtmlPath({ type: elementType });
			if (path) return path;
			else if (defaultTagName) return htmlPaths.element(defaultTagName, {}, { fresh: false });
			else return htmlPaths.empty;
		}
		function findHtmlPath(element, defaultPath) {
			var style = findStyle(element);
			return style ? style.to : defaultPath;
		}
		function findStyle(element) {
			for (var i = 0; i < styleMap.length; i++) if (styleMap[i].from.matches(element)) return styleMap[i];
		}
		function recoveringConvertImage(convertImage) {
			return function(image, messages) {
				return promises.attempt(function() {
					return convertImage(image, messages);
				}).caught(function(error) {
					messages.push(results.error(error));
					return [];
				});
			};
		}
		function noteHtmlId(note) {
			return referentHtmlId(note.noteType, note.noteId);
		}
		function noteRefHtmlId(note) {
			return referenceHtmlId(note.noteType, note.noteId);
		}
		function referentHtmlId(referenceType, referenceId) {
			return htmlId(referenceType + "-" + referenceId);
		}
		function referenceHtmlId(referenceType, referenceId) {
			return htmlId(referenceType + "-ref-" + referenceId);
		}
		function htmlId(suffix) {
			return idPrefix + suffix;
		}
		var defaultTablePath = htmlPaths.elements([htmlPaths.element("table", {}, { fresh: true })]);
		function convertTable(element, messages, options) {
			return findHtmlPath(element, defaultTablePath).wrap(function() {
				return convertTableChildren(element, messages, options);
			});
		}
		function convertTableChildren(element, messages, options) {
			var bodyIndex = _.findIndex(element.children, function(child) {
				return !child.type === documents.types.tableRow || !child.isHeader;
			});
			if (bodyIndex === -1) bodyIndex = element.children.length;
			var children;
			if (bodyIndex === 0) children = convertElements(element.children, messages, _.extend({}, options, { isTableHeader: false }));
			else {
				var headRows = convertElements(element.children.slice(0, bodyIndex), messages, _.extend({}, options, { isTableHeader: true }));
				var bodyRows = convertElements(element.children.slice(bodyIndex), messages, _.extend({}, options, { isTableHeader: false }));
				children = [Html.freshElement("thead", {}, headRows), Html.freshElement("tbody", {}, bodyRows)];
			}
			return [Html.forceWrite].concat(children);
		}
		function convertTableRow(element, messages, options) {
			var children = convertElements(element.children, messages, options);
			return [Html.freshElement("tr", {}, [Html.forceWrite].concat(children))];
		}
		function convertTableCell(element, messages, options) {
			var tagName = options.isTableHeader ? "th" : "td";
			var children = convertElements(element.children, messages, options);
			var attributes = {};
			if (element.colSpan !== 1) attributes.colspan = element.colSpan.toString();
			if (element.rowSpan !== 1) attributes.rowspan = element.rowSpan.toString();
			return [Html.freshElement(tagName, attributes, [Html.forceWrite].concat(children))];
		}
		function convertCommentReference(reference, messages, options) {
			return findHtmlPath(reference, htmlPaths.ignore).wrap(function() {
				var comment = comments[reference.commentId];
				var count = referencedComments.length + 1;
				var label = "[" + commentAuthorLabel(comment) + count + "]";
				referencedComments.push({
					label,
					comment
				});
				return [Html.freshElement("a", {
					href: "#" + referentHtmlId("comment", reference.commentId),
					id: referenceHtmlId("comment", reference.commentId)
				}, [Html.text(label)])];
			});
		}
		function convertComment(referencedComment, messages, options) {
			var label = referencedComment.label;
			var comment = referencedComment.comment;
			var body = convertElements(comment.body, messages, options).concat([Html.nonFreshElement("p", {}, [Html.text(" "), Html.freshElement("a", { "href": "#" + referenceHtmlId("comment", comment.commentId) }, [Html.text("↑")])])]);
			return [Html.freshElement("dt", { "id": referentHtmlId("comment", comment.commentId) }, [Html.text("Comment " + label)]), Html.freshElement("dd", {}, body)];
		}
		function convertBreak(element, messages, options) {
			return htmlPathForBreak(element).wrap(function() {
				return [];
			});
		}
		function htmlPathForBreak(element) {
			var style = findStyle(element);
			if (style) return style.to;
			else if (element.breakType === "line") return htmlPaths.topLevelElement("br");
			else return htmlPaths.empty;
		}
		var elementConverters = {
			"document": function(document, messages, options) {
				var children = convertElements(document.children, messages, options);
				var notesNodes = convertElements(noteReferences.map(function(noteReference) {
					return document.notes.resolve(noteReference);
				}), messages, options);
				return children.concat([Html.freshElement("ol", {}, notesNodes), Html.freshElement("dl", {}, flatMap(referencedComments, function(referencedComment) {
					return convertComment(referencedComment, messages, options);
				}))]);
			},
			"paragraph": convertParagraph,
			"run": convertRun,
			"text": function(element, messages, options) {
				return [Html.text(element.value)];
			},
			"tab": function(element, messages, options) {
				return [Html.text("	")];
			},
			"hyperlink": function(element, messages, options) {
				var attributes = { href: element.anchor ? "#" + htmlId(element.anchor) : element.href };
				if (element.targetFrame != null) attributes.target = element.targetFrame;
				var children = convertElements(element.children, messages, options);
				return [Html.nonFreshElement("a", attributes, children)];
			},
			"checkbox": function(element) {
				var attributes = { type: "checkbox" };
				if (element.checked) attributes["checked"] = "checked";
				return [Html.freshElement("input", attributes)];
			},
			"bookmarkStart": function(element, messages, options) {
				return [Html.freshElement("a", { id: htmlId(element.name) }, [Html.forceWrite])];
			},
			"noteReference": function(element, messages, options) {
				noteReferences.push(element);
				var anchor = Html.freshElement("a", {
					href: "#" + noteHtmlId(element),
					id: noteRefHtmlId(element)
				}, [Html.text("[" + noteNumber++ + "]")]);
				return [Html.freshElement("sup", {}, [anchor])];
			},
			"note": function(element, messages, options) {
				var children = convertElements(element.body, messages, options);
				var backLink = Html.elementWithTag(htmlPaths.element("p", {}, { fresh: false }), [Html.text(" "), Html.freshElement("a", { href: "#" + noteRefHtmlId(element) }, [Html.text("↑")])]);
				var body = children.concat([backLink]);
				return Html.freshElement("li", { id: noteHtmlId(element) }, body);
			},
			"commentReference": convertCommentReference,
			"comment": convertComment,
			"image": deferredConversion(recoveringConvertImage(options.convertImage || images.dataUri)),
			"table": convertTable,
			"tableRow": convertTableRow,
			"tableCell": convertTableCell,
			"break": convertBreak
		};
		return { convertToHtml };
	}
	var deferredId = 1;
	function deferredConversion(func) {
		return function(element, messages, options) {
			return [{
				type: "deferred",
				id: deferredId++,
				value: function() {
					return func(element, messages, options);
				}
			}];
		};
	}
	function unrecognisedStyleWarning(type, element) {
		return results.warning("Unrecognised " + type + " style: '" + element.styleName + "' (Style ID: " + element.styleId + ")");
	}
	function flatMap(values, func) {
		return _.flatten(values.map(func), true);
	}
	function walkHtml(nodes, callback) {
		nodes.forEach(function(node) {
			callback(node);
			if (node.children) walkHtml(node.children, callback);
		});
	}
	var commentAuthorLabel = exports.commentAuthorLabel = function commentAuthorLabel(comment) {
		return comment.authorInitials || "";
	};
}));
//#endregion
//#region node_modules/mammoth/lib/raw-text.js
var require_raw_text = /* @__PURE__ */ __commonJSMin(((exports) => {
	var documents = require_documents();
	function convertElementToRawText(element) {
		if (element.type === "text") return element.value;
		else if (element.type === documents.types.tab) return "	";
		else {
			var tail = element.type === "paragraph" ? "\n\n" : "";
			return (element.children || []).map(convertElementToRawText).join("") + tail;
		}
	}
	exports.convertElementToRawText = convertElementToRawText;
}));
//#endregion
//#region node_modules/mammoth/lib/styles/document-matchers.js
var require_document_matchers = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.paragraph = paragraph;
	exports.run = run;
	exports.table = table;
	exports.bold = new Matcher("bold");
	exports.italic = new Matcher("italic");
	exports.underline = new Matcher("underline");
	exports.strikethrough = new Matcher("strikethrough");
	exports.allCaps = new Matcher("allCaps");
	exports.smallCaps = new Matcher("smallCaps");
	exports.highlight = highlight;
	exports.commentReference = new Matcher("commentReference");
	exports.lineBreak = new BreakMatcher({ breakType: "line" });
	exports.pageBreak = new BreakMatcher({ breakType: "page" });
	exports.columnBreak = new BreakMatcher({ breakType: "column" });
	exports.equalTo = equalTo;
	exports.startsWith = startsWith;
	function paragraph(options) {
		return new Matcher("paragraph", options);
	}
	function run(options) {
		return new Matcher("run", options);
	}
	function table(options) {
		return new Matcher("table", options);
	}
	function highlight(options) {
		return new HighlightMatcher(options);
	}
	function Matcher(elementType, options) {
		options = options || {};
		this._elementType = elementType;
		this._styleId = options.styleId;
		this._styleName = options.styleName;
		if (options.list) {
			this._listIndex = options.list.levelIndex;
			this._listIsOrdered = options.list.isOrdered;
		}
	}
	Matcher.prototype.matches = function(element) {
		return element.type === this._elementType && (this._styleId === void 0 || element.styleId === this._styleId) && (this._styleName === void 0 || element.styleName && this._styleName.operator(this._styleName.operand, element.styleName)) && (this._listIndex === void 0 || isList(element, this._listIndex, this._listIsOrdered)) && (this._breakType === void 0 || this._breakType === element.breakType);
	};
	function HighlightMatcher(options) {
		options = options || {};
		this._color = options.color;
	}
	HighlightMatcher.prototype.matches = function(element) {
		return element.type === "highlight" && (this._color === void 0 || element.color === this._color);
	};
	function BreakMatcher(options) {
		options = options || {};
		this._breakType = options.breakType;
	}
	BreakMatcher.prototype.matches = function(element) {
		return element.type === "break" && (this._breakType === void 0 || element.breakType === this._breakType);
	};
	function isList(element, levelIndex, isOrdered) {
		return element.numbering && element.numbering.level == levelIndex && element.numbering.isOrdered == isOrdered;
	}
	function equalTo(value) {
		return {
			operator: operatorEqualTo,
			operand: value
		};
	}
	function startsWith(value) {
		return {
			operator: operatorStartsWith,
			operand: value
		};
	}
	function operatorEqualTo(first, second) {
		return first.toUpperCase() === second.toUpperCase();
	}
	function operatorStartsWith(first, second) {
		return second.toUpperCase().indexOf(first.toUpperCase()) === 0;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/styles/parser/tokeniser.js
var require_tokeniser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var RegexTokeniser = require_lop().RegexTokeniser;
	exports.tokenise = tokenise;
	var stringPrefix = "'((?:\\\\.|[^'])*)";
	function tokenise(string) {
		var identifierCharacter = "(?:[a-zA-Z\\-_]|\\\\.)";
		return new RegexTokeniser([
			{
				name: "identifier",
				regex: new RegExp("(" + identifierCharacter + "(?:" + identifierCharacter + "|[0-9])*)")
			},
			{
				name: "dot",
				regex: /\./
			},
			{
				name: "colon",
				regex: /:/
			},
			{
				name: "gt",
				regex: />/
			},
			{
				name: "whitespace",
				regex: /\s+/
			},
			{
				name: "arrow",
				regex: /=>/
			},
			{
				name: "equals",
				regex: /=/
			},
			{
				name: "startsWith",
				regex: /\^=/
			},
			{
				name: "open-paren",
				regex: /\(/
			},
			{
				name: "close-paren",
				regex: /\)/
			},
			{
				name: "open-square-bracket",
				regex: /\[/
			},
			{
				name: "close-square-bracket",
				regex: /\]/
			},
			{
				name: "string",
				regex: new RegExp(stringPrefix + "'")
			},
			{
				name: "unterminated-string",
				regex: new RegExp(stringPrefix)
			},
			{
				name: "integer",
				regex: /([0-9]+)/
			},
			{
				name: "choice",
				regex: /\|/
			},
			{
				name: "bang",
				regex: /(!)/
			}
		]).tokenise(string);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/style-reader.js
var require_style_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var lop = require_lop();
	var documentMatchers = require_document_matchers();
	var htmlPaths = require_html_paths();
	var tokenise = require_tokeniser().tokenise;
	var results = require_results();
	exports.readHtmlPath = readHtmlPath;
	exports.readDocumentMatcher = readDocumentMatcher;
	exports.readStyle = readStyle;
	function readStyle(string) {
		return parseString(styleRule, string);
	}
	function createStyleRule() {
		return lop.rules.sequence(lop.rules.sequence.capture(documentMatcherRule()), lop.rules.tokenOfType("whitespace"), lop.rules.tokenOfType("arrow"), lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("whitespace"), lop.rules.sequence.capture(htmlPathRule())).head())), lop.rules.tokenOfType("end")).map(function(documentMatcher, htmlPath) {
			return {
				from: documentMatcher,
				to: htmlPath.valueOrElse(htmlPaths.empty)
			};
		});
	}
	function readDocumentMatcher(string) {
		return parseString(documentMatcherRule(), string);
	}
	function documentMatcherRule() {
		var sequence = lop.rules.sequence;
		var identifierToConstant = function(identifier, constant) {
			return lop.rules.then(lop.rules.token("identifier", identifier), function() {
				return constant;
			});
		};
		var paragraphRule = identifierToConstant("p", documentMatchers.paragraph);
		var runRule = identifierToConstant("r", documentMatchers.run);
		var elementTypeRule = lop.rules.firstOf("p or r or table", paragraphRule, runRule);
		var styleIdRule = lop.rules.sequence(lop.rules.tokenOfType("dot"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule)).map(function(styleId) {
			return { styleId };
		});
		var styleNameMatcherRule = lop.rules.firstOf("style name matcher", lop.rules.then(lop.rules.sequence(lop.rules.tokenOfType("equals"), lop.rules.sequence.cut(), lop.rules.sequence.capture(stringRule)).head(), function(styleName) {
			return { styleName: documentMatchers.equalTo(styleName) };
		}), lop.rules.then(lop.rules.sequence(lop.rules.tokenOfType("startsWith"), lop.rules.sequence.cut(), lop.rules.sequence.capture(stringRule)).head(), function(styleName) {
			return { styleName: documentMatchers.startsWith(styleName) };
		}));
		var styleNameRule = lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.token("identifier", "style-name"), lop.rules.sequence.capture(styleNameMatcherRule), lop.rules.tokenOfType("close-square-bracket")).head();
		var listTypeRule = lop.rules.firstOf("list type", identifierToConstant("ordered-list", { isOrdered: true }), identifierToConstant("unordered-list", { isOrdered: false }));
		var listRule = sequence(lop.rules.tokenOfType("colon"), sequence.capture(listTypeRule), sequence.cut(), lop.rules.tokenOfType("open-paren"), sequence.capture(integerRule), lop.rules.tokenOfType("close-paren")).map(function(listType, levelNumber) {
			return { list: {
				isOrdered: listType.isOrdered,
				levelIndex: levelNumber - 1
			} };
		});
		function createMatcherSuffixesRule(rules) {
			var matcherSuffix = lop.rules.firstOf.apply(lop.rules.firstOf, ["matcher suffix"].concat(rules));
			var matcherSuffixes = lop.rules.zeroOrMore(matcherSuffix);
			return lop.rules.then(matcherSuffixes, function(suffixes) {
				var matcherOptions = {};
				suffixes.forEach(function(suffix) {
					_.extend(matcherOptions, suffix);
				});
				return matcherOptions;
			});
		}
		var paragraphOrRun = sequence(sequence.capture(elementTypeRule), sequence.capture(createMatcherSuffixesRule([
			styleIdRule,
			styleNameRule,
			listRule
		]))).map(function(createMatcher, matcherOptions) {
			return createMatcher(matcherOptions);
		});
		var table = sequence(lop.rules.token("identifier", "table"), sequence.capture(createMatcherSuffixesRule([styleIdRule, styleNameRule]))).map(function(options) {
			return documentMatchers.table(options);
		});
		var bold = identifierToConstant("b", documentMatchers.bold);
		var italic = identifierToConstant("i", documentMatchers.italic);
		var underline = identifierToConstant("u", documentMatchers.underline);
		var strikethrough = identifierToConstant("strike", documentMatchers.strikethrough);
		var allCaps = identifierToConstant("all-caps", documentMatchers.allCaps);
		var smallCaps = identifierToConstant("small-caps", documentMatchers.smallCaps);
		var highlight = sequence(lop.rules.token("identifier", "highlight"), lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.token("identifier", "color"), lop.rules.tokenOfType("equals"), lop.rules.sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).head()))).map(function(color) {
			return documentMatchers.highlight({ color: color.valueOrElse(void 0) });
		});
		var commentReference = identifierToConstant("comment-reference", documentMatchers.commentReference);
		var breakMatcher = sequence(lop.rules.token("identifier", "br"), sequence.cut(), lop.rules.tokenOfType("open-square-bracket"), lop.rules.token("identifier", "type"), lop.rules.tokenOfType("equals"), sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).map(function(breakType) {
			switch (breakType) {
				case "line": return documentMatchers.lineBreak;
				case "page": return documentMatchers.pageBreak;
				case "column": return documentMatchers.columnBreak;
			}
		});
		return lop.rules.firstOf("element type", paragraphOrRun, table, bold, italic, underline, strikethrough, allCaps, smallCaps, highlight, commentReference, breakMatcher);
	}
	function readHtmlPath(string) {
		return parseString(htmlPathRule(), string);
	}
	function htmlPathRule() {
		var capture = lop.rules.sequence.capture;
		var whitespaceRule = lop.rules.tokenOfType("whitespace");
		var freshRule = lop.rules.then(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("colon"), lop.rules.token("identifier", "fresh"))), function(option) {
			return option.map(function() {
				return true;
			}).valueOrElse(false);
		});
		var separatorRule = lop.rules.then(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("colon"), lop.rules.token("identifier", "separator"), lop.rules.tokenOfType("open-paren"), capture(stringRule), lop.rules.tokenOfType("close-paren")).head()), function(option) {
			return option.valueOrElse("");
		});
		var tagNamesRule = lop.rules.oneOrMoreWithSeparator(identifierRule, lop.rules.tokenOfType("choice"));
		var styleElementRule = lop.rules.sequence(capture(tagNamesRule), capture(lop.rules.zeroOrMore(attributeOrClassRule)), capture(freshRule), capture(separatorRule)).map(function(tagName, attributesList, fresh, separator) {
			var attributes = Object.create(null);
			var options = {};
			attributesList.forEach(function(attribute) {
				if (attribute.append && attributes[attribute.name]) attributes[attribute.name] += " " + attribute.value;
				else attributes[attribute.name] = attribute.value;
			});
			if (fresh) options.fresh = true;
			if (separator) options.separator = separator;
			return htmlPaths.element(tagName, attributes, options);
		});
		return lop.rules.firstOf("html path", lop.rules.then(lop.rules.tokenOfType("bang"), function() {
			return htmlPaths.ignore;
		}), lop.rules.then(lop.rules.zeroOrMoreWithSeparator(styleElementRule, lop.rules.sequence(whitespaceRule, lop.rules.tokenOfType("gt"), whitespaceRule)), htmlPaths.elements));
	}
	var identifierRule = lop.rules.then(lop.rules.tokenOfType("identifier"), decodeEscapeSequences);
	var integerRule = lop.rules.tokenOfType("integer");
	var stringRule = lop.rules.then(lop.rules.tokenOfType("string"), decodeEscapeSequences);
	var escapeSequences = {
		"n": "\n",
		"r": "\r",
		"t": "	"
	};
	function decodeEscapeSequences(value) {
		return value.replace(/\\(.)/g, function(match, code) {
			return escapeSequences[code] || code;
		});
	}
	var attributeRule = lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule), lop.rules.tokenOfType("equals"), lop.rules.sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).map(function(name, value) {
		return {
			name,
			value,
			append: false
		};
	});
	var classRule = lop.rules.sequence(lop.rules.tokenOfType("dot"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule)).map(function(className) {
		return {
			name: "class",
			value: className,
			append: true
		};
	});
	var attributeOrClassRule = lop.rules.firstOf("attribute or class", attributeRule, classRule);
	function parseString(rule, string) {
		var tokens = tokenise(string);
		var parseResult = lop.Parser().parseTokens(rule, tokens);
		if (parseResult.isSuccess()) return results.success(parseResult.value());
		else return new results.Result(null, [results.warning(describeFailure(string, parseResult))]);
	}
	function describeFailure(input, parseResult) {
		return "Did not understand this style mapping, so ignored it: " + input + "\n" + parseResult.errors().map(describeError).join("\n");
	}
	function describeError(error) {
		return "Error was at character number " + error.characterNumber() + ": Expected " + error.expected + " but got " + error.actual;
	}
	var styleRule = createStyleRule();
}));
//#endregion
//#region node_modules/mammoth/lib/options-reader.js
var require_options_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.readOptions = readOptions;
	var _ = require_underscore_umd();
	var defaultStyleMap = exports._defaultStyleMap = [
		"p.Heading1 => h1:fresh",
		"p.Heading2 => h2:fresh",
		"p.Heading3 => h3:fresh",
		"p.Heading4 => h4:fresh",
		"p.Heading5 => h5:fresh",
		"p.Heading6 => h6:fresh",
		"p[style-name='Heading 1'] => h1:fresh",
		"p[style-name='Heading 2'] => h2:fresh",
		"p[style-name='Heading 3'] => h3:fresh",
		"p[style-name='Heading 4'] => h4:fresh",
		"p[style-name='Heading 5'] => h5:fresh",
		"p[style-name='Heading 6'] => h6:fresh",
		"p[style-name='heading 1'] => h1:fresh",
		"p[style-name='heading 2'] => h2:fresh",
		"p[style-name='heading 3'] => h3:fresh",
		"p[style-name='heading 4'] => h4:fresh",
		"p[style-name='heading 5'] => h5:fresh",
		"p[style-name='heading 6'] => h6:fresh",
		"p.Heading => h1:fresh",
		"p[style-name='Heading'] => h1:fresh",
		"r[style-name='Strong'] => strong",
		"p[style-name='footnote text'] => p:fresh",
		"r[style-name='footnote reference'] =>",
		"p[style-name='endnote text'] => p:fresh",
		"r[style-name='endnote reference'] =>",
		"p[style-name='annotation text'] => p:fresh",
		"r[style-name='annotation reference'] =>",
		"p[style-name='Footnote'] => p:fresh",
		"r[style-name='Footnote anchor'] =>",
		"p[style-name='Endnote'] => p:fresh",
		"r[style-name='Endnote anchor'] =>",
		"p:unordered-list(1) => ul > li:fresh",
		"p:unordered-list(2) => ul|ol > li > ul > li:fresh",
		"p:unordered-list(3) => ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:unordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:unordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:ordered-list(1) => ol > li:fresh",
		"p:ordered-list(2) => ul|ol > li > ol > li:fresh",
		"p:ordered-list(3) => ul|ol > li > ul|ol > li > ol > li:fresh",
		"p:ordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
		"p:ordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
		"r[style-name='Hyperlink'] =>",
		"p[style-name='Normal'] => p:fresh",
		"p.Body => p:fresh",
		"p[style-name='Body'] => p:fresh"
	];
	var standardOptions = exports._standardOptions = {
		externalFileAccess: false,
		transformDocument: identity,
		includeDefaultStyleMap: true,
		includeEmbeddedStyleMap: true
	};
	function readOptions(options) {
		options = options || {};
		return _.extend({}, standardOptions, options, {
			customStyleMap: readStyleMap(options.styleMap),
			readStyleMap: function() {
				var styleMap = this.customStyleMap;
				if (this.includeEmbeddedStyleMap) styleMap = styleMap.concat(readStyleMap(this.embeddedStyleMap));
				if (this.includeDefaultStyleMap) styleMap = styleMap.concat(defaultStyleMap);
				return styleMap;
			}
		});
	}
	function readStyleMap(styleMap) {
		if (!styleMap) return [];
		else if (_.isString(styleMap)) return styleMap.split("\n").map(function(line) {
			return line.trim();
		}).filter(function(line) {
			return line !== "" && line.charAt(0) !== "#";
		});
		else return styleMap;
	}
	function identity(value) {
		return value;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/unzip.js
var require_unzip = /* @__PURE__ */ __commonJSMin(((exports) => {
	var fs = __require("node:fs");
	var promises = require_promises();
	var zipfile = require_zipfile();
	exports.openZip = openZip;
	var readFile = promises.promisify(fs.readFile);
	function openZip(options) {
		if (options.path) return readFile(options.path).then(zipfile.openArrayBuffer);
		else if (options.buffer) return promises.resolve(zipfile.openArrayBuffer(options.buffer));
		else if (options.file) return promises.resolve(options.file);
		else return promises.reject(/* @__PURE__ */ new Error("Could not find file in options"));
	}
}));
//#endregion
//#region node_modules/mammoth/lib/underline.js
var require_underline = /* @__PURE__ */ __commonJSMin(((exports) => {
	var htmlPaths = require_html_paths();
	var Html = require_html();
	exports.element = element;
	function element(name) {
		return function(html) {
			return Html.elementWithTag(htmlPaths.element(name), [html]);
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ = require_underscore_umd();
	var docxReader = require_docx_reader();
	var docxStyleMap = require_style_map();
	var DocumentConverter = require_document_to_html().DocumentConverter;
	var convertElementToRawText = require_raw_text().convertElementToRawText;
	var readStyle = require_style_reader().readStyle;
	var readOptions = require_options_reader().readOptions;
	var unzip = require_unzip();
	var Result = require_results().Result;
	exports.convertToHtml = convertToHtml;
	exports.convertToMarkdown = convertToMarkdown;
	exports.convert = convert;
	exports.extractRawText = extractRawText;
	exports.images = require_images();
	exports.transforms = require_transforms();
	exports.underline = require_underline();
	exports.embedStyleMap = embedStyleMap;
	exports.readEmbeddedStyleMap = readEmbeddedStyleMap;
	function convertToHtml(input, options) {
		return convert(input, options);
	}
	function convertToMarkdown(input, options) {
		var markdownOptions = Object.create(options || {});
		markdownOptions.outputFormat = "markdown";
		return convert(input, markdownOptions);
	}
	function convert(input, options) {
		options = readOptions(options);
		return unzip.openZip(input).tap(function(docxFile) {
			return docxStyleMap.readStyleMap(docxFile).then(function(styleMap) {
				options.embeddedStyleMap = styleMap;
			});
		}).then(function(docxFile) {
			return docxReader.read(docxFile, input, options).then(function(documentResult) {
				return documentResult.map(options.transformDocument);
			}).then(function(documentResult) {
				return convertDocumentToHtml(documentResult, options);
			});
		});
	}
	function readEmbeddedStyleMap(input) {
		return unzip.openZip(input).then(docxStyleMap.readStyleMap);
	}
	function convertDocumentToHtml(documentResult, options) {
		var styleMapResult = parseStyleMap(options.readStyleMap());
		var documentConverter = new DocumentConverter(_.extend({}, options, { styleMap: styleMapResult.value }));
		return documentResult.flatMapThen(function(document) {
			return styleMapResult.flatMapThen(function(styleMap) {
				return documentConverter.convertToHtml(document);
			});
		});
	}
	function parseStyleMap(styleMap) {
		return Result.combine((styleMap || []).map(readStyle)).map(function(styleMap) {
			return styleMap.filter(function(styleMapping) {
				return !!styleMapping;
			});
		});
	}
	function extractRawText(input) {
		return unzip.openZip(input).then(docxReader.read).then(function(documentResult) {
			return documentResult.map(convertElementToRawText);
		});
	}
	function embedStyleMap(input, styleMap) {
		return unzip.openZip(input).tap(function(docxFile) {
			return docxStyleMap.writeStyleMap(docxFile, styleMap);
		}).then(function(docxFile) {
			return docxFile.toArrayBuffer();
		}).then(function(arrayBuffer) {
			return {
				toArrayBuffer: function() {
					return arrayBuffer;
				},
				toBuffer: function() {
					return Buffer.from(arrayBuffer);
				}
			};
		});
	}
	exports.styleMapping = function() {
		throw new Error("Use a raw string instead of mammoth.styleMapping e.g. \"p[style-name='Title'] => h1\" instead of mammoth.styleMapping(\"p[style-name='Title'] => h1\")");
	};
}));
//#endregion
export { require_lib as t };
