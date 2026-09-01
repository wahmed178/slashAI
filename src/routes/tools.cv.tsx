import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { jsPDF } from "jspdf";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/cv")({
  component: CVBuilder,
});

interface CVData {
  name: string; email: string; phone: string; location: string; summary: string;
  experience: { title: string; company: string; dates: string; description: string }[];
  education: { degree: string; school: string; dates: string }[];
  skills: string[];
}

const EMPTY: CVData = { name: "", email: "", phone: "", location: "", summary: "", experience: [], education: [], skills: [] };
const LS_KEY = "slashai.cv.data";

function calculateATSScore(data: CVData): number {
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
  const [data, setData] = useState<CVData>(() => {
    try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : EMPTY; } catch { return EMPTY; }
  });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {} }, [data]);

  const update = (partial: Partial<CVData>) => setData(d => ({ ...d, ...partial }));
  const score = calculateATSScore(data);
  const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

  const addExp = () => update({ experience: [...data.experience, { title: "", company: "", dates: "", description: "" }] });
  const updateExp = (i: number, partial: Partial<CVData["experience"][0]>) => {
    const exp = [...data.experience]; const cur = exp[i]; if (cur) exp[i] = { ...cur, ...partial }; update({ experience: exp });
  };
  const removeExp = (i: number) => update({ experience: data.experience.filter((_, idx) => idx !== i) });

  const addEdu = () => update({ education: [...data.education, { degree: "", school: "", dates: "" }] });
  const updateEdu = (i: number, partial: Partial<CVData["education"][0]>) => {
    const edu = [...data.education]; const cur = edu[i]; if (cur) edu[i] = { ...cur, ...partial }; update({ education: edu });
  };
  const removeEdu = (i: number) => update({ education: data.education.filter((_, idx) => idx !== i) });

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      update({ skills: [...data.skills, skillInput.trim()] }); setSkillInput("");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text(data.name || "Your Name", 20, 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`${data.email || ""} ${data.phone ? "· " + data.phone : ""} ${data.location ? "· " + data.location : ""}`, 20, 27);
    let y = 35;

    const section = (title: string) => { doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(title, 20, y); y += 5; doc.setDrawColor(200); doc.line(20, y, 190, y); y += 5; };

    if (data.summary) { section("SUMMARY"); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.splitTextToSize(data.summary, 170).forEach((l: string) => { doc.text(l, 20, y); y += 4; }); y += 3; }
    if (data.experience.length) { section("EXPERIENCE"); data.experience.forEach(exp => { doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(`${exp.title} — ${exp.company}`, 20, y); y += 4; doc.setFont("helvetica", "italic"); doc.text(exp.dates, 20, y); y += 4; doc.setFont("helvetica", "normal"); doc.splitTextToSize(exp.description, 170).forEach((l: string) => { doc.text(l, 20, y); y += 4; }); y += 2; }); }
    if (data.education.length) { section("EDUCATION"); data.education.forEach(edu => { doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(`${edu.degree} — ${edu.school}`, 20, y); y += 4; doc.setFont("helvetica", "italic"); doc.text(edu.dates, 20, y); y += 6; }); }
    if (data.skills.length) { section("SKILLS"); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(data.skills.join(" · "), 20, y); }

    doc.save(`${data.name || "resume"}.pdf`);
  };

  const Input = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label className="mb-1 block text-[10px] text-muted-foreground">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none" />
    </div>
  );

  return (
    <AppShell title="Resume Builder">
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">📄 ATS Resume Builder</h1>
            <p className="mt-1 text-sm text-muted-foreground">Build an ATS-optimised resume. Saves to browser — never lost.</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${scoreColor}`}>{score}%</p>
            <p className="text-[10px] text-muted-foreground">ATS Score</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          {/* Personal */}
          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Personal Info</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Full Name" value={data.name} onChange={v => update({ name: v })} placeholder="John Doe" />
              <Input label="Email" value={data.email} onChange={v => update({ email: v })} placeholder="john@email.com" />
              <Input label="Phone" value={data.phone} onChange={v => update({ phone: v })} placeholder="+91 98765 43210" />
              <Input label="Location" value={data.location} onChange={v => update({ location: v })} placeholder="Hyderabad, India" />
            </div>
            <div className="mt-2">
              <label className="mb-1 block text-[10px] text-muted-foreground">Professional Summary</label>
              <textarea value={data.summary} onChange={e => update({ summary: e.target.value })} rows={3} placeholder="Brief professional summary..."
                className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary/60 focus:outline-none" />
            </div>
          </div>

          {/* Experience */}
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">Experience</h3>
              <button type="button" onClick={addExp} className="text-xs text-primary hover:underline">+ Add</button>
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3 rounded-lg border border-border bg-surface-elevated p-2.5">
                <div className="mb-1 flex justify-end">
                  <button type="button" onClick={() => removeExp(i)} className="text-[10px] text-red-400 hover:underline">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Job Title" value={exp.title} onChange={v => updateExp(i, { title: v })} placeholder="Software Engineer" />
                  <Input label="Company" value={exp.company} onChange={v => updateExp(i, { company: v })} placeholder="Company Name" />
                </div>
                <Input label="Dates" value={exp.dates} onChange={v => updateExp(i, { dates: v })} placeholder="Jan 2024 — Present" />
                <div className="mt-1">
                  <label className="mb-1 block text-[10px] text-muted-foreground">Description</label>
                  <textarea value={exp.description} onChange={e => updateExp(i, { description: e.target.value })} rows={2}
                    className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary/60 focus:outline-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">Education</h3>
              <button type="button" onClick={addEdu} className="text-xs text-primary hover:underline">+ Add</button>
            </div>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3 rounded-lg border border-border bg-surface-elevated p-2.5">
                <div className="mb-1 flex justify-end">
                  <button type="button" onClick={() => removeEdu(i)} className="text-[10px] text-red-400 hover:underline">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Degree" value={edu.degree} onChange={v => updateEdu(i, { degree: v })} placeholder="B.Tech CSE" />
                  <Input label="School" value={edu.school} onChange={v => updateEdu(i, { school: v })} placeholder="University Name" />
                </div>
                <Input label="Dates" value={edu.dates} onChange={v => updateEdu(i, { dates: v })} placeholder="2020 — 2024" />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Skills</h3>
            <div className="flex gap-2">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="h-8 flex-1 rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none" />
              <button type="button" onClick={addSkill} className="h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {data.skills.map(s => (
                <span key={s} className="flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-foreground">
                  {s}
                  <button type="button" onClick={() => update({ skills: data.skills.filter(sk => sk !== s) })} className="text-muted-foreground hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          <button type="button" onClick={downloadPDF}
            className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">
            Download PDF
          </button>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border border-border bg-white p-6 text-black min-h-[400px]">
          <h2 className="text-xl font-bold">{data.name || "Your Name"}</h2>
          <p className="text-[10px] text-gray-500">{[data.email, data.phone, data.location].filter(Boolean).join(" · ")}</p>
          {data.summary && <><h3 className="mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase">Summary</h3><p className="mt-1 text-[10px] text-gray-700">{data.summary}</p></>}
          {data.experience.length > 0 && <>
            <h3 className="mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase">Experience</h3>
            {data.experience.map((exp, i) => (
              <div key={i} className="mt-1.5">
                <p className="text-[11px] font-bold">{exp.title} — {exp.company}</p>
                <p className="text-[9px] italic text-gray-500">{exp.dates}</p>
                <p className="text-[10px] text-gray-700">{exp.description}</p>
              </div>
            ))}
          </>}
          {data.education.length > 0 && <>
            <h3 className="mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase">Education</h3>
            {data.education.map((edu, i) => (
              <div key={i} className="mt-1.5">
                <p className="text-[11px] font-bold">{edu.degree} — {edu.school}</p>
                <p className="text-[9px] italic text-gray-500">{edu.dates}</p>
              </div>
            ))}
          </>}
          {data.skills.length > 0 && <>
            <h3 className="mt-3 border-b border-gray-200 pb-0.5 text-[11px] font-bold uppercase">Skills</h3>
            <p className="mt-1 text-[10px] text-gray-700">{data.skills.join(" · ")}</p>
          </>}
        </div>
      </div>
    </AppShell>
  );
}
