import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.rain-screen-Cij5xbSc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RainScreen() {
	const canvasRef = (0, import_react.useRef)(null);
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [speed, setSpeed] = (0, import_react.useState)(3);
	const [color, setColor] = (0, import_react.useState)("blue");
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
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const blue = "rgba(88,166,255,0.6)";
		const white = "rgba(255,255,255,0.4)";
		const green = "rgba(63,185,80,0.5)";
		const drops = Array.from({ length: 200 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			speed: 2 + Math.random() * 4,
			length: 10 + Math.random() * 20,
			opacity: .1 + Math.random() * .4
		}));
		let animId;
		const draw = () => {
			ctx.fillStyle = "rgba(13,17,23,0.15)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = color === "white" ? white : color === "green" ? green : blue;
			ctx.lineWidth = 1;
			drops.forEach((d) => {
				ctx.globalAlpha = d.opacity;
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x - 1, d.y + d.length);
				ctx.stroke();
				d.y += d.speed * speed;
				if (d.y > canvas.height) {
					d.y = -d.length;
					d.x = Math.random() * canvas.width;
				}
			});
			animId = requestAnimationFrame(draw);
		};
		draw();
		return () => cancelAnimationFrame(animId);
	}, [speed, color]);
	const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
	const dateStr = now.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden",
		style: { background: "var(--background)" },
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex min-h-screen flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-6xl sm:text-8xl font-bold font-mono text-foreground",
					children: timeStr
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-lg text-muted-foreground",
					children: dateStr
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-4 right-4 z-20 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: speed,
					onChange: (e) => setSpeed(Number(e.target.value)),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-2 py-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 1,
							children: "Slow"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 3,
							children: "Normal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 6,
							children: "Fast"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: color,
					onChange: (e) => setColor(e.target.value),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-2 py-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "blue",
							children: "Blue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "white",
							children: "White"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "green",
							children: "Green"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { RainScreen as component };
