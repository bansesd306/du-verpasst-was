# V9.2 (Patrick 26.11. abends): Gemini-Zwischenbilder (Blöcke A–D) einbauen. Wiederholbar.
# Upload -> Lanczos auf Größe des Basisbilds + leichtes Nachschärfen -> per ECC genau auf das Basisbild ausrichten -> dist/img
import cv2, numpy as np, sys
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/game/proc')
from varianten import ausrichten
U = '/home/claude/du-verpasst-was/quellen/uploads/v89/patrick_26-11b/'; O = '/home/claude/game/dist/img/'
def fertig(im, W, H, schaerfe=45):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, schaerfe, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
def webp(code, im): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=86, method=6); print('ok', code)
LISTE = [  # Upload, Basis, Spielcode
    ('MIA_A1', 'N35n', 'MIA_GR'), ('MIA_A2', 'N35n', 'MIA_SM'), ('MIA_A2b', 'N35n', 'MIA_SM2'), ('MIA_A3', 'N35n', 'MIA_TILT'), ('MIA_A4', 'N35n', 'MIA_HAND'),
    ('LYNN_B1', 'N14', 'N14hh'), ('LYNN_B2', 'N14', 'N14gr'), ('LYNN_B3', 'N14', 'N14ru'), ('LYNN_B4', 'N14', 'N14dw'),
    ('LYNN_C1', 'N14zb', 'N14zg'), ('LYNN_C2', 'N14zb', 'N14zs')]
for up, basis, code in LISTE:
    b = cv2.imread(O + basis + '.webp'); v = fertig(cv2.imread(U + up + '.jpg'), b.shape[1], b.shape[0])
    v2, M = ausrichten(b, v); print(code, np.round(M, 3).tolist()); webp(code, v2)
webp('W0g', fertig(cv2.imread(U + 'WEG_W0.jpg'), 1920, 1080))
