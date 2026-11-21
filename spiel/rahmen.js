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
  const ENDEN = ['Leiser', 'Hier oder da', 'Blaues Licht'];
  const TOENUNG = {
    'Leiser': 'radial-gradient(ellipse 700px 500px at 800px 760px,rgba(90,110,220,.18),transparent 70%)',
    'Hier oder da': 'radial-gradient(ellipse 700px 500px at 800px 760px,rgba(240,160,64,.14),transparent 70%)',
    'Blaues Licht': 'radial-gradient(ellipse 900px 600px at 900px 740px,rgba(54,180,255,.28),transparent 70%)'
  };
  // Handy auf dem Tisch je Ende: umgedreht / meldet sich ab und zu / Display dauerhaft an
  const HANDY = { 'Leiser': 'unten', 'Hier oder da': 'oben', 'Blaues Licht': 'hell' };
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
  function plan(fn, ms) { const id = setTimeout(fn, ms); plaene.push(id); return id; }
  function planStopp() { plaene.forEach(clearTimeout); plaene = []; }

  // ---------------- Draußen ----------------
  const farben = ['#ff9a3c', '#ff4fa3', '#ffd27a', '#9a5cff', '#3cf0ff', '#7dff8a', '#ff6a3c', '#ffe14d'];
  let aktiv = false, feuerRate = .025, vorbeiT = null;
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
  const fern = (() => {
    let el = null, soll = false, fadeT = null;
    const mach = () => { if (!el) { el = new Audio('ton/muffled_party_start.mp3'); el.loop = true; el.preload = 'auto'; el.setAttribute('playsinline', ''); } return el; };
    function blende(ziel, ms, fertig) {
      clearInterval(fadeT); const e = mach(), v0 = e.volume, t0 = performance.now();
      fadeT = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); try { e.volume = v0 + (ziel - v0) * k; } catch (x) { } if (k >= 1) { clearInterval(fadeT); fertig && fertig(); } }, 40);
    }
    return {
      vorladen() { try { mach().load(); } catch (e) { } },
      start() {
        const e = mach(); soll = true;
        if (!e.paused) { blende(1, 600); return; }
        try { e.volume = 0; } catch (x) { }
        const p = e.play(); if (p && p.catch) p.catch(() => { });
        blende(1, 900);
      },
      stopp(ms = 900) { soll = false; if (!el || el.paused) return; blende(0, ms, () => { if (!soll) el.pause(); }); },
      get laeuft() { return !!el && !el.paused; },
    };
  })();
  fern.vorladen();
  // Erstes Berühren irgendwo (auch vor dem eigentlichen Klick): Musik sofort an, solange Start/Menü zu sehen sind
  const erstesBeruehren = () => {
    if (!bw.classList.contains('an') || bw.classList.contains('ende-an')) return;
    if (!fern.laeuft) fern.start();
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
    $('hinweis').textContent = laeufe() === 0 ? T('start_hinweis', 'Kopfhörer, Ton an, Querformat') : laeufe() === 1 ? 'Draußen läuft’s noch.' : 'Immer noch.';
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
    if (nachWeg && window.Ton) Ton.outroAus();
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
    if (api && api.variante === 'lynn') { $('e-satz').textContent = 'Montagabend. Das Handy liegt umgedreht auf dem Tisch.'; $('toenung').style.background = 'radial-gradient(ellipse 900px 600px at 900px 740px,rgba(255,140,170,.22),transparent 70%)'; }
    zeige(null); void bw.offsetWidth;
    zeige('s-ende');
  }

  // ---------------- Abzeichen ----------------
  let letzter = null;
  function abzeichen(modus) {
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
    const offen = 3 - S().enden.length;
    if (modus === 'sammlung' && laeufe() === 0) {
      $('p-enden').innerHTML = 'Noch nichts gespielt.';
      $('p-entsch').innerHTML = 'Also auch noch nichts verpasst. Noch.';
    } else {
      $('p-enden').innerHTML = offen > 0 ? T('enden_verpasst', 'Du hast {n} von 3 Enden verpasst. Schade.').replace('{n} von 3 Enden', '<b>{n} von 3 Enden</b>').replace('{n}', offen) : 'Du hast alle Enden gesehen. Und trotzdem.';
      const [nie, gesamt] = api.entscheidungen();
      $('p-entsch').innerHTML = T('entscheidungen', 'Du hast {x} von {y} Entscheidungen nie getroffen.').replace('{x} von {y} Entscheidungen', '<b>{x} von {y} Entscheidungen</b>').replace('{x}', nie).replace('{y}', gesamt);
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
    plan(() => bil.classList.add('da'), t);
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
      }, 1600);
      return;
    }
    const f = $('b-frage'), ja = $('b-ja'), nein = $('b-nein');
    const zweit = offen > 1 ? T('beenden_2', 'Ganz sicher? Da waren noch {n} Enden. Und Lynn.').replace('{n}', offen) : offen === 1 ? 'Ganz sicher? Da war noch ein Ende. Und Lynn.' : 'Ganz sicher? Alle Enden, okay. Aber Lynn?';
    f.textContent = stufe === 1 ? T('beenden_1', 'Sicher, dass du nichts verpasst hast?') : zweit;
    nein.textContent = stufe === 1 ? T('beenden_1_nein', 'Nein, nochmal') : T('beenden_2_nein', 'Okay, nochmal');
    ja.textContent = stufe === 1 ? T('beenden_1_ja', 'Ja … glaub schon') : T('beenden_2_ja', 'Ja. Ich hoff’s.');
    const k = stufe === 1 ? 1 : 1.3;
    zeige('s-beenden');
    nein.style.transform = 'scale(' + k + ')'; nein.style.transformOrigin = 'left bottom'; nein.style.marginRight = Math.round((k - 1) * nein.offsetWidth) + 'px';
    ja.style.transform = 'scale(' + (2 - k) + ')'; ja.style.transformOrigin = 'left bottom'; ja.style.opacity = stufe === 1 ? '.9' : '.55';
    ja.onclick = () => beenden(stufe + 1); nein.onclick = nochmal;
  }
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
      $('iosnote').textContent = a.iosHinweis || '';
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
      endeKarte(name, .9);
      await new Promise(r => weiterWarter = r);
      if (nachKarte) { zeige(null); await nachKarte(); }
      $('g-frage').textContent = T('gefuehl_frage', 'Wie hast du dich gerade gefühlt?');
      const liste = $('g-liste'); liste.innerHTML = '';
      await new Promise(r => [1, 2, 3].forEach(i => { const b = document.createElement('button'); b.className = 'knopf'; b.type = 'button'; b.textContent = T('gefuehl_' + i, '[Antwort ' + i + ' – offen]'); b.onclick = ev => { ev.stopPropagation(); r(i); }; liste.appendChild(b); }) || zeige('s-gefuehl'));
      abzeichen('lauf'); zeige('s-abz');
    },
  };
})();
