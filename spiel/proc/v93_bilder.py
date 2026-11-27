# V9.3 (Patrick 27.11. nachts): Gemini-Bilder Block A (Lynn nah: lächelt/traurig/ernst), Block B (Lynn mit Becher: lächelt + Augen zu), Block C (Lenas Story ohne Lynn). Wiederholbar.
import cv2, numpy as np, sys
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/game/proc')
from varianten import ausrichten
U = '/home/user/du-verpasst-was/quellen/uploads/v89/patrick_27-11/'; O = '/home/claude/game/dist/img/'
def fertig(im, W, H, schaerfe=45):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, schaerfe, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
def webp(code, im): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=86, method=6); print('ok', code)
# Lynn nah: alle drei auf LNN2 (N14c) ausrichten – Patricks LNS war etwas näher dran als LNSt/LNSe
ref = cv2.imread(O + 'LNN2.webp'); H_, W_ = ref.shape[:2]
# V9.3b: LNSe aus Patricks zweitem Bild (LNSe2, richtige Größe)
for c, q in [('LNS', 'LNS'), ('LNSt', 'LNSt'), ('LNSe', 'LNSe2'), ('LNA3', 'LNA3'), ('LNA4', 'LNA4')]:
    v2, M = ausrichten(ref, fertig(cv2.imread(U + q + '.jpg'), W_, H_)); print(c, np.round(M, 3).tolist()); webp(c, v2)
# Lynn am Geländer: Lachen beginnt / klingt aus (ganze Bilder, auf N14 ausgerichtet)
r14 = cv2.imread(O + 'N14.webp')
for c in ['N14lb', 'N14la']:
    v2, M = ausrichten(r14, fertig(cv2.imread(U + c + '.jpg'), r14.shape[1], r14.shape[0])); print(c, np.round(M, 3).tolist()); webp(c, v2)
# Mia: halb skeptisch, Augen zu (auf N35n ausgerichtet)
r35 = cv2.imread(O + 'N35n.webp')
for c in ['N35sn', 'N35nz']:
    v2, M = ausrichten(r35, fertig(cv2.imread(U + c + '.jpg'), r35.shape[1], r35.shape[0])); print(c, np.round(M, 3).tolist()); webp(c, v2)
for erst, rest in [('N34Ll', ['N34Llz'])]:
    b = fertig(cv2.imread(U + erst + '.jpg'), 1920, 1080); webp(erst, b)
    for c in rest:
        v2, M = ausrichten(b, fertig(cv2.imread(U + c + '.jpg'), 1920, 1080)); print(c, np.round(M, 3).tolist()); webp(c, v2)
webp('B07', fertig(cv2.imread(U + 'B07_neu.jpg'), 810, 1080))

# V9.3b: Overlays aus Patricks Block A (nur der Teil, der sich ändert)
import json, re
sys.path.insert(0, '/home/claude/game/proc')
from varianten import maske, speichere_overlay
def ov(basis_datei, var_code, box, ziel, schwelle=14):
    b = cv2.imread(O + basis_datei + '.webp'); v = cv2.imread(O + var_code + '.webp')
    al = maske(b, v, box=box, schwelle=schwelle, wachsen=0.008); r = speichere_overlay(v, al, O + ziel + '.webp'); print(ziel, r); return r
neu = {}
neu['LNN2s'] = {'basis': 'N14c', 'box': ov('LNN2', 'LNA3', (0.40, 0.43, 0.58, 0.60), 'LNN2s')}    # N14c redet
neu['LNSez'] = {'basis': 'LNSe', 'box': ov('LNSe', 'LNA4', (0.38, 0.25, 0.62, 0.42), 'LNSez')}   # LNSe blinzelt
p = '/home/claude/game/bilder.js'; s = open(p, encoding='utf-8').read()
m = re.search(r'const OVERLAYS = (\{.*?\});\n', s, re.S); ovs = json.loads(m.group(1)); ovs.update(neu)
s = s.replace(m.group(0), 'const OVERLAYS = ' + json.dumps(ovs, ensure_ascii=False) + ';\n')
open(p, 'w', encoding='utf-8').write(s)

# V9.3e: Mia-Daumenkino MD1–MD4 (Gemini, Patrick 27.11.): alle auf MD1 ausgerichtet, 1920x1080
mb = fertig(cv2.imread(U + 'MD1.jpg'), 1920, 1080); webp('MD1', mb)
for c in ['MD2', 'MD3', 'MD4']:
    v2, M = ausrichten(mb, fertig(cv2.imread(U + c + '.jpg'), 1920, 1080)); print(c, np.round(M, 3).tolist()); webp(c, v2)
