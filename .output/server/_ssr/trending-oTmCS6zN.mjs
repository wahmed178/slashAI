import { o as __toESM } from "../_runtime.mjs";
import { t as GENERATORS } from "./generators-BQMEiZJM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ALL_GLOSSARY } from "./glossary-CH5u11uF.mjs";
import { t as ALL_ROADMAPS } from "./roadmaps-JDCJRZid.mjs";
import { p as resourcesBySection } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, dn as Copy, in as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as COLLECTIONS } from "./collections-OIdjX1d6.mjs";
import { t as ResourceCardEnhanced } from "./ResourceCardEnhanced-BCTymkiK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trending-oTmCS6zN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_DOT_COLORS = {
	Image: "#a78bfa",
	Video: "#f472b6",
	Writing: "#60a5fa",
	Code: "#34d399",
	Thinking: "#fbbf24",
	Style: "#f87171"
};
var ALL_CATEGORIES = [
	"Image",
	"Video",
	"Writing",
	"Code",
	"Thinking",
	"Style"
];
var TRENDING_COMMANDS = [
	{
		slug: "bokeh",
		command: "/bokeh",
		description: "Adds beautiful blurred background (depth of field effect)",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 1,
		howToUse: "Append /bokeh to any image prompt to get a professional shallow depth-of-field look with creamy background blur.",
		example: "A portrait of a girl in a cafe /bokeh"
	},
	{
		slug: "hd",
		command: "/hd",
		description: "Forces high-detail, high-resolution output",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 2,
		howToUse: "Add /hd to any prompt to increase detail level and output resolution. Works especially well on landscapes and product shots.",
		example: "Mountain landscape at sunset /hd"
	},
	{
		slug: "upscale",
		command: "/upscale",
		description: "Increases resolution and sharpens details",
		worksIn: ["Midjourney", "Stable Diffusion"],
		category: "Image",
		trendingRank: 3,
		howToUse: "Use after generating an image to increase its resolution and refine fine details. Works on any generated image.",
		example: "/upscale [attach your image]"
	},
	{
		slug: "cinematic",
		command: "/cinematic",
		description: "Applies film-quality lighting and color grading",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 4,
		howToUse: "Append /cinematic to get Hollywood-level lighting, color grading, and composition in your images.",
		example: "A man walking through a neon-lit Tokyo street at night /cinematic"
	},
	{
		slug: "ghibli",
		command: "/ghibli",
		description: "Studio Ghibli animation art style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 5,
		howToUse: "Transform any subject into a Studio Ghibli animation style — soft watercolors, warm tones, hand-painted feel.",
		example: "A cozy cottage on a hillside /ghibli"
	},
	{
		slug: "pixar",
		command: "/pixar",
		description: "3D Pixar animation render style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Adobe Firefly"
		],
		category: "Image",
		trendingRank: 6,
		howToUse: "Converts any character or scene into a Pixar-quality 3D animated render with smooth textures and expressive features.",
		example: "A wise old owl wearing glasses /pixar"
	},
	{
		slug: "neon",
		command: "/neon",
		description: "Neon glow lighting aesthetic",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 7,
		howToUse: "Adds vibrant neon glow effects — cyberpunk streets, glowing signs, electric color accents on any scene.",
		example: "A rainy city alley at midnight /neon"
	},
	{
		slug: "vintage",
		command: "/vintage",
		description: "Aged, film grain, retro color palette",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 8,
		howToUse: "Applies a vintage film aesthetic — warm faded tones, subtle grain, and a nostalgic 70s-80s feel.",
		example: "A family photo on the beach /vintage"
	},
	{
		slug: "minimal",
		command: "/minimal",
		description: "Clean, stripped-back, whitespace-heavy composition",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 9,
		howToUse: "Reduces any scene to its essential elements with generous whitespace and clean lines.",
		example: "A single coffee cup on a white table /minimal"
	},
	{
		slug: "dramatic",
		command: "/dramatic",
		description: "High contrast, moody, intense lighting",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 10,
		howToUse: "Adds dramatic chiaroscuro lighting — deep shadows, strong highlights, theatrical mood.",
		example: "A portrait of an old man with deep wrinkles /dramatic"
	},
	{
		slug: "golden",
		command: "/golden",
		description: "Golden hour warm light, sun rays",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 11,
		howToUse: "Bathes any scene in warm golden hour light with long shadows and sun flares.",
		example: "A wheat field stretching to the horizon /golden"
	},
	{
		slug: "watercolor",
		command: "/watercolor",
		description: "Hand-painted watercolor illustration style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 12,
		howToUse: "Transforms any subject into a delicate watercolor painting with soft edges and color bleeds.",
		example: "A Japanese garden in spring /watercolor"
	},
	{
		slug: "sketch",
		command: "/sketch",
		description: "Pencil sketch / hand-drawn look",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 13,
		howToUse: "Converts any image into a pencil sketch or hand-drawn illustration with visible linework.",
		example: "A Victorian house with a garden /sketch"
	},
	{
		slug: "oil",
		command: "/oil",
		description: "Oil painting texture and brushwork style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 14,
		howToUse: "Applies rich oil painting textures — visible brushstrokes, thick impasto, classical art feel.",
		example: "A bowl of fruit on a wooden table /oil"
	},
	{
		slug: "noir",
		command: "/noir",
		description: "Black and white, hard shadows, film noir",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 15,
		howToUse: "Converts any scene to classic film noir — high contrast black and white, venetian blind shadows, moody atmosphere.",
		example: "A detective in a 1940s office /noir"
	},
	{
		slug: "anime",
		command: "/anime",
		description: "Japanese anime art style",
		worksIn: [
			"Midjourney",
			"Stable Diffusion",
			"DALL-E"
		],
		category: "Image",
		trendingRank: 16,
		howToUse: "Transforms any subject into Japanese anime art style with clean lines and vibrant colors.",
		example: "A warrior standing on a cliff edge /anime"
	},
	{
		slug: "realistic",
		command: "/realistic",
		description: "Hyper-photorealistic render",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 17,
		howToUse: "Pushes any generated image toward photorealism — real textures, lighting, and detail.",
		example: "A street food vendor in Bangkok /realistic"
	},
	{
		slug: "matte",
		command: "/matte",
		description: "Flat, matte color painting, concept art style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 18,
		howToUse: "Applies matte painting aesthetics — flat color fields, subtle gradients, concept art feel.",
		example: "A fantasy city on floating islands /matte"
	},
	{
		slug: "flat",
		command: "/flat",
		description: "2D flat design illustration",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 19,
		howToUse: "Converts any subject into clean 2D flat design — geometric shapes, solid colors, minimal shading.",
		example: "A city skyline with trees /flat"
	},
	{
		slug: "isometric",
		command: "/isometric",
		description: "Isometric 3D illustration style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 20,
		howToUse: "Renders any scene in isometric perspective — 45-degree angle, clean 3D look, no perspective distortion.",
		example: "A tiny house with a garden /isometric"
	},
	{
		slug: "glitch",
		command: "/glitch",
		description: "Digital glitch distortion effect",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 21,
		howToUse: "Adds digital glitch artifacts — color channel shifts, pixel corruption, VHS-style distortion.",
		example: "A portrait of a woman /glitch"
	},
	{
		slug: "holographic",
		command: "/holographic",
		description: "Iridescent holographic foil aesthetic",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 22,
		howToUse: "Applies holographic rainbow foil effects — iridescent surfaces, light prismatic reflections.",
		example: "A product on a pedestal /holographic"
	},
	{
		slug: "clay",
		command: "/clay",
		description: "Claymation / clay render style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 23,
		howToUse: "Makes any subject look like a clay stop-motion animation — soft, handmade, tactile feel.",
		example: "A robot walking through a forest /clay"
	},
	{
		slug: "vaporwave",
		command: "/vaporwave",
		description: "80s neon retrowave aesthetic",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 24,
		howToUse: "Applies vaporwave/retrowave aesthetics — grid lines, sunset gradients, Roman busts, neon chrome.",
		example: "A futuristic city at sunset /vaporwave"
	},
	{
		slug: "lofi",
		command: "/lofi",
		description: "Lo-fi cozy aesthetic, warm and grainy",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 25,
		howToUse: "Creates a cozy lo-fi aesthetic — warm amber tones, fairy lights, rain on windows, plants.",
		example: "A bedroom desk with a laptop at night /lofi"
	},
	{
		slug: "macro",
		command: "/macro",
		description: "Extreme close-up, macro photography style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 26,
		howToUse: "Renders any subject in extreme macro close-up — visible texture, shallow depth of field, tiny details.",
		example: "A dewdrop on a leaf /macro"
	},
	{
		slug: "aerial",
		command: "/aerial",
		description: "Bird's eye / aerial drone view",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 27,
		howToUse: "Shifts any scene to a bird's eye aerial perspective — top-down drone shot look.",
		example: "A winding river through a forest /aerial"
	},
	{
		slug: "editorial",
		command: "/editorial",
		description: "Fashion editorial / magazine photography style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 28,
		howToUse: "Applies high-end editorial photography aesthetics — professional lighting, bold composition, magazine quality.",
		example: "A model in a red dress against a white wall /editorial"
	},
	{
		slug: "product",
		command: "/product",
		description: "Clean product photography on white/marble",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Adobe Firefly"
		],
		category: "Image",
		trendingRank: 29,
		howToUse: "Places any object in a clean product photography setup — studio lighting, clean background, commercial quality.",
		example: "A leather wallet /product"
	},
	{
		slug: "architect",
		command: "/architect",
		description: "Architectural visualization render style",
		worksIn: [
			"Midjourney",
			"DALL-E",
			"Stable Diffusion"
		],
		category: "Image",
		trendingRank: 30,
		howToUse: "Renders buildings and spaces in professional architectural visualization quality.",
		example: "A modern house with floor-to-ceiling windows /architect"
	},
	{
		slug: "slowmo",
		command: "/slowmo",
		description: "Slow motion effect",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 31,
		howToUse: "Append to any video prompt to create slow-motion playback — great for dramatic moments, water splashes, hair movement.",
		example: "A glass of water falling and shattering /slowmo"
	},
	{
		slug: "timelapse",
		command: "/timelapse",
		description: "Timelapse speed effect",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 32,
		howToUse: "Compresses hours into seconds — clouds moving, flowers blooming, city traffic flowing.",
		example: "Sunset over a city skyline /timelapse"
	},
	{
		slug: "loop",
		command: "/loop",
		description: "Seamlessly looping animation",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 33,
		howToUse: "Creates a seamless loop — the end matches the beginning perfectly. Great for wallpapers and social media.",
		example: "Rain falling on a window /loop"
	},
	{
		slug: "zoom",
		command: "/zoom",
		description: "Ken Burns slow zoom effect",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 34,
		howToUse: "Adds a slow, cinematic zoom-in or zoom-out to any scene — the classic Ken Burns documentary effect.",
		example: "A painting on a wall /zoom"
	},
	{
		slug: "pan",
		command: "/pan",
		description: "Cinematic horizontal pan",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 35,
		howToUse: "Creates a smooth horizontal camera pan across a scene — sweeping establishing shots.",
		example: "A panoramic mountain range /pan"
	},
	{
		slug: "float",
		command: "/float",
		description: "Objects or elements gently floating",
		worksIn: [
			"Sora",
			"Runway",
			"Pika"
		],
		category: "Video",
		trendingRank: 36,
		howToUse: "Makes objects float weightlessly — ethereal, dreamlike, gravity-defying motion.",
		example: "Flowers floating in a room /float"
	},
	{
		slug: "eli5",
		command: "/eli5",
		description: "Explain like I'm 5 (simple language)",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 37,
		howToUse: "Add /eli5 to any explanation request to get ultra-simple language, everyday analogies, no jargon.",
		example: "/eli5 How does blockchain work?"
	},
	{
		slug: "eli15",
		command: "/eli15",
		description: "Explain like I'm 15 (slightly more detail)",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 38,
		howToUse: "Gets you a balanced explanation — clear enough for a teenager, but with real technical detail.",
		example: "/eli15 How does DNS resolution work?"
	},
	{
		slug: "bullets",
		command: "/bullets",
		description: "Convert any text to bullet points",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 39,
		howToUse: "Paste any block of text and add /bullets to get a clean, scannable bullet-point summary.",
		example: "[paste article] /bullets"
	},
	{
		slug: "tldr",
		command: "/tldr",
		description: "Too long, didn't read — give me the summary",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 40,
		howToUse: "Get a 2-3 sentence summary of any long text. Perfect for articles, reports, and documentation.",
		example: "[paste long article] /tldr"
	},
	{
		slug: "pro",
		command: "/pro",
		description: "Make it professional and formal",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 41,
		howToUse: "Rewrites any text in a formal, professional tone — suitable for business communication and reports.",
		example: "Hey wanna grab coffee sometime? /pro"
	},
	{
		slug: "casual",
		command: "/casual",
		description: "Make it conversational and relaxed",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 42,
		howToUse: "Transforms formal text into a friendly, conversational tone — like talking to a colleague.",
		example: "[paste formal email] /casual"
	},
	{
		slug: "short",
		command: "/short",
		description: "Make it 50% shorter without losing meaning",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 43,
		howToUse: "Halves the word count while preserving all key information. Great for tightening prose.",
		example: "[paste text] /short"
	},
	{
		slug: "long",
		command: "/long",
		description: "Expand and add more depth and detail",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 44,
		howToUse: "Expands a short piece of writing with additional detail, examples, and depth.",
		example: "Machine learning is a subset of AI. /long"
	},
	{
		slug: "tweet",
		command: "/tweet",
		description: "Condense to a tweet (280 chars max)",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 45,
		howToUse: "Boils down any concept or article into a single, punchy tweet — 280 characters or fewer.",
		example: "[paste article] /tweet"
	},
	{
		slug: "thread",
		command: "/thread",
		description: "Convert to a Twitter/X thread format",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 46,
		howToUse: "Breaks any topic into a numbered Twitter thread — each tweet self-contained, hook in the first one.",
		example: "/thread The history of the internet"
	},
	{
		slug: "story",
		command: "/story",
		description: "Turn the information into a narrative story",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 47,
		howToUse: "Transforms dry facts or instructions into an engaging narrative with characters and plot.",
		example: "How photosynthesis works /story"
	},
	{
		slug: "list",
		command: "/list",
		description: "Format as a numbered list",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 48,
		howToUse: "Converts any text into a clean numbered list — perfect for step-by-step instructions and rankings.",
		example: "Tips for better sleep /list"
	},
	{
		slug: "table",
		command: "/table",
		description: "Format as a markdown table",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 49,
		howToUse: "Turns any comparison or structured data into a clean markdown table with headers.",
		example: "Compare React vs Vue vs Angular /table"
	},
	{
		slug: "qa",
		command: "/qa",
		description: "Format as questions and answers",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 50,
		howToUse: "Converts any topic into a Q&A format — great for study guides, FAQs, and interview prep.",
		example: "Machine learning basics /qa"
	},
	{
		slug: "email",
		command: "/email",
		description: "Rewrite as a professional email",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 51,
		howToUse: "Transforms any message into a polished professional email with subject line, greeting, and sign-off.",
		example: "Tell them the project is delayed by 2 weeks /email"
	},
	{
		slug: "headline",
		command: "/headline",
		description: "Generate 5 headline variations",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 52,
		howToUse: "Creates 5 different headline options for any article, post, or piece of content.",
		example: "/headline Article about AI replacing jobs"
	},
	{
		slug: "hook",
		command: "/hook",
		description: "Write an attention-grabbing opening line",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 53,
		howToUse: "Generates a compelling hook — the first sentence that makes readers stop scrolling.",
		example: "/hook Blog post about climate change solutions"
	},
	{
		slug: "cta",
		command: "/cta",
		description: "Add a strong call to action",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 54,
		howToUse: "Adds a persuasive call to action at the end of any text — prompts the reader to take the next step.",
		example: "[paste landing page copy] /cta"
	},
	{
		slug: "translate",
		command: "/translate",
		description: "Translate to any language",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 55,
		howToUse: "Specify the target language after /translate for natural, idiomatic translation (not robotic).",
		example: "/translate to Spanish: How are you today?"
	},
	{
		slug: "formal",
		command: "/formal",
		description: "Make more formal and authoritative",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 56,
		howToUse: "Elevates the register and authority of any text — suitable for reports, academic writing, and proposals.",
		example: "[paste text] /formal"
	},
	{
		slug: "friendly",
		command: "/friendly",
		description: "Make warmer and more approachable",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 57,
		howToUse: "Softens any text to feel more approachable and warm — great for customer-facing content.",
		example: "[paste terms of service] /friendly"
	},
	{
		slug: "persuade",
		command: "/persuade",
		description: "Make it more persuasive and compelling",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 58,
		howToUse: "Adds persuasive techniques — social proof, urgency, emotional appeal, strong reasoning.",
		example: "[paste sales page] /persuade"
	},
	{
		slug: "critique",
		command: "/critique",
		description: "Find weaknesses and criticize constructively",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Writing",
		trendingRank: 59,
		howToUse: "Gets honest, constructive criticism of any writing — what's weak, what's unclear, what's missing.",
		example: "[paste your essay] /critique"
	},
	{
		slug: "explain",
		command: "/explain",
		description: "Explain what this code does, line by line",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 60,
		howToUse: "Paste any code snippet and get a clear, line-by-line explanation of what each part does.",
		example: "[paste code] /explain"
	},
	{
		slug: "fix",
		command: "/fix",
		description: "Find and fix the bug",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 61,
		howToUse: "Paste broken code and get the bug identified with a working fix and explanation.",
		example: "[paste broken code] /fix"
	},
	{
		slug: "refactor",
		command: "/refactor",
		description: "Improve code quality without changing behavior",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 62,
		howToUse: "Takes messy code and restructures it — cleaner names, better patterns, same functionality.",
		example: "[paste code] /refactor"
	},
	{
		slug: "comment",
		command: "/comment",
		description: "Add clear comments to all functions",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 63,
		howToUse: "Adds meaningful comments explaining purpose, parameters, and return values for every function.",
		example: "[paste code] /comment"
	},
	{
		slug: "test",
		command: "/test",
		description: "Write unit tests for this code",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 64,
		howToUse: "Generates comprehensive unit tests covering happy path, edge cases, and error conditions.",
		example: "[paste function] /test"
	},
	{
		slug: "docs",
		command: "/docs",
		description: "Generate documentation for this code",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 65,
		howToUse: "Creates complete documentation — usage examples, parameters, return types, and gotchas.",
		example: "[paste code] /docs"
	},
	{
		slug: "optimize",
		command: "/optimize",
		description: "Make it faster and more efficient",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 66,
		howToUse: "Analyzes code for performance bottlenecks and provides an optimized version with explanations.",
		example: "[paste slow function] /optimize"
	},
	{
		slug: "typescript",
		command: "/typescript",
		description: "Convert JavaScript to TypeScript",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 67,
		howToUse: "Adds proper TypeScript types, interfaces, and type annotations to any JavaScript code.",
		example: "[paste JS code] /typescript"
	},
	{
		slug: "python",
		command: "/python",
		description: "Convert to Python",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 68,
		howToUse: "Converts code from any language to idiomatic Python with proper conventions.",
		example: "[paste JS code] /python"
	},
	{
		slug: "simplify",
		command: "/simplify",
		description: "Simplify the logic, remove complexity",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 69,
		howToUse: "Takes complex code and makes it simpler — fewer branches, clearer flow, less cognitive load.",
		example: "[paste complex code] /simplify"
	},
	{
		slug: "secure",
		command: "/secure",
		description: "Identify security vulnerabilities",
		worksIn: [
			"ChatGPT",
			"Claude",
			"GitHub Copilot"
		],
		category: "Code",
		trendingRank: 70,
		howToUse: "Audits code for security issues — injection flaws, auth bugs, data exposure, and provides fixes.",
		example: "[paste code] /secure"
	},
	{
		slug: "devil",
		command: "/devil",
		description: "Argue the opposite position (devil's advocate)",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 71,
		howToUse: "Presents the strongest arguments against your position — finds flaws in your reasoning.",
		example: "/devil Remote work is more productive than office work"
	},
	{
		slug: "steelman",
		command: "/steelman",
		description: "Give the strongest possible version of this argument",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 72,
		howToUse: "Instead of strawmanning, builds the most charitable, strongest version of an argument.",
		example: "/steelman The case against universal basic income"
	},
	{
		slug: "assumptions",
		command: "/assumptions",
		description: "List all hidden assumptions in this",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 73,
		howToUse: "Uncovers every hidden assumption in a statement, plan, or argument — what are you taking for granted?",
		example: "/assumptions Our startup will reach 10k users in 6 months"
	},
	{
		slug: "risks",
		command: "/risks",
		description: "What could go wrong?",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 74,
		howToUse: "Generates a comprehensive risk assessment — what can fail, how likely, and how bad would it be.",
		example: "/risks Launching a SaaS product with no marketing budget"
	},
	{
		slug: "firstprinciples",
		command: "/firstprinciples",
		description: "Break this down to first principles",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 75,
		howToUse: "Strips away all analogies and assumptions to reason from fundamental truths upward.",
		example: "/firstprinciples Why do we pay for software subscriptions?"
	},
	{
		slug: "socratic",
		command: "/socratic",
		description: "Ask me questions to help me think this through",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 76,
		howToUse: "Instead of answering, asks Socratic questions to guide you to your own insight.",
		example: "/socratic I want to change careers but I'm scared"
	},
	{
		slug: "swot",
		command: "/swot",
		description: "Run a SWOT analysis",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 77,
		howToUse: "Generates a structured SWOT analysis — Strengths, Weaknesses, Opportunities, Threats.",
		example: "/swot Starting a freelance dev business"
	},
	{
		slug: "pros",
		command: "/pros",
		description: "List all the advantages",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 78,
		howToUse: "Generates a comprehensive list of advantages for any decision, idea, or option.",
		example: "/pros Moving to a new city for a job"
	},
	{
		slug: "cons",
		command: "/cons",
		description: "List all the disadvantages",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 79,
		howToUse: "Generates a comprehensive list of disadvantages — be honest about what you'd lose.",
		example: "/cons Moving to a new city for a job"
	},
	{
		slug: "compare",
		command: "/compare",
		description: "Compare X and Y side by side",
		worksIn: [
			"ChatGPT",
			"Claude",
			"Gemini"
		],
		category: "Thinking",
		trendingRank: 80,
		howToUse: "Creates a structured side-by-side comparison with pros, cons, and a recommendation.",
		example: "/compare React vs Svelte for a new project"
	}
];
function getCommandOfWeek() {
	return TRENDING_COMMANDS[Math.floor(Date.now() / 6048e5) % TRENDING_COMMANDS.length];
}
var TABS = [
	"All",
	"Commands",
	"Resources",
	"Generators",
	"Roadmaps",
	"Glossary",
	"Collections"
];
function CopyBtn({ text, className = "" }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copy = (0, import_react.useCallback)(() => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		});
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: (e) => {
			e.stopPropagation();
			copy();
		},
		className: `copy-feedback flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${className}`,
		style: {
			background: copied ? "rgba(63,185,80,0.15)" : "var(--surface-elevated)",
			border: `1px solid ${copied ? "rgba(63,185,80,0.3)" : "var(--border)"}`,
			color: copied ? "#3fb950" : "var(--foreground)"
		},
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied ? "Copied" : "Copy"]
	});
}
function CommandOfTheWeek() {
	const cmd = getCommandOfWeek();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden rounded-xl border border-border bg-surface p-6 sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mb-3 inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block size-2 rounded-full",
							style: { background: CATEGORY_DOT_COLORS[cmd.category] }
						}), "Command of the Week"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl",
						children: cmd.command
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground",
						children: cmd.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: cmd.worksIn.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-[11px] text-muted-foreground",
							children: w
						}, w))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
					text: cmd.command,
					className: "h-9 px-4"
				}), cmd.worksIn[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://chatgpt.com/?q=${encodeURIComponent(cmd.command)}`,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex h-9 items-center gap-1.5 rounded-md bg-primary/15 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/25",
					onClick: (e) => e.stopPropagation(),
					children: ["Try it ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
				})]
			})]
		})
	});
}
function CommandCard({ cmd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2.5 shrink-0 rounded-full",
					style: { background: CATEGORY_DOT_COLORS[cmd.category] }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: cmd.category
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "font-mono text-[20px] font-bold tracking-tight text-foreground",
				children: cmd.command
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground",
				children: cmd.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto flex flex-wrap gap-1 pt-2",
				children: cmd.worksIn.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground",
					children: w
				}, w))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
					text: cmd.command,
					className: "w-full justify-center"
				})
			})
		]
	});
}
function TrendingPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("All");
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("All");
	const topCommands = (0, import_react.useMemo)(() => {
		if (activeCategory === "All") return TRENDING_COMMANDS.slice(0, 12);
		return TRENDING_COMMANDS.filter((c) => c.category === activeCategory).slice(0, 12);
	}, [activeCategory]);
	const popularResources = (0, import_react.useMemo)(() => {
		const apis = resourcesBySection("free-apis");
		const ai = resourcesBySection("ai");
		const tools = resourcesBySection("free-tools");
		return [
			...ai.slice(0, 3),
			...apis.slice(0, 3),
			...tools.slice(0, 2)
		].slice(0, 8);
	}, []);
	const glossarySpotlight = (0, import_react.useMemo)(() => {
		const seed = Math.floor(Date.now() / 6048e5);
		return ALL_GLOSSARY.filter((_, i) => i % 7 === seed % 7).slice(0, 6);
	}, []);
	const showSection = (tab) => activeTab === "All" || activeTab === tab;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Trending",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Trending on SlashAI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "What people are copying, saving and building with right now."
				})]
			}),
			showSection("Commands") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandOfTheWeek, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-30 -mx-4 mt-4 overflow-x-auto border-b border-border bg-background/90 px-4 pb-2 pt-2 backdrop-blur-md scrollbar-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab(tab),
						className: "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150",
						style: {
							borderColor: activeTab === tab ? "rgba(88,166,255,0.4)" : "var(--border)",
							background: activeTab === tab ? "rgba(88,166,255,0.15)" : "var(--surface-elevated)",
							color: activeTab === tab ? "var(--primary)" : "var(--muted-foreground)"
						},
						children: tab
					}, tab))
				})
			}),
			showSection("Commands") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
							children: "Trending /commands"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trending",
							className: "text-xs font-medium text-primary hover:underline",
							children: "See all →"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveCategory("All"),
							className: "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150",
							style: {
								borderColor: activeCategory === "All" ? "rgba(88,166,255,0.4)" : "var(--border)",
								background: activeCategory === "All" ? "rgba(88,166,255,0.15)" : "var(--surface-elevated)",
								color: activeCategory === "All" ? "var(--primary)" : "var(--muted-foreground)"
							},
							children: [
								"All (",
								TRENDING_COMMANDS.length,
								")"
							]
						}), ALL_CATEGORIES.map((cat) => {
							const count = TRENDING_COMMANDS.filter((c) => c.category === cat).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveCategory(cat),
								className: "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150",
								style: {
									borderColor: activeCategory === cat ? "rgba(88,166,255,0.4)" : "var(--border)",
									background: activeCategory === cat ? "rgba(88,166,255,0.15)" : "var(--surface-elevated)",
									color: activeCategory === cat ? "var(--primary)" : "var(--muted-foreground)"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2 rounded-full",
										style: { background: CATEGORY_DOT_COLORS[cat] }
									}),
									cat,
									" (",
									count,
									")"
								]
							}, cat);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: topCommands.map((cmd) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandCard, { cmd }, cmd.slug))
					})
				]
			}),
			showSection("Resources") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Trending Resources"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						className: "text-xs font-medium text-primary hover:underline",
						children: "See all resources →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-col gap-2",
					children: popularResources.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCardEnhanced, { resource: r }, r.id))
				})]
			}),
			showSection("Generators") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Founder Generators"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/generators",
						className: "text-xs font-medium text-primary hover:underline",
						children: "Use a generator →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5",
					children: GENERATORS.slice(0, 10).map((gen) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/generators/$id",
						params: { id: gen.id },
						className: "group flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[24px]",
								children: gen.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[14px] font-semibold text-foreground group-hover:text-primary",
								children: gen.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 line-clamp-1 text-[12px] text-muted-foreground",
								children: gen.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-auto pt-3 inline-flex h-8 items-center justify-center rounded-md border text-[11px] font-medium transition-colors",
								style: {
									borderColor: "#58a6ff40",
									color: "var(--primary)"
								},
								children: "Use →"
							})
						]
					}, gen.id))
				})]
			}),
			showSection("Roadmaps") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Founder Roadmaps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/roadmaps",
						className: "text-xs font-medium text-primary hover:underline",
						children: "See all roadmaps →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
					children: ALL_ROADMAPS.slice(0, 6).map((rm) => {
						const totalSteps = rm.phases.reduce((sum, p) => sum + p.steps.length, 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/roadmaps",
							className: "group flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[15px] font-semibold text-foreground group-hover:text-primary",
									children: rm.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-[12px] text-muted-foreground",
									children: rm.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[12px] text-muted-foreground",
									children: [
										totalSteps,
										" steps · ",
										rm.phases.length,
										" phases · ",
										rm.duration
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-3 inline-flex h-9 items-center justify-center rounded-md border text-[12px] font-medium transition-colors",
									style: {
										borderColor: "#58a6ff40",
										color: "var(--primary)"
									},
									children: "Follow →"
								})
							]
						}, rm.id);
					})
				})]
			}),
			showSection("Glossary") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Glossary Spotlight"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/glossary",
						className: "text-xs font-medium text-primary hover:underline",
						children: [
							"Explore all ",
							ALL_GLOSSARY.length,
							" terms →"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
					children: glossarySpotlight.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/glossary",
						className: "group rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-[16px] font-bold text-primary",
								children: term.term
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11px] text-muted-foreground",
								children: term.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 line-clamp-2 text-[12px] text-muted-foreground",
								children: term.def
							})
						]
					}, term.term))
				})]
			}),
			showSection("Collections") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Popular Collections"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/collections",
						className: "text-xs font-medium text-primary hover:underline",
						children: "See all collections →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: COLLECTIONS.slice(0, 6).map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/collections/$id",
						params: { id: col.id },
						className: "flex items-center gap-2 rounded-md border bg-surface-elevated px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/25",
						style: { borderColor: "var(--border)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[18px]",
								children: col.icon
							}),
							col.title,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 rounded bg-border px-1.5 py-0.5 text-[10px] text-muted-foreground",
								children: col.count
							})
						]
					}, col.id))
				})]
			}),
			showSection("All") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "From the Live Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/live",
						className: "text-xs font-medium text-primary hover:underline",
						children: "Open Live Dashboard →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4",
					children: [
						{
							label: "NIFTY 50",
							value: "Loading…",
							color: "#3fb950"
						},
						{
							label: "BTC/INR",
							value: "Loading…",
							color: "#f0b90b"
						},
						{
							label: "Next Prayer",
							value: "Fajr",
							color: "var(--primary)"
						},
						{
							label: "Weather",
							value: "Hyderabad",
							color: "#d29922"
						}
					].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[10px] border border-border bg-surface p-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[20px] font-bold",
							style: { color: stat.color },
							children: stat.value
						})]
					}, stat.label))
				})]
			})
		]
	});
}
//#endregion
export { TrendingPage as component };
