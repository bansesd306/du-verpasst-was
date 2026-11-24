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
  let sonst = [];   // V8.9: ungelesene Meldungen anderer Apps (Instagram, Wohlbefinden …) für Zahl am Handy-Knopf
  let zaehler = 0, warteAuf = null;
  // Tage: 0 = Freitag (Spielbeginn). Datumstrenner und Zeiten in der Liste hängen vom heutigen Spieltag ab.
  const WTAG = { '-3': 'Dienstag', '-2': 'Mittwoch', '-1': 'Donnerstag', 0: 'Freitag', 1: 'Samstag', 2: 'Sonntag', 3: 'Montag' };
  const TAG_AUS_TEXT = { Gestern: -1, Mittwoch: -2, Dienstag: -3, Donnerstag: -1, Heute: 0 };
  function heute() { try { return Math.floor(Spiel.V.uhr / 1440); } catch (e) { return 0; } }
  function tagLabel(i) { const d = heute() - i; return d <= 0 ? 'Heute' : d === 1 ? 'Gestern' : (WTAG[i] || ''); }
  function merke(n, vorschau, zeit, ungelesen, tagIdx) { const m = meta[n] || (meta[n] = { ungelesen: 0 }); m.vorschau = vorschau; m.zeit = zeit; m.tagIdx = tagIdx == null ? heute() : tagIdx; m.tagText = null; m.n = ++zaehler; if (ungelesen) m.ungelesen += ungelesen; }
  // V8.9 (Patrick 24.11.): echte App-Zeichen, damit jede Meldung echt aussieht (Formen: Simple Icons, CC0; Outlook/Google Fotos nachgezeichnet)
  const APPICON = { WhatsApp: ['#25d366', '<svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>', 'svgi'], Instagram: ['radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285aeb 90%)', '<svg viewBox="0 0 24 24" fill="#fff"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>', 'svgi'], Kleinanzeigen: ['#b5e941', '<svg viewBox="0 0 24 24" fill="#1d4b00"><path d="M17.064 24c-3.234 0-4.816-2.245-5.137-2.71-.955.935-2.396 2.71-4.991 2.71-2.998 0-5.524-2.254-5.524-5.908V5.907C1.412 2.245 3.942 0 6.936 0c2.993 0 5.524 2.385 5.524 5.852a5.512 5.512 0 0 1 1.842-.314c3.083 0 5.524 2.515 5.524 5.538 0 .848-.161 1.602-.513 2.324a5.539 5.539 0 0 1 3.275 5.062c0 3.053-2.478 5.538-5.524 5.538zm-3.802-4.048c.795 1.383 2.132 2.202 3.802 2.202a3.692 3.692 0 0 0 3.683-3.692 3.689 3.689 0 0 0-2.518-3.505l-4.967 4.995zM6.936 1.846c-1.832 0-3.683 1.256-3.683 4.061v12.185c0 2.806 1.85 4.062 3.683 4.062 1.456 0 2.26-.736 3.557-2.037l.575-.576c-.297-.886-.45-1.869-.45-2.926V5.908c0-2.806-1.849-4.062-3.682-4.062zm5.524 6.031v8.738c0 .495.042.966.12 1.409l4.003-4.013c1.163-1.165 1.402-2.016 1.402-2.934 0-1.962-1.573-3.692-3.683-3.692-.657 0-1.285.169-1.842.493z"/></svg>', 'svgi'], Outlook: ['linear-gradient(135deg,#28a8ea,#0f6cbd)', '<svg viewBox="0 0 24 24"><path d="M9 6.5h11.2c.7 0 1.3.6 1.3 1.3v8.4c0 .7-.6 1.3-1.3 1.3H9z" fill="#fff" fill-opacity=".55"/><path d="M9.5 8l6 4.6L21 8" fill="none" stroke="#fff" stroke-width="1.3"/><rect x="2.5" y="4.5" width="10.5" height="15" rx="1.6" fill="#0a4f9e"/><ellipse cx="7.75" cy="12" rx="2.6" ry="3.4" fill="none" stroke="#fff" stroke-width="1.9"/></svg>', 'svgi gross'], Galerie: ['#fff', '<svg viewBox="0 0 24 24"><path d="M12 12V2a5 5 0 0 1 0 10z" fill="#EA4335"/><path d="M12 12h10a5 5 0 0 1-10 0z" fill="#4285F4"/><path d="M12 12v10a5 5 0 0 1 0-10z" fill="#34A853"/><path d="M12 12H2a5 5 0 0 1 10 0z" fill="#FBBC04"/></svg>', 'svgi gross'], Wetter: ['#f0a030', '☀'], System: ['#607d8b', '⚙'], Livestream: ['#8e44ad', '▶'], YouNow: ['#2fd171', '▶'], Telefon: ['#2e7d32', '✆'], Wohlbefinden: ['#2e9e5b', '♥'] };
  const APPNAME = { Galerie: 'Google Fotos', Outlook: 'Outlook', System: 'Einstellungen', Wohlbefinden: 'Digitales Wohlbefinden', Telefon: 'Telefon' };   // V8.9: App-Name oben in der Karte (wie Android)
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
      <div class="ka-fenster"><div class="ka-band"><div class="ka-seite a"><span class="ka-chip">STUDY TIPPS 📚</span><div class="ka-titel">5 Lerntipps, die <mark>WIRKLICH</mark> funktionieren</div><span class="ka-handle">@studygram.de</span><span class="ka-swipe">swipe →</span><i class="ka-deko d1"></i><i class="ka-deko d2"></i></div><div class="ka-seite b"><span class="ka-nr">01</span><div class="ka-txt"><mark>Handy weglegen.</mark></div><span class="ka-sticker">📵</span><span class="ka-handle">@studygram.de</span></div><div class="ka-seite c"><span class="ka-nr">02</span><div class="ka-txt"><mark>Pausen bewusst einplanen.</mark></div><span class="ka-sticker">⏰</span><span class="ka-handle">@studygram.de</span></div></div><span class="ka-zahl">1/5</span></div>
      <div class="ig-ak"><span>${IG.herz}${IG.sprech}${IG.senden}</span><div class="ka-punkte"><i class="an"></i><i></i><i></i><i></i><i></i></div>${IG.merken}</div>
      <div class="ig-tx"><b>Gefällt 2.318 Mal</b></div><div class="ig-tx"><b>studygram.de</b> Speichern für die Prüfungsphase 📌</div></div></div>${IG_NAV}</div>
    <div class="app" data-app="pdf"><div class="pdf-kopf"><span>←</span><b class="pdf-name"></b><span>⋮</span></div><div class="pdf-fenster"><div class="pdf-rolle"></div></div><div class="pdf-seite">1 / 34</div></div>
    <div class="app" data-app="wecker"><div class="w-oben"><div class="w-label">⏰ Wecker</div><div class="w-uhr">06:30</div><div class="w-datum">Mo., 14. Januar</div></div><div class="w-knoepfe"><div class="w-schl">Schlummern</div><div class="w-stopp"><span>✕</span></div></div></div>
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
    aktualisiereZeit(); displayFarbe();
  }
  // V8.9 (Patrick 24.11., Animation 2): das Handylicht im Raum nimmt die Farbe dessen an, was gerade auf dem Display ist
  const APPFARBE = { chat: [205, 225, 205], liste: [232, 238, 240], sperr: [120, 160, 255], anruf: [90, 170, 120], wecker: [150, 170, 255], notizen: [245, 238, 205], pdf: [240, 240, 240] };
  const farbCanvas = document.createElement('canvas'); farbCanvas.width = farbCanvas.height = 8;
  function setzeLicht(r, g, b) { [el].forEach(h => { if (!h) return; h.style.setProperty('--hr', r); h.style.setProperty('--hg', g); h.style.setProperty('--hb', b); }); }
  function displayFarbe() {
    clearTimeout(displayFarbe.t);
    displayFarbe.t = setTimeout(() => {
      const a = el.querySelector('.app.an'); const img = a && a.querySelector('img'); const f = APPFARBE[app] || [110, 165, 255];
      if (!img || ['chat', 'liste', 'sperr'].includes(app)) { setzeLicht(...f); return; }
      const nimm = () => { try { const c = farbCanvas.getContext('2d', { willReadFrequently: true }); c.drawImage(img, 0, 0, 8, 8); const d = c.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } const n = d.length / 4; r /= n; g /= n; b /= n;
        // Display-Licht ist hell: Farbe behalten, aber auf Leuchtkraft anheben (sonst wird ein dunkles Bild zu grauem Licht)
        const m = Math.max(r, g, b, 1), k = Math.min(255 / m, 2.2); setzeLicht(Math.round(r * k * .85 + 30), Math.round(g * k * .85 + 30), Math.round(b * k * .85 + 30)); } catch (e) { setzeLicht(...f); } };
      if (img.complete && img.naturalWidth) nimm(); else img.addEventListener('load', nimm, { once: true });
    }, 60);
  }
  function avatar(n, gross) {
    if (istGruppe(n)) return `<span class="av gr">👥</span>`;
    let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) % 360;
    const k = KONTAKTE[n] || { farbe: `hsl(${h},38%,42%)` }; return `<span class="av" style="background:${k.farbe}">${(n || '?')[0]}</span>`;
  }
  function oeffne() {
    if (!offen) { offen = true; el.classList.add('an', 'aufwachen'); document.getElementById('buehne').classList.add('handyoffen');
      // Display geht an, kurz nachdem das Handy in der Hand ist (nicht schon unterwegs)
      clearTimeout(el.tw); void el.offsetWidth; el.tw = setTimeout(() => el.classList.remove('aufwachen'), Spiel.schnell ? 0 : 260); }
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
    if (!k || !text || /^\d+ neue Nachrichten$/.test(text) || /^([^:]{1,20}:\s)?📊 /.test(text)) return;   // Umfragen baut die Umfrage selbst
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
    sperr() { oeffne(); zeige('sperr'); this.sperrUngelesen(); },
    merkeNachricht(titel, text, zeit) { const k = chatKey(titel); if (k) speichere(k, text, zeit); return k; },
    benachrichtigung(appName, titel, text, zeit) {
      // V8.9 (Patrick 24.11.): Meldungen bleiben auf dem Sperrbildschirm stehen, bis man sie liest (Chat öffnen) oder selbst nachschaut
      const wa = appName === 'WhatsApp'; const k = wa ? chatKey(titel) : null; if (k) titel = anzeige(k);
      const sichtbar = offen && !el.classList.contains('weg');
      if (wa && k && meta[k] && meta[k].stumm) { speichere(k, text || '', zeit); if (!/^\d+ neue Nachrichten$/.test(text || '')) merke(k, text || '', zeit || uhrText(), 1); if (app === 'liste' && offen) renderListe(); return; }   // V8.8 (G2): stummer Chat – kein Banner, keine Karte
      if (sichtbar && ['video', 'anruf', 'story', 'live', 'pdf', 'feed', 'karussell', 'wecker', 'notizen'].includes(app)) {   // V8.8 (G13): kein App-Wechsel, nur Banner oben
        if (k) { speichere(k, text || '', zeit); merke(k, text || '', zeit || uhrText(), 1); } else if (!wa) this.meldung(appName, titel, text, zeit);
        this.hinweis(appName, titel, text || ''); return;
      }
      if (sichtbar && (app === 'chat' || app === 'liste')) {
        if (k && k === aktChat && app === 'chat') return;
        if (k) { speichere(k, text || '', zeit); merke(k, text || '', zeit || uhrText(), 1); if (app === 'liste') renderListe(); } else if (!wa) this.meldung(appName, titel, text, zeit);
        this.hinweis(appName, titel, text || ''); return;
      }
      if (!offen || app !== 'sperr') { oeffne(); zeige('sperr'); }
      this.sperrUngelesen();   // was vorher kam und noch nicht gelesen ist, steht schon da
      if (k) { speichere(k, text || '', zeit); merke(k, text || '', zeit || uhrText(), 1); } else if (!wa) this.meldung(appName, titel, text, zeit, true);
      const box = $('.sp-notifs'); const schl = appName + '|' + titel; const z = zeit || uhrText();
      const da = [...box.children].find(c => c.dataset.k === schl);
      if (da) {   // gruppiert wie Android: neue Zeile in die vorhandene Karte, Karte nach oben
        const nts = da.querySelectorAll('.nt'); const letzt = nts[nts.length - 1];
        if (text && (!letzt || letzt.textContent !== text)) { const d2 = document.createElement('div'); d2.className = 'nt neu'; d2.textContent = text; da.querySelector('.ntx').appendChild(d2); if (nts.length >= 3) nts[0].remove(); }
        da.querySelector('.nkopf span').textContent = z; this._zahlKarte(da, k);
        box.prepend(da); box.scrollTop = 0; da.classList.remove('stups'); void da.offsetWidth; da.classList.add('stups'); return;
      }
      const d = this._karte(appName, titel, text ? [text] : [], z, k);
      box.prepend(d); box.scrollTop = 0; notifs.push(d);
      while (box.children.length > 12) box.lastChild.remove();
    },
    _karte(appName, titel, texte, zeit, k) {
      const ic = APPICON[appName] || ['#555', '•']; const d = document.createElement('div'); d.className = 'nk'; d.dataset.k = appName + '|' + titel;
      d.innerHTML = `<span class="nic${ic[2] ? ' ' + ic[2] : ''}" style="background:${ic[0]}">${ic[1]}</span><div class="ntx"><div class="napp">${esc(APPNAME[appName] || appName)}</div><div class="nkopf"><b>${esc(titel)}</b><em class="nz"></em><span>${zeit}</span></div>${texte.map(t => `<div class="nt">${esc(t)}</div>`).join('')}${appName === 'Wohlbefinden' ? '<div class="nsub">Digitales Wohlbefinden · Wochenbericht</div>' : ''}</div><span class="npf">⌄</span>`;
      this._zahlKarte(d, k); return d;
    },
    _zahlKarte(d, k) { const e = d.querySelector('.nz'); if (!e) return; const n = k && meta[k] ? meta[k].ungelesen || 0 : 0; e.textContent = n > 1 ? n + ' Nachrichten' : ''; },
    // Tippen auf eine WhatsApp-Karte beim Selbst-Nachschauen: diesen Chat lesen
    chatVonKarte(karte) { const m = (karte.dataset.k || '').match(/^WhatsApp\|(.*)$/); return m ? chatKey(m[1]) : null; },
    sperrScroll(dy) { const b = $('.sp-notifs'); const sk = el.getBoundingClientRect().height / (el.offsetHeight || 1) || 1; b.scrollTop += dy / sk; },
    async wegwischen() { const n = $('.sp-notifs .nk'); if (n) { this._wegKarte(n); n.classList.add('wisch'); await warte(500); n.remove(); } },
    _wegKarte(n) { const [a, ...t] = (n.dataset.k || '').split('|'); if (a !== 'WhatsApp') this.appGeoeffnet(a, t.join('|')); },
    // Sperrbildschirm voll: er wischt eine weg, es kommen neue nach, er wischt schneller, bis alle weg sind
    async allesWegwischen(nachschub) {
      const neu = (nachschub || []).slice(); let tempo = 520;
      while (true) {
        const n = $('.sp-notifs .nk'); if (!n) break;
        this._wegKarte(n); n.classList.add('wisch'); Ton.spiele('whoosh_kurz', { vol: .18, rate: 1.6 }); await warteZ(60, tempo); n.remove();
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
      const orig = chatListe(n); const m0 = meta[n];
      if (m0 && m0.ungelesen && m0.vorschau) {
        const letzte = orig[orig.length - 1]; const vtxt = m0.vorschau;
        if (!letzte || vorschauVon(letzte) !== vtxt) {
          const g = istGruppe(n) && vtxt.match(/^([^:]{1,20}):\s(.*)$/);
          orig.push({ von: g ? g[1] : n, text: g ? g[2] : vtxt, zeit: m0.zeit || '', tagIdx: m0.tagIdx });   // V8.9: bleibt im Chat, auch wenn man ihn später wieder öffnet
        }
      }
      // V8.9: gelesen = Zahl weg. Haken bleiben, wie die Story sie setzt (blau wird erst, wenn der andere liest)
      if (m0) m0.ungelesen = 0;
      const liste = orig.map(m => Object.assign({}, m));
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
      oeffne(); zeige('live'); const l = $('[data-app=live]'); this.appGeoeffnet('Instagram', 'lena.xo');
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
    async nachricht(von, text, sofort, nachBzzz) {
      let schonGewartet = false;
      if (nachBzzz && app === 'chat') sofort = true;   // V8.9: Handy hat gerade vibriert und der Chat ist offen → Nachricht muss da sein
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
    // V8.9 (Patrick 24.11.): „214 neue Nachrichten“ – Trenner wie WhatsApp und sichtbar viele Nachrichten, die durchrauschen (nur Fotos, Videos, Emojis, Sprachnachrichten)
    async flut(n) {
      await this.rein(); if (app !== 'chat') return; const box = $('.c-msgs');
      box.insertAdjacentHTML('beforeend', `<div class="c-ungelesen"><span>${n} ungelesene Nachrichten</span></div>`);
      const LEUTE = ['Mia', 'Jonas', 'Tim', 'Lena', 'Ben', 'Sophie', 'Max', 'Leo'];
      const FUELL = [['f', 'N32a'], ['t', '😂😂😂'], ['t', '🔥🔥🔥'], ['f', 'N32c'], ['t', '🎤 Sprachnachricht (0:14)'], ['t', '😭😭'], ['f', 'TORTE'], ['t', '🎉🎉'], ['v', 'N32b'], ['t', '💀'], ['f', 'N32d'], ['t', '😂'], ['f', 'A1'], ['t', '🙈'], ['t', '🥳🥳🥳'], ['f', 'B12A'], ['t', '😭😭😭'], ['t', '🎤 Sprachnachricht (0:31)'], ['t', '❤️'], ['t', '🍕'], ['f', 'FEUER'], ['t', '😂😂']];
      const zahl = Math.min(30, n);
      for (let i = 0; i < zahl; i++) {
        const [typ, x] = FUELL[i % FUELL.length]; const von = LEUTE[(i * 3 + 1) % LEUTE.length];
        const min = 10 + Math.round(i * (330 / zahl)); const zeit = String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
        anhaengen(typ === 't' ? { von, text: x, zeit } : { von, typ: typ === 'v' ? 'video' : 'foto', bild: x, zeit });
        box.scrollTop = box.scrollHeight;
        await warteZ(10, Math.max(45, 150 - i * 5));
      }
      if (meta[aktChat]) meta[aktChat].ungelesen = 0;
      await warte(300);
    },
    fotozoomWeg() { el.querySelectorAll('.fotogross').forEach(e => e.remove()); },
    async tippeUndSende(text) { await this.rein(); if (app !== 'chat') return; await tippe(text); return sende(); },
    tippe, sende, loesche,
    async eintippen(text) { await tippe(text); },
    async abschicken() { await sende(); },
    async tippeUndLoesche(text) { await this.rein(); if (app !== 'chat') return; await tippe(text); await warte(900); await loesche(); await warte(400); tastatur(false); },   // V8.9: tippt, überlegt, löscht alles – nichts wird gesendet
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
      oeffne(); zeige('story'); const s = $('[data-app=story]'); this.appGeoeffnet('Instagram', name);
      { const h = s.querySelector('.st-fuss span'); if (h) { h.textContent = '♡'; h.classList.remove('rot'); } }   // V8.9: Herz bei jeder neuen Story wieder leer
      s.querySelector('.st-name').textContent = name; s.querySelector('.st-bild').innerHTML = Spiel.bildHTML(code, true) + (text ? `<div class="st-text st-text-story">${esc(text)}</div>` : '');   // V8.8: Text auf der Story
      // Querformat-Foto in der Story ganz zeigen (wie Instagram: Bild über die Breite, Farbverlauf dahinter), z. B. das Gruppenfoto N27
      s.querySelector('.st-bild').classList.toggle('ganz', !!(typeof BILDER !== 'undefined' && BILDER[code] && BILDER[code].story === 'ganz'));
      s.querySelector('.av').outerHTML = `<span class="av" style="background:${name.includes('lena') ? '#e0558e' : name.includes('lynn') ? '#3d4a66' : name.includes('mia') ? '#9b6ad8' : name.includes('tim') ? '#22a39a' : `hsl(${[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0)},38%,42%)`}">${name.replace(/[^a-z]/i, '')[0].toUpperCase()}</span>`;
      s.querySelector('.st-zeit').textContent = zeit || (name === 'lynn' ? '9 Std.' : (Math.floor(Math.random() * 40) + 3) + ' Min.');
      s.classList.toggle('aufrufe', aufrufe != null && aufrufe !== ''); if (aufrufe) s.querySelector('.st-views b').textContent = aufrufe;
      s.classList.remove('post'); const b = s.querySelector('.st-balken i'); b.style.transition = 'none'; b.style.width = '0'; void b.offsetWidth;
      b.style.transition = `width ${dauer * (Spiel.schnell ? .15 : 1)}s linear`; b.style.width = '100%'; displayFarbe();
    },
    post(code, text) {
      oeffne(); zeige('story'); const s = $('[data-app=story]'); s.classList.add('post'); s.classList.remove('aufrufe'); s.querySelector('.st-bild').classList.remove('ganz');
      s.querySelector('.st-name').textContent = 'Deine Story'; s.querySelector('.st-zeit').textContent = 'Gerade eben';
      s.querySelector('.st-bild').innerHTML = Spiel.bildHTML(code, true) + `<div class="st-text">${esc(text)}</div>`;
      s.querySelector('.st-views b').textContent = '0'; displayFarbe();
    },
    aufrufe(n) { const b = $('.st-views b'); b.textContent = n; b.parentNode.classList.remove('pop'); void b.offsetWidth; b.parentNode.classList.add('pop'); },
    hinweis(appName, titel, text) {
      const h = $('.hhinweis'); h.querySelector('b').textContent = titel; h.querySelector('.h-x').textContent = text;
      { const ic = APPICON[appName] || APPICON.WhatsApp; const hi = h.querySelector('.h-ic'); hi.style.background = ic[0]; hi.className = 'h-ic' + (ic[2] ? ' ' + ic[2] : ''); hi.innerHTML = ic[1]; }
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
    // V8.9: Herz auf der Story wird rot und poppt kurz
    async storyHerz() { const h = el.querySelector('.st-fuss span'); if (!h) return; h.textContent = '❤'; h.classList.add('rot'); await warte(600); },
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
      oeffne(); zeige('feed'); const r = $('.f-rolle'); this.appGeoeffnet('Instagram'); const jetzt = Spiel.V.uhr || 0;
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
    // V8.9 (Patrick 24.11.): Wecker-Bildschirm – erst klingelt es, dann nimmt er das Handy und drückt „Schlummern“
    wecker() { oeffne(); zeige('wecker'); $('.w-uhr').textContent = uhrText(); $('.w-datum').textContent = Spiel.datumText(); const w = $('[data-app=wecker]'); w.classList.remove('weg'); },
    async weckerDruck(was) { const k = $(was === 'stopp' ? '.w-stopp' : '.w-schl'); k.classList.add('druck'); Ton.spiele('display_klick'); Ton.stoppe && Ton.stoppe('wecker'); await warte(350); k.classList.remove('druck'); $('[data-app=wecker]').classList.add('weg'); await warte(300); },
    aus() { Ton.spiele('klick'); $('.displayaus').classList.add('an'); },
    laut() { $('.sp-stumm').classList.remove('an'); el.classList.remove('handy-stumm'); },   // V8.8 (G19)
    // V8.8 (G29): beim Selbst-Nachschauen zeigt der Sperrbildschirm die ungelesenen Chats (außer stummen)
    // V8.9: stille Meldung einer anderen App (zählt am Knopf, erscheint beim Nachschauen auf dem Sperrbildschirm)
    meldung(app, titel, text, zeit) { const z = zeit || uhrText(); if (sonst.some(x => x.app === app && x.titel === titel && x.text === (text || '') && x.zeit === z)) return; sonst.push({ app, titel, text: text || '', zeit: z, n: ++zaehler, min: (Spiel.V && Spiel.V.uhr) || 0 }); },
    // V8.9 (Patrick 24.11.): gesehene Meldungen zählen nicht mehr, bleiben aber auf dem Sperrbildschirm (bis die App geöffnet wird oder sie alt sind)
    meldungenGelesen() { sonst.forEach(x => x.gesehen = true); },
    appGeoeffnet(appName, titel) { sonst = sonst.filter(x => !(x.app === appName && (!titel || x.titel === titel))); },
    _aufraeumen() { const u = (Spiel.V && Spiel.V.uhr) || 0; sonst = sonst.filter(x => u - (x.min || 0) < 840); },
    // Zahl am Handy-Knopf: ungelesene Nachrichten (ohne stumme Chats) + ungelesene Meldungen anderer Apps
    zahl() { this._aufraeumen(); return Object.keys(meta).reduce((a, n) => a + (meta[n].stumm || !meta[n].vorschau ? 0 : (meta[n].ungelesen || 0)), 0) + sonst.filter(x => !x.gesehen).length; },
    sperrUngelesen() {
      const box = $('.sp-notifs'); if (box.children.length) return; this._aufraeumen();
      // alles Ungelesene, neueste oben: Meldungen anderer Apps (gleiche App + Absender in einer Karte) und Chats mit ungelesenen Nachrichten
      const gruppen = {}; sonst.forEach(x => { const key = x.app + '|' + x.titel; const g = gruppen[key] || (gruppen[key] = { app: x.app, titel: x.titel, texte: [], zeit: x.zeit, n: 0 }); if (x.text && !g.texte.includes(x.text)) g.texte.push(x.text); g.zeit = x.zeit; g.n = Math.max(g.n, x.n || 0); });
      const karten = Object.values(gruppen).map(g => ({ n: g.n, el: this._karte(g.app, g.titel, g.texte.slice(-3), g.zeit, null) }));
      Object.keys(meta).filter(n => meta[n].ungelesen && !meta[n].stumm && meta[n].vorschau).forEach(n => { const m = meta[n]; karten.push({ n: m.n || 0, el: this._karte('WhatsApp', anzeige(n), [m.vorschau], m.zeit || '', n) }); });
      karten.sort((x, y) => y.n - x.n).slice(0, 12).forEach(x => { x.el.style.animation = 'none'; box.appendChild(x.el); });
      box.scrollTop = 0;
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
    _dbg() { return { meta: Object.fromEntries(Object.entries(meta).map(([k, m]) => [k, { u: m.ungelesen, v: m.vorschau, st: !!m.stumm }])), sonst: sonst.slice() }; },
    reset() {
      for (const k in chats) delete chats[k];
      $('.sp-stumm').classList.remove('an'); el.classList.remove('handy-stumm'); $('[data-app=chat]').classList.remove('chatstumm', 'menue', 'dialog'); for (const k in meta) delete meta[k]; sonst = []; warteAuf = null; $('.n-titel').innerHTML = 'Lernplan <span class="n-tag">Samstag</span><i class="cursor"></i>'; $('.n-liste').innerHTML = '<div>☐ 9:00 Schuldrecht AT</div><div>☐ 10:00 BGB AT</div><div>☐ 14:00 Fälle 1–5</div>'; this.fotozoomWeg(); this.zu();
    },
  };
})();
