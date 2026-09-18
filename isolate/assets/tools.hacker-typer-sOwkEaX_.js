import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./AppShell-BPLOjQCr.js";var i=e(t()),a=n(),o=`import socket, threading, os, sys

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
`;function s(){let[e,t]=(0,i.useState)(``),n=(0,i.useRef)(0),[s,c]=(0,i.useState)(!1),l=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let e=e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;e.preventDefault();let r=o.slice(n.current,n.current+3);n.current=(n.current+3)%o.length,t(e=>(e+r).slice(-2600))};window.addEventListener(`keydown`,e);let r=window.setTimeout(()=>c(!0),9e3);return()=>{window.removeEventListener(`keydown`,e),window.clearTimeout(r)}},[]),(0,i.useEffect)(()=>{l.current?.scrollTo({top:l.current.scrollHeight})},[e]),(0,a.jsxs)(r,{title:`Hacker Typer`,wide:!0,children:[(0,a.jsxs)(`header`,{className:`mb-4 flex flex-wrap items-end justify-between gap-3`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`h1`,{className:`text-2xl font-bold tracking-tight text-foreground`,children:`💻 Hacker Typer`}),(0,a.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Just mash the keyboard. Flawless code appears. Look incredibly busy.`})]}),(0,a.jsx)(`button`,{onClick:()=>{t(``),n.current=0,c(!1)},className:`rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground`,children:`Clear`})]}),s&&(0,a.jsx)(`div`,{className:`mb-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-center text-sm font-bold text-destructive`,children:`⚠️ ALERT: Intranet Access Detected — Disconnect Immediately`}),(0,a.jsxs)(`pre`,{ref:l,className:`h-[62vh] max-h-[620px] overflow-auto rounded-xl border border-primary/25 bg-[oklch(0.08_0.02_150)] p-4 font-mono text-[12.5px] leading-relaxed text-[oklch(0.85_0.2_150)] shadow-[inset_0_0_40px_oklch(0.5_0.2_150_/_12%)]`,children:[e||`Start typing…`,(0,a.jsx)(`span`,{className:`caret-blink`,children:`▊`})]}),(0,a.jsx)(`p`,{className:`mt-3 text-center text-xs text-muted-foreground`,children:`Nothing is actually happening. It's just for show — as all great movie hacking should be.`})]})}export{s as component};