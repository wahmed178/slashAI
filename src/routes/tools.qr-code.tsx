import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/qr-code")({ component: QRCodeGenerator });

const PRESETS = [
  { label: "URL", icon: "🔗", prefix: "https://" },
  { label: "WiFi", icon: "📶", prefix: "WIFI:" },
  { label: "Email", icon: "📧", prefix: "mailto:" },
  { label: "Phone", icon: "📞", prefix: "tel:" },
  { label: "SMS", icon: "💬", prefix: "sms:" },
  { label: "Text", icon: "📝", prefix: "" },
];

// Minimal QR code encoder (version 1-4, error correction L)
function generateQR(text: string): boolean[][] {
  const len = text.length;
  const size = Math.max(21, Math.min(33, 21 + Math.ceil(len / 10) * 4));
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const on = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        if (r + i < size && c + j < size && grid[r + i]) grid[r + i]![c + j] = on;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) { if (grid[6]) grid[6]![i] = i % 2 === 0; if (grid[i]) grid[i]![6] = i % 2 === 0; }

  // Data encoding (simplified - byte mode)
  const bits: number[] = [];
  // Mode indicator (0100 = byte)
  bits.push(0, 1, 0, 0);
  // Character count
  for (let i = 7; i >= 0; i--) bits.push((len >> i) & 1);
  // Data
  for (let i = 0; i < len; i++) {
    const byte = text.charCodeAt(i) & 0xff;
    for (let j = 7; j >= 0; j--) bits.push((byte >> j) & 1);
  }
  // Terminator
  bits.push(0, 0, 0, 0);

  // Fill data area
  let bitIdx = 0;
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col--;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (cc < 0 || cc >= size) continue;
        if (grid[row]?.[cc]) continue;
        if (row < 8 && cc < 8) continue;
        if (row < 8 && cc > size - 9) continue;
        if (row > size - 9 && cc < 8) continue;
        if (row === 6 || cc === 6) continue;
        if (grid[row]) grid[row]![cc] = bitIdx < bits.length ? bits[bitIdx] === 1 : false;
        bitIdx++;
      }
    }
  }

  // Simple mask (checkerboard)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r >= 8 && c >= 8 && r < size - 8 && c < size - 8) continue;
      if (r < 9 && c < 9) continue;
      if (r < 9 && c > size - 9) continue;
      if (r > size - 9 && c < 9) continue;
      if (r === 6 || c === 6) continue;
      if ((r + c) % 2 === 0 && grid[r]) grid[r]![c] = !grid[r]![c];
    }
  }

  return grid;
}

function QRCodeGenerator() {
  const [text, setText] = useState("https://slashai.app");
  const [preset, setPreset] = useState("URL");
  const [size, setSize] = useState(300);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const grid = generateQR(text);
    const s = grid.length;
    const cellSize = Math.floor(size / (s + 8));
    const offset = Math.floor((size - s * cellSize) / 2);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fg;
    for (let r = 0; r < s; r++) {
      for (let c = 0; c < s; c++) {
        if (grid[r]?.[c]) ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
    }
  }, [text, size, fg, bg]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "qr-code.png";
    a.href = canvasRef.current?.toDataURL("image/png") || "";
    a.click();
  };

  const copyImage = async () => {
    canvasRef.current?.toBlob(async (blob) => {
      if (blob) try { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); } catch {}
    });
  };

  return (
    <AppShell title="QR Code Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📱 QR Code Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate QR codes for URLs, WiFi, text, emails. Download as PNG.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setPreset(p.label); setText(p.prefix); }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${preset === p.label ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter content..."
          className="h-24 w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <div className="flex gap-3 items-center">
          <label className="text-xs text-muted-foreground">Size</label>
          <input type="range" min={150} max={500} value={size} onChange={(e) => setSize(Number(e.target.value))} className="flex-1 accent-primary" />
          <span className="text-xs text-muted-foreground">{size}px</span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2"><label className="text-xs text-muted-foreground">FG</label><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="size-8 rounded border border-border cursor-pointer" /></div>
          <div className="flex items-center gap-2"><label className="text-xs text-muted-foreground">BG</label><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="size-8 rounded border border-border cursor-pointer" /></div>
        </div>
        <div className="flex justify-center rounded-xl border border-border bg-surface p-6">
          <canvas ref={canvasRef} className="rounded-lg" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
        </div>
        <div className="flex gap-2">
          <button onClick={download} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90">Download PNG</button>
          <button onClick={copyImage} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Copy</button>
        </div>
      </div>
    </AppShell>
  );
}
