# V9.2 (Patrick 28.11.): Lynn-Zwischenbilder ohne Positionssprung (Gemini Block A/B). Wiederholbar. Kein Weichzeichner.
# Upload -> Lanczos auf Größe des Basisbilds + leichtes Nachschärfen -> dist/img/CODE.webp (global auf Basis ausgerichtet)
import cv2, sys, os
from PIL import Image, ImageFilter
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from varianten import ausrichten
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')) + '/'
U = R + 'quellen/uploads/v89/patrick_28-11/'; O = R + 'spiel/dist/img/'
def fertig(im, W, H, schaerfe=45):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, schaerfe, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
for code, basis in [('N14wz', 'LNL2'), ('N14w2', 'LNL2'), ('N34Lm', 'N34Lt'), ('N34Ll2', 'N34Lt')]:
    b = cv2.imread(O + basis + '.webp'); v = fertig(cv2.imread(U + code + '.jpg'), b.shape[1], b.shape[0])
    v, _ = ausrichten(b, v)
    Image.fromarray(cv2.cvtColor(v, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=86, method=6); print('ok', code)

# Patrick 28.11.: N38 (Lynn hält den Stift hin) blinzelt – Augen-zu-Ebene nur Augenpartie
import json, re
from varianten import maske, speichere_overlay
b = cv2.imread(O + 'N38.webp'); v = fertig(cv2.imread(U + 'N38z.jpg'), b.shape[1], b.shape[0]); v, _ = ausrichten(b, v)
al = maske(b, v, box=(0.16, 0.24, 0.37, 0.42), schwelle=16, wachsen=0.006)
ov = {'N38z': {'basis': 'N38', 'box': speichere_overlay(v, al, O + 'N38z.webp')}}; print('overlay', ov)
p = R + 'spiel/bilder.js'; s = open(p, encoding='utf-8').read()
m = re.search(r'const OVERLAYS = (\{.*?\});\n', s, re.S); o = json.loads(m.group(1)); o.update(ov)
s = s.replace(m.group(0), 'const OVERLAYS = ' + json.dumps(o, ensure_ascii=False) + ';\n'); open(p, 'w', encoding='utf-8').write(s)
