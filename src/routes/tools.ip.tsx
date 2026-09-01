import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/ip")({
  component: NetworkInfoTool,
});

function NetworkInfoTool() {
  const [myIP, setMyIP] = useState("");
  const [myInfo, setMyInfo] = useState<any>(null);
  const [lookupIP, setLookupIP] = useState("");
  const [lookupInfo, setLookupInfo] = useState<any>(null);
  const [domain, setDomain] = useState("");
  const [dnsRecords, setDnsRecords] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => { setMyIP(d.ip); return fetch(`http://ip-api.com/json/${d.ip}`); })
      .then((r) => r.json())
      .then((d) => setMyInfo(d))
      .catch(() => {});
  }, []);

  const lookup = async () => {
    if (!lookupIP.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`http://ip-api.com/json/${lookupIP.trim()}`);
      const d = await r.json();
      setLookupInfo(d);
    } catch { setLookupInfo(null); }
    setLoading(false);
  };

  return (
    <AppShell title="Network Info Tool">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌐 Network Info Tool</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your IP, location, ISP, and IP/domain lookup.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* My IP */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Your Network</p>
          <p className="text-2xl font-bold text-foreground font-mono">{myIP || "..."}</p>
          {myInfo && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{myInfo.country} ({myInfo.countryCode})</span></div>
              <div><span className="text-muted-foreground">City:</span> <span className="text-foreground">{myInfo.city}</span></div>
              <div><span className="text-muted-foreground">ISP:</span> <span className="text-foreground">{myInfo.isp}</span></div>
              <div><span className="text-muted-foreground">Org:</span> <span className="text-foreground">{myInfo.org}</span></div>
              <div><span className="text-muted-foreground">Timezone:</span> <span className="text-foreground">{myInfo.timezone}</span></div>
              <div><span className="text-muted-foreground">AS:</span> <span className="text-foreground">{myInfo.as}</span></div>
            </div>
          )}
        </div>

        {/* IP Lookup */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">IP Lookup</p>
          <div className="flex gap-2">
            <input value={lookupIP} onChange={(e) => setLookupIP(e.target.value)} placeholder="Enter any IP address..."
              className="flex-1 h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm font-mono focus:outline-none focus:border-primary/50" />
            <button onClick={lookup} disabled={loading} className="rounded-lg bg-primary px-4 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40">Lookup</button>
          </div>
          {lookupInfo && (
            <div className="mt-3 rounded-lg bg-surface-elevated p-3">
              {lookupInfo.status === "fail" ? (
                <p className="text-xs text-red-400">{lookupInfo.message}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">IP:</span> <span className="text-foreground">{lookupInfo.query}</span></div>
                  <div><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{lookupInfo.country}</span></div>
                  <div><span className="text-muted-foreground">City:</span> <span className="text-foreground">{lookupInfo.city}</span></div>
                  <div><span className="text-muted-foreground">ISP:</span> <span className="text-foreground">{lookupInfo.isp}</span></div>
                  <div><span className="text-muted-foreground">Lat/Lon:</span> <span className="text-foreground">{lookupInfo.lat}, {lookupInfo.lon}</span></div>
                  <div><span className="text-muted-foreground">Timezone:</span> <span className="text-foreground">{lookupInfo.timezone}</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
