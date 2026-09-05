import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.flip-clock-BQE3En1Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FlipCard({ value, label, showAmPm, isPm }) {
	const [displayed, setDisplayed] = (0, import_react.useState)(value);
	const [prev, setPrev] = (0, import_react.useState)(value);
	const [flipping, setFlipping] = (0, import_react.useState)(false);
	const timeoutRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (value !== displayed) {
			setPrev(displayed);
			setFlipping(true);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setDisplayed(value);
				setFlipping(false);
			}, 350);
		}
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [value, displayed]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full",
		style: { aspectRatio: "1.35" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 rounded-[18px] sm:rounded-[24px]",
				style: { background: "#1c1c1c" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						style: { clipPath: "inset(0 0 50% 0)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "select-none pointer-events-none",
								style: {
									fontFamily: "\"Inter\", system-ui, -apple-system, sans-serif",
									fontSize: "clamp(80px, 22vw, 220px)",
									fontWeight: 600,
									lineHeight: 1,
									color: "#d4d4d4",
									letterSpacing: "-0.02em"
								},
								children: flipping ? prev : displayed
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						style: { clipPath: "inset(50% 0 0 0)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "select-none pointer-events-none",
								style: {
									fontFamily: "\"Inter\", system-ui, -apple-system, sans-serif",
									fontSize: "clamp(80px, 22vw, 220px)",
									fontWeight: 600,
									lineHeight: 1,
									color: "#9a9a9a",
									letterSpacing: "-0.02em"
								},
								children: displayed
							})
						})
					}),
					flipping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 origin-bottom",
						style: {
							clipPath: "inset(0 0 50% 0)",
							animation: "flipDown 0.35s ease-in forwards",
							backfaceVisibility: "hidden",
							zIndex: 10
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "select-none pointer-events-none",
								style: {
									fontFamily: "\"Inter\", system-ui, -apple-system, sans-serif",
									fontSize: "clamp(80px, 22vw, 220px)",
									fontWeight: 600,
									lineHeight: 1,
									color: "#d4d4d4",
									letterSpacing: "-0.02em"
								},
								children: prev
							})
						})
					}),
					flipping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 origin-top",
						style: {
							clipPath: "inset(50% 0 0 0)",
							transform: "rotateX(180deg)",
							animation: "flipUp 0.35s ease-out 0.175s forwards",
							backfaceVisibility: "hidden",
							zIndex: 10
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "select-none pointer-events-none",
								style: {
									fontFamily: "\"Inter\", system-ui, -apple-system, sans-serif",
									fontSize: "clamp(80px, 22vw, 220px)",
									fontWeight: 600,
									lineHeight: 1,
									color: "#9a9a9a",
									letterSpacing: "-0.02em"
								},
								children: displayed
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 right-0 top-1/2 z-20",
						style: {
							height: "1px",
							marginTop: "-0.5px",
							background: "rgba(0,0,0,0.6)"
						}
					})
				]
			}),
			showAmPm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-30",
				style: {
					bottom: "12%",
					left: "8%"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] sm:text-sm font-semibold tracking-wider",
					style: { color: "rgba(255,255,255,0.3)" },
					children: isPm ? "PM" : "AM"
				})
			}),
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-30",
				style: {
					top: "10%",
					right: "6%"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[9px] sm:text-[11px] font-medium tracking-[0.15em] uppercase",
					style: { color: "rgba(255,255,255,0.18)" },
					children: label
				})
			})
		]
	});
}
function FlipClock() {
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [h24, setH24] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	const [showControls, setShowControls] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const show = () => {
			setShowControls(true);
		};
		const hide = setTimeout(() => setShowControls(false), 3e3);
		window.addEventListener("mousemove", show);
		window.addEventListener("touchstart", show);
		return () => {
			window.removeEventListener("mousemove", show);
			window.removeEventListener("touchstart", show);
			clearTimeout(hide);
		};
	}, [showControls]);
	let hours;
	let minutes;
	let seconds;
	let isPm = false;
	if (h24) {
		hours = now.getHours();
		minutes = now.getMinutes();
		seconds = now.getSeconds();
	} else {
		let h = now.getHours();
		isPm = h >= 12;
		h = h % 12 || 12;
		hours = h;
		minutes = now.getMinutes();
		seconds = now.getSeconds();
	}
	const hStr = String(hours).padStart(2, "0");
	const mStr = String(minutes).padStart(2, "0");
	const sStr = String(seconds).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-screen w-full overflow-hidden select-none",
		style: { background: "#000000" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed top-4 left-4 z-50 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.history.back(),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: "Close"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-0 bottom-0 -translate-x-px z-0",
				style: {
					width: "1px",
					background: "rgba(255,255,255,0.04)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-[260px] sm:max-w-[320px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipCard, {
							value: hStr,
							showAmPm: !h24,
							isPm
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-[260px] sm:max-w-[320px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipCard, {
							value: mStr,
							label: "MINUTES"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-[260px] sm:max-w-[320px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipCard, {
							value: sStr,
							label: "SECONDS"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 fixed bottom-0 left-0 right-0 flex items-center justify-center pb-5 gap-3 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setH24(!h24),
					className: "h-8 px-3 rounded-full border text-[11px] tracking-wider transition-all duration-150",
					style: {
						borderColor: "rgba(255,255,255,0.08)",
						color: "rgba(255,255,255,0.35)",
						background: "rgba(255,255,255,0.03)"
					},
					children: h24 ? "24H" : "12H"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes flipDown {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipUp {
          0%   { transform: rotateX(180deg); }
          100% { transform: rotateX(0deg); }
        }
      ` })
		]
	});
}
//#endregion
export { FlipClock as component };
