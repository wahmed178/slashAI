import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/calorie")({
  head: () => ({
    meta: [
      { title: "Calorie & Macro Tracker — SlashAI" },
      { name: "description", content: "Track daily calories, protein, carbs and fat locally on your device — private, free, works offline." },
    ],
  }),
  component: CalorieTracker,
});

const STORAGE_KEY = "slashai-calorie-log";
const SETTINGS_KEY = "slashai-calorie-settings";

const defaultGoals = { calories: 2000, protein: 150, carbs: 250, fat: 65 };
type MealType = string;
const mealTypes: MealType[] = ["Sehri / Breakfast", "Lunch", "Iftar / Dinner", "Snack"];

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: MealType;
  date: string;
}

export default function CalorieTracker() {
  const [entries, setEntries] = useState<FoodEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [goals, setGoals] = useState<{ calories: number; protein: number; carbs: number; fat: number }>(() => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultGoals)); } catch { return defaultGoals; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, meal: mealTypes[0] as string });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(goals)); }, [goals]);

  const today = new Date().toISOString().split("T")[0] ?? new Date().toLocaleDateString();
  const todayEntries = entries.filter((e) => e.date === today);

  const totals = todayEntries.reduce(
    (acc, e) => ({ cal: acc.cal + e.calories, pro: acc.pro + e.protein, carb: acc.carb + e.carbs, fat: acc.fat + e.fat }),
    { cal: 0, pro: 0, carb: 0, fat: 0 }
  );

  const pct = (val: number, goal: number) => Math.min(100, (val / goal) * 100);

  const searchFood = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&fields=product_name,nutriments&page_size=8`);
      const data = await res.json();
      setSearchResults(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data.products || []).map((p: any) => ({
          name: String(p.product_name || "Unknown"),
          calories: Math.round(Number(p.nutriments?.['energy-kcal_100g']) || 0),
          protein: Math.round(Number(p.nutriments?.proteins_100g) || 0),
          carbs: Math.round(Number(p.nutriments?.carbohydrates_100g) || 0),
          fat: Math.round(Number(p.nutriments?.fat_100g) || 0),
        })).filter((f: { name: string }) => f.name !== "Unknown")
      );
    } catch { setSearchResults([]); }
  };

  const addFromSearch = (food: typeof searchResults[0]) => {
    const entry: FoodEntry = { id: Date.now().toString(), ...food, meal: newFood.meal, date: today };
    setEntries((prev) => [entry, ...prev]);
  };

  const addManual = () => {
    if (!newFood.name || !newFood.calories) return;
    const entry: FoodEntry = { id: Date.now().toString(), ...newFood, date: today };
    setEntries((prev) => [entry, ...prev]);
    setNewFood({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, meal: mealTypes[0] ?? 'Sehri / Breakfast' });
    setShowAdd(false);
  };

  const deleteEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const Ring = ({ value, goal, color, label }: { value: number; goal: number; color: string; label: string }) => {
    const p = pct(value, goal);
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#21262d" strokeWidth="3" />
            <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${p} ${100 - p}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-foreground">{Math.round(value)}</span>
          </div>
        </div>
        <span className="mt-1 text-xs text-muted-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground/60">{Math.round(p)}% of {goal}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">🥗 Calorie & Macro Tracker</h1>
            <p className="text-sm text-muted-foreground">Track daily calories and macros — no account needed</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90">+ Add Food</button>
        </div>

        {/* Progress Rings */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex justify-around">
            <Ring value={totals.cal} goal={goals.calories} color="#3fb950" label="Calories" />
            <Ring value={totals.pro} goal={goals.protein} color="#58a6ff" label="Protein" />
            <Ring value={totals.carb} goal={goals.carbs} color="#d29922" label="Carbs" />
            <Ring value={totals.fat} goal={goals.fat} color="#f85149" label="Fat" />
          </div>
        </div>

        {/* Add food */}
        {showAdd && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Search Food (Open Food Facts)</h3>
            <input value={searchQuery} onChange={(e) => searchFood(e.target.value)} placeholder="Search food name..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            {searchResults.length > 0 && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((f, i) => (
                  <button key={i} onClick={() => addFromSearch(f)} className="flex w-full items-center justify-between rounded-lg bg-background p-2 text-left text-xs text-foreground hover:bg-primary/10">
                    <span className="truncate flex-1">{f.name}</span>
                    <span className="ml-2 text-muted-foreground">{f.calories}cal | P:{f.protein}g C:{f.carbs}g F:{f.fat}g</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-1">
              {mealTypes.map((m) => (
                <button key={m} onClick={() => setNewFood((f) => ({ ...f, meal: m }))} className={`flex-1 rounded-lg px-2 py-1.5 text-xs ${newFood.meal === m ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>
                  {m.split(" /")[0]}
                </button>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-foreground">Or Add Manually</h3>
            <div className="grid grid-cols-5 gap-2">
              <input value={newFood.name} onChange={(e) => setNewFood((f) => ({ ...f, name: e.target.value }))} placeholder="Food name" className="col-span-5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground" />
              <input type="number" placeholder="Cal" value={newFood.calories || ""} onChange={(e) => setNewFood((f) => ({ ...f, calories: Number(e.target.value) }))} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground" />
              <input type="number" placeholder="Protein" value={newFood.protein || ""} onChange={(e) => setNewFood((f) => ({ ...f, protein: Number(e.target.value) }))} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground" />
              <input type="number" placeholder="Carbs" value={newFood.carbs || ""} onChange={(e) => setNewFood((f) => ({ ...f, carbs: Number(e.target.value) }))} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground" />
              <input type="number" placeholder="Fat" value={newFood.fat || ""} onChange={(e) => setNewFood((f) => ({ ...f, fat: Number(e.target.value) }))} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground" />
              <button onClick={addManual} disabled={!newFood.name} className="rounded-lg bg-primary px-2 py-1.5 text-xs font-semibold text-background disabled:opacity-40">Add</button>
            </div>
          </div>
        )}

        {/* Goals */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Daily Goals</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: "calories" as const, label: "Calories", color: "#3fb950" },
              { key: "protein" as const, label: "Protein (g)", color: "#58a6ff" },
              { key: "carbs" as const, label: "Carbs (g)", color: "#d29922" },
              { key: "fat" as const, label: "Fat (g)", color: "#f85149" },
            ].map((g) => (
              <div key={g.key}>
                <label className="mb-1 text-xs" style={{ color: g.color }}>{g.label}</label>
                <input type="number" value={goals[g.key]} onChange={(e) => setGoals((prev) => ({ ...prev, [g.key]: Number(e.target.value) }))} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Today's Log */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Today's Log ({todayEntries.length} items)</h3>
          {todayEntries.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No food logged today</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {todayEntries.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
                  <span className="text-xs text-primary">{e.meal.split(" /")[0]}</span>
                  <span className="flex-1 truncate text-foreground">{e.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{e.calories}cal | P:{e.protein}g</span>
                  <button onClick={() => deleteEntry(e.id)} className="ml-2 text-red-400">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
