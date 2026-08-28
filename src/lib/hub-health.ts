import type { HubResource } from "./hub-founders";

export const HEALTH_RESOURCES: HubResource[] = [
  // ── Fitness & Workout Tools
  { id: "hl1", name: "Nike Training Club", url: "https://www.nike.com/ntc-app", description: "Free workout videos and training plans from Nike trainers.", type: "App", category: "Fitness & Workout", pricing: "Completely Free", tags: ["fitness", "workout", "app"], lastVerified: "2026-08-27" },
  { id: "hl2", name: "FitOn", url: "https://www.fitonapp.com", description: "Free workout videos — yoga, HIIT, strength, dance with celebrity trainers.", type: "App", category: "Fitness & Workout", pricing: "Completely Free", tags: ["fitness", "yoga", "hiit"], lastVerified: "2026-08-27" },
  { id: "hl3", name: "Down Dog", url: "https://www.downdogapp.com", description: "Free yoga app with customizable sessions — beginner to advanced.", type: "App", category: "Fitness & Workout", pricing: "Free Tier", tags: ["yoga", "meditation", "fitness"], lastVerified: "2026-08-27" },
  { id: "hl4", name: "JEFIT", url: "https://www.jefit.com", description: "Free workout tracker with exercise library and custom routines.", type: "App", category: "Fitness & Workout", pricing: "Freemium", tags: ["gym", "tracker", "workout"], lastVerified: "2026-08-27" },

  // ── Nutrition & Diet
  { id: "hl5", name: "MyFitnessPal Free", url: "https://www.myfitnesspal.com", description: "Calorie tracker with largest food database — barcode scanning included.", type: "App", category: "Nutrition & Diet", pricing: "Freemium", tags: ["calories", "diet", "tracker"], lastVerified: "2026-08-27" },
  { id: "hl6", name: "Cronometer", url: "https://cronometer.com", description: "Detailed nutrition tracking — micronutrients, not just calories.", type: "App", category: "Nutrition & Diet", pricing: "Freemium", tags: ["nutrition", "micronutrients", "diet"], lastVerified: "2026-08-27" },
  { id: "hl7", name: "Nutritionix", url: "https://www.nutritionix.com", description: "Free food database and calorie API — power many popular diet apps.", type: "API", category: "Nutrition & Diet", pricing: "Free Tier", tags: ["api", "food", "calories"], lastVerified: "2026-08-27" },

  // ── AI Health Tools
  { id: "hl8", name: "ChatGPT", url: "https://chat.openai.com", description: "AI for explaining medical terms, workout plans and nutrition questions.", type: "AI Tool", category: "AI Health Tools", pricing: "Freemium", tags: ["ai", "health", "advice"], lastVerified: "2026-08-27" },
  { id: "hl9", name: "Perplexity", url: "https://www.perplexity.ai", description: "AI search with sources — research health topics with citations.", type: "AI Tool", category: "AI Health Tools", pricing: "Freemium", tags: ["ai", "search", "medical"], lastVerified: "2026-08-27" },

  // ── Health Learning
  { id: "hl10", name: "Khan Academy Health", url: "https://www.khanacademy.org/science/health-and-medicine", description: "Free courses on human biology, disease, circulatory system and more.", type: "Course", category: "Health Learning", pricing: "Completely Free", tags: ["course", "biology", "free"], lastVerified: "2026-08-27" },
  { id: "hl11", name: "WHO Health Resources", url: "https://www.who.int/health-topics", description: "Authoritative health information from the World Health Organization.", type: "Wiki", category: "Health Learning", pricing: "Completely Free", tags: ["who", "medical", "global"], lastVerified: "2026-08-27" },
  { id: "hl12", name: "Mayo Clinic", url: "https://www.mayoclinic.org", description: "Trusted medical encyclopedia — conditions, symptoms, treatments.", type: "Wiki", category: "Health Learning", pricing: "Completely Free", tags: ["medical", "conditions", "treatments"], lastVerified: "2026-08-27" },

  // ── Mental Health & Wellness
  { id: "hl13", name: "Headspace Free", url: "https://www.headspace.com", description: "Free meditation and mindfulness — basics course always free.", type: "App", category: "Mental Health", pricing: "Free Tier", tags: ["meditation", "mindfulness", "sleep"], lastVerified: "2026-08-27" },
  { id: "hl14", name: "Insight Timer", url: "https://insighttimer.com", description: "Free meditation app — 100,000+ guided meditations, timer and courses.", type: "App", category: "Mental Health", pricing: "Completely Free", tags: ["meditation", "free", "timer"], lastVerified: "2026-08-27" },
  { id: "hl15", name: "Moodfit", url: "https://www.getmoodfit.com", description: "Free mental health tools — mood tracking, CBT exercises, breathing.", type: "App", category: "Mental Health", pricing: "Free Tier", tags: ["mood", "cbt", "tracking"], lastVerified: "2026-08-27" },

  // ── YouTube (Health)
  { id: "hl16", name: "Doctor Mike", url: "https://www.youtube.com/@DoctorMike", description: "Board-certified doctor explaining medical topics and debunking myths.", type: "YouTube", category: "YouTube (Health)", pricing: "Completely Free", tags: ["youtube", "doctor", "medical"], lastVerified: "2026-08-27" },
  { id: "hl17", name: "Jeff Nippard", url: "https://www.youtube.com/@JeffNippard", description: "Science-based fitness — workout programming and nutrition backed by research.", type: "YouTube", category: "YouTube (Health)", pricing: "Completely Free", tags: ["youtube", "fitness", "science"], lastVerified: "2026-08-27" },
  { id: "hl18", name: "Squat University", url: "https://www.youtube.com/@SquatUniversity", description: "Physical therapy and mobility for injury prevention and recovery.", type: "YouTube", category: "YouTube (Health)", pricing: "Completely Free", tags: ["youtube", "mobility", "injury"], lastVerified: "2026-08-27" },
  { id: "hl19", name: "HealthifyMe", url: "https://www.healthifyme.com", description: "AI-powered diet and fitness tracking — strong for Indian food tracking.", type: "App", category: "Fitness & Workout", pricing: "Freemium", tags: ["india", "diet", "fitness"], lastVerified: "2026-08-27" },
  { id: "hl20", name: "Practo", url: "https://www.practo.com", description: "Find doctors, book appointments and read health articles — India's largest platform.", type: "Website", category: "Health Learning", pricing: "Completely Free", tags: ["india", "doctors", "appointments"], lastVerified: "2026-08-27" },
];
