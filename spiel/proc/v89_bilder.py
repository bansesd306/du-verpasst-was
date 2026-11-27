# V8.9: neue Bilder (quellen/uploads + quellen/uploads/v89) -> dist/img/CODE.webp + Einträge in bilder.js
# Lanczos + leichtes Nachschärfen. LP-Bilder: alle gleich beschnitten (oben links bleibt, je 10 % rechts/unten weg), damit Pointer/Stift verschwinden.
import cv2, numpy as np, os, re
from PIL import Image
R = '/home/claude/du-verpasst-was/'; U = R + 'quellen/uploads/'; V = U + 'v89/'; O = R + 'spiel/dist/img/'; BJ = R + 'spiel/bilder.js'
os.makedirs(O, exist_ok=True)
def f(prefix): return [V + x for x in os.listdir(V) if x.startswith(prefix)][0]
# Code: (Quelle, Zielgröße, LP-Beschnitt, Text, Stimmung, extra)
LP = lambda t: (t, 'traum', ', figur: true')
B = {
 'HAUS':        (U+'HAUS.jpg', (1920,1080), False, 'Partyhaus von vorn, 5 Stockwerke, Party oben + Balkon mit Lichterkette (Gemini V8.9)', 'strasse', ''),
 'HAUS_WEIT':   (U+'HAUS_WEIT.jpg', (1920,1080), False, 'Straße, Partyhaus näher, Balkon deutlich (Gemini V8.9)', 'strasse', ''),
 'HAUS_WEIT_a': (U+'HAUS_WEIT_a.jpg', (1920,1080), False, 'Straße, Partyhaus weit weg (Gemini V8.9)', 'strasse', ''),
 'TREPPE_HELL': (U+'TREPPE_hell.jpg', (1920,1080), False, 'Treppenhaus von unten, Partylicht von oben (Hinweg)', 'flur', ''),
 'TREPPE':      (U+'TREPPE.jpg', (1920,1080), False, 'Treppenhaus dunkel (Rückweg, 2 Uhr)', 'flur', ''),
 'N29n':        (U+'N29n.jpg', (1920,1080), False, 'Balkon: Becher nah, Lippenstift an einem (Gemini V8.9)', 'balkon', ''),
 'HW_TUER':     (U+'HW_TUER.jpg', (1920,1080), False, 'Hand an der Balkontür-Klinke (Gemini V8.9)', 'balkon', ''),
 'TV0':         (f('03_'), (1920,1080), False, 'Tim zeigt auf sich: „Schon vergessen? Afterparty. Bei mir.“ (Gemini V8.9)', 'party', ', figur: true'),
 'JONAS_TISCH': (f('09_'), (1080,1920), False, 'Jonas steht auf dem Tisch, Becher hoch, alle grölen (Story, 9:16, V8.9)', 'foto', ''),
 'LENA_SELFIE': (f('12_'), (1152,1536), False, 'Lena-Selfie auf der Party, Kussmund (Weg B, V8.9)', 'foto', ''),
 'LP3':  (f('01_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn neutral, schaut nach vorn', 'traum', ', figur: true'),
 'LP3z': (f('02_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn Augen zu (Blinzeln)', 'traum', ', figur: true'),
 'LP4':  (f('04_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn, Braue hoch, schelmisch', 'traum', ', figur: true'),
 'LP5':  (f('11_'), (1920,1080), True, 'Rückblende Hörsaal: roter Laserpunkt auf Lynns Wange', 'traum', ', figur: true'),
 'LP6':  (f('15_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn Nahaufnahme mit Laser', 'traum', ', figur: true'),
 'LP7':  (f('10_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn redet, Laser auf der Wange', 'traum', ', figur: true'),
 'LP8':  (f('06_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn greift nach dem Pointer', 'traum', ', figur: true'),
 'LP9':  (f('16_'), (1920,1080), True, 'Rückblende Hörsaal: Lynns Stinkefinger', 'traum', ', figur: true'),
 'LP2':  (f('13_'), (1920,1080), True, 'Rückblende Hörsaal: Lynn lächelt kurz', 'traum', ', figur: true'),
}
def schaerfen(im, a=.35):
    b = cv2.GaussianBlur(im, (0, 0), 1.4); return np.clip(cv2.addWeighted(im, 1 + a, b, -a, 0), 0, 255).astype(np.uint8)
def ki_weg(im):   # HW_TUER: „✦ KI-generierter Inhalt“ unten links übermalen
    h, w = im.shape[:2]; y0, y1, x1 = int(h*.955) - 28, h - 2, int(w*.2)
    feld = im[y0:y1, 0:x1]; grau = cv2.cvtColor(feld, cv2.COLOR_BGR2GRAY).astype(np.int16)
    hint = cv2.medianBlur(grau.astype(np.uint8), 21).astype(np.int16); m = ((grau - hint) > 22).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((5, 5), np.uint8), iterations=2); maske = np.zeros((h, w), np.uint8); maske[y0:y1, 0:x1] = m
    return cv2.inpaint(im, maske, 9, cv2.INPAINT_TELEA)
js = open(BJ, encoding='utf-8').read(); neu = []
for code, (q, (W, H), lp, text, st, extra) in B.items():
    im = cv2.imread(q)
    if code == 'HW_TUER': im = ki_weg(im)
    if lp: h, w = im.shape[:2]; im = im[:int(h*.9), :int(w*.9)]
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4); im = schaerfen(im)
    Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=86, method=6)
    if not re.search(r'^\s*%s:\s*\{' % re.escape(code), js, re.M): neu.append('  %s: { datei: "img/%s.webp", text: "%s", stimmung: "%s"%s },' % (code, code, text, st, extra))
    print('ok', code, W, H)
if neu:
    k = js.index('  N29b:'); k = js.index('\n', k) + 1; js = js[:k] + '\n'.join(neu) + '\n' + js[k:]
# Hin-/Rückweg: neues Partyhaus statt altem Haus (gleiche Codes, damit das Skript sich nicht ändern muss)
def setze(code, datei):
    global js
    js = re.sub(r'(^\s*%s:\s*\{\s*datei:\s*")[^"]+(")' % code, r'\g<1>img/%s.webp\2' % datei, js, count=1, flags=re.M)
setze('B15', 'HAUS_WEIT_a'); setze('N11', 'HAUS_WEIT'); setze('N12', 'HAUS'); setze('B16', 'HAUS')
open(BJ, 'w', encoding='utf-8').write(js)
