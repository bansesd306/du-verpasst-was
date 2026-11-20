// =====================================================================
//   HANDY – Samsung / One UI, Dunkelmodus (alles HTML, keine Bilder nötig)
// =====================================================================
const KONTAKTE = {
  Jonas: { farbe: '#e8833a', name: 'Jonas' },
  Lena: { farbe: '#e0558e', name: 'Lena' },
  Tim: { farbe: '#22a39a', name: 'Tim' },
  Mia: { farbe: '#9b6ad8', name: 'Mia' },
  Lynn: { farbe: '#3d4a66', name: 'Lynn', info: 'Seminar Schuldrecht AT' },
  Ben: { farbe: '#4f8ad6', name: 'Ben' },
  Mama: { farbe: '#c0a062', name: 'Mama' },
  Paul: { farbe: '#7cb342', name: 'Paul', info: 'Lerngruppe Schuldrecht' },
};
const GRUPPENFARBE = { Paul: '#9ccc65', Sophie: '#4dd0e1', Max: '#ff8a65', Leo: '#ba68c8', Jonas: '#f5a623', Lena: '#ff6b9a', Tim: '#35c9b0', Mia: '#b48cff', Ben: '#6fb3ff', Lynn: '#ffd166' };

const Handy = (() => {
  const el = document.getElementById('handy');
  const $ = s => el.querySelector(s);
  const chats = {}; // name -> [{von,text,zeit,typ,haken,bild}]
  const meta = {};  // name -> {vorschau, zeit, ungelesen, n}
  let zaehler = 0, warteAuf = null;
  // Tage: 0 = Freitag (Spielbeginn). Datumstrenner und Zeiten in der Liste hängen vom heutigen Spieltag ab.
  const WTAG = { '-3': 'Dienstag', '-2': 'Mittwoch', '-1': 'Donnerstag', 0: 'Freitag', 1: 'Samstag', 2: 'Sonntag', 3: 'Montag' };
  const TAG_AUS_TEXT = { Gestern: -1, Mittwoch: -2, Dienstag: -3, Donnerstag: -1, Heute: 0 };
  function heute() { try { return Math.floor(Spiel.V.uhr / 1440); } catch (e) { return 0; } }
  function tagLabel(i) { const d = heute() - i; return d <= 0 ? 'Heute' : d === 1 ? 'Gestern' : (WTAG[i] || ''); }
  function merke(n, vorschau, zeit, ungelesen, tagIdx) { const m = meta[n] || (meta[n] = { ungelesen: 0 }); m.vorschau = vorschau; m.zeit = zeit; m.tagIdx = tagIdx == null ? heute() : tagIdx; m.n = ++zaehler; if (ungelesen) m.ungelesen += ungelesen; }
  const istGruppe = n => n === 'gruppe' || !!(meta[n] && meta[n].gruppe);
  function vorschauVon(m) { const t = m.typ === 'foto' ? '📷 Foto' : m.typ === 'video' ? '🎥 Video' : m.typ === 'umfrage' ? '📊 ' + m.text : m.text; return (m.von === 'Ich' ? '✓✓ ' : (istGruppe(aktChat) ? m.von + ': ' : '')) + t; }
  let gruppe = { name: 'Gruppe', mitglieder: 'Jonas, Lena, Tim' };
  let offen = false, app = null, aktChat = null, notifs = [], callTimer = null, klingelt = false;
  const warteZ = (f, r) => { if (!Spiel.schnell) return warte(r); Spiel._debug && Spiel._debug.vzPlus((r - f) / 1000); return warte(f); };
  const warte = ms => { Spiel._debug && Spiel._debug.vzPlus(ms / 1000); return new Promise(r => setTimeout(r, ms * (Spiel.schnell ? .15 : 1))).then(() => Spiel.pause()); };
  // gemessene Abstände zwischen zwei Anschlägen (WhatsApp-Aufnahme), Sekunden
  const TAKT = [.33, .26, .23, .15, .19, .10, .18, .35, .18, .16, .11, .18, .22, .18, .14, .10, .13, .13, .15, .17, .14, .24, .22, .22, .14, .16, .12, .14, .16, .20, .27];

  el.innerHTML = `
  <div class="geraet"><div class="screen">
    <div class="status"><span class="szeit">21:07</span><span class="sicons"><span class="s-stumm">🔕</span><svg class="s-wlan" viewBox="0 0 24 20"><path d="M12 17.5l2.2-2.6a3.2 3.2 0 0 0-4.4 0z M5.6 10.3l1.7 2a7.2 7.2 0 0 1 9.4 0l1.7-2a9.8 9.8 0 0 0-12.8 0z M2 6.1l1.7 2a12.6 12.6 0 0 1 16.6 0l1.7-2A15.3 15.3 0 0 0 2 6.1z" fill="#fff"/><text x="19.5" y="19" font-size="7.5" font-weight="700" fill="#fff" font-family="system-ui">6</text></svg><span class="s-netz"><i></i><i></i><i></i><i class="schwach"></i></span><span class="akku"><b>34</b></span></span></div>
    <div class="app" data-app="sperr">
      <div class="wall"></div>
      <div class="sp-oben"><div class="sp-uhr">21:07</div><div class="sp-datum">Fr., 11. Januar</div></div>
      <div class="sp-notifs"></div>
      <div class="sp-stumm">🔕</div>
    </div>
    <div class="app" data-app="chat">
      <div class="c-kopf"><span class="zur">←</span><span class="av"></span><div class="c-name"><b></b><small></small></div><span class="c-ic">▭&nbsp;&nbsp;✆&nbsp;&nbsp;⋮</span></div>
      <div class="c-msgs"></div>
      <div class="c-eingabe"><div class="pille"><span class="smi">☺</span><div class="feld"><span class="plh">Nachricht</span><span class="txt"></span><i class="cursor"></i></div><span class="clip">📎</span><span class="cam">📷</span></div><div class="mic">🎤</div></div>
      <div class="tastatur"></div>
    </div>
    <div class="app" data-app="liste">
      <div class="l-kopf"><b>WhatsApp</b><span>📷&nbsp;&nbsp;⋮</span></div>
      <div class="l-suche">🔍&nbsp; Fragen Sie Meta AI oder suchen Sie</div>
      <div class="l-chips"><span class="an">Alle</span><span>Ungelesen</span><span>Favoriten</span><span>Gruppen</span></div>
      <div class="l-zeilen"></div>
      <div class="l-fab">＋</div>
      <div class="l-nav"><span class="an"><i>💬</i>Chats</span><span><i>◌</i>Aktuelles</span><span><i>👥</i>Communities</span><span><i>✆</i>Anrufe</span></div>
    </div>
    <div class="app" data-app="anruf">
      <div class="a-bg"></div>
      <div class="a-info"><div class="a-name">Jonas</div><div class="a-sub">Eingehender Anruf</div><div class="a-av"></div></div>
      <div class="a-knoepfe"><div class="a-gruen">✆</div><div class="a-rot">✆</div></div>
    </div>
    <div class="app" data-app="story">
      <div class="st-balken"><i></i></div>
      <div class="st-kopf"><span class="av"></span><b class="st-name"></b><span class="st-zeit">26 Min.</span><span class="st-dots">⋮</span><div class="st-musik">♫ Originalton</div></div>
      <div class="st-bild"></div>
      <div class="st-fuss"><div class="st-pille">Nachricht senden</div><span>♡</span><span>➤</span></div>
      <div class="st-views"><span>👁</span> <b>0</b></div>
    </div>
    <div class="app" data-app="notizen">
      <div class="n-kopf">‹ &nbsp;Notizen</div>
      <div class="n-titel">Lernplan <span class="n-tag">Samstag</span><i class="cursor"></i></div>
      <div class="n-liste"><div>☑ 9:00 Schuldrecht AT</div><div>☐ 10:00 BGB AT</div><div>☐ 14:00 Fälle 1–5</div></div>
    </div>
    <div class="app" data-app="feed"><div class="f-kopf">Instagram</div><div class="f-rolle"></div></div>
    <div class="app" data-app="live"><div class="lv-bild"></div><div class="lv-kopf"><span class="av" style="background:#e0558e">l</span><b>lena.mln</b><span class="lv-rot">LIVE</span><span class="lv-z">👁 <b>23</b></span></div><div class="lv-k"></div><div class="lv-feld">Kommentieren …</div></div>
    <div class="app" data-app="karussell"><div class="f-kopf">Instagram</div><div class="ka-post"><div class="f-k"><span class="av" style="background:#6a5acd">s</span><b>studygram.de</b></div>
      <div class="ka-fenster"><div class="ka-band"><div class="ka-seite">5 Lerntipps, die WIRKLICH funktionieren 📚</div><div class="ka-seite b">1. Handy weglegen.</div><div class="ka-seite c">2. …</div></div></div>
      <div class="ka-punkte"><i class="an"></i><i></i><i></i><i></i><i></i></div><div class="f-a">♡ 💬 ➤</div></div></div>
    <div class="app" data-app="video"><div class="v-bild"></div><div class="v-balken"><i></i></div><div class="v-ton">🔊</div></div>
    <div class="hhinweis"><span class="h-ic"></span><div><b></b><div class="h-x"></div></div></div>
    <div class="stummtoast">🔕 Stumm</div>
    <div class="displayaus"></div>
  </div></div>`;

  // ---------- Tastatur ----------
  const reihen = ['1234567890', 'qwertzuiopü', 'asdfghjklöä', '⇧yxcvbnm⌫'];
  const tast = $('.tastatur');
  tast.innerHTML = `<div class="vorschlag"><span class="vz">‹</span><span class="vw"></span><span class="vp">···</span></div>` +
    reihen.map(r => `<div class="reihe">${[...r].map(k => `<span class="k${k === '⇧' || k === '⌫' ? ' gross' : ''}" data-k="${k}">${k}</span>`).join('')}</div>`).join('') +
    `<div class="reihe"><span class="k gross" data-k="!#1">!#1</span><span class="k" data-k="🌐">🌐</span><span class="k" data-k=",">,</span><span class="k leer" data-k=" ">Deutsch</span><span class="k" data-k=".">.</span><span class="k gross" data-k="↵">↵</span></div>`;
  function taste(z) {
    let k = z.toLowerCase();
    if (k === ' ') k = ' ';
    else if (!tast.querySelector(`[data-k="${CSS.escape(k)}"]`)) k = /[?!:;'’"„“()–-]/.test(z) ? '!#1' : null;
    if (!k) return;
    const t = tast.querySelector(`[data-k="${CSS.escape(k)}"]`); if (!t) return;
    t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
    if (z !== z.toLowerCase() && /\p{L}/u.test(z)) { const s = tast.querySelector('[data-k="⇧"]'); s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
  }

  function uhrText() { return Spiel.uhrText(); }
  function aktualisiereZeit() {
    $('.szeit').textContent = uhrText(); $('.sp-uhr').textContent = uhrText(); $('.sp-datum').textContent = Spiel.datumText();
  }
  function zeige(name) {
    el.querySelectorAll('.app').forEach(a => a.classList.toggle('an', a.dataset.app === name)); app = name;
    el.classList.toggle('dunkelstatus', name === 'story' || name === 'video');
    aktualisiereZeit();
  }
  function avatar(n, gross) {
    if (istGruppe(n)) return `<span class="av gr">👥</span>`;
    let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) % 360;
    const k = KONTAKTE[n] || { farbe: `hsl(${h},38%,42%)` }; return `<span class="av" style="background:${k.farbe}">${(n || '?')[0]}</span>`;
  }
  function oeffne() {
    if (!offen) { offen = true; el.classList.add('an'); document.getElementById('buehne').classList.add('handyoffen'); }
    el.classList.remove('weg'); $('.displayaus').classList.remove('an');
  }

  // ---------- Chatliste (WhatsApp-Übersicht) ----------
  function renderListe(ziel) {
    const namen = Object.keys(meta).filter(n => meta[n].vorschau !== undefined && (meta[n].vorschau || n === ziel)).sort((a, b) => (meta[b].pin ? 1 : 0) - (meta[a].pin ? 1 : 0) || meta[b].n - meta[a].n);
    $('.l-zeilen').innerHTML = namen.map(n => { const m = meta[n]; const titel = n === 'gruppe' ? gruppe.name : n;
      return `<div class="l-zeile${n === ziel ? ' ziel' : ''}" data-n="${n}">${avatar(n)}<div class="l-mitte"><b>${esc(titel)}</b><span>${esc(m.vorschau || '')}</span></div><div class="l-rechts"><small class="${m.ungelesen ? 'neu' : ''}">${m.tagIdx != null && m.tagIdx < heute() ? tagLabel(m.tagIdx) : (m.zeit || '')}</small><div class="l-sym">${m.pin ? '<u>📌</u>' : ''}${m.ungelesen ? `<i>${m.ungelesen}</i>` : ''}</div></div></div>`; }).join('');
  }
  function chatKey(titel) { if (titel === gruppe.name) return 'gruppe'; if (KONTAKTE[titel]) return titel; return null; }

  // ---------- Chat ----------
  function chatListe(n) { return chats[n] || (chats[n] = []); }
  function renderChat() {
    const n = aktChat, liste = chatListe(n), box = $('.c-msgs'); box.innerHTML = '';
    let vorher = null, tag = null;
    if (!liste.length) box.insertAdjacentHTML('beforeend', '<div class="c-system">🔒 Nachrichten und Anrufe sind Ende-zu-Ende-verschlüsselt. Niemand außerhalb dieses Chats kann sie lesen.</div>');
    liste.forEach(m => { const t = tagLabel(m.tagIdx == null ? 0 : m.tagIdx); if (t !== tag) { box.insertAdjacentHTML('beforeend', `<div class="c-tag"><span>${esc(t)}</span></div>`); tag = t; vorher = null; } box.appendChild(bubble(m, vorher)); vorher = m; });
    box.scrollTop = box.scrollHeight;
  }
  function bubble(m, vorher) {
    const d = document.createElement('div');
    const ich = m.von === 'Ich'; const reihe = vorher && vorher.von === m.von;
    d.className = 'msg ' + (ich ? 'ich' : 'du') + (reihe ? ' folge' : '') + (istGruppe(aktChat) && !ich ? ' gr' : '');
    let kopf = '';
    if (istGruppe(aktChat) && !ich && !reihe) kopf = `<div class="absender" style="color:${GRUPPENFARBE[m.von] || '#aaa'}">${m.von}</div>`;
    let inhalt = '';
    if (m.typ === 'foto' || m.typ === 'video') inhalt = `<div class="mfoto">${Spiel.bildHTML(m.bild, true)}${m.typ === 'video' ? '<div class="play">▶</div><div class="vdauer">0:12</div>' : ''}</div>`;
    else inhalt = `<span class="mt">${esc(m.text)}</span>`;
    const haken = ich ? `<span class="hk ${m.haken || 'grau1'}">${m.haken === 'grau1' ? '✓' : '✓✓'}</span>` : '';
    d.innerHTML = (istGruppe(aktChat) && !ich && !reihe ? avatar(m.von) : (istGruppe(aktChat) && !ich ? '<span class="av leer"></span>' : '')) +
      `<div class="blase">${kopf}${inhalt}<span class="mz">${m.zeit}${haken}</span></div>`;
    m.el = d; return d;
  }
  function anhaengen(m) {
    if (m.tagIdx == null) m.tagIdx = heute();
    const liste = chatListe(aktChat); const vorher = liste[liste.length - 1]; liste.push(m); merke(aktChat, vorschauVon(m), m.zeit);
    const box0 = $('.c-msgs'); if (box0.querySelector('.c-system')) box0.querySelector('.c-system').remove();
    if (!vorher || tagLabel(vorher.tagIdx == null ? 0 : vorher.tagIdx) !== tagLabel(m.tagIdx)) box0.insertAdjacentHTML('beforeend', '<div class="c-tag"><span>' + tagLabel(m.tagIdx) + '</span></div>');
    const box = $('.c-msgs'); box.appendChild(bubble(m, vorher)); box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    return m;
  }
  function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function setzeKopf() {
    const n = aktChat; const kopf = $('.c-kopf');
    kopf.querySelector('.av').outerHTML = avatar(n);
    kopf.querySelector('b').textContent = n === 'gruppe' ? gruppe.name : n;
    kopf.querySelector('small').textContent = n === 'gruppe' ? gruppe.mitglieder : istGruppe(n) ? 'tippe hier für Gruppeninfo' : (chatListe(n).length ? 'online' : '');
    kopf.classList.toggle('gr', istGruppe(n));
  }
  function eingabe(txt) {
    const f = $('.c-eingabe'); f.querySelector('.txt').textContent = txt; f.classList.toggle('voll', txt.length > 0);
    const feld = f.querySelector('.feld'); feld.scrollTop = feld.scrollHeight;
    const w = txt.split(/\s/).pop(); const vw = $('.vw'); if (vw) vw.textContent = w ? (w.length > 12 ? w.slice(0, 11) + '…' : w) : '';
    const b = $('.c-msgs'); if (b) b.scrollTop = b.scrollHeight;
  }
  function tastatur(an) { $('[data-app=chat]').classList.toggle('tippt', an); const b = $('.c-msgs'); setTimeout(() => b.scrollTop = b.scrollHeight, 260); }

  async function tippe(text) {
    tastatur(true); await warte(450);
    let s = ''; const zeichen = Array.from(text); const A = Ton.anschlaege;
    if (Spiel.schnell || A.length < 8) {
      for (const z of zeichen) { s += z; taste(z); eingabe(s); Ton.spiele('tipp'); let d = TAKT[Math.floor(Math.random() * TAKT.length)] * 1000; if (/[ .,!?]/.test(z)) d += 60; await warte(d); }
    } else {
      // Abschnitte der echten Aufnahme: jeder Anschlag = ein Zeichen, Pausen kommen aus der Aufnahme
      let i = 0;
      while (i < zeichen.length) {
        const k = Math.floor(Math.random() * (A.length - 8)); const n = Math.min(zeichen.length - i, A.length - k);
        const ab = Math.max(0, A[k] - .03); const knoten = Ton.tippLauf(ab, A[k + n - 1] - ab + .16);
        const t0 = performance.now();
        for (let j = 0; j < n; j++) {
          const soll = (A[k + j] - ab) * 1000; const ist = performance.now() - t0; if (soll > ist) await new Promise(r => setTimeout(r, soll - ist));
          s += zeichen[i + j]; taste(zeichen[i + j]); eingabe(s);
        }
        i += n; if (i < zeichen.length) await warte(200);
      }
    }
    await warte(800);
  }
  async function loesche() {
    let s = $('.c-eingabe .txt').textContent;
    const arr = Array.from(s);
    while (arr.length) { arr.pop(); eingabe(arr.join('')); taste('⌫'); Ton.spiele('tipp', { rate: .8, vol: .55 }); await warte(70); }
  }
  async function sende() {
    const txt = $('.c-eingabe .txt').textContent; if (!txt) return;
    const mic = $('.mic'); mic.classList.remove('pop'); void mic.offsetWidth; mic.classList.add('pop');
    eingabe(''); tastatur(false); Ton.spiele('senden');
    const m = anhaengen({ von: 'Ich', text: txt, zeit: uhrText(), haken: 'grau1' });
    setTimeout(() => setHaken(m, 'grau2'), Spiel.schnell ? 50 : 1100);
    return m;
  }
  function setHaken(m, h) {
    if (!m) { const l = chatListe(aktChat); for (let i = l.length - 1; i >= 0; i--) if (l[i].von === 'Ich') { m = l[i]; break; } }
    if (!m) return; m.haken = h; if (m.el) { const e = m.el.querySelector('.hk'); if (e) { e.className = 'hk ' + h; e.textContent = h === 'grau1' ? '✓' : '✓✓'; } }
  }
  async function schreibt(name, sek) {
    if (app === 'liste' && warteAuf) {
      const sp = $(`.l-zeile[data-n="${warteAuf}"] .l-mitte span`); if (!sp) { await warte(sek * 1000); return; }
      const alt = sp.textContent; sp.textContent = (warteAuf === 'gruppe' || (meta[warteAuf] && meta[warteAuf].gruppe)) ? name + ' schreibt …' : 'schreibt …'; sp.classList.add('gruen');
      await warte(sek * 1000); sp.textContent = alt; sp.classList.remove('gruen'); return;
    }
    const kopf = $('.c-kopf small'); const alt = kopf.textContent;
    kopf.textContent = aktChat === 'gruppe' ? name + ' schreibt …' : 'schreibt …'; kopf.classList.add('gruen');
    const box = $('.c-msgs'); const d = document.createElement('div');
    d.className = 'msg du tippen' + (aktChat === 'gruppe' ? ' gr' : '');
    d.innerHTML = (aktChat === 'gruppe' ? avatar(name) : '') + '<div class="blase"><span class="punkte"><i></i><i></i><i></i></span></div>';
    box.appendChild(d); box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    await warte(sek * 1000);
    d.remove(); kopf.textContent = alt; kopf.classList.remove('gruen');
  }

  return {
    get offen() { return offen; },
    get app() { return app; },
    setGruppe(name, mitgl) { gruppe = { name, mitglieder: mitgl }; },
    aktualisiereZeit,
    zu() {
      offen = false; el.classList.remove('an', 'weg'); document.getElementById('buehne').classList.remove('handyoffen');
      notifs = []; $('.sp-notifs').innerHTML = ''; $('.hhinweis').classList.remove('an'); tastatur(false); eingabe('');
      this.klingelAus(); $('.stummtoast').classList.remove('an'); this.fotozoomWeg();
    },
    weg() { el.classList.add('weg'); document.getElementById('buehne').classList.remove('handyoffen'); },
    her() { el.classList.remove('weg'); if (offen) document.getElementById('buehne').classList.add('handyoffen'); },
    sperr() { oeffne(); zeige('sperr'); },
    benachrichtigung(appName, titel, text, zeit) {
      if (offen && (app === 'chat' || app === 'liste') && !el.classList.contains('weg')) {
        if (appName === 'WhatsApp') { const k = chatKey(titel); if (k && k === aktChat && app === 'chat') return; if (k) merke(k, text || '', zeit || uhrText(), 1); if (app === 'liste') renderListe(); }
        this.hinweis(appName, titel, text || ''); return;
      }
      if (!offen || app !== 'sperr') { oeffne(); zeige('sperr'); }
      const ic = { WhatsApp: ['#25d366', '✆'], Instagram: ['linear-gradient(45deg,#f9a825,#e91e63,#7b1fa2)', '◎'], Wetter: ['#f0a030', '☀'], System: ['#607d8b', '⚙'], Livestream: ['#8e44ad', '▶'], Telefon: ['#2e7d32', '✆'], Wohlbefinden: ['#2e9e5b', '♥'] }[appName] || ['#555', '•'];
      if (appName === 'WhatsApp') { const k = chatKey(titel); if (k) merke(k, text || '', zeit || uhrText(), 1); }
      const top = $('.sp-notifs').firstElementChild; const schl = appName + '|' + titel;
      if (top && top.dataset.k === schl && text) { const z = document.createElement('div'); z.className = 'nt neu'; z.textContent = text; top.querySelector('.ntx').appendChild(z); top.querySelector('.nkopf span').textContent = zeit || uhrText(); top.classList.remove('stups'); void top.offsetWidth; top.classList.add('stups'); return; }
      const d = document.createElement('div'); d.className = 'nk'; d.dataset.k = schl;
      d.innerHTML = `<span class="nic" style="background:${ic[0]}">${ic[1]}</span><div class="ntx"><div class="nkopf"><b>${esc(titel)}</b><span>${zeit || uhrText()}</span></div>${text ? `<div class="nt">${esc(text)}</div>` : ''}${appName === 'Wohlbefinden' ? '<div class="nsub">Digitales Wohlbefinden · Wochenbericht</div>' : ''}</div><span class="npf">⌄</span>`;
      const box = $('.sp-notifs'); box.prepend(d); notifs.push(d);
      while (box.children.length > 7) box.lastChild.remove();
    },
    async wegwischen() { const n = $('.sp-notifs .nk'); if (n) { n.classList.add('wisch'); await warte(500); n.remove(); } },
    async chat(name, fix) {
      warteAuf = null;
      const schonDa = offen && app === 'chat' && aktChat === name && !el.classList.contains('weg');
      oeffne(); $('.hhinweis').classList.remove('an');
      if (fix && !schonDa) { const z = $(`.l-zeile[data-n="${name}"]`); if (z) { z.classList.add('druck'); await warte(140); } }
      else if (!schonDa) {
        if (app === 'chat') { const z = $('.c-kopf .zur'); z.classList.add('druck'); await warte(180); z.classList.remove('druck'); }
        tastatur(false); renderListe(name); zeige('liste'); await warte(520);
        let zeile = $(`.l-zeile[data-n="${name}"]`);
        if (!zeile) {
          const s = $('.l-suche'); s.classList.add('aktiv'); s.textContent = '🔍  ';
          await warte(300);
          for (const ch of (name === 'gruppe' ? gruppe.name : name)) { s.textContent += ch; Ton.spiele('tipp', { vol: .5 }); await warte(150); }
          const info = (KONTAKTE[name] && KONTAKTE[name].info) || '';
          $('.l-zeilen').innerHTML = `<div class="l-treffer">Kontakte</div><div class="l-zeile" data-n="${name}">${avatar(name)}<div class="l-mitte"><b>${esc(name)}</b><span>${esc(info)}</span></div></div>`;
          await warte(600); zeile = $(`.l-zeile[data-n="${name}"]`);
        }
        if (zeile) { zeile.classList.add('druck'); await warte(260); }
        const s2 = $('.l-suche'); s2.classList.remove('aktiv'); s2.textContent = '🔍  Fragen Sie Meta AI oder suchen Sie';
      }
      aktChat = name; if (meta[name]) meta[name].ungelesen = 0;
      zeige('chat'); setzeKopf(); renderChat(); eingabe(''); tastatur(false);
    },
    liste() { oeffne(); renderListe(); zeige('liste'); },
    // Chat „vormerken“: in der Liste warten, bis jemand schreibt (bei neuen Chats direkt rein)
    async vorChat(name) {
      if (offen && app === 'chat' && aktChat === name && !el.classList.contains('weg')) return;
      if (!chatListe(name).length) return this.chat(name);
      oeffne(); $('.hhinweis').classList.remove('an');
      if (app === 'chat') { const z = $('.c-kopf .zur'); z.classList.add('druck'); await warte(180); z.classList.remove('druck'); }
      tastatur(false); renderListe(); zeige('liste'); warteAuf = name; await warte(300);
    },
    async rein() { if (app === 'liste' && warteAuf) { await warteZ(20, 700 + Math.random() * 600); await this.chat(warteAuf, true); } },
    // Kernmoment: jemand tippt, hört auf, nichts kommt, tippt nochmal
    async zoegern(name) {
      await schreibt(name, 2.6); await warteZ(20, 3200); await schreibt(name, 1.4); await warteZ(20, 2600); await schreibt(name, 2.2);
    },
    // Umfrage im Gruppenchat (Pizza)
    async umfrage(frage, optionen) {
      await this.rein();
      const m = anhaengen({ von: 'Jonas', text: frage, zeit: uhrText(), typ: 'umfrage' });
      const d = document.createElement('div'); d.className = 'umfrage';
      d.innerHTML = `<b>${esc(frage)}</b>` + optionen.map((o, i) => `<div class="uo" data-i="${i}"><span class="ukreis"></span><span class="utext">${esc(o)}</span><span class="uzahl">0</span><div class="ubalken"><i></i></div><div class="uavs"></div></div>`).join('');
      const bl = m.el ? m.el.querySelector('.blase') : null; if (bl) { bl.innerHTML = ''; bl.appendChild(d); bl.classList.add('ublase'); }
      this._umfrage = { d, n: optionen.map(() => 0), avs: optionen.map(() => []) };
      $('.c-msgs').scrollTop = 1e6; Spiel.bzzz({ entprellen: true }); await warteZ(20, 600);
    },
    async stimme(i, wer) {
      const u = this._umfrage; if (!u) return; u.n[i]++; if (wer) u.avs[i].push(wer);
      const ges = u.n.reduce((a, b) => a + b, 0);
      u.d.querySelectorAll('.uo').forEach((o, k) => { o.querySelector('.uzahl').textContent = u.n[k]; o.querySelector('.ubalken i').style.width = (u.n[k] / Math.max(ges, 1) * 100) + '%'; o.querySelector('.uavs').innerHTML = u.avs[k].map(n => avatar(n)).join(''); });
      if (wer === 'Ich') { const o = u.d.querySelectorAll('.uo')[i]; o.classList.add('meine'); Ton.spiele('tipp'); }
      else Ton.spiele('tipp', { vol: .35, rate: 1.4 });
      await warteZ(20, wer === 'Ich' ? 500 : 650 + Math.random() * 500);
    },
    // Lena ist live: wackeliges Partybild, Zuschauer, Kommentare laufen hoch
    async live(code, zuschauer) {
      oeffne(); zeige('live'); const l = $('[data-app=live]');
      l.querySelector('.lv-bild').innerHTML = Spiel.bildHTML(code, true); l.querySelector('.lv-k').innerHTML = '';
      l.querySelector('.lv-z b').textContent = zuschauer; this._live = { z: +zuschauer };
      await warteZ(20, 900);
    },
    async liveKommentar(name, text) {
      const k = $('[data-app=live] .lv-k'); const d = document.createElement('div'); d.className = 'lvk'; d.innerHTML = `<b>${esc(name)}</b> ${esc(text)}`;
      k.appendChild(d); while (k.children.length > 6) k.firstChild.remove();
      if (this._live && Math.random() < .5) { this._live.z++; $('[data-app=live] .lv-z b').textContent = this._live.z; }
      await warteZ(20, 700 + Math.random() * 500);
    },
    async liveEingabe(text) { const f = $('[data-app=live] .lv-feld'); f.textContent = ''; for (const ch of text) { f.textContent += ch; Ton.spiele('tipp'); await warteZ(20, 110); } },
    async liveSenden() { const f = $('[data-app=live] .lv-feld'); const t = f.textContent; f.textContent = 'Kommentieren …'; Ton.spiele('senden'); await this.liveKommentar('ich', t); },
    async liveLoeschen() { const f = $('[data-app=live] .lv-feld'); while (f.textContent.length) { f.textContent = f.textContent.slice(0, -1); Ton.spiele('tipp', { rate: .8, vol: .5 }); await warteZ(20, 60); } f.textContent = 'Kommentieren …'; },
    async geier(von, vorschau, lang) {
      const n = warteAuf;
      await warteZ(20, 1100 + Math.random() * 1300);
      // manchmal kommt die Nachricht einfach, ohne dass man das Tippen gesehen hat
      if (Math.random() < .2) await warteZ(20, lang * 700);
      else if (lang > 2.5 && Math.random() < .35) { await schreibt(von, lang * .45); await warteZ(20, 1100 + Math.random() * 900); await schreibt(von, lang * .6); }
      else await schreibt(von, lang);
      merke(n, ((n === 'gruppe' || (meta[n] && meta[n].gruppe)) ? von + ': ' : '') + vorschau, uhrText(), 1); renderListe(); Spiel.bzzz({ entprellen: true });
      const z = $(`.l-zeile[data-n="${n}"]`); if (z) { z.classList.remove('neuda'); void z.offsetWidth; z.classList.add('neuda'); }
      await warteZ(20, 1300 + Math.random() * 1100); await this.chat(n, true);
    },
    // älterer Verlauf (vor Spielbeginn)
    alt(name, tag, zeit, von, text) {
      if (name === gruppe.name) name = 'gruppe';
      const g = von !== 'Ich' && von !== name && name !== 'gruppe';
      const m = meta[name] || (meta[name] = { ungelesen: 0 }); if (g) m.gruppe = true; if (name === 'Jonas') m.pin = true;
      const ti = TAG_AUS_TEXT[tag] != null ? TAG_AUS_TEXT[tag] : -2;
      chatListe(name).push({ von, text, zeit, tag, tagIdx: ti, haken: von === 'Ich' ? 'blau' : null });
      merke(name, (von === 'Ich' ? '✓✓ ' : ((g || name === 'gruppe') ? von + ': ' : '')) + text, zeit, 0, ti);
    },
    gruppeOeffnen() { return this.chat('gruppe'); },
    async nachricht(von, text, sofort) {
      let schonGewartet = false;
      if (app === 'liste' && warteAuf && !sofort) { await this.geier(von, text, Math.min(4.5, 1.1 + text.length * .05)); schonGewartet = true; }
      if (app === 'liste' && warteAuf) { const n = warteAuf; merke(n, ((n === 'gruppe' || (meta[n] && meta[n].gruppe)) ? von + ': ' : '') + text, uhrText(), 1); renderListe(); if (!schonGewartet) Spiel.bzzz({ entprellen: true }); await warteZ(20, 1100 + Math.random() * 700); await this.chat(n, true); schonGewartet = true; }
      if (app !== 'chat') await this.chat(von);
      if (!sofort && !schonGewartet) {
        const offeneHaken = chatListe(aktChat).filter(x => x.von === 'Ich' && x.haken !== 'blau');
        if (offeneHaken.length) { await warteZ(20, 1200 + Math.random() * 1200); offeneHaken.forEach(x => setHaken(x, 'blau')); await warteZ(20, 900 + Math.random() * 700); }
        else await warteZ(20, 800 + Math.random() * 900);
        const lang = Math.min(4.5, 1.1 + text.length * .05);
        if (text.length > 18 && Math.random() < .35) { await schreibt(von, lang * .45); await warte(700 + Math.random() * 700); await schreibt(von, lang * .65); }
        else await schreibt(von, lang);
      }
      const m = anhaengen({ von, text, zeit: uhrText() });
      if (!sofort && !schonGewartet) Spiel.bzzz({ entprellen: true });
      // Antwort → eigene Nachrichten blau
      chatListe(aktChat).forEach(x => { if (x.von === 'Ich' && x.haken !== 'blau') setHaken(x, 'blau'); });
      
      await warte(450);
    },
    async ich(text, haken) { await this.rein(); if (app !== 'chat') return; anhaengen({ von: 'Ich', text, zeit: uhrText(), haken: haken || 'grau2' }); },
    async foto(code, von, typ = 'foto') { if (app === 'liste' && warteAuf) await this.geier(von, typ === 'video' ? '🎥 Video' : '📷 Foto', 1.3); else { if (app !== 'chat') await this.chat('gruppe'); await warte(400); await schreibt(von, 1.3); } anhaengen({ von, typ, bild: code, zeit: uhrText() });  await warte(500); },
    async fotozoom() { const f = [...el.querySelectorAll('.mfoto')].pop(); if (!f) return; const r = f.cloneNode(true); r.className = 'fotogross'; $('.screen').appendChild(r); await warte(30); r.classList.add('an'); await warte(1200); r.classList.add('zoom'); },
    fotozoomWeg() { el.querySelectorAll('.fotogross').forEach(e => e.remove()); },
    async tippeUndSende(text) { await this.rein(); if (app !== 'chat') return; await tippe(text); return sende(); },
    tippe, sende, loesche,
    async eintippen(text) { await tippe(text); },
    async abschicken() { await sende(); },
    async wegloeschen() { await loesche(); await warte(400); tastatur(false); },
    async entwurf(text) { await this.rein(); await tippe(text); await warte(900); await loesche(); await warte(500); tastatur(false); },
    schreibt,
    haken(h) { setHaken(null, h); },
    // ---- Anruf ----
    anruf(name) {
      oeffne(); zeige('anruf'); const a = $('[data-app=anruf]'); a.className = 'app an klingeln';
      $('.a-name').textContent = name; $('.a-sub').textContent = 'Eingehender Anruf'; $('.a-av').outerHTML = avatar(name).replace('class="av"', 'class="av a-av"');
      klingelt = true; Ton.loop('klingel', true);
    },
    anrufAn() {
      this.klingelAus(); const a = $('[data-app=anruf]'); a.classList.remove('klingeln'); a.classList.add('verbunden');
      let s = 0; $('.a-sub').textContent = '00:00'; callTimer = setInterval(() => { s++; $('.a-sub').textContent = '00:' + String(s).padStart(2, '0'); }, 1000);
    },
    async anrufEnde(abgelehnt) {
      this.klingelAus(); clearInterval(callTimer); const a = $('[data-app=anruf]'); a.classList.remove('klingeln', 'verbunden');
      $('.a-sub').textContent = abgelehnt ? 'Abgelehnt' : 'Anruf beendet'; Ton.spiele('klick'); await warte(900);
    },
    klingelAus() { if (klingelt) { Ton.loop('klingel', false); klingelt = false; } clearInterval(callTimer); },
    // ---- Story ----
    async story(name, code, dauer = 5) {
      oeffne(); zeige('story'); const s = $('[data-app=story]');
      s.querySelector('.st-name').textContent = name; s.querySelector('.st-bild').innerHTML = Spiel.bildHTML(code, true);
      s.querySelector('.av').outerHTML = `<span class="av" style="background:${name.startsWith('lena') ? '#e0558e' : name.startsWith('lynn') ? '#3d4a66' : '#22a39a'}">${name[0].toUpperCase()}</span>`;
      s.querySelector('.st-zeit').textContent = name === 'lynn' ? '9 Std.' : (Math.floor(Math.random() * 40) + 3) + ' Min.';
      s.classList.remove('post'); const b = s.querySelector('.st-balken i'); b.style.transition = 'none'; b.style.width = '0'; void b.offsetWidth;
      b.style.transition = `width ${dauer * (Spiel.schnell ? .15 : 1)}s linear`; b.style.width = '100%';
    },
    post(code, text) {
      oeffne(); zeige('story'); const s = $('[data-app=story]'); s.classList.add('post');
      s.querySelector('.st-name').textContent = 'Deine Story'; s.querySelector('.st-zeit').textContent = 'Gerade eben';
      s.querySelector('.st-bild').innerHTML = Spiel.bildHTML(code, true) + `<div class="st-text">${esc(text)}</div>`;
      s.querySelector('.st-views b').textContent = '0';
    },
    aufrufe(n) { const b = $('.st-views b'); b.textContent = n; b.parentNode.classList.remove('pop'); void b.offsetWidth; b.parentNode.classList.add('pop'); },
    hinweis(appName, titel, text) {
      const h = $('.hhinweis'); h.querySelector('b').textContent = titel; h.querySelector('.h-x').textContent = text;
      h.querySelector('.h-ic').style.background = appName === 'Instagram' ? 'linear-gradient(45deg,#f9a825,#e91e63,#7b1fa2)' : '#25d366';
      h.classList.remove('an'); void h.offsetWidth; h.classList.add('an'); Spiel.bzzz({ entprellen: true }); clearTimeout(h.t); h.t = setTimeout(() => h.classList.remove('an'), 3500);
    },
    notizen() { oeffne(); zeige('notizen'); },
    // Weg B: neue Notiz, Zeile für Zeile getippt (mit echtem Tipp-Ton), dann 8 → 9
    async notizNeu(titel) {
      oeffne(); zeige('notizen'); const ti = $('.n-titel'), li = $('.n-liste');
      ti.innerHTML = '<span class="n-t"></span><i class="cursor"></i>'; li.innerHTML = ''; await warte(500);
      const t = ti.querySelector('.n-t'); let s = '';
      for (const z of titel) { s += z; t.textContent = s; Ton.spiele('tipp'); await warteZ(2, 95 + Math.random() * 60); }
      await warte(400);
      // letztes Wort als Datum-Feld, damit es am Sonntag umgeschrieben werden kann
      const i = titel.lastIndexOf(' '); if (i > 0) ti.innerHTML = `${titel.slice(0, i)} <span class="n-tag">${titel.slice(i + 1)}</span><i class="cursor"></i>`;
    },
    async notizZeile(text) {
      const li = $('.n-liste'); const d = document.createElement('div'); d.textContent = '☐ '; li.appendChild(d); let s = '☐ ';
      for (const z of text) { s += z; d.textContent = s; Ton.spiele('tipp'); await warteZ(2, 80 + Math.random() * 70); }
      await warteZ(10, 550);
    },
    async notizFix(alt, neu) {
      const d = [...$('.n-liste').children].find(x => x.textContent.includes(alt)); if (!d) return;
      let s = d.textContent; const i = s.indexOf(alt), ende = s.slice(i + alt.length);
      // nur die Stelle, die sich unterscheidet: „8:00“ → „9:00“
      let k = 0; while (k < alt.length && alt[k] === neu[k]) k++;
      const vorn = s.slice(0, i) + alt.slice(0, k); let mitte = alt.slice(k);
      while (mitte.length) { mitte = mitte.slice(0, -1); d.textContent = vorn + mitte + ende; Ton.spiele('tipp', { rate: .8, vol: .55 }); await warteZ(2, 160); }
      await warteZ(2, 300);
      let rein = ''; for (const z of neu.slice(k)) { rein += z; d.textContent = vorn + rein + ende; Ton.spiele('tipp'); await warteZ(2, 140); }
      await warteZ(2, 500);
    },
    // Weg B: ein Karussell-Post, einmal nach rechts gewischt, dann sofort weitergescrollt
    async karussell() {
      oeffne(); zeige('karussell'); const k = $('[data-app=karussell]'); k.classList.remove('wisch', 'weg'); const p = k.querySelectorAll('.ka-punkte i');
      p.forEach((x, i) => x.classList.toggle('an', i === 0)); await warteZ(20, 2200);
      k.classList.add('wisch'); p[0].classList.remove('an'); p[1].classList.add('an'); await warteZ(20, 1500);
      k.classList.add('weg'); Ton.spiele('whoosh_kurz', { vol: .35 }); await warteZ(20, 350); this.feed(); await warteZ(20, 1600);
    },
    // Storys fremder Leute im Schnelldurchlauf
    async storys(codes) {
      const namen = ['tim.dreams', 'nightcrew', 'jule.mxn', 'paulfrnk', 'mia.chaos', 'lea.vbs', 'kai_ontour', 'hannah.lt'];
      for (let i = 0; i < codes.length; i++) { await this.story(namen[i % namen.length], codes[i], .9); await warteZ(20, 780 - Math.min(i * 60, 360)); }
    },
    async notizenDatum() {
      const t = $('.n-tag'); if (!t) return; let s = t.textContent; const ziel = 'Sonntag';
      while (s.length) { s = s.slice(0, -1); t.textContent = s; Ton.spiele('tipp', { rate: .8, vol: .55 }); await warte(70); }
      for (const z of ziel) { s += z; t.textContent = s; Ton.spiele('tipp'); await warte(110); }
    },
    feed() {
      oeffne(); zeige('feed'); const r = $('.f-rolle'); let h = '';
      for (let i = 0; i < 8; i++) h += `<div class="f-post"><div class="f-k"><span class="av" style="background:hsl(${i * 47},50%,45%)">${'lmtjsbna'[i]}</span><b>${['lena.mln', 'mia.chaos', 'tim.dreams', 'jonas.k', 'streamz', 'ben.r', 'nightcrew', 'jura.memes'][i]}</b></div><div class="f-b">${Spiel.bildHTML(['N32a', 'N32b', 'N28', 'N32c', 'N32e', 'N33', 'N32d', 'N36'][i], true)}</div><div class="f-a">♡ 💬 ➤</div></div>`;
      r.innerHTML = h + h; r.classList.remove('rollt'); void r.offsetWidth; r.classList.add('rollt');
    },
    video(code) { oeffne(); zeige('video'); $('.v-bild').innerHTML = Spiel.bildHTML(code, true); const b = $('.v-balken i'); b.style.transition = 'none'; b.style.width = '0'; void b.offsetWidth; b.style.transition = 'width 12s linear'; b.style.width = '100%'; },
    async stumm() {
      oeffne(); el.classList.add('schnapp'); zeige('sperr'); await warte(250); el.classList.remove('schnapp');
      Ton.spiele('klick'); const t = $('.stummtoast'); t.classList.add('an'); $('.sp-stumm').classList.add('an'); el.classList.add('handy-stumm'); await warte(1300);
    },
    aus() { Ton.spiele('klick'); $('.displayaus').classList.add('an'); },
    reset() {
      for (const k in chats) delete chats[k];
      $('.sp-stumm').classList.remove('an'); el.classList.remove('handy-stumm'); for (const k in meta) delete meta[k]; warteAuf = null; $('.n-titel').innerHTML = 'Lernplan <span class="n-tag">Samstag</span><i class="cursor"></i>'; $('.n-liste').innerHTML = '<div>☑ 9:00 Schuldrecht AT</div><div>☐ 10:00 BGB AT</div><div>☐ 14:00 Fälle 1–5</div>'; this.fotozoomWeg(); this.zu();
    },
  };
})();
