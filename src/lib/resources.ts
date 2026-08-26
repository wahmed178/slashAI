/**
 * Curated resource catalog — the non-command half of SlashAI.
 *
 * Every record is hand-curated. Metadata we cannot verify (stars, licenses,
 * eligibility) is simply omitted rather than invented. `lastVerified` is the
 * date a human last opened the link and checked the description still holds.
 *
 * To add a resource: append an object to RESOURCES with a new stable `id`
 * (kebab-case, never reused) and run `bun run lint`. The UI is generic — no
 * component changes are needed.
 */

import { EXTRA_RESOURCES } from "./resources-extra";
import { API_RESOURCES } from "./resources-catalog/apis";
import { COURSE_EXTRA } from "./resources-catalog/courses";
import { YOUTUBE_EXTRA } from "./resources-catalog/youtube";

export type ResourceSection =
  | "ai"
  | "free-ai"
  | "free-tools"
  | "free-apis"
  | "github"
  | "learn"
  | "resources"
  | "youtube"
  | "reddit"
  | "websites"
  | "free-time"
  | "tips";

export type Pricing =
  | "Completely Free"
  | "Free Tier"
  | "Freemium"
  | "Open Source"
  | "Free for Students"
  | "Limited-Time Free"
  | "Paid";

export type ResourceType =
  | "AI Tool"
  | "Website"
  | "GitHub"
  | "Course"
  | "YouTube"
  | "Software"
  | "Dataset"
  | "Cheat Sheet"
  | "Tutorial"
  | "Trick"
  | "Subreddit"
  | "Wiki"
  | "API";

export type Audience =
  | "Everyone"
  | "Students"
  | "Developers"
  | "Designers"
  | "Researchers"
  | "Creators"
  | "Professionals"
  | "Job Seekers"
  | "Entrepreneurs"
  | "Teachers";

export type Platform = "Web" | "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "CLI";

export type ResourceStatus = "Active" | "Needs Review" | "Expired";

export type RadarKind =
  | "New Free AI Tool"
  | "Student Offer"
  | "Free Developer Tool"
  | "New Open Source Project"
  | "Free API Credits"
  | "Free Course"
  | "New Utility"
  | "GitHub Gem"
  | "YouTube Pick"
  | "Limited-Time Free Offer";

export interface Resource {
  id: string;
  name: string;
  url: string;
  /** one concise, original sentence */
  description: string;
  section: ResourceSection;
  category: string;
  subcategory?: string;
  audience: Audience[];
  pricing: Pricing;
  type: ResourceType;
  platform?: Platform[];
  /** who qualifies, when the offer is conditional */
  eligibility?: string;
  region?: string;
  /** known open-source license only; omitted when unverified */
  license?: string;
  /** repo owner for GitHub records */
  owner?: string;
  language?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  /** the paid product this is a practical alternative to */
  alternativeTo?: string[];
  tags: string[];
  addedDate: string;
  lastUpdated: string;
  lastVerified: string;
  status: ResourceStatus;
  /** editorial opinion — clearly separated from official info in the UI */
  notes?: string;
  radar?: RadarKind;
  /** step list for Tips & Tricks records */
  steps?: string[];
  /** search query into the command library, when a command pairs well */
  commandQuery?: string;
}

export interface SectionDef {
  id: ResourceSection;
  label: string;
  blurb: string;
  icon: string;
  categories: string[];
}

export const SECTIONS: SectionDef[] = [
  {
    id: "ai",
    label: "AI",
    blurb: "Assistants, models, agents and creative AI worth your time.",
    icon: "Sparkles",
    categories: [
      "AI Tools",
      "AI Commands",
      "AI Models",
      "AI Agents",
      "AI Image",
      "AI Video",
      "AI Audio",
      "AI Coding",
      "AI Research",
      "AI Learning",
    ],
  },
  {
    id: "free-tools",
    label: "Free Tools",
    blurb: "Everyday utilities that get a job done without a signup wall.",
    icon: "Wrench",
    categories: [
      "PDF",
      "Image",
      "Video",
      "Audio",
      "Text",
      "Developer",
      "Calculators",
      "Converters",
      "QR",
      "Productivity",
      "Utilities",
    ],
  },
  {
    id: "free-ai",
    label: "Free AI",
    blurb: "Assistants, answer engines and open models you can use for nothing.",
    icon: "Bot",
    categories: ["Free AI Chat", "AI Search", "Open Models", "AI Comparison", "AI Coding"],
  },

  {
    id: "free-apis",
    label: "Free APIs",
    blurb: "Keyless and free-tier public APIs you can call from any project today.",
    icon: "Plug",
    categories: [
      "Weather & Climate",
      "Finance",
      "AI & Data",
      "News",
      "Geolocation",
      "Space",
      "Entertainment",
      "Food & Recipes",
      "Government & India",
      "Testing",
      "Utilities",
    ],
  },

  {
    id: "github",
    label: "GitHub",
    blurb: "Repositories that are genuinely useful, not just starred.",
    icon: "Github",
    categories: [
      "Useful Repositories",
      "AI",
      "Local AI",
      "Developer",
      "Education",
      "Automation",
      "Self-hosted",
      "Beginner Projects",
      "Web",
      "Android & Linux",
    ],
  },
  {
    id: "learn",
    label: "Learn",
    blurb: "Free courses, roadmaps, cheat sheets, books and docs.",
    icon: "GraduationCap",
    categories: ["Free Courses", "Tutorials", "Roadmaps", "Cheat Sheets", "Books", "Documentation"],
  },
  {
    id: "resources",
    label: "Resources",
    blurb: "Grouped by who you are and what you are trying to get done.",
    icon: "Layers",
    categories: [
      "Students",
      "Developers",
      "Designers",
      "Researchers",
      "Creators",
      "Professionals",
      "Job Seekers",
      "Entrepreneurs",
      "Teachers",
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    blurb: "Channels worth subscribing to — links and notes only.",
    icon: "Youtube",
    categories: ["AI", "Development", "Android & Linux", "Productivity", "Design", "Learning"],
  },
  {
    id: "reddit",
    label: "Reddit",
    blurb: "Subreddits and wikis that quietly hold the best free resources.",
    icon: "MessagesSquare",
    categories: [
      "Wikis & Megathreads",
      "Free Stuff",
      "Movies & TV",
      "Books & Reading",
      "Blogs & Writing",
      "Tech & AI",
      "Learning",
    ],
  },
  {
    id: "websites",
    label: "Websites",
    blurb: "Single-purpose sites that do one thing properly.",
    icon: "Globe",
    categories: ["Hidden Gems", "Productivity", "Search", "Design", "Utilities"],
  },
  {
    id: "free-time",
    label: "Free Time",
    blurb: "Legal free movies, books, radio, games and good blogs.",
    icon: "Coffee",
    categories: ["Movies & TV", "Reading", "Blogs", "Games", "Music & Radio", "Fun"],
  },

  {
    id: "tips",
    label: "Tips & Tricks",
    blurb: "Small practical moves with clear steps.",
    icon: "Lightbulb",
    categories: ["AI", "GitHub", "Android", "Windows", "Chrome", "Students", "Productivity"],
  },
];

const D = "2026-08-22";

/** helper keeps the list readable; every record still carries explicit dates */
const r = (
  x: Omit<Resource, "addedDate" | "lastUpdated" | "lastVerified" | "status"> &
    Partial<Pick<Resource, "addedDate" | "lastUpdated" | "lastVerified" | "status">>,
): Resource => ({
  addedDate: D,
  lastUpdated: D,
  lastVerified: D,
  status: "Active",
  ...x,
});

const BASE_RESOURCES: Resource[] = [
  // ---------------------------------------------------------------- AI
  r({
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    description: "General-purpose AI assistant for writing, explaining and everyday questions.",
    section: "ai",
    category: "AI Tools",
    audience: ["Everyone"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web", "Android", "iOS"],
    tags: ["assistant", "writing", "chat"],
    notes: "The safest default if you only want to learn one assistant well.",
    commandQuery: "writing",
  }),
  r({
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    description: "Assistant that handles long documents and careful, structured reasoning well.",
    section: "ai",
    category: "AI Tools",
    audience: ["Everyone", "Professionals"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web", "Android", "iOS"],
    tags: ["assistant", "long-context", "analysis"],
    commandQuery: "summarize",
  }),
  r({
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com",
    description: "Google's assistant, strongest when you want answers grounded in web search.",
    section: "ai",
    category: "AI Tools",
    audience: ["Everyone"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web", "Android", "iOS"],
    tags: ["assistant", "search", "google"],
    commandQuery: "research",
  }),
  r({
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    description: "Answer engine that cites its sources, so claims can be checked.",
    section: "ai",
    category: "AI Research",
    audience: ["Researchers", "Students"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web", "Android", "iOS"],
    tags: ["research", "citations", "search"],
    commandQuery: "research",
  }),
  r({
    id: "huggingface",
    name: "Hugging Face",
    url: "https://huggingface.co",
    description: "Hub for open models, datasets and hosted demos you can try in the browser.",
    section: "ai",
    category: "AI Models",
    audience: ["Developers", "Researchers"],
    pricing: "Free Tier",
    type: "Website",
    platform: ["Web"],
    tags: ["models", "datasets", "open"],
    radar: "New Open Source Project",
  }),
  r({
    id: "ollama",
    name: "Ollama",
    url: "https://ollama.com",
    description: "Run open language models locally with a single command.",
    section: "ai",
    category: "AI Agents",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux", "CLI"],
    license: "MIT",
    tags: ["local-ai", "privacy", "models"],
    notes: "Best privacy story here — nothing leaves your machine.",
  }),
  r({
    id: "stable-diffusion-webui",
    name: "Stable Diffusion WebUI",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    description: "Local browser interface for generating images with open diffusion models.",
    section: "ai",
    category: "AI Image",
    audience: ["Creators", "Developers"],
    pricing: "Open Source",
    type: "GitHub",
    owner: "AUTOMATIC1111",
    language: "Python",
    platform: ["Windows", "macOS", "Linux"],
    tags: ["image", "diffusion", "local"],
    difficulty: "Intermediate",
  }),
  r({
    id: "krea",
    name: "Krea",
    url: "https://www.krea.ai",
    description: "Real-time AI image generation and upscaling in the browser.",
    section: "ai",
    category: "AI Image",
    audience: ["Designers", "Creators"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web"],
    tags: ["image", "upscale", "design"],
    commandQuery: "upscale",
  }),
  r({
    id: "elevenlabs",
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    description: "Text-to-speech and voice tools with a monthly free character allowance.",
    section: "ai",
    category: "AI Audio",
    audience: ["Creators"],
    pricing: "Free Tier",
    type: "AI Tool",
    platform: ["Web"],
    tags: ["voice", "tts", "audio"],
  }),
  r({
    id: "whisper",
    name: "Whisper",
    url: "https://github.com/openai/whisper",
    description: "Open speech-recognition model for transcribing audio in many languages.",
    section: "ai",
    category: "AI Audio",
    audience: ["Developers", "Researchers"],
    pricing: "Open Source",
    type: "GitHub",
    owner: "openai",
    language: "Python",
    license: "MIT",
    tags: ["transcription", "speech", "local"],
  }),
  r({
    id: "runway",
    name: "Runway",
    url: "https://runwayml.com",
    description: "Browser video generation and editing with AI, including a limited free plan.",
    section: "ai",
    category: "AI Video",
    audience: ["Creators"],
    pricing: "Free Tier",
    type: "AI Tool",
    platform: ["Web"],
    tags: ["video", "generation", "editing"],
  }),
  r({
    id: "github-copilot-students",
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    description: "AI code completion inside your editor.",
    section: "ai",
    category: "AI Coding",
    audience: ["Developers", "Students"],
    pricing: "Freemium",
    type: "AI Tool",
    platform: ["Web", "Windows", "macOS", "Linux"],
    eligibility: "Free for verified students and teachers through GitHub Education.",
    tags: ["coding", "editor", "autocomplete"],
    radar: "Student Offer",
  }),
  r({
    id: "continue-dev",
    name: "Continue",
    url: "https://github.com/continuedev/continue",
    description: "Open-source AI coding assistant that plugs into VS Code and JetBrains.",
    section: "ai",
    category: "AI Coding",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    owner: "continuedev",
    language: "TypeScript",
    license: "Apache-2.0",
    tags: ["coding", "assistant", "local-ai"],
    alternativeTo: ["GitHub Copilot"],
  }),
  r({
    id: "notebooklm",
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    description: "Upload your own sources and ask grounded questions about just those documents.",
    section: "ai",
    category: "AI Learning",
    audience: ["Students", "Researchers"],
    pricing: "Free Tier",
    type: "AI Tool",
    platform: ["Web"],
    tags: ["study", "documents", "notes"],
    commandQuery: "study",
  }),
  r({
    id: "elicit",
    name: "Elicit",
    url: "https://elicit.com",
    description: "Searches academic papers and extracts findings into a comparable table.",
    section: "ai",
    category: "AI Research",
    audience: ["Researchers", "Students"],
    pricing: "Free Tier",
    type: "AI Tool",
    platform: ["Web"],
    tags: ["papers", "literature-review", "research"],
  }),

  // -------------------------------------------------------- Free Tools
  r({
    id: "stirling-pdf",
    name: "Stirling PDF",
    url: "https://github.com/Stirling-Tools/Stirling-PDF",
    description: "Self-hostable toolbox for merging, splitting, OCR and converting PDFs locally.",
    section: "free-tools",
    category: "PDF",
    audience: ["Everyone", "Professionals"],
    pricing: "Open Source",
    type: "GitHub",
    owner: "Stirling-Tools",
    language: "Java",
    platform: ["Web", "Linux", "Windows", "macOS"],
    tags: ["pdf", "self-hosted", "privacy"],
    alternativeTo: ["Adobe Acrobat", "Smallpdf"],
    notes: "Run it in Docker and your documents never leave your network.",
  }),
  r({
    id: "pdf24",
    name: "PDF24 Tools",
    url: "https://tools.pdf24.org",
    description: "Large set of browser PDF utilities with no account required.",
    section: "free-tools",
    category: "PDF",
    audience: ["Everyone"],
    pricing: "Completely Free",
    type: "Website",
    platform: ["Web", "Windows"],
    tags: ["pdf", "convert", "compress"],
  }),
  r({
    id: "squoosh",
    name: "Squoosh",
    url: "https://squoosh.app",
    description: "Compress and convert images entirely in the browser, offline-capable.",
    section: "free-tools",
    category: "Image",
    audience: ["Everyone", "Designers"],
    pricing: "Open Source",
    type: "Website",
    platform: ["Web"],
    license: "Apache-2.0",
    tags: ["image", "compress", "webp"],
  }),
  r({
    id: "photopea",
    name: "Photopea",
    url: "https://www.photopea.com",
    description: "Browser image editor that opens PSD, XCF and Sketch files.",
    section: "free-tools",
    category: "Image",
    audience: ["Designers", "Creators"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["editor", "psd", "design"],
    alternativeTo: ["Adobe Photoshop"],
  }),
  r({
    id: "gimp",
    name: "GIMP",
    url: "https://www.gimp.org",
    description: "Mature open-source raster image editor for desktop.",
    section: "free-tools",
    category: "Image",
    audience: ["Designers", "Creators"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-3.0",
    tags: ["editor", "photo", "desktop"],
    alternativeTo: ["Adobe Photoshop"],
  }),
  r({
    id: "inkscape",
    name: "Inkscape",
    url: "https://inkscape.org",
    description: "Open-source vector graphics editor with full SVG support.",
    section: "free-tools",
    category: "Image",
    audience: ["Designers"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-3.0",
    tags: ["vector", "svg", "design"],
    alternativeTo: ["Adobe Illustrator"],
  }),
  r({
    id: "shotcut",
    name: "Shotcut",
    url: "https://shotcut.org",
    description: "Open-source cross-platform video editor with no watermark or export limits.",
    section: "free-tools",
    category: "Video",
    audience: ["Creators"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-3.0",
    tags: ["video", "editing", "desktop"],
  }),
  r({
    id: "handbrake",
    name: "HandBrake",
    url: "https://handbrake.fr",
    description: "Convert and compress video files between common formats.",
    section: "free-tools",
    category: "Video",
    audience: ["Everyone"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-2.0",
    tags: ["video", "convert", "compress"],
  }),
  r({
    id: "obs-studio",
    name: "OBS Studio",
    url: "https://obsproject.com",
    description: "Screen recording and live streaming, used by most creators for a reason.",
    section: "free-tools",
    category: "Video",
    audience: ["Creators", "Teachers"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-2.0",
    tags: ["recording", "streaming", "screen"],
  }),
  r({
    id: "audacity",
    name: "Audacity",
    url: "https://www.audacityteam.org",
    description: "Multi-track audio recorder and editor for desktop.",
    section: "free-tools",
    category: "Audio",
    audience: ["Creators"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-2.0",
    tags: ["audio", "podcast", "editing"],
  }),
  r({
    id: "diffchecker",
    name: "Diffchecker",
    url: "https://www.diffchecker.com",
    description: "Compare two blocks of text, files or images side by side.",
    section: "free-tools",
    category: "Text",
    audience: ["Everyone", "Developers"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["diff", "compare", "text"],
  }),
  r({
    id: "regex101",
    name: "regex101",
    url: "https://regex101.com",
    description: "Build and debug regular expressions with a live explanation of each token.",
    section: "free-tools",
    category: "Developer",
    audience: ["Developers", "Students"],
    pricing: "Completely Free",
    type: "Website",
    platform: ["Web"],
    tags: ["regex", "debug", "reference"],
  }),
  r({
    id: "excalidraw",
    name: "Excalidraw",
    url: "https://excalidraw.com",
    description: "Hand-drawn style whiteboard for diagrams, no account needed.",
    section: "free-tools",
    category: "Productivity",
    audience: ["Everyone", "Developers"],
    pricing: "Open Source",
    type: "Website",
    platform: ["Web"],
    license: "MIT",
    tags: ["diagram", "whiteboard", "sketch"],
  }),
  r({
    id: "cryptpad",
    name: "CryptPad",
    url: "https://cryptpad.fr",
    description: "End-to-end encrypted documents, sheets and kanban in the browser.",
    section: "free-tools",
    category: "Productivity",
    audience: ["Everyone", "Professionals"],
    pricing: "Open Source",
    type: "Website",
    platform: ["Web"],
    tags: ["documents", "privacy", "collaboration"],
    alternativeTo: ["Google Docs"],
  }),
  r({
    id: "libreoffice",
    name: "LibreOffice",
    url: "https://www.libreoffice.org",
    description: "Complete offline office suite: documents, spreadsheets and slides.",
    section: "free-tools",
    category: "Productivity",
    audience: ["Everyone", "Students"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "MPL-2.0",
    tags: ["office", "documents", "spreadsheet"],
    alternativeTo: ["Microsoft Office"],
  }),
  r({
    id: "qr-code-generator-oss",
    name: "QR Code Generator (nayuki)",
    url: "https://www.nayuki.io/page/qr-code-generator-library",
    description: "Reference QR implementation plus a browser demo that runs entirely client-side.",
    section: "free-tools",
    category: "QR",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "Website",
    platform: ["Web"],
    license: "MIT",
    tags: ["qr", "generator", "offline"],
  }),
  r({
    id: "omnicalculator",
    name: "Omni Calculator",
    url: "https://www.omnicalculator.com",
    description: "Thousands of specialised calculators with the formula shown alongside.",
    section: "free-tools",
    category: "Calculators",
    audience: ["Students", "Everyone"],
    pricing: "Completely Free",
    type: "Website",
    platform: ["Web"],
    tags: ["math", "finance", "conversion"],
  }),
  r({
    id: "cloudconvert",
    name: "CloudConvert",
    url: "https://cloudconvert.com",
    description: "Convert between hundreds of file formats with a daily free allowance.",
    section: "free-tools",
    category: "Converters",
    audience: ["Everyone"],
    pricing: "Free Tier",
    type: "Website",
    platform: ["Web"],
    tags: ["convert", "files", "formats"],
  }),
  r({
    id: "sharex",
    name: "ShareX",
    url: "https://getsharex.com",
    description: "Powerful Windows capture tool: screenshots, scrolling capture, GIF and OCR.",
    section: "free-tools",
    category: "Utilities",
    audience: ["Everyone", "Developers"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows"],
    license: "GPL-3.0",
    tags: ["screenshot", "capture", "ocr"],
  }),
  r({
    id: "keepassxc",
    name: "KeePassXC",
    url: "https://keepassxc.org",
    description: "Offline password manager storing everything in a local encrypted database.",
    section: "free-tools",
    category: "Utilities",
    audience: ["Everyone"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux"],
    license: "GPL-3.0",
    tags: ["passwords", "security", "offline"],
    alternativeTo: ["1Password", "LastPass"],
  }),

  // ------------------------------------------------------------- GitHub
  r({
    id: "gh-free-programming-books",
    name: "free-programming-books",
    url: "https://github.com/EbookFoundation/free-programming-books",
    description: "Vast index of freely available programming books and courses by language.",
    section: "github",
    category: "Education",
    owner: "EbookFoundation",
    audience: ["Students", "Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Beginner",
    tags: ["books", "learning", "index"],
    radar: "GitHub Gem",
  }),
  r({
    id: "gh-public-apis",
    name: "public-apis",
    url: "https://github.com/public-apis/public-apis",
    description: "Directory of free public APIs grouped by topic, with auth and HTTPS noted.",
    section: "github",
    category: "Developer",
    owner: "public-apis",
    audience: ["Developers", "Students"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Beginner",
    tags: ["api", "directory", "projects"],
  }),
  r({
    id: "gh-awesome-selfhosted",
    name: "awesome-selfhosted",
    url: "https://github.com/awesome-selfhosted/awesome-selfhosted",
    description: "Catalog of software you can host yourself instead of renting as a service.",
    section: "github",
    category: "Self-hosted",
    owner: "awesome-selfhosted",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Intermediate",
    tags: ["self-hosted", "privacy", "awesome-list"],
  }),
  r({
    id: "gh-build-your-own-x",
    name: "build-your-own-x",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description: "Step-by-step guides to rebuild real technologies from scratch to learn them.",
    section: "github",
    category: "Beginner Projects",
    owner: "codecrafters-io",
    audience: ["Students", "Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Intermediate",
    tags: ["projects", "learning", "practice"],
  }),
  r({
    id: "gh-the-algorithms",
    name: "TheAlgorithms",
    url: "https://github.com/TheAlgorithms",
    description: "Readable algorithm implementations across dozens of programming languages.",
    section: "github",
    category: "Education",
    owner: "TheAlgorithms",
    audience: ["Students"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Beginner",
    tags: ["algorithms", "interview", "reference"],
  }),
  r({
    id: "gh-n8n",
    name: "n8n",
    url: "https://github.com/n8n-io/n8n",
    description: "Workflow automation you can self-host to connect apps and APIs visually.",
    section: "github",
    category: "Automation",
    owner: "n8n-io",
    language: "TypeScript",
    audience: ["Developers", "Entrepreneurs"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Intermediate",
    tags: ["automation", "workflow", "self-hosted"],
    alternativeTo: ["Zapier"],
  }),
  r({
    id: "gh-localai",
    name: "LocalAI",
    url: "https://github.com/mudler/LocalAI",
    description: "Drop-in local API compatible with common AI endpoints, no GPU required.",
    section: "github",
    category: "Local AI",
    owner: "mudler",
    language: "Go",
    license: "MIT",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Advanced",
    tags: ["local-ai", "api", "privacy"],
  }),
  r({
    id: "gh-open-webui",
    name: "Open WebUI",
    url: "https://github.com/open-webui/open-webui",
    description: "Self-hosted chat interface for local and remote language models.",
    section: "github",
    category: "AI",
    owner: "open-webui",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Intermediate",
    tags: ["chat-ui", "local-ai", "self-hosted"],
  }),
  r({
    id: "gh-freecodecamp",
    name: "freeCodeCamp",
    url: "https://github.com/freeCodeCamp/freeCodeCamp",
    description: "Open-source codebase behind the free full-stack curriculum.",
    section: "github",
    category: "Education",
    owner: "freeCodeCamp",
    audience: ["Students"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Beginner",
    tags: ["curriculum", "web", "learning"],
  }),
  r({
    id: "gh-termux",
    name: "Termux",
    url: "https://github.com/termux/termux-app",
    description: "Linux terminal environment on Android with no root required.",
    section: "github",
    category: "Android & Linux",
    owner: "termux",
    language: "Java",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    platform: ["Android"],
    difficulty: "Intermediate",
    tags: ["android", "terminal", "linux"],
  }),
  r({
    id: "gh-shields",
    name: "Shields.io",
    url: "https://github.com/badges/shields",
    description: "Generates the status badges you see at the top of most READMEs.",
    section: "github",
    category: "Web",
    owner: "badges",
    audience: ["Developers"],
    pricing: "Open Source",
    type: "GitHub",
    difficulty: "Beginner",
    tags: ["badges", "readme", "web"],
  }),

  // -------------------------------------------------------------- Learn
  r({
    id: "cs50",
    name: "CS50x",
    url: "https://cs50.harvard.edu/x/",
    description: "Harvard's introduction to computer science, free to audit online.",
    section: "learn",
    category: "Free Courses",
    audience: ["Students"],
    pricing: "Completely Free",
    type: "Course",
    platform: ["Web"],
    difficulty: "Beginner",
    tags: ["computer-science", "c", "python"],
    notes: "Still the best single starting point if you have never programmed.",
    radar: "Free Course",
  }),
  r({
    id: "freecodecamp-site",
    name: "freeCodeCamp",
    url: "https://www.freecodecamp.org",
    description: "Project-based web development curriculum with free certifications.",
    section: "learn",
    category: "Free Courses",
    audience: ["Students", "Job Seekers"],
    pricing: "Completely Free",
    type: "Course",
    platform: ["Web"],
    difficulty: "Beginner",
    tags: ["web", "javascript", "certification"],
  }),
  r({
    id: "khan-academy",
    name: "Khan Academy",
    url: "https://www.khanacademy.org",
    description: "Free lessons and practice across maths, science and economics.",
    section: "learn",
    category: "Free Courses",
    audience: ["Students", "Teachers"],
    pricing: "Completely Free",
    type: "Course",
    platform: ["Web", "Android", "iOS"],
    tags: ["math", "science", "school"],
  }),
  r({
    id: "roadmap-sh",
    name: "roadmap.sh",
    url: "https://roadmap.sh",
    description: "Visual step-by-step learning paths for developer and data roles.",
    section: "learn",
    category: "Roadmaps",
    audience: ["Students", "Developers", "Job Seekers"],
    pricing: "Open Source",
    type: "Website",
    platform: ["Web"],
    tags: ["roadmap", "career", "paths"],
  }),
  r({
    id: "mdn",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Authoritative reference for HTML, CSS, JavaScript and browser APIs.",
    section: "learn",
    category: "Documentation",
    audience: ["Developers"],
    pricing: "Completely Free",
    type: "Website",
    platform: ["Web"],
    tags: ["web", "reference", "docs"],
  }),
  r({
    id: "devhints",
    name: "Devhints",
    url: "https://devhints.io",
    description: "Dense one-page cheat sheets for tools, languages and command lines.",
    section: "learn",
    category: "Cheat Sheets",
    audience: ["Developers", "Students"],
    pricing: "Completely Free",
    type: "Cheat Sheet",
    platform: ["Web"],
    tags: ["cheatsheet", "reference", "cli"],
  }),
  r({
    id: "ocw",
    name: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu",
    description: "Course materials, lecture notes and problem sets from MIT courses.",
    section: "learn",
    category: "Books",
    audience: ["Students", "Researchers"],
    pricing: "Completely Free",
    type: "Course",
    platform: ["Web"],
    tags: ["university", "lectures", "notes"],
  }),
  r({
    id: "the-odin-project",
    name: "The Odin Project",
    url: "https://www.theodinproject.com",
    description: "Free full-stack curriculum built around building real projects.",
    section: "learn",
    category: "Tutorials",
    audience: ["Students", "Job Seekers"],
    pricing: "Open Source",
    type: "Course",
    platform: ["Web"],
    difficulty: "Beginner",
    tags: ["web", "projects", "curriculum"],
  }),

  // ---------------------------------------------------------- Resources
  r({
    id: "github-student-pack",
    name: "GitHub Student Developer Pack",
    url: "https://education.github.com/pack",
    description: "Bundle of developer tools offered free to verified students.",
    section: "resources",
    category: "Students",
    audience: ["Students"],
    pricing: "Free for Students",
    type: "Website",
    eligibility: "Requires verification of student status with GitHub Education.",
    platform: ["Web"],
    tags: ["student", "offers", "developer"],
    radar: "Student Offer",
  }),
  r({
    id: "zotero",
    name: "Zotero",
    url: "https://www.zotero.org",
    description: "Reference manager that collects sources and generates citations.",
    section: "resources",
    category: "Researchers",
    audience: ["Researchers", "Students"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux", "Web"],
    tags: ["citations", "bibliography", "research"],
  }),
  r({
    id: "connected-papers",
    name: "Connected Papers",
    url: "https://www.connectedpapers.com",
    description: "Builds a visual graph of papers related to one you already have.",
    section: "resources",
    category: "Researchers",
    audience: ["Researchers"],
    pricing: "Free Tier",
    type: "Website",
    platform: ["Web"],
    tags: ["papers", "graph", "literature"],
  }),
  r({
    id: "obsidian",
    name: "Obsidian",
    url: "https://obsidian.md",
    description: "Local-first markdown notes with linking and a large plugin ecosystem.",
    section: "resources",
    category: "Students",
    audience: ["Students", "Professionals"],
    pricing: "Freemium",
    type: "Software",
    platform: ["Windows", "macOS", "Linux", "Android", "iOS"],
    tags: ["notes", "markdown", "offline"],
  }),
  r({
    id: "anki",
    name: "Anki",
    url: "https://apps.ankiweb.net",
    description: "Spaced-repetition flashcards that schedule reviews for you.",
    section: "resources",
    category: "Students",
    audience: ["Students"],
    pricing: "Open Source",
    type: "Software",
    platform: ["Windows", "macOS", "Linux", "Android", "Web"],
    tags: ["flashcards", "memory", "study"],
    commandQuery: "flashcards",
  }),
  r({
    id: "overleaf",
    name: "Overleaf",
    url: "https://www.overleaf.com",
    description: "Collaborative LaTeX editor in the browser with a free plan.",
    section: "resources",
    category: "Researchers",
    audience: ["Researchers", "Students"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["latex", "thesis", "writing"],
  }),
  r({
    id: "figma",
    name: "Figma",
    url: "https://www.figma.com",
    description: "Interface design and prototyping in the browser with a free starter plan.",
    section: "resources",
    category: "Designers",
    audience: ["Designers"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web", "Windows", "macOS"],
    tags: ["design", "ui", "prototyping"],
  }),
  r({
    id: "coolors",
    name: "Coolors",
    url: "https://coolors.co",
    description: "Fast palette generator with contrast checking.",
    section: "resources",
    category: "Designers",
    audience: ["Designers", "Creators"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["color", "palette", "design"],
  }),
  r({
    id: "unsplash",
    name: "Unsplash",
    url: "https://unsplash.com",
    description: "Photographs licensed for free use, including commercially.",
    section: "resources",
    category: "Creators",
    audience: ["Creators", "Designers"],
    pricing: "Completely Free",
    type: "Website",
    platform: ["Web"],
    tags: ["photos", "stock", "license"],
  }),
  r({
    id: "canva",
    name: "Canva",
    url: "https://www.canva.com",
    description: "Template-driven graphic design for social posts, decks and documents.",
    section: "resources",
    category: "Creators",
    audience: ["Creators", "Entrepreneurs"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web", "Android", "iOS"],
    tags: ["design", "templates", "social"],
  }),
  r({
    id: "flowcv",
    name: "FlowCV",
    url: "https://flowcv.com",
    description: "Builds clean, ATS-friendly resumes and exports them as PDF.",
    section: "resources",
    category: "Job Seekers",
    audience: ["Job Seekers", "Students"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["resume", "cv", "career"],
    commandQuery: "resume",
  }),
  r({
    id: "levels-fyi",
    name: "Levels.fyi",
    url: "https://www.levels.fyi",
    description: "Crowdsourced compensation data by company and level.",
    section: "resources",
    category: "Job Seekers",
    audience: ["Job Seekers", "Professionals"],
    pricing: "Free Tier",
    type: "Website",
    platform: ["Web"],
    tags: ["salary", "career", "negotiation"],
  }),
  r({
    id: "notion",
    name: "Notion",
    url: "https://www.notion.so",
    description: "Docs, databases and wikis in one workspace with a free personal plan.",
    section: "resources",
    category: "Professionals",
    audience: ["Professionals", "Students"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web", "Windows", "macOS", "Android", "iOS"],
    tags: ["notes", "wiki", "planning"],
  }),
  r({
    id: "clickup-free",
    name: "Trello",
    url: "https://trello.com",
    description: "Simple kanban boards for tracking work with a free tier.",
    section: "resources",
    category: "Professionals",
    audience: ["Professionals", "Entrepreneurs"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web", "Android", "iOS"],
    tags: ["kanban", "project", "tasks"],
  }),
  r({
    id: "wave-accounting",
    name: "Wave",
    url: "https://www.waveapps.com",
    description: "Invoicing and basic accounting for very small businesses.",
    section: "resources",
    category: "Entrepreneurs",
    audience: ["Entrepreneurs"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    region: "Feature availability varies by country — check before relying on it.",
    tags: ["invoicing", "accounting", "smallbusiness"],
  }),
  r({
    id: "classroomscreen",
    name: "Classroomscreen",
    url: "https://classroomscreen.com",
    description: "Timers, randomisers and widgets designed for a classroom display.",
    section: "resources",
    category: "Teachers",
    audience: ["Teachers"],
    pricing: "Freemium",
    type: "Website",
    platform: ["Web"],
    tags: ["teaching", "classroom", "widgets"],
  }),

  // ------------------------------------------------------------ YouTube
  r({
    id: "yt-3blue1brown",
    name: "3Blue1Brown",
    url: "https://www.youtube.com/@3blue1brown",
    description: "Visual mathematics explainers, including a clear neural-network series.",
    section: "youtube",
    category: "Learning",
    audience: ["Students"],
    pricing: "Completely Free",
    type: "YouTube",
    platform: ["Web"],
    tags: ["math", "visual", "explainers"],
    radar: "YouTube Pick",
  }),
  r({
    id: "yt-fireship",
    name: "Fireship",
    url: "https://www.youtube.com/@Fireship",
    description: "Fast, dense overviews of web technologies and developer news.",
    section: "youtube",
    category: "Development",
    audience: ["Developers"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["web", "javascript", "overview"],
  }),
  r({
    id: "yt-freecodecamp",
    name: "freeCodeCamp.org",
    url: "https://www.youtube.com/@freecodecamp",
    description: "Full-length free course videos across programming and data topics.",
    section: "youtube",
    category: "Development",
    audience: ["Students"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["courses", "programming", "long-form"],
  }),
  r({
    id: "yt-networkchuck",
    name: "NetworkChuck",
    url: "https://www.youtube.com/@NetworkChuck",
    description: "Approachable networking, Linux and self-hosting walkthroughs.",
    section: "youtube",
    category: "Android & Linux",
    audience: ["Developers"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["linux", "networking", "homelab"],
  }),
  r({
    id: "yt-alishaamdani",
    name: "Ali Abdaal",
    url: "https://www.youtube.com/@aliabdaal",
    description: "Study technique and productivity videos aimed at students and professionals.",
    section: "youtube",
    category: "Productivity",
    audience: ["Students", "Professionals"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["productivity", "study", "habits"],
  }),
  r({
    id: "yt-thefutur",
    name: "The Futur",
    url: "https://www.youtube.com/@thefutur",
    description: "Design business, branding and client work discussed candidly.",
    section: "youtube",
    category: "Design",
    audience: ["Designers", "Entrepreneurs"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["design", "branding", "business"],
  }),
  r({
    id: "yt-twominutepapers",
    name: "Two Minute Papers",
    url: "https://www.youtube.com/@TwoMinutePapers",
    description: "Short summaries of new AI and graphics research papers.",
    section: "youtube",
    category: "AI",
    audience: ["Researchers", "Everyone"],
    pricing: "Completely Free",
    type: "YouTube",
    tags: ["ai", "research", "papers"],
  }),

  // --------------------------------------------------------------- Tips
  r({
    id: "tip-github-dev",
    name: "Edit any GitHub repo in a browser IDE",
    url: "https://github.dev",
    description: "Press `.` on any GitHub repository to open it in a full editor in the browser.",
    section: "tips",
    category: "GitHub",
    audience: ["Developers", "Students"],
    pricing: "Completely Free",
    type: "Trick",
    platform: ["Web"],
    steps: [
      "Open any repository page on github.com.",
      "Press the full-stop key (`.`).",
      "A VS Code editor loads in the browser with the repo checked out.",
    ],
    tags: ["github", "editor", "shortcut"],
  }),
  r({
    id: "tip-chrome-tab-search",
    name: "Find a lost Chrome tab instantly",
    url: "https://support.google.com/chrome",
    description: "Search across every open tab instead of hunting through tiny favicons.",
    section: "tips",
    category: "Chrome",
    audience: ["Everyone"],
    pricing: "Completely Free",
    type: "Trick",
    platform: ["Windows", "macOS", "Linux"],
    steps: [
      "Press Ctrl+Shift+A (Cmd+Shift+A on macOS).",
      "Type part of the page title.",
      "Press Enter to jump straight to that tab.",
    ],
    tags: ["chrome", "tabs", "shortcut"],
  }),
  r({
    id: "tip-windows-clipboard",
    name: "Use Windows clipboard history",
    url: "https://support.microsoft.com/windows",
    description: "Keep the last several things you copied instead of only the newest one.",
    section: "tips",
    category: "Windows",
    audience: ["Everyone"],
    pricing: "Completely Free",
    type: "Trick",
    platform: ["Windows"],
    steps: [
      "Press Win+V.",
      "Turn on clipboard history the first time you are asked.",
      "Press Win+V again any time to paste something older.",
    ],
    tags: ["windows", "clipboard", "shortcut"],
  }),
  r({
    id: "tip-android-split-screen",
    name: "Run two Android apps side by side",
    url: "https://support.google.com/android",
    description: "Split-screen makes note-taking while reading much less painful.",
    section: "tips",
    category: "Android",
    audience: ["Students", "Everyone"],
    pricing: "Completely Free",
    type: "Trick",
    platform: ["Android"],
    steps: [
      "Open the recent-apps view.",
      "Long-press an app icon and choose Split screen (wording varies by manufacturer).",
      "Pick the second app from the list below.",
    ],
    tags: ["android", "multitasking", "study"],
  }),
  r({
    id: "tip-ai-give-the-format",
    name: "Tell the AI the output format first",
    url: "https://slashai.lovable.app/about",
    description: "Naming the exact shape of the answer removes most rewriting.",
    section: "tips",
    category: "AI",
    audience: ["Everyone"],
    pricing: "Completely Free",
    type: "Trick",
    steps: [
      "Start with the format: 'Reply as a 5-row markdown table with columns X, Y, Z.'",
      "Then give the content and the audience.",
      "Finish with one constraint, e.g. 'no more than 12 words per cell'.",
    ],
    tags: ["prompting", "ai", "writing"],
    commandQuery: "table",
  }),
  r({
    id: "tip-ai-ask-for-questions",
    name: "Make the AI interview you first",
    url: "https://slashai.lovable.app/about",
    description: "Asking for clarifying questions before an answer removes guesswork.",
    section: "tips",
    category: "AI",
    audience: ["Everyone", "Professionals"],
    pricing: "Completely Free",
    type: "Trick",
    steps: [
      "Add: 'Before answering, ask me up to five questions you need answered.'",
      "Answer them briefly.",
      "Then say 'Now produce the final version.'",
    ],
    tags: ["prompting", "ai", "quality"],
  }),
  r({
    id: "tip-student-scholar-alerts",
    name: "Get new papers emailed to you",
    url: "https://scholar.google.com",
    description: "Google Scholar alerts keep a literature review current without re-searching.",
    section: "tips",
    category: "Students",
    audience: ["Students", "Researchers"],
    pricing: "Completely Free",
    type: "Trick",
    platform: ["Web"],
    steps: [
      "Run your search on Google Scholar.",
      "Open the left sidebar and choose Create alert.",
      "Save it with your email to receive new matches.",
    ],
    tags: ["research", "alerts", "papers"],
  }),
  r({
    id: "tip-productivity-two-minute",
    name: "Batch every task under two minutes",
    url: "https://slashai.lovable.app/about",
    description: "Collecting tiny tasks into one short block beats interrupting deep work.",
    section: "tips",
    category: "Productivity",
    audience: ["Professionals", "Students"],
    pricing: "Completely Free",
    type: "Trick",
    steps: [
      "When a sub-two-minute task appears mid-focus, write it on one list.",
      "Set one 20-minute block a day for the list.",
      "Delete anything still on it after a week — it was not important.",
    ],
    tags: ["focus", "habits", "workflow"],
  }),
];

export const RESOURCES: Resource[] = [
  ...BASE_RESOURCES,
  ...EXTRA_RESOURCES,
  ...API_RESOURCES,
  ...COURSE_EXTRA,
  ...YOUTUBE_EXTRA,
];

// ------------------------------------------------------------- selectors

const byId = new Map(RESOURCES.map((x) => [x.id, x]));
export const getResource = (id: string | undefined | null) => (id ? byId.get(id) : undefined);

export const RESOURCE_TOTAL = RESOURCES.length;

export const sectionDef = (id: string) => SECTIONS.find((s) => s.id === id);

export const resourcesBySection = (section: ResourceSection) =>
  RESOURCES.filter((x) => x.section === section);

export function sectionCategories(section: ResourceSection) {
  const list = resourcesBySection(section);
  const def = sectionDef(section);
  const cats = def ? def.categories : [...new Set(list.map((x) => x.category))];
  return cats
    .map((category) => ({ category, count: list.filter((x) => x.category === category).length }))
    .filter((x) => x.count > 0);
}

export const FREE_STATUSES: Pricing[] = [
  "Completely Free",
  "Open Source",
  "Free Tier",
  "Freemium",
  "Free for Students",
  "Limited-Time Free",
  "Paid",
];

/** Free Radar — anything explicitly tagged with a radar kind, newest first. */
export const RADAR = RESOURCES.filter((x) => x.radar).sort((a, b) =>
  b.addedDate.localeCompare(a.addedDate),
);

export const RADAR_KINDS = [...new Set(RADAR.map((x) => x.radar!))];

/** Free alternatives to popular paid software. */
export const ALTERNATIVES = RESOURCES.filter((x) => x.alternativeTo?.length).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const NEWEST_RESOURCES = [...RESOURCES]
  .sort((a, b) => b.addedDate.localeCompare(a.addedDate))
  .slice(0, 12);

export function audienceResources(audience: Audience) {
  return RESOURCES.filter((x) => x.audience.includes(audience));
}

/** Simple, forgiving text match across the curated fields. */
export function searchResources(query: string, limit = 40) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = RESOURCES.map((x) => {
    const hay = [x.name, x.description, x.category, x.subcategory, x.type, ...x.tags]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (!hay.includes(t)) return { x, score: -1 };
      score += x.name.toLowerCase().startsWith(t) ? 6 : x.name.toLowerCase().includes(t) ? 4 : 1;
    }
    return { x, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => s.x);
}

export interface TimedDrop {
  id: string;
  title: string;
  cadence: "Weekly" | "Monthly" | "Yearly" | "Special";
  blurb: string;
  /** resource ids in this drop */
  items: string[];
  published: string;
}

/** Manually curated time-based collections. Add a new entry each cycle. */
export const DROPS: TimedDrop[] = [
  {
    id: "weekly-2026-w34",
    title: "Weekly Free Finds — week 34",
    cadence: "Weekly",
    blurb: "Five things worth ten minutes each this week.",
    items: ["stirling-pdf", "roadmap-sh", "gh-public-apis", "squoosh", "notebooklm"],
    published: "2026-08-22",
  },
  {
    id: "monthly-2026-08",
    title: "Monthly Resource Drop — August 2026",
    cadence: "Monthly",
    blurb: "The strongest additions to the library this month.",
    items: ["ollama", "gh-open-webui", "excalidraw", "elicit", "cs50", "keepassxc"],
    published: "2026-08-01",
  },
  {
    id: "back-to-school-2026",
    title: "Back to School",
    cadence: "Special",
    blurb: "Set up your study stack before term starts.",
    items: ["anki", "obsidian", "zotero", "notebooklm", "khan-academy", "github-student-pack"],
    published: "2026-08-10",
  },
  {
    id: "yearly-2026-guide",
    title: "Yearly Guide — a free toolkit for 2026",
    cadence: "Yearly",
    blurb: "If you only bookmark ten things from SlashAI, bookmark these.",
    items: [
      "chatgpt",
      "claude",
      "libreoffice",
      "photopea",
      "obs-studio",
      "freecodecamp-site",
      "mdn",
      "keepassxc",
      "excalidraw",
      "roadmap-sh",
    ],
    published: "2026-01-05",
  },
];

export const dropItems = (drop: TimedDrop) =>
  drop.items.map((id) => byId.get(id)).filter((x): x is Resource => Boolean(x));
