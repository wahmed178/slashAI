import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Camera,
  Heart,
  MessageCircle,
  Play,
  Repeat2,
  Music2,
  Search,
  Send,
  UserRound,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { CAT_PALETTE } from "@/lib/category-colors";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/slash/slashgram")({
  head: () => ({
    meta: [
      { title: "SlashGram - the fictional social media simulator | SlashAI" },
      {
        name: "description",
        content:
          "Create a fake profile, post, and watch fictional likes, comments and followers roll in across Instagram, X, YouTube and TikTok-style networks. A parody simulator - nothing is real, nothing is uploaded.",
      },
    ],
  }),
  component: SlashGramPage,
});

/* ──────────── types & persistence ──────────── */

type Network = "gram" | "x" | "tube" | "tok";

interface Post {
  id: string;
  network: Network;
  text: string;
  createdAt: number;
  likes: number;
  comments: FakeComment[];
  shares: number;
  viral: boolean;
}

interface Profile {
  handle: string;
  displayName: string;
  bio: string;
  emoji: string;
  followers: number;
}

interface SlashGramState {
  profile: Profile | null;
  posts: Post[];
}

const KEY = "slashgram.state.v1";

const EMPTY: SlashGramState = { profile: null, posts: [] };

function load(): SlashGramState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as SlashGramState;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return {
      profile: parsed.profile ?? null,
      posts: Array.isArray(parsed.posts) ? parsed.posts.slice(0, 60) : [],
    };
  } catch {
    return EMPTY;
  }
}

function save(state: SlashGramState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode - session only */
  }
}

/* ──────────── fake world data ──────────── */

const NETWORKS: {
  id: Network;
  name: string;
  emoji: string;
  tint: string;
  placeholder: string;
  metric: string;
}[] = [
  { id: "gram", name: "Gram", emoji: "📸", tint: CAT_PALETTE.pink.hex, placeholder: "Share a moment… #filter #vibes", metric: "likes" },
  { id: "x", name: "Xphere", emoji: "🐦", tint: CAT_PALETTE.sky.hex, placeholder: "What's happening? (280 chars of chaos)", metric: "reposts" },
  { id: "tube", name: "Tube", emoji: "▶️", tint: CAT_PALETTE.red.hex, placeholder: "Title your next upload…", metric: "views" },
  { id: "tok", name: "TokTok", emoji: "🎵", tint: CAT_PALETTE.fuchsia.hex, placeholder: "Describe the video vibe… #fyp", metric: "hearts" },
];

const COMMENT_POOL: { text: string; handle: string }[] = [
  { handle: "pixel_pete", text: "this is going viral, calling it now 🔥" },
  { handle: "midnight.dosa", text: "the algorithm finally did something right" },
  { handle: "quietqazi", text: "genuinely no notes. this is perfect" },
  { handle: "chai_over_everything", text: "screaming crying throwing up (positive)" },
  { handle: "404_baniya", text: "saving this for later inspiration" },
  { handle: "not_a_bot_42", text: "first!! great post btw" },
  { handle: "sunkencoffee", text: "how does this only have this many likes??" },
  { handle: "delhite_beaches", text: "the vibes are immaculate" },
  { handle: "grocerygoblin", text: "posting this to my story immediately" },
  { handle: "monsoon_melodies", text: "okay this actually made my day" },
  { handle: "thrifted_tuxedo", text: "we need a collab asap" },
  { handle: "loud_library", text: "unhinged in the best way possible" },
  { handle: "samovar_sam", text: "came for the [REDACTED], stayed for this" },
  { handle: "wander__wombles", text: "the way I GASPED" },
  { handle: "nano_banana_fan", text: "AI could never (you're clearly human)" },
  { handle: "processKill", text: "poetry. no further questions" },
  { handle: "hostel.survivor", text: "tagging everyone I know" },
  { handle: "deadlines_loom", text: "how are you so consistent??" },
  { handle: "ghibli_gremlin", text: "this deserves a museum wing" },
  { handle: "instant_karma_fan", text: "the internet needed this today" },
  { handle: "wifi_warrior", text: "screenshot taken. this is history" },
  { handle: "midjourney_dropout", text: "respect the hustle" },
  { handle: "silence_is_golden", text: "…speechless. following." },
  { handle: "monsoon_memes", text: "certified classic" },
];

const VIRAL_COMMENTS: { text: string; handle: string }[] = [
  { handle: "the_actual_celebrity", text: "this is amazing 😳" },
  { handle: "huge.meme.page", text: "DMing you about a feature" },
  { handle: "brand_account", text: "We love this! Check your inbox 💌" },
  { handle: "verified_person", text: "okay you win the internet today" },
  { handle: "1m_follower_page", text: "reposting with credit, this is too good" },
];

const BIO_TEMPLATES = [
  "professional overthinker 🧠 | part-time legend",
  "just here for the vibes ✨",
  "documenting my descent into [hobby]",
  "ceo of doing too much at once",
  "your daily dose of chaos and chai ☕",
  "aspiring household name 🏠",
  "recovering perfectionist. recovering.",
  "somewhere between a nap and a dream",
];

const EMOJI_AVATARS = ["🦊", "🐙", "🦉", "🐝", "🦋", "🐳", "🦖", "🌵", "🍕", "👾", "🤠", "🧙"];

/* ──────────── helpers ──────────── */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function baseLikes(network: Network, seed: number): number {
  const rand = mulberry(seed);
  switch (network) {
    case "gram": return Math.floor(40 + rand() * 600);
    case "x": return Math.floor(10 + rand() * 300);
    case "tube": return Math.floor(500 + rand() * 40_000);
    case "tok": return Math.floor(100 + rand() * 9_000);
  }
}

/* ──────────── page ──────────── */

function SlashGramPage() {
  const [state, setState] = useState<SlashGramState>(() => load());
  const [tab, setTab] = useState<Network>("gram");
  const [draft, setDraft] = useState("");
  const [pulse, setPulse] = useState<string | null>(null); // post id that just gained engagement

  useEffect(() => save(state), [state]);

  // fake engagement ticker - posts gain likes over time
  useEffect(() => {
    const t = setInterval(() => {
      setState((prev) => {
        if (prev.posts.length === 0) return prev;
        let changed = false;
        const posts = prev.posts.map((p) => {
          const age = Date.now() - p.createdAt;
          if (age > 1000 * 60 * 60 * 24) return p; // stop growth after a day
          const rand = mulberry(hashStr(p.id + Math.floor(Date.now() / 4000)));
          const growth = p.viral
            ? Math.floor(rand() * Math.max(3, p.likes * 0.004))
            : Math.floor(rand() * 4);
          if (growth <= 0) return p;
          changed = true;
          return { ...p, likes: p.likes + growth };
        });
        if (!changed) return prev;
        return { ...prev, posts };
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const network = NETWORKS.find((n) => n.id === tab)!;
  const feed = useMemo(
    () =>
      state.posts
        .filter((p) => p.network === tab)
        .sort((a, b) => b.createdAt - a.createdAt),
    [state.posts, tab],
  );
  const totalEngagement = useMemo(
    () =>
      state.posts.reduce(
        (acc, p) => acc + p.likes + p.shares * 3 + p.comments.length * 5,
        0,
      ),
    [state.posts],
  );

  /* ── onboarding: create the fake account ── */
  if (!state.profile) {
    return <Onboarding onCreate={(profile) => setState({ profile, posts: [] })} />;
  }

  const profile = state.profile;

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    const id = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
    const seed = hashStr(id + text);
    const rand = mulberry(seed);
    const viral = rand() < 0.18; // 18% of posts go fictional-viral
    const likes = baseLikes(tab, seed) * (viral ? 6 : 1);
    const commentCount = viral ? 5 + Math.floor(rand() * 4) : 2 + Math.floor(rand() * 3);
    const pool = viral
      ? [...VIRAL_COMMENTS, ...COMMENT_POOL]
      : COMMENT_POOL;
    const comments: FakeComment[] = Array.from({ length: commentCount }, (_, i) => {
      const c = pool[Math.floor(rand() * pool.length)] ?? { handle: "lurker_404", text: "⭐ first" };
      return {
        id: `${id}-c${i}`,
        handle: c.handle,
        text: c.text,
        likes: Math.floor(rand() * (viral ? 4000 : 60)),
      };
    });
    const followersGain = viral ? 500 + Math.floor(rand() * 20_000) : Math.floor(rand() * 40);
    setState((prev) => ({
      profile: prev.profile
        ? { ...prev.profile, followers: prev.profile.followers + followersGain }
        : null,
      posts: [
        {
          id, network: tab, text, createdAt: Date.now(),
          likes, comments, shares: Math.floor(likes * (0.02 + rand() * 0.08)), viral,
        },
        ...prev.posts,
      ],
    }));
    setDraft("");
    setPulse(id);
    setTimeout(() => setPulse(null), 2500);
  };

  return (
    <AppShell wide hideHeaderSearch title="SlashGram">
      <div className="mx-auto max-w-[540px]">
        {/* profile header */}
        <header className="page-enter flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f472b6] via-[#a78bfa] to-[#38bdf8] text-[30px]">
            {profile.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[15px] font-bold text-foreground">
              @{profile.handle}
              <BadgeCheck className="size-4 text-primary" aria-hidden />
            </p>
            <p className="truncate text-[12.5px] text-muted-foreground">{profile.bio}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              <span className="font-bold text-foreground">{fmt(profile.followers)}</span> fictional followers ·{" "}
              <span className="font-bold text-foreground">{fmt(totalEngagement)}</span> total engagement
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this fictional account and start over?")) {
                setState({ profile: null, posts: [] });
              }
            }}
            className="ripple-press rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
        </header>

        {/* network switcher */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {NETWORKS.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)}
              className={`ripple-press flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold transition-all duration-200 ${
                tab === n.id
                  ? "text-white shadow-md"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
              style={tab === n.id ? { background: `linear-gradient(135deg, ${n.tint}, color-mix(in oklab, ${n.tint} 55%, #a78bfa))` } : undefined}
            >
              <span>{n.emoji}</span> {n.name}
            </button>
          ))}
        </div>

        {/* composer */}
        <div className="mt-3 rounded-2xl border border-border bg-surface p-3">
          <div className="flex items-start gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-elevated text-[18px]">
              {profile.emoji}
            </span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 280))}
              placeholder={network.placeholder}
              rows={2}
              className="min-h-[52px] flex-1 resize-none bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] tabular-nums text-muted-foreground">{280 - draft.length}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                {viralOdds(draft)}% viral chance
              </span>
              <button
                type="button"
                onClick={post}
                disabled={!draft.trim()}
                className="ripple-press inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-bold text-white transition-all duration-150 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${network.tint}, color-mix(in oklab, ${network.tint} 55%, #a78bfa))` }}
              >
                <Send className="size-3.5" /> Post
              </button>
            </div>
          </div>
        </div>

        {/* feed */}
        <div className="mt-4 flex flex-col gap-3">
          {feed.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="text-[32px]">{network.emoji}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Your first {network.name} post awaits
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Write something above and watch the fictional numbers roll in. 18% of posts go "viral".
              </p>
            </div>
          ) : (
            feed.map((p) => (
              <FakePostCard key={p.id} post={p} network={network} fresh={pulse === p.id} />
            ))
          )}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          SlashGram is a parody simulator. Accounts, likes, comments and virality are fictional
          and stored only in your browser. No real social networks involved - it's a toy for
          imagining the clout.
        </p>
      </div>
    </AppShell>
  );
}

/* longer posts + hashtags slightly bump the (fictional) odds display */
function viralOdds(text: string): number {
  const base = 18;
  const hashtags = (text.match(/#\w+/g) ?? []).length;
  const bonus = Math.min(12, hashtags * 3) + (text.length > 80 ? 4 : 0);
  return Math.min(48, base + bonus);
}

interface FakeComment {
  id: string;
  handle: string;
  text: string;
  likes: number;
}

/* ──────────── post card ──────────── */

function FakePostCard({
  post,
  network,
  fresh,
}: {
  post: Post;
  network: (typeof NETWORKS)[number];
  fresh: boolean;
}) {
  const rand = useMemo(() => mulberry(hashStr(post.id)), [post.id]);
  const verified = rand() < 0.12;
  const isVideo = post.network === "tube" || post.network === "tok";

  return (
    <article
      className={`feed-in rounded-2xl border bg-surface transition-all duration-500 ${
        fresh ? "border-[color-mix(in_oklab,var(--primary)_60%,transparent)] shadow-lg shadow-primary/10" : "border-border"
      }`}
    >
      {/* post header */}
      <div className="flex items-center gap-2.5 p-3 pb-2">
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#f472b6] via-[#a78bfa] to-[#38bdf8] text-[17px]">
          {["🦊", "🐙", "🦉", "🐝", "🦋", "🐳", "🦖", "🌵", "🍕", "👾"][hashStr(post.id) % 10]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[12.5px] font-bold text-foreground">
            you
            {verified && <BadgeCheck className="size-3.5 text-primary" aria-hidden />}
          </p>
          <p className="text-[10.5px] text-muted-foreground">
            {network.name} · {timeAgo(post.createdAt)}
          </p>
        </div>
        {post.viral && (
          <span className="rounded-full bg-gradient-to-r from-[#f472b6] to-[#a78bfa] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wide text-white">
            Viral
          </span>
        )}
      </div>

      {/* body / fake media */}
      <div className="px-3 pb-2">
        {isVideo && (
          <div
            className="mb-2 flex aspect-video items-center justify-center rounded-xl border border-border"
            style={{ background: `color-mix(in oklab, ${network.tint} 10%, var(--surface-elevated))` }}
          >
            <span className="grid size-12 place-items-center rounded-full bg-background/70">
              {post.network === "tube" ? <Play className="size-5 text-foreground" /> : <Music2 className="size-5 text-foreground" />}
            </span>
          </div>
        )}
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">{post.text}</p>
      </div>

      {/* metrics row */}
      <div className="flex items-center gap-4 px-3 pb-3 pt-1 text-muted-foreground">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          <Heart className="size-4 fill-current" style={{ color: network.tint }} />
          {fmt(post.likes)}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          <MessageCircle className="size-4" />
          {post.comments.length}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          {post.network === "x" ? <Repeat2 className="size-4" /> : <Send className="size-4" />}
          {fmt(post.shares)}
        </span>
      </div>

      {/* comments */}
      {post.comments.length > 0 && (
        <div className="border-t border-border px-3 py-2.5">
          <p className="mb-1.5 text-[11px] font-bold text-muted-foreground">Comments</p>
          <div className="flex flex-col gap-1.5">
            {post.comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-[12.5px] leading-snug">
                  <span className="font-bold text-foreground">@{c.handle}</span>{" "}
                  <span className="text-muted-foreground">{c.text}</span>
                </p>
                <span className="flex shrink-0 items-center gap-0.5 text-[10.5px] text-muted-foreground">
                  <Heart className="size-3" /> {fmt(c.likes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/* ──────────── onboarding ──────────── */

function Onboarding({ onCreate }: { onCreate: (p: Profile) => void }) {
  const [handle, setHandle] = useState("");
  const [display, setDisplay] = useState("");
  const [bio, setBio] = useState(
    () => BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)] ?? "just here for the vibes",
  );
  const [emoji, setEmoji] = useState(
    () => EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)] ?? "😎",
  );

  const clean = handle.trim().toLowerCase().replace(/[^a-z0-9._]/g, "");
  const valid = clean.length >= 3;

  return (
    <AppShell wide hideHeaderSearch title="SlashGram">
      <div className="mx-auto max-w-[440px]">
        <header className="page-enter text-center">
          <p className="text-[44px]">📸</p>
          <h1 className="mt-2 bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#38bdf8] bg-clip-text text-2xl font-black tracking-tight text-transparent">
            SlashGram
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            The fictional social network. Create a parody account, post anything, and watch the
            fake likes, comments and millions of followers roll in - across four parody networks.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <p className="text-[13px] font-bold text-foreground">Create your simulator account</p>
          <div className="mt-4 flex flex-col gap-3.5">
            <div className="flex items-center justify-center">
              <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[#f472b6] via-[#a78bfa] to-[#38bdf8] text-[38px] shadow-lg">
                {emoji}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {EMOJI_AVATARS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`ripple-press grid size-9 place-items-center rounded-full text-[18px] transition-all ${
                    emoji === e ? "bg-primary/15 ring-2 ring-primary" : "bg-surface-elevated hover:bg-accent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Username</span>
              <div className="flex h-10 items-center rounded-lg border border-border bg-background px-3">
                <span className="text-[13px] text-muted-foreground">@</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.slice(0, 24))}
                  placeholder="yourname"
                  className="ml-0.5 flex-1 bg-transparent text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Display name (optional)</span>
              <input
                value={display}
                onChange={(e) => setDisplay(e.target.value.slice(0, 32))}
                placeholder="The Real You"
                className="h-10 rounded-lg border border-border bg-background px-3 text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 80))}
                rows={2}
                className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                valid &&
                onCreate({
                  handle: clean,
                  displayName: display.trim() || clean,
                  bio: bio.trim() || "just here for the vibes",
                  emoji,
                  followers: 12, // everyone starts with their 12 alt accounts
                })
              }
              disabled={!valid}
              className="ripple-press mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#38bdf8] text-[14px] font-black text-white transition-all disabled:opacity-40"
            >
              Enter the fictional world →
            </button>
            {!valid && clean.length > 0 && (
              <p className="text-center text-[11px] text-muted-foreground">Username needs 3+ letters/numbers.</p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-[11.5px] font-bold text-foreground">How the fiction works</p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[11.5px] leading-relaxed text-muted-foreground">
            <li>Every post gets instant fictional engagement - likes, comments, shares.</li>
            <li><span className="font-bold text-foreground">18% of posts go "viral"</span> - 6× engagement, celebrity comments, thousands of followers.</li>
            <li>Engagement keeps growing while the tab is open (up to 24 fictional hours).</li>
            <li>Four parody networks: Gram, Xphere, Tube and TokTok - each with its own vibe and numbers.</li>
            <li>Everything lives in your browser. No accounts, no uploads, no real social media.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
