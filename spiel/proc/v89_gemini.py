# V8.9 (24.11.): Gemini-Ergebnisse von Philip einbauen. Wiederholbar (Originale in bilder_neu/v89_vorgemini/).
# - Mia: Sprech-Overlays (nur Mund) für N35n, N35s, MIA_GRINST_c, N35be, N35t
# - N35d: Lampe oben weg (nur diese Stelle ins Original)
# - N37: Mund zu als neues Grundbild (nur Mundpartie), Sprechen zeigt weiter N37s
# - BR: Rückenfigur am Geländer (ganzes Bild, hochskaliert + leicht nachgeschärft)
import cv2, numpy as np, json, re, os, shutil, sys
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, H + '/proc')
from varianten import ausrichten, maske, speichere_overlay
IMG = H + '/dist/img/'; VOR = H + '/bilder_neu/v89_vorgemini/'; Q = os.path.dirname(H) + '/quellen/uploads/v89/gemini/'
os.makedirs(VOR, exist_ok=True)

def original(code):
    v = VOR + code + '.webp'
    if not os.path.exists(v): shutil.copy(IMG + code + '.webp', v)
    return cv2.imread(v)

def gemini(name, shape):
    im = cv2.imread(Q + name + '.jpg')
    return cv2.resize(im, (shape[1], shape[0]), interpolation=cv2.INTER_LANCZOS4)

def webp(code, im):
    cv2.imwrite(IMG + code + '.webp', im, [cv2.IMWRITE_WEBP_QUALITY, 90])

neu_ov = {}; neu_var = {}
# Mia: Mundpartie (Box grob um das Gesicht, Maske nimmt nur, was sich ändert)
MIA = {'N35n': ('N35n_m', 'N35ns'), 'N35s': ('N35s_m', 'N35ss'), 'MIA_GRINST_c': ('MIA_GRINST_c_m', 'MIA_GRINST_cs'),
       'N35be': ('N35be_m', 'N35bes'), 'N35t': ('N35t_m', 'N35ts')}
MUND = {'N35n': (0.585, 0.395, 0.72, 0.52), 'N35s': (0.585, 0.395, 0.72, 0.52), 'MIA_GRINST_c': (0.44, 0.395, 0.58, 0.50),
        'N35be': (0.585, 0.395, 0.72, 0.52), 'N35t': (0.585, 0.395, 0.72, 0.52)}
for code, (g, ov) in MIA.items():
    base = original(code); var, _ = ausrichten(base, gemini(g, base.shape))
    al = maske(base, var, box=MUND[code], schwelle=16, wachsen=0.008)   # nur der Mund
    box = speichere_overlay(var, al, IMG + ov + '.webp'); print(code, ov, box)
    if box: neu_ov[ov] = {'basis': code, 'box': box}; neu_var[code] = ov

# N35d: Lampe oben weg
base = original('N35d'); var, _ = ausrichten(base, gemini('N35d_neu', base.shape))
al = maske(base, var, box=(0.44, 0.03, 0.60, 0.27), schwelle=14, wachsen=0.012)
out = (base * (1 - al[..., None]) + var * al[..., None]).astype(np.uint8); webp('N35d', out); print('N35d Lampe', round(float(al.sum()) / al.size, 4))

# N37: Mund zu als Grundbild
base = original('N37'); var, _ = ausrichten(base, gemini('N37_zu', base.shape))
al = maske(base, var, box=(0.40, 0.25, 0.51, 0.36), schwelle=14, wachsen=0.008)
out = (base * (1 - al[..., None]) + var * al[..., None]).astype(np.uint8); webp('N37', out); print('N37 Mund', round(float(al.sum()) / al.size, 4))

# BR: ganzes Bild, leicht nachgeschärft
base = original('BR'); var = gemini('BR_ich', base.shape)
weich = cv2.GaussianBlur(var, (0, 0), 1.2); var = cv2.addWeighted(var, 1.35, weich, -0.35, 0)
webp('BR', var); print('BR neu')

# bilder.js: Overlays und Sprech-Varianten
p = H + '/bilder.js'; s = open(p, encoding='utf-8').read()
m = re.search(r'const OVERLAYS = (\{.*?\});\n', s, re.S); ovs = json.loads(m.group(1)); ovs.update(neu_ov)
s = s.replace(m.group(0), 'const OVERLAYS = ' + json.dumps(ovs, ensure_ascii=False) + ';\n')
for code, ov in neu_var.items():
    zeile = f'  {code}: {{ spricht: {{ Mia: "{ov}" }} }},   // V8.9 Gemini-Mund\n'
    s = re.sub(r'  ' + re.escape(code) + r': \{ spricht: \{ Mia: "[^"]+" \} \},   // V8.9 Gemini-Mund\n', '', s)
    s = s.replace('const VARIANTEN = {\n', 'const VARIANTEN = {\n' + zeile, 1)
open(p, 'w', encoding='utf-8').write(s)
