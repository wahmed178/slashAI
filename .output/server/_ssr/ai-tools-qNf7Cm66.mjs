import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Sparkles, L as Search, T as Star, in as ExternalLink, n as Zap, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-tools-qNf7Cm66.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOOL_CATEGORIES = [
	"General AI",
	"Writing",
	"Image",
	"Video",
	"Audio",
	"Coding",
	"Learning",
	"Productivity",
	"Research",
	"Design",
	"Voice",
	"Marketing",
	"Data",
	"Automation",
	"3D",
	"Music"
];
var CATEGORY_ICONS = {
	"General AI": "🤖",
	Writing: "✍️",
	Image: "🎨",
	Video: "🎬",
	Audio: "🎵",
	Coding: "💻",
	Learning: "📚",
	Productivity: "⚡",
	Research: "🔬",
	Design: "🖼️",
	Voice: "🗣️",
	Marketing: "📣",
	Data: "📊",
	Automation: "⚙️",
	"3D": "🧊",
	Music: "🎶"
};
var TOOLS = [
	{
		id: "chatgpt",
		name: "ChatGPT",
		vendor: "OpenAI",
		category: "General AI",
		bestFor: "Writing, Q&A, everyday tasks",
		freeTier: "Free with GPT-4o mini",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://chat.openai.com",
		query: "writing",
		icon: "💬",
		tags: [
			"chat",
			"assistant",
			"writing"
		],
		featured: true
	},
	{
		id: "claude",
		name: "Claude",
		vendor: "Anthropic",
		category: "General AI",
		bestFor: "Long documents, careful reasoning",
		freeTier: "Free with daily limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://claude.ai",
		query: "summarize",
		icon: "🧠",
		tags: [
			"chat",
			"reasoning",
			"documents"
		],
		trending: true
	},
	{
		id: "gemini",
		name: "Gemini",
		vendor: "Google",
		category: "General AI",
		bestFor: "Search-grounded answers, images",
		freeTier: "Free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://gemini.google.com",
		query: "research",
		icon: "✨",
		tags: [
			"search",
			"multimodal",
			"free"
		]
	},
	{
		id: "copilot",
		name: "Microsoft Copilot",
		vendor: "Microsoft",
		category: "General AI",
		bestFor: "Documents, spreadsheets, email",
		freeTier: "Free web version",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://copilot.microsoft.com",
		query: "email",
		icon: "🔵",
		tags: [
			"office",
			"documents",
			"email"
		],
		trending: true
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		vendor: "DeepSeek",
		category: "General AI",
		bestFor: "Reasoning, coding, math",
		freeTier: "Free unlimited chat",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://chat.deepseek.com",
		query: "reasoning",
		icon: "🔍",
		tags: [
			"reasoning",
			"coding",
			"math"
		]
	},
	{
		id: "groq",
		name: "Groq",
		vendor: "Groq",
		category: "General AI",
		bestFor: "Blazing fast AI inference",
		freeTier: "Free tier with API key",
		pricing: "Free",
		difficulty: "Intermediate",
		url: "https://groq.com",
		query: "fast inference",
		icon: "⚡",
		tags: [
			"fast",
			"api",
			"inference"
		]
	},
	{
		id: "poe",
		name: "Poe",
		vendor: "Quora",
		category: "General AI",
		bestFor: "Access multiple AI models",
		freeTier: "Free daily messages",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://poe.com",
		query: "multi-model",
		icon: "🏛️",
		tags: ["multi-model", "chat"]
	},
	{
		id: "grammarly",
		name: "Grammarly",
		vendor: "Grammarly",
		category: "Writing",
		bestFor: "Grammar, clarity and tone",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.grammarly.com",
		query: "proofread",
		icon: "📝",
		tags: [
			"grammar",
			"editing",
			"tone"
		],
		featured: true
	},
	{
		id: "copyai",
		name: "Copy.ai",
		vendor: "Copy.ai",
		category: "Writing",
		bestFor: "Marketing copy and ads",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.copy.ai",
		query: "copywriting",
		icon: "📋",
		tags: [
			"marketing",
			"ads",
			"copy"
		]
	},
	{
		id: "jasper",
		name: "Jasper",
		vendor: "Jasper AI",
		category: "Writing",
		bestFor: "Long-form content and blogs",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Intermediate",
		url: "https://www.jasper.ai",
		query: "blog post",
		icon: "📝",
		tags: [
			"blog",
			"content",
			"marketing"
		]
	},
	{
		id: "writesonic",
		name: "Writesonic",
		vendor: "Writesonic",
		category: "Writing",
		bestFor: "Blog posts, ads, landing pages",
		freeTier: "Free plan with credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://writesonic.com",
		query: "blog",
		icon: "⚡",
		tags: [
			"blog",
			"ads",
			"landing-pages"
		]
	},
	{
		id: "quillbot",
		name: "QuillBot",
		vendor: "QuillBot",
		category: "Writing",
		bestFor: "Paraphrasing and summarizing",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://quillbot.com",
		query: "paraphrase",
		icon: "🪶",
		tags: [
			"paraphrase",
			"summarize",
			"grammar"
		]
	},
	{
		id: "hemingway",
		name: "Hemingway Editor",
		vendor: "Hemingway",
		category: "Writing",
		bestFor: "Clear, concise writing",
		freeTier: "Free web version",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://hemingwayapp.com",
		query: "simplify",
		icon: "📖",
		tags: [
			"editing",
			"clarity",
			"readability"
		]
	},
	{
		id: "notion-ai",
		name: "Notion AI",
		vendor: "Notion",
		category: "Writing",
		bestFor: "Notes, docs and task write-ups",
		freeTier: "Limited free AI responses",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.notion.so/product/ai",
		query: "notes",
		icon: "📓",
		tags: [
			"notes",
			"docs",
			"productivity"
		]
	},
	{
		id: "sudowrite",
		name: "Sudowrite",
		vendor: "Sudowrite",
		category: "Writing",
		bestFor: "Fiction writing and storytelling",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://www.sudowrite.com",
		query: "fiction",
		icon: "✍️",
		tags: [
			"fiction",
			"storytelling",
			"creative"
		]
	},
	{
		id: "rytr",
		name: "Rytr",
		vendor: "Rytr",
		category: "Writing",
		bestFor: "Quick short-form content",
		freeTier: "Free plan (10k chars/mo)",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://rytr.me",
		query: "short-form",
		icon: "⚡",
		tags: [
			"short-form",
			"content",
			"marketing"
		]
	},
	{
		id: "INK",
		name: "INK Editor",
		vendor: "INK",
		category: "Writing",
		bestFor: "SEO content optimization",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://inkforall.com",
		query: "seo content",
		icon: "🖊️",
		tags: [
			"seo",
			"content",
			"optimization"
		]
	},
	{
		id: "canva",
		name: "Canva AI",
		vendor: "Canva",
		category: "Image",
		bestFor: "Social posts, posters, quick design",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.canva.com",
		query: "design",
		icon: "🎨",
		tags: [
			"design",
			"social-media",
			"templates"
		],
		featured: true
	},
	{
		id: "bing-image",
		name: "Bing Image Creator",
		vendor: "Microsoft",
		category: "Image",
		bestFor: "Free text-to-image generation",
		freeTier: "Free with daily boosts",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://www.bing.com/images/create",
		query: "image",
		icon: "🖼️",
		tags: [
			"text-to-image",
			"free",
			"dall-e"
		]
	},
	{
		id: "leonardo",
		name: "Leonardo AI",
		vendor: "Leonardo",
		category: "Image",
		bestFor: "Stylised art and concept images",
		freeTier: "150 daily free tokens",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://leonardo.ai",
		query: "illustration",
		icon: "🎭",
		tags: [
			"art",
			"concept",
			"illustration"
		],
		trending: true
	},
	{
		id: "midjourney",
		name: "Midjourney",
		vendor: "Midjourney",
		category: "Image",
		bestFor: "High-quality artistic images",
		freeTier: "Paid only",
		pricing: "Paid",
		difficulty: "Intermediate",
		url: "https://midjourney.com",
		query: "art",
		icon: "🎨",
		tags: [
			"art",
			"artistic",
			"high-quality"
		]
	},
	{
		id: "ideogram",
		name: "Ideogram",
		vendor: "Ideogram",
		category: "Image",
		bestFor: "Text in images, logos",
		freeTier: "Free with daily limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://ideogram.ai",
		query: "logo",
		icon: "🔤",
		tags: [
			"text-in-image",
			"logo",
			"typography"
		]
	},
	{
		id: "removebg",
		name: "Remove.bg",
		vendor: "Kaleido AI",
		category: "Image",
		bestFor: "Background removal",
		freeTier: "Free low-res",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.remove.bg",
		query: "remove background",
		icon: "✂️",
		tags: [
			"background",
			"removal",
			"cutout"
		]
	},
	{
		id: "clipdrop",
		name: "Clipdrop",
		vendor: "Stability AI",
		category: "Image",
		bestFor: "Image cleanup, upscaling, relighting",
		freeTier: "Free with limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://clipdrop.co",
		query: "cleanup",
		icon: "📸",
		tags: [
			"cleanup",
			"upscaling",
			"relighting"
		]
	},
	{
		id: "photoroom",
		name: "PhotoRoom",
		vendor: "PhotoRoom",
		category: "Image",
		bestFor: "Product photos for e-commerce",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.photoroom.com",
		query: "product photo",
		icon: "🏪",
		tags: [
			"product",
			"ecommerce",
			"background"
		]
	},
	{
		id: "playground",
		name: "Playground AI",
		vendor: "Playground",
		category: "Image",
		bestFor: "Image generation and editing",
		freeTier: "500 images/day free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://playground.com",
		query: "generate image",
		icon: "🎮",
		tags: [
			"generation",
			"editing",
			"free"
		]
	},
	{
		id: "capcut",
		name: "CapCut",
		vendor: "ByteDance",
		category: "Video",
		bestFor: "Video editing with AI captions",
		freeTier: "Free desktop and mobile",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.capcut.com",
		query: "video edit",
		icon: "🎬",
		tags: [
			"editing",
			"captions",
			"tiktok"
		],
		trending: true
	},
	{
		id: "runway",
		name: "Runway",
		vendor: "Runway",
		category: "Video",
		bestFor: "AI video generation (Gen-3)",
		freeTier: "Free credits on signup",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://runwayml.com",
		query: "text to video",
		icon: "🎥",
		tags: [
			"text-to-video",
			"ai-effects",
			"gen-3"
		]
	},
	{
		id: "sora",
		name: "Sora",
		vendor: "OpenAI",
		category: "Video",
		bestFor: "Text-to-video generation",
		freeTier: "ChatGPT Plus required",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://sora.com",
		query: "video",
		icon: "🎬",
		tags: [
			"text-to-video",
			"openai",
			"realistic"
		],
		trending: true
	},
	{
		id: "pika",
		name: "Pika",
		vendor: "Pika Labs",
		category: "Video",
		bestFor: "Quick AI video clips",
		freeTier: "Free credits daily",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://pika.art",
		query: "video clip",
		icon: "⚡",
		tags: [
			"text-to-video",
			"quick",
			"creative"
		]
	},
	{
		id: "synthesia",
		name: "Synthesia",
		vendor: "Synthesia",
		category: "Video",
		bestFor: "AI avatar videos for training",
		freeTier: "Free demo",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://www.synthesia.io",
		query: "avatar video",
		icon: "🧑‍💼",
		tags: [
			"avatar",
			"training",
			"corporate"
		]
	},
	{
		id: "invideo",
		name: "InVideo AI",
		vendor: "InVideo",
		category: "Video",
		bestFor: "Text-to-video for social media",
		freeTier: "Free with watermark",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://invideo.io",
		query: "social video",
		icon: "📱",
		tags: [
			"social-media",
			"youtube",
			"templates"
		]
	},
	{
		id: "heygen",
		name: "HeyGen",
		vendor: "HeyGen",
		category: "Video",
		bestFor: "AI video translation & avatars",
		freeTier: "1 free video",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.heygen.com",
		query: "video translate",
		icon: "🌍",
		tags: [
			"translation",
			"avatar",
			"lip-sync"
		]
	},
	{
		id: "d-id",
		name: "D-ID",
		vendor: "D-ID",
		category: "Video",
		bestFor: "Talking head videos from photos",
		freeTier: "Free trial credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.d-id.com",
		query: "talking photo",
		icon: "🗣️",
		tags: [
			"talking-head",
			"avatar",
			"photo"
		]
	},
	{
		id: "suno",
		name: "Suno",
		vendor: "Suno AI",
		category: "Music",
		bestFor: "AI song generation with vocals",
		freeTier: "50 credits/day (~10 songs)",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://suno.com",
		query: "music",
		icon: "🎶",
		tags: [
			"music",
			"vocals",
			"song-generation"
		],
		trending: true
	},
	{
		id: "udio",
		name: "Udio",
		vendor: "Udio",
		category: "Music",
		bestFor: "High-quality AI music",
		freeTier: "10 songs/month free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.udio.com",
		query: "song",
		icon: "🎵",
		tags: [
			"music",
			"high-quality",
			"vocals"
		]
	},
	{
		id: "murf",
		name: "Murf AI",
		vendor: "Murf",
		category: "Voice",
		bestFor: "Professional voiceovers",
		freeTier: "Free trial",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://murf.ai",
		query: "voiceover",
		icon: "🎙️",
		tags: [
			"voiceover",
			"professional",
			"narration"
		]
	},
	{
		id: "speechify",
		name: "Speechify",
		vendor: "Speechify",
		category: "Voice",
		bestFor: "Text-to-speech reading",
		freeTier: "Free voices",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://speechify.com",
		query: "text to speech",
		icon: "🔊",
		tags: [
			"tts",
			"reading",
			"accessibility"
		]
	},
	{
		id: "github-copilot",
		name: "GitHub Copilot",
		vendor: "GitHub",
		category: "Coding",
		bestFor: "Code completion and suggestions",
		freeTier: "Free for students & OSS",
		pricing: "Paid",
		difficulty: "Intermediate",
		url: "https://github.com/features/copilot",
		query: "code",
		icon: "🐙",
		tags: [
			"code-completion",
			"vscode",
			"github"
		]
	},
	{
		id: "codeium",
		name: "Windsurf / Codeium",
		vendor: "Codeium",
		category: "Coding",
		bestFor: "Code completion in your editor",
		freeTier: "Free for individuals",
		pricing: "Free",
		difficulty: "Intermediate",
		url: "https://codeium.com",
		query: "refactor",
		icon: "🏄",
		tags: [
			"code-completion",
			"free",
			"vscode"
		]
	},
	{
		id: "cursor",
		name: "Cursor",
		vendor: "Cursor",
		category: "Coding",
		bestFor: "AI-first code editor",
		freeTier: "Free tier available",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://cursor.sh",
		query: "code editor",
		icon: "📝",
		tags: [
			"editor",
			"ai-native",
			"vscode-fork"
		]
	},
	{
		id: "v0",
		name: "v0",
		vendor: "Vercel",
		category: "Coding",
		bestFor: "Generate UI from prompts",
		freeTier: "Free with limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://v0.dev",
		query: "ui code",
		icon: "🎯",
		tags: [
			"ui",
			"react",
			"generative"
		],
		trending: true
	},
	{
		id: "bolt",
		name: "Bolt.new",
		vendor: "StackBlitz",
		category: "Coding",
		bestFor: "Full-stack apps in browser",
		freeTier: "Free with limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://bolt.new",
		query: "fullstack",
		icon: "⚡",
		tags: [
			"fullstack",
			"browser",
			"instant"
		]
	},
	{
		id: "replit",
		name: "Replit AI",
		vendor: "Replit",
		category: "Coding",
		bestFor: "Code in browser with AI",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://replit.com",
		query: "code online",
		icon: "🔄",
		tags: [
			"browser",
			"ide",
			"collaboration"
		]
	},
	{
		id: "tabnine",
		name: "Tabnine",
		vendor: "Tabnine",
		category: "Coding",
		bestFor: "Code completion, private model",
		freeTier: "Free basic plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.tabnine.com",
		query: "autocomplete",
		icon: "⌨️",
		tags: [
			"code-completion",
			"private",
			"enterprise"
		]
	},
	{
		id: "codespaces",
		name: "GitHub Codespaces",
		vendor: "GitHub",
		category: "Coding",
		bestFor: "Cloud dev environments",
		freeTier: "120 core-hours/month free",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://github.com/features/codespaces",
		query: "cloud ide",
		icon: "☁️",
		tags: [
			"cloud",
			"ide",
			"dev-environment"
		]
	},
	{
		id: "figma-ai",
		name: "Figma AI",
		vendor: "Figma",
		category: "Design",
		bestFor: "UI/UX design with AI assist",
		freeTier: "Free plan with AI",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.figma.com",
		query: "ui design",
		icon: "🎨",
		tags: [
			"ui",
			"ux",
			"figma",
			"collaboration"
		]
	},
	{
		id: "looka",
		name: "Looka",
		vendor: "Looka",
		category: "Design",
		bestFor: "AI logo maker",
		freeTier: "Free preview",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://looka.com",
		query: "logo",
		icon: "✨",
		tags: [
			"logo",
			"branding",
			"identity"
		]
	},
	{
		id: "flair",
		name: "Flair AI",
		vendor: "Flair",
		category: "Design",
		bestFor: "Product photography with AI",
		freeTier: "Free credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://flair.ai",
		query: "product design",
		icon: "📸",
		tags: [
			"product",
			"photography",
			"ecommerce"
		]
	},
	{
		id: "autodraw",
		name: "AutoDraw",
		vendor: "Google",
		category: "Design",
		bestFor: "Quick sketch to icon",
		freeTier: "Free",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://www.autodraw.com",
		query: "sketch",
		icon: "✏️",
		tags: [
			"sketch",
			"drawing",
			"free",
			"google"
		]
	},
	{
		id: "perplexity",
		name: "Perplexity",
		vendor: "Perplexity AI",
		category: "Research",
		bestFor: "Cited research and fact-finding",
		freeTier: "Unlimited quick searches",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.perplexity.ai",
		query: "research",
		icon: "🔍",
		tags: [
			"research",
			"citations",
			"search"
		],
		featured: true
	},
	{
		id: "consensus",
		name: "Consensus",
		vendor: "Consensus",
		category: "Research",
		bestFor: "Academic paper search",
		freeTier: "Free searches",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.consensus.app",
		query: "papers",
		icon: "📄",
		tags: [
			"academic",
			"papers",
			"science"
		]
	},
	{
		id: "elicit",
		name: "Elicit",
		vendor: "Elicit",
		category: "Research",
		bestFor: "AI research assistant",
		freeTier: "Free with limits",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://elicit.com",
		query: "research paper",
		icon: "🔬",
		tags: [
			"academic",
			"analysis",
			"literature"
		]
	},
	{
		id: "semantic-scholar",
		name: "Semantic Scholar",
		vendor: "Allen AI",
		category: "Research",
		bestFor: "AI-powered paper search",
		freeTier: "Free",
		pricing: "Free",
		difficulty: "Intermediate",
		url: "https://www.semanticscholar.org",
		query: "scholar",
		icon: "🎓",
		tags: [
			"academic",
			"papers",
			"free"
		]
	},
	{
		id: "gamma",
		name: "Gamma",
		vendor: "Gamma",
		category: "Productivity",
		bestFor: "Slide decks and one-pagers",
		freeTier: "Free credits on signup",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://gamma.app",
		query: "presentation",
		icon: "📊",
		tags: [
			"slides",
			"presentations",
			"docs"
		]
	},
	{
		id: "otter",
		name: "Otter.ai",
		vendor: "Otter",
		category: "Productivity",
		bestFor: "Meeting transcription",
		freeTier: "300 mins/month free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://otter.ai",
		query: "meeting notes",
		icon: "🦦",
		tags: [
			"transcription",
			"meetings",
			"notes"
		]
	},
	{
		id: "reclaim",
		name: "Reclaim AI",
		vendor: "Reclaim",
		category: "Productivity",
		bestFor: "AI calendar scheduling",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://reclaim.ai",
		query: "schedule",
		icon: "📅",
		tags: [
			"calendar",
			"scheduling",
			"time"
		]
	},
	{
		id: "tome",
		name: "Tome",
		vendor: "Tome",
		category: "Productivity",
		bestFor: "AI-powered storytelling slides",
		freeTier: "Free credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://tome.app",
		query: "storytelling",
		icon: "📖",
		tags: [
			"slides",
			"storytelling",
			"presentations"
		]
	},
	{
		id: "mem",
		name: "Mem AI",
		vendor: "Mem",
		category: "Productivity",
		bestFor: "Smart note-taking",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://mem.ai",
		query: "notes",
		icon: "🧠",
		tags: [
			"notes",
			"knowledge",
			"organization"
		]
	},
	{
		id: "magical",
		name: "Magical",
		vendor: "Magical",
		category: "Productivity",
		bestFor: "Text expansion & AI writing",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.getmagical.com",
		query: "text expand",
		icon: "🪄",
		tags: [
			"text-expansion",
			"automation",
			"email"
		]
	},
	{
		id: "hubspot-ai",
		name: "HubSpot AI",
		vendor: "HubSpot",
		category: "Marketing",
		bestFor: "CRM + marketing automation",
		freeTier: "Free CRM plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.hubspot.com",
		query: "crm",
		icon: "🟠",
		tags: [
			"crm",
			"marketing",
			"email"
		]
	},
	{
		id: "surfer-seo",
		name: "Surfer SEO",
		vendor: "Surfer",
		category: "Marketing",
		bestFor: "Content optimization for SEO",
		freeTier: "Free SERP analyzer",
		pricing: "Paid",
		difficulty: "Intermediate",
		url: "https://surferseo.com",
		query: "seo",
		icon: "🏄",
		tags: [
			"seo",
			"content",
			"optimization"
		]
	},
	{
		id: "buffer",
		name: "Buffer AI",
		vendor: "Buffer",
		category: "Marketing",
		bestFor: "Social media scheduling",
		freeTier: "3 channels free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://buffer.com",
		query: "social media",
		icon: "📦",
		tags: [
			"social-media",
			"scheduling",
			"analytics"
		]
	},
	{
		id: "mailchimp",
		name: "Mailchimp AI",
		vendor: "Mailchimp",
		category: "Marketing",
		bestFor: "Email marketing with AI",
		freeTier: "500 contacts free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://mailchimp.com",
		query: "email campaign",
		icon: "📧",
		tags: [
			"email",
			"marketing",
			"campaigns"
		]
	},
	{
		id: "julius",
		name: "Julius AI",
		vendor: "Julius",
		category: "Data",
		bestFor: "Data analysis with natural language",
		freeTier: "Free limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://julius.ai",
		query: "data analysis",
		icon: "📊",
		tags: [
			"data",
			"analysis",
			"charts"
		]
	},
	{
		id: "obviously-ai",
		name: "Obviously AI",
		vendor: "Obviously AI",
		category: "Data",
		bestFor: "No-code ML predictions",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://www.obviously.ai",
		query: "prediction",
		icon: "🔮",
		tags: [
			"ml",
			"prediction",
			"no-code"
		]
	},
	{
		id: "zapier-ai",
		name: "Zapier AI",
		vendor: "Zapier",
		category: "Automation",
		bestFor: "Workflow automation with AI",
		freeTier: "100 tasks/month free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://zapier.com",
		query: "automate",
		icon: "⚡",
		tags: [
			"automation",
			"workflows",
			"integration"
		]
	},
	{
		id: "make",
		name: "Make AI",
		vendor: "Make",
		category: "Automation",
		bestFor: "Visual workflow builder",
		freeTier: "1,000 ops/month free",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.make.com",
		query: "workflow",
		icon: "🔵",
		tags: [
			"automation",
			"visual",
			"integration"
		]
	},
	{
		id: "bardeen",
		name: "Bardeen",
		vendor: "Bardeen",
		category: "Automation",
		bestFor: "Browser automation & scraping",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.bardeen.ai",
		query: "scrape",
		icon: "🤖",
		tags: [
			"browser",
			"scraping",
			"automation"
		]
	},
	{
		id: "khanmigo",
		name: "Khan Academy",
		vendor: "Khan Academy",
		category: "Learning",
		bestFor: "Structured study and practice",
		freeTier: "Free courses",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://www.khanacademy.org",
		query: "study plan",
		icon: "🎓",
		tags: [
			"courses",
			"math",
			"free"
		]
	},
	{
		id: "duolingo",
		name: "Duolingo Max",
		vendor: "Duolingo",
		category: "Learning",
		bestFor: "Language learning with AI",
		freeTier: "Free plan (with ads)",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.duolingo.com",
		query: "language",
		icon: "🦉",
		tags: [
			"language",
			"learning",
			"gamified"
		]
	},
	{
		id: "photomath",
		name: "Photomath",
		vendor: "Photomath",
		category: "Learning",
		bestFor: "Math problem solver",
		freeTier: "Free basic solutions",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://photomath.com",
		query: "math",
		icon: "📐",
		tags: [
			"math",
			"scanning",
			"solutions"
		]
	},
	{
		id: "coursera",
		name: "Coursera AI",
		vendor: "Coursera",
		category: "Learning",
		bestFor: "University-level courses",
		freeTier: "Free audit courses",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.coursera.org",
		query: "course",
		icon: "🏛️",
		tags: [
			"courses",
			"university",
			"certificates"
		]
	},
	{
		id: "meshy",
		name: "Meshy",
		vendor: "Meshy",
		category: "3D",
		bestFor: "AI 3D model generation",
		freeTier: "Free credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.meshy.ai",
		query: "3d model",
		icon: "🧊",
		tags: [
			"3d",
			"modeling",
			"generation"
		]
	},
	{
		id: "luma",
		name: "Luma AI",
		vendor: "Luma",
		category: "3D",
		bestFor: "3D capture and NeRF",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://lumalabs.ai",
		query: "3d capture",
		icon: "📷",
		tags: [
			"3d",
			"nerf",
			"capture"
		]
	},
	{
		id: "descript",
		name: "Descript",
		vendor: "Descript",
		category: "Video",
		bestFor: "Video editing by editing text",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.descript.com",
		query: "video edit",
		icon: "📝",
		tags: [
			"video",
			"editing",
			"transcription"
		]
	},
	{
		id: "wondershare",
		name: "Filmora AI",
		vendor: "Wondershare",
		category: "Video",
		bestFor: "Easy video editing with AI",
		freeTier: "Free with watermark",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://filmora.wondershare.com",
		query: "video editor",
		icon: "🎞️",
		tags: [
			"video",
			"editing",
			"beginner"
		]
	},
	{
		id: "luma-dream",
		name: "Luma Dream Machine",
		vendor: "Luma",
		category: "Video",
		bestFor: "Text-to-video generation",
		freeTier: "5 videos/day free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://lumalabs.ai/dream-machine",
		query: "text to video",
		icon: "🎬",
		tags: [
			"text-to-video",
			"fast",
			"free"
		]
	},
	{
		id: "kling",
		name: "Kling AI",
		vendor: "Kuaishou",
		category: "Video",
		bestFor: "High-quality AI video",
		freeTier: "66 credits/day free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://klingai.com",
		query: "ai video",
		icon: "🎥",
		tags: [
			"video",
			"high-quality",
			"free"
		]
	},
	{
		id: "elevenlabs",
		name: "ElevenLabs",
		vendor: "ElevenLabs",
		category: "Voice",
		bestFor: "Hyper-realistic text-to-speech",
		freeTier: "10,000 chars/month free",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://elevenlabs.io",
		query: "voiceover",
		icon: "🗣️",
		tags: [
			"tts",
			"voice-cloning",
			"realistic"
		],
		featured: true
	},
	{
		id: "whisper",
		name: "Whisper",
		vendor: "OpenAI",
		category: "Audio",
		bestFor: "Speech-to-text transcription",
		freeTier: "Open source (free)",
		pricing: "Free",
		difficulty: "Intermediate",
		url: "https://github.com/openai/whisper",
		query: "transcribe",
		icon: "🎤",
		tags: [
			"transcription",
			"open-source",
			"local"
		]
	},
	{
		id: "bark",
		name: "Bark",
		vendor: "Suno AI",
		category: "Voice",
		bestFor: "Open-source text-to-speech",
		freeTier: "Open source (free)",
		pricing: "Open Source",
		difficulty: "Advanced",
		url: "https://github.com/suno-ai/bark",
		query: "open source tts",
		icon: "🐕",
		tags: [
			"tts",
			"open-source",
			"local"
		]
	},
	{
		id: "you",
		name: "You.com",
		vendor: "You.com",
		category: "Research",
		bestFor: "AI search with multiple modes",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://you.com",
		query: "search ai",
		icon: "🔎",
		tags: [
			"search",
			"ai",
			"modes"
		]
	},
	{
		id: "phind",
		name: "Phind",
		vendor: "Phind",
		category: "Coding",
		bestFor: "AI search for developers",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.phind.com",
		query: "dev search",
		icon: "💡",
		tags: [
			"developer",
			"search",
			"code"
		]
	},
	{
		id: "mistral",
		name: "Mistral Le Chat",
		vendor: "Mistral AI",
		category: "General AI",
		bestFor: "European AI chat with web search",
		freeTier: "Free",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://chat.mistral.ai",
		query: "chat",
		icon: "🇫🇷",
		tags: [
			"chat",
			"european",
			"free"
		]
	},
	{
		id: "lensa",
		name: "Lensa AI",
		vendor: "Prisma Labs",
		category: "Image",
		bestFor: "AI avatar and portrait maker",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://lensa-ai.com",
		query: "avatar",
		icon: "🧑‍🎨",
		tags: [
			"avatar",
			"portrait",
			"magic-avatars"
		]
	},
	{
		id: "topaz",
		name: "Topaz Photo AI",
		vendor: "Topaz Labs",
		category: "Image",
		bestFor: "AI image upscaling and denoising",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Intermediate",
		url: "https://www.topazlabs.com",
		query: "upscale",
		icon: "🔍",
		tags: [
			"upscaling",
			"denoising",
			"professional"
		]
	},
	{
		id: "copy-shots",
		name: "CopyShots",
		vendor: "CopyShots",
		category: "Marketing",
		bestFor: "Ad creative generation",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://copyshots.ai",
		query: "ad creative",
		icon: "🎯",
		tags: [
			"ads",
			"creative",
			"marketing"
		]
	},
	{
		id: "liftoff",
		name: "Liftoff",
		vendor: "Liftoff",
		category: "Marketing",
		bestFor: "App install campaigns",
		freeTier: "Free consultation",
		pricing: "Paid",
		difficulty: "Advanced",
		url: "https://liftoff.io",
		query: "app marketing",
		icon: "🚀",
		tags: [
			"app",
			"mobile",
			"acquisition"
		]
	},
	{
		id: "rev",
		name: "Rev",
		vendor: "Rev.com",
		category: "Audio",
		bestFor: "Transcription and captions",
		freeTier: "30 min free transcription",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.rev.com",
		query: "transcribe",
		icon: "🎧",
		tags: [
			"transcription",
			"captions",
			"speech"
		]
	},
	{
		id: "adobe-podcast",
		name: "Adobe Podcast",
		vendor: "Adobe",
		category: "Audio",
		bestFor: "AI audio enhancement & recording",
		freeTier: "Free web app",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://podcast.adobe.com",
		query: "podcast",
		icon: "🎙️",
		tags: [
			"audio",
			"enhance",
			"podcast",
			"free"
		]
	},
	{
		id: "podcastle",
		name: "Podcastle",
		vendor: "Podcastle",
		category: "Audio",
		bestFor: "Podcast recording & editing",
		freeTier: "Free plan (3h/mo)",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://podcastle.ai",
		query: "podcast edit",
		icon: "🎚️",
		tags: [
			"podcast",
			"editing",
			"recording"
		]
	},
	{
		id: "happyscribe",
		name: "Happy Scribe",
		vendor: "Happy Scribe",
		category: "Audio",
		bestFor: "Transcription & subtitles",
		freeTier: "30 min free/month",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.happyscribe.com",
		query: "subtitles",
		icon: "💬",
		tags: [
			"transcription",
			"subtitles",
			"multilingual"
		]
	},
	{
		id: "beatoven",
		name: "Beatoven.ai",
		vendor: "Beatoven",
		category: "Music",
		bestFor: "Royalty-free music for videos",
		freeTier: "15 min free credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.beatoven.ai",
		query: "music",
		icon: "🥁",
		tags: [
			"music",
			"royalty-free",
			"video"
		]
	},
	{
		id: "soundraw",
		name: "Soundraw",
		vendor: "Soundraw",
		category: "Music",
		bestFor: "Custom AI music generation",
		freeTier: "Free plan with limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://soundraw.io",
		query: "song generator",
		icon: "🎛️",
		tags: [
			"music",
			"generation",
			"custom"
		]
	},
	{
		id: "aiva",
		name: "AIVA",
		vendor: "AIVA Technologies",
		category: "Music",
		bestFor: "AI-composed original scores",
		freeTier: "Free plan (3 downloads)",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.aiva.ai",
		query: "compose",
		icon: "🎼",
		tags: [
			"music",
			"composition",
			"scores"
		]
	},
	{
		id: "pandasai",
		name: "PandasAI",
		vendor: "PandasAI",
		category: "Data",
		bestFor: "Chat with your data in Python",
		freeTier: "Open source (free)",
		pricing: "Open Source",
		difficulty: "Advanced",
		url: "https://pandas-ai.com",
		query: "data analysis",
		icon: "🐼",
		tags: [
			"python",
			"data",
			"chat",
			"open-source"
		]
	},
	{
		id: "hex",
		name: "Hex",
		vendor: "Hex Technologies",
		category: "Data",
		bestFor: "AI notebooks for analysis",
		freeTier: "Free community plan",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://hex.tech",
		query: "notebook",
		icon: "📔",
		tags: [
			"notebooks",
			"sql",
			"python"
		]
	},
	{
		id: "tripo",
		name: "Tripo AI",
		vendor: "Tripo",
		category: "3D",
		bestFor: "Text/image to 3D models",
		freeTier: "Free daily credits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://www.tripo3d.ai",
		query: "3d model",
		icon: "🧊",
		tags: [
			"3d",
			"text-to-3d",
			"generation"
		]
	},
	{
		id: "sloyd",
		name: "Sloyd",
		vendor: "Sloyd",
		category: "3D",
		bestFor: "Game-ready 3D assets",
		freeTier: "Free beta",
		pricing: "Freemium",
		difficulty: "Intermediate",
		url: "https://www.sloyd.ai",
		query: "3d asset",
		icon: "🎮",
		tags: [
			"3d",
			"game-assets",
			"low-poly"
		]
	},
	{
		id: "predis",
		name: "Predis.ai",
		vendor: "Predis",
		category: "Marketing",
		bestFor: "AI social media content",
		freeTier: "Free plan (10 posts/mo)",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://predis.ai",
		query: "social media",
		icon: "📱",
		tags: [
			"social-media",
			"content",
			"scheduling"
		]
	},
	{
		id: "simplified",
		name: "Simplified",
		vendor: "Simplified",
		category: "Marketing",
		bestFor: "Design + copy in one suite",
		freeTier: "Free plan",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://simplified.com",
		query: "social post",
		icon: "🛠️",
		tags: [
			"design",
			"copywriting",
			"social"
		]
	},
	{
		id: "fireflies",
		name: "Fireflies.ai",
		vendor: "Fireflies",
		category: "Productivity",
		bestFor: "Meeting notes & summaries",
		freeTier: "800 min free",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://fireflies.ai",
		query: "meeting notes",
		icon: "🪰",
		tags: [
			"meetings",
			"notes",
			"transcription"
		]
	},
	{
		id: "motion",
		name: "Motion",
		vendor: "Motion",
		category: "Productivity",
		bestFor: "AI calendar & task auto-scheduling",
		freeTier: "Free trial",
		pricing: "Paid",
		difficulty: "Beginner",
		url: "https://www.usemotion.com",
		query: "schedule",
		icon: "🗓️",
		tags: [
			"calendar",
			"tasks",
			"scheduling"
		]
	},
	{
		id: "socratic",
		name: "Socratic by Google",
		vendor: "Google",
		category: "Learning",
		bestFor: "Homework help by photo",
		freeTier: "Free",
		pricing: "Free",
		difficulty: "Beginner",
		url: "https://socratic.org",
		query: "homework",
		icon: "🎓",
		tags: [
			"homework",
			"math",
			"science",
			"free"
		]
	},
	{
		id: "n8n",
		name: "n8n",
		vendor: "n8n",
		category: "Automation",
		bestFor: "Self-hosted workflow automation",
		freeTier: "Open source (free)",
		pricing: "Open Source",
		difficulty: "Advanced",
		url: "https://n8n.io",
		query: "automate",
		icon: "🟣",
		tags: [
			"automation",
			"self-hosted",
			"open-source"
		]
	},
	{
		id: "grok",
		name: "Grok",
		vendor: "xAI",
		category: "General AI",
		bestFor: "Real-time X data & chat",
		freeTier: "Free with limits",
		pricing: "Freemium",
		difficulty: "Beginner",
		url: "https://grok.com",
		query: "chat",
		icon: "🛸",
		tags: [
			"chat",
			"x",
			"real-time"
		],
		trending: true
	}
];
var PRICING_COLORS = {
	Free: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
	Freemium: "bg-blue-500/15 text-blue-400 border-blue-500/20",
	Paid: "bg-orange-500/15 text-orange-400 border-orange-500/20",
	"Open Source": "bg-purple-500/15 text-purple-400 border-purple-500/20"
};
function ToolCard({ tool }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative flex flex-col rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:bg-surface/80",
		children: [
			tool.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-px -right-px rounded-bl-xl rounded-tr-2xl bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
				children: "Featured"
			}),
			tool.trending && !tool.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-px -right-px rounded-bl-xl rounded-tr-2xl bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400",
				children: "Trending"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-lg",
						children: tool.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-sm font-semibold text-foreground",
							children: tool.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: tool.vendor
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", PRICING_COLORS[tool.pricing] ?? PRICING_COLORS["Freemium"]),
						children: tool.pricing
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 flex-1 text-xs leading-relaxed text-muted-foreground",
				children: tool.bestFor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[11px] text-primary/70",
				children: ["Free: ", tool.freeTier]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1",
				children: tool.tags.slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground",
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "h-8 flex-1 gap-1.5 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: tool.url,
						target: "_blank",
						rel: "noreferrer noopener",
						children: ["Visit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "h-8 gap-1.5 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/search",
						search: {
							q: tool.query,
							cat: "all",
							sub: "all",
							sort: "relevance"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3" }), " Commands"]
					})
				})]
			})
		]
	});
}
function AiToolsPage() {
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [search, setSearch] = (0, import_react.useState)("");
	const [sortBy, setSortBy] = (0, import_react.useState)("name");
	const [toolOfDay] = (0, import_react.useState)(() => {
		return TOOLS[(/* @__PURE__ */ new Date()).getDate() % TOOLS.length];
	});
	const featured = (0, import_react.useMemo)(() => TOOLS.filter((t) => t.featured), []);
	const trending = (0, import_react.useMemo)(() => TOOLS.filter((t) => t.trending), []);
	const filtered = (0, import_react.useMemo)(() => {
		let list = filter === "All" ? TOOLS : TOOLS.filter((t) => t.category === filter);
		if (search) {
			const q = search.toLowerCase();
			list = list.filter((t) => t.name.toLowerCase().includes(q) || t.vendor.toLowerCase().includes(q) || t.bestFor.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q)));
		}
		if (sortBy === "pricing") {
			const order = {
				Free: 0,
				"Open Source": 1,
				Freemium: 2,
				Paid: 3
			};
			list = [...list].sort((a, b) => (order[a.pricing] ?? 0) - (order[b.pricing] ?? 0));
		}
		return list;
	}, [
		filter,
		search,
		sortBy
	]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = { All: TOOLS.length };
		for (const t of TOOLS) counts[t.category] = (counts[t.category] ?? 0) + 1;
		return counts;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-surface to-primary/5 px-6 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,transparent_60%)] opacity-[0.04]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-7 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-black tracking-tight text-foreground md:text-4xl",
							children: "AI Tools Directory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base",
							children: [
								"Discover ",
								TOOLS.length,
								"+ curated AI tools with a genuinely usable free tier. Pick one, then bring a SlashAI command with you."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-border bg-background px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search tools by name, category, or use case...",
									className: "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
								}),
								search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSearch(""),
									className: "text-xs text-muted-foreground hover:text-foreground",
									children: "✕"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"🔥 ",
									TOOLS.length,
									" tools"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Object.keys(categoryCounts).length - 1, " categories"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [TOOLS.filter((t) => t.pricing === "Free").length, " completely free"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [TOOLS.filter((t) => t.pricing === "Open Source").length, " open source"] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 text-yellow-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-foreground",
						children: "Tool of the Day"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-2xl",
							children: toolOfDay.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-foreground",
										children: toolOfDay.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", PRICING_COLORS[toolOfDay.pricing]),
										children: toolOfDay.pricing
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: toolOfDay.bestFor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-primary",
									children: ["Free tier: ", toolOfDay.freeTier]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										className: "gap-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: toolOfDay.url,
											target: "_blank",
											rel: "noreferrer noopener",
											children: ["Try it free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										className: "gap-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/search",
											search: {
												q: toolOfDay.query,
												cat: "all",
												sub: "all",
												sort: "relevance"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3" }), " See commands"]
										})
									})]
								})
							]
						})]
					})
				})]
			}),
			featured.length > 0 && !search && filter === "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-foreground",
						children: "Featured Tools"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: featured.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool: t }, t.id))
				})]
			}),
			trending.length > 0 && !search && filter === "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-orange-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-foreground",
						children: "Trending Now"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: trending.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool: t }, t.id))
				})]
			}),
			!search && filter === "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl border border-border bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-center text-sm font-bold text-foreground",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						{
							step: "1",
							title: "Search",
							desc: "Browse 100+ AI tools by category, name, or use case.",
							icon: "🔍"
						},
						{
							step: "2",
							title: "Discover",
							desc: "Find the best free tools matched to your task with real free-tier limits.",
							icon: "💡"
						},
						{
							step: "3",
							title: "Create",
							desc: "Follow the step-by-step process and launch your next project for free.",
							icon: "🚀"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm",
							children: s.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: s.desc
						})] })]
					}, s.step))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold text-foreground",
							children: [filter === "All" ? "All Tools" : `${filter} Tools`, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 font-normal text-muted-foreground",
								children: [
									"(",
									filtered.length,
									")"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: sortBy,
							onChange: (e) => setSortBy(e.target.value),
							className: "rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "name",
								children: "Sort: A → Z"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pricing",
								children: "Sort: Free first"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "-mx-4 mb-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2",
						children: ["All", ...TOOL_CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": filter === c,
							onClick: () => setFilter(c),
							className: cn("min-h-8 shrink-0 snap-start rounded-full border px-3 text-xs font-medium transition-colors", filter === c ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
							children: [
								c !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-1",
									children: CATEGORY_ICONS[c]
								}),
								c,
								" (",
								categoryCounts[c] ?? 0,
								")"
							]
						}, c))
					}),
					filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-12 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No tools found matching your search."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setSearch("");
								setFilter("All");
							},
							className: "mt-2 text-xs text-primary hover:underline",
							children: "Clear filters"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool: t }, t.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 pb-8 text-center text-[11px] text-muted-foreground/60",
				children: "SlashAI is not affiliated with any of these tools and earns nothing from these links. Free tiers change — check the tool's own pricing page before relying on one."
			})
		]
	});
}
//#endregion
export { AiToolsPage as component };
