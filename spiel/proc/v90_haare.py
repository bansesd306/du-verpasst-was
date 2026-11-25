# 25.11. (Patrick): Haar-Video über Lynns Standpose N14 – nur die Haare bewegen sich (Bewegung aus Patricks Veo-Video N14r),
# Gesicht, Pullover und Schultern bleiben exakt das Standbild. Kopfbewegung des Videos wird abgezogen (nur Haar relativ zum Kopf).
# Aufruf: python3 proc/v90_haare.py [BASIS] → dist/vid/BASIS_haar.mp4 (Ausschnitt) + Kasten für bilder.js (videoKasten)
import cv2, numpy as np, subprocess, sys, json
from PIL import Image
BASIS = sys.argv[1] if len(sys.argv) > 1 else 'N14'
VID = '../quellen/uploads/v89/veo/N14r_v_schleife.mp4'
still = np.array(Image.open(f'dist/img/{BASIS}.webp').convert('RGB')).astype(np.float32)
H, W = still.shape[:2]
# Ausschnitt um Kopf/Haare (Bildkoordinaten 1920×1072); gerade Maße für h264
X0, Y0, X1, Y1 = 1000, 0, 1600, 660
R, G, B = still[..., 0], still[..., 1], still[..., 2]; lum = .3 * R + .59 * G + .11 * B
haar = ((lum < 62) & (B - R < 22)).astype(np.uint8)
haar[:, :X0] = 0; haar[:, X1:] = 0; haar[Y1:, :] = 0
# Haut/Gesicht nie: helle, warme Pixel + Umgebung schützen
haut = ((lum > 90) & (R > B + 15)).astype(np.uint8)
haut = cv2.morphologyEx(haut, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(haar)
keep = np.zeros_like(haar)
for i in range(1, n):
    if st[i, 4] > 4000: keep[lab == i] = 1   # nur die große Haarfläche, kein dunkler Hintergrund
haar = cv2.dilate(keep, np.ones((15, 15), np.uint8)) * (1 - cv2.dilate(haut, np.ones((9, 9), np.uint8)))
m = cv2.GaussianBlur(haar.astype(np.float32), (0, 0), 6)
# unterhalb der Schultern ausblenden (Pullover bleibt Standbild)
yy = np.arange(H)[:, None].astype(np.float32); m *= np.clip((600 - yy) / 120, 0, 1)
Image.fromarray((m * 255).astype(np.uint8)).save('/tmp/haarmaske.png')
gesicht = haut.astype(bool); gesicht[:, :X0] = False; gesicht[:, X1:] = False; gesicht[Y1:] = False
# Video einlesen (1280×720) und auf Bildgröße
cap = cv2.VideoCapture(VID); fr = []
while True:
    ok, f = cap.read()
    if not ok: break
    fr.append(cv2.cvtColor(cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2GRAY))
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
sub = lambda a: np.ascontiguousarray(a[Y0:Y1, X0:X1])
ref = sub(fr[0]); gx, gy = np.meshgrid(np.arange(X1 - X0, dtype=np.float32), np.arange(Y1 - Y0, dtype=np.float32))
ms = sub(m)[..., None]; gs = sub(gesicht); st_s = sub(still)
out = f'dist/vid/{BASIS}_haar.mp4'
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{X1-X0}x{Y1-Y0}', '-r', '24', '-i', '-',
                      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
for f in fr:
    fl = dis.calc(sub(f), ref, None)          # für jedes Pixel im Bild t: wo es in Bild 0 lag
    kopf = np.median(fl[gs], axis=0) if gs.any() else np.zeros(2)
    fl = (fl - kopf) * ms                      # nur Haar, relativ zum Kopf
    o = cv2.remap(st_s, gx + fl[..., 0], gy + fl[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    p.stdin.write(o.clip(0, 255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
print(json.dumps({'videoKasten': [round(X0 / W, 5), round(Y0 / H, 5), round((X1 - X0) / W, 5), round((Y1 - Y0) / H, 5)]}), len(fr), 'Bilder')
