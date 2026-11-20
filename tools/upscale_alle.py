# Hochskalieren ausgewählter Spielbilder mit 4x-UltraSharp (ncnn, CPU).
# Aufruf: python3 tools/upscale_alle.py CODE [CODE ...]   (ohne Codes: nichts tun)
# Ergebnis: spiel/hq_img/CODE.webp in exakt der Größe von spiel/dist/img/CODE.webp.
# Sicherungen: nur eindeutig passende Originale (diff < 0.6); nach dem Hochskalieren Vergleich mit der
# Spielfassung – weicht der Bildaufbau ab (falsches Original), wird automatisch die Spielfassung als Quelle genommen.
import ncnn, numpy as np, json, os, sys, time
from PIL import Image, ImageFilter
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S=os.path.join(R,'spiel'); OUT=os.path.join(S,'hq_img'); os.makedirs(OUT,exist_ok=True)
K=json.load(open(os.path.join(R,'tools','upscale_karte.json'))); OV=json.load(open(os.path.join(S,'proc','overlays.json')))
def pfad(q):
    if not q: return None
    if q.startswith('/mnt/user-data/uploads/'): q=os.path.join(R,'quellen','uploads',os.path.basename(q))
    elif not q.startswith('/'): q=os.path.join(S,q)
    return q if os.path.exists(q) else None
net=ncnn.Net(); net.opt.use_vulkan_compute=False; net.opt.num_threads=2
net.load_param('/tmp/esr/models/ultrasharp-4x.param'); net.load_model('/tmp/esr/models/ultrasharp-4x.bin')
def x4(img,T=200,P=12):
    a=np.asarray(img.convert('RGB'),dtype=np.float32)/255.; H,W,_=a.shape; out=np.zeros((H*4,W*4,3),np.float32)
    for y in range(0,H,T):
        for x in range(0,W,T):
            y0,x0=max(0,y-P),max(0,x-P); y1,x1=min(H,y+T+P),min(W,x+T+P)
            tile=np.ascontiguousarray(a[y0:y1,x0:x1].transpose(2,0,1))  # Variable halten! ncnn.Mat kopiert nicht
            ex=net.create_extractor(); m=ncnn.Mat(tile); ex.input('data',m)
            _,o=ex.extract('output'); o=np.array(o).transpose(1,2,0)
            oy,ox=(y-y0)*4,(x-x0)*4; h=min(T,H-y)*4; w=min(T,W-x)*4
            out[y*4:y*4+h,x*4:x*4+w]=o[oy:oy+h,ox:ox+w]
    return Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8))
def farbe_angleichen(u,d):
    ua=np.asarray(u,dtype=np.float32); d=d.convert('RGB')
    bu=np.asarray(u.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32); bd=np.asarray(d.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32)
    return Image.fromarray(np.clip(ua+bd-bu,0,255).astype(np.uint8))
def gleich(a,b):
    f=lambda im: np.asarray(im.convert('L').resize((192,108)),dtype=float).ravel()
    x,y=f(a),f(b); return float(np.corrcoef(x,y)[0,1])
def mach(c):
    d=Image.open(os.path.join(S,'dist','img',c+'.webp')); W,H=d.size
    q=pfad(K.get(c,{}).get('quelle')) if K.get(c,{}).get('diff',99)<0.6 else None
    for versuch in ([q] if q else [])+[None]:
        src=Image.open(versuch).convert('RGB') if versuch else d.convert('RGB')
        if src.size[0]>1400: src=src.resize((1376,round(1376*src.size[1]/src.size[0])),Image.LANCZOS)
        u=x4(src).resize((W,H),Image.LANCZOS)
        g=gleich(u,d)
        if g>0.97 or versuch is None: break
        print(f'  {c}: Original passt nicht (Ähnlichkeit {g:.3f}) – nehme Spielfassung',flush=True)
    if g<0.97:
        print(f'  {c}: FEHLER – Ergebnis weicht vom Spielbild ab ({g:.3f}), NICHT gespeichert',flush=True); return 'Fehler', g
    u=farbe_angleichen(u,d); u.save(os.path.join(OUT,c+'.webp'),quality=92,method=5)
    return ('Original' if versuch else 'Spielfassung'), g
for c in sys.argv[1:]:
    t0=time.time(); quelle,g=mach(c); print(f'{c}: fertig aus {quelle}, Ähnlichkeit {g:.3f}, {time.time()-t0:.0f}s',flush=True)
    for v in [k for k in OV if k.startswith(c) and k!=c]:
        if not os.path.exists(os.path.join(S,'dist','img',v+'.webp')): continue
        dv=Image.open(os.path.join(S,'dist','img',v+'.webp')).convert('RGBA'); Wv,Hv=dv.size
        uv=x4(dv.convert('RGB')).resize((Wv,Hv),Image.LANCZOS); uv=farbe_angleichen(uv,dv); uv.putalpha(dv.getchannel('A'))
        uv.save(os.path.join(OUT,v+'.webp'),quality=92,method=5); print(f'  Overlay {v} fertig',flush=True)
