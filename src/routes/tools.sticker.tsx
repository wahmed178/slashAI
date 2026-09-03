import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/sticker")({ component: WhatsAppStickerMaker });

function WhatsAppStickerMaker() {
  const [image, setImage] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("");
  const [textPos, setTextPos] = useState<"top" | "center" | "bottom">("bottom");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(36);
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [borderWidth, setBorderWidth] = useState(4);
  const [bgRemove, setBgRemove] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => setImgEl(img);
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 512;
    canvas.height = 512;

    ctx.clearRect(0, 0, 512, 512);

    // Checkerboard for transparency
    if (bgRemove) {
      for (let y = 0; y < 512; y += 16) {
        for (let x = 0; x < 512; x += 16) {
          ctx.fillStyle = (x / 16 + y / 16) % 2 === 0 ? "#ccc" : "#fff";
          ctx.fillRect(x, y, 16, 16);
        }
      }
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
    }

    // Draw image centered and cropped to square
    const size = Math.min(imgEl.width, imgEl.height);
    const sx = (imgEl.width - size) / 2;
    const sy = (imgEl.height - size) / 2;

    if (bgRemove) {
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.drawImage(imgEl, sx, sy, size, size, 0, 0, 512, 512);
    ctx.globalCompositeOperation = "source-over";

    // Border
    if (border) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, 512 - borderWidth, 512 - borderWidth);
    }

    // Text overlay
    if (text.trim()) {
      ctx.font = `bold ${textSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const ty = textPos === "top" ? 48 : textPos === "center" ? 256 : 512 - 48;

      // Outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.strokeText(text, 256, ty);

      // Fill
      ctx.fillStyle = textColor;
      ctx.fillText(text, 256, ty);
    }
  }, [imgEl, text, textPos, textColor, textSize, border, borderColor, borderWidth, bgRemove]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "sticker.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const colors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#88ff00"];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">🎭 WhatsApp Sticker Maker</h1>
          <p className="text-sm text-muted-foreground">Turn any image into a 512×512 WhatsApp sticker</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Controls */}
          <div className="space-y-4">
            {/* Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 transition-colors hover:border-primary/50"
            >
              <span className="mb-2 text-4xl">📷</span>
              <span className="text-sm text-muted-foreground">
                {image ? "Click to change image" : "Drop image here or click to upload"}
              </span>
              <span className="text-xs text-muted-foreground/60">JPG, PNG, WebP</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

            {/* Text Overlay */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Text Overlay</h3>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add text to sticker..."
                className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
              />
              <div className="mb-3 flex gap-2">
                {(["top", "center", "bottom"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTextPos(p)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      textPos === p ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className="h-7 w-7 rounded-full border-2 transition-transform"
                    style={{ backgroundColor: c, borderColor: textColor === c ? "#58a6ff" : "transparent" }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Size</span>
                <input
                  type="range"
                  min={16}
                  max={64}
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">{textSize}px</span>
              </div>
            </div>

            {/* Border */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Border / Outline</h3>
                <button
                  onClick={() => setBorder(!border)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${border ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${border ? "left-[18px]" : "left-0.5"}`}
                  />
                </button>
              </div>
              {border && (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setBorderColor(c)}
                        className="h-6 w-6 rounded-full border-2 transition-transform"
                        style={{ backgroundColor: c, borderColor: borderColor === c ? "#58a6ff" : "transparent" }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Width</span>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">{borderWidth}px</span>
                  </div>
                </>
              )}
            </div>

            {/* Background */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Remove Background</h3>
                <button
                  onClick={() => setBgRemove(!bgRemove)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${bgRemove ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${bgRemove ? "left-[18px]" : "left-0.5"}`}
                  />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground/60">Makes white background transparent for sticker</p>
            </div>

            {/* Download */}
            <button
              onClick={download}
              disabled={!image}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              ⬇ Download Sticker (512×512)
            </button>

            {/* Instructions */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">📱 How to add to WhatsApp</h3>
              <ol className="space-y-1 text-xs text-muted-foreground">
                <li>1. Download the sticker above</li>
                <li>2. Open WhatsApp</li>
                <li>3. Open any chat → tap 😊 emoji</li>
                <li>4. Tap "📁" → "+" to add new sticker</li>
                <li>5. Pick the downloaded image</li>
                <li>6. Done! Your sticker is ready to use</li>
              </ol>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Preview (512×512)</h3>
            <div className="rounded-xl border border-border bg-[#0b141a] p-4">
              <div className="flex justify-center">
                <canvas ref={canvasRef} className="max-h-[400px] w-full max-w-[400px] rounded-lg" style={{ imageRendering: "pixelated" }} />
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground/60">How it looks in a dark chat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
