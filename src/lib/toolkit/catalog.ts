/**
 * The declarative toolkit catalogue.
 *
 * Every entry is a real, working tool: it names an operation from ./ops plus
 * any options the UI should expose. There are no permutations here — each tool
 * does one genuinely distinct job, and the copy says exactly what it does.
 */

export interface ToolOption {
  key: string;
  label: string;
  /** [value, label] pairs — the first entry is the default */
  values: [string, string][];
}

export interface DeclarativeTool {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  section: ToolSection;
  op: string;
  options?: ToolOption[];
  placeholder?: string;
  sample?: string;
  /** no input box — the tool just generates something on demand */
  noInput?: boolean;
}

export type ToolSection =
  | "Text & Writing"
  | "Data & Code"
  | "Encoding & Security"
  | "Colour & Design"
  | "Dates & Time"
  | "Web & SEO"
  | "Generators";

export const TOOL_SECTION_ORDER: { title: ToolSection; icon: string; blurb: string }[] = [
  { title: "Text & Writing", icon: "✍️", blurb: "Clean, reshape and analyse any text" },
  { title: "Data & Code", icon: "🧱", blurb: "JSON, CSV, regex, diffs and hashes" },
  { title: "Encoding & Security", icon: "🔐", blurb: "Encode, decode and pull data out of text" },
  { title: "Colour & Design", icon: "🎨", blurb: "Convert colours and generate CSS" },
  { title: "Dates & Time", icon: "🗓️", blurb: "Timestamps, durations and week numbers" },
  { title: "Web & SEO", icon: "🌐", blurb: "Meta tags, sitemaps and URL anatomy" },
  { title: "Generators", icon: "🎲", blurb: "IDs, passwords and placeholder copy" },
];

const SAMPLE_TEXT = `SlashAI keeps every tool in your browser.

Nothing is uploaded, nothing is tracked, and no account is needed. Paste text here and the tool works on it instantly — even with no connection.`;

const SAMPLE_LINES = `banana
apple
cherry
apple
date`;

const SAMPLE_JSON = `{"name":"SlashAI","tools":128,"free":true,"tags":["browser","offline"]}`;

export const DECLARATIVE_TOOLS: DeclarativeTool[] = [
  /* ── Text & Writing ──────────────────────────────────────────────── */
  { slug: "uppercase", name: "Uppercase", desc: "Turn any text into capital letters", icon: "🔠", section: "Text & Writing", op: "upper", sample: SAMPLE_TEXT },
  { slug: "lowercase", name: "Lowercase", desc: "Turn any text into small letters", icon: "🔡", section: "Text & Writing", op: "lower", sample: SAMPLE_TEXT },
  { slug: "title-case", name: "Title Case", desc: "Capitalise the first letter of every word", icon: "🔤", section: "Text & Writing", op: "titleCase", sample: "the quick brown fox jumps" },
  { slug: "sentence-case", name: "Sentence Case", desc: "Capitalise sentences and lower the rest", icon: "📝", section: "Text & Writing", op: "sentenceCase", sample: "THIS IS A SENTENCE. AND ANOTHER ONE." },
  { slug: "camel-case", name: "camelCase Converter", desc: "Turn any phrase into camelCase identifiers", icon: "🐫", section: "Text & Writing", op: "camelCase", sample: "user profile image url" },
  { slug: "pascal-case", name: "PascalCase Converter", desc: "Turn any phrase into PascalCase types", icon: "🏛️", section: "Text & Writing", op: "pascalCase", sample: "user profile image url" },
  { slug: "snake-case", name: "snake_case Converter", desc: "Turn any phrase into snake_case", icon: "🐍", section: "Text & Writing", op: "snakeCase", sample: "User Profile Image URL" },
  { slug: "kebab-case", name: "kebab-case Converter", desc: "Turn any phrase into kebab-case", icon: "🍢", section: "Text & Writing", op: "kebabCase", sample: "User Profile Image URL" },
  { slug: "constant-case", name: "CONSTANT_CASE Converter", desc: "Turn any phrase into CONSTANT_CASE", icon: "🔩", section: "Text & Writing", op: "constantCase", sample: "max retry count" },
  { slug: "dot-case", name: "dot.case Converter", desc: "Turn any phrase into dot.case", icon: "🔘", section: "Text & Writing", op: "dotCase", sample: "Theme Colour Primary" },
  { slug: "alternating-case", name: "aLtErNaTiNg CaSe", desc: "Meme-style alternating capitals", icon: "🔀", section: "Text & Writing", op: "alternatingCase", sample: "this is serious" },
  { slug: "inverse-case", name: "Invert Case", desc: "Swap every letter's case", icon: "🔄", section: "Text & Writing", op: "inverseCase", sample: "Hello World" },
  { slug: "text-to-slug", name: "Text to Slug", desc: "URL-safe slug from any heading", icon: "🔗", section: "Text & Writing", op: "slugify", sample: "10 Best Free Tools (2026 Edition!)" },

  { slug: "word-counter", name: "Word Counter", desc: "Words, characters, sentences and paragraphs at once", icon: "🔢", section: "Text & Writing", op: "wordCount", sample: SAMPLE_TEXT },
  { slug: "character-counter", name: "Character Counter", desc: "Characters with and without spaces, plus lines", icon: "🔡", section: "Text & Writing", op: "charCount", sample: SAMPLE_TEXT },
  { slug: "reading-time", name: "Reading Time", desc: "How long this text takes to read and to speak", icon: "⏱️", section: "Text & Writing", op: "readingTime", sample: SAMPLE_TEXT },
  { slug: "character-frequency", name: "Character Frequency", desc: "Count every character used in the text", icon: "🔬", section: "Text & Writing", op: "charFrequency", sample: SAMPLE_TEXT },
  { slug: "readability-score", name: "Readability Score", desc: "Flesch Reading Ease and grade level", icon: "📖", section: "Text & Writing", op: "readability", sample: SAMPLE_TEXT },
  { slug: "longest-words", name: "Longest Words", desc: "Rank the longest distinct words in a text", icon: "📏", section: "Text & Writing", op: "longestWords", sample: SAMPLE_TEXT },

  { slug: "collapse-spaces", name: "Collapse Spaces", desc: "Squash repeated spaces and tabs into one", icon: "⬜", section: "Text & Writing", op: "collapseSpaces", sample: "Too    many    spaces here" },
  { slug: "remove-line-breaks", name: "Remove Line Breaks", desc: "Join wrapped lines back into one paragraph", icon: "↩️", section: "Text & Writing", op: "removeLineBreaks", sample: SAMPLE_TEXT },
  { slug: "remove-empty-lines", name: "Remove Empty Lines", desc: "Delete blank lines from any pasted text", icon: "🧹", section: "Text & Writing", op: "removeEmptyLines", sample: "one\n\n\ntwo\n\n three" },
  { slug: "trim-lines", name: "Trim Each Line", desc: "Strip leading and trailing whitespace per line", icon: "✂️", section: "Text & Writing", op: "trimLines", sample: "   indented line\n      another" },
  { slug: "dedupe-lines", name: "Remove Duplicate Lines", desc: "Keep one copy of every repeated line", icon: "♻️", section: "Text & Writing", op: "dedupeLines", sample: SAMPLE_LINES },
  { slug: "dedupe-words", name: "Remove Duplicate Words", desc: "Keep the first use of each word only", icon: "🫧", section: "Text & Writing", op: "dedupeWords", sample: "red blue red green blue" },
  { slug: "strip-punctuation", name: "Strip Punctuation", desc: "Remove punctuation and keep the words", icon: "🚫", section: "Text & Writing", op: "stripPunctuation", sample: "Hello, world! Isn't this (great)?" },
  { slug: "strip-numbers", name: "Strip Numbers", desc: "Remove every digit from the text", icon: "🔢", section: "Text & Writing", op: "stripNumbers", sample: "Order 1234 shipped 21 Sep 2026" },
  { slug: "strip-html", name: "Strip HTML Tags", desc: "Turn HTML markup into clean plain text", icon: "🏷️", section: "Text & Writing", op: "stripHtml", sample: "<p>Hello <b>world</b> &amp; friends</p>" },
  { slug: "strip-urls", name: "Strip URLs", desc: "Remove every link from the text", icon: "🔗", section: "Text & Writing", op: "stripUrls", sample: "Read https://slashai.in and http://example.com now" },
  { slug: "strip-emoji", name: "Strip Emoji", desc: "Remove emoji from any text", icon: "😶", section: "Text & Writing", op: "stripEmoji", sample: "Great work 🎉🔥 keep going 🚀" },
  { slug: "remove-accents", name: "Remove Accents", desc: "Fold accented letters to plain ASCII", icon: "à", section: "Text & Writing", op: "removeAccents", sample: "Café naïve résumé piñata" },

  { slug: "reverse-text", name: "Reverse Text", desc: "Flip the whole string backwards", icon: "↔️", section: "Text & Writing", op: "reverseText", sample: SAMPLE_TEXT },
  { slug: "reverse-words", name: "Reverse Word Order", desc: "Keep the words, flip the order", icon: "🔃", section: "Text & Writing", op: "reverseWords", sample: "one two three four" },
  { slug: "reverse-lines", name: "Reverse Lines", desc: "Flip the order of the lines", icon: "⬆️", section: "Text & Writing", op: "reverseLines", sample: SAMPLE_LINES },
  { slug: "shuffle-lines", name: "Shuffle Lines", desc: "Randomise the order of lines", icon: "🎲", section: "Text & Writing", op: "shuffleLines", sample: SAMPLE_LINES },
  { slug: "sort-lines", name: "Sort Lines A to Z", desc: "Alphabetical line sort", icon: "🔤", section: "Text & Writing", op: "sortLinesAsc", sample: SAMPLE_LINES },
  { slug: "sort-lines-desc", name: "Sort Lines Z to A", desc: "Reverse alphabetical line sort", icon: "🔡", section: "Text & Writing", op: "sortLinesDesc", sample: SAMPLE_LINES },
  { slug: "sort-lines-by-length", name: "Sort Lines by Length", desc: "Shortest line first", icon: "📐", section: "Text & Writing", op: "sortByLength", sample: SAMPLE_LINES },
  { slug: "number-lines", name: "Number Lines", desc: "Add line numbers to any list", icon: "🔢", section: "Text & Writing", op: "numberLines", sample: SAMPLE_LINES },
  { slug: "bullet-list", name: "Add Bullet Points", desc: "Turn plain lines into a bullet list", icon: "•", section: "Text & Writing", op: "bulletLines", sample: SAMPLE_LINES },
  { slug: "indent-text", name: "Indent Text", desc: "Add four spaces to the start of every line", icon: "⇥", section: "Text & Writing", op: "indentLines", sample: SAMPLE_LINES },
  {
    slug: "wrap-text", name: "Wrap Text", desc: "Hard-wrap paragraphs at a chosen column", icon: "📄", section: "Text & Writing", op: "wrapText", sample: SAMPLE_TEXT,
    options: [{ key: "width", label: "Wrap at column", values: [["72", "72 columns"], ["80", "80 columns"], ["100", "100 columns"], ["120", "120 columns"]] }],
  },
  {
    slug: "truncate-text", name: "Truncate Text", desc: "Cut text to a length with an ellipsis", icon: "✂️", section: "Text & Writing", op: "truncate", sample: SAMPLE_TEXT,
    options: [{ key: "length", label: "Maximum length", values: [["80", "80 characters"], ["120", "120 characters"], ["160", "160 characters"], ["280", "280 characters"]] }],
  },
  { slug: "initials", name: "Name Initials", desc: "First letter of every word", icon: "🅰️", section: "Text & Writing", op: "initials", sample: "Waseem Ahmed Khan" },
  { slug: "acronym", name: "Build an Acronym", desc: "Acronym from a phrase, skipping filler words", icon: "🏷️", section: "Text & Writing", op: "acronym", sample: "application programming interface" },

  /* ── Data & Code ─────────────────────────────────────────────────── */
  { slug: "json-minifier", name: "JSON Minifier", desc: "Strip all whitespace from JSON", icon: "🗜️", section: "Data & Code", op: "jsonMinify", sample: SAMPLE_JSON },
  { slug: "json-validator", name: "JSON Validator", desc: "Check JSON and report its shape and size", icon: "✅", section: "Data & Code", op: "jsonValidate", sample: SAMPLE_JSON },
  { slug: "json-sort-keys", name: "Sort JSON Keys", desc: "Alphabetise every key, recursively", icon: "🔤", section: "Data & Code", op: "jsonSortKeys", sample: SAMPLE_JSON },
  { slug: "json-flatten", name: "Flatten JSON", desc: "Collapse nested objects into dotted keys", icon: "🫓", section: "Data & Code", op: "jsonFlatten", sample: '{"a":{"b":{"c":1}}}' },
  { slug: "json-escape", name: "Escape JSON String", desc: "Turn text into a JSON-safe string literal", icon: "🔐", section: "Data & Code", op: "jsonEscape", sample: 'He said "hi"\nthen left' },
  { slug: "json-unescape", name: "Unescape JSON String", desc: "Turn an escaped literal back into text", icon: "🔓", section: "Data & Code", op: "jsonUnescape", sample: '"He said \\"hi\\"\\nthen left"' },
  { slug: "json-to-csv", name: "JSON to CSV", desc: "Flatten an array of objects into CSV", icon: "📊", section: "Data & Code", op: "jsonToCsv", sample: '[{"name":"A","score":9},{"name":"B","score":7}]' },
  {
    slug: "json-to-typescript", name: "JSON to TypeScript", desc: "Generate interfaces from a JSON sample", icon: "🟦", section: "Data & Code", op: "jsonToTypes", sample: SAMPLE_JSON,
    options: [{ key: "name", label: "Type name", values: [["Root", "Root"], ["ApiResponse", "ApiResponse"], ["Payload", "Payload"]] }],
  },
  {
    slug: "json-to-sql", name: "JSON to SQL Inserts", desc: "Turn an array of objects into INSERT statements", icon: "🗄️", section: "Data & Code", op: "jsonToSql", sample: '[{"name":"A","score":9}]',
    options: [{ key: "table", label: "Table name", values: [["my_table", "my_table"], ["users", "users"], ["orders", "orders"]] }],
  },
  { slug: "csv-to-markdown", name: "CSV to Markdown Table", desc: "Paste CSV, get a Markdown table", icon: "📋", section: "Data & Code", op: "csvToMarkdown", sample: "name,score\nA,9\nB,7" },
  { slug: "csv-transpose", name: "Transpose CSV", desc: "Swap the rows and columns", icon: "🔁", section: "Data & Code", op: "csvTranspose", sample: "a,b,c\n1,2,3" },
  {
    slug: "regex-tester", name: "Regex Tester", desc: "Run a pattern and list every match with groups", icon: "🧩", section: "Data & Code", op: "regexTest", sample: "Order A-1234 and B-9999 shipped",
    options: [
      { key: "pattern", label: "Pattern", values: [["[A-Z]-\\d{4}", "[A-Z]-\\d{4}"], ["\\d+", "\\d+"], ["[a-z]+", "[a-z]+"], ["[\\w.]+@[\\w.]+", "email"]] },
      { key: "flags", label: "Flags", values: [["g", "global"], ["gi", "global + ignore case"], ["gm", "global + multiline"]] },
    ],
  },
  { slug: "regex-escaper", name: "Escape Regex", desc: "Make a literal string safe inside a pattern", icon: "🛡️", section: "Data & Code", op: "regexEscape", sample: "price is $9.99 (approx)" },
  {
    slug: "regex-extractor", name: "Regex Extractor", desc: "Pull every distinct match out of a text", icon: "🎣", section: "Data & Code", op: "regexExtract", sample: "A-1234 B-9999 C-0001",
    options: [{ key: "pattern", label: "Pattern", values: [["[A-Z]-\\d{4}", "[A-Z]-\\d{4}"], ["\\d+", "numbers"], ["#\\w+", "hashtags"], ["https?://\\S+", "links"]] }],
  },
  { slug: "text-diff", name: "Text Diff", desc: "Line-by-line comparison of two versions", icon: "🔀", section: "Data & Code", op: "diffLines", placeholder: "first version\n---\nsecond version", sample: "hello\nworld\n---\nhello\nthere" },
  { slug: "edit-distance", name: "Edit Distance", desc: "Levenshtein distance between two strings", icon: "📐", section: "Data & Code", op: "levenshtein", placeholder: "first string\n---\nsecond string", sample: "kitten\n---\nsitting" },
  { slug: "palindrome-checker", name: "Palindrome Checker", desc: "Does this read the same both ways?", icon: "🪞", section: "Data & Code", op: "palindromeCheck", sample: "A man, a plan, a canal: Panama" },
  { slug: "anagram-checker", name: "Anagram Checker", desc: "Do two strings share exactly the same letters?", icon: "🔤", section: "Data & Code", op: "anagramCheck", placeholder: "first word\n---\nsecond word", sample: "listen\n---\nsilent" },
  { slug: "sha1-hash", name: "SHA-1 Hash", desc: "SHA-1 digest of any text, as hex", icon: "🔏", section: "Data & Code", op: "hash", sample: "slashai", options: [{ key: "algo", label: "Algorithm", values: [["SHA-1", "SHA-1"]] }] },
  { slug: "sha256-hash", name: "SHA-256 Hash", desc: "SHA-256 digest of any text, as hex", icon: "🔐", section: "Data & Code", op: "hash", sample: "slashai", options: [{ key: "algo", label: "Algorithm", values: [["SHA-256", "SHA-256"]] }] },
  { slug: "sha384-hash", name: "SHA-384 Hash", desc: "SHA-384 digest of any text, as hex", icon: "🔐", section: "Data & Code", op: "hash", sample: "slashai", options: [{ key: "algo", label: "Algorithm", values: [["SHA-384", "SHA-384"]] }] },
  { slug: "sha512-hash", name: "SHA-512 Hash", desc: "SHA-512 digest of any text, as hex", icon: "🔐", section: "Data & Code", op: "hash", sample: "slashai", options: [{ key: "algo", label: "Algorithm", values: [["SHA-512", "SHA-512"]] }] },
  { slug: "markdown-table-maker", name: "Markdown Table Maker", desc: "Paste rows, get a ready Markdown table", icon: "📋", section: "Data & Code", op: "markdownTable", sample: "name,score\nA,9\nB,7" },

  /* ── Encoding & Security ─────────────────────────────────────────── */
  { slug: "base64-encode", name: "Base64 Encode", desc: "Encode text to Base64, UTF-8 safe", icon: "🔒", section: "Encoding & Security", op: "base64Encode", sample: "SlashAI is free forever" },
  { slug: "base64-decode", name: "Base64 Decode", desc: "Decode Base64 back to readable text", icon: "🔓", section: "Encoding & Security", op: "base64Decode", sample: "U2xhc2hBSSBpcyBmcmVlIGZvcmV2ZXI=" },
  { slug: "url-encode", name: "URL Encode", desc: "Percent-encode text for a query string", icon: "🔗", section: "Encoding & Security", op: "urlEncode", sample: "search terms & symbols?" },
  { slug: "url-decode", name: "URL Decode", desc: "Turn percent-encoding back into text", icon: "🧷", section: "Encoding & Security", op: "urlDecode", sample: "search%20terms%20%26%20symbols%3F" },
  { slug: "html-escape", name: "HTML Escape", desc: "Make text safe to drop into HTML", icon: "🏷️", section: "Encoding & Security", op: "htmlEscape", sample: '<a href="x">Tom & Jerry\'s</a>' },
  { slug: "html-unescape", name: "HTML Unescape", desc: "Turn entities back into real characters", icon: "🔓", section: "Encoding & Security", op: "htmlUnescape", sample: "Tom &amp; Jerry&#39;s &lt;b&gt;tag&lt;/b&gt;" },
  { slug: "hex-encode", name: "Text to Hex", desc: "Convert text to space-separated hex bytes", icon: "🔢", section: "Encoding & Security", op: "hexEncode", sample: "SlashAI" },
  { slug: "hex-decode", name: "Hex to Text", desc: "Convert hex bytes back into text", icon: "🔡", section: "Encoding & Security", op: "hexDecode", sample: "53 6c 61 73 68 41 49" },
  { slug: "binary-encode", name: "Text to Binary", desc: "Convert text to 8-bit binary", icon: "💾", section: "Encoding & Security", op: "binaryEncode", sample: "Hi" },
  { slug: "binary-decode", name: "Binary to Text", desc: "Decode 8-bit binary back into text", icon: "💽", section: "Encoding & Security", op: "binaryDecode", sample: "01001000 01101001" },
  { slug: "rot13", name: "ROT13", desc: "The classic 13-place letter rotation", icon: "🌀", section: "Encoding & Security", op: "rot13", sample: "SlashAI keeps it simple" },
  {
    slug: "caesar-cipher", name: "Caesar Cipher", desc: "Shift every letter by a chosen amount", icon: "🏺", section: "Encoding & Security", op: "caesar", sample: "attack at dawn",
    options: [{ key: "shift", label: "Shift", values: [["3", "3"], ["5", "5"], ["13", "13"], ["-3", "−3"]] }],
  },
  { slug: "morse-encode", name: "Text to Morse", desc: "Encode text into Morse code", icon: "📡", section: "Encoding & Security", op: "morseEncode", sample: "sos help" },
  { slug: "morse-decode", name: "Morse to Text", desc: "Decode Morse back into text", icon: "📻", section: "Encoding & Security", op: "morseDecode", sample: "... --- ... / .... . .-.. .--." },
  { slug: "unicode-escape", name: "Unicode Escape", desc: "Escape non-ASCII characters as \\uXXXX", icon: "🔣", section: "Encoding & Security", op: "unicodeEscape", sample: "नमस्ते — café" },
  { slug: "unicode-unescape", name: "Unicode Unescape", desc: "Turn \\uXXXX escapes back into characters", icon: "🌍", section: "Encoding & Security", op: "unicodeUnescape", sample: "\\u0928\\u092e" },
  { slug: "ascii-codes", name: "Character Codes", desc: "Show the ASCII/Unicode number of every character", icon: "🔢", section: "Encoding & Security", op: "asciiCodes", sample: "SlashAI" },

  { slug: "extract-emails", name: "Extract Emails", desc: "Pull every distinct email address out of text", icon: "📧", section: "Encoding & Security", op: "extractEmails", sample: "Write to hi@slashai.in or sales@example.co.uk" },
  { slug: "extract-links", name: "Extract Links", desc: "Pull every URL out of text", icon: "🔗", section: "Encoding & Security", op: "extractUrls", sample: "See https://slashai.in and http://example.com/x" },
  { slug: "extract-domains", name: "Extract Domains", desc: "Pull just the hostnames from a pile of URLs", icon: "🌐", section: "Encoding & Security", op: "extractDomains", sample: "https://slashai.in/tools and https://a.b.example.com/x" },
  { slug: "extract-phone-numbers", name: "Extract Phone Numbers", desc: "Find phone-number patterns in text", icon: "📞", section: "Encoding & Security", op: "extractPhones", sample: "Call +91 98765 43210 or (555) 123-4567" },
  { slug: "extract-numbers", name: "Extract Numbers", desc: "Pull every number out of text, one per line", icon: "🔢", section: "Encoding & Security", op: "extractNumbers", sample: "3 apples cost 47.50 on day 12" },
  { slug: "extract-hashtags", name: "Extract Hashtags", desc: "Collect distinct hashtags from a caption", icon: "#️⃣", section: "Encoding & Security", op: "extractHashtags", sample: "New drop #vibes #reels #vibes" },
  { slug: "extract-mentions", name: "Extract Mentions", desc: "Collect distinct @mentions from text", icon: "📣", section: "Encoding & Security", op: "extractMentions", sample: "thanks @waseem and @slashai" },
  { slug: "extract-hex-colors", name: "Extract Hex Colours", desc: "Find every hex colour code in a file", icon: "🎨", section: "Encoding & Security", op: "extractHexColors", sample: "brand #2dd4bf, ink #0a0d12, accent #FFF" },
  { slug: "extract-ip-addresses", name: "Extract IP Addresses", desc: "Find IPv4 addresses in a log or text", icon: "🖧", section: "Encoding & Security", op: "extractIps", sample: "from 192.168.0.4 to 10.0.0.7" },
  { slug: "extract-dates", name: "Extract Dates", desc: "Find dates written in common formats", icon: "🗓️", section: "Encoding & Security", op: "extractDates", sample: "signed 2026-09-21, renewed 12/03/2027" },

  /* ── Colour & Design ─────────────────────────────────────────────── */
  {
    slug: "colour-to-hex", name: "Colour to HEX", desc: "Convert RGB or HSL into a hex code", icon: "🎨", section: "Colour & Design", op: "colorConvert", sample: "rgb(45, 212, 191)",
    options: [{ key: "to", label: "Output", values: [["hex", "HEX"]] }],
  },
  {
    slug: "colour-to-rgb", name: "Colour to RGB", desc: "Convert a hex or HSL colour into rgb()", icon: "🟥", section: "Colour & Design", op: "colorConvert", sample: "#2dd4bf",
    options: [{ key: "to", label: "Output", values: [["rgb", "RGB"]] }],
  },
  {
    slug: "colour-to-hsl", name: "Colour to HSL", desc: "Convert a hex or RGB colour into hsl()", icon: "🌈", section: "Colour & Design", op: "colorConvert", sample: "#2dd4bf",
    options: [{ key: "to", label: "Output", values: [["hsl", "HSL"]] }],
  },
  { slug: "colour-details", name: "Colour Breakdown", desc: "Every format at once, plus luminance", icon: "🔍", section: "Colour & Design", op: "colorConvert", sample: "#2dd4bf" },
  { slug: "contrast-checker", name: "Contrast Checker", desc: "WCAG ratio for text on a background", icon: "⚖️", section: "Colour & Design", op: "colorContrast", placeholder: "foreground colour\n---\nbackground colour", sample: "#0a0d12\n---\n#2dd4bf" },
  { slug: "colour-shades", name: "Colour Tints", desc: "Progressively lighter steps from one colour", icon: "🪜", section: "Colour & Design", op: "colorShades", sample: "#2dd4bf" },
  { slug: "colour-harmony", name: "Colour Harmony", desc: "Complement, analogue, triad and tetrad sets", icon: "🎡", section: "Colour & Design", op: "colorHarmony", sample: "#2dd4bf" },
  {
    slug: "colour-palette-from-colour", name: "Palette from a Colour", desc: "Build a full palette around one seed colour", icon: "🖌️", section: "Colour & Design", op: "colorPalette", sample: "#2dd4bf",
    options: [{ key: "count", label: "Colours", values: [["5", "5"], ["6", "6"], ["8", "8"]] }],
  },
  {
    slug: "css-box-shadow", name: "Box Shadow Generator", desc: "Dial in a shadow and copy the CSS", icon: "🪟", section: "Colour & Design", op: "cssBoxShadow", sample: "#00000033",
    options: [
      { key: "x", label: "X offset", values: [["0", "0"], ["2", "2"], ["4", "4"], ["8", "8"]] },
      { key: "y", label: "Y offset", values: [["8", "8"], ["12", "12"], ["16", "16"], ["4", "4"]] },
      { key: "blur", label: "Blur", values: [["24", "24"], ["32", "32"], ["48", "48"], ["12", "12"]] },
      { key: "spread", label: "Spread", values: [["-6", "−6"], ["0", "0"], ["-12", "−12"]] },
    ],
  },
  {
    slug: "css-border-radius", name: "Border Radius Generator", desc: "Rounded, pill and blob radii in one snippet", icon: "⭕", section: "Colour & Design", op: "cssBorderRadius", sample: "",
    options: [{ key: "radius", label: "Radius", values: [["8", "8px"], ["12", "12px"], ["16", "16px"], ["24", "24px"]] }],
  },
  {
    slug: "css-gradient", name: "CSS Gradient", desc: "Linear gradient from two colours", icon: "🌅", section: "Colour & Design", op: "cssGradient", placeholder: "from colour\n---\nto colour", sample: "#2dd4bf\n---\n#a78bfa",
    options: [{ key: "angle", label: "Angle", values: [["135", "135deg"], ["90", "90deg"], ["180", "180deg"], ["45", "45deg"]] }],
  },
  {
    slug: "css-glassmorphism", name: "Glassmorphism CSS", desc: "Frosted-glass panel background and blur", icon: "🧊", section: "Colour & Design", op: "cssGlass", sample: "",
    options: [
      { key: "blur", label: "Blur", values: [["14", "14px"], ["8", "8px"], ["24", "24px"]] },
      { key: "alpha", label: "Tint", values: [["0.12", "12%"], ["0.08", "8%"], ["0.2", "20%"]] },
    ],
  },
  { slug: "css-clamp", name: "Fluid Font Size", desc: "A clamp() font-size that scales with the viewport", icon: "🔡", section: "Colour & Design", op: "cssClamp", sample: "",
    options: [
      { key: "min", label: "Minimum", values: [["16", "16px"], ["14", "14px"], ["18", "18px"]] },
      { key: "vw", label: "Viewport factor", values: [["2.5", "2.5vw"], ["2", "2vw"], ["3", "3vw"]] },
      { key: "max", label: "Maximum", values: [["32", "32px"], ["28", "28px"], ["40", "40px"]] },
    ],
  },
  {
    slug: "css-flex-row", name: "Flex Row Snippet", desc: "Ready-made flex container CSS", icon: "📐", section: "Colour & Design", op: "cssFlex", sample: "",
    options: [
      { key: "justify", label: "Justify", values: [["center", "center"], ["space-between", "space-between"], ["flex-start", "flex-start"]] },
      { key: "align", label: "Align", values: [["center", "center"], ["flex-start", "flex-start"], ["stretch", "stretch"]] },
      { key: "gap", label: "Gap", values: [["1rem", "1rem"], ["0.5rem", "0.5rem"], ["1.5rem", "1.5rem"]] },
    ],
  },

  /* ── Dates & Time ────────────────────────────────────────────────── */
  { slug: "timestamp-to-date", name: "Timestamp to Date", desc: "Read a Unix timestamp as a real date", icon: "⏱️", section: "Dates & Time", op: "timestampToDate", sample: "1790000000" },
  { slug: "date-to-timestamp", name: "Date to Timestamp", desc: "Turn a date into seconds and milliseconds", icon: "🕰️", section: "Dates & Time", op: "dateToTimestamp", sample: "2026-09-21" },
  { slug: "days-between-dates", name: "Days Between Dates", desc: "Days, weeks and weekdays between two dates", icon: "📅", section: "Dates & Time", op: "daysBetween", placeholder: "first date\n---\nsecond date", sample: "2026-01-01\n---\n2026-12-31" },
  {
    slug: "add-days-to-date", name: "Add Days to a Date", desc: "Jump forward or back a number of days", icon: "➡️", section: "Dates & Time", op: "addDays", sample: "2026-09-21",
    options: [{ key: "days", label: "Days", values: [["7", "+7"], ["30", "+30"], ["90", "+90"], ["365", "+365"], ["-30", "−30"]] }],
  },
  { slug: "week-number", name: "Week Number", desc: "ISO week, day of year and quarter", icon: "🗓️", section: "Dates & Time", op: "weekNumber", placeholder: "leave blank for today", sample: "2026-09-21" },

  /* ── Web & SEO ───────────────────────────────────────────────────── */
  {
    slug: "meta-tag-generator", name: "Meta Tag Generator", desc: "Title, description, OG and Twitter tags", icon: "🏷️", section: "Web & SEO", op: "metaTags", placeholder: "Page title\ndescription on the next lines",
    sample: "SlashAI — free AI command vault\nEvery tool and command in your browser, free forever.",
    options: [
      { key: "url", label: "Canonical URL", values: [["https://slashai.in", "https://slashai.in"], ["https://example.com", "https://example.com"]] },
      { key: "image", label: "OG image", values: [["https://slashai.in/og.png", "slashai.in/og.png"], ["https://example.com/og.png", "example.com/og.png"]] },
    ],
  },
  { slug: "robots-txt-builder", name: "robots.txt Builder", desc: "One disallowed path per line", icon: "🤖", section: "Web & SEO", op: "robotsTxt", sample: "/admin\n/api/\n/private" },
  {
    slug: "sitemap-entries", name: "Sitemap URL Entries", desc: "Turn a list of URLs into sitemap <url> blocks", icon: "🗺️", section: "Web & SEO", op: "sitemapEntry", sample: "https://slashai.in/\nhttps://slashai.in/tools",
    options: [
      { key: "priority", label: "Priority", values: [["0.8", "0.8"], ["1.0", "1.0"], ["0.5", "0.5"]] },
      { key: "changefreq", label: "Change frequency", values: [["weekly", "weekly"], ["daily", "daily"], ["monthly", "monthly"]] },
    ],
  },
  { slug: "keyword-density", name: "Keyword Density", desc: "Which words and phrases dominate a page", icon: "🔬", section: "Web & SEO", op: "keywordDensity", sample: SAMPLE_TEXT },
  { slug: "url-parser", name: "URL Parser", desc: "Break a URL into protocol, host, path and params", icon: "🧭", section: "Web & SEO", op: "urlParse", sample: "https://slashai.in/tools?q=json&sort=new#top" },
  { slug: "query-string-parser", name: "Query String Parser", desc: "Read every parameter in a query string", icon: "❓", section: "Web & SEO", op: "queryParse", sample: "?q=json&sort=new&page=2" },
  { slug: "query-string-builder", name: "Query String Builder", desc: "Build a URL query from key=value lines", icon: "🧱", section: "Web & SEO", op: "queryBuild", sample: "q=json tools\nsort=new\npage=2" },

  /* ── Generators ──────────────────────────────────────────────────── */
  {
    slug: "nanoid-generator", name: "Nano ID Generator", desc: "Short URL-safe random IDs", icon: "🔖", section: "Generators", op: "nanoid", noInput: true,
    options: [
      { key: "length", label: "Length", values: [["21", "21 characters"], ["12", "12 characters"], ["16", "16 characters"]] },
      { key: "count", label: "How many", values: [["1", "1"], ["10", "10"]] },
    ],
  },
  {
    slug: "password-generator", name: "Password Generator", desc: "Strong passwords with every character class", icon: "🔑", section: "Generators", op: "password", noInput: true,
    options: [
      { key: "length", label: "Length", values: [["20", "20 characters"], ["16", "16 characters"], ["24", "24 characters"], ["32", "32 characters"]] },
      { key: "count", label: "How many", values: [["1", "1"], ["5", "5"], ["10", "10"]] },
    ],
  },
  {
    slug: "passphrase-generator", name: "Passphrase Generator", desc: "Memorable multi-word passphrases", icon: "🗝️", section: "Generators", op: "passphrase", noInput: true,
    options: [
      { key: "words", label: "Words", values: [["4", "4 words"], ["5", "5 words"], ["6", "6 words"]] },
      { key: "count", label: "How many", values: [["1", "1"], ["5", "5"]] },
    ],
  },
  {
    slug: "random-string-generator", name: "Random String", desc: "Random characters for tokens and salts", icon: "🎲", section: "Generators", op: "randomString", noInput: true,
    options: [
      { key: "length", label: "Length", values: [["32", "32"], ["16", "16"], ["64", "64"]] },
      { key: "charset", label: "Characters", values: [["alnum", "letters + digits"], ["hex", "hex"], ["numeric", "digits"], ["alpha", "letters"]] },
    ],
  },
  {
    slug: "lorem-words", name: "Lorem Ipsum Words", desc: "Placeholder word salad, N words long", icon: "📄", section: "Generators", op: "loremWords", noInput: true,
    options: [{ key: "count", label: "Words", values: [["50", "50"], ["100", "100"], ["25", "25"]] }],
  },
  {
    slug: "lorem-sentences", name: "Lorem Ipsum Sentences", desc: "Placeholder sentences for mockups", icon: "📝", section: "Generators", op: "loremSentences", noInput: true,
    options: [{ key: "count", label: "Sentences", values: [["5", "5"], ["10", "10"], ["3", "3"]] }],
  },
  {
    slug: "lorem-paragraphs", name: "Lorem Ipsum Paragraphs", desc: "Full placeholder paragraphs", icon: "📃", section: "Generators", op: "loremParagraphs", noInput: true,
    options: [{ key: "count", label: "Paragraphs", values: [["3", "3"], ["5", "5"], ["1", "1"]] }],
  },
  {
    slug: "random-number-list", name: "Random Number List", desc: "Random integers in a range you choose", icon: "🔢", section: "Generators", op: "randomNumbers", noInput: true,
    options: [
      { key: "min", label: "Minimum", values: [["1", "1"], ["0", "0"], ["1", "1"]] },
      { key: "max", label: "Maximum", values: [["100", "100"], ["10", "10"], ["1000", "1000"]] },
      { key: "count", label: "How many", values: [["10", "10"], ["25", "25"], ["50", "50"]] },
    ],
  },
  {
    slug: "random-colour-list", name: "Random Colour List", desc: "A handful of usable random colours", icon: "🎨", section: "Generators", op: "randomColor", noInput: true,
    options: [{ key: "count", label: "Colours", values: [["6", "6"], ["10", "10"], ["3", "3"]] }],
  },
];

/** a map for O(1) lookups by slug */
export const TOOL_BY_SLUG = new Map(DECLARATIVE_TOOLS.map((t) => [t.slug, t]));

export const DECLARATIVE_TOOL_COUNT = DECLARATIVE_TOOLS.length;

export function toolsInSection(section: ToolSection): DeclarativeTool[] {
  return DECLARATIVE_TOOLS.filter((t) => t.section === section);
}

export function searchDeclarativeTools(q: string): DeclarativeTool[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return DECLARATIVE_TOOLS.filter((t) =>
    `${t.name} ${t.desc} ${t.section} ${t.slug}`.toLowerCase().includes(needle),
  );
}
