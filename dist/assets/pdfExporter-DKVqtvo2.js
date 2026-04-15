const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DGYQP9iV.js","assets/templates-pro-TQhW1AE-.js","assets/motion-CTeeLOXR.js","assets/pdf-engine-DjTwIyRi.js","assets/supabase-CaBZhh50.js","assets/index-54OyUBZB.css"])))=>i.map(i=>d[i]);
import{_ as x,h as $,E as q}from"./pdf-engine-DjTwIyRi.js";const h=794,_=1123,P=210,T=297,c=3,z=48,G=48,D=32,H=220,N=60,W=140,J=40,U=80,V=20;function X(e,i){for(let a=1;a<=i;a++)e.setPage(a),e.saveGraphicsState(),e.setTextColor(185,185,185),e.setFontSize(26),e.setFont("helvetica","bold"),e.text("resume.hrsaarthi.com",P/2,T/2,{angle:45,align:"center"}),e.setFontSize(18),e.setTextColor(210,210,210),e.text("resume.hrsaarthi.com",P/2,T/3,{angle:45,align:"center"}),e.restoreGraphicsState()}async function ot(e,i,a,r="resume",o=!1){const t=document.createElement("div");t.className="resume-export-root",t.style.cssText=["position:fixed","left:-9999px","top:0",`width:${h}px`,"background:white","z-index:-9999","opacity:0","pointer-events:none","overflow:visible","-webkit-print-color-adjust:exact","print-color-adjust:exact"].join(";"),document.body.appendChild(t);let n=null;try{const{createRoot:s}=await x(async()=>{const{createRoot:l}=await import("./index-DGYQP9iV.js").then(f=>f.c);return{createRoot:l}},__vite__mapDeps([0,1,2,3,4,5])),{createElement:p}=await x(async()=>{const{createElement:l}=await import("./motion-CTeeLOXR.js").then(f=>f.R);return{createElement:l}},[]);n=s(t),await new Promise(l=>{n.render(p("div",{className:"resume-a4 bg-white",style:{boxSizing:"border-box",overflow:"visible",width:`${h}px`}},p(a,{data:e,settings:i}))),requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(l)))}),await document.fonts.ready,await tt(),await k(400),Y(t),await k(200),await new Promise(l=>requestAnimationFrame(l));const u=t.scrollHeight,d=Math.ceil(u/_),w=K(t,d,u);t.style.opacity="1";const I=await $(t,{scale:c,useCORS:!0,allowTaint:!1,backgroundColor:"#ffffff",width:h,height:u,scrollX:0,scrollY:0,windowWidth:h,windowHeight:u,logging:!1,imageTimeout:25e3,removeContainer:!1,foreignObjectRendering:!1,letterRendering:!0,onclone:l=>{const f=l.body.querySelector(".resume-export-root")||l.body.querySelector("div");f&&(f.style.opacity="1",f.style.overflow="visible",f.style.overflowX="visible",f.style.left="0")}});t.style.opacity="0";const E=t.querySelector('[data-is-sidebar="true"]');let v=0,b="#ffffff";E&&(v=E.getBoundingClientRect().width,b=window.getComputedStyle(E).backgroundColor||"#ffffff");const y=new q({orientation:"portrait",unit:"mm",format:"a4",compress:!0});for(let l=0;l<d;l++){const f=w[l],M=w[l+1]!==void 0?w[l+1]:u,R=l>0?z:0,L=l===0?G:0,S=Math.min(M-f,_-R-L),g=document.createElement("canvas");g.width=h*c,g.height=_*c;const m=g.getContext("2d");if(m.fillStyle="#ffffff",m.fillRect(0,0,g.width,g.height),v>0&&(m.fillStyle=b,m.fillRect(0,0,v*c,g.height)),l>0){m.fillStyle=b!=="#ffffff"?b:"#f8f9fa",m.fillRect(0,0,g.width,R*c);const C=et(b);m.fillStyle=C?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.45)",m.font=`bold ${8*c}px "Inter", "Segoe UI", sans-serif`,m.textAlign="left";const O=(e?.personal?.fullName||"RESUME").toUpperCase();m.fillText(O,40*c,26*c),m.textAlign="right",m.fillText(`PAGE ${l+1} OF ${d}`,(h-40)*c,26*c),m.strokeStyle=C?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.08)",m.lineWidth=.5*c,m.beginPath(),m.moveTo(40*c,32*c),m.lineTo((h-40)*c,32*c),m.stroke()}m.drawImage(I,0,f*c,h*c,S*c,0,R*c,h*c,S*c),l>0&&y.addPage();const j=g.toDataURL("image/jpeg",.92);y.addImage(j,"JPEG",0,0,P,T,void 0,"FAST")}o||X(y,d);const B=(r||"resume").replace(/[^a-z0-9_\-]/gi,"_").toLowerCase();return y.save(`${B}_resume.pdf`),{success:!0,pages:d}}finally{if(n)try{n.unmount()}catch{}t.parentNode&&document.body.removeChild(t)}}function K(e,i,a){if(i<=1)return[0];const r=F(e,[".resume-entry",".resume-section-compact"]),o=F(e,[".resume-section-head","[data-break-after]"]),t=Z(e),n=[0];for(let s=1;s<i;s++){const p=s*_;let u=A(r,p,H,N);if(u!==null){n.push(u);continue}if(u=A(o,p,W,J),u!==null){n.push(u);continue}if(u=A(t,p,U,V),u!==null){n.push(u);continue}if(u=Q(r,t,p),u!==null){n.push(u);continue}n.push(Math.max(0,p-D))}return n}function A(e,i,a,r){const o=e.filter(s=>s>=i-a&&s<=i+r);if(!o.length)return null;const t=o.filter(s=>s<=i),n=t.length?t:o;return n.sort((s,p)=>Math.abs(s-i)-Math.abs(p-i)),Math.round(n[0]+8)}function Q(e,i,a,r){const o=[...e,...i].sort((t,n)=>t-n);if(!o.length)return null;for(let t=0;t<o.length-1;t++)if(o[t]<=a&&o[t+1]>=a){const n=o[t],s=o[t+1],p=a-n<=s-a?n:s;return Math.round(p+6)}return null}function F(e,i){const a=e.querySelectorAll(i.join(",")),r=e.getBoundingClientRect().top,o=[];return a.forEach(t=>{const n=t.getBoundingClientRect().bottom-r;n>0&&o.push(n)}),o.sort((t,n)=>t-n),o.filter((t,n)=>n===0||t-o[n-1]>4)}function Z(e){const i=e.querySelectorAll("p, li, div, span"),a=e.getBoundingClientRect().top,r=[],o=new Set;return i.forEach(t=>{const n=window.getComputedStyle(t);if(n.display==="flex"||n.display==="grid"||t.children.length>5)return;const s=Math.round(t.getBoundingClientRect().bottom-a);s>0&&!o.has(s)&&(o.add(s),r.push(s))}),r.sort((t,n)=>t-n),r.filter((t,n)=>n===0||t-r[n-1]>2)}async function it(e,i,a){const r=Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(d=>`<link rel="stylesheet" href="${d.href}" />`).join(`
`),o=Array.from(document.querySelectorAll("style")).map(d=>`<style>${d.textContent}</style>`).join(`
`),t=window.open("","_blank","width=900,height=700");if(!t)throw new Error(`Pop-up blocked. Please allow pop-ups for this site, then try again.

Or use "Image PDF (Fallback)" from the dropdown — it downloads without a pop-up.`);t.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Resume — HR Saarthi</title>

  <!-- Google Fonts — must load BEFORE print trigger -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

  <!-- App stylesheets (Tailwind + index.css) -->
  ${r}
  ${o}

  <style>
    /* ── Premium @page rules ── */
    @page {
      size: A4 portrait;
      margin: 0;           /* Templates control their own padding */
    }

    /* ── Global print reset ── */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
      width: 210mm;
      background: #e2e8f0;
    }

    body {
      margin: 0;
      padding: 20px 0;
      background: #e2e8f0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    /* ── Screen: centered paper preview ── */
    @media screen {
      .resume-a4 {
        box-shadow: 0 4px 40px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12);
        border-radius: 2px;
        margin: 0 auto;
      }
    }

    /* ── Print: full-bleed A4 ── */
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        width: 210mm !important;
      }

      .resume-a4 {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        transform: none !important;
      }

      /* Hide any UI elements that leaked into the print clone */
      .no-print,
      .resume-page-break-visual,
      .page-break-guide,
      button,
      [role="button"],
      nav {
        display: none !important;
      }

      /* Sidebar/colored backgrounds MUST print */
      [data-is-sidebar="true"],
      .resume-sidebar,
      [style*="background"] {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Smart page breaks */
      .resume-entry     { break-inside: avoid !important; page-break-inside: avoid !important; }
      .resume-section-head { break-after: avoid !important; page-break-after: avoid !important; }
      .resume-section   { break-inside: avoid !important; page-break-inside: avoid !important; }
      .resume-section-compact { break-inside: avoid !important; page-break-inside: avoid !important; }
    }
  </style>
</head>
<body>
  <div id="print-root"></div>
  <script>
    // Trigger print ONLY after everything is loaded and fonts are ready
    // Using document.fonts.ready ensures no FOUT (flash of unstyled text)
    window.__printReady = false;
    function tryPrint() {
      if (!window.__printReady) return;
      window.focus();
      setTimeout(function() { window.print(); }, 200);
    }
    document.fonts && document.fonts.ready.then(function() {
      window.__printReady = true;
      tryPrint();
    });
    // Fallback: if fonts API not supported, print after 1.5s
    setTimeout(function() {
      if (!window.__printReady) { window.__printReady = true; tryPrint(); }
    }, 1500);
  <\/script>
</body>
</html>`),t.document.close(),await new Promise(d=>{if(t.document.readyState==="complete"){d();return}t.addEventListener("load",d,{once:!0}),setTimeout(d,2e3)});const{createRoot:n}=await x(async()=>{const{createRoot:d}=await import("./index-DGYQP9iV.js").then(w=>w.c);return{createRoot:d}},__vite__mapDeps([0,1,2,3,4,5])),{createElement:s}=await x(async()=>{const{createElement:d}=await import("./motion-CTeeLOXR.js").then(w=>w.R);return{createElement:d}},[]),p=t.document.getElementById("print-root");if(!p)throw t.close(),new Error("Print window failed to initialize. Please try again.");n(p).render(s("div",{className:"resume-a4",style:{background:"#fff",boxSizing:"border-box",WebkitPrintColorAdjust:"exact",printColorAdjust:"exact"}},s(e,{data:i,settings:a}))),await new Promise(d=>requestAnimationFrame(()=>requestAnimationFrame(d))),await k(300),await document.fonts.ready;try{await t.document.fonts.ready}catch{}await k(200),t.focus(),t.__printReady=!0}function rt(e){const i=document.getElementById(e);if(!i){console.warn("[pdfExporter] element not found:",e);return}const a=Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(o=>o.outerHTML).join(`
`),r=window.open("","_blank");if(!r){alert("Allow pop-ups for this site to enable browser print PDF.");return}r.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${a}
  <style>
    @page { size: A4 portrait; margin: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    .resume-a4 { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; }
    @media print { .resume-a4 { width: 210mm !important; min-height: 297mm !important; margin: 0 !important; } }
    .resume-page-break-visual, .no-print { display: none !important; }
  </style>
</head>
<body>
  ${i.outerHTML}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); window.close(); }, 500);
    });
  <\/script>
</body>
</html>`),r.document.close()}function k(e){return new Promise(i=>setTimeout(i,e))}function Y(e){['"Libre Baskerville", serif','"Inter", sans-serif','"Plus Jakarta Sans", sans-serif','"JetBrains Mono", monospace'].map(r=>{const o=document.createElement("span");return o.style.cssText=`position:absolute;left:-9999px;top:0;visibility:hidden;font-family:${r};font-size:11pt;white-space:nowrap;`,o.textContent="AaBbCcDdEeFfGgHhIiJj 0123456789 ₹% — –",e.appendChild(o),o.getBoundingClientRect(),o}).forEach(r=>e.removeChild(r))}async function tt(){const e=["400","600","700","900"],i=["Inter","Libre Baskerville","Plus Jakarta Sans"],a=[];for(const r of i)for(const o of e)try{a.push(document.fonts.load(`${o} 12px "${r}"`,"AaBc0123"))}catch{}await Promise.allSettled(a)}function et(e){if(!e||e==="transparent"||e==="rgba(0, 0, 0, 0)")return!1;const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!i)return!1;const[a,r,o,t]=i;return(parseInt(r)*299+parseInt(o)*587+parseInt(t)*114)/1e3<155}export{ot as exportToPDF,rt as printResume,it as printResumeWithComponent};
