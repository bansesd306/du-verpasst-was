# Hochskalieren aller Spielbilder mit 4x-UltraSharp (ncnn, CPU). Ergebnis in /home/claude/game/hq_img/CODE.webp (gleiche Größe wie dist/img).
import ncnn, numpy as np, json, os, sys, time
from PIL import Image, ImageFilter
os.chdir('/home/claude/game')
K=json.load(open('/home/claude/tools/upscale_karte.json')); OV=json.load(open('proc/overlays.json'))
OUT='hq_img'; os.makedirs(OUT,exist_ok=True)
net=ncnn.Net(); net.opt.use_vulkan_compute=False; net.opt.num_threads=2
net.load_param('/tmp/esr/models/ultrasharp-4x.param'); net.load_model('/tmp/esr/models/ultrasharp-4x.bin')
def x4(img,T=200,P=12):
    a=np.asarray(img.convert('RGB'),dtype=np.float32)/255.; H,W,_=a.shape; out=np.zeros((H*4,W*4,3),np.float32)
    for y in range(0,H,T):
        for x in range(0,W,T):
            y0,x0=max(0,y-P),max(0,x-P); y1,x1=min(H,y+T+P),min(W,x+T+P)
            ex=net.create_extractor(); ex.input('data',ncnn.Mat(np.ascontiguousarray(a[y0:y1,x0:x1].transpose(2,0,1))))
            _,o=ex.extract('output'); o=np.array(o).transpose(1,2,0)
            oy,ox=(y-y0)*4,(x-x0)*4; h=min(T,H-y)*4; w=min(T,W-x)*4
            out[y*4:y*4+h,x*4:x*4+w]=o[oy:oy+h,ox:ox+w]
    return Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8))
def farbe_angleichen(u,d):
    # Farbe/Grading der Spielfassung übernehmen, Schärfe vom Upscale behalten
    ua=np.asarray(u,dtype=np.float32); da=np.asarray(d.convert('RGB'),dtype=np.float32)
    bu=np.asarray(u.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32); bd=np.asarray(d.convert('RGB').filter(ImageFilter.GaussianBlur(6)),dtype=np.float32)
    return Image.fromarray(np.clip(ua+bd-bu,0,255).astype(np.uint8))
PRIO=['B15','N11','N12','B14','HB1','BR','B05','N09','N04','N1','SO','T','N08','K12','L4','N03','N36','N13','N13L','N14','N14b','N14g','N14r','N14z','N15','N19','N20','N21','N17','N18','A1','N33','SP1','FL1','FL2','FL3','N25','B12','B12A','B12B','B12L','B12T','N35b','N35c','N35f','N35w']
reihe=[c for c in PRIO if c in K]+[c for c in K if c not in PRIO]
t00=time.time()
for i,c in enumerate(reihe):
    ziel=f'{OUT}/{c}.webp'
    if os.path.exists(ziel): continue
    t0=time.time(); d=Image.open(f'dist/img/{c}.webp'); W,H=d.size
    q=K[c]['quelle']; src=Image.open(q).convert('RGB') if q else d.convert('RGB')
    if src.size[0]>1400: src=src.resize((1376,round(1376*src.size[1]/src.size[0])),Image.LANCZOS)
    u=x4(src).resize((W,H),Image.LANCZOS)
    u=farbe_angleichen(u,d)
    u.save(ziel,quality=92,method=5)
    print(f'{i+1}/{len(reihe)} {c} {time.time()-t0:.0f}s (gesamt {(time.time()-t00)/60:.0f} min)',flush=True)
# Gesichts-Overlays (RGBA-Ausschnitte) mit hochskalieren, damit sie zur schärferen Basis passen
for c in OV:
    ziel=f'{OUT}/{c}.webp'
    if os.path.exists(ziel) or not os.path.exists(f'dist/img/{c}.webp'): continue
    d=Image.open(f'dist/img/{c}.webp').convert('RGBA'); W,H=d.size
    u=x4(d.convert('RGB')).resize((W,H),Image.LANCZOS); u=farbe_angleichen(u,d.convert('RGB')); u.putalpha(d.getchannel('A'))
    u.save(ziel,quality=92,method=5); print('Overlay',c,flush=True)
print('FERTIG',flush=True)
