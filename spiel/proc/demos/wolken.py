import numpy as np, cv2, sys, subprocess
from PIL import Image
def fbm(h,w,seed,oct=5,p=.5):
    rng=np.random.default_rng(seed); out=np.zeros((h,w),np.float32); a=1.0
    for o in range(oct):
        sig=110/(2**o); n=rng.standard_normal((h,w)).astype(np.float32)
        fy=np.fft.fftfreq(h)[:,None]; fx=np.fft.fftfreq(w)[None,:]; sx,sy=sig*1.9,sig*.8
        g=np.real(np.fft.ifft2(np.fft.fft2(n)*np.exp(-2*np.pi**2*((fx*sx)**2+(fy*sy)**2)))).astype(np.float32); g/=g.std()
        out+=a*g; a*=p
    return (out-out.mean())/out.std()
W,H=1280,720
def schicht(seed,dichte,weich):
    n=fbm(H,W*2,seed)
    d=np.clip((n-dichte)/weich,0,1); return d**1.4
k=sys.argv[1]; horiz=float(sys.argv[2])  # Horizont (Anteil Bildhöhe), Wolken laufen davor aus
bild=np.array(Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)
m=np.array(Image.open(f'm_{k}.png').resize((W,H))).astype(np.float32)/255
y=np.linspace(0,1,H)[:,None]; ramp=np.clip((horiz-y)/(horiz*.45),0,1)**1.2
m=m*ramp
L1=schicht(7,.35,1.3); L2=schicht(11,.6,1.0)
# Farbe: Nachtwolken, unten etwas vom Stadtlicht angewärmt
oben=np.array([62,66,86],np.float32); unten=np.array([92,78,82],np.float32)
t=np.clip(y/horiz,0,1)[...,None]; farbe=oben*(1-t)+unten*t
fps=25; sek=float(sys.argv[3]) if len(sys.argv)>3 else 10; sp1,sp2=9,15  # px/s (bei 1280 Breite)
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',f'w_{k}.mp4'],stdin=subprocess.PIPE)
for i in range(int(sek*fps)):
    s1=i/fps*sp1; s2=i/fps*sp2
    def roll(L,s):
        x=s%(W*2); i0=int(x); f=x-i0; a=np.roll(L,-i0,1)[:,:W]; b=np.roll(L,-i0-1,1)[:,:W]; return a*(1-f)+b*f
    a=np.clip(roll(L1,s1)*.42+roll(L2,s2)*.30,0,.62)*m
    # Sterne/Bokeh scheinen schwach durch: Wolke deckt, aber hellt nur bis zur Wolkenfarbe auf
    out=bild*(1-a[...,None])+np.maximum(farbe,bild*.6)*a[...,None]
    p.stdin.write(out.clip(0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
