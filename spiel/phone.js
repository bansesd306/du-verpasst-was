// =====================================================================
//   HANDY – Samsung / One UI, Dunkelmodus (alles HTML, keine Bilder nötig)
// =====================================================================
const KONTAKTE = {
  Jonas: { farbe: '#e8833a', name: 'Jonas' },
  Lena: { farbe: '#e0558e', name: 'Lena 🌻' },
  Tim: { farbe: '#22a39a', name: 'Tim' },
  Mia: { farbe: '#9b6ad8', name: 'Mia' },
  Lynn: { farbe: '#3d4a66', name: 'Lynn', info: 'Seminar Gesprächsführung' },
  Ben: { farbe: '#4f8ad6', name: 'Ben' },
  Mama: { farbe: '#c0a062', name: 'Mama' },
  Paul: { farbe: '#7cb342', name: 'Paul', info: 'Lerngruppe Schuldrecht' },
};
const GRUPPENFARBE = { Mara: '#f48fb1', Paul: '#9ccc65', Sophie: '#4dd0e1', Max: '#ff8a65', Leo: '#ba68c8', Jonas: '#f5a623', Lena: '#ff6b9a', Tim: '#35c9b0', Mia: '#b48cff', Ben: '#6fb3ff', Lynn: '#ffd166' };

// V8.8 (C15): Instagram wie die echte App (Dunkelmodus): Kopf mit Logo, Story-Ringe, Posts, Aktionszeile, untere Leiste
const IG = {"herz": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><path d=\"M12 20.3s-7.6-4.6-9.1-9.3C1.8 7.6 4 4.6 7.2 4.6c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 3 4.3 6.4-1.5 4.7-9.1 9.3-9.1 9.3z\"/></svg>", "sprech": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><path d=\"M20.6 16.9A9.2 9.2 0 1 0 17 20.4L21.5 21.5z\"/></svg>", "senden": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><path d=\"M21.6 2.6 10.3 13.9M21.6 2.6 14.4 21.4l-4.1-7.5-7.6-4.1z\"/></svg>", "merken": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><path d=\"M19 21.5 12 15.3l-7 6.2V3.2h14z\"/></svg>", "home": "<svg viewBox=\"0 0 24 24\" class=\"igi voll\"><path d=\"M3.5 10.6 12 3.2l8.5 7.4V21h-6v-6.2h-5V21h-6z\"/></svg>", "reels": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><path d=\"M3 8.5h18M8.5 3l3 5.5M14 3l3 5.5\"/><path d=\"M10 12.3v5.2l4.6-2.6z\" class=\"f\"/></svg>", "suche": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><circle cx=\"10.5\" cy=\"10.5\" r=\"7\"/><path d=\"M15.6 15.6 21 21\"/></svg>", "plus": "<svg viewBox=\"0 0 24 24\" class=\"igi\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><path d=\"M12 7.5v9M7.5 12h9\"/></svg>", "punkte": "<svg viewBox=\"0 0 24 24\" class=\"igi voll klein\"><circle cx=\"5\" cy=\"12\" r=\"1.7\"/><circle cx=\"12\" cy=\"12\" r=\"1.7\"/><circle cx=\"19\" cy=\"12\" r=\"1.7\"/></svg>"};
const IG_KOPF = `<div class="ig-kopf"><span class="ig-logo">Instagram</span><span class="ig-kic">${IG.plus}${IG.herz}<span class="ig-dm">${IG.senden}<i>2</i></span></span></div>`;
const IG_NAV = `<div class="ig-nav">${IG.home}${IG.reels}${IG.senden}${IG.suche}<span class="ig-ich"></span></div>`;
// Feed nach Uhrzeit: nur, was es zu dem Zeitpunkt schon gibt (Minuten ab Freitag 0:00), neueste oben
const IG_FEED = [['tim_k97', 'N32c', 1305, 'vorglühen 🍻'], ['jonas.k', 'B12A', 1305, 'BIRTHDAY GIRL 🎂'], ['lena.xo', 'N13', 1320, 'meine lieblingsmenschen ❤️'], ['x.mia.x', 'N35M1', 1325, 'party nr. 3 🪩'],
  ['nightcrew', 'N32a', 1350, 'friday mood'], ['x.mia.x', 'N32d', 1367, 'HAPPY BDAY LENAAA'], ['lena.xo', 'TORTE', 1372, 'die torte 😭🎂'], ['tim_k97', 'FEUER', 1402, 'ich sag nix 🧯'],
  ['x.mia.x', 'TIM_FEIER_4', 1470, 'nummer 4 🫶'], ['lena.xo', 'A1', 1480, 'noch nicht müde'], ['tim_k97', 'TIM_FEIER_1', 1500, 'afterparty 🔥']];
const Handy = (() => {
  const el = document.getElementById('handy');
  const $ = s => el.querySelector(s);
  const $$ = s => el.querySelectorAll(s);
  // V8.5: Inhalt der Bereicherungsrecht-Zusammenfassung (nur Stichworte, wird schnell durchgescrollt)
  const PDF_INHALT = [
    ['§ 812 I 1 Alt. 1 BGB – Leistungskondiktion', ['I. Etwas erlangt', 'II. Durch Leistung', 'III. Ohne Rechtsgrund', 'IV. Kein Ausschluss (§§ 814, 817 S. 2)']],
    ['§ 812 I 1 Alt. 2 BGB – Nichtleistungskondiktion', ['Eingriffskondiktion', 'Vorrang der Leistungsbeziehung', 'Subsidiarität']],
    ['§ 816 BGB – Verfügung eines Nichtberechtigten', ['§ 816 I 1: entgeltlich', '§ 816 I 2: unentgeltlich', '§ 816 II: Leistung an Nichtberechtigten']],
    ['§ 818 III BGB – Entreicherung', ['Wegfall der Bereicherung', 'Verschärfte Haftung, §§ 818 IV, 819']],
    ['Saldotheorie / Zweikondiktionenlehre', ['Gegenseitige Verträge', 'Ausnahmen: Minderjährige, arglistige Täuschung']],
    ['Mehrpersonenverhältnisse', ['Anweisungsfälle', 'Doppelmangel', 'Durchgriffskondiktion', 'Empfängerhorizont']],
    ['§ 817 S. 2 BGB – Kondiktionssperre', ['Gesetzes-/Sittenverstoß', 'Analoge Anwendung auf § 812']],
    ['§ 822 BGB – Unentgeltliche Weitergabe', ['Herausgabe durch Dritten', 'Voraussetzung: Entreicherung des Erstempfängers']],
  ];
  const chats = {}; // name -> [{von,text,zeit,typ,haken,bild}]
  const meta = {};  // name -> {vorschau, zeit, ungelesen, n}
  let zaehler = 0, warteAuf = null;
  // Tage: 0 = Freitag (Spielbeginn). Datumstrenner und Zeiten in der Liste hängen vom heutigen Spieltag ab.
  const WTAG = { '-3': 'Dienstag', '-2': 'Mittwoch', '-1': 'Donnerstag', 0: 'Freitag', 1: 'Samstag', 2: 'Sonntag', 3: 'Montag' };
  const TAG_AUS_TEXT = { Gestern: -1, Mittwoch: -2, Dienstag: -3, Donnerstag: -1, Heute: 0 };
  function heute() { try { return Math.floor(Spiel.V.uhr / 1440); } catch (e) { return 0; } }
  function tagLabel(i) { const d = heute() - i; return d <= 0 ? 'Heute' : d === 1 ? 'Gestern' : (WTAG[i] || ''); }
  function merke(n, vorschau, zeit, ungelesen, tagIdx) { const m = meta[n] || (meta[n] = { ungelesen: 0 }); m.vorschau = vorschau; m.zeit = zeit; m.tagIdx = tagIdx == null ? heute() : tagIdx; m.tagText = null; m.n = ++zaehler; if (ungelesen) m.ungelesen += ungelesen; }
  const istGruppe = n => n === 'gruppe' || !!(meta[n] && meta[n].gruppe);
  function vorschauVon(m) { const t = m.typ === 'foto' ? '📷 Foto' : m.typ === 'video' ? '🎥 Video' : m.typ === 'umfrage' ? '📊 ' + m.text : m.text; return (m.von === 'Ich' ? (istGruppe(aktChat) ? '✓✓ Du: ' : '✓✓ ') : (istGruppe(aktChat) ? m.von + ': ' : '')) + t; }
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
      <div class="c-kopf"><span class="zur"><svg viewBox="0 0 24 24" class="ico"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/></svg></span><span class="av"></span><div class="c-name"><b></b><small></small></div><span class="c-ic"><svg viewBox="0 0 24 24" class="ico"><path d="M15 8.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1.5l5.2 3.4c.5.3 1.8.1 1.8-.9V6c0-1-1.3-1.2-1.8-.9z"/></svg><svg viewBox="0 0 24 24" class="ico"><path d="M19.9 15.4l-3.2-.4a1.7 1.7 0 0 0-1.4.5l-2.3 2.3a14 14 0 0 1-6.8-6.8L8.5 8.7a1.7 1.7 0 0 0 .5-1.4l-.4-3.2A1.7 1.7 0 0 0 6.9 2.6H4.6c-1 0-1.8.8-1.7 1.8A17.4 17.4 0 0 0 19.6 21c1 .1 1.8-.7 1.8-1.7v-2.2a1.7 1.7 0 0 0-1.5-1.7z"/></svg><svg viewBox="0 0 24 24" class="ico"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span></div>
      <div class="c-msgs"></div>
      <div class="c-eingabe"><div class="pille"><span class="smi"><svg viewBox="0 0 24 24" class="ico o"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".9" class="f"/><circle cx="15" cy="10" r=".9" class="f"/><path d="M8.3 14.2a4.4 4.4 0 0 0 7.4 0"/></svg></span><div class="feld"><span class="plh">Nachricht</span><span class="txt"></span><i class="cursor"></i></div><span class="clip"><svg viewBox="0 0 24 24" class="ico o"><path d="M16.5 7.5 9 15a2.1 2.1 0 0 1-3-3l7.8-7.8a3.6 3.6 0 0 1 5.1 5.1l-8.2 8.2a5.1 5.1 0 0 1-7.2-7.2L11 2.8" transform="rotate(45 12 12)"/></svg></span><span class="cam"><svg viewBox="0 0 24 24" class="ico o"><path d="M4 7.5h3l1.6-2.2h6.8L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg></span></div><div class="mic"><svg viewBox="0 0 24 24" class="ico mi"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V21h2v-2.1a7 7 0 0 0 6-6.9z"/></svg></div></div>
      <div class="tastatur"></div>
      <div class="c-menue"><div>Gruppeninfo</div><div>Gruppenmedien</div><div>Suchen</div><div class="stummpunkt">Benachr. stummschalten</div><div>Selbstlöschende Nachrichten</div><div>Chatdesign</div><div class="mehr">Mehr <span>›</span></div></div>
      <div class="c-dialog"><div class="cd-box"><b>Benachrichtigungen zu Nachrichten stummschalten</b><p>Andere Mitglieder sehen nicht, dass du diesen Chat stummgeschaltet hast. Du wirst weiterhin benachrichtigt, wenn jemand dich erwähnt.</p>
        <div class="cd-opt" data-o="8"><i></i>8 Stunden</div><div class="cd-opt" data-o="w"><i></i>1 Woche</div><div class="cd-opt an" data-o="immer"><i></i>Immer</div>
        <div class="cd-knoepfe"><span>Abbrechen</span><span class="ok">OK</span></div></div></div>
    </div>
    <div class="app" data-app="liste">
      <div class="l-kopf"><b>WhatsApp</b><span class="l-kic"><svg viewBox="0 0 24 24" class="ico o"><path d="M4 7.5h3l1.6-2.2h6.8L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg><svg viewBox="0 0 24 24" class="ico"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span></div>
      <div class="l-suche"><svg viewBox="0 0 24 24" class="ico o lupe"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg><span class="l-st">Meta AI fragen oder suchen</span></div>
      <div class="l-chips"><span class="an">Alle</span><span>Ungelesen <em class="l-unz"></em></span><span>Archiviert ›</span><span>Favoriten</span><span class="l-filter"><svg viewBox="0 0 24 24" class="ico o"><path d="M4 7h16M7 12h10M10 17h4"/></svg></span></div>
      <div class="l-zeilen"></div>
      <div class="l-meta"></div>
      <div class="l-fab"><svg viewBox="0 0 24 24" class="ico"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 1-2z"/><path d="M12 7.5v6M9 10.5h6" stroke="#0b141a" stroke-width="2" fill="none" stroke-linecap="round"/></svg></div>
      <div class="l-nav"><span class="an"><i><svg viewBox="0 0 24 24" class="ico"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 1-2z"/></svg><em class="l-nbadge"></em></i>Chats</span><span><i><svg viewBox="0 0 24 24" class="ico o"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/></svg><em class="l-punkt"></em></i>Aktuelles</span><span><i><svg viewBox="0 0 24 24" class="ico o"><circle cx="12" cy="9" r="3"/><circle cx="5.5" cy="11" r="2.2"/><circle cx="18.5" cy="11" r="2.2"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0M1.5 18a4 4 0 0 1 4-3.5M22.5 18a4 4 0 0 0-4-3.5"/></svg></i>Communitys</span><span><i><svg viewBox="0 0 24 24" class="ico o"><path d="M19.9 15.4l-3.2-.4a1.7 1.7 0 0 0-1.4.5l-2.3 2.3a14 14 0 0 1-6.8-6.8L8.5 8.7a1.7 1.7 0 0 0 .5-1.4l-.4-3.2A1.7 1.7 0 0 0 6.9 2.6H4.6c-1 0-1.8.8-1.7 1.8A17.4 17.4 0 0 0 19.6 21c1 .1 1.8-.7 1.8-1.7v-2.2a1.7 1.7 0 0 0-1.5-1.7z"/></svg></i>Anrufe</span></div>
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
      <div class="n-liste"><div>☐ 9:00 Schuldrecht AT</div><div>☐ 10:00 BGB AT</div><div>☐ 14:00 Fälle 1–5</div></div>
    </div>
    <div class="app" data-app="feed">${IG_KOPF}<div class="ig-fenster"><div class="f-rolle"></div></div>${IG_NAV}</div>
    <div class="app" data-app="live"><div class="lv-bild"></div><div class="lv-kopf"><span class="av" style="background:#e0558e">l</span><b>lena.xo</b><span class="lv-rot">LIVE</span><span class="lv-z">👁 <b>23</b></span></div><div class="lv-k"></div><div class="lv-feld">Kommentieren …</div></div>
    <div class="app" data-app="karussell">${IG_KOPF}<div class="ig-fenster"><div class="ka-post"><div class="ig-pk"><span class="ig-av" style="--c:#6a5acd"><b>s</b></span><div class="ig-pn"><b>studygram.de</b><small>Gesponsert</small></div>${IG.punkte}</div>
      <div class="ka-fenster"><div class="ka-band"><div class="ka-seite">5 Lerntipps, die WIRKLICH funktionieren 📚</div><div class="ka-seite b">1. Handy weglegen.</div><div class="ka-seite c">2. Pausen bewusst einplanen.</div></div><span class="ka-zahl">1/5</span></div>
      <div class="ig-ak"><span>${IG.herz}${IG.sprech}${IG.senden}</span><div class="ka-punkte"><i class="an"></i><i></i><i></i><i></i><i></i></div>${IG.merken}</div>
      <div class="ig-tx"><b>Gefällt 2.318 Mal</b></div><div class="ig-tx"><b>studygram.de</b> Speichern für die Prüfungsphase 📌</div></div></div>${IG_NAV}</div>
    <div class="app" data-app="pdf"><div class="pdf-kopf"><span>←</span><b class="pdf-name"></b><span>⋮</span></div><div class="pdf-fenster"><div class="pdf-rolle"></div></div><div class="pdf-seite">1 / 34</div></div>
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
    const unz = namen.filter(n => meta[n].ungelesen && !meta[n].stumm).length; const ue = $('.l-unz'); if (ue) ue.textContent = unz || ''; const nb = $('.l-nbadge'); if (nb) { nb.textContent = unz || ''; nb.style.display = unz ? '' : 'none'; }
    const vorschauHTML = v => { v = esc(v || ''); return v.startsWith('✓✓ ') ? `<svg viewBox="0 0 18 12" class="hk-blau"><path d="M1 6.5 4.5 10 11 2.5M7 10l.6.6L14 2.5" fill="none" stroke="#53bdeb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${v.slice(3)}` : v; };   // V8.8 (C16)
    $('.l-zeilen').innerHTML = namen.map(n => { const m = meta[n]; const titel = anzeige(n);
      return `<div class="l-zeile${n === ziel ? ' ziel' : ''}" data-n="${n}">${avatar(n)}<div class="l-mitte"><b>${esc(titel)}</b><span>${vorschauHTML(m.vorschau)}</span></div><div class="l-rechts"><small class="${m.ungelesen && !m.stumm ? 'neu' : ''}">${m.tagText ? m.tagText : m.tagIdx != null && m.tagIdx < heute() ? tagLabel(m.tagIdx) : (m.zeit || '')}</small><div class="l-sym">${m.stumm ? '<u class="st">🔕</u>' : ''}${m.pin ? '<u>📌</u>' : ''}${m.ungelesen ? `<i${m.stumm ? ' class="grau"' : ''}>${m.ungelesen}</i>` : ''}</div></div></div>`; }).join('');
  }
  function chatKey(titel) {
    if (titel === gruppe.name) return 'gruppe'; if (KONTAKTE[titel]) return titel;
    const k = Object.keys(KONTAKTE).find(n => KONTAKTE[n].name === titel); if (k) return k;
    if (meta[titel] || chats[titel]) return titel;   // V8.8 (G3): z. B. Lerngruppe
    return null;
  }
  const anzeige = n => n === 'gruppe' ? gruppe.name : (KONTAKTE[n] && KONTAKTE[n].name) || n;
  // V8.8 (G3/G65): eine Benachrichtigung landet auch als Nachricht im Chat (Gruppen: „Name: Text“ trennen)
  function speichere(k, text, zeit) {
    if (!k || !text || /^\d+ neue Nachrichten$/.test(text)) return;
    const g = istGruppe(k) && text.match(/^([^:]{1,20}):\s(.*)$/); const von = g ? g[1] : k, txt = g ? g[2] : text;
    const l = chatListe(k); const h = heute();
    if (l.some(m => m.von === von && m.text === txt && m.tagIdx === h)) return;
    l.push({ von, text: txt, zeit: zeit || uhrText(), tagIdx: h, vorab: true });
  }

  // ---------- Chat ----------
  function chatListe(n) { return chats[n] || (chats[n] = []); }
  function renderChat() {
    const n = aktChat, liste = chatListe(n), box = $('.c-msgs'); box.innerHTML = '';
    let vorher = null, tag = null;
    if (!liste.length) box.insertAdjacentHTML('beforeend', '<div class="c-system">🔒 Nachrichten und Anrufe sind Ende-zu-Ende-verschlüsselt. Niemand außerhalb dieses Chats kann sie lesen.</div>');
    liste.forEach(m => { const t = tagVon(m); if (t !== tag) { box.insertAdjacentHTML('beforeend', `<div class="c-tag"><span>${esc(t)}</span></div>`); tag = t; vorher = null; } box.appendChild(bubble(m, vorher)); vorher = m; });
    box.scrollTop = box.scrollHeight;
  }
  const tagVon = m => m.tagText || tagLabel(m.tagIdx == null ? 0 : m.tagIdx);
  function bubble(m, vorher) {
    const d = document.createElement('div');
    const ich = m.von === 'Ich'; const reihe = vorher && vorher.von === m.von;
    d.className = 'msg ' + (ich ? 'ich' : 'du') + (reihe ? ' folge' : '') + (istGruppe(aktChat) && !ich ? ' gr' : '');
    let kopf = '';
    if (istGruppe(aktChat) && !ich && !reihe) kopf = `<div class="absender" style="color:${GRUPPENFARBE[m.von] || '#aaa'}">${m.von}</div>`;
    let inhalt = '';
    if (m.typ === 'foto' || m.typ === 'video') inhalt = `<div class="mfoto">${Spiel.bildHTML(m.bild, true)}${m.typ === 'video' ? '<div class="play">▶</div><div class="vdauer">0:12</div>' : ''}</div>`;
    else if (/^📄 .+\.pdf \(\d+ Seiten\)$/.test(m.text)) { const d0 = m.text.match(/^📄 (.+\.pdf) \((\d+) Seiten\)$/); inhalt = `<div class="mdoc"><span class="md-ic">PDF</span><div><b>${esc(d0[1])}</b><small>${d0[2]} Seiten · PDF · 2,1 MB</small></div></div>`; }
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
    // V8.5: nach einem neuen Datumstrenner wieder mit Name/Avatar anfangen (Gruppen)
    const neuerTag = vorher && tagLabel(vorher.tagIdx == null ? 0 : vorher.tagIdx) !== tagLabel(m.tagIdx);
    const box = $('.c-msgs'); box.appendChild(bubble(m, neuerTag ? null : vorher)); box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    return m;
  }
  function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function setzeKopf() {
    const n = aktChat; const kopf = $('.c-kopf');
    kopf.querySelector('.av').outerHTML = avatar(n);
    kopf.querySelector('b').textContent = anzeige(n);
    kopf.querySelector('small').textContent = n === 'gruppe' ? gruppe.mitglieder : istGruppe(n) ? 'tippe hier für Gruppeninfo' : '';
    kopf.classList.toggle('gr', istGruppe(n));
    $('[data-app=chat]').classList.toggle('chatstumm', !!(meta[n] && meta[n].stumm));   // V8.8 (G2): 🔕 nur am stummen Chat
  }
  function eingabe(txt, beimLoeschen) {
    const f = $('.c-eingabe'); f.querySelector('.txt').textContent = txt; f.classList.toggle('voll', txt.length > 0);
    const feld = f.querySelector('.feld'); feld.scrollTop = feld.scrollHeight;
    const w = beimLoeschen ? '' : txt.split(/\s/).pop(); const vw = $('.vw'); if (vw) vw.textContent = w ? (w.length > 12 ? w.slice(0, 11) + '…' : w) : '';  // V8.6: beim Löschen kein Wortvorschlag (sah aus, als käme Text zurück)
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
    while (arr.length) { arr.pop(); eingabe(arr.join(''), true); taste('⌫'); Ton.spiele('tipp', { rate: .8, vol: .55 }); await warte(70); }
  }
  async function sende() {
    const txt = $('.c-eingabe .txt').textContent; if (!txt) return;
    const mic = $('.mic'); mic.classList.remove('pop'); void mic.offsetWidth; mic.classList.add('pop');
    eingabe(''); tastatur(false); Ton.spiele('senden');
    const m = anhaengen({ von: 'Ich', text: txt, zeit: uhrText(), haken: 'grau1' });
    m._t = setTimeout(() => setHaken(m, 'grau2'), Spiel.schnell ? 50 : 1100);
    return m;
  }
  function setHaken(m, h) {
    if (!m) { const l = chatListe(aktChat); for (let i = l.length - 1; i >= 0; i--) if (l[i].von === 'Ich') { m = l[i]; break; } }
    if (!m) return; clearTimeout(m._t); m.haken = h; if (m.el) { const e = m.el.querySelector('.hk'); if (e) { e.className = 'hk ' + h; e.textContent = h === 'grau1' ? '✓' : '✓✓'; } }
  }
  async function schreibt(name, sek) {
    if (app === 'liste' && warteAuf) {
      const sp = $(`.l-zeile[data-n="${warteAuf}"] .l-mitte span`); if (!sp) { await warte(sek * 1000); return; }
      const alt = sp.textContent; sp.textContent = (warteAuf === 'gruppe' || (meta[warteAuf] && meta[warteAuf].gruppe)) ? name + ' schreibt …' : 'schreibt …'; sp.classList.add('gruen');
      await warte(sek * 1000); sp.textContent = alt; sp.classList.remove('gruen'); return;
    }
    const kopf = $('.c-kopf small'); const alt = kopf.textContent;
    const gr = istGruppe(aktChat);
    kopf.textContent = gr ? name + ' schreibt …' : 'schreibt …'; kopf.classList.add('gruen');
    const box = $('.c-msgs'); const d = document.createElement('div');
    d.className = 'msg du tippen' + (gr ? ' gr' : '');
    d.innerHTML = (gr ? avatar(name) : '') + '<div class="blase"><span class="punkte"><i></i><i></i><i></i></span></div>';
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
    merkeNachricht(titel, text, zeit) { const k = chatKey(titel); if (k) speichere(k, text, zeit); return k; },
    benachrichtigung(appName, titel, text, zeit) {
      if (appName === 'WhatsApp') { const k = chatKey(titel); if (k) titel = anzeige(k); if (k && !(offen && app === 'chat' && aktChat === k && !el.classList.contains('weg'))) speichere(k, text || '', zeit);
        if (k && meta[k] && meta[k].stumm) { if (!/^\d+ neue Nachrichten$/.test(text || '')) merke(k, text || '', zeit || uhrText(), 1); if (app === 'liste' && offen) renderListe(); return; } }   // V8.8 (G2): stummer Chat – kein Banner, keine Karte
      if (offen && ['video', 'anruf', 'story', 'live', 'pdf', 'feed', 'karussell'].includes(app) && !el.classList.contains('weg')) {   // V8.8 (G13): kein App-Wechsel, nur Banner oben
        if (appName === 'WhatsApp') { const k = chatKey(titel); if (k) merke(k, text || '', zeit || uhrText(), 1); }
        this.hinweis(appName, titel, text || ''); return;
      }
      if (offen && (app === 'chat' || app === 'liste') && !el.classList.contains('weg')) {
        if (appName === 'WhatsApp') { const k = chatKey(titel); if (k && k === aktChat && app === 'chat') return; if (k) merke(k, text || '', zeit || uhrText(), 1); if (app === 'liste') renderListe(); }
        this.hinweis(appName, titel, text || ''); return;
      }
      if (!offen || app !== 'sperr') { oeffne(); zeige('sperr'); }
      const ic = { WhatsApp: ['#25d366', '✆'], Instagram: ['linear-gradient(45deg,#f9a825,#e91e63,#7b1fa2)', '◎'], Wetter: ['#f0a030', '☀'], System: ['#607d8b', '⚙'], Livestream: ['#8e44ad', '▶'], YouNow: ['#2fd171', '▶'], Telefon: ['#2e7d32', '✆'], Wohlbefinden: ['#2e9e5b', '♥'] }[appName] || ['#555', '•'];
      if (appName === 'WhatsApp') { const k = chatKey(titel); if (k) merke(k, text || '', zeit || uhrText(), 1); }
      const top = $('.sp-notifs').firstElementChild; const schl = appName + '|' + titel;
      if (top && top.dataset.k === schl && text) { const z = document.createElement('div'); z.className = 'nt neu'; z.textContent = text; top.querySelector('.ntx').appendChild(z); top.querySelector('.nkopf span').textContent = zeit || uhrText(); top.classList.remove('stups'); void top.offsetWidth; top.classList.add('stups'); return; }
      const d = document.createElement('div'); d.className = 'nk'; d.dataset.k = schl;
      d.innerHTML = `<span class="nic" style="background:${ic[0]}">${ic[1]}</span><div class="ntx"><div class="nkopf"><b>${esc(titel)}</b><span>${zeit || uhrText()}</span></div>${text ? `<div class="nt">${esc(text)}</div>` : ''}${appName === 'Wohlbefinden' ? '<div class="nsub">Digitales Wohlbefinden · Wochenbericht</div>' : ''}</div><span class="npf">⌄</span>`;
      const box = $('.sp-notifs'); box.prepend(d); notifs.push(d);
      while (box.children.length > 7) box.lastChild.remove();
    },
    async wegwischen() { const n = $('.sp-notifs .nk'); if (n) { n.classList.add('wisch'); await warte(500); n.remove(); } },
    // Sperrbildschirm voll: er wischt eine weg, es kommen neue nach, er wischt schneller, bis alle weg sind
    async allesWegwischen(nachschub) {
      const neu = (nachschub || []).slice(); let tempo = 520;
      while (true) {
        const n = $('.sp-notifs .nk'); if (!n) break;
        n.classList.add('wisch'); Ton.spiele('whoosh_kurz', { vol: .18, rate: 1.6 }); await warteZ(60, tempo); n.remove();
        if (neu.length && Math.random() < .75) { const [a, t, x] = neu.shift(); this.benachrichtigung(a, t, x); Spiel.bzzz({ leise: true }); await warteZ(60, 220); }
        tempo = Math.max(170, tempo * .78);
      }
      await warteZ(60, 300);
    },
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
          for (const ch of anzeige(name)) { s.textContent += ch; Ton.spiele('tipp', { vol: .5 }); await warte(150); }
          const info = (KONTAKTE[name] && KONTAKTE[name].info) || '';
          $('.l-zeilen').innerHTML = `<div class="l-treffer">Kontakte</div><div class="l-zeile" data-n="${name}">${avatar(name)}<div class="l-mitte"><b>${esc(anzeige(name))}</b><span>${esc(info)}</span></div></div>`;
          await warte(600); zeile = $(`.l-zeile[data-n="${name}"]`);
        }
        if (zeile) { zeile.classList.add('druck'); await warte(260); }
        const s2 = $('.l-suche'); s2.classList.remove('aktiv'); s2.textContent = '🔍  Fragen Sie Meta AI oder suchen Sie';
      }
      aktChat = name; if (meta[name]) meta[name].ungelesen = 0;
      zeige('chat'); setzeKopf(); renderChat(); eingabe(''); tastatur(false);
    },
    liste() { oeffne(); renderListe(); zeige('liste'); },
    // V8.7: ungelesene Nachrichten in einem (stummen) Chat, ohne Ton und ohne Benachrichtigung
    ungelesen(n, zahl, vorschau) { const m = meta[n] || (meta[n] = { ungelesen: 0 }); m.ungelesen = zahl; m.vorschau = vorschau; m.zeit = uhrText(); m.tagIdx = heute(); m.n = ++zaehler; },
    // V8.6: Handy-Knopf – einen Chat nur ansehen (nichts schreiben). Zeigt den Verlauf bis jetzt; ungelesene Nachricht,
    // die bisher nur in der Liste stand, wird als letzte Blase gezeigt. Danach wird der Story-Chat wiederhergestellt.
    lesen(n) {
      if (this._lesenAlt === undefined) this._lesenAlt = aktChat;
      aktChat = n; setzeKopf(); tastatur(false);
      const box = $('.c-msgs'); box.innerHTML = '';
      const liste = chatListe(n).map(m => Object.assign({}, m)); const m0 = meta[n];
      if (m0 && m0.ungelesen && m0.vorschau) {
        const letzte = liste[liste.length - 1]; const vtxt = m0.vorschau;
        if (!letzte || vorschauVon(letzte) !== vtxt) {
          const g = istGruppe(n) && vtxt.match(/^([^:]{1,20}):\s(.*)$/);
          liste.push({ von: g ? g[1] : n, text: g ? g[2] : vtxt, zeit: m0.zeit || '', tagIdx: m0.tagIdx });
        }
      }
      let vorher = null, tag = null;
      if (!liste.length) box.insertAdjacentHTML('beforeend', '<div class="c-system">🔒 Nachrichten und Anrufe sind Ende-zu-Ende-verschlüsselt. Niemand außerhalb dieses Chats kann sie lesen.</div>');
      liste.forEach(m => { const t = tagVon(m); if (t !== tag) { box.insertAdjacentHTML('beforeend', `<div class="c-tag"><span>${esc(t)}</span></div>`); tag = t; vorher = null; } box.appendChild(bubble(m, vorher)); vorher = m; });
      zeige('chat'); box.scrollTop = box.scrollHeight;
    },
    lesenZuListe() { renderListe(); zeige('liste'); },
    lesenZu() { if (this._lesenAlt !== undefined) { aktChat = this._lesenAlt; this._lesenAlt = undefined; if (aktChat) { setzeKopf(); renderChat(); } } },
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
      $('.c-msgs').scrollTop = 1e6; Ton.spiele('tipp', { vol: .28, rate: 1.5 }); await warteZ(20, 600);
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
    async liveDrehen(code) { const b = $('[data-app=live] .lv-bild'); b.classList.add('dreht'); Ton.spiele('whoosh_kurz', { vol: .25 }); await warteZ(60, 260); b.innerHTML = Spiel.bildHTML(code, true); await warteZ(60, 40); b.classList.remove('dreht'); await warteZ(60, 500); },
    // V8.8 (7b B): Lena spricht ins Live – zwei Bilder wechseln wie beim Reden
    async liveSprich(a, b, sek) { const el2 = $('[data-app=live] .lv-bild'); const n = Math.round((sek || 2) / .28); for (let i = 0; i < n; i++) { el2.innerHTML = Spiel.bildHTML(i % 2 ? b : a, true); await warteZ(20, 280); } el2.innerHTML = Spiel.bildHTML(b, true); },
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
      merke(n, ((n === 'gruppe' || (meta[n] && meta[n].gruppe)) ? von + ': ' : '') + vorschau, uhrText(), 1); renderListe(); if (!(meta[n] && meta[n].stumm)) Spiel.bzzz({ entprellen: true });
      const z = $(`.l-zeile[data-n="${n}"]`); if (z) { z.classList.remove('neuda'); void z.offsetWidth; z.classList.add('neuda'); }
      await warteZ(20, 1300 + Math.random() * 1100); await this.chat(n, true);
    },
    // älterer Verlauf (vor Spielbeginn)
    alt(name, tag, zeit, von, text) {
      if (name === gruppe.name) name = 'gruppe';
      const g = von !== 'Ich' && von !== name && name !== 'gruppe';
      const m = meta[name] || (meta[name] = { ungelesen: 0 }); if (g) m.gruppe = true; if (name === 'Jonas') m.pin = true;
      // V8.8 (G14): unbekannte Tage (z. B. „12. Juli“, „02.12.“) bleiben so stehen, wie sie im Skript stehen
      const bek = TAG_AUS_TEXT[tag] != null; const ti = bek ? TAG_AUS_TEXT[tag] : -30;
      chatListe(name).push({ von, text, zeit, tag, tagIdx: ti, tagText: bek ? null : tag, haken: von === 'Ich' ? 'blau' : null });
      merke(name, (von === 'Ich' ? ((g || name === 'gruppe') ? '✓✓ Du: ' : '✓✓ ') : ((g || name === 'gruppe') ? von + ': ' : '')) + text, zeit, 0, ti); meta[name].tagText = bek ? null : tag;
    },
    gruppeOeffnen() { return this.chat('gruppe'); },
    async nachricht(von, text, sofort) {
      let schonGewartet = false;
      { const ziel = app === 'liste' && warteAuf ? warteAuf : app === 'chat' ? aktChat : von; const h = heute();
        const dup = chatListe(ziel).find(x => x.vorab && x.von === von && x.text === text && x.tagIdx === h); if (dup) { dup.vorab = false;   // V8.8 (G3): kam schon als Benachrichtigung – nicht doppelt
          if (app === 'liste' && warteAuf) await this.chat(warteAuf, true); else if (app !== 'chat') await this.chat(von); else renderChat();
          if (meta[aktChat]) meta[aktChat].ungelesen = 0; await warte(450); return; } }
      if (app === 'liste' && warteAuf && !sofort) { await this.geier(von, text, Math.min(4.5, 1.1 + text.length * .05)); schonGewartet = true; }
      if (app === 'liste' && warteAuf) { const n = warteAuf; merke(n, ((n === 'gruppe' || (meta[n] && meta[n].gruppe)) ? von + ': ' : '') + text, uhrText(), 1); renderListe(); if (!schonGewartet && !(meta[n] && meta[n].stumm)) Spiel.bzzz({ entprellen: true }); await warteZ(20, 1100 + Math.random() * 700); await this.chat(n, true); schonGewartet = true; }
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
      if (!sofort && !schonGewartet) Ton.spiele('tipp', { vol: .28, rate: 1.5 });   // V8.8 (G2): offener Chat vibriert nicht
      // Antwort → eigene Nachrichten blau
      chatListe(aktChat).forEach(x => { if (x.von === 'Ich' && x.haken !== 'blau') setHaken(x, 'blau'); });
      
      await warte(450);
    },
    async ich(text, haken) { await this.rein(); if (app !== 'chat') return; anhaengen({ von: 'Ich', text, zeit: uhrText(), haken: haken || 'grau2' }); },
    async foto(code, von, typ = 'foto') { if (app === 'liste' && warteAuf) await this.geier(von, typ === 'video' ? '🎥 Video' : '📷 Foto', 1.3); else { if (app !== 'chat') await this.chat('gruppe'); await warte(400); await schreibt(von, 1.3); }
      // V8.8: der Platzhalter aus der Benachrichtigung („🎥 Video“) wird durch das echte Foto/Video ersetzt
      { const l = chatListe(aktChat); const i = l.findIndex(x => x.vorab && x.von === von && /^(📷|🎥)/.test(x.text)); if (i >= 0) { const alt = l.splice(i, 1)[0]; if (alt.el) alt.el.remove(); } }
      anhaengen({ von, typ, bild: code, zeit: uhrText() });  await warte(500); },
    async fotozoom() {
      const f = [...el.querySelectorAll('.mfoto')].pop(); if (!f) return; const r = f.cloneNode(true); r.className = 'fotogross'; $('.screen').appendChild(r);
      // Zoom-Ziel aus der Bildliste (z. B. Lynn hinten in der Küche), damit der Ausschnitt im Hochformat auf ihr liegt
      const im = r.querySelector('img'); const m = im && (im.getAttribute('src') || '').match(/img\/([^./]+)\.webp/); const z = m && typeof BILDER !== 'undefined' && BILDER[m[1]] && BILDER[m[1]].zoom;
      if (z && r.firstElementChild) { const p = `${z[0] * 100}% ${z[1] * 100}%`; r.firstElementChild.style.objectPosition = p; r.firstElementChild.style.transformOrigin = p; }
      // Fokus ziehen: scharfe Fassung liegt deckungsgleich darüber und blendet während des Zooms ein
      const sch = z && BILDER[m[1]].scharf && BILDER[BILDER[m[1]].scharf];
      if (sch) { const s2 = document.createElement('img'); s2.className = 'fz-scharf'; s2.src = sch.datei; s2.alt = ''; s2.style.objectPosition = s2.style.transformOrigin = `${z[0] * 100}% ${z[1] * 100}%`; r.appendChild(s2); }
      await warte(30); r.classList.add('an'); await warte(1200); r.classList.add('zoom');
      if (sch) setTimeout(() => r.classList.add('fokus'), 1700);
    },
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
    async story(name, code, dauer = 5, zeit = null, aufrufe = null, text = null) {
      oeffne(); zeige('story'); const s = $('[data-app=story]');
      s.querySelector('.st-name').textContent = name; s.querySelector('.st-bild').innerHTML = Spiel.bildHTML(code, true) + (text ? `<div class="st-text st-text-story">${esc(text)}</div>` : '');   // V8.8: Text auf der Story
      // Querformat-Foto in der Story ganz zeigen (wie Instagram: Bild über die Breite, Farbverlauf dahinter), z. B. das Gruppenfoto N27
      s.querySelector('.st-bild').classList.toggle('ganz', !!(typeof BILDER !== 'undefined' && BILDER[code] && BILDER[code].story === 'ganz'));
      s.querySelector('.av').outerHTML = `<span class="av" style="background:${name.includes('lena') ? '#e0558e' : name.includes('lynn') ? '#3d4a66' : name.includes('mia') ? '#9b6ad8' : name.includes('tim') ? '#22a39a' : `hsl(${[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0)},38%,42%)`}">${name.replace(/[^a-z]/i, '')[0].toUpperCase()}</span>`;
      s.querySelector('.st-zeit').textContent = zeit || (name === 'lynn' ? '9 Std.' : (Math.floor(Math.random() * 40) + 3) + ' Min.');
      s.classList.toggle('aufrufe', aufrufe != null && aufrufe !== ''); if (aufrufe) s.querySelector('.st-views b').textContent = aufrufe;
      s.classList.remove('post'); const b = s.querySelector('.st-balken i'); b.style.transition = 'none'; b.style.width = '0'; void b.offsetWidth;
      b.style.transition = `width ${dauer * (Spiel.schnell ? .15 : 1)}s linear`; b.style.width = '100%';
    },
    post(code, text) {
      oeffne(); zeige('story'); const s = $('[data-app=story]'); s.classList.add('post'); s.classList.remove('aufrufe'); s.querySelector('.st-bild').classList.remove('ganz');
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
    async karussell(modus) {
      const k = $('[data-app=karussell]'); const p = k.querySelectorAll('.ka-punkte i');
      if (modus === 'weiter') { k.classList.add('weg'); Ton.spiele('whoosh_kurz', { vol: .35 }); await warteZ(20, 350); this.feed(); await warteZ(20, 1600); return; }
      oeffne(); zeige('karussell'); k.classList.remove('wisch', 'wisch2', 'weg');
      const zl = k.querySelector('.ka-zahl'); zl.textContent = '1/5';
      p.forEach((x, i) => x.classList.toggle('an', i === 0)); await warteZ(20, 2200);
      k.classList.add('wisch'); p[0].classList.remove('an'); p[1].classList.add('an'); zl.textContent = '2/5'; await warteZ(20, 1500);
      if (modus === 'zwei') { k.classList.add('wisch2'); p[1].classList.remove('an'); p[2].classList.add('an'); zl.textContent = '3/5'; await warteZ(20, 1300); return; }
      k.classList.add('weg'); Ton.spiele('whoosh_kurz', { vol: .35 }); await warteZ(20, 350); this.feed(); await warteZ(20, 1600);
    },
    // Storys fremder Leute im Schnelldurchlauf
    async storys(codes) {
      const namen = ['tim_k97', 'nightcrew', 'jule.mxn', 'paulfrnk', 'x.mia.x', 'lea.vbs', 'kai_ontour', 'hannah.lt'];
      for (let i = 0; i < codes.length; i++) { const m = codes[i].match(/^(.+)=(.+)$/); await this.story(m ? m[1] : namen[i % namen.length], m ? m[2] : codes[i], .9); await warteZ(20, 780 - Math.min(i * 60, 360)); }
    },
    async notizenDatum() {
      const t = $('.n-tag'); if (!t) return; let s = t.textContent; const ziel = 'Sonntag';
      while (s.length) { s = s.slice(0, -1); t.textContent = s; Ton.spiele('tipp', { rate: .8, vol: .55 }); await warte(70); }
      for (const z of ziel) { s += z; t.textContent = s; Ton.spiele('tipp'); await warte(110); }
    },
    feed() {
      oeffne(); zeige('feed'); const r = $('.f-rolle'); const jetzt = Spiel.V.uhr || 0;
      const farbe = n => n.includes('lena') ? '#e0558e' : n.includes('mia') ? '#9b6ad8' : n.includes('tim') ? '#22a39a' : n.includes('jonas') ? '#e8833a' : '#5a6a8a';
      const posts = IG_FEED.filter(p => p[2] <= jetzt).reverse();
      const storys = ['lena.xo', 'x.mia.x', 'tim_k97', 'jonas.k', 'nightcrew', 'ben.r'];
      const zeitText = t => { const d = Math.max(1, jetzt - t); return d < 60 ? d + ' Min.' : Math.round(d / 60) + ' Std.'; };
      let h = `<div class="ig-storys"><div class="ig-st ich"><span class="ig-av gross"><b>Du</b></span><small>Deine Story</small></div>${storys.map(n => `<div class="ig-st"><span class="ig-av gross ring" style="--c:${farbe(n)}"><b>${n[0]}</b></span><small>${n}</small></div>`).join('')}</div>`;
      posts.forEach((p, i) => { const likes = 37 + ((p[1].length * 97 + i * 53) % 260);
        h += `<div class="ig-post"><div class="ig-pk"><span class="ig-av ring" style="--c:${farbe(p[0])}"><b>${p[0][0]}</b></span><div class="ig-pn"><b>${p[0]}</b></div>${IG.punkte}</div><div class="ig-bild">${Spiel.bildHTML(p[1], true)}</div>
        <div class="ig-ak"><span>${IG.herz}${IG.sprech}${IG.senden}</span>${IG.merken}</div><div class="ig-tx"><b>Gefällt ${likes} Mal</b></div><div class="ig-tx"><b>${p[0]}</b> ${esc(p[3])}</div><div class="ig-tx grau">Vor ${zeitText(p[2])}</div></div>`; });
      r.innerHTML = h + h.replace('ig-storys', 'ig-storys nb'); r.classList.remove('rollt'); void r.offsetWidth; r.classList.add('rollt');
    },
    video(code) { oeffne(); zeige('video'); $('.v-bild').innerHTML = Spiel.bildHTML(code, true); const b = $('.v-balken i'); b.style.transition = 'none'; b.style.width = '0'; void b.offsetWidth; b.style.transition = 'width 12s linear'; b.style.width = '100%'; },
    async stumm() {
      oeffne(); el.classList.add('schnapp'); zeige('sperr'); await warte(250); el.classList.remove('schnapp');
      Ton.spiele('klick'); const t = $('.stummtoast'); t.classList.add('an'); $('.sp-stumm').classList.add('an'); el.classList.add('handy-stumm'); await warte(1300);
    },
    aus() { Ton.spiele('klick'); $('.displayaus').classList.add('an'); },
    laut() { $('.sp-stumm').classList.remove('an'); el.classList.remove('handy-stumm'); },   // V8.8 (G19)
    // V8.8 (G29): beim Selbst-Nachschauen zeigt der Sperrbildschirm die ungelesenen Chats (außer stummen)
    sperrUngelesen() {
      const box = $('.sp-notifs'); if (box.children.length) return;
      Object.keys(meta).filter(n => meta[n].ungelesen && !meta[n].stumm && meta[n].vorschau).sort((a, b) => meta[b].n - meta[a].n).slice(0, 5).forEach(n => {
        const m = meta[n]; const d = document.createElement('div'); d.className = 'nk'; d.dataset.k = 'WhatsApp|' + anzeige(n);
        d.innerHTML = `<span class="nic" style="background:#25d366">✆</span><div class="ntx"><div class="nkopf"><b>${esc(anzeige(n))}</b><span>${m.zeit || ''}</span></div><div class="nt">${esc(m.vorschau)}${m.ungelesen > 1 ? ` <small style="opacity:.6">(${m.ungelesen})</small>` : ''}</div></div><span class="npf">⌄</span>`;
        box.appendChild(d); });
    },
    // ---- V8.5 Sonntagnacht: PDF öffnen und durchscrollen ----
    async pdf(name, seiten) {
      oeffne(); zeige('pdf'); this._pdf = { seiten: +seiten || 34, seite: 1, y: 0 };
      $('.pdf-name').textContent = name; const r = $('.pdf-rolle'); r.style.transition = 'none'; r.style.transform = 'translateY(0)';
      const T = PDF_INHALT; let h = '';
      for (let i = 0; i < this._pdf.seiten; i++) { const k = T[i % T.length]; h += `<div class="pdf-blatt"><div class="pb-kopf">Bereicherungsrecht · Zusammenfassung</div><h4>${esc(k[0])}</h4>${k[1].map(z => `<p>${esc(z)}</p>`).join('')}<div class="pb-zeilen">${'<i></i>'.repeat(9)}</div><div class="pb-nr">${i + 1}</div></div>`; }
      r.innerHTML = h; $('.pdf-seite').textContent = `1 / ${this._pdf.seiten}`; Ton.spiele('display_klick'); await warte(900);
    },
    // ein paar Seiten weiter (Wischen), Seitenzahl läuft mit
    async pdfWeiter(bis) {
      const p = this._pdf; if (!p) return; const r = $('.pdf-rolle'); const ziel = Math.min(p.seiten, +bis || p.seite + 3);
      while (p.seite < ziel) {
        p.seite++; const blatt = r.children[p.seite - 1]; if (!blatt) break;
        r.style.transition = 'transform .55s cubic-bezier(.2,.7,.3,1)'; r.style.transform = `translateY(${-blatt.offsetTop}px)`;
        $('.pdf-seite').textContent = `${p.seite} / ${p.seiten}`; Ton.spiele('whoosh_kurz', { vol: .12, rate: 1.7 }); await warteZ(20, 650 + Math.random() * 350);
      }
    },
    // ---- V8.5: Gruppe stummschalten wie WhatsApp: ⋮ → „Benachr. stummschalten“ → „Immer“ → OK ----
    async gruppeStumm(name) {
      if (name && !(offen && app === 'chat' && aktChat === name)) await this.chat(name);
      const c = $('[data-app=chat]'); const ic = $('.c-ic'); tastatur(false);
      ic.classList.add('druck'); Ton.spiele('display_klick'); await warte(260); ic.classList.remove('druck');
      c.classList.add('menue'); await warte(1100);
      const sp = $('.stummpunkt'); sp.classList.add('druck'); Ton.spiele('display_klick'); await warte(320); sp.classList.remove('druck');
      c.classList.remove('menue'); c.classList.add('dialog'); $$('.cd-opt').forEach(o => o.classList.toggle('an', o.dataset.o === '8')); await warte(1300);
      const im = $('.cd-opt[data-o=immer]'); $$('.cd-opt').forEach(o => o.classList.remove('an')); im.classList.add('an', 'druck'); Ton.spiele('display_klick'); await warte(700); im.classList.remove('druck');
      const ok = $('.cd-knoepfe .ok'); ok.classList.add('druck'); Ton.spiele('display_klick'); await warte(300); ok.classList.remove('druck');
      c.classList.remove('dialog'); if (aktChat && meta[aktChat]) meta[aktChat].stumm = true; c.classList.add('chatstumm'); await warte(600);
    },
    reset() {
      for (const k in chats) delete chats[k];
      $('.sp-stumm').classList.remove('an'); el.classList.remove('handy-stumm'); $('[data-app=chat]').classList.remove('chatstumm', 'menue', 'dialog'); for (const k in meta) delete meta[k]; warteAuf = null; $('.n-titel').innerHTML = 'Lernplan <span class="n-tag">Samstag</span><i class="cursor"></i>'; $('.n-liste').innerHTML = '<div>☐ 9:00 Schuldrecht AT</div><div>☐ 10:00 BGB AT</div><div>☐ 14:00 Fälle 1–5</div>'; this.fotozoomWeg(); this.zu();
    },
  };
})();
