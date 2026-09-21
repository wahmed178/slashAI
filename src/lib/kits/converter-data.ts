/**
 * Converter kit seeds — each entry becomes live two-way converter kits.
 * factor: multiply by factor to convert to the base unit (first entry).
 */
export interface ConvFamily {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** [unit label, factor to base] — base is the first unit */
  units: [string, number][];
  /** true = offset conversion (temperature), handled specially */
  offset?: "celsius";
}

export const CONV_FAMILIES: ConvFamily[] = [
  {
    id: "length", name: "Length", icon: "📏",
    desc: "metres, kilometres, miles, feet, inches, cm, yards, nautical miles",
    units: [
      ["metres", 1], ["kilometres", 1000], ["centimetres", 0.01], ["millimetres", 0.001],
      ["miles", 1609.344], ["yards", 0.9144], ["feet", 0.3048], ["inches", 0.0254],
      ["nautical miles", 1852],
    ],
  },
  {
    id: "weight", name: "Weight", icon: "⚖️",
    desc: "kilograms, grams, pounds, ounces, stones, tonnes",
    units: [
      ["kilograms", 1], ["grams", 0.001], ["milligrams", 0.000001], ["tonnes", 1000],
      ["pounds", 0.45359237], ["ounces", 0.028349523], ["stones", 6.35029318],
      ["tola", 0.01166], ["quintal", 100],
    ],
  },
  {
    id: "data", name: "Data Size", icon: "💾",
    desc: "bytes, KB, MB, GB, TB — decimal and binary",
    units: [
      ["megabytes", 1], ["kilobytes", 0.001], ["gigabytes", 1000], ["terabytes", 1000000],
      ["bytes", 0.000001], ["mebibytes", 1.048576], ["gibibytes", 1073.741824], ["bits", 0.000000125],
    ],
  },
  {
    id: "speed", name: "Speed", icon: "🏎️",
    desc: "km/h, mph, m/s, knots, ft/s",
    units: [
      ["km/h", 1], ["mph", 1.609344], ["m/s", 3.6], ["knots", 1.852], ["ft/s", 1.09728],
      ["mach", 1234.8],
    ],
  },
  {
    id: "volume", name: "Volume", icon: "🥤",
    desc: "litres, millilitres, gallons, cups, tablespoons",
    units: [
      ["litres", 1], ["millilitres", 0.001], ["US gallons", 3.785412], ["UK gallons", 4.54609],
      ["cups (US)", 0.2365882], ["tablespoons (US)", 0.0147868], ["teaspoons (US)", 0.00492892],
      ["cubic metres", 1000], ["barrels (oil)", 158.987],
    ],
  },
  {
    id: "area", name: "Area", icon: "🗺️",
    desc: "square metres, acres, hectares, bigha, sq ft",
    units: [
      ["square metres", 1], ["square kilometres", 1000000], ["hectares", 10000],
      ["acres", 4046.8564], ["square feet", 0.09290304], ["square yards", 0.83612736],
      ["bigha (standard)", 2529.3], ["guntha", 101.17], ["cents", 40.4686],
    ],
  },
  {
    id: "energy", name: "Energy", icon: "⚡",
    desc: "joules, calories, kWh, BTU",
    units: [
      ["joules", 1], ["kilojoules", 1000], ["calories", 4.184], ["kilocalories", 4184],
      ["kilowatt-hours", 3600000], ["BTU", 1055.06], ["electronvolts", 0.000000000000000001602],
    ],
  },
  {
    id: "pressure", name: "Pressure", icon: "🌡️",
    desc: "pascals, bar, PSI, atmospheres, torr",
    units: [
      ["pascals", 1], ["kilopascals", 1000], ["bar", 100000], ["PSI", 6894.757],
      ["atmospheres", 101325], ["torr", 133.322], ["mmHg", 133.322],
    ],
  },
  {
    id: "time", name: "Time", icon: "⏰",
    desc: "seconds, minutes, hours, days, weeks, years",
    units: [
      ["seconds", 1], ["minutes", 60], ["hours", 3600], ["days", 86400],
      ["weeks", 604800], ["fortnights", 1209600], ["months (30d)", 2592000], ["years (365d)", 31536000],
    ],
  },
  {
    id: "angle", name: "Angle", icon: "📐",
    desc: "degrees, radians, gradians, turns",
    units: [
      ["degrees", 1], ["radians", 57.2957795], ["gradians", 0.9], ["turns", 360],
      ["arcminutes", 1 / 60], ["arcseconds", 1 / 3600],
    ],
  },
  {
    id: "fuel", name: "Fuel Economy", icon: "⛽",
    desc: "km/L, MPG, L/100km comparisons",
    units: [
      ["km per litre", 1], ["miles per gallon (US)", 0.425144], ["miles per gallon (UK)", 0.354006],
      ["litres per 100 km (inverse)", -1],
    ],
  },
  {
    id: "cooking", name: "Cooking Weights", icon: "👨‍🍳",
    desc: "kitchen measures: cups, spoons, grams for common ingredients",
    units: [
      ["grams (water/flour approx.)", 1], ["kilograms", 1000], ["cups (240ml)", 240],
      ["tablespoons", 15], ["teaspoons", 5], ["fluid ounces", 29.5735],
    ],
  },
  {
    id: "storage", name: "Digital Storage", icon: "🗄️",
    desc: "bits, bytes, words, pages of text, songs, photos",
    units: [
      ["kilobytes", 1], ["bytes", 0.001], ["megabytes", 1000], ["gigabytes", 1000000],
      ["pages of plain text (~2KB)", 2], ["MP3 minutes (~1MB/min)", 1000], ["JPEG photos (~3MB)", 3000],
    ],
  },
  {
    id: "landmarks", name: "Landmark Heights", icon: "🗼",
    desc: "compare towers and mountains against each other",
    units: [
      ["metres", 1], ["Burj Khalifa (828m)", 828], ["Eiffel Tower (330m)", 330],
      ["Qutub Minar (73m)", 73], ["Statue of Unity (182m)", 182], ["Everest (8,849m)", 8849],
      ["Statue of Liberty (93m)", 93], ["Shanghai Tower (632m)", 632],
    ],
  },
  {
    id: "runs", name: "Cricket Runs", icon: "🏏",
    desc: "convert match situations: runs, balls, strike rates",
    units: [
      ["runs per innings", 1], ["strike rate (runs per 100 balls)", 0.01],
      ["sixes (6 runs)", 0.166667], ["fours (4 runs)", 0.25], ["fifties (50 runs)", 0.02], ["hundreds", 0.01],
    ],
  },
  {
    id: "baking", name: "Oven Temperatures", icon: "🍰",
    desc: "Celsius, Fahrenheit and gas marks for baking",
    units: [
      ["Celsius", 1], ["Fahrenheit", 0.555556], ["Gas Mark (1 = 140°C)", 140], ["cool oven (150°C)", 150],
      ["moderate (180°C)", 180], ["hot (220°C)", 220], ["very hot (250°C)", 250],
    ],
  },
  {
    id: "printer", name: "Paper & Print", icon: "🖨️",
    desc: "paper sizes by width in millimetres",
    units: [
      ["A4 width (210mm)", 210], ["millimetres", 1], ["A3 width (297mm)", 297], ["A5 width (148mm)", 148],
      ["Letter width (216mm)", 216], ["A4 height (297mm)", 297], ["Sheet count (500 = 1 ream)", 500],
    ],
  },
  {
    id: "mobile", name: "Mobile Data", icon: "📶",
    desc: "what your data plan actually buys you",
    units: [
      ["gigabytes", 1], ["hours of HD video (~3GB/hr)", 3], ["hours of music (~60MB/hr)", 0.06],
      ["Instagram reels (~5MB each)", 0.005], ["1GB games", 1], ["video calls (~250MB/hr)", 0.25],
      ["WhatsApp messages (~0.01MB)", 0.00001],
    ],
  },
];

/** temperature handled as its own special kit (offset conversion) */
export const TEMPERATURE_UNITS: [string, (v: number, to: boolean) => number][] = [
  ["Celsius", (v, to) => (to ? v : v)], // self
  ["Fahrenheit", (v, to) => (to ? v * 9 / 5 + 32 : (v - 32) * 5 / 9)],
  ["Kelvin", (v, to) => (to ? v + 273.15 : v - 273.15)],
  ["Rankine", (v, to) => (to ? (v + 273.15) * 9 / 5 : (v - 491.67) * 5 / 9)],
];
