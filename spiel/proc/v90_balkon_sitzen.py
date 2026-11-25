# V9.0 (Patrick 25.11.): Lynn sitzt auf dem Balkonboden (Ich-Sicht, roter Becher) – drei deckungsgleiche Gemini-Bilder
# N34L = schaut dich an, N34Lt = trinkt (lächelt hinter dem Becher), N34Ls = schaut in die Stadt. Wiederholbar.
import os
from PIL import Image, ImageFilter, ImageChops
import numpy as np
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = os.path.dirname(H) + '/quellen/uploads/v89/gemini_balkon_sitzen/'
for code, datei in [('N34L', 'rot1_schaut'), ('N34Lt', 'rot2_trinkt'), ('N34Ls', 'rot3_weg'),
                   # Bildfolge „die Zeit vergeht“ (Patrick 25.11.): beide sitzen, wechselnde Plätze, drinnen läuft die Party weiter
                   ('N34S1', 'zwei_1_ecke'), ('N34S2', 'zwei_2_wand'), ('N34S3', 'zwei_3_weit'), ('N34S4', 'zwei_4_oben'), ('N34S5', 'zwei_5_nah')]:
    im = Image.open(Q + datei + '.jpg').convert('RGB').resize((1920, 1080), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=0))   # leicht nachschärfen wie BR
    im.save(H + '/dist/img/' + code + '.webp', quality=90); print(code)

# Zeitraffer mit fester Kamera (Patrick 25.11.): Hintergrund immer aus dem Grundbild (zwei_1_ecke), vom neuen Bild nur der Bereich, in dem sich die beiden verändert haben
def zeitraffer(code, datei, box):
    basis = Image.open(Q + 'zwei_1_ecke.jpg').convert('RGB'); neu = Image.open(Q + datei + '.jpg').convert('RGB').resize(basis.size, Image.LANCZOS)
    d = np.abs(np.asarray(basis, float) - np.asarray(neu, float)).mean(2) > 18
    m = np.zeros(d.shape, bool); x0, y0, x1, y1 = [int(v * (basis.width if i % 2 == 0 else basis.height)) for i, v in enumerate(box)]
    m[y0:y1, x0:x1] = d[y0:y1, x0:x1]
    maske = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(6))   # nur die Maskenkante weich, nicht das Bild
    bild = Image.composite(neu, basis, maske).resize((1920, 1080), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=0))
    bild.save(H + '/dist/img/' + code + '.webp', quality=90); print(code, 'Anteil', round(float(m.mean()), 3))

zeitraffer('N34Z2', 'zeit_2_lacht', (0.35, 0.5, 0.85, 1.0))
