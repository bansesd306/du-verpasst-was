import cv2, numpy as np, sys
sys.path.insert(0,'/home/claude/game/proc')
from fotos import cutout, setze, speichere, B, O
V=B+'bilder_neu/varianten/'
liste=['01_arme_hoch','02_drehen','03_zeigt','05_headbang','06_mikro','08_schubst','09_lacht','10_hand_hin','11_tanzt_seitlich']
for i,n in enumerate(liste):
    im=cv2.resize(cv2.imread(V+'mia_montage_'+n+'.jpg'),(1920,1080),interpolation=cv2.INTER_LANCZOS4)
    speichere(im,'MM%02d'%(i+1))
bg=cv2.resize(cv2.imread(O+'N35w.webp'),(1920,1080))
for code,n,cx in [('MK1','02_drehen',520),('MK2','09_lacht',560),('MK3','06_mikro',600)]:
    src=cv2.resize(cv2.imread(V+'mia_montage_'+n+'.jpg'),(1920,1080))
    c=cutout(src); ys=np.where(c[...,3]>20)[0]; hoehe=(ys.max()-ys.min())
    speichere(setze(bg,c,cx=cx,unten=ys.max(),hoehe=hoehe,flip=True),code)
print('montage ok')
