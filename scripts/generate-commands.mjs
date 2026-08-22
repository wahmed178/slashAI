/**
 * Generates src/data/commands.json — the SlashAI command catalog.
 *
 * Run: bun scripts/generate-commands.mjs
 * See src/data/README.md for how to extend the catalog.
 */
import { writeFileSync, mkdirSync } from "node:fs";

/** @typedef {{id:string,command:string,title:string,description:string,usage:string,example:string,category:string,subcategory:string,tags:string[],type:string,difficulty:string,featured:boolean,aliases:string[],popularity:number}} Command */

const CATEGORIES = [
  {
    category: "Image & Vision",
    type: "image",
    icon: "Image",
    verbs: [
      ["Upscale", "upscale", "increase resolution and recover fine detail in"],
      ["Enhance", "enhance", "sharpen, denoise and improve overall quality of"],
      ["Restore", "restore", "repair damage, scratches and compression artifacts in"],
      ["Colorize", "colorize", "add realistic, historically plausible color to"],
      ["RemoveBg", "background removal", "cut out the subject and remove the background from"],
      ["Relight", "relighting", "re-light the scene with soft, controllable studio lighting for"],
      ["Retouch", "retouch", "apply natural, non-plastic retouching to"],
      ["Describe", "captioning", "write a precise, alt-text ready description of"],
      ["StyleTransfer", "style transfer", "restyle while preserving structure and composition of"],
      ["Variations", "variations", "produce four distinct creative variations of"],
    ],
    objects: [
      ["Portrait", "a portrait photo", "portrait, people"],
      ["Product", "a product photo", "ecommerce, product"],
      ["Screenshot", "a UI screenshot", "ui, screenshot"],
      ["Logo", "a logo or mark", "branding, logo"],
      ["Scan", "a scanned page or photo", "scan, archive"],
      ["Landscape", "a landscape or scenery shot", "landscape, nature"],
    ],
  },
  {
    category: "Documents & OCR",
    type: "document",
    icon: "FileText",
    verbs: [
      ["Extract", "extraction", "pull clean, structured text out of"],
      ["OCR", "ocr", "run high-accuracy OCR over"],
      ["Summarize", "summaries", "produce a faithful, citation-anchored summary of"],
      ["Outline", "outlines", "build a hierarchical outline of"],
      ["Tabulate", "tables", "detect and convert every table inside"],
      ["Redact", "redaction", "find and mask personal or sensitive data in"],
      ["Compare", "diffing", "diff two versions and list every substantive change in"],
      ["Classify", "classification", "label document type, topic and confidence for"],
      ["Translate", "translation", "translate while keeping layout and terminology of"],
      ["QA", "question answering", "answer questions strictly grounded in"],
    ],
    objects: [
      ["Pdf", "a PDF file", "pdf"],
      ["Invoice", "an invoice or receipt", "finance, invoice"],
      ["Contract", "a contract or agreement", "legal, contract"],
      ["Handwritten", "handwritten notes", "handwriting, notes"],
      ["Slides", "a slide deck", "slides, deck"],
      ["Form", "a filled-in form", "forms, intake"],
    ],
  },
  {
    category: "Writing",
    type: "text",
    icon: "PenLine",
    verbs: [
      ["Draft", "drafting", "write a strong first draft of"],
      ["Rewrite", "rewriting", "rewrite for clarity and rhythm"],
      ["Shorten", "editing", "cut length by half without losing meaning in"],
      ["Expand", "editing", "add depth, examples and specifics to"],
      ["Tone", "tone", "adjust tone and register of"],
      ["Proofread", "proofreading", "fix grammar, spelling and punctuation in"],
      ["Simplify", "clarity", "rewrite at a plain-language reading level"],
      ["Headline", "headlines", "generate ten sharp headline options for"],
      ["Hook", "hooks", "write scroll-stopping opening lines for"],
      ["Polish", "polish", "do a final line-edit pass on"],
    ],
    objects: [
      ["Email", "an email", "email"],
      ["Essay", "an essay", "essay, longform"],
      ["Post", "a social post", "social"],
      ["Story", "a short story", "fiction, story"],
      ["Bio", "a personal or company bio", "bio, profile"],
      ["Report", "a written report", "report"],
    ],
  },
  {
    category: "Research",
    type: "research",
    icon: "Search",
    verbs: [
      ["Research", "deep research", "run a structured research pass on"],
      ["FactCheck", "verification", "verify every claim and rate confidence for"],
      ["Sources", "sourcing", "find and rank credible primary sources for"],
      ["Compare", "comparison", "build a side-by-side comparison table for"],
      ["Timeline", "timelines", "assemble a dated timeline of"],
      ["LitReview", "literature", "write a mini literature review on"],
      ["Gaps", "gap analysis", "identify open questions and knowledge gaps in"],
      ["Brief", "briefings", "write a one-page decision brief on"],
      ["Debate", "perspectives", "argue both sides fairly on"],
      ["Glossary", "glossaries", "define the key vocabulary of"],
    ],
    objects: [
      ["Topic", "a topic", "topic"],
      ["Market", "a market", "market"],
      ["Paper", "an academic paper", "academic, paper"],
      ["Company", "a company", "company"],
      ["Technology", "a technology", "tech"],
      ["Policy", "a policy or regulation", "policy"],
    ],
  },
  {
    category: "Analysis",
    type: "text",
    icon: "Sparkles",
    verbs: [
      ["Analyze", "analysis", "break down structure, drivers and implications of"],
      ["Critique", "critique", "give a candid, specific critique of"],
      ["Risks", "risk", "surface the top risks and mitigations in"],
      ["Assumptions", "assumptions", "list and stress-test the assumptions behind"],
      ["RootCause", "root cause", "run a five-whys root-cause analysis on"],
      ["SWOT", "frameworks", "produce a SWOT analysis of"],
      ["Score", "scoring", "score against explicit weighted criteria"],
      ["Sentiment", "sentiment", "measure sentiment and emotional drivers in"],
      ["Themes", "themes", "cluster recurring themes across"],
      ["Decide", "decisions", "recommend a decision with tradeoffs for"],
    ],
    objects: [
      ["Feedback", "customer feedback", "voc, feedback"],
      ["Strategy", "a strategy document", "strategy"],
      ["Plan", "a project plan", "planning"],
      ["Pitch", "a pitch", "pitch"],
      ["Transcript", "a meeting transcript", "meeting, transcript"],
      ["Metrics", "a set of metrics", "metrics, kpi"],
    ],
  },
  {
    category: "Data",
    type: "data",
    icon: "Database",
    verbs: [
      ["Clean", "cleaning", "normalize, dedupe and fix types in"],
      ["Profile", "profiling", "profile distributions, nulls and outliers in"],
      ["Chart", "visualization", "recommend and specify the right chart for"],
      ["Pivot", "reshaping", "pivot and aggregate"],
      ["Join", "joining", "plan a safe join strategy across"],
      ["Validate", "validation", "write validation rules for"],
      ["Explain", "explanation", "explain in plain English what is happening in"],
      ["Forecast", "forecasting", "produce a simple baseline forecast from"],
      ["Anomaly", "anomalies", "detect anomalies and explain each one in"],
      ["Schema", "schema", "infer a typed schema and dictionary for"],
    ],
    objects: [
      ["Csv", "a CSV file", "csv"],
      ["Table", "a database table", "sql, table"],
      ["Json", "a JSON payload", "json"],
      ["Spreadsheet", "a spreadsheet", "excel, sheets"],
      ["Logs", "application logs", "logs, observability"],
      ["Survey", "survey results", "survey"],
    ],
  },
  {
    category: "Coding",
    type: "coding",
    icon: "Code2",
    verbs: [
      ["Review", "code review", "review for bugs, edge cases and readability"],
      ["Refactor", "refactoring", "refactor without changing behaviour"],
      ["Debug", "debugging", "diagnose the failure and propose a minimal fix for"],
      ["Test", "testing", "write meaningful tests covering"],
      ["Document", "documentation", "write accurate docs and doc comments for"],
      ["Optimize", "performance", "find and remove hot-path waste in"],
      ["Migrate", "migration", "plan a stepwise migration of"],
      ["Explain", "explanation", "walk through line-by-line what happens in"],
      ["Types", "typing", "add precise static types to"],
      ["Secure", "security", "audit for injection, authz and secret-handling issues in"],
    ],
    objects: [
      ["Function", "a function", "function"],
      ["Component", "a UI component", "frontend, component"],
      ["Api", "an API endpoint", "api, backend"],
      ["Query", "a database query", "sql, query"],
      ["Script", "a script", "script, automation"],
      ["Config", "a config file", "config, devops"],
    ],
  },
  {
    category: "Productivity",
    type: "productivity",
    icon: "Zap",
    verbs: [
      ["Plan", "planning", "turn into a realistic, sequenced plan"],
      ["Prioritize", "prioritization", "rank by impact and effort"],
      ["Checklist", "checklists", "convert into an actionable checklist"],
      ["Delegate", "delegation", "split into delegable work packets"],
      ["Estimate", "estimation", "estimate time and confidence ranges for"],
      ["Recap", "recaps", "write a concise recap with owners and dates for"],
      ["Followup", "follow-ups", "draft polite, specific follow-ups for"],
      ["Timebox", "focus", "timebox into focused work blocks"],
      ["Template", "templates", "produce a reusable template for"],
      ["Unblock", "unblocking", "identify the blocker and the smallest next step for"],
    ],
    objects: [
      ["Meeting", "a meeting", "meeting"],
      ["Project", "a project", "project"],
      ["Inbox", "an inbox backlog", "email, inbox"],
      ["Day", "a working day", "schedule, day"],
      ["Goal", "a goal", "goals, okr"],
      ["Backlog", "a task backlog", "backlog, tasks"],
    ],
  },
  {
    category: "Business",
    type: "business",
    icon: "Briefcase",
    verbs: [
      ["Model", "modeling", "build a simple, defensible model for"],
      ["Pricing", "pricing", "propose pricing tiers and rationale for"],
      ["Positioning", "positioning", "write sharp positioning and messaging for"],
      ["Personas", "personas", "define buyer personas and jobs-to-be-done for"],
      ["Competitors", "competition", "map the competitive landscape around"],
      ["Roadmap", "roadmaps", "draft a quarterly roadmap for"],
      ["Metrics", "metrics", "define the metric tree and north star for"],
      ["Proposal", "proposals", "write a client-ready proposal for"],
      ["Negotiate", "negotiation", "prepare negotiation levers and BATNA for"],
      ["Onepager", "one-pagers", "condense into an executive one-pager"],
    ],
    objects: [
      ["Startup", "a startup", "startup"],
      ["Product", "a product", "product"],
      ["Service", "a service business", "services"],
      ["Saas", "a SaaS offering", "saas"],
      ["Store", "an online store", "ecommerce"],
      ["Agency", "an agency", "agency"],
    ],
  },
  {
    category: "Quality & Performance",
    type: "general",
    icon: "Gauge",
    verbs: [
      ["Audit", "audits", "run a structured quality audit of"],
      ["Benchmark", "benchmarks", "define fair benchmarks and baselines for"],
      ["Improve", "improvement", "propose the three highest-leverage improvements to"],
      ["Stress", "stress testing", "stress-test the weakest points of"],
      ["Rubric", "rubrics", "build a scoring rubric for"],
      ["Regression", "regressions", "hunt for regressions introduced in"],
      ["Accessibility", "accessibility", "check WCAG issues and fixes in"],
      ["Consistency", "consistency", "flag inconsistencies across"],
      ["Latency", "latency", "trace and reduce latency in"],
      ["Cost", "cost", "find cost waste and savings in"],
    ],
    objects: [
      ["Website", "a website", "web"],
      ["App", "an application", "app"],
      ["Prompt", "a prompt", "prompting"],
      ["Workflow", "a workflow", "workflow"],
      ["Content", "a content library", "content"],
      ["Pipeline", "a data or build pipeline", "pipeline"],
    ],
  },
  {
    category: "Learning",
    type: "learning",
    icon: "GraduationCap",
    verbs: [
      ["Teach", "teaching", "teach from first principles"],
      ["ELI5", "explainers", "explain in simple everyday language"],
      ["Quiz", "quizzes", "generate a graded quiz on"],
      ["Flashcards", "flashcards", "produce spaced-repetition flashcards for"],
      ["Roadmap", "curricula", "design a week-by-week learning path for"],
      ["Practice", "practice", "create hands-on practice exercises for"],
      ["Analogy", "analogies", "explain through vivid analogies"],
      ["Mistakes", "pitfalls", "list the common mistakes beginners make with"],
      ["Recall", "retrieval", "run an active-recall session on"],
      ["Feynman", "technique", "run the Feynman technique over"],
    ],
    objects: [
      ["Concept", "a concept", "concept"],
      ["Language", "a spoken language", "language"],
      ["Skill", "a practical skill", "skill"],
      ["Exam", "an exam syllabus", "exam"],
      ["Book", "a book", "book"],
      ["Course", "a course", "course"],
    ],
  },
  {
    category: "Audio",
    type: "audio",
    icon: "AudioLines",
    verbs: [
      ["Transcribe", "transcription", "transcribe with speaker labels and timestamps"],
      ["Denoise", "cleanup", "remove hiss, hum and room noise from"],
      ["Summarize", "summaries", "summarize the key points and decisions in"],
      ["Chapters", "chapters", "generate chapter markers for"],
      ["Script", "scripting", "write a tight spoken script for"],
      ["Translate", "translation", "translate and re-time the audio of"],
      ["Highlights", "highlights", "pull the most quotable moments from"],
      ["Levels", "mastering", "balance levels and loudness for"],
      ["ShowNotes", "show notes", "write show notes with links and timestamps for"],
      ["Clean", "editing", "strip filler words and false starts from"],
    ],
    objects: [
      ["Podcast", "a podcast episode", "podcast"],
      ["Interview", "an interview recording", "interview"],
      ["Voicenote", "a voice note", "voice-note"],
      ["Lecture", "a recorded lecture", "lecture"],
      ["Call", "a recorded call", "call"],
      ["Music", "a music track", "music"],
    ],
  },
  {
    category: "Video",
    type: "video",
    icon: "Clapperboard",
    verbs: [
      ["Storyboard", "storyboards", "storyboard shot by shot"],
      ["Script", "scripting", "write a timed script for"],
      ["Cutdown", "editing", "propose a tight cut-down edit of"],
      ["Captions", "captions", "generate accurate burned-in captions for"],
      ["Thumbnail", "thumbnails", "design thumbnail concepts for"],
      ["Hooks", "hooks", "write three-second hooks for"],
      ["Repurpose", "repurposing", "repurpose into platform-native clips"],
      ["Describe", "metadata", "write title, description and tags for"],
      ["Pacing", "pacing", "analyse pacing and retention risk in"],
      ["Shotlist", "production", "build a shot list and gear list for"],
    ],
    objects: [
      ["Reel", "a short vertical video", "shorts, reels"],
      ["Tutorial", "a tutorial video", "tutorial"],
      ["Ad", "a video ad", "ads"],
      ["Demo", "a product demo", "demo"],
      ["Vlog", "a vlog", "vlog"],
      ["Explainer", "an explainer video", "explainer"],
    ],
  },
  {
    category: "Marketing",
    type: "business",
    icon: "Megaphone",
    verbs: [
      ["Campaign", "campaigns", "plan a full campaign for"],
      ["Copy", "copywriting", "write conversion-focused copy for"],
      ["Seo", "seo", "build an SEO keyword and content plan for"],
      ["Calendar", "planning", "build a 30-day content calendar for"],
      ["Ads", "advertising", "write ad variants with angles for"],
      ["Funnel", "funnels", "map the acquisition funnel for"],
      ["Newsletter", "email marketing", "write a newsletter issue for"],
      ["Launch", "launches", "write a launch plan and assets list for"],
      ["Testimonial", "social proof", "turn raw praise into usable social proof for"],
      ["AB", "experiments", "design A/B test variants for"],
    ],
    objects: [
      ["Brand", "a brand", "brand"],
      ["Feature", "a new feature", "feature"],
      ["Event", "an event", "event"],
      ["Landing", "a landing page", "landing-page"],
      ["Newsletter", "a newsletter", "newsletter"],
      ["Creator", "a creator account", "creator"],
    ],
  },
  {
    category: "Design",
    type: "image",
    icon: "Palette",
    verbs: [
      ["Moodboard", "moodboards", "assemble a moodboard direction for"],
      ["Palette", "color", "propose an accessible color palette for"],
      ["Typography", "type", "pair and scale typography for"],
      ["Layout", "layout", "propose a responsive layout grid for"],
      ["Critique", "critique", "give an honest design critique of"],
      ["Icons", "iconography", "define a consistent icon set for"],
      ["Wireframe", "wireframes", "wireframe the key screens of"],
      ["Motion", "motion", "specify restrained motion and easing for"],
      ["DesignSystem", "systems", "extract reusable design tokens from"],
      ["Darkmode", "theming", "derive a dark theme from"],
    ],
    objects: [
      ["App", "an app UI", "app-ui"],
      ["Site", "a website", "web"],
      ["Deck", "a slide deck", "deck"],
      ["Poster", "a poster", "print, poster"],
      ["Brandkit", "a brand kit", "brand"],
      ["Dashboard", "a dashboard", "dashboard"],
    ],
  },
  {
    category: "Automation",
    type: "productivity",
    icon: "Workflow",
    verbs: [
      ["Automate", "automation", "design an automation that handles"],
      ["Trigger", "triggers", "define triggers and conditions for"],
      ["Webhook", "integration", "specify webhook payloads and retries for"],
      ["Sync", "syncing", "plan a two-way sync for"],
      ["Notify", "notifications", "design smart, low-noise notifications for"],
      ["Batch", "batching", "batch and schedule repetitive work in"],
      ["Failsafe", "reliability", "add retries, alerts and fallbacks to"],
      ["Map", "mapping", "map fields between systems in"],
      ["Zap", "recipes", "write a step-by-step no-code recipe for"],
      ["Audit", "audit", "audit for silent failures in"],
    ],
    objects: [
      ["Email", "an email workflow", "email"],
      ["Crm", "a CRM process", "crm"],
      ["Report", "recurring reporting", "reporting"],
      ["Intake", "an intake form process", "forms"],
      ["Backup", "a backup routine", "backup"],
      ["Deploy", "a deployment routine", "devops"],
    ],
  },
  {
    category: "Security & Privacy",
    type: "general",
    icon: "ShieldCheck",
    verbs: [
      ["Scrub", "privacy", "remove personal identifiers from"],
      ["ThreatModel", "threat modeling", "build a lightweight threat model for"],
      ["Harden", "hardening", "recommend concrete hardening steps for"],
      ["Policy", "policy", "draft a clear internal policy for"],
      ["Checklist", "checklists", "produce a security review checklist for"],
      ["Phishing", "awareness", "spot social-engineering red flags in"],
      ["Retention", "data retention", "define data retention and deletion rules for"],
      ["Consent", "consent", "write plain-language consent copy for"],
      ["Access", "access control", "design least-privilege access for"],
      ["IncidentPlan", "incident response", "write an incident response runbook for"],
    ],
    objects: [
      ["Dataset", "a dataset", "data"],
      ["App", "an application", "app"],
      ["Team", "a team process", "team"],
      ["Vendor", "a vendor relationship", "vendor"],
      ["Document", "a shared document", "document"],
      ["Account", "an online account", "account"],
    ],
  },
  {
    category: "Translation",
    type: "text",
    icon: "Languages",
    verbs: [
      ["Translate", "translation", "translate faithfully with natural phrasing"],
      ["Localize", "localization", "localize idioms, units and formats in"],
      ["BackTranslate", "quality", "back-translate to verify fidelity of"],
      ["Glossary", "terminology", "build a bilingual glossary for"],
      ["Formality", "register", "adjust formality and honorifics in"],
      ["Subtitle", "subtitles", "produce timed subtitles for"],
      ["Transliterate", "scripts", "transliterate between scripts for"],
      ["Cultural", "culture", "flag culturally sensitive wording in"],
      ["Simplify", "clarity", "translate into simple, learner-friendly language"],
      ["Bilingual", "side-by-side", "produce a bilingual side-by-side version of"],
    ],
    objects: [
      ["Text", "a text passage", "text"],
      ["Ui", "UI strings", "ui, i18n"],
      ["Doc", "a document", "document"],
      ["Support", "a support reply", "support"],
      ["Legal", "legal wording", "legal"],
      ["Menu", "a menu or listing", "menu"],
    ],
  },
  {
    category: "Math & Science",
    type: "general",
    icon: "Sigma",
    verbs: [
      ["Solve", "solving", "solve step by step and verify"],
      ["Derive", "derivations", "derive the result from first principles for"],
      ["CheckWork", "verification", "check the working and find the error in"],
      ["Visualize", "visualization", "describe the right visual intuition for"],
      ["Estimate", "estimation", "do a Fermi estimate for"],
      ["Units", "units", "convert and sanity-check units in"],
      ["Model", "modeling", "build a small quantitative model of"],
      ["Proof", "proofs", "write a rigorous proof sketch for"],
      ["Simulate", "simulation", "outline a simulation approach for"],
      ["Interpret", "interpretation", "interpret the statistical result in"],
    ],
    objects: [
      ["Equation", "an equation", "algebra"],
      ["Statistics", "a statistics problem", "statistics"],
      ["Physics", "a physics problem", "physics"],
      ["Geometry", "a geometry problem", "geometry"],
      ["Chemistry", "a chemistry problem", "chemistry"],
      ["Finance", "a finance calculation", "finance"],
    ],
  },
  {
    category: "Career",
    type: "productivity",
    icon: "UserRound",
    verbs: [
      ["Tailor", "tailoring", "tailor to the target role"],
      ["Review", "review", "critique honestly against hiring bar"],
      ["Prep", "interviews", "run focused interview prep for"],
      ["Story", "storytelling", "shape STAR-format stories from"],
      ["Outreach", "networking", "write warm, non-generic outreach for"],
      ["Negotiate", "offers", "prepare compensation negotiation for"],
      ["Gap", "growth", "identify skill gaps and a plan for"],
      ["Brand", "personal brand", "sharpen personal positioning in"],
      ["Questions", "questions", "prepare smart questions to ask about"],
      ["Plan30", "onboarding", "write a 30-60-90 day plan for"],
    ],
    objects: [
      ["Resume", "a resume", "resume, cv"],
      ["Cover", "a cover letter", "cover-letter"],
      ["Linkedin", "a LinkedIn profile", "linkedin"],
      ["Portfolio", "a portfolio", "portfolio"],
      ["Role", "a target role", "role"],
      ["Promotion", "a promotion case", "promotion"],
    ],
  },
  {
    category: "General AI",
    type: "general",
    icon: "Bot",
    verbs: [
      ["Prompt", "prompting", "turn a rough idea into a precise prompt for"],
      ["Persona", "personas", "define a system persona for"],
      ["Chain", "workflows", "chain multiple steps into one reliable flow for"],
      ["Constrain", "guardrails", "add explicit constraints and output format to"],
      ["Fewshot", "examples", "add well-chosen few-shot examples to"],
      ["Critique", "self-review", "have the model critique and revise its own output for"],
      ["Format", "formatting", "force a strict output format for"],
      ["Rubricize", "evaluation", "define pass/fail criteria for"],
      ["Reduce", "efficiency", "reduce token cost while keeping quality in"],
      ["Debug", "troubleshooting", "diagnose why the model is failing at"],
    ],
    objects: [
      ["Task", "a task", "task"],
      ["Agent", "an agent", "agent"],
      ["Chatbot", "a chatbot", "chatbot"],
      ["Summary", "a summarization job", "summarization"],
      ["Extraction", "an extraction job", "extraction"],
      ["Creative", "a creative brief", "creative"],
    ],
  },
];

/** Signature, hand-curated commands. */
const CURATED = [
  ["/HandwrittenNotesImage", "Handwritten Notes Image", "Documents & OCR", "handwriting", "document", "Turn typed text into a realistic photo of handwritten notes on paper.", "Paste the text you want handwritten and specify paper, pen and lighting.", "/HandwrittenNotesImage\nText: \"Meeting takeaways...\"\nPaper: lined A5\nPen: blue ballpoint\nLighting: soft desk lamp", ["handwriting", "notes", "image", "realistic"], "easy", true],
  ["/Explode", "Exploded View", "Image & Vision", "diagrams", "image", "Render any object as a clean exploded-view diagram with labelled parts.", "Attach or name the object and choose a label style.", "/Explode\nObject: mechanical keyboard\nLabels: numbered with legend\nStyle: technical isometric", ["diagram", "exploded", "technical", "parts"], "medium", true],
  ["/Scan", "Document Scan", "Documents & OCR", "ocr", "document", "Convert a photo of a page into a flat, deskewed, high-contrast scan.", "Attach the photo; the command flattens perspective and cleans shadows.", "/Scan\nInput: photo of a receipt\nOutput: deskewed PDF + extracted text", ["scan", "ocr", "cleanup", "pdf"], "easy", true],
  ["/100xUpscale", "100x Upscale", "Image & Vision", "upscaling", "image", "Aggressively upscale a tiny or degraded image while inventing plausible detail.", "Attach the low-res source and state how faithful the result must stay.", "/100xUpscale\nImage: old_avatar.jpg\nFidelity: keep facial identity\nOutput: 4096px PNG", ["upscale", "resolution", "restore"], "medium", true],
  ["/Summarize", "Summarize Anything", "Writing", "summaries", "text", "Compress any text into a faithful summary at the length you choose.", "Paste the text and set the target length and audience.", "/Summarize\nLength: 5 bullets\nAudience: busy executive\nText: <paste>", ["summary", "tldr", "condense"], "easy", true],
  ["/Explain", "Explain Clearly", "Learning", "explainers", "learning", "Explain any concept at the depth and reading level you ask for.", "Name the concept and your current level.", "/Explain\nConcept: vector databases\nLevel: junior developer\nUse: one analogy + one example", ["explain", "learning", "clarity"], "easy", true],
  ["/PromptImprove", "Improve My Prompt", "General AI", "prompting", "general", "Rewrite a rough prompt into a precise, well-constrained instruction.", "Paste your current prompt and what went wrong with the output.", "/PromptImprove\nPrompt: \"write me a blog post\"\nProblem: output is generic\nGoal: expert-level, 900 words", ["prompt", "meta", "quality"], "easy", true],
  ["/CleanCsv", "Clean CSV", "Data", "cleaning", "data", "Normalize headers, fix types, trim whitespace and remove duplicate rows.", "Attach the CSV and state which column is the unique key.", "/CleanCsv\nFile: contacts.csv\nKey: email\nRules: lowercase emails, ISO dates", ["csv", "cleaning", "dedupe"], "easy", true],
  ["/CodeReview", "Code Review", "Coding", "code review", "coding", "Get a senior-level review covering bugs, edge cases and readability.", "Paste the diff or file and mention the language and constraints.", "/CodeReview\nLanguage: TypeScript\nFocus: async edge cases\nCode: <paste>", ["review", "quality", "bugs"], "medium", true],
  ["/MeetingRecap", "Meeting Recap", "Productivity", "recaps", "productivity", "Turn a messy transcript into decisions, owners, dates and open questions.", "Paste the transcript or notes.", "/MeetingRecap\nTranscript: <paste>\nOutput: decisions, actions (owner + due), risks", ["meeting", "notes", "actions"], "easy", true],
  ["/Deblur", "Deblur Image", "Image & Vision", "restoration", "image", "Recover sharp edges and readable text from a motion-blurred photo.", "Attach the blurry image and say what must stay readable.", "/Deblur\nImage: whiteboard.jpg\nPriority: text legibility", ["deblur", "sharpen", "restore"], "easy", false],
  ["/TranslateDoc", "Translate Document", "Translation", "translation", "text", "Translate a full document while preserving layout, headings and terminology.", "Attach the document and set source/target languages plus glossary.", "/TranslateDoc\nFrom: English\nTo: German\nKeep: product names untranslated", ["translate", "document", "layout"], "medium", true],
  ["/DailyPlan", "Daily Plan", "Productivity", "planning", "productivity", "Turn a task dump into a realistic, energy-aware plan for the day.", "List your tasks, hard commitments and available hours.", "/DailyPlan\nHours: 6\nMeetings: 10:00, 15:30\nTasks: <list>", ["planning", "focus", "day"], "easy", true],
  ["/RegexBuild", "Build Regex", "Coding", "regex", "coding", "Generate and explain a regular expression from examples of matches and non-matches.", "Give at least three should-match and three should-not-match samples.", "/RegexBuild\nMatch: A-1234, B-9999\nNo match: AB-123, 1234\nFlavor: JavaScript", ["regex", "pattern", "parsing"], "medium", false],
  ["/SqlFromText", "SQL From Text", "Data", "sql", "data", "Turn a plain-English question into a correct, readable SQL query.", "Describe the question and paste your schema.", "/SqlFromText\nSchema: orders(id, user_id, total, created_at)\nQuestion: monthly revenue for 2025", ["sql", "query", "analytics"], "medium", true],
  ["/AltText", "Alt Text", "Image & Vision", "accessibility", "image", "Write concise, screen-reader friendly alt text for any image.", "Attach the image and state the surrounding context.", "/AltText\nImage: chart.png\nContext: quarterly revenue blog post", ["accessibility", "alt-text", "a11y"], "easy", false],
  ["/Anonymize", "Anonymize Text", "Security & Privacy", "privacy", "general", "Replace names, emails, phone numbers and IDs with consistent placeholders.", "Paste the text and choose placeholder style.", "/Anonymize\nStyle: [PERSON_1], [EMAIL_1]\nText: <paste>", ["privacy", "pii", "redaction"], "easy", true],
  ["/Storyboard", "Storyboard Video", "Video", "storyboards", "video", "Break a video idea into numbered shots with framing, action and voiceover.", "Describe the idea, length and platform.", "/Storyboard\nIdea: 45s product teaser\nPlatform: Instagram Reels", ["video", "storyboard", "shots"], "medium", true],
  ["/CompareOptions", "Compare Options", "Analysis", "comparison", "text", "Build a weighted comparison table and give a clear recommendation.", "List the options and the criteria that matter.", "/CompareOptions\nOptions: Notion, Obsidian, Craft\nCriteria: offline, collaboration, price", ["compare", "decision", "table"], "easy", true],
  ["/Rubber", "Rubber Duck", "Coding", "debugging", "coding", "Interrogate your reasoning with pointed questions until the bug surfaces.", "Describe the bug and what you have already tried.", "/Rubber\nBug: state resets on route change\nTried: memoising the provider", ["debug", "thinking", "questions"], "easy", false],
];

const DIFFICULTIES = ["easy", "medium", "advanced"];

/** @type {Command[]} */
const commands = [];
const seen = new Set();

function push(cmd) {
  const key = cmd.command.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  commands.push(cmd);
}

const slug = (s) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

for (const [command, title, category, subcategory, type, description, usage, example, tags, difficulty, featured] of CURATED) {
  push({
    id: slug(command),
    command,
    title,
    description,
    usage,
    example,
    category,
    subcategory,
    tags,
    type,
    difficulty,
    featured,
    aliases: [],
    popularity: 80 + (commands.length % 20),
  });
}

let seq = 0;
for (const cat of CATEGORIES) {
  for (const [verb, sub, phrase] of cat.verbs) {
    for (const [objName, objPhrase, objTags] of cat.objects) {
      seq += 1;
      const command = `/${verb}${objName}`;
      const title = `${verb.replace(/([a-z])([A-Z0-9])/g, "$1 $2")} ${objName}`;
      const description = `${capitalize(phrase)} ${objPhrase}.`;
      const usage = `Provide ${objPhrase} plus any constraints (audience, format, length). The command will ${phrase} ${objPhrase} and return a structured, ready-to-use result.`;
      const example = `${command}\nInput: ${objPhrase}\nGoal: ${phrase} ${objPhrase}\nConstraints: keep it concise, return ${cat.type === "data" ? "a table" : "clear sections"}\nOutput: ${sub} result`;
      push({
        id: slug(command),
        command,
        title,
        description,
        usage,
        example,
        category: cat.category,
        subcategory: sub,
        tags: dedupe([
          ...objTags.split(",").map((t) => t.trim()),
          sub.split(" ")[0],
          verb.toLowerCase(),
          cat.type,
        ]),
        type: cat.type,
        difficulty: DIFFICULTIES[seq % 3],
        featured: false,
        aliases: [`/${verb.toLowerCase()}-${objName.toLowerCase()}`],
        popularity: 20 + ((seq * 37) % 60),
      });
    }
  }
}

/** Cross-cutting modifier commands to round out the catalog past 1,000. */
const MODIFIERS = [
  ["Fast", "run a faster, lower-cost pass of", "speed"],
  ["Pro", "run an expert-grade, deeply detailed pass of", "advanced"],
  ["Batch", "apply the same operation across many items for", "batch"],
];
const modBase = commands.filter((c) => !c.featured);
for (const [suffix, phrase, tag] of MODIFIERS) {
  for (const base of modBase) {
    if (commands.length >= 1080) break;
    const command = `${base.command}${suffix}`;
    push({
      id: slug(command),
      command,
      title: `${base.title} (${suffix})`,
      description: `${capitalize(phrase)} ${lower(base.description).replace(/\.$/, "")}.`,
      usage: `Same inputs as ${base.command}, but ${phrase} the job. ${suffix === "Batch" ? "Pass a list or folder instead of a single item." : suffix === "Fast" ? "Best when you need a quick draft rather than a final answer." : "Best when quality matters more than speed."}`,
      example: `${command}\n${base.example.split("\n").slice(1).join("\n")}\nMode: ${suffix.toLowerCase()}`,
      category: base.category,
      subcategory: base.subcategory,
      tags: dedupe([...base.tags, tag]),
      type: base.type,
      difficulty: suffix === "Pro" ? "advanced" : base.difficulty,
      featured: false,
      aliases: [],
      popularity: Math.max(5, base.popularity - 10),
    });
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function lower(s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
function dedupe(arr) {
  return [...new Set(arr.filter(Boolean))];
}

// deterministic "newest" ordering metadata
commands.forEach((c, i) => {
  c.addedAt = new Date(Date.UTC(2026, 0, 1) + i * 3600_000 * 3).toISOString().slice(0, 10);
});

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/commands.json", JSON.stringify(commands, null, 0));

const byCat = {};
for (const c of commands) byCat[c.category] = (byCat[c.category] ?? 0) + 1;
console.log(`Total commands: ${commands.length}`);
console.log(byCat);
const meta = CATEGORIES.map((c) => ({ category: c.category, icon: c.icon, type: c.type }));
writeFileSync("src/data/categories.json", JSON.stringify(meta, null, 2));
