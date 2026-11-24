# V9.0 (Patrick 25.11.): Lynn sitzt auf dem Balkonboden (Ich-Sicht, roter Becher) – drei deckungsgleiche Gemini-Bilder
# N34L = schaut dich an, N34Lt = trinkt (lächelt hinter dem Becher), N34Ls = schaut in die Stadt. Wiederholbar.
import os
from PIL import Image, ImageFilter
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = os.path.dirname(H) + '/quellen/uploads/v89/gemini_balkon_sitzen/'
for code, datei in [('N34L', 'rot1_schaut'), ('N34Lt', 'rot2_trinkt'), ('N34Ls', 'rot3_weg')]:
    im = Image.open(Q + datei + '.jpg').convert('RGB').resize((1920, 1080), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=0))   # leicht nachschärfen wie BR
    im.save(H + '/dist/img/' + code + '.webp', quality=90); print(code)
