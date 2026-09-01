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
  { name: "Crimson", import: "Crimson+Text:wght@400;700", style: "'Crimson Text', serif" },
  { name: "Pacifico", import: "Pacifico", style: "Pacifico, cursive" },
  { name: "Bebas Neue", import: "Bebas+Neue", style: "'Bebas Neue', sans-serif" },
];

const RATIOS = [
  { id: "1:1", label: "1:1", use: "Insta Post", w: 1080, h: 1080 },
  { id: "4:5", label: "4:5", use: "Insta Portrait", w: 1080, h: 1350 },
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
  { id: "light-gray", label: "LGray", value: "#f1f5f9" },
  { id: "grad-sunset", label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)" },
  { id: "grad-ocean", label: "Ocean", value: "linear-gradient(135deg, #0ea5e9, #6366f1)" },
  { id: "grad-forest", label: "Forest", value: "linear-gradient(135deg, #059669, #0d9488, #0891b2)" },
  { id: "grad-night", label: "Night", value: "linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)" },
  { id: "grad-fire", label: "Fire", value: "linear-gradient(135deg, #dc2626, #f97316, #eab308)" },
  { id: "grad-mint", label: "Mint", value: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)" },
  { id: "grad-candy", label: "Candy", value: "linear-gradient(135deg, #ec4899, #a855f7, #6366f1)" },
  { id: "grad-dark", label: "DkGrad", value: "linear-gradient(135deg, #0f172a, #1e293b, #334155)" },
  { id: "grad-gold", label: "Gold", value: "linear-gradient(135deg, #92400e, #b45309, #d97706)" },
];

const PATTERNS = ["none", "dots", "lines", "grid", "waves", "circles"];

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
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
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

type Tab = "text" | "style" | "bg" | "templates";

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
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [showQuotes, setShowQuotes] = useState(false);
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
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = ratio.w;
    const h = ratio.h;
    canvas.width = w;
    canvas.height = h;

    if (bgImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, w, h);
        renderText(ctx, w, h);
      };
      img.src = bgImage;
    } else if (bg.value.startsWith("linear-gradient")) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      const cols = bg.value.match(/#[a-f0-9]{6}/gi) || ["#000"];
      cols.forEach((c, i) => grad.addColorStop(i / (cols.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      renderPattern(ctx, w, h);
      renderText(ctx, w, h);
    } else {
      ctx.fillStyle = bg.value;
      ctx.fillRect(0, 0, w, h);
      renderPattern(ctx, w, h);
      renderText(ctx, w, h);
    }
  }, [quote, author, fontIdx, fontSize, textColor, bgIdx, bgImage, pattern, alignment, showAuthor, font, bg, ratio]);

  const renderPattern = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
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

  const renderText = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = textColor;
    ctx.textAlign = alignment;
    ctx.textBaseline = "middle";
    const pad = Math.min(w, h) * 0.08;
    const maxW = w - pad * 2;
    const sz = Math.max(16, Math.min(fontSize * (w / 800), 120));
    const lh = sz * 1.4;
    const x = alignment === "center" ? w / 2 : alignment === "right" ? w - pad : pad;

    ctx.font = `700 ${sz}px ${font.style}`;
    const lines = wrapText(ctx, quote, maxW);
    const totalH = lines.length * lh + (showAuthor ? lh : 0);
    const startY = (h - totalH) / 2;

    lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lh + lh / 2));

    if (showAuthor && author) {
      ctx.font = `400 ${sz * 0.45}px ${font.style}`;
      ctx.globalAlpha = 0.7;
      ctx.fillText(`— ${author}`, x, startY + lines.length * lh + 20);
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

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "text", label: "Text", icon: "✏️" },
    { id: "style", label: "Style", icon: "🎨" },
    { id: "bg", label: "Background", icon: "🖼️" },
    { id: "templates", label: "Templates", icon: "⚡" },
  ];

  return (
    <AppShell title="Quote Maker">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">✨ Quote Card Maker</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Design quote cards with custom fonts, backgrounds & aspect ratios</p>
        </div>

        {/* Preview — always on top */}
        <div className="rounded-xl border border-border bg-surface p-2 sm:p-4 flex justify-center mb-3 sm:mb-4">
          <canvas ref={canvasRef} className="rounded-lg w-full"
            style={{ aspectRatio: previewAspect, maxHeight: "45vh" }} />
        </div>

        {/* Aspect Ratio Selector — horizontal scroll */}
        <div className="mb-3 sm:mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Aspect Ratio</label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {RATIOS.map((r, i) => (
              <button key={r.id} onClick={() => setRatioIdx(i)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-center min-w-[72px] transition-colors ${ratioIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                <span className="text-[11px] font-semibold block">{r.label}</span>
                <span className="text-[9px] opacity-60 block mt-0.5">{r.use}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <button onClick={download} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 mb-3 sm:mb-4">
          ⬇ Download PNG ({ratio.w}×{ratio.h})
        </button>

        {/* Mobile Tabs / Desktop: all visible */}
        <div className="flex gap-1 mb-3 sm:hidden overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === t.id ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Controls — tabs on mobile, all on desktop */}
        <div className="space-y-4">
          {/* TEXT TAB */}
          <div className={`${activeTab !== "text" ? "hidden lg:block" : ""}`}>
            <SectionTitle className="lg:hidden">✏️ Text</SectionTitle>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quote</label>
                <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3}
                  className="w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:border-primary/50 resize-none" />
              </div>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                  <input value={author} onChange={(e) => setAuthor(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm" />
                </div>
                <button onClick={() => setShowAuthor(!showAuthor)}
                  className={`h-9 px-3 rounded-lg border text-xs font-medium shrink-0 ${showAuthor ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                  {showAuthor ? "👤 On" : "👤 Off"}
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowQuotes(!showQuotes)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${showQuotes ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>
                  📚 Quotes
                </button>
              </div>

              {showQuotes && (
                <div className="rounded-xl border border-border bg-surface p-3 max-h-44 overflow-auto space-y-1.5">
                  {QUOTES.map((q, i) => (
                    <button key={i} onClick={() => { setQuote(q.text); setAuthor(q.author); setShowQuotes(false); }}
                      className="w-full text-left rounded-lg bg-surface-elevated p-2.5 hover:bg-surface transition-colors">
                      <p className="text-xs text-foreground line-clamp-2">{q.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">— {q.author}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Size & Alignment */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground mb-1 block">Font Size: {fontSize}px</label>
                  <input type="range" min={16} max={80} value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Align</label>
                  <div className="flex gap-1">
                    {(["left", "center", "right"] as const).map((a) => (
                      <button key={a} onClick={() => setAlignment(a)}
                        className={`size-8 rounded-lg text-sm flex items-center justify-center ${alignment === a ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>
                        {a === "left" ? "⫷" : a === "center" ? "☰" : "⫸"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STYLE TAB */}
          <div className={`${activeTab !== "style" ? "hidden lg:block" : ""}`}>
            <SectionTitle className="lg:hidden">🎨 Style</SectionTitle>
            <div className="space-y-3">
              {/* Font */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Font</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
                  {FONTS.map((f, i) => (
                    <button key={f.name} onClick={() => setFontIdx(i)}
                      className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${fontIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                      style={{ fontFamily: f.style }}>{f.name}</button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Text Color</label>
                <div className="flex gap-1.5 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setTextColor(c)}
                      className={`size-7 rounded-full border-2 shrink-0 ${textColor === c ? "border-primary" : "border-transparent"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Pattern */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pattern Overlay</label>
                <div className="flex gap-1.5 flex-wrap">
                  {PATTERNS.map((p) => (
                    <button key={p} onClick={() => setPattern(p)}
                      className={`rounded-lg border px-2.5 py-1 text-[10px] ${pattern === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                      {p === "none" ? "None" : p === "circles" ? "Rings" : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BACKGROUND TAB */}
          <div className={`${activeTab !== "bg" ? "hidden lg:block" : ""}`}>
            <SectionTitle className="lg:hidden">🖼️ Background</SectionTitle>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Color / Gradient</label>
                <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1.5">
                  {BACKGROUNDS.map((b, i) => (
                    <button key={b.id} onClick={() => { setBgIdx(i); setBgImage(null); }}
                      className={`aspect-square rounded-lg border-2 transition-all ${bgIdx === i && !bgImage ? "border-primary scale-110" : "border-border"}`}
                      style={{ background: b.value }} title={b.label} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <label className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  📷 Upload Image
                  <input type="file" accept="image/*" onChange={handleBgImage} className="hidden" />
                </label>
                {bgImage && (
                  <button onClick={() => setBgImage(null)} className="text-xs text-red-400 hover:underline">Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* TEMPLATES TAB */}
          <div className={`${activeTab !== "templates" ? "hidden lg:block" : ""}`}>
            <SectionTitle className="lg:hidden">⚡ Templates</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => applyTemplate(t)}
                  className="rounded-lg border border-border bg-surface p-3 text-left hover:border-primary/40 transition-colors">
                  <p className="text-xs font-medium text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Font {t.font + 1} · {t.size}px</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-semibold text-foreground mb-2 ${className}`}>{children}</div>;
}
