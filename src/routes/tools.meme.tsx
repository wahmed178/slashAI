import { useState, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/meme")({
  head: () => ({
    meta: [
      { title: "Meme Generator — SlashAI" },
      { name: "description", content: "Create memes in your browser with classic templates — caption, download as PNG, no watermark, nothing uploaded." },
    ],
  }),
  component: MemeGenerator,
});

interface MemeTemplate {
  name: string;
  url: string;
  width: number;
  height: number;
}

const templates: MemeTemplate[] = [
  { name: "Drake Hotline", url: "https://i.imgflip.com/30b1gx.jpg", width: 1200, height: 1200 },
  { name: "Distracted Boyfriend", url: "https://i.imgflip.com/1ur9b0.jpg", width: 1200, height: 800 },
  { name: "Two Buttons", url: "https://i.imgflip.com/1g8my4.jpg", width: 600, height: 908 },
  { name: "Change My Mind", url: "https://i.imgflip.com/24y43o.jpg", width: 482, height: 361 },
  { name: "Expanding Brain", url: "https://i.imgflip.com/1jwhww.jpg", width: 857, height: 1202 },
  { name: "Surprised Pikachu", url: "https://i.imgflip.com/2kbn1e.jpg", width: 1893, height: 1893 },
  { name: "This Is Fine", url: "https://i.imgflip.com/wxica.jpg", width: 580, height: 282 },
  { name: "Woman Yelling Cat", url: "https://i.imgflip.com/345v97.jpg", width: 680, height: 438 },
  { name: "UNO Draw 25", url: "https://i.imgflip.com/3lmzyx.jpg", width: 500, height: 494 },
  { name: "Running Away Balloon", url: "https://i.imgflip.com/261o3j.jpg", width: 761, height: 1024 },
  { name: "Left Exit 12 Off Ramp", url: "https://i.imgflip.com/22bdq6.jpg", width: 804, height: 767 },
  { name: "Roll Safe Think", url: "https://i.imgflip.com/1h7in3.jpg", width: 702, height: 395 },
  { name: "Buff Doge vs Cheems", url: "https://i.imgflip.com/43a45p.png", width: 937, height: 720 },
  { name: "Boardroom Meeting", url: "https://i.imgflip.com/m78d.jpg", width: 500, height: 649 },
  { name: "Bernie Sanders", url: "https://i.imgflip.com/3oevdk.jpg", width: 750, height: 750 },
  { name: "Anakin Padme", url: "https://i.imgflip.com/5c7lwq.png", width: 768, height: 768 },
  { name: "Trade Offer", url: "https://i.imgflip.com/54hjww.jpg", width: 607, height: 794 },
];

const fonts = ["Impact", "Arial Black", "Comic Sans MS", "Courier New"];
const textColors = ["#ffffff", "#000000", "#ffff00", "#00ff00", "#ff0000"];

export default function MemeGenerator() {
  const [selected, setSelected] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(42);
  const [textColor, setTextColor] = useState("#ffffff");
  const [stroke, setStroke] = useState(true);
  const [font, setFont] = useState("Impact");
  const [search, setSearch] = useState("");
  const [customImg, setCustomImg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    const imgSource = customImg || selected?.url;
    if (!canvas || !imgSource) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const fs = Math.round(fontSize * (img.width / 500));

      ctx.font = `bold ${fs}px "${font}"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const strokeW = Math.round(fs / 12);

      // Top text
      if (topText) {
        const x = canvas.width / 2;
        const words = topText.toUpperCase().split(" ");
        let line = "";
        let y = 20;
        for (const word of words) {
          const testLine = line + word + " ";
          if (ctx.measureText(testLine).width > canvas.width - 40) {
            if (stroke) { ctx.strokeStyle = "#000"; ctx.lineWidth = strokeW; ctx.lineJoin = "round"; ctx.strokeText(line.trim(), x, y); }
            ctx.fillStyle = textColor; ctx.fillText(line.trim(), x, y);
            line = word + " "; y += fs + 4;
          } else { line = testLine; }
        }
        if (stroke) { ctx.strokeStyle = "#000"; ctx.lineWidth = strokeW; ctx.lineJoin = "round"; ctx.strokeText(line.trim(), x, y); }
        ctx.fillStyle = textColor; ctx.fillText(line.trim(), x, y);
      }

      // Bottom text
      if (bottomText) {
        const x = canvas.width / 2;
        const words = bottomText.toUpperCase().split(" ");
        let lines: string[] = [];
        let line = "";
        for (const word of words) {
          const testLine = line + word + " ";
          if (ctx.measureText(testLine).width > canvas.width - 40) { lines.push(line.trim()); line = word + " "; }
          else { line = testLine; }
        }
        lines.push(line.trim());

        let y = canvas.height - 20 - lines.length * (fs + 4);
        for (const l of lines) {
          if (stroke) { ctx.strokeStyle = "#000"; ctx.lineWidth = strokeW; ctx.lineJoin = "round"; ctx.strokeText(l, x, y); }
          ctx.fillStyle = textColor; ctx.fillText(l, x, y);
          y += fs + 4;
        }
      }
    };
    img.src = imgSource;
  }, [selected, topText, bottomText, fontSize, textColor, stroke, font, customImg]);

  // Auto-draw when props change
  useState(() => { drawMeme(); });

  const download = () => {
    if (!canvasRef.current) return;
    drawMeme();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvasRef.current!.toDataURL("image/png");
      link.click();
    }, 100);
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    drawMeme();
    setTimeout(async () => {
      try {
        const blob = await new Promise<Blob>((resolve) => canvasRef.current!.toBlob((b) => resolve(b!), "image/png"));
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        alert("Copied!");
      } catch { /* ignore */ }
    }, 100);
  };

  const onCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomImg(reader.result as string);
      setSelected(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">😂 Meme Generator</h1>
          <p className="text-sm text-muted-foreground">Create memes instantly — no watermark, completely free</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Template picker */}
          <div className="space-y-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground" />

            <button onClick={() => fileRef.current?.click()} className="w-full rounded-xl border-2 border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground hover:border-primary/50">
              📷 Upload custom image
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onCustomUpload} />

            <div className="max-h-[50vh] space-y-2 overflow-y-auto">
              {filtered.map((t, i) => (
                <button key={i} onClick={() => { setSelected(t); setCustomImg(null); }} className={`flex w-full items-center gap-3 rounded-xl border p-2 transition-colors ${selected?.url === t.url ? "border-primary bg-primary/5" : "border-border bg-surface hover:bg-background"}`}>
                  <img src={t.url} alt={t.name} className="h-14 w-14 rounded-lg object-cover" crossOrigin="anonymous" />
                  <span className="text-xs text-foreground">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor + Preview */}
          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex justify-center">
                {selected || customImg ? (
                  <canvas ref={canvasRef} className="max-h-[50vh] w-full rounded-lg" />
                ) : (
                  <div className="flex h-64 items-center justify-center text-muted-foreground">Select a template or upload an image</div>
                )}
              </div>
            </div>

            {/* Controls */}
            {(selected || customImg) && (
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Top Text</label>
                    <input value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top text..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Bottom Text</label>
                    <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Bottom text..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground">Size</label>
                  <input type="range" min={20} max={80} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{fontSize}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {textColors.map((c) => (
                    <button key={c} onClick={() => setTextColor(c)} className="h-7 w-7 rounded-full border-2" style={{ backgroundColor: c, borderColor: textColor === c ? "#58a6ff" : "transparent" }} />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <select value={font} onChange={(e) => setFont(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground">
                    {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" checked={stroke} onChange={(e) => setStroke(e.target.checked)} />
                    Text outline
                  </label>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { drawMeme(); setTimeout(download, 100); }} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">⬇ Download PNG</button>
                  <button onClick={() => { drawMeme(); setTimeout(copyToClipboard, 100); }} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background">📋 Copy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
