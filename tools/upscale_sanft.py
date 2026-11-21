# V8.5: Gemini-Bilder sanft hochskalieren (Philip: nicht 4x-UltraSharp auf Gesichter)
# Modell „high-fidelity-4x“ (upscayl), Ergebnis nur zur Hälfte über die Lanczos-Fassung gelegt,
# Farben/grobe Helligkeit wie Lanczos. Quelle bilder_neu/v8_src/CODE.png -> bilder_neu/v8_hq/CODE.png
# Aufruf: python3 upscale_sanft.py [--anteil 0.5] [--breite 1920] [--hoehe 1080] CODE …
import ncnn, numpy as np, os, sys, time
from PIL import Image, ImageFilter
S = '/home/claude/game/bilder_neu/v8_src/'; O = '/home/claude/game/bilder_neu/v8_hq/'; os.makedirs(O, exist_ok=True)
args = sys.argv[1:]; ANTEIL = .5; W = 1920; H = None
while args and args[0].startswith('--'):
    k, v = args[0], args[1]; args = args[2:]
    if k == '--anteil': ANTEIL = float(v)
    elif k == '--breite': W = int(v)
    elif k == '--hoehe': H = int(v)
net = ncnn.Net(); net.opt.use_vulkan_compute = False; net.opt.num_threads = 2; net.opt.lightmode = True
net.load_param('/tmp/esr/models/high-fidelity-4x.param'); net.load_model('/tmp/esr/models/high-fidelity-4x.bin')
def x4(img, T=128, P=12):
    a = np.asarray(img.convert('RGB'), dtype=np.float32) / 255.; Hh, Ww, _ = a.shape; out = np.zeros((Hh * 4, Ww * 4, 3), np.float32)
    for y in range(0, Hh, T):
        for x in range(0, Ww, T):
            y0, x0 = max(0, y - P), max(0, x - P); y1, x1 = min(Hh, y + T + P), min(Ww, x + T + P)
            m = ncnn.Mat(np.ascontiguousarray(a[y0:y1, x0:x1].transpose(2, 0, 1)))
            ex = net.create_extractor(); ex.input('data', m); _, o = ex.extract('output'); o = np.array(o).transpose(1, 2, 0)
            oy, ox = (y - y0) * 4, (x - x0) * 4; h = min(T, Hh - y) * 4; w = min(T, Ww - x) * 4
            out[y * 4:y * 4 + h, x * 4:x * 4 + w] = o[oy:oy + h, ox:ox + w]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8))
def angleichen(u, d):
    ua = np.asarray(u, dtype=np.float32); da = np.asarray(d, dtype=np.float32)
    bu = np.asarray(u.filter(ImageFilter.GaussianBlur(6)), dtype=np.float32); bd = np.asarray(d.filter(ImageFilter.GaussianBlur(6)), dtype=np.float32)
    return np.clip(ua + bd - bu, 0, 255)
t00 = time.time()
for i, c in enumerate(args):
    ziel = O + c + '.png'
    if os.path.exists(ziel): continue
    t0 = time.time(); src = Image.open(S + c + '.png').convert('RGB'); w, h = src.size
    hh = H or round(W * h / w)
    lan = src.resize((W, hh), Image.LANCZOS)
    inp = src if w <= 700 else src.resize((672, round(672 * h / w)), Image.LANCZOS)
    u = x4(inp).resize((W, hh), Image.LANCZOS)
    m = angleichen(u, lan); l = np.asarray(lan, dtype=np.float32)
    Image.fromarray(np.clip(l + ANTEIL * (m - l), 0, 255).astype(np.uint8)).save(ziel)
    print(f'{i+1}/{len(args)} {c} {time.time()-t0:.0f}s gesamt {(time.time()-t00)/60:.1f} min', flush=True)
print('FERTIG', flush=True)
