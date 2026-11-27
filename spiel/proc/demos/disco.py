import numpy as np, cv2, sys, subprocess, math, colorsys
from PIL import Image
k=sys.argv[1]; sek=float(sys.argv[2]); out=sys.argv[3]
W,H=1280,720; fps=25
img=np.array(Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)/255
rng=np.random.default_rng(3)
# Discokugel-Punkte: Kugel außerhalb des Bildes oben; Punkte auf einer Kugelfläche, drehen sich gemeinsam
N=140; th=rng.uniform(0,2*np.pi,N); ph=rng.uniform(.25,1.35,N); gr=rng.uniform(.6,1.0,N)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
# Albedo-Näherung: Licht wirkt stärker auf hellen Flächen, gar nicht auf Schwarz
alb=np.clip(img*1.4+.03,0,1)
# Farbwechsel: Liedteile, weiche Übergänge (nicht zufällig flackern)
FARBEN=[(330,.75),(275,.7),(215,.65),(300,.7),(20,.55)]
def farbe(t):
    teil=8.0; i=int(t//teil); f=(t%teil)/teil; f=0 if f<.8 else (f-.8)/.2; f=f*f*(3-2*f)
    a=FARBEN[i%len(FARBEN)]; b=FARBEN[(i+1)%len(FARBEN)]
    h=(a[0]+((b[0]-a[0]+180)%360-180)*f)%360; s=a[1]+(b[1]-a[1])*f
    return np.array(colorsys.hsv_to_rgb(h/360,s,1),np.float32)
hsv=cv2.cvtColor((img*255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32)/255
lampe=((hsv[...,2]>.75)&(hsv[...,1]>.35)).astype(np.float32); lampe[int(H*.4):]=0
lampe=cv2.GaussianBlur(cv2.dilate(lampe,np.ones((5,5),np.uint8)),(0,0),4)[...,None]
lum=(img@np.array([.3,.59,.11],np.float32))[...,None]
fig=None
try: fig=np.array(Image.open(f'p_{k}.png').resize((W,H))).astype(np.float32)/255
except: pass
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',out],stdin=subprocess.PIPE)
klein=(W//2,H//2)
for i in range(int(sek*fps)):
    t=i/fps; c=farbe(t)
    # 1) Farbstimmung: Licht von oben aus Richtung der Spots, wechselt mit dem Liedteil
    wasch=np.exp(-((yy/H)**2)/0.5)[...,None]*(.10+.03*math.sin(t*2*math.pi/1.9))*c
    # 2) Punkte der Kugel (rot. 0.12 rad/s), weich, elliptisch verzerrt nach Bildhöhe
    dots=np.zeros((H//2,W//2),np.float32)
    w=th+t*.12
    x=(np.sin(w)*np.sin(ph))
    vis=np.cos(w)>-.2
    X=(W*.5+x*W*.75)/2; Y=(H*.1+ph/1.35*H*.95)/2
    for j in np.nonzero(vis)[0]:
        r=1.6+1.6*ph[j]; cv2.circle(dots,(int(X[j]*4),int(Y[j]*4)),int(r*4),float(gr[j]),-1,cv2.LINE_AA,2)
    dots=cv2.GaussianBlur(dots,(0,0),1.1); dots=cv2.resize(dots,(W,H))[...,None]
    if fig is not None and i==0: lampe*=(1-np.clip(cv2.dilate(fig,np.ones((25,25),np.uint8)),0,1))[...,None]
    if fig is not None: dots=dots*(1-.45*fig[...,None])
    licht=wasch+dots*.55*(c*.5+.5)
    basis=img*(1-lampe*.85)+np.clip(lum*1.15*(c*.75+.25)+.05,0,1)*lampe*.85
    o=basis+alb*licht
    p.stdin.write((o.clip(0,1)*255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
