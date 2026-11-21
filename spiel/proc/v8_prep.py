# V8: Quellbilder vorbereiten (Zuschnitt, Spiegeln, Montagen, Wasserzeichen) -> bilder_neu/v8_src/CODE.png
import cv2, numpy as np, os, sys
sys.path.insert(0,'/home/claude/game/proc')
from varianten import ausrichten
G='/home/claude/game/'; N=G+'bilder_neu/gemini_20-11-abend/'; O=G+'bilder_neu/v8_src/'
def L(p): 
    im=cv2.imread(p,cv2.IMREAD_COLOR); assert im is not None,p; return im
def S(code,im): cv2.imwrite(O+code+'.png',im); print('ok',code,im.shape[1],'x',im.shape[0])
def feder(h,w,box,r):
    m=np.zeros((h,w),np.float32); x0,y0,x1,y1=box; m[y0:y1,x0:x1]=1
    return cv2.GaussianBlur(m,(0,0),r)[...,None]
def wasserzeichen(im):
    h,w=im.shape[:2]; y0=int(h*.952); x1=int(w*.165)
    roi=im[y0:,:x1]; g=cv2.cvtColor(roi,cv2.COLOR_BGR2GRAY).astype(np.float32)
    bg=cv2.medianBlur(roi,21); gb=cv2.cvtColor(bg,cv2.COLOR_BGR2GRAY).astype(np.float32)
    m=((g-gb)>18).astype(np.uint8)*255; m=cv2.dilate(m,np.ones((5,5),np.uint8))
    full=np.zeros((h,w),np.uint8); full[y0:,:x1]=m
    return cv2.inpaint(im,full,6,cv2.INPAINT_TELEA)
def lena_blond(im,fr):
    # Lenas Haare von rotblond auf honigblond (nur in ihrem Bereich, nur orange-rote Töne)
    im=im.astype(np.float32); h,w=im.shape[:2]
    hsv=cv2.cvtColor(im/255,cv2.COLOR_BGR2HSV)
    box=np.zeros((h,w),np.float32); box[int(h*fr[1]):int(h*fr[3]),int(w*fr[0]):int(w*fr[2])]=1; box=cv2.GaussianBlur(box,(0,0),10)
    hue=hsv[...,0]; sel=((hue>6)&(hue<38)&(hsv[...,1]>.32)).astype(np.float32); sel=cv2.GaussianBlur(sel,(0,0),2)*box
    hsv[...,0]=hue+sel*np.clip(42-hue,0,16)*.8; hsv[...,1]*=1-sel*.2; hsv[...,2]*=1+sel*.05
    return np.clip(cv2.cvtColor(hsv,cv2.COLOR_HSV2BGR)*255,0,255).astype(np.uint8)
def nur(code):
    return len(sys.argv)<2 or code in sys.argv[1:]

# --- Zimmer-Set (ohne Türrahmen), Wasserzeichen weg, auf N09 ausgerichtet
if nur('ZIMMER'):
    n09=wasserzeichen(L(N+'N09_neu.jpg'))
    # Türklinke an der rechten Wand (nur N09_neu) wegmalen
    h,w=n09.shape[:2]; m=np.zeros((h,w),np.uint8)
    roi=n09[int(h*.53):int(h*.66),int(w*.785):int(w*.84)]
    g=cv2.cvtColor(roi,cv2.COLOR_BGR2GRAY).astype(np.float32); gb=cv2.GaussianBlur(g,(0,0),9)
    mm=(np.abs(g-gb)>14).astype(np.uint8)*255; mm=cv2.dilate(mm,np.ones((7,7),np.uint8))
    m[int(h*.53):int(h*.66),int(w*.785):int(w*.84)]=mm
    n09=cv2.inpaint(n09,m,7,cv2.INPAINT_TELEA)
    S('N09',n09)
    for c in ['N31a','N31b','N31c','N31d']:
        im=wasserzeichen(L(N+c+'_neu.jpg'))
        im,_=ausrichten(n09,im)
        S(c,im)
    S('K10H',wasserzeichen(L(N+'K10H.jpg')))
    S('N02',L(N+'N02.jpg'))

# --- Balkon: Sitzen gespiegelt (Glasfront rechts = Partyraum), Lynn durch die Tür zugeschnitten
if nur('BALKON'):
    S('N34',cv2.flip(L(N+'N34_balkon_sitzen_leute.jpg'),1))
    S('N34b',cv2.flip(L(N+'N34b_balkon_sitzen_leer.jpg'),1))
    z=L(N+'N36Z_lynn_durch_tuer.jpg'); S('N36Z',z[170:552,350:1030])

# --- Prüfung: Stift auf dem Tisch, Tafel ohne englischen Text
if nur('PRUEFUNG'):
    gross=L(N+'N25_stift_gross.jpg'); h,w=gross.shape[:2]
    alt=cv2.resize(L(G+'dist/img/N25.webp'),(w,h),interpolation=cv2.INTER_AREA)
    alt,_=ausrichten(gross,alt)
    f=feder(h,w,(int(w*.44),int(h*.24),int(w*.92),int(h*.47)),10)   # Tafel aus dem alten Bild
    n25=(gross*(1-f)+alt*f).astype(np.uint8); S('N25',n25)
    leer=L(N+'N25L_pruefung_fast_leer.jpg'); lh,lw=leer.shape[:2]
    g2=cv2.resize(gross,(lw,lh)); g2,_=ausrichten(leer,g2)
    f=feder(lh,lw,(int(lw*.17),int(lh*.80),int(lw*.66),lh),9)        # Blatt mit Stift
    S('N25L',(leer*(1-f)+g2*f).astype(np.uint8))
    b=L(N+'N25B_stift_blau.jpg').astype(np.float32)/255
    # kühles Morgenlicht wie im Prüfungsraum: Weißabgleich Richtung Blau, etwas dunkler, Lila/Blau bleiben
    lab=cv2.cvtColor(b,cv2.COLOR_BGR2LAB); lab[...,2]-=9; lab[...,1]-=1.5; lab[...,0]*=.9
    S('N25B',np.clip(cv2.cvtColor(lab,cv2.COLOR_LAB2BGR)*255,0,255).astype(np.uint8))
    S('N25V',L(N+'N25V_vor_dem_pruefungsraum.jpg'))

# --- Handyfoto Küche mit Lynn (N26): Lena honigblond, Lynn hinten weicher und wärmer
if nur('N26'):
    im=L(N+'N13Lynn_kueche_lynn_hinten.jpg').astype(np.float32); h,w=im.shape[:2]
    hsv=cv2.cvtColor(im/255,cv2.COLOR_BGR2HSV)
    box=np.zeros((h,w),np.float32); box[int(h*.24):int(h*.62),int(w*.57):int(w*.79)]=1; box=cv2.GaussianBlur(box,(0,0),12)
    hue=hsv[...,0]; sel=((hue>8)&(hue<38)&(hsv[...,1]>.35)).astype(np.float32); sel=cv2.GaussianBlur(sel,(0,0),2)*box
    hsv[...,0]=hue+sel*np.clip(42-hue,0,14)*.75; hsv[...,1]*=1-sel*.18; hsv[...,2]*=1+sel*.04
    im=cv2.cvtColor(hsv,cv2.COLOR_HSV2BGR)*255
    lb=np.zeros((h,w),np.float32); lb[int(h*.38):int(h*.62),int(w*.475):int(w*.555)]=1; lb=cv2.GaussianBlur(lb,(0,0),8)[...,None]
    # N26s = scharfe Fassung (nur wärmer) für das Ranzoomen: im Handy wird beim Zoom von weich auf scharf überblendet (Fokus ziehen)
    S('N26s',np.clip(im*(1-lb)+im*np.array([.86,.95,1.04])*.93*lb,0,255).astype(np.uint8))
    weich=cv2.GaussianBlur(im,(0,0),1.3); warm=weich*np.array([.86,.95,1.04])*.93
    S('N26',np.clip(im*(1-lb)+warm*lb,0,255).astype(np.uint8))

# --- Seminar
if nur('SEMINAR'):
    for c in ['N38a','N38b','N38bz','N38bl','N38n','N38']: S(c,L(N+c+'.jpg'))
    s5=L(N+'N38_s5.jpg'); S('N38c',s5[60:375,30:590])       # nur Gesicht/Oberkörper (Laptop außerhalb)

# --- Lynn-Ende, Pizza, Tim, Hub, Story
if nur('REST'):
    for c in ['LD1','LD2','LD3','LD4','LDz','LDs','LDw','LDa','LDh','N37','N37z','N37s','N37b','TV1','TV2','TV3','TVn']: S(c,L(N+c+'.jpg'))
    S('H36a',L(N+'hub_variante_tanzflaeche.jpg')); S('H36b',L(N+'hub_variante_paar.jpg'))
    S('N29',L(N+'N29.jpg'))
    S('N27',lena_blond(L(N+'N27_gruppe_sofa.jpg'),(.30,.22,.45,.55)))
