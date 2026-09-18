import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./code-xml-lEnfwl07.js";import{t as i}from"./copy-BfPFX1Dw.js";import{t as a}from"./download-ex15N5eI.js";import{t as o}from"./play-B2rONWD0.js";import{Dt as s,Ot as c}from"./index-C4s1Eqpk.js";var l=e(t()),u=n(),d=`slashai-html-compiler`,f=`<div class="container">
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes live.</p>
  <button id="click-btn">Click me</button>
  <p id="counter"></p>
</div>`,p=`* {
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
}`,m=`let count = 0;
const btn = document.getElementById('click-btn');
const counter = document.getElementById('counter');

btn.addEventListener('click', () => {
  count++;
  counter.textContent = \`Clicked \${count} time\${count !== 1 ? 's' : ''}\`;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});`;function h(){let[e,t]=(0,l.useState)(()=>{try{let e=localStorage.getItem(d);if(e)return JSON.parse(e)}catch{}return{html:f,css:p,js:m}}),[n,h]=(0,l.useState)(`html`),[g,_]=(0,l.useState)([]),[v,y]=(0,l.useState)(!1),[b,x]=(0,l.useState)(!1),[S,C]=(0,l.useState)(`split`),[w,T]=(0,l.useState)(``),E=(0,l.useRef)(null),D=(0,l.useRef)(null),O=(0,l.useRef)(void 0);(0,l.useEffect)(()=>{try{localStorage.setItem(d,JSON.stringify(e))}catch{}},[e]);let k=(0,l.useCallback)(()=>{let t=`
      (function() {
        const _origLog = console.log;
        const _origError = console.error;
        const _origWarn = console.warn;
        console.log = function() {
          _origLog.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'log', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        console.error = function() {
          _origError.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'error', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        console.warn = function() {
          _origWarn.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'warn', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        window.onerror = function(msg, src, line, col, err) {
          parent.postMessage({ type: 'console', level: 'error', args: msg + ' (line ' + line + ')' }, '*');
          return false;
        };
        try {
          ${e.js}
        } catch(e) {
          parent.postMessage({ type: 'console', level: 'error', args: e.toString() }, '*');
        }
      })();
    `;return`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${e.css}</style>
</head>
<body>
  ${e.html}
  <script>${t}<\/script>
</body>
</html>`},[e.html,e.css,e.js]);(0,l.useEffect)(()=>(O.current&&clearTimeout(O.current),O.current=setTimeout(()=>{T(k())},300),()=>{O.current&&clearTimeout(O.current)}),[k]),(0,l.useEffect)(()=>{let e=e=>{e.data?.type===`console`&&_(t=>{let n=[...t,`[${e.data.level}] ${e.data.args}`];return n.length>100?n.slice(-100):n})};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]);let A=()=>{_([]),T(``),requestAnimationFrame(()=>T(k()))},j=()=>{t({html:f,css:p,js:m}),_([])},M=async()=>{let t=`<style>\n${e.css}\n</style>\n\n${e.html}\n\n<script>\n${e.js}\n<\/script>`;await navigator.clipboard.writeText(t),y(!0),setTimeout(()=>y(!1),2e3)},N=()=>{let t=`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>My Page</title>\n<style>\n${e.css}\n</style>\n</head>\n<body>\n${e.html}\n<script>\n${e.js}\n<\/script>\n</body>\n</html>`,n=new Blob([t],{type:`text/html`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`page.html`,i.click(),URL.revokeObjectURL(r)},P=e=>{if(e.key===`Tab`){e.preventDefault();let r=e.currentTarget,i=r.selectionStart,a=r.selectionEnd,o=r.value,s=o.substring(0,i)+`  `+o.substring(a),c=n;t(e=>({...e,[c]:s})),requestAnimationFrame(()=>{r.selectionStart=r.selectionEnd=i+2})}},F=e[n],I=F.split(`
`).length,L={html:`text-orange-400 border-orange-400`,css:`text-blue-400 border-blue-400`,js:`text-yellow-400 border-yellow-400`};return(0,u.jsxs)(`div`,{className:`flex h-[100dvh] flex-col overflow-hidden bg-[#0a0a0f] text-slate-200`,children:[(0,u.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-2 bg-[#0f1318] border-b border-slate-800`,children:[(0,u.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,u.jsx)(r,{className:`w-5 h-5 text-cyan-400`}),(0,u.jsx)(`span`,{className:`font-semibold text-sm`,children:`HTML Compiler`}),(0,u.jsx)(`span`,{className:`text-[11px] text-slate-500 hidden sm:inline`,children:`Live Preview`})]}),(0,u.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,u.jsx)(`div`,{className:`mr-0.5 flex items-center rounded-md border border-slate-700 p-0.5`,children:[`code`,`split`,`preview`].map(e=>(0,u.jsx)(`button`,{onClick:()=>C(e),className:`rounded px-2 py-1 text-[10px] font-medium capitalize sm:px-2.5 sm:text-[11px] ${S===e?`bg-cyan-500/20 text-cyan-400`:`text-slate-400 hover:text-slate-200`}`,children:e===`preview`?`View`:e},e))}),(0,u.jsxs)(`button`,{onClick:A,className:`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 sm:bg-cyan-500/15 sm:rounded-md sm:hover:bg-cyan-500/25`,title:`Run (refresh preview)`,children:[(0,u.jsx)(o,{className:`h-3.5 w-3.5`}),(0,u.jsx)(`span`,{className:`hidden sm:inline`,children:`Run`})]}),(0,u.jsxs)(`button`,{onClick:M,className:`flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Copy full code`,children:[v?(0,u.jsx)(c,{className:`w-3.5 h-3.5 text-green-400`}):(0,u.jsx)(i,{className:`w-3.5 h-3.5`}),(0,u.jsx)(`span`,{className:`hidden sm:inline`,children:v?`Copied`:`Copy`})]}),(0,u.jsxs)(`button`,{onClick:N,className:`flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Download as HTML file`,children:[(0,u.jsx)(a,{className:`w-3.5 h-3.5`}),(0,u.jsx)(`span`,{className:`hidden sm:inline`,children:`Export`})]}),(0,u.jsx)(`button`,{onClick:j,className:`flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Reset to defaults`,children:(0,u.jsx)(s,{className:`w-3.5 h-3.5`})})]})]}),(0,u.jsxs)(`div`,{className:`flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden`,children:[(0,u.jsxs)(`div`,{className:`flex min-h-0 flex-col border-slate-800 lg:border-r ${S===`code`?`w-full flex-1`:S===`split`?`h-[45vh] w-full shrink-0 lg:h-auto lg:w-1/2`:`hidden`}`,children:[(0,u.jsxs)(`div`,{className:`flex items-center border-b border-slate-800 bg-[#0f1318]`,children:[[`html`,`css`,`js`].map(e=>(0,u.jsx)(`button`,{onClick:()=>h(e),className:`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${n===e?`${L[e]} border-b-2 bg-slate-800/50`:`text-slate-500 hover:text-slate-300 border-b-2 border-transparent`}`,children:e},e)),(0,u.jsxs)(`div`,{className:`ml-auto pr-3 text-[11px] text-slate-600`,children:[I,` lines`]})]}),(0,u.jsx)(`div`,{className:`relative min-h-0 flex-1`,children:(0,u.jsxs)(`div`,{className:`absolute inset-0 flex`,children:[(0,u.jsx)(`div`,{className:`w-12 flex-shrink-0 bg-[#0a0a0f] border-r border-slate-800/50 pt-3 text-right pr-2 text-[11px] text-slate-600 select-none font-mono leading-[1.6] overflow-hidden`,children:Array.from({length:I},(e,t)=>(0,u.jsx)(`div`,{children:t+1},t+1))}),(0,u.jsx)(`textarea`,{ref:D,value:F,onChange:e=>t(t=>({...t,[n]:e.target.value})),onKeyDown:P,spellCheck:!1,className:`flex-1 bg-[#0d1117] p-3 text-[13px] leading-[1.6] text-slate-200 resize-none outline-none font-mono placeholder:text-slate-600`,placeholder:`Write your ${n.toUpperCase()} here...`,style:{tabSize:2}})]})})]}),(0,u.jsxs)(`div`,{className:`flex min-h-0 flex-1 flex-col ${S===`code`?`hidden`:``}`,children:[(0,u.jsxs)(`div`,{className:`flex items-center justify-between px-3 py-2 bg-[#0f1318] border-b border-slate-800`,children:[(0,u.jsx)(`span`,{className:`text-[11px] text-slate-500 uppercase tracking-wider font-medium`,children:`Preview`}),(0,u.jsx)(`div`,{className:`flex items-center gap-1`,children:(0,u.jsx)(`button`,{onClick:()=>_([]),className:`text-[11px] text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded transition-colors`,children:`Clear console`})})]}),(0,u.jsx)(`div`,{className:`relative min-h-0 flex-1 bg-white`,children:w?(0,u.jsx)(`iframe`,{ref:E,srcDoc:w,className:`absolute inset-0 h-full w-full border-0`,sandbox:`allow-scripts allow-modals`,title:`Preview`}):(0,u.jsxs)(`div`,{className:`flex h-full items-center justify-center text-slate-400 text-sm`,children:[`Click `,(0,u.jsx)(`strong`,{className:`mx-1 text-cyan-400`,children:`Run`}),` to preview`]})}),g.length>0&&(0,u.jsx)(`div`,{className:`h-28 shrink-0 border-t border-slate-800 bg-[#0d1117] overflow-auto font-mono text-[11px] leading-relaxed`,children:g.map((e,t)=>(0,u.jsx)(`div`,{className:`px-3 py-0.5 ${e.startsWith(`[error]`)?`text-red-400`:e.startsWith(`[warn]`)?`text-yellow-400`:`text-slate-400`}`,children:e},t))})]})]})]})}export{h as component};