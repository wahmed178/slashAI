import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as Target, U as RotateCcw, bn as Clock, g as Trophy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.typing-test-BB7LGoKj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEXTS = {
	Normal: [
		"The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
		"A journey of a thousand miles begins with a single step. The only way to do great work is to love what you do.",
		"Success is not final and failure is not fatal. It is the courage to continue that counts.",
		"The best time to plant a tree was twenty years ago. The second best time is now.",
		"In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans."
	],
	Code: [
		"const fetchData = async (url: string) => { const res = await fetch(url); return res.json(); }",
		"function binarySearch(arr: number[], target: number): number { let left = 0; let right = arr.length - 1; }",
		"import React, { useState, useEffect } from 'react'; useEffect(() => { document.title = count; }, [count]);",
		"SELECT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100;",
		"for (let i = 0; i < array.length; i++) { if (array[i] === target) { return i; } } return -1;"
	],
	Commands: [
		"/help — show all available commands and their descriptions for quick reference",
		"/search python — find all commands related to Python programming language",
		"/compare gpt-4 claude — compare two AI models side by side on features",
		"/generate blog post outline about artificial intelligence and its impact on society",
		"/export csv — download your saved commands as a CSV file for offline use"
	],
	Urdu: [
		"کامیابی محنت کا نتیجہ ہے۔ جو لوگ محنت کرتے ہیں وہ ہمیشہ کامیاب ہوتے ہیں۔",
		"علم حاصل کرنا ہر مسلمان مرد اور عورت کا فرض ہے۔ قرآن مجید میں علم کی تعلیم کی اہمیت بتائی گئی ہے۔",
		"زندگی میں اہدف کی طرف قدم بڑھائیں۔ ہر دن نئی کوشش کریں اور کبی ہار نہ مانیں۔",
		"اردو زبان دنیا کی سب سے خوبصورت زبانوں میں سے ایک ہے۔ اس کا ادب بہت غنی ہے۔"
	]
};
function TypingTest() {
	const [category, setCategory] = (0, import_react.useState)("Normal");
	const [text, setText] = (0, import_react.useState)("");
	const [input, setInput] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(60);
	const [wpm, setWpm] = (0, import_react.useState)(0);
	const [accuracy, setAccuracy] = (0, import_react.useState)(100);
	const [errors, setErrors] = (0, import_react.useState)(0);
	const [best, setBest] = (0, import_react.useState)(() => {
		try {
			return parseInt(localStorage.getItem("typing_best") || "0");
		} catch {
			return 0;
		}
	});
	const timerRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const startTimeRef = (0, import_react.useRef)(0);
	const newText = (0, import_react.useCallback)(() => {
		const pool = TEXTS[category] ?? TEXTS["Normal"] ?? [];
		setText(pool[Math.floor(Math.random() * pool.length)] ?? "");
		setInput("");
		setStatus("idle");
		setTimeLeft(60);
		setWpm(0);
		setAccuracy(100);
		setErrors(0);
		if (timerRef.current) clearInterval(timerRef.current);
	}, [category]);
	(0, import_react.useEffect)(() => {
		newText();
	}, [newText]);
	(0, import_react.useEffect)(() => {
		if (status !== "active") return;
		timerRef.current = window.setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					clearInterval(timerRef.current);
					setStatus("done");
					return 0;
				}
				return t - 1;
			});
		}, 1e3);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [status]);
	(0, import_react.useEffect)(() => {
		if (status === "done" && wpm > best) {
			setBest(wpm);
			try {
				localStorage.setItem("typing_best", String(wpm));
			} catch {}
		}
	}, [
		status,
		wpm,
		best
	]);
	const handleInput = (val) => {
		if (status === "done") return;
		if (status === "idle") {
			setStatus("active");
			startTimeRef.current = Date.now();
		}
		setInput(val);
		const correctChars = val.split("").filter((c, i) => c === text[i]).length;
		const errCount = val.length - correctChars;
		const elapsed = (Date.now() - startTimeRef.current) / 1e3 / 60;
		const currentWpm = elapsed > 0 ? Math.round(val.length / 5 / elapsed) : 0;
		const acc = val.length > 0 ? Math.round(correctChars / val.length * 100) : 100;
		setErrors(errCount);
		setWpm(currentWpm);
		setAccuracy(acc);
		if (val.length >= text.length) {
			setStatus("done");
			if (timerRef.current) clearInterval(timerRef.current);
		}
	};
	const renderText = () => {
		return text.split("").map((char, i) => {
			let cls = "text-muted-foreground/40";
			if (i < input.length) cls = input[i] === char ? "text-green" : "text-red underline";
			else if (i === input.length && status === "active") cls = "bg-primary/20 text-foreground";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cls,
				children: char
			}, i);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Typing Speed Test",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "Typing Speed Test"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Test your typing speed — 60 seconds."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: newText,
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground transition-all hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " New text"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
							label: "Time",
							value: `${timeLeft}s`,
							color: timeLeft <= 10 ? "text-red" : "text-foreground"
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4" }),
							label: "WPM",
							value: String(wpm),
							color: "text-primary"
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4" }),
							label: "Accuracy",
							value: `${accuracy}%`,
							color: accuracy >= 90 ? "text-green" : "text-yellow"
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }),
							label: "Best",
							value: `${best} WPM`,
							color: "text-yellow"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[10px] border border-border bg-surface p-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-1 text-muted-foreground",
								children: s.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-lg font-bold ${s.color}`,
								children: s.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: s.label
							})
						]
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1.5",
					children: Object.keys(TEXTS).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setCategory(cat);
						},
						className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${category === cat ? "bg-primary/10 text-primary border border-primary/30" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: cat
					}, cat))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[10px] border border-border bg-surface p-5 font-mono text-sm leading-8 tracking-wide",
					children: renderText()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					ref: inputRef,
					value: input,
					onChange: (e) => handleInput(e.target.value),
					disabled: status === "done",
					className: "h-24 w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50",
					placeholder: status === "done" ? "Test complete! Click 'New text' to try again." : "Start typing here...",
					autoFocus: true
				}),
				status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-primary/30 bg-primary/5 p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-bold text-primary",
							children: [wpm, " WPM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								accuracy,
								"% accuracy · ",
								errors,
								" error",
								errors !== 1 ? "s" : ""
							]
						}),
						wpm >= best && wpm > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-yellow",
							children: "🏆 New personal best!"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { TypingTest as component };
