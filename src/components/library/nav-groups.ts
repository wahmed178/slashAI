import {
  Compass,
  Home,
  LayoutGrid,
  Terminal,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";

/**
 * Shared grouped navigation tree used by both the desktop sidebar and the
 * mobile drawer, so the two never drift apart. Groups act as sub-folders:
 * the header toggles expansion (or navigates when there are no leaves).
 */

export interface NavLeaf {
  to: string;
  label: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: any;
  /** route prefixes that mark this group active */
  match: (pathname: string) => boolean;
  /** overview destination for the group */
  to?: string;
  badge?: string;
  leaves: NavLeaf[];
}

function starts(p: string) {
  return (pathname: string) => pathname.startsWith(p);
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "Home",
    icon: Home,
    match: (p) => p === "/",
    to: "/",
    leaves: [],
  },
  {
    id: "discover",
    label: "Discovery",
    icon: Compass,
    match: starts("/discover") || starts("/r/"),
    to: "/discover",
    leaves: [
      { to: "/trending", label: "Trending", badge: "Hot" },
      { to: "/radar", label: "Radar" },
      { to: "/whats-new", label: "What's New" },
    ],
  },
  {
    id: "slashbar",
    label: "SlashBar",
    icon: Zap,
    match: starts("/slash"),
    to: "/slash",
    badge: "25",
    leaves: [
      { to: "/tools", label: "SlashKits", badge: "135+" },
      { to: "/play", label: "SlashPlay" },
      { to: "/slash/slashgram", label: "SlashGram" },
      { to: "/slash/labs", label: "Labs" },
      { to: "/slash/learning", label: "Learning" },
      { to: "/slash/brain-boosters", label: "Brain Boosters" },
      { to: "/slash/romantic", label: "Romantic" },
      { to: "/slash/courses", label: "Courses" },
      { to: "/slash/jobs", label: "Jobs" },
      { to: "/slash/life-hacks", label: "Life Hacks" },
      { to: "/slash/facts", label: "Facts" },
      { to: "/slash/create", label: "Create" },
      { to: "/slash/image", label: "Image" },
      { to: "/slash/search-engine", label: "Search Engine" },
      { to: "/slash/speak", label: "Speak" },
      { to: "/slash/fun", label: "Fun" },
      { to: "/slash/gadgets", label: "Gadgets" },
      { to: "/slash/shoppings", label: "Shoppings" },
      { to: "/slash/offers", label: "Offers" },
      { to: "/slash/mini-store", label: "Mini Store" },
      { to: "/slash/mens", label: "Mens" },
      { to: "/slash/how-to-zone", label: "How-To Zone" },
      { to: "/slash/thinks", label: "Thinks" },
      { to: "/slash/community", label: "Community" },
      { to: "/slash/simulator", label: "Simulator" },
      { to: "/slash/nearby", label: "Nearby" },
    ],
  },
  {
    id: "hubs",
    label: "Hubs",
    icon: LayoutGrid,
    match: starts("/hub"),
    to: "/hub",
    leaves: [
      { to: "/hub/fun", label: "Fun Sites" },
      { to: "/hub/islam", label: "Islam Hub" },
      { to: "/hub/urdu", label: "Urdu Hub" },
      { to: "/hub/quotes", label: "Quotes Hub" },
    ],
  },
  {
    id: "commands",
    label: "Commands",
    icon: Terminal,
    match: starts("/explore") || starts("/search") || starts("/find") || starts("/c/"),
    to: "/explore",
    leaves: [
      { to: "/search", label: "Search" },
      { to: "/find", label: "Find" },
      { to: "/collections", label: "Collections" },
      { to: "/recent", label: "Recent" },
      { to: "/favorites", label: "Saved" },
    ],
  },
  {
    id: "tools-more",
    label: "More tools",
    icon: Wrench,
    match:
      starts("/ai-tools") ||
      starts("/web-search") ||
      starts("/workflow") ||
      starts("/random") ||
      starts("/roadmaps") ||
      starts("/live") ||
      starts("/quiz") ||
      starts("/glossary") ||
      starts("/graph"),
    to: "/ai-tools",
    leaves: [
      { to: "/ai-tools", label: "AI Tools", badge: "100+" },
      { to: "/web-search", label: "Free Search" },
      { to: "/workflow", label: "AI Workflows", badge: "New" },
      { to: "/roadmaps", label: "Roadmaps" },
      { to: "/random", label: "Random" },
      { to: "/live", label: "Live", badge: "Hot" },
      { to: "/quiz", label: "Daily Quiz" },
      { to: "/glossary", label: "Glossary" },
      { to: "/graph", label: "Knowledge Graph" },
    ],
  },
  {
    id: "you",
    label: "You",
    icon: UserRound,
    match: starts("/me") || starts("/journal") || starts("/designs") || starts("/promo"),
    to: "/me",
    leaves: [
      { to: "/journal", label: "Journal" },
      { to: "/designs", label: "Designs" },
      { to: "/promo", label: "About SlashAI" },
      { to: "/me", label: "Profile & Settings" },
    ],
  },
];
