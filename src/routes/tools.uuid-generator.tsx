import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/uuid-generator")({ component: UuidGenerator });

function uuid(): string {
  const c: Crypto = typeof crypto !== "undefined" ? crypto : (globalThis as { crypto: Crypto }).crypto;
  if (typeof c.randomUUID === "function") return c.randomUUID();
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, uuid));
  const [copied, setCopied] = useState<string | null>(null);

  const regenerate = (n: number) => {
    setCount(n);
    setUuids(Array.from({ length: n }, uuid));
  };

  const copy = async (u: string) => {
    await navigator.clipboard.writeText(u);
    setCopied(u);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <AppShell title="UUID Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🆔 UUID Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cryptographically random UUID v4 - generated in your browser.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex gap-2">
          {[1, 5, 10, 25].map((n) => (
            <button
              key={n}
              onClick={() => regenerate(n)}
              className={`h-9 flex-1 rounded-lg text-xs font-semibold transition-colors ${
                count === n ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => regenerate(count)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-foreground hover:border-primary"
          >
            ↻ New batch
          </button>
        </div>
        <div className="space-y-2">
          {uuids.map((u, i) => (
            <button
              key={u + i}
              onClick={() => copy(u)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-primary"
            >
              <code className="truncate font-mono text-[13px] text-foreground">{u}</code>
              <span className="shrink-0 text-[11px] font-semibold text-primary">
                {copied === u ? "Copied ✓" : "Copy"}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => copy(uuids.join("\n"))}
          className="h-10 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
        >
          Copy all {uuids.length}
        </button>
      </div>
    </AppShell>
  );
}
