import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/quote-maker")({ component: QuoteMaker });

const FONTS = [
  { name: "Inter", import: "Inter:wght@400;700;900", style: "Inter, sans-serif" },
  { name: "Playfair", import: "Playfair+Display:wght@400;700;900", style: "'Playfair Display', serif" },
  { name: "Space Grotesk", import: "Space+Grotesk:wght@400;700", style: "'Space Grotesk', sans-serif" },
  { name: "Montserrat", import: "Montserrat:wght@400;700;900", style: "Montserrat, sans-serif" },
  { name: "Merriweather", import: "Merriweather:wght@400;700;900", style: "Merriweather, serif" },
  { name: "Oswald", import: "Oswald:wght@400;700", style: "Oswald, sans-serif" },
  { name: "Lora", import: "Lora:wght@400;700;900", style: "Lora, serif" },
  { name: "Raleway", import: "Raleway:wght@400;700;900", style: "Raleway, sans-serif" },
  { name: "Poppins", import: "Poppins:wght@400;700;900", style: "Poppins, sans-serif" },
  { name: "Crimson Text", import: "Crimson+Text:wght@400;700", style: "'Crimson Text', serif" },
  { name: "Pacifico", import: "Pacifico", style: "Pacifico, cursive" },
  { name: "Bebas Neue", import: "Bebas+Neue", style: "'Bebas Neue', sans-serif" },
];

const RATIOS = [
  { id: "1:1", label: "1:1", use: "Instagram Post", w: 1080, h: 1080 },
  { id: "4:5", label: "4:5", use: "Instagram Portrait", w: 1080, h: 1350 },
  { id: "9:16", label: "9:16", use: "Story / Reels", w: 1080, h: 1920 },
  { id: "16:9", label: "16:9", use: "YouTube / Twitter", w: 1920, h: 1080 },
  { id: "19:6", label: "19:6", use: "Wide Banner", w: 1900, h: 600 },
  { id: "4:3", label: "4:3", use: "Classic", w: 1600, h: 1200 },
  { id: "3:4", label: "3:4", use: "Pinterest", w: 900, h: 1200 },
  { id: "2:3", label: "2:3", use: "Book Cover", w: 800, h: 1200 },
];

const BACKGROUNDS = [
  { id: "dark", label: "Dark", value: "#0a0a0f" },
  { id: "navy", label: "Navy", value: "#0f172a" },
  { id: "slate", label: "Slate", value: "#1e293b" },
  { id: "emerald", label: "Emerald", value: "#064e3b" },
  { id: "royal", label: "Royal", value: "#1e3a5f" },
  { id: "purple", label: "Purple", value: "#2e1065" },
  { id: "rose", label: "Rose", value: "#4c0519" },
  { id: "amber", label: "Amber", value: "#78350f" },
  { id: "white", label: "White", value: "#ffffff" },
  { id: "cream", label: "Cream", value: "#fef3c7" },
  { id: "light-gray", label: "Light Gray", value: "#f1f5f9" },
  { id: "grad-sunset", label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)" },
  { id: "grad-ocean", label: "Ocean", value: "linear-gradient(135deg, #0ea5e9, #6366f1)" },
  { id: "grad-forest", label: "Forest", value: "linear-gradient(135deg, #059669, #0d9488, #0891b2)" },
  { id: "grad-night", label: "Night", value: "linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)" },
  { id: "grad-fire", label: "Fire", value: "linear-gradient(135deg, #dc2626, #f97316, #eab308)" },
  { id: "grad-mint", label: "Mint", value: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)" },
  { id: "grad-candy", label: "Candy", value: "linear-gradient(135deg, #ec4899, #a855f7, #6366f1)" },
  { id: "grad-dark", label: "Dark Grad", value: "linear-gradient(135deg, #0f172a, #1e293b, #334155)" },
  { id: "grad-gold", label: "Gold", value: "linear-gradient(135deg, #92400e, #b45309, #d97706)" },
];

const PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
  { id: "waves", label: "Waves" },
  { id: "circles", label: "Rings" },
];

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Stewart Brand" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Spread love everywhere you go.", author: "Mother Teresa" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
];

const TEMPLATES = [
  { name: "Minimal Dark", bg: "#0a0a0f", text: "#ffffff", font: 0, align: "center" as const, size: 36 },
  { name: "Bold Gradient", bg: "grad-sunset", text: "#ffffff", font: 3, align: "center" as const, size: 40 },
  { name: "Classic Serif", bg: "#fef3c7", text: "#1c1917", font: 1, align: "center" as const, size: 32 },
  { name: "Modern Navy", bg: "#0f172a", text: "#e2e8f0", font: 2, align: "left" as const, size: 30 },
  { name: "Elegant Purple", bg: "grad-night", text: "#e0e7ff", font: 6, align: "center" as const, size: 36 },
  { name: "Fresh Mint", bg: "grad-mint", text: "#ffffff", font: 4, align: "center" as const, size: 34 },
  { name: "Dark Gold", bg: "grad-gold", text: "#fef3c7", font: 5, align: "center" as const, size: 38 },
  { name: "Clean White", bg: "#ffffff", text: "#1a1a1a", font: 0, align: "center" as const, size: 30 },
];

const COLORS = ["#ffffff", "#f0f6fc", "#e6edf3", "#8b949e", "#0a0a0f", "#1e293b", "#58a6ff", "#2dd4bf", "#3fb950", "#f85149", "#d29922", "#a78bfa", "#f472b6", "#fbbf24"];

function loadFont(name: string, importStr: string) {
  if (document.querySelector(`link[href*="${importStr.split(":")[0]}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${importStr}&display=swap`;
  document.head.appendChild(link);
}

function QuoteMaker() {
  const [quote, setQuote] = useState("The only way to do great work is to love what you do.");
  const [author, setAuthor] = useState("Steve Jobs");
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgIdx, setBgIdx] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [pattern, setPattern] = useState("none");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");
  const [showAuthor, setShowAuthor] = useState(true);
  const [ratioIdx, setRatioIdx] = useState(0);
  const [showQuotes, setShowQuotes] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const font = FONTS[fontIdx]!;
  const bg = BACKGROUNDS[bgIdx]!;
  const ratio = RATIOS[ratioIdx]!;

  useEffect(() => { loadFont(font.name, font.import); }, [font]);

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setTextColor(t.text);
    setFontIdx(t.font);
    setFontSize(t.size);
    setAlignment(t.align);
    const idx = BACKGROUNDS.findIndex((b) => b.id === t.bg);
    if (idx >= 0) setBgIdx(idx);
    setShowTemplates(false);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = ratio.w;
    const h = ratio.h;
    canvas.width = w;
    canvas.height = h;

    // Background
    if (bgImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, w, h);
        drawText(ctx, w, h);
      };
      img.src = bgImage;
    } else if (bg.value.startsWith("linear-gradient")) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      const colors = bg.value.match(/#[a-f0-9]{6}/gi) || ["#000"];
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      drawPattern(ctx, w, h);
      drawText(ctx, w, h);
    } else {
      ctx.fillStyle = bg.value;
      ctx.fillRect(0, 0, w, h);
      drawPattern(ctx, w, h);
      drawText(ctx, w, h);
    }
  }, [quote, author, fontIdx, fontSize, textColor, bgIdx, bgImage, pattern, alignment, showAuthor, font, bg, ratio]);

  const drawPattern = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = `${textColor}15`;
    ctx.lineWidth = 1;
    if (pattern === "dots") {
      for (let x = 20; x < w; x += 30) for (let y = 20; y < h; y += 30) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.stroke(); }
    } else if (pattern === "lines") {
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (pattern === "grid") {
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (pattern === "circles") {
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(w / 2, h / 2, 80 + i * 60, 0, Math.PI * 2); ctx.stroke(); }
    } else if (pattern === "waves") {
      for (let y = 40; y < h; y += 50) { ctx.beginPath(); for (let x = 0; x < w; x += 5) { ctx.lineTo(x, y + Math.sin(x / 30) * 15); } ctx.stroke(); }
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = textColor;
    ctx.textAlign = alignment;
    ctx.textBaseline = "middle";

    const padding = Math.min(w, h) * 0.08;
    const maxW = w - padding * 2;
    const scaledSize = Math.max(16, Math.min(fontSize * (w / 800), 120));
    const lineHeight = scaledSize * 1.4;
    const x = alignment === "center" ? w / 2 : alignment === "right" ? w - padding : padding;

    ctx.font = `700 ${scaledSize}px ${font.style}`;
    const lines = wrapText(ctx, `"${quote}"`, maxW);
    const authorLines = showAuthor && author ? 1 : 0;
    const totalTextH = lines.length * lineHeight + (authorLines ? lineHeight + 10 : 0);
    let startY = (h - totalTextH) / 2;

    lines.forEach((line, i) => { ctx.fillText(line, x, startY + i * lineHeight + lineHeight / 2); });

    if (showAuthor && author) {
      ctx.font = `400 ${scaledSize * 0.45}px ${font.style}`;
      ctx.globalAlpha = 0.7;
      ctx.fillText(`— ${author}`, x, startY + lines.length * lineHeight + 20);
      ctx.globalAlpha = 1;
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  };

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const download = () => {
    const a = document.createElement("a");
    a.download = `quote-${ratio.id.replace(":", "x")}.png`;
    a.href = canvasRef.current?.toDataURL("image/png") || "";
    a.click();
  };

  const handleBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBgImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const previewAspect = ratio.w / ratio.h;

  return (
    <AppShell title="Quote Maker">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">✨ Quote Card Maker</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Design stunning quote cards with custom fonts, backgrounds & aspect ratios.</p>
        </div>

        {/* Main layout: controls + preview side by side on desktop, stacked on mobile */}
        <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
          {/* Controls */}
          <div className="space-y-4 order-2 lg:order-1">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1.5">
                {RATIOS.map((r, i) => (
                  <button key={r.id} onClick={() => setRatioIdx(i)}
                    className={`rounded-lg border px-1.5 py-2 text-center transition-colors ${ratioIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    <span className="text-[11px] font-semibold block">{r.label}</span>
                    <span className="text-[9px] opacity-60 block">{r.use}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quote input */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Quote</label>
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3}
                className="w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:border-primary/50 resize-none" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground mb-1 block">Author</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                <input type="checkbox" checked={showAuthor} onChange={(e) => setShowAuthor(e.target.checked)} className="accent-primary" /> Show
              </label>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <button onClick={() => setShowQuotes(!showQuotes)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${showQuotes ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>📚 Browse Quotes</button>
              <button onClick={() => setShowTemplates(!showTemplates)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${showTemplates ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>🎨 Templates</button>
            </div>

            {showQuotes && (
              <div className="rounded-xl border border-border bg-surface p-3 max-h-48 overflow-auto space-y-1.5">
                {QUOTES.map((q, i) => (
                  <button key={i} onClick={() => { setQuote(q.text); setAuthor(q.author); setShowQuotes(false); }}
                    className="w-full text-left rounded-lg bg-surface-elevated p-2.5 hover:bg-surface transition-colors">
                    <p className="text-xs text-foreground line-clamp-2">{q.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">— {q.author}</p>
                  </button>
                ))}
              </div>
            )}

            {showTemplates && (
              <div className="rounded-xl border border-border bg-surface p-3 grid grid-cols-2 gap-2">
                {TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => applyTemplate(t)} className="rounded-lg border border-border bg-surface-elevated p-2.5 text-left hover:border-primary/40 transition-colors">
                    <p className="text-xs font-medium text-foreground">{t.name}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Font */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Font</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {FONTS.map((f, i) => (
                  <button key={f.name} onClick={() => setFontIdx(i)}
                    className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${fontIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                    style={{ fontFamily: f.style }}>{f.name}</button>
                ))}
              </div>
            </div>

            {/* Size & Alignment */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground mb-1 block">Size: {fontSize}px</label>
                <input type="range" min={16} max={80} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Align</label>
                <div className="flex gap-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button key={a} onClick={() => setAlignment(a)}
                      className={`size-8 rounded-lg text-sm ${alignment === a ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>
                      {a === "left" ? "⫷" : a === "center" ? "☰" : "⫸"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Text Color</label>
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setTextColor(c)}
                    className={`size-7 rounded-full border-2 ${textColor === c ? "border-primary" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Background</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {BACKGROUNDS.map((b, i) => (
                  <button key={b.id} onClick={() => { setBgIdx(i); setBgImage(null); }}
                    className={`shrink-0 size-9 rounded-lg border-2 transition-all ${bgIdx === i && !bgImage ? "border-primary scale-110" : "border-border"}`}
                    style={{ background: b.value }} title={b.label} />
                ))}
              </div>
              <div className="mt-2 flex gap-2 items-center">
                <label className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  📷 Upload Image
                  <input type="file" accept="image/*" onChange={handleBgImage} className="hidden" />
                </label>
                {bgImage && <button onClick={() => setBgImage(null)} className="text-xs text-red-400 hover:underline">Remove</button>}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Pattern Overlay</label>
              <div className="flex gap-1.5 flex-wrap">
                {PATTERNS.map((p) => (
                  <button key={p.id} onClick={() => setPattern(p.id)}
                    className={`rounded-lg border px-2.5 py-1 text-[10px] ${pattern === p.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="space-y-3 order-1 lg:order-2 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-xl border border-border bg-surface p-3 sm:p-4 flex justify-center">
              <canvas ref={canvasRef} className="rounded-lg max-w-full"
                style={{ aspectRatio: `${previewAspect}`, maxHeight: "65vh" }} />
            </div>
            <div className="flex gap-2">
              <button onClick={download} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
                ⬇ Download PNG
              </button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground">
              Output: {ratio.w}×{ratio.h}px ({ratio.label} · {ratio.use})
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
