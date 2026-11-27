import numpy as np, cv2, sys, subprocess, math, json
from PIL import Image
k=sys.argv[1]; sek=12; fps=25; W,H=1280,720
pil=Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB')
im0=np.array(pil).astype(np.float32); s=W/im0.shape[1]
R,G,B=im0[...,0],im0[...,1],im0[...,2]; lum=.3*R+.59*G+.11*B
kern=((lum>200)&(R>B+50)&(G>B+20)).astype(np.uint8)
n,lab,st,cen=cv2.connectedComponentsWithStats(kern)
birnen=[(cen[i][0]*s,cen[i][1]*s,math.sqrt(st[i,4])*s) for i in range(1,n) if 3<=st[i,4]<=1500 and st[i,2]<60 and st[i,3]<60]
json.dump([[round(x/W,4),round(y/H,4),round(r/W,4)] for x,y,r in birnen],open(f'{k}_birnen.json','w'))
img=np.array(pil.resize((W,H),Image.LANCZOS)).astype(np.float32)
rng=np.random.default_rng(2)
# Ereignisse: zufällige Birne leuchtet auf (0,3 s hoch, 0,9 s runter); manchmal zwei Nachbarn
ev=[]; t=0.3
while t<sek:
    b=rng.integers(len(birnen)); ev.append((t,b,rng.uniform(.6,1.0))); t+=rng.uniform(.35,1.2)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
farbe=np.array([255,214,150],np.float32)/255
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',f'auf_{k}.mp4'],stdin=subprocess.PIPE)
for i in range(sek*fps):
    t=i/fps; lichtm=np.zeros((H,W),np.float32)
    for (t0,b,st_) in ev:
        d=t-t0
        if d<0 or d>1.3: continue
        a=(d/.3) if d<.3 else max(0,1-(d-.3)/1.0); a=a*a*(3-2*a)*st_
        x,y,r=birnen[b]; x0,x1=int(max(0,x-60)),int(min(W,x+60)); y0,y1=int(max(0,y-60)),int(min(H,y+60))
        dd=((xx[y0:y1,x0:x1]-x)**2+(yy[y0:y1,x0:x1]-y)**2)
        lichtm[y0:y1,x0:x1]+=a*(np.exp(-dd/(2*(r*.9)**2))*.8+np.exp(-dd/(2*(r*3.2)**2))*.35)
    o=img+(255-img)*np.clip(lichtm,0,1)[...,None]*farbe
    p.stdin.write(o.clip(0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait(); print(k,len(birnen),len(ev))
