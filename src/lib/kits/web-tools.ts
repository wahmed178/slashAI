/**
 * Curated external web tools — real, free sites worth bookmarking, each with
 * an honest one-line explanation of what it does. Grouped for the /tools
 * directory. Nothing here is a placeholder; every link is a real product.
 */
export interface WebTool {
  name: string;
  url: string;
  what: string;
  group: WebGroup;
  kidsOk?: boolean;
}

export type WebGroup = "Image" | "Text" | "Productivity" | "Developer" | "Generator" | "Fun";

export const WEB_GROUP_META: { id: WebGroup; icon: string; blurb: string }[] = [
  { id: "Image", icon: "🖼️", blurb: "edit, convert and play with pictures" },
  { id: "Text", icon: "📝", blurb: "write, clean and transform words" },
  { id: "Productivity", icon: "⏱️", blurb: "focus, plan and move faster" },
  { id: "Developer", icon: "💻", blurb: "build, debug and ship code" },
  { id: "Generator", icon: "⚙️", blurb: "make something from nothing" },
  { id: "Fun", icon: "🎈", blurb: "pointless — in the best way" },
];

export const WEB_TOOLS: WebTool[] = [
  /* Image */
  { name: "Photopea", url: "https://www.photopea.com", what: "Full Photoshop-style editor that runs in your browser and opens PSD files", group: "Image", kidsOk: true },
  { name: "remove.bg", url: "https://www.remove.bg", what: "Deletes image backgrounds in one click — free at standard quality", group: "Image", kidsOk: true },
  { name: "Squoosh", url: "https://squoosh.app", what: "Google's image compressor: shrink photos with a live before/after slider", group: "Image", kidsOk: true },
  { name: "iLoveIMG", url: "https://www.iloveimg.com", what: "Resize, crop, convert, compress and watermark images in batches", group: "Image", kidsOk: true },
  { name: "Coolors", url: "https://coolors.co", what: "Smash the spacebar to generate colour palettes; lock the ones you love", group: "Image", kidsOk: true },
  { name: "PineTools", url: "https://pinetools.com", what: "A giant toolbox of image fixes: rotate, invert, sharpen, colour-shift", group: "Image", kidsOk: true },
  { name: "uDrag & drop image tools", url: "https://redketchup.io", what: "RedKetchup: 40+ image utilities from resizers to colour pickers", group: "Image", kidsOk: true },

  /* Text */
  { name: "Hemingway Editor", url: "https://hemingwayapp.com", what: "Highlights hard-to-read sentences so you can cut them", group: "Text", kidsOk: true },
  { name: "QuillBot", url: "https://quillbot.com", what: "Paraphrases and summarises text with adjustable tone", group: "Text" },
  { name: "Grammarly Free", url: "https://www.grammarly.com", what: "Catches grammar and spelling slips as you type", group: "Text" },
  { name: "Word Counter", url: "https://wordcounter.net", what: "Counts words, sentences, reading time and keyword density", group: "Text", kidsOk: true },
  { name: "Small SEO Tools", url: "https://smallseotools.com", what: "Dozens of text utilities: plagiarism check, case convert, word count", group: "Text" },
  { name: "Diff Checker", url: "https://www.diffchecker.com", what: "Paste two texts and see exactly what changed", group: "Text", kidsOk: true },

  /* Productivity */
  { name: "Tomato Timer", url: "https://tomato-timer.com", what: "Dead-simple 25/5 pomodoro timer that just works", group: "Productivity", kidsOk: true },
  { name: "Trello", url: "https://trello.com", what: "Kanban boards for planning anything with a team or alone", group: "Productivity", kidsOk: true },
  { name: "Notion", url: "https://www.notion.so", what: "Notes, docs, wikis and databases in one flexible workspace", group: "Productivity" },
  { name: "Google Keep", url: "https://keep.google.com", what: "Fast sticky-note capture that syncs everywhere", group: "Productivity" },
  { name: "Noisli", url: "https://www.noisli.com", what: "Mix rain, café and wind sounds to focus or relax", group: "Productivity", kidsOk: true },
  { name: "Clockify", url: "https://clockify.me", what: "Free time tracker to see where your day actually goes", group: "Productivity" },
  { name: "Calm Soundscapes", url: "https://mynoise.net", what: "Noise generators with sliders — a sound engineer's playground", group: "Productivity", kidsOk: true },

  /* Developer */
  { name: "GitHub Gists", url: "https://gist.github.com", what: "Paste and share code snippets with syntax highlighting", group: "Developer" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", what: "The Q&A universe for every coding error you'll ever meet", group: "Developer" },
  { name: "CodePen", url: "https://codepen.io", what: "Live HTML/CSS/JS playground with a huge community gallery", group: "Developer", kidsOk: true },
  { name: "Regex101", url: "https://regex101.com", what: "Build and test regex with live explanations of every token", group: "Developer" },
  { name: "Can I Use", url: "https://caniuse.com", what: "Check which browsers support any web feature", group: "Developer" },
  { name: "Chrome DevTools Docs", url: "https://developer.chrome.com/docs/devtools", what: "Official guide to the browser's built-in debug superpowers", group: "Developer" },
  { name: "JSON Formatter", url: "https://jsonformatter.org", what: "Pretty-print, validate and minify JSON instantly", group: "Developer" },
  { name: "HTTP Status Dogs", url: "https://httpstatusdogs.com", what: "Every HTTP status code explained with a dog photo — memorable", group: "Developer", kidsOk: true },

  /* Generator */
  { name: "Canva", url: "https://www.canva.com", what: "Templates for posters, resumes, thumbnails — drag and drop", group: "Generator", kidsOk: true },
  { name: "QR Code Monkey", url: "https://www.qrcode-monkey.com", what: "Custom QR codes with logos, colours and high-res exports", group: "Generator", kidsOk: true },
  { name: "Font Awesome", url: "https://fontawesome.com/icons", what: "2,000+ free icons ready to drop into any project", group: "Generator", kidsOk: true },
  { name: "Favicon.io", url: "https://favicon.io", what: "Turns text, emoji or images into favicon packs", group: "Generator", kidsOk: true },
  { name: "Excalidraw", url: "https://excalidraw.com", what: "Hand-drawn style diagrams and whiteboards, shareable links", group: "Generator", kidsOk: true },
  { name: "Logo.dev Play", url: "https://www.logo.dev", what: "Instant brand logos by domain for mockups and directories", group: "Generator" },
  { name: "Unsplash", url: "https://unsplash.com", what: "Free high-res photos you can use anywhere, no attribution", group: "Generator", kidsOk: true },
  { name: "Google Fonts", url: "https://fonts.google.com", what: "Every open font, previewed and downloadable — pair them well", group: "Generator", kidsOk: true },

  /* Fun */
  { name: "The Useless Web", url: "https://theuselessweb.com", what: "One button. Infinite pointless websites. A rite of passage", group: "Fun" },
  { name: "Neal.fun", url: "https://neal.fun", what: "Spend $100B, scroll the deep sea, scale the universe — clever toys", group: "Fun", kidsOk: true },
  { name: "Window Swap", url: "https://window-swap.com", what: "Open a stranger's window somewhere in the world", group: "Fun", kidsOk: true },
  { name: "Radio Garden", url: "https://radio.garden", what: "Spin the globe, tune into live radio anywhere", group: "Fun", kidsOk: true },
  { name: "Quick, Draw!", url: "https://quickdraw.withgoogle.com", what: "AI guesses your doodles in 20 seconds", group: "Fun", kidsOk: true },
  { name: "Patatap", url: "https://patatap.com", what: "Keyboard keys become sounds and animations", group: "Fun", kidsOk: true },
  { name: "This Is Sand", url: "https://thisissand.com", what: "Pour digital sand into calming layered art", group: "Fun", kidsOk: true },
  { name: "Zoom Quilt", url: "https://zoomquilt.org", what: "An artwork that zooms forever and never ends", group: "Fun", kidsOk: true },
  { name: "A Soft Murmur", url: "https://asoftmurmur.com", what: "Rain, waves, fire — mix your own ambient backdrop", group: "Fun", kidsOk: true },
  { name: "GeoGuessr Daily", url: "https://www.geoguessr.com", what: "Guess where on Earth a Street View photo was taken", group: "Fun", kidsOk: true },
  { name: "Cat Bounce", url: "https://catbounce.net", what: "Bouncing cats. Drag them around. That's the whole site", group: "Fun", kidsOk: true },
  { name: "Stars", url: "https://stars.chromeexperiments.com", what: "Fly through 100,000 stars of the Milky Way", group: "Fun", kidsOk: true },
];

export const webToolGroups = (): Record<WebGroup, WebTool[]> => {
  const map = { Image: [], Text: [], Productivity: [], Developer: [], Generator: [], Fun: [] } as Record<WebGroup, WebTool[]>;
  for (const t of WEB_TOOLS) map[t.group].push(t);
  return map;
};
