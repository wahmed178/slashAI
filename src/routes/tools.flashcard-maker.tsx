import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/flashcard-maker")({ component: FlashcardMaker });

interface Card { id: string; front: string; back: string; ease: number; interval: number; nextReview: number }

const LS_KEY = "slashai.flashcards";

function FlashcardMaker() {
  const [decks, setDecks] = useState<Record<string, Card[]>>(() => {
    try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : { default: [] }; } catch { return { default: [] }; }
  });
  const [activeDeck, setActiveDeck] = useState("default");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [studying, setStudying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(decks)); } catch {} }, [decks]);

  const cards = decks[activeDeck] || [];
  const currentCard = cards[currentIdx];

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setDecks(d => ({ ...d, [activeDeck]: [...(d[activeDeck] || []), { id: crypto.randomUUID(), front: front.trim(), back: back.trim(), ease: 2.5, interval: 1, nextReview: Date.now() }] }));
    setFront(""); setBack("");
  };

  const gradeCard = useCallback((quality: number) => {
    if (!currentCard) return;
    const updated = { ...currentCard };
    if (quality < 2) { updated.interval = 1; updated.ease = Math.max(1.3, updated.ease - 0.2); }
    else { updated.interval = Math.round(updated.interval * updated.ease); updated.ease = Math.min(3.0, updated.ease + 0.1); }
    updated.nextReview = Date.now() + updated.interval * 86400000;
    setDecks(d => ({ ...d, [activeDeck]: (d[activeDeck] || []).map(c => c.id === updated.id ? updated : c) }));
    setShowBack(false);
    setCurrentIdx(i => (i + 1) % cards.length);
  }, [currentCard, cards.length, activeDeck]);

  const addDeck = () => { if (!newDeckName.trim()) return; setDecks(d => ({ ...d, [newDeckName.trim()]: [] })); setActiveDeck(newDeckName.trim()); setNewDeckName(""); };

  if (studying && currentCard) {
    return (
      <AppShell title="Flashcards">
        <div className="flex flex-col items-center py-10">
          <p className="mb-2 text-xs text-muted-foreground">Card {currentIdx + 1} of {cards.length}</p>
          <div className="mb-6 flex h-64 w-full max-w-lg cursor-pointer items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center transition-all hover:border-primary/40"
            onClick={() => setShowBack(!showBack)}>
            <p className="text-lg font-medium text-foreground">{showBack ? currentCard.back : currentCard.front}</p>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">{showBack ? "How well did you know this?" : "Click card to reveal answer"}</p>
          {showBack && (
            <div className="flex gap-2">
              <button onClick={() => gradeCard(0)} className="rounded-lg bg-red-500/20 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/30">Wrong</button>
              <button onClick={() => gradeCard(2)} className="rounded-lg bg-yellow-500/20 px-4 py-2 text-xs font-medium text-yellow-400 hover:bg-yellow-500/30">Hard</button>
              <button onClick={() => gradeCard(4)} className="rounded-lg bg-green-500/20 px-4 py-2 text-xs font-medium text-green-400 hover:bg-green-500/30">Easy</button>
            </div>
          )}
          <button onClick={() => { setStudying(false); setCurrentIdx(0); }} className="mt-6 text-xs text-muted-foreground hover:text-foreground">← Back to cards</button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Flashcards">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧠 Flashcard Maker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your own flashcard decks. Study with spaced repetition.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Decks</h3>
            <div className="flex gap-1.5">
              <input value={newDeckName} onChange={e => setNewDeckName(e.target.value)} onKeyDown={e => e.key === "Enter" && addDeck()} placeholder="New deck..." className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <button onClick={addDeck} className="h-8 rounded-lg bg-primary px-2 text-xs text-primary-foreground">+</button>
            </div>
            <div className="mt-2 space-y-1">
              {Object.keys(decks).map(d => (
                <button key={d} onClick={() => setActiveDeck(d)} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${activeDeck === d ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface-elevated"}`}>
                  <span>{d}</span><span>{(decks[d] || []).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Add Card</h3>
            <input value={front} onChange={e => setFront(e.target.value)} placeholder="Front (question)" className="mb-1.5 h-8 w-full rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
            <input value={back} onChange={e => setBack(e.target.value)} placeholder="Back (answer)" className="mb-1.5 h-8 w-full rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
            <button onClick={addCard} className="h-8 w-full rounded-lg bg-surface-elevated text-xs font-medium hover:bg-accent">+ Add Card</button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Cards ({cards.length})</h2>
            {cards.length > 0 && (
              <button onClick={() => { setStudying(true); setCurrentIdx(0); setShowBack(false); }}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                Study ({cards.length} cards)
              </button>
            )}
          </div>
          <div className="space-y-2">
            {cards.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{c.front}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{c.back}</p>
                </div>
                <button onClick={() => setDecks(d => ({ ...d, [activeDeck]: (d[activeDeck] || []).filter(x => x.id !== c.id) }))}
                  className="ml-2 text-[10px] text-muted-foreground hover:text-red-400">×</button>
              </div>
            ))}
            {cards.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No cards yet. Add some above.</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
