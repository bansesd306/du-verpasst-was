# V8.5: neue Gemini-Bilder (bilder_neu/v8_hq, sanft hochskaliert) -> dist/img/CODE.webp
# und Handyfoto-Fassungen (*_h.webp, starker Look nur im Handy) -> imHandy in bilder.js
import cv2, numpy as np, os, re, sys
from PIL import Image
G = '/home/claude/game/'; HQ = G + 'bilder_neu/v8_hq/'; SRC = G + 'bilder_neu/v8_src/'; O = G + 'dist/img/'
GROESSE = {c: (1920, 1072) for c in ['N02D', 'L7', 'N14m', 'N14h', 'N14rz', 'N26s']}   # wie die Partnerbilder (Überblenden)
NEU = ['N02D', 'N1L', 'N38a', 'L7', 'N06', 'MO_KAFFEE', 'N07', 'N14m', 'N14h', 'N14rz', 'BALKON_LEER', 'N30', 'TORTE',
       'N16', 'N26s', 'AO4', 'N32e', 'N32c', 'MIA_SELFIE', 'BALKON_GRUPPE']
def webp(pfad, im, q=86): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(pfad, 'WEBP', quality=q, method=6)
nur = sys.argv[1:] or NEU
for c in nur:
    q = HQ + c + '.png'
    if not os.path.exists(q): print('fehlt noch:', c); continue
    im = cv2.imread(q); W, H = GROESSE.get(c, (1920, 1080))
    if im.shape[1] != W or im.shape[0] != H: im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    if c == 'N26s':
        # wie V8: N26 = scharfe Fassung, nur Lynn hinten weich (Tiefe); beim Ranzoomen wird auf N26s überblendet
        h, w = im.shape[:2]; f = im.astype(np.float32)
        lb = np.zeros((h, w), np.float32); lb[int(h * .38):int(h * .62), int(w * .475):int(w * .555)] = 1; lb = cv2.GaussianBlur(lb, (0, 0), 8 * w / 1318)[..., None]
        weich = cv2.GaussianBlur(f, (0, 0), 1.3 * w / 1318)
        webp(O + 'N26.webp', np.clip(f * (1 - lb) + weich * lb, 0, 255).astype(np.uint8))
    webp(O + c + '.webp', im); print('ok', c, W, H)

# ---- Handyfoto-Fassungen: nur für Bilder, die als Story/Foto/Video im Handy erscheinen ----
def handylook(img):
    im = np.asarray(img.convert('RGB')).astype(np.float32) / 255; h, w, _ = im.shape
    im = im ** 1.25 * 0.82
    l = im.mean(2, keepdims=True)
    im = im + (np.array([.05, .02, -.04]) * l) + (np.array([-.01, 0, .025]) * (1 - l)) * 0.5
    y, x = np.mgrid[0:h, 0:w]; r = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h * 0.45) / (h / 2)) ** 2)
    im = im * np.clip(1 - 0.38 * np.clip(r - 0.35, 0, None) ** 1.4, 0, 1)[..., None]
    rng = np.random.default_rng(1); im = im + rng.normal(0, .022, (h, w, 1)) * (0.6 + 0.4 * (1 - l))
    return Image.fromarray((np.clip(im, 0, 1) * 255).astype(np.uint8))
HANDY = ['BALKON_GRUPPE', 'MIA_SELFIE', 'N32c', 'N32e', 'N32a', 'N35w', 'N32b', 'N32d', 'N32dA', 'N13', 'N13L', 'B12A',
         'H36a', 'H36b', 'N33', 'TORTE', 'A1', 'N35M1', 'B16']
bj = open(G + 'bilder.js', encoding='utf-8').read()
for c in HANDY:
    m = re.search(r'^(\s*' + re.escape(c) + r':\s*\{ datei: "img/([^"]+)\.webp")(.*)$', bj, re.M)
    if not m: print('nicht gefunden', c); continue
    datei = m.group(2); ziel = f'img/{datei}_h.webp'
    if not os.path.exists(G + 'dist/' + ziel) or datei in [x for x in nur]:
        im = Image.open(O + datei + '.webp'); im.thumbnail((1280, 1280)); handylook(im).save(G + 'dist/' + ziel, 'WEBP', quality=80, method=6)
    if 'imHandy' not in m.group(3):
        bj = bj[:m.start()] + m.group(1) + f', imHandy: "{ziel}"' + m.group(3) + bj[m.end():]
    print('handy', c, ziel)
open(G + 'bilder.js', 'w', encoding='utf-8').write(bj)
