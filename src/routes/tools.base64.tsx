import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/base64")({ component: EncodersPage });

type Tab = "base64" | "url" | "html" | "jwt" | "hash";

function EncodersPage() {
  const [tab, setTab] = useState<Tab>("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const process = (t: Tab, val: string) => {
    try {
      if (t === "base64") setOutput(val ? btoa(unescape(encodeURIComponent(val))) : "");
      else if (t === "url") setOutput(val ? encodeURIComponent(val) : "");
      else if (t === "html") setOutput(val ? val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "");
      else if (t === "jwt") {
        if (!val.includes(".")) { setOutput("Invalid JWT — paste a token with dots"); return; }
        const parts = val.split(".");
        const p0 = parts[0] ?? "";
        const p1 = parts[1] ?? "";
        const header = JSON.parse(atob(p0.replace(/-/g, "+").replace(/_/g, "/")));
        const payload = JSON.parse(atob(p1.replace(/-/g, "+").replace(/_/g, "/")));
        setOutput(`Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nExpiry: ${payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No expiry"}`);
      } else if (t === "hash") {
        if (!val) { setOutput(""); return; }
        const encoder = new TextEncoder();
        const data = encoder.encode(val);
        crypto.subtle.digest("SHA-256", data).then(buf => {
          const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
          setOutput(`SHA-256: ${hex}\n\nLength: ${hex.length} characters`);
        });
        return;
      }
    } catch { setOutput("Error processing input"); }
  };

  const handleInput = (val: string) => { setInput(val); process(tab, val); };
  const handleTab = (t: Tab) => { setTab(t); setOutput(""); setInput(""); };

  const tabs: { id: Tab; label: string }[] = [
    { id: "base64", label: "Base64" }, { id: "url", label: "URL" }, { id: "html", label: "HTML" }, { id: "jwt", label: "JWT" }, { id: "hash", label: "SHA-256" },
  ];

  return (
    <AppShell title="Encoders">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">🔧 Encoders & Decoders</h1><p className="mt-1 text-sm text-muted-foreground">Base64, URL, HTML entities, JWT decode, SHA-256 hash — all in browser.</p></header>
      <div className="mx-auto max-w-2xl">
        <div className="mb-3 flex gap-1">{tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
        ))}</div>
        <textarea value={input} onChange={e => handleInput(e.target.value)} rows={6} placeholder={tab === "jwt" ? "Paste JWT token..." : tab === "hash" ? "Enter text to hash..." : "Enter text..."}
          className="w-full rounded-xl border border-border bg-surface p-3 font-mono text-xs focus:border-primary/60 focus:outline-none" />
        <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">{output || "Output will appear here"}</pre>
      </div>
    </AppShell>
  );
}
