/**
 * Generates src/data/commands.json and src/data/categories.json — the SlashAI catalog.
 *
 * Run:      bun scripts/generate-commands.mjs
 * Validate: bun scripts/validate-catalog.mjs
 *
 * The taxonomy lives in scripts/catalog/part-*.mjs (category -> group -> verbs x objects).
 * See src/data/README.md for how to add commands.
 */
import { writeFileSync, mkdirSync } from "node:fs";

import part1 from "./catalog/part-1.mjs";
import part2 from "./catalog/part-2.mjs";
import part3 from "./catalog/part-3.mjs";
import part4 from "./catalog/part-4.mjs";

const CATEGORIES = [...part1, ...part2, ...part3, ...part4];

/** Signature, hand-written commands shown as featured entries. */
const CURATED = [
  [
    "/HandwrittenNotesImage",
    "Handwritten Notes Image",
    "Documents & OCR",
    "Handwriting",
    "document",
    "Turn typed text into a realistic photo of handwritten notes on paper.",
    "Paste the text you want handwritten, then pick paper stock, pen and lighting so the render looks photographed rather than generated.",
    '/HandwrittenNotesImage\nText: "Meeting takeaways: ship beta Friday, freeze scope"\nPaper: lined A5, slightly creased\nPen: blue ballpoint, medium pressure\nLighting: soft desk lamp from the left',
    ["handwriting", "notes", "image", "realistic"],
    "easy",
    true,
  ],
  [
    "/Explode",
    "Exploded View",
    "Image & Vision",
    "Diagrams",
    "image",
    "Render any object as a clean exploded-view diagram with labelled parts.",
    "Name or attach the object, say how deep the teardown should go, and choose whether labels sit inline or in a legend.",
    "/Explode\nObject: mechanical keyboard\nDepth: switch, keycap, plate, PCB\nLabels: numbered with legend\nStyle: technical isometric, light background",
    ["diagram", "exploded", "technical", "parts"],
    "medium",
    true,
  ],
  [
    "/Scan",
    "Document Scan",
    "Documents & OCR",
    "OCR",
    "document",
    "Convert a photo of a page into a flat, deskewed, high-contrast scan.",
    "Attach the phone photo; state whether you need a searchable PDF, plain text, or both, and whether shadows should be flattened to pure white.",
    "/Scan\nInput: IMG_2841.jpg — tilted photo of a receipt\nFix: perspective, shadow, contrast\nOutput: deskewed PDF + extracted line items",
    ["scan", "ocr", "cleanup", "pdf"],
    "easy",
    true,
  ],
  [
    "/100xUpscale",
    "100x Upscale",
    "Image & Vision",
    "Upscaling",
    "image",
    "Aggressively upscale a tiny or degraded image while inventing plausible detail.",
    "Attach the low-res source and say what must stay faithful (identity, logo shape, text) versus what may be reimagined.",
    "/100xUpscale\nImage: old_avatar.jpg — 64×64, heavy JPEG artifacts\nKeep faithful: facial identity, hair line\nOutput: 4096px PNG + artifact report",
    ["upscale", "resolution", "restore"],
    "medium",
    true,
  ],
  [
    "/Summarize",
    "Summarize Anything",
    "Writing & Communication",
    "Summaries",
    "text",
    "Compress any text into a faithful summary at the length and reading level you choose.",
    "Paste the source, then set target length, audience and whether quotes or numbers must be preserved verbatim.",
    "/Summarize\nLength: 5 bullets, max 18 words each\nAudience: busy executive\nKeep verbatim: revenue figures\nText: <paste>",
    ["summary", "tldr", "condense"],
    "easy",
    true,
  ],
  [
    "/Explain",
    "Explain Clearly",
    "Learning & Education",
    "Explainers",
    "learning",
    "Explain any concept at the depth and reading level you ask for.",
    "Name the concept and your current level; add one thing you already understand so the explanation can build on it.",
    "/Explain\nConcept: vector databases\nLevel: junior developer who knows SQL\nFormat: one analogy, one worked example, one gotcha",
    ["explain", "learning", "clarity"],
    "easy",
    true,
  ],
  [
    "/PromptImprove",
    "Improve My Prompt",
    "General AI",
    "Prompting",
    "general",
    "Rewrite a rough prompt into a precise, well-constrained instruction.",
    "Paste your current prompt plus a sample of the disappointing output, so the rewrite targets the actual failure.",
    '/PromptImprove\nPrompt: "write me a blog post"\nBad output: generic listicle, no specifics\nGoal: 900 words, practitioner voice, one original framework',
    ["prompt", "meta", "quality"],
    "easy",
    true,
  ],
  [
    "/CleanCsv",
    "Clean CSV",
    "Data & Analytics",
    "Cleaning",
    "data",
    "Normalize headers, fix types, trim whitespace and remove duplicate rows.",
    "Attach the CSV, name the column that uniquely identifies a row, and list any formats that must be enforced.",
    "/CleanCsv\nFile: contacts.csv — 12,400 rows\nUnique key: email\nRules: lowercase emails, ISO-8601 dates, strip trailing spaces\nReport: rows dropped and why",
    ["csv", "cleaning", "dedupe"],
    "easy",
    true,
  ],
  [
    "/CodeReview",
    "Code Review",
    "Coding & Development",
    "Code Review",
    "coding",
    "Get a senior-level review covering bugs, edge cases and readability.",
    "Paste the diff or file, name the language and runtime, and say which failure would hurt most in production.",
    "/CodeReview\nLanguage: TypeScript (Node 22)\nWorst case: duplicate charges on retry\nCode: <paste diff>",
    ["review", "quality", "bugs"],
    "medium",
    true,
  ],
  [
    "/MeetingRecap",
    "Meeting Recap",
    "Productivity",
    "Recaps",
    "productivity",
    "Turn a messy transcript into decisions, owners, dates and open questions.",
    "Paste the transcript or raw notes and list the attendees so owners can be attributed correctly.",
    "/MeetingRecap\nAttendees: Sara (PM), Dan (eng), Mei (design)\nTranscript: <paste>\nOutput: decisions, actions with owner + due date, unresolved questions",
    ["meeting", "notes", "actions"],
    "easy",
    true,
  ],
  [
    "/Deblur",
    "Deblur Image",
    "Image & Vision",
    "Restoration",
    "image",
    "Recover sharp edges and readable text from a motion-blurred photo.",
    "Attach the blurry frame and point at the region that has to become legible — sharpening is prioritised there.",
    "/Deblur\nImage: whiteboard.jpg — handheld, 1/15s shutter\nPriority region: top-left column of text\nAvoid: halo artifacts",
    ["deblur", "sharpen", "restore"],
    "easy",
    false,
  ],
  [
    "/TranslateDoc",
    "Translate Document",
    "Translation & Languages",
    "Translation",
    "text",
    "Translate a full document while preserving layout, headings and terminology.",
    "Attach the document, set source and target language, and paste any glossary or do-not-translate list.",
    "/TranslateDoc\nFrom: English\nTo: German (formal Sie)\nDo not translate: product names, SKU codes\nKeep: heading hierarchy and table layout",
    ["translate", "document", "layout"],
    "medium",
    true,
  ],
  [
    "/DailyPlan",
    "Daily Plan",
    "Productivity",
    "Planning",
    "productivity",
    "Turn a task dump into a realistic, energy-aware plan for the day.",
    "List your tasks, fixed commitments and honest available hours; flag which task you dread so it can be placed well.",
    "/DailyPlan\nHours available: 6\nFixed: standup 10:00, client call 15:30\nDreaded task: expense report\nTasks: <list>",
    ["planning", "focus", "day"],
    "easy",
    true,
  ],
  [
    "/RegexBuild",
    "Build Regex",
    "Coding & Development",
    "Regex",
    "coding",
    "Generate and explain a regular expression from examples of matches and non-matches.",
    "Give at least three strings that must match and three that must not, plus the regex flavour you target.",
    "/RegexBuild\nMatch: A-1234, B-9999, Z-0001\nNo match: AB-123, 1234, a-1234\nFlavor: JavaScript\nWant: named capture group for the letter",
    ["regex", "pattern", "parsing"],
    "medium",
    false,
  ],
  [
    "/SqlFromText",
    "SQL From Text",
    "Data & Analytics",
    "SQL",
    "data",
    "Turn a plain-English question into a correct, readable SQL query.",
    "Paste the relevant table definitions and ask the question the way you would ask a colleague.",
    "/SqlFromText\nSchema: orders(id, user_id, total_cents, created_at), users(id, country)\nQuestion: monthly revenue per country for 2025, excluding refunds\nDialect: Postgres",
    ["sql", "query", "analytics"],
    "medium",
    true,
  ],
  [
    "/AltText",
    "Alt Text",
    "Image & Vision",
    "Accessibility",
    "image",
    "Write concise, screen-reader friendly alt text for any image.",
    "Attach the image and describe the surrounding content, since good alt text depends on what the page already says.",
    "/AltText\nImage: revenue_chart.png\nPage context: blog post already states Q4 revenue in the paragraph above\nLimit: 125 characters",
    ["accessibility", "alt-text", "a11y"],
    "easy",
    false,
  ],
  [
    "/Anonymize",
    "Anonymize Text",
    "Security & Privacy",
    "Privacy",
    "general",
    "Replace names, emails, phone numbers and IDs with consistent placeholders.",
    "Paste the text and choose the placeholder style; the same person keeps the same token throughout.",
    "/Anonymize\nStyle: [PERSON_1], [EMAIL_1], [ORG_1]\nAlso mask: order numbers\nText: <paste support thread>",
    ["privacy", "pii", "redaction"],
    "easy",
    true,
  ],
  [
    "/Storyboard",
    "Storyboard Video",
    "Video",
    "Storyboards",
    "video",
    "Break a video idea into numbered shots with framing, action and voiceover.",
    "Describe the idea, the runtime and the platform; say whether you shoot on phone or with a crew.",
    "/Storyboard\nIdea: 45s product teaser\nPlatform: Instagram Reels, 9:16\nShot on: iPhone, single operator\nTone: calm, no hard sell",
    ["video", "storyboard", "shots"],
    "medium",
    true,
  ],
  [
    "/CompareOptions",
    "Compare Options",
    "Data & Analytics",
    "Comparison",
    "text",
    "Build a weighted comparison table and give a clear recommendation.",
    "List the options and the criteria that matter, with rough weights if some criteria dominate.",
    "/CompareOptions\nOptions: Notion, Obsidian, Craft\nCriteria: offline (40%), collaboration (35%), price (25%)\nOutput: scored table + one-line verdict",
    ["compare", "decision", "table"],
    "easy",
    true,
  ],
  [
    "/Rubber",
    "Rubber Duck",
    "Coding & Development",
    "Debugging",
    "coding",
    "Interrogate your reasoning with pointed questions until the bug surfaces.",
    "Describe the bug, what you already tried, and what you believe is happening — the questions attack that belief.",
    "/Rubber\nBug: state resets on route change\nBelief: the provider remounts\nTried: memoising the provider, logging in useEffect",
    ["debug", "thinking", "questions"],
    "easy",
    false,
  ],
];

const DIFFICULTIES = ["easy", "medium", "advanced"];

/** @type {any[]} */
const commands = [];
const seen = new Set();

function push(cmd) {
  const key = cmd.command.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  commands.push(cmd);
  return true;
}

const slug = (s) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const dedupe = (arr) => [...new Set(arr.filter(Boolean))];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

for (const [
  command,
  title,
  category,
  subcategory,
  type,
  description,
  howToUse,
  example,
  tags,
  difficulty,
  featured,
] of CURATED) {
  push({
    id: slug(command),
    command,
    title,
    description,
    howToUse,
    example,
    category,
    subcategory,
    tags,
    type,
    difficulty,
    featured,
    aliases: [],
    popularity: 82 + (commands.length % 18),
  });
}

let seq = 0;
for (const cat of CATEGORIES) {
  for (const group of cat.groups) {
    for (const [verb, sub, phrase, ask, deliverable] of group.verbs) {
      for (const [objName, objPhrase, objTags, sample] of group.objects) {
        seq += 1;
        const command = `/${verb}${objName}`;
        const h = hash(command);
        const title = `${verb.replace(/([a-z])([A-Z0-9])/g, "$1 $2")} ${objName}`;
        // prefer the first clause of the sample so descriptions never end mid-phrase
        const firstClause = sample.split(/[,;–—]/)[0].trim();
        const shortSample = (
          firstClause.split(/\s+/).length >= 3
            ? firstClause.split(/\s+/).slice(0, 10).join(" ")
            : sample.split(/\s+/).slice(0, 10).join(" ")
        ).replace(/[.,;:]+$/, "");
        const description = `${capitalize(phrase)} ${objPhrase} — e.g. ${shortSample}.`;

        const howToUse = [
          `${ask} Bring ${objPhrase} — for example ${sample}. You get back ${deliverable}.`,
          `Start from ${objPhrase} such as ${sample}. ${ask} The result is ${deliverable}.`,
          `${ask} Works on ${objPhrase} (${sample}); the reply is ${deliverable}.`,
        ][h % 3];

        const example = [
          `${command}\nInput: ${sample}\nAsk: ${ask}\nReturn: ${deliverable}`,
          `${command}\n${objName}: ${sample}\nNotes: ${ask}\nOutput: ${deliverable}`,
          `${command}\nSource: ${sample}\nRequirements: ${ask}\nDeliverable: ${deliverable}`,
        ][h % 3];

        push({
          id: slug(command),
          command,
          title,
          description,
          howToUse,
          example,
          category: cat.category,
          subcategory: sub,
          tags: dedupe([
            ...objTags.split(",").map((t) => t.trim().toLowerCase()),
            sub.split(" ")[0].toLowerCase(),
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
}

// deterministic "newest" ordering metadata
commands.forEach((c, i) => {
  c.addedAt = new Date(Date.UTC(2026, 0, 1) + i * 3600_000 * 3).toISOString().slice(0, 10);
});

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/commands.json", JSON.stringify(commands, null, 0));

// subcategory lists come from the generated data so curated entries stay registered
const subsByCategory = {};
for (const c of commands) (subsByCategory[c.category] ??= new Set()).add(c.subcategory);

const meta = CATEGORIES.map((c) => ({
  category: c.category,
  icon: c.icon,
  type: c.type,
  subcategories: [...(subsByCategory[c.category] ?? [])].sort(),
}));
writeFileSync("src/data/categories.json", JSON.stringify(meta, null, 2));

const byCat = {};
for (const c of commands) byCat[c.category] = (byCat[c.category] ?? 0) + 1;
console.log(`Total commands: ${commands.length}`);
console.table(byCat);
