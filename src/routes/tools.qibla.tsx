import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/qibla")({
  head: () => ({
    meta: [
      { title: "Qibla Compass — SlashAI" },
      { name: "description", content: "Find the direction of Mecca from anywhere using your device compass and location — free, private, no account." },
    ],
  }),
  component: QiblaCompass,
});

const cities: Record<string, { lat: number; lng: number }> = {
  "Mecca": { lat: 21.4225, lng: 39.8262 },
  "Medina": { lat: 24.4539, lng: 39.6142 },
  "Riyadh": { lat: 24.7136, lng: 46.6753 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Istanbul": { lat: 41.0082, lng: 28.9784 },
  "Cairo": { lat: 30.0444, lng: 31.2357 },
  "Lahore": { lat: 31.5204, lng: 74.3587 },
  "Karachi": { lat: 24.8607, lng: 67.0011 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Kuala Lumpur": { lat: 3.1390, lng: 101.6869 },
  "Jakarta": { lat: -6.2088, lng: 106.8456 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Dhaka": { lat: 23.8103, lng: 90.4125 },
  "Islamabad": { lat: 33.6844, lng: 73.0479 },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773 },
  "Doha": { lat: 25.2854, lng: 51.5310 },
  "Kuwait City": { lat: 29.3759, lng: 47.9774 },
  "Amman": { lat: 31.9454, lng: 35.9284 },
  "Baghdad": { lat: 33.3152, lng: 44.3661 },
  "Tehran": { lat: 35.6892, lng: 51.3890 },
  "Casablanca": { lat: 33.5731, lng: -7.5898 },
  "Lagos": { lat: 6.5244, lng: 3.3792 },
  "Nairobi": { lat: -1.2921, lng: 36.8219 },
};

const getQiblaDirection = (lat: number, lng: number) => {
  const meccaLat = 21.3891 * (Math.PI / 180);
  const meccaLng = 39.8579 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);

  const y = Math.sin(meccaLng - userLng);
  const x = Math.cos(userLat) * Math.tan(meccaLat) - Math.sin(userLat) * Math.cos(meccaLng - userLng);

  let qibla = Math.atan2(y, x) * (180 / Math.PI);
  return (qibla + 360) % 360;
};

const getDistance = (lat1: number, lng1: number) => {
  const R = 6371;
  const mLat = 21.3891;
  const mLng = 39.8579;
  const dLat = (mLat - lat1) * Math.PI / 180;
  const dLng = (mLng - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(mLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function QiblaCompass() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "manual">("idle");
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [manualCity, setManualCity] = useState("");
  const [deviceAngle, setDeviceAngle] = useState(0);
  const [useDevice, setUseDevice] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  const requestLocation = () => {
    setState("loading");
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setQiblaAngle(getQiblaDirection(latitude, longitude));
        setDistance(getDistance(latitude, longitude));
        setState("done");
      },
      () => setState("manual"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectCity = (city: string) => {
    const c = cities[city];
    if (!c) return;
    setLat(c.lat);
    setLng(c.lng);
    setQiblaAngle(getQiblaDirection(c.lat, c.lng));
    setDistance(getDistance(c.lat, c.lng));
    setManualCity(city);
    setState("done");
  };

  // Device orientation
  useEffect(() => {
    if (!useDevice || state !== "done") return;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceAngle(e.alpha);
      }
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [useDevice, state]);

  const compassRotation = useDevice ? (qiblaAngle - deviceAngle + 360) % 360 : qiblaAngle;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">🧭 Qibla Compass</h1>
          <p className="text-sm text-muted-foreground">Find the direction of Mecca from anywhere</p>
        </div>

        {/* Idle */}
        {state === "idle" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <span className="text-4xl">🕌</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Find Qibla Direction</h3>
            <p className="text-sm text-muted-foreground">Allow location access or select a city to find the direction of Mecca</p>
            <button onClick={requestLocation} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">📍 Allow Location Access</button>
            <button onClick={() => setState("manual")} className="w-full rounded-xl border border-border bg-surface py-3 text-sm text-foreground hover:bg-background">🏙 Select City Instead</button>
          </div>
        )}

        {/* Loading */}
        {state === "loading" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center space-y-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        )}

        {/* Manual city selection */}
        {state === "manual" && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Select your city</h3>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {Object.keys(cities).map((city) => (
                <button key={city} onClick={() => selectCity(city)} className="rounded-lg border border-border bg-background p-2 text-xs text-foreground hover:bg-primary/10">
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Compass */}
        {state === "done" && (
          <div className="space-y-4">
            {/* Compass */}
            <div className="flex justify-center">
              <div className="relative h-72 w-72">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-border bg-surface" />

                {/* Direction labels */}
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs font-bold text-red-400">N</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">S</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">W</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">E</span>

                {/* Degree marks */}
                {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-1/2 h-full w-px origin-bottom"
                    style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)`, background: deg % 90 === 0 ? "#8b949e" : "#21262d" }}
                  />
                ))}

                {/* Compass needle / Qibla indicator */}
                <div
                  ref={compassRef}
                  className="absolute left-1/2 top-1/2 h-24 w-1 origin-bottom transition-transform duration-1000 ease-out"
                  style={{ transform: `translate(-50%, -100%) rotate(${compassRotation}deg)` }}
                >
                  <div className="h-1/2 w-full rounded-t-full bg-primary" />
                  <div className="h-1/2 w-full rounded-b-full bg-primary/30" />
                </div>

                {/* Center dot */}
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />

                {/* Kaaba icon at tip */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
                  style={{ transform: `translate(-50%, -100%) rotate(${compassRotation}deg) translateY(-88px)` }}
                >
                  <span className="text-lg">🕋</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-border bg-surface p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{qiblaAngle.toFixed(1)}°</div>
              <p className="text-sm text-muted-foreground">from North</p>
              <div className="text-sm text-foreground">{Math.round(distance).toLocaleString()} km from Mecca</div>
              <div className="text-xs text-muted-foreground/60">{lat.toFixed(4)}, {lng.toFixed(4)} {manualCity && `(${manualCity})`}</div>
            </div>

            {/* Device orientation toggle */}
            {typeof DeviceOrientationEvent !== "undefined" && (
              <button onClick={() => setUseDevice(!useDevice)} className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${useDevice ? "bg-primary text-background" : "border border-border bg-surface text-foreground hover:bg-background"}`}>
                {useDevice ? "📱 Using device compass — rotate your phone" : "📱 Use device compass"}
              </button>
            )}

            <button onClick={() => setState("idle")} className="w-full rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground hover:text-foreground">
              🔄 Change Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
