import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, q as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.lorem-CYXNwRK3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAMES_M = [
	"Aarav",
	"Vivaan",
	"Aditya",
	"Arjun",
	"Siddharth",
	"Rohan",
	"Krishna",
	"Diya",
	"Rahul",
	"Vikram",
	"Sanjay",
	"Amit",
	"Rajesh",
	"Nitin",
	"Deepak"
];
var NAMES_F = [
	"Priya",
	"Ananya",
	"Sneha",
	"Kavya",
	"Meera",
	"Nisha",
	"Pooja",
	"Riya",
	"Sonia",
	"Neha",
	"Anjali",
	"Divya",
	"Deepa",
	"Shreya",
	"Tanvi"
];
var CITIES = [
	"Mumbai",
	"Delhi",
	"Bangalore",
	"Hyderabad",
	"Chennai",
	"Pune",
	"Kolkata",
	"Jaipur",
	"Ahmedabad",
	"Lucknow"
];
var STATES = [
	"Maharashtra",
	"Delhi",
	"Karnataka",
	"Telangana",
	"Tamil Nadu",
	"Rajasthan",
	"Gujarat",
	"West Bengal",
	"Uttar Pradesh",
	"Madhya Pradesh"
];
var COMPANIES = [
	"TechVista",
	"InnoSoft",
	"CloudNine",
	"DataFlow",
	"ByteCraft",
	"CodeHive",
	"NetPulse",
	"SoftEdge",
	"PixelForge",
	"AquaTech"
];
var PRODUCTS = [
	"Premium Widget",
	"Smart Sensor Kit",
	"Wireless Charger Pro",
	"Ergonomic Mouse",
	"USB-C Hub",
	"Noise-Canceling Earbuds",
	"Mechanical Keyboard",
	"Portable Monitor",
	"LED Desk Lamp",
	"Laptop Stand"
];
var DESCRIPTIONS = [
	"High-performance device designed for modern professionals.",
	"Sleek design meets powerful functionality in this premium product.",
	"Built for reliability — tested under extreme conditions.",
	"Easy to set up and use right out of the box.",
	"Compatible with all major operating systems and devices."
];
var rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
var randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function ContentGenerator() {
	const [type, setType] = (0, import_react.useState)("name");
	const [count, setCount] = (0, import_react.useState)(5);
	const [results, setResults] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const generate = (0, import_react.useCallback)(() => {
		const gen = [];
		for (let i = 0; i < count; i++) switch (type) {
			case "name":
				gen.push(rand([...NAMES_M, ...NAMES_F]));
				break;
			case "male":
				gen.push(rand(NAMES_M));
				break;
			case "female":
				gen.push(rand(NAMES_F));
				break;
			case "address":
				gen.push(`${randInt(1, 999)}, ${rand(CITIES)}, ${rand(STATES)} - ${randInt(1e5, 999999)}`);
				break;
			case "company":
				gen.push(`${rand(COMPANIES)} ${rand([
					"Solutions",
					"Technologies",
					"Labs",
					"Systems",
					"Corp",
					"Inc"
				])}`);
				break;
			case "product":
				gen.push(rand(PRODUCTS));
				break;
			case "description":
				gen.push(rand(DESCRIPTIONS));
				break;
			case "date": {
				const d = /* @__PURE__ */ new Date(Date.now() - randInt(0, 365) * 864e5);
				gen.push(d.toLocaleDateString("en-IN", {
					day: "numeric",
					month: "short",
					year: "numeric"
				}));
				break;
			}
			case "price":
				gen.push(`₹${randInt(99, 99999).toLocaleString("en-IN")}`);
				break;
			case "phone":
				gen.push(`+91 ${randInt(6e3, 9999)} ${randInt(1e3, 9999)} ${randInt(1e3, 9999)}`);
				break;
			case "upi":
				gen.push(`${rand(NAMES_M).toLowerCase()}${randInt(1, 999)}@${rand([
					"paytm",
					"ybl",
					"okicici",
					"axl",
					"gpay"
				])}`);
				break;
			case "email":
				gen.push(`${rand(NAMES_M).toLowerCase()}${randInt(1, 99)}@${rand([
					"gmail.com",
					"outlook.com",
					"yahoo.com"
				])}`);
				break;
			case "ip": gen.push(`${randInt(10, 192)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`);
		}
		setResults(gen);
	}, [type, count]);
	const copyAll = () => {
		navigator.clipboard.writeText(results.join("\n"));
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Content Generator",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Content Generator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Generate realistic test data — names, addresses, prices, and more."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1.5 sm:grid-cols-4",
					children: [
						{
							id: "name",
							label: "Random Name",
							icon: "👤"
						},
						{
							id: "male",
							label: "Male Name",
							icon: "👨"
						},
						{
							id: "female",
							label: "Female Name",
							icon: "👩"
						},
						{
							id: "address",
							label: "Indian Address",
							icon: "📍"
						},
						{
							id: "company",
							label: "Company Name",
							icon: "🏢"
						},
						{
							id: "product",
							label: "Product Name",
							icon: "📦"
						},
						{
							id: "description",
							label: "Product Description",
							icon: "📝"
						},
						{
							id: "date",
							label: "Random Date",
							icon: "📅"
						},
						{
							id: "price",
							label: "Price (₹)",
							icon: "💰"
						},
						{
							id: "phone",
							label: "Phone Number",
							icon: "📱"
						},
						{
							id: "upi",
							label: "UPI ID",
							icon: "💳"
						},
						{
							id: "email",
							label: "Email Address",
							icon: "✉️"
						},
						{
							id: "ip",
							label: "IP Address",
							icon: "🌐"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setType(t.id),
						className: `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all ${type === t.id ? "bg-primary/10 text-primary border border-primary/30" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.icon }),
							" ",
							t.label
						]
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Count:"
							}), [
								5,
								10,
								20,
								50
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCount(n),
								className: `rounded px-2 py-1 text-xs ${count === n ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
								children: n
							}, n))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: generate,
							className: "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs text-white hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Generate"]
						}),
						results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: copyAll,
							className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied!" : "Copy all"]
						})
					]
				}),
				results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-lg bg-surface-elevated px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 text-right text-[10px] text-muted-foreground",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: r
							})]
						}, i))
					})
				})
			]
		})
	});
}
//#endregion
export { ContentGenerator as component };
