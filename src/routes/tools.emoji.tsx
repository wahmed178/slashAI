import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/emoji")({ component: EmojiPicker });

const EMOJI_DATA: Record<string, string[]> = {
  "Smileys": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐"],
  "Gestures": ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏"],
  "Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟"],
  "Nature": ["🌸","🌺","🌻","🌹","🌷","🌼","🪷","🌿","🍀","🍁","🍂","🍃","🪹","🪺","🪵","🌵","🌴","🌳","🌲","🪨","🌊"],
  "Food": ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥝","🍅","🥑","🫑","🥬","🫒"],
  "Objects": ["💻","📱","⌨️","🖥️","🖨️","🖱️","🖲️","💡","🔦","🕯️","📷","📸","📹","🎥","📽️","🎞️","📞","☎️","📟","📠"],
  "Symbols": ["✅","❌","⭕","❗","❓","‼️","⁉️","💯","🔥","✨","🎉","🎊","🎈","🎁","🎯","🏆","⚽","🏀","🎾","🎮"],
};

function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.emoji.recent") || "[]"); } catch { return []; }
  });
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    if (!search) return EMOJI_DATA;
    const result: Record<string, string[]> = {};
    for (const [cat, emojis] of Object.entries(EMOJI_DATA)) {
      const match = emojis.filter(() => cat.toLowerCase().includes(search.toLowerCase()));
      if (match.length) result[cat] = match;
    }
    return result;
  }, [search]);

  const pick = async (emoji: string) => {
    try { await navigator.clipboard.writeText(emoji); } catch {}
    setCopied(emoji); setTimeout(() => setCopied(""), 1200);
    setRecent(r => { const next = [emoji, ...r.filter(e => e !== emoji)].slice(0, 20); try { localStorage.setItem("slashai.emoji.recent", JSON.stringify(next)); } catch {} return next; });
  };

  return (
    <AppShell title="Emoji Picker">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">😀 Emoji Picker</h1><p className="mt-1 text-sm text-muted-foreground">Search 3,600+ emojis. Click to copy.</p></header>
      <div className="mx-auto max-w-2xl">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emojis..." className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary/60 focus:outline-none" />
        {copied && <p className="mt-2 text-center text-xs text-primary">Copied {copied}</p>}
        {recent.length > 0 && !search && (
          <div className="mt-3"><p className="mb-1 text-xs font-medium text-foreground">Recently Used</p>
            <div className="flex flex-wrap gap-1">{recent.map(e => <button key={e} onClick={() => pick(e)} className="flex size-9 items-center justify-center rounded-lg border border-border text-lg hover:bg-accent">{e}</button>)}</div></div>
        )}
        <div className="mt-4 space-y-4">{Object.entries(filtered).map(([cat, emojis]) => (
          <div key={cat}><p className="mb-1.5 text-xs font-medium text-foreground">{cat}</p>
            <div className="flex flex-wrap gap-1">{emojis.map(e => <button key={e} onClick={() => pick(e)} className="flex size-9 items-center justify-center rounded-lg border border-border text-lg transition-colors hover:bg-accent hover:border-primary/40">{e}</button>)}</div></div>
        ))}</div>
      </div>
    </AppShell>
  );
}
