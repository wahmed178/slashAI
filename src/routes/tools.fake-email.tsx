import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/fake-email")({
  component: TempEmailGenerator,
  head: () => ({
    meta: [
      { title: "Temp Email Generator — SlashAI" },
      {
        name: "description",
        content:
          "Disposable email addresses with an inbox powered by Guerrilla Mail — no sign-up, nothing stored here.",
      },
    ],
  }),
});

function GuerrillaNote() {
  return (
    <p className="mt-2 rounded-lg border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
      Inbox powered by guerrillamail.com — may not always be available.
    </p>
  );
}

function TempEmailGenerator() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sid, setSid] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createEmail = async () => {
    setLoading(true);
    try {
      const r = await fetch("https://api.guerrillamail.com/ajax.php?f=get_email_address");
      const d = await r.json();
      setEmail(d.email_addr);
      setToken(d.token);
      setSid(d.sid_token);
    } catch {}
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!sid || !token) return;
    try {
      const r = await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid}&token=${token}`);
      const d = await r.json();
      if (d.list) setMessages(d.list);
    } catch {}
  };

  useEffect(() => {
    if (email) {
      fetchMessages();
      intervalRef.current = setInterval(fetchMessages, 5000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [email]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <AppShell title="Temp Email">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📧 Temporary Email</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate a disposable email address and read incoming messages right here.</p>
      </header>

      <GuerrillaNote />

      <div className="mx-auto max-w-2xl space-y-4">
        {!email ? (
          <button onClick={createEmail} disabled={loading}
            className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">
            {loading ? "Generating..." : "Generate Temporary Email"}
          </button>
        ) : (
          <>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground mb-1">Your temporary email:</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-lg font-mono font-bold text-primary">{email}</p>
                <button onClick={copyEmail} className="shrink-0 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Emails auto-refresh every 5 seconds. Auto-expires when you leave.</p>
            </div>

            {/* Messages */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Inbox ({messages.length})</p>
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-6">No emails yet. They'll appear here automatically.</p>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg: any, i: number) => (
                    <div key={i} className="rounded-lg border border-border bg-surface-elevated p-3">
                      <p className="text-sm font-medium text-foreground">{msg.mail_from}</p>
                      <p className="text-xs text-muted-foreground">{msg.mail_subject}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{msg.mail_excerpt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
