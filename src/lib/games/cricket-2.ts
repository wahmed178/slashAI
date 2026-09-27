/**
 * Cricket 2 — "Cricket Champions" tournament edition.
 *
 * Pure data and balance maths only, so the route stays a thin UI shell and the
 * simulation can be unit-tested without React. Squads are fictional; the
 * rating/stat numbers are gameplay knobs, not real statistics.
 */

export interface Player {
  name: string;
  role: string;
  stat: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  rating: number;
  players: Player[];
}

export interface League {
  id: string;
  name: string;
  short: string;
  icon: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type TourneyType = "domestic" | "international";
export type Role = "bat" | "bowl";

export const WICKETS = 5;

export const LEAGUES: League[] = [
  { id: "pcl", name: "Premier Cricket League", short: "PCL", icon: "🏆" },
  { id: "ssl", name: "Super Smash League", short: "SSL", icon: "⚡" },
  { id: "rtc", name: "Royal T20 Cup", short: "RTC", icon: "👑" },
  { id: "gcs", name: "Global Cricket Series", short: "GCS", icon: "🌍" },
];

export const LEAGUE_TEAMS: Record<string, Team[]> = {
  pcl: [
    {
      id: "mum",
      name: "Mumbai Mavericks",
      logo: "🦁",
      rating: 92,
      players: [
        { name: "Rohan Sharma", role: "Captain / Batsman", stat: "SR 145" },
        { name: "Jay Kishan", role: "Wicketkeeper", stat: "SR 138" },
        { name: "Surya Kumar", role: "All-rounder", stat: "SR 152" },
        { name: "Arjun Patel", role: "Fast Bowler", stat: "Econ 7.8" },
        { name: "Vikram Singh", role: "Spinner", stat: "Econ 6.5" },
      ],
    },
    {
      id: "che",
      name: "Chennai Kings",
      logo: "🦅",
      rating: 90,
      players: [
        { name: "Karthik Reddy", role: "Captain / Batsman", stat: "SR 140" },
        { name: "Ravi Iyer", role: "Batsman", stat: "SR 135" },
        { name: "Deepak Nair", role: "Fast Bowler", stat: "Econ 8.2" },
        { name: "Moeen Ali", role: "All-rounder", stat: "SR 150" },
        { name: "Pravin Das", role: "Spinner", stat: "Econ 6.8" },
      ],
    },
    {
      id: "ban",
      name: "Bangalore Royals",
      logo: "🐯",
      rating: 88,
      players: [
        { name: "Faizan Khan", role: "Captain / Batsman", stat: "SR 155" },
        { name: "Dinesh Rao", role: "Finisher", stat: "SR 148" },
        { name: "Mohit Rai", role: "Fast Bowler", stat: "Econ 8.5" },
        { name: "Harshal Patel", role: "All-rounder", stat: "SR 130" },
        { name: "Yuvraj Chahal", role: "Spinner", stat: "Econ 7.0" },
      ],
    },
    {
      id: "kol",
      name: "Kolkata Riders",
      logo: "🦄",
      rating: 85,
      players: [
        { name: "Shubman Gill", role: "Captain / Batsman", stat: "SR 138" },
        { name: "Rahul Tiwari", role: "Batsman", stat: "SR 132" },
        { name: "Varun Chakraborty", role: "Spinner", stat: "Econ 6.9" },
        { name: "Umesh Yadav", role: "Fast Bowler", stat: "Econ 8.0" },
        { name: "Nitish Rana", role: "All-rounder", stat: "SR 128" },
      ],
    },
    {
      id: "hyd",
      name: "Hyderabad Risers",
      logo: "🐎",
      rating: 87,
      players: [
        { name: "Azhar Malik", role: "Captain / Batsman", stat: "SR 142" },
        { name: "Abhishek Reddy", role: "Wicketkeeper", stat: "SR 136" },
        { name: "Natarajan T.", role: "Fast Bowler", stat: "Econ 7.9" },
        { name: "Rashid Khan", role: "Spinner", stat: "Econ 6.2" },
        { name: "Kane Maher", role: "All-rounder", stat: "SR 134" },
      ],
    },
  ],
  ssl: [
    {
      id: "lah",
      name: "Lahore Legends",
      logo: "🦌",
      rating: 91,
      players: [
        { name: "Babar Iqbal", role: "Captain / Batsman", stat: "SR 135" },
        { name: "Fakhar Naveen", role: "Opener", stat: "SR 130" },
        { name: "Shahid Raza", role: "All-rounder", stat: "SR 165" },
        { name: "Haris Rauf", role: "Fast Bowler", stat: "Econ 8.8" },
        { name: "Shadab Khan", role: "Spinner", stat: "Econ 7.2" },
      ],
    },
    {
      id: "kar",
      name: "Karachi Knights",
      logo: "🦈",
      rating: 89,
      players: [
        { name: "Sharjeel Khan", role: "Captain / Batsman", stat: "SR 142" },
        { name: "Imad Wasim", role: "All-rounder", stat: "SR 148" },
        { name: "Mohammad Amir", role: "Fast Bowler", stat: "Econ 7.5" },
        { name: "Kamran Malik", role: "Wicketkeeper", stat: "SR 138" },
        { name: "Imran Qadir", role: "Spinner", stat: "Econ 7.0" },
      ],
    },
    {
      id: "isl",
      name: "Islamabad United",
      logo: "🦉",
      rating: 87,
      players: [
        { name: "Shan Masood", role: "Captain / Batsman", stat: "SR 128" },
        { name: "Aamer Khan", role: "Fast Bowler", stat: "Econ 8.0" },
        { name: "Hussain Ali", role: "Batsman", stat: "SR 140" },
        { name: "Zain Khan", role: "All-rounder", stat: "SR 135" },
        { name: "Salman Malik", role: "Spinner", stat: "Econ 6.8" },
      ],
    },
    {
      id: "que",
      name: "Quetta Gladiators",
      logo: "🦊",
      rating: 84,
      players: [
        { name: "Sarfaraz Ahmed", role: "Captain / All-rounder", stat: "SR 145" },
        { name: "Faisal Ahmed", role: "Batsman", stat: "SR 132" },
        { name: "Nasim Dara", role: "Fast Bowler", stat: "Econ 8.5" },
        { name: "Anwar Jamal", role: "Spinner", stat: "Econ 7.3" },
        { name: "Kamran Nawaz", role: "Wicketkeeper", stat: "SR 128" },
      ],
    },
  ],
  rtc: [
    {
      id: "syd",
      name: "Sydney Sixers",
      logo: "🦘",
      rating: 90,
      players: [
        { name: "Josh Reid", role: "Captain / Batsman", stat: "SR 140" },
        { name: "Michael Darn", role: "All-rounder", stat: "SR 135" },
        { name: "Pat Cumming", role: "Fast Bowler", stat: "Econ 7.8" },
        { name: "David Warner", role: "Opener", stat: "SR 148" },
        { name: "Adam Zampa", role: "Spinner", stat: "Econ 7.5" },
      ],
    },
    {
      id: "mel",
      name: "Melbourne Stars",
      logo: "⭐",
      rating: 88,
      players: [
        { name: "Glenn Maxwell", role: "Captain / All-rounder", stat: "SR 160" },
        { name: "Marcus Stoinis", role: "Batsman", stat: "SR 145" },
        { name: "Josh Hazlewood", role: "Fast Bowler", stat: "Econ 7.9" },
        { name: "Tim David", role: "Finisher", stat: "SR 155" },
        { name: "Alex Carey", role: "Wicketkeeper", stat: "SR 137" },
      ],
    },
    {
      id: "per",
      name: "Perth Scorchers",
      logo: "🔥",
      rating: 86,
      players: [
        { name: "Aaron Finch", role: "Captain / Opener", stat: "SR 138" },
        { name: "Mitch Marsh", role: "All-rounder", stat: "SR 132" },
        { name: "Jhye Behrendorff", role: "Fast Bowler", stat: "Econ 8.0" },
        { name: "Cameron Rogers", role: "Batsman", stat: "SR 130" },
        { name: "Nathan Lyon", role: "Spinner", stat: "Econ 6.8" },
      ],
    },
    {
      id: "bri",
      name: "Brisbane Heat",
      logo: "🌡️",
      rating: 83,
      players: [
        { name: "Usman Khawaja", role: "Captain / Batsman", stat: "SR 132" },
        { name: "Matt Renshaw", role: "All-rounder", stat: "SR 140" },
        { name: "Jimmy Pattinson", role: "Fast Bowler", stat: "Econ 8.5" },
        { name: "Ben McClure", role: "Batsman", stat: "SR 131" },
        { name: "Tom Andrews", role: "Spinner", stat: "Econ 7.0" },
      ],
    },
  ],
  gcs: [
    {
      id: "trin",
      name: "Trinidad Titans",
      logo: "🌴",
      rating: 89,
      players: [
        { name: "Kieron Pollard", role: "Captain / All-rounder", stat: "SR 158" },
        { name: "Sunil Narine", role: "Spinner", stat: "Econ 6.5" },
        { name: "Dwayne Bravo", role: "Finisher", stat: "SR 150" },
        { name: "Lendl Simmons", role: "Opener", stat: "SR 138" },
        { name: "Ravi Bholan", role: "Fast Bowler", stat: "Econ 8.2" },
      ],
    },
    {
      id: "jam",
      name: "Jamaica Tallawahs",
      logo: "🏝️",
      rating: 86,
      players: [
        { name: "Chris Gayle", role: "Captain / Batsman", stat: "SR 165" },
        { name: "Kyle Lewis", role: "Finisher", stat: "SR 152" },
        { name: "Oshane Thomas", role: "Fast Bowler", stat: "Econ 8.5" },
        { name: "Marlon Samuels", role: "All-rounder", stat: "SR 135" },
        { name: "Sean Walsh", role: "Fast Bowler", stat: "Econ 8.0" },
      ],
    },
    {
      id: "bar",
      name: "Barbados Royals",
      logo: "👑",
      rating: 88,
      players: [
        { name: "Jason Holder", role: "Captain / All-rounder", stat: "SR 138" },
        { name: "Kyle Charles", role: "Batsman", stat: "SR 142" },
        { name: "Roston Chase", role: "Spinner", stat: "Econ 6.8" },
        { name: "Alzar Joseph", role: "Fast Bowler", stat: "Econ 8.2" },
        { name: "Gudakesh Motie", role: "Spinner", stat: "Econ 7.0" },
      ],
    },
    {
      id: "guy",
      name: "Guyana Warriors",
      logo: "🐆",
      rating: 85,
      players: [
        { name: "Imran Khan", role: "Captain / Batsman", stat: "SR 135" },
        { name: "Shimron Rutherford", role: "All-rounder", stat: "SR 148" },
        { name: "Keemo Paul", role: "Batsman", stat: "SR 132" },
        { name: "Romario Powell", role: "Finisher", stat: "SR 155" },
        { name: "Andre Russell", role: "All-rounder", stat: "SR 165" },
      ],
    },
  ],
};

export const INTERNATIONAL_TEAMS: Team[] = [
  {
    id: "ind",
    name: "India",
    logo: "🇮🇳",
    rating: 95,
    players: [
      { name: "Virat K.", role: "Captain / Batsman", stat: "SR 148" },
      { name: "Rohit S.", role: "Opener", stat: "SR 142" },
      { name: "Jasprit B.", role: "Fast Bowler", stat: "Econ 7.2" },
      { name: "Ravindra J.", role: "All-rounder", stat: "SR 135" },
      { name: "Kuldeep Y.", role: "Spinner", stat: "Econ 6.8" },
    ],
  },
  {
    id: "aus",
    name: "Australia",
    logo: "🇦🇺",
    rating: 93,
    players: [
      { name: "Pat C.", role: "Captain / Fast Bowler", stat: "Econ 7.5" },
      { name: "Steve S.", role: "Batsman", stat: "SR 138" },
      { name: "David W.", role: "Opener", stat: "SR 150" },
      { name: "Glenn M.", role: "All-rounder", stat: "SR 160" },
      { name: "Mitch S.", role: "Fast Bowler", stat: "Econ 7.8" },
    ],
  },
  {
    id: "eng",
    name: "England",
    logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    rating: 91,
    players: [
      { name: "Jos B.", role: "Captain / Wicketkeeper", stat: "SR 145" },
      { name: "Joe R.", role: "Batsman", stat: "SR 132" },
      { name: "Ben S.", role: "All-rounder", stat: "SR 155" },
      { name: "Jofra A.", role: "Fast Bowler", stat: "Econ 8.0" },
      { name: "Adil R.", role: "Spinner", stat: "Econ 7.2" },
    ],
  },
  {
    id: "pak",
    name: "Pakistan",
    logo: "🇵🇰",
    rating: 89,
    players: [
      { name: "Babar A.", role: "Captain / Batsman", stat: "SR 135" },
      { name: "Shaheen A.", role: "Fast Bowler", stat: "Econ 7.5" },
      { name: "Fakhar Z.", role: "Opener", stat: "SR 130" },
      { name: "Shadab N.", role: "All-rounder", stat: "SR 140" },
      { name: "Haris R.", role: "Fast Bowler", stat: "Econ 8.5" },
    ],
  },
  {
    id: "sa",
    name: "South Africa",
    logo: "🇿🇦",
    rating: 87,
    players: [
      { name: "Quinton D.", role: "Captain / Wicketkeeper", stat: "SR 142" },
      { name: "Kagiso R.", role: "Fast Bowler", stat: "Econ 7.8" },
      { name: "Aiden M.", role: "Batsman", stat: "SR 135" },
      { name: "David M.", role: "All-rounder", stat: "SR 145" },
      { name: "Tabraiz S.", role: "Spinner", stat: "Econ 7.0" },
    ],
  },
  {
    id: "nz",
    name: "New Zealand",
    logo: "🇳🇿",
    rating: 86,
    players: [
      { name: "Kane W.", role: "Captain / Batsman", stat: "SR 132" },
      { name: "Trent B.", role: "Fast Bowler", stat: "Econ 7.5" },
      { name: "Devon C.", role: "Wicketkeeper", stat: "SR 138" },
      { name: "Tim S.", role: "Batsman", stat: "SR 130" },
      { name: "Ish S.", role: "Spinner", stat: "Econ 6.8" },
    ],
  },
  {
    id: "wi",
    name: "West Indies",
    logo: "🏝️",
    rating: 84,
    players: [
      { name: "Kieron P.", role: "Captain / All-rounder", stat: "SR 158" },
      { name: "Chris G.", role: "Opener", stat: "SR 165" },
      { name: "Andre R.", role: "All-rounder", stat: "SR 162" },
      { name: "Sheldon C.", role: "Fast Bowler", stat: "Econ 8.2" },
      { name: "Sunil N.", role: "Spinner", stat: "Econ 6.5" },
    ],
  },
  {
    id: "sl",
    name: "Sri Lanka",
    logo: "🇱🇰",
    rating: 82,
    players: [
      { name: "Dasun S.", role: "Captain / All-rounder", stat: "SR 135" },
      { name: "Wanindu H.", role: "Spinner", stat: "Econ 6.5" },
      { name: "Pathum N.", role: "Batsman", stat: "SR 130" },
      { name: "Lasith E.", role: "Fast Bowler", stat: "Econ 8.0" },
      { name: "Kusal M.", role: "Wicketkeeper", stat: "SR 138" },
    ],
  },
];

/* ── shots, deliveries, balance ──────────────────────────────────── */

export type Risk = "Low" | "Med" | "High" | "V.High";

export interface Shot {
  id: string;
  name: string;
  icon: string;
  risk: Risk;
  power: number;
  boundary: number;
  wicket: number;
}

export const SHOTS: Shot[] = [
  {
    id: "defend",
    name: "Defend",
    icon: "🛡️",
    risk: "Low",
    power: 0.2,
    boundary: 0.02,
    wicket: 0.03,
  },
  { id: "drive", name: "Drive", icon: "🏏", risk: "Med", power: 0.6, boundary: 0.18, wicket: 0.1 },
  { id: "pull", name: "Pull", icon: "💪", risk: "High", power: 0.8, boundary: 0.25, wicket: 0.18 },
  {
    id: "loft",
    name: "Lofted",
    icon: "🚀",
    risk: "V.High",
    power: 1,
    boundary: 0.35,
    wicket: 0.28,
  },
  { id: "sweep", name: "Sweep", icon: "🧹", risk: "Med", power: 0.5, boundary: 0.15, wicket: 0.12 },
  { id: "cut", name: "Cut", icon: "✂️", risk: "Med", power: 0.55, boundary: 0.2, wicket: 0.11 },
];

export interface Bowl {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const BOWLS: Bowl[] = [
  { id: "fast", name: "Fast", icon: "⚡", desc: "Pace & bounce" },
  { id: "swing", name: "Swing", icon: "🌊", desc: "Movement" },
  { id: "yorker", name: "Yorker", icon: "🔥", desc: "Toe crusher" },
  { id: "bouncer", name: "Bouncer", icon: "💥", desc: "Short & hostile" },
  { id: "spin", name: "Spin", icon: "🌀", desc: "Turn & flight" },
  { id: "slower", name: "Slower", icon: "🐢", desc: "Change of pace" },
  { id: "wide", name: "Wide Line", icon: "↔️", desc: "Outside off" },
];

/** How well each shot travels against each delivery. 1 = neutral. */
export const EFFECTIVENESS: Record<string, Record<string, number>> = {
  defend: { fast: 1.2, swing: 1.1, yorker: 1.1, bouncer: 1, spin: 1, slower: 1, wide: 0.8 },
  drive: { fast: 1.1, swing: 0.8, yorker: 0.6, bouncer: 0.7, spin: 1.1, slower: 1.2, wide: 1 },
  pull: { fast: 0.9, swing: 0.9, yorker: 0.5, bouncer: 1.4, spin: 0.9, slower: 1, wide: 0.9 },
  loft: { fast: 1, swing: 0.9, yorker: 0.4, bouncer: 1.1, spin: 1, slower: 1.3, wide: 1.1 },
  sweep: { fast: 0.9, swing: 0.9, yorker: 0.7, bouncer: 0.8, spin: 1.4, slower: 1, wide: 1 },
  cut: { fast: 1, swing: 0.9, yorker: 0.6, bouncer: 1.2, spin: 1, slower: 1.1, wide: 1 },
};

export const DIFF_MODS: Record<
  Difficulty,
  { userBatBonus: number; userBowlBonus: number; aiAggression: number }
> = {
  easy: { userBatBonus: 0.15, userBowlBonus: 0.15, aiAggression: 0.6 },
  medium: { userBatBonus: 0, userBowlBonus: 0, aiAggression: 1 },
  hard: { userBatBonus: -0.15, userBowlBonus: -0.15, aiAggression: 1.4 },
};

export interface Format {
  overs: 1 | 2 | 3 | 5;
  name: string;
  icon: string;
  desc: string;
  rounds: string[];
}

export const FORMATS: Format[] = [
  {
    overs: 1,
    name: "1 Over",
    icon: "⚡",
    desc: "Two semis, straight to the final",
    rounds: ["Semi-Final 1", "Semi-Final 2", "Final"],
  },
  {
    overs: 2,
    name: "2 Overs",
    icon: "🏆",
    desc: "One semi, straight to the final",
    rounds: ["Semi-Final", "Final"],
  },
  {
    overs: 3,
    name: "3 Overs",
    icon: "👑",
    desc: "Qualifier, semi, final",
    rounds: ["Qualifier", "Semi-Final", "Final"],
  },
  {
    overs: 5,
    name: "5 Overs",
    icon: "🌟",
    desc: "Full T20-style knockout",
    rounds: ["Quarter-Final", "Semi-Final", "Final"],
  },
];

export const DIFFICULTIES: { id: Difficulty; name: string; desc: string }[] = [
  { id: "easy", name: "Easy", desc: "Casual" },
  { id: "medium", name: "Medium", desc: "Balanced" },
  { id: "hard", name: "Hard", desc: "Pro" },
];

export const COMMENTARY = {
  wicket: [
    "OUT! What a delivery — the stumps are shattered!",
    "GOT HIM! Brilliant bowling, the batter has to walk back.",
    "WICKET! The fielder takes a sharp catch!",
    "OUT! Trapped in front — a great appeal.",
    "GONE! Edged and taken behind the stumps.",
    "WICKET! Clean bowled, the middle stump goes flying.",
  ],
  six: [
    "SIX! That's gone miles into the stands!",
    "MAXIMUM! What a hit, the crowd goes wild!",
    "SIX RUNS! That's out of the ground!",
    "HUGE SIX! The batter is in sublime form.",
    "MASSIVE HIT! Into the top tier.",
  ],
  four: [
    "FOUR! Races away to the boundary!",
    "BOUNDARY! Beautiful timing.",
    "FOUR! Pierces the field brilliantly.",
    "FOUR RUNS! What a cracking shot.",
    "BOUNDARY! Textbook batting.",
  ],
  dot: [
    "Dot ball. Good pressure from the bowler.",
    "No run. Defended solidly.",
    "Beaten! Great delivery.",
    "Played and missed! Close one.",
    "Straight back to the bowler. Tight line.",
  ],
  runs1: [
    "Single taken. Good running between the wickets.",
    "One run. Smart placement.",
    "Quick single — good awareness.",
  ],
  runs2: [
    "Two runs. Excellent running.",
    "Couple more, placed into the gap.",
    "Two runs. Good shot selection.",
  ],
  runs3: ["Three runs! Hustled hard.", "Three! Great running between the wickets."],
} as const;

export type CommentaryKey = keyof typeof COMMENTARY;

/* ── match model ─────────────────────────────────────────────────── */

export interface Batsman {
  name: string;
  role: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
}

export interface Bowler {
  name: string;
  balls: number;
  runs: number;
  wickets: number;
}

export interface BallEvent {
  runs: number;
  wicket: boolean;
  four: boolean;
  six: boolean;
}

export interface Innings {
  runs: number;
  wickets: number;
  balls: number;
  events: BallEvent[];
  milestones: number[];
  batsmen: Batsman[];
  bowlers: Bowler[];
}

export interface Round {
  round: string;
  opponentId: string | null;
  won: boolean | null;
}

export function emptyInnings(): Innings {
  return { runs: 0, wickets: 0, balls: 0, events: [], milestones: [], batsmen: [], bowlers: [] };
}

/** The three bowlers from a side: anyone whose role suggests they can bowl. */
export function pickBowlers(team: Team): Bowler[] {
  const suited = team.players.filter((p) => {
    const r = p.role.toLowerCase();
    return r.includes("bowl") || r.includes("spinner") || r.includes("all-rounder");
  });
  return (suited.length > 0 ? suited : team.players)
    .slice(0, 3)
    .map((p) => ({ name: p.name, balls: 0, runs: 0, wickets: 0 }));
}

/**
 * Six batting slots so a fifth-wicket collapse still has someone on strike.
 *
 * Every squad in the data has exactly five players, so slicing to
 * `WICKETS + 1` used to return only five slots. The match reducer then sets
 * the next striker to `wickets + 1`, which is index 5 after the fourth
 * wicket — one past the end of the array — and the following delivery threw
 * on `batsmen[5].runs`. Pad the order so the slot the reducer reaches always
 * exists, whatever a squad's real size.
 */
export function newInnings(batting: Team, bowling: Team): Innings {
  const slots = WICKETS + 1;
  const named = batting.players.slice(0, slots);
  const order = [...named];
  for (let i = named.length; i < slots; i++) {
    order.push({ name: "Next man in", role: "Batsman", stat: "" });
  }
  return {
    runs: 0,
    wickets: 0,
    balls: 0,
    events: [],
    milestones: [],
    batsmen: order.map((p) => ({
      name: p.name,
      role: p.role,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
    })),
    bowlers: pickBowlers(bowling),
  };
}

/** Everything the simulation needs, resolved to concrete teams. */
export interface MatchCtx {
  overs: number;
  difficulty: Difficulty;
  innings: 1 | 2;
  userAction: Role;
  first: Innings;
  second: Innings;
  batting: Team;
  bowling: Team;
}

export function currentInnings(ctx: Pick<MatchCtx, "innings" | "first" | "second">): Innings {
  return ctx.innings === 1 ? ctx.first : ctx.second;
}

export function allTeamsFor(type: TourneyType, league: League, playerTeamId: string): Team[] {
  const pool = type === "domestic" ? (LEAGUE_TEAMS[league.id] ?? []) : INTERNATIONAL_TEAMS;
  return pool.filter((t) => t.id !== playerTeamId);
}

export function teamById(type: TourneyType, league: League, id: string | null): Team | null {
  if (!id) return null;
  const pool = type === "domestic" ? (LEAGUE_TEAMS[league.id] ?? []) : INTERNATIONAL_TEAMS;
  return pool.find((t) => t.id === id) ?? null;
}

export function poolFor(type: TourneyType, league: League): Team[] {
  return type === "domestic" ? (LEAGUE_TEAMS[league.id] ?? []) : INTERNATIONAL_TEAMS;
}

/** Weighted random pick; weights are floored so nothing is ever impossible. */
export function pickWeighted<T>(items: T[], weight: (item: T) => number): T {
  const weights = items.map((i) => Math.max(0.5, weight(i)));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return items[i]!;
  }
  return items[0]!;
}

/** The delivery the AI bowler picks against the human batter. */
export function aiBowl(ctx: MatchCtx): Bowl {
  const inn = currentInnings(ctx);
  const ballsLeft = ctx.overs * 6 - inn.balls;
  return pickWeighted(BOWLS, (b) => {
    let w = 1;
    if (ballsLeft <= 6) w = b.id === "yorker" ? 2.5 : 1;
    if (inn.balls < 6) w = b.id === "swing" || b.id === "fast" ? 1.8 : 1;
    if (ctx.difficulty === "hard" && (b.id === "yorker" || b.id === "bouncer")) w *= 1.5;
    return w;
  });
}

/** The shot the AI batter plays against the human bowler's delivery. */
export function aiShot(ctx: MatchCtx, delivery: Bowl): Shot {
  const diff = DIFF_MODS[ctx.difficulty];
  const inn = currentInnings(ctx);
  const ballsLeft = ctx.overs * 6 - inn.balls;
  const needRate =
    ctx.innings === 2 && ballsLeft > 0 ? (ctx.first.runs - inn.runs + 1) / (ballsLeft / 6) : 0;

  return pickWeighted(SHOTS, (sh) => {
    const eff = EFFECTIVENESS[sh.id]?.[delivery.id] ?? 1;
    let w = eff * 10 * diff.aiAggression;
    if (needRate > 12) {
      if (sh.id === "loft" || sh.id === "pull") w *= 2;
    } else if (needRate > 9) {
      if (sh.id === "drive" || sh.id === "loft") w *= 1.5;
    }
    if (ctx.difficulty === "hard") {
      if ((delivery.id === "yorker" || delivery.id === "bouncer") && sh.risk === "V.High") w *= 0.4;
      if (delivery.id === "wide" && (sh.id === "drive" || sh.id === "cut")) w *= 1.8;
    }
    return w;
  });
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Resolve one delivery into runs/wicket, given the shot, the ball and the ratings. */
export function rollOutcome(
  ctx: MatchCtx,
  shot: Shot,
  delivery: Bowl,
  userIsBatting: boolean,
): BallEvent {
  const eff = EFFECTIVENESS[shot.id]?.[delivery.id] ?? 1;
  const teamFactor = (ctx.batting.rating - ctx.bowling.rating) / 100;
  const diff = DIFF_MODS[ctx.difficulty];
  const bonus = userIsBatting ? diff.userBatBonus : diff.userBowlBonus;

  const four = clamp(shot.boundary * eff * (1 + teamFactor + bonus), 0, 0.55);
  const six = clamp(shot.power * 0.15 * eff * (1 + teamFactor + bonus), 0, 0.35);
  // A human bowling gets a slightly better chance of taking the wicket.
  const wicket = clamp(
    (shot.wicket / eff) * (1 - teamFactor - bonus) * (userIsBatting ? 1 : 1.2),
    0.02,
    0.45,
  );

  const r = Math.random();
  if (r < wicket) return { runs: 0, wicket: true, four: false, six: false };
  if (r < wicket + six) return { runs: 6, wicket: false, four: false, six: true };
  if (r < wicket + six + four) return { runs: 4, wicket: false, four: true, six: false };

  const rr = Math.random();
  const runs = rr < 0.4 ? 0 : rr < 0.72 ? 1 : rr < 0.88 ? 2 : rr < 0.96 ? 3 : 0;
  return { runs, wicket: false, four: false, six: false };
}

export function commentaryKeyFor(outcome: BallEvent): CommentaryKey {
  if (outcome.wicket) return "wicket";
  if (outcome.six) return "six";
  if (outcome.four) return "four";
  if (outcome.runs === 0) return "dot";
  if (outcome.runs === 1) return "runs1";
  if (outcome.runs === 2) return "runs2";
  return "runs3";
}

export function randomCommentary(key: CommentaryKey): string {
  const lines = COMMENTARY[key] as readonly string[];
  return lines[Math.floor(Math.random() * lines.length)]!;
}

export const MILESTONES = [50, 100, 150, 200];

/** First milestone the innings has crossed but not yet celebrated. */
export function nextMilestone(runs: number, seen: number[]): number | null {
  for (const m of MILESTONES) {
    if (runs >= m && !seen.includes(m)) return m;
  }
  return null;
}

/** Knockout bracket: the final takes the strongest side not already used. */
export function buildRounds(
  type: TourneyType,
  league: League,
  playerTeamId: string,
  format: Format,
): Round[] {
  const pool = [...allTeamsFor(type, league, playerTeamId)].sort(() => Math.random() - 0.5);
  const rounds: Round[] = format.rounds.map((round, i) => ({
    round,
    opponentId: i < format.rounds.length - 1 ? (pool[i]?.id ?? null) : null,
    won: null,
  }));

  const used = new Set(rounds.map((r) => r.opponentId).filter(Boolean) as string[]);
  const rest = allTeamsFor(type, league, playerTeamId)
    .filter((t) => !used.has(t.id))
    .sort((a, b) => b.rating - a.rating);
  rounds[rounds.length - 1]!.opponentId = rest[0]?.id ?? pool[0]?.id ?? null;
  return rounds;
}

/** "12.3" style overs from a raw ball count. */
export function oversText(balls: number): string {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

/** Campaign points: your runs, 200 per win, 500 for lifting the trophy. */
export function campaignScore(careerRuns: number, matchesWon: number, champion: boolean): number {
  return careerRuns + 200 * matchesWon + (champion ? 500 : 0);
}

export interface StarPerformer {
  name: string;
  line: string;
  impact: number;
}

/**
 * Player of the match, worked out from the two scorecards rather than picked
 * at random.
 *
 * Batters are measured on runs. Bowlers are measured on wickets, each worth
 * about three runs, minus a share of what they conceded — so a tight spell
 * that goes wicketless still counts for something, and a three-for is not
 * outranked by a patient fifty.
 */
export function playerOfTheMatch(first: Innings, second: Innings): StarPerformer | null {
  const options: StarPerformer[] = [];
  for (const inn of [first, second]) {
    for (const b of inn.batsmen) {
      if (b.balls === 0) continue;
      options.push({ name: b.name, line: `${b.runs} off ${b.balls}`, impact: b.runs });
    }
    for (const bw of inn.bowlers) {
      if (bw.balls === 0) continue;
      const overs = bw.balls / 6;
      // `wickets`, not `wkts`. Getting that name wrong yields NaN, and a NaN
      // impact never wins a `>` comparison, so the figure would be dropped
      // from the reckoning without ever showing up as an error.
      options.push({
        name: bw.name,
        line: `${bw.wickets}/${bw.runs} from ${overs.toFixed(1)}`,
        impact: bw.wickets * 30 - bw.runs / 4 + Math.min(6, overs),
      });
    }
  }
  const valid = options.filter((o) => Number.isFinite(o.impact));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (b.impact > a.impact ? b : a));
}
