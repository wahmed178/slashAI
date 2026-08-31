import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/tools/namecard")({
  head: () => ({ meta: [{ title: "Digital Business Card — SlashAI" }] }),
  component: NameCard,
});

function NameCard() {
  const [card, setCard] = useState({
    name: "", role: "", company: "", email: "", phone: "", upi: "",
    linkedin: "", github: "", website: "",
  });
  const [copied, setCopied] = useState(false);

  const update = (field: string, val: string) => setCard((p) => ({ ...p, [field]: val }));

  const initials = useMemo(() => {
    if (!card.name) return "?";
    return card.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }, [card.name]);

  const vcard = useMemo(() => {
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${card.name}\nORG:${card.company}\nTITLE:${card.role}\nEMAIL:${card.email}\nTEL:${card.phone}\nURL:${card.website}\nEND:VCARD`;
  }, [card]);

  const downloadVCard = () => {
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${card.name.replace(/\s+/g, "_")}.vcf`;
    a.click();
  };

  const copyCard = () => {
    const lines = [
      card.name, card.role && `${card.role}${card.company ? ` at ${card.company}` : ""}`,
      card.email, card.phone, card.upi && `UPI: ${card.upi}`,
      card.linkedin, card.github, card.website,
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell title="Digital Business Card">
      <div className="mx-auto max-w-2xl space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Digital Business Card</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a shareable card. Download as vCard or copy text.</p>
        </div>

        {/* Input */}
        <div className="grid grid-cols-2 gap-3">
          {([
            ["name", "Full Name"], ["role", "Role / Title"], ["company", "Company"],
            ["email", "Email"], ["phone", "Phone"], ["upi", "UPI ID"],
            ["linkedin", "LinkedIn URL"], ["github", "GitHub URL"], ["website", "Website URL"],
          ] as const).map(([field, label]) => (
            <input key={field} value={card[field]} onChange={(e) => update(field, e.target.value)} placeholder={label}
              className={`h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none ${field === "name" ? "col-span-2" : ""}`} />
          ))}
        </div>

        {/* Preview */}
        <div className="rounded-[10px] border border-border bg-surface p-6">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </div>
            <p className="text-lg font-bold text-foreground">{card.name || "Your Name"}</p>
            {card.role && <p className="text-sm text-primary">{card.role}{card.company ? ` at ${card.company}` : ""}</p>}
            {card.company && !card.role && <p className="text-sm text-muted-foreground">{card.company}</p>}

            <div className="mx-auto mt-4 space-y-1.5 text-sm">
              {card.email && <p className="text-muted-foreground">✉ {card.email}</p>}
              {card.phone && <p className="text-muted-foreground">☎ {card.phone}</p>}
              {card.upi && <p className="text-muted-foreground">💰 {card.upi}</p>}
              {card.linkedin && <p className="text-muted-foreground">🔗 {card.linkedin}</p>}
              {card.github && <p className="text-muted-foreground">⚡ {card.github}</p>}
              {card.website && <p className="text-muted-foreground">🌐 {card.website}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button onClick={downloadVCard} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90">
            <Download className="size-4" /> Download vCard
          </button>
          <button onClick={copyCard} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">
            {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Text"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
