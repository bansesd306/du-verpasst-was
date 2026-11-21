# Abdunkeln außer um einen Fokuspunkt (kein Weichzeichner): fokuslicht.py EIN AUS FX FY [STAERKE]
import sys, numpy as np
from PIL import Image
src, out, fx, fy = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
st = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255
h,w,_ = im.shape
y,x = np.mgrid[0:h,0:w]
r = np.sqrt(((x-fx*w)/(0.32*w))**2+((y-fy*h)/(0.55*h))**2)
maske = np.clip(1-r,0,1)**1.5            # 1 im Fokus, 0 außen
dunkel = 0.42 + 0.58*maske               # außen ~42 % Helligkeit
l = im.mean(2,keepdims=True)
# Schatten lila, Lichter warm (Party)
im = im**1.15
im = im + (np.array([.04,.015,-.03])*l) + (np.array([.015,-.01,.04])*(1-l))*0.6
im = im*(1-st+st*dunkel[...,None])
rng=np.random.default_rng(2); im = im + rng.normal(0,.018,(h,w,1))
Image.fromarray((np.clip(im,0,1)*255).astype(np.uint8)).save(out, quality=80)
