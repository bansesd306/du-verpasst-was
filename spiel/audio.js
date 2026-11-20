// =====================================================================
//   TON – echte Aufnahmen aus der Liste TOENE. Fehlt eine Datei, bleibt
//   es still. Synthetisch sind nur noch: Lampensummen, Tinnitus, Rauschen.
// =====================================================================
const Ton = (() => {
  let ctx = null, master, sfx, musikBus, musikFilter, musikGain, loopsBus;
  const P = {};           // Name -> AudioBuffer
  const R = {};           // rückwärts
  const loops = {};
  let musik = null, liedNode = null, introNode = null, outroNode = null, gesperrt = false;

  let analyser = null, fftDaten = null, pegelSchnitt = 0;
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.connect(master);
    loopsBus = ctx.createGain(); loopsBus.connect(master);
    musikFilter = ctx.createBiquadFilter(); musikFilter.type = 'lowpass'; musikFilter.frequency.value = 18000;
    musikGain = ctx.createGain(); musikGain.gain.value = 0;
    musikBus = ctx.createGain(); musikBus.connect(musikFilter); musikFilter.connect(musikGain); musikGain.connect(master);
    analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = .55; musikGain.connect(analyser); fftDaten = new Uint8Array(analyser.frequencyBinCount);
    // kurze Töne zuerst, Musik danach
    const namen = Object.keys(TOENE).filter(k => eintrag(k).datei).sort((a, b) => /^M\d|Outro/.test(a) - /^M\d|Outro/.test(b));
    namen.forEach(k => lade(k));
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
    raum_tag: [['raum_tag', { vol: .6 }]],
    uhr: [['uhr', { vol: .55 }]],
    herzschlag: [['herzschlag', { vol: .9 }]],
    gemurmel: [['gemurmel', { vol: .45, lp: 900 }]],
    regen: [['regen_strasse', { vol: .38, lp: 2600 }]],
    oben: [['M1_party', { vol: .5, lp: 160 }]],
    halle: [['halle', { vol: .75 }]],
    pruefung: [['raum_tag', { vol: .35 }], ['PR3_stift', { vol: .18 }]],
    klingel: [['anruf', { vol: 1 }]],
    party_fern: [['party_fern', { vol: .95, lp: 2200 }]],   // Startbildschirm: Party hinter dem Fenster
    lampe: 'lampe', rauschen: 'rauschen',
  };
  const AUSKLANG = { party_fern: 1.2, uhr: .8, herzschlag: .5, halle: .7, wind: .4, gemurmel: .5 };
  function loop(name, an) {
    if (!ctx) return;
    if (loops[name]) { loops[name](); delete loops[name]; }
    if (!an || gesperrt) return;
    const g = ctx.createGain(); g.connect(loopsBus); g.gain.setValueAtTime(0, now()); g.gain.linearRampToValueAtTime(1, now() + .4);
    const def = LOOPS[name]; if (!def) return;
    let stops = [];
    if (def === 'lampe') stops.push(synthLampe(g));
    else if (def === 'rauschen') stops.push(synthRauschen(g));
    else def.forEach(([k, o]) => { const q = quelle(k, g, Object.assign({ loop: true, ab: Math.random() * 3 }, o)); if (q) stops.push(() => q.stop()); else lade(k).then(() => { if (loops[name] && !q) { const q2 = quelle(k, g, Object.assign({ loop: true }, o)); if (q2) stops.push(() => q2.stop()); } }); });
    const tau = AUSKLANG[name] || .15;
    loops[name] = () => { try { g.gain.setTargetAtTime(0, now(), tau); setTimeout(() => { stops.forEach(s => { try { s(); } catch (e) { } }); g.disconnect(); }, tau * 4500 + 200); } catch (e) { } };
  }

  // ---------- Musik ----------
  const STUFEN = {
    laut: [1, 18000], leise: [.45, 2600], dumpf: [.6, 380], tuer: [.55, 650], fern: [.22, 300], telefon: [.3, 1300],
    strasse2: [.32, 420], strasse3: [.48, 650], strasse4: [.7, 1100], aufnahme: [.8, 18000]
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
    if (welche === 'spaet') { const a = quelle('M3_spaet', musikBus, { loop: true, vol: 1.4 }); if (a) qs.push(a); }
    if (welche === 'fern') { const a = quelle('party_fern', musikBus, { loop: true }); if (a) qs.push(a); }
    musik = { art: welche, qs };
    if (welche === 'mia') { const a = quelle('mia', musikBus, { ab: miaAb }); if (a) qs.push(a); musik.t0 = now() - miaAb; }
  }
  function musikStopp(sofort) {
    if (!musik) return; const m = musik; musik = null;
    if (sofort) { m.qs.forEach(q => q.stop()); return; }
    musikGain.gain.setTargetAtTime(0, now(), .5); setTimeout(() => m.qs.forEach(q => q.stop()), 1800);
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
      if (name === 'tinnitus') { tinnitus(); return 4; }
      if (name === 'tipp' && P.tipp) { const i = Math.floor(Math.random() * 8); return (quelle('tipp', sfx, Object.assign({ ab: i * .25, dauer: .09 }, o)) || {}).laenge || 0; }
      const sp = eintrag(name).sprite; if (sp && P[name]) { const [ab, d] = sp[Math.floor(Math.random() * sp.length)]; return (quelle(name, sfx, Object.assign({ ab, dauer: d }, o)) || {}).laenge || 0; }
      if (name === 'bzzz') vibriere(o.dumpf ? [] : [300, 120, 300]);
      const q = quelle(name, o.ziel === 'master' ? master : sfx, o);
      return q ? q.laenge : 0;
    },
    loop,
    musik(art, opt) {
      if (!ctx) return;
      if (art === 'aus') { liedStopp(); return musikStopp(false); }
      if (art === 'lied') { if (opt === 'aus') return liedStopp(); return lied(opt); }
      if (art === 'fern') { musikStart('fern'); stelle('aufnahme'); return; }
      if (art === 'spaet' || art === 'party') { musikStart(art); stelle(opt || 'laut'); return; }
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
    intro() { if (!ctx || introNode) return; const go = () => { if (!introNode) introNode = quelle('Outro', master, { vol: .8 }); }; if (P.Outro) go(); else lade('Outro').then(go); },
    get introLaeuft() { return !!introNode; },
    introAus(weich = 2.4) { if (introNode) { introNode.stop(weich); introNode = null; } },
    // echtes Tippen: Abschnitt der Aufnahme abspielen
    tippLauf(ab, dauer) { if (!ctx || gesperrt || !P.tipplauf) return null; return quelle('tipplauf', sfx, { ab, dauer }); },
    get anschlaege() { return (TOENE.tipplauf && TOENE.tipplauf.anschlaege) || []; },
    outro() { if (!ctx) return; musikStopp(true); this.introAus(); outroNode = quelle('Outro', master, { vol: .85, ab: eintrag('Outro').endeAb || 65, einblenden: 1.5 }); },
    outroAus() { if (outroNode) { outroNode.stop(3); outroNode = null; } },
  };
})();
