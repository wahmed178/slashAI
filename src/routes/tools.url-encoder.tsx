import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/url-encoder")({ component: URLEncoder });

function URLEncoder() {
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = mode === "encode"
    ? (() => { try { return encodeURI(input); } catch { return "Error encoding"; } })()
    : (() => { try { return decodeURI(input); } catch { return "Error decoding"; } })();

  const copy = async () => { try { await navigator.clipboard.writeText(output); } catch {} };

  return (
    <AppShell title="URL Encoder/Decoder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 URL Encoder/Decoder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Encode and decode URLs and query parameters.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setMode("encode")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "encode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "decode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>Decode</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter URL to encode..." : "Enter encoded URL to decode..."}
          className="h-24 w-full rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:outline-none resize-none" />
        <div className="relative">
          <pre className="max-h-32 overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
          <button onClick={copy} className="absolute top-2 right-2 text-[10px] text-primary hover:underline">Copy</button>
        </div>
      </div>
    </AppShell>
  );
}
