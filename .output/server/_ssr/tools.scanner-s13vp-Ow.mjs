import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { On as Camera, X as Plus, h as Upload, i as X, kn as CameraOff, on as Download, q as RefreshCw, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as E } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.scanner-s13vp-Ow.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		id: "original",
		label: "Original",
		desc: "No processing"
	},
	{
		id: "enhanced",
		label: "Enhanced",
		desc: "Contrast boost"
	},
	{
		id: "bw",
		label: "Black & white",
		desc: "Hard threshold"
	},
	{
		id: "grayscale",
		label: "Grayscale",
		desc: "Softer tones"
	}
];
var PAGES_KEY = "slashai-scanner-pages";
var MAX_PAGES = 20;
var MAX_EDGE = 1600;
function readPages() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(PAGES_KEY);
		if (!raw) return [];
		const arr = JSON.parse(raw);
		return Array.isArray(arr) ? arr.filter((p) => Boolean(p && typeof p.id === "string" && typeof p.dataUrl === "string")) : [];
	} catch {
		return [];
	}
}
function writePages(pages) {
	try {
		localStorage.setItem(PAGES_KEY, JSON.stringify(pages.slice(0, MAX_PAGES)));
	} catch {}
}
var uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image"));
		img.src = src;
	});
}
/** Downscale wide images so pages stay small enough to persist + export fast. */
async function toPageDataUrl(source, quality = .86) {
	const bmp = source instanceof Blob ? await createImageBitmap(source) : source instanceof HTMLCanvasElement ? null : null;
	let width;
	let height;
	let draw;
	if (source instanceof Blob) {
		width = bmp.width;
		height = bmp.height;
		draw = bmp;
	} else {
		width = source.naturalWidth || source.width;
		height = source.naturalHeight || source.height;
		draw = source;
	}
	const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(width * scale));
	canvas.height = Math.max(1, Math.round(height * scale));
	canvas.getContext("2d").drawImage(draw, 0, 0, canvas.width, canvas.height);
	if (bmp) bmp.close();
	return canvas.toDataURL("image/jpeg", quality);
}
/** Pixel-level enhancement applied on export / preview. */
function processPixels(dataUrl, mode) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const d = imageData.data;
			for (let i = 0; i < d.length; i += 4) {
				const r = d[i];
				const g = d[i + 1];
				const b = d[i + 2];
				let nr = r;
				let ng = g;
				let nb = b;
				if (mode === "bw") nr = ng = nb = (r + g + b) / 3 > 128 ? 255 : 0;
				else if (mode === "grayscale") nr = ng = nb = .299 * r + .587 * g + .114 * b;
				else {
					const factor = 1.35;
					nr = Math.min(255, Math.max(0, (r - 128) * factor + 128));
					ng = Math.min(255, Math.max(0, (g - 128) * factor + 128));
					nb = Math.min(255, Math.max(0, (b - 128) * factor + 128));
				}
				d[i] = nr;
				d[i + 1] = ng;
				d[i + 2] = nb;
			}
			ctx.putImageData(imageData, 0, 0);
			resolve(canvas.toDataURL("image/jpeg", .9));
		};
		img.onerror = () => resolve(dataUrl);
		img.src = dataUrl;
	});
}
function ScannerTool() {
	const isMobile = (0, import_react.useMemo)(() => typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);
	const [pages, setPages] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [cameraOn, setCameraOn] = (0, import_react.useState)(false);
	const [cameraError, setCameraError] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("enhanced");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const stored = readPages();
		setPages(stored);
		setActiveId(stored[0]?.id ?? null);
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		writePages(pages);
	}, [pages, hydrated]);
	const stopCamera = (0, import_react.useCallback)(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setCameraOn(false);
	}, []);
	(0, import_react.useEffect)(() => stopCamera, [stopCamera]);
	const startCamera = async () => {
		if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
			setCameraError("Camera is not available on this device or browser — upload an image instead.");
			return;
		}
		setCameraError("");
		setBusy(true);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: {
				facingMode: { ideal: "environment" },
				width: { ideal: 1920 },
				height: { ideal: 1080 }
			} });
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play().catch(() => void 0);
			}
			setCameraOn(true);
		} catch {
			setCameraError("Camera permission was denied or no camera was found. You can still use the upload option below.");
		} finally {
			setBusy(false);
		}
	};
	const capture = async () => {
		const video = videoRef.current;
		if (!video || video.videoWidth === 0) return;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d").drawImage(video, 0, 0);
		const dataUrl = await toPageDataUrl(canvas);
		const page = {
			id: uid(),
			dataUrl
		};
		setPages((prev) => {
			const next = [...prev, page];
			if (next.length > MAX_PAGES) next.shift();
			return next;
		});
		setActiveId(page.id);
	};
	const addFromFile = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast("Please choose an image file");
			return;
		}
		setBusy(true);
		try {
			const dataUrl = await toPageDataUrl(file);
			const page = {
				id: uid(),
				dataUrl
			};
			setPages((prev) => [...prev, page]);
			setActiveId(page.id);
		} catch {
			toast("Could not read that image");
		} finally {
			setBusy(false);
		}
	};
	const activePage = pages.find((p) => p.id === activeId) ?? null;
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!activePage) {
			setPreviewUrl("");
			return;
		}
		if (mode === "original") {
			setPreviewUrl(activePage.dataUrl);
			return;
		}
		let cancelled = false;
		processPixels(activePage.dataUrl, mode).then((url) => {
			if (!cancelled) setPreviewUrl(url);
		});
		return () => {
			cancelled = true;
		};
	}, [activePage, mode]);
	const downloadPage = async (page) => {
		setBusy(true);
		try {
			const finalUrl = mode === "original" ? page.dataUrl : await processPixels(page.dataUrl, mode);
			const a = document.createElement("a");
			a.href = finalUrl;
			a.download = `scan-${page.id}.jpg`;
			a.click();
		} finally {
			setBusy(false);
		}
	};
	const downloadPdf = async () => {
		if (pages.length === 0) return;
		setBusy(true);
		try {
			const pdf = new E({
				orientation: "p",
				unit: "mm",
				format: "a4"
			});
			const w = 210;
			const h = 297;
			for (let i = 0; i < pages.length; i++) {
				const page = pages[i];
				const url = mode === "original" ? page.dataUrl : await processPixels(page.dataUrl, mode);
				const img = await loadImage(url);
				const ratio = Math.min(w / img.width, h / img.height);
				const dw = img.width * ratio;
				const dh = img.height * ratio;
				if (i > 0) pdf.addPage();
				pdf.addImage(url, "JPEG", (w - dw) / 2, (h - dh) / 2, dw, dh);
			}
			pdf.save("scanned-document.pdf");
			toast("PDF downloaded");
		} catch {
			toast("Could not create the PDF");
		} finally {
			setBusy(false);
		}
	};
	const movePage = (i, dir) => {
		setPages((prev) => {
			const next = [...prev];
			const j = i + dir;
			if (j < 0 || j >= next.length) return prev;
			[next[i], next[j]] = [next[j], next[i]];
			return next;
		});
	};
	const deletePage = (id) => {
		setPages((prev) => {
			const next = prev.filter((p) => p.id !== id);
			if (activeId === id) setActiveId(next[0]?.id ?? null);
			return next;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Document Scanner",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex items-center justify-between gap-3 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl",
					children: "📷 Document Scanner"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] text-muted-foreground",
					children: "Capture, enhance and export clean document scans — everything stays on your device."
				})] })
			}),
			!isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.08)] p-3 text-[13px] leading-relaxed text-muted-foreground",
				children: [
					"💡 This tool works best on ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "mobile"
					}),
					", where you can use your camera. On desktop, ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "upload an image"
					}),
					" below instead."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel relative overflow-hidden rounded-xl",
						children: [
							cameraOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								playsInline: true,
								muted: true,
								className: "aspect-[3/4] w-full bg-black object-cover sm:aspect-[4/3]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 bottom-0 flex justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: stopCamera,
									className: "flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/25",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-4" }), " Stop"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void capture(),
									className: "flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), " Capture"]
								})]
							})] }) : activePage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: previewUrl,
									alt: "Scan preview",
									className: "max-h-[520px] w-full object-contain bg-black/40"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute top-2 left-2 rounded-md bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur",
									children: [
										"Page ",
										pages.findIndex((p) => p.id === activePage.id) + 1,
										" / ",
										pages.length
									]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex aspect-[4/3] flex-col items-center justify-center bg-surface-elevated/40 p-6 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-16 items-center justify-center rounded-2xl bg-surface text-3xl",
										children: "📄"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm font-semibold text-foreground",
										children: "No page yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 max-w-[260px] text-[13px] text-muted-foreground",
										children: "Open the camera or upload a photo of a document to start scanning."
									})
								]
							}),
							cameraError && !cameraOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t border-border bg-[rgba(248,81,73,0.08)] p-2.5 text-[12px] text-red-300",
								children: cameraError
							}),
							pages.length > 0 && activePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5 border-t border-border bg-surface p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1 text-[11px] font-semibold text-muted-foreground",
									children: "Enhance"
								}), MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode(m.id),
									title: m.desc,
									className: cn("rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors", mode === m.id ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground"),
									children: m.label
								}, m.id))]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							!cameraOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void startCamera(),
								className: "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-primary" }), " Open camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => fileRef.current?.click(),
								className: "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 text-primary" }), " Upload image"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy || !activePage,
								onClick: () => activePage && void downloadPage(activePage),
								className: "flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Save JPG"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy || pages.length === 0,
								onClick: () => void downloadPdf(),
								className: "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-40",
								children: [
									"📕 PDF (",
									pages.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) addFromFile(f);
									e.currentTarget.value = "";
								}
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel rounded-xl p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-[12px] font-semibold tracking-wide text-muted-foreground uppercase",
										children: [
											"Pages (",
											pages.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: pages.length >= MAX_PAGES ? "Limit reached" : "drag to reorder"
									})]
								}),
								pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 rounded-lg border border-dashed border-border p-4 text-center text-[12px] leading-relaxed text-muted-foreground",
									children: "Captured and uploaded pages appear here as a multi-page document."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible",
									children: [pages.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										draggable: true,
										onDragStart: (e) => {
											e.dataTransfer.setData("text/plain", String(i));
										},
										onDragOver: (e) => e.preventDefault(),
										onDrop: (e) => {
											e.preventDefault();
											const from = Number(e.dataTransfer.getData("text/plain"));
											if (Number.isNaN(from) || from === i) return;
											setPages((prev) => {
												const next = [...prev];
												const [moved] = next.splice(from, 1);
												if (!moved) return prev;
												next.splice(i, 0, moved);
												return next;
											});
										},
										className: cn("group relative shrink-0 cursor-grab rounded-lg border-2 transition-colors active:cursor-grabbing", p.id === activeId ? "border-primary" : "border-border hover:border-primary/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.dataUrl,
												alt: `Page ${i + 1}`,
												className: "h-16 w-16 rounded object-cover lg:h-14 lg:w-full"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 font-mono text-[9px] text-white",
												children: i + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Delete page ${i + 1}`,
												onClick: () => deletePage(p.id),
												className: "absolute top-0.5 right-0.5 hidden rounded bg-black/60 p-0.5 text-white group-hover:block",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute top-1/2 right-0.5 hidden -translate-y-1/2 flex-col gap-0.5 lg:group-hover:flex",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Move up",
													disabled: i === 0,
													onClick: () => movePage(i, -1),
													className: "rounded bg-black/60 p-0.5 text-white disabled:opacity-30",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3 rotate-180" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Move down",
													disabled: i === pages.length - 1,
													onClick: () => movePage(i, 1),
													className: "rounded bg-black/60 p-0.5 text-white disabled:opacity-30",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" })
												})]
											})
										]
									}, p.id)), pages.length < MAX_PAGES && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fileRef.current?.click(),
										className: "flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary lg:h-14 lg:w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px]",
											children: "Add page"
										})]
									}) })]
								}),
								pages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setPages([]);
											setActiveId(null);
											toast("All pages cleared");
										},
										className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Clear all"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[12px] font-semibold text-foreground",
								children: "Scanning tips"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1.5 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep the document flat and well lit." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fill the frame — edges of the paper cropped out look best." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "“Black & white” works great for text-heavy pages." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-center text-[11px] text-muted-foreground",
							children: [
								"Pages are saved on this device only.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tools",
									className: "text-primary hover:underline",
									children: "More tools →"
								})
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ScannerTool as component };
