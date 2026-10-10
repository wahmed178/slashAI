import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{A as r,C as i,M as a,R as o,o as s}from"./ux-DqNFIrmJ.js";import{n as c}from"./play-sound-Bwke5u5p.js";var l=e(t()),u=n(),d=`slashai.flipclock`,f=420,p=f/2,m=3200,h={h24:!1,axis:`x`,sound:!0,paused:!1,bg:0};function g(){let e=i(d);if(!e)return h;try{let t=JSON.parse(e);return{h24:typeof t.h24==`boolean`?t.h24:h.h24,axis:t.axis===`y`||t.axis===`x`?t.axis:h.axis,sound:typeof t.sound==`boolean`?t.sound:h.sound,paused:typeof t.paused==`boolean`?t.paused:h.paused,bg:Number.isFinite(t.bg)?Math.abs(Math.trunc(t.bg)):h.bg}}catch{return h}}var _={label:`Slate`,url:null,css:`radial-gradient(120% 90% at 50% 0%, #1c2733 0%, #0b0f14 55%, #05070a 100%)`},v=[_,{label:`Ridge`,url:`https://picsum.photos/seed/slashai-ridge/1920/1080`,css:`#0b1220`},{label:`Dunes`,url:`https://picsum.photos/seed/slashai-dunes/1920/1080`,css:`#1a1208`},{label:`Harbour`,url:`https://picsum.photos/seed/slashai-harbour/1920/1080`,css:`#08161c`},{label:`Pines`,url:`https://picsum.photos/seed/slashai-pines/1920/1080`,css:`#0a1710`},{label:`Station`,url:`https://picsum.photos/seed/slashai-station/1920/1080`,css:`#151019`},{label:`Coast`,url:`https://picsum.photos/seed/slashai-coast/1920/1080`,css:`#0c1418`},{label:`Atrium`,url:`https://picsum.photos/seed/slashai-atrium/1920/1080`,css:`#141210`}],y={background:`#101010`,borderRadius:10,boxShadow:`0 0 0 1px rgba(255,255,255,0.13) inset, 0 1px 0 rgba(255,255,255,0.07) inset, 0 10px 26px rgba(0,0,0,0.45)`,perspective:1100,transformStyle:`preserve-3d`,overflow:`hidden`,position:`relative`,width:`100%`,height:`100%`},b={fontFamily:`var(--font-sans)`,fontWeight:600,lineHeight:1,letterSpacing:`-0.02em`,fontVariantNumeric:`tabular-nums`,color:`#e8e8e8`,textShadow:`0 1px 1px rgba(0,0,0,0.45)`,userSelect:`none`},x={position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`},S=`linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 100%)`,C=`linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)`;function w(e,t){return e===`x`?t===`a`?`inset(0 0 50% 0)`:`inset(50% 0 0 0)`:t===`a`?`inset(0 50% 0 0)`:`inset(0 0 0 50%)`}function T({axis:e,half:t,value:n,shade:r}){return(0,u.jsxs)(`div`,{className:`absolute inset-0`,style:{clipPath:w(e,t)},children:[(0,u.jsx)(`div`,{style:x,children:(0,u.jsx)(`span`,{className:`fc-glyph`,style:b,children:n})}),r&&(0,u.jsx)(`div`,{className:`absolute inset-0`,style:{background:r}})]})}function E({char:e,axis:t}){let[n,r]=(0,l.useState)(e),[i,a]=(0,l.useState)(e),[o,s]=(0,l.useState)(!1);(0,l.useEffect)(()=>{if(e===n)return;if(typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){r(e),a(e),s(!1);return}a(n),s(!0);let t=setTimeout(()=>{r(e),s(!1)},f);return()=>clearTimeout(t)},[e,n]);let c=t===`x`;return(0,u.jsxs)(`div`,{style:y,children:[(0,u.jsx)(T,{axis:t,half:`a`,value:e,shade:S}),(0,u.jsx)(T,{axis:t,half:`b`,value:e,shade:C}),o&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`div`,{className:`absolute inset-0`,style:{clipPath:w(t,`a`),transformOrigin:c?`50% 100%`:`100% 50%`,animation:`${c?`fcOutX`:`fcOutY`} ${p}ms cubic-bezier(0.36, 0, 0.66, -0.2) forwards`,zIndex:2},children:[(0,u.jsx)(`div`,{style:x,children:(0,u.jsx)(`span`,{className:`fc-glyph`,style:b,children:i})}),(0,u.jsx)(`div`,{className:`absolute inset-0`,style:{background:`#000`,animation:`fcShadeOut 210ms linear forwards`}})]}),(0,u.jsxs)(`div`,{className:`absolute inset-0`,style:{clipPath:w(t,`b`),transformOrigin:c?`50% 0%`:`0% 50%`,animation:`${c?`fcInX`:`fcInY`} ${p}ms cubic-bezier(0.34, 1.3, 0.64, 1) ${p}ms forwards`,zIndex:2},children:[(0,u.jsx)(`div`,{style:x,children:(0,u.jsx)(`span`,{className:`fc-glyph`,style:b,children:e})}),(0,u.jsx)(`div`,{className:`absolute inset-0`,style:{background:`#000`,animation:`fcShadeIn 210ms linear 210ms forwards`}})]})]}),(0,u.jsx)(`div`,{className:`absolute`,style:{background:`rgba(0,0,0,0.85)`,boxShadow:`0 1px 0 rgba(255,255,255,0.05)`,...c?{left:0,right:0,top:`50%`,height:2,marginTop:-1}:{top:0,bottom:0,left:`50%`,width:2,marginLeft:-1}}})]})}function D({active:e,children:t,onClick:n,title:r,icon:i}){return(0,u.jsx)(`button`,{type:`button`,onClick:n,title:r,"aria-pressed":e,className:`flex h-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.96] ${i?`w-9 px-0`:`px-3.5`}`,style:{color:e?`rgba(255,255,255,0.95)`:`rgba(255,255,255,0.55)`,background:e?`rgba(255,255,255,0.14)`:`rgba(255,255,255,0.05)`,boxShadow:e?`0 1px 0 rgba(255,255,255,0.14) inset`:`none`},children:t})}function O(){return(0,u.jsx)(`span`,{"aria-hidden":`true`,className:`mx-1 h-5 w-px shrink-0 bg-white/10`})}function k(){let[e,t]=(0,l.useState)(h),[n,i]=(0,l.useState)(()=>new Date),[f,p]=(0,l.useState)(0),[y,b]=(0,l.useState)(0),[x,S]=(0,l.useState)(!0),[C,w]=(0,l.useState)(!0),T=(0,l.useRef)(!1),k=(0,l.useRef)(null),A=(0,l.useRef)(-1),j=(0,l.useRef)(-1);(0,l.useEffect)(()=>{t(g()),b(r()[`flip-clock`]??0),s(`flip-clock`)},[]),(0,l.useEffect)(()=>{a(d,JSON.stringify(e))},[e]),(0,l.useEffect)(()=>{T.current=e.paused},[e.paused]),(0,l.useEffect)(()=>{let e=document.body.style.overflow;return document.body.style.overflow=`hidden`,()=>{document.body.style.overflow=e}},[]);let M=(0,l.useCallback)((e,n)=>{t(t=>({...t,[e]:n}))},[]);(0,l.useEffect)(()=>{let e=setInterval(()=>{T.current||(i(new Date),p(e=>e+1))},1e3);return()=>clearInterval(e)},[]);let N=n.getHours(),P=N>=12,F=e.h24?N:N%12||12,I=n.getMinutes(),L=n.getSeconds();(0,l.useEffect)(()=>{!e.sound||e.paused||L!==A.current&&(A.current=L,c(`tick`),I!==j.current&&(j.current=I,c(`flip`)))},[L,I,e.sound,e.paused]);let R=(0,l.useCallback)(()=>{S(!0),k.current&&clearTimeout(k.current),k.current=setTimeout(()=>S(!1),m)},[]);(0,l.useEffect)(()=>{R();let e=[`mousemove`,`touchstart`,`keydown`];for(let t of e)window.addEventListener(t,R,{passive:!0});return()=>{for(let t of e)window.removeEventListener(t,R);k.current&&clearTimeout(k.current)}},[R]);let z=(0,l.useCallback)(()=>{w(!0),M(`bg`,(e.bg+1)%v.length)},[e.bg,M]),B=(0,l.useCallback)(()=>{e.paused||i(new Date),M(`paused`,!e.paused)},[e.paused,M]),V=(0,l.useCallback)(()=>{typeof document>`u`||(document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{}))},[]);(0,l.useEffect)(()=>{let t=t=>{if(t.metaKey||t.ctrlKey||t.altKey)return;let n=t.target?.tagName;n!==`INPUT`&&n!==`TEXTAREA`&&(t.key===` `||t.key===`Spacebar`?(t.preventDefault(),B()):t.key===`s`||t.key===`S`?M(`sound`,!e.sound):t.key===`b`||t.key===`B`?z():(t.key===`f`||t.key===`F`)&&V())};return window.addEventListener(`keydown`,t),()=>window.removeEventListener(`keydown`,t)},[z,e.sound,M,V,B]);let H=String(F).padStart(2,`0`),U=String(I).padStart(2,`0`),W=String(L).padStart(2,`0`),G=[H.charAt(0),H.charAt(1),U.charAt(0),U.charAt(1),W.charAt(0),W.charAt(1)],K=v[e.bg%v.length]??_,q=e.axis===`x`,J=[{label:`Hours`,pair:[G[0],G[1]]},{label:`Minutes`,pair:[G[2],G[3]]},{label:`Seconds`,pair:[G[4],G[5]]}];return(0,u.jsxs)(`div`,{className:`fc-root fixed inset-0 z-40 flex w-full flex-col overflow-hidden select-none ${q?`fc-stack`:`fc-inline`}`,children:[(0,u.jsxs)(`div`,{className:`absolute inset-0 cursor-pointer`,style:{background:K.css},onClick:z,role:`button`,tabIndex:-1,"aria-label":`Change background`,title:`Click to change background`,children:[K.url&&C&&(0,u.jsx)(`img`,{src:K.url,alt:``,"aria-hidden":`true`,onError:()=>w(!1),className:`absolute inset-0 h-full w-full object-cover`,style:{filter:`saturate(0.85) brightness(0.55)`}}),(0,u.jsx)(`div`,{className:`absolute inset-0`,style:{background:`rgba(0,0,0,0.34)`}})]}),(0,u.jsx)(`h1`,{className:`sr-only`,children:`Flip Clock — split-flap clock by SlashAI`}),(0,u.jsx)(`div`,{className:`relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pt-3 pb-[clamp(60px,9vh,132px)] sm:px-6`,children:q?(0,u.jsx)(`div`,{className:`fc-grid grid items-center`,style:{gridTemplateColumns:`auto auto auto`},children:J.map(t=>(0,u.jsxs)(`div`,{className:`contents`,children:[(0,u.jsx)(`span`,{className:`fc-label text-right font-semibold tracking-[0.18em] text-white/35 uppercase`,children:t.label}),(0,u.jsxs)(`div`,{className:`fc-pair flex`,children:[(0,u.jsx)(`div`,{className:`flex-1`,children:(0,u.jsx)(E,{char:t.pair[0],axis:e.axis})}),(0,u.jsx)(`div`,{className:`flex-1`,children:(0,u.jsx)(E,{char:t.pair[1],axis:e.axis})})]}),(0,u.jsx)(`span`,{className:`fc-meridiem font-bold tracking-wider text-white/45`,children:t.label===`Hours`&&!e.h24?P?`PM`:`AM`:``})]},t.label))}):(0,u.jsxs)(`div`,{className:`fc-row flex items-center`,children:[G.map((t,n)=>(0,u.jsxs)(`div`,{className:`fc-group flex items-center`,children:[(0,u.jsx)(`div`,{className:`fc-card`,children:(0,u.jsx)(E,{char:t,axis:e.axis})}),(n===1||n===3)&&(0,u.jsx)(`span`,{className:`fc-colon px-0.5 font-semibold text-white/35`,children:`:`})]},n)),!e.h24&&(0,u.jsx)(`span`,{className:`fc-meridiem pl-1 font-bold tracking-wider text-white/45`,children:P?`PM`:`AM`})]})}),e.paused&&(0,u.jsx)(`div`,{className:`pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-[calc(50%+64px)] text-center`,children:(0,u.jsx)(`span`,{className:`rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase`,children:`Paused`})}),(0,u.jsxs)(`div`,{className:`pointer-events-none fixed top-4 right-4 z-30 w-[190px] rounded-2xl border border-white/10 bg-black/50 px-3 py-2.5 backdrop-blur-md transition-opacity duration-300 sm:w-[210px] ${x?`opacity-100`:`opacity-0`}`,children:[(0,u.jsx)(`p`,{className:`text-[9px] font-bold tracking-[0.18em] text-white/40 uppercase`,children:`SlashAI right now`}),(0,u.jsxs)(`dl`,{className:`mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-white/70`,children:[(0,u.jsx)(`dt`,{className:`text-white/40`,children:`Tools`}),(0,u.jsx)(`dd`,{className:`text-right font-semibold tabular-nums`,children:o.tools}),(0,u.jsx)(`dt`,{className:`text-white/40`,children:`Commands`}),(0,u.jsx)(`dd`,{className:`text-right font-semibold tabular-nums`,children:o.commands}),(0,u.jsx)(`dt`,{className:`text-white/40`,children:`Games`}),(0,u.jsx)(`dd`,{className:`text-right font-semibold tabular-nums`,children:o.games}),(0,u.jsx)(`dt`,{className:`text-white/40`,children:`Courses`}),(0,u.jsx)(`dd`,{className:`text-right font-semibold tabular-nums`,children:o.courses}),(0,u.jsx)(`dt`,{className:`text-white/40`,children:`On this page`}),(0,u.jsxs)(`dd`,{className:`text-right font-semibold tabular-nums`,children:[Math.floor(f/60),`:`,String(f%60).padStart(2,`0`)]}),(0,u.jsx)(`dt`,{className:`text-white/40`,children:`Your visits`}),(0,u.jsx)(`dd`,{className:`text-right font-semibold tabular-nums`,children:y})]}),(0,u.jsx)(`p`,{className:`mt-1.5 text-[9px] leading-tight text-white/30`,children:`Counted from the site catalogue and this device — no invented viewers.`})]}),(0,u.jsxs)(`div`,{className:`fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-3 pb-3 transition-opacity duration-300 sm:pb-4 ${x?`opacity-100`:`pointer-events-none opacity-0`}`,children:[(0,u.jsx)(`p`,{className:`hidden text-[9px] tracking-wider text-white/30 sm:block`,children:`Click the background to change it · Space pause · S sound · B background`}),(0,u.jsxs)(`div`,{className:`flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl`,children:[(0,u.jsx)(D,{onClick:()=>window.history.back(),title:`Back`,children:`Close`}),(0,u.jsx)(O,{}),(0,u.jsx)(D,{onClick:B,active:e.paused,title:`Space`,children:e.paused?`▶ Resume`:`❙❙ Pause`}),(0,u.jsx)(D,{onClick:()=>M(`h24`,!e.h24),active:e.h24,children:e.h24?`24H`:`12H`}),(0,u.jsx)(D,{onClick:()=>M(`axis`,q?`y`:`x`),active:q,title:`Flip direction`,children:q?`▤ Vertical`:`▥ Horizontal`}),(0,u.jsx)(O,{}),(0,u.jsx)(D,{onClick:()=>M(`sound`,!e.sound),active:e.sound,title:`S`,children:e.sound?`🔊 Sound`:`🔇 Muted`}),(0,u.jsx)(D,{onClick:z,title:`B`,children:K.label}),(0,u.jsx)(D,{onClick:V,title:`F`,icon:!0,children:`⛶`})]})]}),(0,u.jsx)(`style`,{children:`
        /* ── full-screen sizing ──────────────────────────────────
           The clock is a fixed, full-bleed overlay, so the free space is
           exactly the viewport minus the two floating chrome panels. The
           old build sized cards with clamp(56px, 15vw, 88px), which
           stopped growing at 88px and left the clock looking like a
           thumbnail on a desktop monitor. These rules derive the card
           box from the viewport instead, in both layouts:

           - .fc-stack: three rows of two cards (1.44:1). Bound by
             height, since 3 cards + gaps have to fit the screen.
           - .fc-inline: six cards in one row (0.8:1). Bound by width,
             since 6 cards + gaps + separators have to fit the screen.

           150px is reserved for the auto-hiding control deck at the
           bottom; the two floor values stop the cards collapsing on
           very small windows.

           Everything here sticks to vh/vw/clamp/min/max on purpose. The
           previous build derived the box from 100dvh and sized the digit
           from 105cqh, and an engine missing either unit invalidates the
           whole declaration - the cards fell back to auto sizing and the
           clock collapsed to a thumbnail on the user's monitor while
           looking perfectly fine in Chrome. Plain vh is understood
           everywhere, and the dvh upgrade below is opt-in. */
        .fc-root { --fc-gap: clamp(4px, 1vmin, 20px); }

        .fc-stack {
          --fc-card-h: max(42px, min(calc((100vh - 150px - 2 * var(--fc-gap)) / 3), calc((100vw - 170px) / 3.6)));
          --fc-card-w: calc(var(--fc-card-h) * 1.44);
        }
        .fc-inline {
          --fc-card-h: max(34px, min(calc(100vh - 150px), calc((100vw - 110px) / 5.7)));
          --fc-card-w: calc(var(--fc-card-h) * 0.8);
        }
        @supports (height: 100dvh) {
          .fc-stack {
            --fc-card-h: max(42px, min(calc((100dvh - 150px - 2 * var(--fc-gap)) / 3), calc((100vw - 170px) / 3.6)));
          }
          .fc-inline {
            --fc-card-h: max(34px, min(calc(100dvh - 150px), calc((100vw - 110px) / 5.7)));
          }
        }

        .fc-grid { gap: var(--fc-gap); }

        .fc-pair {
          gap: var(--fc-gap);
          flex: none;
          width: calc(var(--fc-card-w) * 2 + var(--fc-gap));
          height: var(--fc-card-h);
        }
        .fc-row { gap: var(--fc-gap); }
        .fc-group { gap: calc(var(--fc-gap) * 0.5); }
        .fc-card { width: var(--fc-card-w); height: var(--fc-card-h); flex: none; }

        /* The digit is sized off the card box itself, so it can never
           overflow the card however big the screen is. A split-flap
           glyph is ~0.72em of cap height, so 1.05x the card height
           fills roughly three quarters of the card. This used to be
           105cqh, which needs container-type:size on the card; if that
           support is missing the digits collapse. --fc-card-h is a plain
           inherited custom property, so this works in any engine that
           understands calc. The clamp line stays as a last resort. */
        .fc-glyph {
          font-size: clamp(40px, 12vmin, 460px);
          font-size: min(calc(var(--fc-card-h) * 1.05), 460px);
        }

        /* the small type scales with the clock so it never looks lost
           next to a 250px digit */
        .fc-label { font-size: clamp(9px, 1.1vmin, 20px); }
        .fc-meridiem { font-size: clamp(11px, 1.7vmin, 30px); }
        .fc-colon { font-size: clamp(1.5rem, 9vmin, 12rem); line-height: 1; }

        @keyframes fcOutX { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
        @keyframes fcInX  { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
        @keyframes fcOutY { from { transform: rotateY(0deg); } to { transform: rotateY(-90deg); } }
        @keyframes fcInY  { from { transform: rotateY(90deg); } to { transform: rotateY(0deg); } }
        @keyframes fcShadeOut { from { opacity: 0; } to { opacity: 0.55; } }
        @keyframes fcShadeIn  { from { opacity: 0.5; } to { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `})]})}export{k as component};