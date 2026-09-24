import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import QRCode from "qrcode";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/wifi-qr")({ component: WifiQr });

/**
 * WiFi QR — the dinner-party fix. Type your SSID and password once, guests
 * point their camera at the QR and join without you spelling a 24-character
 * password. Fully offline: the QR is drawn from the standard
 * WIFI:T:WPA;S:<ssid>;P:<pass>;; format that iOS and Android cameras parse.
 * Nothing is transmitted — the string never leaves the page.
 */

type Security = "WPA" | "WEP" | "nopass";

function escapeWifi(s: string): string {
  // WIFI: payload escapes \ ; , : " per the spec
  return s.replace(/([\\;,:"])/g, "\\$1");
}

function WifiQr() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState<Security>("WPA");
  const [hidden, setHidden] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = useMemo(() => {
    if (!ssid.trim()) return "";
    if (security === "nopass") return `WIFI:T:nopass;S:${escapeWifi(ssid)};${hidden ? "H:true;" : ""};`;
    return `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};${hidden ? "H:true;" : ""};`;
  }, [ssid, password, security, hidden]);

  const render = useCallback(async () => {
    if (!payload) {
      setDataUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 640,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#0f172aff", light: "#ffffffff" },
      });
      setDataUrl(url);
    } catch {
      setDataUrl("");
    }
  }, [payload]);

  useEffect(() => {
    void render();
  }, [render]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `wifi-${ssid.trim().replace(/\s+/g, "-").toLowerCase() || "qr"}.png`;
    a.click();
  };

  const print = () => {
    if (!dataUrl) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><head><title>WiFi — ${ssid.replace(/[<>&]/g, "")}</title></head>` +
        `<body style="display:flex;flex-direction:column;align-items:center;font-family:system-ui;padding:48px;">` +
        `<h2 style="margin:0 0 8px;">Join our WiFi</h2>` +
        `<p style="color:#555;margin:0 0 24px;">Point your camera at this code</p>` +
        `<img src="${dataUrl}" style="width:420px;height:420px;" />` +
        `<p style="color:#888;margin-top:24px;font-size:13px;">Made free with slashai.in — offline, nothing stored</p>` +
        `</body></html>`,
    );
    w.document.close();
    w.print();
  };

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <AppShell title="WiFi QR">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📶 WiFi QR</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Guests scan one QR and join your WiFi — no more spelling out passwords. Works with every modern
          iPhone and Android camera. Generated in your browser; the password never leaves this page.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Network name (SSID)</label>
            <input
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="Home_WiFi"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </div>
          {security !== "nopass" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Security</label>
              <select
                value={security}
                onChange={(e) => setSecurity(e.target.value as Security)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (old routers)</option>
                <option value="nopass">Open (no password)</option>
              </select>
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-[var(--primary)]" />
              Hidden network
            </label>
          </div>
        </div>

        {dataUrl ? (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <img src={dataUrl} alt="WiFi QR code" className="mx-auto w-64 rounded-xl shadow-md" />
            <p className="mt-3 break-all font-mono text-[10px] text-muted-foreground">{payload}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={download} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-background active:scale-95">
                Download PNG
              </button>
              <button onClick={print} className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground">
                Print card
              </button>
              <button onClick={copyPayload} className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground">
                {copied ? "Copied ✓" : "Copy code"}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Print it and stick it on the fridge. Guests scan; you sip chai.</p>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
            Type your network name to generate the QR
          </div>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}
