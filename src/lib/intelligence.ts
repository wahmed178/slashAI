import type { SlashCommand } from "./commands";

/**
 * Command Intelligence Engine — learns from every interaction and personalises
 * search + the homepage. All data stays in localStorage under
 * "slashai-intelligence" so nothing ever leaves the device.
 */

export type IntelligenceAction = "copy" | "open" | "save";

export interface Interaction {
  commandId: string;
  searchTerm: string;
  action: IntelligenceAction;
  timestamp: number;
  dayOfWeek: number;
  hourOfDay: number;
}

export interface IntelligenceData {
  interactions: Interaction[];
  commandScores: Record<string, number>;
  relatedCommands: Record<string, string[]>;
}

const KEY = "slashai-intelligence";
/** Commands copied within this window count as "used together". */
const CO_OCCUR_WINDOW_MS = 10 * 60 * 1000;
/** Interactions needed before search results start blending personal scores. */
export const PERSONALIZE_SEARCH_THRESHOLD = 20;
/** Interactions needed before the homepage "Your most used" section appears. */
export const HOME_MOST_USED_THRESHOLD = 10;
const MAX_RELATED = 5;

const EMPTY: IntelligenceData = {
  interactions: [],
  commandScores: {},
  relatedCommands: {},
};

export function readIntelligence(): IntelligenceData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<IntelligenceData>;
    return {
      interactions: Array.isArray(parsed.interactions)
        ? parsed.interactions.filter(
            (i): i is Interaction =>
              typeof i?.commandId === "string" && typeof i?.timestamp === "number",
          )
        : [],
      commandScores:
        parsed.commandScores && typeof parsed.commandScores === "object"
          ? (parsed.commandScores as Record<string, number>)
          : {},
      relatedCommands:
        parsed.relatedCommands && typeof parsed.relatedCommands === "object"
          ? (parsed.relatedCommands as Record<string, string[]>)
          : {},
    };
  } catch {
    return EMPTY;
  }
}

function write(data: IntelligenceData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* storage full — intelligence is optional */
  }
}

const CHANGE_EVENT = "slashai-intelligence-change";

/** Subscribe to intelligence updates (e.g. a homepage "most used" section). */
export function onIntelligenceChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

/** Session co-occurrence: pair this command with anything used in the window. */
function learnRelated(data: IntelligenceData, commandId: string) {
  const now = Date.now();
  const recent = data.interactions.filter(
    (i) => i.commandId !== commandId && now - i.timestamp <= CO_OCCUR_WINDOW_MS,
  );
  const partners = [...new Set(recent.map((i) => i.commandId))].slice(-MAX_RELATED);
  if (partners.length === 0) return;
  for (const partner of partners) {
    const a = data.relatedCommands[commandId] ?? [];
    const b = data.relatedCommands[partner] ?? [];
    const push = (list: string[], other: string) =>
      [other, ...list.filter((x) => x !== other)].slice(0, MAX_RELATED);
    data.relatedCommands[commandId] = push(a, partner);
    data.relatedCommands[partner] = push(b, commandId);
  }
}

/** Record one interaction (copy / open / save). Safe to call from anywhere. */
export function trackInteraction(commandId: string, action: IntelligenceAction, searchTerm = "") {
  const data = readIntelligence();
  data.interactions.push({
    commandId,
    searchTerm: searchTerm.trim().slice(0, 80),
    action,
    timestamp: Date.now(),
    dayOfWeek: new Date().getDay(),
    hourOfDay: new Date().getHours(),
  });
  // keep the log bounded (~2k entries) so storage never grows unbounded
  if (data.interactions.length > 2000) data.interactions = data.interactions.slice(-1500);
  data.commandScores[commandId] = (data.commandScores[commandId] ?? 0) + 1;
  learnRelated(data, commandId);
  write(data);
}

export function interactionCount(): number {
  return readIntelligence().interactions.length;
}

/** Top-N commands by personal score, optionally filtered to a query. */
export function topPersonalCommands(limit = 5, query = ""): string[] {
  const data = readIntelligence();
  const q = query.trim().toLowerCase();
  const scored = Object.entries(data.commandScores)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const filtered = q ? scored.filter((s) => s.id.includes(q)) : scored;
  return filtered.slice(0, limit).map((s) => s.id);
}

export function personalScore(commandId: string): number {
  return readIntelligence().commandScores[commandId] ?? 0;
}

export function relatedByUsage(commandId: string): string[] {
  return readIntelligence().relatedCommands[commandId] ?? [];
}

/**
 * Reorder relevance results by blending catalog relevance with personal score:
 * (base relevance * 0.7) + (personal score * 0.3). Only active once the user
 * has crossed the personalisation threshold.
 */
export function personalizeResults<T extends { id: string }>(
  results: T[],
  query: string,
): T[] {
  const data = readIntelligence();
  if (data.interactions.length < PERSONALIZE_SEARCH_THRESHOLD) return results;
  if (!query.trim()) return results;
  const maxScore = Math.max(1, ...Object.values(data.commandScores));
  const scored = results.map((cmd, idx) => {
    const personal = (data.commandScores[cmd.id] ?? 0) / maxScore;
    // base relevance comes from position: earlier = more relevant
    const base = 1 - idx / Math.max(1, results.length);
    return { cmd, blended: base * 0.7 + personal * 0.3 };
  });
  return scored
    .sort((a, b) => b.blended - a.blended)
    .map((x) => x.cmd);
}

/** True once the user is past the threshold where personalisation kicks in. */
export function isPersonalized(): boolean {
  return interactionCount() >= PERSONALIZE_SEARCH_THRESHOLD;
}

/** Convenience: resolve personal command ids to command objects. */
export function resolveCommands(ids: string[], lookup: (id: string) => SlashCommand | undefined) {
  return ids
    .map((id) => lookup(id))
    .filter((c): c is SlashCommand => Boolean(c));
}