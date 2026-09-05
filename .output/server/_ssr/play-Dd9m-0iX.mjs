import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button, o as COMMANDS } from "./slashkits-CB7bx4DD.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Sparkles, c as WandSparkles, cn as Dices, d as Volume2, j as Shuffle, mn as Coins, u as VolumeX } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as isMuted, r as setMuted, t as feedback } from "./play-sound-4NQwUsQc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-Dd9m-0iX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Tile({ title, hint, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("panel relative overflow-hidden rounded-2xl p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/50", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute -top-24 -right-16 size-48 rounded-full bg-primary/10 blur-3xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-4",
				children
			})
		]
	});
}
/** Big tactile action button: press-scale, glow, sound + haptics. */
function ActionButton({ children, onClick, icon: Icon, busy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled: busy,
		onClick,
		className: "group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-150 ease-out will-change-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none active:translate-y-0 active:scale-[0.97] disabled:opacity-70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-4", busy && "animate-spin") }),
			children
		]
	});
}
function CoinToss() {
	const [result, setResult] = (0, import_react.useState)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const toss = () => {
		feedback("flip");
		setSpinning(true);
		window.setTimeout(() => {
			setResult(Math.random() < .5 ? "Heads" : "Tails");
			setSpinning(false);
			feedback("win");
		}, 700);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
		title: "Coin toss",
		hint: "Settle it in one tap.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex size-24 items-center justify-center rounded-full border-2 border-primary/40 bg-surface text-lg font-bold text-foreground transition-transform duration-700 ease-out", spinning && "animate-spin"),
				"aria-live": "polite",
				children: spinning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-8 text-primary" }) : result ?? "Toss"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
				icon: Coins,
				onClick: toss,
				busy: spinning,
				children: "Flip the coin"
			})]
		})
	});
}
var PIPS = [
	"⚀",
	"⚁",
	"⚂",
	"⚃",
	"⚄",
	"⚅"
];
function DiceRoll() {
	const [dice, setDice] = (0, import_react.useState)([1, 1]);
	const [rolling, setRolling] = (0, import_react.useState)(false);
	const roll = () => {
		feedback("roll");
		setRolling(true);
		const timer = window.setInterval(() => {
			setDice([Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]);
		}, 70);
		window.setTimeout(() => {
			window.clearInterval(timer);
			setRolling(false);
			feedback("win");
		}, 620);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
		title: "Dice",
		hint: "Two dice, real randomness.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					"aria-live": "polite",
					children: dice.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("select-none text-6xl leading-none text-primary transition-transform duration-150", rolling && "scale-110"),
						children: PIPS[d]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Total ", dice[0] + dice[1] + 2]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
					icon: Dices,
					onClick: roll,
					busy: rolling,
					children: "Roll dice"
				})
			]
		})
	});
}
function DecisionWheel() {
	const [raw, setRaw] = (0, import_react.useState)("Pizza, Biryani, Noodles, Cook at home");
	const [pick, setPick] = (0, import_react.useState)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const spin = () => {
		const options = raw.split(/[,\n]/).map((o) => o.trim()).filter(Boolean);
		if (options.length === 0) return;
		feedback("roll");
		setSpinning(true);
		const timer = window.setInterval(() => {
			setPick(options[Math.floor(Math.random() * options.length)] ?? null);
		}, 90);
		window.setTimeout(() => {
			window.clearInterval(timer);
			setSpinning(false);
			feedback("win");
		}, 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
		title: "Decide for me",
		hint: "Type your options, comma separated.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: raw,
					onChange: (e) => setRaw(e.target.value),
					rows: 3,
					"aria-label": "Options to choose between",
					className: "w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none",
					placeholder: "Option one, option two, option three"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("rounded-xl border border-dashed border-primary/40 px-4 py-3 text-center text-base font-semibold text-foreground transition-opacity", spinning && "opacity-60"),
					"aria-live": "polite",
					children: pick ?? "Spin to pick"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
					icon: Shuffle,
					onClick: spin,
					busy: spinning,
					children: "Spin"
				})
			]
		})
	});
}
function SurpriseMe() {
	const navigate = useNavigate();
	const [teaser, setTeaser] = (0, import_react.useState)(null);
	const surprise = () => {
		const cmd = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
		if (!cmd) return;
		feedback("flip");
		setTeaser(cmd.command);
		window.setTimeout(() => {
			navigate({
				to: "/c/$slug",
				params: { slug: cmd.id }
			});
		}, 320);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
		title: "Bored? Surprise me",
		hint: "Jump to a random command from the library.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm text-primary",
					"aria-live": "polite",
					children: teaser ?? "/????"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
					icon: WandSparkles,
					onClick: surprise,
					children: "Surprise me"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/discover/$section",
					params: { section: "free-time" },
					className: "block text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
					children: "More free-time picks"
				})
			]
		})
	});
}
function PlayPage() {
	const [muted, setMutedState] = (0, import_react.useState)(() => typeof window === "undefined" ? true : isMuted());
	const toggleSound = () => {
		const next = !muted;
		setMuted(next);
		setMutedState(next);
		if (!next) feedback("tap");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "Play",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-bold text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-primary" }), " Play"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Small, satisfying time-passers — coin toss, dice, a decision spinner and a random command button. Everything runs offline."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				onClick: toggleSound,
				children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), muted ? "Sound off" : "Sound on"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinToss, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiceRoll, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionWheel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurpriseMe, {})
			]
		})]
	});
}
//#endregion
export { PlayPage as component };
