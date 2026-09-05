import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.watermark-Xjy2CmUA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WatermarkTool() {
	const canvasRef = (0, import_react.useRef)(null);
	const [image, setImage] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("© 2026 SlashAI");
	const [position, setPosition] = (0, import_react.useState)("bottom-right");
	const [opacity, setOpacity] = (0, import_react.useState)(50);
	const [fontSize, setFontSize] = (0, import_react.useState)(24);
	const [color, setColor] = (0, import_react.useState)("#ffffff");
	const handleFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const img = new Image();
		img.onload = () => setImage(img);
		img.src = URL.createObjectURL(file);
	};
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas || !image) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = image.width;
		canvas.height = image.height;
		ctx.drawImage(image, 0, 0);
		ctx.globalAlpha = opacity / 100;
		ctx.font = `${fontSize}px sans-serif`;
		ctx.fillStyle = color;
		ctx.textBaseline = "top";
		const tw = ctx.measureText(text).width;
		const th = fontSize;
		const pad = 20;
		if (position === "tile") {
			ctx.globalAlpha = opacity / 200;
			for (let y = 0; y < canvas.height; y += th + 60) for (let x = 0; x < canvas.width; x += tw + 80) {
				ctx.save();
				ctx.translate(x + tw / 2, y + th / 2);
				ctx.rotate(-Math.PI / 6);
				ctx.fillText(text, -tw / 2, -th / 2);
				ctx.restore();
			}
		} else {
			const positions = {
				"top-left": [pad, pad],
				"top-right": [canvas.width - tw - pad, pad],
				"bottom-left": [pad, canvas.height - th - pad],
				"bottom-right": [canvas.width - tw - pad, canvas.height - th - pad],
				"center": [(canvas.width - tw) / 2, (canvas.height - th) / 2]
			};
			const pos = positions[position] || positions["bottom-right"];
			if (pos) ctx.fillText(text, pos[0], pos[1]);
		}
		ctx.globalAlpha = 1;
	}, [
		image,
		text,
		position,
		opacity,
		fontSize,
		color
	]);
	(0, import_react.useEffect)(() => {
		draw();
	}, [draw]);
	const handleDownload = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const link = document.createElement("a");
		link.download = "watermarked-image.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Watermark Tool",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🖼️ Image Watermark Tool"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Add text watermarks to images. 100% browser-based — nothing uploaded."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: "Upload Image"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: handleFile,
						className: "w-full rounded-lg border border-border bg-surface p-2 text-sm text-foreground"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: "Watermark Text"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: text,
						onChange: (e) => setText(e.target.value),
						className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: "Position"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1",
						children: [
							"top-left",
							"top-right",
							"center",
							"bottom-left",
							"bottom-right",
							"tile"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPosition(p),
							className: `rounded-lg border px-2 py-1 text-[10px] transition-colors ${position === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
							children: p === "tile" ? "Tiled" : p.split("-").map((w) => (w[0] ?? "").toUpperCase()).join("")
						}, p))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: [
							"Opacity: ",
							opacity,
							"%"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 10,
						max: 100,
						value: opacity,
						onChange: (e) => setOpacity(Number(e.target.value)),
						className: "w-full"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: [
							"Font Size: ",
							fontSize,
							"px"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 8,
						max: 72,
						value: fontSize,
						onChange: (e) => setFontSize(Number(e.target.value)),
						className: "w-full"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: "Color"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							"#ffffff",
							"#000000",
							"#ff0000",
							"#00ff00",
							"#0000ff",
							"#ffff00"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setColor(c),
							className: `size-7 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`,
							style: { background: c }
						}, c))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleDownload,
						disabled: !image,
						className: "h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40",
						children: "Download Watermarked Image"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 flex items-center justify-center rounded-xl border border-border bg-surface p-4 min-h-[300px]",
				children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "max-h-[500px] w-full object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-4xl",
						children: "🖼️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Upload an image to start"
					})]
				})
			})]
		})]
	});
}
//#endregion
export { WatermarkTool as component };
