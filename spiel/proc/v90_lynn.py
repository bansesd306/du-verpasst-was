# V9.0: Lynn-Balkon-Posen N14t/N14s/N14k neu (nur Mund geändert, Gesicht gleich). Wiederholbar.
src = open('/home/claude/du-verpasst-was/spiel/proc/v88_bilder.py', encoding='utf-8').read()
exec(src[:src.index('# ---------- A1')])
for c in ['N14t', 'N14s', 'N14k']: webp(c, pil2cv(nur_himmel(cv2pil(fertig(lade(c), 1920, 1072)))))
