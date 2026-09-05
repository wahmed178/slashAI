import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.starfield-0xDY3JD8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Starfield() {
	const canvasRef = (0, import_react.useRef)(null);
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const cx = canvas.width / 2;
		const cy = canvas.height / 2;
		const stars = Array.from({ length: 300 }, () => ({
			x: (Math.random() - .5) * canvas.width * 2,
			y: (Math.random() - .5) * canvas.height * 2,
			z: Math.random() * 1e3
		}));
		let speed = 5;
		let animId;
		const draw = () => {
			ctx.fillStyle = "rgba(13,17,23,0.2)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			stars.forEach((star) => {
				star.z -= speed;
				if (star.z <= 0) {
					star.x = (Math.random() - .5) * canvas.width * 2;
					star.y = (Math.random() - .5) * canvas.height * 2;
					star.z = 1e3;
				}
				const sx = star.x / star.z * 300 + cx;
				const sy = star.y / star.z * 300 + cy;
				const size = Math.max(.5, (1 - star.z / 1e3) * 3);
				ctx.globalAlpha = 1 - star.z / 1e3;
				ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#e6edf3";
				ctx.beginPath();
				ctx.arc(sx, sy, size, 0, Math.PI * 2);
				ctx.fill();
			});
			speed = Math.min(speed + .01, 20);
			animId = requestAnimationFrame(draw);
		};
		draw();
		const clickHandler = () => {
			speed = 2;
		};
		canvas.addEventListener("click", clickHandler);
		return () => {
			cancelAnimationFrame(animId);
			canvas.removeEventListener("click", clickHandler);
		};
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
			})
		]
	});
}
//#endregion
export { Starfield as component };
