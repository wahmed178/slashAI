import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as X, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.images-to-pdf-Cx_jqxAB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImagesToPdf() {
	const [images, setImages] = (0, import_react.useState)([]);
	const [pageSize, setPageSize] = (0, import_react.useState)("a4");
	const [orientation, setOrientation] = (0, import_react.useState)("portrait");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const addFiles = (files) => {
		if (!files) return;
		const newItems = [];
		for (const f of Array.from(files)) if (f.type.startsWith("image/")) newItems.push({
			file: f,
			url: URL.createObjectURL(f)
		});
		setImages((prev) => [...prev, ...newItems]);
	};
	const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));
	const createPDF = async () => {
		if (!images.length) return;
		setCreating(true);
		try {
			const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => n.n);
			const [pw, ph] = {
				a4: [210, 297],
				letter: [215.9, 279.4],
				square: [210, 210]
			}[pageSize] ?? [210, 297];
			const [w, h] = orientation === "landscape" ? [ph, pw] : [pw, ph];
			const pdf = new jsPDF({
				orientation,
				unit: "mm",
				format: [w, h]
			});
			for (let i = 0; i < images.length; i++) {
				if (i > 0) pdf.addPage([w, h], orientation === "landscape" ? "l" : "p");
				const imgData = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.readAsDataURL(images[i].file);
				});
				pdf.addImage(imgData, "JPEG", 0, 0, w, h);
			}
			pdf.save("slashai-export.pdf");
		} catch {
			alert("Failed to create PDF. Try again.");
		}
		setCreating(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Images to PDF",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (e) => e.preventDefault(),
			onDrop: (e) => {
				e.preventDefault();
				addFiles(e.dataTransfer.files);
			},
			onClick: () => inputRef.current?.click(),
			className: "mt-4 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-6 text-center transition-colors hover:border-primary/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-3xl",
					children: "📕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-foreground",
					children: "Upload images (JPG, PNG, WebP)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/*",
					multiple: true,
					className: "hidden",
					onChange: (e) => addFiles(e.target.files)
				})
			]
		}), images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
					children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative rounded-lg border border-border bg-surface p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img.url,
								alt: img.file.name,
								className: "h-20 w-full rounded object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 truncate text-[10px] text-muted-foreground",
								children: img.file.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => removeImage(i),
								className: "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground hover:text-red",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground mb-1",
						children: "Page size"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							"a4",
							"letter",
							"square"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPageSize(s),
							className: "min-h-[36px] rounded-lg border px-3 text-xs font-medium capitalize transition-colors",
							style: {
								background: pageSize === s ? "var(--primary)" : "var(--surface-elevated)",
								borderColor: pageSize === s ? "transparent" : "var(--border)",
								color: pageSize === s ? "var(--background)" : "var(--muted-foreground)"
							},
							children: s
						}, s))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground mb-1",
						children: "Orientation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: ["portrait", "landscape"].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOrientation(o),
							className: "min-h-[36px] rounded-lg border px-3 text-xs font-medium capitalize transition-colors",
							style: {
								background: orientation === o ? "var(--primary)" : "var(--surface-elevated)",
								borderColor: orientation === o ? "transparent" : "var(--border)",
								color: orientation === o ? "var(--background)" : "var(--muted-foreground)"
							},
							children: o
						}, o))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: createPDF,
					disabled: creating,
					className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
						" ",
						creating ? "Creating PDF…" : `Create PDF (${images.length} images)`
					]
				})
			]
		})]
	});
}
//#endregion
export { ImagesToPdf as component };
