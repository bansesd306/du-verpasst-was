import numpy as np, cv2, sys
from PIL import Image
k=sys.argv[1]; src=f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp'
im=np.array(Image.open(src).convert('RGB')).astype(np.float32)
R,G,B=im[...,0],im[...,1],im[...,2]; lum=.3*R+.59*G+.11*B
kern=((lum>200)&(R>B+50)&(G>B+20)).astype(np.uint8)
n,lab,st,cen=cv2.connectedComponentsWithStats(kern)
H,W=lum.shape
ok=[i for i in range(1,n) if 3<=st[i,4]<=1500 and st[i,2]<60 and st[i,3]<60]
print(k,len(ok))
# drei Gruppen zufällig
rng=np.random.default_rng(5); gr=rng.integers(0,3,len(ok))
for g in range(3):
    m=np.zeros((H,W),np.float32)
    for i,c in zip(ok,gr):
        if c!=g: continue
        m[lab==i]=1
    kernm=cv2.GaussianBlur(cv2.dilate(m,np.ones((3,3))),(0,0),1.5)
    halo=cv2.GaussianBlur(m,(0,0),9); halo=halo/max(halo.max(),1e-6)
    a=np.clip(kernm*.9+halo*.55,0,1)
    farbe=np.zeros((H,W,4),np.uint8); farbe[...,0]=255; farbe[...,1]=214; farbe[...,2]=150; farbe[...,3]=(a*255).astype(np.uint8)
    Image.fromarray(farbe,'RGBA').save(f'{k}_lk{g}.webp',lossless=False,quality=85)
vis=im.copy(); vis[kern>0]=[0,255,0]
Image.fromarray(vis.astype(np.uint8)).resize((960,540)).save(f'vis_{k}.jpg')
