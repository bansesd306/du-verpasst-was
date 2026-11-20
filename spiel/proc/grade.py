import cv2, numpy as np
def grade(im):
    f=im.astype(np.float32)/255
    L=f.mean(axis=2,keepdims=True)
    # Belichtung runter, Kontrast rauf (Schatten tiefer, Lichter bleiben)
    f=np.power(f,1.22)*0.95
    # Schatten kühl-nachtblau, Lichter bleiben warm/rosa
    sh=np.clip(1-L*2.2,0,1)
    f[...,0]+=sh[...,0]*0.055; f[...,1]+=sh[...,0]*0.012; f[...,2]-=sh[...,0]*0.02
    # braunen Wandstich etwas raus: Sättigung in dunklen Mitten senken
    hsv=cv2.cvtColor(np.clip(f,0,1),cv2.COLOR_BGR2HSV)
    m=np.clip((L[...,0]-0.05)/0.25,0,1)*np.clip((0.45-L[...,0])/0.2,0,1)
    hsv[...,1]*=1-0.3*m
    # helle Partylichter etwas satter
    hl=np.clip((L[...,0]-0.5)/0.3,0,1); hsv[...,1]*=1+0.15*hl
    f=cv2.cvtColor(hsv,cv2.COLOR_HSV2BGR)
    h,w=f.shape[:2]; y,x=np.ogrid[:h,:w]
    v=1-0.28*(((x-w/2)/(w/1.5))**2+((y-h/2)/(h/1.2))**2); f*=np.clip(v,0.7,1)[...,None]
    return np.clip(f*255,0,255).astype(np.uint8)
