# V8.5: Personenbilder mit zu wenig Schatten leicht abdunkeln (Philip: mild, „nicht zu viel“).
# Kein Weichzeichner, keine Körnung. Ränder ~85 %, Schatten etwas tiefer, auf der Party ein Hauch Farbe
# (warme Lichter, lila Schatten) – deutlich schwächer als die Vorschau TV1_vorher_nachher.jpg.
# Gesichts-Overlays werden mit derselben Rechnung an ihrer Stelle im Grundbild gefiltert (passen also weiter).
# Originale: bilder_neu/v85_vorfilter/ (zum Zurücksetzen: python3 v85_personen.py --zurueck)
import json, os, re, shutil, sys
import numpy as np
from PIL import Image
G = '/home/claude/game/'; O = G + 'dist/img/'; B = G + 'bilder_neu/v85_vorfilter/'; os.makedirs(B, exist_ok=True)
# Szenengruppen (alles, was in derselben Szene nacheinander kommt, gleich behandeln)
PARTY = ['TV1', 'TV2', 'TVn', 'N35b', 'N35c', 'N35f', 'N35M1', 'N35M2', 'N35cL', 'N35t', 'N35n', 'N35s', 'N35be', 'N35d', 'N35fz', 'N35z', 'B12', 'B12L']
RUHIG = ['N18', 'N19', 'N20', 'N21', 'LD1']
def filt(a, xs, ys, party):
    """a: float RGB 0..1; xs, ys: Koordinaten im Grundbild (0..1)"""
    r = np.sqrt(((xs - .5) / .62) ** 2 + ((ys - .45) / .78) ** 2)
    rand = 1 - .2 * np.clip(r - .42, 0, None) ** 1.25
    a = a ** 1.07
    if party:
        l = a.mean(2, keepdims=True)
        a = a + .55 * ((np.array([.03, .012, -.02]) * l) + (np.array([.012, -.008, .03]) * (1 - l)) * .6)
    return np.clip(a * np.clip(rand, .78, 1)[..., None], 0, 1)
def bearbeite(code, party, ov):
    q = B + code + '.webp'
    if not os.path.exists(q): shutil.copy(O + code + '.webp', q)
    im = Image.open(q); mode = im.mode; im = im.convert('RGBA'); a = np.asarray(im).astype(np.float32) / 255
    h, w = a.shape[:2]
    if code in ov:   # Overlay: Koordinaten im Grundbild
        x0, y0, bw, bh = ov[code]['box']; ys, xs = np.mgrid[0:h, 0:w]; xs = x0 + (xs + .5) / w * bw; ys = y0 + (ys + .5) / h * bh
    else:
        ys, xs = np.mgrid[0:h, 0:w]; xs = (xs + .5) / w; ys = (ys + .5) / h
    a[..., :3] = filt(a[..., :3], xs, ys, party)
    out = Image.fromarray((a * 255 + .5).astype(np.uint8), 'RGBA')
    if mode != 'RGBA': out = out.convert('RGB')
    out.save(O + code + '.webp', 'WEBP', quality=86, method=6)
bj = open(G + 'bilder.js', encoding='utf-8').read()
ov = json.loads(re.search(r'^const OVERLAYS = (\{.*\});$', bj, re.M).group(1))
if '--zurueck' in sys.argv:
    for f in os.listdir(B): shutil.copy(B + f, O + f); print('zurück', f)
    sys.exit()
liste = [(c, True) for c in PARTY] + [(c, False) for c in RUHIG]
for basis, party in list(liste):
    liste += [(k, party) for k, v in ov.items() if v['basis'] == basis]
for c, party in liste:
    if os.path.exists(O + c + '.webp'): bearbeite(c, party, ov); print('gefiltert', c)
