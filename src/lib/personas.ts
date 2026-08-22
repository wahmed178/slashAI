import { COMMANDS, type SlashCommand } from "./commands";

/**
 * Optional, local-only persona layer. A persona is just a shorthand for a set
 * of interests + preferred categories — it never gates any content.
 */
export interface Persona {
  id: string;
  emoji: string;
  label: string;
  /** interest ids from collections.INTERESTS */
  interests: string[];
  categories: string[];
  /** short line used on the About page accordion */
  pitch: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "professional",
    emoji: "👩‍💼",
    label: "Professional",
    interests: ["work"],
    categories: ["Productivity", "Writing & Communication", "Business & Strategy"],
    pitch: "Turn meetings, emails and messy notes into clear, structured output.",
  },
  {
    id: "student",
    emoji: "👨‍🎓",
    label: "Student",
    interests: ["study"],
    categories: ["Learning & Education", "Math & Science", "Research"],
    pitch: "Outline essays, build flashcards and get any topic explained simply.",
  },
  {
    id: "healthcare",
    emoji: "👩‍⚕️",
    label: "Doctor / Healthcare",
    interests: ["work", "lifestyle"],
    categories: ["Health & Wellbeing", "Documents & OCR", "Research"],
    pitch: "Summarise documents, simplify explanations and plan patient-friendly notes.",
  },
  {
    id: "developer",
    emoji: "👨‍💻",
    label: "Developer",
    interests: ["technology"],
    categories: ["Coding & Development", "Automation & Workflows", "Quality & Performance"],
    pitch: "Review code, debug faster, write tests and automate the boring parts.",
  },
  {
    id: "creator",
    emoji: "🎨",
    label: "Creator / Designer",
    interests: ["content"],
    categories: ["Video", "Design", "Image & Vision", "Social & Community"],
    pitch: "Hooks, scripts, captions, thumbnails and on-brand visuals.",
  },
  {
    id: "homemaker",
    emoji: "🧕",
    label: "Homemaker",
    interests: ["lifestyle"],
    categories: ["Home & Everyday", "Health & Wellbeing", "Money & Finance"],
    pitch: "Meal plans, budgets, letters, repairs and household organisation.",
  },
  {
    id: "senior",
    emoji: "👴",
    label: "Retired / Senior",
    interests: ["lifestyle", "travel"],
    categories: ["Home & Everyday", "Health & Wellbeing", "Travel & Local"],
    pitch: "Plain-language help with letters, health questions and travel plans.",
  },
  {
    id: "entrepreneur",
    emoji: "💼",
    label: "Entrepreneur",
    interests: ["business"],
    categories: ["Business & Strategy", "Marketing", "Money & Finance"],
    pitch: "Pitches, positioning, pricing and marketing you can ship today.",
  },
  {
    id: "analyst",
    emoji: "📊",
    label: "Data Analyst",
    interests: ["work", "technology"],
    categories: ["Data", "Analysis", "Math & Science"],
    pitch: "Clean data, explain results and turn numbers into a story.",
  },
  {
    id: "curious",
    emoji: "🧠",
    label: "Just Curious",
    interests: [],
    categories: [],
    pitch: "Browse everything — there is no wrong way to start.",
  },
];

const byId = new Map(PERSONAS.map((p) => [p.id, p]));

export const getPersona = (id: string | undefined | null): Persona | undefined =>
  id ? byId.get(id) : undefined;

/** Commands that fit a persona, most popular first. Falls back to the catalog. */
export function personaCommands(personaId: string | undefined, limit = 12): SlashCommand[] {
  const persona = getPersona(personaId);
  const cats = new Set(persona?.categories ?? []);
  const pool = cats.size > 0 ? COMMANDS.filter((c) => cats.has(c.category)) : COMMANDS;
  return [...pool].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

/** Greeting suffix, e.g. "Good morning, Creator". */
export function personaGreetingName(personaId: string | undefined): string | undefined {
  const persona = getPersona(personaId);
  if (!persona || persona.id === "curious") return undefined;
  return persona.label.split(" / ")[0];
}
