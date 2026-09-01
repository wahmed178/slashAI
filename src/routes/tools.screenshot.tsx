import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/screenshot")({
  component: ScreenshotOCR,
});

function ScreenshotOCR() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setText("");
    setLoading(true);
    setProgress(0);

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      setText(result.data.text);
    } catch {
      setText("Error: Could not process the image. Try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <AppShell title="Screenshot to Text">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📸 Screenshot to Text (OCR)</h1>
        <p className="mt-1 text-sm text-muted-foreground">Extract text from any image or screenshot. Runs 100% in your browser — nothing uploaded.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-primary/40">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded" className="max-h-40 rounded-lg object-contain" />
            ) : (
              <>
                <p className="text-3xl">📸</p>
                <p className="mt-2 text-sm text-muted-foreground">Click to upload screenshot</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP — all processed locally</p>
              </>
            )}
          </button>

          {loading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Extracting text...</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Extracted Text</h2>
            {text && (
              <button type="button" onClick={handleCopy} className="text-xs text-primary hover:underline">Copy all</button>
            )}
          </div>
          {text ? (
            <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-4 text-sm leading-relaxed text-foreground">
              {text}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg">🔍</p>
              <p className="mt-2 text-sm text-muted-foreground">{loading ? "Processing..." : "Upload an image to extract text"}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
