# V8.9 (Patrick 24.11.): Fenster im Haus gegenüber gehen einzeln aus – genau an ihren Stellen (kein dunkler Kasten).
# Erzeugt pro beleuchtetem Fenster eine Ebene (volles Bild, sonst durchsichtig): dort dunkles Glas statt Licht.
# Aufruf: python3 proc/v89_fenster.py   → dist/img/K12_fa.webp … K12_ff.webp
import cv2, numpy as np
from PIL import Image
QUELLE = 'dist/img/K12.webp'
im = np.array(Image.open(QUELLE).convert('RGB')).astype(float)
R, G, B = im[:, :, 0], im[:, :, 1], im[:, :, 2]
lum = R * .3 + G * .59 + B * .11
licht = (((lum > 95) & (R > B + 30)) | ((R > 110) & (R > G + 35))).astype(np.uint8)
licht[:, :1300] = 0; licht[640:, :] = 0; licht[:150, :] = 0; licht[:, 1640:] = 0
# Fenster (x0, y0, x1, y1) im Originalbild 1920×1072, Reihenfolge = Reihenfolge des Ausgehens
FENSTER = {'fa': (1300, 240, 1378, 425), 'fb': (1478, 482, 1522, 560), 'fc': (1376, 226, 1414, 300), 'fd': (1560, 350, 1598, 432), 'fe': (1370, 354, 1410, 430), 'ff': (1480, 222, 1532, 302)}
for k, (x0, y0, x1, y1) in FENSTER.items():
    m = np.zeros(licht.shape, np.uint8); m[y0:y1, x0:x1] = licht[y0:y1, x0:x1]
    kern = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=3)   # Fensterfläche + Lichtsaum am Rahmen
    a = np.clip(cv2.GaussianBlur(kern.astype(np.float32), (0, 0), 1.0) * 1.3, 0, 1)   # nur die Maskenkante weich
    # Schein auf der Fassade um das Fenster: verschwindet mit dem Licht (Bild dort etwas dunkler)
    hof = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 9.0); hof = np.clip(hof / max(hof.max(), 1e-6), 0, 1) * .55
    # dunkles Glas wie die unbeleuchteten Fenster daneben (graubraun, Sprossen/Vorhang bleiben als leichte Struktur)
    rel = (lum - lum[y0:y1, x0:x1].mean()) / 255.0
    glas = np.stack([44 + rel * 26, 41 + rel * 24, 42 + rel * 24], -1)
    # Hof: Originalfarbe, 30 % dunkler und kühler – als halbtransparente dunkle Schicht
    hoffarbe = np.stack([R * .62, G * .66, B * .74], -1)
    farbe = glas * a[..., None] + hoffarbe * (1 - a[..., None])
    # warmer Rahmen/Laibung, die nur vom Licht innen orange war: wird kühl und dunkler wie die Fassade
    warm = np.zeros(licht.shape, np.float32); X0, Y0, X1, Y1 = max(0, x0 - 8), max(0, y0 - 8), x1 + 8, y1 + 8
    warm[Y0:Y1, X0:X1] = np.clip(((R - B)[Y0:Y1, X0:X1] - 8) / 25, 0, 1)
    warm = cv2.GaussianBlur(warm, (0, 0), 1.0) * .95
    alpha = np.maximum(np.maximum(a, hof), warm * (1 - a))
    out = np.zeros((*licht.shape, 4), np.uint8)
    out[:, :, :3] = np.clip(farbe, 0, 255).astype(np.uint8); out[:, :, 3] = (alpha * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(f'dist/img/K12_{k}.webp', quality=90, method=6)
    print(k, int(m.sum()))
