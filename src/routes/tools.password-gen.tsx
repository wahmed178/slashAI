import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/password-gen")({ component: PasswordGenerator });

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword("Select at least one option"); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, (v) => chars[v % chars.length]).join(""));
  }, [length, options]);

  const copy = async () => { await navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 1200); };

  const strength = password.length >= 20 ? { label: "Very Strong", color: "text-green" } : password.length >= 14 ? { label: "Strong", color: "text-primary" } : password.length >= 8 ? { label: "Medium", color: "text-yellow" } : { label: "Weak", color: "text-red-400" };

  return (
    <AppShell title="Password Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔐 Password Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate cryptographically secure random passwords.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="min-h-[60px] rounded-lg bg-surface-elevated p-3 flex items-center">
            <p className="flex-1 font-mono text-lg text-foreground break-all">{password || "Click Generate"}</p>
          </div>
          {password && <p className={`mt-2 text-xs font-medium ${strength.color}`}>{strength.label} · {password.length} characters</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><label className="text-xs text-muted-foreground">Length</label><span className="text-xs font-medium text-foreground">{length}</span></div>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["uppercase", "Uppercase (A-Z)"], ["lowercase", "Lowercase (a-z)"],
            ["numbers", "Numbers (0-9)"], ["symbols", "Symbols (!@#$)"],
          ] as [string, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs cursor-pointer">
              <input type="checkbox" checked={(options as any)[key]} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="accent-primary" />
              {label}
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={generate} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">Generate</button>
          <button onClick={copy} disabled={!password} className="rounded-xl border border-border bg-surface px-6 py-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">{copied ? "✓ Copied" : "Copy"}</button>
        </div>
      </div>
    </AppShell>
  );
}
