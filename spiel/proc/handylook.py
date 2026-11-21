import sys, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255
h,w,_ = im.shape
# dunkler + Kontrast in den Schatten
im = im**1.25*0.82
# warmer Stich in den Lichtern, kühle Schatten
l = im.mean(2,keepdims=True)
im = im + (np.array([.05,.02,-.04])*l) + (np.array([-.01,0,.025])*(1-l))*0.5
# Vignette
y,x = np.mgrid[0:h,0:w]; r = np.sqrt(((x-w/2)/(w/2))**2+((y-h*0.45)/(h/2))**2)
im = im*np.clip(1-0.38*np.clip(r-0.35,0,None)**1.4,0,1)[...,None]
# Körnung (Helligkeit)
rng=np.random.default_rng(1); im = im + rng.normal(0,.022,(h,w,1))*(0.6+0.4*(1-l))
img = Image.fromarray((np.clip(im,0,1)*255).astype(np.uint8))
img.save(out, quality=72)
