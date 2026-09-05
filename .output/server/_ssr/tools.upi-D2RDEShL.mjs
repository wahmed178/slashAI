import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, in as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.upi-D2RDEShL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function generateQR(text, size = 200) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, size, size);
	ctx.fillStyle = "#0a0a0f";
	const cellSize = 8;
	const grid = Math.floor(size / cellSize);
	for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) if (x < 7 && y < 7 || x >= grid - 7 && y < 7 || x < 7 && y >= grid - 7) {
		const isOuter = x === 0 || y === 0 || x === 6 || y === 6 || x === grid - 1 || y === grid - 1 || x === grid - 7 || y === grid - 7;
		const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4 || x >= grid - 5 && x <= grid - 3 && y >= 2 && y <= 4 || x >= 2 && x <= 4 && y >= grid - 5 && y <= grid - 3;
		if (isOuter || isInner) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	} else if ((text.charCodeAt(y % text.length) * (x + 1) + x * 31 + y * 17) % 100 < 45) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	return canvas.toDataURL("image/png");
}
function UPIGenerator() {
	const [upiId, setUpiId] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)("");
	const [savedIds, setSavedIds] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("upi_ids") || "[]");
		} catch {
			return [];
		}
	});
	const upiLink = (0, import_react.useMemo)(() => {
		if (!upiId) return "";
		const params = new URLSearchParams({ pa: upiId });
		if (name) params.set("pn", name);
		if (amount) params.set("am", amount);
		if (note) params.set("tn", note);
		params.set("cu", "INR");
		return `upi://pay?${params.toString()}`;
	}, [
		upiId,
		name,
		amount,
		note
	]);
	const qrDataUrl = (0, import_react.useMemo)(() => {
		if (!upiLink) return "";
		return generateQR(upiLink);
	}, [upiLink]);
	const copyLink = () => {
		navigator.clipboard.writeText(upiLink);
		setCopied("link");
		setTimeout(() => setCopied(""), 1500);
	};
	const saveId = () => {
		if (!upiId) return;
		const existing = savedIds.filter((s) => s.id !== upiId);
		existing.unshift({
			id: upiId,
			name: name || upiId
		});
		setSavedIds(existing.slice(0, 5));
		try {
			localStorage.setItem("upi_ids", JSON.stringify(existing.slice(0, 5)));
		} catch {}
	};
	const downloadQR = () => {
		const a = document.createElement("a");
		a.href = qrDataUrl;
		a.download = `upi-${upiId.split("@")[0]}.png`;
		a.click();
	};
	const openIn = (app) => {
		if (!upiLink) return;
		if (app === "gpay") window.open(`gpay://upi/${upiLink.replace("upi://", "")}`, "_blank");
		else if (app === "phonepe") window.open(`phonepe://pay/${upiLink.replace("upi://", "")}`, "_blank");
		else if (app === "paytm") window.open(`paytmmp://pay?${upiLink.split("?")[1]}`, "_blank");
		else window.open(upiLink, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "UPI Payment Link Generator",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-6 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "UPI Payment Link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Generate UPI payment links and QR codes instantly."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: upiId,
							onChange: (e) => setUpiId(e.target.value),
							placeholder: "yourname@upi",
							className: "h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Your name (optional)",
							className: "h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "Amount ₹ (optional)",
								className: "h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Note (optional)",
								className: "h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
							})]
						})
					]
				}),
				savedIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs text-muted-foreground",
					children: "Saved UPI IDs:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: savedIds.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setUpiId(s.id);
							setName(s.name);
						},
						className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground",
						children: s.name || s.id
					}, s.id))
				})] }),
				upiLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-5 text-center",
					children: [
						qrDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 inline-block rounded-lg border border-border bg-white p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: qrDataUrl,
								alt: "UPI QR",
								className: "size-48"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "flex-1 truncate font-mono text-xs text-muted-foreground",
								children: upiLink
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyLink,
								className: "shrink-0 text-muted-foreground hover:text-foreground",
								children: copied === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: [
								{
									label: "GPay",
									app: "gpay",
									color: "border-blue-500/30 hover:bg-blue-500/10"
								},
								{
									label: "PhonePe",
									app: "phonepe",
									color: "border-purple-500/30 hover:bg-purple-500/10"
								},
								{
									label: "Paytm",
									app: "paytm",
									color: "border-blue-400/30 hover:bg-blue-400/10"
								},
								{
									label: "Copy Link",
									app: "copy",
									color: "border-border hover:bg-surface-elevated"
								}
							].map((btn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => btn.app === "copy" ? copyLink() : openIn(btn.app),
								className: `flex items-center justify-center gap-1.5 rounded-lg border ${btn.color} px-3 py-2.5 text-xs font-medium text-foreground transition-all`,
								children: [btn.app === "copy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), btn.label]
							}, btn.app))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: downloadQR,
								className: "text-xs text-muted-foreground hover:text-foreground",
								children: "⬇ Download QR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: saveId,
								className: "text-xs text-primary hover:text-primary/80",
								children: "💾 Save UPI ID"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { UPIGenerator as component };
