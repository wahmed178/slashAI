import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.screenshot-B5N106rL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScreenshotOCR() {
	const [imagePreview, setImagePreview] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const fileRef = (0, import_react.useRef)(null);
	const handleFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImagePreview(URL.createObjectURL(file));
		setText("");
		setLoading(true);
		setProgress(0);
		try {
			const result = await (await import("../_libs/tesseract.js+unenv.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).recognize(file, "eng", { logger: (m) => {
				if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
			} });
			setText(result.data.text);
		} catch {
			setText("Error: Could not process the image. Try a clearer image.");
		} finally {
			setLoading(false);
		}
	};
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Screenshot to Text",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📸 Screenshot to Text (OCR)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Extract text from any image or screenshot. Runs 100% in your browser — nothing uploaded."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "image/*",
					onChange: handleFile,
					className: "hidden"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => fileRef.current?.click(),
					className: "flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-primary/40",
					children: imagePreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imagePreview,
						alt: "Uploaded",
						className: "max-h-40 rounded-lg object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl",
							children: "📸"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Click to upload screenshot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "JPG, PNG, WebP — all processed locally"
						})
					] })
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Extracting text..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress, "%"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-surface-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-all duration-300",
							style: { width: `${progress}%` }
						})
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-foreground",
						children: "Extracted Text"
					}), text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCopy,
						className: "text-xs text-primary hover:underline",
						children: "Copy all"
					})]
				}), text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-[400px] overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-4 text-sm leading-relaxed text-foreground",
					children: text
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg",
						children: "🔍"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: loading ? "Processing..." : "Upload an image to extract text"
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { ScreenshotOCR as component };
