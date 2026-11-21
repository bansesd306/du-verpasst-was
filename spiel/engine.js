// =====================================================================
//   ENGINE – liest das Story-Skript und spielt es ab
// =====================================================================
const Spiel = (() => {
  const B = document.getElementById('buehne');
  const $ = s => document.querySelector(s);
  const welt = $('#welt'), kamera = $('#kamera');
  const textbox = $('#textbox'), textEl = $('#text'), nameEl = $('#name'), weiterEl = $('#weiter'), sperreEl = $('#sperre');
  const wahlEl = $('#wahl'), uhrEl = $('#uhr');
  const TEXTE = {}; let ABZ = [];
  let V = {}; let prog = [], labels = {}, pc = 0, stack = [];
  let gen = 0; let schnell = false; const DEBUG = /debug=1/.test(location.search) || location.hash === '#debug';
  let tippWarter = null, tippt = false, ueberspringen = false;
  let verlauf = [], kapitelZeiten = [], pfad = [], pfadPlus = false, abzQueue = [], abzNeu = [];
  let aktBild = null, partyAn = false, partyZaehler = 0, poolAktiv = null, t0 = performance.now();
  const ABBRUCH = Symbol('abbruch'); const besuchtL = new Set(); const fehlerLog = [];

  // ---------------- Speicher ----------------
  const SPEICHER = 'duverpasstwas_v1';
  function lade() { try { return JSON.parse(localStorage.getItem(SPEICHER)) || {}; } catch (e) { return {}; } }
  function speichere(d) { try { localStorage.setItem(SPEICHER, JSON.stringify(d)); } catch (e) { } }
  let S = Object.assign({ abz: [], enden: [], entsch: {}, durchgaenge: 0 }, lade());

  // ---------------- Zeit ----------------
  const TAGE = ['Freitag', 'Samstag', 'Sonntag', 'Montag'], TAGK = ['Fr', 'Sa', 'So', 'Mo'];
  const DATUM = ['Fr., 11. Januar', 'Sa., 12. Januar', 'So., 13. Januar', 'Mo., 14. Januar'];
  const PRUEFUNG = 3 * 1440 + 9 * 60;
  function zeit(s) {
    s = String(s).trim(); let tag = 0; const m0 = s.match(/^(Fr|Sa|So|Mo)\s+/); if (m0) { tag = TAGK.indexOf(m0[1]); s = s.slice(m0[0].length); }
    const m = s.match(/^(\d{1,2}):(\d{2})$/); if (!m) return NaN; return tag * 1440 + (+m[1]) * 60 + (+m[2]);
  }
  const zwei = n => String(n).padStart(2, '0');
  function uhrText(m = V.uhr) { m = ((Math.round(m) % 1440) + 1440) % 1440; return zwei(Math.floor(m / 60)) + ':' + zwei(m % 60); }
  function datumText() { return DATUM[Math.max(0, Math.min(3, Math.floor((V.uhr || 0) / 1440)))]; }
  function zeigeUhr() { uhrEl.textContent = uhrText(); uhrEl.classList.toggle('an', !!V.uhr_zeigen); Handy.aktualisiereZeit(); }

  // ---------------- Ausdrücke ----------------
  const RESERV = new Set(['true', 'false', 'null', 'undefined']);
  const exprCache = {};
  function ausdruck(s) {
    if (exprCache[s]) return exprCache[s];
    let js = s.replace(/\b(Fr|Sa|So|Mo)\s+(\d{1,2}):(\d{2})\b/g, (a, d, h, mi) => String(TAGK.indexOf(d) * 1440 + (+h) * 60 + (+mi)))
      .replace(/\b(\d{1,2}):(\d{2})\b/g, (a, h, mi) => String((+h) * 60 + (+mi)));
    // Bezeichner außerhalb von Strings → V["…"]
    let out = '', i = 0;
    while (i < js.length) {
      const c = js[i];
      if (c === '"' || c === "'") { const e = js.indexOf(c, i + 1); out += js.slice(i, e + 1); i = e + 1; continue; }
      const m = js.slice(i).match(/^[A-Za-zÄÖÜäöüß_][\wÄÖÜäöüß]*/);
      if (m) { out += RESERV.has(m[0]) ? m[0] : `V[${JSON.stringify(m[0])}]`; i += m[0].length; continue; }
      out += c; i++;
    }
    const f = new Function('V', 'return (' + out + ');'); exprCache[s] = f; return f;
  }
  const wert = s => { try { return ausdruck(s)(V); } catch (e) { console.warn('Ausdruck', s, e); return undefined; } };
  const ersetze = s => String(s).replace(/\{([\wÄÖÜäöüß]+)\}/g, (a, k) => (k in V ? V[k] : a));

  // ---------------- Parser ----------------
  function parse(src) {
    const P = [], L = {}; const zeilen = src.split(/\r?\n/);
    zeilen.forEach((roh, nr) => {
      const z = roh.trim(); if (!z || z.startsWith('#')) return;
      if (z.startsWith('== ')) { L[z.slice(3).trim()] = P.length; P.push({ t: 'label', name: z.slice(3).trim(), nr }); return; }
      if (z.startsWith('-> ')) { P.push({ t: 'sprung', ziel: z.slice(3).trim(), nr }); return; }
      if (z.startsWith('?')) {
        const m = z.match(/^(\?\??)\s*„([^“]*)“\s*->\s*(\S+)\s*(.*)$/); if (!m) { console.warn('Wahl?', z); return; }
        const o = { tipp: m[1] === '??', label: m[2], ziel: m[3], nr };
        let rest = m[4] || '';
        const tm = rest.match(/text=„([^“]*)“/); if (tm) { o.text = tm[1]; rest = rest.replace(tm[0], ''); }
        const cm = rest.match(/chat=(\S+)/); if (cm) { o.chat = cm[1]; rest = rest.replace(cm[0], ''); }
        if (/\+handy/.test(rest)) { o.handy = true; rest = rest.replace('+handy', ''); }
        const wm = rest.match(/wenn\s+(.+)$/); if (wm) o.wenn = wm[1].trim();
        const vor = P[P.length - 1];
        if (vor && vor.t === 'wahl' && vor.offen) { o.idx = vor.opts.length; vor.opts.push(o); }
        else { o.idx = 0; P.push({ t: 'wahl', opts: [o], offen: true, nr, id: 'w' + nr }); }
        return;
      }
      const vor = P[P.length - 1]; if (vor && vor.t === 'wahl') vor.offen = false;
      if (z.startsWith('@')) {
        const m = z.match(/^@(\S+)\s*(.*)$/); const name = m[1], arg = m[2];
        if (name === 'wenn') P.push({ t: 'wenn', cond: arg, nr });
        else if (name === 'sonst') P.push({ t: 'sonst', nr });
        else if (name === 'ende') P.push({ t: 'ende', nr });
        else P.push({ t: 'cmd', name, arg, nr });
        return;
      }
      // Text
      let text = z, sperre = 0, auto = false, stil = '', sprecher = '', schrei = false;
      if (/\s>>$/.test(text)) { auto = true; text = text.replace(/\s>>$/, ''); }
      const sm = text.match(/\s!(\d+(?:\.\d+)?)$/); if (sm) { sperre = +sm[1]; text = text.slice(0, -sm[0].length); }
      let vertipp = ''; const vm = text.match(/\s⌫(\S+)$/); if (vm) { vertipp = vm[1]; text = text.slice(0, -vm[0].length); }
      if (text.startsWith('~~ ')) { stil = 'leise'; text = text.slice(3); }
      else if (text.startsWith('~ ')) { stil = 'gedanke'; text = text.slice(2); }
      const sp = text.match(/^([A-ZÄÖÜ][\wäöüß]*)(!?):\s+(„.*)$/);
      if (sp) { sprecher = sp[1]; schrei = !!sp[2]; text = sp[3]; }
      if (!sperre && /^…$/.test(text)) sperre = 1;
      P.push({ t: 'text', text, sperre, auto, stil, sprecher, schrei, vertipp, nr });
    });
    P.forEach(p => { if (p.t === 'wahl') delete p.offen; });
    // wenn / sonst / ende verbinden
    const st = [];
    P.forEach((p, i) => {
      if (p.t === 'wenn') st.push(i);
      else if (p.t === 'sonst') { const w = st[st.length - 1]; P[w].sonst = i; p.wenn = w; }
      else if (p.t === 'ende') { const w = st.pop(); if (w === undefined) { console.warn('@ende ohne @wenn, Zeile', p.nr + 1); return; } P[w].ende = i; if (P[w].sonst !== undefined) P[P[w].sonst].ende = i; }
    });
    if (st.length) console.warn('@wenn ohne @ende', st.map(i => P[i].nr + 1));
    return { P, L };
  }
  function pruefeSkript() {
    const fehler = [];
    prog.forEach(p => {
      const ziele = p.t === 'sprung' ? [p.ziel] : p.t === 'wahl' ? p.opts.map(o => o.ziel) : (p.t === 'cmd' && p.name === 'rufe') ? [p.arg.trim()] : [];
      ziele.forEach(z => { if (z !== '!wackeln' && labels[z] === undefined) fehler.push(`Zeile ${p.nr + 1}: Ziel „${z}“ fehlt`); });
      if (p.t === 'cmd' && p.name === 'bild') { const c = p.arg.split(/\s+/)[0]; if (!BILDER[c]) fehler.push(`Zeile ${p.nr + 1}: Bild ${c} nicht in der Liste`); }
    });
    return fehler;
  }

  // ---------------- Warten / Tippen ----------------
  const pruef = g => { if (g !== gen) throw ABBRUCH; };
  let pausiert = false;
  const pause = async () => { while (pausiert) await new Promise(r => setTimeout(r, 120)); };
  let vz = 0;
  function warte(sek) { vz += sek; const g = gen; return new Promise(r => setTimeout(r, sek * 1000 * (schnell ? .08 : 1))).then(pause).then(() => pruef(g)); }
  function tipp() {
    const g = gen; weiterEl.classList.add('an');
    return new Promise(r => { tippWarter = () => { tippWarter = null; weiterEl.classList.remove('an'); r(); }; }).then(() => pruef(g));
  }
  let rueck = [], rueckPos = -1;
  const rb = $('#rueckbox');
  function zeigeRueck(e) {
    // Rückblick zeigt auch das Bild von damals (ruhig, ohne Animation)
    const rbb = $('#rueckbild');
    // Handy war offen: das Bild von damals dahinter, etwas dunkler (das Handy selbst lässt sich nicht nachstellen)
    rbb.classList.toggle('handy', !!e.handy && !!e.bild);
    if (e.schwarz || !e.bild) { rbb.innerHTML = ''; rbb.classList.toggle('an', !!e.schwarz || !!e.handy); }
    else { const k = e.gesicht && typeof OVERLAYS !== 'undefined' && OVERLAYS[e.gesicht]; rbb.innerHTML = bildHTML(e.bild) + (k ? `<img src="img/${e.gesicht}.webp" alt="" style="position:absolute;left:${k.box[0] * 100}%;top:${k.box[1] * 100}%;width:${k.box[2] * 100}%;height:${k.box[3] * 100}%">` : ''); rbb.classList.add('an'); }
    textbox.style.visibility = 'hidden';
    const t = rb.querySelector('.rt'), n = rb.querySelector('.rn');
    t.className = 'rt ' + (e.ins.stil || '') + (e.ins.schrei ? ' schrei' : ''); t.textContent = e.voll;
    if (e.ins.sprecher) { n.textContent = e.ins.sprecher; n.style.background = SPRECHERFARBE[e.ins.sprecher] || '#2d3550'; n.style.display = 'block'; } else n.style.display = 'none';
  }
  function rueckZu() { rueckPos = -1; pausiert = false; rb.classList.remove('an'); const rbb = $('#rueckbild'); rbb.classList.remove('an', 'handy'); rbb.innerHTML = ''; textbox.style.visibility = ''; }
  function aufTippen(e) {
    if (e.target.closest('button,#debug,.schirm,select,input')) return;
    if (Ton.introLaeuft && !$('#karte').classList.contains('an') && !$('#karte').classList.contains('vorspann')) Ton.introAus();
    if (rueckPos >= 0) { rueckPos++; const ende = textbox.classList.contains('an') ? rueck.length - 1 : rueck.length; if (rueckPos >= ende) rueckZu(); else zeigeRueck(rueck[rueckPos]); return; }
    if (tippt) { ueberspringen = true; return; }
    if (tippWarter) tippWarter();
  }
  B.addEventListener('pointerdown', aufTippen);

  // ---------------- Handy-Knopf (V8.4): selbst aufs Handy schauen, das Bild bleibt ----------------
  // Zählt, wie oft man von sich aus nachschaut und wie oft nichts Neues da war (Bilanz am Ende).
  const blick = { offen: false, zahl: 0, leer: 0, neu: 0 };
  const blickKnopf = $('#handyknopf');
  function blickMoeglich() {
    return !(window.Rahmen && Rahmen.sichtbar) && !Handy.offen && rueckPos < 0 && !wahlEl.querySelector('button')
      && !B.classList.contains('traum') && aktBild && aktBild.code !== 'film'
      && !$('#schwarz').classList.contains('an') && !$('#karte').classList.contains('an');
  }
  function blickAuf() {
    blick.offen = true; blick.zahl++; if (!blick.neu) blick.leer++; blick.neu = 0;
    Ton.spiele('display_klick');
    haendeTausch('sperr'); Handy.sperr();
    if (aktBild && aktBild.stimmung === 'pruefung') Handy.aus();   // Prüfung: Handy ist aus
  }
  function blickZu() { if (!blick.offen) return; blick.offen = false; Handy.zu(); haendeTausch('zu'); Ton.spiele('display_klick', { vol: .5 }); }
  ['pointerdown', 'pointerup', 'touchend', 'mousedown'].forEach(t => blickKnopf.addEventListener(t, e => e.stopPropagation()));
  blickKnopf.addEventListener('click', e => { e.stopPropagation(); if (blick.offen) blickZu(); else if (blickMoeglich()) blickAuf(); });
  // Solange man selbst nachschaut: Tippen aufs Handy blättert zu den Chats, Tippen daneben legt es weg (die Story läuft nicht weiter)
  B.addEventListener('pointerdown', e => {
    if (!blick.offen || e.target.closest('#handyknopf')) return;
    e.stopPropagation(); e.preventDefault();
    if (e.target.closest('#handy') && Handy.app === 'sperr' && !(aktBild && aktBild.stimmung === 'pruefung')) { Handy.liste(); Ton.spiele('display_klick'); return; }
    blickZu();
  }, true);
  B.addEventListener('click', e => { if (blick.offen && !e.target.closest('#handyknopf')) { e.stopPropagation(); e.preventDefault(); } }, true);
  setInterval(() => blickKnopf.classList.toggle('aus', !(blick.offen || blickMoeglich())), 250);

  // ---------------- Text ----------------
  function zeigeTextbox(an) { textbox.classList.toggle('an', an); if (!an) { nameEl.classList.remove('an'); } }
  let lynnHand = 0;
  async function lynnGeste(ins) {
    if (!aktBild || !['N14', 'N14r'].includes(aktBild.code) || Handy.offen) return;
    // V8.2: seltener und langsamer wechseln (nur jede dritte Lynn-Zeile mit Händen, weiche Überblendung)
    let ziel = 'N14'; if (ins.sprecher === 'Lynn') { lynnHand = (lynnHand + 1) % 3; ziel = lynnHand === 2 ? 'N14r' : 'N14'; }
    if (ziel !== aktBild.code) await zeigeBild(ziel, 'geste');
  }
  let textZahl = 0;
  async function text(ins) {
    const g = gen; textZahl++;
    if (partyAn) partyWechsel();
    await lynnGeste(ins);
    let roh = ersetze(ins.text);
    const teile = []; roh.replace(/\{(\w+)\}|([\s\S])/gu, (a, cue, ch) => { teile.push(cue ? { cue } : { ch }); return ''; });
    const voll = teile.filter(t => t.ch).map(t => t.ch).join('');
    textEl.className = ins.stil || ''; if (ins.schrei) textEl.classList.add('schrei');
    textbox.classList.toggle('schwarzmodus', $('#schwarz').classList.contains('an') && !Handy.offen);
    if (ins.sprecher) { nameEl.textContent = ins.sprecher; nameEl.style.background = SPRECHERFARBE[ins.sprecher] || '#2d3550'; nameEl.classList.add('an'); } else nameEl.classList.remove('an');
    zeigeTextbox(true); textEl.textContent = '';
    verlauf.push({ n: ins.sprecher, t: voll, g: !!ins.stil }); if (verlauf.length > 60) verlauf.shift();
    rueck.push({ ins, voll, bild: aktBild && aktBild.code !== 'film' ? (aktBild.ersatzFuer || aktBild.code) : null, gesicht: gesichtFest, schwarz: $('#schwarz').classList.contains('an'), handy: B.classList.contains('handyoffen') });
    tippt = true; ueberspringen = false; let s = '';
    const vSp = aktBild && typeof VARIANTEN !== 'undefined' && VARIANTEN[aktBild.code] && VARIANTEN[aktBild.code].spricht;
    const spEl = vSp && ins.sprecher && vSp[ins.sprecher] && !gesichtFest ? ovEl(vSp[ins.sprecher]) : null;
    if (spEl) spEl.classList.add('spricht');
    for (let i = 0; i < teile.length; i++) {
      const t = teile[i];
      if (t.cue) { if (!ueberspringen) Ton.spiele(t.cue); continue; }
      s += t.ch; if (!ueberspringen) { textEl.textContent = s; const ch = t.ch; const nx = teile[i + 1] && teile[i + 1].ch;
        let d = 40; if (ch === '…') d = 460; else if (/\p{L}/u.test(ch) && ch === s.slice(-2, -1)) d = 200; else if ('.?!'.includes(ch) && nx !== '“' && nx !== '.') d = 300; else if (ch === ',' || ch === '–') d = 160; else if (ch === '“' && '.?!'.includes(s.slice(-2, -1))) d = 250;
        vz += d / 1000; if (schnell) d = 2; await new Promise(r => setTimeout(r, d)); await pause(); pruef(g); }
    }
    textEl.textContent = voll; tippt = false;
    if (spEl) setTimeout(() => spEl.classList.remove('spricht'), 350);
    if (ins.vertipp && schnell) vz += .9 + ins.vertipp.length * .11;
    if (ins.vertipp && !schnell) {
      // Er tippt sich vertan („Lynn“), es bleibt kurz stehen, dann wird es Buchstabe für Buchstabe zurückgelöscht.
      await warte(.6); let w = voll; const i = w.indexOf(ins.vertipp);
      if (i >= 0) for (let k = ins.vertipp.length; k > 0; k--) { w = w.slice(0, i + k - 1) + w.slice(i + k); textEl.textContent = w; Ton.spiele('tipp', { rate: .8, vol: .45 }); await warte(.11); }
      const r = rueck[rueck.length - 1]; if (r) r.voll = w; verlauf[verlauf.length - 1].t = w;
      await warte(.3);
    }
    if (ins.sperre && schnell) vz += ins.sperre;
    if (ins.sperre && !schnell) { sperreEl.classList.add('an'); const i = sperreEl.querySelector('i'); i.style.transition = 'none'; i.style.width = '0'; void i.offsetWidth; i.style.transition = `width ${ins.sperre}s linear`; i.style.width = '100%'; await warte(ins.sperre); sperreEl.classList.remove('an'); }
    if (ins.auto) { await warte(.35); return; }
    vz += 1.0; await tipp();
  }
  function gedankeKurz(t) { textEl.className = 'gedanke'; textEl.textContent = t; nameEl.classList.remove('an'); zeigeTextbox(true); }
  const SPRECHERFARBE = { Jonas: '#b5652a', Lena: '#b03f6e', Tim: '#1f857e', Mia: '#7a4fb8', Lynn: '#46557a', Ich: '#3a4250', Ben: '#3b6aa8', Mama: '#8f7745' };

  // ---------------- Wahl ----------------
  function knoepfe(liste) {
    wahlEl.innerHTML = ''; const g = gen;
    return new Promise(res => {
      liste.forEach((o, i) => {
        const b = document.createElement('button'); b.textContent = o.label; b.style.animationDelay = (i * .07) + 's';
        b.onclick = ev => { ev.stopPropagation(); if (g !== gen) return; if (o.ziel === '!wackeln') { b.classList.remove('wackelt'); void b.offsetWidth; b.classList.add('wackelt'); Ton.spiele('klick'); return; } wahlEl.innerHTML = ''; res(o); };
        wahlEl.appendChild(b);
      });
    }).then(o => { pruef(g); return o; });
  }
  async function wahl(ins) {
    const opts = ins.opts.filter(o => !o.wenn || wert(o.wenn));
    if (!opts.length) { pc++; return; }
    while (true) {
      weiterEl.classList.remove('an');
      const o = await knoepfe(opts);
      rueck = []; rueckZu();
      S.entsch[ins.id + ':' + o.idx] = 1; speichere(S);
      if (o.tipp) {
        const ok = await tippWahl(o);
        if (!ok) continue;
      }
      if (o.handy) V.punkte = (V.punkte || 0) + 1;
      springe(o.ziel); return;
    }
  }
  async function tippWahl(o) {
    const txt = o.text || o.label;
    if (o.chat) await Handy.chat(o.chat); else if (!Handy.offen || Handy.app !== 'chat') await Handy.chat('Jonas');
    zeigeTextbox(false);
    await Handy.tippe(txt); pruef(gen);
    gedankeKurz(TEXTE.senden_frage || 'Senden?');
    const r = await knoepfe([{ label: 'Senden.', s: 1 }, { label: 'Löschen.', s: 0 }]);
    if (r.s) { zeigeTextbox(false); await Handy.sende(); await warte(.6); return true; }
    await Handy.loesche(); gedankeKurz(TEXTE.senden_nein || '… oder doch nicht.'); abzeichen('Senden?');
    await warte(1.4); zeigeTextbox(false); return false;
  }

  // ---------------- Bilder ----------------
  function eintrag(code) {
    const e = BILDER[code] || { datei: '', text: '(nicht in der Liste)', stimmung: 'nacht' };
    if (!e.datei && e.ersatz && BILDER[e.ersatz]) return Object.assign({}, BILDER[e.ersatz], { filter: e.filter, code: e.ersatz, ersatzFuer: code });
    return Object.assign({ code }, e);
  }
  function phHTML(code, e, klein) {
    const st = e.stimmung || 'nacht';
    const muster = st === 'balkon' ? `<div class="muster" style="background-image:radial-gradient(circle,rgba(255,215,140,.9) 0 3px,transparent 4px);background-size:90px 70px;background-position:0 75%;-webkit-mask-image:linear-gradient(transparent 55%,#000 70%,transparent 85%)"></div>` :
      st === 'party' ? `<div class="muster" style="background:radial-gradient(circle at 20% 30%,rgba(255,80,200,.5),transparent 25%),radial-gradient(circle at 75% 60%,rgba(60,160,255,.45),transparent 25%)"></div>` :
        st === 'strasse' ? `<div class="muster" style="background:radial-gradient(circle at 30% 45%,rgba(255,200,120,.4),transparent 8%),radial-gradient(circle at 72% 40%,rgba(255,200,120,.35),transparent 7%)"></div>` : '';
    return `<div class="ph st-${st}">${muster}<div class="lab"><b>${code}</b>${klein ? '' : '– '}${e.text || ''}</div></div>`;
  }
  function bildHTML(code, klein) {
    const e = eintrag(code);
    if (e.datei) return `<img src="${e.datei}" alt="" class="${e.filter ? 'f-' + e.filter : ''}" draggable="false">`;
    return phHTML(code, e, klein);
  }
  // Bilder vorladen: nie halb aufgebaut zeigen
  const VORRAT = {};
  function lade(datei) {
    if (!datei) return Promise.resolve();
    if (!VORRAT[datei]) { const im = new Image(); im.decoding = 'async'; im.src = datei; VORRAT[datei] = (im.decode ? im.decode() : new Promise(r => { im.onload = r; im.onerror = r; })).catch(() => { }); }
    return VORRAT[datei];
  }
  function vorladenAlle() {
    // in Spielreihenfolge: die Bilder, die als Erstes kommen, zuerst
    const reihe = []; prog.forEach(p => { if (p.t === 'cmd' && p.name === 'bild') { const c = p.arg.split(/\s+/)[0]; const e = eintrag(c); if (e.datei && !reihe.includes(e.datei)) reihe.push(e.datei); if (e.blinzeln && BILDER[e.blinzeln]) reihe.push(BILDER[e.blinzeln].datei); } });
    Object.values(BILDER).forEach(e => { if (e.datei && !reihe.includes(e.datei)) reihe.push(e.datei); });
    let i = 0; const naechstes = () => { if (i >= reihe.length) return; const d = reihe[i++]; lade(d).then(() => setTimeout(naechstes, 30)); };
    for (let k = 0; k < 3; k++) naechstes();
  }
  async function zeigeBild(code, modus = '') {
    const e = eintrag(code); aktCodeNeu = code; gesichtFest = null;
    if (e.datei) { const ok = lade(e.datei); await Promise.race([ok, new Promise(r => setTimeout(r, 2500))]); }
    $('#schwarz').classList.remove('an', 'langsam');
    if (modus !== 'gesicht' && modus !== 'pool' && modus !== 'pose' && modus !== 'geste') { zeigeTextbox(false); kamera.classList.remove('zoomrein'); kamera.style.transform = ''; poolAktiv = null; }
    if (modus === 'traum') { B.classList.add('traum'); Ton.spiele('flashback'); }
    const alt = [...welt.querySelectorAll('.ebene')];
    const neu = document.createElement('div'); neu.className = 'ebene';
    const innen = document.createElement('div'); innen.className = 'innen';
    let html = e.datei ? `<img src="${e.datei}" alt="" class="${e.filter ? 'f-' + e.filter : ''}" draggable="false">` : phHTML(e.ersatzFuer || code, e);
    if (e.blinzeln && BILDER[e.blinzeln] && BILDER[e.blinzeln].datei) html += `<img src="${BILDER[e.blinzeln].datei}" class="blink" alt="">`;
    innen.innerHTML = html + overlayHTML(code);
    const lichter = e.lichter || (e.lichterVon && BILDER[e.lichterVon] && BILDER[e.lichterVon].lichter);
    if (lichter && e.datei) { const l = document.createElement('div'); l.className = 'ov'; l.id = ''; l.style.cssText = 'position:absolute;inset:0'; l.innerHTML = lichter.map(p => `<i class="p" style="left:${p[0] * 100}%;top:${p[1] * 100}%;animation-delay:-${(Math.random() * 2.4).toFixed(2)}s;animation-duration:${(1.6 + Math.random() * 1.8).toFixed(2)}s"></i>`).join(''); l.querySelectorAll('.p').forEach(p => p.style.position = 'absolute'); l.classList.add('lichterbox'); innen.appendChild(l); }
    if (e.funken && e.datei) { const f = document.createElement('div'); f.className = 'funken'; f.innerHTML = e.funken.map((q, i) => `<i style="left:${q[0] * 100}%;top:${q[1] * 100}%;animation-delay:${-i * .13}s"></i>`).join(''); innen.appendChild(f); }
    if (e.figur) { innen.classList.add('atmen'); innen.style.animationDelay = -((performance.now() - t0) / 1000 % 4.6) + 's'; }
    // Ich-Sicht aus dem Bett: Kamera kippt ganz leicht und hebt/senkt sich mit dem Atmen (ohne neue Bilder)
    if (e.bett) { innen.classList.add('bettatmen'); innen.style.animationDelay = -((performance.now() - t0) / 1000 % 5.8) + 's'; }
    const huelle = document.createElement('div'); huelle.className = 'innen';
    if (e.figur) { huelle.classList.add('drift'); huelle.style.animationDelay = -((performance.now() - t0) / 1000 % 26) + 's'; }
    if (partyAn && e.stimmung === 'party') huelle.classList.add('schwenk');
    if (modus === 'dunkel') innen.querySelectorAll('img,.ph').forEach(x => x.classList.add('f-dunkel'));
    huelle.appendChild(innen); neu.appendChild(huelle);
    if (modus === 'ran') { huelle.style.transform = 'scale(.9)'; huelle.style.transition = 'transform .9s cubic-bezier(.2,.7,.2,1)'; }
    if (modus === 'ruck') { huelle.style.transform = 'scale(1.09)'; huelle.style.transition = 'transform .32s cubic-bezier(.2,.9,.3,1)'; }
    const dauer = modus === 'ruck' ? .12 : modus === 'ran' ? .55 : modus === 'langsam' ? 2 : modus === 'gesicht' ? .22 : modus === 'pose' ? .5 : modus === 'geste' ? .95 : modus === 'pool' ? .35 : modus === 'halb' ? 1.6 : .7;
    neu.style.transition = `opacity ${dauer}s ease`;
    welt.appendChild(neu); void neu.offsetWidth; neu.classList.add('an');
    if (modus === 'ran' || modus === 'ruck') { requestAnimationFrame(() => { huelle.style.transform = 'scale(1)'; }); if (modus === 'ruck') { kamera.classList.remove('ruck'); void kamera.offsetWidth; kamera.classList.add('ruck'); } }
    if (modus === 'ran') alt.forEach(a => { const h = a.querySelector('.innen'); if (h) { h.style.transition = 'transform .7s ease-in'; h.style.transform = 'scale(1.1)'; } });
    umgebung(e);
    B.classList.toggle('tanzflaeche', /^(N35|MM|MK|N32b)/.test(code));
    alt.forEach(a => { a.style.transition = `opacity ${dauer}s ease`; if (modus === 'halb') { const h = a.querySelector('.innen'); h.style.transition = 'transform 1.6s ease-in'; h.style.transform = 'scale(1.18)'; } a.classList.remove('an'); setTimeout(() => a.remove(), dauer * 1000 + 80); });
    aktBild = Object.assign({ code }, e, { el: neu });
    // Fenster-Overlay und Handylicht
    fensterOverlay(e.fenster);
    { const h = $('#handylicht'); if (e.fernLicht) { h.style.setProperty('--fx', e.fernLicht[0]); h.style.setProperty('--fy', e.fernLicht[1]); } else { h.style.removeProperty('--fx'); h.style.removeProperty('--fy'); } }
    const hl = $('#handylicht .g'); if (e.handy) { const [x, y, w, h] = e.handy; Object.assign(hl.style, { left: x * 1920 + 'px', top: y * 1080 + 'px', width: w * 1920 + 'px', height: h * 1080 + 'px' }); }
    if (modus === 'schnitt') return;
    await warte(Math.min(dauer, .5));
  }
  // ---------------- Gesichts-Varianten (Overlays) ----------------
  function overlayHTML(code) {
    const v = (typeof VARIANTEN !== 'undefined' && VARIANTEN[code]) || null; if (typeof OVERLAYS === 'undefined') return '';
    const alle = Object.keys(OVERLAYS).filter(k => OVERLAYS[k].basis === code); if (!alle.length) return '';
    const blink = (v && v.blink) || [];
    return alle.map(k => { const [x, y, w, h] = OVERLAYS[k].box; return `<img src="img/${k}.webp" alt="" draggable="false" class="ov-v${blink.includes(k) ? ' blink' : ''}" data-k="${k}" style="left:${x * 100}%;top:${y * 100}%;width:${w * 100}%;height:${h * 100}%">`; }).join('');
  }
  function ovEl(k) { return welt.querySelector(`.ebene.an .ov-v[data-k="${k}"]`); }
  let gesichtFest = null;
  function gesicht(k, an = true) {
    welt.querySelectorAll('.ebene.an .ov-v.fest').forEach(e => { if (e.dataset.k !== k || !an) e.classList.remove('fest'); });
    gesichtFest = an ? k : null; const e = k && ovEl(k); if (e && an) e.classList.add('fest');
  }
  // Mimik zwischendurch (kleines Lächeln o. ä.), nur wenn gerade niemand spricht
  setInterval(() => {
    if (tippt || gesichtFest || !aktBild || B.classList.contains('einfrieren')) return;
    const v = typeof VARIANTEN !== 'undefined' && VARIANTEN[aktBild.code]; if (!v || !v.mimik || Math.random() < .45) return;
    const e = ovEl(v.mimik[Math.random() * v.mimik.length | 0]); if (!e) return;
    e.classList.add('mimik'); setTimeout(() => e.classList.remove('mimik'), 1700 + Math.random() * 1200);
  }, 5200);
  // Bewegung im Hintergrund: zwei Bilder langsam ineinander (z. B. Leute hinter der Partytür)
  setInterval(() => {
    if (!aktBild || !aktBild.wechsel || B.classList.contains('einfrieren')) return;
    const w = BILDER[aktBild.wechsel]; const innen = welt.querySelector('.ebene.an .innen .innen') || welt.querySelector('.ebene.an .innen'); if (!w || !innen) return;
    let e = innen.querySelector('img.wechsel'); if (!e) { e = document.createElement('img'); e.className = 'wechsel'; e.src = w.datei; innen.appendChild(e); }
    e.classList.toggle('an');
  }, 3600);

  // Blinzeln
  setInterval(() => {
    if (B.classList.contains('einfrieren')) return;
    const bls = [...welt.querySelectorAll('.ebene.an .ov-v.blink')];
    if (bls.length && Math.random() > .3) {
      const bl = bls[Math.random() * bls.length | 0]; if (bl.classList.contains('fest')) return;
      bl.classList.add('zu'); setTimeout(() => bl.classList.remove('zu'), 150);
      if (Math.random() < .18) setTimeout(() => { bl.classList.add('zu'); setTimeout(() => bl.classList.remove('zu'), 140); }, 360);
    }
  }, 2900);
  setInterval(() => {
    if (B.classList.contains('einfrieren')) return;
    const bl = welt.querySelector('.ebene.an .blink'); if (!bl || Math.random() < .35) return;
    bl.classList.add('zu'); setTimeout(() => bl.classList.remove('zu'), 130);
    if (Math.random() < .2) setTimeout(() => { bl.classList.add('zu'); setTimeout(() => bl.classList.remove('zu'), 120); }, 300);
  }, 2600);

  const FENSTER = [[.714, .211, .022, .07], [.772, .208, .023, .068], [.714, .331, .022, .065], [.812, .331, .02, .065], [.768, .448, .024, .07]];
  function fensterOverlay(an) { const f = $('#fenster'); f.innerHTML = an ? FENSTER.map(r => `<i class="w" style="left:${r[0] * 100}%;top:${r[1] * 100}%;width:${r[2] * 100}%;height:${r[3] * 100}%"></i>`).join('') : ''; }

  // ---------------- Party ----------------
  const POOL = Object.keys(BILDER).filter(k => BILDER[k].pool && BILDER[k].datei);
  const RUFE = ['WOOO', 'Noch einen!', 'Wo ist Lena?!', 'DREH LAUTER'];
  let partyTimer = [];
  function party(an) {
    partyAn = an; $('#licht').classList.toggle('an', an); partyTimer.forEach(clearTimeout); partyTimer = [];
    welt.querySelectorAll('.ebene.an > .innen').forEach(h => h.classList.toggle('schwenk', an && aktBild && aktBild.stimmung === 'party'));
    if (!an) { if (poolAktiv) { const c = poolAktiv; poolAktiv = null; zeigeBild(c, 'pool'); } return; }
    const ruf = () => { if (!partyAn) return; partyGeraeusch(); if (false) { const r = document.createElement('div'); r.className = 'ruf'; r.textContent = RUFE[Math.random() * RUFE.length | 0]; r.style.left = (150 + Math.random() * 1400) + 'px'; r.style.top = (160 + Math.random() * 380) + 'px'; $('#rufe').appendChild(r); setTimeout(() => r.remove(), 2700); } partyTimer.push(setTimeout(ruf, 4000 + Math.random() * 5000)); };
    const blitz = () => { if (!partyAn) return; const b = $('#blitz'); b.classList.remove('an'); void b.offsetWidth; b.classList.add('an'); partyTimer.push(setTimeout(blitz, 5000 + Math.random() * 6000)); };
    partyTimer.push(setTimeout(ruf, 1500), setTimeout(blitz, 3000));
  }
  function partyWechsel() {
    if (!aktBild || Handy.offen) return;
    partyZaehler++;
    if (poolAktiv) { const c = poolAktiv; poolAktiv = null; zeigeBild(c, 'pool'); return; }
    if (partyZaehler % 4 === 0 && POOL.length && ['N36', 'N36L', 'N33', 'A1'].includes(aktBild.code)) {
      const alt = aktBild.code; const p = POOL[Math.random() * POOL.length | 0]; zeigeBild(p, 'pool'); poolAktiv = alt;
    }
  }
  let kotzenSchon = false, schreiSchon = false;
  function partyGeraeusch() {
    if (Handy.offen || Math.random() < .35) return;
    const r = Math.random();
    if (!kotzenSchon && r < .12) { kotzenSchon = true; Ton.spiele('kotzen', { lp: 2400, vol: .7 }); return; }
    if (!schreiSchon && r < .2) { schreiSchon = true; Ton.spiele('schrei', { lp: 1800, vol: .45 }); return; }
    Ton.spiele('jubel', { lp: 1500, vol: .35, dauer: 3.5 });
  }
  async function schnittgewitter(codes) {
    const zurueck = aktBild && aktBild.code;
    for (let r = 0; r < 2; r++) for (const c of codes) { await zeigeBild(c, 'schnitt'); const b = $('#blitz'); b.classList.remove('an'); void b.offsetWidth; b.classList.add('an'); await warte(.245); }
    if (zurueck) await zeigeBild(zurueck, 'schnitt');
  }

  // ---------------- Uhr-Animationen ----------------
  async function uhrSpringe(ziel) {
    const von = V.uhr; const g = gen; uhrEl.classList.add('springt');
    const n = 14; for (let i = 1; i <= n; i++) { V.uhr = Math.round(von + (ziel - von) * (1 - Math.pow(1 - i / n, 2))); zeigeUhr(); await new Promise(r => setTimeout(r, schnell ? 5 : 70)); pruef(g); }
    V.uhr = ziel; zeigeUhr(); uhrEl.classList.remove('springt');
  }
  async function uhrLaufen(ziel, schritt) {
    const g = gen; let d = 380;
    while (V.uhr < ziel) { V.uhr++; zeigeUhr(); if (d > 120) Ton.spiele('tipp'); if (schritt) schritt(); await new Promise(r => setTimeout(r, schnell ? 3 : d)); pruef(g); d = Math.max(18, d * .86); }
  }

  // ---------------- Effekte ----------------
  const lider = $('#lider');
  async function augen(zu) { lider.classList.remove('halb'); lider.classList.toggle('zu', zu); await warte(2.7); }
  async function effekt(name, arg) {
    switch (name) {
      case 'einfrieren':
        if (arg === 'aus') { B.classList.remove('einfrieren'); Ton.loop('rauschen', false); Ton.lautMaster(.9); }
        else { B.classList.add('einfrieren'); Ton.lautMaster(.25); Ton.loop('rauschen', true); }
        break;
      case 'traum': if (arg.startsWith('aus')) { B.classList.remove('traum'); if (arg.includes('weich')) Ton.spiele('flashback', { rueckwaerts: true, vol: .5 }); } else { B.classList.add('traum'); Ton.spiele('flashback'); } break;
      case 'waermer': B.classList.toggle('waermer', arg !== 'aus'); if (arg !== 'aus') Ton.musikStufe('leise'); break;
      case 'heranzoomen': void kamera.offsetWidth; kamera.classList.add('zoomrein'); break;
      case 'wackeln': kamera.classList.remove('wackeln'); void kamera.offsetWidth; kamera.classList.add('wackeln'); break;
      case 'ruck': kamera.classList.remove('ruck'); void kamera.offsetWidth; kamera.classList.add('ruck'); Ton.spiele('W_schritte'); await warte(.5); break;
      case 'schlummer': {
        const min = +arg || 10; lider.classList.add('halb'); await warte(1); await augen(true); Ton.lautMaster(.2, 1);
        await uhrSpringe(V.uhr + min); await warte(1); Ton.lautMaster(.9, .5); await augen(false); break;
      }
      case 'einschlafen': {
        Ton.lautMaster(.3, 2); lider.classList.add('halb'); await warte(2); lider.classList.remove('halb'); await warte(.9);
        await augen(true); await warte(1.5); Ton.stille(); Ton.lautMaster(.9, .1); zeigeTextbox(false); $('#schwarz').classList.add('an'); lider.classList.remove('zu'); break;
      }
      case 'tunnel': {
        const t = $('#tunnel'); t.style.opacity = 1; let p = 75; const g = gen;
        (async () => { while (p > 0 && g === gen && t.style.opacity === '1') { p -= 1.2; t.style.setProperty('--t', p + '%'); await new Promise(r => setTimeout(r, 70)); } })();
        break;
      }
      case 'tanzen': B.classList.toggle('tanzen', arg !== 'aus'); if (arg !== 'aus') { welt.style.filter = 'saturate(1.4) blur(1.5px)'; kamera.style.transform = 'scale(1.08)'; } else { welt.style.filter = ''; kamera.style.transform = ''; } break;
      case 'tasche': { const t = $('#tasche'); if (arg === 'aus') t.classList.remove('an'); else { t.querySelector('b').textContent = arg; t.classList.add('an'); } break; }
      case 'handylicht': {
        // weiches Display-Licht: leuchtet auf, flackert wie wechselnde Inhalte, klingt ab
        const h = $('#handylicht'); h.classList.toggle('fern', arg === 'fern');
        if (arg === 'aus') { h.classList.remove('an', 'kurz'); break; }
        if (arg === 'kurz' || arg === 'fern') { h.classList.remove('kurz'); void h.offsetWidth; h.classList.add('kurz'); clearTimeout(h.t); h.t = setTimeout(() => h.classList.remove('kurz'), 2100); }
        else h.classList.add('an');
        break;
      }
      case 'umarmung': {
        // Jonas fällt mir um den Hals: schnell auf ihn zu, kurz dunkel (Gesicht in seiner Schulter), dumpf, dann Licht
        zeigeTextbox(false); kamera.style.transition = 'transform .42s cubic-bezier(.55,0,.85,.35)'; kamera.style.transform = 'scale(1.85) translate(0,6%)';
        await warte(.3); const sw = $('#schwarz'); sw.classList.remove('langsam'); sw.classList.add('an', 'schnell');
        Ton.spiele('umarmung'); Ton.musikStufe('dumpf'); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) { }
        await warte(.25); kamera.style.transition = 'none'; kamera.style.transform = '';
        await warte(1.5); Ton.musikStufe('laut'); sw.classList.remove('schnell');
        break;
      }
      case 'blitz': { const b = $('#weiss'); b.classList.remove('an'); void b.offsetWidth; b.classList.add('an'); break; }
      case 'schnittgewitter': await schnittgewitter(arg.split(/\s+/)); break;
      case 'alles_aus': B.classList.remove('traum', 'waermer', 'einfrieren', 'tanzen'); welt.style.filter = ''; kamera.style.transform = ''; $('#tunnel').style.opacity = 0; $('#tasche').classList.remove('an'); $('#handylicht').classList.remove('an'); lider.classList.remove('zu', 'halb'); party(false); Ton.lautMaster(.9); break;
      default: console.warn('Effekt?', name);
    }
  }
  async function shutdown() {
    Handy.zu(); party(false); Ton.stille(); Ton.sperre(true); $('#tunnel').style.opacity = 0;
    $('#schwarz').classList.add('an'); zeigeTextbox(false); Ton.sperre(false); Ton.spiele('tinnitus');
  }
  async function fensterAus(ziel) {
    const ws = [...document.querySelectorAll('#fenster .w')]; const gesamt = ziel - V.uhr; const start = V.uhr; let n = 0;
    await uhrLaufen(ziel, () => {
      const anteil = (V.uhr - start) / gesamt; const soll = Math.floor(anteil * (ws.length + 1));
      while (n < Math.min(soll, ws.length)) { ws[n++].classList.add('aus'); }
      if (anteil > .85) welt.style.filter = 'brightness(.5)';
    });
    ws.forEach(w => w.classList.add('aus')); await warte(1.2); welt.style.filter = '';
  }

  // ---------------- Vibration (Ton + Brummen + Zittern) ----------------
  const TISCH = ['B05', 'N04', 'K10', 'K10H', 'K10O', 'L4', 'N03', 'L7', 'N09', 'N09D'];
  const BETT = ['N1', 'N02', 'N02D', 'N1L', 'SO', 'N1D', 'N24', 'N31a'];
  let letzteVib = 0;
  function bzzz(o = {}) {
    const jetzt = performance.now(); if (o.entprellen && jetzt - letzteVib < 1400) return 0; letzteVib = jetzt;
    let ort = 'normal';
    if (o.dumpf) ort = 'tasche';
    else if (aktBild && ['party', 'flur', 'balkon', 'bad', 'strasse'].includes(aktBild.stimmung)) ort = 'tasche';
    else if (aktBild && BETT.includes(aktBild.code)) ort = 'bett';
    else if (aktBild && TISCH.includes(aktBild.code)) ort = 'tisch';
    const d = Ton.vibration(ort, o);
    if (!o.leise && (ort !== 'tasche' || o.phantom)) { kamera.classList.remove('zittern'); void kamera.offsetWidth; kamera.classList.add('zittern'); }
    const h = document.getElementById('handy'); if (Handy.offen) { h.classList.remove('zittert'); void h.offsetWidth; h.classList.add('zittert'); }
    return d;
  }

  // ---------------- Kurzfilm (z. B. Weg zur Party) ----------------
  async function film(name) {
    const src = typeof FILME !== 'undefined' && FILME[name]; if (!src) return;
    zeigeTextbox(false); $('#schwarz').classList.remove('an', 'langsam');
    const alt = [...welt.querySelectorAll('.ebene')];
    const neu = document.createElement('div'); neu.className = 'ebene';
    neu.innerHTML = `<div class="innen"><div class="innen"><video src="${src}" muted playsinline preload="auto" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div></div>`;
    neu.style.transition = 'opacity .8s ease'; welt.appendChild(neu); void neu.offsetWidth; neu.classList.add('an');
    alt.forEach(a => { a.style.transition = 'opacity .8s ease'; a.classList.remove('an'); setTimeout(() => a.remove(), 900); });
    aktBild = { code: 'film', stimmung: 'strasse', el: neu };
    const v = neu.querySelector('video'); try { await v.play(); } catch (e) { }
    if (name === 'weg') Ton.loop('schritte', true);
    // Ende weich: die Kamerafahrt bremst in den letzten Sekunden ab, statt hart stehen zu bleiben
    const bremse = () => { if (!v.isConnected || v.ended || v.paused) return; const rest = v.duration - v.currentTime; if (rest < .6) v.playbackRate = Math.max(.6, rest / .6); requestAnimationFrame(bremse); };
    requestAnimationFrame(bremse);
    if (schnell) { v.pause(); vz += 12; if (name === 'weg') Ton.loop('schritte', false); return; }
    const g = gen;
    await new Promise(r => { const t = setTimeout(r, 14000); v.onended = () => { clearTimeout(t); r(); }; tippWarter = () => { if (v.currentTime > 1.5) { tippWarter = null; clearTimeout(t); r(); } }; });
    tippWarter = null; if (name === 'weg') Ton.loop('schritte', false); pruef(g);
  }

  // ---------------- Analoge Uhr in der Bildmitte ----------------
  let auMin = null;
  async function analoguhr(arg) {
    const el = $('#analoguhr');
    if (arg === 'aus') { el.classList.remove('an'); auMin = null; return; }
    const ziel = zeit(arg); V.uhr = ziel; zeigeUhr();
    const tagMin = ziel % 1440; let gesamt = auMin == null ? tagMin : auMin + ((tagMin - auMin % 1440) + 1440) % 1440;
    const setz = (m, dauer) => { el.querySelectorAll('.zg').forEach(z => z.style.transition = `transform ${dauer}s cubic-bezier(.45,0,.2,1)`); el.querySelector('.zm').style.transform = `rotate(${m * 6}deg)`; el.querySelector('.zh').style.transform = `rotate(${m * .5}deg)`; el.querySelector('.ad').textContent = uhrText(); };
    zeigeTextbox(false);
    if (auMin == null) { setz(gesamt, 0); el.classList.add('an'); await warte(.6); }
    else { Ton.spiele('uhr', { dauer: 2.2, vol: .8 }); setz(gesamt, 2.2); await warte(2.4); }
    auMin = gesamt;
  }

  // ---------------- Prüfungsschema zum Mitmachen ----------------
  async function schema(arg) {
    const el = $('#schema');
    if (arg === 'aus') { el.classList.remove('an', 'wartet'); return; }
    const still = /still/.test(arg); const n = parseInt(arg) || 5; const lis = [...el.querySelectorAll('li')];
    zeigeTextbox(false); lis.forEach(l => l.classList.remove('ok', 'blass', 'dick')); el.classList.add('an');
    await warte(.4);
    for (let i = 0; i < Math.min(n, lis.length); i++) { el.classList.add('wartet'); await tipp(); el.classList.remove('wartet'); lis[i].classList.add('ok'); Ton.spiele('haken'); if (/Kausal/.test(lis[i].textContent)) { lis[i].classList.add('dick'); await warte(.16); Ton.spiele('haken'); } await warte(.3); }
    if (still) { el.classList.add('wartet'); await tipp(); el.classList.remove('wartet'); lis.forEach(l => l.classList.add('blass')); await warte(1.6); lis.forEach(l => l.classList.remove('ok', 'blass', 'dick')); return; }
    if (n < lis.length) {
      await warte(.6); if (/phantom/.test(arg)) bzzz({ dumpf: true, phantom: true }); else bzzz(); await warte(1.3);
      lis.forEach(l => l.classList.add('blass')); await warte(1.1); lis.forEach(l => l.classList.remove('ok', 'blass'));
    } else await warte(.7);
  }

  // ---------------- Zettel auf dem Schreibtisch: Karteikarten, Lernplan ----------------
  const KARTEN = [['§ 119 – wann anfechtbar?', 'Irrtum über Inhalt oder Erklärung.'], ['Minderjährige – was geht ohne Einwilligung?', 'Nur, was lediglich rechtlich vorteilhaft ist. § 107.'], ['§ 823 I – Schema?', 'Rechtsgut, Handlung, Kausalität, Rechtswidrigkeit, Verschulden.']];
  async function karteikarten(arg) {
    const el = $('#karteikarten');
    if (arg === 'aus') { el.classList.remove('an', 'wartet'); await warte(.4); return; }
    zeigeTextbox(false);
    const nur = arg === 'auto' ? 1 : 3;
    el.innerHTML = KARTEN.slice(0, nur).map((k, i) => `<div class="kk" style="--i:${i}"><div class="kk-in"><div class="kk-v"><small>${i + 1} / ${nur === 1 ? 3 : 3}</small>${k[0]}</div><div class="kk-r">${k[1]}</div></div></div>`).join('');
    el.classList.toggle('einzeln', nur === 1); void el.offsetWidth; el.classList.add('an'); Ton.spiele('blaettern', { vol: .5 }); await warte(.7);
    const ks = [...el.querySelectorAll('.kk')];
    for (let i = 0; i < ks.length; i++) {
      if (arg === 'auto') await warte(.5);          // sie dreht sich von selbst um, bevor man tippen kann
      else { ks[i].classList.add('dran'); el.classList.add('wartet'); await tipp(); el.classList.remove('wartet'); ks[i].classList.remove('dran'); }
      ks[i].classList.add('um'); Ton.spiele(arg === 'auto' ? 'blaettern' : 'haken', { vol: arg === 'auto' ? .35 : 1 }); await warte(.55);
    }
    await warte(.6);
  }
  async function lernplan(t) {
    const el = $('#lernplan');
    if (t[0] === 'an') { el.querySelectorAll('li').forEach(l => l.classList.remove('ok', 'durch')); el.classList.add('an'); Ton.spiele('blaettern', { vol: .5 }); await warte(.6); return; }
    if (t[0] === 'aus') { el.classList.remove('an'); await warte(.5); return; }
    if (t[0] === 'an') return;
    if (t[0] === 'haken') { const li = el.querySelectorAll('li')[(+t[1] || 1) - 1]; if (li) { li.classList.add('ok'); Ton.spiele('stift', { vol: .7 }); Ton.spiele('haken', { vol: .8 }); } await warte(.5); }
    if (t[0] === 'streich') { const li = el.querySelectorAll('li')[(+t[1] || 1) - 1]; if (li) { li.classList.add('durch'); Ton.spiele('PR3_stift', { dauer: .5, vol: .9 }); } await warte(.9); }
  }

  // ---------------- Mias Lied: Lichtshow im Takt ----------------
  const MIA_BEATS = [36.966, 37.314, 37.64, 37.988, 38.313, 38.638, 38.986, 39.311, 39.636, 39.985, 40.31, 40.658, 40.983, 41.308, 41.657, 41.982, 42.307, 42.655, 42.98, 43.305, 43.654, 43.979, 44.327, 44.652, 44.977, 45.325, 45.65, 45.976, 46.301, 46.626, 46.974, 47.322, 47.647, 47.996, 48.321, 48.646, 48.971, 49.319, 49.644, 49.993, 50.318, 50.643, 50.968, 51.316, 51.641, 51.989, 52.315, 52.64, 52.988, 53.313, 53.638];
  async function montage() {
    const g = gen;
    // Song an den Aufbau vor dem Refrain setzen (gedämpft, man hört den Sprung nicht), dann lauter werden
    if (!schnell) {
      const pos = Ton.miaPos(); if (pos < 0 || pos > 34 || pos < 26) Ton.miaSpring(29.2);
      Ton.crescendo(6.2, 'laut');
      $('#schwarz').classList.remove('langsam'); $('#schwarz').style.transition = 'opacity 5s ease'; $('#schwarz').classList.remove('an');
      await zeigeBild('MM04', 'schnitt'); kamera.style.transition = 'transform 6s ease-in'; kamera.style.transform = 'scale(1.12)';
      while (Ton.miaPos() >= 0 && Ton.miaPos() < MIA_BEATS[0] - .03) { await new Promise(r => setTimeout(r, 15)); pruef(g); }
      $('#schwarz').style.transition = '';
    }
    if (schnell) vz += 6.2 + (MIA_BEATS[MIA_BEATS.length - 1] - MIA_BEATS[0]);
    const folge = ['MM01', 'MK1', 'MM03', 'MM05', 'MK2', 'MM06', 'MM02', 'MM08', 'MK3', 'MM07', 'MM01', 'MM09', 'MM03', 'MK1', 'MM05', 'MM06', 'MK2', 'MM02', 'MM08', 'MM07', 'MK3', 'MM09', 'MM05', 'MM01'];
    const schritte = []; let i = 0, f = 0;
    while (i < MIA_BEATS.length) { const doppel = !(i >= 16 && i < 24) && !(i >= 40); schritte.push([MIA_BEATS[i], folge[f++ % folge.length]]); i += doppel ? 2 : 1; }
    const weiss = $('#weiss'); const strobo = $('#strobo');
    for (const [zeit, code] of schritte) {
      if (!schnell) { while (Ton.miaPos() >= 0 && Ton.miaPos() < zeit - .025) { await new Promise(r => setTimeout(r, 8)); } }
      pruef(g);
      await zeigeBild(code, 'schnitt');
      const z = 1.04 + Math.random() * .22, x = (Math.random() - .5) * 8, y = (Math.random() - .5) * 6, r = (Math.random() - .5) * 4;
      kamera.style.transition = 'none'; kamera.style.transform = `scale(${z + .06}) translate(${x}%,${y}%) rotate(${r}deg)`; void kamera.offsetWidth;
      kamera.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; kamera.style.transform = `scale(${z}) translate(${x * .8}%,${y * .8}%) rotate(${r * .6}deg)`;
      welt.classList.toggle('spiegel', Math.random() < .3 && !code.startsWith('MK'));
      if (Math.random() < .6) { weiss.classList.remove('an', 'kurz'); void weiss.offsetWidth; weiss.classList.add('an', 'kurz'); }
      // Stroboskop: immer wieder ganz kurze, ultrahelle weiße Blitze
      if (!schnell && Math.random() < .42) { const n = 3 + (Math.random() * 3 | 0); for (let k = 1; k <= n; k++) setTimeout(() => { strobo.classList.remove('an'); void strobo.offsetWidth; strobo.classList.add('an'); }, 70 + k * 62); }
      B.style.setProperty('--farbe', ['#ff3fa4', '#7a5cff', '#00d1ff', '#ffb000'][Math.random() * 4 | 0]);
      if (schnell) await warte(.05);
    }
    welt.classList.remove('spiegel'); kamera.style.transition = 'transform .6s ease'; kamera.style.transform = '';
  }

  // ---------------- Lebendige Umgebung ----------------
  // Regen auf der Straße, Staub im Prüfungsraum, ab und zu Autolicht über die Zimmerdecke. Alles leise und klein.
  const partikel = $('#partikel'), pctx = partikel.getContext('2d'); partikel.width = 960; partikel.height = 540;
  let pModus = '', pTeile = [], pLauf = false, autoT = null;
  let aktCodeNeu = '';
  function umgebung(e) {
    const st = (e && e.stimmung) || '';
    pModus = st === 'strasse' ? 'regen' : st === 'pruefung' ? 'staub' : st === 'balkon' ? 'atem' : (e && /^(N35|MM|MK)/.test(e.code || aktCodeNeu)) ? 'konfetti' : '';
    if (pModus && !pLauf) { pLauf = true; requestAnimationFrame(pSchritt); }
    clearTimeout(autoT); const al = $('#autolicht'); al.classList.remove('faehrt');
    if (['zimmer', 'nacht'].includes(st) && e && e.datei) { const f = () => { if (!aktBild || !['zimmer', 'nacht'].includes(aktBild.stimmung)) return; al.classList.remove('faehrt'); void al.offsetWidth; al.classList.add('faehrt'); autoT = setTimeout(f, 22000 + Math.random() * 26000); }; autoT = setTimeout(f, 7000 + Math.random() * 9000); }
  }
  function pSchritt() {
    const W = 960, H = 540; pctx.clearRect(0, 0, W, H);
    if (!pModus || Handy.offen && pModus !== 'regen') { pTeile = []; pLauf = false; return; }
    const ziel = pModus === 'regen' ? 90 : pModus === 'staub' ? 26 : pModus === 'konfetti' ? 70 : 0;
    while (pTeile.length < ziel) pTeile.push({ x: Math.random() * W, y: Math.random() * H, v: pModus === 'regen' ? 7 + Math.random() * 5 : .08 + Math.random() * .15, a: Math.random(), w: Math.random() * 6.28 });
    if (pTeile.length > ziel) pTeile.length = ziel;
    if (pModus === 'regen') { pctx.strokeStyle = 'rgba(190,210,235,.22)'; pctx.lineWidth = 1; pctx.beginPath(); pTeile.forEach(t => { t.y += t.v; t.x -= t.v * .18; if (t.y > H) { t.y = -10; t.x = Math.random() * W * 1.1; } pctx.moveTo(t.x, t.y); pctx.lineTo(t.x + 2.2, t.y - 11); }); pctx.stroke(); }
    if (pModus === 'konfetti') pTeile.forEach((t, i) => { t.w += .03; t.y += t.v * 7 + .6; t.x += Math.sin(t.w) * .8; if (t.y > H) { t.y = -10; t.x = Math.random() * W; } pctx.save(); pctx.translate(t.x, t.y); pctx.rotate(t.w * 2); pctx.fillStyle = ['#ff6fb5', '#ffd25a', '#7fd8ff', '#b388ff', '#ffffff', '#8dffb0'][i % 6]; pctx.globalAlpha = .75; pctx.fillRect(-3, -1.6, 6, 3.2 * Math.abs(Math.cos(t.w * 1.7)) + .6); pctx.restore(); });
    if (pModus === 'staub') pTeile.forEach(t => { t.w += .006; t.x += Math.sin(t.w) * .15; t.y -= t.v; if (t.y < 0) { t.y = H; t.x = Math.random() * W; } pctx.fillStyle = `rgba(255,245,220,${.12 + .12 * Math.sin(t.w * 3 + t.a * 6)})`; pctx.fillRect(t.x, t.y, 1.6, 1.6); });
    if (pModus === 'atem' && Math.random() < .004 && !pTeile.length) pTeile.push({ x: W * .5, y: H * .98, r: 10, a: .16 });
    if (pModus === 'atem') pTeile = pTeile.filter(t => { t.y -= .35; t.r += .5; t.a -= .0012; if (t.a <= 0) return false; const g = pctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r); g.addColorStop(0, `rgba(230,235,245,${t.a})`); g.addColorStop(1, 'rgba(230,235,245,0)'); pctx.fillStyle = g; pctx.fillRect(t.x - t.r, t.y - t.r, t.r * 2, t.r * 2); return true; });
    requestAnimationFrame(pSchritt);
  }
  // Partylicht im Takt der Musik (Bass), nur auf der Party
  (function takt() {
    if (partyAn && Ton.bereit) { const v = Ton.pegel(); B.style.setProperty('--beat', v.toFixed(3)); }
    else B.style.setProperty('--beat', 0);
    requestAnimationFrame(takt);
  })();

  // ---------------- Kapitelkarte, Abzeichen ----------------
  let letzterCountdown = null, ersteKarte = true;
  function naechstesBild() { for (let i = pc + 1; i < prog.length; i++) { const p = prog[i]; if (p.t === 'cmd' && p.name === 'bild') return p.arg.split(/\s+/)[0]; if (p.t === 'cmd' && p.name === 'zeitraffer') return p.arg.split(/\s+/)[0]; if (p.t === 'wahl') return null; } return null; }
  async function karte(arg) {
    let t = arg;
    if (arg.startsWith('auto')) { const z = zeit(arg.slice(4).trim()); V.uhr = Math.max(V.uhr, z); const d = Math.floor(V.uhr / 1440); t = `${TAGE[d]}. ${uhrText()}. Noch ${Math.floor((PRUEFUNG - V.uhr) / 60)} Stunden.`; zeigeUhr(); }
    zeigeTextbox(false); Handy.zu();
    verlauf.push({ n: '', t, g: false });
    // Aufbau: Tag/Datum klein · Uhrzeit groß · „Noch … Stunden“ zählt herunter. Dahinter ahnt man den nächsten Ort.
    const m = t.match(/^(.*?)\.\s*(\d{1,2}:\d{2})\.?\s*(Noch\s+(\d+)\s+(\S+?)\.?)?$/);
    const k = $('#karte'), tag = k.querySelector('.k-tag'), uhr = k.querySelector('.k-uhr'), noch = k.querySelector('.k-noch'), hg = k.querySelector('.k-hg');
    const nb = naechstesBild(), ne = nb && eintrag(nb); hg.style.backgroundImage = ne && ne.datei ? `url(${ne.datei})` : 'none';
    tag.textContent = m ? m[1] : t; uhr.innerHTML = m ? [...m[2]].map((c, i) => `<span style="animation-delay:${.25 + i * .07}s">${c}</span>`).join('') : '';
    const zahl = m && m[4] ? +m[4] : null, einheit = m && m[5] ? m[5] : '';
    noch.textContent = zahl !== null ? `Noch ${zahl} ${einheit}` : '';
    const erste = ersteKarte; ersteKarte = false;
    k.classList.remove('an', 'langsam'); void k.offsetWidth;
    if (erste && schnell) vz += 5.5;
    if (erste && !schnell) {
      // Vorspann: der Hauptsong läuft erst eine Weile allein, dann kommt die erste Karte ganz langsam
      Ton.intro(); k.classList.add('vorspann'); await warte(5.5); k.classList.add('langsam');
    }
    k.classList.add('an'); await warte(erste ? 2.4 : 1);
    if (zahl !== null && !schnell && letzterCountdown) {
      const von = letzterCountdown && letzterCountdown.e === einheit ? letzterCountdown.z : zahl + (einheit.startsWith('Minute') ? 7 : 3);
      const schritte = Math.max(1, Math.min(12, von - zahl));
      for (let i = 1; i <= schritte; i++) { noch.textContent = `Noch ${Math.round(von - (von - zahl) * i / schritte)} ${einheit}`; noch.classList.remove('tick'); void noch.offsetWidth; noch.classList.add('tick'); Ton.spiele('uhr', { dauer: .12, vol: .25 }); await warte(.09 + i * .012); }
    }
    if (zahl !== null) letzterCountdown = { z: zahl, e: einheit };
    await abzeichenZeigen();
    await warte(erste ? 2.2 : 1.2); await tipp(); Ton.introAus(erste ? 6 : 2.4); k.classList.remove('an', 'vorspann'); await warte(erste ? 1.6 : .8);
  }
  function abzeichen(name) { if (!S.abz.includes(name)) { S.abz.push(name); speichere(S); abzQueue.push(name); } if (!abzNeu.includes(name)) abzNeu.push(name); }
  async function abzeichenZeigen() {
    while (abzQueue.length) {
      const n = abzQueue.shift(); const t = $('#toast'); const st = (typeof ABZ_STIL !== 'undefined' && ABZ_STIL[n]) || ['★', '#ffcf4a', '#ff7a2f']; t.innerHTML = `<span class="ic bunt" style="background:linear-gradient(135deg,${st[1]},${st[2]})">${st[0]}</span><div><small style="color:#aaa;font-size:24px">Abzeichen freigeschaltet</small><br>${n}</div>`;
      t.classList.add('an'); Ton.spiele('abzeichen'); await warte(2.2); t.classList.remove('an'); await warte(.4);
    }
  }
  function toast(txt) { const t = $('#toast'); t.innerHTML = txt; t.classList.add('an'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('an'), 2000); }

  // ---------------- Befehle ----------------
  async function befehl(ins) {
    const a = ersetze(ins.arg || ''); const teile = a.split(/\s+/).filter(Boolean);
    if (/^(benachrichtigung|nachricht!?|foto|video|schreibt|tippe)$/.test(ins.name)) { blick.neu++; if (blick.offen) { blick.offen = false; Handy.zu(); } }
    switch (ins.name) {
      case 'setze': {
        const m = a.match(/^([\wÄÖÜäöüß]+)\s*(=|\+|-)?\s*(.*)$/); if (!m) break;
        if (!m[2]) V[m[1]] = true; else if (m[2] === '=') V[m[1]] = wert(m[3]); else V[m[1]] = (V[m[1]] || 0) + (m[2] === '+' ? 1 : -1) * (m[3] ? wert(m[3]) : 1);
        if (m[1] === 'uhr_zeigen') zeigeUhr(); break;
      }
      case 'text': { const m = ins.arg.match(/^(\w+)\s*=\s*(.*)$/); if (m) TEXTE[m[1]] = m[2]; break; }
      case 'abzeichenliste': ABZ = ins.arg.split('|').map(s => s.trim()); break;
      case 'gruppe': { const [n, m] = ins.arg.split('|').map(s => s.trim()); Handy.setGruppe(n, m); break; }
      case 'verlauf': { const [n, tag, z, rest] = ins.arg.split('|').map(s => s.trim()); const m = rest.match(/^([^:]+):\s*(.*)$/); Handy.alt(n, tag, z, m[1].trim(), m[2]); break; }
      case 'kapitel': kapitelZeiten.push({ n: a, t: performance.now() }); break;
      case 'pfad': pfad.push(a); pfadPlus = false; break;
      case 'pfad+': if (pfadPlus) pfad[pfad.length - 1] += ' + ' + a; else pfad.push(a); pfadPlus = true; break;
      case 'abzeichen': abzeichen(a); break;
      case 'uhr': {
        if (a.startsWith('zeigen')) { if (a.includes('sofort')) { uhrEl.style.transition = 'none'; setTimeout(() => uhrEl.style.transition = '', 50); } V.uhr_zeigen = true; zeigeUhr(); break; }
        if (a === 'aus' || a === 'verstecken') { V.uhr_zeigen = false; zeigeUhr(); break; }
        if (teile[0] === 'mind') { V.uhr = Math.max(V.uhr, zeit(teile.slice(1).join(' '))); zeigeUhr(); break; }
        if (teile[0] === 'springe') { await uhrSpringe(zeit(teile.slice(1).join(' '))); break; }
        if (teile[0] === 'laufen') { await uhrLaufen(zeit(teile.slice(1).join(' '))); break; }
        if (a.startsWith('+')) { V.uhr += +wert(a.slice(1)) || 0; zeigeUhr(); break; }
        V.uhr = zeit(a); zeigeUhr(); break;
      }
      case 'karte': await karte(a); break;
      case 'bild': await zeigeBild(teile[0], teile[1] || ''); break;
      case 'schwarz': zeigeTextbox(false); $('#schwarz').classList.toggle('langsam', a === 'langsam'); $('#schwarz').style.transition = a === 'schnitt' ? 'none' : ''; $('#schwarz').classList.add('an'); await warte(a === 'langsam' ? 1.8 : a === 'schnitt' ? .05 : .5); $('#schwarz').style.transition = ''; break;
      case 'zeitraffer': for (const c of teile) { Ton.spiele('whoosh_kurz', { vol: .7 }); await zeigeBild(c, 'schnitt'); Ton.spiele('uhr', { dauer: .5, vol: .5 }); await warte(.95); } break;
      case 'gesicht': if (a === 'aus') gesicht(null, false); else gesicht(teile[0]); if (teile[1]) await warte(+teile[1]); break;
      case 'montage': await montage(); break;
      case 'klausur': $('#klausur').classList.toggle('an', a !== 'aus'); if (a !== 'aus') { Ton.spiele('blaettern', { vol: .6 }); await warte(.4); } break;
      case 'karteikarten': await karteikarten(a); break;
      case 'lernplan': await lernplan(teile); break;
      case 'zuruf': { Ton.spiele('jubel', { vol: .9 }); kamera.classList.remove('ruck'); void kamera.offsetWidth; kamera.classList.add('ruck'); await text({ t: 'text', text: a, sprecher: 'Alle', schrei: true, auto: true, stil: '' }); await warte(.5); break; }
      case 'eingabe': zeigeTextbox(false); await Handy.rein(); await Handy.eintippen(a); break;
      case 'senden': zeigeTextbox(false); await Handy.abschicken(); await warte(.6); break;
      case 'loeschen': zeigeTextbox(false); await Handy.wegloeschen(); await warte(.3); break;
      case 'zettel': { const z = $('#zettel'); if (a === 'aus') z.classList.remove('an'); else { z.textContent = a; z.classList.add('an'); } break; }
      case 'effekt': await effekt(teile[0], teile.slice(1).join(' ')); break;
      case 'party': party(a !== 'aus'); break;
      case 'shutdown': await shutdown(); break;
      case 'fenster_aus': await fensterAus(zeit(a)); break;
      case 'grossuhr': { const g = $('#grossuhr'); if (a === 'aus') g.classList.remove('an'); else { V.uhr = zeit(a); g.textContent = uhrText(); g.classList.add('an'); Ton.spiele('klick'); } break; }
      case 'warte': await warte(+a || 1); break;
      case 'analoguhr': await analoguhr(a); break;
      case 'film': await film(a); break;
      case 'schema': await schema(a); break;
      case 'tipp': await tipp(); break;
      case 'ton': case 'ton!': {
        let n = teile[0]; const o = { leise: teile.includes('leise'), dumpf: teile.includes('dumpf') };
        if (teile.includes('fenster')) { o.lp = 1100; o.vol = .8; }
        teile.forEach(x => { let m = x.match(/^ab(\d+(?:\.\d+)?)$/); if (m) o.ab = +m[1]; m = x.match(/^(\d+(?:\.\d+)?)s$/); if (m) o.dauer = +m[1]; });
        if (n === 'bzzz_dumpf') { n = 'bzzz'; o.dumpf = true; o.phantom = true; }
        if (n === 'bzzz_doppel') n = 'bzzz';
        const d = n === 'bzzz' ? bzzz(o) : Ton.spiele(n, o);
        if (ins.name === 'ton!' && schnell) vz += (d || 0) + .8;
        if (ins.name === 'ton!' && !schnell) { textbox.classList.contains('an') && zeigeTextbox(false); await warte(d + .8); }
        break;
      }
      case 'raum': Ton.loop('raum_nacht', a === 'nacht'); Ton.loop('raum_tag', a === 'tag'); break;
      case 'loop': Ton.loop(teile[0], teile[1] !== 'aus'); break;
      case 'stille': Ton.stille(); break;
      case 'musik': {
        if (teile[0] === 'aus') { Ton.musik('aus', teile[1]); break; }
        if (teile[0] === 'lied') { Ton.musik('lied', teile[1]); break; }
        { const lang = teile.includes('langsam'); const st = teile.slice(1).filter(x => x !== 'langsam').join(''); if (lang && st) { Ton.musik(teile[0], st); Ton.musikStufe(st, true); } else Ton.musik(teile[0], st); } break;
      }
      case 'banner': {
        const b = $('#banner'); if (a === 'aus') { b.classList.remove('an'); break; }
        const [app, t, x] = a.split('|').map(s => s.trim());
        b.innerHTML = `<span class="nic" style="width:64px;height:64px;font-size:32px;background:${app === 'Instagram' ? 'linear-gradient(45deg,#f9a825,#e91e63,#7b1fa2)' : '#25d366'}">${app === 'Instagram' ? '◎' : '✆'}</span><div><div class="t">${t}</div><div class="x">${x || ''}</div></div>`;
        b.classList.add('an'); await warte(.5); break;
      }
      case 'anruf_unbemerkt': { const m = $('#anrufmini'); if (a === 'aus') { m.classList.remove('an'); Ton.loop('klingel', false); } else { m.innerHTML = `<span style="font-size:40px">✆</span><span>${a}<br><small style="opacity:.7;font-size:24px">Eingehender Anruf</small></span>`; m.classList.add('an'); Ton.spiele('anruf', { dumpf: true, leise: true, dauer: 5.5 }); } break; }
      case 'vibrieren': { const n = +a || 4; let d = .7; for (let i = 0; i < n; i++) { bzzz(); effekt('handylicht', 'kurz'); kamera.classList.remove('wackeln'); void kamera.offsetWidth; kamera.classList.add('wackeln'); await warte(d); d *= .7; } break; }
      case 'zettel_aus': break;
      // ---- Handy ----
      case 'handy': await handyBefehl(teile, a); break;
      case 'benachrichtigung': { const [app, t, x, z] = a.split('|').map(s => s.trim()); Handy.benachrichtigung(app, t, x, z); await warte(.35); break; }
      case 'wohlbefinden': Handy.benachrichtigung('Wohlbefinden', 'Digitales Wohlbefinden', a); bzzz({ leise: true }); await warte(.4); break;
      case 'nachricht': case 'nachricht!': { const m = a.match(/^([^:]+):\s*(.*)$/); await Handy.nachricht(m[1].trim(), m[2], ins.name.endsWith('!')); break; }
      case 'ich': await Handy.ich(a); await warte(.2); break;
      case 'tippe': zeigeTextbox(false); await Handy.rein(); await Handy.tippeUndSende(a); await warte(.5); break;
      case 'schreibt': await Handy.schreibt(teile[0], +teile[1] || 2); break;
      case 'haken': Handy.haken(a); break;
      case 'foto': await Handy.foto(teile[0], teile[1] || 'Mia'); break;
      case 'video': await Handy.foto(teile[0], teile[1] || 'Mia', 'video'); break;
      case 'entwurf': zeigeTextbox(false); await Handy.entwurf(a); break;
      case 'aufrufe': Handy.aufrufe(a); Ton.spiele('empfang'); break;
      // ---- Ablauf ----
      case 'rufe': stack.push(pc + 1); springe(a.trim()); return 'sprung';
      case 'zurueck': pc = stack.pop(); return 'sprung';
      case 'titel': await titel(a); break;
      case 'laehmung': await laehmung(a.split('|').map(x => x.trim().replace(/^„|“$/g, ''))); break;
      case 'ende_spiel': await endeSpiel(); return 'stopp';
      default: console.warn('Befehl?', ins.name);
    }
  }
  const NACHSCHUB = [['WhatsApp', 'Lenas Geburtstag 🎂', 'Mia: WO BIST DU'], ['Instagram', 'tim.dreams', 'tim.dreams hat eine Story gepostet'], ['WhatsApp', 'Lenas Geburtstag 🎂', 'Jonas: 🎥 Video'], ['WhatsApp', 'Lenas Geburtstag 🎂', 'Lena: ich liebe euch 😭'], ['Instagram', 'mia.chaos', 'mia.chaos hat dich in einem Beitrag markiert'], ['WhatsApp', 'Lenas Geburtstag 🎂', 'Tim: afterparty bei mir??']];
  // Schreibtisch-Ich-Sicht: hält er das Handy, liegen die Hände nicht auf dem Tisch.
  // Hat ein Bild „ohneHaende“ (eigene Datei vorhanden), wird beim Handy darauf gewechselt und beim Weglegen zurück.
  function haendeTausch(was) {
    if (!aktBild) return;
    const zu = was === 'zu' || was === 'weg';
    if (!zu && aktBild.ohneHaende && BILDER[aktBild.ohneHaende] && BILDER[aktBild.ohneHaende].datei) zeigeBild(aktBild.ohneHaende, 'geste');
    else if (zu && aktBild.mitHaenden) zeigeBild(aktBild.mitHaenden, 'geste');
  }
  async function handyBefehl(t, a) {
    const was = t[0];
    if (blick.offen) { blick.offen = false; Handy.zu(); }
    if (was === 'zu' || was === 'weg') blick.neu = 0; else blick.neu++;
    if (!['fotozoom', 'notizen', 'kommentar'].includes(was)) haendeTausch(was);
    switch (was) {
      case 'sperr': Handy.sperr(); zeigeTextbox(false); await warte(.5); break;
      case 'chat': zeigeTextbox(false); await Handy.vorChat(t.slice(1).join(' ')); await warte(.2); break;
      case 'zoegern': zeigeTextbox(false); await Handy.zoegern(t[1]); break;
      case 'umfrage': { zeigeTextbox(false); const [f, ...o] = t.slice(1).join(' ').split('|').map(x => x.trim()); await Handy.umfrage(f, o); break; }
      case 'stimme': await Handy.stimme(+t[1], t[2]); break;
      case 'live': zeigeTextbox(false); await Handy.live(t[1], t[2] || 23); break;
      case 'kommentar': { const [n, x] = t.slice(1).join(' ').split('|').map(y => y.trim()); await Handy.liveKommentar(n, x); break; }
      case 'liveeingabe': zeigeTextbox(false); await Handy.liveEingabe(t.slice(1).join(' ')); break;
      case 'livesenden': await Handy.liveSenden(); break;
      case 'liveloeschen': await Handy.liveLoeschen(); break;
      case 'gruppe': zeigeTextbox(false); await Handy.vorChat('gruppe'); await warte(.2); break;
      case 'liste': zeigeTextbox(false); Handy.liste(); await warte(.6); break;
      case 'zu': Handy.zu(); Handy.fotozoomWeg(); await warte(.4); break;
      case 'weg': Handy.weg(); await warte(.5); break;
      case 'her': Handy.fotozoomWeg(); Handy.her(); await warte(.5); break;
      case 'story': zeigeTextbox(false); await Handy.story(t[1], t[2]); break;
      case 'post': zeigeTextbox(false); Handy.post(t[1], t.slice(2).join(' ')); Ton.spiele('senden'); await warte(1.5); break;
      case 'anruf': {
        if (t[1] === 'an') Handy.anrufAn();
        else if (t[1] === 'aufgelegt') await Handy.anrufEnde(false);
        else if (t[1] === 'abgelehnt') await Handy.anrufEnde(true);
        else { zeigeTextbox(false); Handy.anruf(t[1]); await warte(.8); }
        break;
      }
      case 'fotozoom': await Handy.fotozoom(); break;
      case 'notizen': if (t[1] === 'datum') await Handy.notizenDatum(); else Handy.notizen(); break;
      case 'notizneu': zeigeTextbox(false); await Handy.notizNeu(t.slice(1).join(' ')); break;
      case 'notizzeile': zeigeTextbox(false); await Handy.notizZeile(t.slice(1).join(' ')); break;
      case 'notizfix': { zeigeTextbox(false); const [alt, neu] = t.slice(1).join(' ').split('|'); await Handy.notizFix(alt, neu); break; }
      case 'karussell': zeigeTextbox(false); await Handy.karussell(t[1]); break;
      case 'allesweg': zeigeTextbox(false); await Handy.allesWegwischen(NACHSCHUB); break;
      case 'livedrehen': await Handy.liveDrehen(t[1]); break;
      case 'storys': zeigeTextbox(false); await Handy.storys(t.slice(1)); break;
      case 'feed': Handy.feed(); break;
      case 'video': Handy.video(t[1]); break;
      case 'stumm': zeigeTextbox(false); await Handy.stumm(); break;
      case 'aus': Handy.aus(); break;
      case 'hinweis': { const [app, tt, x] = a.slice(8).split('|').map(s => s.trim()); Handy.hinweis(app, tt, x); await warte(.8); break; }
      case 'wegwischen': await Handy.wegwischen(); break;
      default: console.warn('Handy?', was);
    }
  }
  // Lähmung (Weg B): Tippt man eine Wahl an, wird sie grau, und es passiert nichts. Bis beide grau sind.
  async function laehmung(labels) {
    weiterEl.classList.remove('an'); wahlEl.innerHTML = ''; const g = gen; const knoepfe = [];
    await new Promise(res => {
      let fertig = false; const pruefe = () => { if (!fertig && knoepfe.every(b => b.classList.contains('grau'))) { fertig = true; res(); } };
      labels.forEach((l, i) => { const b = document.createElement('button'); b.textContent = l; b.style.animationDelay = (i * .07) + 's';
        b.onclick = ev => { ev.stopPropagation(); if (g !== gen || b.classList.contains('grau')) return; Ton.spiele('klick'); b.classList.add('grau'); pruefe(); };
        wahlEl.appendChild(b); knoepfe.push(b); });
      setTimeout(() => { knoepfe.forEach(b => b.classList.add('grau')); pruefe(); }, schnell ? 300 : 10000);
    });
    pruef(g); await warte(3); wahlEl.innerHTML = '';
  }
  async function titel(art) {
    const ti = $('#titel'), sp = ti.querySelector('span');
    let von = { x: 960, y: 900, s: .3 };
    if (art === 'blase') { const bl = [...document.querySelectorAll('#handy .msg .blase')].pop(); if (bl) { const r = bl.getBoundingClientRect(), rb = B.getBoundingClientRect(), sk = rb.width / 1920; von = { x: (r.left + r.width / 2 - rb.left) / sk, y: (r.top + r.height / 2 - rb.top) / sk, s: .22 }; } }
    sp.innerHTML = 'Du <i>verpasst</i> was'; sp.classList.remove('durch', 'zieh'); sp.style.transition = 'none'; sp.style.transform = `translate(${von.x - 960}px,${von.y - 540}px) scale(${von.s})`; sp.style.opacity = .9;
    if (art === 'durch') {
      // Lynn-Ende: Titel blendet ein, ein Rotstift streicht ihn durch, 2 s Stille, dann erst die Musik
      sp.style.transform = 'none'; sp.style.opacity = 0; sp.classList.add('durch'); ti.classList.add('an'); void sp.offsetWidth;
      zeigeTextbox(false); Ton.stille(); sp.style.transition = 'opacity 1.6s ease'; sp.style.opacity = 1; await warte(2.4);
      sp.classList.add('zieh'); Ton.spiele('PR3_stift', { dauer: .7, vol: 1.1 }); await warte(.9);
      await warte(2); Ton.outro('warm');
      setTimeout(() => { Handy.zu(); $('#schwarz').classList.add('an', 'langsam'); }, 1600);
      await warte(4); await tipp(); return;
    }
    ti.classList.add('an'); void sp.offsetWidth;
    zeigeTextbox(false); Ton.outro();
    await warte(.2); sp.style.transition = ''; sp.style.transform = 'none';
    setTimeout(() => { Handy.zu(); $('#schwarz').classList.add('an', 'langsam'); }, 600);
    await warte(4); await tipp();
  }

  // ---------------- Ablauf ----------------
  function springe(ziel) {
    if (labels[ziel] === undefined) { console.error('Sprungziel fehlt:', ziel); toast('Sprungziel fehlt: ' + ziel); pc = prog.length; return; }
    pc = labels[ziel];
  }
  async function lauf() {
    const g = gen;
    try {
      while (pc < prog.length) {
        pruef(g); const ins = prog[pc];
        if (DEBUG) dbgInfo(ins);
        switch (ins.t) {
          case 'label': besuchtL.add(ins.name); pc++; break;
          case 'sprung': springe(ins.ziel); break;
          case 'text': await text(ins); pc++; break;
          case 'wahl': await wahl(ins); break;
          case 'wenn': if (wert(ins.cond)) pc++; else pc = (ins.sonst !== undefined ? ins.sonst : ins.ende) + 1; break;
          case 'sonst': pc = ins.ende + 1; break;
          case 'ende': pc++; break;
          case 'cmd': {
            // Ein kaputter Effekt darf nie das ganze Spiel anhalten: Fehler merken, weiter mit der nächsten Zeile
            let r; try { r = await befehl(ins); } catch (e) { if (e === ABBRUCH) throw e; console.error(e); fehlerLog.push(`Zeile ${ins.nr + 1}: ` + String(e && e.stack || e)); r = null; }
            if (r === 'stopp') return; if (r !== 'sprung') pc++; break;
          }
        }
      }
    } catch (e) { if (e !== ABBRUCH) { console.error(e); fehlerLog.push(String(e && e.stack || e)); toast('Fehler: ' + e.message); } }
  }
  function grundzustand() {
    V = { punkte: 0, besucht: 0, lynn: '', weg: '', typ: '', ankunft: 0, aufbruch: 0, abmarsch: 0, uhr: zeit('20:04'), uhr_zeigen: false };
    verlauf = []; kapitelZeiten = []; pfad = []; pfadPlus = false; abzNeu = []; abzQueue = []; stack = [];
    blick.offen = false; blick.zahl = 0; blick.leer = 0; blick.neu = 0;
    welt.innerHTML = ''; aktBild = null; party(false); effekt('alles_aus');
    ['#schwarz', '#karte', '#zettel', '#banner', '#anrufmini', '#grossuhr', '#titel', '#toast', '#klausur', '#karteikarten', '#lernplan', '#handylicht'].forEach(s => $(s).classList.remove('an'));
    $('#karte').classList.remove('vorspann', 'langsam'); ersteKarte = true; letzterCountdown = null; pModus = '';
    $('#schwarz').classList.add('an'); wahlEl.innerHTML = ''; zeigeTextbox(false); Handy.reset(); Ton.stille(); fensterOverlay(false); zeigeUhr();
  }
  function neustart(label) {
    gen++; if (tippWarter) tippWarter(); tippt = false; Rahmen.weg();
    document.querySelectorAll('.schirm').forEach(s => s.classList.remove('an'));
    Ton.outroAus(); grundzustand(); S.durchgaenge++; speichere(S); pc = 0; t0 = performance.now(); rueck = []; rueckZu(); lynnHand = 0; $('#schema').classList.remove('an'); $('#analoguhr').classList.remove('an'); auMin = null;
    if (label) { // Einstellungen am Anfang trotzdem ausführen
      const ende = labels['PROLOG']; prog.slice(0, ende).forEach(p => { if (p.t === 'cmd' && ['setze', 'text', 'abzeichenliste', 'gruppe', 'verlauf'].includes(p.name)) befehl(p); });
      springe(label);
    }
    lauf();
  }

  // ---------------- Ende ----------------
  async function endeSpiel() {
    const p = V.punkte || 0; const ende = p <= V.LEISER_BIS ? 'Leiser' : p <= V.HIER_ODER_DA_BIS ? 'Hier oder da' : 'Blaues Licht';
    kapitelZeiten.push({ n: 'Ende', t: performance.now() });
    pfad.push(ende); abzeichen(ende); if (!S.enden.includes(ende)) S.enden.push(ende); speichere(S);
    abzQueue = [];   // die neuen Abzeichen zeigt der Rahmen selbst (gestempelt)
    const neu = abzNeu.slice();
    await warte(.6); $('#titel').classList.remove('an');
    const testUhr = TESTMODUS ? async () => { stoppuhrZeigen(ende); const su = $('#stoppuhr'); su.classList.add('an'); await knopfWarten(su.querySelector('button')); su.classList.remove('an'); } : null;
    Rahmen.variante = V.typ === 'gluecklich' ? 'lynn' : '';
    await Rahmen.ende(ende, neu, testUhr);
  }
  const knopfWarten = b => new Promise(r => b.onclick = r);
  function stoppuhrZeigen(ende) {
    const k = kapitelZeiten; let rows = '';
    const fmt = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + zwei(s % 60); };
    const zus = {}; for (let i = 0; i < k.length - 1; i++) zus[k[i].n] = (zus[k[i].n] || 0) + (k[i + 1].t - k[i].t);
    for (const [n, ms] of Object.entries(zus)) rows += `<tr><td>${n}</td><td>${fmt(ms)}</td></tr>`;
    const ges = k.length ? k[k.length - 1].t - k[0].t : 0;
    $('#stoppuhr .inhalt').innerHTML = `<table>${rows}<tr><td><b>Gesamt</b></td><td><b>${fmt(ges)}</b></td></tr></table><p style="margin-top:30px">Weg: <b>${pfad.join(' → ')}</b></p><p>Handy-Punkte: <b>${V.punkte}</b> &nbsp;·&nbsp; Ende: <b>${ende}</b></p>`;
  }
  // ---------------- Verlauf, Zurück, Debug ----------------
  $('#zurueckknopf').onclick = e => {
    e.stopPropagation(); const b = e.currentTarget;
    const start = textbox.classList.contains('an') ? rueck.length - 1 : rueck.length;
    const pos = rueckPos < 0 ? start : rueckPos;
    if (pos > 0 && rueck.length && !wahlEl.children.length) { rueckPos = pos - 1; pausiert = true; rb.classList.add('an'); rb.classList.toggle('links', document.getElementById('buehne').classList.contains('handyoffen')); zeigeRueck(rueck[rueckPos]); return; }
    b.classList.remove('wackelt'); void b.offsetWidth; b.classList.add('wackelt'); toast(TEXTE.zurueck || 'Hättest du wohl gern, oder?');
  };
  $('#verlaufknopf').onclick = e => { e.stopPropagation(); const v = $('#verlauf'); v.innerHTML = '<button class="zu">✕</button>' + verlauf.map(z => `<div class="zeile${z.g ? ' g' : ''}">${z.n ? `<b>${z.n}</b>` : ''}${z.t}</div>`).join(''); v.classList.add('an'); v.scrollTop = v.scrollHeight; v.querySelector('.zu').onclick = ev => { ev.stopPropagation(); v.classList.remove('an'); }; };
  let uhrKlicks = 0; uhrEl.onclick = () => { uhrKlicks++; clearTimeout(uhrEl.t); uhrEl.t = setTimeout(() => uhrKlicks = 0, 1500); if (uhrKlicks >= 5) debugAn(); };
  function debugAn() { $('#dbgknopf').style.display = 'block'; }
  function dbgInfo(ins) {
    const d = $('#dbginfo'); if (!d || !$('#debug').classList.contains('an')) return;
    const flags = Object.entries(V).filter(([k]) => !/^[A-Z_]+$/.test(k)).map(([k, v]) => `${k}=${k === 'uhr' || k === 'ankunft' || k === 'aufbruch' || k === 'abmarsch' ? uhrText(v) : JSON.stringify(v)}`).join('  ');
    d.textContent = `Zeile ${ins.nr + 1} · Handy-Punkte: ${V.punkte}\nWeg: ${pfad.join(' → ')}\n${flags}`;
  }
  const VORLAGEN = {
    'Prolog': ['PROLOG', {}],
    'Kapitel 1': ['K1', {}],
    'Weg A (lernen)': ['KAP2_A', {}],
    'Weg B (Bett)': ['KAP2_B', {}],
    'Weg C (Aufbruch 21:20)': ['S18_C', {}],
    'A: Anruf 22:45 (Flow)': ['ANRUF_A', { weg: 'A', flow: true, uhr: '22:45', uhr_zeigen: true }],
    'A: Anruf 22:45 (geschaut)': ['ANRUF_A', { weg: 'A', uhr: '22:45', uhr_zeigen: true, punkte: 1 }],
    'B: Überforderung 22:45': ['B_UEBER', { weg: 'B', uhr: '22:45', uhr_zeigen: true }],
    'A: Auftauchen 23:40': ['L5', { weg: 'A', flow: true, uhr: '23:40', uhr_zeigen: true }],
    'Party pünktlich (21:40)': ['PARTY_ANKUNFT', { uhr: '21:40', aufbruch: '21:20', uhr_zeigen: true, zugesagt: true }],
    'Party um 22:40 (Weg B)': ['PARTY_ANKUNFT', { uhr: '22:40', aufbruch: '22:20', weg: 'B', uhr_zeigen: true }],
    'Party nach dem Anruf (23:07)': ['PARTY_ANKUNFT', { uhr: '23:07', aufbruch: '22:47', weg: 'A', uhr_zeigen: true }],
    'Spät auf der Party (23:51)': ['PARTY_ANKUNFT', { uhr: '23:51', aufbruch: '23:31', weg: 'A', uhr_zeigen: true }],
    'Balkon (pünktlich)': ['BALKON', { uhr: '22:15', ankunft: '21:40', uhr_zeigen: true, besucht: 1, tanz: true, typ: 'party' }],
    'Bad 23:20': ['BAD', { uhr: '23:20', ankunft: '21:40', uhr_zeigen: true, besucht: 2, kueche: true, tanz: true, lied: true, mama: true, typ: 'party' }],
    'Kapitel 4 zu Hause': ['NACHT_ZUHAUSE', { weg: 'A', uhr: '23:40', uhr_zeigen: true }],
    'Kapitel 4 nach der Party': ['NACHT_PARTY', { uhr: 'Sa 01:00', ankunft: '21:40', uhr_zeigen: true, kueche: true, balkon: true, lynn: 'geschaut', typ: 'party' }],
    'Samstag zu Hause': ['SAMSTAG', { weg: 'A', typ: 'zuhause', uhr_zeigen: true, phantom: true }],
    'Samstag Afterparty': ['SAMSTAG', { typ: 'afterparty', uhr_zeigen: true, punkte: 2 }],
    'Sonntag': ['SONNTAG', { weg: 'B', typ: 'zuhause', uhr_zeigen: true }],
    'Prüfung (Party)': ['MONTAG', { typ: 'party', uhr_zeigen: true, punkte: 4 }],
    'Prüfung (Leiser)': ['MONTAG', { typ: 'zuhause', weg: 'A', phantom: true, uhr_zeigen: true, punkte: 0 }],
    'Prüfung (glücklich)': ['MONTAG', { typ: 'gluecklich', lynn: 'gm', uhr_zeigen: true, punkte: 3 }],
  };
  function debugBauen() {
    const d = $('#debug');
    d.innerHTML = `<b>DEBUG</b><pre id="dbginfo" style="white-space:pre-wrap;font-size:20px;color:#9f9;margin:10px 0"></pre>
      <div>Vorlage:</div><select id="dbgvorlage">${Object.keys(VORLAGEN).map(k => `<option>${k}</option>`).join('')}</select><button id="dbgvgo">Springen</button>
      <div style="margin-top:10px">Szene:</div><select id="dbgszene">${Object.keys(labels).map(k => `<option>${k}</option>`).join('')}</select><button id="dbgsgo">Springen</button>
      <div style="margin-top:10px"><label><input type="checkbox" id="dbgschnell"> schneller Text</label></div>
      <button id="dbgplus">+1 Handy</button> <button id="dbgminus">−1 Handy</button> <button id="dbgreset">Abzeichen/Enden löschen</button>
      <div id="dbgfehler" style="color:#f88;margin-top:10px"></div>`;
    const setze = obj => { for (const [k, v] of Object.entries(obj)) V[k] = typeof v === 'string' && /\d:\d\d$/.test(v) ? zeit(v) : v; zeigeUhr(); };
    $('#dbgvgo').onclick = e => { e.stopPropagation(); const [l, o] = VORLAGEN[$('#dbgvorlage').value]; neustart(l); setze(o); };
    $('#dbgsgo').onclick = e => { e.stopPropagation(); neustart($('#dbgszene').value); V.uhr_zeigen = true; zeigeUhr(); };
    $('#dbgschnell').onchange = e => schnell = e.target.checked;
    $('#dbgplus').onclick = () => V.punkte++; $('#dbgminus').onclick = () => V.punkte--;
    $('#dbgreset').onclick = () => { S = { abz: [], enden: [], entsch: {}, durchgaenge: 0, laeufe: 0, nachr: 0, endenGezeigt: 0 }; speichere(S); toast('gelöscht'); };
    $('#dbgfehler').textContent = pruefeSkript().join('\n');
    $('#dbgknopf').onclick = e => { e.stopPropagation(); d.classList.toggle('an'); };
    if (DEBUG) debugAn();
  }

  // ---------------- Bühne skalieren, Start ----------------
  function passe() {
    const w = window.innerWidth, h = window.innerHeight; const s = Math.min(w / 1920, h / 1080);
    B.style.transform = `translate(${(w - 1920 * s) / 2}px,${(h - 1080 * s) / 2}px) scale(${s})`;
  }
  window.addEventListener('resize', passe); window.addEventListener('orientationchange', () => setTimeout(passe, 300)); passe();
  if (window.visualViewport) visualViewport.addEventListener('resize', passe);

  // ---------------- Vollbild (V8.2) ----------------
  // Fester Knopf oben rechts. Am Handy holt jeder Tipp automatisch zurück ins Vollbild,
  // am PC nur der Knopf (Esc soll dort weiter funktionieren).
  const IPHONE = /iPhone|iPod/.test(navigator.userAgent);
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const fsGeht = () => { const d = document.documentElement; return !!(d.requestFullscreen || d.webkitRequestFullscreen) && document.fullscreenEnabled !== false; };
  function vollbildAn() {
    if (fsEl() || !fsGeht()) return null;
    const d = document.documentElement; let p = null;
    try { p = d.requestFullscreen ? d.requestFullscreen({ navigationUI: 'hide' }) : d.webkitRequestFullscreen(); } catch (e) { }
    const danach = () => { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => { }); } catch (e) { } setTimeout(passe, 250); };
    if (p && p.then) return p.then(danach).catch(() => { }); danach(); return null;
  }
  function vollbildAus() { try { if (document.exitFullscreen) document.exitFullscreen().catch(() => { }); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); } catch (e) { } }
  const vbKnopf = document.getElementById('vollbildknopf');
  function vbIcon() { const an = !!fsEl(); vbKnopf.classList.toggle('an', an); vbKnopf.title = an ? 'Vollbild beenden' : 'Vollbild'; vbKnopf.setAttribute('aria-label', vbKnopf.title); }
  ['pointerdown', 'pointerup', 'touchend', 'mousedown'].forEach(t => vbKnopf.addEventListener(t, e => e.stopPropagation()));
  vbKnopf.addEventListener('click', e => {
    e.stopPropagation(); e.preventDefault();
    if (IPHONE && !fsGeht()) { toast('iPhone: Safari erlaubt kein Vollbild.<br>Quer halten, dann ist die Leiste fast weg.'); return; }
    if (fsEl()) vollbildAus(); else vollbildAn();
  });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(t => document.addEventListener(t, () => { vbIcon(); setTimeout(passe, 120); setTimeout(passe, 500); }));
  // jeder Tipp am Handy: zurück ins Vollbild (pointerup/touchend zählen als Nutzer-Geste)
  const tippVollbild = e => { if (e.pointerType === 'mouse') return; if (e.target && e.target.closest && e.target.closest('#vollbildknopf')) return; if (!fsEl()) vollbildAn(); };
  addEventListener('pointerup', tippVollbild, true); addEventListener('touchend', tippVollbild, true);
  vbIcon();
  // Körnung
  (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const d = x.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); const k = $('#koernung'); k.style.background = `url(${c.toDataURL()})`; k.style.inset = '-60px'; })();

  function init() {
    const src = document.getElementById('story').textContent;
    const r = parse(src); prog = r.P; labels = r.L;
    // Texte vorab lesen (für Startbildschirm)
    prog.forEach(p => { if (p.t === 'cmd' && p.name === 'text') befehl(p); if (p.t === 'cmd' && p.name === 'abzeichenliste') befehl(p); });
    const fehler = pruefeSkript(); if (fehler.length) console.warn('Skript-Hinweise:\n' + fehler.join('\n'));
    debugBauen();
    const ios = /iPhone|iPod/.test(navigator.userAgent);
    $('#drehen').classList.add('aktiv');
    Rahmen.init({
      TEXTE, S: () => S, speichere: () => speichere(S), abz: () => ABZ, blick: () => ({ zahl: blick.zahl, leer: blick.leer }),
      entscheidungen() { const alle = prog.filter(p => p.t === 'wahl').reduce((n, p) => n + p.opts.length, 0); return [Math.max(0, alle - Object.keys(S.entsch).length), alle]; },
      iosHinweis: ios ? 'iPhone: Safari erlaubt kein Vollbild für Webseiten. Am besten quer halten und die Adressleiste ausblenden.' : '',
      async ersterTipp() {
        Ton.init();
        await vollbildAn();
      },
      spielen() { Ton.init(); neustart(); },
    });
    grundzustand();
    Rahmen.start(false);
    setTimeout(vorladenAlle, 800);
  }

  return {
    init, uhrText, datumText, bildHTML, bzzz, pause, get schnell() { return schnell; },
    get V() { return V; }, get pfad() { return pfad; }, get pc() { return pc; }, get prog() { return prog; }, get labels() { return labels; },
    _debug: { zeit, zeigeUhr, get vz() { return vz; }, vzPlus: x => { vz += x; }, get textZahl() { return textZahl; }, nullTexte: () => { textZahl = 0; vz = 0; }, neustart, besuchtL, fehlerLog, pruefeSkript, get aktuell() { return prog[pc]; }, tippen: () => { if (tippt) ueberspringen = true; else if (tippWarter) tippWarter(); }, setSchnell: v => schnell = v },
  };
})();
