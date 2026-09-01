import { useState } from "react";
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
      { slug: "reading", name: "Speed Reading Trainer", desc: "RSVP flash-one-word technique", icon: "📖" },
      { slug: "noise", name: "Background Noise", desc: "Synthesised ambient sounds, mix & timer", icon: "🔊" },
      { slug: "qr-code", name: "QR Code Generator", desc: "Generate QR for URLs, WiFi, text", icon: "📱" },
      { slug: "json-formatter", name: "JSON Formatter", desc: "Pretty print, minify, validate JSON", icon: "🔧" },
      { slug: "password-gen", name: "Password Generator", desc: "Cryptographically secure random passwords", icon: "🔐" },
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
      { slug: "meta", name: "SEO Meta Tags", desc: "OG, Twitter Card, Schema.org tags", icon: "🔍" },
      { slug: "json-formatter", name: "JSON Formatter", desc: "Pretty print, minify, validate JSON", icon: "🔧" },
      { slug: "whitespace", name: "Whitespace Remover", desc: "Clean text: spaces, tabs, line breaks", icon: "🧹" },
      { slug: "url-encoder", name: "URL Encoder/Decoder", desc: "Encode and decode URLs", icon: "🔗" },
    ],
  },
  {
    title: "Image & Media",
    icon: "🖼️",
    tools: [
      { slug: "image-compress", name: "Image Compressor", desc: "Reduce image file size in your browser", icon: "🖼️", noUpload: true },
      { slug: "image-convert", name: "Image Converter", desc: "Convert between JPG, PNG, WebP formats", icon: "🔄", noUpload: true },
      { slug: "watermark", name: "Image Watermark", desc: "Add text watermarks to images locally", icon: "🎨" },
      { slug: "thumbnail", name: "YouTube Thumbnail Checker", desc: "Preview thumbnails in 5 YouTube contexts", icon: "🎬" },
      { slug: "aspect", name: "Aspect Ratio Calculator", desc: "Width, height, ratio — get the third", icon: "📐" },
      { slug: "gradient", name: "CSS Gradient Generator", desc: "Pick colors, copy as CSS/Tailwind", icon: "🌈" },
      { slug: "font", name: "Font Pairing Studio", desc: "50+ Google Font combos, copy CSS", icon: "🔤" },
      { slug: "color-picker", name: "Color Picker & Converter", desc: "HEX/RGB/HSL, contrast check, palettes", icon: "🎨" },
      { slug: "color-contrast", name: "WCAG Contrast Checker", desc: "Accessibility contrast ratio checker", icon: "♿" },
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
      { slug: "currency-history", name: "Currency Rate History", desc: "Exchange rate charts (Frankfurter API)", icon: "💱" },
      { slug: "size", name: "File Size Calculator", desc: "Convert units, download times, comparisons", icon: "📐" },
      { slug: "unit-converter", name: "Unit Converter", desc: "Temp, length, weight, area, volume, speed", icon: "📐" },
      { slug: "tip-calculator", name: "Tip Calculator", desc: "Split bills and calculate tips", icon: "💰" },
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
      { slug: "ip", name: "Network Info Tool", desc: "Your IP, location, ISP, and IP lookup", icon: "🌐" },
      { slug: "equation", name: "Math Equation Renderer", desc: "LaTeX → beautiful equations via KaTeX", icon: "🔢" },
      { slug: "api-tester", name: "API Tester", desc: "Mini Postman — test REST APIs from browser", icon: "🔌" },
      { slug: "timestamp", name: "Timestamp Converter", desc: "Unix timestamp ↔ human readable", icon: "⏱️" },
      { slug: "binary-calculator", name: "Binary Calculator", desc: "Binary, hex, octal, decimal conversions", icon: "💻" },
      { slug: "regex-tester", name: "Regex Tester", desc: "Test regex with live highlighting", icon: "🔍" },
      { slug: "string-hash", name: "Hash Generator", desc: "MD5, SHA-1, SHA-256 hash strings", icon: "🔢" },
      { slug: "http-status", name: "HTTP Status Codes", desc: "Reference for all HTTP status codes", icon: "🌐" },
      { slug: "unicode-lookup", name: "Unicode Lookup", desc: "Find Unicode characters by name", icon: "🔤" },
      { slug: "html-entity", name: "HTML Entity Encoder", desc: "Encode/decode HTML entities", icon: "🏷️" },
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
      { slug: "changelog-maker", name: "Changelog Generator", desc: "Markdown/HTML/text/JSON release notes", icon: "📝" },
      { slug: "pitch", name: "Elevator Pitch Builder", desc: "60-second pitch with timer & read-aloud", icon: "🎤" },
      { slug: "thread-maker", name: "Thread Formatter", desc: "Auto-split into Twitter/X or LinkedIn posts", icon: "🧵" },
      { slug: "spelling", name: "Spelling Checker", desc: "Offline spell check — common mistakes", icon: "✍️" },
      { slug: "text-case", name: "Text Case Converter", desc: "UPPER, lower, camelCase, snake_case, etc.", icon: "🔄" },
      { slug: "text-stats", name: "Text Statistics", desc: "Word count, reading time, char count", icon: "📊" },
      { slug: "speech-to-text", name: "Speech to Text", desc: "Real-time speech transcription", icon: "🎤" },
      { slug: "text-to-speech", name: "Text to Speech", desc: "Convert text to spoken audio", icon: "🔊" },
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
      { slug: "habit-stack", name: "Habit Stacking Planner", desc: "Atomic Habits routine builder", icon: "📋" },
      { slug: "stopwatch", name: "Stopwatch & Lap Timer", desc: "Precision stopwatch with lap times", icon: "⏱️" },
      { slug: "timezone-converter", name: "Timezone Converter", desc: "Convert times between timezones", icon: "🌍" },
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
      { slug: "svg-preview", name: "SVG Previewer", desc: "Preview and edit SVG code", icon: "🖼️" },
      { slug: "code-beautifier", name: "Code Beautifier", desc: "Format HTML/CSS/JS code", icon: "✨" },
      { slug: "html-preview", name: "HTML Previewer", desc: "Preview HTML code in real-time", icon: "🌐" },
      { slug: "css-playground", name: "CSS Playground", desc: "Live CSS editor with preview", icon: "🎨" },
      { slug: "js-playground", name: "JS Playground", desc: "Run JavaScript in the browser", icon: "⚡" },
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
      { slug: "vcard-gen", name: "vCard Generator", desc: "Create vCard files for contacts", icon: "📇" },
      { slug: "wifi-qr", name: "WiFi QR Generator", desc: "Generate WiFi share QR codes", icon: "📶" },
      { slug: "quote-maker", name: "Quote Card Maker", desc: "Design quote cards with fonts, backgrounds & templates", icon: "💬" },
    ],
  },
  {
    title: "Lifestyle",
    icon: "🌿",
    tools: [
      { slug: "plant", name: "Plant Care Tracker", desc: "Track watering schedules for plants", icon: "🌱" },
      { slug: "gift", name: "Gift Idea Generator", desc: "Curated gifts by recipient & budget", icon: "🎁" },
      { slug: "flashcard-maker", name: "Flashcard Maker", desc: "Create decks, study with spaced repetition", icon: "🧠" },
      { slug: "reading-list", name: "Book Tracker", desc: "Private reading list with ratings & export", icon: "📚" },
      { slug: "age-of-things", name: "How Old Is Everything?", desc: "Fun age comparisons for 30+ things", icon: "⏳" },
      { slug: "mind-map", name: "Mind Map Builder", desc: "Visual SVG mind map with drag & keyboard", icon: "🧠" },
      { slug: "dice", name: "Dice Roller", desc: "Roll D4-D100 for tabletop games", icon: "🎲" },
      { slug: "coin-flip", name: "Coin Flipper", desc: "Virtual coin flip with history", icon: "🪙" },
      { slug: "random-number", name: "Random Number Generator", desc: "Generate numbers in any range", icon: "🔢" },
      { slug: "roman-numeral", name: "Roman Numeral Converter", desc: "Numbers ↔ Roman numerals", icon: "🏛️" },
      { slug: "mood-tracker", name: "Mood Tracker", desc: "Track daily mood with journal entries", icon: "😊" },
      { slug: "gratitude-journal", name: "Gratitude Journal", desc: "Daily gratitude entries with streak", icon: "🙏" },
      { slug: "daily-planner", name: "Daily Planner", desc: "Plan your day with time blocks", icon: "📋" },
      { slug: "calorie-calc", name: "Calorie Calculator", desc: "Calculate daily calorie needs", icon: "🔥" },
      { slug: "water-tracker", name: "Water Intake Calculator", desc: "Calculate daily water intake", icon: "💧" },
      { slug: "sleep-calc", name: "Sleep Calculator", desc: "Optimal bedtime/waketime calculator", icon: "😴" },
      { slug: "heart-rate", name: "Heart Rate Zones", desc: "Calculate target heart rate zones", icon: "❤️" },
      { slug: "ideal-weight", name: "Ideal Body Weight", desc: "Calculate ideal weight for height", icon: "⚖️" },
    ],
  },
  {
    title: "Developer Utilities",
    icon: "🔧",
    tools: [
      { slug: "shortcut", name: "Keyboard Shortcuts", desc: "VS Code, Chrome, Figma, Slack, Mac & more", icon: "⌨️" },
      { slug: "fake-email", name: "Temp Email Generator", desc: "Disposable email with real-time inbox", icon: "📧" },
      { slug: "json-tree", name: "JSON Tree Viewer", desc: "Visualize JSON as expandable tree", icon: "🌳" },
      { slug: "markdown-html2", name: "Markdown to HTML", desc: "Convert markdown to styled HTML", icon: "📝" },
      { slug: "diff-viewer", name: "Side-by-Side Diff", desc: "Compare two texts visually", icon: "🔀" },
    ],
  },
  {
    title: "Islamic & South Asia",
    icon: "🌙",
    tools: [
      { slug: "muhurrat", name: "Islamic Date Finder", desc: "Hijri dates, events, Ramadan info", icon: "🌙" },
      { slug: "name", name: "Islamic Baby Names", desc: "50+ curated names with meanings", icon: "🕌" },
      { slug: "dua-maker", name: "Personal Dua List", desc: "Track duas, mark answered, reading mode", icon: "🤲" },
      { slug: "tasbeeh", name: "Digital Tasbeeh", desc: "Tap/space to count, vibration, preloaded dhikr", icon: "📿" },
      { slug: "hijri", name: "Hijri Calendar", desc: "Interactive monthly calendar with events", icon: "🌙" },
      { slug: "prayer-schedule", name: "Prayer Timetable", desc: "Full month schedule + CSV export", icon: "🕌" },
      { slug: "sadaqah", name: "Charity Tracker", desc: "Track sadaqah, zakat, fitrana donations", icon: "🤲" },
      { slug: "quran-search", name: "Quran Word Search", desc: "Search across entire Quran (AlQuran.cloud)", icon: "📖" },
    ],
    hubTools: [
      { slug: "/hub/urdu", name: "Urdu Writers Hub", desc: "Poetry, resources, fonts for Urdu", icon: "🇵🇰" },
      { slug: "/hub/arabic", name: "Arabic Learners Hub", desc: "Alphabet, courses, keyboard, phrases", icon: "🕌" },
    ],
  },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "SlashKits — 90+ free browser tools | SlashAI" },
      {
        name: "description",
        content: "SlashKits: 90+ free browser tools — image compress, calculators, noise, tasbeeh, timers, screensavers. No upload, no account.",
      },
    ],
  }),
  component: ToolsIndex,
});

const FILTERS = ["All", ...TOOL_SECTIONS.map((s) => s.title)] as const;

type FilterType = (typeof FILTERS)[number];

function ToolsIndex() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");

  const visibleSections = filter === "All" ? TOOL_SECTIONS : TOOL_SECTIONS.filter((s) => s.title === filter);

  const totalTools = TOOL_SECTIONS.reduce((acc, s) => acc + s.tools.length, 0);

  return (
    <AppShell wide title="SlashKits">
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          SlashKits
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {totalTools} browser-based tools. Nothing uploaded. All client-side.
        </p>
      </header>

      {/* Search */}
      <div className="mt-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Filter chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              filter === f
                ? "bg-primary text-background"
                : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {f === "All" ? `All (${totalTools})` : `${TOOL_SECTIONS.find((s) => s.title === f)?.icon} ${f}`}
          </button>
        ))}
      </div>

      {visibleSections.filter((section) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return section.tools.some((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
      }).map((section, si) => (
        <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z]/g, "")} className={si === 0 ? "mt-4" : "mt-10"}>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <span className="text-lg">{section.icon}</span> {section.title}
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {[...section.tools, ...((section as any).hubTools || [])].filter((tool: any) => {
              if (!search.trim()) return true;
              const q = search.toLowerCase();
              return tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q);
            }).map((tool: any) => (
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
