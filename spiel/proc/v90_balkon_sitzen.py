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
zeitraffer('N34Z3', 'zeit_3_gelaender', (0.28, 0.42, 0.86, 1.0))

def fenster(code, datei, basis_code, box):
    # V9.0: nur das Partyfenster tauschen (Party leert sich), alles andere bleibt aus dem vorigen Zeitraffer-Bild
    basis = Image.open(H + '/dist/img/' + basis_code + '.webp').convert('RGB'); neu = Image.open(Q + datei + '.jpg').convert('RGB').resize(basis.size, Image.LANCZOS)
    m = np.zeros((basis.height, basis.width), 'uint8'); x0, y0, x1, y1 = [int(v * (basis.width if i % 2 == 0 else basis.height)) for i, v in enumerate(box)]
    m[y0:y1, x0:x1] = 255
    maske = Image.fromarray(m).filter(ImageFilter.GaussianBlur(10))   # nur die Maskenkante weich
    Image.composite(neu, basis, maske).save(H + '/dist/img/' + code + '.webp', quality=90); print(code, 'fertig')

fenster('N34Z4', 'zeit_4_leer', 'N34Z3', (0.57, 0.0, 0.91, 0.66))

def arm(code, winkel, skala):
    # V9.0 (Patrick 25.11.): er hebt den Arm halb hinter ihren Rücken und traut sich nicht. Gemini schaffte die schwebende Hand nicht,
    # deshalb: Arm aus arm_versuch3 (Arm um sie) ausschneiden und um seine Schulter nach oben drehen, Rest aus N34Z3.
    import math
    from PIL import ImageDraw
    base = Image.open(H + '/dist/img/N34Z3.webp').convert('RGB'); W, Hh = base.size; k = W / 1344
    v = Image.open(Q + 'arm_versuch3.jpg').convert('RGB').resize((W, Hh), Image.LANCZOS)
    S = lambda *p: [int(x * k) for x in p]
    out = base.copy()
    m = Image.new('L', (W, Hh), 0); ImageDraw.Draw(m).rectangle(S(455, 340, 568, 600), fill=255)   # sein Körper ohne herabhängenden Arm
    out.paste(v, (0, 0), m.filter(ImageFilter.GaussianBlur(4)))
    poly = [(552,423),(580,430),(605,438),(630,436),(648,430),(655,418),(662,411),(672,413),(681,421),(682,432),(672,441),(665,446),(650,455),(630,466),(615,479),(595,483),(575,479),(552,472)]
    am = Image.new('L', (W, Hh), 0); ImageDraw.Draw(am).polygon([tuple(S(*p)) for p in poly], fill=255); am = am.filter(ImageFilter.GaussianBlur(1.5))
    px, py = S(560, 448); a = math.radians(winkel); c, s = math.cos(a) / skala, math.sin(a) / skala
    coef = (c, -s, px - c * px + s * py, s, c, py - s * px - c * py)
    out.paste(v.transform((W, Hh), Image.AFFINE, coef, resample=Image.BICUBIC), (0, 0), am.transform((W, Hh), Image.AFFINE, coef, resample=Image.BICUBIC))
    out.save(H + '/dist/img/' + code + '.webp', quality=90); print(code, 'fertig')

def arm_um(code, datei='arm_versuch3'):
    # Vorstellung beim Date: die beiden aus arm_versuch3 (Arm um sie), Rest aus N34Z3
    base = Image.open(H + '/dist/img/N34Z3.webp').convert('RGB'); W, Hh = base.size; k = W / 1344
    v = Image.open(Q + datei + '.jpg').convert('RGB').resize((W, Hh), Image.LANCZOS)
    m = Image.new('L', (W, Hh), 0); m.paste(255, tuple(int(x * k) for x in (440, 330, 720, 610)))
    Image.composite(v, base, m.filter(ImageFilter.GaussianBlur(8))).save(H + '/dist/img/' + code + '.webp', quality=90); print(code, 'fertig')

# arm('N34Z3a', 10, 1.08)   # ersetzt (Patrick 25.11.): Zögern-Bild ist jetzt arm_um_versuch4
# arm_um('N34ZA')   # ersetzt: Patrick nutzt jetzt das ganze Gemini-Bild arm_um_voll
arm_um('N34Z3a', 'arm_um_versuch4')   # Patrick 25.11.: er zieht den Arm zurück, traut sich nicht – Zögern-Bild (Zeitraffer und Rückblende beim Date)
