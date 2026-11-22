import sys, numpy as np
from PIL import Image
def dunkel(im, himmel=0.62, gesamt=0.88):
    a = np.asarray(im.convert('RGB')).astype(np.float32)/255
    r,g,b = a[...,0],a[...,1],a[...,2]
    lum = 0.3*r+0.59*g+0.11*b
    blau = np.clip((b - np.maximum(r,g)*0.9)*6, 0, 1)        # blaustichig
    dunkelgrund = np.clip((0.45-lum)/0.25, 0, 1)              # eher dunkel
    m = blau*dunkelgrund                                       # Himmel/Nachtflächen, keine Lichter, keine Haut
    f = gesamt*(1-m) + gesamt*himmel*m
    out = a*f[...,None]
    return Image.fromarray((np.clip(out,0,1)*255+0.5).astype(np.uint8))
if __name__=='__main__':
    for src,dst in zip(sys.argv[1::2],sys.argv[2::2]): dunkel(Image.open(src)).save(dst,quality=90)
