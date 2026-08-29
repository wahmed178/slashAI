import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

const TOOL_SECTIONS = [
  {
    title: "File & Document Tools",
    icon: "\u{1F4C4}",
    tools: [
      { slug: "image-compress", name: "Image Compressor", desc: "Reduce image file size in your browser", icon: "\u{1F5BC}\u{FE0F}", noUpload: true },
      { slug: "image-convert", name: "Image Converter", desc: "Convert between JPG, PNG, WebP formats", icon: "\u{1F504}", noUpload: true },
      { slug: "images-to-pdf", name: "Images to PDF", desc: "Combine multiple images into one PDF", icon: "\u{1F4D5}", noUpload: true },
      { slug: "html-to-pdf", name: "HTML to PDF", desc: "Paste HTML, download as PDF", icon: "\u{1F310}", noUpload: true },
      { slug: "markdown-to-html", name: "Markdown to HTML", desc: "Live preview with split pane editor", icon: "\u{2328}\u{FE0F}", noUpload: true },
      { slug: "csv-to-json", name: "CSV to JSON", desc: "Convert CSV files or text to JSON and back", icon: "\u{1F4CA}", noUpload: true },
    ],
  },
  {
    title: "Calculators",
    icon: "\u{1F9EE}",
    tools: [
      { slug: "sip-calculator", name: "SIP Calculator", desc: "Mutual fund SIP returns with donut chart", icon: "\u{1F4B0}" },
      { slug: "emi-calculator", name: "EMI Calculator", desc: "Loan EMI with interest breakdown", icon: "\u{1F3E6}" },
      { slug: "gst-calculator", name: "GST Calculator", desc: "Add or remove Indian GST with CGST/SGST", icon: "\u{1F9FE}" },
      { slug: "bmi-calculator", name: "BMI Calculator", desc: "Body mass index with health category", icon: "\u{2695}\u{FE0F}" },
      { slug: "percentage", name: "Percentage Calculator", desc: "3 modes: of, what %, increase/decrease", icon: "\u{2211}" },
      { slug: "age-calculator", name: "Age Calculator", desc: "Exact age, zodiac, birthday countdown", icon: "\u{1F570}\u{FE0F}" },
    ],
  },
  {
    title: "Time & Date",
    icon: "\u{1F550}",
    tools: [
      { slug: "world-clock", name: "World Clock", desc: "Live time in 12+ cities simultaneously", icon: "\u{1F30D}" },
      { slug: "pomodoro", name: "Pomodoro Timer", desc: "25/5/15 productivity timer with chime", icon: "\u{1F345}" },
      { slug: "countdown", name: "Countdown Timer", desc: "Save multiple event countdowns", icon: "\u{23F0}" },
    ],
  },
  {
    title: "Screens & Aesthetic",
    icon: "\u{1F5A5}\u{FE0F}",
    tools: [
      { slug: "flip-clock", name: "Flip Clock", desc: "Full-screen retro flip clock", icon: "\u{23F1}\u{FE0F}" },
      { slug: "focus-screen", name: "Focus Screen", desc: "Time, prayer, quote & weather overlay", icon: "\u{2728}" },
      { slug: "rain-screen", name: "Rain Screen", desc: "Animated rain canvas screensaver", icon: "\u{1F327}\u{FE0F}" },
      { slug: "starfield", name: "Starfield", desc: "Warp speed stars screensaver", icon: "\u{2B50}" },
      { slug: "new-tab", name: "New Tab Screen", desc: "Beautiful homepage / new tab replacement", icon: "\u{1F3E0}" },
      { slug: "quote-screen", name: "Quote of the Day", desc: "Inspirational quotes with daily refresh", icon: "\u{1F4DD}" },
    ],
  },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "SlashKit \u2014 Free browser utilities, calculators, screens | SlashAI" },
      {      name: "description", content: "SlashKit: 22 free browser tools — image compress, calculators, timers, screensavers. No upload, no account." },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <AppShell wide title="SlashKit">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          SlashKit
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          22 browser-based tools. Nothing uploaded. All client-side.
        </p>
      </header>

      {TOOL_SECTIONS.map((section, si) => (
        <section key={section.title} className={si === 0 ? "mt-6" : "mt-10"}>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <span className="text-lg">{section.icon}</span> {section.title}
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {section.tools.map((tool) => (
              <Link
                key={tool.slug}
                to={`/tools/${tool.slug}`}
                className="group flex items-start gap-3 rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[22px]">
                  {tool.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-foreground group-hover:text-primary">
                      {tool.name}
                    </span>
                    {"noUpload" in tool && tool.noUpload && (
                      <span className="rounded border px-1.5 py-0.5 text-[9px] font-medium text-green" style={{ background: "rgba(63,185,80,0.08)", borderColor: "rgba(63,185,80,0.3)" }}>
                        No upload
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground line-clamp-1">
                    {tool.desc}
                  </span>
                </span>
                <span className="mt-1 shrink-0 text-[13px] text-muted-foreground transition-colors group-hover:text-primary">
                  \u2192
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
