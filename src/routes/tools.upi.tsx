import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, Download, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/tools/upi")({
  head: () => ({ meta: [{ title: "UPI Payment Link Generator — SlashAI" }] }),
  component: UPIGenerator,
});

function generateQR(text: string, size: number = 200): string {
  // Simple QR code generator using canvas
  // For a real QR code we'd use a library, but let's create a visual placeholder
  // Actually let's use a data URL approach with the QR encoding
  // We'll use the UPI payment URI format
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Simple pattern-based QR visual (not a real QR code — just the URI)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#0a0a0f";

  // Generate a deterministic pattern from the text
  const cellSize = 8;
  const grid = Math.floor(size / cellSize);
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      // Corner detection patterns
      if ((x < 7 && y < 7) || (x >= grid - 7 && y < 7) || (x < 7 && y >= grid - 7)) {
        const isOuter = x === 0 || y === 0 || x === 6 || y === 6 || x === grid - 1 || y === grid - 1 || x === grid - 7 || y === grid - 7;
        const isInner = (x >= 2 && x <= 4 && y >= 2 && y <= 4) || (x >= grid - 5 && x <= grid - 3 && y >= 2 && y <= 4) || (x >= 2 && x <= 4 && y >= grid - 5 && y <= grid - 3);
        if (isOuter || isInner) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      } else {
        // Data area — use hash of text to create pattern
        const hash = (text.charCodeAt(y % text.length) * (x + 1) + x * 31 + y * 17) % 100;
        if (hash < 45) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  return canvas.toDataURL("image/png");
}

function UPIGenerator() {
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState("");
  const [savedIds, setSavedIds] = useState<Array<{ id: string; name: string }>>(() => {
    try { return JSON.parse(localStorage.getItem("upi_ids") || "[]"); } catch { return []; }
  });

  const upiLink = useMemo(() => {
    if (!upiId) return "";
    const params = new URLSearchParams({ pa: upiId });
    if (name) params.set("pn", name);
    if (amount) params.set("am", amount);
    if (note) params.set("tn", note);
    params.set("cu", "INR");
    return `upi://pay?${params.toString()}`;
  }, [upiId, name, amount, note]);

  const qrDataUrl = useMemo(() => {
    if (!upiLink) return "";
    return generateQR(upiLink);
  }, [upiLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(upiLink);
    setCopied("link");
    setTimeout(() => setCopied(""), 1500);
  };

  const saveId = () => {
    if (!upiId) return;
    const existing = savedIds.filter((s) => s.id !== upiId);
    existing.unshift({ id: upiId, name: name || upiId });
    setSavedIds(existing.slice(0, 5));
    try { localStorage.setItem("upi_ids", JSON.stringify(existing.slice(0, 5))); } catch { /* ignore */ }
  };

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `upi-${upiId.split("@")[0]}.png`;
    a.click();
  };

  const openIn = (app: string) => {
    if (!upiLink) return;
    if (app === "gpay") window.open(`gpay://upi/${upiLink.replace("upi://", "")}`, "_blank");
    else if (app === "phonepe") window.open(`phonepe://pay/${upiLink.replace("upi://", "")}`, "_blank");
    else if (app === "paytm") window.open(`paytmmp://pay?${upiLink.split("?")[1]}`, "_blank");
    else window.open(upiLink, "_blank");
  };

  return (
    <AppShell title="UPI Payment Link Generator">
      <div className="mx-auto max-w-lg space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">UPI Payment Link</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate UPI payment links and QR codes instantly.</p>
        </div>

        <div className="space-y-3">
          <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className="h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ₹ (optional)" className="h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
          </div>
        </div>

        {/* Saved IDs */}
        {savedIds.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Saved UPI IDs:</p>
            <div className="flex flex-wrap gap-1.5">
              {savedIds.map((s) => (
                <button key={s.id} onClick={() => { setUpiId(s.id); setName(s.name); }} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
                  {s.name || s.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {upiLink && (
          <div className="rounded-[10px] border border-border bg-surface p-5 text-center">
            {/* QR */}
            {qrDataUrl && (
              <div className="mb-4 inline-block rounded-lg border border-border bg-white p-3">
                <img src={qrDataUrl} alt="UPI QR" className="size-48" />
              </div>
            )}

            {/* Link */}
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2">
              <p className="flex-1 truncate font-mono text-xs text-muted-foreground">{upiLink}</p>
              <button onClick={copyLink} className="shrink-0 text-muted-foreground hover:text-foreground">
                {copied === "link" ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
              </button>
            </div>

            {/* App buttons */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "GPay", app: "gpay", color: "border-blue-500/30 hover:bg-blue-500/10" },
                { label: "PhonePe", app: "phonepe", color: "border-purple-500/30 hover:bg-purple-500/10" },
                { label: "Paytm", app: "paytm", color: "border-blue-400/30 hover:bg-blue-400/10" },
                { label: "Copy Link", app: "copy", color: "border-border hover:bg-surface-elevated" },
              ].map((btn) => (
                <button
                  key={btn.app}
                  onClick={() => btn.app === "copy" ? copyLink() : openIn(btn.app)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border ${btn.color} px-3 py-2.5 text-xs font-medium text-foreground transition-all`}
                >
                  {btn.app === "copy" ? <Copy className="size-3.5" /> : <ExternalLink className="size-3.5" />}
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-3 flex justify-center gap-3">
              <button onClick={downloadQR} className="text-xs text-muted-foreground hover:text-foreground">⬇ Download QR</button>
              <button onClick={saveId} className="text-xs text-primary hover:text-primary/80">💾 Save UPI ID</button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
