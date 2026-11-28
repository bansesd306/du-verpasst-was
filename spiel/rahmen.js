// =====================================================================
//  RAHMEN: Startbildschirm, Menü, Enden, Abzeichen, Beenden
//  (aus der Demo „start-und-ende.html“; ein Zimmer für alles: drinnen trist,
//   draußen hinter dem Fenster die Party). IDs im HTML tragen „z-“ davor.
// =====================================================================
const Rahmen = (() => {
  let api = null;
  const bw = document.getElementById('zimmer');
  const $ = id => document.getElementById(id === 'bw' ? 'zimmer' : 'z-' + id);
  const reduziert = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const ENDEN = ['Leiser', 'Blaues Licht', 'Montagabend'];   // V8.9: ein Name pro Schluss (Pizza / Jonas schreibt / Lynn)
  const TOENUNG = {
    'Leiser': 'radial-gradient(ellipse 700px 500px at 800px 760px,rgba(90,110,220,.18),transparent 70%)',
    'Blaues Licht': 'radial-gradient(ellipse 900px 600px at 900px 740px,rgba(54,180,255,.28),transparent 70%)',
    'Montagabend': 'radial-gradient(ellipse 900px 600px at 900px 740px,rgba(255,140,170,.22),transparent 70%)'
  };
  // Handy auf dem Tisch je Ende: umgedreht / meldet sich ab und zu / Display dauerhaft an
  const HANDY = { 'Leiser': 'unten', 'Blaues Licht': 'hell', 'Montagabend': 'unten' };
  const T = (k, d) => (api && api.TEXTE[k] != null && api.TEXTE[k] !== '') ? api.TEXTE[k] : d;
  const S = () => api.S();
  // Abzeichen: [Name, Symbol, Farbe 1, Farbe 2, was man getan hat, vager Hinweis]
  function ABZ() { return api.abz().map(n => { const s = (typeof ABZ_STIL !== 'undefined' && ABZ_STIL[n]) || ['★', '#ffcf4a', '#ff7a2f', '', '']; return [n, s[0], s[1], s[2], s[3] || '', s[4] || '']; }); }
  function stil(n) { return ABZ().find(a => a[0] === n) || [n, '★', '#ffcf4a', '#ff7a2f', '', '']; }
  function verpasst() { return ABZ().filter(a => !S().abz.includes(a[0])); }
  const laeufe = () => S().laeufe || 0;
  const sichern = () => api.speichere();

  // Zeitpläne, damit Wechsel sauber abbrechen
  let plaene = [];
  let verpasstPlan = null, verpasstLauf = null;
  function plan(fn, ms) { const id = setTimeout(fn, ms); plaene.push(id); return id; }
  function planStopp() { plaene.forEach(clearTimeout); plaene = []; }

  // ---------------- Draußen ----------------
  const farben = ['#ff9a3c', '#ff4fa3', '#ffd27a', '#9a5cff', '#3cf0ff', '#7dff8a', '#ff6a3c', '#ffe14d'];
  let aktiv = false, feuerRate = .025, vorbeiT = null, flackZ = 0;
  (() => {
    const bok = bw.querySelector('#z-draussen .bokeh');
    for (let i = 0; i < 34; i++) {
      const e = document.createElement('div'); e.className = 'bok'; const g = 30 + Math.random() * 120;
      e.style.cssText = 'width:' + g + 'px;height:' + g + 'px;left:' + (Math.random() * 105 - 3) + '%;top:' + (25 + Math.random() * 80) + '%;' +
        'background:' + farben[i % farben.length] + ';--d:' + (1.5 + Math.random() * 3.5).toFixed(1) + 's;--v:-' + (Math.random() * 4).toFixed(1) + 's;' +
        '--x:' + Math.round(Math.random() * 40 - 20) + 'px;--y:' + Math.round(Math.random() * 30 - 15) + 'px';
      bok.appendChild(e);
    }
    const svg = $('kette'), ns = 'http://www.w3.org/2000/svg';
    [[-10, 60, 520, 90, 150], [-10, 140, 520, 110, 190]].forEach(k => {
      const [x0, y0, x1, y1, tief] = k, mx = (x0 + x1) / 2;
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M' + x0 + ' ' + y0 + ' Q' + mx + ' ' + tief + ' ' + x1 + ' ' + y1);
      p.setAttribute('stroke', 'rgba(20,8,24,.7)'); p.setAttribute('stroke-width', '1.5'); p.setAttribute('fill', 'none'); svg.appendChild(p);
      for (let t = .04; t < 1; t += .075) {
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * tief + t * t * y1;
        const c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', (y + 5).toFixed(1)); c.setAttribute('r', '4.5');
        const f = farben[Math.floor(Math.random() * farben.length)];
        c.setAttribute('fill', f); c.setAttribute('class', 'bulb');
        c.setAttribute('style', 'filter:drop-shadow(0 0 6px ' + f + ');--d:' + (1 + Math.random() * 1.4).toFixed(2) + 's;--v:-' + (Math.random() * 2).toFixed(2) + 's');
        svg.appendChild(c);
      }
    });
  })();
  // Feuerwerk (läuft nur, solange das Zimmer zu sehen ist)
  const feuer = (() => {
    const cv = bw.querySelector('#z-draussen canvas'), ctx = cv.getContext('2d'), W = 508, H = 398; cv.width = W; cv.height = H;
    let teile = [], raketen = [], laeuft = false;
    function rakete() { raketen.push({ x: 60 + Math.random() * (W - 120), y: H, ziel: 40 + Math.random() * 130, v: 6 + Math.random() * 2, f: farben[Math.floor(Math.random() * farben.length)] }); }
    function knall(x, y, f) { const n = 46 + Math.floor(Math.random() * 30), f2 = farben[Math.floor(Math.random() * farben.length)];
      for (let i = 0; i < n; i++) { const w = Math.random() * 6.283, sp = 1 + Math.random() * 3.2; teile.push({ x, y, vx: Math.cos(w) * sp, vy: Math.sin(w) * sp, l: 1, f: i % 3 ? f : f2 }); } }
    function bild() {
      if (!aktiv) { laeuft = false; return; }
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      raketen.forEach(r => { r.y -= r.v; r.v *= .985; ctx.fillStyle = 'rgba(255,230,200,.9)'; ctx.fillRect(r.x, r.y, 2, 6); if (r.y <= r.ziel) { r.tot = 1; knall(r.x, r.y, r.f); } });
      raketen = raketen.filter(r => !r.tot);
      teile.forEach(t => { t.x += t.vx; t.y += t.vy; t.vy += .045; t.vx *= .985; t.l -= .012;
        ctx.globalAlpha = Math.max(t.l, 0); ctx.fillStyle = t.f; ctx.beginPath(); ctx.arc(t.x, t.y, 1.8, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1; teile = teile.filter(t => t.l > 0);
      if (Math.random() < feuerRate) rakete();
      requestAnimationFrame(bild);
    }
    return { an() { if (reduziert || laeuft) return; laeuft = true; rakete(); requestAnimationFrame(bild); } };
  })();
  // Jemand läuft drüben am Fenster vorbei, das Licht im Zimmer wird kurz dunkler
  const lichtfall = $('lichtfall');
  function vorbei() {
    if (!aktiv) return;
    const gl = bw.querySelector('#z-draussen .vorbei'); gl.classList.remove('geht'); void gl.offsetWidth; gl.classList.add('geht');
    setTimeout(() => lichtfall.classList.add('dunkel'), 700); setTimeout(() => lichtfall.classList.remove('dunkel'), 4200);
    vorbeiT = setTimeout(vorbei, 16000 + Math.random() * 12000);
  }
  bw.addEventListener('pointermove', ev => {
    const r = bw.getBoundingClientRect();
    bw.style.setProperty('--px', ((ev.clientX - r.left) / r.width - .5).toFixed(3));
    bw.style.setProperty('--py', ((ev.clientY - r.top) / r.height - .5).toFixed(3));
  });
  const sp = bw.querySelector('#z-menue .spielen');
  function sog(an) { bw.classList.toggle('sog', an); bw.style.setProperty('--sog', an ? 1 : 0); }
  ['pointerenter', 'focus'].forEach(t => sp.addEventListener(t, () => sog(true)));
  ['pointerleave', 'blur'].forEach(t => sp.addEventListener(t, () => sog(false)));

  // ---------------- Ton ----------------
  // Gedämpfte Partymusik (Philips „Muffled Party“) als Stream: läuft sofort an, ohne auf das Laden
  // und Dekodieren aller anderen Töne zu warten. Datei ist schon leiser gemischt (auch iPhone, das die
  // Lautstärke von Audio-Elementen ignoriert). Autoplay wird versucht, sonst startet sie beim ersten Berühren.
  // V8.5: Auf dem iPhone blieb das Audio-Element stumm (Stumm-Schalter / Artefakt-Rahmen). Deshalb beides:
  // Das Element startet sofort (Autoplay-Versuch); sobald Web Audio läuft und die Datei dekodiert ist,
  // übernimmt der Web-Audio-Loop „party_fern“ (wie bis V8.1) und das Element wird ausgeblendet.
  const fern = (() => {
    const START_VOL = .4;   // Gemini-Prüfung 26.11.: Startbildschirm −8 dB, damit die Titelmusik nicht leiser wirkt
    let el = null, soll = false, fadeT = null, web = false, webT = null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { }
    const mach = () => { if (!el) { el = new Audio('ton/muffled_party_start.mp3'); el.loop = true; el.preload = 'auto'; el.setAttribute('playsinline', ''); } return el; };
    function blende(ziel, ms, fertig) {
      clearInterval(fadeT); const e = mach(), v0 = e.volume, t0 = performance.now();
      fadeT = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); try { e.volume = v0 + (ziel - v0) * k; } catch (x) { } if (k >= 1) { clearInterval(fadeT); fertig && fertig(); } }, 40);
    }
    function webAn() {
      if (web || !window.Ton || !Ton.bereit) return;
      web = true; Ton.loop('party_fern', true);
      clearInterval(webT);
      webT = setInterval(() => {
        if (!soll) { clearInterval(webT); return; }
        if (Ton.hat('muffled_party') && Ton.laeuftKontext) { clearInterval(webT); if (el && !el.paused) blende(0, 1200, () => { if (web) el.pause(); }); }
      }, 250);
    }
    return {
      vorladen() { try { mach().load(); } catch (e) { } },
      start() {
        soll = true;
        if (window.Ton && Ton.bereit) { webAn(); if (web && Ton.hat('muffled_party')) return; }
        const e = mach();
        if (!e.paused) { blende(START_VOL, 600); return; }
        try { e.volume = 0; } catch (x) { }
        const p = e.play(); if (p && p.catch) p.catch(() => { });
        blende(START_VOL, 900);
      },
      stopp(ms = 900) {
        soll = false; clearInterval(webT);
        if (web) { web = false; if (window.Ton) Ton.loop('party_fern', false); }
        if (!el || el.paused) return; blende(0, ms, () => { if (!soll) el.pause(); });
      },
      get laeuft() { return web || (!!el && !el.paused); },
      get web() { return web; },
    };
  })();
  fern.vorladen();
  // Erstes Berühren irgendwo (auch vor dem eigentlichen Klick): Musik sofort an, solange Start/Menü zu sehen sind
  const erstesBeruehren = () => {
    if (!bw.classList.contains('an') || bw.classList.contains('ende-an')) return;
    if (window.Ton) Ton.init();   // Web Audio im Tipp freischalten (iPhone), lädt die Töne
    if (!fern.laeuft || !fern.web) fern.start();
  };
  ['pointerdown', 'touchend', 'pointerup', 'click', 'keydown'].forEach(t => addEventListener(t, erstesBeruehren, true));
  let bzzzZaehler = 0;
  function ton(name) {
    if (name === 'party_fern') { fern.start(); return; }
    if (!api || !window.Ton || !Ton.bereit) return;
    if (name === 'bzzz') { if (bzzzZaehler++ < 3) Ton.spiele('bzzz', { vol: .5 }); return; }  // nur die ersten paar, sonst nervt es
    Ton.spiele(name);
  }

  // ---------------- Nachrichten auf dem Start ----------------
  const nachr = [[220, 140], [300], [160, 90, 120], [260, 110], [190], [140, 200], [310, 60], [230]];
  const stapel = $('stapel'), kopf = $('stapelkopf'), anz = $('anzahl');
  let nIdx = 0, hIdx = 0, nStart = null, nTimer = null;
  function zaehlerText() { const n = S().nachr || 0; anz.textContent = n + (n === 1 ? ' neue Nachricht' : ' neue Nachrichten'); }
  function neu() {
    const m = nachr[nIdx % nachr.length]; nIdx++; S().nachr = (S().nachr || 0) + 1;
    const k = document.createElement('div'); k.className = 'nk';
    k.innerHTML = '<div class="ic"><i></i></div><div class="tx"><div class="wer"></div><div class="was"></div></div>';
    k.querySelector('.wer').textContent = 'Neue Nachricht';
    const was = k.querySelector('.was'), vp = verpasst();
    if (laeufe() > 0 && vp.length && nIdx % 2 === 1) {
      const s = document.createElement('span'); s.className = 'klar'; s.textContent = vp[hIdx % vp.length][5]; hIdx++;
      was.appendChild(s); setTimeout(() => s.classList.add('zu'), 1700);
    } else m.forEach(w => { const b = document.createElement('i'); b.style.width = w + 'px'; was.appendChild(b); });
    stapel.appendChild(k);
    kopf.classList.add('an'); zaehlerText();
    const karten = stapel.querySelectorAll('.nk');
    for (let j = 0; j < karten.length; j++) {
      const alter = karten.length - 1 - j;
      karten[j].classList.toggle('alt1', alter === 1); karten[j].classList.toggle('alt2', alter === 2);
      if (alter >= 3 && !karten[j].classList.contains('weg')) { karten[j].classList.add('weg'); const x = karten[j]; setTimeout(() => x.remove(), 900); }
    }
    ton('bzzz');
    // V8.6: Lampe flackert nur noch bei jeder dritten Nachricht, weich
    if (!reduziert) { bw.classList.remove('flack'); void bw.offsetWidth; bw.classList.add('flack'); }
    sichern();
  }
  function nachrichtenStart(verz) { nachrichtenStopp(); nStart = setTimeout(() => { neu(); nTimer = setInterval(neu, 3600); }, verz); }
  function nachrichtenStopp() { clearTimeout(nStart); clearInterval(nTimer); nStart = nTimer = null; }
  function uhrzeitSetzen() { const j = new Date(), hm = ('0' + j.getHours()).slice(-2) + ':' + ('0' + j.getMinutes()).slice(-2); bw.querySelectorAll('#z-menue .zeit').forEach(z => z.textContent = hm); }

  // ---------------- Zustände ----------------
  let akt = null, tippAb = 0, laeuft = false, ersterTipp = true, weiterWarter = null;
  function zeige(id) {
    akt = id;
    bw.querySelectorAll('.schirm2').forEach(s => s.classList.toggle('an', s.id === 'z-' + id));
    const tipp = (id === 's-ende' || id === 's-wusst');
    bw.classList.toggle('tippbar', tipp);
    if (tipp) tippAb = Date.now() + 500;
  }
  function blitz() { if (reduziert) return; const b = $('blitz'); b.classList.remove('an'); void b.offsetWidth; b.classList.add('an'); }
  function zeigen() {
    bw.classList.remove('weg'); bw.classList.add('an');
    if (!aktiv) { aktiv = true; feuer.an(); clearTimeout(vorbeiT); if (!reduziert) vorbeiT = setTimeout(vorbei, 6000); }
  }
  function weg() {
    planStopp(); nachrichtenStopp(); handyStopp(); clearTimeout(vorbeiT);
    aktiv = false; bw.classList.remove('an', 'weg'); laeuft = false; fern.stopp(700);
  }
  function besuch() {
    const l = Math.min(laeufe(), 3);
    bw.style.setProperty('--lebhaft', l);
    feuerRate = .025 * (1 + .6 * l);
    $('hinweis').textContent = laeufe() === 0 ? T('start_hinweis', 'Kopfhörer, Ton an, Querformat') : laeufe() === 1 ? 'Die Party läuft noch.' : 'Immer noch.';
    $('enden').textContent = T('menue_enden', 'Enden gefunden: {n} von 3').replace('{n}', S().enden.length);
  }
  function startZeigen(nachWeg) {
    planStopp(); handyStopp(); zeigen();
    bw.classList.remove('ende-an', 'licht-aus', 'menue-an', 'sammlung', 'sog');
    bw.style.setProperty('--sog', 0);
    zeige(null);
    $('toenung').style.background = 'none'; handySetzen(null);
    sp.classList.remove('gelesen');
    bzzzZaehler = 0; besuch(); uhrzeitSetzen();
    if (nachWeg && laeufe() > 0) { S().nachr = (S().nachr || 0) + 6 + Math.floor(Math.random() * 7); zaehlerText(); kopf.classList.add('an'); sichern(); }
    if (window.Ton) Ton.outroAus();   // V8.9: auch beim Zurückkommen ins Menü nach dem Ende (Endmusik lief doppelt mit)
    ton('party_fern');   // beim allerersten Laden: Autoplay-Versuch (Browser blockt evtl. bis zum ersten Tippen)
    bw.classList.remove('anlauf'); void bw.offsetWidth; bw.classList.add('anlauf');
    bw.classList.add('tippbar'); tippAb = Date.now() + 500;
    nachrichtenStart(nachWeg ? 1500 : 2400);
  }
  async function zumMenue() {
    if (bw.classList.contains('menue-an')) return;
    if (ersterTipp) { ersterTipp = false; ton('party_fern'); if (api.ersterTipp) await api.ersterTipp(); }
    bw.classList.add('menue-an'); bw.classList.remove('tippbar');
    blitz();
    const en = $('enden'); en.textContent = T('menue_enden', 'Enden gefunden: {n} von 3').replace('{n}', S().enden.length);
    en.classList.remove('neu');
    if (S().enden.length > (S().endenGezeigt || 0)) { void en.offsetWidth; en.classList.add('neu'); S().endenGezeigt = S().enden.length; sichern(); }
  }

  // ---------------- Handy auf dem Tisch ----------------
  let hTimer = null;
  function handySetzen(ende) {
    const h = $('handy'), g = $('handyglow'); handyStopp();
    h.setAttribute('class', ''); g.className = '';
    if (!ende) return;
    const z = HANDY[ende]; h.classList.add('h-' + z); g.classList.add('g-' + z);
    if (z === 'oben' && !reduziert) hTimer = setTimeout(function los() { aufleuchten(false); hTimer = setTimeout(los, 6500 + Math.random() * 3500); }, 2600);
  }
  function aufleuchten(mitTon) {
    const h = $('handy'), g = $('handyglow');
    h.classList.remove('blip'); g.classList.remove('blip'); void h.offsetWidth; h.classList.add('blip'); g.classList.add('blip');
    if (mitTon && window.Ton && Ton.bereit) Ton.spiele('bzzz', { vol: .35 });
  }
  function handyStopp() { clearTimeout(hTimer); hTimer = null; }

  // ---------------- Ende-Karte ----------------
  function endeVorbereiten(n) {
    nachrichtenStopp();
    bw.classList.remove('menue-an', 'licht-aus', 'sammlung', 'sog'); bw.style.setProperty('--sog', 0);
    bw.classList.add('ende-an');
    $('toenung').style.background = TOENUNG[n] || 'none';
    handySetzen(n);
  }
  function endeKarte(n, verz) {
    endeVorbereiten(n);
    const s = stil(n), med = $('e-med');
    med.style.setProperty('--c1', s[2]); med.style.setProperty('--c2', s[3]); med.querySelector('span').textContent = s[1];
    med.style.setProperty('--verz', (verz || .3) + 's');
    $('e-nr').textContent = T('ende_nr', 'Ende {x} von 3').replace('{x}', ENDEN.indexOf(n) + 1);
    $('e-name').textContent = n;
    $('e-satz').textContent = s[4].replace('Ende: ', '');
    if (api && api.variante === 'lynn') { $('e-satz').textContent = 'Das Handy liegt umgedreht auf dem Tisch.';   /* V8.9: Titel heißt jetzt selbst „Montagabend“ */ $('toenung').style.background = 'radial-gradient(ellipse 900px 600px at 900px 740px,rgba(255,140,170,.22),transparent 70%)'; }
    zeige(null); void bw.offsetWidth;
    zeige('s-ende');
  }

  // ---------------- Abzeichen ----------------
  let letzter = null;
  // Bilanz Zeile für Zeile auf Schwarz, dann „Weiter“
  // V9.1 (Patrick 26.11., F): erst der Handy-Satz allein (blendet aus), dann „Du hast verpasst:“ eins nach dem anderen, Lynn mit längerer Pause, dann Enden/Entscheidungen
  function bilanzZeigen() {
    const bil = $('bilanz'), knopf = $('k-bweiter'); bil.classList.add('da'); knopf.classList.remove('da');
    zeige('s-bilanz'); bw.classList.add('bilanz-an');
    const ph = $('p-handy'), pv = $('p-verpasst'), rest = [$('p-enden'), $('p-entsch')].filter(x => x && x.innerHTML.trim());
    [ph, pv, ...rest].forEach(x => { if (x) { x.style.display = 'none'; x.classList.remove('aus'); } });
    let u = reduziert ? 0 : 1000; const z = ms => reduziert ? 0 : ms;
    if (ph && ph.innerHTML.trim()) {
      const h2 = ph.querySelector('.h2');
      plan(() => { ph.style.display = ''; void ph.offsetWidth; ph.classList.add('da'); }, u);
      if (h2) { plan(() => h2.classList.add('da'), u + z(2600)); u += z(6200); } else u += z(4000);
      plan(() => ph.classList.add('aus'), u); u += z(1400); plan(() => { ph.style.display = 'none'; }, u); u += z(400);
    }
    const vp = verpasstLauf;
    if (vp && pv) {
      plan(() => { pv.style.display = ''; pv.classList.add('da'); }, u); const sp = [...pv.querySelectorAll('.vk, .vp')];
      sp.forEach(x => { plan(() => x.classList.add('da'), u); u += z(1500); });
      if (vp.lynn) { u += z(2600); plan(() => pv.insertAdjacentHTML('beforeend', '<span class="vl">… und <b>' + vp.tx('lynn') + '</b>.</span>'), u); plan(() => { const l = pv.querySelector('.vl'); if (l) l.classList.add('da'); }, u + 60); u += z(3000); }
      u += z(600);
    }
    rest.forEach(x => { plan(() => { x.style.display = ''; void x.offsetWidth; x.classList.add('da'); }, u); u += z(1600); });
    plan(() => knopf.classList.add('da'), u + z(600));
    return new Promise(r => { knopf.onclick = ev => { ev.stopPropagation(); bw.classList.remove('bilanz-an'); [ph, pv, ...rest].forEach(x => { if (x) x.style.display = ''; }); r(); }; });
  }
  function abzeichen(modus, nurText) {
    if (nurText) { const pl = plaene; plaene = []; abzeichen(modus); plaene.forEach(clearTimeout); plaene = pl; return; }
    const sek = $('s-abz'); sek.classList.toggle('sammlung', modus === 'sammlung');
    $('a-titel').textContent = T('menue_abzeichen', 'Abzeichen');
    const r = $('raster'); r.innerHTML = '';
    const alle = ABZ(), hat = S().abz, neuDa = (modus === 'lauf' && letzter) ? letzter.neu.filter(n => alle.some(a => a[0] === n)) : [];
    const basis = hat.filter(n => alle.some(a => a[0] === n)).length - neuDa.length, z = $('zaehler');
    z.textContent = basis + ' von ' + alle.length; z.classList.remove('hoch');
    const normal = [], frische = [], zu = [];
    alle.forEach(a => {
      const erhalten = hat.includes(a[0]), frisch = neuDa.includes(a[0]);
      const k = document.createElement('div'); k.className = 'ab' + (erhalten ? '' : ' zu') + (frisch ? ' frisch' : '');
      const m = document.createElement('div'); m.className = 'medaille';
      if (erhalten) { m.style.setProperty('--c1', a[2]); m.style.setProperty('--c2', a[3]); }
      m.innerHTML = '<span></span>'; m.firstChild.textContent = erhalten ? a[1] : '?';
      const tx = document.createElement('div'); tx.className = 'tx';
      const n = document.createElement('div'); n.className = 'n'; n.textContent = a[0];
      const w = document.createElement('div'); w.className = 'w';
      if (erhalten) w.textContent = a[4];
      else { n.className = 'n verdeckt'; n.setAttribute('aria-hidden', 'true'); w.className = 'w hinweis'; w.textContent = a[5]; }
      tx.appendChild(n); tx.appendChild(w); k.appendChild(m); k.appendChild(tx);
      if (frisch) { const b = document.createElement('span'); b.className = 'neu'; b.textContent = 'NEU'; k.appendChild(b); frische.push(k); }
      else normal.push(k);
      if (!erhalten) zu.push(k);
      r.appendChild(k);
    });
    const bil = $('bilanz'); bil.classList.remove('da');
    // Patrick 25.11.: nach dem Spiel steht die Bilanz auf einem eigenen schwarzen Schirm (Zeile für Zeile), der Abzeichen-Schirm bleibt leer davon
    const lauf = modus === 'lauf';
    if (lauf) $('s-bilanz').insertBefore(bil, $('k-bweiter')); else $('s-abz').insertBefore(bil, $('s-abz').querySelector('.knopfreihe'));
    bil.classList.toggle('zeilen', lauf); [...bil.querySelectorAll('p')].forEach(x => x.classList.remove('da'));
    const offen = 3 - S().enden.length;
    if (modus === 'sammlung' && laeufe() === 0) {
      $('p-enden').innerHTML = 'Noch nichts gespielt.';
      $('p-entsch').innerHTML = 'Also auch noch nichts verpasst. Noch.';
      { const ph = $('p-handy'); if (ph) ph.innerHTML = ''; const pv = $('p-verpasst'); if (pv) pv.innerHTML = ''; }
    } else {
      $('p-enden').innerHTML = offen > 0 ? T('enden_verpasst', 'Du hast {n} von 3 Enden verpasst. Schade.').replace('{n} von 3 Enden', '<b>{n} von 3 Enden</b>').replace('{n}', offen) : 'Du hast alle Enden gesehen. Und trotzdem.';
      const [nie, gesamt] = api.entscheidungen();
      $('p-entsch').innerHTML = T('entscheidungen', 'Du hast {x} von {y} Entscheidungen nie getroffen.').replace('{x} von {y} Entscheidungen', '<b>{x} von {y} Entscheidungen</b>').replace('{x}', nie).replace('{y}', gesamt);
      // V8.4: wie oft man von sich aus aufs Handy geschaut hat
      const bl = api.blick ? api.blick() : null, ph = $('p-handy');
      // C31 (Patrick 26.11.): wer nie gedrückt hat – erster Satz, Pause, dann „Geschaut hat er trotzdem.“
      if (ph) ph.innerHTML = !bl || modus !== 'lauf' ? '' : bl.zahl === 0 ? '<span class="h1">' + T('bilanz_handy0', 'Du hast den Handy-Knopf kein einziges Mal gedrückt.') + '</span><br><span class="h2">' + T('bilanz_handy0b', 'Geschaut hat er trotzdem.') + '</span>'
        : T('bilanz_handy', 'Du hast <b>{n}-mal</b> von dir aus aufs Handy geschaut. {m}-mal, obwohl nichts Neues da war.').replace('{n}', bl.zahl).replace('{m}', bl.leer);
      // V8.9 (Patrick 24.11.): Verpasst-Liste wie Schlagzeilen, eine nach der anderen; dann verschwindet alles, nur „… und Lynn.“ bleibt
      const vl = api.verpasst && modus === 'lauf' ? api.verpasst() : [], pv = $('p-verpasst');
      if (pv) { pv.innerHTML = ''; pv.classList.remove('weg'); }
      if (pv && vl.length) {
        const VT = { geburtstag: 'Lenas Party des Jahres', lied: 'Lena heult bei Happy Birthday', feuerloescher: 'Die Feuerlöscher-Eskalation', mia: 'Mias Crashout auf der Tanzfläche', tim: 'Tims Absturz auf Lenas Teppich', afterparty: 'Tims Afterparty bis 3 Uhr', lynn: 'Lynn' };
        const tx = k => T('verpasst_' + k, VT[k]);
        const lynn = vl.includes('lynn'), rest = vl.filter(k => k !== 'lynn');
        pv.innerHTML = '<span class="vk">' + T('verpasst_liste', 'Du hast verpasst:') + '</span> ' + rest.map((k, i) => '<span class="vp">' + (i ? '<i class="trenn"> · </i>' : '') + '<b>' + tx(k) + '</b></span>').join('');
        verpasstPlan = { pv, lynn, tx };
      } else verpasstPlan = null;
    }
    $('k-nochmal').textContent = T('nochmal_knopf', 'Nochmal');
    $('k-beenden').textContent = T('beenden', 'Beenden');
    const schritt = reduziert ? 0 : 45; let t = 150;
    normal.forEach((k, i) => plan(() => k.classList.add('da'), t + i * schritt));
    t += normal.length * schritt + (frische.length && !reduziert ? 450 : 0);
    frische.forEach((k, j) => plan(() => {
      k.classList.add('da'); ton('abzeichen');
      z.textContent = (basis + j + 1) + ' von ' + alle.length;
      if (!reduziert) { z.classList.remove('hoch'); void z.offsetWidth; z.classList.add('hoch'); }
    }, t + j * (reduziert ? 0 : 720)));
    t += frische.length * (reduziert ? 0 : 720) + (reduziert ? 0 : 250);
    if (lauf) { verpasstLauf = verpasstPlan; verpasstPlan = null; }
    else plan(() => bil.classList.add('da'), t);
    if (verpasstPlan) { const { pv, lynn, tx } = verpasstPlan; const sp = [...pv.querySelectorAll('.vp')];
      if (reduziert) { sp.forEach(x => x.classList.add('da')); if (lynn) pv.insertAdjacentHTML('beforeend', ' <span class="vp da">… und <b>' + tx('lynn') + '</b>.</span>'); }
      else {
        let u = t + 700; sp.forEach((x, i) => plan(() => x.classList.add('da'), u + i * 450)); u += sp.length * 450 + 1800;
        if (lynn) { plan(() => pv.classList.add('weg'), u); plan(() => { pv.classList.remove('weg'); pv.innerHTML = '<span class="vl">… und <b>' + tx('lynn') + '</b>.</span>'; void pv.offsetWidth; pv.querySelector('.vl').classList.add('da'); }, u + 1500); }
      } }
    if (!reduziert && laeufe() > 0) zu.forEach((k, j) => plan(() => { k.classList.add('blick'); plan(() => k.classList.remove('blick'), 520); }, t + 500 + j * 190));
  }

  // ---------------- Beenden in drei Stufen: „Nein“ wird größer, „Ja“ kleiner ----------------
  function beenden(stufe) {
    const offen = 3 - S().enden.length;
    if (stufe === 3) {
      $('gl-text').textContent = T('beenden_3', 'Glaub mir.');
      zeige('s-glaub');
      if (window.Ton) Ton.outroAus();
      plan(() => {
        bw.classList.add('licht-aus'); ton('lichtschalter'); handyStopp();
        plan(() => ton('party_fern'), 900);
        if (!reduziert) plan(function los() { aufleuchten(true); plan(los, 14000 + Math.random() * 6000); }, 5200);
        // V8.6 (Philip): danach zurück ins Hauptmenü (eine Webseite kann sich nicht selbst schließen)
        plan(insMenueNachEnde, 9500);
      }, 1600);
      return;
    }
    const f = $('b-frage'), ja = $('b-ja'), nein = $('b-nein');
    // V8.8 (G45): wer das Lynn-Ende schon hatte, wird nicht mehr nach Lynn gefragt
    const lynnGesehen = (S().abz || []).includes('Montagabend');
    const zweit = lynnGesehen ? (offen > 1 ? T('beenden_2', 'Ganz sicher? Da waren noch {n} Enden. Und Lynn.').replace('{n}', offen).replace(/\s*Und Lynn\.?$/, '') : offen === 1 ? 'Ganz sicher? Da war noch ein Ende.' : 'Ganz sicher?')
      : offen > 1 ? T('beenden_2', 'Ganz sicher? Da waren noch {n} Enden. Und Lynn.').replace('{n}', offen) : offen === 1 ? 'Ganz sicher? Da war noch ein Ende. Und Lynn.' : 'Ganz sicher? Alle Enden, okay. Aber Lynn?';
    f.textContent = stufe === 1 ? T('beenden_1', 'Sicher, dass du nichts verpasst hast?') : zweit;
    nein.textContent = stufe === 1 ? T('beenden_1_nein', 'Nein, nochmal') : T('beenden_2_nein', 'Okay, nochmal');
    ja.textContent = stufe === 1 ? T('beenden_1_ja', 'Ja … glaub schon') : T('beenden_2_ja', 'Ja. Ich hoff’s.');
    const k = stufe === 1 ? 1 : 1.3;
    zeige('s-beenden');
    nein.style.transform = 'scale(' + k + ')'; nein.style.transformOrigin = 'left bottom'; nein.style.marginRight = Math.round((k - 1) * nein.offsetWidth) + 'px';
    ja.style.transform = 'scale(' + (2 - k) + ')'; ja.style.transformOrigin = 'left bottom'; ja.style.opacity = stufe === 1 ? '.9' : '.55';
    ja.onclick = () => beenden(stufe + 1); nein.onclick = nochmal;
  }
  function insMenueNachEnde() { if (akt !== 's-glaub') return; startZeigen(false); zumMenue(); }
  function nochmal() {
    $('w-text').textContent = T('nochmal', 'Wusst ich’s doch.');
    zeige('s-wusst'); plan(() => { if (akt === 's-wusst') startZeigen(true); }, 2600);
  }

  // ---------------- Eingaben ----------------
  bw.addEventListener('click', ev => {
    ev.stopPropagation();
    if (ev.target.closest('button')) return;
    if (laeuft || Date.now() < tippAb) return;
    if (!bw.classList.contains('ende-an')) { if (!bw.classList.contains('menue-an')) zumMenue(); return; }
    if (akt === 's-ende' && weiterWarter) { const w = weiterWarter; weiterWarter = null; w(); }
    else if (akt === 's-wusst') startZeigen(true);
    else if (akt === 's-glaub' && bw.classList.contains('licht-aus')) { planStopp(); insMenueNachEnde(); }
  });
  $('k-weiter').addEventListener('click', ev => { ev.stopPropagation(); if (weiterWarter) { const w = weiterWarter; weiterWarter = null; w(); } });
  sp.addEventListener('click', ev => {
    ev.stopPropagation();
    if (laeuft) return; laeuft = true;
    sp.classList.add('gelesen'); sp.blur(); sog(false);
    plan(() => bw.classList.add('weg'), 260);
    plan(() => { weg(); api.spielen(); }, 1000);
  });
  bw.querySelector('#z-menue [data-t="Abzeichen"]').addEventListener('click', ev => {
    ev.stopPropagation(); nachrichtenStopp(); bw.classList.add('ende-an', 'sammlung');
    $('toenung').style.background = 'none'; handySetzen(null);
    abzeichen('sammlung'); zeige('s-abz');
  });
  bw.querySelector('#z-menue [data-t="Mitwirkende"]').addEventListener('click', ev => {
    ev.stopPropagation(); nachrichtenStopp(); bw.classList.add('ende-an', 'sammlung');
    $('toenung').style.background = 'none'; handySetzen(null);
    $('c-titel').textContent = T('menue_credits', 'Mitwirkende');
    $('c-text').innerHTML = (T('credits', '')).split(' // ').join('<br>');
    zeige('s-credits');
  });
  const zurueckInsMenue = ev => { ev.stopPropagation(); planStopp(); zeige(null); bw.classList.remove('ende-an', 'sammlung'); nachrichtenStart(1200); };
  $('k-zurueck').addEventListener('click', zurueckInsMenue);
  $('c-zurueck').addEventListener('click', zurueckInsMenue);
  $('k-nochmal').addEventListener('click', ev => { ev.stopPropagation(); nochmal(); });
  $('k-beenden').addEventListener('click', ev => { ev.stopPropagation(); planStopp(); beenden(1); });
  addEventListener('keydown', ev => {
    if (!bw.classList.contains('an') || (ev.key !== 'Enter' && ev.key !== ' ')) return;
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') return;
    if (laeuft) return;
    if (!bw.classList.contains('ende-an')) { if (!bw.classList.contains('menue-an')) { ev.preventDefault(); zumMenue(); } return; }
    if (akt === 's-ende' && weiterWarter) { ev.preventDefault(); const w = weiterWarter; weiterWarter = null; w(); }
    else if (akt === 's-wusst') { ev.preventDefault(); startZeigen(true); }
  });

  return {
    init(a) {
      api = a;
      bw.querySelectorAll('#z-menue .bl').forEach(b => {
        const k = { Spielen: 'menue_spielen', Abzeichen: 'menue_abzeichen', Mitwirkende: 'menue_credits' }[b.dataset.t];
        b.querySelector('.mt').textContent = T(k, b.dataset.t);
      });
      $('tippen').textContent = T('start_tippen', 'Tippen zum Starten');
      $('iosnote').textContent = [a.iosHinweis, 'Tipp: Dunkelmodus für Webseiten ausschalten.'].filter(Boolean).join(' ');
      zaehlerText();
    },
    start: startZeigen,
    weg,
    get sichtbar() { return bw.classList.contains('an'); },
    // Spielende: Endkarte → (Testmodus: Stoppuhr) → Gefühlsfrage → Abzeichen mit Nochmal/Beenden
    variante: '',
    async ende(name, neu, nachKarte) {
      planStopp(); zeigen(); laeuft = false; if (api) api.variante = this.variante;
      S().laeufe = laeufe() + 1; sichern();
      letzter = { ende: name, neu: neu || [] };
      bzzzZaehler = 0; besuch();
      // V9.1 (Patrick 26.11., F): direkt nach dem Titel die Bilanz auf Schwarz, dann die Gefühlsfrage, dann Endkarte und Abzeichen
      abzeichen('lauf', true);
      endeVorbereiten(name);   // Menü weg, sonst scheint es hinter der Gefühlsfrage durch
      await bilanzZeigen();
      $('g-frage').textContent = T('gefuehl_frage', 'Wie hast du dich gerade gefühlt?');
      const liste = $('g-liste'); liste.innerHTML = '';
      const gAntwort = await new Promise(r => [1, 2, 3].forEach(i => { const b = document.createElement('button'); b.className = 'knopf'; b.type = 'button'; const txt = T('gefuehl_' + i, '[Antwort ' + i + ' – offen]'); b.textContent = txt; b.onclick = ev => { ev.stopPropagation(); r({ i, txt }); }; liste.appendChild(b); }) || zeige('s-gefuehl'));
      if (gAntwort) { S().gefuehle = S().gefuehle || []; S().gefuehle.push({ ende: name, nr: gAntwort.i, text: gAntwort.txt, t: new Date().toISOString() }); sichern(); if (window.Protokoll) try { Protokoll.log('gefuehl', name + ': ' + gAntwort.txt); } catch (e) { } }
      endeKarte(name, .9);
      await new Promise(r => weiterWarter = r);
      if (nachKarte) { zeige(null); await nachKarte(); }
      abzeichen('lauf'); zeige('s-abz');
    },
  };
})();

