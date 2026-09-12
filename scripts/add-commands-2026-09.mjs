/**
 * Adds a batch of new, trending-oriented commands to src/data/commands.json.
 * Run: bun scripts/add-commands-2026-09.mjs
 * Idempotent: skips any command whose name already exists.
 */
import fs from "node:fs";

const FILE = "src/data/commands.json";
const catalog = JSON.parse(fs.readFileSync(FILE, "utf8"));

const existingNames = new Set(catalog.map((c) => c.command.toLowerCase()));
const existingIds = new Set(catalog.map((c) => c.id));

// [name, category, subcategory, title, description, howToUse, example, type, difficulty, tags]
const BATCH = [
  // ── AI Agents & Prompting ──
  ["/AgentSwarmPlan", "AI Agents & Prompting", "Agent Architecture",
    "Agent Swarm Plan",
    "Design a multi-agent swarm that splits one big job across specialist roles - researcher, writer, checker - then reassembles the results.",
    "Describe the overall job and any tool limits. Output: role cards, hand-off rules and a merge plan you can paste into any agent framework.",
    "/AgentSwarmPlan\nJob: weekly market digest from 20 sources\nOutput: 3 role cards, hand-off protocol, merge checklist",
    "general", "advanced", ["agents", "swarm", "orchestration", "architecture"]],
  ["/ContextBudget", "AI Agents & Prompting", "Prompt Authoring",
    "Context Budget",
    "Compresses any task into a token budget - what to keep, what to summarise, what to drop - so long projects stop overflowing.",
    "Paste the material and your token limit. Output: a prioritised packing list with estimated token counts per section.",
    "/ContextBudget\nInput: 40-page spec + chat history\nBudget: 8k tokens\nOutput: packing plan, 6k core, 2k summary",
    "general", "medium", ["context", "tokens", "optimisation", "long-documents"]],
  ["/RedTeamMyPrompt", "AI Agents & Prompting", "Prompt Authoring",
    "Red Team My Prompt",
    "Attacks your prompt the way an adversarial user would - injections, edge cases, contradictions - then returns a hardened rewrite.",
    "Paste your current prompt. Output: 5 attack attempts, what broke, and a hardened version with guardrails.",
    "/RedTeamMyPrompt\nInput: my summariser prompt\nOutput: 5 exploits + hardened rewrite",
    "general", "advanced", ["red-team", "security", "prompt-hardening", "testing"]],
  ["/ToolRouter", "AI Agents & Prompting", "Agent Architecture",
    "Tool Router",
    "Maps which questions in your workflow should go to which model or tool - cheap model, frontier model, search or calculator - to cut cost without cutting quality.",
    "List your recurring tasks. Output: a routing table with cost estimates per 1,000 calls.",
    "/ToolRouter\nTasks: classify tickets, draft replies, summarise calls\nOutput: routing table + monthly cost curve",
    "general", "medium", ["routing", "cost", "model-selection", "workflow"]],

  // ── Content & Social Media ──
  ["/PodcastClips", "Content & Social Media", "Repurposing",
    "Podcast Clips",
    "Turns a podcast transcript into 10 short-form clip scripts with hook lines, captions and hashtags - ready for Reels, Shorts and TikTok.",
    "Paste the transcript or a chunk of it. Output: 10 clip cards, each with a 3-second hook, a caption and 5 hashtags.",
    "/PodcastClips\nInput: 45-min episode transcript\nOutput: 10 clip scripts + captions + hashtags",
    "text", "easy", ["podcast", "clips", "shorts", "repurpose", "social"]],
  ["/CarouselScript", "Content & Social Media", "Drafting",
    "Carousel Script",
    "Writes a 8-slide Instagram or LinkedIn carousel: scroll-stopping cover, one idea per slide, and a CTA closer.",
    "Give the topic and audience. Output: slide-by-slide copy under 25 words each, with a cover hook and closing CTA.",
    "/CarouselScript\nTopic: why portfolios beat CVs\nAudience: junior devs\nOutput: 8 slides + CTA",
    "text", "easy", ["carousel", "instagram", "linkedin", "slides"]],
  ["/NewsletterFuel", "Content & Social Media", "Planning",
    "Newsletter Fuel",
    "Generates 4 weeks of newsletter issues from one theme: subject lines, outline, one deep section and one quick-win per issue.",
    "State the theme and your audience. Output: 4 issue skeletons with subject-line variants.",
    "/NewsletterFuel\nTheme: building in public\nOutput: 4 weekly issues, each with 3 subject lines",
    "text", "easy", ["newsletter", "email", "planning", "content-calendar"]],
  ["/TrendJackSafe", "Content & Social Media", "Strategy",
    "Trend Jack Safe",
    "Checks a trending topic against your brand voice and flags the angles that will age badly - then scripts the safe ones.",
    "Name the trend and your brand. Output: skip/wary/go verdict per angle, plus 3 ready-to-post safe scripts.",
    "/TrendJackSafe\nTrend: <current meme format>\nBrand: indie dev tools\nOutput: verdicts + 3 scripts",
    "text", "medium", ["trending", "brand-safety", "viral", "timing"]],

  // ── Image & Vision ──
  ["/HeadshotPro", "Image & Vision", "Retouch",
    "Headshot Pro",
    "Writes the exact prompt recipe for turning a casual selfie into a studio-grade professional headshot - lighting, lens, background and wardrobe included.",
    "Describe your photo and the job context. Output: a copy-ready image-model prompt plus negative prompt.",
    "/HeadshotPro\nInput: selfie, target = LinkedIn, navy blazer\nOutput: image prompt + negative prompt",
    "image", "easy", ["headshot", "portrait", "professional", "photo"]],
  ["/SceneRecreate", "Image & Vision", "Style Transfer",
    "Scene Recreate",
    "Reverse-engineers any image you love into a full generation prompt: composition, lighting, mood, lens and palette.",
    "Upload or describe the reference image. Output: a structured prompt with 6 style knobs you can tweak.",
    "/SceneRecreate\nInput: cyberpunk street at monsoon\nOutput: prompt with composition/light/lens/palette blocks",
    "image", "medium", ["style", "reference", "prompt-recipe", "composition"]],
  ["/ProductShot", "Image & Vision", "Enhance",
    "Product Shot",
    "Builds studio-grade product photo prompts - seamless background, softbox reflections and hero-angle specs for ecommerce listings.",
    "Name the product, surface material and vibe. Output: 3 prompt variants (clean, lifestyle, dramatic).",
    "/ProductShot\nProduct: copper water bottle\nOutput: 3 prompts - clean/lifestyle/dramatic",
    "image", "easy", ["product", "ecommerce", "photography", "listing"]],

  // ── Video ──
  ["/HookLab", "Video", "Hooks",
    "Hook Lab",
    "Generates 15 first-3-second hooks for your video ranked by scroll-stop power, each with a matching thumbnail line.",
    "Describe the video topic and platform. Output: 15 hooks in 5 styles (question, shock, stat, story, contrarian).",
    "/HookLab\nTopic: how I learnt Japanese in 6 months\nOutput: 15 ranked hooks + thumbnail text",
    "text", "easy", ["hooks", "youtube", "retention", "thumbnail", "shorts"]],
  ["/MovieScene", "Video", "Scripting",
    "Movie Scene",
    "Rewrites your idea as a cinematic scene: shot list, camera moves, dialogue beats and a score cue - trailer energy guaranteed.",
    "Give the premise and mood. Output: a 60-90 second scene with 6 shots, dialogue and a music cue.",
    "/MovieScene\nPremise: chai stall time-travel meet-cute\nMood: warm, rainy, nostalgic\nOutput: 6-shot scene + score cue",
    "text", "medium", ["cinematic", "scene", "storyboard", "trailer", "film"]],
  ["/VeoScene", "Video", "Production",
    "Veo Scene",
    "Writes production-ready prompts for AI video models (Veo/Sora/Kling): subject, action, camera path, lighting and duration in one block.",
    "Describe the shot you want. Output: a model-ready prompt plus a fallback simpler variant.",
    "/VeoScene\nShot: drone over Kerala backwaters at sunrise\nOutput: veo prompt + simple fallback",
    "video", "medium", ["veo", "sora", "video-generation", "prompt", "camera"]],

  // ── Writing & Communication ──
  ["/ToneShifter", "Writing & Communication", "Tone",
    "Tone Shifter",
    "Rewrites any message into 5 tones - warm, direct, formal, playful, apologetic - side by side so you pick the right one in seconds.",
    "Paste the draft. Output: a 5-row comparison table with a use-when note per tone.",
    "/ToneShifter\nDraft: sorry for the delay update\nOutput: 5 tone versions + when-to-use notes",
    "text", "easy", ["tone", "rewriting", "email", "communication"]],
  ["/Blurbify", "Writing & Communication", "Headlines",
    "Blurbify",
    "Turns one piece of content into 10 platform-native blurbs: X thread opener, LinkedIn post, YouTube title, Instagram caption and more.",
    "Paste the content. Output: 10 blurbs, each fitted to platform norms and length limits.",
    "/Blurbify\nContent: my new pomodoro app launch post\nOutput: 10 platform-native blurbs",
    "text", "easy", ["repurpose", "headlines", "social", "copywriting"]],

  // ── Coding & Development ──
  ["/CodeSimplify", "Coding & Development", "Refactoring",
    "Code Simplify",
    "Refactors for readability without changing behaviour: fewer branches, clearer names, dead code out - with a diff-style explanation.",
    "Paste the code. Output: simplified version plus bullet notes on each change and why it is safe.",
    "/CodeSimplify\nInput: 80-line nested callback module\nOutput: flat version + change notes",
    "coding", "medium", ["refactoring", "readability", "clean-code"]],
  ["/BugReplay", "Coding & Development", "Debugging",
    "Bug Replay",
    "Turns a stack trace plus your hunch into a step-by-step reproduction script, the 3 most likely root causes and a patch for each.",
    "Paste the error, relevant code and what you already tried. Output: repro steps, ranked causes, patch options.",
    "/BugReplay\nError: hydration mismatch in React 19\nTried: suppressing on that subtree\nOutput: repro + 3 causes + patches",
    "coding", "medium", ["debugging", "reproduction", "root-cause", "patch"]],
  ["/TestPilot", "Coding & Development", "Testing",
    "Test Pilot",
    "Writes the test suite you were avoiding: happy paths, edge cases and one property-based test per function, in your framework.",
    "Paste the functions and name your test runner. Output: a ready-to-run suite with coverage notes.",
    "/TestPilot\nInput: cart pricing module, vitest\nOutput: suite incl. property test for totals",
    "coding", "medium", ["testing", "unit-tests", "vitest", "coverage"]],
  ["/MigrationMap", "Coding & Development", "Migration",
    "Migration Map",
    "Plans any framework or version migration in safe stages: what to freeze, what to codemod, what to rewrite - with a rollback point per stage.",
    "State the from/to versions and repo size. Output: staged plan with effort estimates and rollback triggers.",
    "/MigrationMap\nFrom: Next 14 pages router → app router, 120 routes\nOutput: 5-stage plan + rollback points",
    "coding", "advanced", ["migration", "upgrade", "codemod", "plan"]],

  // ── Learning & Education ──
  ["/FeynmanLoop", "Learning & Education", "Technique",
    "Feynman Loop",
    "Runs the Feynman technique on any topic: you explain, it pokes holes, you refine - until your explanation survives 3 rounds.",
    "Name the topic. It asks you to explain; it challenges weak spots; after 3 clean rounds you get a summary sheet.",
    "/FeynmanLoop\nTopic: how HTTPS actually works\nOutput: 3 challenge rounds + final cheat-sheet",
    "learning", "easy", ["feynman", "learning", "teaching", "mastery"]],
  ["/SkillSprint", "Learning & Education", "Curricula",
    "Skill Sprint",
    "Builds a 7-day sprint to a usable skill level: 30-60 min a day, one deliverable per day, and a 'you can now' checklist at the end.",
    "Name the skill and minutes per day. Output: 7 day cards with task, resource type and daily deliverable.",
    "/SkillSprint\nSkill: Figma basics\nTime: 45 min/day\nOutput: 7-day sprint with daily deliverables",
    "learning", "easy", ["sprint", "curriculum", "skill", "7-days"]],
  ["/ConfusionFinder", "Learning & Education", "Pitfalls",
    "Confusion Finder",
    "Lists the 8 things learners most often get wrong about your topic - with the one-line correction for each, before you learn it wrong.",
    "Name the topic. Output: 8 misconceptions ranked by how damaging they are, each with a crisp correction.",
    "/ConfusionFinder\nTopic: machine learning basics\nOutput: 8 misconceptions + corrections",
    "learning", "easy", ["misconceptions", "pitfalls", "corrections", "study"]],

  // ── Money & Finance ──
  ["/SipVsLumpsum", "Money & Finance", "Decisions",
    "SIP vs Lumpsum",
    "Compares SIP and lumpsum investing for your amount and horizon under 3 return scenarios - with the honest caveats, not dreams.",
    "Enter amount, horizon and risk comfort. Output: side-by-side table at 8/12/15% plus when each approach wins.",
    "/SipVsLumpsum\nAmount: 100000, Horizon: 10y\nOutput: comparison at 8/12/15% + guidance",
    "data", "easy", ["sip", "lumpsum", "investing", "mutual-funds", "comparison"]],
  ["/NoSpendWeek", "Money & Finance", "Budgeting",
    "No-Spend Week",
    "Designs a personalised no-spend week: pre-authorised exceptions, a daily two-minute check-in script and a Sunday review ritual.",
    "List your usual leak categories. Output: a 7-day plan with rules, exception list and a review template.",
    "/NoSpendWeek\nLeaks: food delivery, impulse shopping\nOutput: 7-day plan + exceptions + review",
    "general", "easy", ["budget", "no-spend", "savings", "habits"]],
  ["/FreelanceRate", "Money & Finance", "Planning",
    "Freelance Rate",
    "Calculates your real hourly floor from rent, taxes, buffer and holidays - then prices three package tiers around it.",
    "Enter expenses, billable hours and target savings. Output: floor rate + 3 tiered packages with scope lines.",
    "/FreelanceRate\nExpenses: 60000/mo, hours: 100/mo\nOutput: floor rate + starter/growth/premium packages",
    "data", "medium", ["freelance", "pricing", "rate", "packages"]],

  // ── Marketing & SEO ──
  ["/ProgramaticSEO", "Marketing & SEO", "SEO",
    "Programmatic SEO",
    "Designs a programmatic SEO play: template pattern, data sources, internal linking and the thin-content traps to avoid.",
    "Describe your niche and data advantage. Output: page pattern, dataset plan, link graph and quality checklist.",
    "/ProgramaticSEO\nNiche: city-specific salary pages\nOutput: template + data plan + QA checklist",
    "text", "advanced", ["seo", "programmatic", "templates", "organic"]],
  ["/LaunchDay", "Marketing & SEO", "Launches",
    "Launch Day",
    "Scripts your product-launch day hour by hour: what to post where, who to DM, and the exact reply templates for the first 50 comments.",
    "Describe the product and launch platform. Output: a timeline from midnight to midnight with copy blocks.",
    "/LaunchDay\nProduct: free resume tool\nPlatform: ProductHunt + X\nOutput: hour-by-hour playbook + reply templates",
    "text", "medium", ["launch", "producthunt", "playbook", "templates"]],
  ["/ColdEmailRewrite", "Marketing & SEO", "Email Marketing",
    "Cold Email Rewrite",
    "Rewrites cold emails from 'delete on sight' to 'actually replies': one observation, one reason it matters, one low-friction ask.",
    "Paste your current email. Output: 3 rewrites under 90 words each, plus a follow-up sequence.",
    "/ColdEmailRewrite\nInput: my agency pitch email\nOutput: 3 rewrites + 2-step follow-up",
    "text", "easy", ["cold-email", "outreach", "sales", "copywriting"]],

  // ── Career ──
  ["/InterviewWarRoom", "Career", "Interviews",
    "Interview War Room",
    "Builds a 5-day interview prep war room: company research sheet, 10 likely questions with your story mapped, and a mock-loop schedule.",
    "Share the role, company and your resume highlights. Output: research sheet, question bank with your examples, day plan.",
    "/InterviewWarRoom\nRole: frontend @ fintech, 4y exp\nOutput: 5-day prep plan + 10 Q&A mapped to my stories",
    "general", "medium", ["interview", "prep", "career", "questions"]],
  ["/RaiseScript", "Career", "Growth",
    "Raise Script",
    "Builds your raise case like a lawyer: market rate data, your wins translated to money, the exact script, and counters for three likely objections.",
    "List your wins, tenure and market. Output: one-page case, the ask script, and 3 objection counters.",
    "/RaiseScript\nWins: cut infra cost 30%\nOutput: case page + ask script + objection counters",
    "text", "medium", ["raise", "salary", "negotiation", "script"]],
  ["/LayoffRunway", "Career", "Personal Brand",
    "Layoff Runway",
    "Turns layoff anxiety into a 30-day runway plan: finances, portfolio refresh, outreach cadence and a mental-health floor.",
    "Share your field and rough runway. Output: week-by-week plan with daily outreach quotas and rest built in.",
    "/LayoffRunway\nField: data analyst, 3 months runway\nOutput: 30-day plan with outreach cadence",
    "general", "medium", ["layoff", "job-search", "plan", "resilience"]],

  // ── Health & Wellbeing ──
  ["/SleepDebt", "Health & Wellbeing", "Technique",
    "Sleep Debt",
    "Calculates your sleep debt from two weeks of bedtimes, then schedules a 7-day repayment plan that will not wreck your chronotype.",
    "Enter your last 14 nights (or rough hours). Output: debt total, repayment schedule and 3 anchor-time rules.",
    "/SleepDebt\nNights: avg 5.5h for 2 weeks\nOutput: debt + 7-day repayment plan",
    "data", "easy", ["sleep", "recovery", "health", "schedule"]],
  ["/DeskBodyReset", "Health & Wellbeing", "Technique",
    "Desk Body Reset",
    "Prescribes a 10-minute daily reset for desk workers: neck, hips, wrists and eyes - with a timer-friendly sequence.",
    "State your worst desk complaint. Output: a 10-minute sequence, three posture cues and an hourly nudge plan.",
    "/DeskBodyReset\nComplaint: tight hip flexors + tech neck\nOutput: 10-min sequence + cues",
    "text", "easy", ["posture", "desk", "stretching", "ergonomics"]],
];

const ADDED_AT = "2026-09-12";

let added = 0;
let skipped = 0;
for (const b of BATCH) {
  const [command, category, subcategory, title, description, howToUse, example, type, difficulty, tags] = b;
  const name = command.toLowerCase();
  if (existingNames.has(name)) { skipped++; continue; }
  const id = command.slice(1).toLowerCase();
  if (existingIds.has(id)) { skipped++; continue; }
  catalog.push({
    id,
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
    featured: false,
    aliases: [],
    popularity: 70,
    addedAt: ADDED_AT,
  });
  existingNames.add(name);
  existingIds.add(id);
  added++;
}

fs.writeFileSync(FILE, JSON.stringify(catalog, null, 2) + "\n");
console.log(`added ${added}, skipped ${skipped}, total now ${catalog.length}`);
