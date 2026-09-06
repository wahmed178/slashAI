import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./createLucideIcon-CVi6igz2.js";import{t as i}from"./AppShell-Dh8jhq7A.js";import{t as a}from"./code-DtTiJ643.js";import{t as o}from"./download-ex15N5eI.js";import{t as s}from"./eye-B-_Q5x_b.js";import{t as c}from"./file-text-B5uxsOU4.js";import{t as l}from"./list-DhSWsRDT.js";import{t as u}from"./pen-line-DqpgFf6x.js";var d=r(`bold`,[[`path`,{d:`M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8`,key:`mg9rjx`}]]),f=r(`heading-1`,[[`path`,{d:`M4 12h8`,key:`17cfdx`}],[`path`,{d:`M4 18V6`,key:`1rz3zl`}],[`path`,{d:`M12 18V6`,key:`zqpxq5`}],[`path`,{d:`m17 12 3-2v8`,key:`1hhhft`}]]),p=r(`italic`,[[`line`,{x1:`19`,x2:`10`,y1:`4`,y2:`4`,key:`15jd3p`}],[`line`,{x1:`14`,x2:`5`,y1:`20`,y2:`20`,key:`bu0au3`}],[`line`,{x1:`15`,x2:`9`,y1:`4`,y2:`20`,key:`uljnxc`}]]),m=r(`link`,[[`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`,key:`1cjeqo`}],[`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`,key:`19qd67`}]]),h=e(t()),g=n(),_=[{name:`Blog Post`,content:`# Title

> A brief introduction to hook the reader.

## Section 1

Your content here...

## Section 2

More content...

## Conclusion

Wrap up your thoughts.
`},{name:`README`,content:`# Project Name

A short description of the project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`js
import { something } from 'package';
\`\`\`

## License

MIT
`},{name:`Meeting Notes`,content:`# Meeting Notes — [Date]

## Attendees
- Person 1
- Person 2

## Agenda
1. Topic 1
2. Topic 2

## Discussion

Notes here...

## Action Items
- [ ] Task 1 — @person
- [ ] Task 2 — @person
`},{name:`Resume`,content:`# Name

**Email** | **Phone** | **LinkedIn**

## Experience

### Company — Role
*Date — Present*
- Achievement 1
- Achievement 2

## Education

### University — Degree
*Year*

## Skills

Skill 1, Skill 2, Skill 3
`}];function v(e){return e.replace(/^### (.+)$/gm,`<h3 style='margin:16px 0 8px;color:#f0f6fc'>$1</h3>`).replace(/^## (.+)$/gm,`<h2 style='margin:20px 0 10px;color:#f0f6fc;border-bottom:1px solid #21262d;padding-bottom:6px'>$1</h2>`).replace(/^# (.+)$/gm,`<h1 style='margin:0 0 16px;color:#f0f6fc;font-size:28px'>$1</h1>`).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(/\*(.+?)\*/g,`<em>$1</em>`).replace(/`([^`]+)`/g,`<code style='background:#161b22;padding:2px 6px;border-radius:4px;font-size:13px'>$1</code>`).replace(/^```(\w*)\n([\s\S]*?)```/gm,(e,t,n)=>`<pre style='background:#161b22;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px'><code>${n.replace(/</g,`&lt;`)}</code></pre>`).replace(/^> (.+)$/gm,`<blockquote style='border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e;margin:8px 0'>$1</blockquote>`).replace(/^- \[ \] (.+)$/gm,`<p style='margin:4px 0'>☐ $1</p>`).replace(/^- \[x\] (.+)$/gm,`<p style='margin:4px 0'>☑ $1</p>`).replace(/^- (.+)$/gm,`<li style='margin:4px 0;margin-left:16px'>$1</li>`).replace(/^\d+\. (.+)$/gm,`<li style='margin:4px 0;margin-left:16px;list-style-type:decimal'>$1</li>`).replace(/\n\n/g,`</p><p style='margin:12px 0'>`).replace(/\n/g,`<br>`)}var y=`# Hello World

This is **bold** and this is *italic*.

## Features
- Live preview
- Export as .md or HTML
- Templates included

> The best way to predict the future is to create it.

\`\`\`js
console.log("Hello from SlashAI!");
\`\`\`

1. First item
2. Second item
3. Third item

---

*Happy writing!* ✍️`;function b(){let[e,t]=(0,h.useState)(y),[n,r]=(0,h.useState)(!0),[b,x]=(0,h.useState)(``),S=(0,h.useMemo)(()=>v(e),[e]),C=e.split(/\s+/).filter(Boolean).length,w=e.length,T=Math.max(1,Math.ceil(C/200)),E=(n,r)=>{let i=document.querySelector(`textarea`);if(!i)return;let a=i.selectionStart,o=i.selectionEnd,s=e.slice(a,o),c=e.slice(0,a)+n+s+r+e.slice(o);t(c)},D=e=>{let n=_.find(t=>t.name===e);n&&(t(n.content),x(``))},O=t=>{let n=t===`html`?new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:Inter,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#f0f6fc;background:#0a0a0f}code{background:#161b22;padding:2px 6px;border-radius:4px}pre{background:#161b22;padding:16px;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e}a{color:#58a6ff}</style></head><body>${S}</body></html>`],{type:`text/html`}):new Blob([e],{type:`text/markdown`}),r=document.createElement(`a`);r.href=URL.createObjectURL(n),r.download=`document.${t}`,r.click()};return(0,g.jsx)(i,{title:`Markdown Editor`,children:(0,g.jsxs)(`div`,{className:`flex h-[calc(100vh-120px)] flex-col pt-4`,children:[(0,g.jsxs)(`div`,{className:`mb-2 flex flex-wrap items-center gap-1 rounded-[10px] border border-border bg-surface px-2 py-1.5`,children:[[{icon:(0,g.jsx)(d,{className:`size-3.5`}),action:()=>E(`**`,`**`)},{icon:(0,g.jsx)(p,{className:`size-3.5`}),action:()=>E(`*`,`*`)},{icon:(0,g.jsx)(f,{className:`size-3.5`}),action:()=>E(`## `,``)},{icon:(0,g.jsx)(a,{className:`size-3.5`}),action:()=>E("`","`")},{icon:(0,g.jsx)(m,{className:`size-3.5`}),action:()=>E(`[`,`](url)`)},{icon:(0,g.jsx)(l,{className:`size-3.5`}),action:()=>E(`- `,``)}].map((e,t)=>(0,g.jsx)(`button`,{onClick:e.action,className:`flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground`,children:e.icon},t)),(0,g.jsx)(`div`,{className:`mx-1 h-5 w-px bg-border`}),(0,g.jsxs)(`select`,{value:b,onChange:e=>D(e.target.value),className:`rounded border border-border bg-surface-elevated px-2 py-1 text-xs text-muted-foreground`,children:[(0,g.jsx)(`option`,{value:``,children:`Templates...`}),_.map(e=>(0,g.jsx)(`option`,{value:e.name,children:e.name},e.name))]}),(0,g.jsx)(`div`,{className:`flex-1`}),(0,g.jsxs)(`div`,{className:`flex items-center gap-2 text-[10px] text-muted-foreground`,children:[(0,g.jsxs)(`span`,{children:[C,` words`]}),(0,g.jsx)(`span`,{children:`·`}),(0,g.jsxs)(`span`,{children:[w,` chars`]}),(0,g.jsx)(`span`,{children:`·`}),(0,g.jsxs)(`span`,{children:[T,` min read`]})]}),(0,g.jsxs)(`button`,{onClick:()=>r(!n),className:`flex items-center gap-1 rounded px-2 py-1 text-xs ${n?`text-primary`:`text-muted-foreground`}`,children:[n?(0,g.jsx)(s,{className:`size-3.5`}):(0,g.jsx)(u,{className:`size-3.5`}),n?`Split`:`Edit`]}),(0,g.jsx)(`button`,{onClick:()=>O(`md`),className:`text-muted-foreground hover:text-foreground`,children:(0,g.jsx)(o,{className:`size-3.5`})}),(0,g.jsx)(`button`,{onClick:()=>O(`html`),className:`text-muted-foreground hover:text-foreground`,children:(0,g.jsx)(c,{className:`size-3.5`})})]}),(0,g.jsxs)(`div`,{className:`flex flex-1 gap-0 overflow-hidden rounded-[10px] border border-border`,children:[(0,g.jsx)(`textarea`,{value:e,onChange:e=>t(e.target.value),className:`flex-1 resize-none bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none ${n?`border-r border-border`:``}`,style:{display:n?`block`:`none`}}),n&&(0,g.jsx)(`div`,{className:`flex-1 overflow-auto bg-surface-elevated p-4 text-sm leading-relaxed text-foreground`,dangerouslySetInnerHTML:{__html:S}})]})]})})}export{b as component};