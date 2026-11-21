import numpy as np, wave
sr=44100
w=wave.open('/tmp/kies/roh.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16)/32768.
h=441;e=np.array([np.mean(x[i:i+h]**2) for i in range(0,len(x)-h,h)])
k=np.hanning(9);es=np.convolve(e,k/k.sum(),'same');db=10*np.log10(es+1e-12)
# Schritte = lokale Maxima der geglätteten Energie, mind. 0,45 s Abstand
pk=[]
for i in np.argsort(-db):
  if db[i]<np.percentile(db,60): break
  if all(abs(i-j)>45 for j in pk): pk.append(i)
pk.sort(); print(len(pk),[round(p/100,2) for p in pk]); print([round(db[p],1) for p in pk])
L=int(.52*sr); pre=int(.07*sr)
med=np.median([db[p] for p in pk])
gut=[]
for n,p in enumerate(pk):
  if abs(db[p]-med)>4: continue
  # Spitzenfaktor: kein einzelner Knall
  s=p*h-pre; seg=x[max(0,s):s+L]
  if len(seg)<L: continue
  cf=np.abs(seg).max()/np.sqrt(np.mean(seg**2))
  print(round(p/100,2),round(db[p],1),round(cf,1))
  if cf>16: continue
  # davor/danach ruhig genug (kein Überlappen)
  if n+1<len(pk) and pk[n+1]-p<56: continue
  gut.append((p/100,seg.copy()))
print('gut',len(gut),[g[0] for g in gut])
def form(seg):
  n=len(seg); f=np.ones(n); fi=int(.03*sr); fo=int(.18*sr)
  f[:fi]=np.linspace(0,1,fi)**2; f[-fo:]=np.linspace(1,0,fo)**1.5
  seg=seg*f; return seg/np.sqrt(np.mean(seg**2))
steps=[form(s) for _,s in gut]
# Grundgeräusch: ruhigste Stellen granular
ruhig=np.where(db<np.percentile(db,15))[0]
def bett(T,rng):
  out=np.zeros(T); g=int(.3*sr); win=np.hanning(g)
  for p in range(-g,T,g//2):
    c=ruhig[rng.integers(len(ruhig))]*h; c=min(max(c-g//2,0),len(x)-g)
    np.add.at(out,(np.arange(g)+p)%T,x[c:c+g]*win)
  return out
def lauf(n,rng,takt=.6,loop=False):
  T=int(n*takt*sr)+(0 if loop else L)
  out=np.zeros(T); reihe=rng.permutation(len(steps))
  for i in range(n):
    st=steps[reihe[i%len(steps)]]*(1 if i%2==0 else .85)*10**(rng.uniform(-1,1)/20)
    p=int((i*takt+rng.uniform(-.01,.01))*sr)+int(.02*sr)
    idx=np.arange(len(st))+p
    if loop: idx%=T
    else: m=idx<T; idx=idx[m]; st=st[:len(idx)]
    np.add.at(out,idx,st)
  return out
def norm(y,peak=.8): return y/np.abs(y).max()*peak
def schreib(name,y):
  y=np.clip(y,-1,1); ww=wave.open(name,'wb'); ww.setnchannels(1); ww.setsampwidth(2); ww.setframerate(sr); ww.writeframes((y*32767).astype(np.int16).tobytes())
rng=np.random.default_rng(3); kurz=lauf(4,rng); fac=.8/np.abs(kurz).max(); kurz=kurz*fac
b=bett(len(kurz),rng); kurz+=b/np.sqrt(np.mean(b**2))*np.sqrt(np.mean(kurz**2))*.12*np.minimum(1,np.linspace(4,0,len(kurz)))
rng=np.random.default_rng(5); lp=lauf(16,rng,loop=True); lp=lp*.8/np.abs(lp).max()
b=bett(len(lp),rng); lp+=b/np.sqrt(np.mean(b**2))*np.sqrt(np.mean(lp**2))*.12
schreib('/tmp/kies/kurz.wav',kurz); schreib('/tmp/kies/loop.wav',lp)
schreib('/tmp/kies/probe.wav',np.concatenate([kurz,np.zeros(int(sr)),np.tile(lp,2)]))
