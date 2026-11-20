import cv2, numpy as np, sys, json
from PIL import Image
B='/home/claude/game/'
def lade(p, size=None):
    im=cv2.imread(p, cv2.IMREAD_COLOR)
    if size: im=cv2.resize(im,size,interpolation=cv2.INTER_LANCZOS4)
    return im
def ausrichten(base, var):
    h,w=base.shape[:2]; s=960/w
    a=cv2.cvtColor(cv2.resize(base,None,fx=s,fy=s),cv2.COLOR_BGR2GRAY).astype(np.float32)
    b=cv2.cvtColor(cv2.resize(var,None,fx=s,fy=s),cv2.COLOR_BGR2GRAY).astype(np.float32)
    M=np.eye(2,3,dtype=np.float32)
    try:
        _,M=cv2.findTransformECC(a,b,M,cv2.MOTION_AFFINE,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,200,1e-5),None,5)
    except cv2.error: pass
    M2=M.copy(); M2[:,2]/=s
    return cv2.warpAffine(var,M2,(w,h),flags=cv2.INTER_LANCZOS4+cv2.WARP_INVERSE_MAP,borderMode=cv2.BORDER_REPLICATE), M
def maske(base, var, box=None, schwelle=22, wachsen=0.012, minfrac=0.0004):
    h,w=base.shape[:2]
    d=cv2.absdiff(cv2.GaussianBlur(base,(0,0),3),cv2.GaussianBlur(var,(0,0),3)).max(axis=2)
    m=(d>schwelle).astype(np.uint8)
    if box:
        z=np.zeros_like(m); x0,y0,x1,y1=[int(v) for v in (box[0]*w,box[1]*h,box[2]*w,box[3]*h)]; z[y0:y1,x0:x1]=1; m*=z
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(m)
    keep=np.zeros_like(m)
    for i in range(1,n):
        if st[i,4]>w*h*minfrac: keep[lab==i]=1
    k=int(w*wachsen)|1
    keep=cv2.dilate(keep,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(k*2+1,k*2+1)))
    a=cv2.GaussianBlur(keep.astype(np.float32),(0,0),k*0.9)
    return np.clip(a*1.4,0,1)
def speichere_overlay(var, alpha, ziel):
    rgba=np.dstack([cv2.cvtColor(var,cv2.COLOR_BGR2RGB),(alpha*255).astype(np.uint8)])
    ys,xs=np.where(alpha>0.01)
    if not len(xs): print('LEER',ziel); return None
    x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
    Image.fromarray(rgba[y0:y1,x0:x1]).save(ziel,'WEBP',quality=88,method=6)
    h,w=alpha.shape
    return [round(x0/w,4),round(y0/h,4),round((x1-x0)/w,4),round((y1-y0)/h,4)]
