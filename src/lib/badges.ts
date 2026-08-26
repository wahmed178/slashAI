import type { Streak } from "./engagement";
import type { Stats } from "@/hooks/use-library";

/**
 * Achievements — derived purely from local activity. Nothing to store: a
 * badge is unlocked exactly when its condition holds right now, so badges
 * can never disagree with the underlying data.
 */

export interface BadgeSnapshot {
  streak: Streak;
  stats: Stats;
  favoritesCount: number;
  journalCount: number;
  journalDays: number;
}

export interface BadgeDef {
  id: string;
  name: string;
  hint: string;
  icon:
    | "flame"
    | "copy"
    | "heart"
    | "compass"
    | "pen"
    | "trophy"
    | "calendar";
  /** current progress value and unlock threshold */
  value: (s: BadgeSnapshot) => number;
  goal: number;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-copy",
    name: "First Command",
    hint: "Copy your first slash command",
    icon: "copy",
    value: (s) => s.stats.copies,
    goal: 1,
  },
  {
    id: "copy-25",
    name: "Command Runner",
    hint: "Copy 25 commands",
    icon: "copy",
    value: (s) => s.stats.copies,
    goal: 25,
  },
  {
    id: "collector-10",
    name: "Collector",
    hint: "Save 10 commands to favourites",
    icon: "heart",
    value: (s) => s.favoritesCount,
    goal: 10,
  },
  {
    id: "curious-10",
    name: "Curious Mind",
    hint: "Open 10 command details",
    icon: "compass",
    value: (s) => s.stats.opens,
    goal: 10,
  },
  {
    id: "explorer-50",
    name: "Explorer",
    hint: "Open 50 command details",
    icon: "compass",
    value: (s) => s.stats.opens,
    goal: 50,
  },
  {
    id: "streak-3",
    name: "Warming Up",
    hint: "Reach a 3-day streak",
    icon: "flame",
    value: (s) => Math.max(s.streak.count, s.streak.best),
    goal: 3,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    hint: "Reach a 7-day streak",
    icon: "flame",
    value: (s) => Math.max(s.streak.count, s.streak.best),
    goal: 7,
  },
  {
    id: "streak-30",
    name: "Habit Formed",
    hint: "Reach a 30-day streak",
    icon: "trophy",
    value: (s) => Math.max(s.streak.count, s.streak.best),
    goal: 30,
  },
  {
    id: "journal-1",
    name: "Building in Public",
    hint: "Write your first journal entry",
    icon: "pen",
    value: (s) => s.journalCount,
    goal: 1,
  },
  {
    id: "journal-5",
    name: "Progress Logger",
    hint: "Write 5 journal entries",
    icon: "pen",
    value: (s) => s.journalCount,
    goal: 5,
  },
  {
    id: "journal-days-7",
    name: "Seven Check-ins",
    hint: "Log progress on 7 different days",
    icon: "calendar",
    value: (s) => s.journalDays,
    goal: 7,
  },
  {
    id: "all-rounder",
    name: "All Rounder",
    hint: "Copy, save and log at least once each",
    icon: "trophy",
    value: (s) => (s.stats.copies > 0 ? 1 : 0) + (s.favoritesCount > 0 ? 1 : 0) + (s.journalCount > 0 ? 1 : 0),
    goal: 3,
  },
];

export interface BadgeState extends BadgeDef {
  unlocked: boolean;
  /** clamped 0..1 for progress rings/bars */
  progress: number;
}

export function evaluateBadges(s: BadgeSnapshot): BadgeState[] {
  return BADGES.map((b) => {
    const v = b.value(s);
    return {
      ...b,
      unlocked: v >= b.goal,
      progress: Math.min(1, b.goal === 0 ? 1 : v / b.goal),
    };
  });
}
