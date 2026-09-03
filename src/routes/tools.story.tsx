import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/story")({ component: StoryWritingKit });

const prompts: Record<string, string[]> = {
  "Romance": [
    "A letter arrives 20 years late, addressed to someone you've never met.",
    "Two strangers share the same recurring dream every night.",
    "You find a love letter in a used book at a thrift store — it's addressed to you.",
    "Your childhood imaginary friend turns out to be real.",
    "You discover a hidden room in your new apartment that someone else has been living in.",
  ],
  "Thriller": [
    "You wake up in a locked room with 5 strangers and a note: one of you is the killer.",
    "Your phone autocorrects to reveal messages you never sent.",
    "You receive a package with tomorrow's newspaper — you're on the front page.",
    "The last person on Earth hears a knock at the door.",
    "You find security footage of yourself doing something you have no memory of.",
  ],
  "Horror": [
    "Your shadow moves independently of your body.",
    "Every mirror in your house shows a slightly different version of you.",
    "You hear a voice through the baby monitor — it's yours, but coming from another room.",
    "The stop-motion figures in your child's room have moved since yesterday.",
    "You receive a phone call from your own number.",
  ],
  "Fantasy": [
    "You discover you can taste emotions as flavors.",
    "A door appears in your wall every full moon, leading to a different world.",
    "The creatures from your childhood nightmares have formed a union.",
    "You inherit a map to a place that doesn't exist on any other map.",
    "Words spoken in anger become physically visible, floating in the air.",
  ],
  "Sci-Fi": [
    "You wake up as the only human on a space station orbiting an unfamiliar planet.",
    "Time moves at different speeds in different rooms of your house.",
    "You find a USB drive containing 50 years of future news articles.",
    "Aliens make contact, but their message is a TikTok dance.",
    "You discover that déjà vu is actually your brain remembering a parallel universe.",
  ],
  "Islamic Fiction": [
    "A Quran teacher discovers that a student's ancestor wrote a lost commentary.",
    "During Hajj, a man finds a 300-year-old journal hidden in the Kaaba walls.",
    "A mosque's old key opens a door no one has entered in centuries.",
    "A calligrapher's pen writes words of someone who hasn't been born yet.",
    "During Laylat al-Qadr, every dua you make starts coming true — but with unexpected twists.",
  ],
  "Literary": [
    "A librarian discovers that the library's forgotten section contains books not yet written.",
    "You receive a letter from yourself, ten years in the future, with one instruction.",
    "A lighthouse keeper realizes the ships they've been warning are all from different centuries.",
    "Your autobiography writes itself while you sleep.",
    "The last conversation you ever have with someone turns out to be the one they remember forever.",
  ],
};

type Genre = keyof typeof prompts;

const moods = ["Hopeful", "Dark", "Whimsical", "Intense", "Melancholic"];

export default function StoryWritingKit() {
  const [tab, setTab] = useState<"characters" | "plot" | "prompts">("prompts");
  const [selectedGenre, setSelectedGenre] = useState<Genre | "">("");
  const [selectedMood, setSelectedMood] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");

  // Characters
  const [chars, setChars] = useState<{ name: string; role: string; traits: string[]; backstory: string; motivation: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("slashai-story-chars") || "[]"); } catch { return []; }
  });
  const [charName, setCharName] = useState("");
  const [charRole, setCharRole] = useState("hero");
  const [charTraits, setCharTraits] = useState<string[]>([]);
  const [charStory, setCharStory] = useState("");
  const [charMot, setCharMot] = useState("");

  const traitOptions = ["Brave", "Witty", "Loyal", "Mysterious", "Kind", "Cunning", "Strong", "Quiet", "Passionate", "Wise", "Reckless", "Compassionate"];

  const addChar = () => {
    if (!charName) return;
    const updated = [...chars, { name: charName, role: charRole, traits: charTraits, backstory: charStory, motivation: charMot }];
    setChars(updated);
    localStorage.setItem("slashai-story-chars", JSON.stringify(updated));
    setCharName(""); setCharTraits([]); setCharStory(""); setCharMot("");
  };

  const removeChar = (i: number) => {
    const updated = chars.filter((_, idx) => idx !== i);
    setChars(updated);
    localStorage.setItem("slashai-story-chars", JSON.stringify(updated));
  };

  // Plot
  const [plot, setPlot] = useState({ setup: "", rising: "", climax: "", falling: "", resolution: "" });

  const filterPrompts = () => {
    let pool: string[] = [];
    if (selectedGenre) pool = [...(prompts[selectedGenre] || [])];
    else pool = Object.values(prompts).flat();
    if (selectedMood) pool = pool.filter((_, i) => i % (moods.indexOf(selectedMood) + 2) === 0);
    return pool;
  };

  const shufflePrompt = () => {
    const pool = filterPrompts();
    setCurrentPrompt(pool[Math.floor(Math.random() * pool.length)] || "Write about something that changed you forever.");
  };

  const tabs = [
    { id: "prompts" as const, label: "✨ Prompts" },
    { id: "characters" as const, label: "👤 Characters" },
    { id: "plot" as const, label: "🗺️ Plot" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📖 Story Writing Kit</h1>
          <p className="text-sm text-muted-foreground">Plan, write and structure stories</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Prompts Tab */}
        {tab === "prompts" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Filter</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setSelectedGenre(""); setCurrentPrompt(""); }} className={`rounded-lg px-3 py-1.5 text-xs ${!selectedGenre ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>All</button>
                {(Object.keys(prompts) as Genre[]).map((g) => (
                  <button key={g} onClick={() => { setSelectedGenre(g); setCurrentPrompt(""); }} className={`rounded-lg px-3 py-1.5 text-xs ${selectedGenre === g ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>{g}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button key={m} onClick={() => setSelectedMood(selectedMood === m ? "" : m)} className={`rounded-lg px-3 py-1.5 text-xs ${selectedMood === m ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>{m}</button>
                ))}
              </div>
              <button onClick={shufflePrompt} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">🎲 Random Prompt</button>
            </div>

            {currentPrompt && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                <p className="text-lg font-medium text-foreground">{currentPrompt}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Browse Prompts</h3>
              {filterPrompts().map((p, i) => (
                <button key={i} onClick={() => setCurrentPrompt(p)} className="w-full rounded-xl border border-border bg-surface p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Characters Tab */}
        {tab === "characters" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Create Character</h3>
              <input value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="Character name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <select value={charRole} onChange={(e) => setCharRole(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                {["hero", "villain", "mentor", "comic relief", "love interest", "sidekick"].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Personality Traits</p>
                <div className="flex flex-wrap gap-2">
                  {traitOptions.map((t) => (
                    <button key={t} onClick={() => setCharTraits((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])} className={`rounded-lg px-2 py-1 text-xs ${charTraits.includes(t) ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={charStory} onChange={(e) => setCharStory(e.target.value)} placeholder="Backstory..." rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <input value={charMot} onChange={(e) => setCharMot(e.target.value)} placeholder="Motivation / Goal / Fear" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <button onClick={addChar} disabled={!charName} className="w-full rounded-xl bg-primary py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Add Character</button>
            </div>

            <div className="space-y-2">
              {chars.map((c, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{c.name}</h4>
                    <button onClick={() => removeChar(i)} className="text-xs text-red-400">Remove</button>
                  </div>
                  <p className="text-xs text-primary capitalize">{c.role}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.traits.map((t) => <span key={t} className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{t}</span>)}
                  </div>
                  {c.backstory && <p className="mt-2 text-xs text-muted-foreground">{c.backstory}</p>}
                  {c.motivation && <p className="mt-1 text-xs text-muted-foreground">🎯 {c.motivation}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plot Tab */}
        {tab === "plot" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">5-Act Story Structure</h3>
              {([
                { key: "setup" as const, label: "1. Setup", color: "#58a6ff" },
                { key: "rising" as const, label: "2. Rising Action", color: "#3fb950" },
                { key: "climax" as const, label: "3. Climax", color: "#d29922" },
                { key: "falling" as const, label: "4. Falling Action", color: "#f0883e" },
                { key: "resolution" as const, label: "5. Resolution", color: "#a371f7" },
              ]).map((act) => (
                <div key={act.key} className="mb-3">
                  <label className="mb-1 flex items-center gap-2 text-sm text-foreground">
                    <span className="h-3 w-3 rounded-full inline-block" style={{ background: act.color }} />
                    {act.label}
                  </label>
                  <textarea
                    value={plot[act.key]}
                    onChange={(e) => setPlot((p) => ({ ...p, [act.key]: e.target.value }))}
                    placeholder={`What happens in ${act.label.toLowerCase()}...`}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              ))}
            </div>

            {/* Visual arc */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Story Arc</h3>
              <svg viewBox="0 0 400 120" className="w-full">
                <path d="M 20 100 Q 100 100, 160 40 Q 200 0, 240 40 Q 300 100, 380 100" fill="none" stroke="#58a6ff" strokeWidth="2" />
                <circle cx={40} cy={95} r={5} fill="#58a6ff" /><text x={40} y={115} textAnchor="middle" fill="#8b949e" fontSize="8">Setup</text>
                <circle cx={140} cy={50} r={5} fill="#3fb950" /><text x={140} y={115} textAnchor="middle" fill="#8b949e" fontSize="8">Rising</text>
                <circle cx={200} cy={15} r={6} fill="#d29922" /><text x={200} y={115} textAnchor="middle" fill="#8b949e" fontSize="8">Climax</text>
                <circle cx={260} cy={50} r={5} fill="#f0883e" /><text x={260} y={115} textAnchor="middle" fill="#8b949e" fontSize="8">Falling</text>
                <circle cx={360} cy={95} r={5} fill="#a371f7" /><text x={360} y={115} textAnchor="middle" fill="#8b949e" fontSize="8">End</text>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
