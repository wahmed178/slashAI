import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-build-ideas-DCF1BjC5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var PROJECT_STAGES = [
	"Idea",
	"Validating",
	"Planning",
	"Building",
	"Launched"
];
var KEYS = {
	saved: "slashai:ideas:saved",
	projects: "slashai:ideas:projects",
	specs: "slashai:ideas:specs",
	validations: "slashai:ideas:validations"
};
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
/** Device-local saved ideas + project tracker. No account needed. */
function useIdeaLibrary() {
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSaved(read(KEYS.saved, []));
		setProjects(read(KEYS.projects, []));
		setReady(true);
	}, []);
	return {
		ready,
		saved,
		projects,
		toggleSaved: (0, import_react.useCallback)((ideaId) => {
			setSaved((prev) => {
				const next = prev.includes(ideaId) ? prev.filter((x) => x !== ideaId) : [ideaId, ...prev];
				write(KEYS.saved, next);
				return next;
			});
		}, []),
		removeSaved: (0, import_react.useCallback)((ideaId) => {
			setSaved((prev) => {
				const next = prev.filter((x) => x !== ideaId);
				write(KEYS.saved, next);
				return next;
			});
		}, []),
		upsertProject: (0, import_react.useCallback)((project) => {
			setProjects((prev) => {
				const existing = prev.find((p) => p.ideaId === project.ideaId);
				const merged = {
					slug: project.slug ?? existing?.slug ?? "",
					title: project.title ?? existing?.title ?? "",
					stage: project.stage ?? existing?.stage ?? "Idea",
					notes: project.notes ?? existing?.notes ?? "",
					ideaId: project.ideaId,
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				const next = existing ? prev.map((p) => p.ideaId === project.ideaId ? merged : p) : [merged, ...prev];
				write(KEYS.projects, next);
				return next;
			});
		}, []),
		removeProject: (0, import_react.useCallback)((ideaId) => {
			setProjects((prev) => {
				const next = prev.filter((p) => p.ideaId !== ideaId);
				write(KEYS.projects, next);
				return next;
			});
		}, [])
	};
}
/** Per-idea spec cache so repeat opens are instant and work offline. */
function readSpecCache(slug) {
	return read(KEYS.specs, {})[slug] ?? null;
}
function writeSpecCache(slug, spec) {
	const all = read(KEYS.specs, {});
	all[slug] = spec;
	write(KEYS.specs, all);
}
function readValidations() {
	return read(KEYS.validations, []);
}
function saveValidation(record) {
	const all = readValidations();
	write(KEYS.validations, [record, ...all].slice(0, 25));
}
//#endregion
export { useIdeaLibrary as a, saveValidation as i, readSpecCache as n, writeSpecCache as o, readValidations as r, PROJECT_STAGES as t };
