// =====================================================================
//  SPRUNGMENÜ (nur Testversion, TESTMODUS in bilder.js): zu jedem Kapitel
//  und jeder Szene springen, mit Auswahl des Wegs. In der Abgabe unsichtbar.
// =====================================================================
(() => {
  if (typeof TESTMODUS === 'undefined' || !TESTMODUS) return;
  const src = document.getElementById('story').textContent.split('\n');
  // Kapitel, Abschnitte (# ---- … ----) und Szenen (== NAME) in Skript-Reihenfolge
  const kapitel = []; let kap = null, abs = null; const zeileVon = {}; const titel = {};
  // V9.0: lesbarer Name je Szene: Kommentar direkt über „== NAME“, sonst erste Textzeile der Szene
  const szenenTitel = (i, name) => {
    for (let k = i - 1; k >= Math.max(0, i - 3); k--) { const z = src[k].trim(); if (!z) continue; if (/^#/.test(z) && !/^#\s*[-=]{3,}/.test(z) && !/^#\s*V\d/.test(z)) return z.replace(/^#\s*/, '').replace(/[-–—]{2,}/g, '').slice(0, 46); break; }
    for (let k = i + 1; k < Math.min(src.length, i + 30); k++) { const z = src[k].trim(); if (/^==/.test(z)) break; if (!z || /^[@?~#!\-]|^\.\.\.|^…/.test(z)) continue; return z.replace(/\s*!\d.*$/, '').slice(0, 42); }
    return '';
  };
  src.forEach((z, i) => {
    let m;
    if ((m = z.match(/^#\s{2,}((PROLOG|KAPITEL|KNOTEN|EPILOG)[^\n]*)/))) { kap = { name: m[1].trim(), id: m[2] === 'KAPITEL' ? 'K' + (m[1].match(/\d+/) || [''])[0] : m[2], abs: [] }; kapitel.push(kap); abs = null; return; }
    if (!kap) return;
    if ((m = z.match(/^# -{3,}\s*(.+?)\s*-{3,}\s*$/))) { abs = { name: m[1], szenen: [] }; kap.abs.push(abs); return; }
    if ((m = z.match(/^== (\S+)/))) { if (!abs) { abs = { name: '', szenen: [] }; kap.abs.push(abs); } abs.szenen.push(m[1]); zeileVon[m[1]] = i; titel[m[1]] = szenenTitel(i, m[1]); }
  });
  // Ab welcher Zeile das Skript selbst typ/lynn setzt – davor wird der Wert beim Springen nicht vorweggenommen
  const ab = re => { const i = src.findIndex(z => re.test(z)); return i < 0 ? 1e9 : i; };
  const SETZT = {
    party: ab(/@setze typ = "party"/), afterparty: ab(/@setze typ = "afterparty"/), gluecklich: ab(/@setze typ = "gluecklich"/),
    mama: ab(/^== W4_REIN/), zuhause: ab(/@setze typ = "zuhause"/), lynn_geschaut: ab(/@setze lynn = "geschaut"/), lynn_gm: ab(/@setze lynn = "gm"/), kap3: ab(/KAPITEL 3/),
  };
  const PARTY = { zugesagt: true, aufbruch: '21:20', ankunft: '21:40', besucht: 2, kueche: true, balkon: true };
  const WEGE = {
    'Zuhause A': { v: { weg: 'A', flow: true, phantom: true, punkte: 0 }, typ: 'zuhause', start: 'KAP2_A', info: 'lernt am Schreibtisch · Kap. 2' },
    'Zuhause B': { v: { weg: 'B', punkte: 7, notiz: true }, typ: 'zuhause', start: 'KAP2_B', info: 'liegt im Bett · Kap. 2' },
    'Party': { v: Object.assign({ tanz: true, punkte: 4 }, PARTY), typ: 'party', lynn: 'geschaut', start: 'PARTY_ANKUNFT', info: 'kommt an · Kap. 3' },
    'Lynn glücklich': { v: Object.assign({ tanz: true, mittanzen: true, punkte: 3 }, PARTY), typ: 'gluecklich', lynn: 'gm', start: 'GM_START', uhr: '23:10', info: 'Balkon, Handy ignoriert · Kap. 3' },
    'Afterparty': { v: Object.assign({ punkte: 4, afterpartyStory: true }, PARTY), typ: 'afterparty', lynn: 'geschaut', start: 'AFTERPARTY', uhr: 'Sa 00:40', info: 'mit zu Tim · Kap. 3' },
  };
  // Uhr beim Springen: Uhrzeit aus der Abschnitts-Überschrift, sonst Kapitelbeginn
  const KAPUHR = { K1: '21:07', K2: '21:20', KNOTEN: '21:20', K3: '21:40', K4: null, K5: 'Sa 10:32', K6: 'So 09:00', EPILOG: 'Mo 07:30' };
  const TABNAME = { PROLOG: 'Prolog', K1: '1 Start', K2: '2 Zuhause', KNOTEN: 'Aufbruch + Weg', K3: '3 Party', K4: '4 Nacht', K5: '5 Sa–Mo', EPILOG: 'Epilog' };
  let wegWahl = 'Zuhause A';
  try { wegWahl = localStorage.getItem('dvw-sprung-weg') || wegWahl; } catch (e) { }

  function springen(label, kapId, absName, uhrFest) {
    const w = WEGE[wegWahl], z = zeileVon[label];
    if (window.Ton) Ton.init();
    // V8.8 (G61): Weg-Variablen setzen, BEVOR das Skript losläuft (sonst nimmt es an der Sprungstelle falsche Zweige)
    Spiel._debug.neustart(label, V => {
    const setze = o => Object.entries(o).forEach(([k, v]) => V[k] = (typeof v === 'string' && /\d:\d\d$/.test(v)) ? Spiel._debug.zeit(v) : v);
    const partyWeg = wegWahl !== 'Zuhause A' && wegWahl !== 'Zuhause B';
    const vw = Object.assign({}, w.v);
    if (partyWeg && z < SETZT.kap3) { delete vw.ankunft; delete vw.kueche; delete vw.balkon; delete vw.besucht; delete vw.tanz; delete vw.mittanzen; delete vw.punkte; delete vw.afterpartyStory; }
    setze(vw);
    if (partyWeg && z > SETZT.mama) V.mama = true;   // Patrick 26.11.: Mama kam schon vor dem Haus – nach dem Sprung nicht nochmal in der Küche
    // typ / lynn nur, wenn das Skript sie an dieser Stelle schon gesetzt hätte
    if (z > SETZT[w.typ]) V.typ = w.typ; else if (partyWeg && z > SETZT.party) V.typ = 'party';
    if (w.lynn === 'gm' && z > SETZT.lynn_gm) V.lynn = 'gm'; else if (w.lynn && z > SETZT.lynn_geschaut) V.lynn = 'geschaut';
    // Uhr
    let uhr = (absName.match(/(\d{1,2}:\d{2})/) || [])[1] || KAPUHR[kapId];
    if (kapId === 'K4') uhr = partyWeg ? 'Sa 01:00' : '23:40';
    if (kapId === 'K5') {   // V8.8: Kapitel 5 läuft über drei Tage – Tag aus der Abschnitts-Überschrift
      const tag = /Sonntag/.test(absName) ? 'So' : /Montag|Prüfung|Ende/.test(absName) ? 'Mo' : 'Sa';
      const fest = { So: 'So 09:00', Mo: /Ende/.test(absName) ? 'Mo 18:30' : /Prüfung/.test(absName) ? 'Mo 11:00' : 'Mo 06:30', Sa: /abend/.test(absName) ? 'Sa 19:00' : 'Sa 10:32' };
      uhr = uhr && !/^(Sa|So|Mo) /.test(uhr) ? tag + ' ' + uhr : fest[tag];
    }
    if (uhrFest) uhr = uhrFest;
    if (uhr) { V.uhr = Spiel._debug.zeit(uhr); V.uhr_zeigen = true; }
    Spiel._debug.zeigeUhr();
    });
    panel.classList.remove('an');
  }

  // ---------- Oberfläche ----------
  const knopf = document.createElement('button');
  knopf.id = 'sprungknopf'; knopf.type = 'button'; knopf.textContent = '⏭'; knopf.title = 'Sprungmenü (nur Testversion)';
  const panel = document.createElement('div'); panel.id = 'sprungmenue';
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  panel.innerHTML = `<div class="kopf"><b>Springen</b><span>Testversion</span><button type="button" class="neu">↺ Szene neu starten</button><button type="button" class="zu" aria-label="Schließen">✕</button></div>
    <div class="titel1">1 · Weg starten <small>(springt sofort an den Anfang des Wegs)</small></div>
    <div class="wegstart">${Object.entries(WEGE).map(([w, d]) => `<button type="button" data-start="${esc(w)}"><b>▶ ${esc(w)}</b><i>${esc(d.info)}</i></button>`).join('')}</div>
    <div class="titel1">2 · Oder Szene wählen <small>– gespielt als Weg:</small></div>
    <div class="wege">${Object.keys(WEGE).map(w => `<button type="button" data-weg="${esc(w)}">${esc(w)}</button>`).join('')}</div>
    <div class="reiter">${kapitel.map((k, ki) => `<button type="button" data-tab="${ki}">${esc(TABNAME[k.id] || k.name)}</button>`).join('')}</div>
    <div class="liste">${kapitel.map((k, ki) => `<div class="tab" data-t="${ki}"><div class="tabtitel">${esc(k.name)}</div>${k.abs.map(a => `${a.name ? `<div class="abs">${esc(a.name)}</div>` : ''}<div class="szenen">${a.szenen.map(s => `<button type="button" data-l="${s}" data-k="${k.id}" data-a="${esc(a.name)}"><b>${esc(titel[s] || s)}</b>${titel[s] ? `<i>${s}</i>` : ''}</button>`).join('')}</div>`).join('')}</div>`).join('')}</div>`;
  document.body.appendChild(knopf); document.body.appendChild(panel);
  const wegeZeigen = () => panel.querySelectorAll('[data-weg]').forEach(b => b.classList.toggle('an', b.dataset.weg === wegWahl));
  wegeZeigen();
  let tabNr = 2; try { tabNr = +localStorage.getItem('dvw-sprung-tab') || 2; } catch (e) { }
  const tabsZeigen = () => { panel.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('an', +b.dataset.tab === tabNr)); panel.querySelectorAll('.tab').forEach(t => t.style.display = +t.dataset.t === tabNr ? '' : 'none'); };
  tabsZeigen();
  const halt = e => e.stopPropagation();
  [knopf, panel].forEach(el => ['pointerdown', 'pointerup', 'mousedown', 'touchend', 'click'].forEach(t => el.addEventListener(t, halt)));
  knopf.addEventListener('click', () => panel.classList.toggle('an'));
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('zu')) panel.classList.remove('an');
    else if (b.classList.contains('neu')) { if (window.Ton) Ton.init(); Spiel._debug.szeneNeu(); panel.classList.remove('an'); }
    else if (b.dataset.tab) { tabNr = +b.dataset.tab; try { localStorage.setItem('dvw-sprung-tab', tabNr); } catch (x) { } tabsZeigen(); }
    else if (b.dataset.start) { const w = b.dataset.start; wegWahl = w; try { localStorage.setItem('dvw-sprung-weg', w); } catch (x) { } wegeZeigen(); const l = WEGE[w].start, k = kapitel.find(k => k.abs.some(a => a.szenen.includes(l))), a = k && k.abs.find(a => a.szenen.includes(l)); springen(l, k ? k.id : '', a ? a.name : '', WEGE[w].uhr); }
    else if (b.dataset.weg) { wegWahl = b.dataset.weg; try { localStorage.setItem('dvw-sprung-weg', wegWahl); } catch (x) { } wegeZeigen(); }
    else if (b.dataset.l) springen(b.dataset.l, b.dataset.k, b.dataset.a || '');
  });
  window.Sprung = { springen: (l, weg) => { if (weg) wegWahl = weg; const k = kapitel.find(k => k.abs.some(a => a.szenen.includes(l))); const a = k && k.abs.find(a => a.szenen.includes(l)); springen(l, k ? k.id : '', a ? a.name : ''); }, kapitel };
})();
