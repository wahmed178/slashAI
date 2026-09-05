import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as E } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.cv-BL_Gv4Hb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	name: "",
	email: "",
	phone: "",
	location: "",
	summary: "",
	experience: [],
	education: [],
	skills: []
};
var LS_KEY = "slashai.cv.data";
function calculateATSScore(data) {
	let score = 0;
	if (data.name) score += 10;
	if (data.email) score += 10;
	if (data.phone) score += 10;
	if (data.location) score += 5;
	if (data.summary) score += 15;
	if (data.experience.length > 0) score += 20;
	if (data.education.length > 0) score += 15;
	if (data.skills.length >= 3) score += 15;
	return Math.min(100, score);
}
function CVBuilder() {
	const [data, setData] = (0, import_react.useState)(() => {
		try {
			const s = localStorage.getItem(LS_KEY);
			return s ? JSON.parse(s) : EMPTY;
		} catch {
			return EMPTY;
		}
	});
	const [skillInput, setSkillInput] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(data));
		} catch {}
	}, [data]);
	const update = (partial) => setData((d) => ({
		...d,
		...partial
	}));
	const score = calculateATSScore(data);
	const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
	const addExp = () => update({ experience: [...data.experience, {
		title: "",
		company: "",
		dates: "",
		description: ""
	}] });
	const updateExp = (i, partial) => {
		const exp = [...data.experience];
		const cur = exp[i];
		if (cur) exp[i] = {
			...cur,
			...partial
		};
		update({ experience: exp });
	};
	const removeExp = (i) => update({ experience: data.experience.filter((_, idx) => idx !== i) });
	const addEdu = () => update({ education: [...data.education, {
		degree: "",
		school: "",
		dates: ""
	}] });
	const updateEdu = (i, partial) => {
		const edu = [...data.education];
		const cur = edu[i];
		if (cur) edu[i] = {
			...cur,
			...partial
		};
		update({ education: edu });
	};
	const removeEdu = (i) => update({ education: data.education.filter((_, idx) => idx !== i) });
	const addSkill = () => {
		if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
			update({ skills: [...data.skills, skillInput.trim()] });
			setSkillInput("");
		}
	};
	const downloadPDF = () => {
		const doc = new E();
		doc.setFont("helvetica", "bold");
		doc.setFontSize(16);
		doc.text(data.name || "Your Name", 20, 20);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.text(`${data.email || ""} ${data.phone ? "· " + data.phone : ""} ${data.location ? "· " + data.location : ""}`, 20, 27);
		let y = 35;
		const section = (title) => {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(11);
			doc.text(title, 20, y);
			y += 5;
			doc.setDrawColor(200);
			doc.line(20, y, 190, y);
			y += 5;
		};
		if (data.summary) {
			section("SUMMARY");
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.splitTextToSize(data.summary, 170).forEach((l) => {
				doc.text(l, 20, y);
				y += 4;
			});
			y += 3;
		}
		if (data.experience.length) {
			section("EXPERIENCE");
			data.experience.forEach((exp) => {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(9);
				doc.text(`${exp.title} — ${exp.company}`, 20, y);
				y += 4;
				doc.setFont("helvetica", "italic");
				doc.text(exp.dates, 20, y);
				y += 4;
				doc.setFont("helvetica", "normal");
				doc.splitTextToSize(exp.description, 170).forEach((l) => {
					doc.text(l, 20, y);
					y += 4;
				});
				y += 2;
			});
		}
		if (data.education.length) {
			section("EDUCATION");
			data.education.forEach((edu) => {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(9);
				doc.text(`${edu.degree} — ${edu.school}`, 20, y);
				y += 4;
				doc.setFont("helvetica", "italic");
				doc.text(edu.dates, 20, y);
				y += 6;
			});
		}
		if (data.skills.length) {
			section("SKILLS");
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.text(data.skills.join(" · "), 20, y);
		}
		doc.save(`${data.name || "resume"}.pdf`);
	};
	const Input = ({ label, value, onChange, placeholder }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-[10px] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		className: "h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Resume Builder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "📄 ATS Resume Builder"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Build an ATS-optimised resume. Saves to browser — never lost."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `text-2xl font-bold ${scoreColor}`,
						children: [score, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground",
						children: "ATS Score"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 max-h-[70vh] overflow-auto pr-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xs font-semibold text-foreground",
								children: "Personal Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Full Name",
										value: data.name,
										onChange: (v) => update({ name: v }),
										placeholder: "John Doe"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Email",
										value: data.email,
										onChange: (v) => update({ email: v }),
										placeholder: "john@email.com"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Phone",
										value: data.phone,
										onChange: (v) => update({ phone: v }),
										placeholder: "+91 98765 43210"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Location",
										value: data.location,
										onChange: (v) => update({ location: v }),
										placeholder: "Hyderabad, India"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-[10px] text-muted-foreground",
									children: "Professional Summary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: data.summary,
									onChange: (e) => update({ summary: e.target.value }),
									rows: 3,
									placeholder: "Brief professional summary...",
									className: "w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-foreground",
								children: "Experience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: addExp,
								className: "text-xs text-primary hover:underline",
								children: "+ Add"
							})]
						}), data.experience.map((exp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 rounded-lg border border-border bg-surface-elevated p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => removeExp(i),
										className: "text-[10px] text-red-400 hover:underline",
										children: "Remove"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Job Title",
										value: exp.title,
										onChange: (v) => updateExp(i, { title: v }),
										placeholder: "Software Engineer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Company",
										value: exp.company,
										onChange: (v) => updateExp(i, { company: v }),
										placeholder: "Company Name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Dates",
									value: exp.dates,
									onChange: (v) => updateExp(i, { dates: v }),
									placeholder: "Jan 2024 — Present"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-[10px] text-muted-foreground",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: exp.description,
										onChange: (e) => updateExp(i, { description: e.target.value }),
										rows: 2,
										className: "w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
									})]
								})
							]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-foreground",
								children: "Education"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: addEdu,
								className: "text-xs text-primary hover:underline",
								children: "+ Add"
							})]
						}), data.education.map((edu, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 rounded-lg border border-border bg-surface-elevated p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => removeEdu(i),
										className: "text-[10px] text-red-400 hover:underline",
										children: "Remove"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "Degree",
										value: edu.degree,
										onChange: (v) => updateEdu(i, { degree: v }),
										placeholder: "B.Tech CSE"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "School",
										value: edu.school,
										onChange: (v) => updateEdu(i, { school: v }),
										placeholder: "University Name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Dates",
									value: edu.dates,
									onChange: (v) => updateEdu(i, { dates: v }),
									placeholder: "2020 — 2024"
								})
							]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xs font-semibold text-foreground",
								children: "Skills"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: skillInput,
									onChange: (e) => setSkillInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addSkill()),
									placeholder: "Type a skill and press Enter",
									className: "h-8 flex-1 rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: addSkill,
									className: "h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1",
								children: data.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-foreground",
									children: [s, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => update({ skills: data.skills.filter((sk) => sk !== s) }),
										className: "text-muted-foreground hover:text-red-400",
										children: "×"
									})]
								}, s))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: downloadPDF,
						className: "h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90",
						children: "Download PDF"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-white p-6 text-black min-h-[400px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: data.name || "Your Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-gray-500",
						children: [
							data.email,
							data.phone,
							data.location
						].filter(Boolean).join(" · ")
					}),
					data.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase",
						children: "Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] text-gray-700",
						children: data.summary
					})] }),
					data.experience.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase",
						children: "Experience"
					}), data.experience.map((exp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-bold",
								children: [
									exp.title,
									" — ",
									exp.company
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] italic text-gray-500",
								children: exp.dates
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-gray-700",
								children: exp.description
							})
						]
					}, i))] }),
					data.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase",
						children: "Education"
					}), data.education.map((edu, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-bold",
							children: [
								edu.degree,
								" — ",
								edu.school
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] italic text-gray-500",
							children: edu.dates
						})]
					}, i))] }),
					data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase",
						children: "Skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] text-gray-700",
						children: data.skills.join(" · ")
					})] })
				]
			})]
		})]
	});
}
//#endregion
export { CVBuilder as component };
