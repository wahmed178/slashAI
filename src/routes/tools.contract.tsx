import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { jsPDF } from "jspdf";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/contract")({
  component: ContractGenerator,
});

type ContractType = "freelance" | "nda" | "partnership" | "service" | "employment";
type Jurisdiction = "india" | "pakistan" | "uae" | "uk" | "us";

const CONTRACT_TYPES: { id: ContractType; label: string }[] = [
  { id: "freelance", label: "Freelance Agreement" },
  { id: "nda", label: "Non-Disclosure Agreement" },
  { id: "partnership", label: "Partnership Agreement" },
  { id: "service", label: "Service Agreement" },
  { id: "employment", label: "Employment Agreement" },
];

const JURISDICTIONS: { id: Jurisdiction; label: string }[] = [
  { id: "india", label: "India" },
  { id: "pakistan", label: "Pakistan" },
  { id: "uae", label: "UAE" },
  { id: "uk", label: "United Kingdom" },
  { id: "us", label: "United States" },
];

interface ContractData {
  partyAName?: string;
  partyBName?: string;
  partyAAddress?: string;
  partyBAddress?: string;
  scope?: string;
  amount?: string;
  paymentTerms?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  partnershipName?: string;
  capitalA?: string;
  capitalB?: string;
  profitSharing?: string;
}

function generateContract(type: ContractType, data: ContractData, jurisdiction: Jurisdiction): string {
  const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const j = jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1);
  const pA = data.partyAName || "Party A";
  const pB = data.partyBName || "Party B";

  const base: string[] = [];
  base.push(`${CONTRACT_TYPES.find(c => c.id === type)?.label || "Agreement"}`);
  base.push(`\nDate: ${date}`);
  base.push(`\nThis agreement is entered into between:\n`);
  base.push(`Party A: ${pA}`);
  if (data.partyAAddress) base.push(`Address: ${data.partyAAddress}`);
  base.push(`\nParty B: ${pB}`);
  if (data.partyBAddress) base.push(`Address: ${data.partyBAddress}`);
  base.push(`\n---\n`);

  if (type === "freelance") {
    base.push(`1. SCOPE OF WORK\n${data.scope || "To be defined."}\n`);
    base.push(`2. PAYMENT TERMS\nAmount: ${data.amount || "TBD"}\nPayment Schedule: ${data.paymentTerms || "Upon completion"}\n`);
    base.push(`3. DURATION\nStart: ${data.startDate || "Upon signing"}\nEnd: ${data.endDate || "Upon completion of scope"}\n`);
    base.push(`4. INTELLECTUAL PROPERTY\nAll work product created under this agreement shall be owned by ${pA} upon full payment.\n`);
    base.push(`5. CONFIDENTIALITY\nBoth parties agree to maintain confidentiality of all proprietary information shared during the engagement.\n`);
    base.push(`6. TERMINATION\nEither party may terminate with 14 days written notice. Outstanding payments become due immediately upon termination.\n`);
    base.push(`7. GOVERNING LAW\nThis agreement shall be governed by the laws of ${j}.\n`);
    base.push(`8. ENTIRE AGREEMENT\nThis document constitutes the entire agreement between the parties.\n`);
  } else if (type === "nda") {
    base.push(`1. PURPOSE\nThe parties wish to explore a potential business relationship and may disclose confidential information.\n`);
    base.push(`2. DEFINITION OF CONFIDENTIAL INFORMATION\nAll non-public information disclosed by either party, including but not limited to business plans, financial data, technical data, customer lists, and trade secrets.\n`);
    base.push(`3. OBLIGATIONS\nThe receiving party shall: (a) hold all confidential information in strict confidence; (b) not disclose to any third party without prior written consent; (c) use the information solely for the stated purpose.\n`);
    base.push(`4. EXCLUSIONS\nInformation that: (a) is publicly available; (b) was known prior to disclosure; (c) is independently developed; (d) is required by law to be disclosed.\n`);
    base.push(`5. DURATION\nThis agreement remains in effect for ${data.duration || "2"} years from the date of signing.\n`);
    base.push(`6. RETURN OF MATERIALS\nUpon termination, all confidential materials shall be returned or destroyed.\n`);
    base.push(`7. REMEDIES\nBreach of this agreement may result in injunctive relief and monetary damages.\n`);
    base.push(`8. GOVERNING LAW\nThis agreement shall be governed by the laws of ${j}.\n`);
  } else if (type === "partnership") {
    base.push(`1. PARTNERSHIP NAME\n${data.partnershipName || "To be determined"}\n`);
    base.push(`2. PURPOSE\n${data.scope || "To engage in business activities as agreed upon by the partners."}\n`);
    base.push(`3. CAPITAL CONTRIBUTION\nPartner A (${pA}): ${data.capitalA || "TBD"}\nPartner B (${pB}): ${data.capitalB || "TBD"}\n`);
    base.push(`4. PROFIT & LOSS SHARING\n${data.profitSharing || "Equal (50/50)"}\n`);
    base.push(`5. DURATION\nStart: ${data.startDate || "Upon signing"}\nDuration: ${data.duration || "Indefinite, subject to agreement"}\n`);
    base.push(`6. MANAGEMENT\nBoth partners shall have equal say in major business decisions.\n`);
    base.push(`7. WITHDRAWAL\nA partner may withdraw with 30 days written notice. Remaining partner has right of first refusal.\n`);
    base.push(`8. GOVERNING LAW\nThis agreement shall be governed by the laws of ${j}.\n`);
  } else if (type === "service") {
    base.push(`1. SERVICES\n${data.scope || "Services to be defined."}\n`);
    base.push(`2. SERVICE PERIOD\nStart: ${data.startDate || "Upon signing"}\nEnd: ${data.endDate || "Upon completion"}\n`);
    base.push(`3. COMPENSATION\nAmount: ${data.amount || "TBD"}\nPayment Terms: ${data.paymentTerms || "Net 30 days"}\n`);
    base.push(`4. SERVICE LEVELS\nThe service provider shall perform all services in a professional and workmanlike manner.\n`);
    base.push(`5. INDEPENDENT CONTRACTOR\nThe service provider is an independent contractor, not an employee of ${pA}.\n`);
    base.push(`6. LIMITATION OF LIABILITY\nTotal liability shall not exceed the total fees paid under this agreement.\n`);
    base.push(`7. TERMINATION\nEither party may terminate with 30 days written notice.\n`);
    base.push(`8. GOVERNING LAW\nThis agreement shall be governed by the laws of ${j}.\n`);
  } else if (type === "employment") {
    base.push(`1. POSITION\n${data.scope || "To be defined"}\n`);
    base.push(`2. COMPENSATION\nSalary: ${data.amount || "TBD"}\nPayment: ${data.paymentTerms || "Monthly"}\n`);
    base.push(`3. START DATE\n${data.startDate || "Upon signing"}\n`);
    base.push(`4. WORKING HOURS\nStandard business hours as per company policy.\n`);
    base.push(`5. BENEFITS\nAs per company policy and applicable law.\n`);
    base.push(`6. CONFIDENTIALITY\nEmployee agrees to maintain confidentiality of all proprietary information.\n`);
    base.push(`7. TERMINATION\nEither party may terminate with ${data.duration || "30"} days written notice or immediate for cause.\n`);
    base.push(`8. GOVERNING LAW\nThis agreement shall be governed by the laws of ${j}.\n`);
  }

  base.push(`\n---\n\nSIGNED:\n\n_________________________          _________________________\n${pA}                              ${pB}\n\nDate: _________________          Date: _________________\n`);

  return base.join("\n");
}

function ContractGenerator() {
  const [contractType, setContractType] = useState<ContractType>("freelance");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [fields, setFields] = useState<ContractData>({});
  const [generated, setGenerated] = useState("");

  const update = (key: keyof ContractData, val: string) => setFields(f => ({ ...f, [key]: val }));

  const handleGenerate = () => {
    const text = generateContract(contractType, fields, jurisdiction);
    setGenerated(text);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(generated, 170);
    let y = 20;
    for (const line of lines) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += 5;
    }
    doc.save(`${contractType}-contract.pdf`);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generated); } catch {}
  };

  return (
    <AppShell title="Contract Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📄 Contract Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate professional legal contracts. Free forever — no lawyers needed.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Contract Type</label>
            <div className="flex flex-wrap gap-2">
              {CONTRACT_TYPES.map(ct => (
                <button key={ct.id} type="button" onClick={() => setContractType(ct.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${contractType === ct.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Jurisdiction</label>
            <div className="flex flex-wrap gap-2">
              {JURISDICTIONS.map(j => (
                <button key={j.id} type="button" onClick={() => setJurisdiction(j.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${jurisdiction === j.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Party A Name *</label>
              <input value={fields.partyAName || ""} onChange={e => update("partyAName", e.target.value)} placeholder="e.g. Waseem Ahmed"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Party B Name *</label>
              <input value={fields.partyBName || ""} onChange={e => update("partyBName", e.target.value)} placeholder="e.g. ABC Corp"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Party A Address</label>
              <input value={fields.partyAAddress || ""} onChange={e => update("partyAAddress", e.target.value)} placeholder="Address"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Party B Address</label>
              <input value={fields.partyBAddress || ""} onChange={e => update("partyBAddress", e.target.value)} placeholder="Address"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Scope of Work / Description *</label>
            <textarea value={fields.scope || ""} onChange={e => update("scope", e.target.value)} rows={3} placeholder="Describe the work, services, or purpose..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Amount / Compensation</label>
              <input value={fields.amount || ""} onChange={e => update("amount", e.target.value)} placeholder="e.g. ₹50,000"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Payment Terms</label>
              <input value={fields.paymentTerms || ""} onChange={e => update("paymentTerms", e.target.value)} placeholder="e.g. Net 30 days"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Start Date</label>
              <input value={fields.startDate || ""} onChange={e => update("startDate", e.target.value)} placeholder="Upon signing"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Duration</label>
              <input value={fields.duration || ""} onChange={e => update("duration", e.target.value)} placeholder="e.g. 12 months"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
            </div>
          </div>

          <button type="button" onClick={handleGenerate}
            className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90">
            Generate Contract
          </button>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-border bg-surface p-4">
          {generated ? (
            <>
              <div className="mb-3 flex gap-2">
                <button type="button" onClick={handleDownloadPDF}
                  className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90">
                  Download PDF
                </button>
                <button type="button" onClick={handleCopy}
                  className="h-8 rounded-lg border border-border px-3 text-xs text-foreground hover:bg-accent">
                  Copy Text
                </button>
              </div>
              <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-4 text-xs leading-relaxed text-foreground">
                {generated}
              </pre>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg">📄</p>
              <p className="mt-2 text-sm text-muted-foreground">Fill in the form and click Generate</p>
              <p className="text-xs text-muted-foreground">Your contract will appear here</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
