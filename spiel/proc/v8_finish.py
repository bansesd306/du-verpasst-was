# V8: fertige Spielbilder (dist/img/CODE.webp) aus v8_hq (falls schon hochskaliert) bzw. v8_src (Lanczos) + Gesichts-Overlays
import cv2, numpy as np, json, os, re, sys
sys.path.insert(0,'/home/claude/game/proc')
from varianten import maske, speichere_overlay
G='/home/claude/game/'; SRC=G+'bilder_neu/v8_src/'; HQ=G+'bilder_neu/v8_hq/'; O=G+'dist/img/'
def lade(code):
    if os.path.exists(HQ+code+'.png'): return cv2.imread(HQ+code+'.png'), True
    im=cv2.imread(SRC+code+'.png'); h,w=im.shape[:2]
    if w>h: im=cv2.resize(im,(1920,round(1920*h/w)),interpolation=cv2.INTER_LANCZOS4)
    return im, False
def webp(code, im, q=86):
    from PIL import Image
    Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)).save(O+code+'.webp','WEBP',quality=q,method=6)
BASEN=['N02','K10H','N09','N31a','N31b','N31c','N31d','N34','N34b','N36Z','N25','N25L','N25B','N25V','N27',
       'N38a','N38b','N38c','N38n','N38','LD1','N37','TV1','TV2','TVn','H36a','H36b']
stat={}
for c in BASEN:
    im,hq=lade(c); webp(c,im); stat[c]='HQ' if hq else 'lanczos'
# N26 (Lynn hinten weich) immer aus der scharfen Fassung N26s ableiten, damit beide gleich scharf/groß sind
im,hq=lade('N26s'); h,w=im.shape[:2]; im=im.astype(np.float32)
lb=np.zeros((h,w),np.float32); lb[int(h*.38):int(h*.62),int(w*.475):int(w*.555)]=1; lb=cv2.GaussianBlur(lb,(0,0),8*w/1318)[...,None]
weich=cv2.GaussianBlur(im,(0,0),1.3*w/1318)
webp('N26',np.clip(im*(1-lb)+weich*lb,0,255).astype(np.uint8)); webp('N26s',im.astype(np.uint8)); stat['N26']=stat['N26s']='HQ' if hq else 'lanczos'
# Handy-Story hochkant: Originalgröße
from PIL import Image
Image.open(SRC+'N29.png').convert('RGB').save(O+'N29.webp','WEBP',quality=88,method=6)
# Overlays (Varianten auf demselben Grundbild)
JOBS=[('LD1','LDz',None),('LD1','LDs',None),('LD1','LD2',None),('LD1','LD3',None),('LD1','LD4',None),('LD1','LDw',None),('LD1','LDa',None),('LD1','LDh',None),
      ('N37','N37z',None),('N37','N37s',None),('N37','N37b',None),
      ('N38b','N38bz',(.12,.08,.38,.5)),('N38b','N38bl',(.12,.06,.40,.55)),
      ('TV1','TV3',(.3,.05,.75,.5))]
ov=json.load(open(G+'proc/overlays.json'))
for basis, var, box in JOBS:
    b,bh=lade(basis); v,vh=lade(var)
    if bh!=vh:   # beide gleich behandeln, damit die Schärfe passt
        b2=cv2.imread(SRC+basis+'.png'); b2=cv2.resize(b2,(b.shape[1],b.shape[0]),interpolation=cv2.INTER_LANCZOS4)
        v=cv2.resize(cv2.imread(SRC+var+'.png'),(b.shape[1],b.shape[0]),interpolation=cv2.INTER_LANCZOS4); bref=b2
    else: bref=b
    if v.shape!=bref.shape: v=cv2.resize(v,(bref.shape[1],bref.shape[0]),interpolation=cv2.INTER_LANCZOS4)
    a=maske(bref,v,box=box,schwelle=20,wachsen=.008,minfrac=.00015)
    bx=speichere_overlay(v,a,O+var+'.webp')
    if bx: ov[var]={'basis':basis,'box':bx}
    print(basis,var,bx,'HQ' if (bh and vh) else 'lanczos')
json.dump(ov,open(G+'proc/overlays.json','w'))
# OVERLAYS-Zeile in bilder.js erneuern
bj=open(G+'bilder.js',encoding='utf-8').read()
bj=re.sub(r'^const OVERLAYS = \{.*\};$', 'const OVERLAYS = '+json.dumps(ov,ensure_ascii=False)+';', bj, flags=re.M)
open(G+'bilder.js','w',encoding='utf-8').write(bj)
print(stat)
