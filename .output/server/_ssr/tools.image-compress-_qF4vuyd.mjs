import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { U as RotateCcw, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.image-compress-_qF4vuyd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageCompress() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)("");
	const [compressed, setCompressed] = (0, import_react.useState)("");
	const [origSize, setOrigSize] = (0, import_react.useState)(0);
	const [compSize, setCompSize] = (0, import_react.useState)(0);
	const [quality, setQuality] = (0, import_react.useState)(70);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const compress = (0, import_react.useCallback)((f, q) => {
		setLoading(true);
		const img = new Image();
		img.onload = () => {
			setOrigSize(f.size);
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				if (blob) {
					setCompSize(blob.size);
					setCompressed(URL.createObjectURL(blob));
				}
				setLoading(false);
			}, "image/jpeg", q / 100);
		};
		const url = URL.createObjectURL(f);
		setPreview(url);
		img.src = url;
	}, []);
	const handleFile = (f) => {
		if (f.size > 10485760) return alert("Max 10MB");
		setFile(f);
		compress(f, quality);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const f = e.dataTransfer.files[0];
		if (f) handleFile(f);
	};
	const download = () => {
		if (!compressed || !file) return;
		const a = document.createElement("a");
		a.href = compressed;
		a.download = file.name.replace(/\.[^.]+$/, "-compressed.jpg");
		a.click();
	};
	const reset = () => {
		setFile(null);
		setPreview("");
		setCompressed("");
		setOrigSize(0);
		setCompSize(0);
	};
	const pct = origSize > 0 ? Math.round((1 - compSize / origSize) * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Image Compressor",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "hidden"
		}), !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (e) => e.preventDefault(),
			onDrop: handleDrop,
			onClick: () => inputRef.current?.click(),
			className: "mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-4xl",
					children: "🖼️"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-foreground",
					children: "Drag image here or click to upload"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "JPG, PNG, WebP, GIF • Max 10MB"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							if (file) compress(file, q);
						},
						className: "mt-2 w-full accent-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Original"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview,
								alt: "Original",
								className: "mt-2 max-h-48 w-full rounded-lg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-center text-xs text-muted-foreground",
								children: [(origSize / 1024).toFixed(0), " KB"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Compressed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: compressed || preview,
								alt: "Compressed",
								className: "mt-2 max-h-48 w-full rounded-lg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-center text-xs text-muted-foreground",
								children: [(compSize / 1024).toFixed(0), " KB"]
							})
						]
					})]
				}),
				pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-sm font-medium text-green",
					children: [pct, "% smaller"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: download,
					className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download compressed image"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: reset,
					className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Compress another"]
				})
			]
		})]
	});
}
//#endregion
export { ImageCompress as component };
