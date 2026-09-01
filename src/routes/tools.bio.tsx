import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/bio")({ component: BioGenerator });

function generate(name: string, role: string, company: string, years: string, skills: string, achievement: string, location: string) {
  const y = years || "several";
  const s = skills || "technology";
  const a = achievement || "delivered impactful projects";
  const c = company || "the industry";
  return {
    twitter: `${role || "Professional"} at ${c} | ${y}+ yrs in ${s} | ${a} | ${location || ""}`.slice(0, 160),
    linkedin: `${name || "I am"} a ${role || "professional"} with ${y} years of experience in ${s}. Currently at ${c}, where I ${a}. Based in ${location || "the world"}, I'm passionate about building products that make a difference. My expertise spans ${s}, and I'm always open to connecting with like-minded professionals.`,
    website: `About ${name || "Me"}\n\n${name || "I am"} is a ${role || "professional"} with ${y}+ years of experience in ${s}. Currently working at ${c}, where ${achievement || "I have delivered impactful projects"}.\n\nBased in ${location || "various locations"}, ${name || "I"} bring a unique perspective to every project, combining technical expertise with creative problem-solving.\n\nWhen not working, ${name || "I"} enjoy exploring new technologies and sharing knowledge with the community.`,
    conference: `${name || "Speaker"} is a ${role || "professional"} at ${c} with ${y} years of experience in ${s}. ${achievement || "They have delivered impactful projects"} and are based in ${location || "the region"}.`,
  };
}

function BioGenerator() {
  const [f, setF] = useState({ name: "", role: "", company: "", years: "", skills: "", achievement: "", location: "" });
  const update = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const bios = generate(f.name, f.role, f.company, f.years, f.skills, f.achievement, f.location);
  const [active, setActive] = useState<keyof typeof bios>("twitter");
  const [copied, setCopied] = useState(false);

  const copy = async () => { try { await navigator.clipboard.writeText(bios[active]); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} };
  const fields: [string, string, string][] = [["name", "Full Name", "Waseem Ahmed"], ["role", "Role", "Software Engineer"], ["company", "Company", "Google"], ["years", "Years Experience", "5"], ["skills", "Top Skills", "React, TypeScript, Node.js"], ["achievement", "Key Achievement", "built products used by millions"], ["location", "Location", "Hyderabad, India"]];

  return (
    <AppShell title="Bio Generator">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">✍️ Professional Bio Generator</h1><p className="mt-1 text-sm text-muted-foreground">Fill in details → get 4 bio variations for different platforms.</p></header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {fields.map(([k, l, p]) => (
            <div key={k}>
              <label className="mb-0.5 block text-[10px] text-muted-foreground">{l}</label>
              <input value={(f as any)[k]} onChange={e => update(k, e.target.value)} placeholder={p}
                className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none" />
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 flex gap-1">
            {(["twitter", "linkedin", "website", "conference"] as const).map(t => (
              <button key={t} onClick={() => setActive(t)} className={`rounded-lg px-2.5 py-1 text-[10px] capitalize transition-colors ${active === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 min-h-[200px]">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">{bios[active]}</pre>
            <button onClick={copy} className="mt-3 h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground hover:opacity-90">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">{active === "twitter" ? `${bios.twitter.length}/160 characters` : ""}</p>
        </div>
      </div>
    </AppShell>
  );
}
