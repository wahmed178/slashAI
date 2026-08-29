import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, Eye, FileText } from "lucide-react";

const TEMPLATES: Record<string, string> = {
  Invoice: `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:40px;color:#333}h1{color:#58a6ff}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>Invoice #001</h1><p>Date: ${new Date().toLocaleDateString()}</p><p>Bill to: [Client Name]</p><table><tr><th>Item</th><th>Qty</th><th>Price</th></tr><tr><td>Service</td><td>1</td><td>₹10,000</td></tr></table><p style="text-align:right;margin-top:20px;font-weight:bold">Total: ₹10,000</p></body></html>`,
  Report: `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:40px;color:#333}h1{border-bottom:2px solid #58a6ff;padding-bottom:10px}h2{color:#58a6ff;margin-top:30px}</style></head><body><h1>Quarterly Report</h1><h2>Summary</h2><p>Add your report content here.</p><h2>Key Metrics</h2><ul><li>Metric 1: 100%</li><li>Metric 2: 50%</li></ul></body></html>`,
  Letter: `<!DOCTYPE html><html><head><style>body{font-family:serif;padding:40px;color:#333;max-width:600px;margin:0 auto}.date{margin-bottom:20px}.body{line-height:1.8}.sign{margin-top:40px}</style></head><body><div class="date">${new Date().toLocaleDateString()}</div><p>Dear [Name],</p><div class="body"><p>I am writing to express my interest in [topic].</p><p>Add your letter content here.</p></div><div class="sign"><p>Sincerely,</p><p>[Your Name]</p></div></body></html>`,
};

export const Route = createFileRoute("/tools/html-to-pdf")({
  head: () => ({ meta: [{ title: "HTML to PDF — SlashAI" }] }),
  component: HtmlToPdf,
});

function HtmlToPdf() {
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.contentWindow?.print();
  };

  return (
    <AppShell title="HTML to PDF" back={{ to: "/tools", label: "SlashKits" }}>
      <div className="mt-4 flex gap-2">
        {Object.keys(TEMPLATES).map((t) => (
          <button key={t} type="button" onClick={() => { setHtml(TEMPLATES[t] ?? ''); setShowPreview(true); }}
            className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
            <FileText className="size-3" /> {t}
          </button>
        ))}
      </div>
      <textarea value={html} onChange={(e) => { setHtml(e.target.value); setShowPreview(false); }}
        placeholder="Paste your HTML here…"
        className="mt-3 min-h-[300px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        style={{ tabSize: 2 }} />
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setShowPreview(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary">
          <Eye className="size-4" /> Preview
        </button>
        <button type="button" onClick={handlePrint}
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="size-4" /> Download as PDF
        </button>
      </div>
      {showPreview && html && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-2">
          <p className="mb-2 text-[11px] text-muted-foreground">Preview — Use browser print dialog to save as PDF</p>
          <iframe ref={iframeRef} srcDoc={html} className="h-[500px] w-full rounded-lg border border-border bg-white" title="Preview" />
        </div>
      )}
    </AppShell>
  );
}
