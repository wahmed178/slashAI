//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas-u3AZgoYC.js
/** AI — 20 ideas. */
var PART_1 = [
	{
		title: "AI Meeting Summarizer",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Turns recorded calls into decisions, owners and deadlines that land in Slack.",
		problem: "Professionals lose several hours a week writing meeting notes, and the decisions that matter get buried in a transcript nobody rereads.",
		targetUsers: "Remote teams, engineering and product managers, consultants, small agencies.",
		solution: "Upload or auto-capture the call audio, transcribe it, then summarise it into a decision log, action items with owners, and open questions, delivered to Slack, Notion or email within minutes of the call ending.",
		key: [
			"Calendar integration that pulls the agenda and attendee list",
			"Speaker-labelled transcription",
			"Action-item extraction with owner and due date",
			"Slack, Notion and email delivery",
			"Searchable archive across every past meeting"
		],
		mvp: [
			"Manual audio/video upload",
			"Transcript plus AI summary and action items",
			"Email delivery of the summary"
		],
		future: [
			"Live bot that joins Zoom and Meet automatically",
			"CRM sync so call notes attach to the deal record",
			"Cross-meeting trends: recurring blockers and stale action items"
		],
		stack: [
			"Next.js",
			"Whisper API",
			"Claude or GPT",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: ["Subscription per seat", "Usage add-on for extra transcription hours"],
		pricing: "Starter $9/mo (5 hours), Pro $29/mo (20 hours), Team $79/mo (5 seats, 100 hours).",
		acquisition: "Content aimed at 'meeting notes template' and 'action items from meetings' searches, a free single-meeting summariser as the lead magnet, and partnerships with small consultancies who resell it to clients.",
		first10: "Launch on Product Hunt, post the free summariser in r/remotework and r/productivity, DM 30 agency owners on LinkedIn offering to summarise their next five client calls for free, convert the ones who ask for more.",
		steps: [
			"Design the data model: meetings, transcripts, summaries, action items",
			"Build upload plus background transcription queue",
			"Write and tune the summarisation prompt against 20 real recordings",
			"Add email delivery and the searchable archive UI",
			"Add Slack and Notion output integrations",
			"Add billing, usage metering and a free tier limit"
		],
		risks: [
			"Zoom and Meet bot APIs have approval requirements and can change",
			"Recording consent and privacy rules differ per region",
			"Transcription accuracy drops badly on noisy calls and strong accents"
		],
		score: 8,
		tags: [
			"meetings",
			"transcription",
			"summarisation",
			"productivity"
		]
	},
	{
		title: "AI Customer Support Inbox",
		category: "AI",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Drafts replies from your own help docs and past tickets, human approves and sends.",
		problem: "Small support teams answer the same forty questions forever, and hiring for volume spikes is slow and expensive.",
		targetUsers: "Small e-commerce brands, SaaS teams under 50 people, agencies running support.",
		solution: "Connect the shared inbox and help centre, index them, and draft a grounded reply for every incoming ticket with citations to the source article, so an agent approves in one click instead of writing from scratch.",
		key: [
			"Email and chat inbox connection",
			"Retrieval over help docs and resolved tickets",
			"Draft reply with cited sources and confidence score",
			"One-click approve, edit or escalate",
			"Gap report showing questions with no documented answer"
		],
		mvp: [
			"Gmail inbox connection",
			"Upload help docs and index them",
			"AI draft reply shown next to each ticket"
		],
		future: [
			"Auto-send above a confidence threshold",
			"Multilingual replies",
			"Voice and phone deflection"
		],
		stack: [
			"Next.js",
			"Supabase with pgvector",
			"Claude or GPT",
			"Gmail API",
			"Stripe"
		],
		money: ["Subscription per seat", "Volume tier by tickets handled"],
		pricing: "Solo $19/mo (300 tickets), Team $99/mo (2,000 tickets), Scale $299/mo (10,000).",
		acquisition: "Target 'reduce support response time' content, list on Shopify and Slack app directories, and run a free audit that shows a brand how many of its last 200 tickets were repeats.",
		first10: "Run the free repeat-ticket audit for 25 Shopify brands found through BuiltWith, share the report with no pitch, and offer the first month free to the ten with the worst repeat rate.",
		steps: [
			"Build inbox ingestion and a normalised ticket model",
			"Index help docs and resolved tickets into a vector store",
			"Build the grounded draft pipeline with citations",
			"Build the agent review UI with approve, edit and escalate",
			"Add the knowledge-gap report",
			"Add billing, seats and usage limits"
		],
		risks: [
			"A confidently wrong reply damages the customer's brand, not just yours",
			"Inbox API scopes need vendor review",
			"Incumbents like Intercom ship the same feature to a bigger base"
		],
		score: 8,
		tags: [
			"support",
			"rag",
			"inbox",
			"automation"
		]
	},
	{
		title: "AI Document Q&A for Contracts",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Ask a contract questions and get answers with the exact clause quoted back.",
		problem: "Founders and freelancers sign contracts they only skim, and paying a lawyer to read every MSA and NDA is not realistic.",
		targetUsers: "Freelancers, small agencies, early-stage founders, procurement staff.",
		solution: "Upload a contract, get a plain-English summary of obligations, payment terms, termination and liability, then ask free-form questions answered with the quoted clause and page number.",
		key: [
			"PDF and DOCX upload with clause-level chunking",
			"Risk summary across standard contract sections",
			"Question answering with quoted clause and page reference",
			"Comparison against a saved baseline template",
			"Export summary to PDF for a client or lawyer"
		],
		mvp: [
			"Upload a PDF",
			"Auto summary of key terms",
			"Q&A with citations"
		],
		future: [
			"Redline suggestions for unfavourable clauses",
			"Clause library built from your own signed contracts",
			"Team workspace with approval workflow"
		],
		stack: [
			"Next.js",
			"Supabase with pgvector",
			"Claude",
			"PDF.js",
			"Stripe"
		],
		money: ["Subscription", "Pay-per-document credits for occasional users"],
		pricing: "Free 2 documents, Solo $15/mo (25 docs), Team $69/mo (unlimited, 5 seats).",
		acquisition: "SEO on 'what does this clause mean' style questions, freelancer communities, and a free NDA reviewer that requires no signup.",
		first10: "Post the free NDA reviewer in r/freelance and two Slack communities for consultants, then offer the paid tier to anyone who uploads more than three documents.",
		steps: [
			"Build the upload and parsing pipeline with clause-aware chunking",
			"Write the structured summary prompt and validate on 30 real contracts",
			"Add citation-backed Q&A",
			"Add baseline comparison",
			"Add PDF export and document history",
			"Add credits and subscription billing"
		],
		risks: [
			"Users may treat output as legal advice — disclaimers and scoping are essential",
			"Confidential documents raise storage and retention expectations",
			"Scanned PDFs need OCR and degrade answer quality"
		],
		score: 8,
		tags: [
			"contracts",
			"rag",
			"legal",
			"documents"
		]
	},
	{
		title: "AI Product Photo Studio",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Phone photos of products become clean catalogue and lifestyle shots.",
		problem: "Small sellers cannot afford a photo shoot per product, so their listings look amateur next to competitors and convert worse.",
		targetUsers: "Etsy and Shopify sellers, makers, small D2C brands, marketplace resellers.",
		solution: "Upload a phone photo, automatically cut the product out, and generate marketplace-ready variants: white background, shadowed studio, and lifestyle scenes sized for each channel.",
		key: [
			"Automatic background removal",
			"Studio and lifestyle scene presets",
			"Per-marketplace export sizes and aspect ratios",
			"Batch processing for a whole catalogue",
			"Brand kit for consistent props and colour"
		],
		mvp: [
			"Single image upload",
			"Background removal plus three scene presets",
			"PNG/JPG export"
		],
		future: [
			"Model shots for apparel",
			"Short looping product videos",
			"Direct publish to Shopify and Etsy listings"
		],
		stack: [
			"Next.js",
			"Replicate or Fal image models",
			"Cloudflare R2",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium with watermarked free exports",
			"Credit packs",
			"Subscription for volume"
		],
		pricing: "Free 5 watermarked images, Starter $12/mo (100 images), Studio $39/mo (500 images).",
		acquisition: "Before/after posts on TikTok and Instagram, Etsy seller Facebook groups, and an Etsy listing-audit lead magnet.",
		first10: "Redo the hero photo for 20 Etsy shops for free and send it unsolicited with no strings; sellers who relist with your image become the first paying customers.",
		steps: [
			"Build upload, cutout and storage pipeline",
			"Curate and test scene presets for realistic shadows",
			"Add per-marketplace export presets",
			"Add batch upload and queue processing",
			"Add credits, watermarking and billing",
			"Add brand kit and saved presets"
		],
		risks: [
			"Image generation costs eat margin if free usage is not capped",
			"Marketplaces may restrict AI-altered product imagery",
			"Cutout quality fails on transparent or reflective products"
		],
		score: 8,
		tags: [
			"images",
			"ecommerce",
			"photography",
			"generative"
		]
	},
	{
		title: "AI Resume Tailoring Assistant",
		category: "AI",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Rewrites a CV for one specific job post and shows what the screener will miss.",
		problem: "Applicants send the same generic CV everywhere and get filtered out by keyword screening before a human ever reads it.",
		targetUsers: "Job seekers, career changers, graduates, recruiters coaching candidates.",
		solution: "Paste a CV and a job description, get a keyword gap analysis, a rewritten CV tailored to the role with truthful phrasing, and a matching cover letter.",
		key: [
			"Keyword gap report against the job post",
			"Section-by-section rewrite suggestions",
			"ATS-safe formatting export",
			"Cover letter generation",
			"Version history per application"
		],
		mvp: [
			"Paste CV and job post",
			"Gap report plus rewritten bullet points",
			"DOCX export"
		],
		future: [
			"Job board integration to tailor in one click",
			"Interview question prep from the same job post",
			"Application tracker"
		],
		stack: [
			"Next.js",
			"Claude or GPT",
			"Supabase",
			"docx generation library",
			"Stripe"
		],
		money: [
			"Freemium",
			"One-time unlock per CV",
			"Monthly subscription for active searchers"
		],
		pricing: "Free 1 tailoring, $7 one-time for a single job pack, $12/mo unlimited.",
		acquisition: "SEO for 'CV for [role]' queries, TikTok and LinkedIn career-advice content, and university career-service partnerships.",
		first10: "Offer free tailoring in r/jobs and r/resumes for a week, ask each person to report back whether they got a callback, and use those results as your landing-page proof.",
		steps: [
			"Build the paste-in editor and job-post parser",
			"Build the keyword gap analysis",
			"Write the rewrite prompt with a strict no-fabrication rule",
			"Add ATS-safe DOCX and PDF export",
			"Add cover letter generation",
			"Add accounts, history and payments"
		],
		risks: [
			"AI can invent experience — guardrails and user confirmation are mandatory",
			"Crowded market with free alternatives",
			"One-off usage means weak retention unless you add tracking"
		],
		score: 7,
		tags: [
			"career",
			"resume",
			"writing",
			"job search"
		]
	},
	{
		title: "AI Study Notes from Lectures",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Records a lecture and returns structured notes, flashcards and a practice quiz.",
		problem: "Students cannot listen properly and take good notes at the same time, and revising from a two-hour recording is impractical.",
		targetUsers: "University and college students, bootcamp learners, professionals studying part-time.",
		solution: "Record or upload the lecture, transcribe it, and produce structured notes with headings, a glossary of terms, spaced-repetition flashcards and a self-test quiz.",
		key: [
			"In-app recording with background capture",
			"Structured notes with headings and key terms",
			"Auto-generated flashcards with spaced repetition",
			"Practice quiz with explanations",
			"Offline access to generated notes"
		],
		mvp: [
			"Audio upload or record",
			"Transcript plus structured notes",
			"Flashcard export"
		],
		future: [
			"Slide upload to merge with audio",
			"Class-wide shared note libraries",
			"Study streak and revision reminders"
		],
		stack: [
			"React Native or Capacitor",
			"Whisper API",
			"Claude",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium with monthly minute limit",
			"Student subscription",
			"Semester pass"
		],
		pricing: "Free 60 min/mo, Student $6/mo, Semester pass $29.",
		acquisition: "Campus ambassadors, TikTok study content, and free access during exam weeks to drive word of mouth.",
		first10: "Give the app free to two study groups on one campus, sit in on their revision session, fix what breaks, and let them share it with coursemates.",
		steps: [
			"Build recording and upload with reliable background handling",
			"Add transcription queue and cost controls",
			"Build the notes, flashcards and quiz generation prompts",
			"Add offline storage and sync",
			"Add spaced repetition scheduling",
			"Add subscriptions and free-tier metering"
		],
		risks: [
			"Some institutions prohibit recording lectures",
			"Transcription cost per student is high on a cheap price point",
			"Seasonal usage collapses outside term time"
		],
		score: 7,
		tags: [
			"education",
			"notes",
			"flashcards",
			"audio"
		]
	},
	{
		title: "AI Voice Agent for Appointment Booking",
		category: "AI",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Answers the phone for small clinics and salons and books straight into the calendar.",
		problem: "Small service businesses miss a large share of calls while serving customers in person, and every missed call is a lost booking.",
		targetUsers: "Dental and physio clinics, salons, garages, trades businesses, small law firms.",
		solution: "A phone number that answers instantly, understands the caller, checks live availability, books the slot, sends confirmation SMS and escalates anything unusual to a human callback list.",
		key: [
			"Real-time voice answering with low latency",
			"Calendar availability lookup and booking",
			"SMS confirmation and reminders",
			"Escalation queue with call recording and transcript",
			"Business hours and custom script configuration"
		],
		mvp: [
			"Single business number, one calendar",
			"Book, reschedule and cancel by voice",
			"SMS confirmation"
		],
		future: [
			"Outbound reminder and no-show recovery calls",
			"Multi-location routing",
			"Payment capture for deposits"
		],
		stack: [
			"Next.js",
			"Twilio Voice",
			"Realtime speech model",
			"Google Calendar API",
			"Supabase"
		],
		money: [
			"Monthly subscription per location",
			"Per-minute overage",
			"Setup fee"
		],
		pricing: "$99/mo per location including 300 minutes, $0.20/min after, $199 setup.",
		acquisition: "Direct outreach to local businesses, partnerships with practice-management resellers, and a missed-call audit offer.",
		first10: "Call 50 local clinics at lunchtime, count how many do not answer, then email each one that exact number with an offer of a two-week free trial.",
		steps: [
			"Build the telephony pipeline with barge-in and low-latency turn taking",
			"Integrate calendar read and write with conflict handling",
			"Write and test scripts for booking, rescheduling and unknown requests",
			"Add SMS confirmations and the human escalation queue",
			"Build the onboarding wizard for hours, services and scripts",
			"Add per-location billing and minute metering"
		],
		risks: [
			"Latency and misrecognition frustrate callers quickly",
			"Healthcare calls touch sensitive data and consent rules",
			"Per-minute model and telephony costs squeeze margin"
		],
		score: 8,
		tags: [
			"voice",
			"telephony",
			"local business",
			"booking"
		]
	},
	{
		title: "AI Code Review Bot for Small Teams",
		category: "AI",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Reviews pull requests against your own conventions, not generic lint rules.",
		problem: "Small teams have no spare senior reviewer, so pull requests either sit for days or get rubber-stamped.",
		targetUsers: "Startup engineering teams, agencies, open-source maintainers.",
		solution: "A GitHub app that reviews each pull request against a repo-specific convention file plus learned patterns from merged code, leaving inline comments on real issues and staying quiet otherwise.",
		key: [
			"Inline PR comments with suggested diffs",
			"Repo convention file the team edits",
			"Learns from previously merged reviews",
			"Severity filter to suppress noise",
			"Weekly summary of recurring issues"
		],
		mvp: [
			"GitHub app install",
			"AI review comment on new PRs",
			"Per-repo config file"
		],
		future: [
			"GitLab and Bitbucket support",
			"Security-focused review pass",
			"Auto-fix commits for trivial issues"
		],
		stack: [
			"Node.js",
			"GitHub Apps API",
			"Claude",
			"Postgres",
			"Stripe"
		],
		money: [
			"Subscription per active repo",
			"Per-seat team plan",
			"Free for public repos"
		],
		pricing: "Free for public repos, $19/mo for 3 private repos, $79/mo unlimited for one org.",
		acquisition: "GitHub Marketplace listing, free tier on open source for visibility, and dev-community content on review quality.",
		first10: "Install free on ten well-known open-source repos with maintainer permission, let the review comments be publicly visible, and convert the private-repo teams who notice.",
		steps: [
			"Build the GitHub app with webhook handling and diff fetching",
			"Design the review prompt with strict noise suppression",
			"Add the per-repo convention config",
			"Add inline comment posting with suggested changes",
			"Add the learning loop from accepted and rejected comments",
			"Add billing per repo and usage caps"
		],
		risks: [
			"Noisy reviews get muted immediately and never re-enabled",
			"Large diffs are expensive to process",
			"GitHub and Copilot ship overlapping features for free"
		],
		score: 7,
		tags: [
			"developers",
			"github",
			"code review",
			"automation"
		]
	},
	{
		title: "AI Recipe and Meal Planner from Your Fridge",
		category: "AI",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Photograph what you have and get meals you can actually cook tonight.",
		problem: "People throw away food and order takeaway because deciding what to cook from what is already in the fridge takes more energy than they have at 7pm.",
		targetUsers: "Busy households, students, single-person households, budget-conscious cooks.",
		solution: "Photograph the fridge or type ingredients, get three ranked recipes using what is on hand, with a short shopping list only for genuinely missing items.",
		key: [
			"Ingredient recognition from a photo",
			"Recipes ranked by how little you must buy",
			"Dietary and allergy filters",
			"Weekly plan with a consolidated shopping list",
			"Saved favourites and cooking history"
		],
		mvp: [
			"Type or photograph ingredients",
			"Three recipe suggestions",
			"Missing-items list"
		],
		future: [
			"Supermarket price comparison for the shopping list",
			"Household sharing",
			"Leftover-tracking reminders"
		],
		stack: [
			"Capacitor or React Native",
			"Vision model",
			"Claude",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription for meal planning",
			"Affiliate grocery links"
		],
		pricing: "Free 3 plans/week, Plus $4/mo unlimited plus weekly planning.",
		acquisition: "Short-form cooking video content, food-waste and budget-cooking communities, and app store optimisation for 'what can I cook with'.",
		first10: "Post daily 'here is my fridge, here is dinner' clips for two weeks and invite viewers into a free beta list.",
		steps: [
			"Build ingredient entry by text with a solid recipe prompt",
			"Add photo recognition and manual correction",
			"Add dietary filters and ranking by missing ingredients",
			"Add saved recipes and cooking history",
			"Add weekly planning and shopping list",
			"Add subscriptions and free limits"
		],
		risks: [
			"Photo recognition mistakes erode trust fast",
			"Very low willingness to pay in consumer cooking apps",
			"Allergy errors carry real safety consequences"
		],
		score: 6,
		tags: [
			"food",
			"consumer",
			"vision",
			"planning"
		]
	},
	{
		title: "AI Podcast Clip Finder",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Finds the shareable 40 seconds in a two-hour episode and cuts it for vertical video.",
		problem: "Podcasters know clips drive growth but scrubbing a long episode to find good moments takes longer than recording it.",
		targetUsers: "Independent podcasters, video producers, marketing teams running a show.",
		solution: "Upload the episode, get ranked candidate clips with a reason for each, then export burned-in captions and vertical framing ready for TikTok, Reels and Shorts.",
		key: [
			"Transcript with moment scoring",
			"Ranked clip candidates with rationale",
			"Auto captions with brand styling",
			"Vertical reframing with speaker tracking",
			"Direct export presets per platform"
		],
		mvp: [
			"Upload audio or video",
			"Five ranked clip suggestions with timestamps",
			"MP4 export with captions"
		],
		future: [
			"Scheduling and direct publishing",
			"Performance feedback loop that learns what worked",
			"Team review and approval"
		],
		stack: [
			"Next.js",
			"Whisper API",
			"Claude",
			"FFmpeg worker",
			"Cloudflare R2",
			"Stripe"
		],
		money: [
			"Subscription by episode volume",
			"Credit packs",
			"Agency plan"
		],
		pricing: "Solo $19/mo (4 episodes), Pro $49/mo (15 episodes), Agency $149/mo (50 episodes).",
		acquisition: "Podcast communities, free clipping for well-known small shows in exchange for a credit, and content on clip-driven growth.",
		first10: "Clip the latest episode of 20 shows with under 5,000 downloads, send the clips free, and offer a discounted annual plan to the hosts who post them.",
		steps: [
			"Build the upload and transcription pipeline",
			"Build the moment-scoring prompt and validate against clips that performed",
			"Build the FFmpeg render worker with captions and reframing",
			"Add export presets and download management",
			"Add project history and team sharing",
			"Add plans, quotas and billing"
		],
		risks: [
			"Render costs scale with episode length",
			"Established competitors with big funding",
			"Clip quality is subjective and hard to guarantee"
		],
		score: 7,
		tags: [
			"podcast",
			"video",
			"clips",
			"social"
		]
	},
	{
		title: "AI Grant and Tender Finder",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Matches your organisation to open grants and tenders and drafts the first answer set.",
		problem: "Public grant and tender portals are fragmented and badly searchable, so small organisations miss funding they qualify for.",
		targetUsers: "Nonprofits, small consultancies, research groups, small construction and IT suppliers.",
		solution: "Build a profile once, receive matched opportunities from public portals with eligibility explained in plain language, and generate first-draft answers to standard questionnaire sections.",
		key: [
			"Organisation profile with capability and certification data",
			"Daily matched opportunity feed with fit score",
			"Plain-language eligibility explanation",
			"Draft answers for common questionnaire sections",
			"Deadline calendar and reminders"
		],
		mvp: [
			"Profile setup",
			"Matched opportunity list from two public sources",
			"Email alerts"
		],
		future: [
			"Reusable answer library from past submissions",
			"Team collaboration on submissions",
			"Win/loss tracking and analytics"
		],
		stack: [
			"Next.js",
			"Scheduled scrapers",
			"Postgres with pgvector",
			"Claude",
			"Resend"
		],
		money: ["Subscription by organisation size", "Success-based add-on consulting"],
		pricing: "Starter $39/mo, Team $129/mo, Enterprise $399/mo with multiple profiles.",
		acquisition: "Nonprofit networks, chambers of commerce, LinkedIn content on funding deadlines, and a free weekly opportunity digest.",
		first10: "Run the free digest for one sector for six weeks, personally flag matches for 20 organisations, and convert those who reply.",
		steps: [
			"Map and ingest two or three public opportunity sources",
			"Build the profile model and matching pipeline",
			"Add plain-language eligibility summaries",
			"Add alerts and the deadline calendar",
			"Add draft answer generation",
			"Add billing and multi-profile support"
		],
		risks: [
			"Portal formats change and break ingestion",
			"Match quality must be high or the feed becomes noise",
			"Long sales cycles in the public sector"
		],
		score: 7,
		tags: [
			"grants",
			"tenders",
			"nonprofit",
			"matching"
		]
	},
	{
		title: "AI Interview Practice Coach",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Live mock interviews for a specific job post with scored, specific feedback.",
		problem: "Candidates rehearse alone, get no feedback, and only discover their weak answers during the real interview.",
		targetUsers: "Job seekers, graduates, career changers, bootcamp cohorts.",
		solution: "Paste the job description, run a spoken or typed mock interview with follow-up questions, and receive scored feedback per answer on structure, specificity and evidence.",
		key: [
			"Role-specific question generation from a job post",
			"Voice or text answering with follow-ups",
			"Per-answer scoring with concrete rewrites",
			"STAR structure coaching",
			"Progress tracking across sessions"
		],
		mvp: [
			"Paste job post",
			"Ten-question text mock interview",
			"Scored feedback report"
		],
		future: [
			"Video practice with pacing and filler-word analysis",
			"Bootcamp and university cohort dashboards",
			"Company-specific question banks from public sources"
		],
		stack: [
			"Next.js",
			"Claude",
			"Web Speech or realtime voice API",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium",
			"Subscription during active search",
			"Cohort licences to schools"
		],
		pricing: "Free 1 session, Job Seeker $15/mo, Cohort licence $8/seat/mo.",
		acquisition: "Career-advice content, university and bootcamp partnerships, and free sessions during graduate hiring season.",
		first10: "Offer free mock interviews to a bootcamp cohort in exchange for feedback and a testimonial, then sell the cohort licence to the school.",
		steps: [
			"Build job-post parsing and question generation",
			"Build the interview session flow with follow-up logic",
			"Build the scoring rubric and feedback prompt",
			"Add voice mode",
			"Add progress tracking and session history",
			"Add subscriptions and cohort accounts"
		],
		risks: [
			"Feedback quality must feel expert or users churn after one try",
			"Highly seasonal demand",
			"Voice adds cost and latency complexity"
		],
		score: 7,
		tags: [
			"career",
			"interview",
			"coaching",
			"voice"
		]
	},
	{
		title: "AI Knowledge Base for Internal Docs",
		category: "AI",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "One search box over Drive, Notion and Slack that answers with sources and permissions respected.",
		problem: "Company knowledge is scattered across four tools, so staff ask colleagues instead of searching and the same answer gets rewritten weekly.",
		targetUsers: "Companies of 20–300 staff, operations leads, internal IT.",
		solution: "Connect the document and chat sources, index them with the source permissions attached, and answer employee questions with citations while never surfacing content the asker cannot access.",
		key: [
			"Connectors for Drive, Notion and Slack",
			"Permission-aware retrieval",
			"Cited answers with freshness indicators",
			"Stale-content report for document owners",
			"Slack bot interface"
		],
		mvp: [
			"Google Drive connector",
			"Cited answers in a web UI",
			"Basic permission filtering"
		],
		future: [
			"More connectors",
			"Answer approval by subject experts",
			"Onboarding question packs"
		],
		stack: [
			"Next.js",
			"Postgres with pgvector",
			"Claude",
			"Google and Slack APIs",
			"Stripe"
		],
		money: [
			"Per-seat subscription",
			"Platform fee plus seats",
			"Annual contracts"
		],
		pricing: "$6/user/mo with a $99/mo platform minimum; annual discount of two months.",
		acquisition: "Outbound to operations leads, partnerships with IT managed-service providers, and content on onboarding time.",
		first10: "Offer a free 30-day pilot to ten companies in your network, measure questions answered per week, and use that number in the renewal conversation.",
		steps: [
			"Build the first connector with incremental sync",
			"Build permission-aware indexing and retrieval",
			"Build cited answering with freshness signals",
			"Add the Slack bot",
			"Add the stale-content report",
			"Add SSO, audit logs and billing"
		],
		risks: [
			"Permission leaks are a company-ending trust failure",
			"Enterprise security review slows every deal",
			"Connector maintenance is a permanent cost"
		],
		score: 7,
		tags: [
			"search",
			"rag",
			"internal tools",
			"enterprise"
		]
	},
	{
		title: "AI Social Media Reply Assistant",
		category: "AI",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Keeps a founder's social presence alive with on-brand replies queued for approval.",
		problem: "Consistent replying builds an audience faster than posting, but founders cannot spend an hour a day writing thoughtful comments.",
		targetUsers: "Solo founders, personal-brand consultants, small marketing teams.",
		solution: "Monitor a chosen list of accounts and keywords, draft on-brand replies in the user's own voice trained on their past posts, and queue them for one-tap approval.",
		key: [
			"Voice profile learned from your existing posts",
			"Monitored accounts and keyword lists",
			"Draft replies queued for approval",
			"Scheduling with natural pacing",
			"Engagement analytics per topic"
		],
		mvp: [
			"Connect one account",
			"Draft replies for a monitored list",
			"Approve and post"
		],
		future: [
			"Multi-platform support",
			"Team approvals",
			"Thread and post drafting"
		],
		stack: [
			"Next.js",
			"Platform APIs",
			"Claude",
			"Supabase",
			"Stripe"
		],
		money: ["Subscription per connected account", "Agency multi-client plan"],
		pricing: "Solo $19/mo, Pro $49/mo (3 accounts), Agency $149/mo (10 accounts).",
		acquisition: "Build in public on the platform itself using the product, plus creator communities.",
		first10: "Use it publicly for 60 days, share weekly growth numbers with screenshots, and open a waitlist that converts to founding-member pricing.",
		steps: [
			"Build the voice-profile extraction from past posts",
			"Build monitoring and candidate selection",
			"Build the reply drafting and approval queue",
			"Add pacing and scheduling",
			"Add analytics",
			"Add multi-account billing"
		],
		risks: [
			"Platform API access and pricing change without warning",
			"Automation can violate platform terms if it posts unattended",
			"Generic replies harm the brand they are meant to build"
		],
		score: 6,
		tags: [
			"social",
			"marketing",
			"writing",
			"automation"
		]
	},
	{
		title: "AI Translation and Localisation for Small Apps",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Keeps translation files in sync with your codebase and flags context problems.",
		problem: "Small teams ship English-only because managing translation files by hand across releases is tedious and error-prone.",
		targetUsers: "Indie developers, small SaaS teams, mobile app studios.",
		solution: "Watch the repository's locale files, translate new and changed keys with the surrounding UI context, flag strings that will break layout, and open a pull request with the updates.",
		key: [
			"Repo integration that detects changed keys",
			"Context-aware translation using nearby UI copy",
			"Length and layout warnings per locale",
			"Glossary for product-specific terms",
			"Pull request output for review"
		],
		mvp: [
			"Upload or connect JSON locale files",
			"Translate missing keys",
			"Download updated files"
		],
		future: [
			"Screenshot context upload",
			"Human reviewer marketplace",
			"Mobile platform formats"
		],
		stack: [
			"Node.js",
			"GitHub API",
			"Claude",
			"Postgres",
			"Stripe"
		],
		money: ["Subscription by key count", "Per-language add-on"],
		pricing: "Free 200 keys, Indie $15/mo (2,000 keys), Team $59/mo (20,000 keys).",
		acquisition: "Developer communities, an open-source CLI as the funnel, and content on i18n pitfalls.",
		first10: "Ship the free CLI, watch which repos adopt it, and email those maintainers about the hosted sync.",
		steps: [
			"Build locale file parsing for the common formats",
			"Build the context-aware translation pipeline",
			"Add the glossary and layout warnings",
			"Build the GitHub pull request integration",
			"Add the dashboard and key metering",
			"Add billing"
		],
		risks: [
			"Quality expectations vary hugely by market",
			"Existing localisation platforms are entrenched",
			"Free machine translation is good enough for many teams"
		],
		score: 6,
		tags: [
			"i18n",
			"developers",
			"translation",
			"automation"
		]
	},
	{
		title: "AI Data Cleaning Assistant for Spreadsheets",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Explains messy spreadsheet columns in plain language and fixes them reversibly.",
		problem: "Analysts and operators spend most of their time cleaning inconsistent spreadsheet exports rather than analysing them.",
		targetUsers: "Analysts, operations staff, freelance consultants, small finance teams.",
		solution: "Upload a CSV, get a profile of every column with the specific problems found, then apply suggested fixes as reversible steps that can be re-run on next month's export.",
		key: [
			"Column profiling with detected issues",
			"Suggested fixes with preview and undo",
			"Recorded recipes that re-run on new files",
			"Duplicate and fuzzy-match detection",
			"Export to CSV, Excel and Google Sheets"
		],
		mvp: [
			"CSV upload",
			"Issue detection with one-click fixes",
			"Clean file download"
		],
		future: [
			"Scheduled recipes on a watched folder",
			"Database sources",
			"Team-shared recipes"
		],
		stack: [
			"Next.js",
			"DuckDB WASM",
			"Claude",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium by file size",
			"Subscription for saved recipes",
			"Team plan"
		],
		pricing: "Free files under 5MB, Pro $18/mo, Team $69/mo.",
		acquisition: "SEO for specific cleaning tasks, spreadsheet communities, and a free in-browser cleaner with no upload.",
		first10: "Answer real cleaning questions on forums with a link to a prefilled cleaner for that exact problem.",
		steps: [
			"Build in-browser CSV parsing and profiling",
			"Build the issue detection ruleset plus AI explanations",
			"Build reversible fix steps and previews",
			"Add saved recipes and re-run",
			"Add exports and integrations",
			"Add billing and limits"
		],
		risks: [
			"Sensitive data means many users refuse uploads — local processing matters",
			"Excel and Sheets add competing AI features",
			"Edge-case files break parsing"
		],
		score: 7,
		tags: [
			"data",
			"spreadsheets",
			"cleaning",
			"analytics"
		]
	},
	{
		title: "AI Legal Letter Generator for Consumers",
		category: "AI",
		difficulty: "Beginner",
		businessModel: "One-time",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Produces firm, correctly structured complaint and dispute letters people actually send.",
		problem: "Consumers lose refunds, deposits and disputes because they do not know how to write a formal letter that gets taken seriously.",
		targetUsers: "Consumers disputing charges, tenants, small landlords, freelancers chasing invoices.",
		solution: "Answer a short guided questionnaire per scenario and receive a properly structured letter citing the relevant consumer protection principles, with a suggested escalation timeline.",
		key: [
			"Scenario-based questionnaires",
			"Correctly structured formal letters",
			"Escalation timeline with next steps",
			"PDF and email-ready output",
			"Follow-up letter for non-response"
		],
		mvp: [
			"Three scenarios",
			"Guided form to letter",
			"PDF download"
		],
		future: [
			"Regional legal variants",
			"Certified post integration",
			"Case tracking"
		],
		stack: [
			"Next.js",
			"Claude",
			"PDF generation",
			"Stripe",
			"Supabase"
		],
		money: [
			"Pay per letter",
			"Bundle of three",
			"Small subscription for landlords and freelancers"
		],
		pricing: "$5 per letter, $12 for a three-letter bundle, $9/mo unlimited for frequent users.",
		acquisition: "SEO for 'how to write a complaint letter about X', consumer forums, and free templates that upsell the tailored version.",
		first10: "Answer 30 real complaint questions on consumer forums with genuinely useful advice and a link to the matching generator.",
		steps: [
			"Pick three high-volume scenarios and research the correct structure",
			"Build the guided questionnaires",
			"Build the generation prompts with strict factual scoping",
			"Add PDF export and payment",
			"Add follow-up letters",
			"Expand scenario coverage based on demand"
		],
		risks: [
			"Must not present itself as legal advice",
			"Jurisdiction differences change what is accurate",
			"One-off purchases mean constant new-traffic dependency"
		],
		score: 6,
		tags: [
			"consumer",
			"legal",
			"letters",
			"templates"
		]
	},
	{
		title: "AI Onboarding Buddy for New Hires",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Answers a new hire's first 200 questions so their manager does not have to.",
		problem: "New starters interrupt colleagues constantly for basic answers, and managers repeat the same onboarding explanations with every hire.",
		targetUsers: "HR and people teams, engineering managers, fast-growing companies.",
		solution: "A chat assistant loaded with company handbook, tooling docs and role-specific checklists that answers new-hire questions, tracks checklist progress and escalates gaps to the buddy or manager.",
		key: [
			"Role-based 30/60/90 day checklists",
			"Grounded answers from company docs",
			"Progress tracking visible to the manager",
			"Escalation to a human buddy",
			"Unanswered-question report to improve docs"
		],
		mvp: [
			"Upload handbook",
			"Chat answers with citations",
			"One shared checklist"
		],
		future: [
			"Slack and Teams delivery",
			"HRIS integration",
			"Per-department knowledge scoping"
		],
		stack: [
			"Next.js",
			"Supabase with pgvector",
			"Claude",
			"Slack API",
			"Stripe"
		],
		money: [
			"Per-hire pricing",
			"Per-seat subscription",
			"Annual company plan"
		],
		pricing: "$29 per new hire, or $199/mo unlimited for companies hiring regularly.",
		acquisition: "HR community content on time-to-productivity, partnerships with HR consultants, and a free onboarding checklist template.",
		first10: "Give it free to five companies for their next two hires each, measure how many manager interruptions it removed, and sell that number.",
		steps: [
			"Build document ingestion and grounded chat",
			"Build role-based checklists and progress tracking",
			"Add manager dashboard and escalation",
			"Add the unanswered-question report",
			"Add Slack delivery",
			"Add per-hire billing"
		],
		risks: [
			"Usage is bursty and stops between hiring rounds",
			"Company docs are often too poor to ground good answers",
			"HR buying cycles are slow at small companies"
		],
		score: 7,
		tags: [
			"hr",
			"onboarding",
			"rag",
			"internal tools"
		]
	},
	{
		title: "AI Property Listing Writer",
		category: "AI",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Photos plus facts in, compliant and compelling listing copy out, in every required format.",
		problem: "Agents write the same listing description five times for five portals and each has different length and tone requirements.",
		targetUsers: "Estate agents, letting agents, property managers, private sellers.",
		solution: "Enter property facts and upload photos, get portal-specific descriptions, a social caption, an email blast and a highlights list, with prohibited discriminatory phrasing automatically avoided.",
		key: [
			"Portal-specific length and tone presets",
			"Photo-derived feature detection",
			"Compliance check on prohibited phrasing",
			"Social and email variants",
			"Team brand voice settings"
		],
		mvp: [
			"Fact form",
			"Two portal formats plus social caption",
			"Copy to clipboard"
		],
		future: [
			"CRM integration",
			"Multilingual listings",
			"Virtual staging suggestions"
		],
		stack: [
			"Next.js",
			"Vision model",
			"Claude",
			"Supabase",
			"Stripe"
		],
		money: [
			"Per-agent subscription",
			"Agency plan",
			"Per-listing credits"
		],
		pricing: "Agent $19/mo (30 listings), Office $99/mo (10 agents), credits $1 per extra listing.",
		acquisition: "Direct outreach to independent agencies, property-industry Facebook groups, and free rewrites of their current worst listing.",
		first10: "Rewrite the ten worst-performing listings in a local agency's window display, hand them over printed, and ask for a trial.",
		steps: [
			"Build the property fact model and form",
			"Build portal presets and generation prompts",
			"Add photo feature detection",
			"Add the compliance checker",
			"Add team accounts and brand voice",
			"Add billing and credits"
		],
		risks: [
			"Fair-housing style compliance varies by country",
			"Very price-sensitive small agencies",
			"Portals themselves may add generation features"
		],
		score: 6,
		tags: [
			"property",
			"copywriting",
			"vision",
			"real estate"
		]
	},
	{
		title: "AI Personal Finance Coach",
		category: "AI",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Startup",
		short: "Reads your statement exports and tells you the three changes that actually matter.",
		problem: "Budgeting apps show charts but not decisions, so people categorise spending for a month and then quit.",
		targetUsers: "Young professionals, couples managing shared money, people paying down debt.",
		solution: "Import bank statement CSVs, auto-categorise, then deliver a short monthly briefing with the three highest-impact changes, a debt payoff plan and progress against goals.",
		key: [
			"Statement import and auto-categorisation",
			"Monthly briefing with three prioritised actions",
			"Goal and debt payoff planning",
			"Subscription-creep detection",
			"Local-first storage option for privacy"
		],
		mvp: [
			"CSV import",
			"Categorisation plus monthly briefing",
			"One savings goal"
		],
		future: [
			"Open banking connections",
			"Household sharing",
			"Scenario planning"
		],
		stack: [
			"Capacitor or React Native",
			"Claude",
			"SQLite local storage",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription for coaching and goals",
			"Annual plan"
		],
		pricing: "Free import and categorisation, Coach $5/mo or $39/year.",
		acquisition: "Personal-finance content, debt-payoff communities, and a free subscription-audit tool.",
		first10: "Run the free subscription audit for anyone who posts their statement summary in a personal finance community, and offer coaching to those who find savings.",
		steps: [
			"Build CSV import with bank format detection",
			"Build categorisation with user corrections that stick",
			"Build the monthly briefing generation",
			"Add goals and debt payoff plans",
			"Add subscription detection",
			"Add billing and privacy controls"
		],
		risks: [
			"Financial advice framing must stay educational, not regulated advice",
			"Open banking access is costly and licensed",
			"Trust barrier around uploading financial data"
		],
		score: 7,
		tags: [
			"finance",
			"budgeting",
			"coaching",
			"mobile"
		]
	}
];
/** SaaS — 15 ideas, Productivity — 12 ideas. */
var PART_2 = [
	{
		title: "Client Portal for Small Agencies",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "One branded link where a client sees progress, files, approvals and invoices.",
		problem: "Agencies scatter client work across email, Drive and chat, so clients ask for status updates constantly and approvals get lost.",
		targetUsers: "Design and marketing agencies, freelancers with retainer clients, consultancies.",
		solution: "A branded portal per client with live project status, deliverable files, an approval workflow with comments, and invoice visibility.",
		key: [
			"Branded per-client portal with custom domain",
			"Deliverable approvals with threaded comments",
			"File library with versioning",
			"Invoice and payment status",
			"Client-visible project timeline"
		],
		mvp: [
			"Client login",
			"Project status and file list",
			"Approve or request changes"
		],
		future: [
			"Stripe invoicing built in",
			"Time tracking summary",
			"Templated project phases"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"UploadThing or R2",
			"Resend"
		],
		money: ["Per-agency subscription tiered by client count", "White-label add-on"],
		pricing: "Solo $19/mo (5 clients), Studio $49/mo (25 clients), Agency $129/mo unlimited.",
		acquisition: "Agency owner communities, comparison content against sending Drive links, and a free plan for a single client.",
		first10: "Offer to set up the portal personally for 20 freelancers in design communities, migrating their current client into it live on a call.",
		steps: [
			"Model agencies, clients, projects and deliverables",
			"Build client auth with magic links",
			"Build the approval and comment workflow",
			"Add file versioning and storage",
			"Add branding and custom domains",
			"Add billing tiers"
		],
		risks: [
			"Clients resist yet another login",
			"Crowded category with cheap incumbents",
			"White-label domains add support burden"
		],
		score: 7,
		tags: [
			"agency",
			"portal",
			"clients",
			"approvals"
		]
	},
	{
		title: "Uptime and Status Page for Indie Products",
		category: "SaaS",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Beginner",
		short: "Monitoring plus a public status page that stays cheap at small scale.",
		problem: "Indie products either pay enterprise monitoring prices or find out they are down from a customer email.",
		targetUsers: "Indie hackers, small SaaS teams, agencies hosting client sites.",
		solution: "HTTP and keyword monitoring from multiple regions with alerting to email, Slack and SMS, plus a hosted public status page with incident history.",
		key: [
			"Multi-region HTTP and keyword checks",
			"Alerting to email, Slack and webhook",
			"Public status page with custom domain",
			"Incident timeline and postmortems",
			"SSL and domain expiry warnings"
		],
		mvp: [
			"Five monitors at 5-minute intervals",
			"Email alerts",
			"Public status page"
		],
		future: [
			"Cron job heartbeat monitoring",
			"Response-time SLO tracking",
			"Team on-call rotation"
		],
		stack: [
			"Node.js workers",
			"Postgres",
			"Next.js",
			"Cloudflare Workers",
			"Stripe"
		],
		money: [
			"Freemium",
			"Subscription by monitor count and interval",
			"Status page branding add-on"
		],
		pricing: "Free 5 monitors at 5 min, Pro $9/mo (50 monitors at 1 min), Team $29/mo.",
		acquisition: "Indie hacker communities, an honest pricing comparison page, and a generous free tier that gets embedded on public status pages linking back.",
		first10: "Post a transparent cost breakdown of running monitoring cheaply, offer free lifetime accounts to the first 50 responders, and convert on volume growth.",
		steps: [
			"Build the check scheduler and worker",
			"Add alerting channels with deduplication",
			"Build the public status page renderer",
			"Add incident management",
			"Add custom domains and branding",
			"Add billing and plan limits"
		],
		risks: [
			"False positives destroy trust immediately",
			"Very competitive with several free options",
			"Alert delivery reliability is your entire product"
		],
		score: 6,
		tags: [
			"monitoring",
			"devops",
			"status page",
			"alerts"
		]
	},
	{
		title: "Feedback and Roadmap Board",
		category: "SaaS",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Collect feature requests, let users vote, close the loop automatically on ship.",
		problem: "Product teams collect requests in a spreadsheet, never tell requesters when something ships, and lose the goodwill.",
		targetUsers: "Small SaaS teams, product managers, open-source maintainers.",
		solution: "A public board where users post and vote on requests, a linked roadmap, and automatic notification to every voter when an item ships.",
		key: [
			"Public voting board with duplicate merging",
			"Roadmap columns linked to requests",
			"Changelog with automatic voter notification",
			"In-app widget for collection",
			"Segment tagging by plan or revenue"
		],
		mvp: [
			"Post and vote board",
			"Status changes",
			"Email on ship"
		],
		future: [
			"Revenue-weighted prioritisation",
			"Private boards per customer",
			"Integrations with issue trackers"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: ["Freemium", "Subscription by board count and branding removal"],
		pricing: "Free one public board, Pro $15/mo (branding removal, widget), Business $49/mo.",
		acquisition: "Each hosted board is a backlink and a signup surface; plus SEO on 'feature request tool' comparisons.",
		first10: "Give free Pro to ten small SaaS products you admire in exchange for keeping the 'powered by' link for three months.",
		steps: [
			"Build boards, posts and voting with abuse prevention",
			"Add duplicate merging and admin tooling",
			"Add roadmap and changelog",
			"Build the embeddable widget",
			"Add segmentation and tags",
			"Add billing"
		],
		risks: [
			"Empty boards look bad and get removed",
			"Spam and vote manipulation on public boards",
			"Well-funded incumbents in the exact niche"
		],
		score: 6,
		tags: [
			"product",
			"feedback",
			"roadmap",
			"community"
		]
	},
	{
		title: "Recurring Invoice and Dunning Tool for Freelancers",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Sends retainer invoices on schedule and chases late payers politely without you.",
		problem: "Freelancers hate chasing invoices, so they wait weeks before sending a reminder and carry avoidable cash-flow gaps.",
		targetUsers: "Freelancers, small studios, consultants on retainers.",
		solution: "Set up a retainer once and the tool issues the invoice, takes card or bank payment, and runs a polite escalating reminder sequence until it clears.",
		key: [
			"Recurring invoice schedules",
			"Card and bank payment links",
			"Escalating reminder sequences with editable tone",
			"Late fee rules",
			"Cash-flow forecast from scheduled invoices"
		],
		mvp: [
			"Create recurring invoice",
			"Email delivery with payment link",
			"Three-step reminders"
		],
		future: [
			"Multi-currency",
			"Accountant export",
			"Contract and invoice bundling"
		],
		stack: [
			"Next.js",
			"Stripe",
			"Supabase",
			"Resend",
			"Cron worker"
		],
		money: ["Flat subscription", "Percentage-free positioning as differentiator"],
		pricing: "$12/mo unlimited invoices, no percentage cut; $29/mo for teams of three.",
		acquisition: "Freelance communities, content on getting paid on time, and a free late-payment reminder template pack.",
		first10: "Ask 30 freelancers what their oldest unpaid invoice is, offer to run your reminder sequence for them free, and onboard the ones that get paid.",
		steps: [
			"Build invoice model and schedules",
			"Integrate Stripe payments and webhooks",
			"Build the reminder engine with sequences",
			"Add late fees and forecast",
			"Add branding and templates",
			"Add subscription billing"
		],
		risks: [
			"Payment compliance and tax handling vary by country",
			"Established invoicing tools bundle this free",
			"Deliverability problems break the core loop"
		],
		score: 7,
		tags: [
			"invoicing",
			"freelance",
			"payments",
			"cash flow"
		]
	},
	{
		title: "Booking and Scheduling for Multi-Staff Services",
		category: "SaaS",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Handles staff, rooms and equipment together instead of just one calendar.",
		problem: "Generic scheduling tools book a person, but real service businesses also need a room, a chair or a machine free at the same time.",
		targetUsers: "Clinics, studios, salons, tutoring centres, equipment rental businesses.",
		solution: "Resource-aware booking that checks staff, room and equipment availability at once, with deposits, reminders and no-show rules.",
		key: [
			"Multi-resource availability engine",
			"Deposit capture and cancellation policy enforcement",
			"SMS and email reminders",
			"Staff-level rotas and time off",
			"Public booking page per location"
		],
		mvp: [
			"Staff plus one resource type",
			"Public booking page",
			"Email confirmations"
		],
		future: [
			"Packages and memberships",
			"Waitlist auto-fill",
			"Point of sale integration"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Stripe",
			"Twilio",
			"Supabase Auth"
		],
		money: [
			"Per-location subscription",
			"Per-staff add-on",
			"Payment processing margin"
		],
		pricing: "$39/mo per location with 5 staff, $6/mo per extra staff member.",
		acquisition: "Vertical-specific landing pages, local outreach, and migration help from spreadsheets and paper diaries.",
		first10: "Pick one vertical in one city, visit 25 businesses in person, and offer free setup including importing their existing bookings.",
		steps: [
			"Design the resource and availability model carefully",
			"Build the conflict-free booking engine",
			"Build the public booking flow with deposits",
			"Add reminders and no-show rules",
			"Add rotas and time off",
			"Add multi-location billing"
		],
		risks: [
			"Availability logic is genuinely hard and bugs cause double bookings",
			"Vertical incumbents bundle scheduling with everything else",
			"High support expectations from non-technical owners"
		],
		score: 7,
		tags: [
			"booking",
			"scheduling",
			"local business",
			"operations"
		]
	},
	{
		title: "Compliance Evidence Collector for Small Teams",
		category: "SaaS",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Collects the screenshots and logs auditors ask for, continuously, in the background.",
		problem: "First security questionnaires and audits force startups into weeks of screenshotting settings and chasing colleagues for evidence.",
		targetUsers: "Seed to Series A SaaS companies, agencies selling to enterprise, IT consultants.",
		solution: "Connect cloud and SaaS accounts, map settings to common control frameworks, collect evidence automatically on a schedule, and flag drift when a control breaks.",
		key: [
			"Connectors for cloud and identity providers",
			"Control mapping with plain-language explanation",
			"Scheduled evidence collection with timestamps",
			"Drift alerts when a control regresses",
			"Auditor-ready export pack"
		],
		mvp: [
			"Two connectors",
			"Ten controls with evidence collection",
			"Export to PDF"
		],
		future: [
			"Policy templates and staff attestation",
			"Vendor risk register",
			"Questionnaire autofill"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Cloud provider SDKs",
			"Claude for explanations",
			"Stripe"
		],
		money: [
			"Annual subscription",
			"Per-framework add-on",
			"Implementation service"
		],
		pricing: "$3,000/year starter framework, $6,000/year for two frameworks, services extra.",
		acquisition: "Content on passing your first security questionnaire, partnerships with auditors and vCISOs, and a free questionnaire template.",
		first10: "Partner with two auditors who already work with startups and offer their clients the tool at cost for the first year.",
		steps: [
			"Choose one framework and map its controls",
			"Build two high-value connectors",
			"Build evidence storage with immutability and timestamps",
			"Add drift detection and alerts",
			"Build the auditor export",
			"Add annual billing and onboarding"
		],
		risks: [
			"Heavily funded incumbents own this category",
			"Mistaken compliance claims carry serious consequences",
			"Connector breakage silently stops evidence collection"
		],
		score: 6,
		tags: [
			"compliance",
			"security",
			"audit",
			"b2b"
		]
	},
	{
		title: "Email Newsletter Platform for Niche Communities",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Sending, segmentation and paid subscriptions without enterprise pricing.",
		problem: "Newsletter tools jump from free to expensive fast, and niche publishers with 5,000 engaged readers pay list-size prices for features they never use.",
		targetUsers: "Independent writers, community organisers, niche B2B publishers.",
		solution: "A focused sending platform with clean templates, tag-based segmentation, paid subscriptions and honest per-email pricing rather than list-size tiers.",
		key: [
			"Editor with reusable blocks",
			"Tag-based segmentation and automations",
			"Paid subscriptions with Stripe",
			"Deliverability dashboard with domain setup guidance",
			"Referral program built in"
		],
		mvp: [
			"Import list",
			"Compose and send",
			"Basic open and click stats"
		],
		future: [
			"Drip automations",
			"Ad marketplace for sponsors",
			"Web archive with SEO"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Amazon SES or Resend",
			"Stripe",
			"Cloudflare"
		],
		money: [
			"Freemium under 1,000 subscribers",
			"Per-email-sent pricing",
			"Cut of paid subscriptions"
		],
		pricing: "Free under 1,000 subscribers, then $1 per 1,000 emails sent; 3% on paid subscriptions.",
		acquisition: "Pricing comparison content, migration tooling from the big platforms, and writer communities.",
		first10: "Offer white-glove migration to ten newsletters currently paying too much, and publish their before/after cost with permission.",
		steps: [
			"Build subscriber storage, import and consent tracking",
			"Build the composer and sending pipeline",
			"Set up deliverability infrastructure and domain auth guidance",
			"Add segmentation and stats",
			"Add paid subscriptions",
			"Add usage billing"
		],
		risks: [
			"Deliverability reputation is fragile and existential",
			"Spam abuse on a free tier can poison sending IPs",
			"Entrenched competitors with network effects"
		],
		score: 6,
		tags: [
			"email",
			"newsletter",
			"publishing",
			"subscriptions"
		]
	},
	{
		title: "Inventory and Reorder Alerts for Small Retailers",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Tells a shop what to reorder and when, based on real sale rates.",
		problem: "Small retailers guess reorder timing and either tie up cash in dead stock or lose sales to stockouts of their best sellers.",
		targetUsers: "Independent retailers, small e-commerce brands, cafés and kitchens.",
		solution: "Import sales history, calculate sell-through and lead time per product, and issue reorder alerts with suggested quantities plus a dead-stock report.",
		key: [
			"Sell-through and days-of-cover per product",
			"Reorder alerts with suggested quantity",
			"Supplier lead time tracking",
			"Dead stock and markdown suggestions",
			"Purchase order generation"
		],
		mvp: [
			"CSV or Shopify import",
			"Reorder alert list",
			"Dead stock report"
		],
		future: [
			"Multi-location transfers",
			"Seasonality forecasting",
			"Supplier ordering by email"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Shopify API",
			"Resend",
			"Stripe"
		],
		money: ["Subscription by SKU count", "Multi-location add-on"],
		pricing: "$29/mo up to 500 SKUs, $79/mo up to 5,000 SKUs, $19/mo per extra location.",
		acquisition: "Shopify app store, retail owner groups, and a free dead-stock audit from a CSV export.",
		first10: "Run the free dead-stock audit for 30 shops and quantify the cash tied up; convert those who see a big number.",
		steps: [
			"Build import from CSV and one commerce platform",
			"Build the sell-through and cover calculations",
			"Build alerts with configurable thresholds",
			"Add supplier lead times and purchase orders",
			"Add dead-stock reporting",
			"Add billing by SKU tier"
		],
		risks: [
			"Bad historical data yields bad recommendations",
			"Platform apps compete directly",
			"Retail margins limit software budgets"
		],
		score: 7,
		tags: [
			"retail",
			"inventory",
			"forecasting",
			"operations"
		]
	},
	{
		title: "Contract and Renewal Tracker",
		category: "SaaS",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Never auto-renew into a contract you meant to cancel or renegotiate.",
		problem: "Companies miss notice windows on software and supplier contracts and get locked in for another year at a worse rate.",
		targetUsers: "Operations and finance managers, office managers, small IT teams.",
		solution: "Upload contracts, auto-extract renewal dates and notice periods, and receive escalating reminders with a negotiation checklist before each deadline.",
		key: [
			"Renewal date and notice period extraction",
			"Escalating reminders to multiple owners",
			"Spend register by vendor and category",
			"Negotiation checklist per renewal",
			"Shared vendor notes and history"
		],
		mvp: [
			"Upload contract",
			"Manual or extracted key dates",
			"Email reminders"
		],
		future: [
			"Spend anomaly detection",
			"Approval workflow for new contracts",
			"Accounting integration"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Claude for extraction",
			"Resend",
			"Stripe"
		],
		money: ["Subscription by contract count", "Per-seat team plan"],
		pricing: "$29/mo up to 50 contracts, $99/mo up to 300, unlimited $249/mo.",
		acquisition: "Finance and operations communities, content on SaaS spend waste, and a free renewal calendar template.",
		first10: "Offer a free audit of ten companies' software renewals and show the notice windows they are about to miss.",
		steps: [
			"Build upload and extraction of key dates",
			"Build the reminder engine with owner escalation",
			"Add the vendor spend register",
			"Add negotiation checklists",
			"Add team access and permissions",
			"Add billing"
		],
		risks: [
			"Extraction errors on unusual contract formats",
			"Low perceived urgency until a renewal is missed",
			"Spend management suites include this feature"
		],
		score: 6,
		tags: [
			"contracts",
			"renewals",
			"finance",
			"operations"
		]
	},
	{
		title: "Multi-Tenant Form Builder with Logic",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Conditional forms with payment, file upload and clean exports for client work.",
		problem: "Freelancers rebuild intake forms per client and hit paywalls on conditional logic, file uploads or payments in every cheap tool.",
		targetUsers: "Freelancers, agencies, small nonprofits, event organisers.",
		solution: "A form builder with real conditional logic, file uploads, payment collection and per-client workspaces, priced for people running many small forms.",
		key: [
			"Conditional logic and multi-step flows",
			"File uploads with size controls",
			"Stripe payment fields",
			"Per-client workspaces and branding",
			"Webhook and spreadsheet export"
		],
		mvp: [
			"Drag-and-drop builder",
			"Conditional logic",
			"Email notification plus CSV export"
		],
		future: [
			"Approval workflows",
			"Signature fields",
			"Template marketplace"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"R2 storage",
			"Zod validation"
		],
		money: [
			"Freemium by responses",
			"Subscription by workspace",
			"Payment field fee"
		],
		pricing: "Free 100 responses/mo, Pro $19/mo (unlimited forms, 5,000 responses), Agency $59/mo.",
		acquisition: "SEO on specific form types, agency communities, and template galleries that rank.",
		first10: "Build ten polished, genuinely useful public templates for common intake scenarios and let them rank and convert.",
		steps: [
			"Build the schema-driven form renderer",
			"Build the visual builder with logic",
			"Add file uploads and spam protection",
			"Add payment fields",
			"Add workspaces and branding",
			"Add billing and response limits"
		],
		risks: [
			"Extremely competitive category",
			"Spam and abuse on public forms",
			"File storage costs on a low price point"
		],
		score: 6,
		tags: [
			"forms",
			"no-code",
			"agency",
			"payments"
		]
	},
	{
		title: "Localised Price and Tax Preview for Checkout",
		category: "SaaS",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Shows the true final price per country before the buyer reaches checkout.",
		problem: "Cross-border buyers abandon checkout when tax, duty or currency conversion appears late and the total jumps.",
		targetUsers: "Cross-border e-commerce brands, digital product sellers, SaaS companies.",
		solution: "A drop-in component that detects the visitor's country and shows an accurate, itemised total including tax and estimated duty, with rules maintained centrally.",
		key: [
			"Country detection with manual override",
			"Itemised tax and duty estimate",
			"Currency conversion with rounding rules",
			"Rules dashboard per product category",
			"A/B test of localised versus base pricing"
		],
		mvp: ["JS snippet showing localised total for five countries", "Dashboard with rate management"],
		future: [
			"Full checkout integration",
			"Automated rate updates",
			"Compliance reporting"
		],
		stack: [
			"Cloudflare Workers",
			"Next.js dashboard",
			"Postgres",
			"Exchange rate API",
			"Stripe"
		],
		money: ["Subscription by traffic volume", "Enterprise plan with SLAs"],
		pricing: "$49/mo up to 100k views, $199/mo up to 1M views, custom above.",
		acquisition: "Cross-border commerce content, Shopify partner network, and a free 'what your buyer really pays' calculator.",
		first10: "Run the free calculator on 25 brands' bestsellers, show the surprise cost a foreign buyer faces, and offer a trial.",
		steps: [
			"Build the country detection and rate engine",
			"Build the embeddable component with fast edge responses",
			"Build the rules dashboard",
			"Add currency rounding strategies",
			"Add analytics and A/B testing",
			"Add billing by usage"
		],
		risks: [
			"Tax and duty accuracy is legally sensitive",
			"Rate maintenance never ends",
			"Payment platforms add native tax features"
		],
		score: 6,
		tags: [
			"ecommerce",
			"tax",
			"pricing",
			"conversion"
		]
	},
	{
		title: "Simple CRM for Service Businesses",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "A pipeline plus quotes and follow-ups, without the enterprise CRM overhead.",
		problem: "Trades and small service firms track leads in a notebook or WhatsApp and lose jobs by forgetting to follow up on quotes.",
		targetUsers: "Trades businesses, small consultancies, local service providers.",
		solution: "Capture leads from forms and calls, produce quotes from templates, and automatically follow up until the customer answers, with a simple visual pipeline.",
		key: [
			"Lead capture from web form and phone",
			"Quote templates with e-acceptance",
			"Automatic follow-up sequences",
			"Job pipeline with stages",
			"Won/lost reporting by source"
		],
		mvp: [
			"Lead list with stages",
			"Quote creation and send",
			"Manual follow-up reminders"
		],
		future: [
			"Scheduling and dispatch",
			"Invoicing",
			"Review request automation"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Twilio",
			"Stripe",
			"Resend"
		],
		money: ["Per-seat subscription", "Setup and migration service"],
		pricing: "$29/user/mo, $99/mo for a five-person team, one-off $199 setup.",
		acquisition: "Local outreach, trade association partnerships, and content on quote follow-up conversion rates.",
		first10: "Sit with ten local trades businesses, import their current lead list from paper or WhatsApp, and charge only after their first won job.",
		steps: [
			"Build the lead and pipeline model",
			"Build quotes with templates and acceptance",
			"Build follow-up automation",
			"Add reporting by source",
			"Add mobile-friendly field usage",
			"Add billing and seats"
		],
		risks: [
			"Very low tolerance for complexity in this audience",
			"Vertical CRMs already exist for most trades",
			"Support load from non-technical users"
		],
		score: 7,
		tags: [
			"crm",
			"sales",
			"local business",
			"quotes"
		]
	},
	{
		title: "Website Accessibility Audit Service Platform",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Continuous accessibility scanning with fixes written for developers, not lawyers.",
		problem: "Accessibility tools output hundreds of raw violations with no prioritisation, so teams ignore the report entirely.",
		targetUsers: "Agencies, public sector suppliers, e-commerce teams, accessibility consultants.",
		solution: "Scheduled crawls that group issues by root cause, rank by user impact, and give a concrete code fix per issue with a shareable progress report.",
		key: [
			"Scheduled crawl with authenticated pages",
			"Issues grouped by component root cause",
			"Impact-ranked prioritisation",
			"Concrete code fixes with examples",
			"Shareable progress report for clients"
		],
		mvp: [
			"Scan a URL",
			"Grouped issue list with fixes",
			"PDF report"
		],
		future: [
			"CI integration",
			"Manual audit workflow for consultants",
			"Remediation tracking"
		],
		stack: [
			"Node.js",
			"Playwright",
			"axe-core",
			"Claude for fix guidance",
			"Postgres"
		],
		money: ["Subscription by pages scanned", "Consultant white-label plan"],
		pricing: "$39/mo for 500 pages, $129/mo for 5,000, white-label $299/mo.",
		acquisition: "Free single-page audits that rank in search, agency partnerships, and public-sector procurement content.",
		first10: "Publish free audits of 20 well-known local sites with tactful private outreach first, and offer remediation tracking to those who respond.",
		steps: [
			"Build the crawler and axe integration",
			"Build root-cause grouping",
			"Add prioritisation and fix guidance",
			"Add scheduled scans and progress tracking",
			"Add client-shareable reporting",
			"Add billing and white-label"
		],
		risks: [
			"Automated checks catch only part of real accessibility",
			"Overpromising compliance creates legal exposure",
			"Free tools cover the basics"
		],
		score: 7,
		tags: [
			"accessibility",
			"audit",
			"agency",
			"web"
		]
	},
	{
		title: "Course and Membership Hosting for Small Creators",
		category: "SaaS",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Sell a course or membership without paying a percentage of every sale.",
		problem: "Course platforms take a cut or charge high monthly fees, and stitching together checkout, video and drip access yourself is fiddly.",
		targetUsers: "Independent educators, coaches, community leaders, niche experts.",
		solution: "Hosted courses and memberships with video, drip scheduling, community discussion and direct Stripe checkout, at a flat fee with no revenue share.",
		key: [
			"Course builder with drip scheduling",
			"Video hosting with playback protection",
			"Membership tiers and Stripe checkout",
			"Discussion threads per lesson",
			"Completion tracking and certificates"
		],
		mvp: [
			"Course builder",
			"Stripe checkout",
			"Student dashboard with progress"
		],
		future: [
			"Cohort features and live sessions",
			"Affiliate program",
			"Mobile app"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Mux or Cloudflare Stream",
			"Stripe"
		],
		money: ["Flat subscription, no revenue share", "Storage and bandwidth add-ons"],
		pricing: "Starter $29/mo, Pro $79/mo with more video hours, no percentage of sales.",
		acquisition: "Direct comparison content on platform fees, creator communities, and free migration from percentage-based platforms.",
		first10: "Calculate what ten mid-sized creators currently pay in percentage fees and show them the annual saving, offering free migration.",
		steps: [
			"Build course and lesson models with drip rules",
			"Integrate video hosting and playback",
			"Build checkout and access control",
			"Add discussions and progress tracking",
			"Add certificates and analytics",
			"Add plans and usage limits"
		],
		risks: [
			"Video bandwidth costs can wipe out flat-fee margin",
			"Creators expect marketing features too",
			"Piracy and account sharing"
		],
		score: 6,
		tags: [
			"courses",
			"membership",
			"creators",
			"video"
		]
	},
	{
		title: "API Usage Metering and Billing Toolkit",
		category: "SaaS",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Meter, rate-limit and bill an API without building the plumbing yourself.",
		problem: "Teams launching a paid API rebuild metering, quota enforcement, overage billing and customer usage dashboards from scratch every time.",
		targetUsers: "API-first startups, AI wrapper products, data providers.",
		solution: "A metering service with an SDK and edge middleware that records usage events, enforces plan quotas, reports overage to Stripe, and gives customers a usage dashboard.",
		key: [
			"Usage event ingestion with idempotency",
			"Plan and quota enforcement at the edge",
			"Stripe metered billing sync",
			"Customer-facing usage dashboard",
			"Alerting on quota thresholds"
		],
		mvp: [
			"SDK for event recording",
			"Quota checks",
			"Stripe usage reporting"
		],
		future: [
			"Prepaid credits",
			"Custom enterprise contracts",
			"Revenue analytics"
		],
		stack: [
			"Cloudflare Workers",
			"ClickHouse or Postgres",
			"Stripe",
			"Next.js dashboard"
		],
		money: ["Subscription by events metered", "Percentage-free flat pricing"],
		pricing: "Free under 100k events/mo, $49/mo to 5M events, $199/mo to 50M.",
		acquisition: "Developer content on metered billing pitfalls, an open-source SDK, and API-startup communities.",
		first10: "Open-source the SDK, help five teams integrate it personally, and convert them to the hosted metering backend.",
		steps: [
			"Design the event schema and idempotency model",
			"Build high-throughput ingestion",
			"Build quota enforcement middleware",
			"Build Stripe sync and reconciliation",
			"Build the customer usage dashboard",
			"Add billing and plan management"
		],
		risks: [
			"Billing accuracy errors are unforgivable",
			"High-throughput infrastructure costs",
			"Stripe ships more of this natively over time"
		],
		score: 7,
		tags: [
			"billing",
			"api",
			"infrastructure",
			"developers"
		]
	},
	{
		title: "Focus Timer with Automatic Work Logging",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Pomodoro sessions that quietly build an honest log of where the week went.",
		problem: "People finish a busy week with no idea where the hours went, and manual time tracking is abandoned within days.",
		targetUsers: "Freelancers, students, remote workers, anyone billing by time.",
		solution: "Start a focus session with a one-line intent, and the app builds a weekly log of time by project with a review summary and simple exports.",
		key: [
			"Timer with intent capture per session",
			"Automatic project grouping",
			"Weekly review with focus trends",
			"Distraction interruption log",
			"CSV and invoice-ready export"
		],
		mvp: [
			"Timer with labels",
			"Daily and weekly totals",
			"CSV export"
		],
		future: [
			"Calendar overlay",
			"Team visibility for agencies",
			"Browser distraction tracking"
		],
		stack: [
			"Next.js",
			"Local-first storage with sync",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium",
			"Subscription for history and exports",
			"Lifetime licence"
		],
		pricing: "Free with 30-day history, Pro $4/mo or $39 lifetime.",
		acquisition: "Productivity communities, an excellent free tier that people keep open all day, and integration listings.",
		first10: "Post it in productivity subreddits with an honest note about what it deliberately does not do; ask for feedback rather than signups.",
		steps: [
			"Build the timer and session model",
			"Add labels and project grouping",
			"Build the weekly review view",
			"Add exports",
			"Add sync and accounts",
			"Add subscription and lifetime purchase"
		],
		risks: [
			"Enormous free competition",
			"Low willingness to pay for timers",
			"Retention depends on daily habit formation"
		],
		score: 5,
		tags: [
			"time tracking",
			"focus",
			"pomodoro",
			"habits"
		]
	},
	{
		title: "Meeting Cost and Necessity Calculator",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Shows what each recurring meeting costs the company and which ones to kill.",
		problem: "Recurring meetings multiply and nobody ever cancels one because the cost is invisible.",
		targetUsers: "Team leads, operations managers, remote-first companies.",
		solution: "Connect the team calendar, estimate cost per meeting using salary bands, and produce a ranked list of recurring meetings by annual cost with a cancel-or-shorten recommendation.",
		key: [
			"Calendar connection with recurring meeting detection",
			"Cost model from salary bands, not individual salaries",
			"Ranked kill list with annual savings",
			"Attendee-count recommendations",
			"Quarterly meeting audit report"
		],
		mvp: [
			"Google Calendar connect",
			"Cost per meeting",
			"Top 10 most expensive recurring meetings"
		],
		future: [
			"Agenda quality scoring",
			"No-meeting-day enforcement",
			"Slack nudges before big meetings"
		],
		stack: [
			"Next.js",
			"Google Calendar API",
			"Supabase",
			"Stripe"
		],
		money: ["Freemium for individuals", "Per-company subscription"],
		pricing: "Free for one calendar, Team $49/mo up to 50 people, $149/mo up to 200.",
		acquisition: "Viral shareable report of 'your team spends $X on meetings', plus management communities.",
		first10: "Run the audit free for ten companies and share the single most expensive meeting they have; the shock converts.",
		steps: [
			"Build calendar ingestion and recurring detection",
			"Build the cost model with salary bands",
			"Build the ranked report",
			"Add recommendations and sharing",
			"Add periodic re-audits",
			"Add team billing"
		],
		risks: [
			"Salary data is sensitive even in band form",
			"Novelty effect: one report and done",
			"Calendar permission scopes concern IT teams"
		],
		score: 6,
		tags: [
			"meetings",
			"analytics",
			"management",
			"calendar"
		]
	},
	{
		title: "Read-It-Later with Actual Summaries",
		category: "Productivity",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Saves articles and gives you a two-minute version so the backlog gets read.",
		problem: "Read-later apps become guilt archives: hundreds of saved articles that never get opened.",
		targetUsers: "Knowledge workers, researchers, students, heavy newsletter readers.",
		solution: "Save any link and immediately get a structured summary and key quotes, with a weekly digest of the five most relevant saves so the backlog gets triaged instead of ignored.",
		key: [
			"Share-sheet and browser saving",
			"Structured summary with key quotes",
			"Weekly digest of top saves",
			"Highlight export to notes apps",
			"Offline reading"
		],
		mvp: [
			"Save a URL",
			"Summary plus clean reader view",
			"Simple list"
		],
		future: [
			"Podcast and video saves",
			"Topic clustering",
			"Shared team libraries"
		],
		stack: [
			"Capacitor or React Native",
			"Readability parser",
			"Claude",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium by saves per month",
			"Subscription",
			"Annual plan"
		],
		pricing: "Free 20 saves/mo, Pro $5/mo or $45/year.",
		acquisition: "App store optimisation, newsletter partnerships, and integration with note-taking communities.",
		first10: "Offer lifetime accounts to 50 people in note-taking communities in exchange for weekly feedback calls with the first ten.",
		steps: [
			"Build saving and article extraction",
			"Build summarisation with quality checks",
			"Build the reader and offline storage",
			"Add the weekly digest",
			"Add highlight export",
			"Add subscriptions"
		],
		risks: [
			"Paywalled articles cannot be extracted",
			"Summarisation cost per save at a low price point",
			"Established free competitors"
		],
		score: 6,
		tags: [
			"reading",
			"summaries",
			"notes",
			"mobile"
		]
	},
	{
		title: "Personal Weekly Review Assistant",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "A fifteen-minute guided review that pulls in what you actually did this week.",
		problem: "Weekly reviews are the highest-leverage productivity habit and almost nobody sustains one because starting from a blank page is exhausting.",
		targetUsers: "Managers, freelancers, founders, anyone running a personal productivity system.",
		solution: "Pull completed calendar events, closed tasks and commits into a prefilled review, then guide the user through wins, blockers and next week's three priorities.",
		key: [
			"Auto-pulled week summary from connected tools",
			"Guided prompts for wins, blockers and priorities",
			"Rolling history with trend view",
			"Reminder scheduling",
			"Shareable summary for a manager"
		],
		mvp: [
			"Manual review flow with prompts",
			"History",
			"Email reminder"
		],
		future: [
			"Calendar and task integrations",
			"Team rollup for managers",
			"Quarterly retrospectives"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Google Calendar and GitHub APIs",
			"Resend",
			"Stripe"
		],
		money: [
			"Subscription",
			"Annual plan",
			"Team plan for managers"
		],
		pricing: "$5/mo or $45/year; Team $8/user/mo with manager rollups.",
		acquisition: "Productivity newsletters, a free review template, and content on running weekly reviews.",
		first10: "Run live weekly review sessions for a small group for a month and give participants free annual accounts.",
		steps: [
			"Build the guided review flow",
			"Add history and trends",
			"Add reminders",
			"Add calendar and task integrations",
			"Add sharing and team rollups",
			"Add billing"
		],
		risks: [
			"Habit products churn heavily",
			"A notes app plus a template is free",
			"Integrations add scope quickly"
		],
		score: 5,
		tags: [
			"review",
			"habits",
			"reflection",
			"management"
		]
	},
	{
		title: "Shared Household Task and Bill Manager",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Fair rotas and split bills for flatmates, without the passive-aggressive group chat.",
		problem: "Shared households argue about chores and money because there is no neutral record of who did or paid what.",
		targetUsers: "Flatshares, student houses, couples, co-living operators.",
		solution: "Rotating chore schedules with completion tracking, shared expense splitting with settle-up, and gentle automated reminders instead of nagging messages.",
		key: [
			"Rotating chore schedules with fairness balance",
			"Expense splitting and settle-up",
			"Automated reminders",
			"House rules and shopping list",
			"Move-in and move-out balance summary"
		],
		mvp: [
			"Chore rota with completion",
			"Expense split and balances",
			"Push reminders"
		],
		future: [
			"Bank payment links for settle-up",
			"Landlord and co-living operator dashboards",
			"Recurring bill splitting"
		],
		stack: [
			"React Native or Capacitor",
			"Supabase",
			"Push notifications",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Small household subscription",
			"Co-living operator licensing"
		],
		pricing: "Free for up to 3 people, House Plus $3/mo per household, operator plans custom.",
		acquisition: "Student housing communities, university move-in season campaigns, and co-living operator partnerships.",
		first10: "Get five student houses onboarded at the start of a term through a campus noticeboard offer, and iterate on their arguments.",
		steps: [
			"Build household creation and invites",
			"Build chore rotas with fairness logic",
			"Build expense splitting and balances",
			"Add reminders and notifications",
			"Add shopping list and rules",
			"Add subscription and operator plans"
		],
		risks: [
			"Every member must adopt or it fails",
			"Free competitors are well established",
			"Very low consumer willingness to pay"
		],
		score: 5,
		tags: [
			"household",
			"shared living",
			"expenses",
			"chores"
		]
	},
	{
		title: "Email Triage Rules Without Code",
		category: "Productivity",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Describe an inbox rule in a sentence and it applies reliably from then on.",
		problem: "Native email filters need exact conditions, so the messy rules people actually want ('anything about invoices from clients') are impossible to express.",
		targetUsers: "Freelancers, consultants, busy managers, small business owners.",
		solution: "Write rules in plain language, preview them against the last 200 emails, then run them continuously with labels, archiving, forwarding and digests.",
		key: [
			"Plain-language rule creation",
			"Dry-run preview on past mail",
			"Label, archive, forward and snooze actions",
			"Daily digest of low-priority mail",
			"Rule performance stats and easy rollback"
		],
		mvp: [
			"Gmail connection",
			"Three rule actions",
			"Preview before enabling"
		],
		future: [
			"Outlook support",
			"Shared team rules",
			"Auto-draft replies"
		],
		stack: [
			"Next.js",
			"Gmail API",
			"Claude",
			"Postgres",
			"Stripe"
		],
		money: ["Subscription per mailbox", "Team plan"],
		pricing: "$8/mo per mailbox, $29/mo for five mailboxes.",
		acquisition: "Content on inbox zero workflows, productivity communities, and a free one-rule tier.",
		first10: "Ask 40 people in freelancer communities for their most annoying recurring email, build a rule for it live, and give them a free month.",
		steps: [
			"Build inbox connection with minimal scopes",
			"Build rule interpretation and dry-run preview",
			"Build the continuous execution worker",
			"Add digests and stats",
			"Add rollback and audit log",
			"Add billing"
		],
		risks: [
			"Mailbox API scopes require security review",
			"A wrong rule can archive something critical",
			"Per-email AI cost needs careful caching"
		],
		score: 7,
		tags: [
			"email",
			"automation",
			"inbox",
			"rules"
		]
	},
	{
		title: "Habit Tracker with Real Accountability",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Streaks plus a paired partner who is notified when you skip.",
		problem: "Solo habit trackers are easy to ignore because nothing happens when you break a streak.",
		targetUsers: "People building fitness, study or writing habits; accountability pairs and small groups.",
		solution: "Track habits with streaks, but pair each user with a partner or small group who sees misses and can send a nudge, plus optional stake-based commitment.",
		key: [
			"Habit streaks with flexible schedules",
			"Partner pairing with miss notifications",
			"Small accountability groups",
			"Optional financial stake for commitment",
			"Weekly progress recap"
		],
		mvp: [
			"Habits and streaks",
			"One partner with miss notification",
			"Weekly recap"
		],
		future: [
			"Group challenges",
			"Health data integration",
			"Coach dashboards"
		],
		stack: [
			"React Native or Capacitor",
			"Supabase",
			"Push notifications",
			"Stripe",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription for groups and stakes",
			"Cut of forfeited stakes to charity"
		],
		pricing: "Free solo tracking, Plus $4/mo for partners, groups and stakes.",
		acquisition: "Fitness and study communities, referral built into pairing, and challenge campaigns in January and September.",
		first10: "Run a 30-day public challenge with 20 participants recruited from one community, and keep the group active after it ends.",
		steps: [
			"Build habits, schedules and streak logic",
			"Add partner pairing and notifications",
			"Add groups and recaps",
			"Add stakes with payment handling",
			"Add referral flows",
			"Add subscriptions"
		],
		risks: [
			"Stakes create payment disputes and legal questions",
			"Notification fatigue kills retention",
			"Saturated category"
		],
		score: 5,
		tags: [
			"habits",
			"accountability",
			"mobile",
			"streaks"
		]
	},
	{
		title: "Document Signing for Small Deals",
		category: "Productivity",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Send, sign and store simple agreements without a per-envelope charge.",
		problem: "Freelancers and small businesses need a handful of signatures a month and resent per-envelope pricing built for enterprises.",
		targetUsers: "Freelancers, small agencies, landlords, tutors and coaches.",
		solution: "Upload a document, place fields, send for signature with reminders, and store completed agreements with an audit trail, at a flat low price.",
		key: [
			"Field placement and signing flow",
			"Audit trail with timestamps and IP",
			"Reminder sequences",
			"Reusable templates",
			"Completed document storage and search"
		],
		mvp: [
			"Upload PDF and place fields",
			"Email signing link",
			"Signed copy with audit trail"
		],
		future: [
			"Payment collection on signature",
			"Bulk send",
			"Identity verification tier"
		],
		stack: [
			"Next.js",
			"Supabase",
			"PDF-lib",
			"Resend",
			"Stripe"
		],
		money: [
			"Freemium by documents",
			"Flat subscription",
			"Team plan"
		],
		pricing: "Free 3 documents/mo, Solo $9/mo unlimited, Team $29/mo (5 users).",
		acquisition: "Pricing comparison content, freelancer communities, and a free contract template library.",
		first10: "Publish five genuinely good free contract templates for common freelance work, with sending built into the page.",
		steps: [
			"Build document upload and field placement",
			"Build the signing flow and audit trail",
			"Add templates and reminders",
			"Add storage and search",
			"Add team accounts",
			"Add billing"
		],
		risks: [
			"Legal validity expectations differ by jurisdiction",
			"Trust barrier against established brands",
			"Storage and retention obligations"
		],
		score: 6,
		tags: [
			"esign",
			"contracts",
			"freelance",
			"documents"
		]
	},
	{
		title: "Team Standup Without a Meeting",
		category: "Productivity",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Async written standups in Slack, summarised into one readable digest.",
		problem: "Daily standup meetings cost every participant a context switch and produce information most attendees do not need.",
		targetUsers: "Remote and hybrid engineering teams, distributed agencies, managers of async teams.",
		solution: "Scheduled prompts in Slack collect each person's update, and the bot posts a single digest highlighting blockers and changes since yesterday.",
		key: [
			"Scheduled prompts per timezone",
			"Digest with blockers highlighted",
			"Follow-up on unanswered prompts",
			"Weekly manager summary",
			"Searchable history"
		],
		mvp: [
			"Slack prompts and digest",
			"Configurable schedule",
			"History"
		],
		future: [
			"Teams and Discord support",
			"Sprint metrics",
			"Mood and workload signals"
		],
		stack: [
			"Node.js",
			"Slack API",
			"Postgres",
			"Claude for digests",
			"Stripe"
		],
		money: ["Per-user subscription", "Flat team plan"],
		pricing: "$3/user/mo, minimum $15/mo per workspace.",
		acquisition: "Slack app directory, remote-work communities, and content on replacing daily standups.",
		first10: "Offer the tool free for three months to ten remote teams found in async-work communities in exchange for a case study.",
		steps: [
			"Build the Slack app and scheduling",
			"Build response collection and digest generation",
			"Add timezone handling and follow-ups",
			"Add manager summaries",
			"Add history and search",
			"Add billing"
		],
		risks: [
			"Several free and cheap competitors already exist",
			"Slack app review and platform dependence",
			"Teams abandon it if the digest gets ignored"
		],
		score: 6,
		tags: [
			"async",
			"standup",
			"slack",
			"remote work"
		]
	},
	{
		title: "Personal Knowledge Search Across Your Own Files",
		category: "Productivity",
		difficulty: "Advanced",
		businessModel: "One-time",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Private, local search over your notes, PDFs and downloads with plain-language answers.",
		problem: "People cannot find the document they know they saved, and cloud AI search means uploading private files they would rather keep local.",
		targetUsers: "Researchers, lawyers, writers, consultants, privacy-conscious professionals.",
		solution: "A local-first app that indexes chosen folders on the device, runs semantic search entirely locally, and answers questions with the source file and page.",
		key: [
			"Local indexing of chosen folders",
			"Semantic plus keyword hybrid search",
			"Answers with file and page citation",
			"No data leaves the device by default",
			"Optional cloud model for harder questions"
		],
		mvp: [
			"Index one folder",
			"Search with citations",
			"PDF and text support"
		],
		future: [
			"Email archive support",
			"Encrypted multi-device sync",
			"Team edition"
		],
		stack: [
			"Tauri or Electron",
			"SQLite with vector extension",
			"Local embedding model",
			"Optional API fallback"
		],
		money: [
			"One-time licence",
			"Paid major version upgrades",
			"Team licences"
		],
		pricing: "$49 one-time personal licence, $99 for team of five, paid upgrades yearly.",
		acquisition: "Privacy-focused communities, research and legal professional forums, and a free indexing-only tier.",
		first10: "Give free licences to ten researchers with large document archives and publish their workflow write-ups.",
		steps: [
			"Build folder indexing with incremental updates",
			"Add local embeddings and hybrid search",
			"Build the answer UI with citations",
			"Add file format coverage",
			"Add optional cloud fallback with explicit consent",
			"Add licensing and updates"
		],
		risks: [
			"Local model performance varies wildly by machine",
			"Desktop distribution and code signing overhead",
			"One-time pricing limits ongoing revenue"
		],
		score: 7,
		tags: [
			"search",
			"local-first",
			"privacy",
			"documents"
		]
	},
	{
		title: "Travel Itinerary Builder for Groups",
		category: "Productivity",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "One shared plan with votes, costs and offline access instead of a chaotic group chat.",
		problem: "Group trips are planned across chat, screenshots and three spreadsheets, and nobody knows the final plan on the day.",
		targetUsers: "Friend groups, families, small tour organisers, student trips.",
		solution: "A shared itinerary with proposed activities, voting, per-person cost splitting, booking links and an offline day view with maps.",
		key: [
			"Shared day-by-day itinerary",
			"Proposal and voting on activities",
			"Cost splitting with running totals",
			"Offline day view with saved maps",
			"Packing and document checklist"
		],
		mvp: [
			"Shared itinerary with invites",
			"Activity proposals and votes",
			"Offline view"
		],
		future: [
			"Booking integrations and affiliate links",
			"Live location sharing",
			"Trip journal export"
		],
		stack: [
			"React Native or Capacitor",
			"Supabase",
			"Map tiles with offline caching",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Per-trip unlock",
			"Affiliate booking commissions"
		],
		pricing: "Free for trips up to 4 people, $8 per-trip unlock for larger groups.",
		acquisition: "Travel communities, university trip organisers, and seasonal campaigns before holiday periods.",
		first10: "Plan three real group trips using the app with friends, then offer it to travel-community members planning trips in the next month.",
		steps: [
			"Build the shared trip and itinerary model",
			"Add proposals and voting",
			"Add cost splitting",
			"Add offline caching and maps",
			"Add checklists and export",
			"Add per-trip purchases"
		],
		risks: [
			"Extremely seasonal usage",
			"Group adoption problem: one holdout breaks it",
			"Map licensing costs for offline tiles"
		],
		score: 5,
		tags: [
			"travel",
			"groups",
			"planning",
			"offline"
		]
	},
	{
		title: "Automated Weekly Client Report Builder",
		category: "Productivity",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Pulls the numbers, writes the commentary, sends the client report on Friday.",
		problem: "Agencies burn hours every week assembling the same client reports from analytics and ad dashboards, then writing the same commentary.",
		targetUsers: "Marketing agencies, freelance marketers, SEO consultants.",
		solution: "Connect the client's data sources once, then generate a branded weekly report with charts and written commentary explaining changes, sent automatically.",
		key: [
			"Connectors for analytics, search and ad platforms",
			"Branded report templates",
			"AI commentary explaining changes",
			"Scheduled automatic delivery",
			"Client-facing web version with history"
		],
		mvp: [
			"Two connectors",
			"One template with charts",
			"Manual send"
		],
		future: [
			"Goal tracking and alerts",
			"White-label domains",
			"Client comment threads"
		],
		stack: [
			"Next.js",
			"Platform APIs",
			"Claude",
			"Postgres",
			"Resend",
			"Stripe"
		],
		money: ["Subscription by client count", "White-label add-on"],
		pricing: "$29/mo for 5 clients, $79/mo for 20, $149/mo unlimited with white-label.",
		acquisition: "Agency communities, an ROI calculator on hours saved, and templates that agencies share.",
		first10: "Build the first month of reports manually for ten agencies as a done-for-you service, then move them onto the automated product.",
		steps: [
			"Build the first two data connectors",
			"Build the report template renderer",
			"Add commentary generation with change detection",
			"Add scheduling and delivery",
			"Add branding and client web view",
			"Add billing by client count"
		],
		risks: [
			"Connector maintenance across changing platform APIs",
			"Commentary must be accurate or it embarrasses the agency",
			"Established reporting tools with big connector libraries"
		],
		score: 7,
		tags: [
			"agency",
			"reporting",
			"analytics",
			"automation"
		]
	}
];
/** Business — 12 ideas, Finance — 10 ideas, Education — 10 ideas. */
var PART_3 = [
	{
		title: "Local Service Marketplace for One City",
		category: "Business",
		difficulty: "Advanced",
		businessModel: "Marketplace",
		buildType: "Website",
		suitableFor: "Startup",
		short: "A vetted directory and booking layer for trades in a single city, not a global platform.",
		problem: "National marketplaces sell the same lead to five tradespeople and neither side is happy; locals still ask for recommendations in Facebook groups.",
		targetUsers: "Homeowners in one city, and the local trades who serve them.",
		solution: "Manually vetted local providers with real reviews, transparent call-out pricing, and direct booking, monetised by a flat listing fee rather than per-lead auctions.",
		key: [
			"Manually vetted provider profiles",
			"Verified reviews tied to completed bookings",
			"Transparent call-out and hourly pricing",
			"Direct request-to-book with response tracking",
			"Neighbourhood-level search"
		],
		mvp: [
			"Provider directory with 40 vetted trades",
			"Request form routed to providers",
			"Reviews"
		],
		future: [
			"Payments and deposits",
			"Provider subscription tools",
			"Expansion to a second city"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Mapbox",
			"Resend"
		],
		money: [
			"Flat monthly listing fee",
			"Featured placement",
			"Booking deposits"
		],
		pricing: "Providers $39/mo listing, $99/mo featured; free for homeowners.",
		acquisition: "Seed the supply side by hand, then win demand through local SEO, community Facebook groups and printed cards in hardware shops.",
		first10: "Recruit 20 trades by phone offering six free months, then get the first homeowner requests from three local community groups.",
		steps: [
			"Choose the city and vet the first 40 providers manually",
			"Build directory, profiles and search",
			"Build the request and response flow",
			"Add verified reviews after completed jobs",
			"Add provider subscriptions",
			"Measure liquidity before adding any second city"
		],
		risks: [
			"Classic chicken-and-egg marketplace liquidity problem",
			"Vetting does not scale without cost",
			"Users bypass the platform after the first contact"
		],
		score: 6,
		tags: [
			"marketplace",
			"local",
			"trades",
			"directory"
		]
	},
	{
		title: "Franchise Operations Checklist Platform",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Standard operating procedures every branch actually completes and the head office can see.",
		problem: "Multi-site businesses distribute laminated checklists and have no idea whether opening, closing and safety routines are being done.",
		targetUsers: "Franchise owners, multi-site restaurants, gyms, retail chains, cleaning companies.",
		solution: "Digital checklists per site and shift with photo proof, exception flagging and a head-office dashboard showing compliance per branch.",
		key: [
			"Checklist templates per shift and role",
			"Photo and signature proof of completion",
			"Exception flagging and follow-up tasks",
			"Head-office compliance dashboard",
			"Offline completion with later sync"
		],
		mvp: [
			"Templates and daily checklists",
			"Mobile completion",
			"Simple compliance report"
		],
		future: [
			"Temperature and equipment sensor logging",
			"Audit scheduling",
			"Training modules attached to tasks"
		],
		stack: [
			"Next.js",
			"Capacitor mobile shell",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: [
			"Per-site subscription",
			"Head-office platform fee",
			"Onboarding service"
		],
		pricing: "$29/mo per site, $99/mo head-office dashboard, $500 onboarding for 10+ sites.",
		acquisition: "Franchise networks, industry associations, and outreach to multi-site operators via LinkedIn.",
		first10: "Convert one local multi-site operator by digitising their existing paper checklists for free, then use them as a reference to reach similar operators.",
		steps: [
			"Build template and checklist models",
			"Build the mobile completion flow with offline support",
			"Add photo proof and exceptions",
			"Build the head-office dashboard",
			"Add roles and permissions",
			"Add per-site billing"
		],
		risks: [
			"Staff resistance if it feels like surveillance",
			"Cheap paper alternative is entrenched",
			"Offline sync bugs lose completion records"
		],
		score: 7,
		tags: [
			"operations",
			"multi-site",
			"checklists",
			"compliance"
		]
	},
	{
		title: "Quote-to-Cash Tool for Small Manufacturers",
		category: "Business",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Turns a drawing and material list into a costed, margin-checked quote in minutes.",
		problem: "Small workshops quote from memory and spreadsheets, so pricing is inconsistent and low-margin jobs slip through.",
		targetUsers: "Machine shops, joinery and metal fabricators, sign makers, small manufacturers.",
		solution: "Configure materials, machine rates and labour once, then build quotes from a job spec with automatic material cost, waste allowance and margin checking.",
		key: [
			"Material and machine rate library",
			"Quote builder with waste and setup allowances",
			"Margin warnings below threshold",
			"Quote versioning and customer acceptance",
			"Won/lost analysis by job type"
		],
		mvp: [
			"Rate library",
			"Quote builder with PDF output",
			"Margin display"
		],
		future: [
			"Job scheduling from accepted quotes",
			"Purchase order generation",
			"Accounting sync"
		],
		stack: [
			"Next.js",
			"Postgres",
			"PDF generation",
			"Stripe",
			"Supabase Auth"
		],
		money: [
			"Per-workshop subscription",
			"Per-seat add-on",
			"Setup and rate-library service"
		],
		pricing: "$79/mo per workshop with 3 users, $19/mo per extra user, $400 setup.",
		acquisition: "Trade shows, industry Facebook and forum communities, and a free margin calculator.",
		first10: "Spend a day each with five local workshops building their rate library for free, then charge from month two.",
		steps: [
			"Model materials, rates, labour and overhead",
			"Build the quote builder and calculations",
			"Add margin rules and warnings",
			"Add PDF quotes and acceptance",
			"Add reporting on won/lost",
			"Add billing and seats"
		],
		risks: [
			"Every workshop costs jobs differently",
			"Long sales cycles with cautious buyers",
			"Data entry burden during onboarding"
		],
		score: 7,
		tags: [
			"manufacturing",
			"quoting",
			"pricing",
			"b2b"
		]
	},
	{
		title: "Supplier Price Comparison for Restaurants",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Compares delivery-note prices across suppliers and flags the ones creeping upward.",
		problem: "Restaurants receive dozens of invoices a week and never notice a supplier raising unit prices by a few percent every month.",
		targetUsers: "Independent restaurants, cafés, small hotel groups, catering companies.",
		solution: "Photograph or forward invoices, extract line items, and track unit price per product per supplier over time with alerts on increases and cheaper alternatives.",
		key: [
			"Invoice capture by photo or email forwarding",
			"Line-item extraction and product matching",
			"Unit price trend per supplier",
			"Increase alerts with negotiation prompts",
			"Cost-per-dish impact view"
		],
		mvp: [
			"Email invoice ingestion",
			"Line-item extraction",
			"Price change alerts"
		],
		future: [
			"Recipe costing",
			"Group buying across venues",
			"Stock counting"
		],
		stack: [
			"Next.js",
			"OCR plus vision model",
			"Postgres",
			"Resend",
			"Stripe"
		],
		money: ["Per-venue subscription", "Group plan for multi-venue operators"],
		pricing: "$49/mo per venue, $199/mo for up to 6 venues.",
		acquisition: "Restaurant owner groups, hospitality suppliers as partners, and a free three-month price audit.",
		first10: "Process three months of invoices for ten local restaurants free and show each the exact amount of price creep found.",
		steps: [
			"Build invoice ingestion and OCR",
			"Build product matching across supplier naming",
			"Build price history and alerts",
			"Add dish cost impact",
			"Add multi-venue accounts",
			"Add billing"
		],
		risks: [
			"Product matching across inconsistent supplier naming is hard",
			"Thin restaurant margins limit spend",
			"OCR accuracy on poor photos"
		],
		score: 7,
		tags: [
			"hospitality",
			"procurement",
			"ocr",
			"cost control"
		]
	},
	{
		title: "Customer Review Collection and Routing",
		category: "Business",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Asks happy customers for public reviews and routes unhappy ones to a private fix.",
		problem: "Local businesses know reviews drive discovery but ask inconsistently, and one bad public review lands before they hear about the problem.",
		targetUsers: "Local service businesses, clinics, restaurants, e-commerce brands.",
		solution: "Automated review requests by SMS and email after a job, with a satisfaction gate that routes detractors to a private feedback form and a fast resolution workflow.",
		key: [
			"SMS and email request sequences",
			"Satisfaction gate before public review link",
			"Private resolution workflow for complaints",
			"Multi-platform review monitoring",
			"Response templates and reply assistance"
		],
		mvp: [
			"Request sending",
			"Gate and platform link routing",
			"Basic reporting"
		],
		future: [
			"Review reply automation",
			"Photo and video testimonials",
			"Website review widget"
		],
		stack: [
			"Next.js",
			"Twilio",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: [
			"Per-location subscription",
			"SMS usage add-on",
			"Agency reseller plan"
		],
		pricing: "$39/mo per location including 200 SMS, agency plans from $199/mo.",
		acquisition: "Local business outreach, marketing agency reseller partnerships, and a free review-profile audit.",
		first10: "Audit the review profiles of 40 local businesses, send each a one-page summary of what they are losing, and offer a free month.",
		steps: [
			"Build contact import and request sequences",
			"Build the gate and routing logic",
			"Add the private resolution workflow",
			"Add review monitoring",
			"Add agency multi-client management",
			"Add billing and SMS metering"
		],
		risks: [
			"Review platforms restrict gating practices — must follow their policies carefully",
			"SMS costs and regulation vary by country",
			"Commodity category with many competitors"
		],
		score: 6,
		tags: [
			"reviews",
			"local business",
			"reputation",
			"sms"
		]
	},
	{
		title: "Board and Investor Update Generator",
		category: "Business",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Turns your metrics into a consistent monthly investor update that actually gets sent.",
		problem: "Founders skip investor updates when busy, then lose the relationship and the easy follow-on introductions.",
		targetUsers: "Startup founders, fund-backed small businesses, nonprofit directors reporting to boards.",
		solution: "Pull key metrics from connected sources, prompt the founder for three short commentary answers, and produce a consistent update sent to the investor list with read tracking.",
		key: [
			"Metric connections and manual entry",
			"Consistent template with trend charts",
			"Guided commentary prompts",
			"Distribution list with read tracking",
			"Asks section that follows up automatically"
		],
		mvp: [
			"Manual metrics entry",
			"Template generation",
			"Email send"
		],
		future: [
			"Stripe and analytics connectors",
			"Board pack assembly",
			"Data room"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe API",
			"Resend",
			"Claude"
		],
		money: [
			"Subscription",
			"Annual plan",
			"Multi-entity plan for funds"
		],
		pricing: "$19/mo, $190/year, $99/mo for funds managing multiple portfolio updates.",
		acquisition: "Founder communities, accelerator partnerships, and a free investor update template.",
		first10: "Offer to write the next update for 20 founders using their raw numbers, then hand them the tool.",
		steps: [
			"Build metric entry and template rendering",
			"Add commentary prompts",
			"Add distribution and tracking",
			"Add connectors for common data sources",
			"Add asks follow-up",
			"Add billing"
		],
		risks: [
			"Monthly-only usage makes churn easy",
			"Founders may prefer a Google Doc",
			"Sensitive financial data storage expectations"
		],
		score: 6,
		tags: [
			"startups",
			"reporting",
			"investors",
			"templates"
		]
	},
	{
		title: "Small Business Cash Flow Forecaster",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "A thirteen-week cash view built from real invoices and bills, not optimism.",
		problem: "Profitable small businesses still run out of cash because nobody models the timing gap between paying suppliers and getting paid.",
		targetUsers: "Small business owners, bookkeepers, fractional finance directors.",
		solution: "Import invoices and bills, apply historical payment behaviour per customer, and produce a rolling thirteen-week cash forecast with scenario toggles.",
		key: [
			"Invoice and bill import",
			"Customer-specific payment behaviour modelling",
			"Rolling 13-week forecast",
			"Scenario planning for hires, loans and delays",
			"Low-balance alerts"
		],
		mvp: [
			"CSV import",
			"13-week forecast chart",
			"Manual adjustments"
		],
		future: [
			"Accounting software sync",
			"Bank feed integration",
			"Advisor multi-client view"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Accounting APIs",
			"Recharts",
			"Stripe"
		],
		money: ["Subscription by business", "Advisor plan with multiple clients"],
		pricing: "$29/mo per business, advisor plan $99/mo for 10 clients.",
		acquisition: "Bookkeeper and accountant partnerships, small-business finance content, and a free forecast template.",
		first10: "Partner with two bookkeepers who each bring five clients, and give the bookkeeper the advisor plan free.",
		steps: [
			"Build import and normalisation of invoices and bills",
			"Build payment behaviour modelling",
			"Build the forecast engine and chart",
			"Add scenarios and alerts",
			"Add accounting integrations",
			"Add advisor accounts and billing"
		],
		risks: [
			"Accounting integrations are heavy to build and maintain",
			"Forecast accuracy depends on messy input data",
			"Accounting suites include basic forecasting"
		],
		score: 7,
		tags: [
			"cash flow",
			"finance",
			"smb",
			"forecasting"
		]
	},
	{
		title: "Employee Scheduling for Shift Businesses",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Builds fair rotas that respect availability, cost and legal rest rules.",
		problem: "Managers build rotas in spreadsheets on a Sunday night, forget availability requests and blow the labour budget without noticing.",
		targetUsers: "Restaurants, retail, care providers, warehouses, security firms.",
		solution: "Collect availability, auto-generate a rota that respects constraints and budget, then publish it with shift swaps and confirmations tracked.",
		key: [
			"Availability and time-off collection",
			"Auto-generated rota with constraint checking",
			"Labour cost budget tracking",
			"Shift swap requests with approval",
			"Mobile publishing and confirmations"
		],
		mvp: [
			"Manual rota builder with availability",
			"Publish to staff",
			"Cost total"
		],
		future: [
			"Auto-generation",
			"Payroll export",
			"Compliance rules per region"
		],
		stack: [
			"Next.js",
			"Capacitor for staff app",
			"Postgres",
			"Push notifications",
			"Stripe"
		],
		money: [
			"Per-employee subscription",
			"Location minimum",
			"Payroll export add-on"
		],
		pricing: "$2/employee/mo with a $25/mo location minimum.",
		acquisition: "Local outreach, industry groups, and free migration from spreadsheet rotas.",
		first10: "Rebuild the current rota for ten local venues in the tool for free and let the manager compare it to their spreadsheet.",
		steps: [
			"Build staff, availability and shift models",
			"Build the rota editor with conflict warnings",
			"Add cost tracking",
			"Build the staff mobile view and confirmations",
			"Add swaps and approvals",
			"Add billing per employee"
		],
		risks: [
			"Labour law rules differ per region and change",
			"Strong incumbents with free tiers",
			"Staff adoption requires simple mobile access"
		],
		score: 6,
		tags: [
			"scheduling",
			"workforce",
			"shifts",
			"operations"
		]
	},
	{
		title: "Trade Show and Event Lead Capture",
		category: "Business",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Scan badges, capture context, and follow up before the competitor does.",
		problem: "Exhibitors return from events with a pile of business cards, and by the time anyone follows up the buying moment has passed.",
		targetUsers: "B2B exhibitors, sales teams, event organisers, small manufacturers.",
		solution: "Scan a badge or card, record voice notes and qualification answers on the spot, and trigger a personalised follow-up email before the attendee leaves the hall.",
		key: [
			"Badge and business card scanning",
			"Voice note capture with transcription",
			"Qualification questions per event",
			"Instant personalised follow-up email",
			"CRM export and team leaderboard"
		],
		mvp: [
			"Card scan to contact",
			"Notes",
			"CSV export"
		],
		future: [
			"CRM integrations",
			"Event ROI reporting",
			"Multi-team dashboards"
		],
		stack: [
			"Capacitor or React Native",
			"OCR",
			"Whisper for notes",
			"Supabase",
			"Stripe"
		],
		money: ["Per-event licence", "Annual subscription for frequent exhibitors"],
		pricing: "$99 per event for 5 users, $499/year unlimited events.",
		acquisition: "Partnerships with event organisers, exhibitor mailing lists, and on-site presence at one big show.",
		first10: "Attend two trade shows and offer free use at the stand to 15 exhibitors, helping them set it up in person.",
		steps: [
			"Build scanning and contact extraction",
			"Add notes, voice and qualification questions",
			"Add instant follow-up emails",
			"Add exports and integrations",
			"Add team accounts and leaderboards",
			"Add per-event licensing"
		],
		risks: [
			"Badge formats differ per event and may be locked to the organiser",
			"Highly seasonal, event-driven usage",
			"Organisers sell their own lead capture"
		],
		score: 6,
		tags: [
			"events",
			"sales",
			"lead capture",
			"mobile"
		]
	},
	{
		title: "Franchise and Business Buying Due Diligence Assistant",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "One-time",
		buildType: "Website",
		suitableFor: "Freelancer",
		short: "A structured checklist and analysis pack for anyone buying a small business.",
		problem: "First-time buyers of small businesses do not know what to ask for, and discover problems after the money has moved.",
		targetUsers: "First-time business buyers, franchise prospects, small investors, brokers.",
		solution: "A guided due diligence workspace with sector-specific document request lists, red-flag analysis of supplied financials, and a valuation sanity check.",
		key: [
			"Sector-specific document request lists",
			"Financial red-flag analysis from uploaded statements",
			"Valuation sanity check against multiples",
			"Question bank for the seller",
			"Shareable summary for an accountant"
		],
		mvp: [
			"Checklist workspace",
			"Manual financial entry with ratio flags",
			"PDF summary"
		],
		future: [
			"Broker white-label",
			"Statement parsing",
			"Post-purchase 100-day plan"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Claude",
			"Recharts",
			"Stripe"
		],
		money: [
			"One-time purchase per deal",
			"Broker subscription",
			"Advisory upsell"
		],
		pricing: "$149 per deal workspace, broker plan $99/mo unlimited deals.",
		acquisition: "Business-for-sale marketplaces, broker partnerships, and content on due diligence mistakes.",
		first10: "Publish a genuinely thorough free due diligence checklist that ranks in search, and upsell the workspace to downloaders.",
		steps: [
			"Research sector-specific diligence requirements",
			"Build the workspace and checklist engine",
			"Build financial ratio flags",
			"Add valuation comparison",
			"Add sharing and export",
			"Add per-deal payment and broker plans"
		],
		risks: [
			"Must avoid presenting as regulated financial advice",
			"Very low purchase frequency per user",
			"Data quality from small business sellers is poor"
		],
		score: 6,
		tags: [
			"acquisitions",
			"due diligence",
			"smb",
			"checklists"
		]
	},
	{
		title: "White-Label Client Reporting for Bookkeepers",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Monthly management accounts clients understand, produced in minutes.",
		problem: "Bookkeepers send raw profit and loss exports that clients cannot interpret, so the value of the work goes unrecognised.",
		targetUsers: "Bookkeepers, small accounting practices, fractional finance directors.",
		solution: "Import ledger data and produce a branded monthly pack with plain-language commentary, key ratios, and three recommended actions per client.",
		key: [
			"Ledger import from common accounting tools",
			"Branded monthly report pack",
			"Plain-language commentary",
			"Key ratio dashboard per client",
			"Bulk generation across the client book"
		],
		mvp: [
			"CSV ledger import",
			"One report template with commentary",
			"PDF export"
		],
		future: [
			"Direct accounting integrations",
			"Client portal",
			"Benchmarking against sector data"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Claude",
			"PDF rendering",
			"Stripe"
		],
		money: ["Subscription by client count", "White-label add-on"],
		pricing: "$49/mo for 10 clients, $129/mo for 40, white-label included above 40.",
		acquisition: "Bookkeeper communities, accounting software partner directories, and a free sample pack service.",
		first10: "Produce one free branded pack for 20 bookkeepers using their own client data, and let the client reaction sell it.",
		steps: [
			"Build ledger import and normalisation",
			"Build the report template and ratios",
			"Add commentary generation",
			"Add bulk generation",
			"Add branding and white-label",
			"Add billing by client count"
		],
		risks: [
			"Accuracy expectations are absolute in finance",
			"Accounting platform integration effort",
			"Practices are conservative about new tools"
		],
		score: 7,
		tags: [
			"accounting",
			"reporting",
			"white-label",
			"bookkeeping"
		]
	},
	{
		title: "Sustainability Reporting Starter for SMEs",
		category: "Business",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Answers the carbon questionnaires large customers now send to small suppliers.",
		problem: "Small suppliers are suddenly asked for emissions data by big customers and have no idea how to produce a defensible number.",
		targetUsers: "SME suppliers to large corporates, manufacturers, logistics firms, agencies.",
		solution: "Guided data collection from energy bills, travel and purchasing, converted into a basic emissions estimate with a report formatted for customer questionnaires.",
		key: [
			"Guided data collection by category",
			"Emission factor library with sources cited",
			"Customer questionnaire export formats",
			"Year-on-year comparison",
			"Reduction action suggestions with cost estimates"
		],
		mvp: [
			"Energy and travel data entry",
			"Basic scope 1 and 2 estimate",
			"PDF report"
		],
		future: [
			"Supply chain scope 3 estimation",
			"Utility bill parsing",
			"Consultant multi-client mode"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Emission factor datasets",
			"Claude",
			"Stripe"
		],
		money: [
			"Annual subscription",
			"Consultant plan",
			"Report review service"
		],
		pricing: "$600/year per company, consultant plan $200/mo for 15 companies.",
		acquisition: "Procurement-driven demand: partner with large buyers to recommend it to their supplier base.",
		first10: "Approach two large companies' procurement teams and offer their small suppliers a free first-year report.",
		steps: [
			"Select and license emission factor data",
			"Build guided data collection",
			"Build the calculation engine with audit trail",
			"Build questionnaire-ready exports",
			"Add reduction suggestions",
			"Add subscriptions and consultant mode"
		],
		risks: [
			"Methodology standards evolve and vary by scheme",
			"Overstating accuracy creates greenwashing exposure",
			"Consultancies already serve this market"
		],
		score: 6,
		tags: [
			"sustainability",
			"reporting",
			"compliance",
			"supply chain"
		]
	},
	{
		title: "Subscription Audit and Cancellation Helper",
		category: "Finance",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Finds every recurring charge in your statement and shows exactly how to cancel each one.",
		problem: "People pay for forgotten subscriptions for years, and cancellation flows are deliberately hard to find.",
		targetUsers: "Consumers, households cutting costs, small business owners reviewing spend.",
		solution: "Upload or paste a statement, detect recurring charges including price rises and free-trial conversions, and provide the direct cancellation path for each service.",
		key: [
			"Recurring charge detection from statements",
			"Price increase and trial conversion flags",
			"Direct cancellation instructions per service",
			"Annual cost projection",
			"Reminder before the next renewal"
		],
		mvp: [
			"CSV or paste import",
			"Recurring charge list with totals",
			"Cancellation links"
		],
		future: [
			"Bank connections",
			"Negotiation letter generation",
			"Household shared view"
		],
		stack: [
			"Next.js",
			"Client-side parsing",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium",
			"One-time full report",
			"Small subscription for monitoring"
		],
		pricing: "Free basic scan, $9 one-time full report, $3/mo ongoing monitoring.",
		acquisition: "Personal finance content, viral 'how much are you wasting' shareables, and money-saving communities.",
		first10: "Post the free scanner in money-saving communities with a genuine write-up of the average waste found in your own testing.",
		steps: [
			"Build client-side statement parsing for privacy",
			"Build recurring detection and merchant matching",
			"Build the cancellation instruction database",
			"Add projections and reminders",
			"Add the paid report",
			"Add monitoring subscription"
		],
		risks: [
			"Merchant naming in statements is inconsistent",
			"Cancellation instructions go stale constantly",
			"Users are wary of uploading financial data"
		],
		score: 6,
		tags: [
			"subscriptions",
			"savings",
			"personal finance",
			"statements"
		]
	},
	{
		title: "Freelancer Tax Set-Aside Calculator",
		category: "Finance",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Freelancer",
		short: "Tells a freelancer exactly how much of each payment to move aside for tax.",
		problem: "Self-employed people spend money that belongs to the tax authority and face a bill they cannot pay in January.",
		targetUsers: "Freelancers, contractors, gig workers, small sole traders.",
		solution: "Log income and expenses, and the app calculates a running set-aside percentage with a projected bill and a savings target per payment received.",
		key: [
			"Running set-aside percentage per payment",
			"Expense logging with category rules",
			"Projected annual liability",
			"Deadline reminders",
			"Year-end summary for the accountant"
		],
		mvp: [
			"Income entry",
			"Set-aside calculation",
			"Projection view"
		],
		future: [
			"Bank connection",
			"Receipt scanning",
			"Multi-country tax profiles"
		],
		stack: [
			"Capacitor or React Native",
			"SQLite plus sync",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Subscription",
			"Annual plan",
			"Accountant referral partnerships"
		],
		pricing: "$4/mo or $36/year.",
		acquisition: "Freelance communities, accountant partnerships, and content around tax deadlines.",
		first10: "Publish an accurate free set-aside calculator page for one country, then convert users into the tracking app.",
		steps: [
			"Model tax bands for the first country carefully",
			"Build income and expense entry",
			"Build set-aside and projection logic",
			"Add reminders and year-end export",
			"Add a second country profile",
			"Add subscriptions"
		],
		risks: [
			"Tax rules change annually and vary per country",
			"Must be clear it is an estimate, not tax advice",
			"Accounting apps include this feature"
		],
		score: 6,
		tags: [
			"tax",
			"freelance",
			"savings",
			"mobile"
		]
	},
	{
		title: "Rental Property Portfolio Tracker",
		category: "Finance",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Per-property profit, arrears and compliance dates for small landlords.",
		problem: "Small landlords track rent in a spreadsheet and cannot answer which property actually makes money after costs and voids.",
		targetUsers: "Small landlords with 2–20 units, property managers, family property partnerships.",
		solution: "Track rent due and received, costs, mortgage payments and compliance certificate dates per property, with a clear yield and cash position per unit.",
		key: [
			"Rent schedule with arrears tracking",
			"Cost and mortgage logging per property",
			"Yield and net profit per unit",
			"Compliance certificate expiry reminders",
			"Year-end tax summary export"
		],
		mvp: [
			"Property and tenancy setup",
			"Rent tracking",
			"Simple profit view"
		],
		future: [
			"Bank feed reconciliation",
			"Tenant portal",
			"Maintenance job tracking"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Resend",
			"Stripe",
			"Supabase Auth"
		],
		money: ["Subscription by unit count", "Annual plan"],
		pricing: "$9/mo up to 5 units, $19/mo up to 20, $39/mo up to 50.",
		acquisition: "Landlord forums and associations, letting agent partnerships, and content on landlord tax changes.",
		first10: "Offer free setup and data migration from spreadsheets to 15 landlords in one association.",
		steps: [
			"Model properties, tenancies and transactions",
			"Build rent scheduling and arrears",
			"Build cost tracking and yield calculation",
			"Add compliance reminders",
			"Add tax summary exports",
			"Add billing by unit count"
		],
		risks: [
			"Regulatory differences by country and region",
			"Spreadsheet inertia is strong",
			"Larger property management suites compete downward"
		],
		score: 6,
		tags: [
			"property",
			"landlord",
			"portfolio",
			"rent"
		]
	},
	{
		title: "Split-Cost Group Payments for Trips and Events",
		category: "Finance",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Tracks who paid what and settles the group with the fewest transfers.",
		problem: "Group expenses end in awkward chasing because nobody can compute who owes whom without a spreadsheet.",
		targetUsers: "Friend groups, sports clubs, student societies, small event organisers.",
		solution: "Log shared expenses with flexible splits, compute the minimum set of transfers to settle, and send payment requests with reminders.",
		key: [
			"Flexible splits by share, percentage or exact amount",
			"Minimum-transfer settlement calculation",
			"Payment request links and reminders",
			"Multi-currency with historic rates",
			"Exportable group ledger"
		],
		mvp: [
			"Group creation and expenses",
			"Balance and settle-up view",
			"Share link"
		],
		future: [
			"Direct payment rails",
			"Club treasury features",
			"Recurring group costs"
		],
		stack: [
			"React Native or Capacitor",
			"Supabase",
			"Exchange rate API",
			"Stripe",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Pro subscription for clubs",
			"Payment fee on collected transfers"
		],
		pricing: "Free for personal groups, Club plan $9/mo, 1% on collected payments.",
		acquisition: "University societies, sports club networks, and viral group invites.",
		first10: "Run treasury for five real clubs for a season, absorbing the manual work until the tooling replaces it.",
		steps: [
			"Build groups, expenses and split logic",
			"Build the settlement algorithm",
			"Add payment request links",
			"Add multi-currency",
			"Add club treasury features",
			"Add subscriptions and fees"
		],
		risks: [
			"Money movement brings regulatory obligations",
			"Free incumbents are excellent",
			"Group adoption problem"
		],
		score: 5,
		tags: [
			"expenses",
			"groups",
			"payments",
			"settlement"
		]
	},
	{
		title: "Invoice Financing Marketplace for Small Suppliers",
		category: "Finance",
		difficulty: "Advanced",
		businessModel: "Marketplace",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Connects small suppliers with funders willing to advance a specific invoice.",
		problem: "Small suppliers wait 60 to 90 days for payment while paying staff weekly, and bank facilities are slow to arrange.",
		targetUsers: "Small suppliers to large corporates, staffing agencies, logistics providers, funders.",
		solution: "Suppliers upload verified invoices, funders bid to advance them at a stated discount, and repayment is tracked when the customer pays.",
		key: [
			"Invoice verification workflow",
			"Funder bidding with transparent pricing",
			"Risk indicators per debtor",
			"Repayment tracking and reconciliation",
			"Supplier credit history over time"
		],
		mvp: [
			"Manual invoice verification",
			"Fixed-rate advance from one funding partner",
			"Repayment tracking"
		],
		future: [
			"Multi-funder auctions",
			"Accounting integrations",
			"Automated debtor risk scoring"
		],
		stack: [
			"Next.js",
			"Postgres",
			"KYC provider",
			"Payment rails",
			"Stripe for platform fees"
		],
		money: [
			"Percentage fee per advance",
			"Funder platform fee",
			"Subscription for premium suppliers"
		],
		pricing: "1–3% of the advanced invoice value, shared between platform and funder.",
		acquisition: "Industry associations in slow-paying sectors, accountant referrals, and direct outreach to suppliers of known slow payers.",
		first10: "Partner with a single funder, hand-verify the first ten invoices yourself, and deliver funds within 48 hours to prove the promise.",
		steps: [
			"Understand the regulatory position in the target market",
			"Build invoice upload and verification",
			"Onboard one funding partner with fixed terms",
			"Build repayment tracking and reconciliation",
			"Add risk indicators and history",
			"Open to multiple funders"
		],
		risks: [
			"Financial regulation and licensing requirements",
			"Fraud risk on fabricated invoices",
			"Default losses damage funder trust immediately"
		],
		score: 6,
		tags: [
			"fintech",
			"invoicing",
			"marketplace",
			"working capital"
		]
	},
	{
		title: "Price Tracking and Alerts for Big Purchases",
		category: "Finance",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Watches a specific product across retailers and tells you when to buy.",
		problem: "People buy expensive items at the wrong moment because they cannot see price history or predict the next sale.",
		targetUsers: "Consumers making planned purchases, deal hunters, small resellers.",
		solution: "Track a product across selected retailers, show price history, and alert when it drops below a target or hits a historic low.",
		key: [
			"Multi-retailer price tracking",
			"Price history charts",
			"Target price and historic-low alerts",
			"Seasonal sale predictions",
			"Watchlist sharing"
		],
		mvp: [
			"Track a URL from three retailers",
			"History chart",
			"Email alert"
		],
		future: [
			"Browser extension",
			"Affiliate monetisation",
			"Stock availability alerts"
		],
		stack: [
			"Node.js scrapers",
			"Postgres",
			"Next.js",
			"Resend",
			"Cloudflare Workers"
		],
		money: [
			"Freemium by tracked items",
			"Affiliate commissions",
			"Small subscription"
		],
		pricing: "Free 5 items, Pro $3/mo for 100 items and instant alerts.",
		acquisition: "Deal communities, SEO on 'price history for X', and a browser extension as the growth loop.",
		first10: "Track the 50 most-discussed products in one deal community and post honest historic-low alerts publicly.",
		steps: [
			"Build resilient retailer scrapers for a few sites",
			"Build price history storage and charts",
			"Add alerting",
			"Add the browser extension",
			"Add affiliate links where permitted",
			"Add subscription tiers"
		],
		risks: [
			"Scraping is fragile and may breach retailer terms",
			"Affiliate program acceptance is not guaranteed",
			"Established competitors in major markets"
		],
		score: 5,
		tags: [
			"deals",
			"price tracking",
			"consumer",
			"alerts"
		]
	},
	{
		title: "Retirement and Savings Scenario Simulator",
		category: "Finance",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Startup",
		short: "Shows what changing contributions, retirement age or returns really does to the outcome.",
		problem: "Standard retirement calculators give a single scary number with no way to test realistic changes.",
		targetUsers: "Working adults planning retirement, financial coaches, workplace benefit teams.",
		solution: "An interactive simulator with contribution, return, inflation and retirement-age sliders, showing outcome ranges rather than one false-precision figure.",
		key: [
			"Multi-variable interactive scenarios",
			"Monte Carlo outcome ranges",
			"Inflation and fee impact modelling",
			"Saved scenarios with comparison",
			"Shareable plan summary"
		],
		mvp: [
			"Core simulator with sliders",
			"Outcome range chart",
			"Save one scenario"
		],
		future: [
			"Employer-sponsored white-label",
			"Multiple account types",
			"Coach dashboards"
		],
		stack: [
			"Next.js",
			"Web workers for simulation",
			"Supabase",
			"Recharts",
			"Stripe"
		],
		money: [
			"Freemium",
			"Subscription for saved scenarios",
			"White-label to employers and coaches"
		],
		pricing: "Free simulator, Plus $5/mo for saved plans, employer licence from $2,000/year.",
		acquisition: "SEO on retirement planning questions, financial-independence communities, and employer benefit partnerships.",
		first10: "Publish the free simulator with an honest methodology page, and pitch two employers on a branded version after it gains traffic.",
		steps: [
			"Build the simulation engine with documented assumptions",
			"Build the interactive UI",
			"Add outcome ranges and fee modelling",
			"Add saved scenarios and sharing",
			"Add white-label theming",
			"Add subscriptions and licensing"
		],
		risks: [
			"Financial projections attract regulatory scrutiny",
			"Assumption choices can mislead users",
			"Free calculators from large institutions"
		],
		score: 6,
		tags: [
			"retirement",
			"planning",
			"simulation",
			"calculators"
		]
	},
	{
		title: "Expense Approval for Small Nonprofits",
		category: "Finance",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Simple receipt submission and trustee approval with an audit trail.",
		problem: "Small charities reimburse volunteers by bank transfer with receipts in email, which fails the first time an auditor looks.",
		targetUsers: "Small charities, community groups, sports clubs, school associations.",
		solution: "Volunteers submit a photo receipt with a purpose and budget line, approvers sign off in one tap, and everything is stored with an auditable trail and export.",
		key: [
			"Photo receipt submission with budget line",
			"Two-step approval workflow",
			"Budget line spend tracking",
			"Audit-ready export",
			"Reimbursement status visible to submitters"
		],
		mvp: [
			"Submit receipt",
			"Approve or reject",
			"CSV export"
		],
		future: [
			"Direct payment integration",
			"Grant fund tracking",
			"Multi-entity support"
		],
		stack: [
			"Next.js",
			"Supabase",
			"R2 storage",
			"Resend",
			"Stripe"
		],
		money: [
			"Low nonprofit subscription",
			"Free tier for tiny organisations",
			"Grant-funded plans"
		],
		pricing: "Free under 20 claims/year, $15/mo standard, $39/mo for multi-entity.",
		acquisition: "Charity networks, volunteer coordinator communities, and accountants who serve nonprofits.",
		first10: "Set it up personally for five local charities and let their treasurers recommend it within their networks.",
		steps: [
			"Build submission and approval flows",
			"Add budget lines and tracking",
			"Add audit export",
			"Add roles and permissions",
			"Add reimbursement status",
			"Add billing with a nonprofit-friendly free tier"
		],
		risks: [
			"Very small budgets in this sector",
			"Volunteer turnover means repeated onboarding",
			"Generic expense tools are cheap"
		],
		score: 6,
		tags: [
			"nonprofit",
			"expenses",
			"approvals",
			"audit"
		]
	},
	{
		title: "Crypto and Investment Tax Report Builder",
		category: "Finance",
		difficulty: "Advanced",
		businessModel: "One-time",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Turns messy exchange exports into a defensible gains report.",
		problem: "Investors with activity across several exchanges and wallets cannot compute cost basis correctly and either overpay or file wrong.",
		targetUsers: "Retail investors, accountants serving them, small funds.",
		solution: "Import exchange and wallet exports, normalise transactions, apply the correct cost-basis method for the jurisdiction, and generate a filing-ready report with a full transaction audit trail.",
		key: [
			"Import from many exchange formats",
			"Transaction matching and transfer detection",
			"Configurable cost-basis method",
			"Filing-ready report with audit trail",
			"Accountant sharing mode"
		],
		mvp: [
			"Import three exchange formats",
			"Cost basis calculation",
			"PDF and CSV report"
		],
		future: [
			"On-chain wallet syncing",
			"More jurisdictions",
			"Accountant multi-client dashboard"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Blockchain data APIs",
			"Stripe"
		],
		money: [
			"Pay per tax year",
			"Accountant subscription",
			"Volume tiers by transaction count"
		],
		pricing: "$59 per tax year up to 1,000 transactions, $149 up to 10,000; accountants $99/mo.",
		acquisition: "Seasonal SEO around filing deadlines, accountant partnerships, and investing communities.",
		first10: "Offer free reports to ten accountants' clients during one filing season in exchange for detailed accuracy feedback.",
		steps: [
			"Build importers for the most common formats",
			"Build transaction normalisation and transfer matching",
			"Implement cost-basis methods per jurisdiction",
			"Build reports with audit trail",
			"Add accountant sharing",
			"Add seasonal pricing and support capacity"
		],
		risks: [
			"Tax treatment differs sharply by jurisdiction and changes",
			"Data quality from exchanges is poor",
			"Extremely seasonal revenue with heavy support load"
		],
		score: 6,
		tags: [
			"tax",
			"crypto",
			"investing",
			"reporting"
		]
	},
	{
		title: "Bill Negotiation Assistant",
		category: "Finance",
		difficulty: "Beginner",
		businessModel: "Service",
		buildType: "Website",
		suitableFor: "Freelancer",
		short: "Scripts and letters that get broadband, insurance and energy bills reduced.",
		problem: "Most households could cut recurring bills by asking properly, but nobody knows what to say or which lever works.",
		targetUsers: "Households, students, small business owners, budget-conscious consumers.",
		solution: "Enter the provider and current price, receive a tailored negotiation script with realistic target pricing and competitor comparison, plus a written cancellation-threat letter if needed.",
		key: [
			"Provider-specific negotiation scripts",
			"Realistic target price guidance",
			"Competitor offer comparison",
			"Written escalation letters",
			"Savings tracker across bills"
		],
		mvp: [
			"Three provider categories",
			"Script generation",
			"Savings tracker"
		],
		future: [
			"Done-for-you negotiation service",
			"Renewal reminders",
			"Community-sourced target prices"
		],
		stack: [
			"Next.js",
			"Claude",
			"Supabase",
			"Stripe"
		],
		money: [
			"Success fee on savings",
			"One-time script purchase",
			"Subscription for reminders"
		],
		pricing: "$5 per script pack, or 20% of the first year's saving for the done-for-you service.",
		acquisition: "Money-saving communities, seasonal content around renewal periods, and shareable saving results.",
		first10: "Negotiate bills personally for 15 people for free, publish the exact savings achieved, and turn the scripts that worked into the product.",
		steps: [
			"Research provider-specific retention practices",
			"Build script generation by provider and situation",
			"Add target price guidance from community data",
			"Add letters and escalation paths",
			"Add savings tracking",
			"Add payment and the service tier"
		],
		risks: [
			"Provider retention practices change constantly",
			"Success fee collection is hard to enforce",
			"Regional pricing knowledge does not transfer"
		],
		score: 5,
		tags: [
			"savings",
			"negotiation",
			"bills",
			"consumer"
		]
	},
	{
		title: "Practice Question Bank Builder for Teachers",
		category: "Education",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Generates differentiated practice sets aligned to what the class just covered.",
		problem: "Teachers spend evenings making three versions of a worksheet for different ability levels using textbooks that do not match their sequence.",
		targetUsers: "School teachers, tutors, homeschool parents, tutoring centres.",
		solution: "Select topic and level, generate practice questions at three difficulty tiers with worked solutions, then export as printable worksheets or an online set.",
		key: [
			"Topic and curriculum-level selection",
			"Three differentiation tiers per set",
			"Worked solutions and mark schemes",
			"Printable and online export",
			"Saved question bank with reuse"
		],
		mvp: [
			"Generate a worksheet for one subject",
			"Solutions",
			"PDF export"
		],
		future: [
			"Student online assignment mode",
			"Progress analytics",
			"School-wide shared banks"
		],
		stack: [
			"Next.js",
			"Claude",
			"Supabase",
			"PDF rendering",
			"Stripe"
		],
		money: [
			"Teacher subscription",
			"School site licence",
			"Free tier for limited sets"
		],
		pricing: "Teacher $8/mo, Department $99/mo, School site licence from $600/year.",
		acquisition: "Teacher communities and subject associations, free worksheet packs that rank in search, and school department pilots.",
		first10: "Give a full year free to ten teachers across three subjects in exchange for weekly feedback and shared worksheets.",
		steps: [
			"Model subjects, topics and difficulty tiers",
			"Build generation with strict answer-accuracy checking",
			"Build worksheet layout and export",
			"Add saved banks and reuse",
			"Add school accounts",
			"Add billing tiers"
		],
		risks: [
			"Mathematical and factual accuracy must be near perfect",
			"School procurement is slow and budget-limited",
			"Curriculum alignment differs by country"
		],
		score: 7,
		tags: [
			"teaching",
			"worksheets",
			"assessment",
			"schools"
		]
	},
	{
		title: "Language Speaking Practice with Feedback",
		category: "Education",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Startup",
		short: "Real conversation practice with pronunciation and grammar feedback after each turn.",
		problem: "Learners can read and listen but freeze when speaking, and human tutors are expensive for daily practice.",
		targetUsers: "Language learners at intermediate level, exam candidates, professionals relocating.",
		solution: "Scenario-based spoken conversations with an AI partner that corrects pronunciation and grammar gently, tracks recurring errors and revisits them.",
		key: [
			"Scenario-based speaking practice",
			"Pronunciation scoring per phoneme group",
			"Grammar correction with explanation",
			"Recurring error tracking and revision",
			"Exam-format practice modes"
		],
		mvp: [
			"Five scenarios in one language",
			"Speech recognition plus correction",
			"Session summary"
		],
		future: [
			"More languages",
			"Tutor marketplace handoff",
			"Group speaking rooms"
		],
		stack: [
			"React Native",
			"Realtime speech API",
			"Claude",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Subscription",
			"Annual plan",
			"Exam prep packs"
		],
		pricing: "$12/mo, $99/year, exam pack $29 one-time.",
		acquisition: "Language learning communities, exam prep forums, and app store optimisation per language pair.",
		first10: "Run free daily practice sessions for a group of 20 exam candidates and publish their score improvements.",
		steps: [
			"Build the realtime speech conversation loop",
			"Build pronunciation and grammar feedback",
			"Add scenarios and level progression",
			"Add error tracking and revision",
			"Add exam modes",
			"Add subscriptions"
		],
		risks: [
			"Realtime voice cost per minute is high",
			"Speech recognition is weaker for strong accents — exactly the users you serve",
			"Very large funded competitors"
		],
		score: 7,
		tags: [
			"language",
			"speaking",
			"voice",
			"learning"
		]
	},
	{
		title: "Cohort Course Operations Platform",
		category: "Education",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Runs the admin of a live cohort course so the instructor can teach.",
		problem: "Cohort course instructors juggle scheduling, reminders, attendance, assignments and community across five separate tools.",
		targetUsers: "Independent educators, bootcamps, corporate trainers, coaching programs.",
		solution: "One workspace for cohort scheduling, automated reminders, attendance, assignment collection and feedback, plus a per-cohort discussion space.",
		key: [
			"Cohort calendar with automated reminders",
			"Attendance tracking and catch-up materials",
			"Assignment submission and feedback",
			"Per-cohort discussion space",
			"Completion certificates and outcomes reporting"
		],
		mvp: [
			"Cohort scheduling and reminders",
			"Attendance",
			"Assignment submission"
		],
		future: [
			"Payment plans and enrolment",
			"Alumni community",
			"Corporate reporting"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Stripe",
			"Video conferencing links"
		],
		money: [
			"Per-cohort subscription",
			"Per-learner pricing",
			"Enterprise training plans"
		],
		pricing: "$49/mo per active cohort, or $4 per enrolled learner, enterprise from $500/mo.",
		acquisition: "Educator communities, cohort-based course networks, and partnerships with course marketing tools.",
		first10: "Run operations manually for five instructors' next cohorts, then productise exactly what you did.",
		steps: [
			"Model cohorts, sessions and learners",
			"Build scheduling and reminders",
			"Add attendance and assignments",
			"Add discussion",
			"Add certificates and reporting",
			"Add billing"
		],
		risks: [
			"Instructors already patch this together for free",
			"Cohort courses are labour-intensive and churn",
			"LMS incumbents in corporate training"
		],
		score: 6,
		tags: [
			"cohort",
			"education",
			"operations",
			"instructors"
		]
	},
	{
		title: "Reading Progress Tracker for Schools",
		category: "Education",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Tracks what children read at home and gives teachers a real picture.",
		problem: "Reading records are paper diaries that get lost, and teachers cannot see which children are actually reading at home.",
		targetUsers: "Primary schools, teachers, parents, reading intervention specialists.",
		solution: "Parents log reading in a mobile app, teachers see class-level engagement and book difficulty progression, and interventions are triggered when a child stalls.",
		key: [
			"Parent mobile logging with book search",
			"Class engagement dashboard",
			"Reading level progression tracking",
			"Automatic intervention flags",
			"School-wide reporting"
		],
		mvp: [
			"Parent logging",
			"Teacher class view",
			"Weekly summary"
		],
		future: [
			"Book recommendation by level",
			"Library integration",
			"Multi-language parent app"
		],
		stack: [
			"Capacitor",
			"Next.js",
			"Supabase",
			"Book metadata API",
			"Stripe"
		],
		money: [
			"Per-school annual licence",
			"Per-pupil pricing",
			"Trust or district contracts"
		],
		pricing: "$3 per pupil per year, minimum $600 per school.",
		acquisition: "Teacher networks, education conferences, and free pilots for one class per school.",
		first10: "Pilot free with one class in ten schools for a term and present the engagement data at a school leadership meeting.",
		steps: [
			"Build parent logging with fast book lookup",
			"Build the teacher dashboard",
			"Add progression tracking and flags",
			"Add school-wide reporting",
			"Add multi-language parent support",
			"Add school billing and admin"
		],
		risks: [
			"Children's data protection requirements are strict",
			"School budgets and procurement cycles",
			"Parent adoption drives the whole value"
		],
		score: 6,
		tags: [
			"schools",
			"reading",
			"parents",
			"engagement"
		]
	},
	{
		title: "Skill Assessment Platform for Bootcamps",
		category: "Education",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Objective, repeatable skill checks that prove graduate readiness to employers.",
		problem: "Bootcamps claim outcomes but cannot evidence individual skill levels, so employers discount their graduates.",
		targetUsers: "Bootcamps, training providers, employers hiring juniors, apprenticeship schemes.",
		solution: "Standardised practical assessments with automatic scoring on real tasks, producing a verifiable skill profile per learner that employers can check.",
		key: [
			"Practical task-based assessments",
			"Automatic scoring with rubric transparency",
			"Verifiable learner skill profile",
			"Cohort benchmark reporting",
			"Employer verification link"
		],
		mvp: [
			"Three assessments in one discipline",
			"Auto-scoring",
			"Learner profile page"
		],
		future: [
			"Employer talent search",
			"Custom employer assessments",
			"Proctoring options"
		],
		stack: [
			"Next.js",
			"Sandboxed execution runners",
			"Postgres",
			"Stripe"
		],
		money: [
			"Per-learner assessment fee",
			"Provider subscription",
			"Employer search subscription"
		],
		pricing: "$15 per learner assessment, provider plan $299/mo, employer search $199/mo.",
		acquisition: "Bootcamp partnerships first, then employer demand created by verified profiles in the market.",
		first10: "Assess three cohorts free, publish anonymised benchmark data, and let providers use it in their marketing.",
		steps: [
			"Design assessments with real practitioners",
			"Build the sandboxed execution and scoring",
			"Build learner profiles and verification",
			"Add cohort benchmarking",
			"Add employer verification",
			"Add billing"
		],
		risks: [
			"Assessment credibility takes years to establish",
			"Cheating and proctoring challenges",
			"Two-sided adoption between providers and employers"
		],
		score: 6,
		tags: [
			"assessment",
			"bootcamps",
			"hiring",
			"skills"
		]
	},
	{
		title: "Homework Help Guardrails for Parents",
		category: "Education",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Explains the method step by step instead of handing over the answer.",
		problem: "Children paste homework into general AI tools and get finished answers, which harms learning and worries parents and teachers.",
		targetUsers: "Parents of school-age children, tutors, schools setting home-learning policy.",
		solution: "A tutor mode that refuses to give final answers, asks guiding questions, explains the method, and reports to the parent what the child struggled with.",
		key: [
			"Socratic guidance that withholds final answers",
			"Method explanations matched to school approach",
			"Parent report of struggle areas",
			"Photo capture of the question",
			"Age-appropriate safety controls"
		],
		mvp: [
			"Photo or typed question",
			"Guided steps without the answer",
			"Parent summary"
		],
		future: [
			"Curriculum alignment per region",
			"School partnerships",
			"Progress tracking over terms"
		],
		stack: [
			"Capacitor or React Native",
			"Vision model",
			"Claude",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Family subscription",
			"School licences"
		],
		pricing: "Free 5 questions/week, Family $8/mo, school licence from $500/year.",
		acquisition: "Parent communities, school newsletters, and content on AI and homework integrity.",
		first10: "Recruit 20 parents from two school parent groups for a free term, and share aggregate results with the school.",
		steps: [
			"Build question capture with photo support",
			"Build the guided tutoring prompt with strict answer withholding",
			"Add parent reporting",
			"Add safety controls and age settings",
			"Add curriculum variants",
			"Add subscriptions and school licences"
		],
		risks: [
			"Children will try to bypass the guardrails",
			"Child safety and data rules are strict",
			"Free general AI tools are one tap away"
		],
		score: 7,
		tags: [
			"homework",
			"tutoring",
			"parents",
			"safety"
		]
	},
	{
		title: "Micro-Credential Portfolio for Learners",
		category: "Education",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "One verified page for every course, certificate and project a person completes.",
		problem: "Learners collect certificates across a dozen platforms and have nowhere credible to show them together.",
		targetUsers: "Career changers, self-taught learners, training providers, recruiters.",
		solution: "A hosted portfolio that imports certificates, verifies issuer links, and presents skills with evidence projects in a format recruiters can scan in 30 seconds.",
		key: [
			"Certificate import and issuer verification",
			"Skills mapped to evidence projects",
			"Recruiter-friendly single-page layout",
			"Custom domain support",
			"Shareable PDF version"
		],
		mvp: [
			"Manual certificate entry with links",
			"Public portfolio page",
			"PDF export"
		],
		future: [
			"Automated verification integrations",
			"Provider-issued credentials",
			"Recruiter search"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Cloudflare"
		],
		money: [
			"Freemium",
			"Custom domain subscription",
			"Provider issuing plans"
		],
		pricing: "Free portfolio, Pro $4/mo for custom domain and analytics, provider plans from $99/mo.",
		acquisition: "Career-change communities, training provider partnerships, and SEO from public portfolio pages.",
		first10: "Build polished portfolios by hand for 20 career changers and let their job applications spread the link.",
		steps: [
			"Build portfolio data model and public pages",
			"Add certificate entry and link verification",
			"Add skills and evidence mapping",
			"Add PDF export and analytics",
			"Add custom domains",
			"Add provider issuing tools"
		],
		risks: [
			"Verification is only as strong as issuer cooperation",
			"LinkedIn covers much of this free",
			"Weak monetisation on the learner side"
		],
		score: 5,
		tags: [
			"credentials",
			"portfolio",
			"careers",
			"verification"
		]
	},
	{
		title: "Curriculum Planning Assistant for Homeschoolers",
		category: "Education",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Builds a year plan from free resources and keeps the legal records you need.",
		problem: "Homeschooling parents assemble a curriculum from scattered free resources and struggle to keep the records their jurisdiction requires.",
		targetUsers: "Homeschooling parents, micro-schools, education co-ops.",
		solution: "Choose subjects and levels, get a scheduled year plan built from curated free and low-cost resources, and log completed work into a compliant portfolio record.",
		key: [
			"Year plan generation across subjects",
			"Curated free resource library",
			"Attendance and work logging",
			"Jurisdiction-aware record templates",
			"Multiple children in one household plan"
		],
		mvp: [
			"Plan builder for three subjects",
			"Resource library",
			"Work log"
		],
		future: [
			"Co-op sharing",
			"Assessment tracking",
			"Portfolio export for review meetings"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Claude",
			"Stripe"
		],
		money: [
			"Household subscription",
			"Annual plan",
			"Co-op group plans"
		],
		pricing: "$9/mo per household, $79/year, co-op plans from $199/year.",
		acquisition: "Homeschool communities and conferences, curated free resource lists that rank, and co-op partnerships.",
		first10: "Publish one exceptional free year plan for a popular subject and invite downloaders into the planner.",
		steps: [
			"Curate the free resource library carefully",
			"Build the plan generator and scheduler",
			"Build work logging",
			"Add jurisdiction record templates",
			"Add multi-child households",
			"Add billing"
		],
		risks: [
			"Record requirements differ sharply by region",
			"Resource links rot constantly",
			"Community is price-sensitive and sharing-oriented"
		],
		score: 6,
		tags: [
			"homeschool",
			"curriculum",
			"planning",
			"records"
		]
	},
	{
		title: "Peer Study Group Matching",
		category: "Education",
		difficulty: "Beginner",
		businessModel: "Advertising",
		buildType: "Website",
		suitableFor: "Beginner",
		short: "Matches learners studying the same thing at the same pace into small accountable groups.",
		problem: "Online learners drop out because they study alone, and finding peers at the same stage is oddly hard.",
		targetUsers: "MOOC learners, exam candidates, university students, professional certification takers.",
		solution: "Match learners by course, target date and weekly time commitment into groups of four to six, with a scheduled first session and simple check-in structure.",
		key: [
			"Matching by course, pace and timezone",
			"Scheduled first session with structure",
			"Weekly check-in prompts",
			"Group health signals and re-matching",
			"Public course-specific group directory"
		],
		mvp: [
			"Signup with course and availability",
			"Group formation",
			"Email introductions"
		],
		future: [
			"Integrated video sessions",
			"Provider partnerships",
			"Paid coach-led groups"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Matching worker"
		],
		money: [
			"Advertising and course affiliate revenue",
			"Paid coach-led groups",
			"Provider sponsorship"
		],
		pricing: "Free for learners; revenue from course affiliate links and sponsored provider groups.",
		acquisition: "Course-specific subreddits and Discords, and partnerships with course creators who want completion rates up.",
		first10: "Manually form five groups for one popular certification, facilitate the first session yourself, and publish completion results.",
		steps: [
			"Build signup capturing course, pace and availability",
			"Build the matching algorithm",
			"Build introductions and first-session scheduling",
			"Add check-ins and group health",
			"Add the public directory",
			"Add affiliate and sponsorship revenue"
		],
		risks: [
			"Group formation quality drives everything and is hard to automate",
			"Free users only, so monetisation is thin",
			"Needs density per course to work"
		],
		score: 5,
		tags: [
			"study groups",
			"matching",
			"community",
			"learning"
		]
	},
	{
		title: "Exam Revision Timetable Generator",
		category: "Education",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Builds a realistic revision plan around the exam dates and adapts when you fall behind.",
		problem: "Students make a colourful revision timetable, fall behind in week one, and abandon it entirely.",
		targetUsers: "School and university students, exam candidates, parents supporting revision.",
		solution: "Enter subjects, exam dates and confidence per topic, get a spaced-repetition revision schedule, and have it automatically rebalance when sessions are missed.",
		key: [
			"Schedule built from exam dates and topic confidence",
			"Spaced repetition across topics",
			"Automatic rebalancing after missed sessions",
			"Session check-in with confidence updates",
			"Parent or tutor progress view"
		],
		mvp: [
			"Subject and date entry",
			"Generated schedule",
			"Mark sessions complete"
		],
		future: [
			"Past paper linking",
			"Study group sync",
			"School-wide deployment"
		],
		stack: [
			"Capacitor or React Native",
			"Supabase",
			"Push notifications",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Exam-season subscription",
			"School licences"
		],
		pricing: "Free single subject, $4/mo during exam season, school licence from $400/year.",
		acquisition: "Student communities, exam-season TikTok content, and school partnerships before exam periods.",
		first10: "Give the app to one school year group free before mock exams and collect results to pitch the full school.",
		steps: [
			"Build subject, topic and confidence entry",
			"Build the scheduling and spaced repetition engine",
			"Add rebalancing logic",
			"Add notifications and check-ins",
			"Add parent and tutor views",
			"Add subscriptions and school plans"
		],
		risks: [
			"Sharply seasonal usage",
			"Students abandon planning tools quickly",
			"Free templates are everywhere"
		],
		score: 5,
		tags: [
			"revision",
			"exams",
			"scheduling",
			"students"
		]
	}
];
/** Healthcare — 8, HR — 8, Marketing — 10, E-commerce — 10. */
var PART_4 = [
	{
		title: "Clinic No-Show Reduction System",
		category: "Healthcare",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Smart reminders, easy rescheduling and waitlist backfill for empty slots.",
		problem: "Private clinics lose a tenth of their revenue to missed appointments and leave the slot empty because rebooking is manual.",
		targetUsers: "Dental, physio, cosmetic and veterinary clinics; small private practices.",
		solution: "Multi-channel reminders with one-tap confirm or reschedule, a standby waitlist that auto-fills cancellations, and no-show risk scoring per patient.",
		key: [
			"SMS, email and WhatsApp reminders with confirm links",
			"One-tap reschedule into real availability",
			"Automatic waitlist backfill of cancellations",
			"No-show risk scoring and deposit rules",
			"Revenue-recovered reporting"
		],
		mvp: [
			"Reminder sequences with confirmation",
			"Manual waitlist",
			"Basic reporting"
		],
		future: [
			"Practice management integrations",
			"Deposit collection",
			"Multi-site analytics"
		],
		stack: [
			"Next.js",
			"Twilio",
			"Postgres",
			"Stripe",
			"Cron worker"
		],
		money: [
			"Per-clinic subscription",
			"Message usage add-on",
			"Percentage-of-recovery pilot pricing"
		],
		pricing: "$79/mo per clinic including 500 messages, $0.05 per extra message.",
		acquisition: "Direct outreach to private clinics, practice-management resellers, and a free no-show cost calculator.",
		first10: "Calculate the annual no-show cost for 30 local clinics from their published prices and typical rates, and offer a 60-day trial to recover it.",
		steps: [
			"Build appointment import or manual entry",
			"Build reminder sequences with confirmation handling",
			"Build the waitlist backfill engine",
			"Add risk scoring and deposit rules",
			"Add recovery reporting",
			"Add billing and message metering"
		],
		risks: [
			"Health data handling requires strict privacy compliance",
			"Practice management systems restrict integration",
			"Messaging regulation varies by country"
		],
		score: 8,
		tags: [
			"clinics",
			"appointments",
			"reminders",
			"revenue"
		]
	},
	{
		title: "Medication Reminder for Carers",
		category: "Healthcare",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Family carers see whether a relative actually took the medication today.",
		problem: "Family carers manage complex medication schedules remotely and have no reliable way to know a dose was taken.",
		targetUsers: "Family carers, elderly patients, home care agencies, community nurses.",
		solution: "Simple large-type reminders on the patient's device with a one-tap confirmation that notifies the carer, plus escalation if a dose is missed.",
		key: [
			"Large-type simple patient interface",
			"One-tap dose confirmation",
			"Carer dashboard with missed-dose alerts",
			"Refill reminders",
			"Shared notes between multiple carers"
		],
		mvp: [
			"Schedule entry",
			"Patient reminders and confirmation",
			"Carer notification"
		],
		future: [
			"Pharmacy refill integration",
			"Care agency dashboards",
			"Smart pill dispenser support"
		],
		stack: [
			"React Native or Capacitor",
			"Supabase",
			"Push notifications",
			"RevenueCat"
		],
		money: [
			"Freemium for one patient",
			"Family subscription",
			"Care agency licences"
		],
		pricing: "Free single patient, Family $5/mo for multiple carers, agency plans from $99/mo.",
		acquisition: "Carer support communities, pharmacy partnerships, and content on managing medication remotely.",
		first10: "Work directly with a local carer support group, onboarding 15 families in person and fixing usability issues on the spot.",
		steps: [
			"Design the patient interface with older users directly",
			"Build schedules and reminders",
			"Build carer notifications and escalation",
			"Add refill reminders and notes",
			"Add agency multi-patient views",
			"Add subscriptions"
		],
		risks: [
			"Missed reminders have real health consequences",
			"Must avoid presenting as a medical device",
			"Elderly device access and notification reliability"
		],
		score: 7,
		tags: [
			"carers",
			"medication",
			"reminders",
			"elderly"
		]
	},
	{
		title: "Therapy Practice Admin Suite",
		category: "Healthcare",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Bookings, notes, invoices and consent forms for independent therapists.",
		problem: "Independent therapists spend unpaid evenings on scheduling, invoicing and secure note-keeping across four different tools.",
		targetUsers: "Private therapists, counsellors, physiotherapists, nutritionists, small clinics.",
		solution: "One secure workspace for booking, encrypted session notes, invoicing with insurance codes, consent forms and retention-compliant record keeping.",
		key: [
			"Online booking with availability rules",
			"Encrypted session notes with templates",
			"Invoicing with insurance references",
			"Digital consent and intake forms",
			"Retention and export controls"
		],
		mvp: [
			"Booking page",
			"Session notes",
			"Invoice generation"
		],
		future: [
			"Insurance claim submission",
			"Group practice mode",
			"Outcome measure tracking"
		],
		stack: [
			"Next.js",
			"Supabase with encryption",
			"Stripe",
			"Resend"
		],
		money: ["Per-practitioner subscription", "Group practice plan"],
		pricing: "$29/mo solo, $79/mo for a practice of five.",
		acquisition: "Professional association partnerships, therapist communities, and content on practice admin time.",
		first10: "Migrate ten therapists from spreadsheets and paper personally, including their existing client records.",
		steps: [
			"Design the data model with privacy and retention first",
			"Build booking and availability",
			"Build encrypted notes with templates",
			"Add invoicing",
			"Add consent and intake forms",
			"Add group practice and billing"
		],
		risks: [
			"Health record regulation is strict and varies by country",
			"Breach consequences are severe",
			"Established practice management competitors"
		],
		score: 7,
		tags: [
			"therapy",
			"practice management",
			"notes",
			"privacy"
		]
	},
	{
		title: "Symptom Diary for Chronic Conditions",
		category: "Healthcare",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Structured tracking that turns into a one-page summary for the next appointment.",
		problem: "Patients with chronic conditions cannot recall patterns during a ten-minute consultation, so treatment decisions are made on vague recollection.",
		targetUsers: "People with migraine, IBS, endometriosis, arthritis and similar conditions; their clinicians.",
		solution: "Fast daily logging of symptoms, triggers and medication, with pattern detection and a printable one-page summary formatted for a clinical appointment.",
		key: [
			"Fast structured daily logging",
			"Trigger and pattern correlation",
			"Medication effect tracking",
			"One-page clinician summary export",
			"Condition-specific templates"
		],
		mvp: [
			"Daily log for one condition",
			"Trend charts",
			"PDF summary"
		],
		future: [
			"Wearable data import",
			"Clinician shared access",
			"Research data contribution opt-in"
		],
		stack: [
			"React Native or Capacitor",
			"Local storage with sync",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription for exports and patterns",
			"Research partnerships with consent"
		],
		pricing: "Free logging, Plus $4/mo for pattern analysis and clinician exports.",
		acquisition: "Patient communities and charities per condition, clinician recommendations, and condition-specific content.",
		first10: "Partner with one patient charity, build exactly the template their community asks for, and let them share it.",
		steps: [
			"Co-design the logging flow with real patients",
			"Build logging and trend charts",
			"Add correlation analysis with careful caveats",
			"Build the clinician summary export",
			"Add more condition templates",
			"Add subscriptions"
		],
		risks: [
			"Correlation claims can mislead — presentation must be careful",
			"Health data sensitivity and consent",
			"Retention drops when symptoms improve"
		],
		score: 6,
		tags: [
			"chronic illness",
			"tracking",
			"patients",
			"health"
		]
	},
	{
		title: "Care Home Family Update Portal",
		category: "Healthcare",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Staff post a two-minute daily update, families stop phoning the ward.",
		problem: "Families ring care homes constantly for reassurance, which consumes staff time, and families still feel uninformed.",
		targetUsers: "Care homes, assisted living facilities, families of residents.",
		solution: "A simple staff app for posting short daily updates and photos per resident, with a family portal, consent controls and message threads.",
		key: [
			"Quick staff update posting with photos",
			"Per-resident family access with consent",
			"Message threads with staff",
			"Activity calendar visibility",
			"Audit log of who saw what"
		],
		mvp: [
			"Staff posting",
			"Family view",
			"Consent management"
		],
		future: [
			"Care plan visibility",
			"Video calls",
			"Multi-home group reporting"
		],
		stack: [
			"Next.js",
			"Capacitor staff app",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: [
			"Per-home subscription",
			"Per-resident pricing",
			"Group contracts"
		],
		pricing: "$3 per resident per month, minimum $99/mo per home.",
		acquisition: "Care sector associations, direct outreach to home managers, and family word of mouth.",
		first10: "Pilot free in two homes for a quarter, measure the reduction in inbound calls, and use that figure in every pitch.",
		steps: [
			"Design consent and data access model first",
			"Build the staff posting flow to be genuinely fast",
			"Build the family portal",
			"Add threads and calendar",
			"Add audit logging",
			"Add billing per resident"
		],
		risks: [
			"Consent and capacity issues around resident data",
			"Staff time pressure blocks adoption",
			"Sector budgets are tight and procurement is centralised"
		],
		score: 6,
		tags: [
			"care homes",
			"families",
			"communication",
			"consent"
		]
	},
	{
		title: "Fitness Coaching Delivery Platform",
		category: "Healthcare",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Programme delivery, check-ins and payments for independent coaches.",
		problem: "Personal trainers deliver programmes as PDFs and chase payments over WhatsApp, which caps how many clients they can serve.",
		targetUsers: "Personal trainers, strength coaches, nutrition coaches, small gyms.",
		solution: "Build reusable programme templates, deliver them to clients in an app with logging, collect weekly check-ins with photos and metrics, and take recurring payments.",
		key: [
			"Programme template builder with exercise library",
			"Client app with workout logging",
			"Weekly check-in with metrics and photos",
			"Recurring payments and plan management",
			"Coach dashboard of client adherence"
		],
		mvp: [
			"Programme builder",
			"Client logging view",
			"Manual check-ins"
		],
		future: [
			"Nutrition planning",
			"Group programmes and challenges",
			"Wearable integration"
		],
		stack: [
			"Next.js",
			"Capacitor client app",
			"Supabase",
			"Stripe",
			"R2 storage"
		],
		money: ["Per-coach subscription tiered by client count", "Payment processing margin"],
		pricing: "$29/mo up to 20 clients, $79/mo up to 100, $149/mo unlimited.",
		acquisition: "Coach communities, gym partnerships, and free migration of their existing spreadsheet programmes.",
		first10: "Rebuild the current programme library of ten coaches for free, which locks in their switch.",
		steps: [
			"Build the exercise library and programme builder",
			"Build the client logging app",
			"Add check-ins with media",
			"Add payments and plans",
			"Add adherence dashboards",
			"Add tiers and billing"
		],
		risks: [
			"Crowded market with strong incumbents",
			"Client app quality determines coach retention",
			"Health claims must stay out of scope"
		],
		score: 6,
		tags: [
			"fitness",
			"coaching",
			"programmes",
			"payments"
		]
	},
	{
		title: "Mental Health Check-In for Teams",
		category: "Healthcare",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Anonymous team wellbeing signals with real support routes, not vanity dashboards.",
		problem: "Employers run annual engagement surveys that surface burnout months too late and offer nothing actionable.",
		targetUsers: "HR teams, people managers, remote-first companies, agencies.",
		solution: "Short anonymous pulse check-ins with aggregate-only reporting above a minimum group size, trend alerts for managers, and direct links to available support resources.",
		key: [
			"Short pulse check-ins with anonymity guarantees",
			"Aggregate-only reporting with minimum group size",
			"Trend alerts on deterioration",
			"Curated support resource routing",
			"Manager guidance on what to do next"
		],
		mvp: [
			"Weekly pulse via Slack",
			"Aggregate dashboard",
			"Resource links"
		],
		future: [
			"Benchmarking by sector",
			"Integration with EAP providers",
			"Team-level action plans"
		],
		stack: [
			"Next.js",
			"Slack API",
			"Postgres",
			"Stripe"
		],
		money: [
			"Per-employee subscription",
			"Annual contracts",
			"EAP partner referral fees"
		],
		pricing: "$3/employee/mo, minimum $99/mo, annual discount available.",
		acquisition: "HR communities, wellbeing consultants as partners, and content on early burnout signals.",
		first10: "Run a free quarter for five companies, deliver a written insight report at the end, and convert on the follow-up conversation.",
		steps: [
			"Design anonymity guarantees and minimum reporting thresholds",
			"Build check-in delivery and collection",
			"Build aggregate reporting and trends",
			"Add resource routing and manager guidance",
			"Add integrations",
			"Add billing"
		],
		risks: [
			"Any anonymity failure destroys the product",
			"Risk of appearing to monitor rather than support",
			"Duty of care when signals indicate crisis"
		],
		score: 6,
		tags: [
			"wellbeing",
			"hr",
			"pulse surveys",
			"anonymity"
		]
	},
	{
		title: "Dietary Requirement Menu Tool for Venues",
		category: "Healthcare",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Keeps allergen information accurate and instantly filterable for guests.",
		problem: "Venues maintain allergen matrices in spreadsheets that go stale the moment a recipe changes, creating real safety and legal exposure.",
		targetUsers: "Restaurants, caterers, schools, hospitals, event venues.",
		solution: "Manage recipes and ingredients centrally so allergen data flows automatically into a guest-facing filterable menu and printed matrices, with change history.",
		key: [
			"Ingredient and recipe management",
			"Automatic allergen derivation",
			"Guest-facing filterable menu by QR code",
			"Printed matrix generation",
			"Change history for audit"
		],
		mvp: [
			"Recipe entry",
			"Allergen matrix output",
			"QR guest menu"
		],
		future: [
			"Supplier ingredient data import",
			"Multi-venue management",
			"Nutrition calculation"
		],
		stack: [
			"Next.js",
			"Supabase",
			"QR generation",
			"Stripe"
		],
		money: [
			"Per-venue subscription",
			"Group plan",
			"Setup service"
		],
		pricing: "$29/mo per venue, $99/mo for up to 6 venues, $250 setup with recipe entry.",
		acquisition: "Hospitality associations, environmental health officer relationships, and free allergen matrix templates.",
		first10: "Digitise the allergen matrices of ten local venues free and let their environmental health inspections do the selling.",
		steps: [
			"Model ingredients, recipes and allergens",
			"Build derivation and conflict warnings",
			"Build the guest menu and QR flow",
			"Add printed matrix output",
			"Add change history and audit",
			"Add multi-venue billing"
		],
		risks: [
			"Incorrect allergen data can cause serious harm",
			"Regulatory requirements differ by country",
			"Kitchen staff must keep data current"
		],
		score: 7,
		tags: [
			"allergens",
			"hospitality",
			"compliance",
			"menus"
		]
	},
	{
		title: "Structured Interview Scorecard Platform",
		category: "HR",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Consistent interview questions and scoring so hiring decisions are comparable.",
		problem: "Small companies interview by intuition, so candidates get different questions and decisions come down to who the interviewer liked.",
		targetUsers: "Startup hiring managers, small HR teams, recruitment agencies.",
		solution: "Role-based question sets mapped to competencies, interviewer scorecards completed during the interview, and a comparison view across candidates.",
		key: [
			"Competency-mapped question libraries",
			"Interviewer scorecards with anchored ratings",
			"Candidate comparison view",
			"Interviewer calibration reporting",
			"Structured feedback export for candidates"
		],
		mvp: [
			"Question sets",
			"Scorecards",
			"Comparison table"
		],
		future: [
			"ATS integrations",
			"Bias flagging in written feedback",
			"Interview training modules"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Resend"
		],
		money: [
			"Per-seat subscription",
			"Per-role pricing",
			"Agency plan"
		],
		pricing: "$12/user/mo, or $99/mo per company for unlimited users.",
		acquisition: "HR communities, hiring-manager content on structured interviewing, and free question libraries.",
		first10: "Publish excellent free competency question libraries for five common roles and convert downloaders to the scoring tool.",
		steps: [
			"Build competency and question libraries",
			"Build scorecards with anchored scales",
			"Build the comparison view",
			"Add calibration reporting",
			"Add candidate feedback export",
			"Add billing"
		],
		risks: [
			"ATS platforms include scorecards already",
			"Hiring volume at small companies is sporadic",
			"Fairness claims need care"
		],
		score: 6,
		tags: [
			"hiring",
			"interviews",
			"scorecards",
			"structured"
		]
	},
	{
		title: "Reference and Background Check Coordinator",
		category: "HR",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Chases referees automatically and stores the responses with consent evidence.",
		problem: "Reference chasing is manual email tennis that delays start dates, and consent evidence is scattered across inboxes.",
		targetUsers: "Recruitment agencies, HR teams, care and education employers with statutory checks.",
		solution: "Candidate submits referee details with recorded consent, the system sends structured reference requests with automated chasing, and results are stored in a compliant file.",
		key: [
			"Candidate consent capture with audit trail",
			"Structured reference questionnaires",
			"Automated chasing sequences",
			"Compliance checklist per role type",
			"Exportable candidate file"
		],
		mvp: [
			"Reference request sending",
			"Automated chasing",
			"Stored responses"
		],
		future: [
			"Identity and right-to-work verification partners",
			"ATS integrations",
			"Sector-specific statutory packs"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: [
			"Per-check pricing",
			"Agency subscription",
			"Enterprise contracts"
		],
		pricing: "$8 per completed reference, agency plan $199/mo for 50 checks.",
		acquisition: "Recruitment agency outreach, sector compliance content, and partnerships with background check providers.",
		first10: "Run the reference process free for three recruitment agencies for a month and measure days saved per placement.",
		steps: [
			"Design consent and data retention model",
			"Build request and chasing engine",
			"Build structured questionnaires",
			"Add compliance checklists",
			"Add exports and audit",
			"Add per-check billing"
		],
		risks: [
			"Employment screening regulation varies by country",
			"Referee response rates are outside your control",
			"Established screening vendors bundle this"
		],
		score: 6,
		tags: [
			"recruitment",
			"references",
			"compliance",
			"screening"
		]
	},
	{
		title: "Employee Handbook and Policy Manager",
		category: "HR",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Versioned policies with acknowledgement tracking, not a PDF nobody opened.",
		problem: "Companies email a handbook PDF once, cannot prove who read it, and never update it when law or practice changes.",
		targetUsers: "HR managers, operations leads at 20–300 person companies, HR consultants.",
		solution: "A living handbook with version history, targeted policy assignment by role, acknowledgement tracking and reminders, plus a template library kept current.",
		key: [
			"Version-controlled policy library",
			"Role-based policy assignment",
			"Acknowledgement tracking with reminders",
			"Template library with update notifications",
			"Audit export of who acknowledged what and when"
		],
		mvp: [
			"Policy pages",
			"Assignment and acknowledgement",
			"Basic reporting"
		],
		future: [
			"Multi-jurisdiction variants",
			"HRIS sync",
			"Consultant white-label"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: [
			"Per-employee subscription",
			"HR consultant white-label",
			"Template pack sales"
		],
		pricing: "$2/employee/mo with $49/mo minimum; consultant white-label $199/mo.",
		acquisition: "HR consultant partnerships, free policy templates that rank in search, and HR community content.",
		first10: "Give HR consultants a free white-label account so they roll their own client base onto it.",
		steps: [
			"Build policy authoring with versioning",
			"Build assignment and acknowledgement",
			"Add reminders and reporting",
			"Add the template library",
			"Add white-label",
			"Add billing"
		],
		risks: [
			"Template legal accuracy across jurisdictions",
			"HR suites include handbooks",
			"Low engagement once policies are signed"
		],
		score: 6,
		tags: [
			"hr",
			"policies",
			"handbook",
			"compliance"
		]
	},
	{
		title: "Internal Job and Gig Board",
		category: "HR",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Surfaces internal projects and roles so staff move sideways instead of leaving.",
		problem: "Employees leave for opportunities their own company already has, because internal openings are invisible outside the team that posted them.",
		targetUsers: "HR and talent teams at 100–2,000 person companies, internal mobility leads.",
		solution: "An internal marketplace of roles, short-term projects and mentoring opportunities matched to employee skills and stated interests, with manager approval flows.",
		key: [
			"Internal role and project listings",
			"Skill and interest matching",
			"Manager approval workflow",
			"Short-term gig participation tracking",
			"Mobility analytics for HR"
		],
		mvp: [
			"Listings and applications",
			"Basic matching",
			"Manager approvals"
		],
		future: [
			"Skills inference from work systems",
			"Mentoring matching",
			"Succession planning views"
		],
		stack: [
			"Next.js",
			"Postgres",
			"SSO integration",
			"Stripe"
		],
		money: ["Per-employee subscription", "Annual enterprise contracts"],
		pricing: "$2/employee/mo with annual contracts, minimum $2,000/year.",
		acquisition: "HR conferences, talent-mobility content, and pilots with one business unit inside larger firms.",
		first10: "Run a single-department pilot in three companies free for six months and report retention and fill-rate outcomes.",
		steps: [
			"Build listings and applications",
			"Build skill profiles and matching",
			"Add approval workflows",
			"Add gig tracking",
			"Add analytics",
			"Add SSO and enterprise billing"
		],
		risks: [
			"Managers block internal moves, killing trust in the board",
			"Needs company size to have enough listings",
			"Enterprise sales cycle"
		],
		score: 6,
		tags: [
			"internal mobility",
			"talent",
			"matching",
			"retention"
		]
	},
	{
		title: "Offboarding and Access Revocation Checklist",
		category: "HR",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Internal Tool",
		suitableFor: "Business",
		short: "Makes sure every account, device and key is actually recovered when someone leaves.",
		problem: "Leavers keep access to systems for months because offboarding is an informal checklist held by one person.",
		targetUsers: "Operations and IT managers, HR teams, security-conscious small companies.",
		solution: "A leaver workflow that generates tasks per system and asset owner, tracks completion with evidence, and produces an audit record for security reviews.",
		key: [
			"System and asset registry per role",
			"Automatic task generation on leaver creation",
			"Owner assignment with escalation",
			"Evidence capture per revocation",
			"Audit report for security reviews"
		],
		mvp: [
			"Registry and checklist templates",
			"Task assignment",
			"Completion tracking"
		],
		future: [
			"Identity provider integration for automatic revocation",
			"Asset return tracking with shipping labels",
			"Onboarding mirror flow"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Stripe"
		],
		money: [
			"Per-company subscription",
			"Per-leaver pricing",
			"Security compliance bundle"
		],
		pricing: "$49/mo per company, or $15 per leaver for occasional use.",
		acquisition: "IT and security communities, compliance-driven demand, and content on access risk from leavers.",
		first10: "Run a free access audit for ten companies showing how many ex-staff still have accounts.",
		steps: [
			"Build the system and asset registry",
			"Build leaver workflow and task generation",
			"Add escalation and evidence",
			"Add audit reporting",
			"Add identity provider integration",
			"Add billing"
		],
		risks: [
			"Value is invisible until an incident happens",
			"Identity platforms automate much of this",
			"Registry upkeep is manual"
		],
		score: 6,
		tags: [
			"offboarding",
			"security",
			"it",
			"checklists"
		]
	},
	{
		title: "Shift Worker Feedback and Recognition App",
		category: "HR",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Gives deskless staff a voice and managers a way to recognise good work quickly.",
		problem: "Deskless workers never see intranet surveys or recognition schemes, so turnover stays high and problems go unreported.",
		targetUsers: "Retail, hospitality, logistics, care and manufacturing employers.",
		solution: "A phone-first app with quick pulse questions, anonymous issue reporting, peer recognition and shift-level manager alerts.",
		key: [
			"Phone-first access without a company email",
			"Quick pulse questions per shift",
			"Anonymous issue reporting with routing",
			"Peer recognition with light rewards",
			"Site-level manager dashboards"
		],
		mvp: [
			"Pulse questions",
			"Anonymous reporting",
			"Manager view"
		],
		future: [
			"Reward catalogue",
			"Multilingual support",
			"Integration with scheduling tools"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"Push notifications",
			"Stripe"
		],
		money: [
			"Per-employee subscription",
			"Site licence",
			"Rewards margin"
		],
		pricing: "$1.50/employee/mo, minimum $99/mo per site.",
		acquisition: "Operations director outreach in high-turnover sectors, and pilot-driven case studies on turnover cost.",
		first10: "Pilot in three sites of one employer, measure turnover against comparable sites, and expand internally.",
		steps: [
			"Build phone-number based access without corporate email",
			"Build pulse questions and reporting",
			"Add anonymous routing and manager alerts",
			"Add recognition",
			"Add multilingual support",
			"Add billing per site"
		],
		risks: [
			"Anonymity expectations must be met precisely",
			"Adoption depends on site managers championing it",
			"Low per-employee pricing needs scale"
		],
		score: 6,
		tags: [
			"deskless",
			"engagement",
			"recognition",
			"retention"
		]
	},
	{
		title: "Contractor Compliance and Document Vault",
		category: "HR",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Keeps insurance, certifications and right-to-work documents current for every contractor.",
		problem: "Companies using many contractors let insurance and certification expire unnoticed, which invalidates cover and fails audits.",
		targetUsers: "Construction firms, facilities managers, agencies using freelancers, event companies.",
		solution: "Each contractor uploads required documents to their own profile, expiry dates are tracked, and work assignment is blocked when a document lapses.",
		key: [
			"Per-contractor document requirements by role",
			"Expiry tracking with escalating reminders",
			"Blocked assignment when non-compliant",
			"Verification workflow for admins",
			"Audit-ready compliance report"
		],
		mvp: [
			"Document upload with expiry",
			"Reminders",
			"Compliance status list"
		],
		future: [
			"Insurance provider verification",
			"Site check-in enforcement",
			"Client-facing compliance sharing"
		],
		stack: [
			"Next.js",
			"Supabase",
			"R2 storage",
			"Resend",
			"Stripe"
		],
		money: [
			"Per-contractor subscription",
			"Company platform fee",
			"Verification service"
		],
		pricing: "$2 per active contractor per month, $99/mo platform minimum.",
		acquisition: "Construction and facilities sector outreach, insurer partnerships, and compliance-audit content.",
		first10: "Audit the contractor documents of five companies free and show them how many were already expired.",
		steps: [
			"Model roles and required document types",
			"Build contractor self-service upload",
			"Build expiry tracking and reminders",
			"Add verification and blocking rules",
			"Add reporting",
			"Add billing"
		],
		risks: [
			"Contractors resist yet another portal",
			"Document verification is only as good as the reviewer",
			"Sector-specific requirements vary widely"
		],
		score: 7,
		tags: [
			"contractors",
			"compliance",
			"documents",
			"construction"
		]
	},
	{
		title: "Salary Benchmarking for Small Companies",
		category: "HR",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Contribute anonymised pay data, get honest benchmarks for your size and region.",
		problem: "Small companies set pay from guesswork or expensive enterprise survey data that does not reflect their size or market.",
		targetUsers: "Startup founders, HR leads at small companies, compensation consultants.",
		solution: "A data cooperative: companies contribute anonymised role and pay data and receive benchmark ranges filtered by size, sector and region, with aggregation thresholds protecting privacy.",
		key: [
			"Anonymised contribution with strict aggregation thresholds",
			"Benchmarks by role, size, sector and region",
			"Pay band builder from benchmarks",
			"Equity and benefits comparison",
			"Refresh cadence with data recency indicators"
		],
		mvp: [
			"Contribution form",
			"Benchmarks for 20 common roles",
			"Simple band builder"
		],
		future: [
			"Payroll integrations for automatic contribution",
			"Pay equity analysis",
			"Regional expansion"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Privacy-preserving aggregation",
			"Stripe"
		],
		money: [
			"Subscription with contribution discount",
			"Consultant plan",
			"Report sales"
		],
		pricing: "$99/mo, or $39/mo for companies contributing current data.",
		acquisition: "Founder and HR communities, publishing free aggregate reports, and consultant partnerships.",
		first10: "Recruit 40 companies to contribute in exchange for permanent free access, then publish the first sector report.",
		steps: [
			"Design the contribution schema and anonymity thresholds",
			"Recruit an initial data set large enough to be useful",
			"Build benchmark queries with suppression rules",
			"Add the band builder",
			"Add recency and confidence indicators",
			"Add billing with contributor discounts"
		],
		risks: [
			"Cold-start problem: no data means no product",
			"Pay data is extremely sensitive",
			"Self-reported data quality is variable"
		],
		score: 6,
		tags: [
			"compensation",
			"benchmarking",
			"data",
			"hr"
		]
	},
	{
		title: "Landing Page A/B Testing for Small Sites",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Statistically honest split tests that work on low-traffic sites.",
		problem: "Testing tools are built for high traffic and give small sites confident-looking results from far too little data.",
		targetUsers: "Freelance marketers, small SaaS teams, agencies, small e-commerce brands.",
		solution: "Lightweight split testing with Bayesian reporting that states plainly how long a test needs to run and refuses to declare false winners.",
		key: [
			"Lightweight script with no layout flicker",
			"Bayesian result reporting with honest uncertainty",
			"Required sample size guidance up front",
			"Goal tracking including revenue",
			"Test archive with learnings"
		],
		mvp: [
			"Two-variant testing",
			"Conversion goal tracking",
			"Results with uncertainty"
		],
		future: [
			"Server-side testing",
			"Personalisation rules",
			"Agency multi-client accounts"
		],
		stack: [
			"Cloudflare Workers",
			"Next.js dashboard",
			"ClickHouse or Postgres",
			"Stripe"
		],
		money: ["Subscription by traffic", "Agency plan"],
		pricing: "$29/mo up to 50k visitors, $99/mo up to 500k, agency $199/mo.",
		acquisition: "Content on why small sites misread test results, marketing communities, and a free sample size calculator.",
		first10: "Publish a free calculator and honest teardown posts of badly run public tests, then offer the tool to readers.",
		steps: [
			"Build the flicker-free client script",
			"Build assignment and event collection",
			"Build Bayesian analysis and reporting",
			"Add goals including revenue",
			"Add archives and learnings",
			"Add billing by traffic"
		],
		risks: [
			"Performance impact on client sites is unacceptable",
			"Statistical honesty makes the product feel slower than competitors",
			"Analytics platforms include testing"
		],
		score: 6,
		tags: [
			"ab testing",
			"conversion",
			"analytics",
			"web"
		]
	},
	{
		title: "SEO Content Brief Generator",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Turns a keyword into a brief a writer can follow without more research.",
		problem: "Content managers spend hours analysing search results to brief writers, and briefs still arrive vague enough to produce weak articles.",
		targetUsers: "Content marketers, SEO agencies, freelance writers, in-house content teams.",
		solution: "Enter a keyword and get a brief with the questions to answer, the subtopics competitors cover, suggested structure, internal link targets and a factual accuracy checklist.",
		key: [
			"Search result and question analysis",
			"Subtopic coverage gaps versus competitors",
			"Suggested structure with word count guidance",
			"Internal linking suggestions from your own site",
			"Writer-ready export"
		],
		mvp: [
			"Keyword input",
			"Brief with structure and questions",
			"Export to doc"
		],
		future: [
			"Content scoring after publication",
			"Team workflow and assignments",
			"Multi-language briefs"
		],
		stack: [
			"Next.js",
			"Search data API",
			"Claude",
			"Postgres",
			"Stripe"
		],
		money: [
			"Subscription by briefs per month",
			"Agency plan",
			"Per-brief credits"
		],
		pricing: "$29/mo for 20 briefs, $99/mo for 100, agency $249/mo.",
		acquisition: "SEO communities, free brief samples for popular keywords, and agency partnerships.",
		first10: "Produce free briefs for 30 content marketers' next articles and ask for feedback on what was missing.",
		steps: [
			"Integrate a search data source",
			"Build competitor coverage analysis",
			"Build brief generation and structure",
			"Add internal link suggestions from a site crawl",
			"Add exports and team features",
			"Add billing"
		],
		risks: [
			"Search data API costs are significant",
			"SEO tool incumbents add briefs cheaply",
			"Search ranking factors shift constantly"
		],
		score: 7,
		tags: [
			"seo",
			"content",
			"briefs",
			"agencies"
		]
	},
	{
		title: "UGC and Testimonial Collection Tool",
		category: "Marketing",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Collects video and written testimonials with a link, then embeds them anywhere.",
		problem: "Brands know testimonials convert but asking for them is awkward and customers never get around to recording one.",
		targetUsers: "Small SaaS teams, coaches, agencies, e-commerce brands.",
		solution: "Send a branded collection link with guided prompts, record video in the browser with no signup, then embed a styled wall of testimonials on any site.",
		key: [
			"Guided prompts for video and text",
			"No-signup browser recording",
			"Consent and usage rights capture",
			"Embeddable walls and single-quote widgets",
			"Automatic captions on video testimonials"
		],
		mvp: [
			"Collection link",
			"Video and text capture",
			"Embeddable wall"
		],
		future: [
			"Import from review platforms",
			"Case study generation",
			"Incentive management"
		],
		stack: [
			"Next.js",
			"Browser media recording",
			"R2 or Mux",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium",
			"Subscription by testimonial count",
			"Agency plan"
		],
		pricing: "Free 5 testimonials, Pro $19/mo unlimited, Agency $79/mo multi-brand.",
		acquisition: "Founder and agency communities, the embed as a growth loop with a subtle attribution link, and SEO on testimonial pages.",
		first10: "Set up collection campaigns free for 20 small brands and personally chase their first five customers for them.",
		steps: [
			"Build the collection link and recording flow",
			"Add consent capture",
			"Build storage and transcoding",
			"Build embeddable widgets",
			"Add captions and moderation",
			"Add billing"
		],
		risks: [
			"Video storage and transcoding cost",
			"Well-funded direct competitors",
			"Consent and usage rights vary by region"
		],
		score: 6,
		tags: [
			"testimonials",
			"social proof",
			"video",
			"conversion"
		]
	},
	{
		title: "Local SEO Rank Tracker by Map Grid",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Shows where a business ranks street by street, not as a single national number.",
		problem: "Local businesses rank well outside their own door and badly two streets away, but standard rank trackers report one meaningless average.",
		targetUsers: "Local SEO consultants, marketing agencies, multi-location businesses.",
		solution: "Sample rankings across a geographic grid around the business, visualise them as a heat map, and track movement over time per keyword.",
		key: [
			"Geographic grid rank sampling",
			"Heat map visualisation per keyword",
			"Competitor comparison by area",
			"Scheduled tracking with change alerts",
			"White-label client reports"
		],
		mvp: [
			"Single grid scan for one keyword",
			"Heat map",
			"PDF report"
		],
		future: [
			"Automated weekly scans",
			"Review and citation monitoring",
			"Agency multi-client dashboards"
		],
		stack: [
			"Node.js workers",
			"Search data API",
			"Next.js",
			"Mapbox",
			"Stripe"
		],
		money: [
			"Subscription by scan volume",
			"Agency white-label plan",
			"Pay-per-scan credits"
		],
		pricing: "$49/mo for 100 scans, agency $199/mo for 1,000 scans and white-label.",
		acquisition: "Local SEO communities, free single scans that produce shareable heat maps, and agency partnerships.",
		first10: "Run free grid scans for 30 local businesses and send each the heat map showing where they are invisible.",
		steps: [
			"Build grid generation and scan scheduling",
			"Integrate a compliant search data source",
			"Build heat map visualisation",
			"Add competitor comparison",
			"Add white-label reporting",
			"Add billing by scan volume"
		],
		risks: [
			"Search data acquisition cost and terms",
			"Established local SEO tools",
			"Scan accuracy varies with data source quality"
		],
		score: 6,
		tags: [
			"local seo",
			"rank tracking",
			"maps",
			"agencies"
		]
	},
	{
		title: "Influencer Campaign Tracker for Small Brands",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Tracks which creators actually drove sales, not just impressions.",
		problem: "Small brands pay creators and cannot tell which ones produced revenue, so budget keeps going to whoever posts most.",
		targetUsers: "Small D2C brands, marketing managers, influencer agencies.",
		solution: "Unique links and codes per creator, automatic post detection, and revenue attribution with a simple cost-per-acquisition ranking across creators.",
		key: [
			"Per-creator links and discount codes",
			"Automatic post capture and archiving",
			"Revenue attribution and CPA ranking",
			"Payment and deliverable tracking",
			"Campaign reporting for stakeholders"
		],
		mvp: [
			"Link and code generation",
			"Sales attribution",
			"Creator ranking"
		],
		future: [
			"Creator discovery",
			"Contract and brief templates",
			"Automated payouts"
		],
		stack: [
			"Next.js",
			"Shopify API",
			"Postgres",
			"Stripe",
			"Platform APIs"
		],
		money: ["Subscription by tracked creators", "Percentage of managed spend for agencies"],
		pricing: "$49/mo up to 25 creators, $149/mo up to 150, agency plans custom.",
		acquisition: "D2C brand communities, Shopify app store, and content on influencer ROI measurement.",
		first10: "Analyse the last campaign of 15 brands manually and show them which creators actually paid back.",
		steps: [
			"Build creator, link and code management",
			"Integrate commerce platform for sales data",
			"Build attribution and CPA reporting",
			"Add post capture and archiving",
			"Add deliverable and payment tracking",
			"Add billing"
		],
		risks: [
			"Attribution is imperfect and can be disputed",
			"Platform API access for post capture is restricted",
			"Agencies build this internally"
		],
		score: 6,
		tags: [
			"influencer",
			"attribution",
			"d2c",
			"campaigns"
		]
	},
	{
		title: "Cold Email Deliverability Guardian",
		category: "Marketing",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Watches domain health and stops a campaign before it burns your sending reputation.",
		problem: "Sales teams destroy their main domain's deliverability with careless outbound and only discover it when nobody replies.",
		targetUsers: "B2B sales teams, agencies running outbound, founders doing sales themselves.",
		solution: "Continuous monitoring of authentication records, blacklists, seed-inbox placement and engagement signals, with automatic campaign pausing when health drops.",
		key: [
			"SPF, DKIM and DMARC monitoring",
			"Blacklist and reputation checks",
			"Seed inbox placement testing",
			"Automatic campaign pause rules",
			"Warm-up scheduling guidance"
		],
		mvp: [
			"Domain health checks",
			"Placement test",
			"Alerting"
		],
		future: [
			"Direct integration with sending tools",
			"Mailbox rotation guidance",
			"Agency dashboards"
		],
		stack: [
			"Node.js workers",
			"IMAP seed accounts",
			"Postgres",
			"Next.js",
			"Stripe"
		],
		money: [
			"Subscription by domain",
			"Agency plan",
			"One-off audit"
		],
		pricing: "$29/mo per domain, agency $149/mo for 10 domains, one-off audit $99.",
		acquisition: "Sales and outbound communities, free domain health check, and partnerships with sequencing tools.",
		first10: "Offer free health checks in outbound communities and publish anonymised findings about how many domains are already damaged.",
		steps: [
			"Build DNS and authentication checks",
			"Set up seed inbox infrastructure",
			"Build placement testing and scoring",
			"Add alerting and pause rules",
			"Add integrations with sending tools",
			"Add billing"
		],
		risks: [
			"Seed inbox infrastructure is fiddly and can be blocked",
			"Providers change filtering behaviour constantly",
			"Association with spam practices is a brand risk"
		],
		score: 6,
		tags: [
			"email",
			"deliverability",
			"outbound",
			"monitoring"
		]
	},
	{
		title: "Referral Program Builder for Small Businesses",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Turns happy customers into a measurable referral channel with automated rewards.",
		problem: "Word of mouth is most small businesses' best channel and almost none of them systematise or measure it.",
		targetUsers: "Local services, e-commerce brands, SaaS companies, clinics.",
		solution: "Generate personal referral links per customer, track signups and purchases, and issue rewards automatically with fraud checks.",
		key: [
			"Personal referral links and codes",
			"Reward rules with automatic issuance",
			"Fraud and self-referral detection",
			"Referrer leaderboard and prompts",
			"Channel reporting versus paid spend"
		],
		mvp: [
			"Referral links",
			"Conversion tracking",
			"Manual reward issuance"
		],
		future: [
			"Automated reward payouts",
			"Two-sided incentives",
			"Commerce platform integrations"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Resend"
		],
		money: ["Subscription by tracked referrals", "Percentage of rewarded revenue for larger accounts"],
		pricing: "$39/mo up to 100 referrals, $99/mo up to 500.",
		acquisition: "Small business communities, commerce app stores, and case studies quantifying referral share.",
		first10: "Set up and run the first program manually for ten businesses, including writing the customer emails.",
		steps: [
			"Build referral link and attribution tracking",
			"Build reward rules and issuance",
			"Add fraud detection",
			"Add prompts and leaderboards",
			"Add integrations",
			"Add billing"
		],
		risks: [
			"Reward fraud at scale",
			"Attribution disputes",
			"Programs fail without good customer prompting"
		],
		score: 6,
		tags: [
			"referrals",
			"growth",
			"rewards",
			"attribution"
		]
	},
	{
		title: "Competitor Change Monitoring",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Alerts you when a competitor changes pricing, messaging or launches something.",
		problem: "Teams find out about competitor pricing and positioning changes weeks late, usually from a customer.",
		targetUsers: "Product marketers, founders, sales enablement teams, agencies.",
		solution: "Monitor competitor pricing pages, changelogs, job posts and ad libraries, then send a weekly digest summarising what changed and what it likely means.",
		key: [
			"Page change monitoring with visual diffs",
			"Pricing and packaging change detection",
			"Job posting signals for strategy shifts",
			"Weekly summarised digest",
			"Battlecard updates from detected changes"
		],
		mvp: [
			"Track pages with change alerts",
			"Weekly digest",
			"Visual diffs"
		],
		future: [
			"Ad library monitoring",
			"Review sentiment tracking",
			"Battlecard generation"
		],
		stack: [
			"Node.js crawlers",
			"Postgres",
			"Claude",
			"Next.js",
			"Resend"
		],
		money: [
			"Subscription by tracked competitors",
			"Team plan",
			"Agency plan"
		],
		pricing: "$49/mo for 5 competitors, $149/mo for 20.",
		acquisition: "Product marketing communities, free competitor teardown reports, and content on pricing changes in specific sectors.",
		first10: "Publish free monthly competitive digests for one niche market and let the companies in it subscribe.",
		steps: [
			"Build change monitoring with reliable diffing",
			"Add pricing-specific extraction",
			"Add job posting and other signals",
			"Build the digest with summarisation",
			"Add battlecards",
			"Add billing"
		],
		risks: [
			"Crawling terms of service and blocking",
			"Noise from irrelevant page changes",
			"Existing monitoring tools are cheap"
		],
		score: 6,
		tags: [
			"competitive intelligence",
			"monitoring",
			"pricing",
			"digest"
		]
	},
	{
		title: "Podcast and Newsletter Sponsorship Marketplace",
		category: "Marketing",
		difficulty: "Advanced",
		businessModel: "Marketplace",
		buildType: "Website",
		suitableFor: "Startup",
		short: "Connects niche media owners with advertisers who want their exact audience.",
		problem: "Small newsletters and podcasts have valuable niche audiences but no sales team, and advertisers cannot find them.",
		targetUsers: "Newsletter and podcast owners with 2,000–50,000 audience; B2B and D2C advertisers.",
		solution: "A curated marketplace with verified audience stats, transparent pricing, escrowed payments and standardised performance reporting after each placement.",
		key: [
			"Verified audience statistics",
			"Transparent rate cards and availability calendar",
			"Escrowed payment on delivery",
			"Standard performance reporting",
			"Advertiser discovery by audience attributes"
		],
		mvp: [
			"Media owner listings with verified stats",
			"Booking request flow",
			"Manual payment handling"
		],
		future: [
			"Programmatic booking",
			"Bundles across multiple placements",
			"Creative testing"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Stripe Connect",
			"Analytics verification integrations"
		],
		money: [
			"Commission per placement",
			"Featured listing fees",
			"Advertiser subscription"
		],
		pricing: "10% commission on placements, featured listings $99/mo.",
		acquisition: "Recruit media owners in one niche first, then bring in advertisers who already buy in that niche.",
		first10: "Broker ten placements manually by email, taking no commission on the first five, to prove both sides get value.",
		steps: [
			"Choose one niche and recruit media owners",
			"Build listings with verified stats",
			"Build the booking and escrow flow",
			"Add standardised reporting",
			"Add discovery and filters",
			"Open to a second niche only after liquidity"
		],
		risks: [
			"Marketplace liquidity is hard in advertising",
			"Both sides transact off-platform after first contact",
			"Audience stat verification is difficult"
		],
		score: 6,
		tags: [
			"advertising",
			"marketplace",
			"newsletters",
			"podcasts"
		]
	},
	{
		title: "Event Marketing and Attendance Tool",
		category: "Marketing",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Gets more registrants to actually show up at webinars and local events.",
		problem: "Half of webinar registrants never attend, and organisers have no systematic way to lift show-up rates.",
		targetUsers: "B2B marketers, community organisers, training providers, local event hosts.",
		solution: "Registration pages plus a reminder and pre-engagement sequence proven to lift attendance, with post-event follow-up segmented by attendance behaviour.",
		key: [
			"Registration pages with calendar file delivery",
			"Multi-channel reminder sequences",
			"Pre-event engagement prompts",
			"Attendance capture and segmentation",
			"Post-event follow-up automation"
		],
		mvp: [
			"Registration page",
			"Reminder sequence",
			"Attendance import"
		],
		future: [
			"Direct webinar platform integrations",
			"In-person check-in app",
			"Series and community features"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Resend",
			"Twilio",
			"Stripe"
		],
		money: ["Subscription by events or registrants", "Ticketing fee option"],
		pricing: "$39/mo up to 500 registrants monthly, $99/mo up to 2,500.",
		acquisition: "B2B marketing communities, content on webinar show-up rates, and partnerships with webinar platforms.",
		first10: "Run the reminder sequence manually for ten organisers' next events and report the show-up rate change.",
		steps: [
			"Build registration and calendar delivery",
			"Build reminder sequences across channels",
			"Add pre-event engagement",
			"Add attendance capture and segmentation",
			"Add follow-up automation",
			"Add billing"
		],
		risks: [
			"Webinar platforms include reminders",
			"Message costs on SMS reminders",
			"Attendance lift is hard to attribute cleanly"
		],
		score: 6,
		tags: [
			"events",
			"webinars",
			"reminders",
			"b2b"
		]
	},
	{
		title: "Returns Reduction Analyser for Apparel",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Finds the products and sizes driving returns and fixes the listing before more ship.",
		problem: "Apparel returns destroy margin, and brands see a single returns percentage without knowing which product, size or description caused it.",
		targetUsers: "Apparel and footwear brands, marketplace sellers, e-commerce operations managers.",
		solution: "Analyse returns data by product, size and reason, correlate with listing content and reviews, and recommend specific fixes such as size guide corrections or photo changes.",
		key: [
			"Return reason analysis by product and size",
			"Size curve deviation detection",
			"Listing content correlation",
			"Recommended fixes with expected impact",
			"Post-change tracking to prove the fix"
		],
		mvp: [
			"Returns data import",
			"Product and size breakdown",
			"Top-issue report"
		],
		future: [
			"Automated size guide generation",
			"Fit prediction for shoppers",
			"Supplier quality reporting"
		],
		stack: [
			"Next.js",
			"Shopify API",
			"Postgres",
			"Claude",
			"Stripe"
		],
		money: ["Subscription by order volume", "Percentage-of-savings pilot pricing"],
		pricing: "$99/mo up to 2,000 orders monthly, $299/mo up to 20,000.",
		acquisition: "E-commerce operations communities, Shopify app store, and a free returns teardown.",
		first10: "Analyse the last 12 months of returns for ten brands free and show the single product costing them most.",
		steps: [
			"Build returns and order data import",
			"Build analysis by product, size and reason",
			"Add listing correlation",
			"Add recommendations",
			"Add change tracking",
			"Add billing by volume"
		],
		risks: [
			"Data quality of return reasons is often poor",
			"Recommendations must be specific to be valued",
			"Returns platforms add analytics"
		],
		score: 7,
		tags: [
			"returns",
			"apparel",
			"analytics",
			"margin"
		]
	},
	{
		title: "Bundle and Upsell Builder",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Suggests bundles from real basket data and prices them to protect margin.",
		problem: "Stores guess at bundles, discount too heavily, and end up cannibalising full-price sales.",
		targetUsers: "Shopify and WooCommerce merchants, e-commerce managers, D2C brands.",
		solution: "Analyse historical baskets to find genuine affinities, propose bundles with margin-aware pricing, and deploy them as product page and cart offers with performance tracking.",
		key: [
			"Basket affinity analysis",
			"Margin-aware bundle pricing",
			"Product page and cart offer placement",
			"Performance tracking versus baseline",
			"Automatic pausing of underperforming bundles"
		],
		mvp: [
			"Affinity report",
			"Manual bundle creation",
			"Basic performance tracking"
		],
		future: [
			"Automatic bundle rotation",
			"Personalised offers",
			"Subscription bundle support"
		],
		stack: [
			"Next.js",
			"Shopify API",
			"Postgres",
			"Stripe"
		],
		money: ["Subscription by revenue tier", "Percentage of incremental bundle revenue"],
		pricing: "$49/mo under $50k monthly revenue, $149/mo above, or 2% of bundle revenue.",
		acquisition: "App store listings, e-commerce communities, and free basket affinity reports.",
		first10: "Run the free affinity analysis for 25 stores and show each the bundle they are missing.",
		steps: [
			"Build order history import",
			"Build affinity analysis",
			"Build margin-aware pricing suggestions",
			"Build storefront offer placement",
			"Add performance tracking and auto-pause",
			"Add billing"
		],
		risks: [
			"Storefront integration must not slow the site",
			"Many competing upsell apps",
			"Margin data is often missing from platform exports"
		],
		score: 6,
		tags: [
			"upsell",
			"bundles",
			"shopify",
			"merchandising"
		]
	},
	{
		title: "Multi-Marketplace Listing Sync",
		category: "E-commerce",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "One product catalogue, correctly formatted for every marketplace, stock in sync.",
		problem: "Sellers listing on several marketplaces maintain each one by hand and oversell when stock is not synchronised.",
		targetUsers: "Multi-channel sellers, small brands, resellers, distributors.",
		solution: "A central catalogue that maps to each marketplace's category and attribute requirements, pushes listings, and synchronises stock and price in near real time.",
		key: [
			"Central catalogue with per-marketplace mapping",
			"Category and attribute compliance checking",
			"Near real-time stock synchronisation",
			"Price rules per channel",
			"Error dashboard for rejected listings"
		],
		mvp: [
			"Two marketplaces",
			"Listing push",
			"Stock sync"
		],
		future: [
			"Order consolidation",
			"Repricing engine",
			"Warehouse integration"
		],
		stack: [
			"Node.js workers",
			"Postgres",
			"Marketplace APIs",
			"Next.js",
			"Stripe"
		],
		money: ["Subscription by SKUs and channels", "Order volume tiers"],
		pricing: "$79/mo for 2 channels and 1,000 SKUs, $249/mo for 5 channels and 10,000 SKUs.",
		acquisition: "Seller communities per marketplace, and free listing-error audits.",
		first10: "Migrate ten sellers' catalogues personally, absorbing the mapping work that usually blocks adoption.",
		steps: [
			"Build the central catalogue model",
			"Build the first two marketplace adapters",
			"Build attribute mapping and validation",
			"Build stock and price synchronisation",
			"Add the error dashboard",
			"Add billing by SKU and channel"
		],
		risks: [
			"Marketplace API complexity and rate limits",
			"Overselling incidents damage seller accounts",
			"Mature competitors with many channels"
		],
		score: 6,
		tags: [
			"marketplaces",
			"listings",
			"inventory",
			"sync"
		]
	},
	{
		title: "Post-Purchase Tracking Page",
		category: "E-commerce",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Branded delivery tracking that cuts 'where is my order' tickets and sells more.",
		problem: "Customers chase orders through support because carrier tracking pages are ugly, confusing and unbranded.",
		targetUsers: "E-commerce brands, subscription boxes, small retailers shipping daily.",
		solution: "A branded tracking page and proactive delivery notifications across carriers, with product recommendations and review requests placed at the right moment.",
		key: [
			"Multi-carrier tracking aggregation",
			"Branded tracking page with recommendations",
			"Proactive delay notifications",
			"Review request timing after delivery",
			"Support ticket deflection reporting"
		],
		mvp: [
			"Three carriers",
			"Branded tracking page",
			"Delivery notifications"
		],
		future: [
			"Returns portal",
			"Delivery estimate accuracy analytics",
			"Localised pages"
		],
		stack: [
			"Next.js",
			"Carrier APIs or aggregator",
			"Postgres",
			"Resend",
			"Stripe"
		],
		money: ["Subscription by shipment volume", "Revenue share on recommendation sales"],
		pricing: "$29/mo up to 1,000 shipments, $99/mo up to 10,000.",
		acquisition: "Commerce app stores, support-cost content, and free ticket deflection estimates.",
		first10: "Count 'where is my order' tickets for ten brands over a fortnight and offer a trial priced against that cost.",
		steps: [
			"Integrate a carrier data source",
			"Build the branded tracking page",
			"Add notifications and delay detection",
			"Add recommendations and review timing",
			"Add deflection reporting",
			"Add billing"
		],
		risks: [
			"Carrier data quality and coverage varies",
			"Established competitors in the post-purchase space",
			"Notification costs at volume"
		],
		score: 6,
		tags: [
			"shipping",
			"post-purchase",
			"support",
			"branding"
		]
	},
	{
		title: "Wholesale Ordering Portal for Small Brands",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Stockists order from a proper portal instead of emailing a PDF price list.",
		problem: "Small brands take wholesale orders by email and spreadsheet, which causes pricing errors and slow reordering.",
		targetUsers: "Small food, drink, beauty and homeware brands selling to independent retailers.",
		solution: "A branded wholesale portal with per-stockist pricing, minimum order rules, reorder from history and payment terms handling.",
		key: [
			"Per-stockist pricing tiers",
			"Minimum order and case-pack rules",
			"One-tap reorder from history",
			"Payment terms and deposit handling",
			"Stockist activity reporting"
		],
		mvp: [
			"Stockist accounts with pricing",
			"Order placement",
			"Order export"
		],
		future: [
			"Rep ordering on mobile",
			"Integration with accounting",
			"Stockist discovery marketplace"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Resend"
		],
		money: ["Subscription by stockist count", "Payment processing margin"],
		pricing: "$49/mo up to 25 stockists, $129/mo up to 150.",
		acquisition: "Trade shows, brand founder communities, and direct outreach to brands seen in independent shops.",
		first10: "Onboard ten brands by importing their current price lists and stockist contacts for free.",
		steps: [
			"Build catalogue and stockist pricing",
			"Build ordering with rules",
			"Add reorder and history",
			"Add payment terms",
			"Add reporting",
			"Add billing"
		],
		risks: [
			"Retailers resist portals and prefer email",
			"Commerce platforms have wholesale features",
			"Payment terms handling adds credit risk complexity"
		],
		score: 6,
		tags: [
			"wholesale",
			"b2b commerce",
			"ordering",
			"brands"
		]
	},
	{
		title: "Product Review Insight Miner",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Turns thousands of reviews into the specific product changes worth making.",
		problem: "Brands read a handful of reviews and miss the repeated complaint that is costing them sales across a whole category.",
		targetUsers: "D2C brands, product managers, marketplace sellers, category buyers.",
		solution: "Ingest reviews for your products and competitors, cluster complaints and praise by theme, and rank themes by frequency and revenue impact with quoted examples.",
		key: [
			"Review ingestion across sources",
			"Theme clustering with quoted examples",
			"Competitor comparison by theme",
			"Trend tracking after product changes",
			"Copy suggestions addressing common objections"
		],
		mvp: [
			"Import reviews for your own products",
			"Theme report",
			"Export"
		],
		future: [
			"Automated monitoring and alerts",
			"Category-wide benchmark reports",
			"Roadmap integration"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Claude",
			"Marketplace data sources",
			"Stripe"
		],
		money: ["Subscription by products monitored", "One-off category reports"],
		pricing: "$79/mo for 25 products, $199/mo for 200; category report $499.",
		acquisition: "Free category insight reports published publicly, plus e-commerce and product communities.",
		first10: "Publish three excellent free category teardowns and let the named brands come to you.",
		steps: [
			"Build review ingestion",
			"Build clustering and theme extraction",
			"Build reporting with quotes",
			"Add competitor comparison",
			"Add monitoring and alerts",
			"Add billing"
		],
		risks: [
			"Review data access terms vary by source",
			"Theme quality depends on prompt and clustering care",
			"Marketplaces provide some of this free to sellers"
		],
		score: 7,
		tags: [
			"reviews",
			"insights",
			"product",
			"competitive"
		]
	},
	{
		title: "Shipping Rate Comparison for Small Sellers",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Marketplace",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Compares real rates across carriers and books the cheapest suitable option.",
		problem: "Small sellers overpay for shipping because negotiated rates require volume and comparing services manually is tedious.",
		targetUsers: "Marketplace sellers, small e-commerce brands, makers shipping from home.",
		solution: "Enter parcel details once, compare live rates across carriers including aggregated discounted rates, book and print labels, and track from one place.",
		key: [
			"Live multi-carrier rate comparison",
			"Aggregated discounted rates",
			"Label printing and manifests",
			"Address validation",
			"Cost reporting by channel and product"
		],
		mvp: [
			"Rate comparison for two carriers",
			"Label purchase",
			"Tracking"
		],
		future: [
			"Marketplace order import",
			"Rules-based automatic carrier selection",
			"Insurance and claims handling"
		],
		stack: [
			"Next.js",
			"Carrier and aggregator APIs",
			"Postgres",
			"Stripe"
		],
		money: ["Margin on discounted label rates", "Small subscription for volume tools"],
		pricing: "Free to compare, margin built into label rates; Pro tools $19/mo.",
		acquisition: "Maker and seller communities, marketplace forums, and honest rate comparison content.",
		first10: "Show 30 sellers exactly what they overpaid on their last ten parcels using public rate data.",
		steps: [
			"Integrate carrier or aggregator rate APIs",
			"Build comparison and booking",
			"Add label printing and manifests",
			"Add address validation",
			"Add reporting",
			"Add order import from marketplaces"
		],
		risks: [
			"Carrier contracts and aggregator terms constrain margin",
			"Support burden on lost parcels and claims",
			"Established shipping platforms"
		],
		score: 6,
		tags: [
			"shipping",
			"logistics",
			"rates",
			"labels"
		]
	},
	{
		title: "Made-to-Order Production Tracker",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Keeps custom-order customers informed and the maker's queue realistic.",
		problem: "Makers taking custom orders lose track of the queue, promise unrealistic dates and field constant status messages.",
		targetUsers: "Furniture makers, jewellers, custom apparel, print shops, small manufacturers.",
		solution: "A production queue with per-order stages, realistic lead time calculation from actual throughput, and automatic customer updates at each stage.",
		key: [
			"Production stages per order type",
			"Lead time calculated from real throughput",
			"Automatic customer status updates with photos",
			"Capacity warnings before overcommitting",
			"Deposit and balance payment tracking"
		],
		mvp: [
			"Order queue with stages",
			"Customer update emails",
			"Simple capacity view"
		],
		future: [
			"Materials and supplier ordering",
			"Team assignment",
			"Commerce platform integration"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Resend",
			"R2 storage"
		],
		money: ["Subscription by active orders", "Team seats"],
		pricing: "$19/mo up to 25 active orders, $49/mo unlimited, $9 per extra seat.",
		acquisition: "Maker communities, craft marketplaces, and content on quoting realistic lead times.",
		first10: "Set up the queue for ten makers using their current order backlog and show them their real lead time.",
		steps: [
			"Model orders, stages and throughput",
			"Build the queue and stage transitions",
			"Build customer updates with photos",
			"Add lead time calculation and capacity warnings",
			"Add payments",
			"Add billing"
		],
		risks: [
			"Makers may not update stages consistently",
			"Small budgets in craft businesses",
			"General project tools are free"
		],
		score: 6,
		tags: [
			"makers",
			"production",
			"custom orders",
			"lead time"
		]
	},
	{
		title: "Digital Product Delivery and Licensing",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Secure downloads, licence keys and update delivery for digital goods.",
		problem: "Sellers of templates, plugins and digital assets email files manually and have no way to manage licences or ship updates.",
		targetUsers: "Template and plugin makers, digital artists, font and preset sellers, indie software developers.",
		solution: "Upload the product, sell it with checkout, deliver expiring secure download links, issue and validate licence keys, and notify buyers when an update ships.",
		key: [
			"Expiring secure download links",
			"Licence key issuance and validation API",
			"Update notifications to past buyers",
			"Refund and revocation handling",
			"Sales and licence analytics"
		],
		mvp: [
			"Product upload and checkout",
			"Secure delivery",
			"Licence keys"
		],
		future: [
			"Affiliate program",
			"Bundles and coupons",
			"Marketplace listing"
		],
		stack: [
			"Next.js",
			"R2 storage",
			"Stripe",
			"Supabase",
			"Edge validation API"
		],
		money: [
			"Flat subscription",
			"Small transaction fee",
			"Higher tier for licensing API volume"
		],
		pricing: "$19/mo flat with no revenue share, or 3% per transaction with no monthly fee.",
		acquisition: "Indie maker communities, comparison content against percentage-taking platforms, and developer documentation quality.",
		first10: "Migrate ten creators from percentage platforms by showing their annual fee saving and doing the migration for them.",
		steps: [
			"Build product storage and secure delivery",
			"Build checkout and order handling",
			"Build licence issuance and validation API",
			"Add update notifications",
			"Add refunds and revocation",
			"Add billing options"
		],
		risks: [
			"Piracy limits perceived licensing value",
			"Payment and tax handling across countries",
			"Established platforms bundle audience access"
		],
		score: 6,
		tags: [
			"digital products",
			"licensing",
			"downloads",
			"creators"
		]
	},
	{
		title: "Local Delivery Route Planner for Small Shops",
		category: "E-commerce",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Plans the day's local deliveries and keeps customers informed en route.",
		problem: "Shops doing their own local delivery plan routes by eye, waste fuel and cannot tell customers when to expect them.",
		targetUsers: "Bakeries, florists, farm shops, meal prep businesses, local retailers.",
		solution: "Import the day's orders, generate an optimised route with time windows, and send customers live arrival estimates with proof of delivery capture.",
		key: [
			"Route optimisation with time windows",
			"Driver mobile app with navigation handoff",
			"Live customer arrival notifications",
			"Proof of delivery with photo and signature",
			"Daily delivery cost reporting"
		],
		mvp: [
			"Order import",
			"Optimised route",
			"Driver view with completion"
		],
		future: [
			"Multiple drivers and zones",
			"Customer self-scheduling",
			"Commerce platform integration"
		],
		stack: [
			"Capacitor",
			"Routing API",
			"Supabase",
			"Twilio",
			"Stripe"
		],
		money: ["Per-vehicle subscription", "Notification usage add-on"],
		pricing: "$29/mo per vehicle including 500 notifications.",
		acquisition: "Local business outreach, sector-specific groups, and free route audits showing distance saved.",
		first10: "Plan one week of routes free for ten local shops and report the mileage and time saved.",
		steps: [
			"Build order import and address validation",
			"Integrate routing and optimisation",
			"Build the driver app with offline tolerance",
			"Add customer notifications",
			"Add proof of delivery",
			"Add billing per vehicle"
		],
		risks: [
			"Routing API costs at volume",
			"Driver app must work with poor signal",
			"Delivery platforms offer free tools"
		],
		score: 6,
		tags: [
			"delivery",
			"routing",
			"local",
			"logistics"
		]
	}
];
/** Creator Tools — 10, Developer Tools — 10, Quality & Operations — 8, Personal Tools — 7. */
var PART_5 = [
	{
		title: "Podcast Show Notes and Clip Generator",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Upload an episode, get show notes, chapters and shareable clips.",
		problem: "Independent podcasters spend longer writing notes and cutting clips than recording the episode itself.",
		targetUsers: "Independent podcasters, interview shows, small production studios.",
		solution: "Transcribe the episode, produce chapter markers, show notes with timestamps and guest links, and suggest the strongest clips with captions ready for social platforms.",
		key: [
			"Accurate transcription with speaker labels",
			"Chapters and timestamped show notes",
			"Clip suggestions ranked by hook strength",
			"Vertical clip rendering with captions",
			"Publishing exports for common hosts"
		],
		mvp: [
			"Transcription",
			"Show notes and chapters",
			"Clip timestamp suggestions"
		],
		future: [
			"Automatic clip rendering",
			"Guest one-page promo kits",
			"Multi-language notes"
		],
		stack: [
			"Next.js",
			"Whisper-class transcription",
			"Claude",
			"FFmpeg worker",
			"R2 storage"
		],
		money: [
			"Subscription by audio hours",
			"Pay-as-you-go credits",
			"Studio plan"
		],
		pricing: "$19/mo for 8 hours, $49/mo for 30 hours, studio $149/mo.",
		acquisition: "Podcasting communities, free processing of one episode, and partnerships with hosting platforms.",
		first10: "Process the last episode of 25 small shows for free and send the notes and clips unprompted.",
		steps: [
			"Build upload and transcription pipeline",
			"Build notes and chapter generation",
			"Add clip selection scoring",
			"Add rendering with captions",
			"Add host exports",
			"Add billing by audio hours"
		],
		risks: [
			"Rendering compute cost per hour of audio",
			"Crowded space with well-funded competitors",
			"Clip quality judgement is subjective"
		],
		score: 7,
		tags: [
			"podcast",
			"transcription",
			"clips",
			"content"
		]
	},
	{
		title: "Newsletter Growth and Referral Toolkit",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Referral milestones, landing pages and growth analytics for any newsletter platform.",
		problem: "Referral growth features are locked into specific newsletter platforms, so creators must migrate to get them.",
		targetUsers: "Newsletter writers, media brands, community operators.",
		solution: "A platform-agnostic layer that adds referral tracking, milestone rewards, growth landing pages and source analytics on top of any email provider.",
		key: [
			"Referral links and milestone rewards",
			"Platform-agnostic subscriber sync",
			"Landing pages with conversion tracking",
			"Growth source analytics",
			"Reward fulfilment tracking"
		],
		mvp: [
			"Referral tracking",
			"Milestone emails",
			"Basic analytics"
		],
		future: [
			"Cross-newsletter recommendations",
			"Paid acquisition tracking",
			"Sponsor reporting"
		],
		stack: [
			"Next.js",
			"Email provider APIs",
			"Postgres",
			"Stripe"
		],
		money: [
			"Freemium by subscriber count",
			"Subscription tiers",
			"Sponsor reporting add-on"
		],
		pricing: "Free under 1,000 subscribers, $19/mo to 10,000, $49/mo to 50,000.",
		acquisition: "Newsletter operator communities, teardown content on growth loops, and the referral page as a growth loop.",
		first10: "Set up referral programs by hand for ten mid-size newsletters and report the subscriber lift after a month.",
		steps: [
			"Build subscriber sync with two providers",
			"Build referral tracking and milestones",
			"Build landing pages",
			"Add analytics by source",
			"Add reward fulfilment",
			"Add tiers and billing"
		],
		risks: [
			"Email platforms build this natively",
			"Provider API limits on subscriber sync",
			"Referral fraud with fake signups"
		],
		score: 6,
		tags: [
			"newsletter",
			"referrals",
			"growth",
			"creators"
		]
	},
	{
		title: "Content Repurposing Workspace",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "One long piece becomes a week of posts, in your own voice.",
		problem: "Creators publish one substantial piece and never turn it into the ten smaller posts that would actually reach people.",
		targetUsers: "Solo creators, content marketers, agencies, consultants.",
		solution: "Import an article, video or podcast, learn the creator's voice from past posts, and generate platform-specific drafts they edit and schedule.",
		key: [
			"Voice profile learned from past content",
			"Platform-specific draft generation",
			"Editing workspace with variants",
			"Scheduling and publishing",
			"Performance feedback into future drafts"
		],
		mvp: [
			"Import source content",
			"Generate drafts for two platforms",
			"Copy or export"
		],
		future: [
			"Direct publishing integrations",
			"Team review workflows",
			"Performance-informed generation"
		],
		stack: [
			"Next.js",
			"Claude",
			"Supabase",
			"Platform APIs",
			"Stripe"
		],
		money: ["Subscription by generation volume", "Agency multi-brand plan"],
		pricing: "$29/mo solo, $99/mo agency with 5 brands.",
		acquisition: "Creator communities, public before-and-after examples, and consultant partnerships.",
		first10: "Repurpose a month of content free for 15 creators, then hand them the workspace to continue.",
		steps: [
			"Build content import from several formats",
			"Build voice profiling from past posts",
			"Build platform-specific generation",
			"Add editing and variants",
			"Add scheduling",
			"Add billing"
		],
		risks: [
			"Generic AI output is instantly recognisable",
			"Platform publishing APIs are restrictive",
			"Very crowded category"
		],
		score: 6,
		tags: [
			"repurposing",
			"content",
			"social",
			"voice"
		]
	},
	{
		title: "Creator Sponsorship Media Kit Builder",
		category: "Creator Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "A live media kit with verified stats that updates itself before every pitch.",
		problem: "Creators send stale PDF media kits with screenshots, which looks amateur and slows sponsorship deals.",
		targetUsers: "YouTubers, podcasters, newsletter writers, Instagram and TikTok creators.",
		solution: "Connect platforms once for verified live statistics, present audience demographics and past campaign results on a shareable page, and track who viewed the kit.",
		key: [
			"Verified live platform statistics",
			"Audience demographics presentation",
			"Past campaign case studies",
			"Rate card with availability",
			"View tracking on shared kits"
		],
		mvp: [
			"Manual and connected stats",
			"Shareable page",
			"Rate card"
		],
		future: [
			"Sponsor CRM and pipeline",
			"Contract templates",
			"Invoice generation"
		],
		stack: [
			"Next.js",
			"Platform APIs",
			"Supabase",
			"Stripe"
		],
		money: [
			"Freemium",
			"Pro subscription",
			"Deal management add-on"
		],
		pricing: "Free basic kit, Pro $12/mo for verification, tracking and custom domain.",
		acquisition: "Creator communities, the shared kit itself as a growth loop, and sponsorship agency partnerships.",
		first10: "Build polished kits free for 20 creators who are actively pitching, in exchange for feedback.",
		steps: [
			"Build the kit editor and page",
			"Add platform connections for verified stats",
			"Add case studies and rate cards",
			"Add view tracking",
			"Add custom domains",
			"Add billing"
		],
		risks: [
			"Platform API access for stats is restricted",
			"Low willingness to pay among small creators",
			"Simple enough to replicate"
		],
		score: 6,
		tags: [
			"creators",
			"sponsorship",
			"media kit",
			"stats"
		]
	},
	{
		title: "Community Membership Platform for Small Creators",
		category: "Creator Tools",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Paid community, content and events in one place with a flat fee.",
		problem: "Creators stitch together a chat tool, a payment tool and a course tool, and pay a revenue percentage to each.",
		targetUsers: "Coaches, educators, niche community leaders, professional groups.",
		solution: "One workspace with membership tiers, discussion spaces, gated content, live events and flat-fee billing rather than revenue share.",
		key: [
			"Membership tiers with gated access",
			"Discussion spaces with moderation",
			"Gated content library and courses",
			"Events with reminders and recordings",
			"Flat-fee billing with no revenue share"
		],
		mvp: [
			"Tiers and payments",
			"Discussion spaces",
			"Gated content"
		],
		future: [
			"Mobile app",
			"Cohort courses",
			"Member directory and matching"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Realtime messaging",
			"R2 storage"
		],
		money: ["Flat monthly subscription by member count", "Payment processing margin"],
		pricing: "$49/mo up to 200 members, $149/mo up to 2,000, no revenue share.",
		acquisition: "Direct comparison content against revenue-share platforms, plus migration help as the wedge.",
		first10: "Migrate ten communities personally, including member records and payment continuity.",
		steps: [
			"Build membership tiers and payments",
			"Build discussion spaces and moderation",
			"Build gated content",
			"Add events",
			"Add mobile-friendly experience",
			"Add migration tooling"
		],
		risks: [
			"Large incumbents with strong network effects",
			"Migration friction is severe",
			"Moderation and abuse handling burden"
		],
		score: 6,
		tags: [
			"community",
			"membership",
			"creators",
			"courses"
		]
	},
	{
		title: "Video Thumbnail Testing Tool",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Test thumbnails with a real audience panel before publishing.",
		problem: "Thumbnails decide whether a video is watched, and creators pick them on gut feeling with no feedback until it is too late.",
		targetUsers: "YouTubers, video marketers, agencies producing video content.",
		solution: "Run head-to-head thumbnail and title tests with a paid panel matched to the creator's audience, and report click preference with reasons.",
		key: [
			"Head-to-head thumbnail and title tests",
			"Audience-matched respondent panel",
			"Written reasons alongside click choices",
			"Result confidence indicators",
			"Historical library of what worked"
		],
		mvp: [
			"Two-option test",
			"Panel responses",
			"Results view"
		],
		future: [
			"Post-publish performance correlation",
			"Team collaboration",
			"Agency multi-channel accounts"
		],
		stack: [
			"Next.js",
			"Panel provider API",
			"Postgres",
			"R2 storage",
			"Stripe"
		],
		money: [
			"Credits per test",
			"Subscription for regular testers",
			"Agency plan"
		],
		pricing: "$5 per test with 100 responses, $39/mo for 10 tests.",
		acquisition: "Creator communities, free first tests, and public case studies on click rate lifts.",
		first10: "Run free tests for 25 creators before their next upload and share the results publicly with permission.",
		steps: [
			"Build test creation and image handling",
			"Integrate a respondent panel",
			"Build results with reasons and confidence",
			"Add history and learnings",
			"Add performance correlation",
			"Add credits and billing"
		],
		risks: [
			"Panel cost per response squeezes margin",
			"Panel audience may not match the real one",
			"Platforms add native testing"
		],
		score: 6,
		tags: [
			"video",
			"thumbnails",
			"testing",
			"youtube"
		]
	},
	{
		title: "Digital Course Cohort Manager",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Runs live cohort courses: schedules, assignments, attendance and completion.",
		problem: "Cohort courses run on spreadsheets and chat threads, so learners fall behind unnoticed and completion rates collapse.",
		targetUsers: "Independent educators, bootcamps, corporate trainers, professional bodies.",
		solution: "Structure a cohort with a schedule, sessions, assignments and check-ins, surface at-risk learners early, and issue completion certificates.",
		key: [
			"Cohort schedule and session management",
			"Assignments with feedback",
			"At-risk learner detection",
			"Attendance and completion tracking",
			"Certificates and outcome reporting"
		],
		mvp: [
			"Cohort setup",
			"Assignments",
			"Progress dashboard"
		],
		future: [
			"Peer review workflows",
			"Employer reporting",
			"Alumni community"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Stripe",
			"Resend",
			"Video platform embeds"
		],
		money: ["Subscription by active learners", "Per-cohort pricing"],
		pricing: "$79/mo up to 50 active learners, $199/mo up to 300.",
		acquisition: "Educator communities, content on cohort completion rates, and partnerships with course platforms.",
		first10: "Run one cohort free for ten educators and publish the completion rate improvement.",
		steps: [
			"Build cohort and session structure",
			"Build assignments and feedback",
			"Add progress and risk detection",
			"Add attendance and certificates",
			"Add reporting",
			"Add billing"
		],
		risks: [
			"Course platforms add cohort features",
			"Seasonal usage between cohorts",
			"Educators tolerate spreadsheets"
		],
		score: 6,
		tags: [
			"courses",
			"cohorts",
			"education",
			"creators"
		]
	},
	{
		title: "Stock Asset Licensing Tracker for Creators",
		category: "Creator Tools",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Records which licensed asset went into which project, before a claim arrives.",
		problem: "Creators cannot prove they licensed the music or footage in a three-year-old video when a copyright claim lands.",
		targetUsers: "Video producers, agencies, podcasters, design studios.",
		solution: "A registry linking each licensed asset, its licence terms and receipt to the projects it appears in, with expiry warnings and dispute-ready evidence packs.",
		key: [
			"Asset registry with licence terms and receipts",
			"Project linking of assets used",
			"Licence expiry and scope warnings",
			"Evidence pack export for disputes",
			"Team shared library"
		],
		mvp: [
			"Asset and licence entry",
			"Project linking",
			"Evidence export"
		],
		future: [
			"Email receipt parsing",
			"Marketplace integrations",
			"Client-facing usage reports"
		],
		stack: [
			"Next.js",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: ["Subscription per user", "Studio plan with shared library"],
		pricing: "$9/mo solo, $39/mo studio with 10 seats.",
		acquisition: "Video and agency communities, content about copyright claims, and templates for licence records.",
		first10: "Import the last two years of licence receipts for ten studios by hand as the onboarding offer.",
		steps: [
			"Build asset and licence records",
			"Build project linking",
			"Add expiry and scope warnings",
			"Build evidence pack export",
			"Add shared team libraries",
			"Add billing"
		],
		risks: [
			"Value only felt during a dispute",
			"Manual entry burden without receipt parsing",
			"Spreadsheets are free"
		],
		score: 6,
		tags: [
			"licensing",
			"copyright",
			"assets",
			"video"
		]
	},
	{
		title: "Photography Client Gallery and Sales",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Delivers galleries, collects selections and sells prints without a revenue cut.",
		problem: "Photographers deliver galleries through general file sharing, chase selections over email and never upsell prints.",
		targetUsers: "Wedding, portrait and event photographers, small studios.",
		solution: "Branded client galleries with favouriting and selection limits, download controls, watermarking and an integrated print store on a flat subscription.",
		key: [
			"Branded galleries with download controls",
			"Client favouriting and selection limits",
			"Watermarking and proofing mode",
			"Integrated print and digital sales",
			"Storage and archive management"
		],
		mvp: [
			"Gallery delivery",
			"Client selections",
			"Downloads"
		],
		future: [
			"Print lab integrations",
			"Contracts and invoicing",
			"Booking calendar"
		],
		stack: [
			"Next.js",
			"R2 storage",
			"Image processing worker",
			"Stripe",
			"Supabase"
		],
		money: [
			"Subscription by storage",
			"No revenue share on sales",
			"Print margin optional"
		],
		pricing: "$15/mo for 500GB, $39/mo for 3TB, no commission on sales.",
		acquisition: "Photography communities, cost comparison against commission-taking platforms, and gallery branding as a growth loop.",
		first10: "Migrate ten photographers' active galleries and archives for them free of charge.",
		steps: [
			"Build upload and image processing pipeline",
			"Build galleries with selection features",
			"Add download controls and watermarking",
			"Add the print and digital store",
			"Add archive tiers",
			"Add billing by storage"
		],
		risks: [
			"Storage costs scale badly with high-resolution files",
			"Mature competitors with print lab networks",
			"Seasonal photography income"
		],
		score: 6,
		tags: [
			"photography",
			"galleries",
			"prints",
			"clients"
		]
	},
	{
		title: "Fan Q&A and Voice Message Platform",
		category: "Creator Tools",
		difficulty: "Intermediate",
		businessModel: "Marketplace",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Fans submit paid questions, creators answer in batches by voice or video.",
		problem: "Creators are buried in unanswered questions across platforms and cannot answer at scale or earn from the effort.",
		targetUsers: "Podcasters, coaches, educators, niche experts with engaged audiences.",
		solution: "A paid question queue where fans pay a set amount, creators batch-record answers, and answers are delivered privately or published as content.",
		key: [
			"Paid question submission with pricing control",
			"Batch answering interface",
			"Voice and video answer recording",
			"Optional publishing as public content",
			"Refunds for unanswered questions"
		],
		mvp: [
			"Question queue with payment",
			"Answer recording",
			"Delivery"
		],
		future: [
			"Subscription question passes",
			"Community upvoting",
			"Podcast feed of published answers"
		],
		stack: [
			"Next.js",
			"Stripe Connect",
			"Media recording and storage",
			"Supabase"
		],
		money: ["Commission per answered question", "Creator subscription for lower commission"],
		pricing: "10% commission, or $19/mo for 3% commission.",
		acquisition: "Recruit creators with engaged audiences first; their audiences bring demand automatically.",
		first10: "Run it manually for ten creators using a form and a payment link before building the queue.",
		steps: [
			"Build question submission and payment holding",
			"Build the creator answering interface",
			"Add media recording and delivery",
			"Add refunds for unanswered questions",
			"Add publishing options",
			"Add commission tiers"
		],
		risks: [
			"Creators abandon the queue and refunds pile up",
			"Payment holding and payouts add complexity",
			"Audience willingness to pay is unproven per niche"
		],
		score: 6,
		tags: [
			"creators",
			"qa",
			"audio",
			"monetisation"
		]
	},
	{
		title: "Pull Request Review Assistant",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Catches the boring review issues so humans review the design.",
		problem: "Code review time is eaten by naming, missing tests and obvious edge cases, so real design feedback never happens.",
		targetUsers: "Engineering teams of 5–100, agencies, open-source maintainers.",
		solution: "An automated reviewer that comments on mechanical issues, missing test coverage and risky changes with repository-specific conventions learned from history.",
		key: [
			"Repository convention learning from merged history",
			"Inline comments on mechanical issues",
			"Test coverage gap detection on changed lines",
			"Risk scoring for large or sensitive diffs",
			"Noise controls and per-repo tuning"
		],
		mvp: [
			"GitHub app with inline comments",
			"Convention rules",
			"Coverage gaps"
		],
		future: [
			"Architecture drift detection",
			"Security-focused review mode",
			"Self-hosted option"
		],
		stack: [
			"Node.js GitHub app",
			"Claude",
			"Postgres",
			"Queue workers",
			"Stripe"
		],
		money: [
			"Per-developer subscription",
			"Self-hosted enterprise licence",
			"Free for open source"
		],
		pricing: "$15/developer/mo, free for public repositories.",
		acquisition: "Free tier on open-source repositories for visibility, plus developer community content.",
		first10: "Install free on twenty active open-source repositories and let maintainers' praise attract company teams.",
		steps: [
			"Build the GitHub app and diff ingestion",
			"Build convention learning from history",
			"Build comment generation with strict noise limits",
			"Add coverage and risk analysis",
			"Add per-repo tuning",
			"Add billing per developer"
		],
		risks: [
			"Noisy comments get the app uninstalled immediately",
			"Model cost per review at scale",
			"Platform vendors ship this natively"
		],
		score: 7,
		tags: [
			"code review",
			"github",
			"developers",
			"automation"
		]
	},
	{
		title: "API Mock and Contract Testing Service",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Front-end teams build against realistic mocks that stay honest to the real API.",
		problem: "Front-end work blocks on unfinished APIs, and hand-written mocks drift from the real contract until integration day.",
		targetUsers: "Full-stack teams, front-end agencies, API providers, mobile teams.",
		solution: "Generate mock servers from an API specification with realistic data, then continuously verify the live API still matches the contract and alert on breaking changes.",
		key: [
			"Mock server generated from a specification",
			"Realistic data generation with relationships",
			"Contract verification against the live API",
			"Breaking change alerts in CI",
			"Shareable mock environments per branch"
		],
		mvp: [
			"Spec-driven mock server",
			"Realistic data",
			"Shared URL"
		],
		future: [
			"Record-and-replay from real traffic",
			"Load simulation",
			"Self-hosted runner"
		],
		stack: [
			"Node.js",
			"Cloudflare Workers",
			"Postgres",
			"Next.js",
			"Stripe"
		],
		money: [
			"Freemium",
			"Per-seat subscription",
			"Enterprise self-hosted"
		],
		pricing: "Free single mock, Team $12/user/mo, Enterprise self-hosted from $5,000/year.",
		acquisition: "Developer content, open-source CLI as the entry point, and integration with popular API tooling.",
		first10: "Ship a free open-source CLI, then offer hosted environments to the teams already using it.",
		steps: [
			"Build spec parsing and mock generation",
			"Build realistic data generation",
			"Build hosted environments per branch",
			"Add contract verification and CI integration",
			"Add breaking change alerts",
			"Add billing"
		],
		risks: [
			"Existing API tooling covers mocking",
			"Specification quality varies wildly",
			"Developers self-host free alternatives"
		],
		score: 6,
		tags: [
			"api",
			"mocking",
			"contract testing",
			"developers"
		]
	},
	{
		title: "Database Migration Safety Reviewer",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Blocks the migration that would lock your production table for ten minutes.",
		problem: "A single careless migration locks a large table and takes production down, and teams only learn which patterns are dangerous after an incident.",
		targetUsers: "Backend teams, platform engineers, database reliability owners.",
		solution: "Analyse migration files in CI against table size statistics, flag locking and rewrite risks, and suggest a safe rewritten sequence.",
		key: [
			"Migration analysis in CI",
			"Risk detection using real table statistics",
			"Safe rewrite suggestions",
			"Estimated lock duration warnings",
			"Team policy rules and overrides"
		],
		mvp: [
			"Postgres migration analysis",
			"CI check",
			"Rewrite suggestions"
		],
		future: [
			"MySQL support",
			"Runtime migration monitoring",
			"Rollback plan generation"
		],
		stack: [
			"Node.js CI action",
			"SQL parser",
			"Postgres",
			"Next.js",
			"Stripe"
		],
		money: [
			"Per-repository subscription",
			"Team plan",
			"Enterprise support"
		],
		pricing: "$49/mo per repository, team plan $199/mo for 10 repositories.",
		acquisition: "Postmortem content on migration incidents, open-source analyser core, and platform engineering communities.",
		first10: "Open-source the analyser, then sell hosted statistics-aware analysis to teams already running it locally.",
		steps: [
			"Build SQL parsing and risk rules",
			"Build the CI integration",
			"Add table statistics ingestion",
			"Add rewrite suggestions",
			"Add policies and overrides",
			"Add billing"
		],
		risks: [
			"Rules must be precise or teams ignore warnings",
			"Database engine differences multiply work",
			"Free linters cover common cases"
		],
		score: 6,
		tags: [
			"database",
			"migrations",
			"reliability",
			"ci"
		]
	},
	{
		title: "Self-Hosted Error and Session Tracking",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "One-time",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Error monitoring you run yourself, with a one-time licence instead of per-event pricing.",
		problem: "Error monitoring pricing scales with event volume, so teams sample away the errors they most need to see.",
		targetUsers: "Teams with data residency requirements, cost-sensitive startups, agencies hosting for clients.",
		solution: "A self-hostable error tracker with source map support, release tracking and session context, sold as a perpetual licence with optional updates.",
		key: [
			"Self-hosted deployment with simple setup",
			"Source map support and readable stack traces",
			"Release and regression tracking",
			"Session context without full replay cost",
			"Perpetual licence, unlimited events"
		],
		mvp: [
			"JavaScript and Node SDKs",
			"Error grouping",
			"Docker deployment"
		],
		future: [
			"More language SDKs",
			"Managed hosting option",
			"Alert routing integrations"
		],
		stack: [
			"Node.js",
			"ClickHouse",
			"Next.js",
			"Docker",
			"Licence server"
		],
		money: [
			"One-time licence per deployment",
			"Annual updates subscription",
			"Managed hosting upsell"
		],
		pricing: "$499 perpetual licence, $199/year for updates and support.",
		acquisition: "Cost comparison content against event-priced vendors, plus self-hosting communities.",
		first10: "Give free licences to ten agencies hosting for clients in exchange for public case studies.",
		steps: [
			"Build ingestion and grouping",
			"Build SDKs for two runtimes",
			"Add source maps and releases",
			"Package deployment simply",
			"Add licensing and updates",
			"Add managed hosting option"
		],
		risks: [
			"Self-hosting support burden is heavy",
			"Free open-source alternatives exist",
			"One-time revenue makes growth lumpy"
		],
		score: 6,
		tags: [
			"monitoring",
			"self-hosted",
			"errors",
			"developers"
		]
	},
	{
		title: "Developer Onboarding Environment Builder",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "Internal Tool",
		suitableFor: "Business",
		short: "New engineers get a working environment in an hour, not a week.",
		problem: "New developers lose their first week to environment setup, and the setup document is always out of date.",
		targetUsers: "Engineering managers, platform teams, agencies rotating developers across projects.",
		solution: "Define the environment as code, verify it continuously in CI so it never rots, and give new joiners a single command plus a checklist of verified working steps.",
		key: [
			"Environment defined as code per repository",
			"Continuous verification so setup never rots",
			"Single-command bootstrap",
			"Progress checklist for new joiners",
			"Time-to-first-commit reporting"
		],
		mvp: [
			"Environment definition",
			"Bootstrap script generation",
			"Verification in CI"
		],
		future: [
			"Cloud development environments",
			"Multi-repo workspaces",
			"Access provisioning automation"
		],
		stack: [
			"Node.js CLI",
			"Container tooling",
			"GitHub Actions",
			"Next.js dashboard"
		],
		money: ["Per-developer subscription", "Platform team plan"],
		pricing: "$10/developer/mo, minimum $100/mo.",
		acquisition: "Platform engineering communities, open-source CLI, and content on onboarding time cost.",
		first10: "Instrument time-to-first-commit at ten companies free and show how long onboarding really takes.",
		steps: [
			"Build environment definition format",
			"Build bootstrap generation",
			"Add continuous verification in CI",
			"Add the joiner checklist and dashboard",
			"Add reporting",
			"Add billing"
		],
		risks: [
			"Cloud development environment vendors compete directly",
			"Every company's setup is idiosyncratic",
			"Platform teams build internally"
		],
		score: 6,
		tags: [
			"onboarding",
			"devex",
			"environments",
			"platform"
		]
	},
	{
		title: "Feature Flag Service for Small Teams",
		category: "Developer Tools",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Simple flags, gradual rollouts and kill switches without enterprise pricing.",
		problem: "Small teams either hand-roll flags in config files or pay enterprise prices for features they will never use.",
		targetUsers: "Startups, small product teams, agencies shipping client products.",
		solution: "A lightweight flag service with edge evaluation, percentage rollouts, targeting rules, and an audit log, priced for small teams.",
		key: [
			"Edge evaluation with low latency",
			"Percentage rollouts and targeting rules",
			"Kill switches with instant propagation",
			"Change audit log",
			"SDKs for common runtimes"
		],
		mvp: [
			"Boolean flags",
			"Percentage rollout",
			"Two SDKs"
		],
		future: [
			"Experimentation metrics",
			"Approval workflows",
			"Self-hosted option"
		],
		stack: [
			"Cloudflare Workers",
			"Durable storage",
			"Next.js",
			"Stripe"
		],
		money: ["Freemium by flags and requests", "Team subscription"],
		pricing: "Free up to 10 flags, $29/mo unlimited flags to 5M requests, $99/mo to 50M.",
		acquisition: "Developer content, open-source SDKs, and pricing comparison against incumbents.",
		first10: "Sponsor and support integration into ten open-source projects and small startups directly.",
		steps: [
			"Build flag storage and edge evaluation",
			"Build SDKs for two runtimes",
			"Add rollouts and targeting",
			"Add audit logs",
			"Add dashboard and team access",
			"Add billing"
		],
		risks: [
			"Well-funded incumbents with generous free tiers",
			"Reliability expectations are absolute",
			"Teams hand-roll flags for free"
		],
		score: 6,
		tags: [
			"feature flags",
			"rollouts",
			"edge",
			"developers"
		]
	},
	{
		title: "Documentation Freshness Monitor",
		category: "Developer Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Flags the docs page that describes code you deleted six months ago.",
		problem: "Documentation silently goes stale, and users only discover it when a code sample fails.",
		targetUsers: "Developer relations teams, API providers, open-source maintainers, technical writers.",
		solution: "Link documentation sections to code paths, detect when linked code changes without a docs update, and test code samples automatically in CI.",
		key: [
			"Docs-to-code linking",
			"Staleness alerts when linked code changes",
			"Executable code sample testing",
			"Broken link and endpoint checks",
			"Freshness dashboard by section"
		],
		mvp: [
			"Docs-to-code links",
			"Change alerts",
			"Link checking"
		],
		future: [
			"Automatic sample repair suggestions",
			"Analytics-weighted prioritisation",
			"Multi-repo support"
		],
		stack: [
			"Node.js",
			"GitHub app",
			"Postgres",
			"Next.js",
			"Stripe"
		],
		money: [
			"Per-repository subscription",
			"Team plan",
			"Free for open source"
		],
		pricing: "$39/mo per docs site, team plan $149/mo.",
		acquisition: "Developer relations communities, free scans of public documentation, and content on stale docs cost.",
		first10: "Scan twenty public API documentation sites, publish the staleness findings, and offer the fix.",
		steps: [
			"Build docs parsing and code linking",
			"Build change detection via the GitHub app",
			"Add sample execution testing",
			"Add link and endpoint checks",
			"Add the freshness dashboard",
			"Add billing"
		],
		risks: [
			"Linking docs to code requires ongoing effort",
			"Docs platforms may add checks",
			"Hard to prove revenue impact"
		],
		score: 6,
		tags: [
			"documentation",
			"devrel",
			"testing",
			"freshness"
		]
	},
	{
		title: "Cloud Cost Attribution for Small Teams",
		category: "Developer Tools",
		difficulty: "Advanced",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Shows which feature, customer or environment is actually spending the money.",
		problem: "Cloud bills arrive as a lump sum, and small teams cannot tell whether a feature, a customer or a forgotten environment caused the increase.",
		targetUsers: "Startup engineering leads, platform engineers, technical founders.",
		solution: "Ingest billing and usage data, attribute cost to services, features and customers using tags and traffic data, and alert on anomalies with likely causes.",
		key: [
			"Cost attribution by service, feature and customer",
			"Anomaly alerts with likely cause",
			"Unused resource detection",
			"Unit economics per customer or request",
			"Forecasting with commitment guidance"
		],
		mvp: [
			"Billing ingestion for one provider",
			"Attribution by tag",
			"Anomaly alerts"
		],
		future: [
			"Multi-cloud support",
			"Automated cleanup actions",
			"Commitment purchase recommendations"
		],
		stack: [
			"Node.js workers",
			"ClickHouse",
			"Cloud billing APIs",
			"Next.js",
			"Stripe"
		],
		money: ["Flat subscription by spend tier", "Percentage-of-savings option"],
		pricing: "$99/mo under $20k monthly cloud spend, $299/mo under $100k.",
		acquisition: "Free cost audits, engineering leadership communities, and content on unit economics.",
		first10: "Audit ten startups' cloud bills free and show the wasted spend before proposing a subscription.",
		steps: [
			"Build billing data ingestion",
			"Build attribution logic with tags and traffic",
			"Add anomaly detection",
			"Add unused resource detection",
			"Add unit economics reporting",
			"Add billing"
		],
		risks: [
			"Cloud providers offer free cost tools",
			"Attribution accuracy depends on tagging discipline",
			"Established cost management vendors"
		],
		score: 6,
		tags: [
			"cloud cost",
			"finops",
			"attribution",
			"startups"
		]
	},
	{
		title: "Webhook Delivery and Debugging Service",
		category: "Developer Tools",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Reliable outbound webhooks with retries, signatures and a replay console.",
		problem: "Every product that sends webhooks rebuilds retries, signing and a debugging console badly, and customers complain about missed events.",
		targetUsers: "API-first startups, SaaS platforms with integrations, developer platform teams.",
		solution: "A hosted delivery layer handling signing, retries with backoff, endpoint health, and a customer-facing console for inspecting and replaying deliveries.",
		key: [
			"Signed deliveries with rotation support",
			"Retries with backoff and dead-letter handling",
			"Endpoint health and auto-disable",
			"Embeddable customer debugging console",
			"Delivery search and replay"
		],
		mvp: [
			"Delivery with retries and signing",
			"Delivery log",
			"Manual replay"
		],
		future: [
			"Customer-facing embeddable portal",
			"Event filtering per endpoint",
			"Self-hosted option"
		],
		stack: [
			"Cloudflare Workers",
			"Queues",
			"ClickHouse",
			"Next.js",
			"Stripe"
		],
		money: [
			"Freemium by delivery volume",
			"Subscription tiers",
			"Enterprise contracts"
		],
		pricing: "Free to 10k deliveries monthly, $49/mo to 1M, $199/mo to 20M.",
		acquisition: "Developer content on webhook reliability, open-source SDKs, and API platform communities.",
		first10: "Migrate ten small API products onto the service and publish their delivery reliability improvement.",
		steps: [
			"Build delivery engine with retries and signing",
			"Build the log and search",
			"Add endpoint health and auto-disable",
			"Build the embeddable console",
			"Add filtering and replay",
			"Add billing by volume"
		],
		risks: [
			"Reliability expectations are absolute",
			"Direct competitors exist and are funded",
			"Teams keep it in-house for control"
		],
		score: 7,
		tags: [
			"webhooks",
			"reliability",
			"api",
			"infrastructure"
		]
	},
	{
		title: "Accessibility Audit and Fix Assistant",
		category: "Developer Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Freelancer",
		short: "Finds real accessibility failures and shows the exact code change to make.",
		problem: "Automated accessibility scanners produce long lists of issues without telling developers what to change, so reports get ignored.",
		targetUsers: "Front-end developers, agencies with accessibility obligations, public sector suppliers.",
		solution: "Scan pages and components, prioritise issues by real user impact, and generate the specific code diff to fix each one in the project's own framework.",
		key: [
			"Automated scanning with impact prioritisation",
			"Framework-aware code fix suggestions",
			"Component-level tracking across pages",
			"CI integration with regression prevention",
			"Compliance reporting for procurement"
		],
		mvp: [
			"Page scanning",
			"Prioritised issues",
			"Fix suggestions"
		],
		future: [
			"Design system rule enforcement",
			"Manual audit workflow",
			"Assistive technology testing guidance"
		],
		stack: [
			"Playwright workers",
			"axe-core",
			"Claude",
			"Next.js",
			"Stripe"
		],
		money: [
			"Subscription by pages scanned",
			"Agency plan",
			"One-off audit reports"
		],
		pricing: "$49/mo for 100 pages, agency $199/mo, one-off audit $499.",
		acquisition: "Free scans of public sector and enterprise sites, accessibility communities, and procurement-driven demand.",
		first10: "Publish free audits of twenty sites in one regulated sector and offer remediation support.",
		steps: [
			"Build scanning infrastructure",
			"Build impact prioritisation",
			"Add framework-aware fix generation",
			"Add component tracking",
			"Add CI integration",
			"Add reporting and billing"
		],
		risks: [
			"Automated scanning catches only part of real accessibility",
			"Overclaiming compliance is a legal risk",
			"Free tools cover basic scanning"
		],
		score: 7,
		tags: [
			"accessibility",
			"audits",
			"frontend",
			"compliance"
		]
	},
	{
		title: "Field Service Job and Photo Reporting",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Engineers capture proof of work on site and the report writes itself.",
		problem: "Field engineers write reports from memory hours later, photos live on personal phones, and disputes cannot be settled.",
		targetUsers: "Maintenance contractors, facilities firms, installers, inspection companies.",
		solution: "A mobile job flow with required photo capture, structured checklists, offline support and automatic branded report generation sent to the client on completion.",
		key: [
			"Offline-capable job checklists",
			"Required photo capture with timestamps",
			"Automatic branded report generation",
			"Customer signature capture",
			"Job history search for disputes"
		],
		mvp: [
			"Job list with checklists",
			"Photo capture",
			"PDF report"
		],
		future: [
			"Scheduling and dispatch",
			"Parts and stock tracking",
			"Client portal"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"R2 storage",
			"PDF generation",
			"Stripe"
		],
		money: ["Per-engineer subscription", "Report volume tiers"],
		pricing: "$25/engineer/mo, minimum 3 engineers.",
		acquisition: "Trade association outreach, direct sales to contractors, and content on dispute costs.",
		first10: "Digitise the paper job sheets of ten contractors and run their next month of jobs alongside paper.",
		steps: [
			"Build offline-capable job and checklist model",
			"Build photo capture and sync",
			"Build report generation",
			"Add signatures",
			"Add history and search",
			"Add billing per engineer"
		],
		risks: [
			"Offline reliability is essential and hard",
			"Field staff resistance to new tools",
			"Established field service platforms"
		],
		score: 7,
		tags: [
			"field service",
			"reports",
			"offline",
			"photos"
		]
	},
	{
		title: "Supplier Quality Scorecard",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Tracks defects, delays and responsiveness so supplier reviews use facts.",
		problem: "Supplier performance is discussed anecdotally, so the same problematic supplier keeps winning work.",
		targetUsers: "Procurement managers, manufacturing quality teams, operations directors.",
		solution: "Record defects, late deliveries and issue resolution times per supplier, produce weighted scorecards, and generate review packs with trends.",
		key: [
			"Defect and delay logging per delivery",
			"Weighted scorecards by criteria",
			"Trend tracking across periods",
			"Review pack generation",
			"Corrective action tracking"
		],
		mvp: [
			"Issue logging",
			"Scorecards",
			"Review export"
		],
		future: [
			"ERP integration",
			"Supplier self-service portal",
			"Cost-of-poor-quality calculation"
		],
		stack: [
			"Next.js",
			"Postgres",
			"Stripe",
			"Resend"
		],
		money: ["Per-company subscription by suppliers tracked", "Enterprise contracts"],
		pricing: "$149/mo up to 50 suppliers, $399/mo up to 300.",
		acquisition: "Procurement and quality communities, and free scorecard templates that rank in search.",
		first10: "Build the first quarter of scorecards manually from ten companies' existing records.",
		steps: [
			"Model suppliers, deliveries and issues",
			"Build logging flows that are fast for warehouse staff",
			"Build weighted scoring",
			"Add trends and review packs",
			"Add corrective actions",
			"Add billing"
		],
		risks: [
			"Data entry discipline determines value",
			"ERP systems include supplier modules",
			"Long procurement sales cycles"
		],
		score: 6,
		tags: [
			"procurement",
			"quality",
			"suppliers",
			"scorecards"
		]
	},
	{
		title: "Incident Postmortem and Action Tracker",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Startup",
		short: "Postmortems that produce tracked actions instead of a forgotten document.",
		problem: "Teams write thorough postmortems and then never complete the actions, so the same incident recurs.",
		targetUsers: "Engineering and operations teams, SRE functions, regulated operations departments.",
		solution: "A guided postmortem template that turns findings into owned, dated actions tracked to completion, with recurrence detection across incidents.",
		key: [
			"Guided blameless postmortem templates",
			"Actions with owners and due dates",
			"Completion tracking and reminders",
			"Recurring theme detection across incidents",
			"Reliability reporting for leadership"
		],
		mvp: [
			"Postmortem template",
			"Action tracking",
			"Reminders"
		],
		future: [
			"Incident management integrations",
			"Issue tracker sync",
			"Trend analytics"
		],
		stack: [
			"Next.js",
			"Supabase",
			"Slack API",
			"Stripe"
		],
		money: [
			"Per-seat subscription",
			"Team plan",
			"Enterprise contracts"
		],
		pricing: "$8/user/mo, team plan $99/mo unlimited users.",
		acquisition: "SRE communities, free postmortem templates, and content on action completion rates.",
		first10: "Facilitate ten teams' next postmortem personally and leave the tracker behind.",
		steps: [
			"Build templates and postmortem authoring",
			"Build action tracking with owners",
			"Add reminders and escalation",
			"Add theme detection",
			"Add integrations",
			"Add billing"
		],
		risks: [
			"Incident tools include postmortems",
			"Usage is sporadic between incidents",
			"Issue trackers already hold actions"
		],
		score: 6,
		tags: [
			"incidents",
			"postmortems",
			"reliability",
			"actions"
		]
	},
	{
		title: "Warehouse Stock Count Companion",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Rolling cycle counts on a phone instead of a shutdown stocktake.",
		problem: "Annual stocktakes shut operations down for a day and still leave inventory records wrong for the rest of the year.",
		targetUsers: "Small warehouses, retailers with stockrooms, manufacturers, distributors.",
		solution: "Schedule rolling cycle counts by location and value, count with barcode scanning on a phone, and reconcile discrepancies with an audit trail.",
		key: [
			"Cycle count scheduling by value and movement",
			"Phone barcode scanning with offline support",
			"Blind counting to prevent bias",
			"Discrepancy reconciliation workflow",
			"Accuracy trend reporting"
		],
		mvp: [
			"Count lists",
			"Barcode scanning",
			"Discrepancy report"
		],
		future: [
			"ERP and commerce integrations",
			"Label printing",
			"Multi-warehouse support"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"Barcode scanning library",
			"Stripe"
		],
		money: ["Per-site subscription", "Per-user tiers"],
		pricing: "$79/mo per site including 5 users, $8 per extra user.",
		acquisition: "Warehouse operations communities, and free cycle count planning templates.",
		first10: "Run one cycle count programme free for ten sites and report their inventory accuracy improvement.",
		steps: [
			"Build item and location data import",
			"Build count scheduling logic",
			"Build the scanning app with offline support",
			"Add blind counting and reconciliation",
			"Add reporting",
			"Add billing"
		],
		risks: [
			"Existing ERP inventory modules",
			"Barcode scanning quality varies by device",
			"Data import from legacy systems is painful"
		],
		score: 6,
		tags: [
			"inventory",
			"warehouse",
			"cycle counts",
			"mobile"
		]
	},
	{
		title: "Standard Operating Procedure Builder",
		category: "Quality & Operations",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Records a process once and turns it into a followable, versioned procedure.",
		problem: "Operational knowledge lives in one person's head, and written procedures are too tedious to produce and maintain.",
		targetUsers: "Operations managers, franchises, clinics, agencies, manufacturing teams.",
		solution: "Capture a process by screen recording or step photos, generate a structured procedure with steps and screenshots, then version it and track who has been trained on it.",
		key: [
			"Capture from screen recording or photos",
			"Automatic step and screenshot extraction",
			"Version history with change highlights",
			"Training acknowledgement tracking",
			"Search across the procedure library"
		],
		mvp: [
			"Step capture and editing",
			"Published procedure pages",
			"Acknowledgements"
		],
		future: [
			"Checklist execution mode with evidence",
			"Multi-language procedures",
			"Audit export packs"
		],
		stack: [
			"Next.js",
			"Browser capture extension",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: [
			"Per-seat subscription",
			"Company plan",
			"Franchise multi-site plan"
		],
		pricing: "$8/user/mo, company plan $99/mo unlimited, franchise plans custom.",
		acquisition: "Operations communities, free procedure templates by industry, and franchise network outreach.",
		first10: "Document ten businesses' three most critical processes for them free of charge.",
		steps: [
			"Build capture tooling",
			"Build step extraction and editing",
			"Add versioning and change highlights",
			"Add training acknowledgement",
			"Add search and library organisation",
			"Add billing"
		],
		risks: [
			"Direct competitors are well established",
			"Procedures rot without ownership",
			"Capture extension maintenance across browsers"
		],
		score: 6,
		tags: [
			"sop",
			"processes",
			"training",
			"operations"
		]
	},
	{
		title: "Restaurant Food Safety Log",
		category: "Quality & Operations",
		difficulty: "Beginner",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Digital temperature and cleaning logs that stand up to an inspection.",
		problem: "Kitchens keep safety records on paper clipboards that get lost, filled in retrospectively and fail inspections.",
		targetUsers: "Restaurants, cafes, catering companies, school and hospital kitchens.",
		solution: "Scheduled digital checks with timestamped entries, photo evidence, corrective action prompts when readings fail, and inspection-ready exports.",
		key: [
			"Scheduled checks with reminders",
			"Timestamped entries that cannot be backdated",
			"Corrective action prompts on failures",
			"Photo evidence capture",
			"Inspection-ready export packs"
		],
		mvp: [
			"Temperature and cleaning checks",
			"Reminders",
			"Export"
		],
		future: [
			"Bluetooth probe integration",
			"Multi-site dashboards",
			"Supplier delivery checks"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"Push notifications",
			"Stripe"
		],
		money: [
			"Per-site subscription",
			"Group plan",
			"Probe hardware bundle"
		],
		pricing: "$29/mo per site, $199/mo for up to 10 sites.",
		acquisition: "Hospitality associations, environmental health officer relationships, and direct outreach after inspection score publications.",
		first10: "Onboard ten venues before their next inspection and support them through it personally.",
		steps: [
			"Build check schedules and templates",
			"Build the entry flow with tamper resistance",
			"Add corrective actions and evidence",
			"Add exports for inspections",
			"Add multi-site dashboards",
			"Add billing"
		],
		risks: [
			"Requirements differ by jurisdiction",
			"Kitchen staff device access and hygiene constraints",
			"Cheap paper alternative is entrenched"
		],
		score: 7,
		tags: [
			"food safety",
			"compliance",
			"hospitality",
			"logs"
		]
	},
	{
		title: "Fleet Vehicle Check and Maintenance Log",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "Mobile App",
		suitableFor: "Business",
		short: "Daily driver checks, defect reporting and service scheduling in one log.",
		problem: "Small fleets rely on paper walkaround checks, miss defects and get caught out on servicing and compliance.",
		targetUsers: "Small haulage firms, trades with vans, delivery companies, hire fleets.",
		solution: "Driver walkaround checks on a phone with photo defect reporting, defect workflow to the workshop, and service scheduling based on mileage and dates.",
		key: [
			"Driver walkaround checks with photos",
			"Defect reporting and workshop workflow",
			"Service scheduling by mileage and date",
			"Document expiry tracking for vehicles and drivers",
			"Compliance-ready audit exports"
		],
		mvp: [
			"Daily checks",
			"Defect reporting",
			"Service reminders"
		],
		future: [
			"Telematics integration",
			"Fuel and cost tracking",
			"Driver scoring"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: ["Per-vehicle subscription", "Fleet tiers"],
		pricing: "$8 per vehicle per month, minimum $49/mo.",
		acquisition: "Transport sector groups, direct outreach to small fleets, and content on compliance penalties.",
		first10: "Digitise the walkaround checks of ten small fleets and run the first month alongside paper.",
		steps: [
			"Build check templates per vehicle type",
			"Build the driver app with offline support",
			"Add defect workflow",
			"Add service scheduling and document expiry",
			"Add audit exports",
			"Add billing per vehicle"
		],
		risks: [
			"Telematics providers bundle checks free",
			"Driver adoption without enforcement",
			"Regulatory detail varies by country"
		],
		score: 6,
		tags: [
			"fleet",
			"compliance",
			"maintenance",
			"drivers"
		]
	},
	{
		title: "Production Downtime Tracker",
		category: "Quality & Operations",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Business",
		short: "Logs why the line stopped and ranks the causes worth fixing first.",
		problem: "Small manufacturers know the line stops often but cannot say which cause costs the most, so improvement effort is misdirected.",
		targetUsers: "Small manufacturers, food producers, packaging lines, workshop supervisors.",
		solution: "Operators log stoppages with reason codes on a shop-floor tablet, the system calculates lost output and cost per cause, and ranks improvement opportunities.",
		key: [
			"Fast shop-floor stoppage logging",
			"Reason code hierarchy per line",
			"Lost output and cost calculation",
			"Pareto ranking of causes",
			"Shift and line comparison reporting"
		],
		mvp: [
			"Stoppage logging",
			"Reason codes",
			"Pareto report"
		],
		future: [
			"Machine signal integration",
			"Maintenance work order linkage",
			"OEE calculation"
		],
		stack: [
			"Next.js tablet interface",
			"Postgres",
			"Stripe"
		],
		money: ["Per-line subscription", "Site licence"],
		pricing: "$99/mo per production line, site licence $399/mo.",
		acquisition: "Manufacturing improvement communities, and free downtime cost calculators.",
		first10: "Run a two-week manual downtime study at ten sites and hand over the ranked cause list.",
		steps: [
			"Build reason code configuration",
			"Build the fast logging interface for gloved hands",
			"Add cost calculation",
			"Add Pareto and comparison reporting",
			"Add machine signal integration",
			"Add billing"
		],
		risks: [
			"Operators must log honestly and consistently",
			"MES platforms cover this at larger sites",
			"Shop floor hardware constraints"
		],
		score: 6,
		tags: [
			"manufacturing",
			"downtime",
			"oee",
			"improvement"
		]
	},
	{
		title: "Household Document and Warranty Vault",
		category: "Personal Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Every receipt, warranty and manual in one place, with expiry reminders.",
		problem: "Household warranties and important documents scatter across drawers and inboxes, and expire unnoticed.",
		targetUsers: "Homeowners, renters, families managing shared paperwork.",
		solution: "Photograph a receipt or document, extract the key dates and details automatically, and get reminders before warranties, insurance or subscriptions expire.",
		key: [
			"Photo capture with automatic detail extraction",
			"Warranty and renewal expiry reminders",
			"Manual and receipt storage per item",
			"Shared household access",
			"Insurance claim evidence export"
		],
		mvp: [
			"Document capture and storage",
			"Manual expiry dates",
			"Reminders"
		],
		future: [
			"Email receipt import",
			"Automatic manual lookup",
			"Home inventory valuation"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"R2 storage",
			"OCR",
			"RevenueCat"
		],
		money: [
			"Freemium by document count",
			"Family subscription",
			"Lifetime option"
		],
		pricing: "Free 25 documents, Plus $3/mo unlimited with sharing, lifetime $59.",
		acquisition: "Home and personal finance communities, and content on claiming warranties successfully.",
		first10: "Recruit from home-owner forums, offering to import the first 50 documents for each user personally.",
		steps: [
			"Build capture and storage",
			"Add extraction of dates and vendors",
			"Add reminders",
			"Add household sharing",
			"Add exports for claims",
			"Add subscriptions"
		],
		risks: [
			"Note apps already do most of this",
			"Storage costs on unlimited plans",
			"Low engagement between purchases"
		],
		score: 6,
		tags: [
			"home",
			"warranty",
			"documents",
			"reminders"
		]
	},
	{
		title: "Shared Household Expense Splitter",
		category: "Personal Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Fair splitting for housemates with unequal incomes, rooms and usage.",
		problem: "Housemates split bills equally when rooms, incomes and usage differ wildly, which causes ongoing resentment.",
		targetUsers: "Housemates, couples with different incomes, families sharing costs.",
		solution: "Configurable split rules per expense type — equal, by income, by room size or by usage — with running balances and simple settlement.",
		key: [
			"Per-expense-type split rules",
			"Income-proportional and usage-based options",
			"Recurring bill handling",
			"Running balances and settle-up suggestions",
			"Receipt attachment for disputes"
		],
		mvp: [
			"Expense entry with split rules",
			"Balances",
			"Settle up"
		],
		future: [
			"Bank feed import",
			"Payment links for settlement",
			"Household budget view"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Household subscription",
			"Lifetime purchase"
		],
		pricing: "Free basic splitting, Plus $2/mo per household for rules and imports.",
		acquisition: "Shared-living communities, university accommodation groups, and content on fair splitting.",
		first10: "Recruit ten households directly and configure their exact split rules for them.",
		steps: [
			"Build expenses and split rule engine",
			"Build balances and settlement",
			"Add recurring bills",
			"Add receipts",
			"Add payment links",
			"Add subscriptions"
		],
		risks: [
			"Free incumbents dominate this category",
			"Only one housemate installs it",
			"Low willingness to pay"
		],
		score: 5,
		tags: [
			"expenses",
			"housemates",
			"splitting",
			"budgeting"
		]
	},
	{
		title: "Personal Reading and Note Library",
		category: "Personal Tools",
		difficulty: "Intermediate",
		businessModel: "Subscription",
		buildType: "SaaS",
		suitableFor: "Beginner",
		short: "Saves articles and books with highlights that resurface when relevant.",
		problem: "People save far more than they read and never revisit their highlights, so the reading produces no lasting value.",
		targetUsers: "Researchers, students, knowledge workers, avid readers.",
		solution: "Save articles and book highlights, organise by topic automatically, and resurface relevant past highlights when writing or reading something related.",
		key: [
			"Save from browser and mobile share sheet",
			"Highlight capture including e-reader import",
			"Automatic topic organisation",
			"Contextual resurfacing of related highlights",
			"Export to note apps"
		],
		mvp: [
			"Save articles",
			"Highlights",
			"Search and export"
		],
		future: [
			"E-reader sync",
			"Spaced review",
			"Public curated collections"
		],
		stack: [
			"Next.js",
			"Browser extension",
			"Supabase",
			"Embeddings search",
			"Stripe"
		],
		money: [
			"Freemium by saved items",
			"Subscription",
			"Lifetime option"
		],
		pricing: "Free 100 saves, Pro $5/mo unlimited with resurfacing.",
		acquisition: "Note-taking and productivity communities, integrations with popular note apps, and content on retention.",
		first10: "Import existing highlight exports for 30 heavy readers and show them connections they had forgotten.",
		steps: [
			"Build saving from browser and mobile",
			"Build highlight capture and import",
			"Add topic organisation with embeddings",
			"Add contextual resurfacing",
			"Add exports and integrations",
			"Add billing"
		],
		risks: [
			"Strong established read-later and highlight tools",
			"Import formats vary across e-readers",
			"Resurfacing quality is make-or-break"
		],
		score: 6,
		tags: [
			"reading",
			"highlights",
			"notes",
			"knowledge"
		]
	},
	{
		title: "Meal Planner from What You Already Have",
		category: "Personal Tools",
		difficulty: "Intermediate",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Plans the week's meals around the ingredients already in your kitchen.",
		problem: "Meal planners suggest recipes requiring a full shop, so food already at home gets wasted and plans get abandoned.",
		targetUsers: "Busy households, budget-conscious cooks, people reducing food waste.",
		solution: "Track kitchen staples loosely, generate a week of meals prioritising what needs using first, and produce a short top-up shopping list.",
		key: [
			"Loose pantry tracking that is quick to update",
			"Use-first prioritisation by expiry",
			"Weekly plan with realistic effort levels",
			"Short top-up shopping list",
			"Dietary and dislike filters"
		],
		mvp: [
			"Pantry list",
			"Weekly plan generation",
			"Shopping list"
		],
		future: [
			"Receipt scanning to update pantry",
			"Supermarket price comparison",
			"Household sharing"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"Recipe data",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription for planning features",
			"Affiliate on grocery orders"
		],
		pricing: "Free manual planning, Plus $3/mo for automatic plans and waste tracking.",
		acquisition: "Food waste and budgeting communities, plus content on cooking from a bare cupboard.",
		first10: "Plan a week manually for 20 households and refine the algorithm from what they actually cooked.",
		steps: [
			"Build pantry tracking that takes seconds",
			"Build recipe matching against available items",
			"Add expiry prioritisation",
			"Add plan generation and shopping list",
			"Add dietary filters",
			"Add subscriptions"
		],
		risks: [
			"Pantry tracking is abandoned quickly",
			"Recipe data licensing",
			"Free recipe apps are abundant"
		],
		score: 6,
		tags: [
			"meal planning",
			"food waste",
			"recipes",
			"budget"
		]
	},
	{
		title: "Car Ownership Cost and Service Log",
		category: "Personal Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Tracks the true cost per mile and keeps a resale-ready service history.",
		problem: "Drivers underestimate running costs and lose service records, which reduces resale value and hides expensive faults.",
		targetUsers: "Private car owners, small fleet owners, car enthusiasts, private sellers.",
		solution: "Log fuel, servicing, insurance and repairs, calculate real cost per mile, remind about due services, and export a verifiable history pack at sale time.",
		key: [
			"Fuel and expense logging with receipts",
			"True cost per mile calculation",
			"Service due reminders by mileage and date",
			"Fault pattern tracking",
			"Sale-ready history export"
		],
		mvp: [
			"Expense logging",
			"Cost per mile",
			"Service reminders"
		],
		future: [
			"Multi-vehicle households",
			"Parts price lookups",
			"Insurance renewal comparison"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"R2 storage",
			"RevenueCat"
		],
		money: [
			"Freemium by vehicles",
			"Subscription",
			"Affiliate on servicing and insurance"
		],
		pricing: "Free one vehicle, Plus $2/mo for multiple vehicles and exports.",
		acquisition: "Car enthusiast forums, used car buying communities, and content on total ownership cost.",
		first10: "Recruit in owner forums for specific car models and add the maintenance schedules those owners need.",
		steps: [
			"Build expense and mileage logging",
			"Add cost calculations",
			"Add service schedules and reminders",
			"Add receipts and fault tracking",
			"Add export pack",
			"Add subscriptions"
		],
		risks: [
			"Manual logging fatigue",
			"Spreadsheets are adequate for many",
			"Model-specific service data is hard to source"
		],
		score: 5,
		tags: [
			"cars",
			"expenses",
			"maintenance",
			"logging"
		]
	},
	{
		title: "Gift and Occasion Planner",
		category: "Personal Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "Mobile App",
		suitableFor: "Beginner",
		short: "Remembers occasions early and keeps a running list of gift ideas per person.",
		problem: "People remember birthdays two days late and buy panic gifts, forgetting the perfect idea they had months earlier.",
		targetUsers: "Anyone with a large family or friend group, couples coordinating gifts.",
		solution: "Track occasions with lead-time reminders, capture gift ideas per person whenever they come up, set budgets and record what was given to avoid repeats.",
		key: [
			"Occasion tracking with lead-time reminders",
			"Gift idea capture per person",
			"Budget tracking per occasion and year",
			"Past gift history to avoid repeats",
			"Shared lists for couples and families"
		],
		mvp: [
			"Occasions and reminders",
			"Idea capture",
			"Gift history"
		],
		future: [
			"Shared family wishlists",
			"Price drop alerts on saved ideas",
			"Group gifting coordination"
		],
		stack: [
			"Capacitor",
			"Supabase",
			"Push notifications",
			"RevenueCat"
		],
		money: [
			"Freemium",
			"Subscription",
			"Affiliate on gift purchases"
		],
		pricing: "Free 10 people, Plus $2/mo unlimited with sharing.",
		acquisition: "Seasonal content before major gifting periods, and sharing between couples as a growth loop.",
		first10: "Launch before a major gifting season with a genuinely useful free tier and personal onboarding.",
		steps: [
			"Build people and occasion records",
			"Add lead-time reminders",
			"Add idea capture and budgets",
			"Add gift history",
			"Add sharing",
			"Add subscriptions"
		],
		risks: [
			"Highly seasonal usage",
			"Calendar apps cover reminders",
			"Low willingness to pay"
		],
		score: 5,
		tags: [
			"gifts",
			"occasions",
			"reminders",
			"family"
		]
	},
	{
		title: "Personal Job Application Tracker",
		category: "Personal Tools",
		difficulty: "Beginner",
		businessModel: "Freemium",
		buildType: "SaaS",
		suitableFor: "Beginner",
		short: "Tracks applications, follow-ups and interview prep in one place.",
		problem: "Job seekers lose track of where they applied, miss follow-up windows and arrive at interviews without reviewing their own application.",
		targetUsers: "Active job seekers, graduates, career changers, contractors between roles.",
		solution: "Save applications with the job description, track stage and follow-up dates, store tailored CV versions, and prepare with role-specific question prompts.",
		key: [
			"Application tracking with stages",
			"Follow-up reminders at the right intervals",
			"Tailored CV and cover letter versions per role",
			"Interview prep notes per company",
			"Outcome analytics on what gets responses"
		],
		mvp: [
			"Application list with stages",
			"Reminders",
			"Document storage"
		],
		future: [
			"Browser extension to save postings",
			"Interview question generation",
			"Salary negotiation tracker"
		],
		stack: [
			"Next.js",
			"Supabase",
			"R2 storage",
			"Stripe"
		],
		money: [
			"Freemium by active applications",
			"Subscription during job search",
			"Lifetime option"
		],
		pricing: "Free 10 applications, Plus $6/mo, or $29 for three months.",
		acquisition: "Career communities, graduate careers services, and content on follow-up timing.",
		first10: "Support 20 active job seekers directly through a full search and refine around what they actually needed.",
		steps: [
			"Build application records and stages",
			"Add reminders and follow-ups",
			"Add document versions",
			"Add prep notes",
			"Add outcome analytics",
			"Add billing"
		],
		risks: [
			"Users churn as soon as they get hired",
			"Spreadsheets are the default and free",
			"Job boards add tracking"
		],
		score: 6,
		tags: [
			"job search",
			"applications",
			"tracking",
			"career"
		]
	}
];
var IDEA_CATEGORIES = [
	"AI",
	"SaaS",
	"Productivity",
	"Business",
	"Finance",
	"Education",
	"Healthcare",
	"HR",
	"Marketing",
	"E-commerce",
	"Creator Tools",
	"Developer Tools",
	"Quality & Operations",
	"Personal Tools"
];
var RAW = [
	...PART_1,
	...PART_2,
	...PART_3,
	...PART_4,
	...PART_5
];
function slugify(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
/** Stable, deterministic dates so "Newest" sorting is meaningful offline. */
var SEED_DATE = Date.UTC(2026, 7, 24);
function expand(raw, index) {
	const stamp = (/* @__PURE__ */ new Date(SEED_DATE - index * 864e5)).toISOString();
	return {
		id: `idea-${String(index + 1).padStart(3, "0")}`,
		slug: slugify(raw.title),
		title: raw.title,
		shortDescription: raw.short,
		problem: raw.problem,
		targetUsers: raw.targetUsers,
		proposedSolution: raw.solution,
		category: raw.category,
		difficulty: raw.difficulty,
		businessModel: raw.businessModel,
		buildType: raw.buildType,
		suitableFor: raw.suitableFor,
		keyFeatures: raw.key,
		mvpFeatures: raw.mvp,
		futureFeatures: raw.future,
		techStack: raw.stack,
		monetizationOptions: raw.money,
		pricingSuggestions: raw.pricing,
		customerAcquisition: raw.acquisition,
		first10Customers: raw.first10,
		buildSteps: raw.steps,
		risks: raw.risks,
		opportunityScore: raw.score,
		tags: raw.tags,
		isPublished: true,
		createdAt: stamp,
		updatedAt: stamp
	};
}
var BUILD_IDEAS = RAW.map(expand).filter((i) => i.isPublished);
var IDEA_TOTAL = BUILD_IDEAS.length;
IDEA_CATEGORIES.map((category) => ({
	category,
	count: BUILD_IDEAS.filter((i) => i.category === category).length
}));
var DIFFICULTIES = [
	"Beginner",
	"Intermediate",
	"Advanced"
];
var BUSINESS_MODELS = [
	"Subscription",
	"One-time",
	"Freemium",
	"Marketplace",
	"Advertising",
	"Service"
];
var BUILD_TYPES = [
	"Website",
	"SaaS",
	"Mobile App",
	"Internal Tool"
];
var SUITABLE_FOR = [
	"Beginner",
	"Freelancer",
	"Startup",
	"Business"
];
function findIdea(slug) {
	return BUILD_IDEAS.find((i) => i.slug === slug);
}
var DIFFICULTY_WEIGHT = {
	Beginner: 0,
	Intermediate: 1,
	Advanced: 2
};
var EMPTY_FILTERS = {
	query: "",
	categories: [],
	difficulties: [],
	models: [],
	types: [],
	suitable: []
};
function haystack(idea) {
	return [
		idea.title,
		idea.shortDescription,
		idea.problem,
		idea.targetUsers,
		idea.proposedSolution,
		idea.category,
		idea.buildType,
		idea.businessModel,
		...idea.tags,
		...idea.keyFeatures,
		...idea.techStack
	].join(" ").toLowerCase();
}
function filterIdeas(filters, sort, savedIds = []) {
	const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const sorted = [...BUILD_IDEAS.filter((idea) => {
		if (filters.categories.length && !filters.categories.includes(idea.category)) return false;
		if (filters.difficulties.length && !filters.difficulties.includes(idea.difficulty)) return false;
		if (filters.models.length && !filters.models.includes(idea.businessModel)) return false;
		if (filters.types.length && !filters.types.includes(idea.buildType)) return false;
		if (filters.suitable.length && !filters.suitable.includes(idea.suitableFor)) return false;
		if (!tokens.length) return true;
		const hay = haystack(idea);
		return tokens.every((t) => hay.includes(t));
	})];
	if (sort === "opportunity") sorted.sort((a, b) => b.opportunityScore - a.opportunityScore);
	else if (sort === "easiest") sorted.sort((a, b) => DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty] || b.opportunityScore - a.opportunityScore);
	else if (sort === "saved") sorted.sort((a, b) => Number(savedIds.includes(b.id)) - Number(savedIds.includes(a.id)) || b.opportunityScore - a.opportunityScore);
	else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	return sorted;
}
function relatedIdeas(idea, limit = 3) {
	return BUILD_IDEAS.filter((i) => i.id !== idea.id && i.category === idea.category).slice(0, limit);
}
//#endregion
export { EMPTY_FILTERS as a, SUITABLE_FOR as c, relatedIdeas as d, DIFFICULTIES as i, filterIdeas as l, BUILD_TYPES as n, IDEA_CATEGORIES as o, BUSINESS_MODELS as r, IDEA_TOTAL as s, BUILD_IDEAS as t, findIdea as u };
