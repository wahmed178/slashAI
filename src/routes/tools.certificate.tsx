import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/certificate")({
  head: () => ({
    meta: [
      { title: "Certificate Generator — SlashAI" },
      { name: "description", content: "Create printable certificates of completion, achievement and participation — classic, modern and Islamic templates, download as PNG or PDF." },
    ],
  }),
  component: CertificateGenerator,
});

const templates = [
  { id: "classic", name: "Classic", bg: "#fffef7", text: "#1a1a1a", accent: "#d29922", border: "#d29922" },
  { id: "modern", name: "Modern", bg: "#0d1117", text: "#f0f6fc", accent: "#58a6ff", border: "#30363d" },
  { id: "islamic", name: "Islamic", bg: "#0a1a0a", text: "#f0f6fc", accent: "#3fb950", border: "#d29922" },
] as const;

const certTypes = ["Completion", "Achievement", "Participation", "Appreciation", "Excellence"] as const;

export default function CertificateGenerator() {
  const [recipient, setRecipient] = useState("Ahmed Khan");
  const [certType, setCertType] = useState<string>("Completion");
  const [course, setCourse] = useState("Advanced Web Development");
  const [issuedBy, setIssuedBy] = useState("SlashAI Academy");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sigName, setSigName] = useState("Dr. Sarah Ahmed");
  const [sigTitle, setSigTitle] = useState("Director of Education");
  const [templateIdx, setTemplateIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tpl = templates[templateIdx]!;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 2480;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = tpl.bg;
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = tpl.border;
    ctx.lineWidth = 16;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    // Inner border
    ctx.strokeStyle = tpl.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(90, 90, W - 180, H - 180);

    // Corner decorations
    const corners = [[100, 100], [W - 100, 100], [100, H - 100], [W - 100, H - 100]];
    corners.forEach(([cx, cy]) => {
      if (cx === undefined || cy === undefined) return;
      ctx.fillStyle = tpl.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Islamic pattern for Islamic template
    if (templateIdx === 2) {
      ctx.strokeStyle = tpl.accent + "30";
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        const y = 120 + i * 80;
        ctx.beginPath();
        ctx.moveTo(120, y);
        for (let x = 120; x < W - 120; x += 40) {
          ctx.quadraticCurveTo(x + 20, y + 20, x + 40, y);
        }
        ctx.stroke();
      }
    }

    // Title
    ctx.fillStyle = tpl.accent;
    ctx.font = "bold 90px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE", W / 2, 280);

    // Subtitle
    ctx.fillStyle = tpl.text;
    ctx.font = "50px Georgia, serif";
    ctx.fillText(`OF ${certType.toUpperCase()}`, W / 2, 370);

    // Decorative line
    ctx.strokeStyle = tpl.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, 400);
    ctx.lineTo(W / 2 + 200, 400);
    ctx.stroke();

    // Body text
    ctx.fillStyle = tpl.text + "aa";
    ctx.font = "40px sans-serif";
    ctx.fillText("This is to certify that", W / 2, 520);

    // Recipient name
    ctx.fillStyle = tpl.text;
    ctx.font = `bold ${recipient.length > 20 ? 70 : 90}px Georgia, serif`;
    ctx.fillText(recipient || "Recipient Name", W / 2, 660);

    // Underline under name
    const nameW = ctx.measureText(recipient || "Recipient Name").width;
    ctx.strokeStyle = tpl.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameW / 2 - 20, 680);
    ctx.lineTo(W / 2 + nameW / 2 + 20, 680);
    ctx.stroke();

    // Course
    ctx.fillStyle = tpl.text + "cc";
    ctx.font = "38px sans-serif";
    ctx.fillText("has successfully completed", W / 2, 760);

    ctx.fillStyle = tpl.text;
    ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(course || "Course Name", W / 2, 840);

    // Date
    ctx.fillStyle = tpl.text + "aa";
    ctx.font = "36px sans-serif";
    const dateStr = new Date(date ?? '').toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillText(`Awarded on ${dateStr}`, W / 2, 960);

    // Issued by
    ctx.fillStyle = tpl.text + "cc";
    ctx.font = "32px sans-serif";
    ctx.fillText(`Issued by: ${issuedBy || "Organization"}`, W / 2, 1040);

    // Signature line
    ctx.strokeStyle = tpl.text + "40";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, 1350);
    ctx.lineTo(W / 2 + 200, 1350);
    ctx.stroke();

    ctx.fillStyle = tpl.text;
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(sigName || "Signatory Name", W / 2, 1400);

    ctx.fillStyle = tpl.text + "aa";
    ctx.font = "28px sans-serif";
    ctx.fillText(sigTitle || "Title", W / 2, 1440);

    // Issued by line (left)
    ctx.strokeStyle = tpl.text + "40";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 700, 1350);
    ctx.lineTo(W / 2 - 300, 1350);
    ctx.stroke();
    ctx.fillStyle = tpl.text;
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(issuedBy || "Organization", W / 2 - 500, 1400);
    ctx.fillStyle = tpl.text + "aa";
    ctx.font = "24px sans-serif";
    ctx.fillText("Issuing Authority", W / 2 - 500, 1440);

    // Decorative bottom
    ctx.fillStyle = tpl.accent;
    ctx.font = "28px sans-serif";
    ctx.fillText(`Certificate #${Date.now().toString(36).toUpperCase()}`, W / 2, 1600);

    ctx.textAlign = "left";
  }, [recipient, certType, course, issuedBy, date, sigName, sigTitle, tpl, templateIdx]);

  useEffect(() => { draw(); }, [draw]);

  const download = (fmt: "png" | "jpg") => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `certificate-${recipient.replace(/\s+/g, "-").toLowerCase()}.${fmt}`;
    link.href = canvasRef.current.toDataURL(fmt === "jpg" ? "image/jpeg" : "image/png", 0.95);
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">🏆 Certificate Generator</h1>
          <p className="text-sm text-muted-foreground">Create beautiful certificates in seconds</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Controls */}
          <div className="space-y-4">
            {/* Details */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Certificate Details</h3>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient Name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <select value={certType} onChange={(e) => setCertType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                {certTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course / Event Name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <input value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} placeholder="Issued By (Organization)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <div className="grid grid-cols-2 gap-2">
                <input value={sigName} onChange={(e) => setSigName(e.target.value)} placeholder="Signature Name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                <input value={sigTitle} onChange={(e) => setSigTitle(e.target.value)} placeholder="Title" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
            </div>

            {/* Template */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Template</h3>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateIdx(i)}
                    className="flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-colors"
                    style={{ borderColor: templateIdx === i ? tpl.accent : "transparent", background: t.bg + "20" }}
                  >
                    <span className="text-2xl">{t.id === "classic" ? "🏅" : t.id === "modern" ? "🔷" : "☪️"}</span>
                    <span className="text-xs font-medium text-foreground">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download */}
            <div className="flex gap-2">
              <button onClick={() => download("png")} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
                ⬇ Download PNG
              </button>
              <button onClick={() => download("jpg")} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background">
                ⬇ Download JPG
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Preview (A4 Landscape)</h3>
            <div className="rounded-xl border border-border bg-surface p-2">
              <canvas ref={canvasRef} className="w-full rounded-lg" style={{ aspectRatio: "2480/1754" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
