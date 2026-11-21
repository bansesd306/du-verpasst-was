# V8: neue Quellbilder mit 4x-UltraSharp hochskalieren -> bilder_neu/v8_hq/CODE.png (1920 breit, Farben wie Lanczos-Fassung)
import ncnn, numpy as np, os, sys, time
from PIL import Image, ImageFilter
S='/home/claude/game/bilder_neu/v8_src/'; O='/home/claude/game/bilder_neu/v8_hq/'; os.makedirs(O,exist_ok=True)
net=ncnn.Net(); net.opt.use_vulkan_compute=False; net.opt.num_threads=2; net.opt.lightmode=True; net.opt.use_packing_layout=True
net.load_param('/tmp/esr/models/ultrasharp-4x.param'); net.load_model('/tmp/esr/models/ultrasharp-4x.bin')
def x4(img,T=160,P=12):
    a=np.asarray(img.convert('RGB'),dtype=np.float32)/255.; H,W,_=a.shape; out=np.zeros((H*4,W*4,3),np.float32)
    for y in range(0,H,T):
        for x in range(0,W,T):
            y0,x0=max(0,y-P),max(0,x-P); y1,x1=min(H,y+T+P),min(W,x+T+P)
            tile=np.ascontiguousarray(a[y0:y1,x0:x1].transpose(2,0,1)); m=ncnn.Mat(tile)
            ex=net.create_extractor(); ex.input('data',m); _,o=ex.extract('output'); o=np.array(o).transpose(1,2,0)
            oy,ox=(y-y0)*4,(x-x0)*4; h=min(T,H-y)*4; w=min(T,W-x)*4
            out[y*4:y*4+h,x*4:x*4+w]=o[oy:oy+h,ox:ox+w]
    return Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8))
def angleichen(u,d):
    ua=np.asarray(u,dtype=np.float32); da=np.asarray(d,dtype=np.float32)
    bu=np.asarray(u.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32); bd=np.asarray(d.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32)
    return Image.fromarray(np.clip(ua+bd-bu,0,255).astype(np.uint8))
reihe=sys.argv[1:]
t00=time.time()
for i,c in enumerate(reihe):
    ziel=O+c+'.png'
    if os.path.exists(ziel): continue
    t0=time.time(); src=Image.open(S+c+'.png').convert('RGB'); w,h=src.size
    W=1920; H=round(W*h/w)
    lan=src.resize((W,H),Image.LANCZOS)
    inp=src if w<=1000 else src.resize((960,round(960*h/w)),Image.LANCZOS)
    u=x4(inp).resize((W,H),Image.LANCZOS)
    angleichen(u,lan).save(ziel)
    print(f'{i+1}/{len(reihe)} {c} {time.time()-t0:.0f}s gesamt {(time.time()-t00)/60:.1f} min',flush=True)
print('FERTIG',flush=True)
