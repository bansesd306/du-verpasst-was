# V9.1 (Patrick 26.11., Entscheidungen): neue Bilder einbauen. Wiederholbar. Kein Weichzeichner übers Bild.
# Upload -> Lanczos auf Zielgröße + leichtes Nachschärfen -> dist/img/CODE.webp; Augen-zu als Overlay (nur Augenpartie)
import cv2, numpy as np, json, re, sys
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/game/proc')
from varianten import ausrichten, maske, speichere_overlay
R = '/home/claude/du-verpasst-was/'; U = R + 'quellen/uploads/v89/patrick_26-11/'; G = '/home/claude/game/'; O = G + 'dist/img/'
nur = set(sys.argv[1:]); soll = lambda t: not nur or t in nur
def fertig(im, W=1920, H=1080, schaerfe=45):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, schaerfe, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
def webp(code, im, q=86): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=q, method=6); print('ok', code)
def handy(code):
    src = open(G + 'proc/v85_finish.py', encoding='utf-8').read(); exec(src[src.index('def handylook'):src.index('HANDY = [')], globals())
    im = Image.open(O + code + '.webp'); im.thumbnail((1280, 1280)); handylook(im).save(O + code + '_h.webp', 'WEBP', quality=80, method=6); print('handy', code)
lade = lambda n: cv2.imread(U + n + '.jpg')
OV = {}
def overlay(basis, var_code, ziel, box, schwelle=16):
    b = cv2.imread(O + basis + '.webp'); v = fertig(lade(var_code), b.shape[1], b.shape[0])
    v2, _ = ausrichten(b, v); al = maske(b, v2, box=box, schwelle=schwelle, wachsen=0.006)
    OV[ziel] = {'basis': {'LNN2': 'N14c', 'LNL2': 'N14d'}.get(basis, basis), 'box': speichere_overlay(v2, al, O + ziel + '.webp')}; print('overlay', ziel, OV[ziel])

if soll('einfach'):
    for c in ['TAG1', 'N14w', 'N19sk', 'N14zb', 'TIM_SCHLAEFT', 'BALKON_AUSSEN', 'N14be']: webp(c, fertig(lade(c)))
    handy('TIM_SCHLAEFT')
if soll('nah'):
    # Lynn nah neu (ersetzt LNN/LNL – altes Gesicht): N14c = leises Lächeln, N14d = frech
    webp('LNN2', fertig(lade('N14c_neu'), 1920, 1072)); webp('LNL2', fertig(lade('N14d_neu'), 1920, 1072))
if soll('ov'):
    overlay('LNN2', 'N14cd_zu', 'LNN2z', (0.3, 0.2, 0.75, 0.42))
    overlay('LNL2', 'N14cd_zu', 'LNL2z', (0.3, 0.2, 0.75, 0.42))
    overlay('N14be', 'N14bez', 'N14bez', (0.3, 0.05, 0.75, 0.4))
    p = G + 'bilder.js'; s = open(p, encoding='utf-8').read()
    m = re.search(r'const OVERLAYS = (\{.*?\});\n', s, re.S); ov = json.loads(m.group(1)); ov.update(OV)
    s = s.replace(m.group(0), 'const OVERLAYS = ' + json.dumps(ov, ensure_ascii=False) + ';\n')
    open(p, 'w', encoding='utf-8').write(s)

if soll('haus'):
    # C5 (Patrick 26.11.): erstes Wegbild zeigt das Partyhaus schon halb im Dunst (statt Nebelstraße ohne Haus) – kein Weichzeichner,
    # nur Dunst-Farbe darübergemischt (Mitte/Ferne stärker), Fensterlicht gedämpft
    im = cv2.imread(O + 'HAUS_WEIT_a.webp').astype(np.float32); H, W = im.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.exp(-(((xx - W * .5) / (W * .23)) ** 2 + ((yy - H * .2) / (H * .38)) ** 2))   # Ferne um das Haus
    a = np.clip(.18 + .52 * d, 0, .7)[..., None]
    nebel = np.array([78, 66, 58], np.float32)   # BGR: kühles Grau-Blau
    out = im * (1 - a) + nebel * a
    webp('W0n', np.clip(out, 0, 255).astype(np.uint8))
    # W3: Zwischenschritt zwischen HAUS_WEIT und HAUS – Ausschnitt um das Haus (1,3x)
    h2 = cv2.imread(O + 'HAUS_WEIT.webp'); z = 1.3; cw, ch = int(W / z), int(H / z); x0 = int(W * .52 - cw * .5); y0 = int(H * .06)
    webp('HAUS_MITTE', fertig(h2[y0:y0 + ch, x0:x0 + cw], W, H, schaerfe=60))

if soll('nasenring'):
    # A11 (Patrick 26.11.): Mia hat keinen Nasenring – Stecker in MIA_SMIRK wegretuschieren (Original in bilder_neu/v91_vorretusche/)
    for c, mitte in [('MIA_SMIRK', (950, 421)), ('MIA_GRINST', (954, 419)), ('MIA_GRINST_b', (954, 419)), ('MIA_GRINST_c', (954, 419))]:
        im = cv2.imread(G + 'bilder_neu/v91_vorretusche/' + c + '.webp'); m = np.zeros(im.shape[:2], np.uint8)
        cv2.ellipse(m, mitte, (15, 9), 0, 0, 360, 255, -1)
        webp(c, cv2.inpaint(im, m, 6, cv2.INPAINT_TELEA), q=88)
    # Sprech-Overlay von MIA_GRINST_c reicht bis unter die Nase
    o = np.asarray(Image.open(G + 'bilder_neu/v91_vorretusche/MIA_GRINST_cs.webp').convert('RGBA')).copy()
    x0, y0 = round(.4526 * 1920), round(.3639 * 1080); rgb = cv2.cvtColor(o[..., :3], cv2.COLOR_RGB2BGR); m = np.zeros(rgb.shape[:2], np.uint8)
    cv2.ellipse(m, (954 - x0, 419 - y0), (15, 9), 0, 0, 360, 255, -1); rgb = cv2.inpaint(rgb, m, 6, cv2.INPAINT_TELEA)
    o[..., :3] = cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB); Image.fromarray(o).save(O + 'MIA_GRINST_cs.webp', 'WEBP', quality=88, method=6); print('ok MIA_GRINST_cs')
