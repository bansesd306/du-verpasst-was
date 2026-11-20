import cv2, numpy as np, json, sys
sys.path.insert(0,'/home/claude/game/proc')
from varianten import *
from grade import grade
from PIL import Image
V=B+'bilder_neu/varianten/'; P=B+'bilder_neu/paket2/'; O=B+'dist/img/'
def webp(im, ziel): Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)).save(O+ziel+'.webp','WEBP',quality=86,method=6)
S=(1920,1080)
# --- neue Grundbilder
neu={}
def basis(code, datei, g=False, dunkel=0):
    im=lade(datei,S)
    if g: im=grade(im)
    if dunkel: im=np.clip(im.astype(np.float32)*(1-dunkel),0,255).astype(np.uint8)
    webp(im, code); neu[code]=im; return im
basis('A1', B+'bilder_neu/A1_hub_0040.jpg')
basis('N33', B+'bilder_neu/N33_hub_spaet_halbleer.jpg', g=True)
basis('SP1', B+'bilder_neu/SP1_flur_spaet_jacken.jpg', g=True)
basis('N17', P+'N17_hand_jacke.jpg', g=True)
basis('N18', P+'N18_lynn_tuer_v2.jpg', g=True)
basis('N19', P+'N19_lynn_nah_strahlt_v2_licht.jpg', g=True)
basis('N20', P+'N20_lynn_schaut_zurueck.jpg', g=True)
basis('N21', P+'N21_lynn_geht_rein.jpg', g=True, dunkel=0.12)
basis('FL1', P+'flur_bewegung_1.jpg', g=True)
basis('FL2', P+'flur_bewegung_2.jpg', g=True)
basis('FL3', P+'flur_bewegung_3_mit_frau.jpg', g=True)
# --- Varianten (Overlays)
JOBS=[('B12',None,'B12_1a_augenzu','B12z',None),('B12',None,'B12_1b_grinsen','B12g',None),('B12',None,'B12_1c_spricht','B12s',None),
 ('N13L',None,'N13L_2a_lena_augenzu','N13Lz1',None),('N13L',None,'N13L_2b_jonas_augenzu','N13Lz2',None),('N13L',None,'N13L_2c_jonas_spricht','N13Ls',None),
 ('B12A',None,'B12A_3a_lena_augenzu','B12Az',None),('B12A',None,'B12A_3b_jonas_laecheln','B12Ag',None),
 ('N35c',None,'N35c_1a_augenzu','N35cz',None),('N35c',None,'N35c_1b_spricht','N35cs',None),('N35c',None,'N35c_1c_skeptisch','N35ck',None),
 ('N35b',None,'N35b_2a_laecheln','N35bg',None),('N35b',None,'N35b_2b_spricht','N35bs',None),
 ('N35f',None,'N35f_1_lacht','N35fl',None),('N35f',None,'N35f_2_laechelt','N35fg',None),('N35f',None,'N35f_3_laechelt_augenzu','N35fgz',None),
 ('N19','N19','N19_1a_augenzu','N19z',None),('N19','N19','N19_1b_spricht','N19s',None),('N19','N19','N19_1c_traurig','N19t',None),('N19','N19','N19_1d_lacht','N19l',None),
 ('N20','N20','N20_2b_grosses_laecheln','N20g',None)]
BOXEN=json.load(open(B+'proc/boxen.json')) if __import__('os').path.exists(B+'proc/boxen.json') else {}
erg={}; vorschau=[]
for basecode, neuk, vname, out, _ in JOBS:
    base = neu[neuk] if neuk else lade(O+basecode+'.webp')
    src = (P if neuk else V)+vname+'.jpg'
    var = lade(src,(base.shape[1],base.shape[0]))
    if neuk: var=grade(var)
    var,_=ausrichten(base,var)
    o=BOXEN.get(out,{}); a=maske(base,var,o.get('box'),o.get('schwelle',22),o.get('wachsen',0.012),o.get('min',0.0004))
    box=speichere_overlay(var,a,O+out+'.webp')
    erg[out]={'basis':basecode,'box':box}
    v=base.copy().astype(np.float32); v[...,2]=np.clip(v[...,2]+a*120,0,255)
    t=cv2.resize(v.astype(np.uint8),(480,270)); cv2.putText(t,out,(8,24),0,.8,(0,255,255),2); vorschau.append(t)
json.dump(erg,open(B+'proc/overlays.json','w'),indent=1)
while len(vorschau)%4: vorschau.append(np.zeros_like(vorschau[0]))
rows=[np.hstack(vorschau[i:i+4]) for i in range(0,len(vorschau),4)]
cv2.imwrite('/tmp/shots/masken.jpg',np.vstack(rows),[cv2.IMWRITE_JPEG_QUALITY,80])
print(json.dumps(erg))
