import cv2, numpy as np, sys
from PIL import Image
from rembg import remove, new_session
B='/home/claude/game/'; O=B+'dist/img/'
sess=new_session('isnet-general-use')
def lade(p,size=(1920,1080)): im=cv2.imread(p); return cv2.resize(im,size,interpolation=cv2.INTER_LANCZOS4) if size else im
def cutout(im):
    rgba=np.array(remove(Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)),session=sess)); return rgba
def setze(bg, rgba, cx, unten, hoehe, flip=False, licht=1.0):
    ys,xs=np.where(rgba[...,3]>20); rgba=rgba[ys.min():ys.max()+1, xs.min():xs.max()+1]
    if flip: rgba=rgba[:,::-1]
    s=hoehe/rgba.shape[0]; rgba=cv2.resize(rgba,(max(1,int(rgba.shape[1]*s)),int(hoehe)),interpolation=cv2.INTER_AREA)
    h,w=rgba.shape[:2]; x0=int(cx-w/2); y0=int(unten-h)
    out=bg.copy().astype(np.float32)
    X0,Y0=max(0,x0),max(0,y0); X1,Y1=min(bg.shape[1],x0+w),min(bg.shape[0],y0+h)
    sub=rgba[Y0-y0:Y1-y0, X0-x0:X1-x0].astype(np.float32)
    a=cv2.GaussianBlur(sub[...,3]/255.,(0,0),1.2)[...,None]; rgb=sub[...,:3][...,::-1]*licht
    out[Y0:Y1,X0:X1]=rgb*a+out[Y0:Y1,X0:X1]*(1-a)
    return out.astype(np.uint8)
def handyfoto(im, rot=2.5, blitz=(0.5,0.62), staerke=0.35, seed=1):
    rng=np.random.default_rng(seed); h,w=im.shape[:2]
    M=cv2.getRotationMatrix2D((w/2,h/2),rot,1.0+abs(rot)*0.012); im=cv2.warpAffine(im,M,(w,h),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
    f=im.astype(np.float32)/255
    y,x=np.ogrid[:h,:w]; r=np.sqrt(((x-blitz[0]*w)/(w*0.55))**2+((y-blitz[1]*h)/(h*0.6))**2)
    flash=np.clip(1-r,0,1)**1.5
    f=f*(1+staerke*flash[...,None])+0.05*flash[...,None]
    f=(f-0.5)*1.12+0.5
    f[...,0]*=1.03
    mb=cv2.filter2D(f,-1,np.ones((1,11),np.float32)/11); f=f*0.65+mb*0.35
    f+=rng.normal(0,0.022,f.shape).astype(np.float32)
    v=np.clip(1-0.5*(((x-w/2)/(w/1.3))**2+((y-h/2)/(h/1.1))**2),0.45,1); f*=v[...,None]
    return np.clip(f*255,0,255).astype(np.uint8)
def konfetti(im, n=140, seed=3):
    rng=np.random.default_rng(seed); out=im.copy(); h,w=im.shape[:2]
    cols=[(80,80,255),(255,200,60),(90,220,255),(255,120,220),(120,255,150),(255,255,255)]
    for _ in range(n):
        x,y=int(rng.uniform(0,w)),int(rng.uniform(0,h)); s=int(rng.uniform(6,16)); a=rng.uniform(0,180)
        box=cv2.boxPoints(((x,y),(s,s*0.55),a)).astype(np.int32); c=cols[rng.integers(len(cols))]
        cv2.fillPoly(out,[box],c)
    return cv2.GaussianBlur(out,(0,0),0.6)
def speichere(im,code,size=None):
    if size: im=cv2.resize(im,size,interpolation=cv2.INTER_AREA)
    Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)).save(O+code+'.webp','WEBP',quality=84,method=6)
# Lynn ausschneiden
def main():
    lynn=cutout(cv2.imread(B+'bilder_neu/paket2/N18_lynn_tuer_v2.jpg'))
    # --- N26: Küche (N13), Lynn hinten in der Tür rechts
    n13=cv2.imread(O+'N13.webp'); n13=cv2.resize(n13,(1920,1080))
    n26=setze(n13,lynn,cx=1595,unten=640,hoehe=330,licht=0.72)
    speichere(handyfoto(n26,rot=-2,blitz=(0.35,0.55),seed=4),'N26')
    # --- N28: anderes Wohnzimmer (Tanzfläche gespiegelt, andere Lichtfarbe)
    w=cv2.imread(O+'N35w.webp'); w=cv2.resize(w,(1920,1080))[:, ::-1]
    hsv=cv2.cvtColor(w,cv2.COLOR_BGR2HSV).astype(np.int32); m=((hsv[...,0]>=125)&(hsv[...,1]>70)); hsv[...,0]=np.where(m,hsv[...,0]-45,hsv[...,0]); w2=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR); w2=np.clip(w2.astype(np.float32)*np.array([1.08,1.0,0.94]),0,255).astype(np.uint8)
    w2=w2[60:1060, 120:1898]; w2=cv2.resize(w2,(1920,1080))
    n28=handyfoto(w2,rot=3,blitz=(0.55,0.65),staerke=0.45,seed=7)
    speichere(n28,'N28')
    # --- APS: Afterparty-Story bei Tim, Lynn hinten (hochkant)
    aps=w2.copy()
    aps=handyfoto(aps,rot=-3,blitz=(0.5,0.7),seed=9)[:, 600:1500]
    speichere(aps,'APS',(810,1080))
    # --- B07: Lenas Story-Selfie mit Konfetti, Lynn klein hinten (hochkant)
    b=cv2.imread(O+'B12A.webp'); b=cv2.resize(b,(1920,1080))
    b=setze(b,lynn,cx=985,unten=640,hoehe=290,licht=0.62)
    b=konfetti(b); b=handyfoto(b,rot=2,blitz=(0.3,0.45),staerke=0.3,seed=11)
    b=b[60:1080, 300:1065]
    speichere(b,'B07',(810,1080))
    print('fotos ok')
if __name__=="__main__": main()
