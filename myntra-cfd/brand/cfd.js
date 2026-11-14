/* Myntra · Customer First Day — premium wall theme.
   The lockup (Customer + avatar + First Day) and the Myntra logo are the real artwork, lifted out of
   Customer_First_Day_KV.ai as see-through images (kv-lockup.webp, kv-logo.webp).
   The header is one SVG drawn in a 1920×240 box, so the ribbon lines up exactly with the ribbon
   inside the artwork: it enters from the left, loops round the avatar (artwork), then runs on to a heart
   and behind the hashtag pill.
   Usage: CFD.mount({kind:'instagram'|'linkedin', tag:'#…', wall:el}) · CFD.setTag('#…') */
(function(){
  const PUZZLE='M30 50h45c-6-28 10-46 30-46s36 18 30 46h45v45c28-6 46 10 46 30s-18 36-46 30v45h-45c6 28-10 46-30 46s-36-18-30-46H30v-45c-28 6-46-10-46-30s18-36 46-30z';
  const IG='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none"/></svg>';
  const IN='<svg viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.36h-4v-4.75c0-1.13-.02-2.6-1.58-2.6-1.59 0-1.83 1.24-1.83 2.51v4.84h-4z"/></svg>';
  // Artwork placement in the 1920×240 header box: lockup covers KV x190–1620, y338–838 at scale .43
  const LK={x:633,y:12,w:615,h:215};
  // Threads: two gentle shapes each; the line slowly breathes between them. The ends that meet the
  // artwork's own ribbon stay fixed, so the join never moves.
  // left: soft S-curve that eases into the artwork's ribbon (crossfade x633–697)
  const LEFT_A='M-30 168 C 230 168, 410 46, 556 42 S 662 54, 697 69';
  const LEFT_B='M-30 146 C 210 188, 420 62, 562 36 S 662 54, 697 69';
  // right: leaves the artwork under "mer", loops a heart, runs behind the hashtag pill to the edge
  const HEART='C 1430 98, 1408 80, 1418 63 C 1428 46, 1450 50, 1452 67 C 1454 50, 1476 46, 1486 63 C 1496 80, 1474 98, 1452 116 ';
  const RIGHT_A='M1222 102 C 1300 99, 1378 124, 1452 116 '+HEART+'C 1508 108, 1560 100, 1620 100 S 1800 94, 1960 102';
  const RIGHT_B='M1222 102 C 1300 103, 1372 130, 1452 116 '+HEART+'C 1508 104, 1560 100, 1620 100 S 1800 112, 1960 90';
  const breathe=(a,b,dur)=>`<animate attributeName="d" dur="${dur}s" repeatCount="indefinite" calcMode="spline"
      keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" values="${a};${b};${a}"/>`;
  // one line = soft glow + core + fine white highlight + a travelling light that fades in and dissolves out
  function thread(a,b,dur,grad,side){
    const bw=breathe(a,b,dur);
    return `<path class="glow" d="${a}" stroke="url(#${grad})" stroke-width="9" filter="url(#cfdGlow)">${bw}</path>
      <path d="${a}" stroke="url(#${grad})" stroke-width="3">${bw}</path>
      <path d="${a}" stroke="#fff" stroke-opacity=".7" stroke-width="1">${bw}</path>
      <g class="cfd-flow ${side}">
        <path class="halo" d="${a}" pathLength="1000" filter="url(#cfdSoft)">${bw}</path>
        <path class="core" d="${a}" pathLength="1000" filter="url(#cfdSoftS)">${bw}</path>
      </g>`;
  }
  // the moving KV background; also cloned into the top/bottom edges so posts dissolve into it
  function skyHTML(){
    return '<div class="cfd-sky-grad"></div><div class="cfd-orb a"></div><div class="cfd-orb b"></div><div class="cfd-orb c"></div>'
      +puzzle('tl')+puzzle('bl')+puzzle('tr')+puzzle('br')+'<div class="cfd-vignette"></div><div class="cfd-grain"></div>';
  }
  function header(kind,base){
    return `<header class="cfd-head" aria-label="Myntra Customer First Day">
      <svg class="cfd-headsvg" viewBox="0 0 1920 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="cfdRibL" gradientUnits="userSpaceOnUse" x1="0" x2="697" y1="0" y2="0">
            <stop offset="0" stop-color="#ff6fd2" stop-opacity="0"/><stop offset=".12" stop-color="#ff6fd2"/>
            <stop offset=".9" stop-color="#ff8fc0"/><stop offset="1" stop-color="#ffa0b8" stop-opacity="0"/></linearGradient>
          <linearGradient id="cfdRibR" gradientUnits="userSpaceOnUse" x1="1222" x2="1920" y1="0" y2="0">
            <stop offset="0" stop-color="#ffc14a" stop-opacity="0"/><stop offset=".05" stop-color="#ffc14a"/>
            <stop offset=".45" stop-color="#ffd66a"/><stop offset="1" stop-color="#fff0a0"/></linearGradient>
          <filter id="cfdGlow" x="-5%" y="-100%" width="110%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
          <filter id="cfdSoft" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
          <filter id="cfdSoftS" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="2.4"/></filter>
          <filter id="cfdLift" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#5a0030" flood-opacity=".35"/></filter>
        </defs>
        <g class="cfd-thread">
          ${thread(LEFT_A,LEFT_B,11,'cfdRibL','l')}
          ${thread(RIGHT_A,RIGHT_B,13,'cfdRibR','r')}
        </g>
        <image href="${base}kv-logo.webp" x="46" y="34" width="150" height="107" filter="url(#cfdLift)"/>
        <image class="cfd-lockup" href="${base}kv-lockup.webp" x="${LK.x}" y="${LK.y}" width="${LK.w}" height="${LK.h}" filter="url(#cfdLift)"/>
      </svg>
      <div class="cfd-pill"><span class="cfd-live"></span><span class="cfd-net">${kind==='linkedin'?IN:IG}</span><span class="cfd-tag"></span></div>
    </header>`;
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
    },
    setTag(t){document.querySelectorAll('.cfd-tag').forEach(e=>e.textContent=t||'');}
  };
})();
