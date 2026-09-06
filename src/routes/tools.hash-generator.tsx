import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/hash-generator")({ component: HashGenerator });

type Algo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
const ALGOS: Algo[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

async function hash(algo: Algo, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function HashGenerator() {
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [digest, setDigest] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!text) { setDigest(""); return; }
    try {
      setDigest(await hash(algo, text));
      setCopied(false);
    } catch {
      setDigest("Hashing unavailable in this browser context");
    }
  };

  const copy = async () => {
    if (!digest) return;
    try { await navigator.clipboard.writeText(digest); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  return (
    <AppShell title="Hash Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔏 Hash Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate SHA hashes of any text using the Web Crypto API. Nothing leaves your device.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to hash..."
          rows={5}
          className="w-full rounded-xl border border-border bg-surface p-3 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {ALGOS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlgo(a)}
              className={`min-h-[34px] rounded-md border border-border px-3 text-[12.5px] font-medium ${algo === a ? "bg-primary text-background" : "text-foreground hover:text-primary"}`}
            >
              {a}
            </button>
          ))}
        </div>
        <button type="button" onClick={run} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
          Generate hash
        </button>
        {digest && (
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="break-all font-mono text-[12.5px] text-primary">{digest}</p>
            <button type="button" onClick={copy} className="mt-2 min-h-[32px] rounded-md border border-border px-3 text-[12.5px] font-medium hover:text-primary">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
