import numpy as np, subprocess, math, sys
from PIL import Image
k=sys.argv[1]; sek=10; fps=25; W,H=1280,720
img=np.array(Image.open(f'/home/user/du-verpasst-was/spiel/dist/img/{k}.webp').convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)
L=[np.array(Image.open(f'{k}_lk{g}.webp').convert('RGBA').resize((W,H),Image.LANCZOS)).astype(np.float32)/255 for g in range(3)]
P=[(5.3,0),(7.1,2.1),(6.2,4.0)]
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',f'lk_{k}.mp4'],stdin=subprocess.PIPE)
for i in range(sek*fps):
    t=i/fps; o=img.copy()
    for (per,ph),l in zip(P,L):
        op=.18+.22*(.5+.5*math.sin(2*math.pi*t/per+ph))   # zwischen ~0,18 und 0,40
        a=l[...,3:]*op
        o=o+(255-o)*a*l[...,:3]   # aufhellen in Lichtfarbe (wie Screen)
    p.stdin.write(o.clip(0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
