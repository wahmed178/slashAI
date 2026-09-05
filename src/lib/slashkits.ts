/**
 * SlashKits — the browser-tool catalogue. Single source of truth for the
 * /tools index, homepage previews and breadcrumbs.
 *
 * Rules for this file:
 * - No duplicate tools. Each slug appears once.
 * - Every tool links to a real route under /tools/<slug> (hub links use a
 *   full path and are flagged with `hub: true`).
 * - Descriptions describe exactly what the tool does.
 */

export interface SlashTool {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  noUpload?: boolean;
  /** when true the slug is a full route (a hub), not a /tools page */
  hub?: boolean;
}

export interface SlashKitSection {
  title: string;
  icon: string;
  tools: SlashTool[];
  hubTools?: SlashTool[];
}

export const TOOL_SECTIONS: SlashKitSection[] = [
  {
    title: "Popular",
    icon: "🔥",
    tools: [
      { slug: "smart-paste", name: "Smart Paste Bin", desc: "Detect text type and extract insights", icon: "📋" },
      { slug: "image-compress", name: "Image Compressor", desc: "Reduce image file size in your browser", icon: "🖼️", noUpload: true },
      { slug: "regex", name: "Regex Playground", desc: "Test regex with live highlighting", icon: ".*" },
      { slug: "typing-test", name: "Typing Speed Test", desc: "60-second test — WPM, accuracy, streaks", icon: "⌨️" },
      { slug: "contract", name: "Contract Generator", desc: "Professional legal contracts as PDF", icon: "📄" },
      { slug: "screenshot", name: "Screenshot to Text", desc: "Extract text from images with OCR", icon: "📸" },
      { slug: "expense", name: "Trip Expense Splitter", desc: "Split expenses with minimum settlements", icon: "💸" },
      { slug: "color-palette", name: "Color Palette Studio", desc: "Generate palettes from any color", icon: "🎨" },
      { slug: "diff", name: "Text Diff Checker", desc: "Compare two texts — changes highlighted", icon: "🔀" },
      { slug: "reading", name: "Speed Reading Trainer", desc: "RSVP flash-one-word technique", icon: "📖" },
      { slug: "noise", name: "Background Noise", desc: "Synthesised ambient sounds, mix & timer", icon: "🔊" },
      { slug: "qr-code", name: "QR Code Generator", desc: "Generate QR for URLs, WiFi, text", icon: "📱" },
      { slug: "code-screenshot", name: "Code Screenshot Maker", desc: "Turn code into beautiful shareable images", icon: "📸" },
      { slug: "sip-calculator", name: "SIP Calculator", desc: "Mutual fund SIP returns with donut chart", icon: "💰" },
      { slug: "pomodoro", name: "Pomodoro Timer", desc: "25/5/15 productivity timer with chime", icon: "🍅" },
    ],
  },
  {
    title: "File & Document",
    icon: "📄",
    tools: [
      { slug: "markdown-editor", name: "Markdown Editor", desc: "Split pane with live preview + toolbar", icon: "✍️" },
      { slug: "markdown-to-html", name: "Markdown to HTML", desc: "Live preview with split pane editor", icon: "⌨️", noUpload: true },
      { slug: "csv-to-json", name: "CSV to JSON", desc: "Convert CSV files or text to JSON and back", icon: "📊" },
      { slug: "scanner", name: "Document Scanner", desc: "Scan pages with camera, enhance & export PDF", icon: "📷" },
      { slug: "html-to-pdf", name: "HTML to PDF", desc: "Paste HTML, download as PDF", icon: "🌐" },
      { slug: "images-to-pdf", name: "Images to PDF", desc: "Combine multiple images into one PDF", icon: "📕" },
      { slug: "certificate", name: "Certificate Generator", desc: "Create beautiful certificates in seconds", icon: "🏆" },
      { slug: "table", name: "Table Maker", desc: "Create tables, export as MD/HTML/CSV/JSON", icon: "📊" },
      { slug: "meta", name: "SEO Meta Tags", desc: "OG, Twitter Card, Schema.org tags", icon: "🔍" },
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
      { slug: "password-gen", name: "Password Generator", desc: "Cryptographically secure random passwords", icon: "🔐" },
      { slug: "json-formatter", name: "JSON Formatter", desc: "Pretty print, minify, validate JSON", icon: "🔧" },
      { slug: "json-tree", name: "JSON Tree Viewer", desc: "Visualize JSON as expandable tree", icon: "🌳" },
      { slug: "ascii", name: "ASCII Art Generator", desc: "Convert text to block ASCII art", icon: "█" },
      { slug: "cron", name: "Cron Explainer", desc: "Cron expressions ↔ plain English", icon: "⏱️" },
      { slug: "base64", name: "Encoders & Decoders", desc: "Base64, URL, HTML, JWT, SHA-256", icon: "🔧" },
      { slug: "readability", name: "Readability Analyser", desc: "Flesch score, grade level, passive voice", icon: "📖" },
      { slug: "analyze", name: "Website Analyser", desc: "Speed, security, SEO & tech audit of any site", icon: "🔍" },
      { slug: "ip", name: "Network Info Tool", desc: "Your IP, location, ISP, and IP lookup", icon: "🌐" },
      { slug: "equation", name: "Math Equation Renderer", desc: "LaTeX → beautiful equations via KaTeX", icon: "🔢" },
      { slug: "code-screenshot", name: "Code Screenshot Maker", desc: "Turn code into beautiful shareable images", icon: "📸" },
      { slug: "api-tester", name: "API Tester", desc: "Mini Postman — test REST APIs from browser", icon: "🔌" },
      { slug: "timestamp", name: "Timestamp Converter", desc: "Unix timestamp ↔ human readable", icon: "⏱️" },
      { slug: "binary-calculator", name: "Binary Calculator", desc: "Binary, hex, octal, decimal conversions", icon: "💻" },
      { slug: "string-hash", name: "Hash Generator", desc: "MD5, SHA-1, SHA-256 hash strings", icon: "🔢" },
      { slug: "http-status", name: "HTTP Status Codes", desc: "Reference for all HTTP status codes", icon: "🌐" },
      { slug: "unicode-lookup", name: "Unicode Lookup", desc: "Find Unicode characters by name", icon: "🔤" },
      { slug: "html-entity", name: "HTML Entity Encoder", desc: "Encode/decode HTML entities", icon: "🏷️" },
      { slug: "svg-preview", name: "SVG Previewer", desc: "Preview and edit SVG code", icon: "🖼️" },
      { slug: "code-beautifier", name: "Code Beautifier", desc: "Format HTML/CSS/JS code", icon: "✨" },
      { slug: "html-preview", name: "HTML Previewer", desc: "Preview HTML code in real-time", icon: "🌐" },
      { slug: "html-compiler", name: "HTML Compiler & Viewer", desc: "Write, compile and preview HTML with live rendering", icon: "🌐" },
      { slug: "css-playground", name: "CSS Playground", desc: "Live CSS editor with preview", icon: "🎨" },
      { slug: "js-playground", name: "JS Playground", desc: "Run JavaScript in the browser", icon: "⚡" },
      { slug: "shortcut", name: "Keyboard Shortcuts", desc: "VS Code, Chrome, Figma, Slack, Mac & more", icon: "⌨️" },
      { slug: "fake-email", name: "Temp Email Generator", desc: "Disposable email addresses — inbox via Guerrilla Mail", icon: "📧" },
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
      { slug: "interview", name: "Mock Interview", desc: "Practice with real questions + instant feedback", icon: "🎤" },
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
      { slug: "habits", name: "Habit Tracker", desc: "GitHub-style contribution grid", icon: "📊" },
      { slug: "stopwatch", name: "Stopwatch & Lap Timer", desc: "Precision stopwatch with lap times", icon: "⏱️" },
      { slug: "timezone-converter", name: "Timezone Converter", desc: "Convert times between timezones", icon: "🌍" },
    ],
  },
  {
    title: "Screens & Screensavers",
    icon: "🖥️",
    tools: [
      { slug: "rain-screen", name: "Rain Screen", desc: "Animated rain canvas screensaver", icon: "🌧️" },
      { slug: "starfield", name: "Starfield", desc: "Warp speed stars screensaver", icon: "⭐" },
      { slug: "flip-clock", name: "Flip Clock", desc: "Full-screen retro flip clock", icon: "⏲️" },
      { slug: "focus-screen", name: "Focus Screen", desc: "Time, prayer, quote & weather overlay", icon: "✨" },
      { slug: "new-tab", name: "New Tab Screen", desc: "Beautiful homepage / new tab replacement", icon: "🏠" },
      { slug: "quote-screen", name: "Quote of the Day", desc: "Inspirational quotes with daily refresh", icon: "📝" },
      { slug: "one-liner", name: "OneLiner Quotes", desc: "500+ aesthetic quotes. Copy or download as PNG.", icon: "✨" },
      { slug: "noise", name: "Background Noise", desc: "Synthesised ambient sounds, mix & timer", icon: "🔊" },
      { slug: "meme", name: "Meme Generator", desc: "Create memes instantly — no watermark", icon: "😂" },
      { slug: "sticker", name: "WhatsApp Sticker Maker", desc: "Turn any image into a 512×512 sticker", icon: "🎭" },
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
    title: "Life & Wellness",
    icon: "🌿",
    tools: [
      { slug: "plant", name: "Plant Care Tracker", desc: "Track watering schedules for plants", icon: "🌱" },
      { slug: "gift", name: "Gift Idea Generator", desc: "Curated gifts by recipient & budget", icon: "🎁" },
      { slug: "reading-list", name: "Book Tracker", desc: "Private reading list with ratings & export", icon: "📚" },
      { slug: "age-of-things", name: "How Old Is Everything?", desc: "Age comparisons for famous things, places and inventions", icon: "⏳" },
      { slug: "mind-map", name: "Mind Map Builder", desc: "Visual SVG mind map with drag & keyboard", icon: "🧠" },
      { slug: "dice", name: "Dice Roller", desc: "Roll D4-D100 for tabletop games", icon: "🎲" },
      { slug: "coin-flip", name: "Coin Flipper", desc: "Virtual coin flip with history", icon: "🪙" },
      { slug: "random-number", name: "Random Number Generator", desc: "Generate numbers in any range", icon: "🔢" },
      { slug: "roman-numeral", name: "Roman Numeral Converter", desc: "Numbers ↔ Roman numerals", icon: "🏛️" },
      { slug: "gratitude-journal", name: "Gratitude Journal", desc: "Daily gratitude entries with streak", icon: "🙏" },
      { slug: "daily-planner", name: "Daily Planner", desc: "Plan your day with time blocks", icon: "📋" },
    ],
  },
  {
    title: "Islamic Tools",
    icon: "🕌",
    tools: [
      { slug: "muhurrat", name: "Islamic Date Finder", desc: "Hijri dates, events, Ramadan info", icon: "🌙" },
      { slug: "name", name: "Islamic Baby Names", desc: "50+ curated names with meanings", icon: "🕌" },
      { slug: "dua-maker", name: "Personal Dua List", desc: "Track duas, mark answered, reading mode", icon: "🤲" },
      { slug: "tasbeeh", name: "Digital Tasbeeh", desc: "Tap/space to count, vibration, preloaded dhikr", icon: "📿" },
      { slug: "hijri", name: "Hijri Calendar", desc: "Interactive monthly calendar with events", icon: "🌙" },
      { slug: "prayer-schedule", name: "Prayer Timetable", desc: "Full month schedule + CSV export", icon: "🕌" },
      { slug: "sadaqah", name: "Charity Tracker", desc: "Track sadaqah, zakat, fitrana donations", icon: "🤲" },
      { slug: "quran-search", name: "Quran Word Search", desc: "Search across entire Quran (AlQuran.cloud)", icon: "📖" },
      { slug: "qibla", name: "Qibla Compass", desc: "Find direction of Mecca with compass", icon: "🧭" },
    ],
  },
  {
    title: "Health & Body",
    icon: "💪",
    tools: [
      { slug: "health-tracker", name: "Health Tracker", desc: "Track weight, BMI and health over time", icon: "💪" },
      { slug: "calorie", name: "Calorie & Macro Tracker", desc: "Track daily calories and macros", icon: "🥗" },
      { slug: "bmi-calculator", name: "BMI Calculator", desc: "Body mass index with health category", icon: "⚕️" },
      { slug: "calorie-calc", name: "Calorie Calculator", desc: "Calculate daily calorie needs", icon: "🔥" },
      { slug: "water-tracker", name: "Water Intake Calculator", desc: "Calculate daily water intake", icon: "💧" },
      { slug: "sleep-calc", name: "Sleep Calculator", desc: "Optimal bedtime/waketime calculator", icon: "😴" },
      { slug: "heart-rate", name: "Heart Rate Zones", desc: "Calculate target heart rate zones", icon: "❤️" },
      { slug: "ideal-weight", name: "Ideal Body Weight", desc: "Calculate ideal weight for height", icon: "⚖️" },
      { slug: "mood-tracker", name: "Mood Tracker", desc: "Track daily mood with journal entries", icon: "😊" },
    ],
  },
  {
    title: "Learning",
    icon: "🎓",
    tools: [
      { slug: "quiz-maker", name: "Quiz Builder", desc: "Build and share quizzes via URL", icon: "❓" },
      { slug: "flashcard-maker", name: "Flashcard Maker", desc: "Create decks, study with spaced repetition", icon: "🧠" },
      { slug: "reading", name: "Speed Reading Trainer", desc: "RSVP flash-one-word technique", icon: "📖" },
      { slug: "typing-test", name: "Typing Speed Test", desc: "60-second test — WPM, accuracy, streaks", icon: "⌨️" },
      { slug: "story", name: "Story Writing Kit", desc: "Characters, plot planner & writing prompts", icon: "📖" },
      { slug: "habit-stack", name: "Habit Stacking Planner", desc: "Atomic Habits routine builder", icon: "📋" },
    ],
  },
  {
    title: "Languages",
    icon: "🌍",
    tools: [
      { slug: "arabic-keyboard", name: "Arabic Keyboard", desc: "Type in Arabic without an Arabic keyboard", icon: "⌨️" },
      { slug: "speech-to-text", name: "Speech to Text", desc: "Real-time speech transcription", icon: "🎤" },
      { slug: "text-to-speech", name: "Text to Speech", desc: "Convert text to spoken audio", icon: "🔊" },
    ],
    hubTools: [
      { slug: "/hub/urdu", name: "Urdu Writers Hub", desc: "Poetry, resources, fonts for Urdu", icon: "🇵🇰", hub: true },
      { slug: "/hub/arabic", name: "Arabic Learners Hub", desc: "Alphabet, courses, keyboard, phrases", icon: "🕌", hub: true },
    ],
  },
];

/** all tool rows including hub links, preserving section order */
export const ALL_SLASH_TOOLS: SlashTool[] = TOOL_SECTIONS.flatMap((s) => [
  ...s.tools,
  ...(s.hubTools ?? []),
]);

/** only the /tools pages, used for counts */
export const SLASH_TOOL_COUNT = TOOL_SECTIONS.reduce(
  (acc, s) => acc + s.tools.filter((t) => !t.hub).length,
  0,
);

const toolByName = new Map(ALL_SLASH_TOOLS.map((t) => [t.slug, t]));

export const getSlashTool = (slug: string | undefined) =>
  slug ? toolByName.get(slug) : undefined;

/** deterministic daily pick for the "Tool of the Day" spotlight */
export function toolOfTheDay(): SlashTool {
  const featured = ["meme", "qr-code", "image-compress", "sip-calculator", "pomodoro", "typing-test", "tasbeeh"]
    .map((slug) => toolByName.get(slug))
    .filter((t): t is SlashTool => Boolean(t));
  const dayIndex = Math.floor(Date.now() / 86_400_000) % featured.length;
  return featured[dayIndex]!;
}
