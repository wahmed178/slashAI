import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/plant")({ component: PlantTracker });

interface Plant { id: string; name: string; type: string; waterDays: number; lastWatered: string; notes: string }
const LS_KEY = "slashai.plants";

function PlantTracker() {
  const [plants, setPlants] = useState<Plant[]>(() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } });
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [waterDays, setWaterDays] = useState("7");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(plants)); } catch {} }, [plants]);

  const addPlant = () => {
    if (!name.trim()) return;
    setPlants(p => [...p, { id: crypto.randomUUID(), name: name.trim(), type: type.trim() || "Unknown", waterDays: parseInt(waterDays) || 7, lastWatered: new Date().toISOString().slice(0, 10), notes: "" }]);
    setName(""); setType(""); setShowAdd(false);
  };

  const waterPlant = (id: string) => setPlants(p => p.map(pl => pl.id === id ? { ...pl, lastWatered: new Date().toISOString().split("T")[0]! } : pl));
  const removePlant = (id: string) => setPlants(p => p.filter(pl => pl.id !== id));

  const getDaysUntilWater = (plant: Plant) => {
    const last = new Date(plant.lastWatered);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - last.getTime()) / 86400000);
    return plant.waterDays - daysSince;
  };

  const needsWater = plants.filter(p => getDaysUntilWater(p) <= 0);
  const upcoming = plants.filter(p => getDaysUntilWater(p) > 0).sort((a, b) => getDaysUntilWater(a) - getDaysUntilWater(b));

  return (
    <AppShell title="Plant Care">
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight text-foreground">🌱 Plant Care Tracker</h1><p className="mt-1 text-sm text-muted-foreground">Track when to water your plants.</p></div>
          <button onClick={() => setShowAdd(!showAdd)} className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">+ Add Plant</button>
        </div>
      </header>

      {showAdd && (
        <div className="mb-4 rounded-xl border border-border bg-surface p-3">
          <div className="grid grid-cols-3 gap-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Plant name" className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
            <input value={type} onChange={e => setType(e.target.value)} placeholder="Type (e.g. Fern)" className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
            <input type="number" value={waterDays} onChange={e => setWaterDays(e.target.value)} placeholder="Water every X days" className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
          </div>
          <button onClick={addPlant} className="mt-2 h-8 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground">Add</button>
        </div>
      )}

      {needsWater.length > 0 && (
        <div className="mb-4"><p className="mb-2 text-xs font-semibold text-red-400">🚿 Needs Water ({needsWater.length})</p>
          <div className="grid gap-2 sm:grid-cols-2">{needsWater.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/5 p-3">
              <div><p className="text-sm font-medium text-foreground">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.type}</p></div>
              <button onClick={() => waterPlant(p.id)} className="rounded-lg bg-green-500/20 px-2.5 py-1 text-[10px] font-medium text-green-400">💧 Watered</button>
            </div>
          ))}</div></div>
      )}

      <div><p className="mb-2 text-xs font-semibold text-foreground">All Plants ({plants.length})</p>
        {plants.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No plants yet. Add one above.</p> : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{[...needsWater, ...upcoming].map(p => {
            const days = getDaysUntilWater(p);
            return (
              <div key={p.id} className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-foreground">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.type} · every {p.waterDays} days</p></div>
                  <button onClick={() => removePlant(p.id)} className="text-xs text-muted-foreground hover:text-red-400">×</button>
                </div>
                <p className={`mt-2 text-xs font-medium ${days <= 0 ? "text-red-400" : days <= 2 ? "text-yellow-400" : "text-green-400"}`}>
                  {days <= 0 ? "Needs water now!" : `${days} day${days !== 1 ? "s" : ""} until water`}
                </p>
                <button onClick={() => waterPlant(p.id)} className="mt-2 h-7 w-full rounded-lg bg-surface-elevated text-[10px] text-muted-foreground hover:text-foreground">💧 Mark as watered</button>
              </div>
            );
          })}</div>
        )}</div>
    </AppShell>
  );
}
