import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, X as Plus, dn as Copy, nn as Eye, rn as EyeOff, vt as Lock, y as Trash2, yt as LockOpen } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.password-Wq16bFx-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function deriveKey(password, salt) {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
	return crypto.subtle.deriveKey({
		name: "PBKDF2",
		salt,
		iterations: 1e5,
		hash: "SHA-256"
	}, keyMaterial, {
		name: "AES-GCM",
		length: 256
	}, false, ["encrypt", "decrypt"]);
}
async function encrypt(data, password) {
	const salt = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	const iv = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
	const key = await deriveKey(password, salt);
	const enc = new TextEncoder();
	const encrypted = await crypto.subtle.encrypt({
		name: "AES-GCM",
		iv
	}, key, enc.encode(data));
	return btoa(JSON.stringify({
		salt: [...salt],
		iv: [...iv],
		data: [...new Uint8Array(encrypted)]
	}));
}
async function decrypt(encoded, password) {
	const { salt, iv, data } = JSON.parse(atob(encoded));
	const key = await deriveKey(password, new Uint8Array(salt));
	const decrypted = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv: new Uint8Array(iv)
	}, key, new Uint8Array(data));
	return new TextDecoder().decode(decrypted);
}
function generatePassword(len = 16) {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	const arr = crypto.getRandomValues(new Uint8Array(len));
	return Array.from(arr, (b) => chars[b % 70]).join("");
}
function PasswordManager() {
	const [masterPass, setMasterPass] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [newEntry, setNewEntry] = (0, import_react.useState)({
		site: "",
		user: "",
		pass: ""
	});
	const [showPass, setShowPass] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [genPass, setGenPass] = (0, import_react.useState)("");
	const [genLen, setGenLen] = (0, import_react.useState)(16);
	const unlock = (0, import_react.useCallback)(async () => {
		try {
			const stored = localStorage.getItem("pm_vault");
			if (stored) {
				const json = await decrypt(stored, masterPass);
				setEntries(JSON.parse(json));
			}
			setUnlocked(true);
			setError("");
		} catch {
			setError("Wrong master password");
		}
	}, [masterPass]);
	const saveVault = (0, import_react.useCallback)(async (entries) => {
		if (!masterPass) return;
		const encrypted = await encrypt(JSON.stringify(entries), masterPass);
		localStorage.setItem("pm_vault", encrypted);
	}, [masterPass]);
	const addEntry = async () => {
		if (!newEntry.site || !newEntry.pass) return;
		const entry = {
			id: crypto.randomUUID(),
			...newEntry
		};
		const next = [...entries, entry];
		setEntries(next);
		await saveVault(next);
		setNewEntry({
			site: "",
			user: "",
			pass: ""
		});
	};
	const removeEntry = async (id) => {
		const next = entries.filter((e) => e.id !== id);
		setEntries(next);
		await saveVault(next);
	};
	const copyText = (text, label) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 1500);
	};
	const strength = (pass) => {
		let score = 0;
		if (pass.length >= 8) score++;
		if (pass.length >= 12) score++;
		if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
		if (/\d/.test(pass)) score++;
		if (/[^A-Za-z0-9]/.test(pass)) score++;
		return score;
	};
	const strengthLabel = [
		"Very Weak",
		"Weak",
		"Fair",
		"Strong",
		"Very Strong",
		"Excellent"
	];
	const strengthColor = [
		"text-red",
		"text-red",
		"text-yellow",
		"text-green",
		"text-green",
		"text-green"
	];
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Password Manager",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[60vh] flex-col items-center justify-center pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mb-4 size-12 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Password Manager"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-center text-sm text-muted-foreground",
					children: "All data is encrypted locally using Web Crypto API. Nothing leaves your browser."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: masterPass,
					onChange: (e) => setMasterPass(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && unlock(),
					placeholder: "Enter master password",
					className: "mt-6 h-11 w-72 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-red",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: unlock,
					className: "mt-3 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90",
					children: "Unlock"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[10px] text-muted-foreground/60",
					children: "First time? Your master password will encrypt all stored passwords."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Password Manager",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "Password Vault"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							entries.length,
							" stored password",
							entries.length !== 1 ? "s" : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setUnlocked(false);
							setMasterPass("");
						},
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3.5" }), " Lock"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "Generate Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: genPass,
									readOnly: true,
									className: "flex-1 h-9 rounded-lg border border-border bg-surface-elevated px-3 font-mono text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										const p = generatePassword(genLen);
										setGenPass(p);
									},
									className: "rounded-lg bg-primary px-3 py-2 text-xs text-white hover:bg-primary/90",
									children: "Generate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copyText(genPass, "gen"),
									className: "text-muted-foreground hover:text-foreground",
									children: copied === "gen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["Length: ", genLen]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 8,
								max: 64,
								value: genLen,
								onChange: (e) => setGenLen(parseInt(e.target.value)),
								className: "flex-1"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "Add Entry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newEntry.site,
									onChange: (e) => setNewEntry((p) => ({
										...p,
										site: e.target.value
									})),
									placeholder: "Website / Service",
									className: "h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newEntry.user,
									onChange: (e) => setNewEntry((p) => ({
										...p,
										user: e.target.value
									})),
									placeholder: "Username / Email",
									className: "h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: newEntry.pass,
										onChange: (e) => setNewEntry((p) => ({
											...p,
											pass: e.target.value
										})),
										placeholder: "Password",
										type: "password",
										className: "h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: addEntry,
										disabled: !newEntry.site || !newEntry.pass,
										className: "flex size-9 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
									})]
								})
							]
						}),
						newEntry.pass && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full ${strengthColor[strength(newEntry.pass)]}`,
									style: { width: `${strength(newEntry.pass) / 5 * 100}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] ${strengthColor[strength(newEntry.pass)]}`,
								children: strengthLabel[strength(newEntry.pass)]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3 transition-all hover:border-[#484f58]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-bold text-primary",
								children: e.site.charAt(0).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: e.site
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: e.user
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowPass(showPass === e.id ? null : e.id),
										className: "text-muted-foreground hover:text-foreground",
										children: showPass === e.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => copyText(e.user, `user-${e.id}`),
										className: "text-muted-foreground hover:text-foreground",
										children: copied === `user-${e.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => copyText(e.pass, `pass-${e.id}`),
										className: "text-muted-foreground hover:text-foreground",
										children: copied === `pass-${e.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeEntry(e.id),
										className: "text-muted-foreground hover:text-red",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})
								]
							})
						]
					}, e.id)), entries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-center text-sm text-muted-foreground",
						children: "No passwords saved yet."
					})]
				})
			]
		})
	});
}
//#endregion
export { PasswordManager as component };
