/* Myntra · Customer First Day — draws the KV backdrop (puzzle pieces + glowing ribbon with heart)
   and the header lockup into a wall page. Usage: CFD.mount({kind:'instagram'|'linkedin', tag:'#…', wall:el, headerTarget:el}) */
(function(){
  const PUZZLE='M30 50h45c-6-28 10-46 30-46s36 18 30 46h45v45c28-6 46 10 46 30s-18 36-46 30v45h-45c6 28-10 46-30 46s-36-18-30-46H30v-45c-28 6-46-10-46-30s18-36 46-30z';
  const PERSON='<svg viewBox="0 0 24 26" fill="#fff"><circle cx="12" cy="7.2" r="5.4"/><path d="M1.5 25.5c0-6.6 4.7-11 10.5-11s10.5 4.4 10.5 11z"/></svg>';
  const IG='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none"/></svg>';
  // ribbon path in a 1920×216 box: flows in from the left under the title, loops a heart, exits right
  const RIBBON='M-30 150 C 160 120, 300 190, 470 176 S 760 120, 980 150 S 1180 196, 1270 168 S 1310 150, 1328 150 '
    +'C 1302 128, 1280 108, 1292 90 C 1304 74, 1324 80, 1328 96 C 1332 80, 1352 74, 1364 90 C 1376 108, 1354 128, 1328 150 '
    +'C 1460 172, 1720 124, 1960 140';
  function ribbonSVG(){
    return `<svg class="cfd-ribbon" viewBox="0 0 1920 216" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="cfdRib" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#ff7ad9"/><stop offset=".35" stop-color="#ff5f9a"/>
        <stop offset=".7" stop-color="#ffb04a"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>
        <filter id="cfdGlow" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="7"/></filter></defs>
      <path class="glow" d="${RIBBON}" fill="none" stroke="url(#cfdRib)" stroke-width="9" filter="url(#cfdGlow)" opacity=".9"/>
      <path d="${RIBBON}" fill="none" stroke="url(#cfdRib)" stroke-width="3.2" stroke-linecap="round"/>
      <path d="${RIBBON}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.1"/>
    </svg>`;
  }
  function puzzle(cls){return `<svg class="cfd-puzzle ${cls}" viewBox="-20 0 260 245" aria-hidden="true"><path d="${PUZZLE}"/></svg>`;}
  window.CFD={
    mount(o){
      const base=o.base||'../brand/';
      const decor=document.createElement('div');decor.className='cfd-decor';
      decor.innerHTML=puzzle('tl')+puzzle('bl')+puzzle('tr')+puzzle('br');
      o.wall.prepend(decor);
      o.wall.insertAdjacentHTML('beforeend',ribbonSVG());
      const head=document.createElement('header');head.className='cfd-head';
      head.innerHTML=`<div class="cfd-lockup">
          <img class="cfd-logo" src="${base}myntra.svg" alt="Myntra">
          <div class="cfd-title"><div class="cfd-customer">Cust<span class="cfd-avatar">${PERSON}</span>mer</div>
            <div class="cfd-firstday">First Day</div></div></div>
        <div class="cfd-pill"><span class="cfd-live"></span>${o.kind==='linkedin'?'<span class="cfd-in">in</span>':IG}<span class="cfd-tag"></span></div>`;
      o.wall.appendChild(head);
      const tl=document.createElement('div');tl.className='cfd-tagline';tl.textContent='Every decision starts with them';
      o.wall.appendChild(tl);
      CFD.setTag(o.tag);
    },
    setTag(t){document.querySelectorAll('.cfd-tag').forEach(e=>e.textContent=t||'');}
  };
})();
