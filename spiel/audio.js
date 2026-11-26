// =====================================================================
//   TON – echte Aufnahmen aus der Liste TOENE. Fehlt eine Datei, bleibt
//   es still. Synthetisch sind nur noch: Lampensummen, Tinnitus, Rauschen.
// =====================================================================
const Ton = (() => {
  let ctx = null, master, sfx, musikBus, musikFilter, musikGain, loopsBus;
  const P = {};           // Name -> AudioBuffer
  const R = {};           // rückwärts
  const loops = {}, loopGain = {};
  let musik = null, liedNode = null, introNode = null, outroNode = null, gesperrt = false, outroNr = 0;

  let analyser = null, fftDaten = null, pegelSchnitt = 0; const gemerkt = {}; let introSoll = false;
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    // iPhone: ohne das schweigt Web Audio, wenn der Stumm-Schalter an ist (Safari 16.4+)
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.connect(master);
    loopsBus = ctx.createGain(); loopsBus.connect(master);
    musikFilter = ctx.createBiquadFilter(); musikFilter.type = 'lowpass'; musikFilter.frequency.value = 18000;
    musikGain = ctx.createGain(); musikGain.gain.value = 0;
    musikBus = ctx.createGain(); musikBus.connect(musikFilter); musikFilter.connect(musikGain); musikGain.connect(master);
    analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = .55; musikGain.connect(analyser); fftDaten = new Uint8Array(analyser.frequencyBinCount);
    // kurze Töne zuerst, Musik danach
    const MUSIK = /^M\d|^mia$|Outro|lofi|lernflow|restaurant|club2|ende_warm|tippen_laptop|lied/;
    const namen = Object.keys(TOENE).filter(k => eintrag(k).datei).sort((a, b) => (b === 'muffled_party') - (a === 'muffled_party') || MUSIK.test(a) - MUSIK.test(b));
    // V8.8 (G47): nicht alle ~45 Dateien gleichzeitig – Warteschlange mit 3 gleichzeitig
    let i = 0; const naechste = () => { if (i >= namen.length) return; lade(namen[i++]).then(naechste); };
    for (let k = 0; k < 3; k++) naechste();
    // V8.8 (G67): App-Wechsel/Bildschirmsperre – Ton anhalten und danach weiter
    document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend().catch(() => { }); else ctx.resume().catch(() => { }); });
  }
  function eintrag(k) { const e = TOENE[k]; return typeof e === 'string' ? { datei: e } : (e || {}); }
  const ladend = {};
  function lade(k) {
    if (ladend[k]) return ladend[k];
    return ladend[k] = fetch(eintrag(k).datei).then(r => r.arrayBuffer()).then(b => new Promise((ok, f) => ctx.decodeAudioData(b, ok, f))).then(buf => { P[k] = buf; return buf; }).catch(() => null);
  }
  const now = () => ctx.currentTime;
  function quelle(k, ziel, o = {}) {
    let b = o.rueckwaerts ? rueck(k) : P[k]; if (!b) return null;
    const s = ctx.createBufferSource(); s.buffer = b; s.loop = !!o.loop;
    if (o.rate) s.playbackRate.value = o.rate;
    const g = ctx.createGain(); g.gain.value = (eintrag(k).vol || 1) * (o.vol == null ? 1 : o.vol) * (o.leise ? .4 : 1);
    let kette = s;
    if (o.dumpf || o.lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp || 420; f.Q.value = .7; kette.connect(f); kette = f; if (o.dumpf) g.gain.value *= .7; }
    kette.connect(g); g.connect(ziel || sfx);
    const ab = o.ab || 0, dauer = o.dauer;
    if (o.einblenden) { g.gain.setValueAtTime(0, now()); g.gain.linearRampToValueAtTime((eintrag(k).vol || 1) * (o.vol == null ? 1 : o.vol), now() + o.einblenden); }
    s.start(0, ab, dauer); if (dauer) { g.gain.setValueAtTime(g.gain.value, now() + Math.max(0, dauer - .05)); g.gain.linearRampToValueAtTime(0, now() + dauer); }
    const laenge = (dauer || (b.duration - ab)) / (o.rate || 1);
    return { s, g, laenge, stop(weich) { try { if (weich) { g.gain.setTargetAtTime(0, now(), weich / 3); setTimeout(() => { try { s.stop(); } catch (e) { } }, weich * 1000 + 100); } else s.stop(); } catch (e) { } } };
  }
  function rueck(k) {
    if (R[k]) return R[k]; const b = P[k]; if (!b) return null;
    const r = ctx.createBuffer(b.numberOfChannels, b.length, b.sampleRate);
    for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c), z = r.getChannelData(c); for (let i = 0; i < d.length; i++) z[i] = d[d.length - 1 - i]; }
    return R[k] = r;
  }

  // ---------- synthetische Reste ----------
  function synthLampe(g) { const a = ctx.createOscillator(); a.frequency.value = 100; const b = ctx.createOscillator(); b.frequency.value = 50; const gg = ctx.createGain(); gg.gain.value = .01; a.connect(gg); b.connect(gg); gg.connect(g); a.start(); b.start(); return () => { a.stop(); b.stop(); }; }
  function synthRauschen(g) { const n = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = n; s.loop = true; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2500; const gg = ctx.createGain(); gg.gain.value = .015; s.connect(f); f.connect(gg); gg.connect(g); s.start(); return () => s.stop(); }
  // tiefes Motor-Brummen unter der Vibration (wie in Version 1)
  function brumm(ab, dauer, dumpf, laut) {
    const t = now() + ab; const v = (dumpf ? .1 : .2) * (laut == null ? 1 : laut);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .03); g.gain.setValueAtTime(v, t + dauer - .07); g.gain.linearRampToValueAtTime(0, t + dauer);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = dumpf ? 200 : 520;
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 168;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 84; const m = ctx.createGain(); m.gain.value = .7;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 23; const lg = ctx.createGain(); lg.gain.value = v * .35; lfo.connect(lg); lg.connect(g.gain);
    o1.connect(f); o2.connect(m); m.connect(f); f.connect(g); g.connect(sfx);
    [o1, o2, lfo].forEach(o => { o.start(t); o.stop(t + dauer + .05); });
  }
  function tinnitus() { const t = now(); const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.02, t + .5); g.gain.exponentialRampToValueAtTime(.0001, t + 4); g.connect(master); const o = ctx.createOscillator(); o.frequency.value = 7200; o.connect(g); o.start(t); o.stop(t + 4.2); }

  // ---------- Schleifen ----------
  const LOOPS = {
    wind: [['wind', { vol: .55 }]],
    raum_nacht: [['wind', { vol: .16, lp: 600 }]],
    raum_tag: [['raum_tag', { vol: .3, lp: 2200 }]],   // Patrick 25.11.: rauschte zu laut (vorher .6 ohne Filter)
    uhr: [['uhr', { vol: .55 }]],
    herzschlag: [['herzschlag', { vol: .5 }]],   // Gemini-Prüfung 26.11.: −5 dB
    gemurmel: [['gemurmel', { vol: .45, lp: 900 }]],
    regen: [['regen_strasse', { vol: .75, lp: 2600 }]],   // Gemini-Prüfung 26.11.: +6 dB (war kaum hörbar; +10 wäre Rauschen)
    oben: [['M1_party', { vol: .5, lp: 160 }]],
    bass_fern: [['M1_party', { vol: .28, lp: 160 }]],    // V8.9 (Patrick 24.11.): Freitag zu Hause – irgendwo wird gefeiert, kaum hörbar
    bass_leiser: [['M1_party', { vol: .16, lp: 140 }]],   // Gemini-Prüfung 26.11.: beide +5 dB, Tiefpass höher – war auf Laptops stumm   // ab ca. 23:30 noch leiser
    halle: [['halle', { vol: .75 }]],
    schritte: [['schritte_lauf', { vol: .85 }]],   // Schritte während der Kamerafahrt (Weg)
    pruefung: 'pruefung',   // Raumton + Stifte in Schüben (schreiben, Pause, schreiben)
    klingel: [['anruf', { vol: 1 }]],
    party_fern: [['muffled_party', { vol: .9 }]],   // Startbildschirm: Party hinter dem Fenster, gedämpft (Philips Datei)
    seminar: [['tippen_laptop', { vol: 1.2 }], ['gemurmel', { vol: .25, lp: 700 }]],   // Gemini-Prüfung 26.11.: +10 dB   // Rückblende Seminar
    restaurant: [['restaurant_lofi', { vol: .24, lp: 5200 }], ['gemurmel', { vol: .15, lp: 1500 }]],   // Gemini-Prüfung 26.11.: −5 dB (war lauter als die Party)   // Lynn-Ende
    lampe: 'lampe', rauschen: 'rauschen',
  };
  const AUSKLANG = { seminar: .6, restaurant: 1.2, party_fern: 1.2, uhr: .8, herzschlag: .5, halle: .7, wind: .4, gemurmel: .5 };
  let ausklingNr = 0;
  function loop(name, an) {
    if (!ctx) return;
    if (loops[name]) { loops[name](); delete loops[name]; }
    if (!an || gesperrt) return;
    const g = ctx.createGain(); g.connect(loopsBus); g.gain.setValueAtTime(0, now()); g.gain.linearRampToValueAtTime(1, now() + .4);
    const def = LOOPS[name]; if (!def) return;
    loopGain[name] = g;
    let stops = [];
    if (def === 'pruefung') {
      const r = quelle('raum_tag', g, { loop: true, vol: .18, lp: 2200 }); if (r) stops.push(() => r.stop());
      let aktiv = true, q = null, t = null;
      const schub = () => { if (!aktiv) return; const d = .5 + Math.random() * 2.4; q = quelle('PR3_stift', g, { ab: Math.random() * 3.2, dauer: d, vol: .2 + Math.random() * .08 }); t = setTimeout(() => { t = setTimeout(schub, 350 + Math.random() * (Math.random() < .3 ? 3800 : 1400)); }, d * 1000); };
      schub(); stops.push(() => { aktiv = false; clearTimeout(t); try { q && q.stop(); } catch (e) { } });
    }
    else if (def === 'lampe') stops.push(synthLampe(g));
    else if (def === 'rauschen') stops.push(synthRauschen(g));
    else def.forEach(([k, o]) => { const q = quelle(k, g, Object.assign({ loop: true, ab: Math.random() * 3 }, o)); if (q) stops.push(() => q.stop()); else lade(k).then(() => { if (loops[name] && !q) { const q2 = quelle(k, g, Object.assign({ loop: true }, o)); if (q2) stops.push(() => q2.stop()); } }); });
    const tau = AUSKLANG[name] || .15;
    loops[name] = () => { try { g.gain.setTargetAtTime(0, now(), tau); setTimeout(() => { stops.forEach(s => { try { s(); } catch (e) { } }); g.disconnect(); }, tau * 4500 + 200); } catch (e) { } };
  }

  // ---------- Musik ----------
  const STUFEN = {
    laut: [1, 18000], mittel: [.7, 9000], leise: [.45, 2600], sanft: [.45, 14000], dumpf: [.6, 380], tuer: [.55, 650], fern: [.22, 300], telefon: [.3, 1300],
    still: [0, 18000], strasse2: [.32, 420], strasse3: [.48, 650], strasse4: [.7, 1100], aufnahme: [.8, 18000]
  };
  function stelle(art, langsam) {
    const p = STUFEN[art] || STUFEN.laut; const t = now();
    musikGain.gain.cancelScheduledValues(t); musikGain.gain.setTargetAtTime(p[0] * .7, t, langsam ? 1.2 : .25);
    musikFilter.frequency.cancelScheduledValues(t); musikFilter.frequency.setTargetAtTime(p[1], t, .3);
  }
  let miaAb = 21;
  function musikStart(welche) {
    if (musik && musik.art === welche) return;
    musikStopp(true);
    const qs = [];
    if (welche === 'party') { const a = quelle('M1_party', musikBus, { loop: true }); if (a) qs.push(a); [['gemurmel', .62], ['gemurmel2', .3], ['frauen', .34]].forEach(([k, v]) => { const q = quelle(k, musikBus, { loop: true, vol: v, ab: Math.random() * 8 }); if (q) qs.push(q); }); if (!a) lade('M1_party').then(() => { if (musik && musik.art === 'party' && !musik.qs.length) { const q = quelle('M1_party', musikBus, { loop: true }); q && musik.qs.push(q); } }); }
    if (welche === 'spaet') { const a = quelle('tim_party', musikBus, { loop: true, vol: .4 });   // V8.9: neue Musik für Tims Afterparty (11 dB lauter als M3_spaet)
      if (a) qs.push(a); }
    if (welche === 'club') { const a = quelle('party_club2', musikBus, { loop: true, vol: 1 }); if (a) qs.push(a); [['gemurmel', .55], ['frauen', .3]].forEach(([k, v]) => { const q = quelle(k, musikBus, { loop: true, vol: v, ab: Math.random() * 8 }); if (q) qs.push(q); }); }
    if (welche === 'flow') { const a = quelle('lernflow', musikBus, { loop: true, vol: .9, einblenden: 4 }); if (a) qs.push(a); }   // Patrick 26.11.: eigenes Lied für den Lern-Flow
    if (welche === 'lofi') { const a = quelle('lofi_melancholy', musikBus, { loop: true, vol: 1.25, einblenden: 2.5 }); if (a) qs.push(a); }
    if (welche === 'fern') { const a = quelle('party_fern', musikBus, { loop: true }); if (a) qs.push(a); }
    musik = { art: welche, qs };
    if (welche === 'mia') { const a = quelle('mia', musikBus, { ab: miaAb }); if (a) qs.push(a); musik.t0 = now() - miaAb; }
  }
  function musikStopp(sofort) {
    if (!musik) return; const m = musik; musik = null;
    if (sofort) { m.qs.forEach(q => q.stop()); return; }
    m.qs.forEach(q => q.stop(m.art === 'flow' ? 3.5 : 1.2));   // Flow-Lied weicher ausblenden   // V8.8 (G33): jede alte Spur einzeln ausblenden (neue Musik dreht den Bus sonst wieder hoch)
  }
  function lied(modus) {
    liedStopp();
    const lp = modus === 'dumpf' ? 700 : modus === 'telefon' ? 1500 : 0;
    const vol = modus === 'dumpf' ? .55 : modus === 'telefon' ? .3 : 1;
    const q = quelle('lied', master, { lp: lp || undefined, vol, ab: (eintrag('lied').start || 0), einblenden: .4 });
    liedNode = q;
  }
  function liedStopp() { if (liedNode) { liedNode.stop(1.2); liedNode = null; } }

  function vibriere(m) { try { if (m.length && navigator.vibrate) navigator.vibrate(m); } catch (e) { } }

  return {
    init,
    get bereit() { return !!ctx; },
    // V8.5: ist ein Ton schon geladen und dekodiert? (Startbild: Web-Audio-Partymusik übernimmt vom Audio-Element)
    hat(k) { return !!P[k]; },
    get laeuftKontext() { return !!ctx && ctx.state === 'running'; },
    // Bass-Pegel der Partymusik (0..1), für Licht im Takt. Gibt den Ausschlag über dem gleitenden Mittel zurück.
    pegel() {
      if (!analyser) return 0; analyser.getByteFrequencyData(fftDaten);
      let s = 0; for (let i = 1; i < 7; i++) s += fftDaten[i]; s /= (6 * 255);
      pegelSchnitt = pegelSchnitt * .94 + s * .06;
      return Math.max(0, Math.min(1, (s - pegelSchnitt * .92) * 5 + s * .35));
    },
    // spielt einen Ton; gibt die Länge in Sekunden zurück (0, wenn es ihn nicht gibt)
    spiele(name, o = {}) {
      if (!ctx || gesperrt) return 0;
      if (name === 'tinnitus') { if (P.tinnitus) { const q = quelle('tinnitus', master, { vol: .45 }); return q ? q.laenge : 4; } tinnitus(); return 4; }   // V8.8 (G36): Datei (7,4 kHz mit Unterton) statt reinem Sinus
      if (name === 'tipp' && P.tipp) { const i = Math.floor(Math.random() * 8); return (quelle('tipp', sfx, Object.assign({ ab: i * .25, dauer: .09 }, o)) || {}).laenge || 0; }
      const sp = eintrag(name).sprite; if (sp && P[name]) { const [ab, d] = sp[Math.floor(Math.random() * sp.length)]; return (quelle(name, sfx, Object.assign({ ab, dauer: d }, o)) || {}).laenge || 0; }
      if (name === 'bzzz') vibriere(o.dumpf ? [] : [300, 120, 300]);
      const q = quelle(name, o.ziel === 'master' ? master : sfx, o);
      if (q && o.merke) gemerkt[name] = q;
      return q ? q.laenge : 0;
    },
    stoppe(name, weich = .2) { const q = gemerkt[name]; if (q) { q.stop(weich); delete gemerkt[name]; }
    },
    loop,
    // Storycheck 3 (Patrick 24.11.): laufende Schleife weich lauter/leiser (1 = normal), z. B. Regen in der Sonntagspause minimal leiser
    loopLaut(name, v, sek = 1.5) { const g = loopGain[name]; if (!ctx || !g || !loops[name]) return; try { g.gain.cancelScheduledValues(now()); g.gain.setValueAtTime(g.gain.value, now()); g.gain.linearRampToValueAtTime(v, now() + sek); } catch (e) { } },
    musik(art, opt) {
      if (!ctx) return;
      if (art === 'aus') { liedStopp(); return musikStopp(false); }
      if (art === 'lied') { if (opt === 'aus') return liedStopp(); return lied(opt); }
      if (art === 'fern') { musikStart('fern'); stelle('aufnahme'); return; }
      if (art === 'spaet' || art === 'party' || art === 'club' || art === 'lofi' || art === 'flow') { musikStart(art); stelle(opt || 'laut'); return; }
      if (art === 'mia') { if (opt && /^\d/.test(opt)) { miaAb = +opt; if (musik && musik.art === 'mia') this.miaSpring(miaAb); else { musikStart('mia'); } stelle('laut'); } else stelle(opt || 'laut', true); return; }
    },
    musikStufe(art, langsam) { if (ctx) stelle(art, langsam); },
    // Mias Lied: Position im Song und Springen (für die Lichtshow im Takt)
    miaPos() { return musik && musik.art === 'mia' && ctx ? now() - musik.t0 : -1; },
    miaSpring(ab) {
      if (!ctx || !musik || musik.art !== 'mia') return;
      const alt = musik.qs.slice(); const a = quelle('mia', musikBus, { ab, einblenden: .25 });
      if (a) { musik.qs = [a]; musik.t0 = now() - ab; } alt.forEach(q => q.stop(.3));
    },
    crescendo(dauer, ziel = 'laut') {
      if (!ctx) return; const p = STUFEN[ziel] || STUFEN.laut; const t = now();
      musikGain.gain.cancelScheduledValues(t); musikGain.gain.setValueAtTime(musikGain.gain.value, t); musikGain.gain.linearRampToValueAtTime(p[0] * .7, t + dauer);
      musikFilter.frequency.cancelScheduledValues(t); musikFilter.frequency.setValueAtTime(musikFilter.frequency.value, t); musikFilter.frequency.exponentialRampToValueAtTime(p[1], t + dauer);
    },
    stille() { if (!ctx) return; Object.keys(loops).forEach(k => loop(k, false)); musikStopp(true); liedStopp(); musikGain.gain.setValueAtTime(0, now()); },
    sperre(an) { gesperrt = an; if (an && ctx) this.stille(); },
    klangZurueck() { if (!ctx) return; ausklingNr++; const t = now(); [loopsBus, sfx].forEach(b => { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(1, t); }); },
    // V8.9 (Patrick 24.11.): am Ende Raumton, Vögel & Co. langsam ausblenden, bis alles weg ist (Musik bleibt Sache von outro/outroAus)
    ausklingen(sek = 5) {
      if (!ctx) return; const t = now(); const nr = ++ausklingNr;
      [loopsBus, sfx].forEach(b => { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0.0001, t + sek); });
      setTimeout(() => { if (nr !== ausklingNr) return; Object.keys(loops).forEach(k => loop(k, false)); setTimeout(() => { if (nr !== ausklingNr) return; const t2 = now(); [loopsBus, sfx].forEach(b => { b.gain.cancelScheduledValues(t2); b.gain.setValueAtTime(1, t2); }); }, 2500); }, sek * 1000 + 100);
    },
    lautMaster(v, zeit = .3) { if (ctx) master.gain.setTargetAtTime(v, now(), zeit); },
    vibriere,
    // Vibration je nach Ort: tisch (scheppert), bett (nah, voll), tasche (gedämpft), sonst normal
    vibration(ort, o = {}) {
      if (!ctx || gesperrt) return 0;
      const leise = o.leise ? .5 : 1; const dumpf = ort === 'tasche' || o.dumpf;
      let d = 0;
      if (ort === 'tisch') { const q = quelle('bzzz_tisch', sfx, { vol: 1.1 * leise }); quelle('bzzz', sfx, { vol: .45 * leise, ab: .2 }); d = q ? q.laenge : 0; brumm(.1, .62, false, leise); }
      else if (ort === 'bett') { const q = quelle('bzzz', sfx, { vol: 1.25 * leise, lp: 3400 }); d = q ? q.laenge : 0; brumm(.25, .4, false, leise); brumm(.7, .35, false, leise); }
      else { const q = quelle('bzzz', sfx, { vol: (dumpf ? .9 : 1.15) * leise, lp: dumpf ? 380 : undefined }); d = q ? q.laenge : 0; brumm(.25, .4, dumpf, leise); brumm(.7, .35, dumpf, leise); }
      vibriere(dumpf ? [180] : [350, 90, 350]); return d;
    },
    // Titelmusik im Hauptmenü: ab Sekunde 0, ohne Einblenden
    intro() { if (!ctx || introNode) return; introSoll = true; const go = () => { if (!introNode && introSoll) introNode = quelle('Outro', master, { vol: .8 }); }; if (P.Outro) go(); else lade('Outro').then(go); },
    get introLaeuft() { return !!introNode; },
    introAus(weich = 2.4) { introSoll = false; if (introNode) { introNode.stop(weich); introNode = null; } },
    // echtes Tippen: Abschnitt der Aufnahme abspielen
    tippLauf(ab, dauer) { if (!ctx || gesperrt || !P.tipplauf) return null; return quelle('tipplauf', sfx, { ab, dauer }); },
    get anschlaege() { return (TOENE.tipplauf && TOENE.tipplauf.anschlaege) || []; },
    outro(welche) {
      if (!ctx) return; musikStopp(true); liedStopp(); this.introAus(); if (outroNode) { outroNode.stop(.8); outroNode = null; }
      const k = welche === 'warm' ? 'ende_warm' : 'Outro'; const nr = ++outroNr;
      const go = () => { if (nr !== outroNr || outroNode) return; outroNode = welche === 'warm' ? quelle('ende_warm', master, { vol: .57, einblenden: 4 }) : quelle('Outro', master, { vol: .85, ab: eintrag('Outro').endeAb || 65, einblenden: 1.5 }); };
      if (P[k]) go(); else lade(k).then(go);   // V8.8 (G6): Datei noch nicht geladen → nach dem Laden starten
    },
    outroAus() { outroNr++; if (outroNode) { outroNode.stop(3); outroNode = null; } },
    get outroLaeuft() { return !!outroNode; },
  };
})();
