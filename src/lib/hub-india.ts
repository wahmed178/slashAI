import type { HubResource } from "./hub-founders";

export const INDIA_RESOURCES: HubResource[] = [
  // ── AI Tools for India
  { id: "in1", name: "ChatGPT", url: "https://chat.openai.com", description: "AI assistant that works in Hindi, Tamil, Telugu and 90+ languages.", type: "AI Tool", category: "AI Tools for India", pricing: "Freemium", tags: ["ai", "multilingual", "hindi"], lastVerified: "2026-08-27" },
  { id: "in2", name: "Google Gemini", url: "https://gemini.google.com", description: "Google's AI with strong Indian language support and web-grounded answers.", type: "AI Tool", category: "AI Tools for India", pricing: "Completely Free", tags: ["ai", "google", "india"], lastVerified: "2026-08-27" },
  { id: "in3", name: "Krutrim", url: "https://www.krutrim.com", description: "India's own AI — built for Indian languages and contexts.", type: "AI Tool", category: "AI Tools for India", pricing: "Free Tier", tags: ["ai", "indian", "languages"], lastVerified: "2026-08-27" },

  // ── Indian APIs & Data
  { id: "in4", name: "data.gov.in", url: "https://data.gov.in", description: "Open government data portal — datasets on economy, health, education and more.", type: "API", category: "Indian APIs & Data", pricing: "Completely Free", tags: ["india", "government", "data"], lastVerified: "2026-08-27" },
  { id: "in5", name: "India Post PIN Code API", url: "https://api.postalpincode.in", description: "Free API to look up Indian PIN codes, post offices and locations.", type: "API", category: "Indian APIs & Data", pricing: "Completely Free", tags: ["india", "api", "pincode"], lastVerified: "2026-08-27" },
  { id: "in6", name: "AMFI NAV India", url: "https://www.amfiindia.com", description: "Free mutual fund NAV data for Indian MF investors.", type: "API", category: "Indian APIs & Data", pricing: "Completely Free", tags: ["india", "finance", "mutual-funds"], lastVerified: "2026-08-27" },
  { id: "in7", name: "Razorpay API", url: "https://razorpay.com/docs/api", description: "Payment gateway API documentation — UPI, cards, subscriptions.", type: "API", category: "Indian APIs & Data", pricing: "Freemium", tags: ["india", "payments", "upi"], lastVerified: "2026-08-27" },
  { id: "in8", name: "Aladhan Prayer Times", url: "https://aladhan.com/prayer-times-api", description: "Free prayer times API — works for any Indian city.", type: "API", category: "Indian APIs & Data", pricing: "Completely Free", tags: ["india", "prayer", "islam"], lastVerified: "2026-08-27" },

  // ── Indian Courses & Platforms
  { id: "in9", name: "NPTEL", url: "https://nptel.ac.in", description: "Free IIT courses — programming, electronics, management and more.", type: "Course", category: "Indian Courses", pricing: "Completely Free", tags: ["india", "iit", "course"], lastVerified: "2026-08-27" },
  { id: "in10", name: "SWAYAM", url: "https://swayam.gov.in", description: "Government MOOC platform — free courses from class 9 to post-grad.", type: "Course", category: "Indian Courses", pricing: "Completely Free", tags: ["india", "government", "course"], lastVerified: "2026-08-27" },
  { id: "in11", name: "Khan Academy Hindi", url: "https://hi.khanacademy.org", description: "Math, science and economics in Hindi — completely free.", type: "Course", category: "Indian Courses", pricing: "Completely Free", tags: ["india", "hindi", "math"], lastVerified: "2026-08-27" },
  { id: "in12", name: "freeCodeCamp", url: "https://www.freecodecamp.org", description: "Free coding bootcamp — certificates in web dev, data science and more.", type: "Course", category: "Indian Courses", pricing: "Completely Free", tags: ["india", "coding", "free"], lastVerified: "2026-08-27" },

  // ── YouTube (India)
  { id: "in13", name: "CodeWithHarry", url: "https://www.youtube.com/@CodeWithHarry", description: "Hindi coding tutorials — web dev, Python, DSA for Indian students.", type: "YouTube", category: "YouTube (India)", pricing: "Completely Free", tags: ["india", "hindi", "coding"], lastVerified: "2026-08-27" },
  { id: "in14", name: "Apna College", url: "https://www.youtube.com/@ApnaCollegeOfficial", description: "DSA, web development and placement prep in Hindi.", type: "YouTube", category: "YouTube (India)", pricing: "Completely Free", tags: ["india", "dsa", "placements"], lastVerified: "2026-08-27" },
  { id: "in15", name: "Ankur Warikoo", url: "https://www.youtube.com/@warikoo", description: "Career, startup and life advice for Indian millennials.", type: "YouTube", category: "YouTube (India)", pricing: "Completely Free", tags: ["india", "career", "startup"], lastVerified: "2026-08-27" },
  { id: "in16", name: "Ishan Sharma", url: "https://www.youtube.com/@IshanSharma", description: "AI, tech and startup content for Indian builders.", type: "YouTube", category: "YouTube (India)", pricing: "Completely Free", tags: ["india", "ai", "startup"], lastVerified: "2026-08-27" },
  { id: "in17", name: "Varun Mayya", url: "https://www.youtube.com/@VarunMayya", description: "Startup building, hiring and scaling for Indian founders.", type: "YouTube", category: "YouTube (India)", pricing: "Completely Free", tags: ["india", "startup", "hiring"], lastVerified: "2026-08-27" },

  // ── Indian Professional Tools
  { id: "in18", name: "Zerodha Varsity", url: "https://zerodha.com/varsity", description: "Free stock market education — technical analysis, fundamental analysis, trading.", type: "Course", category: "Indian Professional Tools", pricing: "Completely Free", tags: ["india", "trading", "stocks"], lastVerified: "2026-08-27" },
  { id: "in19", name: "Screener.in", url: "https://www.screener.in", description: "Free Indian stock screener — financial data, ratios and charts for NSE/BSE.", type: "Website", category: "Indian Professional Tools", pricing: "Free Tier", tags: ["india", "stocks", "screener"], lastVerified: "2026-08-27" },
  { id: "in20", name: "Tally (Free tier)", url: "https://tally.so", description: "Free invoicing and accounting for Indian small businesses.", type: "Software", category: "Indian Professional Tools", pricing: "Free Tier", tags: ["india", "accounting", "gst"], lastVerified: "2026-08-27" },
  { id: "in21", name: "DigiLocker", url: "https://digilocker.gov.in", description: "Government digital document wallet — Aadhaar, PAN, driving license.", type: "Website", category: "Indian Professional Tools", pricing: "Completely Free", tags: ["india", "government", "documents"], lastVerified: "2026-08-27" },
  { id: "in22", name: "Umang App", url: "https://web.umang.gov.in", description: "Single portal for 1200+ Indian government services.", type: "Website", category: "Indian Professional Tools", pricing: "Completely Free", tags: ["india", "government", "services"], lastVerified: "2026-08-27" },
];
