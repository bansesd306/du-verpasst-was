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
