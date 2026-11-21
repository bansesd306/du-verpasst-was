// =====================================================================
//  SPRUNGMENÜ (nur Testversion, TESTMODUS in bilder.js): zu jedem Kapitel
//  und jeder Szene springen, mit Auswahl des Wegs. In der Abgabe unsichtbar.
// =====================================================================
(() => {
  if (typeof TESTMODUS === 'undefined' || !TESTMODUS) return;
  const src = document.getElementById('story').textContent.split('\n');
  // Kapitel, Abschnitte (# ---- … ----) und Szenen (== NAME) in Skript-Reihenfolge
  const kapitel = []; let kap = null, abs = null; const zeileVon = {};
  src.forEach((z, i) => {
    let m;
    if ((m = z.match(/^#\s{2,}((PROLOG|KAPITEL|KNOTEN|EPILOG)[^\n]*)/))) { kap = { name: m[1].trim(), id: m[2] === 'KAPITEL' ? 'K' + (m[1].match(/\d+/) || [''])[0] : m[2], abs: [] }; kapitel.push(kap); abs = null; return; }
    if (!kap) return;
    if ((m = z.match(/^# -{3,}\s*(.+?)\s*-{3,}\s*$/))) { abs = { name: m[1], szenen: [] }; kap.abs.push(abs); return; }
    if ((m = z.match(/^== (\S+)/))) { if (!abs) { abs = { name: '', szenen: [] }; kap.abs.push(abs); } abs.szenen.push(m[1]); zeileVon[m[1]] = i; }
  });
  // Ab welcher Zeile das Skript selbst typ/lynn setzt – davor wird der Wert beim Springen nicht vorweggenommen
  const ab = re => { const i = src.findIndex(z => re.test(z)); return i < 0 ? 1e9 : i; };
  const SETZT = {
    party: ab(/@setze typ = "party"/), afterparty: ab(/@setze typ = "afterparty"/), gluecklich: ab(/@setze typ = "gluecklich"/),
    zuhause: ab(/@setze typ = "zuhause"/), lynn_geschaut: ab(/@setze lynn = "geschaut"/), lynn_gm: ab(/@setze lynn = "gm"/), kap3: ab(/KAPITEL 3/),
  };
  const PARTY = { zugesagt: true, aufbruch: '21:20', ankunft: '21:40', besucht: 2, kueche: true, balkon: true };
  const WEGE = {
    'Zuhause A': { v: { weg: 'A', flow: true, phantom: true, punkte: 0 }, typ: 'zuhause' },
    'Zuhause B': { v: { weg: 'B', punkte: 7 }, typ: 'zuhause' },
    'Party': { v: Object.assign({ tanz: true, punkte: 4 }, PARTY), typ: 'party', lynn: 'geschaut' },
    'Afterparty': { v: Object.assign({ punkte: 4, afterpartyStory: true }, PARTY), typ: 'afterparty', lynn: 'geschaut' },
    'Lynn glücklich': { v: Object.assign({ tanz: true, mittanzen: true, punkte: 3 }, PARTY), typ: 'gluecklich', lynn: 'gm' },
  };
  // Uhr beim Springen: Uhrzeit aus der Abschnitts-Überschrift, sonst Kapitelbeginn
  const KAPUHR = { K1: '21:07', K2: '21:20', KNOTEN: '21:20', K3: '21:40', K4: null, K5: null };
  let wegWahl = 'Zuhause A';
  try { wegWahl = localStorage.getItem('dvw-sprung-weg') || wegWahl; } catch (e) { }

  function springen(label, kapId, absName) {
    const w = WEGE[wegWahl], z = zeileVon[label];
    if (window.Ton) Ton.init();
    Spiel._debug.neustart(label);
    const V = Spiel.V, setze = o => Object.entries(o).forEach(([k, v]) => V[k] = (typeof v === 'string' && /\d:\d\d$/.test(v)) ? Spiel._debug.zeit(v) : v);
    const partyWeg = wegWahl !== 'Zuhause A' && wegWahl !== 'Zuhause B';
    const vw = Object.assign({}, w.v);
    if (partyWeg && z < SETZT.kap3) { delete vw.ankunft; delete vw.kueche; delete vw.balkon; delete vw.besucht; delete vw.tanz; delete vw.mittanzen; delete vw.punkte; delete vw.afterpartyStory; }
    setze(vw);
    // typ / lynn nur, wenn das Skript sie an dieser Stelle schon gesetzt hätte
    if (z > SETZT[w.typ]) V.typ = w.typ; else if (partyWeg && z > SETZT.party) V.typ = 'party';
    if (w.lynn === 'gm' && z > SETZT.lynn_gm) V.lynn = 'gm'; else if (w.lynn && z > SETZT.lynn_geschaut) V.lynn = 'geschaut';
    // Uhr
    let uhr = (absName.match(/(\d{1,2}:\d{2})/) || [])[1] || KAPUHR[kapId];
    if (kapId === 'K4') uhr = partyWeg ? 'Sa 01:00' : '23:40';
    if (uhr) { V.uhr = Spiel._debug.zeit(uhr); V.uhr_zeigen = true; }
    Spiel._debug.zeigeUhr();
    panel.classList.remove('an');
  }

  // ---------- Oberfläche ----------
  const knopf = document.createElement('button');
  knopf.id = 'sprungknopf'; knopf.type = 'button'; knopf.textContent = '⏭'; knopf.title = 'Sprungmenü (nur Testversion)';
  const panel = document.createElement('div'); panel.id = 'sprungmenue';
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  panel.innerHTML = `<div class="kopf"><b>Springen</b><span>Testversion</span><button type="button" class="zu" aria-label="Schließen">✕</button></div>
    <div class="wege">${Object.keys(WEGE).map(w => `<button type="button" data-weg="${esc(w)}">${esc(w)}</button>`).join('')}</div>
    <div class="liste">${kapitel.map((k, ki) => `<details${ki === 2 ? ' open' : ''}><summary>${esc(k.name)}</summary>${k.abs.map(a => `${a.name ? `<div class="abs">${esc(a.name)}</div>` : ''}<div class="szenen">${a.szenen.map(s => `<button type="button" data-l="${s}" data-k="${k.id}" data-a="${esc(a.name)}">${s}</button>`).join('')}</div>`).join('')}</details>`).join('')}</div>`;
  document.body.appendChild(knopf); document.body.appendChild(panel);
  const wegeZeigen = () => panel.querySelectorAll('[data-weg]').forEach(b => b.classList.toggle('an', b.dataset.weg === wegWahl));
  wegeZeigen();
  const halt = e => e.stopPropagation();
  [knopf, panel].forEach(el => ['pointerdown', 'pointerup', 'mousedown', 'touchend', 'click'].forEach(t => el.addEventListener(t, halt)));
  knopf.addEventListener('click', () => panel.classList.toggle('an'));
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('zu')) panel.classList.remove('an');
    else if (b.dataset.weg) { wegWahl = b.dataset.weg; try { localStorage.setItem('dvw-sprung-weg', wegWahl); } catch (x) { } wegeZeigen(); }
    else if (b.dataset.l) springen(b.dataset.l, b.dataset.k, b.dataset.a || '');
  });
  window.Sprung = { springen: (l, weg) => { if (weg) wegWahl = weg; const k = kapitel.find(k => k.abs.some(a => a.szenen.includes(l))); const a = k && k.abs.find(a => a.szenen.includes(l)); springen(l, k ? k.id : '', a ? a.name : ''); }, kapitel };
})();
