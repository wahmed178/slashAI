import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/api-tester")({ component: APITester });

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

function APITester() {
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);

  const send = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const h = JSON.parse(headers || "{}");
      const opts: RequestInit = { method, headers: h };
      if (["POST", "PUT", "PATCH"].includes(method) && body) opts.body = body;
      const res = await fetch(url, opts);
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = text; }
      setResponse({ status: res.status, statusText: res.statusText, headers: Object.fromEntries(res.headers.entries()), body: data, time: Math.round(performance.now() - start) });
    } catch (e: any) {
      setResponse({ status: 0, statusText: "Error", body: e.message, time: Math.round(performance.now() - start), headers: {} });
    }
    setLoading(false);
  };

  return (
    <AppShell title="API Tester">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔌 API Tester</h1>
        <p className="mt-1 text-sm text-muted-foreground">Test REST APIs from your browser. Like mini Postman.</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex gap-2">
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-semibold">
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint"
            className="flex-1 h-11 rounded-xl border border-border bg-surface px-4 text-sm font-mono focus:outline-none focus:border-primary/50" />
          <button onClick={send} disabled={loading} className="shrink-0 rounded-xl bg-primary px-6 h-11 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">
            {loading ? "..." : "Send"}
          </button>
        </div>
        {["POST", "PUT", "PATCH"].includes(method) && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Request Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder='{"key": "value"}'
              className="h-24 w-full rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:outline-none resize-none" />
          </div>
        )}
        {response && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-bold ${response.status >= 200 && response.status < 300 ? "text-green" : response.status >= 400 ? "text-red-400" : "text-yellow"}`}>
                {response.status} {response.statusText}
              </span>
              <span className="text-muted-foreground">{response.time}ms</span>
            </div>
            <pre className="max-h-80 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground whitespace-pre-wrap">
              {typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </AppShell>
  );
}
