import sys, numpy as np, io
from PIL import Image
src,out=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGB')
# leicht schief (Handy in der Hand), etwas reingezoomt damit keine Ränder
im=im.rotate(-2.2,resample=Image.BICUBIC,expand=False); w,h=im.size
im=im.crop((int(w*.04),int(h*.03),int(w*.96),int(h*.97))).resize((w,h),Image.LANCZOS)
a=np.asarray(im).astype(np.float32)/255
l=a.mean(2,keepdims=True)
# Handy-Nachtmodus: Schatten absaufen, Lichter überstrahlen (Clipping, kein Weichzeichner)
a=np.clip((a-.03)*1.12,0,1)**1.18
a=np.where(a>.78,.78+(a-.78)*1.9,a)
# Fokus Mitte-oben (Mia), Rand/Leute dunkler
y,x=np.mgrid[0:h,0:w]; r=np.sqrt(((x-w*.5)/(w*.55))**2+((y-h*.38)/(h*.6))**2)
a=a*np.clip(1-.55*np.clip(r-.45,0,None)**1.3,.35,1)[...,None]
# Farbe: Handy-Weißabgleich, leicht magenta/kühl
a=a*np.array([1.03,.95,1.06])
# Sensorrauschen: Helligkeit + Farbrauschen, stärker in den Schatten
rng=np.random.default_rng(3); s=(.5+.9*(1-a.mean(2,keepdims=True)))
a=a+rng.normal(0,.03,(h,w,1))*s+rng.normal(0,.018,(h,w,3))*s
img=Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
# JPEG-Kompression wie bei WhatsApp/Insta (zweimal)
for q in (60,55):
  b=io.BytesIO(); img.save(b,'JPEG',quality=q); img=Image.open(io.BytesIO(b.getvalue())).convert('RGB')
img.save(out,quality=92)
