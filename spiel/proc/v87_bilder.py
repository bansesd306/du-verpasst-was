# V8.7: neue Gemini-Bilder (Mia, Lena nah) + Außenbilder dunkler. Wiederholbar (Originale der abgedunkelten Bilder in bilder_neu/v87_vordunkel/).
# Weg wie V8.6: Upload -> (Retusche) -> Lanczos auf 1920x1080 + leichtes Nachschärfen -> dist/img/CODE.webp. Kein Weichzeichner übers Bild.
import cv2, numpy as np, os, json, re, sys, shutil
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/game/proc')
from varianten import maske, speichere_overlay, ausrichten
from v87_draussen_dunkler import dunkel
R = '/home/claude/du-verpasst-was/'; U = R + 'quellen/uploads/'; G = '/home/claude/game/'; O = G + 'dist/img/'
nur = set(sys.argv[1:])
def soll(teil): return not nur or teil in nur

def lade(n): return cv2.imread(U + n + '_gemini.jpg')
def fertig(im, W=1920, H=1080):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, 45, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
def webp(code, im, q=86): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=q, method=6)

def ki_weg(im):
    # „✦ KI-generierter Inhalt“ unten links (wie v85_prep N06): helle Schrift auf dunklem Boden -> Inpainting nur in dem Feld
    h, w = im.shape[:2]
    feld = im[h - 50:h - 4, 0:330]
    grau = cv2.cvtColor(feld, cv2.COLOR_BGR2GRAY).astype(np.int16)
    hint = cv2.medianBlur(grau.astype(np.uint8), 21).astype(np.int16)
    m = ((grau - hint) > 10).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((5, 5), np.uint8), iterations=2)
    mk = np.zeros((h, w), np.uint8); mk[h - 50:h - 4, 0:330] = m
    return cv2.inpaint(im, mk, 9, cv2.INPAINT_TELEA)

# ---------- Mia: Person links per Maske ersetzen ----------
if soll('mia'):
    m = cv2.imread(G + 'proc/mia_maske_links.png', 0).astype(np.float32)[..., None] / 255
    party = lade('MIA_HANDY'); leer = ki_weg(lade('MIA_HANDY_LEER'))
    neu = {'MIA_HANDY': party, 'MIA_HANDY_LEER': leer}
    for c in ['MIA_GRINST', 'MIA_GRINST_b', 'MIA_GRINST_c', 'MIA_SMIRK']:
        neu[c] = (lade(c) * (1 - m) + party * m).astype(np.uint8)
    for c in ['MIA_LEER', 'MIA_LEER_TASCHE']:
        neu[c] = (ki_weg(lade(c)) * (1 - m) + leer * m).astype(np.uint8)
    for c, im in neu.items(): webp(c, fertig(im)); print('mia', c)

# ---------- Lena nah + Gesichts-Overlays ----------
if soll('lena'):
    b = fertig(lade('LENA_NAH')); webp('LENA_NAH', b)
    ov = json.load(open(G + 'proc/overlays.json'))
    for var, box in [('LENA_NAH_z', (.32, .02, .68, .6)), ('LENA_NAH_s', (.32, .02, .68, .75)), ('LENA_NAH_l', (.3, .02, .7, .75))]:
        v = fertig(lade(var))
        if var.endswith('_l'): v, M = ausrichten(b, v); print('ausgerichtet', var, np.round(M, 3).tolist())
        a = maske(b, v, box=box, schwelle=20, wachsen=.008, minfrac=.00015)
        bx = speichere_overlay(v, a, O + var + '.webp')
        if bx: ov[var] = {'basis': 'LENA_NAH', 'box': bx}
        print('lena', var, bx)
    json.dump(ov, open(G + 'proc/overlays.json', 'w'))
    bj = open(G + 'bilder.js', encoding='utf-8').read()
    bj = re.sub(r'^const OVERLAYS = \{.*\};$', 'const OVERLAYS = ' + json.dumps(ov, ensure_ascii=False) + ';', bj, flags=re.M)
    open(G + 'bilder.js', 'w', encoding='utf-8').write(bj)

# ---------- Außenbilder dunkler (Philip 22.11. 01:07/01:11) ----------
# Innenräume nachts (N1, N02, N02D, N07, L7) bewusst nicht: schon dunkel, Philips Punkt waren die Außenbilder.
DUNKEL = ['N14', 'N14r', 'N14m', 'N14h', 'N14rz', 'N14g', 'N14z', 'N14b', 'LNN', 'LNL', 'N15', 'N29', 'BALKON_LEER',
          'N34', 'N34b', 'N36Z', 'BR', 'B10', 'B14', 'B15', 'N11', 'N12', 'K12', 'L4b']
if soll('dunkel'):
    V = G + 'bilder_neu/v87_vordunkel/'; os.makedirs(V, exist_ok=True)
    for c in DUNKEL:
        if not os.path.exists(V + c + '.webp'): shutil.copy(O + c + '.webp', V + c + '.webp')
        im = Image.open(V + c + '.webp')
        d = dunkel(im)
        if c == 'N29':  # Lynns Story (hochkant): unten Fliesen -> unterstes Stück weg
            w, h = d.size; d = d.crop((0, 0, w, int(h * .93)))
        d.save(O + c + '.webp', 'WEBP', quality=88, method=6); print('dunkel', c)
    # Handyfassung von N12 (B16) neu – gleicher Look wie v85_finish.handylook
    src = open(G + 'proc/v85_finish.py', encoding='utf-8').read()
    exec(src[src.index('def handylook'):src.index('HANDY = [')])
    im = Image.open(O + 'N12.webp'); im.thumbnail((1280, 1280)); handylook(im).save(O + 'N12_h.webp', 'WEBP', quality=80, method=6); print('handy N12_h')

# ---------- Person links auch in den bisherigen Mia-Bildern (gleicher Hintergrund wie MIA_HANDY) ----------
if soll('mia35'):
    V = G + 'bilder_neu/v87_vorlinks/'; os.makedirs(V, exist_ok=True)
    d0 = cv2.imread(O + 'MIA_HANDY.webp'); m0 = cv2.imread(G + 'proc/mia_maske_links.png', 0)
    for c in ['N35b', 'N35c', 'N35cL', 'N35t', 'N35n', 'N35s', 'N35be', 'N35d', 'N35f', 'N35fz', 'N35z']:
        if not os.path.exists(V + c + '.webp'): shutil.copy(O + c + '.webp', V + c + '.webp')
        im = cv2.imread(V + c + '.webp'); h, w = im.shape[:2]
        m = cv2.resize(m0, (w, h)).astype(np.float32)[..., None] / 255; d = cv2.resize(d0, (w, h), interpolation=cv2.INTER_LANCZOS4)
        webp(c, (im * (1 - m) + d * m).astype(np.uint8), 88); print('links weg', c)

# ---------- N19n (Lynn im Flur, normaler Blick) und N29b (zwei Becher auf dem Geländer, dunkel wie die anderen Außenbilder) ----------
if soll('einzeln'):
    w, h = Image.open(O + 'N19.webp').size
    webp('N19n', fertig(lade('N19n'), w, h))
    b = fertig(lade('N29b')); d = dunkel(Image.fromarray(cv2.cvtColor(b, cv2.COLOR_BGR2RGB)))
    d.save(O + 'N29b.webp', 'WEBP', quality=86, method=6); print('N19n, N29b')
