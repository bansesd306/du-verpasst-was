// =====================================================================
//  TEST-PROTOKOLL (V8.8, Bauliste H) – nur im Test-Link (TESTMODUS).
//  Schreibt beim Spielen mit: Zeile, Text, Wahl, Spieluhr + echte Uhrzeit, Bild, Töne/Vibration/Musik,
//  Handy-Ansicht, Fehler. Knopf „⚑“: Moment markieren + kurzer Satz (Tippen oder Diktieren).
//  Speichert in der Artefakt-Datenbank (Sammlung „protokoll“), Fallback: „Protokoll kopieren“.
// =====================================================================
(() => {
  if (typeof TESTMODUS === 'undefined' || !TESTMODUS) return;
  const sitzung = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '_' + Math.random().toString(36).slice(2, 6);
  const alle = [], offen = []; let teil = 0, db = null, dbStatus = 'wartet', letzteSchreibung = 0;
  const zwei = n => String(n).padStart(2, '0');
  const echt = () => { const d = new Date(); return `${zwei(d.getHours())}:${zwei(d.getMinutes())}:${zwei(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`; };
  function log(typ, x) {
    let s = '', z = null;
    try { s = Spiel.uhrText(); const a = Spiel._debug.aktuell; z = a ? a.nr + 1 : null; } catch (e) { }
    const e = { t: echt(), s, z, typ, x: typeof x === 'string' ? x.slice(0, 300) : x };
    alle.push(e); offen.push(e); if (alle.length > 6000) alle.shift();
    if (typ === 'FEHLER' || offen.length >= 40) schreiben();
  }
  window.Protokoll = { log, get alle() { return alle; }, sitzung };
  async function schreiben() {
    if (!db || !offen.length) return;
    const stueck = offen.splice(0, offen.length); const id = `protokoll/${sitzung}_${String(++teil).padStart(3, '0')}`;
    try { await db.doc(id).set({ sitzung, teil, start: stueck[0].t, geraet: navigator.userAgent.slice(0, 120), eintraege: stueck }); dbStatus = 'ok'; letzteSchreibung = Date.now(); }
    catch (e) { dbStatus = 'fehler'; offen.unshift(...stueck); }
  }
  setInterval(() => { if (offen.length && Date.now() - letzteSchreibung > 12000) schreiben(); }, 4000);
  addEventListener('pagehide', () => schreiben());
  document.addEventListener('visibilitychange', () => { if (document.hidden) schreiben(); });
  (async () => { try { if (window.claude && claude.use) { db = await claude.use('db'); dbStatus = db ? 'ok' : 'aus'; } else dbStatus = 'aus'; } catch (e) { dbStatus = 'aus'; } })();

  // ---- Hooks: Ton, Handy, Fehler ----
  const wickel = (obj, name, typ, fmt) => { const f = obj && obj[name]; if (typeof f !== 'function') return; obj[name] = function (...a) { try { log(typ, fmt ? fmt(...a) : a.filter(x => typeof x !== 'object').join(' ')); } catch (e) { } return f.apply(this, a); }; };
  if (window.Ton) {
    wickel(Ton, 'spiele', 'ton', (n, o) => n + (o && o.dauer ? ' ' + o.dauer + 's' : '') + (o && o.dumpf ? ' dumpf' : ''));
    wickel(Ton, 'musik', 'musik', (a, b) => a + (b ? ' ' + b : ''));
    wickel(Ton, 'musikStufe', 'musik', a => 'stufe ' + a);
    wickel(Ton, 'loop', 'loop', (n, an) => n + (an ? ' an' : ' aus'));
    wickel(Ton, 'vibration', 'vibration', (ort, o) => ort + (o && o.leise ? ' leise' : ''));
    wickel(Ton, 'outro', 'musik', w => 'outro ' + (w || 'fomo'));
  }
  if (window.Handy) {
    ['sperr', 'liste', 'feed', 'stumm', 'aus', 'zu', 'weg', 'her'].forEach(n => wickel(Handy, n, 'handy', () => n));
    wickel(Handy, 'chat', 'handy', n => 'chat ' + n);
    wickel(Handy, 'story', 'handy', (n, c, d, z) => `story ${n} ${c}${z ? ' (' + z + ')' : ''}`);
    wickel(Handy, 'benachrichtigung', 'handy', (a, t, x) => `benachrichtigung ${a} | ${t} | ${x || ''}`);
    wickel(Handy, 'nachricht', 'handy', (v, t) => `nachricht ${v}: ${t}`);
    wickel(Handy, 'anruf', 'handy', n => 'anruf ' + n);
    wickel(Handy, 'video', 'handy', c => 'video ' + c);
    wickel(Handy, 'karussell', 'handy', m => 'karussell ' + m);
  }
  addEventListener('error', e => log('js-fehler', String(e.message || e)));
  addEventListener('unhandledrejection', e => log('js-fehler', String(e.reason && e.reason.message || e.reason)));
  log('start', { sitzung, ua: navigator.userAgent.slice(0, 160), bildschirm: `${screen.width}x${screen.height}` });

  // ---- Oberfläche: Knopf ⚑ + Eingabe ----
  const knopf = document.createElement('button'); knopf.id = 'fehlerknopf'; knopf.type = 'button'; knopf.textContent = '⚑'; knopf.title = 'Fehler markieren (Testversion)';
  const box = document.createElement('div'); box.id = 'fehlerbox';
  box.innerHTML = `<div class="fb-in"><b>Fehler markieren</b><small></small><textarea rows="3" placeholder="Was war falsch? (Tippen oder Mikrofon der Tastatur)"></textarea>
    <div class="fb-k"><button type="button" class="ok">Speichern</button><button type="button" class="ab">Abbrechen</button><button type="button" class="mik">🎤 Sprechen</button><button type="button" class="kopie">Protokoll kopieren</button></div><small class="st"></small></div>`;
  document.body.appendChild(knopf); document.body.appendChild(box);
  const halt = e => e.stopPropagation();
  [knopf, box].forEach(el => ['pointerdown', 'pointerup', 'mousedown', 'touchend', 'click', 'keydown'].forEach(t => el.addEventListener(t, halt)));
  let markiert = null;
  knopf.addEventListener('click', () => {
    let s = '', z = '', txt = ''; try { s = Spiel.uhrText(); const a = Spiel._debug.aktuell; z = a ? a.nr + 1 : ''; txt = document.getElementById('text').textContent; } catch (e) { }
    markiert = { echt: echt(), s, z, text: txt }; try { Spiel._debug.pausieren(true); } catch (e) { }
    box.querySelector('small').textContent = `${markiert.echt} · Spieluhr ${s} · Zeile ${z}${txt ? ' · „' + txt.slice(0, 60) + '“' : ''}`;
    box.querySelector('.st').textContent = dbStatus === 'ok' ? 'Wird in der Datenbank gespeichert.' : dbStatus === 'aus' ? 'Datenbank nicht erreichbar – bitte „Protokoll kopieren“ nutzen.' : '';
    box.classList.add('an'); const ta = box.querySelector('textarea'); ta.value = ''; setTimeout(() => ta.focus(), 50);
  });
  const zu = () => { box.classList.remove('an'); try { Spiel._debug.pausieren(false); } catch (e) { } };
  box.querySelector('.ok').addEventListener('click', () => { log('FEHLER', Object.assign({ satz: box.querySelector('textarea').value.trim() }, markiert || {})); zu(); });
  box.querySelector('.ab').addEventListener('click', zu);
  // V9.0: Spracheingabe (Web Speech API). Wo der Browser sie nicht erlaubt, bleibt das Mikrofon der Tastatur.
  { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const mik = box.querySelector('.mik'); let rec = null, laeuft = false;
    if (!SR) mik.style.display = 'none';
    else mik.addEventListener('click', () => {
      const ta = box.querySelector('textarea'), st = box.querySelector('.st');
      if (laeuft && rec) { rec.stop(); return; }
      try {
        rec = new SR(); rec.lang = 'de-DE'; rec.interimResults = true; rec.continuous = true; const basis = ta.value ? ta.value.trim() + ' ' : '';
        rec.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; ta.value = basis + t; };
        rec.onerror = e => { st.textContent = 'Spracheingabe nicht möglich (' + e.error + ') – bitte das Mikrofon der Tastatur nutzen.'; };
        rec.onend = () => { laeuft = false; mik.textContent = '🎤 Sprechen'; mik.classList.remove('an'); };
        rec.start(); laeuft = true; mik.textContent = '⏹ Fertig'; mik.classList.add('an'); st.textContent = 'Ich höre zu … zum Beenden „Fertig“ tippen.';
      } catch (err) { st.textContent = 'Spracheingabe hier nicht verfügbar – bitte das Mikrofon der Tastatur nutzen.'; }
    }); }
  box.querySelector('.kopie').addEventListener('click', async () => {
    const t = alle.map(e => JSON.stringify(e)).join('\n');
    try { await navigator.clipboard.writeText(t); box.querySelector('.st').textContent = `${alle.length} Einträge kopiert.`; }
    catch (e) { const ta = box.querySelector('textarea'); ta.value = t; ta.select(); box.querySelector('.st').textContent = 'Kopieren blockiert – Text ist markiert, bitte selbst kopieren.'; }
  });
})();
