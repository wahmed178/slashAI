import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./createLucideIcon-CVi6igz2.js";import{t as i}from"./code-xml-lEnfwl07.js";import{t as a}from"./copy-BfPFX1Dw.js";import{t as o}from"./download-ex15N5eI.js";import{t as s}from"./play-B2rONWD0.js";import{t as c}from"./rotate-ccw-C_iNo-zY.js";import{Z as l}from"./index-BkoQycAI.js";var u=r(`maximize-2`,[[`path`,{d:`M15 3h6v6`,key:`1q9fwt`}],[`path`,{d:`m21 3-7 7`,key:`1l2asr`}],[`path`,{d:`m3 21 7-7`,key:`tjx5ai`}],[`path`,{d:`M9 21H3v-6`,key:`wtvkvv`}]]),d=r(`minimize-2`,[[`path`,{d:`m14 10 7-7`,key:`oa77jy`}],[`path`,{d:`M20 10h-6V4`,key:`mjg0md`}],[`path`,{d:`m3 21 7-7`,key:`tjx5ai`}],[`path`,{d:`M4 14h6v6`,key:`rmj7iw`}]]),f=e(t()),p=n(),m=`slashai-html-compiler`,h=`<div class="container">
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes live.</p>
  <button id="click-btn">Click me</button>
  <p id="counter"></p>
</div>`,g=`* {
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
}`,_=`let count = 0;
const btn = document.getElementById('click-btn');
const counter = document.getElementById('counter');

btn.addEventListener('click', () => {
  count++;
  counter.textContent = \`Clicked \${count} time\${count !== 1 ? 's' : ''}\`;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});`;function v(){let[e,t]=(0,f.useState)(()=>{try{let e=localStorage.getItem(m);if(e)return JSON.parse(e)}catch{}return{html:h,css:g,js:_}}),[n,r]=(0,f.useState)(`html`),[v,y]=(0,f.useState)([]),[b,x]=(0,f.useState)(!1),[S,C]=(0,f.useState)(!1),[w,T]=(0,f.useState)(!1),[E,D]=(0,f.useState)(``),O=(0,f.useRef)(null),k=(0,f.useRef)(null),A=(0,f.useRef)(void 0);(0,f.useEffect)(()=>{try{localStorage.setItem(m,JSON.stringify(e))}catch{}},[e]);let j=(0,f.useCallback)(()=>{let t=`
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
</html>`},[e.html,e.css,e.js]);(0,f.useEffect)(()=>(A.current&&clearTimeout(A.current),A.current=setTimeout(()=>{D(j())},300),()=>{A.current&&clearTimeout(A.current)}),[j]),(0,f.useEffect)(()=>{let e=e=>{e.data?.type===`console`&&y(t=>{let n=[...t,`[${e.data.level}] ${e.data.args}`];return n.length>100?n.slice(-100):n})};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]);let M=()=>{y([]),D(``),requestAnimationFrame(()=>D(j()))},N=()=>{t({html:h,css:g,js:_}),y([])},P=async()=>{let t=`<style>\n${e.css}\n</style>\n\n${e.html}\n\n<script>\n${e.js}\n<\/script>`;await navigator.clipboard.writeText(t),x(!0),setTimeout(()=>x(!1),2e3)},F=()=>{let t=`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>My Page</title>\n<style>\n${e.css}\n</style>\n</head>\n<body>\n${e.html}\n<script>\n${e.js}\n<\/script>\n</body>\n</html>`,n=new Blob([t],{type:`text/html`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`page.html`,i.click(),URL.revokeObjectURL(r)},I=e=>{if(e.key===`Tab`){e.preventDefault();let r=e.currentTarget,i=r.selectionStart,a=r.selectionEnd,o=r.value,s=o.substring(0,i)+`  `+o.substring(a),c=n;t(e=>({...e,[c]:s})),requestAnimationFrame(()=>{r.selectionStart=r.selectionEnd=i+2})}},L=e[n],R=L.split(`
`).length,z={html:`text-orange-400 border-orange-400`,css:`text-blue-400 border-blue-400`,js:`text-yellow-400 border-yellow-400`};return(0,p.jsxs)(`div`,{className:`min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col`,children:[(0,p.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-2 bg-[#0f1318] border-b border-slate-800`,children:[(0,p.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,p.jsx)(i,{className:`w-5 h-5 text-cyan-400`}),(0,p.jsx)(`span`,{className:`font-semibold text-sm`,children:`HTML Compiler`}),(0,p.jsx)(`span`,{className:`text-[11px] text-slate-500 hidden sm:inline`,children:`Live Preview`})]}),(0,p.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,p.jsxs)(`button`,{onClick:M,className:`flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 text-cyan-400 rounded-md text-xs font-medium hover:bg-cyan-500/25 transition-colors`,title:`Run (refresh preview)`,children:[(0,p.jsx)(s,{className:`w-3.5 h-3.5`}),` Run`]}),(0,p.jsxs)(`button`,{onClick:P,className:`flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Copy full code`,children:[b?(0,p.jsx)(l,{className:`w-3.5 h-3.5 text-green-400`}):(0,p.jsx)(a,{className:`w-3.5 h-3.5`}),b?`Copied`:`Copy`]}),(0,p.jsxs)(`button`,{onClick:F,className:`flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Download as HTML file`,children:[(0,p.jsx)(o,{className:`w-3.5 h-3.5`}),` Export`]}),(0,p.jsx)(`button`,{onClick:N,className:`flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors`,title:`Reset to defaults`,children:(0,p.jsx)(c,{className:`w-3.5 h-3.5`})})]})]}),(0,p.jsxs)(`div`,{className:`flex-1 flex flex-col lg:flex-row overflow-hidden`,children:[(0,p.jsxs)(`div`,{className:`flex flex-col ${w?`hidden lg:flex lg:w-1/2`:`w-full lg:w-1/2`} border-r border-slate-800`,children:[(0,p.jsxs)(`div`,{className:`flex items-center border-b border-slate-800 bg-[#0f1318]`,children:[[`html`,`css`,`js`].map(e=>(0,p.jsx)(`button`,{onClick:()=>r(e),className:`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${n===e?`${z[e]} border-b-2 bg-slate-800/50`:`text-slate-500 hover:text-slate-300 border-b-2 border-transparent`}`,children:e},e)),(0,p.jsxs)(`div`,{className:`ml-auto pr-3 text-[11px] text-slate-600`,children:[R,` lines`]})]}),(0,p.jsx)(`div`,{className:`flex-1 relative overflow-auto`,children:(0,p.jsxs)(`div`,{className:`absolute inset-0 flex`,children:[(0,p.jsx)(`div`,{className:`w-12 flex-shrink-0 bg-[#0a0a0f] border-r border-slate-800/50 pt-3 text-right pr-2 text-[11px] text-slate-600 select-none font-mono leading-[1.6] overflow-hidden`,children:Array.from({length:R},(e,t)=>(0,p.jsx)(`div`,{children:t+1},t+1))}),(0,p.jsx)(`textarea`,{ref:k,value:L,onChange:e=>t(t=>({...t,[n]:e.target.value})),onKeyDown:I,spellCheck:!1,className:`flex-1 bg-[#0d1117] p-3 text-[13px] leading-[1.6] text-slate-200 resize-none outline-none font-mono placeholder:text-slate-600`,placeholder:`Write your ${n.toUpperCase()} here...`,style:{tabSize:2}})]})})]}),(0,p.jsxs)(`div`,{className:`flex flex-col w-full lg:w-1/2`,children:[(0,p.jsxs)(`div`,{className:`flex items-center justify-between px-3 py-2 bg-[#0f1318] border-b border-slate-800`,children:[(0,p.jsx)(`span`,{className:`text-[11px] text-slate-500 uppercase tracking-wider font-medium`,children:`Preview`}),(0,p.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,p.jsx)(`button`,{onClick:()=>y([]),className:`text-[11px] text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded transition-colors`,children:`Clear console`}),(0,p.jsx)(`button`,{onClick:()=>T(!w),className:`text-slate-500 hover:text-slate-300 p-1 rounded transition-colors`,title:w?`Exit fullscreen`:`Fullscreen preview`,children:w?(0,p.jsx)(d,{className:`w-3.5 h-3.5`}):(0,p.jsx)(u,{className:`w-3.5 h-3.5`})})]})]}),(0,p.jsx)(`div`,{className:`flex-1 bg-white relative`,children:E?(0,p.jsx)(`iframe`,{ref:O,srcDoc:E,className:`w-full h-full border-0`,sandbox:`allow-scripts allow-modals`,title:`Preview`}):(0,p.jsxs)(`div`,{className:`flex items-center justify-center h-full text-slate-400 text-sm`,children:[`Click `,(0,p.jsx)(`strong`,{className:`mx-1 text-cyan-400`,children:`Run`}),` to preview`]})}),v.length>0&&(0,p.jsx)(`div`,{className:`h-28 border-t border-slate-800 bg-[#0d1117] overflow-auto font-mono text-[11px] leading-relaxed`,children:v.map((e,t)=>(0,p.jsx)(`div`,{className:`px-3 py-0.5 ${e.startsWith(`[error]`)?`text-red-400`:e.startsWith(`[warn]`)?`text-yellow-400`:`text-slate-400`}`,children:e},t))})]})]})]})}export{v as component};