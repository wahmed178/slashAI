import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

const TOOL_SECTIONS = [
  {
    title: "Popular",
    icon: "🔥",
    tools: [
      { slug: "smart-paste", name: "Smart Paste Bin", desc: "Detect text type and extract insights", icon: "📋" },
      { slug: "image-compress", name: "Image Compressor", desc: "Reduce image file size in your browser", icon: "🖼️" },
      { slug: "regex", name: "Regex Playground", desc: "Test regex with live highlighting", icon: ".*" },
      { slug: "typing-test", name: "Typing Speed Test", desc: "60-second test — WPM, accuracy, streaks", icon: "⌨️" },
      { slug: "contract", name: "Contract Generator", desc: "Professional legal contracts as PDF", icon: "📄" },
      { slug: "screenshot", name: "Screenshot to Text", desc: "Extract text from images with OCR", icon: "📸" },
      { slug: "expense", name: "Trip Expense Splitter", desc: "Split expenses with minimum settlements", icon: "💸" },
      { slug: "color-palette", name: "Color Palette Studio", desc: "Generate palettes from any color", icon: "🎨" },
      { slug: "password", name: "Password Manager", desc: "Encrypted local password vault", icon: "🔐" },
      { slug: "diff", name: "Text Diff Checker", desc: "Compare two texts — changes highlighted", icon: "🔀" },
      { slug: "linktree", name: "Link in Bio Builder", desc: "Create personal link page, download as HTML", icon: "🔗" },
      { slug: "invoice", name: "Invoice Generator", desc: "Create and download PDF invoices (GST)", icon: "🧾" },
    ],
  },
  {
    title: "File & Document",
    icon: "📄",
    tools: [
      { slug: "markdown-editor", name: "Markdown Editor", desc: "Split pane with live preview + toolbar", icon: "✍️" },
      { slug: "markdown-to-html", name: "Markdown to HTML", desc: "Live preview with split pane editor", icon: "⌨️", noUpload: true },
      { slug: "csv-to-json", name: "CSV to JSON", desc: "Convert CSV files or text to JSON and back", icon: "📊" },
      { slug: "html-to-pdf", name: "HTML to PDF", desc: "Paste HTML, download as PDF", icon: "🌐" },
      { slug: "images-to-pdf", name: "Images to PDF", desc: "Combine multiple images into one PDF", icon: "📕" },
      { slug: "table", name: "Table Maker", desc: "Create tables, export as MD/HTML/CSV/JSON", icon: "📊" },
      { slug: "meta", name: "SEO Meta Tag Generator", desc: "OG, Twitter Card, Schema.org tags", icon: "🔍" },
    ],
  },
  {
    title: "Image & Media",
    icon: "🖼️",
    tools: [
      { slug: "image-compress", name: "Image Compressor", desc: "Reduce image file size in your browser", icon: "🖼️", noUpload: true },
      { slug: "image-convert", name: "Image Converter", desc: "Convert between JPG, PNG, WebP formats", icon: "🔄", noUpload: true },
      { slug: "watermark", name: "Image Watermark Tool", desc: "Add text watermarks to images locally", icon: "🎨" },
      { slug: "aspect", name: "Aspect Ratio Calculator", desc: "Width, height, ratio — get the third", icon: "📐" },
      { slug: "gradient", name: "CSS Gradient Generator", desc: "Pick colors, copy as CSS/Tailwind", icon: "🎨" },
    ],
  },
  {
    title: "Calculators & Finance",
    icon: "🧮",
    tools: [
      { slug: "sip-calculator", name: "SIP Calculator", desc: "Mutual fund SIP returns with donut chart", icon: "💰" },
      { slug: "emi-calculator", name: "EMI Calculator", desc: "Loan EMI with interest breakdown", icon: "🏦" },
      { slug: "gst-calculator", name: "GST Calculator", desc: "Add or remove Indian GST with CGST/SGST", icon: "💵" },
      { slug: "bmi-calculator", name: "BMI Calculator", desc: "Body mass index with health category", icon: "⚕️" },
      { slug: "percentage", name: "Percentage Calculator", desc: "3 modes: of, what %, increase/decrease", icon: "Σ" },
      { slug: "age-calculator", name: "Age Calculator", desc: "Exact age, zodiac, birthday countdown", icon: "🕰️" },
      { slug: "upi", name: "UPI Link Generator", desc: "Generate UPI payment links + QR codes", icon: "💳" },
      { slug: "budget", name: "Budget Tracker", desc: "Monthly income vs expenses — Indian categories", icon: "📈" },
      { slug: "kharch", name: "Urdu/Hindi Budget", desc: "Bilingual expense tracker with Indian categories", icon: "💴" },
    ],
  },
  {
    title: "Developer",
    icon: "💻",
    tools: [
      { slug: "regex", name: "Regex Playground", desc: "Test regex with live highlighting", icon: ".*" },
      { slug: "diff", name: "Text Diff Checker", desc: "Compare two texts — changes highlighted", icon: "🔀" },
      { slug: "password", name: "Password Manager", desc: "Encrypted local password vault", icon: "🔐" },
      { slug: "ascii", name: "ASCII Art Generator", desc: "Convert text to block ASCII art", icon: "█" },
      { slug: "cron", name: "Cron Explainer", desc: "Cron expressions ↔ plain English", icon: "⏱️" },
      { slug: "base64", name: "Encoders & Decoders", desc: "Base64, URL, HTML, JWT, SHA-256", icon: "🔧" },
      { slug: "readability", name: "Readability Analyser", desc: "Flesch score, grade level, passive voice", icon: "📖" },
    ],
  },
  {
    title: "Writing & Business",
    icon: "✍️",
    tools: [
      { slug: "contract", name: "Contract Generator", desc: "Professional legal contracts as PDF", icon: "📄" },
      { slug: "meeting", name: "Meeting Notes Formatter", desc: "Paste messy notes → get decisions & actions", icon: "📋" },
      { slug: "standup", name: "Standup Generator", desc: "Daily standup in Slack/bullet/email format", icon: "📝" },
      { slug: "cv", name: "ATS Resume Builder", desc: "ATS-optimised resume with PDF download", icon: "📃" },
      { slug: "bio", name: "Bio Generator", desc: "Twitter/LinkedIn/Website/Conference bios", icon: "✍️" },
      { slug: "notes", name: "Quick Notes", desc: "Distraction-free notepad with autosave", icon: "📝" },
      { slug: "lorem", name: "Content Generator", desc: "Random Indian names, addresses, prices", icon: "📋" },
    ],
  },
  {
    title: "Time & Focus",
    icon: "⏱️",
    tools: [
      { slug: "world-clock", name: "World Clock", desc: "Live time in 12+ cities simultaneously", icon: "🌍" },
      { slug: "pomodoro", name: "Pomodoro Timer", desc: "25/5/15 productivity timer with chime", icon: "🍅" },
      { slug: "countdown", name: "Countdown Timer", desc: "Save multiple event countdowns", icon: "⏰" },
      { slug: "multi-timer", name: "Multi Timer", desc: "Run multiple countdown timers", icon: "⏲️" },
      { slug: "focus", name: "Deep Work Mode", desc: "Pomodoro + ambient sounds + fullscreen", icon: "🎯" },
      { slug: "focus-screen", name: "Focus Screen", desc: "Time, prayer, quote & weather overlay", icon: "✨" },
      { slug: "flip-clock", name: "Flip Clock", desc: "Full-screen retro flip clock", icon: "⏲️" },
      { slug: "habits", name: "Habit Tracker", desc: "GitHub-style contribution grid", icon: "📊" },
    ],
  },
  {
    title: "Screens & Ambient",
    icon: "✨",
    tools: [
      { slug: "rain-screen", name: "Rain Screen", desc: "Animated rain canvas screensaver", icon: "🌧️" },
      { slug: "starfield", name: "Starfield", desc: "Warp speed stars screensaver", icon: "⭐" },
      { slug: "new-tab", name: "New Tab Screen", desc: "Beautiful homepage / new tab replacement", icon: "🏠" },
      { slug: "quote-screen", name: "Quote of the Day", desc: "Inspirational quotes with daily refresh", icon: "📝" },
      { slug: "one-liner", name: "OneLiner Quotes", desc: "500+ aesthetic quotes. Copy or download as PNG.", icon: "✨" },
    ],
  },
  {
    title: "Social & Creator",
    icon: "🔗",
    tools: [
      { slug: "linktree", name: "Link in Bio Builder", desc: "Create personal link page, download as HTML", icon: "🔗" },
      { slug: "poll", name: "Instant Poll Creator", desc: "Create polls, share links, see results", icon: "📊" },
      { slug: "namecard", name: "Digital Business Card", desc: "Create and share a digital card", icon: "💼" },
      { slug: "emoji", name: "Emoji Picker", desc: "Search 3,600+ emojis, recently used", icon: "😀" },
    ],
  },
  {
    title: "Lifestyle",
    icon: "🌿",
    tools: [
      { slug: "plant", name: "Plant Care Tracker", desc: "Track watering schedules for plants", icon: "🌱" },
      { slug: "gift", name: "Gift Idea Generator", desc: "Curated gifts by recipient & budget", icon: "🎁" },
      { slug: "flashcard-maker", name: "Flashcard Maker", desc: "Create decks, study with spaced repetition", icon: "🧠" },
    ],
  },
  {
    title: "Islamic & South Asia",
    icon: "🌙",
    tools: [
      { slug: "muhurrat", name: "Islamic Date Finder", desc: "Hijri dates, events, Ramadan info", icon: "🌙" },
      { slug: "name", name: "Islamic Baby Names", desc: "50+ curated names with meanings", icon: "🕌" },
      { slug: "dua-maker", name: "Personal Dua List", desc: "Track duas, mark answered, reading mode", icon: "🤲" },
      { slug: "kharch", name: "Urdu/Hindi Budget", desc: "Bilingual expense tracker with Indian categories", icon: "💴" },
    ],
    hubTools: [
      { slug: "/hub/urdu", name: "Urdu Writers Hub", desc: "Poetry, resources, fonts for Urdu", icon: "🇵🇰" },
    ],
  },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "SlashKits — Free browser utilities, calculators, screens | SlashAI" },
      {
        name: "description",
        content: "SlashKits: 65+ free browser tools — image compress, calculators, timers, screensavers. No upload, no account.",
      },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <AppShell wide title="SlashKits">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          SlashKits
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          65+ browser-based tools. Nothing uploaded. All client-side.
        </p>
      </header>

      {/* Quick category chips for mobile */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden" style={{ scrollbarWidth: "none" }}>
        {TOOL_SECTIONS.map((section) => (
          <a
            key={section.title}
            href={`#${section.title.toLowerCase().replace(/[^a-z]/g, "")}`}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {section.icon} {section.title}
          </a>
        ))}
      </div>

      {TOOL_SECTIONS.map((section, si) => (
        <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z]/g, "")} className={si === 0 ? "mt-6" : "mt-10"}>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <span className="text-lg">{section.icon}</span> {section.title}
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {[...section.tools, ...((section as any).hubTools || [])].map((tool: any) => (
              <Link
                key={tool.slug}
                to={tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`}
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
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
