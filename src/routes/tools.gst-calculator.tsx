import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/gst-calculator")({
  head: () => ({ meta: [{ title: "GST Calculator — SlashAI" }] }),
  component: GstCalculator,
});

function formatINR(n: number) { return "\u20b9" + n.toFixed(2); }

function GstCalculator() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [customRate, setCustomRate] = useState("");

  const effectiveRate = customRate ? Number(customRate) : rate;

  const result = useMemo(() => {
    if (mode === "add") {
      const gst = amount * effectiveRate / 100;
      return { base: amount, gst, total: amount + gst };
    } else {
      const base = amount / (1 + effectiveRate / 100);
      return { base, gst: amount - base, total: amount };
    }
  }, [amount, effectiveRate, mode]);

  return (
    <AppShell title="GST Calculator" back={{ to: "/tools", label: "SlashKit" }}>
      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          {(["add", "remove"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className="min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium capitalize transition-colors"
              style={{ background: mode === m ? "#58a6ff" : "#21262d", borderColor: mode === m ? "transparent" : "#30363d", color: mode === m ? "#0d1117" : "#8b949e" }}>
              {m === "add" ? "Add GST" : "Remove GST"}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div>
            <label className="text-sm text-foreground">{mode === "add" ? "Base amount" : "Amount (incl. GST)"}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground font-mono focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-foreground mb-1 block">GST Rate</label>
            <div className="flex gap-1.5 flex-wrap">
              {[5, 12, 18, 28].map((r) => (
                <button key={r} type="button" onClick={() => { setRate(r); setCustomRate(""); }}
                  className="min-h-[36px] rounded-lg border px-3 text-xs font-medium transition-colors"
                  style={{ background: !customRate && rate === r ? "#58a6ff" : "#21262d", borderColor: !customRate && rate === r ? "transparent" : "#30363d", color: !customRate && rate === r ? "#0d1117" : "#8b949e" }}>
                  {r}%
                </button>
              ))}
              <input type="number" placeholder="Custom %" value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="h-9 w-20 rounded-lg border border-border bg-surface-elevated px-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Base amount</span><span className="font-medium text-foreground">{formatINR(result.base)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST ({effectiveRate}%)</span><span className="font-medium text-green">{formatINR(result.gst)}</span></div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold"><span className="text-foreground">Total</span><span className="text-primary">{formatINR(result.total)}</span></div>
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>CGST ({effectiveRate / 2}%): {formatINR(result.gst / 2)}</span>
            <span>SGST ({effectiveRate / 2}%): {formatINR(result.gst / 2)}</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
