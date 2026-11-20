import pathlib
import rahmen_build
H = pathlib.Path(__file__).parent
r = lambda n: (H / n).read_text(encoding='utf-8')

rahmen_html = rahmen_build.html(r('rahmen.html'))
buehne = f'''<div id="rahmen"><div id="buehne">
  <div id="kamera"><div id="welt"></div><div id="fenster" class="ov"></div><div id="handylicht" class="ov"><div class="g"></div><div class="raum"></div></div><div id="autolicht" class="ov"><i></i></div><canvas id="partikel" class="ov"></canvas></div>
  <div id="traumrand" class="ov"></div><div id="traumglow" class="ov"></div>
  <div id="licht" class="ov"><div class="l l1"></div><div class="l l2"></div><div class="l l3"></div></div>
  <div id="blitz" class="ov"></div><div id="weiss" class="ov"></div><div id="vignette" class="ov"></div><div id="koernung" class="ov"></div><div id="rufe" class="ov"></div>
  <div id="zettel"></div><div id="klausur"><div class="kl-blatt"><div class="kl-rand"></div>
<div class="kl-kopf">Zivilrecht – Klausur <span>2. Versuch</span><em>Seite 3</em></div>
<p>Fraglich ist, ob A gegen B einen Anspruch auf Schadensersatz aus <i class="kl-p">§</i> 823 I BGB hat. Dazu müsste B ein Rechtsgut des A verletzt haben.</p>
<p>Das Eigentum des A an dem Fahrrad ist ein Rechtsgut <s>und wurde</s> im Sinne des <i class="kl-p">§</i> 823 I. Das Fahrrad wurde beschädigt, also ist das Eigentum verletzt.</p>
<p>B hat gehandelt, indem er <u class="kl-welle">gegen das Rad gefahren</u> ist. Daraus folgt der Schaden.</p>
<p>Fraglich ist die Rechtswidrigkeit. Diese wird durch die Verletzung indiziert, Rechtfertigungsgründe sind nicht ersichtlich. B handelte auch <u class="kl-welle">fahrlässig</u>, weil er</p>
<div class="kl-mk m1">R</div><div class="kl-mk m2">Z</div><div class="kl-mk m3">A</div><div class="kl-mk m4">Gr</div><div class="kl-mk m5">R</div>
<div class="kl-rot r1">Kausalität?!</div><div class="kl-rot r2">Unvollständig.</div><div class="kl-rot r3">5,0</div>
</div></div><div id="karteikarten"></div><div id="lernplan"><h3>Sonntag</h3><ul><li>Schuldrecht AT</li><li>BGB AT</li><li>Deliktsrecht</li><li>Bereicherungsrecht</li><li>Fälle 1–5</li></ul></div><div id="schema"><h3>§ 823 I BGB</h3><ol><li>Rechtsgut verletzt</li><li>Handlung</li><li>Kausalität</li><li>Rechtswidrigkeit</li><li>Verschulden</li></ol><div class="th">tippen</div></div><div id="tasche"><b>23</b></div>
  <div id="schwarz" class="ov an"></div><div id="grossuhr"></div><div id="analoguhr"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="190" fill="rgba(255,255,255,.03)" stroke="#e8e8e8" stroke-width="5"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(0 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(6 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(12 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(18 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(24 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(30 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(36 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(42 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(48 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(54 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(60 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(66 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(72 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(78 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(84 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(90 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(96 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(102 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(108 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(114 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(120 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(126 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(132 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(138 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(144 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(150 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(156 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(162 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(168 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(174 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(180 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(186 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(192 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(198 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(204 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(210 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(216 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(222 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(228 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(234 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(240 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(246 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(252 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(258 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(264 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(270 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(276 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(282 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(288 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(294 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(300 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(306 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(312 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(318 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(324 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="22" x2="200" y2="48" transform="rotate(330 200 200)" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(336 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(342 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(348 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><line x1="200" y1="30" x2="200" y2="48" transform="rotate(354 200 200)" stroke="#ddd" stroke-width="2" stroke-linecap="round"/><g class="zg zh"><line x1="200" y1="200" x2="200" y2="105" stroke="#fff" stroke-width="12" stroke-linecap="round"/></g><g class="zg zm"><line x1="200" y1="215" x2="200" y2="52" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g><circle cx="200" cy="200" r="10" fill="#fff"/></svg><div class="ad"></div></div>
  <div id="banner"></div><div id="anrufmini"></div>
  <div id="handy"></div>
  <div id="tunnel" class="ov"></div>
  <div id="lider" class="ov"><div id="lider-o"></div><div id="lider-u"></div></div>
  <div id="titel"><span></span></div>
  <div id="wahl"></div>
  <div id="rueckbox"><div class="rmark">◀ Rückblick · tippen = weiter</div><div class="rn"></div><div class="rt"></div></div>
  <div id="textbox"><div id="name"></div><div id="text"></div><div id="weiter">▼</div><div id="sperre"><i></i></div></div>
  <div id="topbar"><button id="zurueckknopf" title="Zurück">⏪</button><button id="verlaufknopf" title="Verlauf">☰</button><div id="uhr"></div><button id="dbgknopf">🐞</button></div>
  <div id="karte"><div class="k-hg"></div><div class="k-inhalt"><div class="k-tag"></div><div class="k-uhr"></div><div class="k-noch"></div></div></div>
  <div id="toast"></div>
  <div id="debug"></div>
  {rahmen_html}
  <div id="stoppuhr" class="schirm"><h2>Stoppuhr (Testmodus)</h2><div class="inhalt"></div><button>Weiter</button></div>
  <div id="verlauf" class="schirm"></div>
</div></div>
<div id="drehen"><div class="ic">📱</div><div>Bitte drehen – das Spiel läuft im Querformat.</div></div>'''

html = f'''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="only light">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
<title>Du verpasst was.</title>
<style>
{r('style.css')}
{r('phone.css')}
{rahmen_build.css(r('rahmen_src.css'))}
</style>
</head>
<body>

<!-- =====================================================================
     1) STORY-SKRIPT  (Text und Wege – hier wird geschrieben)
     ===================================================================== -->
<script type="text/plain" id="story">
{r('story.txt')}
</script>

<!-- =====================================================================
     2) BILDER UND TÖNE  (Code → Datei)
     ===================================================================== -->
<script>
{r('bilder.js')}
</script>

<!-- =====================================================================
     3) TECHNIK  (muss für Text- und Bildänderungen nicht angefasst werden)
     ===================================================================== -->
{buehne}
<script>
{r('audio.js')}
</script>
<script>
{r('phone.js')}
</script>
<script>
{r('rahmen.js')}
</script>
<script>
{r('engine.js')}
Spiel.init();
</script>
</body>
</html>
'''
(H / 'dist' / 'index.html').write_text(html, encoding='utf-8')
print('ok', len(html))
