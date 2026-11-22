# V8.8: Bilder aus Bauliste offen-v8-8 (A, J). Wiederholbar. Kein Weichzeichner übers Bild.
# Weg wie V8.7: Upload -> Lanczos auf Zielgröße + leichtes Nachschärfen -> dist/img/CODE.webp
import cv2, numpy as np, os, json, re, sys, shutil, subprocess, io
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/game/proc')
from varianten import maske, speichere_overlay
from v87_draussen_dunkler import dunkel
R = '/home/claude/du-verpasst-was/'; U = R + 'quellen/uploads/'; G = '/home/claude/game/'; O = G + 'dist/img/'
nur = set(sys.argv[1:]); soll = lambda t: not nur or t in nur
lade = lambda n: cv2.imread(U + n + '_gemini.jpg')
def fertig(im, W=1920, H=1080, schaerfe=45):
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_LANCZOS4)
    p = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(1.2, schaerfe, 2))
    return cv2.cvtColor(np.asarray(p), cv2.COLOR_RGB2BGR)
def webp(code, im, q=86): Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(O + code + '.webp', 'WEBP', quality=q, method=6); print('ok', code, im.shape[1], im.shape[0])
src = open(G + 'proc/v85_finish.py', encoding='utf-8').read(); exec(src[src.index('def handylook'):src.index('HANDY = [')])
def handy(code, quelle=None):   # Handyfoto-Fassung *_h.webp
    im = Image.open(quelle or (O + code + '.webp')); im.thumbnail((1280, 1280)); handylook(im).save(O + code + '_h.webp', 'WEBP', quality=80, method=6); print('handy', code)
def nur_himmel(pil):   # A1: Personen nie dunkler – nur blaue Nachtflächen (Himmel/Stadt) etwas dunkler, sonst unverändert
    return dunkel(pil, himmel=0.72, gesamt=1.0)
cv2pil = lambda im: Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))
pil2cv = lambda p: cv2.cvtColor(np.asarray(p.convert('RGB')), cv2.COLOR_RGB2BGR)

# ---------- A1: Abdunkeln aus V8.7 zurücknehmen (Originale), nur Himmel ----------
ZURUECK = ['N14', 'N14r', 'N14m', 'N14h', 'N14rz', 'N14g', 'N14z', 'N14b', 'LNN', 'LNL', 'N15', 'N29', 'BALKON_LEER',
           'N36Z', 'B10', 'B14', 'B15', 'N11', 'N12', 'K12', 'L4b']
if soll('a1'):
    V = G + 'bilder_neu/v87_vordunkel/'
    for c in ZURUECK:
        im = Image.open(V + c + '.webp'); d = nur_himmel(im)
        if c == 'N29': w, h = d.size; d = d.crop((0, 0, w, int(h * .93)))
        d.save(O + c + '.webp', 'WEBP', quality=88, method=6); print('A1', c)
    handy('N12')

# ---------- A2: Personen aufhellen (Party spät, Date), Kurve pro Pixel: Mitten hoch, Schwarz bleibt ----------
def aufhellen(im, staerke=.78):
    a = im.astype(np.float32) / 255
    b = np.where(a < .04, a, .04 + (a - .04) ** staerke * (1 - .04) ** (1 - staerke))
    return np.clip(b * 255 + .5, 0, 255).astype(np.uint8)
if soll('a2'):
    V = G + 'bilder_neu/v88_vorhell/'; os.makedirs(V, exist_ok=True)
    ov = json.load(open(G + 'proc/overlays.json'))
    codes = ['N33', 'SP1', 'LD1'] + [k for k, v in ov.items() if v['basis'] == 'LD1']
    for c in codes:
        if not os.path.exists(V + c + '.webp'): shutil.copy(O + c + '.webp', V + c + '.webp')
        p = Image.open(V + c + '.webp'); alpha = p.split()[-1] if p.mode == 'RGBA' else None
        im = pil2cv(p); h = aufhellen(im, .8 if c in ('N33', 'SP1') else .84)
        q = cv2pil(h)
        if alpha: q = q.convert('RGBA'); q.putalpha(alpha)
        q.save(O + c + '.webp', 'WEBP', quality=88, method=6); print('A2', c)
    handy('N33')

# ---------- Neue Einzelbilder (J2, J3, 7b) ----------
if soll('neu'):
    for code, up in [('FEUER', 'FEUER'), ('K10P', 'K10P'), ('MO_KAFFEE', 'MO_KAFFEE_dunkel'), ('SO1d', 'SO1d'), ('TIM2', 'TIM2'),
                     ('LENA_FEGT', 'LENA_FEGT'), ('BR', 'BR'), ('A1W', 'A1W')]:
        webp(code, fertig(lade(up)))
    # N29b: nur 1000 px breit -> Lanczos + etwas mehr Nachschärfen, Himmel wie die anderen Außenbilder
    webp('N29b', pil2cv(nur_himmel(cv2pil(fertig(lade('N29b_neu'), schaerfe=60)))))
    for c in ['FEUER', 'LENA_FEGT', 'TIM2']: handy(c)
    # Lynn-Balkon: weitere Gesichter (gleiche Größe wie N14), N14e = LNU
    for c in ['N14t', 'N14s', 'N14k']: webp(c, pil2cv(nur_himmel(cv2pil(fertig(lade(c), 1920, 1072)))))
    webp('LNU', pil2cv(nur_himmel(cv2pil(fertig(lade('LNU'), 1920, 1072)))))

# ---------- Tims Feier (A5): etwas dunkler und kühler ----------
def tim_look(im):
    a = im.astype(np.float32) / 255
    a = a * np.array([1.06, .97, .90])          # BGR: blau hoch, rot runter
    l = a.mean(2, keepdims=True); a = l + (a - l) * .82   # Lila weniger knallig
    a = a * .84
    return np.clip(a * 255, 0, 255).astype(np.uint8)
if soll('tim'):
    for i in (1, 2, 3, 4):
        c = f'TIM_FEIER_{i}'; webp(c, tim_look(fertig(lade(c)))); handy(c)
    webp('TIM2', tim_look(fertig(lade('TIM2')))); handy('TIM2')

# ---------- Handyvideos / Handyfotos 9:16 (SA1–3, LAUCH, LIVE1–3), Handyvideo-Look ohne Weichzeichner ----------
if soll('handy'):
    for c in ['SA1', 'SA2', 'SA3', 'LAUCH']:
        t = '/tmp/' + c + '_hv.jpg'; subprocess.run(['python3', G + 'proc/handyvideo.py', U + c + '_gemini.jpg', t], check=True)
        im = Image.open(t); im.thumbnail((1080, 1920), Image.LANCZOS); im.save(O + c + '.webp', 'WEBP', quality=84, method=6); print('handyvideo', c)
    for c in ['LIVE1', 'LIVE2', 'LIVE3']:
        im = Image.open(U + c + '_gemini.jpg').convert('RGB'); im = im.resize((1080, 1920), Image.LANCZOS); im.save(O + c + '.webp', 'WEBP', quality=84, method=6); handy(c)
    # J1-3: sein eigenes Foto im Bad = Ausschnitt aus B09 (so hat er es beim Ankommen gesehen), hochkant
    b = Image.open(O + 'B09.webp').convert('RGB'); w, h = b.size; bw = int(h * 9 / 16); x0 = int(w * .5 - bw * .35)
    b.crop((x0, 0, x0 + bw, h)).save('/tmp/BAD_POST_roh.jpg', quality=95)
    subprocess.run(['python3', G + 'proc/handyvideo.py', '/tmp/BAD_POST_roh.jpg', '/tmp/BAD_POST.jpg'], check=True)
    Image.open('/tmp/BAD_POST.jpg').save(O + 'BAD_POST.webp', 'WEBP', quality=84, method=6); print('BAD_POST')

# ---------- Balkon-Bodenszene (7b C / 7c): Fenster-Fassungen genau auf den Bildausschnitt des Videos ----------
def auf_video(still, A):   # A: Video-Pixel -> Standbild-Pixel (aus ORB), Standbild in Videokoordinaten (1280x720) bringen
    M = cv2.invertAffineTransform(A); v = cv2.warpAffine(still, M, (1280, 720), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    return v
def schaetze(frame, still):
    o = cv2.ORB_create(5000); k1, d1 = o.detectAndCompute(cv2.cvtColor(frame, 6), None); k2, d2 = o.detectAndCompute(cv2.cvtColor(still, 6), None)
    m = sorted(cv2.BFMatcher(cv2.NORM_HAMMING, True).match(d1, d2), key=lambda x: x.distance)[:500]
    A, _ = cv2.estimateAffinePartial2D(np.float32([k1[x.queryIdx].pt for x in m]), np.float32([k2[x.trainIdx].pt for x in m])); return A
if soll('balkon'):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-i', U + 'N34v_gemini.mp4', '-frames:v', '1', '/tmp/N34v_f.png'], check=True)
    fr = cv2.imread('/tmp/N34v_f.png')
    for code, up in [('N34', 'N34_fenster'), ('N34a1', 'N34a1'), ('N34a2', 'N34a2'), ('N34b', 'N34b_fenster'), ('N34bB', 'N34b_fenster_becher')]:
        s = lade(up); webp(code, fertig(auf_video(s, schaetze(fr, s))))
    # Video: Ton aus, 2 s vor + 2 s zurück = 4-s-Schleife ohne Sprung, 1280x720
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-t', '2', '-i', U + 'N34v_gemini.mp4', '-an', '-filter_complex',
                    '[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[o]', '-map', '[o]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22',
                    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', G + 'dist/vid/N34v.mp4'], check=True); print('video N34v')

# ---------- Overlays: N19n (Lächeln, Blinzeln), LNN/LNL (Blinzeln) ----------
if soll('ov'):
    ov = json.load(open(G + 'proc/overlays.json'))
    def mach(basis_code, basis_img, var, box, schwelle=18):
        v = fertig(lade(var), basis_img.shape[1], basis_img.shape[0])
        a = maske(basis_img, v, box=box, schwelle=schwelle, wachsen=.008, minfrac=.00015)
        bx = speichere_overlay(v, a, O + var + '.webp')
        if bx: ov[var] = {'basis': basis_code, 'box': bx}
        print('overlay', var, bx)
    b = cv2.imread(O + 'N19n.webp')
    mach('N19n', b, 'N19nz', (.35, .05, .75, .55)); mach('N19n', b, 'N19nl', (.35, .05, .75, .75))
    mach('LNN', cv2.imread(O + 'LNN.webp'), 'LNz', (.3, .0, .8, .6)); mach('LNL', cv2.imread(O + 'LNL.webp'), 'LNLz', (.3, .0, .8, .6))
    json.dump(ov, open(G + 'proc/overlays.json', 'w'))
    bj = open(G + 'bilder.js', encoding='utf-8').read()
    bj = re.sub(r'^const OVERLAYS = \{.*\};$', 'const OVERLAYS = ' + json.dumps(ov, ensure_ascii=False) + ';', bj, flags=re.M)
    open(G + 'bilder.js', 'w', encoding='utf-8').write(bj)
