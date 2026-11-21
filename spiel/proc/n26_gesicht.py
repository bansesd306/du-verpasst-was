# V8.2: Lynn in N26 (Handyfoto Küche) hat durch die Hochskalierung ein verzerrtes Gesicht.
# Sauberes Gesicht aus N19 (Flur, Lynn strahlt) per Augen-Ausrichtung einsetzen, Farbe angleichen,
# danach N26 (Lynn hinten weich, Fokus ziehen) wie in v8_finish.py daraus ableiten.
import cv2, numpy as np
from PIL import Image
G='/home/claude/game/'
def lade(p): return cv2.cvtColor(np.array(Image.open(p).convert('RGB')),cv2.COLOR_RGB2BGR)
def webp(code, im, q=86): Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)).save(G+'dist/img/'+code+'.webp','WEBP',quality=q,method=6)
ziel=lade(G+'bilder_neu/N26s_vor_gesicht.webp'); quelle=lade(G+'dist/img/N19.webp')
# Augenmitten (gemessen): N19 und N26s
Q=np.float32([[1115,328],[1280,338]]); Z=np.float32([[974.5,478],[998,478]])
import sys
if len(sys.argv)>4: Z=np.float32([[float(sys.argv[1]),float(sys.argv[2])],[float(sys.argv[3]),float(sys.argv[4])]])
def aehnlich(a,b):
    va=a[1]-a[0]; vb=b[1]-b[0]; s=np.linalg.norm(vb)/np.linalg.norm(va); w=np.arctan2(vb[1],vb[0])-np.arctan2(va[1],va[0])
    c,si=s*np.cos(w),s*np.sin(w); M=np.float32([[c,-si,0],[si,c,0]]); M[:,2]=b[0]-M[:,:2]@a[0]; return M,s
M,s=aehnlich(Q,Z)
h,w=ziel.shape[:2]
# in 8-facher Auflösung warpen und dann verkleinern (sauberer als direkt auf ~25 px)
F=8; MF=M*F; MF[:,2]=M[:,2]*F
gross=cv2.warpAffine(quelle,MF,(w*F,h*F),flags=cv2.INTER_AREA)
mq=np.zeros(quelle.shape[:2],np.float32)
# Gesichtsfläche in N19: von den Brauen bis zum Kinn, ohne Haare/Pony an den Seiten
cv2.ellipse(mq,(1195,420),(118,158),0,0,360,1,-1)
mg=cv2.warpAffine(mq,MF,(w*F,h*F),flags=cv2.INTER_LINEAR)
eing=cv2.resize(gross,(w,h),interpolation=cv2.INTER_AREA).astype(np.float32)
mask=cv2.resize(mg,(w,h),interpolation=cv2.INTER_AREA)
# weicher Rand nur an der Maskenkante (Montage, kein Weichzeichner übers Bild)
mask=cv2.GaussianBlur(mask,(0,0),1.6); mask=np.clip((mask-.15)/.7,0,1)
# Farbe angleichen (Lab, Mittel/Streuung der Hautfläche)
zl=cv2.cvtColor(ziel,cv2.COLOR_BGR2LAB).astype(np.float32); el=cv2.cvtColor(np.clip(eing,0,255).astype(np.uint8),cv2.COLOR_BGR2LAB).astype(np.float32)
m=mask>.6
for k in range(3):
    mz,sz=zl[...,k][m].mean(),zl[...,k][m].std(); me,se=el[...,k][m].mean(),el[...,k][m].std()
    el[...,k]=(el[...,k]-me)*(min(sz/max(se,1e-3),1.15) if k==0 else 1)+mz
eing=cv2.cvtColor(np.clip(el,0,255).astype(np.uint8),cv2.COLOR_LAB2BGR).astype(np.float32)
neu=ziel.astype(np.float32)*(1-mask[...,None])+eing*mask[...,None]
neu=np.clip(neu,0,255)
webp('N26s',neu.astype(np.uint8))
lb=np.zeros((h,w),np.float32); lb[int(h*.38):int(h*.62),int(w*.475):int(w*.555)]=1; lb=cv2.GaussianBlur(lb,(0,0),8*w/1318)[...,None]
weich=cv2.GaussianBlur(neu,(0,0),1.3*w/1318)
webp('N26',np.clip(neu*(1-lb)+weich*lb,0,255).astype(np.uint8))
Image.fromarray(cv2.cvtColor(neu.astype(np.uint8),cv2.COLOR_BGR2RGB)).crop((930,420,1050,540)).resize((480,480),Image.LANCZOS).save('/tmp/n26face_neu.png')
print('ok',s)
