import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/hacker-typer")({ component: HackerTyper });

// Plausible movie-hacker output
const CODE_BANK = `import socket, threading, os, sys

TARGETS = ["10.13.37.2", "10.13.37.9", "10.13.37.44"]
PORTS = [22, 80, 443, 8080, 31337]

def handshake(target, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2.4)
    try:
        sock.connect((target, port))
        banner = sock.recv(1024).decode(errors="ignore")
        return {"host": target, "port": port, "banner": banner.strip()}
    except (socket.timeout, ConnectionRefusedError):
        return None
    finally:
        sock.close()

def sweep(subnet):
    threads = []
    for host in subnet:
        for port in PORTS:
            t = threading.Thread(target=probe, args=(host, port))
            t.start()
            threads.append(t)
    for t in threads:
        t.join()

def crack(hash, wordlist="/usr/share/wordlists/rockyou.txt"):
    with open(wordlist, "r", errors="ignore") as fh:
        for candidate in fh:
            if sha256(candidate.strip()) == hash:
                return candidate.strip()
    return None

def exfiltrate(node, payload):
    channel = rotate_channel()
    cipher = AES.new(KEY, AES.MODE_GCM)
    blob = cipher.encrypt(payload)
    relay(channel, b64encode(blob))

while True:
    for node in alive_nodes():
        stats[node] = collect(node)
        if stats[node].entropy > THRESHOLD:
            exfiltrate(node, stats[node].dump)
    time.sleep(0.25)
`;

function HackerTyper() {
  const [out, setOut] = useState("");
  const idx = useRef(0);
  const [alerting, setAlerting] = useState(false);
  const boxRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      // type 3 chars per press for that frantic movie feel
      const next = CODE_BANK.slice(idx.current, idx.current + 3);
      idx.current = (idx.current + 3) % CODE_BANK.length;
      setOut((prev) => (prev + next).slice(-2600));
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => setAlerting(true), 9000);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [out]);

  return (
    <AppShell title="Hacker Typer" wide>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">💻 Hacker Typer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Just mash the keyboard. Flawless code appears. Look incredibly busy.
          </p>
        </div>
        <button
          onClick={() => {
            setOut("");
            idx.current = 0;
            setAlerting(false);
          }}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear
        </button>
      </header>

      {alerting && (
        <div className="mb-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-center text-sm font-bold text-destructive">
          ⚠️ ALERT: Intranet Access Detected — Disconnect Immediately
        </div>
      )}

      <pre
        ref={boxRef}
        className="h-[62vh] max-h-[620px] overflow-auto rounded-xl border border-primary/25 bg-[oklch(0.08_0.02_150)] p-4 font-mono text-[12.5px] leading-relaxed text-[oklch(0.85_0.2_150)] shadow-[inset_0_0_40px_oklch(0.5_0.2_150_/_12%)]"
      >
        {out || "Start typing…"}
        <span className="caret-blink">▊</span>
      </pre>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Nothing is actually happening. It's just for show — as all great movie hacking should be.
      </p>
    </AppShell>
  );
}
