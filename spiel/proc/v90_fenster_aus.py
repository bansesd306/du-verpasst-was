# 25.11. (Patrick): Fenster gegenüber gehen einzeln aus – mit dem Gemini-Bild K12_aus (deckungsgleich mit K12).
# Pro Fenstergruppe eine Ebene (volles Bild, sonst durchsichtig) mit den Pixeln aus K12_aus, dort wo K12 heller ist (Licht + Schein).
# Aufruf: python3 proc/v90_fenster_aus.py → dist/img/K12_fa.webp … K12_ff.webp (ersetzt proc/v89_fenster.py)
import cv2, numpy as np
from PIL import Image
im = np.array(Image.open('dist/img/K12.webp').convert('RGB')).astype(np.float32)
H, W = im.shape[:2]
au = np.array(Image.open('../quellen/uploads/v89/fenster/K12_aus.jpg').convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
d = (im - au).mean(-1)
# Reihenfolge des Ausgehens; Kästen (x0,y0,x1,y1) im Bild 1920×1072
GRUPPEN = {'fa': [(1290, 230, 1335, 315), (1235, 250, 1280, 325), (1205, 360, 1255, 415), (1290, 345, 1345, 435)],
           'fb': [(1455, 470, 1530, 570), (1545, 470, 1600, 565)],
           'fc': [(1360, 215, 1422, 310)],
           'fd': [(1530, 330, 1612, 445)],
           'fe': [(1352, 335, 1432, 440), (1468, 338, 1532, 442)],
           'ff': [(1455, 205, 1545, 318)]}
for k, kaesten in GRUPPEN.items():
    box = np.zeros((H, W), np.float32)
    for x0, y0, x1, y1 in kaesten: box[y0:y1, x0:x1] = 1
    box = cv2.GaussianBlur(box, (0, 0), 3)
    a = np.clip((d - 2) / 16, 0, 1) * box
    a = cv2.GaussianBlur(a, (0, 0), .8)
    out = np.zeros((H, W, 4), np.uint8); out[..., :3] = au.clip(0, 255).astype(np.uint8); out[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(f'dist/img/K12_{k}.webp', quality=90, method=6)
    print(k, round(float(a.sum())))
