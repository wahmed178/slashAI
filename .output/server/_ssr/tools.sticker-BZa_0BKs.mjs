import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.sticker-BZa_0BKs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WhatsAppStickerMaker() {
	const [image, setImage] = (0, import_react.useState)(null);
	const [imgEl, setImgEl] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [textPos, setTextPos] = (0, import_react.useState)("bottom");
	const [textColor, setTextColor] = (0, import_react.useState)("#ffffff");
	const [textSize, setTextSize] = (0, import_react.useState)(36);
	const [border, setBorder] = (0, import_react.useState)(false);
	const [borderColor, setBorderColor] = (0, import_react.useState)("#ffffff");
	const [borderWidth, setBorderWidth] = (0, import_react.useState)(4);
	const [bgRemove, setBgRemove] = (0, import_react.useState)(false);
	const canvasRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const onFile = (0, import_react.useCallback)((e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const src = reader.result;
			setImage(src);
			const img = new Image();
			img.onload = () => setImgEl(img);
			img.src = src;
		};
		reader.readAsDataURL(file);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!imgEl || !canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		canvas.width = 512;
		canvas.height = 512;
		ctx.clearRect(0, 0, 512, 512);
		if (bgRemove) for (let y = 0; y < 512; y += 16) for (let x = 0; x < 512; x += 16) {
			ctx.fillStyle = (x / 16 + y / 16) % 2 === 0 ? "#ccc" : "#fff";
			ctx.fillRect(x, y, 16, 16);
		}
		else {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, 512, 512);
		}
		const size = Math.min(imgEl.width, imgEl.height);
		const sx = (imgEl.width - size) / 2;
		const sy = (imgEl.height - size) / 2;
		if (bgRemove) ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(imgEl, sx, sy, size, size, 0, 0, 512, 512);
		ctx.globalCompositeOperation = "source-over";
		if (border) {
			ctx.strokeStyle = borderColor;
			ctx.lineWidth = borderWidth;
			ctx.strokeRect(borderWidth / 2, borderWidth / 2, 512 - borderWidth, 512 - borderWidth);
		}
		if (text.trim()) {
			ctx.font = `bold ${textSize}px Impact, sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			const ty = textPos === "top" ? 48 : textPos === "center" ? 256 : 464;
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 4;
			ctx.lineJoin = "round";
			ctx.strokeText(text, 256, ty);
			ctx.fillStyle = textColor;
			ctx.fillText(text, 256, ty);
		}
	}, [
		imgEl,
		text,
		textPos,
		textColor,
		textSize,
		border,
		borderColor,
		borderWidth,
		bgRemove
	]);
	const download = () => {
		if (!canvasRef.current) return;
		const link = document.createElement("a");
		link.download = "sticker.png";
		link.href = canvasRef.current.toDataURL("image/png");
		link.click();
	};
	const colors = [
		"#ffffff",
		"#000000",
		"#ff0000",
		"#00ff00",
		"#0000ff",
		"#ffff00",
		"#ff00ff",
		"#00ffff",
		"#ff8800",
		"#88ff00"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "🎭 WhatsApp Sticker Maker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Turn any image into a 512×512 WhatsApp sticker"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => fileRef.current?.click(),
							className: "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 transition-colors hover:border-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 text-4xl",
									children: "📷"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: image ? "Click to change image" : "Drop image here or click to upload"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground/60",
									children: "JPG, PNG, WebP"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: onFile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: "Text Overlay"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: text,
									onChange: (e) => setText(e.target.value),
									placeholder: "Add text to sticker...",
									className: "mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex gap-2",
									children: [
										"top",
										"center",
										"bottom"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setTextPos(p),
										className: `flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${textPos === p ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: p.charAt(0).toUpperCase() + p.slice(1)
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex flex-wrap gap-2",
									children: colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setTextColor(c),
										className: "h-7 w-7 rounded-full border-2 transition-transform",
										style: {
											backgroundColor: c,
											borderColor: textColor === c ? "#58a6ff" : "transparent"
										}
									}, c))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Size"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 16,
											max: 64,
											value: textSize,
											onChange: (e) => setTextSize(Number(e.target.value)),
											className: "flex-1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [textSize, "px"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Border / Outline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setBorder(!border),
									className: `relative h-5 w-9 rounded-full transition-colors ${border ? "bg-primary" : "bg-muted"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${border ? "left-[18px]" : "left-0.5"}` })
								})]
							}), border && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex flex-wrap gap-2",
								children: colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setBorderColor(c),
									className: "h-6 w-6 rounded-full border-2 transition-transform",
									style: {
										backgroundColor: c,
										borderColor: borderColor === c ? "#58a6ff" : "transparent"
									}
								}, c))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Width"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 1,
										max: 12,
										value: borderWidth,
										onChange: (e) => setBorderWidth(Number(e.target.value)),
										className: "flex-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [borderWidth, "px"]
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Remove Background"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setBgRemove(!bgRemove),
									className: `relative h-5 w-9 rounded-full transition-colors ${bgRemove ? "bg-primary" : "bg-muted"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${bgRemove ? "left-[18px]" : "left-0.5"}` })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground/60",
								children: "Makes white background transparent for sticker"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: download,
							disabled: !image,
							className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40",
							children: "⬇ Download Sticker (512×512)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold text-foreground",
								children: "📱 How to add to WhatsApp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "space-y-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Download the sticker above" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Open WhatsApp" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Open any chat → tap 😊 emoji" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Tap \"📁\" → \"+\" to add new sticker" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "5. Pick the downloaded image" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "6. Done! Your sticker is ready to use" })
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:sticky lg:top-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold text-muted-foreground",
						children: "Preview (512×512)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-[#0b141a] p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								className: "max-h-[400px] w-full max-w-[400px] rounded-lg",
								style: { imageRendering: "pixelated" }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-muted-foreground/60",
							children: "How it looks in a dark chat"
						})]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { WhatsAppStickerMaker as component };
