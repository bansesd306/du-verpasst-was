# Erzeugt /home/claude/galerie (index.html + img/ + bilder-liste.md) aus story.txt und bilder.js
import re, json, os, shutil, html
os.chdir('/home/claude/game')
B=open('bilder.js').read(); S=open('story.txt').read().split('\n')
reg={}
for m in re.finditer(r'^\s*"?([A-Za-z0-9_]+)"?\s*:\s*\{([^\n]*)',B,re.M):
    k,b=m.groups()
    d=re.search(r'datei:\s*"([^"]*)"',b)
    if d is None or k in reg or (d.group(1) and not d.group(1).startswith('img/')): continue
    t=re.search(r'text:\s*"([^"]*)"',b); er=re.search(r'ersatz:\s*"([^"]+)"',b); w=re.search(r'wechsel:\s*"([^"]+)"',b)
    reg[k]={'datei':d.group(1),'text':t.group(1) if t else '','ersatz':er.group(1) if er else None,'wechsel':w.group(1) if w else None}
vb=B[B.find('const VARIANTEN'):]; vb=vb[:vb.find('};')]
varmap={m.group(1):re.findall(r'"(\w+)"',m.group(2)) for m in re.finditer(r'(\w+):\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',vb)}
for k,e in reg.items():  # Lynn-Blinzeln u.ä. als Feld im Eintrag
    pass
def datei(c):
    e=reg.get(c)
    if e and e['datei'] and os.path.exists('dist/'+e['datei']): return e['datei']
    if os.path.exists(f'dist/img/{c}.webp'): return f'img/{c}.webp'
    return None
order=[]; seen=set(); label=''
def add(c,lab,how):
    if c in seen or (c not in reg and not datei(c)): return
    seen.add(c); order.append((c,lab,how))
    e=reg.get(c,{})
    if e.get('wechsel'): add(e['wechsel'],lab,'Bewegung zu '+c)
    for v in varmap.get(c,[]): add(v,lab,'Gesicht/Variante von '+c)
    for v in re.findall(r'"(\w+)"', (re.search(r'^\s*'+c+r':\s*\{([^\n]*)',B,re.M) or [None,''])[1]):
        if v!=c and os.path.exists(f'dist/img/{v}.webp') and v not in reg: add(v,lab,'Variante von '+c)
for line in S:
    s=line.strip()
    m=re.match(r'==\s*(\S+)',s)
    if m: label=m.group(1); continue
    if s.startswith('@montage'):
        for c in ['MM04','MM01','MK1','MM03','MM05','MK2','MM06','MM02','MM08','MK3','MM07','MM09']: add(c,label,'Lichtshow')
    if s.startswith('@'):
        for c in re.findall(r'\b([A-Z][A-Za-z0-9]*)\b',s):
            if c in reg or os.path.exists(f'dist/img/{c}.webp'): add(c,label,s.split()[0][1:])
for k in reg:
    if datei(k) and k not in seen: add(k,'(kein fester Platz im Skript)','sonst')
shutil.rmtree('/home/claude/galerie',ignore_errors=True); os.makedirs('/home/claude/galerie/img')
rows=[]; md=['# Bilder im Spiel – chronologisch','','Automatisch erzeugt aus Spielskript und Bildliste. Reihenfolge = erstes Auftauchen im Spiel. „fehlt“ = Platzhalter.','','| Nr | Code | Szene | Beschreibung | Art |','|---|---|---|---|---|']
fehl=0
for n,(c,lab,how) in enumerate(order,1):
    e=reg.get(c,{'text':'','ersatz':None}); f=datei(c); ok=bool(f)
    if not ok: fehl+=1
    if ok: shutil.copy('dist/'+f,'/home/claude/galerie/img/'+os.path.basename(f))
    desc=e['text'] or ('Gesichtsvariante' if 'Variante' in how else '')
    zus='' if ok else ' – **fehlt**'+(f" (Ersatz {e['ersatz']})" if e.get('ersatz') else '')
    md.append(f"| {n} | {c} | {lab} | {desc}{zus} | {how} |")
    img=f'<img loading="lazy" src="img/{os.path.basename(f)}">' if ok else '<div class="fehlt">fehlt</div>'
    rows.append(f'<figure class="{"" if ok else "leer"}">{img}<figcaption><b>{n}. {html.escape(c)}</b> <span>{html.escape(lab)}</span><br>{html.escape(desc)}<i>{html.escape(how)}</i></figcaption></figure>')
open('/home/claude/galerie/bilder-liste.md','w').write('\n'.join(md)+'\n')
open('/home/claude/galerie/index.html','w').write(f'''<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilder im Spiel</title>
<style>body{{margin:0;background:#0f1117;color:#e8e8ee;font:15px/1.4 system-ui,sans-serif;padding:16px}}h1{{font-size:22px;margin:4px 0}}p{{color:#9aa0b0;margin:0 0 14px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}}figure{{margin:0;background:#181b24;border-radius:10px;overflow:hidden}}
figure img{{width:100%;display:block;background:#222}}.fehlt{{aspect-ratio:16/9;display:grid;place-items:center;color:#999;background:repeating-linear-gradient(45deg,#1d2029 0 10px,#2a1f25 10px 20px)}}
figcaption{{padding:8px 10px;font-size:13px}}figcaption span{{color:#8ab4ff;font-size:12px}}figcaption i{{display:block;color:#888;font-size:11px;margin-top:3px}}.leer figcaption b{{color:#ff8a8a}}</style></head>
<body><h1>Bilder im Spiel – chronologisch</h1><p>Reihenfolge = erstes Auftauchen im Spiel · blau = Szene im Skript · rot gestreift = fehlt noch ({fehl}) · {len(order)} Einträge</p><div class="g">{"".join(rows)}</div></body></html>''')
print(len(order),'Einträge,',fehl,'fehlen')
