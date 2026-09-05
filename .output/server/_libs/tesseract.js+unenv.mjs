import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../_runtime.mjs";
import { a as notImplemented, i as init_utils } from "./canvg+[...].mjs";
import { f as globalthis_default, p as init_globalthis } from "./@tanstack/router-core+[...].mjs";
import { t as require_runtime } from "./regenerator-runtime.mjs";
import { n as lib_exports, t as init_lib } from "./node-fetch.mjs";
import { t as require_is_url } from "./is-url.mjs";
import processModule from "node:process";
import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
//#region node_modules/tesseract.js/src/utils/getId.js
var require_getId = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (prefix, cnt) => `${prefix}-${cnt}-${Math.random().toString(16).slice(3, 8)}`;
}));
//#endregion
//#region node_modules/tesseract.js/src/createJob.js
var require_createJob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getId = require_getId();
	var jobCounter = 0;
	module.exports = ({ id: _id, action, payload = {} }) => {
		let id = _id;
		if (typeof id === "undefined") {
			id = getId("Job", jobCounter);
			jobCounter += 1;
		}
		return {
			id,
			action,
			payload
		};
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/utils/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	var logging = false;
	exports.logging = logging;
	exports.setLogging = (_logging) => {
		logging = _logging;
	};
	exports.log = (...args) => logging ? console.log.apply(exports, args) : null;
}));
//#endregion
//#region node_modules/tesseract.js/src/createScheduler.js
var require_createScheduler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createJob = require_createJob();
	var { log } = require_log();
	var getId = require_getId();
	var schedulerCounter = 0;
	module.exports = () => {
		const id = getId("Scheduler", schedulerCounter);
		const workers = {};
		const runningWorkers = {};
		let jobQueue = [];
		schedulerCounter += 1;
		const getQueueLen = () => jobQueue.length;
		const getNumWorkers = () => Object.keys(workers).length;
		const dequeue = () => {
			if (jobQueue.length !== 0) {
				const wIds = Object.keys(workers);
				for (let i = 0; i < wIds.length; i += 1) if (typeof runningWorkers[wIds[i]] === "undefined") {
					jobQueue[0](workers[wIds[i]]);
					break;
				}
			}
		};
		const queue = (action, payload) => new Promise((resolve, reject) => {
			const job = createJob({
				action,
				payload
			});
			jobQueue.push(async (w) => {
				jobQueue.shift();
				runningWorkers[w.id] = job;
				try {
					resolve(await w[action].apply(exports, [...payload, job.id]));
				} catch (err) {
					reject(err);
				} finally {
					delete runningWorkers[w.id];
					dequeue();
				}
			});
			log(`[${id}]: Add ${job.id} to JobQueue`);
			log(`[${id}]: JobQueue length=${jobQueue.length}`);
			dequeue();
		});
		const addWorker = (w) => {
			workers[w.id] = w;
			log(`[${id}]: Add ${w.id}`);
			log(`[${id}]: Number of workers=${getNumWorkers()}`);
			dequeue();
			return w.id;
		};
		const addJob = async (action, ...payload) => {
			if (getNumWorkers() === 0) throw Error(`[${id}]: You need to have at least one worker before adding jobs`);
			return queue(action, payload);
		};
		const terminate = async () => {
			Object.keys(workers).forEach(async (wid) => {
				await workers[wid].terminate();
			});
			jobQueue = [];
		};
		return {
			addWorker,
			addJob,
			terminate,
			getQueueLen,
			getNumWorkers
		};
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/utils/getEnvironment.js
var require_getEnvironment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key) => {
		const env = {};
		if (typeof WorkerGlobalScope !== "undefined") env.type = "webworker";
		else if (typeof document === "object") env.type = "browser";
		else if (typeof processModule === "object" && typeof __require === "function") env.type = "node";
		if (typeof key === "undefined") return env;
		return env[key];
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/utils/resolvePaths.js
var require_resolvePaths = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var resolveURL = require_getEnvironment()("type") === "browser" ? (s) => new URL(s, window.location.href).href : (s) => s;
	module.exports = (options) => {
		const opts = { ...options };
		[
			"corePath",
			"workerPath",
			"langPath"
		].forEach((key) => {
			if (options[key]) opts[key] = resolveURL(opts[key]);
		});
		return opts;
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/constants/OEM.js
var require_OEM = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TESSERACT_ONLY: 0,
		LSTM_ONLY: 1,
		TESSERACT_LSTM_COMBINED: 2,
		DEFAULT: 3
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/constants/defaultOptions.js
var require_defaultOptions$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		workerBlobURL: true,
		logger: () => {}
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/defaultOptions.js
var require_defaultOptions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path = __require("node:path");
	module.exports = {
		...require_defaultOptions$1(),
		workerPath: path.join(__dirname, "..", "..", "worker-script", "node", "index.js")
	};
}));
//#endregion
//#region node_modules/unenv/dist/runtime/node/internal/worker_threads/broadcast-channel.mjs
var BroadcastChannel;
var init_broadcast_channel = __esmMin((() => {
	BroadcastChannel = class {
		name = "";
		onmessage = (message) => {};
		onmessageerror = (message) => {};
		close() {}
		postMessage(message) {}
		ref() {
			return this;
		}
		unref() {
			return this;
		}
	};
}));
//#endregion
//#region node_modules/unenv/dist/runtime/node/internal/worker_threads/message-port.mjs
var MessagePort;
var init_message_port = __esmMin((() => {
	MessagePort = class extends EventEmitter {
		close() {}
		postMessage(value, transferList) {}
		ref() {}
		unref() {}
		start() {}
		addEventListener(type, listener) {
			this.on(type, listener);
		}
		removeEventListener(type, listener) {
			this.off(type, listener);
		}
		dispatchEvent(event) {
			return this.emit(event.type, event);
		}
	};
}));
//#endregion
//#region node_modules/unenv/dist/runtime/node/internal/worker_threads/message-channel.mjs
var MessageChannel;
var init_message_channel = __esmMin((() => {
	init_message_port();
	MessageChannel = class {
		port1 = new MessagePort();
		port2 = new MessagePort();
	};
}));
//#endregion
//#region node_modules/unenv/dist/runtime/node/internal/worker_threads/worker.mjs
var Worker;
var init_worker = __esmMin((() => {
	Worker = class extends EventEmitter {
		stdin = null;
		stdout = new Readable();
		stderr = new Readable();
		threadId = 0;
		performance = { eventLoopUtilization: () => ({
			idle: 0,
			active: 0,
			utilization: 0
		}) };
		postMessage(_value, _transferList) {}
		postMessageToThread(_threadId, _value, _transferList, _timeout) {
			return Promise.resolve();
		}
		ref() {}
		unref() {}
		terminate() {
			return Promise.resolve(0);
		}
		getHeapSnapshot() {
			return Promise.resolve(new Readable());
		}
	};
}));
//#endregion
//#region node_modules/unenv/dist/runtime/node/worker_threads.mjs
var worker_threads_exports = /* @__PURE__ */ __exportAll({
	BroadcastChannel: () => BroadcastChannel,
	MessageChannel: () => MessageChannel,
	MessagePort: () => MessagePort,
	SHARE_ENV: () => SHARE_ENV,
	Worker: () => Worker,
	default: () => worker_threads_default,
	getEnvironmentData: () => getEnvironmentData,
	isInternalThread: () => false,
	isMainThread: () => true,
	isMarkedAsUntransferable: () => isMarkedAsUntransferable,
	markAsUncloneable: () => markAsUncloneable,
	markAsUntransferable: () => markAsUntransferable,
	moveMessagePortToContext: () => moveMessagePortToContext,
	parentPort: () => null,
	postMessageToThread: () => postMessageToThread,
	receiveMessageOnPort: () => receiveMessageOnPort,
	resourceLimits: () => resourceLimits,
	setEnvironmentData: () => setEnvironmentData,
	threadId: () => 0,
	workerData: () => null
}), _environmentData, getEnvironmentData, setEnvironmentData, isMarkedAsUntransferable, markAsUntransferable, markAsUncloneable, moveMessagePortToContext, receiveMessageOnPort, SHARE_ENV, resourceLimits, postMessageToThread, worker_threads_default;
var init_worker_threads = __esmMin((() => {
	init_broadcast_channel();
	init_message_channel();
	init_message_port();
	init_worker();
	init_utils();
	_environmentData = /* @__PURE__ */ new Map();
	getEnvironmentData = function getEnvironmentData(key) {
		return _environmentData.get(key);
	};
	setEnvironmentData = function setEnvironmentData(key, value) {
		_environmentData.set(key, value);
	};
	isMarkedAsUntransferable = () => false;
	markAsUntransferable = function markAsUntransferable(value) {};
	markAsUncloneable = () => {};
	moveMessagePortToContext = () => new MessagePort();
	receiveMessageOnPort = () => void 0;
	SHARE_ENV = /* @__PURE__ */ Symbol.for("nodejs.worker_threads.SHARE_ENV");
	resourceLimits = {};
	postMessageToThread = /* @__PURE__ */ notImplemented("worker_threads.postMessageToThread");
	worker_threads_default = {
		BroadcastChannel,
		MessageChannel,
		MessagePort,
		Worker,
		SHARE_ENV,
		getEnvironmentData,
		isMainThread: true,
		isMarkedAsUntransferable,
		markAsUntransferable,
		markAsUncloneable,
		moveMessagePortToContext,
		parentPort: null,
		receiveMessageOnPort,
		resourceLimits,
		setEnvironmentData,
		postMessageToThread,
		threadId: 0,
		workerData: null,
		isInternalThread: false
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/spawnWorker.js
var require_spawnWorker = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Worker } = (init_worker_threads(), __toCommonJS(worker_threads_exports));
	/**
	* spawnWorker
	*
	* @name spawnWorker
	* @function fork a new process in node
	* @access public
	*/
	module.exports = ({ workerPath }) => new Worker(workerPath);
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/terminateWorker.js
var require_terminateWorker = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* terminateWorker
	*
	* @name terminateWorker
	* @function kill worker
	* @access public
	*/
	module.exports = (worker) => {
		worker.terminate();
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/onMessage.js
var require_onMessage = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (worker, handler) => {
		worker.on("message", handler);
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/send.js
var require_send = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* send
	*
	* @name send
	* @function send packet to worker and create a job
	* @access public
	*/
	module.exports = async (worker, packet) => {
		worker.postMessage(packet);
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/loadImage.js
var require_loadImage = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	init_globalthis();
	var util = __require("node:util");
	var fs = __require("node:fs");
	var fetch = globalthis_default.fetch || (init_lib(), __toCommonJS(lib_exports));
	var isURL = require_is_url();
	var readFile = util.promisify(fs.readFile);
	/**
	* loadImage
	*
	* @name loadImage
	* @function load image from different source
	* @access public
	*/
	module.exports = async (image) => {
		let data = image;
		if (typeof image === "undefined") return image;
		if (typeof image === "string") if (isURL(image) || image.startsWith("moz-extension://") || image.startsWith("chrome-extension://") || image.startsWith("file://")) data = await (await fetch(image)).arrayBuffer();
		else if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) data = Buffer.from(image.split(",")[1], "base64");
		else data = await readFile(image);
		else if (Buffer.isBuffer(image)) data = image;
		return new Uint8Array(data);
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/worker/node/index.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		defaultOptions: require_defaultOptions(),
		spawnWorker: require_spawnWorker(),
		terminateWorker: require_terminateWorker(),
		onMessage: require_onMessage(),
		send: require_send(),
		loadImage: require_loadImage()
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/createWorker.js
var require_createWorker = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var resolvePaths = require_resolvePaths();
	var createJob = require_createJob();
	var { log } = require_log();
	var getId = require_getId();
	var OEM = require_OEM();
	var { defaultOptions, spawnWorker, terminateWorker, onMessage, loadImage, send } = require_node();
	var workerCounter = 0;
	module.exports = async (langs = "eng", oem = OEM.LSTM_ONLY, _options = {}, config = {}) => {
		const id = getId("Worker", workerCounter);
		const { logger, errorHandler, ...options } = resolvePaths({
			...defaultOptions,
			..._options
		});
		const promises = {};
		const currentLangs = typeof langs === "string" ? langs.split("+") : langs;
		let currentOem = oem;
		let currentConfig = config;
		const lstmOnlyCore = [OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem) && !options.legacyCore;
		let workerResReject;
		let workerResResolve;
		const workerRes = new Promise((resolve, reject) => {
			workerResResolve = resolve;
			workerResReject = reject;
		});
		const workerError = (event) => {
			workerResReject(event.message);
		};
		let worker = spawnWorker(options);
		worker.onerror = workerError;
		workerCounter += 1;
		const startJob = ({ id: jobId, action, payload }) => new Promise((resolve, reject) => {
			log(`[${id}]: Start ${jobId}, action=${action}`);
			const promiseId = `${action}-${jobId}`;
			promises[promiseId] = {
				resolve,
				reject
			};
			send(worker, {
				workerId: id,
				jobId,
				action,
				payload
			});
		});
		const load = () => console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)");
		const loadInternal = (jobId) => startJob(createJob({
			id: jobId,
			action: "load",
			payload: { options: {
				lstmOnly: lstmOnlyCore,
				corePath: options.corePath,
				logging: options.logging
			} }
		}));
		const writeText = (path, text, jobId) => startJob(createJob({
			id: jobId,
			action: "FS",
			payload: {
				method: "writeFile",
				args: [path, text]
			}
		}));
		const readText = (path, jobId) => startJob(createJob({
			id: jobId,
			action: "FS",
			payload: {
				method: "readFile",
				args: [path, { encoding: "utf8" }]
			}
		}));
		const removeFile = (path, jobId) => startJob(createJob({
			id: jobId,
			action: "FS",
			payload: {
				method: "unlink",
				args: [path]
			}
		}));
		const FS = (method, args, jobId) => startJob(createJob({
			id: jobId,
			action: "FS",
			payload: {
				method,
				args
			}
		}));
		const loadLanguageInternal = (_langs, jobId) => startJob(createJob({
			id: jobId,
			action: "loadLanguage",
			payload: {
				langs: _langs,
				options: {
					langPath: options.langPath,
					dataPath: options.dataPath,
					cachePath: options.cachePath,
					cacheMethod: options.cacheMethod,
					gzip: options.gzip,
					lstmOnly: [OEM.DEFAULT, OEM.LSTM_ONLY].includes(currentOem) && !options.legacyLang
				}
			}
		}));
		const initializeInternal = (_langs, _oem, _config, jobId) => startJob(createJob({
			id: jobId,
			action: "initialize",
			payload: {
				langs: _langs,
				oem: _oem,
				config: _config
			}
		}));
		const reinitialize = (langs = "eng", oem, config, jobId) => {
			if (lstmOnlyCore && [OEM.TESSERACT_ONLY, OEM.TESSERACT_LSTM_COMBINED].includes(oem)) throw Error("Legacy model requested but code missing.");
			const _oem = oem || currentOem;
			currentOem = _oem;
			const _config = config || currentConfig;
			currentConfig = _config;
			const _langs = (typeof langs === "string" ? langs.split("+") : langs).filter((x) => !currentLangs.includes(x));
			currentLangs.push(..._langs);
			if (_langs.length > 0) return loadLanguageInternal(_langs, jobId).then(() => initializeInternal(langs, _oem, _config, jobId));
			return initializeInternal(langs, _oem, _config, jobId);
		};
		const setParameters = (params = {}, jobId) => startJob(createJob({
			id: jobId,
			action: "setParameters",
			payload: { params }
		}));
		const recognize = async (image, opts = {}, output = { text: true }, jobId) => startJob(createJob({
			id: jobId,
			action: "recognize",
			payload: {
				image: await loadImage(image),
				options: opts,
				output
			}
		}));
		const detect = async (image, jobId) => {
			if (lstmOnlyCore) throw Error("`worker.detect` requires Legacy model, which was not loaded.");
			return startJob(createJob({
				id: jobId,
				action: "detect",
				payload: { image: await loadImage(image) }
			}));
		};
		const terminate = async () => {
			if (worker !== null) {
				terminateWorker(worker);
				worker = null;
			}
			return Promise.resolve();
		};
		onMessage(worker, ({ workerId, jobId, status, action, data }) => {
			const promiseId = `${action}-${jobId}`;
			if (status === "resolve") {
				log(`[${workerId}]: Complete ${jobId}`);
				promises[promiseId].resolve({
					jobId,
					data
				});
				delete promises[promiseId];
			} else if (status === "reject") {
				promises[promiseId].reject(data);
				delete promises[promiseId];
				if (action === "load") workerResReject(data);
				if (errorHandler) errorHandler(data);
				else throw Error(data);
			} else if (status === "progress") logger({
				...data,
				userJobId: jobId
			});
		});
		const resolveObj = {
			id,
			worker,
			load,
			writeText,
			readText,
			removeFile,
			FS,
			reinitialize,
			setParameters,
			recognize,
			detect,
			terminate
		};
		loadInternal().then(() => loadLanguageInternal(langs)).then(() => initializeInternal(langs, oem, config)).then(() => workerResResolve(resolveObj)).catch(() => {});
		return workerRes;
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/Tesseract.js
var require_Tesseract = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createWorker = require_createWorker();
	var recognize = async (image, langs, options) => {
		const worker = await createWorker(langs, 1, options);
		return worker.recognize(image).finally(async () => {
			await worker.terminate();
		});
	};
	var detect = async (image, options) => {
		const worker = await createWorker("osd", 0, options);
		return worker.detect(image).finally(async () => {
			await worker.terminate();
		});
	};
	module.exports = {
		recognize,
		detect
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/constants/languages.js
var require_languages = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @typedef {object} Languages
	* @property {string} AFR Afrikaans
	* @property {string} AMH Amharic
	* @property {string} ARA Arabic
	* @property {string} ASM Assamese
	* @property {string} AZE Azerbaijani
	* @property {string} AZE_CYRL Azerbaijani - Cyrillic
	* @property {string} BEL Belarusian
	* @property {string} BEN Bengali
	* @property {string} BOD Tibetan
	* @property {string} BOS Bosnian
	* @property {string} BUL Bulgarian
	* @property {string} CAT Catalan; Valencian
	* @property {string} CEB Cebuano
	* @property {string} CES Czech
	* @property {string} CHI_SIM Chinese - Simplified
	* @property {string} CHI_TRA Chinese - Traditional
	* @property {string} CHR Cherokee
	* @property {string} CYM Welsh
	* @property {string} DAN Danish
	* @property {string} DEU German
	* @property {string} DZO Dzongkha
	* @property {string} ELL Greek, Modern (1453-)
	* @property {string} ENG English
	* @property {string} ENM English, Middle (1100-1500)
	* @property {string} EPO Esperanto
	* @property {string} EST Estonian
	* @property {string} EUS Basque
	* @property {string} FAS Persian
	* @property {string} FIN Finnish
	* @property {string} FRA French
	* @property {string} FRK German Fraktur
	* @property {string} FRM French, Middle (ca. 1400-1600)
	* @property {string} GLE Irish
	* @property {string} GLG Galician
	* @property {string} GRC Greek, Ancient (-1453)
	* @property {string} GUJ Gujarati
	* @property {string} HAT Haitian; Haitian Creole
	* @property {string} HEB Hebrew
	* @property {string} HIN Hindi
	* @property {string} HRV Croatian
	* @property {string} HUN Hungarian
	* @property {string} IKU Inuktitut
	* @property {string} IND Indonesian
	* @property {string} ISL Icelandic
	* @property {string} ITA Italian
	* @property {string} ITA_OLD Italian - Old
	* @property {string} JAV Javanese
	* @property {string} JPN Japanese
	* @property {string} KAN Kannada
	* @property {string} KAT Georgian
	* @property {string} KAT_OLD Georgian - Old
	* @property {string} KAZ Kazakh
	* @property {string} KHM Central Khmer
	* @property {string} KIR Kirghiz; Kyrgyz
	* @property {string} KOR Korean
	* @property {string} KUR Kurdish
	* @property {string} LAO Lao
	* @property {string} LAT Latin
	* @property {string} LAV Latvian
	* @property {string} LIT Lithuanian
	* @property {string} MAL Malayalam
	* @property {string} MAR Marathi
	* @property {string} MKD Macedonian
	* @property {string} MLT Maltese
	* @property {string} MSA Malay
	* @property {string} MYA Burmese
	* @property {string} NEP Nepali
	* @property {string} NLD Dutch; Flemish
	* @property {string} NOR Norwegian
	* @property {string} ORI Oriya
	* @property {string} PAN Panjabi; Punjabi
	* @property {string} POL Polish
	* @property {string} POR Portuguese
	* @property {string} PUS Pushto; Pashto
	* @property {string} RON Romanian; Moldavian; Moldovan
	* @property {string} RUS Russian
	* @property {string} SAN Sanskrit
	* @property {string} SIN Sinhala; Sinhalese
	* @property {string} SLK Slovak
	* @property {string} SLV Slovenian
	* @property {string} SPA Spanish; Castilian
	* @property {string} SPA_OLD Spanish; Castilian - Old
	* @property {string} SQI Albanian
	* @property {string} SRP Serbian
	* @property {string} SRP_LATN Serbian - Latin
	* @property {string} SWA Swahili
	* @property {string} SWE Swedish
	* @property {string} SYR Syriac
	* @property {string} TAM Tamil
	* @property {string} TEL Telugu
	* @property {string} TGK Tajik
	* @property {string} TGL Tagalog
	* @property {string} THA Thai
	* @property {string} TIR Tigrinya
	* @property {string} TUR Turkish
	* @property {string} UIG Uighur; Uyghur
	* @property {string} UKR Ukrainian
	* @property {string} URD Urdu
	* @property {string} UZB Uzbek
	* @property {string} UZB_CYRL Uzbek - Cyrillic
	* @property {string} VIE Vietnamese
	* @property {string} YID Yiddish
	*/
	/**
	* @type {Languages}
	*/
	module.exports = {
		AFR: "afr",
		AMH: "amh",
		ARA: "ara",
		ASM: "asm",
		AZE: "aze",
		AZE_CYRL: "aze_cyrl",
		BEL: "bel",
		BEN: "ben",
		BOD: "bod",
		BOS: "bos",
		BUL: "bul",
		CAT: "cat",
		CEB: "ceb",
		CES: "ces",
		CHI_SIM: "chi_sim",
		CHI_TRA: "chi_tra",
		CHR: "chr",
		CYM: "cym",
		DAN: "dan",
		DEU: "deu",
		DZO: "dzo",
		ELL: "ell",
		ENG: "eng",
		ENM: "enm",
		EPO: "epo",
		EST: "est",
		EUS: "eus",
		FAS: "fas",
		FIN: "fin",
		FRA: "fra",
		FRK: "frk",
		FRM: "frm",
		GLE: "gle",
		GLG: "glg",
		GRC: "grc",
		GUJ: "guj",
		HAT: "hat",
		HEB: "heb",
		HIN: "hin",
		HRV: "hrv",
		HUN: "hun",
		IKU: "iku",
		IND: "ind",
		ISL: "isl",
		ITA: "ita",
		ITA_OLD: "ita_old",
		JAV: "jav",
		JPN: "jpn",
		KAN: "kan",
		KAT: "kat",
		KAT_OLD: "kat_old",
		KAZ: "kaz",
		KHM: "khm",
		KIR: "kir",
		KOR: "kor",
		KUR: "kur",
		LAO: "lao",
		LAT: "lat",
		LAV: "lav",
		LIT: "lit",
		MAL: "mal",
		MAR: "mar",
		MKD: "mkd",
		MLT: "mlt",
		MSA: "msa",
		MYA: "mya",
		NEP: "nep",
		NLD: "nld",
		NOR: "nor",
		ORI: "ori",
		PAN: "pan",
		POL: "pol",
		POR: "por",
		PUS: "pus",
		RON: "ron",
		RUS: "rus",
		SAN: "san",
		SIN: "sin",
		SLK: "slk",
		SLV: "slv",
		SPA: "spa",
		SPA_OLD: "spa_old",
		SQI: "sqi",
		SRP: "srp",
		SRP_LATN: "srp_latn",
		SWA: "swa",
		SWE: "swe",
		SYR: "syr",
		TAM: "tam",
		TEL: "tel",
		TGK: "tgk",
		TGL: "tgl",
		THA: "tha",
		TIR: "tir",
		TUR: "tur",
		UIG: "uig",
		UKR: "ukr",
		URD: "urd",
		UZB: "uzb",
		UZB_CYRL: "uzb_cyrl",
		VIE: "vie",
		YID: "yid"
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/constants/PSM.js
var require_PSM = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		OSD_ONLY: "0",
		AUTO_OSD: "1",
		AUTO_ONLY: "2",
		AUTO: "3",
		SINGLE_COLUMN: "4",
		SINGLE_BLOCK_VERT_TEXT: "5",
		SINGLE_BLOCK: "6",
		SINGLE_LINE: "7",
		SINGLE_WORD: "8",
		CIRCLE_WORD: "9",
		SINGLE_CHAR: "10",
		SPARSE_TEXT: "11",
		SPARSE_TEXT_OSD: "12",
		RAW_LINE: "13"
	};
}));
//#endregion
//#region node_modules/tesseract.js/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	*
	* Entry point for tesseract.js, should be the entry when bundling.
	*
	* @fileoverview entry point for tesseract.js
	* @author Kevin Kwok <antimatter15@gmail.com>
	* @author Guillermo Webster <gui@mit.edu>
	* @author Jerome Wu <jeromewus@gmail.com>
	*/
	require_runtime();
	var createScheduler = require_createScheduler();
	var createWorker = require_createWorker();
	var Tesseract = require_Tesseract();
	var languages = require_languages();
	var OEM = require_OEM();
	var PSM = require_PSM();
	var { setLogging } = require_log();
	module.exports = {
		languages,
		OEM,
		PSM,
		createScheduler,
		createWorker,
		setLogging,
		...Tesseract
	};
}));
//#endregion
export { require_src as t };
