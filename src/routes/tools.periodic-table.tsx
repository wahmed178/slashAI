import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/periodic-table")({ component: PeriodicTable });

interface El {
  n: number;
  sym: string;
  name: string;
  mass: string;
  cat: string;
  group: number;
  period: number;
  fact: string;
}

// compact dataset: all 118 elements - symbol, name, mass, category, group, period, one fact
const RAW = `1,H,Hydrogen,1.008,nonmetal,1,1,"Lightest element - fuels the Sun via fusion."
2,He,Helium,4.003,noble,18,1,"Makes your voice squeaky; discovered on the Sun before Earth."
3,Li,Lithium,6.94,metal,1,2,"Powers most rechargeable batteries on Earth."
4,Be,Beryllium,9.012,metal,2,2,"Transparent to X-rays - used in X-ray machine windows."
5,B,Boron,10.81,metalloid,13,2,"Borax cleaner and heat-proof lab glass both come from it."
6,C,Carbon,12.011,nonmetal,14,2,"Forms diamond, graphite and every known life form."
7,N,Nitrogen,14.007,nonmetal,15,2,"78% of every breath you take; plants crave its fixed form."
8,O,Oxygen,15.999,nonmetal,16,2,"Third most abundant element in the universe."
9,F,Fluorine,18.998,halogen,17,2,"Most reactive element - attacks nearly everything."
10,Ne,Neon,20.180,noble,18,2,"Glows orange-red in signs; its name means 'new'."
11,Na,Sodium,22.990,metal,1,3,"Explodes in water; half of table salt."
12,Mg,Magnesium,24.305,metal,2,3,"Burns blinding white; at the heart of chlorophyll."
13,Al,Aluminium,26.982,metal,13,3,"Most abundant metal in Earth's crust."
14,Si,Silicon,28.085,metalloid,14,3,"Every chip and CPU is built on it."
15,P,Phosphorus,30.974,nonmetal,15,3,"Found in your DNA, bones and match heads."
16,S,Sulfur,32.06,nonmetal,16,3,"The 'brimstone' of old texts; smells of rotten eggs."
17,Cl,Chlorine,35.45,halogen,17,3,"Keeps pools clean; a WWI weapon in raw form."
18,Ar,Argon,39.948,noble,18,3,"Fills light bulbs - keeps filaments from burning."
19,K,Potassium,39.098,metal,1,4,"Bananas are famous for it; vital for nerve signals."
20,Ca,Calcium,40.078,metal,2,4,"Bones, teeth, shells, cement."
21,Sc,Scandium,44.956,metal,3,4,"Aerospace alloys - strong as titanium, lighter than steel."
22,Ti,Titanium,47.867,metal,4,4,"As strong as steel at half the weight."
23,V,Vanadium,50.942,metal,5,4,"Makes sword steel legendary (Damascus blades)."
24,Cr,Chromium,51.996,metal,6,4,"Gives rubies their red and stainless steel its shine."
25,Mn,Manganese,54.938,metal,7,4,"Essential for steel making and photosynthesis."
26,Fe,Iron,55.845,metal,8,4,"Earth's core and your blood both run on it."
27,Co,Cobalt,58.933,metal,9,4,"Named after mischievous goblins ('kobolds')."
28,Ni,Nickel,58.693,metal,10,4,"Coins, magnets, and 5-rupee pieces."
29,Cu,Copper,63.546,metal,11,4,"First metal humans worked - over 10,000 years ago."
30,Zn,Zinc,65.38,metal,12,4,"Coats steel against rust; immune-system helper."
31,Ga,Gallium,69.723,metal,13,4,"Melts in your hand at 29.8°C."
32,Ge,Germanium,72.630,metalloid,14,4,"First transistors were germanium, not silicon."
33,As,Arsenic,74.922,metalloid,15,4,"The poison of mystery novels - dose makes the toxin."
34,Se,Selenium,78.971,nonmetal,16,4,"Your body needs trace amounts; photocopiers too."
35,Br,Bromine,79.904,halogen,17,4,"One of two liquid elements at room temperature."
36,Kr,Krypton,83.798,noble,18,4,"Once defined the metre itself."
37,Rb,Rubidium,85.468,metal,1,5,"Atomic clocks keep GPS honest using it."
38,Sr,Strontium,87.62,metal,2,5,"Red fireworks get their colour from it."
39,Y,Yttrium,88.906,metal,3,5,"One of four elements named after Ytterby, Sweden."
40,Zr,Zirconium,91.224,metal,4,5,"Nuclear cladding and fake diamonds."
41,Nb,Niobium,92.906,metal,5,5,"Superconducting MRI magnets."
42,Mo,Molybdenum,95.95,metal,6,5,"Strengthens armour steel; enzymes need it."
43,Tc,Technetium,98,metal,7,5,"First artificially made element (1937)."
44,Ru,Ruthenium,101.07,metal,8,5,"Hard drives and fountain pen nibs."
45,Rh,Rhodium,102.91,metal,9,5,"Most expensive metal - pricier than gold."
46,Pd,Palladium,106.42,metal,10,5,"Catalytic converters and white gold."
47,Ag,Silver,107.87,metal,11,5,"Best electrical conductor of all elements."
48,Cd,Cadmium,112.41,metal,12,5,"Old NiCd batteries; toxic heavy metal."
49,In,Indium,114.82,metal,13,5,"Touchscreens owe it their ITO coating."
50,Sn,Tin,118.71,metal,14,5,"Cans, bronze, and 'tin cries' when bent."
51,Sb,Antimony,121.76,metalloid,15,5,"Ancient Egyptian eyeliner (kohl)."
52,Te,Tellurium,127.60,metalloid,16,5,"Rarer than gold in Earth's crust."
53,I,Iodine,126.90,halogen,17,5,"Your thyroid cannot work without it."
54,Xe,Xenon,131.29,noble,18,5,"Powers ion spacecraft engines."
55,Cs,Caesium,132.91,metal,1,6,"Explodes on water; defines the modern second."
56,Ba,Barium,137.33,metal,2,6,"'Barium meal' X-ray imaging of the gut."
57,La,Lanthanum,138.91,lanthanide,3,6,"Camera lenses and hybrid car batteries."
58,Ce,Cerium,140.12,lanthanide,3,6,"Lighter flints spark with it."
59,Pr,Praseodymium,140.91,lanthanide,3,6,"Welder's goggles and strong magnets."
60,Nd,Neodymium,144.24,lanthanide,3,6,"Strongest permanent magnets known."
61,Pm,Promethium,145,lanthanide,3,6,"Only radioactive lanthanide; glow-in-dark paint (old)."
62,Sm,Samarium,150.36,lanthanide,3,6,"Magnets that survive furnace heat."
63,Eu,Europium,151.96,lanthanide,3,6,"Euro banknotes glow red under UV thanks to it."
64,Gd,Gadolinium,157.25,lanthanide,3,6,"MRI contrast agent."
65,Tb,Terbium,158.93,lanthanide,3,6,"Green phosphors in screens."
66,Dy,Dysprosium,162.50,lanthanide,3,6,"Name means 'hard to get' in Greek."
67,Ho,Holmium,164.93,lanthanide,3,6,"Strongest magnetic moment of any element."
68,Er,Erbium,167.26,lanthanide,3,6,"Fibre-optic internet amplifiers."
69,Tm,Thulium,168.93,lanthanide,3,6,"Rarest stable lanthanide; portable X-rays."
70,Yb,Ytterbium,173.05,lanthanide,3,6,"Next-gen atomic clocks."
71,Lu,Lutetium,174.97,lanthanide,3,6,"PET scan detectors."
72,Hf,Hafnium,178.49,metal,4,6,"Chip insulators and nuclear submarine rods."
73,Ta,Tantalum,180.95,metal,5,6,"Every smartphone capacitor."
74,W,Tungsten,183.84,metal,6,6,"Highest melting point: 3,422°C."
75,Re,Rhenium,186.21,metal,7,6,"Jet engine superalloys; last stable element found."
76,Os,Osmium,190.23,metal,8,6,"Densest natural element - twice lead's density."
77,Ir,Iridium,192.22,metal,9,6,"The asteroid layer that killed the dinosaurs is rich in it."
78,Pt,Platinum,195.08,metal,10,6,"Cancer drugs and catalytic converters."
79,Au,Gold,196.97,metal,11,6,"All gold ever mined fits in a 22m cube."
80,Hg,Mercury,200.59,metal,12,6,"The only liquid metal at room temperature."
81,Tl,Thallium,204.38,metal,13,6,"'Inheritance powder' of classic crime."
82,Pb,Lead,207.2,metal,14,6,"Roman pipes gave plumbing its name."
83,Bi,Bismuth,208.98,metal,15,6,"Grows stunning rainbow hopper crystals."
84,Po,Polonium,209,metalloid,16,6,"Discovered by Marie Curie; intensely radioactive."
85,At,Astatine,210,halogen,17,6,"Rarest natural element - under 30g on Earth at any time."
86,Rn,Radon,222,noble,18,6,"Radioactive gas that seeps into basements."
87,Fr,Francium,223,metal,1,7,"Most unstable natural element; never been seen in bulk."
88,Ra,Radium,226,metal,2,7,"Once painted on watch dials - tragically."
89,Ac,Actinium,227,actinide,3,7,"Glows blue in the dark."
90,Th,Thorium,232.04,actinide,3,7,"Potential nuclear fuel, named after Thor."
91,Pa,Protactinium,231.04,actinide,3,7,"Forms in uranium ore decay chains."
92,U,Uranium,238.03,actinide,3,7,"Nuclear reactors and Earth's internal heat."
93,Np,Neptunium,237,actinide,3,7,"First transuranium element; named for Neptune."
94,Pu,Plutonium,244,actinide,3,7,"Powers Voyager 1 - still talking after 47 years."
95,Am,Americium,243,actinide,3,7,"In every smoke detector."
96,Cm,Curium,247,actinide,3,7,"Named for the Curies; analysed Mars soil."
97,Bk,Berkelium,247,actinide,3,7,"Named for Berkeley, California."
98,Cf,Californium,251,actinide,3,7,"Starts nuclear reactors; $27M per gram."
99,Es,Einsteinium,252,actinide,3,7,"Found in H-bomb debris, 1952."
100,Fm,Fermium,257,actinide,3,7,"Last element makeable by neutron bombardment."
101,Md,Mendelevium,258,actinide,3,7,"Honours Mendeleev, table's inventor."
102,No,Nobelium,259,actinide,3,7,"Claimed in Stockholm - hence the name."
103,Lr,Lawrencium,266,actinide,3,7,"Honours cyclotron inventor Ernest Lawrence."
104,Rf,Rutherfordium,267,transition,4,7,"Named after Ernest Rutherford."
105,Db,Dubnium,268,transition,5,7,"Named for Dubna, Russia."
106,Sg,Seaborgium,269,transition,6,7,"Only element named after a living person (Seaborg)."
107,Bh,Bohrium,270,transition,7,7,"Honours Niels Bohr."
108,Hs,Hassium,269,transition,8,7,"Named for Hesse, Germany."
109,Mt,Meitnerium,278,transition,9,7,"Honours Lise Meitner, fission discoverer."
110,Ds,Darmstadtium,281,transition,10,7,"Named for Darmstadt, Germany."
111,Rg,Roentgenium,282,transition,11,7,"Honours X-ray discoverer Röntgen."
112,Cn,Copernicium,285,transition,12,7,"Predicted to be a liquid or gas metal."
113,Nh,Nihonium,286,post-transition,13,7,"First element discovered in Asia (Nihon = Japan)."
114,Fl,Flerovium,289,post-transition,14,7,"Named for the Flerov lab."
115,Mc,Moscovium,290,post-transition,15,7,"Named for Moscow Oblast."
116,Lv,Livermorium,293,post-transition,16,7,"Named for Livermore lab."
117,Ts,Tennessine,294,halogen,17,7,"Named for Tennessee."
118,Og,Oganesson,294,noble,18,7,"Heaviest known element; only atoms ever made."`;

const ELEMENTS: El[] = RAW.split("\n").map((line) => {
  const m = line.match(/^(\d+),([^,]+),([^,]+),([^,]+),([^,]+),(\d+),(\d+),"(.+)"$/);
  if (!m) throw new Error("Bad element row: " + line);
  return {
    n: Number(m[1]),
    sym: m[2]!,
    name: m[3]!,
    mass: m[4]!,
    cat: m[5]!,
    group: Number(m[6]),
    period: Number(m[7]),
    fact: m[8]!,
  };
});

const CAT_COLORS: Record<string, string> = {
  nonmetal: "#3fb950",
  noble: "#a371f7",
  metal: "#58a6ff",
  metalloid: "#d29922",
  halogen: "#f778ba",
  lanthanide: "#f0883e",
  actinide: "#f85149",
  transition: "#79c0ff",
  "post-transition": "#8b949e",
};

const CAT_LABEL: Record<string, string> = {
  nonmetal: "Nonmetal",
  noble: "Noble gas",
  metal: "Alkali/alkaline metal",
  metalloid: "Metalloid",
  halogen: "Halogen",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
  transition: "Transition metal",
  "post-transition": "Post-transition",
};

function PeriodicTable() {
  const [sel, setSel] = useState<El | null>(null);
  const [q, setQ] = useState("");

  const match = q.trim().toLowerCase();
  const hits = match
    ? new Set(
        ELEMENTS.filter(
          (e) => e.name.toLowerCase().includes(match) || e.sym.toLowerCase() === match || String(e.n) === match,
        ).map((e) => e.n),
      )
    : null;

  return (
    <AppShell wide title="Periodic Table">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚗️ Periodic Table</h1>
        <p className="mt-1 text-sm text-muted-foreground">All 118 elements - tap any cell for facts. Search by name, symbol or number.</p>
      </header>
      <div className="mx-auto max-w-4xl space-y-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: gold, Au, 79…"
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        {sel && (
          <div className="rounded-xl border p-4" style={{ borderColor: CAT_COLORS[sel.cat], background: "color-mix(in oklab, " + CAT_COLORS[sel.cat] + " 8%, transparent)" }}>
            <div className="flex items-start gap-3">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg text-2xl font-black" style={{ background: CAT_COLORS[sel.cat], color: "#0d1117" }}>
                {sel.sym}
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground">
                  {sel.name} <span className="text-[12px] font-semibold text-muted-foreground">#{sel.n} · {sel.mass} u</span>
                </p>
                <p className="text-[12px] font-semibold" style={{ color: CAT_COLORS[sel.cat] }}>{CAT_LABEL[sel.cat]}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{sel.fact}</p>
              </div>
              <button onClick={() => setSel(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto pb-2">
          <div
            className="grid min-w-[680px] gap-1"
            style={{ gridTemplateColumns: "repeat(18, minmax(34px, 1fr))", gridTemplateRows: "repeat(10, 40px)" }}
          >
            {ELEMENTS.map((e) => {
              const dim = hits ? !hits.has(e.n) : false;
              return (
                <button
                  key={e.n}
                  onClick={() => setSel(e)}
                  className="rounded-[5px] border p-0.5 text-center transition-all duration-150 hover:scale-110"
                  style={{
                    gridColumn: e.group,
                    gridRow: e.period,
                    borderColor: dim ? "transparent" : CAT_COLORS[e.cat] + "66",
                    background: dim ? "transparent" : CAT_COLORS[e.cat] + "22",
                    opacity: dim ? 0.25 : 1,
                  }}
                  title={e.name}
                >
                  <span className="block text-[7px] leading-none text-muted-foreground">{e.n}</span>
                  <span className="block text-[12px] font-black leading-tight" style={{ color: CAT_COLORS[e.cat] }}>{e.sym}</span>
                </button>
              );
            })}
            {/* lanthanides & actinides rows */}
            {ELEMENTS.filter((e) => e.period === 6 && e.cat === "lanthanide").map((e) => (
              <button
                key={"la" + e.n}
                onClick={() => setSel(e)}
                className="rounded-[5px] border p-0.5 text-center transition-all duration-150 hover:scale-110"
                style={{ gridColumn: (e.n - 57) + 3, gridRow: 9, borderColor: CAT_COLORS[e.cat] + "66", background: CAT_COLORS[e.cat] + "22" }}
                title={e.name}
              >
                <span className="block text-[7px] leading-none text-muted-foreground">{e.n}</span>
                <span className="block text-[12px] font-black leading-tight" style={{ color: CAT_COLORS[e.cat] }}>{e.sym}</span>
              </button>
            ))}
            {ELEMENTS.filter((e) => e.period === 7 && e.cat === "actinide").map((e) => (
              <button
                key={"ac" + e.n}
                onClick={() => setSel(e)}
                className="rounded-[5px] border p-0.5 text-center transition-all duration-150 hover:scale-110"
                style={{ gridColumn: (e.n - 89) + 3, gridRow: 10, borderColor: CAT_COLORS[e.cat] + "66", background: CAT_COLORS[e.cat] + "22" }}
                title={e.name}
              >
                <span className="block text-[7px] leading-none text-muted-foreground">{e.n}</span>
                <span className="block text-[12px] font-black leading-tight" style={{ color: CAT_COLORS[e.cat] }}>{e.sym}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
          {Object.entries(CAT_LABEL).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: CAT_COLORS[k] }} />
              {v}
            </span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
