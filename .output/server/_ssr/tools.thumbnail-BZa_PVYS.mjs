import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.thumbnail-BZa_PVYS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThumbnailChecker() {
	const [url, setUrl] = (0, import_react.useState)("");
	const [videoId, setVideoId] = (0, import_react.useState)("");
	const [previewImg, setPreviewImg] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const extractId = (input) => {
		const match = input.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
		return match ? match[1] : "";
	};
	const handleSubmit = () => {
		const id = extractId(url);
		if (id) setVideoId(id);
	};
	const handleFile = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreviewImg(URL.createObjectURL(file));
			setVideoId("");
		}
	};
	const thumbSrc = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : previewImg;
	const thumbFallback = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Thumbnail Checker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎬 YouTube Thumbnail Checker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Preview how your thumbnail looks in YouTube search, homepage, sidebar, mobile, and Twitter."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: url,
						onChange: (e) => setUrl(e.target.value),
						placeholder: "Paste YouTube URL...",
						className: "h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50",
						onKeyDown: (e) => e.key === "Enter" && handleSubmit()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSubmit,
						disabled: !extractId(url),
						className: "rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
						children: "Check Thumbnail"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-xs text-muted-foreground",
					children: "— or —"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						onChange: handleFile,
						className: "hidden"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fileRef.current?.click(),
						className: "rounded-xl border border-border bg-surface px-6 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors",
						children: "Upload Image"
					})]
				}),
				thumbSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-3",
								children: "YouTube Search Result (Small)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumbSrc,
									onError: (e) => {
										if (thumbFallback) e.target.src = thumbFallback;
									},
									alt: "thumbnail",
									className: "w-[120px] rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/2 rounded bg-muted-foreground/10 mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/3 rounded bg-muted-foreground/10" })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-3",
								children: "YouTube Homepage (Medium)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumbSrc,
									onError: (e) => {
										if (thumbFallback) e.target.src = thumbFallback;
									},
									alt: "thumbnail",
									className: "w-[200px] rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2/3 rounded bg-muted-foreground/10 mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/2 rounded bg-muted-foreground/10" })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-3",
								children: "Sidebar (Small, Dark)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumbSrc,
									onError: (e) => {
										if (thumbFallback) e.target.src = thumbFallback;
									},
									alt: "thumbnail",
									className: "w-[100px] rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded bg-muted-foreground/20 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2/3 rounded bg-muted-foreground/10" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-3",
								children: "Mobile YouTube (Full Width)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: thumbSrc,
								onError: (e) => {
									if (thumbFallback) e.target.src = thumbFallback;
								},
								alt: "thumbnail",
								className: "w-full rounded-lg object-cover"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground mb-3",
								children: "Twitter/X Card Preview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumbSrc,
									onError: (e) => {
										if (thumbFallback) e.target.src = thumbFallback;
									},
									alt: "thumbnail",
									className: "w-full h-[180px] object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-surface-elevated",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/2 rounded bg-muted-foreground/10" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/20 bg-primary/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-primary mb-2",
								children: "Tips"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-1 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Is the title text readable at small size (120px)?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Are faces clearly visible and expressive?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Is the contrast strong enough against YouTube's dark/light backgrounds?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Does it stand out from competitors in search results?" })
								]
							})]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ThumbnailChecker as component };
