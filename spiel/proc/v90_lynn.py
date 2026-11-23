# V9.0: Lynn-Balkon-Posen N14t/N14s/N14k neu (nur Mund geändert, Gesicht gleich). Wiederholbar.
src = open('/home/claude/du-verpasst-was/spiel/proc/v88_bilder.py', encoding='utf-8').read()
exec(src[:src.index('# ---------- A1')])
for c in ['N14t', 'N14s', 'N14k']: webp(c, pil2cv(nur_himmel(cv2pil(fertig(lade(c), 1920, 1072)))))

# Lynn blinzeln: nur die Augenpartie als Overlay (statt ganzem Bild N14z – dort änderten sich Hintergrund und Pulli)
import json, re
sys.path.insert(0, '/home/claude/game/proc')
O2 = '/home/claude/du-verpasst-was/spiel/dist/img/'
base = cv2.imread(O2 + 'N14.webp'); var = cv2.imread(O2 + 'N14z.webp')
from varianten import ausrichten, maske, speichere_overlay
var2, _ = ausrichten(base, var)
al = maske(base, var2, box=(0.575, 0.19, 0.765, 0.30), schwelle=18, wachsen=0.006)
box = speichere_overlay(var2, al, O2 + 'N14zo.webp'); print('N14zo box', box)
p = '/home/claude/du-verpasst-was/spiel/bilder.js'; s = open(p, encoding='utf-8').read()
m = re.search(r'const OVERLAYS = (\{.*?\});\n', s, re.S); ov = json.loads(m.group(1)); ov['N14zo'] = {'basis': 'N14', 'box': box}
s = s.replace(m.group(0), 'const OVERLAYS = ' + json.dumps(ov, ensure_ascii=False) + ';\n')
if '"N14zo"' not in s[s.index('const VARIANTEN'):]: s = s.replace('const VARIANTEN = {\n', 'const VARIANTEN = {\n  N14: { blink: ["N14zo"] },\n', 1)
s = s.replace('figur: true, blinzeln: "N14z",', 'figur: true,', 1)
open(p, 'w', encoding='utf-8').write(s)
