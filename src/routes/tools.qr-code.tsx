import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import QRCode from "qrcode";

export const Route = createFileRoute("/tools/qr-code")({ component: QRCodeGenerator });

interface Preset {
  label: string;
  icon: string;
  /** placeholder + initial value; WiFi composes its own payload */
  placeholder?: string;
  initial?: string;
}

const PRESETS: Preset[] = [
  { label: "URL", icon: "🔗", placeholder: "https://example.com", initial: "https://slashai.in" },
  { label: "WiFi", icon: "📶", placeholder: "Network name" },
  { label: "Email", icon: "📧", placeholder: "name@example.com" },
  { label: "Phone", icon: "📞", placeholder: "+91 98765 43210" },
  { label: "SMS", icon: "💬", placeholder: "+91 98765 43210" },
  { label: "Text", icon: "📝", placeholder: "Any text…" },
];

/** builds a scannable payload from the preset + raw input */
function buildPayload(preset: string, raw: string): string {
  const text = raw.trim();
  if (!text) return "";
  switch (preset) {
    case "WiFi": {
      const [ssid, pass = "", enc = "WPA"] = text.split("|").map((p) => p.trim());
      if (!ssid) return "";
      const escape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
      return `WIFI:T:${enc};S:${escape(ssid)};P:${escape(pass)};;`;
    }
    case "Email":
      return `mailto:${text}`;
    case "Phone":
      return `tel:${text.replace(/[^+\d]/g, "")}`;
    case "SMS":
      return `SMSTO:${text.replace(/[^+\d]/g, "")}:`;
    default:
      return text;
  }
}

function QRCodeGenerator() {
  const [text, setText] = useState("https://slashai.app");
  const [preset, setPreset] = useState("URL");
  const [size, setSize] = useState(300);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [err, setErr] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const payload = buildPayload(preset, text);
    if (!payload) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: fg, light: bg },
    })
      .then(() => setErr(false))
      .catch(() => setErr(true));
  }, [preset, text, size, fg, bg]);

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.download = "qr-code.png";
    a.href = url;
    a.click();
  };

  const copyImage = async () => {
    canvasRef.current?.toBlob(async (blob) => {
      if (blob)
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        } catch {
          /* clipboard unavailable */
        }
    });
  };

  return (
    <AppShell title="QR Code Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📱 QR Code Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate QR codes for URLs, WiFi, text, emails. Download as PNG.
        </p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setPreset(p.label);
                setText(p.initial ?? "");
                setErr(false);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                preset === p.label
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PRESETS.find((p) => p.label === preset)?.placeholder ?? "Enter content…"}
          className="h-24 w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm focus:border-primary/50 focus:outline-none"
        />

        {preset === "WiFi" && (
          <p className="text-xs text-muted-foreground">
            Format: <code className="font-mono">NetworkName|Password|WPA</code> — e.g.{" "}
            <code className="font-mono">HomeNet|secret123|WPA</code>. Use{" "}
            <code className="font-mono">nopass</code> for open networks.
          </p>
        )}

        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground">Size</label>
          <input
            type="range"
            min={150}
            max={500}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-xs text-muted-foreground">{size}px</span>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">FG</label>
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="size-8 cursor-pointer rounded border border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">BG</label>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="size-8 cursor-pointer rounded border border-border"
            />
          </div>
        </div>

        <div className="flex min-h-[220px] justify-center rounded-xl border border-border bg-surface p-6">
          {err ? (
            <p className="self-center text-center text-sm text-destructive">
              That content is too long for one QR code. Try something shorter.
            </p>
            ) : (
            <canvas
              ref={canvasRef}
              className="rounded-lg"
              style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={download}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Download PNG
          </button>
          <button
            onClick={copyImage}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Copy
          </button>
        </div>
      </div>
    </AppShell>
  );
}
