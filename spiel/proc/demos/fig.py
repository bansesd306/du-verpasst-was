import numpy as np, cv2, sys, subprocess, math
from PIL import Image
sys.path.insert(0,'../wolken')
k=sys.argv[1]; horiz=float(sys.argv[2]); sek=float(sys.argv[3]); mitWolken=sys.argv[4]=='1'
W,H=1280,720
bild=np.array(Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB').resize((W,H),Image.LANCZOS))
pm=np.array(Image.open(f'p_{k}.png').resize((W,H))).astype(np.float32)/255
# Hintergrund hinter der Figur auffüllen
hart=(pm>.15).astype(np.uint8); hart=cv2.dilate(hart,np.ones((15,15),np.uint8))
bg=cv2.inpaint(bild,hart*255,9,cv2.INPAINT_TELEA).astype(np.float32)
fg=bild.astype(np.float32); a=pm[...,None]
# Wolken
if mitWolken:
    exec(open('../wolken/wolken.py').read().split("k=sys.argv[1]")[0].split("import numpy")[1].split("\n",1)[1])
    m=np.array(Image.open(f'../wolken/m_{k}.png').resize((W,H))).astype(np.float32)/255
    y=np.linspace(0,1,H)[:,None]; m*=np.clip((horiz-y)/(horiz*.45),0,1)**1.2
    L1=schicht(7,.35,1.3); L2=schicht(11,.6,1.0)
    t=np.clip(y/horiz,0,1)[...,None]; farbe=np.array([62,66,86],np.float32)*(1-t)+np.array([92,78,82],np.float32)*t
def roll(L,s):
    x=s%(W*2); i0=int(x); f=x-i0; return np.roll(L,-i0,1)[:,:W]*(1-f)+np.roll(L,-i0-1,1)[:,:W]*f
ys,xs=np.nonzero(pm>.5); cx=xs.mean(); fuss=ys.max()
fps=25
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',f'f_{k}.mp4'],stdin=subprocess.PIPE)
for i in range(int(sek*fps)):
    t=i/fps
    # Kamera: Hintergrund wandert minimal (Tiefe), Figur etwas mehr → Parallaxe
    bx=2.2*math.sin(t*2*math.pi/11); by=.8*math.sin(t*2*math.pi/7.3)
    hb=bg
    if mitWolken:
        aw=np.clip(roll(L1,t*9)*.42+roll(L2,t*15)*.30,0,.62)*m
        hb=bg*(1-aw[...,None])+np.maximum(farbe,bg*.6)*aw[...,None]
    Mb=np.float32([[1.012,0,-W*.006+bx*.4],[0,1.012,-H*.006+by*.4]])
    B=cv2.warpAffine(hb,Mb,(W,H),borderMode=cv2.BORDER_REFLECT)
    # Atmen: Figur dehnt sich vom Fuß aus minimal (0,6 %), Kopf schwankt sanft
    atem=(1-math.cos(t*2*math.pi/4.4))/2
    s=1+.005*atem; sw=1.012+.0015*atem
    dx=bx*1.3+1.2*math.sin(t*2*math.pi/6.1)
    Mf=np.float32([[sw,0,cx-cx*sw+dx-W*.0],[0,1.012*s,fuss-fuss*1.012*s+by*1.2-1.5*atem]])
    F=cv2.warpAffine(fg,Mf,(W,H),borderMode=cv2.BORDER_REFLECT); A=cv2.warpAffine(pm,Mf,(W,H))[...,None]
    out=B*(1-A)+F*A
    p.stdin.write(out.clip(0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
