/**
 * Starter projects for the HTML Compiler (/tools/html-compiler).
 *
 * Every sample is a complete, self-contained page — HTML + CSS + JS — that you
 * can open, preview, edit and download as a single .html file. No build step,
 * no dependencies, no external requests.
 *
 * Style rules for this file:
 * - Plain template literals only. No backticks or `${` inside the sample code
 *   (use string concatenation in the sample's own JavaScript) so the file
 *   never needs escaping.
 * - Each sample must actually run in the preview iframe as-is.
 */

export interface HtmlSample {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  html: string;
  css: string;
  js: string;
}

export const STARTER_HTML = `<div class="container">
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes live.</p>
  <button id="click-btn">Click me</button>
  <p id="counter"></p>
</div>`;

export const STARTER_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

p {
  color: #94a3b8;
  margin-bottom: 1rem;
}

button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #7dd3fc;
  transform: translateY(-1px);
}

#counter {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #38bdf8;
}`;

export const STARTER_JS = `let count = 0;
const btn = document.getElementById('click-btn');
const counter = document.getElementById('counter');

btn.addEventListener('click', () => {
  count++;
  counter.textContent = 'Clicked ' + count + ' time' + (count !== 1 ? 's' : '');
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});`;

const BASE_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.6;
}
button { font: inherit; cursor: pointer; }`;

export const HTML_SAMPLES: HtmlSample[] = [
  {
    id: "blank",
    name: "Blank starter",
    emoji: "📄",
    desc: "Minimal page with one button and a click counter — the cleanest place to begin.",
    html: STARTER_HTML,
    css: STARTER_CSS,
    js: STARTER_JS,
  },
  {
    id: "landing",
    name: "Landing page",
    emoji: "🚀",
    desc: "Hero, feature grid, call to action and footer — a complete one-page site.",
    html: `<div class="wrap">
  <nav>
    <span class="logo">◆ Acme</span>
    <div class="links">
      <a href="#features">Features</a>
      <a href="#cta">Pricing</a>
    </div>
  </nav>

  <header class="hero">
    <p class="eyebrow">New in 2026</p>
    <h1>Ship your idea this week</h1>
    <p class="sub">Everything you need to go from blank page to live URL, without a toolchain.</p>
    <div class="cta-row">
      <button class="primary" id="cta-btn">Get started free</button>
      <a class="ghost" href="#features">See features</a>
    </div>
  </header>

  <section id="features" class="grid">
    <article><h3>⚡ Fast</h3><p>Loads instantly, works offline, no dependencies.</p></article>
    <article><h3>🔒 Private</h3><p>Nothing leaves your browser. No accounts, ever.</p></article>
    <article><h3>🎨 Yours</h3><p>Edit everything — it is just HTML, CSS and JavaScript.</p></article>
  </section>

  <section id="cta" class="cta">
    <h2>Ready when you are</h2>
    <p>Free forever. No credit card, no sign-up.</p>
    <button class="primary" id="cta2">Start now</button>
  </section>

  <footer>© 2026 Acme · Built with plain HTML</footer>
</div>`,
    css:
      BASE_CSS +
      `
.wrap { max-width: 960px; margin: 0 auto; padding: 0 20px 60px; }
nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; }
.logo { font-weight: 800; letter-spacing: -0.02em; }
.links { display: flex; gap: 18px; }
.links a { color: #94a3b8; text-decoration: none; font-size: 14px; }
.links a:hover { color: #e2e8f0; }
.hero { text-align: center; padding: 60px 0 40px; }
.eyebrow { color: #38bdf8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.hero h1 { font-size: clamp(32px, 6vw, 54px); line-height: 1.1; margin: 12px 0; letter-spacing: -0.03em; }
.sub { color: #94a3b8; max-width: 520px; margin: 0 auto; }
.cta-row { display: flex; gap: 12px; justify-content: center; margin-top: 26px; flex-wrap: wrap; }
.primary { background: #38bdf8; color: #0f172a; border: 0; padding: 12px 22px; border-radius: 10px; font-weight: 700; }
.primary:hover { background: #7dd3fc; }
.ghost { border: 1px solid #334155; color: #e2e8f0; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding: 40px 0; }
.grid article { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 20px; }
.grid h3 { margin-bottom: 6px; }
.grid p { color: #94a3b8; font-size: 14px; }
.cta { text-align: center; background: #1e293b; border-radius: 16px; padding: 40px 20px; }
.cta h2 { margin-bottom: 8px; }
.cta p { color: #94a3b8; margin-bottom: 18px; }
footer { text-align: center; color: #64748b; font-size: 13px; padding-top: 40px; }`,
    js: `document.getElementById('cta-btn').addEventListener('click', () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('cta2').addEventListener('click', () => {
  alert('Free forever — no sign-up needed.');
});`,
  },
  {
    id: "portfolio",
    name: "Personal portfolio",
    emoji: "👤",
    desc: "About, skills and project cards with a contact link.",
    html: `<div class="page">
  <header>
    <img class="avatar" src="https://api.dicebear.com/7.x/initials/svg?seed=SA" alt="Avatar" />
    <h1>Your Name</h1>
    <p class="role">Front-end developer · Hyderabad, India</p>
  </header>

  <section>
    <h2>About</h2>
    <p>I build fast, accessible websites with plain HTML, CSS and JavaScript. Currently open to freelance work.</p>
  </section>

  <section>
    <h2>Skills</h2>
    <ul class="chips">
      <li>HTML</li><li>CSS</li><li>JavaScript</li><li>Accessibility</li><li>Performance</li>
    </ul>
  </section>

  <section>
    <h2>Projects</h2>
    <div class="projects">
      <article><h3>Landing Kit</h3><p>A tiny starter for product pages.</p></article>
      <article><h3>Chart Lite</h3><p>Canvas charts in under 4 kB.</p></article>
    </div>
  </section>

  <a class="mail" href="mailto:you@example.com">Get in touch</a>
</div>`,
    css:
      BASE_CSS +
      `
.page { max-width: 720px; margin: 0 auto; padding: 48px 20px; }
header { text-align: center; margin-bottom: 36px; }
.avatar { width: 96px; height: 96px; border-radius: 50%; background: #1e293b; }
h1 { margin-top: 14px; font-size: 32px; letter-spacing: -0.02em; }
.role { color: #94a3b8; font-size: 14px; }
section { margin-bottom: 28px; }
section h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; margin-bottom: 10px; }
section p { color: #cbd5e1; }
.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li { background: #1e293b; border: 1px solid #334155; border-radius: 999px; padding: 5px 12px; font-size: 13px; }
.projects { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.projects article { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; }
.projects h3 { font-size: 15px; }
.projects p { font-size: 13px; color: #94a3b8; }
.mail { display: inline-block; margin-top: 8px; background: #38bdf8; color: #0f172a; padding: 11px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; }`,
    js: `// Tint the page using the visitor's local time of day
const hour = new Date().getHours();
const tint = hour < 12 ? '#38bdf8' : hour < 18 ? '#a78bfa' : '#f472b6';
document.querySelector('.role').style.color = tint;`,
  },
  {
    id: "pricing",
    name: "Pricing table",
    emoji: "💳",
    desc: "Three plan cards with a highlighted recommendation.",
    html: `<div class="wrap">
  <h1>Simple, honest pricing</h1>
  <p class="lede">Start free. Upgrade only if you outgrow it.</p>
  <div class="plans">
    <article class="plan">
      <h2>Free</h2>
      <p class="price">₹0<span>/mo</span></p>
      <ul><li>Everything core</li><li>No account</li><li>Offline support</li></ul>
      <button>Start free</button>
    </article>
    <article class="plan featured">
      <span class="tag">Most popular</span>
      <h2>Pro</h2>
      <p class="price">₹499<span>/mo</span></p>
      <ul><li>Everything in Free</li><li>Team seats</li><li>Priority support</li></ul>
      <button>Choose Pro</button>
    </article>
    <article class="plan">
      <h2>Team</h2>
      <p class="price">₹1,299<span>/mo</span></p>
      <ul><li>Everything in Pro</li><li>SSO</li><li>Audit log</li></ul>
      <button>Talk to us</button>
    </article>
  </div>
</div>`,
    css:
      BASE_CSS +
      `
.wrap { max-width: 960px; margin: 0 auto; padding: 56px 20px; text-align: center; }
h1 { font-size: clamp(26px, 5vw, 40px); letter-spacing: -0.03em; }
.lede { color: #94a3b8; margin-top: 8px; }
.plans { display: grid; gap: 16px; margin-top: 38px; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); text-align: left; }
.plan { position: relative; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 24px; }
.plan.featured { border-color: #38bdf8; box-shadow: 0 16px 40px rgba(56,189,248,0.18); }
.tag { position: absolute; top: -11px; left: 24px; background: #38bdf8; color: #0f172a; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; }
.price { font-size: 34px; font-weight: 800; margin: 10px 0 16px; }
.price span { font-size: 14px; color: #94a3b8; font-weight: 500; }
.plan ul { list-style: none; margin-bottom: 20px; }
.plan li { color: #cbd5e1; font-size: 14px; padding: 5px 0; }
.plan li::before { content: '✓ '; color: #34d399; }
.plan button { width: 100%; background: #334155; color: #e2e8f0; border: 0; padding: 12px; border-radius: 10px; font-weight: 700; }
.plan.featured button { background: #38bdf8; color: #0f172a; }`,
    js: `document.querySelectorAll('.plan button').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.textContent = 'Selected ✓';
    setTimeout(() => { btn.textContent = btn.dataset.label || 'Choose'; }, 1400);
  });
  btn.dataset.label = btn.textContent;
});`,
  },
  {
    id: "form",
    name: "Contact form",
    emoji: "✉️",
    desc: "Accessible form with live client-side validation.",
    html: `<div class="card">
  <h1>Contact us</h1>
  <p class="sub">We usually reply within a day.</p>
  <form id="form" novalidate>
    <label for="name">Name</label>
    <input id="name" name="name" required />
    <p class="err" data-for="name"></p>

    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
    <p class="err" data-for="email"></p>

    <label for="msg">Message</label>
    <textarea id="msg" name="msg" rows="5" required></textarea>
    <p class="err" data-for="msg"></p>

    <button type="submit">Send message</button>
    <p class="ok" id="ok" hidden>Thanks — your message is ready to send.</p>
  </form>
</div>`,
    css:
      BASE_CSS +
      `
body { display: grid; place-items: center; padding: 40px 16px; }
.card { width: 100%; max-width: 440px; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 28px; }
h1 { font-size: 22px; }
.sub { color: #94a3b8; font-size: 14px; margin: 6px 0 20px; }
label { display: block; font-size: 13px; font-weight: 600; margin: 14px 0 6px; }
input, textarea { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 11px 12px; color: #e2e8f0; font: inherit; }
input:focus, textarea:focus { outline: 2px solid rgba(56,189,248,0.5); border-color: #38bdf8; }
input.bad, textarea.bad { border-color: #f87171; }
.err { color: #f87171; font-size: 12px; min-height: 16px; margin-top: 4px; }
button { width: 100%; margin-top: 18px; background: #38bdf8; color: #0f172a; border: 0; padding: 13px; border-radius: 10px; font-weight: 700; }
.ok { margin-top: 14px; color: #34d399; font-size: 14px; }`,
    js: `const form = document.getElementById('form');
const ok = document.getElementById('ok');

function showError(field, message) {
  const box = document.querySelector('.err[data-for="' + field.name + '"]');
  box.textContent = message || '';
  field.classList.toggle('bad', Boolean(message));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  ['name', 'email', 'msg'].forEach((id) => {
    const field = document.getElementById(id);
    let message = '';
    if (!field.value.trim()) message = 'This field is required.';
    else if (id === 'email' && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(field.value)) message = 'That email looks wrong.';
    else if (id === 'msg' && field.value.trim().length < 10) message = 'Tell us a little more (10+ characters).';
    if (message) valid = false;
    showError(field, message);
  });

  ok.hidden = !valid;
});`,
  },
  {
    id: "todo",
    name: "To-do app",
    emoji: "✅",
    desc: "Add, complete and delete tasks. Saves to localStorage.",
    html: `<div class="app">
  <h1>To-do</h1>
  <form id="add">
    <input id="text" placeholder="What needs doing?" autocomplete="off" />
    <button type="submit">Add</button>
  </form>
  <ul id="list"></ul>
  <p class="empty" id="empty">Nothing yet — add your first task.</p>
  <button class="clear" id="clear">Clear completed</button>
</div>`,
    css:
      BASE_CSS +
      `
body { display: grid; place-items: start center; padding: 40px 16px; }
.app { width: 100%; max-width: 460px; }
h1 { font-size: 24px; margin-bottom: 16px; }
form { display: flex; gap: 8px; }
input { flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px; color: #e2e8f0; font: inherit; }
form button { background: #38bdf8; color: #0f172a; border: 0; border-radius: 10px; padding: 0 18px; font-weight: 700; }
ul { list-style: none; margin-top: 18px; display: grid; gap: 8px; }
li { display: flex; align-items: center; gap: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 11px 13px; }
li.done span { text-decoration: line-through; color: #64748b; }
li span { flex: 1; }
li button { background: none; border: 0; color: #94a3b8; font-size: 16px; }
li button:hover { color: #f87171; }
.empty { color: #64748b; font-size: 14px; margin-top: 16px; }
.clear { margin-top: 18px; background: none; border: 1px solid #334155; color: #94a3b8; border-radius: 10px; padding: 9px 14px; }`,
    js: `const KEY = 'sample-todos';
let items = [];
try { items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { items = []; }

const list = document.getElementById('list');
const empty = document.getElementById('empty');

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  render();
}

function render() {
  list.innerHTML = '';
  empty.hidden = items.length > 0;
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = item.done ? 'done' : '';

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = item.done;
    box.addEventListener('change', () => { items[index].done = box.checked; save(); });

    const label = document.createElement('span');
    label.textContent = item.text;

    const del = document.createElement('button');
    del.textContent = '✕';
    del.addEventListener('click', () => { items.splice(index, 1); save(); });

    li.append(box, label, del);
    list.append(li);
  });
}

document.getElementById('add').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('text');
  if (!input.value.trim()) return;
  items.push({ text: input.value.trim(), done: false });
  input.value = '';
  save();
});

document.getElementById('clear').addEventListener('click', () => {
  items = items.filter((i) => !i.done);
  save();
});

render();`,
  },
  {
    id: "gallery",
    name: "Photo gallery",
    emoji: "🖼️",
    desc: "Responsive masonry-style grid with a lightbox on click.",
    html: `<div class="wrap">
  <h1>Gallery</h1>
  <div class="grid" id="grid"></div>
</div>
<div class="lightbox" id="lightbox" hidden>
  <button class="close" id="close">✕</button>
  <img id="big" alt="Large preview" />
</div>`,
    css:
      BASE_CSS +
      `
.wrap { max-width: 1000px; margin: 0 auto; padding: 36px 20px; }
h1 { font-size: 24px; margin-bottom: 18px; }
.grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; cursor: zoom-in; transition: transform 0.2s; }
.grid img:hover { transform: scale(1.03); }
.lightbox { position: fixed; inset: 0; background: rgba(2,6,23,0.92); display: grid; place-items: center; padding: 24px; }
.lightbox img { max-width: 90vw; max-height: 80vh; border-radius: 14px; }
.close { position: absolute; top: 18px; right: 20px; background: #1e293b; color: #e2e8f0; border: 0; border-radius: 50%; width: 40px; height: 40px; font-size: 16px; }`,
    js: `const grid = document.getElementById('grid');
const box = document.getElementById('lightbox');
const big = document.getElementById('big');

for (let i = 1; i <= 12; i++) {
  const img = document.createElement('img');
  img.src = 'https://picsum.photos/seed/slashai' + i + '/400';
  img.alt = 'Sample photo ' + i;
  img.addEventListener('click', () => { big.src = img.src.replace('/400', '/1200'); box.hidden = false; });
  grid.append(img);
}

document.getElementById('close').addEventListener('click', () => { box.hidden = true; });
box.addEventListener('click', (e) => { if (e.target === box) box.hidden = true; });`,
  },
  {
    id: "auth",
    name: "Login screen",
    emoji: "🔐",
    desc: "Split-panel sign-in form with a show/hide password toggle.",
    html: `<div class="split">
  <aside>
    <h1>◆ Acme</h1>
    <p>Everything you shipped, in one calm dashboard.</p>
  </aside>
  <main>
    <form id="login">
      <h2>Welcome back</h2>
      <label for="email">Email</label>
      <input id="email" type="email" placeholder="you@example.com" required />
      <label for="pw">Password</label>
      <div class="pw">
        <input id="pw" type="password" placeholder="••••••••" required />
        <button type="button" id="toggle">Show</button>
      </div>
      <button class="go" type="submit">Sign in</button>
      <p class="note" id="note" hidden>Demo only — no data leaves this page.</p>
    </form>
  </main>
</div>`,
    css:
      BASE_CSS +
      `
.split { min-height: 100vh; display: grid; grid-template-columns: 1fr; }
@media (min-width: 760px) { .split { grid-template-columns: 1fr 1fr; } }
aside { background: linear-gradient(160deg, #0ea5e9, #6366f1); padding: 44px 32px; display: flex; flex-direction: column; justify-content: center; }
aside h1 { font-size: 26px; color: #04121f; }
aside p { color: rgba(4,18,31,0.75); margin-top: 10px; max-width: 280px; }
main { display: grid; place-items: center; padding: 40px 20px; }
form { width: 100%; max-width: 360px; }
h2 { font-size: 22px; margin-bottom: 18px; }
label { display: block; font-size: 13px; font-weight: 600; margin: 14px 0 6px; }
input { width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px; color: #e2e8f0; font: inherit; }
.pw { display: flex; gap: 8px; }
.pw button { background: #334155; border: 0; color: #cbd5e1; border-radius: 10px; padding: 0 14px; }
.go { width: 100%; margin-top: 20px; background: #38bdf8; color: #0f172a; border: 0; border-radius: 10px; padding: 13px; font-weight: 700; }
.note { color: #facc15; font-size: 13px; margin-top: 12px; }`,
    js: `document.getElementById('toggle').addEventListener('click', (e) => {
  const pw = document.getElementById('pw');
  const show = pw.type === 'password';
  pw.type = show ? 'text' : 'password';
  e.target.textContent = show ? 'Hide' : 'Show';
});

document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('note').hidden = false;
});`,
  },
  {
    id: "dashboard",
    name: "Stats dashboard",
    emoji: "📊",
    desc: "KPI cards, a CSS bar chart and a live-updating feed.",
    html: `<div class="wrap">
  <h1>Dashboard</h1>
  <div class="cards">
    <article><p class="k">Visitors</p><p class="v" id="v1">0</p></article>
    <article><p class="k">Signups</p><p class="v" id="v2">0</p></article>
    <article><p class="k">Revenue</p><p class="v" id="v3">₹0</p></article>
  </div>

  <section class="chart">
    <h2>Last 7 days</h2>
    <div class="bars" id="bars"></div>
  </section>

  <section class="feed">
    <h2>Activity</h2>
    <ul id="feed"></ul>
  </section>
</div>`,
    css:
      BASE_CSS +
      `
.wrap { max-width: 900px; margin: 0 auto; padding: 36px 20px; }
h1 { font-size: 24px; margin-bottom: 18px; }
.cards { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.cards article { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 18px; }
.k { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
.v { font-size: 30px; font-weight: 800; margin-top: 6px; }
section { margin-top: 28px; }
section h2 { font-size: 14px; color: #94a3b8; margin-bottom: 12px; }
.bars { display: flex; align-items: flex-end; gap: 10px; height: 160px; background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 14px; }
.bar { flex: 1; background: linear-gradient(180deg, #38bdf8, #6366f1); border-radius: 6px 6px 2px 2px; transition: height 0.6s ease; }
.feed ul { list-style: none; display: grid; gap: 8px; }
.feed li { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 11px 13px; font-size: 14px; color: #cbd5e1; }`,
    js: `function animate(el, target, format) {
  let current = 0;
  const step = Math.max(1, Math.round(target / 40));
  const timer = setInterval(() => {
    current = Math.min(target, current + step);
    el.textContent = format(current);
    if (current >= target) clearInterval(timer);
  }, 22);
}

animate(document.getElementById('v1'), 12480, (n) => n.toLocaleString('en-IN'));
animate(document.getElementById('v2'), 936, (n) => n.toLocaleString('en-IN'));
animate(document.getElementById('v3'), 486200, (n) => '₹' + n.toLocaleString('en-IN'));

const bars = document.getElementById('bars');
[42, 68, 35, 88, 54, 76, 96].forEach((height, i) => {
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.height = '4%';
  bar.title = 'Day ' + (i + 1);
  bars.append(bar);
  setTimeout(() => { bar.style.height = height + '%'; }, 60 * i);
});

const feed = document.getElementById('feed');
const events = [
  'New signup from Hyderabad',
  'Payment received — ₹499',
  'Report exported to CSV',
  'Landing page published',
  'New team member invited'
];
events.forEach((text, i) => {
  const li = document.createElement('li');
  li.textContent = text;
  li.style.opacity = '0';
  feed.append(li);
  setTimeout(() => { li.style.transition = 'opacity 0.4s'; li.style.opacity = '1'; }, 250 * i);
});`,
  },
  {
    id: "countdown",
    name: "Countdown timer",
    emoji: "⏳",
    desc: "Set a date and watch days, hours, minutes and seconds tick down.",
    html: `<div class="box">
  <h1>Countdown</h1>
  <label for="when">Target date &amp; time</label>
  <input type="datetime-local" id="when" />
  <div class="clock">
    <div><span id="d">0</span><small>days</small></div>
    <div><span id="h">0</span><small>hours</small></div>
    <div><span id="m">0</span><small>minutes</small></div>
    <div><span id="s">0</span><small>seconds</small></div>
  </div>
  <p class="done" id="done" hidden>Time's up! 🎉</p>
</div>`,
    css:
      BASE_CSS +
      `
body { display: grid; place-items: center; min-height: 100vh; padding: 30px 16px; }
.box { text-align: center; width: 100%; max-width: 520px; }
h1 { font-size: 26px; margin-bottom: 6px; }
label { display: block; color: #94a3b8; font-size: 13px; margin: 16px 0 8px; }
input { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 11px 12px; color: #e2e8f0; font: inherit; }
.clock { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 24px; }
.clock div { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 16px 6px; }
.clock span { display: block; font-size: clamp(22px, 6vw, 34px); font-weight: 800; font-variant-numeric: tabular-nums; }
.clock small { display: block; color: #94a3b8; font-size: 11px; margin-top: 4px; }
.done { margin-top: 20px; color: #34d399; font-weight: 700; }`,
    js: `const input = document.getElementById('when');
const target = new Date(Date.now() + 3 * 86400000 + 3600000);
input.value = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const when = new Date(input.value).getTime();
  const left = Math.max(0, when - Date.now());
  document.getElementById('d').textContent = Math.floor(left / 86400000);
  document.getElementById('h').textContent = pad(Math.floor(left / 3600000) % 24);
  document.getElementById('m').textContent = pad(Math.floor(left / 60000) % 60);
  document.getElementById('s').textContent = pad(Math.floor(left / 1000) % 60);
  document.getElementById('done').hidden = left > 0;
}

input.addEventListener('input', tick);
tick();
setInterval(tick, 250);`,
  },
  {
    id: "quiz",
    name: "Quiz app",
    emoji: "❓",
    desc: "Multiple-choice quiz with scoring and a results screen.",
    html: `<div class="card">
  <div id="start">
    <h1>Quick Quiz</h1>
    <p>Five questions. No time limit. Good luck.</p>
    <button id="go">Start</button>
  </div>
  <div id="play" hidden>
    <p class="meta"><span id="progress">Question 1 / 5</span><span id="score">Score 0</span></p>
    <h2 id="q"></h2>
    <div class="options" id="options"></div>
  </div>
  <div id="end" hidden>
    <h1 id="result"></h1>
    <p id="summary"></p>
    <button id="again">Play again</button>
  </div>
</div>`,
    css:
      BASE_CSS +
      `
body { display: grid; place-items: center; min-height: 100vh; padding: 30px 16px; }
.card { width: 100%; max-width: 520px; background: #1e293b; border: 1px solid #334155; border-radius: 18px; padding: 28px; }
h1 { font-size: 24px; margin-bottom: 8px; }
.card > div > p { color: #94a3b8; font-size: 14px; }
button { background: #38bdf8; color: #0f172a; border: 0; border-radius: 10px; padding: 12px 20px; font-weight: 700; margin-top: 16px; }
.meta { display: flex; justify-content: space-between; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
h2 { font-size: 19px; margin: 14px 0 18px; }
.options { display: grid; gap: 9px; }
.options button { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; text-align: left; padding: 13px 15px; font-weight: 500; margin: 0; }
.options button:hover { border-color: #38bdf8; }
.options button.right { border-color: #34d399; background: rgba(52,211,153,0.12); }
.options button.wrong { border-color: #f87171; background: rgba(248,113,113,0.12); }`,
    js: `const QUESTIONS = [
  { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyperlink Text Manager'], answer: 0 },
  { q: 'Which CSS property changes text colour?', options: ['font-style', 'color', 'background'], answer: 1 },
  { q: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'define'], answer: 1 },
  { q: 'What does the DOM represent?', options: ['The page as a tree of objects', 'A database', 'A stylesheet'], answer: 0 },
  { q: 'Best format for a web image?', options: ['BMP', 'WebP', 'PSD'], answer: 1 }
];

let index = 0;
let score = 0;
let locked = false;

const startView = document.getElementById('start');
const playView = document.getElementById('play');
const endView = document.getElementById('end');

function showQuestion() {
  const item = QUESTIONS[index];
  locked = false;
  document.getElementById('progress').textContent = 'Question ' + (index + 1) + ' / ' + QUESTIONS.length;
  document.getElementById('score').textContent = 'Score ' + score;
  document.getElementById('q').textContent = item.q;

  const box = document.getElementById('options');
  box.innerHTML = '';
  item.options.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.addEventListener('click', () => answer(i, btn));
    box.append(btn);
  });
}

function answer(choice, btn) {
  if (locked) return;
  locked = true;
  const item = QUESTIONS[index];
  if (choice === item.answer) {
    score++;
    btn.classList.add('right');
  } else {
    btn.classList.add('wrong');
    document.getElementById('options').children[item.answer].classList.add('right');
  }
  setTimeout(() => {
    index++;
    if (index < QUESTIONS.length) showQuestion();
    else finish();
  }, 750);
}

function finish() {
  playView.hidden = true;
  endView.hidden = false;
  document.getElementById('result').textContent = score + ' / ' + QUESTIONS.length;
  document.getElementById('summary').textContent =
    score === QUESTIONS.length ? 'Perfect score!' : score >= 3 ? 'Solid work.' : 'Good start — try again.';
}

document.getElementById('go').addEventListener('click', () => {
  startView.hidden = true;
  playView.hidden = false;
  showQuestion();
});

document.getElementById('again').addEventListener('click', () => {
  index = 0; score = 0;
  endView.hidden = true;
  playView.hidden = false;
  showQuestion();
});`,
  },
  {
    id: "clock",
    name: "Clock & stopwatch",
    emoji: "⏱️",
    desc: "Live clock plus a stopwatch with lap times.",
    html: `<div class="wrap">
  <section>
    <h1 id="clock">00:00:00</h1>
    <p id="date" class="date"></p>
  </section>

  <section class="watch">
    <h2>Stopwatch</h2>
    <p class="time" id="time">00:00.00</p>
    <div class="buttons">
      <button id="toggle">Start</button>
      <button id="lap" class="ghost">Lap</button>
      <button id="reset" class="ghost">Reset</button>
    </div>
    <ol id="laps"></ol>
  </section>
</div>`,
    css:
      BASE_CSS +
      `
body { display: grid; place-items: center; min-height: 100vh; padding: 30px 16px; text-align: center; }
.wrap { width: 100%; max-width: 420px; }
#clock { font-size: clamp(38px, 12vw, 64px); font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
.date { color: #94a3b8; font-size: 14px; margin-bottom: 30px; }
.watch { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 22px; }
h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
.time { font-size: 34px; font-weight: 800; font-variant-numeric: tabular-nums; margin: 10px 0 16px; }
.buttons { display: flex; gap: 8px; justify-content: center; }
button { background: #38bdf8; color: #0f172a; border: 0; border-radius: 10px; padding: 10px 18px; font-weight: 700; }
button.ghost { background: none; border: 1px solid #334155; color: #cbd5e1; }
ol { list-style: none; margin-top: 16px; display: grid; gap: 6px; max-height: 150px; overflow-y: auto; }
ol li { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 5px; }`,
    js: `function pad(n) { return String(n).padStart(2, '0'); }

function paintClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}
paintClock();
setInterval(paintClock, 1000);

let running = false;
let elapsed = 0;
let startedAt = 0;
let lastLap = 0;
const timeEl = document.getElementById('time');
const toggle = document.getElementById('toggle');

function format(ms) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((ms % 1000) / 10);
  return pad(minutes) + ':' + pad(seconds) + '.' + pad(hundredths);
}

function paint() {
  timeEl.textContent = format(elapsed + (running ? performance.now() - startedAt : 0));
  if (running) requestAnimationFrame(paint);
}

toggle.addEventListener('click', () => {
  if (running) {
    elapsed += performance.now() - startedAt;
    running = false;
    toggle.textContent = 'Start';
  } else {
    startedAt = performance.now();
    running = true;
    toggle.textContent = 'Pause';
    paint();
  }
});

document.getElementById('lap').addEventListener('click', () => {
  const now = elapsed + (running ? performance.now() - startedAt : 0);
  const li = document.createElement('li');
  const n = document.getElementById('laps').children.length + 1;
  li.innerHTML = '<span>Lap ' + n + '</span><span>' + format(now - lastLap) + '</span>';
  document.getElementById('laps').prepend(li);
  lastLap = now;
});

document.getElementById('reset').addEventListener('click', () => {
  running = false;
  elapsed = 0;
  lastLap = 0;
  toggle.textContent = 'Start';
  timeEl.textContent = '00:00.00';
  document.getElementById('laps').innerHTML = '';
});`,
  },
  {
    id: "nav",
    name: "Responsive navbar",
    emoji: "📱",
    desc: "Sticky header that collapses into a mobile menu.",
    html: `<header class="bar">
  <span class="brand">◆ Acme</span>
  <button class="burger" id="burger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <nav id="nav">
    <a href="#home">Home</a>
    <a href="#docs">Docs</a>
    <a href="#pricing">Pricing</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<main>
  <h1>Responsive navigation</h1>
  <p>Resize the preview: the menu collapses under 720px and opens with the button.</p>
</main>`,
    css:
      BASE_CSS +
      `
.bar { position: sticky; top: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; background: rgba(15,23,42,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid #1e293b; }
.brand { font-weight: 800; }
nav { display: flex; gap: 20px; }
nav a { color: #cbd5e1; text-decoration: none; font-size: 14px; }
nav a:hover { color: #38bdf8; }
.burger { display: none; flex-direction: column; gap: 4px; background: none; border: 0; padding: 6px; }
.burger span { width: 22px; height: 2px; background: #e2e8f0; border-radius: 2px; }
main { max-width: 720px; margin: 0 auto; padding: 60px 20px; }
main h1 { font-size: clamp(24px, 5vw, 38px); letter-spacing: -0.03em; margin-bottom: 12px; }
main p { color: #94a3b8; }
@media (max-width: 720px) {
  .burger { display: flex; }
  nav { position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; background: #0f172a; border-bottom: 1px solid #1e293b; max-height: 0; overflow: hidden; transition: max-height 0.25s ease; }
  nav.open { max-height: 260px; }
  nav a { padding: 14px 20px; border-top: 1px solid #1e293b; }
}`,
    js: `const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') nav.classList.remove('open');
});`,
  },
  {
    id: "particles",
    name: "Canvas particles",
    emoji: "✨",
    desc: "Animated particle field on a canvas, with click to burst.",
    html: `<canvas id="stage"></canvas>
<p class="hint">Click anywhere to add a burst of particles.</p>`,
    css:
      BASE_CSS +
      `
body { overflow: hidden; background: #050914; }
canvas { display: block; width: 100vw; height: 100vh; }
.hint { position: fixed; bottom: 16px; left: 0; right: 0; text-align: center; color: #64748b; font-size: 13px; pointer-events: none; }`,
    js: `const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resize();
window.addEventListener('resize', resize);

function addBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.6 + 0.6;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 2.4 + 0.8,
      life: 1
    });
  }
}

for (let i = 0; i < 70; i++) {
  addBurst(Math.random() * canvas.width, Math.random() * canvas.height, 1);
}

canvas.addEventListener('click', (e) => addBurst(e.clientX, e.clientY, 40));

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.995;
    p.vy *= 0.995;
    p.life -= 0.004;
  });
  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(56,189,248,' + Math.max(0, p.life) + ')';
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(frame);
}
frame();`,
  },
  {
    id: "blog",
    name: "Blog article",
    emoji: "📰",
    desc: "Readable article layout with a pull quote and code block.",
    html: `<article>
  <p class="kicker">Engineering · 6 min read</p>
  <h1>How I ship side projects in a weekend</h1>
  <p class="byline">By Your Name · 18 September 2026</p>

  <p class="lede">Most side projects die in the setup phase. Here is the loop I use to get from idea to a working URL in two days.</p>

  <h2>1. Scope it to one loop</h2>
  <p>Write down the single thing a user can do. Everything that is not that thing moves to a "later" list you will probably never open.</p>

  <blockquote>If you cannot describe the app in one sentence, you are not ready to build it.</blockquote>

  <h2>2. Pick boring tools</h2>
  <p>Boring tools have answers on the internet. That matters more than performance at this stage.</p>

  <pre><code>const ideas = projects
  .filter((p) =&gt; p.excitement &gt; 7)
  .sort((a, b) =&gt; a.effort - b.effort);

console.log(ideas[0]);</code></pre>

  <h2>3. Ship before you polish</h2>
  <p>A live URL with rough edges beats a perfect local branch every single time.</p>
</article>`,
    css:
      BASE_CSS +
      `
article { max-width: 660px; margin: 0 auto; padding: 56px 22px 80px; }
.kicker { color: #38bdf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
h1 { font-size: clamp(28px, 6vw, 42px); line-height: 1.15; letter-spacing: -0.03em; margin: 12px 0 10px; }
.byline { color: #64748b; font-size: 13px; margin-bottom: 30px; }
.lede { font-size: 19px; color: #cbd5e1; }
h2 { font-size: 21px; margin: 34px 0 10px; letter-spacing: -0.01em; }
p { color: #94a3b8; margin-bottom: 14px; }
blockquote { border-left: 3px solid #38bdf8; padding: 6px 0 6px 18px; margin: 26px 0; font-size: 18px; color: #e2e8f0; font-style: italic; }
pre { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; overflow-x: auto; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: #7dd3fc; }`,
    js: `// Reading progress bar
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#38bdf8;width:0;z-index:9';
document.body.append(bar);

window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
});`,
  },
];

export const DEFAULT_SAMPLE = HTML_SAMPLES[0]!;

export const getHtmlSample = (id: string | undefined) =>
  id ? HTML_SAMPLES.find((s) => s.id === id) : undefined;
