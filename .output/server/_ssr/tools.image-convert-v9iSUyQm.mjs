import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { U as RotateCcw, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.image-convert-v9iSUyQm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FORMATS = [
	{
		label: "JPG",
		mime: "image/jpeg"
	},
	{
		label: "PNG",
		mime: "image/png"
	},
	{
		label: "WebP",
		mime: "image/webp"
	}
];
var EXT = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp"
};
function ImageConvert() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("image/png");
	const [quality, setQuality] = (0, import_react.useState)(90);
	const [result, setResult] = (0, import_react.useState)("");
	const [origSize, setOrigSize] = (0, import_react.useState)(0);
	const [newSize, setNewSize] = (0, import_react.useState)(0);
	const inputRef = (0, import_react.useRef)(null);
	const convert = (0, import_react.useCallback)((f, fmt, q) => {
		setOrigSize(f.size);
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				if (blob) {
					setNewSize(blob.size);
					setResult(URL.createObjectURL(blob));
				}
			}, fmt, q / 100);
		};
		const url = URL.createObjectURL(f);
		setPreview(url);
		img.src = url;
	}, []);
	const handleFile = (f) => {
		setFile(f);
		convert(f, format, quality);
	};
	const download = () => {
		if (!result || !file) return;
		const a = document.createElement("a");
		a.href = result;
		a.download = file.name.replace(/\.[^.]+$/, `.${EXT[format]}`);
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Image Converter",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (e) => e.preventDefault(),
			onDrop: (e) => {
				e.preventDefault();
				e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]);
			},
			onClick: () => inputRef.current?.click(),
			className: "mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-4xl",
					children: "🔄"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-foreground",
					children: "Drag image here or click to upload"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "JPG, PNG, WebP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/*",
					className: "hidden",
					onChange: (e) => e.target.files?.[0] && handleFile(e.target.files[0])
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setFormat(f.mime);
							if (file) convert(file, f.mime, quality);
						},
						className: "min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors",
						style: {
							background: format === f.mime ? "var(--primary)" : "var(--surface-elevated)",
							borderColor: format === f.mime ? "transparent" : "var(--border)",
							color: format === f.mime ? "var(--background)" : "var(--muted-foreground)"
						},
						children: f.label
					}, f.mime))
				}),
				(format === "image/jpeg" || format === "image/webp") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quality" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-primary",
							children: [quality, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 10,
						max: 100,
						value: quality,
						onChange: (e) => {
							const q = Number(e.target.value);
							setQuality(q);
							if (file) convert(file, format, q);
						},
						className: "mt-2 w-full accent-primary"
					})]
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Original"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm font-medium text-foreground",
								children: [(origSize / 1024).toFixed(0), " KB"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Converted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm font-medium text-green",
								children: [(newSize / 1024).toFixed(0), " KB"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: download,
						className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
							" Download as ",
							(EXT[format] ?? "img").toUpperCase()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setFile(null);
							setResult("");
						},
						className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm text-foreground hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Convert another"]
					})
				] })
			]
		})
	});
}
//#endregion
export { ImageConvert as component };
