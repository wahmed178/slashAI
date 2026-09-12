import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/jwt-decoder")({ component: JwtDecoder });

interface JwtPart {
  label: string;
  json: string;
  ok: boolean;
}

function decodePart(part: string): { json: string; ok: boolean } {
  try {
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const text = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(text);
    return { json: JSON.stringify(parsed, null, 2), ok: true };
  } catch {
    return { json: "Could not decode - is this a valid JWT segment?", ok: false };
  }
}

function JwtDecoder() {
  const [token, setToken] = useState("");

  const clean = token.trim().replace(/^Bearer\s+/i, "");
  const parts = clean.split(".");
  let decoded: JwtPart[] = [];
  if (parts.length >= 2 && clean) {
    const header = decodePart(parts[0]!);
    const payload = decodePart(parts[1]!);
    decoded = [
      { label: "HEADER", ...header },
      { label: "PAYLOAD", ...payload },
    ];
    // expiry check
    try {
      const b64 = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))));
      if (data.exp) {
        const exp = new Date(data.exp * 1000);
        const expired = exp.getTime() < Date.now();
        decoded.push({
          label: "EXPIRY",
          json: `${exp.toUTCString()}\n\n${expired ? "⛔ This token has EXPIRED." : "✅ Token is still valid."}`,
          ok: true,
        });
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <AppShell title="JWT Decoder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔑 JWT Decoder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Decode JWT header & payload locally - nothing leaves your browser. Never paste production tokens anywhere.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT here (eyJhbGci...)"
          rows={4}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-[13px] text-foreground focus:border-primary focus:outline-none"
        />
        {decoded.map((part) => (
          <div key={part.label} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-surface-elevated px-2 py-0.5 font-mono text-[10px] font-bold text-primary">{part.label}</span>
              {!part.ok && <span className="text-[11px] text-red-400">invalid</span>}
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-foreground">{part.json}</pre>
          </div>
        ))}
        {!clean && (
          <p className="text-center text-[13px] text-muted-foreground">Paste a token above - decoding happens 100% offline.</p>
        )}
      </div>
    </AppShell>
  );
}
