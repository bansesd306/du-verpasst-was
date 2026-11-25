import numpy as np, cv2, sys
from PIL import Image
k=sys.argv[1]
im=np.array(Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB')).astype(np.float32)
R,G,B=im[...,0],im[...,1],im[...,2]; lum=.3*R+.59*G+.11*B
h,w=lum.shape
blau=(B>R+12)&(lum<90)
# glatt: lokale Textur gering (Sterne/Bokeh erlaubt)
blau=cv2.morphologyEx(blau.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
# zusammenhängend von oben
n,lab=cv2.connectedComponents(blau)
top=set(np.unique(lab[:5,:]))-{0}
m=np.isin(lab,list(top)).astype(np.float32)
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
# nach unten ausblenden (Horizont: Stadtlichter bleiben frei)
m=cv2.GaussianBlur(m,(0,0),6)
Image.fromarray((m*255).astype(np.uint8)).save(f'm_{k}.png')
print(k, m.mean())
