/* Myntra · Customer First Day — premium wall theme.
   The lockup (Customer + avatar + First Day) is the real artwork, lifted out of
   Customer_First_Day_KV.ai as a see-through image (kv-lockup.webp). The logo is the official Myntra SVG
   with the wordmark in white (myntra-logo-white.svg).
   The header is one SVG in a 1920×240 box. One glowing thread runs across it:
     left edge → under the Myntra logo → behind the "C" into the artwork's own ribbon (round the avatar, behind "mer") → heart →
     around the hashtag pill (it draws the pill's outline) → right edge.
   A travelling light makes that whole journey (splitting round the hashtag pill) every 16 s.
   Usage: CFD.mount({kind:'instagram'|'linkedin', tag:'#…', wall:el}) · CFD.setTag('#…') */
(function(){
  const PUZZLE='M30 50h45c-6-28 10-46 30-46s36 18 30 46h45v45c28-6 46 10 46 30s-18 36-46 30v45h-45c6 28-10 46-30 46s-36-18-30-46H30v-45c-28 6-46-10-46-30s18-36 46-30z';
  const IG='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none"/></svg>';
  const IN='<svg viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.36h-4v-4.75c0-1.13-.02-2.6-1.58-2.6-1.59 0-1.83 1.24-1.83 2.51v4.84h-4z"/></svg>';
  // Artwork placement in the 1920×240 header box: lockup covers KV x190–1620, y338–838 at scale .43
  const LK={x:633,y:12,w:615,h:215};

  // Left thread: one smooth curve from the left edge, dipping under the Myntra logo, rising gently and
  // tucking in behind the "C" (the artwork's own ribbon tail left of the C was removed so nothing has to
  // line up there). Its far-left end slowly breathes.
  const LEFT_A='M3.1 38.1 C 93.1 76.1, 150 182, 260 176 C 370 170, 474.5 115.6, 574.5 77.6 C 624.5 59.6, 672.1 51.2, 722 68';
  const LEFT_B='M3.1 38.1 C 93.1 76.1, 150 186, 260 180 C 370 174, 474.5 115.6, 574.5 77.6 C 624.5 59.6, 672.1 51.2, 722 68';
  // Middle: route of the artwork's ribbon (round the avatar, behind "mer"); light only, masked to the ribbon.
  const MID='M698 69 C716.1 69.0 773.5 70.1 809.3 67.9 C845.1 65.7 891.7 61.0 912.5 55.9 C933.3 50.7 927.5 41.8 934.0 36.9 C940.5 32.1 945.1 29.1 951.2 26.6 C957.3 24.1 963.7 22.4 970.5 21.9 C977.4 21.4 986.0 21.8 992.0 23.6 C998.1 25.4 1003.4 28.3 1007.1 32.6 C1010.8 36.9 1013.0 43.7 1014.4 49.4 C1015.8 55.1 1016.1 60.5 1015.7 66.6 C1015.3 72.7 1013.3 80.4 1012.3 86.0 C1011.3 91.5 1007.7 96.1 1009.7 99.7 C1011.7 103.3 1019.0 105.8 1024.3 107.5 C1029.6 109.1 1027.2 109.9 1041.5 109.6 C1055.8 109.3 1090.2 107.8 1110.3 105.7 C1130.4 103.7 1147.6 98.6 1161.9 97.1 C1176.2 95.7 1186.3 96.3 1196.3 97.1 C1206.3 98.0 1217.8 101.4 1222.1 102.3';
  // Right thread: starts behind the stem of the "r" (the artwork's ribbon right of it was removed), one gentle
  // curve to the heart, then to the pill. The pill end is filled in at run time (the pill's width follows the hashtag).
  // Shape drawn by the client in the line editor (editor/index.html), copied point for point.
  const rightPath=(pl,cy,b)=>`M1180.3 98.3 C 1267.3 ${b?161.8:157.8}, 1254.1 64.6, 1372 100 `
    +`C 1350 82, 1328 64, 1338 47 C 1348 30, 1370 34, 1372 51 C 1374 34, 1396 30, 1406 47 C 1416 64, 1392.7 82.9, 1370.7 100.9 `
    +`C 1413.7 ${b?139:135}, ${(pl-51.5).toFixed(1)} ${(cy-16.3).toFixed(1)}, ${pl} ${cy}`;
  const exitPath=(pr,cy,b)=>`M${pr} ${cy} C ${(pr+28.8).toFixed(1)} ${(cy-1.7).toFixed(1)}, ${(pr+38.5).toFixed(1)} ${(cy-16.2).toFixed(1)}, ${(pr+56.7).toFixed(1)} ${(cy+(b?32:28)).toFixed(1)}`;
  const pillHalf=(pl,pr,cy,r,top)=>top
    ?`M${pl} ${cy} A ${r} ${r} 0 0 1 ${pl+r} ${cy-r} L ${pr-r} ${cy-r} A ${r} ${r} 0 0 1 ${pr} ${cy}`
    :`M${pl} ${cy} A ${r} ${r} 0 0 0 ${pl+r} ${cy+r} L ${pr-r} ${cy+r} A ${r} ${r} 0 0 0 ${pr} ${cy}`;

  const MOTION=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const breathe=(a,b,dur)=>!MOTION?'':`<animate attributeName="d" dur="${dur}s" repeatCount="indefinite" calcMode="spline"
      keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" values="${a};${b};${a}"/>`;
  // one line = soft glow + core + fine white highlight + a travelling light that fades in and dissolves out.
  // `key` marks the paths so their shape can be updated later (right side follows the pill).
  function thread(a,b,dur,grad,side,key){
    const bw=b?breathe(a,b,dur):'', k=key?` data-k="${key}"`:'';
    return `<path class="glow"${k} d="${a}" stroke="url(#${grad})" stroke-width="10" filter="url(#cfdGlow)">${bw}</path>
      <path${k} d="${a}" stroke="url(#${grad})" stroke-width="3.2">${bw}</path>
      <path${k} d="${a}" stroke="#fff" stroke-opacity=".8" stroke-width="1.2">${bw}</path>
      <g class="cfd-flow ${side}">
        <path class="halo"${k} d="${a}" pathLength="1000" filter="url(#cfdSoft)">${bw}</path>
        <path class="core"${k} d="${a}" pathLength="1000" filter="url(#cfdSoftS)">${bw}</path>
      </g>`;
  }
  // the moving KV background; also cloned into the top/bottom edges so posts dissolve into it
  function skyHTML(){
    return '<div class="cfd-sky-grad"></div><div class="cfd-orb a"></div><div class="cfd-orb b"></div>'
      +puzzle('tl')+puzzle('bl')+puzzle('tr')+puzzle('br')+'<div class="cfd-vignette"></div><div class="cfd-grain"></div>';
  }
  // first guess for the pill (1920 box); corrected from the real pill once it is laid out
  const G={pl:1474,pr:1874,cy:100,r:26};
  function header(kind,base){
    return `<header class="cfd-head" aria-label="Myntra Customer First Day">
      <div class="cfd-pill"><span class="cfd-live"></span><span class="cfd-net">${kind==='linkedin'?IN:IG}</span><span class="cfd-tag"></span></div>
      <svg class="cfd-headsvg" viewBox="0 0 1920 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="cfdRibL" gradientUnits="userSpaceOnUse" x1="0" x2="722" y1="0" y2="0">
            <stop offset="0" stop-color="#ff7ad6" stop-opacity=".15"/><stop offset=".05" stop-color="#ff7ad6"/><stop offset=".55" stop-color="#ff9ec8"/>
            <stop offset="1" stop-color="#ffa6b4"/></linearGradient>
          <linearGradient id="cfdRibR" gradientUnits="userSpaceOnUse" x1="1180" x2="1920" y1="0" y2="0">
            <stop offset="0" stop-color="#ffc14a"/>
            <stop offset=".45" stop-color="#ffd66a"/><stop offset="1" stop-color="#fff0a0"/></linearGradient>
          <filter id="cfdGlow" x="-5%" y="-100%" width="110%" height="300%"><feGaussianBlur stdDeviation="5.5"/></filter>
          <filter id="cfdSoft" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
          <filter id="cfdSoftS" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="2.4"/></filter>
          <filter id="cfdLift" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#5a0030" flood-opacity=".24"/></filter>
          <filter id="cfdLiftS" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#5a0030" flood-opacity=".18"/></filter>
          <mask id="cfdRibMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="240">
            <image href="${base}kv-ribbon-mask.png" x="${LK.x}" y="${LK.y}" width="${LK.w}" height="${LK.h}"/></mask>
        </defs>
        <g class="cfd-thread">
          ${thread(LEFT_A,LEFT_B,11,'cfdRibL','l')}
          ${thread(rightPath(G.pl,G.cy,0),rightPath(G.pl,G.cy,1),13,'cfdRibR','r','r')}
          ${thread(pillHalf(G.pl,G.pr,G.cy,G.r,1),'',0,'cfdRibR','p','pt')}
          ${thread(pillHalf(G.pl,G.pr,G.cy,G.r,0),'',0,'cfdRibR','p','pb')}
          ${thread(exitPath(G.pr,G.cy,0),exitPath(G.pr,G.cy,1),9,'cfdRibR','x','x')}
        </g>
        <image href="${base}myntra-logo-white.svg" x="50" y="61" width="284" height="78" filter="url(#cfdLiftS)"/>
        <image class="cfd-lockup" href="${base}kv-lockup.webp" x="${LK.x}" y="${LK.y}" width="${LK.w}" height="${LK.h}" filter="url(#cfdLift)"/>
        <g class="cfd-flow m" mask="url(#cfdRibMask)">
          <path class="halo" d="${MID}" pathLength="1000"/>
          <path class="core" d="${MID}" pathLength="1000" filter="url(#cfdSoftS)"/>
        </g>
      </svg>
    </header>`;
  }
  // Fit the right side of the thread to the pill as it is actually drawn (its width follows the hashtag).
  function fitPill(){
    const svg=document.querySelector('.cfd-headsvg'), pill=document.querySelector('.cfd-pill');
    if(!svg||!pill||!svg.getScreenCTM())return;
    const r=pill.getBoundingClientRect(); if(!r.width)return;
    const m=svg.getScreenCTM().inverse(), pt=svg.createSVGPoint();
    const to=(x,y)=>{pt.x=x;pt.y=y;return pt.matrixTransform(m);};
    const a=to(r.left,r.top), b=to(r.right,r.bottom);
    const pl=+a.x.toFixed(1), pr=+b.x.toFixed(1), cy=+((a.y+b.y)/2).toFixed(1), rad=+((b.y-a.y)/2).toFixed(1);
    const set=(k,A,B)=>svg.querySelectorAll(`[data-k="${k}"]`).forEach(p=>{
      p.setAttribute('d',A); const an=p.querySelector('animate'); if(an&&B)an.setAttribute('values',`${A};${B};${A}`);});
    set('r',rightPath(pl,cy,0),rightPath(pl,cy,1));
    set('pt',pillHalf(pl,pr,cy,rad,1)); set('pb',pillHalf(pl,pr,cy,rad,0));
    set('x',exitPath(pr,cy,0),exitPath(pr,cy,1));
  }
  function puzzle(cls){return `<svg class="cfd-puzzle ${cls}" viewBox="-20 0 260 245" aria-hidden="true"><path d="${PUZZLE}"/></svg>`;}
  window.CFD={
    mount(o){
      const base=o.base||'../brand/';
      const sky=document.createElement('div');sky.className='cfd-sky';
      sky.innerHTML=skyHTML();
      o.wall.prepend(sky);
      // soft edges: a masked copy of the same moving background sits over the top and bottom of the posts,
      // so cards dissolve in and out (the mask is on this overlay, never on the Instagram/LinkedIn frames)
      ['top','bot'].forEach(k=>o.wall.insertAdjacentHTML('beforeend',`<div class="cfd-edge ${k}" aria-hidden="true"><div class="cfd-sky">${skyHTML()}</div></div>`));
      o.wall.insertAdjacentHTML('beforeend',header(o.kind,base));
      const tl=document.createElement('div');tl.className='cfd-tagline';
      tl.innerHTML='<i></i><span>Every decision starts with them</span><i></i>';
      o.wall.appendChild(tl);
      CFD.setTag(o.tag);
      addEventListener('resize',()=>requestAnimationFrame(fitPill));
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>requestAnimationFrame(fitPill));
      setTimeout(fitPill,1500);
    },
    setTag(t){document.querySelectorAll('.cfd-tag').forEach(e=>e.textContent=t||'');requestAnimationFrame(fitPill);}
  };
})();
