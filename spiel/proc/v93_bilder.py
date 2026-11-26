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
ref = cv2.resize(cv2.imread(O + 'LNN2.webp'), (1920, 1080), interpolation=cv2.INTER_LANCZOS4)
for c in ['LNS', 'LNSt', 'LNSe']:
    v2, M = ausrichten(ref, fertig(cv2.imread(U + c + '.jpg'), 1920, 1080)); print(c, np.round(M, 3).tolist()); webp(c, v2)
for erst, rest in [('N34Ll', ['N34Llz'])]:
    b = fertig(cv2.imread(U + erst + '.jpg'), 1920, 1080); webp(erst, b)
    for c in rest:
        v2, M = ausrichten(b, fertig(cv2.imread(U + c + '.jpg'), 1920, 1080)); print(c, np.round(M, 3).tolist()); webp(c, v2)
webp('B07', fertig(cv2.imread(U + 'B07_neu.jpg'), 810, 1080))
