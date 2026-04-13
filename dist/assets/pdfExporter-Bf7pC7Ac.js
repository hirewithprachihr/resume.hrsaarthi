const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-fEsJQUpH.js","assets/templates-pro-RUtSHO8C.js","assets/motion-CTeeLOXR.js","assets/pdf-engine-DjTwIyRi.js","assets/supabase-CaBZhh50.js","assets/index-HYWQAEaZ.css"])))=>i.map(i=>d[i]);
import{_ as E,h as X,E as U}from"./pdf-engine-DjTwIyRi.js";const h=794,x=1123,k=210,C=297,m=3,K=56,Q=56,_=8,Z=36,Y=220,tt=60,et=140,nt=40,ot=80,it=20;function rt(e,i){for(let s=1;s<=i;s++)e.setPage(s),e.saveGraphicsState(),e.setTextColor(180,180,180),e.setFontSize(28),e.setFont("helvetica","bold"),e.text("resume.hrsaarthi.com",105,180,{angle:45,align:"center"}),e.setFontSize(22),e.setTextColor(210,210,210),e.text("resume.hrsaarthi.com",105,100,{angle:45,align:"center"}),e.restoreGraphicsState()}async function ut(e,i,s,r="resume",n=!1){const t=document.createElement("div");t.className="resume-export-root",t.style.cssText=["position:fixed","left:-9999px","top:0",`width:${h}px`,"background:white","z-index:-9999","visibility:hidden","overflow:visible","-webkit-print-color-adjust:exact","print-color-adjust:exact"].join(";"),document.body.appendChild(t);let o=null;try{const{createRoot:l}=await E(async()=>{const{createRoot:c}=await import("./index-fEsJQUpH.js").then(f=>f.c);return{createRoot:c}},__vite__mapDeps([0,1,2,3,4,5])),{createElement:d}=await E(async()=>{const{createElement:c}=await import("./motion-CTeeLOXR.js").then(f=>f.R);return{createElement:c}},[]);o=l(t),await new Promise(c=>{o.render(d("div",{className:"resume-a4 bg-white",style:{boxSizing:"border-box",overflow:"visible",width:`${h}px`}},d(s,{data:e,settings:i}))),requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(c)))}),await document.fonts.ready,await G(),await v(400),D(t),await v(150),await new Promise(c=>requestAnimationFrame(c));const a=t.scrollHeight,p=Math.ceil(a/x),R=st(t,p,a);t.style.visibility="visible",t.style.left="-9999px";const N=await X(t,{scale:m,useCORS:!0,allowTaint:!1,backgroundColor:"#ffffff",width:h,height:a,scrollX:0,scrollY:0,windowWidth:h,windowHeight:a,logging:!1,imageTimeout:25e3,removeContainer:!1,onclone:c=>{const f=c.body.querySelector(".resume-export-root")||c.body.querySelector("div");f&&(f.style.visibility="visible",f.style.overflow="visible",f.style.overflowX="visible")}});t.style.visibility="hidden";const w=new U({orientation:"portrait",unit:"mm",format:"a4",compress:!0}),T=t.querySelector('[data-is-sidebar="true"]');let y=0,b="#ffffff";T&&(y=T.getBoundingClientRect().width,b=window.getComputedStyle(T).backgroundColor);for(let c=0;c<p;c++){const f=R[c],j=R[c+1]!==void 0?R[c+1]:a,A=c>0?K:0,q=c===0?Q:0,S=Math.min(j-f,x-A-q),g=document.createElement("canvas");g.width=h*m,g.height=x*m;const u=g.getContext("2d");if(u.fillStyle="#ffffff",u.fillRect(0,0,g.width,g.height),y>0&&(u.fillStyle=b,u.fillRect(0,0,y*m,g.height)),u.drawImage(N,0,f*m,h*m,S*m,0,A*m,h*m,S*m),c>0){u.fillStyle=b,u.fillRect(0,0,y*m,A*m);const H=ct(b);u.fillStyle=H?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.4)",u.font=`${8*m}px "Inter", sans-serif`,u.textAlign="left";const V=(e.personal.fullName||"RESUME").toUpperCase();u.fillText(V,48*m,28*m),u.textAlign="right",u.fillText(`PAGE ${c+1} OF ${p}`,(h-48)*m,28*m),u.strokeStyle=H?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)",u.lineWidth=.5*m,u.beginPath(),u.moveTo(48*m,34*m),u.lineTo((h-48)*m,34*m),u.stroke()}c>0&&w.addPage();const W=g.toDataURL("image/png"),I=k-2*_,M=C-2*_,F=Math.min(I/k,M/C),B=k*F,L=C*F,z=_+(I-B)/2,J=_+(M-L)/2;w.addImage(W,"PNG",z,J,B,L,void 0,"FAST")}n||rt(w,p);const $=(r||"resume").replace(/[^a-z0-9_\-]/gi,"_").toLowerCase();return w.save(`${$}_resume.pdf`),{success:!0,pages:p}}finally{if(o)try{o.unmount()}catch{}t.parentNode&&document.body.removeChild(t)}}function st(e,i,s){if(i<=1)return[0];const r=O(e,[".resume-entry",".resume-section-compact"]),n=O(e,[".resume-section-head","[data-break-after]"]),t=lt(e),o=[0];for(let l=1;l<i;l++){const d=l*x;let a=P(r,d,Y,tt);if(a!==null){o.push(a);continue}if(a=P(n,d,et,nt),a!==null){o.push(a);continue}if(a=P(t,d,ot,it),a!==null){o.push(a);continue}if(a=at(r,t,d),a!==null){o.push(a);continue}o.push(Math.max(0,d-Z))}return o}function P(e,i,s,r){const n=e.filter(l=>l>=i-s&&l<=i+r);if(!n.length)return null;const t=n.filter(l=>l<=i),o=t.length?t:n;return o.sort((l,d)=>Math.abs(l-i)-Math.abs(d-i)),Math.round(o[0]+8)}function at(e,i,s,r){const n=[...e,...i].sort((t,o)=>t-o);if(!n.length)return null;for(let t=0;t<n.length-1;t++)if(n[t]<=s&&n[t+1]>=s){const o=n[t],l=n[t+1],d=s-o<=l-s?o:l;return Math.round(d+6)}return null}function O(e,i){const s=e.querySelectorAll(i.join(",")),r=e.getBoundingClientRect().top,n=[];return s.forEach(t=>{const o=t.getBoundingClientRect().bottom-r;o>0&&n.push(o)}),n.sort((t,o)=>t-o),n.filter((t,o)=>o===0||t-n[o-1]>4)}function lt(e){const i=e.querySelectorAll("p, li, div, span"),s=e.getBoundingClientRect().top,r=[],n=new Set;return i.forEach(t=>{const o=window.getComputedStyle(t);if(o.display==="flex"||o.display==="grid"||t.children.length>5)return;const l=Math.round(t.getBoundingClientRect().bottom-s);l>0&&!n.has(l)&&(n.add(l),r.push(l))}),r.sort((t,o)=>t-o),r.filter((t,o)=>o===0||t-r[o-1]>2)}async function dt(e,i,s){const r=Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(a=>a.outerHTML).join(`
`),n=window.open("","_blank");if(!n)throw new Error("Pop-up blocked — allow pop-ups to print.");n.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${r}
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    .resume-page-break-visual, .no-print { display: none !important; }
    .resume-a4 {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: #fff;
    }
    @media print {
      .resume-a4 {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 18mm 15mm !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div id="print-resume-root"></div>
</body>
</html>`),n.document.close();const{createRoot:t}=await E(async()=>{const{createRoot:a}=await import("./index-fEsJQUpH.js").then(p=>p.c);return{createRoot:a}},__vite__mapDeps([0,1,2,3,4,5])),{createElement:o}=await E(async()=>{const{createElement:a}=await import("./motion-CTeeLOXR.js").then(p=>p.R);return{createElement:a}},[]),l=n.document.getElementById("print-resume-root"),d=t(l);d.render(o("div",{className:"resume-a4 bg-white"},o(e,{data:i,settings:s}))),await n.document.fonts.ready,await document.fonts.ready,await G(),await v(400),D(l),await v(150),n.focus(),n.print(),setTimeout(()=>{try{d.unmount()}catch{}try{n.close()}catch{}},500)}function ft(e){const i=document.getElementById(e);if(!i){console.warn("[pdfExporter] element not found:",e);return}const s=Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(n=>n.outerHTML).join(`
`),r=window.open("","_blank");if(!r){alert("Allow pop-ups for this site to enable browser print PDF.");return}r.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${s}
  <style>
    @page { size: A4 portrait; margin: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    .resume-a4 {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: #fff;
    }
    @media print {
      .resume-a4 {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 18mm 15mm !important;
      }
    }
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
</html>`),r.document.close()}function v(e){return new Promise(i=>setTimeout(i,e))}function D(e){['"Libre Baskerville", serif','"Inter", sans-serif','"Plus Jakarta Sans", sans-serif','"JetBrains Mono", monospace'].map(r=>{const n=document.createElement("span");return n.style.cssText=`position:absolute;left:-9999px;top:0;visibility:hidden;font-family:${r};font-size:11pt;white-space:nowrap;`,n.textContent="AaBbCcDdEeFfGgHhIiJj 0123456789 ₹% — –",e.appendChild(n),n.getBoundingClientRect(),n}).forEach(r=>e.removeChild(r))}async function G(){const e=["400","600","700","900"],i=["Inter","Libre Baskerville","Plus Jakarta Sans"],s=[];for(const r of i)for(const n of e)try{s.push(document.fonts.load(`${n} 12px "${r}"`,"AaBc0123"))}catch{}await Promise.allSettled(s)}function ct(e){if(!e||e==="transparent")return!1;const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!i)return!1;const[s,r,n,t]=i;return(parseInt(r)*299+parseInt(n)*587+parseInt(t)*114)/1e3<155}export{ut as exportToPDF,ft as printResume,dt as printResumeWithComponent};
