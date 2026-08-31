import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Lock, Unlock, Copy, Check, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/tools/password")({
  head: () => ({ meta: [{ title: "Password Manager (Local) — SlashAI" }] }),
  component: PasswordManager,
});

type StoredEntry = { id: string; site: string; user: string; pass: string };

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

async function encrypt(data: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(data));
  return btoa(JSON.stringify({ salt: [...salt], iv: [...iv], data: [...new Uint8Array(encrypted)] }));
}

async function decrypt(encoded: string, password: string): Promise<string> {
  const { salt, iv, data } = JSON.parse(atob(encoded));
  const key = await deriveKey(password, new Uint8Array(salt));
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(data));
  return new TextDecoder().decode(decrypted);
}

function generatePassword(len = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

function PasswordManager() {
  const [masterPass, setMasterPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ site: "", user: "", pass: "" });
  const [showPass, setShowPass] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [genPass, setGenPass] = useState("");
  const [genLen, setGenLen] = useState(16);

  const unlock = useCallback(async () => {
    try {
      const stored = localStorage.getItem("pm_vault");
      if (stored) {
        const json = await decrypt(stored, masterPass);
        setEntries(JSON.parse(json));
      }
      setUnlocked(true);
      setError("");
    } catch {
      setError("Wrong master password");
    }
  }, [masterPass]);

  const saveVault = useCallback(async (entries: StoredEntry[]) => {
    if (!masterPass) return;
    const encrypted = await encrypt(JSON.stringify(entries), masterPass);
    localStorage.setItem("pm_vault", encrypted);
  }, [masterPass]);

  const addEntry = async () => {
    if (!newEntry.site || !newEntry.pass) return;
    const entry = { id: crypto.randomUUID(), ...newEntry };
    const next = [...entries, entry];
    setEntries(next);
    await saveVault(next);
    setNewEntry({ site: "", user: "", pass: "" });
  };

  const removeEntry = async (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    await saveVault(next);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const strength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong", "Excellent"];
  const strengthColor = ["text-red", "text-red", "text-yellow", "text-green", "text-green", "text-green"];

  if (!unlocked) {
    return (
      <AppShell title="Password Manager">
        <div className="flex min-h-[60vh] flex-col items-center justify-center pt-4">
          <Lock className="mb-4 size-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Password Manager</h1>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            All data is encrypted locally using Web Crypto API. Nothing leaves your browser.
          </p>
          <input
            type="password"
            value={masterPass}
            onChange={(e) => setMasterPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            placeholder="Enter master password"
            className="mt-6 h-11 w-72 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
          />
          {error && <p className="mt-2 text-xs text-red">{error}</p>}
          <button onClick={unlock} className="mt-3 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90">
            Unlock
          </button>
          <p className="mt-4 text-[10px] text-muted-foreground/60">
            First time? Your master password will encrypt all stored passwords.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Password Manager">
      <div className="mx-auto max-w-2xl space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Password Vault</h1>
            <p className="mt-1 text-sm text-muted-foreground">{entries.length} stored password{entries.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => { setUnlocked(false); setMasterPass(""); }} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            <Unlock className="size-3.5" /> Lock
          </button>
        </div>

        {/* Password generator */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Generate Password</p>
          <div className="flex items-center gap-2">
            <input value={genPass} readOnly className="flex-1 h-9 rounded-lg border border-border bg-surface-elevated px-3 font-mono text-sm text-foreground" />
            <button onClick={() => { const p = generatePassword(genLen); setGenPass(p); }} className="rounded-lg bg-primary px-3 py-2 text-xs text-white hover:bg-primary/90">Generate</button>
            <button onClick={() => copyText(genPass, "gen")} className="text-muted-foreground hover:text-foreground">
              {copied === "gen" ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Length: {genLen}</span>
            <input type="range" min={8} max={64} value={genLen} onChange={(e) => setGenLen(parseInt(e.target.value))} className="flex-1" />
          </div>
        </div>

        {/* Add entry */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Add Entry</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input value={newEntry.site} onChange={(e) => setNewEntry((p) => ({ ...p, site: e.target.value }))} placeholder="Website / Service" className="h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <input value={newEntry.user} onChange={(e) => setNewEntry((p) => ({ ...p, user: e.target.value }))} placeholder="Username / Email" className="h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <div className="flex gap-2">
              <input value={newEntry.pass} onChange={(e) => setNewEntry((p) => ({ ...p, pass: e.target.value }))} placeholder="Password" type="password" className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
              <button onClick={addEntry} disabled={!newEntry.site || !newEntry.pass} className="flex size-9 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40"><Plus className="size-4" /></button>
            </div>
          </div>
          {newEntry.pass && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                <div className={`h-full rounded-full ${strengthColor[strength(newEntry.pass)]}`} style={{ width: `${(strength(newEntry.pass) / 5) * 100}%` }} />
              </div>
              <span className={`text-[10px] ${strengthColor[strength(newEntry.pass)]}`}>{strengthLabel[strength(newEntry.pass)]}</span>
            </div>
          )}
        </div>

        {/* Stored entries */}
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3 transition-all hover:border-[#484f58]">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-bold text-primary">
                {e.site.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{e.site}</p>
                <p className="truncate text-xs text-muted-foreground">{e.user}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setShowPass(showPass === e.id ? null : e.id)} className="text-muted-foreground hover:text-foreground">
                  {showPass === e.id ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
                <button onClick={() => copyText(e.user, `user-${e.id}`)} className="text-muted-foreground hover:text-foreground">
                  {copied === `user-${e.id}` ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />}
                </button>
                <button onClick={() => copyText(e.pass, `pass-${e.id}`)} className="text-muted-foreground hover:text-foreground">
                  {copied === `pass-${e.id}` ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />}
                </button>
                <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-red"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No passwords saved yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
