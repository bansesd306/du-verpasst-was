# V8.5: gespeicherte Gemini-Bilder (quellen/uploads/*_gemini.jpg) -> bilder_neu/v8_src/CODE.png
# N06: Hinweis „✦ KI-generierter Inhalt“ unten links wird übermalt (Inpainting, nur in dem kleinen Feld).
import cv2, numpy as np, os
R = '/home/claude/du-verpasst-was/'; U = R + 'quellen/uploads/'; S = '/home/claude/game/bilder_neu/v8_src/'
os.makedirs(S, exist_ok=True)
KARTE = {  # Spielcode: Upload
    'N02D': 'N02D', 'N1L': 'N1L', 'N38a': 'N38a_neu', 'L7': 'L7', 'N06': 'N06', 'MO_KAFFEE': 'MO_KAFFEE', 'N07': 'N07',
    'N14m': 'N14m', 'N14h': 'N14h', 'N14rz': 'N14rz', 'BALKON_LEER': 'BALKON_LEER', 'N30': 'N30', 'TORTE': 'TORTE',
    'N16': 'N16', 'N26s': 'N26neu', 'AO4': 'AO4', 'N32e': 'N32e', 'N32c': 'N32c_v3', 'MIA_SELFIE': 'MIA_SELFIE_a',
    'BALKON_GRUPPE': 'BALKON_GRUPPE',
}
for code, up in KARTE.items():
    im = cv2.imread(U + up + '_gemini.jpg')
    if code == 'N06':
        h, w = im.shape[:2]
        # Text sitzt etwa bei x 0–300, y h-45 … h-8 (1344×756): helle Schrift auf grauer Wand
        feld = im[h - 50:h - 4, 0:320]
        grau = cv2.cvtColor(feld, cv2.COLOR_BGR2GRAY).astype(np.int16)
        hint = cv2.medianBlur(grau.astype(np.uint8), 21).astype(np.int16)
        m = ((grau - hint) > 10).astype(np.uint8) * 255
        m = cv2.dilate(m, np.ones((5, 5), np.uint8), iterations=2)
        maske = np.zeros((h, w), np.uint8); maske[h - 50:h - 4, 0:320] = m
        im = cv2.inpaint(im, maske, 9, cv2.INPAINT_TELEA)
    cv2.imwrite(S + code + '.png', im)
    print(code, im.shape[1], 'x', im.shape[0])
