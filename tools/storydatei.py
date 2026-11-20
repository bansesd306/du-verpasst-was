# Erzeugt die Story-Datei (Artefakt „Du verpasst was – Story“) aus spiel/story.txt:
#   /home/claude/storyeditor/story.json  (alle Szenen, jede Zeile mit Zeilennummer)
#   /home/claude/storyeditor/img/*.jpg   (kleine Vorschaubilder)
# index.html liegt fest daneben (tools/storyeditor_index.html) und wird mitkopiert.
import re, json, os, shutil
from PIL import Image

G = '/home/claude/game'
OUT = '/home/claude/storyeditor'
os.makedirs(OUT + '/img', exist_ok=True)
S = open(G + '/story.txt', encoding='utf-8').read().split('\n')
B = open(G + '/bilder.js', encoding='utf-8').read()

# Bildliste: Code -> (Datei, Beschreibung)
REG = {}
for m in re.finditer(r'^\s*"?([A-Za-z0-9_]+)"?\s*:\s*\{([^\n]*)', B, re.M):
    k, b = m.groups()
    d = re.search(r'datei:\s*"([^"]*)"', b)
    if d is None or k in REG or (d.group(1) and not d.group(1).startswith('img/')):
        continue
    t = re.search(r'text:\s*"([^"]*)"', b)
    er = re.search(r'ersatz:\s*"([^"]+)"', b)
    REG[k] = (d.group(1), t.group(1) if t else '', er.group(1) if er else None)

def thumb(code):
    e = REG.get(code)
    f = e[0] if e and e[0] else (f'img/{code}.webp' if os.path.exists(f'{G}/dist/img/{code}.webp') else None)
    if not f and e and e[2]:
        f = REG.get(e[2], (None,))[0]
    if not f or not os.path.exists(f'{G}/dist/{f}'):
        return None
    name = os.path.splitext(os.path.basename(f))[0] + '.jpg'
    ziel = f'{OUT}/img/{name}'
    if not os.path.exists(ziel):
        im = Image.open(f'{G}/dist/{f}').convert('RGB')
        im.thumbnail((480, 480))
        im.save(ziel, quality=80)
    return 'img/' + name

SPRECHER = {'Ich', 'Lynn', 'Jonas', 'Mia', 'Lena', 'Sophie', 'Tim', 'Senner', 'Ben', 'Mama', 'Paul', 'Alle', 'Max', 'Leo'}

FLAG = {
    'umgedreht': 'auf dem Weg umgedreht', 'heimgedreht': 'auf dem Weg umgedreht und heimgegangen',
    'zugesagt': 'Jonas zugesagt („Ich komm!“)', 'kueche': 'in der Küche gewesen', 'tanz': 'auf der Tanzfläche gewesen',
    'mittanzen': 'mitgetanzt', 'lied': 'Geburtstagslied miterlebt', 'gesungen': 'in der Küche mitgesungen',
    'flow': 'im Flow (Weg A, „Weiter.“)', 'handyweg': 'Handy weggelegt', 'phantom': 'Phantom-Vibrieren gehabt',
    'vielglueck': 'Lynn sagte „Viel Glück am Montag“', 'l3geschaut': 'Lenas Story angeschaut', 'balkon': 'auf dem Balkon gewesen',
    'mama': 'Mamas Nachricht gesehen', 'ben': 'Ben getroffen', 'l1b': '„Kurz aufs Handy“ schon gehabt',
    'afterpartyStory': 'Afterparty-Story gesehen', 'zurueck': 'nach dem Umdrehen zurück', 'wobleibst': '„wo bleibst du“ schon bekommen',
}
WERT = {
    ('typ', 'zuhause'): 'zu Hause geblieben', ('typ', 'party'): 'auf der Party', ('typ', 'gluecklich'): 'Weg „Gar nicht gemerkt“ (mit Lynn geblieben)',
    ('typ', 'afterparty'): 'mit zur Afterparty', ('weg', 'A'): 'Weg A (lernt)', ('weg', 'B'): 'Weg B (schiebt auf)', ('weg', ''): 'noch kein Weg gewählt',
    ('lynn', 'geschaut'): 'auf dem Balkon aufs Handy geschaut', ('lynn', 'gm'): 'mit Lynn geblieben', ('lynn', 'gm_geschaut'): 'mit Lynn geblieben, aber aufs Handy geschaut',
    ('lynn', ''): 'Lynn nicht (richtig) getroffen',
}

def bedingung(c):
    c = c.strip()
    def teil(t):
        t = t.strip().strip('()')
        neg = t.startswith('!') and '=' not in t
        if neg: t = t[1:]
        m = re.match(r'(\w+)\s*(==|!=|<=|>=|<|>)\s*"?([^"]*)"?$', t)
        if m:
            k, op, v = m.groups()
            if (k, v) in WERT:
                s = WERT[(k, v)]
                return ('nicht ' + s) if op == '!=' else s
            if k in ('uhr', 'ankunft'):
                wort = {'<=': 'bis', '<': 'vor', '>=': 'ab', '>': 'nach', '==': 'genau'}[op]
                return ('Uhrzeit ' if k == 'uhr' else 'Ankunft auf der Party ') + wort + ' ' + v
            if k == 'wo': return f'umgedreht beim {int(v)+1}. Wegstück' if v.isdigit() else t
            if k == 'besucht': return f'{v} oder mehr Orte auf der Party' if op == '>=' else f'genau {v} Ort auf der Party'
            if k == 'punkte': return 'wenig aufs Handy geschaut'
            return t
        s = FLAG.get(t, t)
        return ('nicht ' + s) if neg else s
    teile = re.split(r'\s*(&&|\|\|)\s*', c)
    out = ''
    for x in teile:
        out += ' und ' if x == '&&' else ' oder ' if x == '||' else teil(x)
    return out

def pausen(text):
    sp = re.search(r'\s*!(\d+(?:\.\d+)?)\s*$', text)
    s = None
    if sp:
        s = sp.group(1).replace('.', ','); text = text[:sp.start()]
    auto = text.rstrip().endswith('>>')
    if auto: text = text.rstrip()[:-2].rstrip()
    text = re.sub(r'\{\w+\}', '', text)
    return text, s, auto

kapitel = [{'titel': 'Texte im Menü, am Anfang und am Ende', 'szenen': ['_RAHMEN']}]
szenen = {'_RAHMEN': {'id': '_RAHMEN', 'titel': 'Menü- und Endtexte', 'items': []}}
akt = szenen['_RAHMEN']; tiefe = 0; titel_wartend = None
ziele = {}  # Ziel -> Liste der Szenen, die dorthin führen
wahlen = {}  # Ziel -> Wahl-Texte, die dorthin führen

for nr, roh in enumerate(S, 1):
    z = roh.strip()
    if not z: continue
    if z.startswith('#'):
        m = re.match(r'^#\s+KAPITEL\s+(.*)$', z)
        if m:
            kapitel.append({'titel': 'Kapitel ' + m.group(1).strip(), 'szenen': []}); continue
        m = re.match(r'^#\s*-{2,}\s*(.+?)\s*-{2,}\s*$', z)
        if m: titel_wartend = m.group(1)
        continue
    m = re.match(r'^==\s*(\S+)', z)
    if m:
        lab = m.group(1)
        if len(kapitel) == 1: kapitel.append({'titel': 'Vorspann', 'szenen': []})
        akt = {'id': lab, 'titel': titel_wartend or '', 'items': []}
        szenen[lab] = akt; kapitel[-1]['szenen'].append(lab); titel_wartend = None; tiefe = 0
        continue
    titel_wartend = None
    it = {'z': nr, 'raw': roh, 't': tiefe}
    if z.startswith('@'):
        m = re.match(r'^@(\S+)\s*(.*)$', z); cmd, arg = m.group(1), m.group(2)
        if cmd == 'wenn':
            it.update(typ='wenn', text='Nur wenn: ' + bedingung(arg)); akt['items'].append(it); tiefe += 1; continue
        if cmd == 'sonst':
            it.update(typ='wenn', text='Sonst:', t=max(0, tiefe - 1)); akt['items'].append(it); continue
        if cmd == 'ende':
            tiefe = max(0, tiefe - 1); continue
        if cmd == 'text':
            k, _, v = arg.partition('='); it.update(typ='uitext', schluessel=k.strip(), text=v.strip(), e=True)
        elif cmd in ('nachricht', 'nachricht!'):
            n, _, v = arg.partition(':'); it.update(typ='chat', sprecher=n.strip(), text=v.strip(), e=True)
        elif cmd == 'tippe':
            it.update(typ='tippe', text=arg, e=True)
        elif cmd == 'verlauf':
            p = [x.strip() for x in arg.split('|')]
            it.update(typ='verlauf', text=' · '.join(p), e=True)
        elif cmd in ('benachrichtigung', 'banner'):
            if arg.strip() == 'aus': continue
            p = [x.strip() for x in arg.split('|')]
            it.update(typ='benachr', app=p[0] if p else '', titel=p[1] if len(p) > 1 else '', text=p[2] if len(p) > 2 else '', e=True)
        elif cmd == 'abzeichen':
            it.update(typ='abzeichen', text=arg, e=True)
        elif cmd == 'bild':
            p = arg.split(); code = p[0] if p else ''
            if code in ('aus', ''): continue
            it.update(typ='bild', code=code, text=REG.get(code, ('', ''))[1], bild=thumb(code))
        elif cmd == 'foto':
            p = arg.split(); code = p[0]
            it.update(typ='bild', code=code, text='Foto im Chat' + (' von ' + p[1] if len(p) > 1 else '') + ': ' + REG.get(code, ('', ''))[1], bild=thumb(code))
        elif cmd == 'handy' and arg.split()[:1] and arg.split()[0] in ('story', 'live'):
            p = arg.split(); code = p[2] if p[0] == 'story' and len(p) > 2 else (p[1] if len(p) > 1 else '')
            it.update(typ='bild', code=code, text=('Story von ' + p[1] if p[0] == 'story' else 'Livestream') + ': ' + REG.get(code, ('', ''))[1], bild=thumb(code))
        elif cmd == 'handy' and arg.startswith('kommentar'):
            n, _, v = arg[len('kommentar'):].partition('|'); it.update(typ='chat', sprecher=n.strip(), text=v.strip(), e=True)
        elif cmd == 'handy' and arg.startswith('umfrage'):
            it.update(typ='umfrage', text=arg[len('umfrage'):].strip(), e=True)
        elif cmd == 'handy' and arg.startswith('liveeingabe'):
            it.update(typ='tippe', text=arg[len('liveeingabe'):].strip(), e=True)
        elif cmd == 'handy' and arg.startswith('chat '):
            it.update(typ='status', text='📱 Chat mit ' + arg[5:].strip())
        elif cmd == 'zuruf':
            it.update(typ='rede', sprecher='Alle', text=arg, e=True)
        elif cmd == 'schreibt':
            it.update(typ='status', text=arg.split()[0] + ' schreibt …')
        elif cmd == 'uhr' and re.match(r'^\d{1,2}:\d{2}$', arg.strip()):
            it.update(typ='uhr', text=arg.strip())
        elif cmd == 'karte':
            it.update(typ='uhr', text=re.sub(r'^auto\s*', '', arg))
        elif cmd == 'warte':
            it.update(typ='pause', text=f'({arg.replace(".", ",")} s nichts)')
        elif cmd == 'rufe':
            it.update(typ='sprung', ziel=arg.strip(), text='fügt ein:'); ziele.setdefault(arg.strip(), []).append(akt['id'])
        elif cmd == 'kapitel':
            continue
        else:
            sym = {'ton': '🔊', 'ton!': '🔊', 'musik': '🎵', 'loop': '🔁', 'effekt': '✨', 'schwarz': '⬛', 'uhr': '🕒'}.get(cmd, '⚙')
            it.update(typ='technik', text=f'{sym} {cmd} {arg}'.strip())
        akt['items'].append(it); continue
    m = re.match(r'^(\?\??)\s*„(.*?)“\s*->\s*(\S+)(.*)$', z)
    if m:
        art, lab, ziel, rest = m.groups()
        bed = re.search(r'wenn\s+(.*)$', rest)
        it.update(typ='wahl', text=lab, ziel=ziel, getippt=(art == '??'), handy=('+handy' in rest),
                  bed=bedingung(bed.group(1)) if bed else '', e=True)
        ziele.setdefault(ziel, []).append(akt['id']); wahlen.setdefault(ziel, []).append(lab); akt['items'].append(it); continue
    m = re.match(r'^->\s*(\S+)', z)
    if m:
        it.update(typ='sprung', ziel=m.group(1), text='weiter bei'); ziele.setdefault(m.group(1), []).append(akt['id'])
        akt['items'].append(it); continue
    text, sek, auto = pausen(z)
    m = re.match(r'^([A-ZÄÖÜ][a-zäöüß]+)(!)?:\s*(.*)$', text)
    if m and m.group(1) in SPRECHER:
        it.update(typ='rede', sprecher=m.group(1), schrei=bool(m.group(2)), text=m.group(3))
    elif text.startswith('~~'):
        it.update(typ='gedanke', leise=True, text=text[2:].strip())
    elif text.startswith('~'):
        it.update(typ='gedanke', text=text[1:].strip())
    else:
        it.update(typ='text', text=text)
    if sek: it['sek'] = sek
    if auto: it['auto'] = True
    it['e'] = True
    akt['items'].append(it)

for k, v in ziele.items():
    if k in szenen: szenen[k]['von'] = sorted(set(v))
def kurz(t, n=46):
    t = t.strip('„“ ')
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + ' …'
for sz in szenen.values():
    if sz['titel']: continue
    if sz['id'] in wahlen:
        sz['titel'] = 'Wahl „' + kurz(wahlen[sz['id']][0]) + '“'
    else:
        erst = next((i for i in sz['items'] if i['typ'] in ('text', 'rede', 'gedanke', 'chat') and len(i.get('text', '')) > 3), None)
        sz['titel'] = ('… ' + kurz(erst['text'])) if erst else sz['id']
kapitel = kapitel[1:] + kapitel[:1]
json.dump({'stand': 'V7 (20.11.)', 'kapitel': kapitel, 'szenen': szenen}, open(OUT + '/story.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'storyeditor_index.html'), OUT + '/index.html')
n = sum(len(s['items']) for s in szenen.values())
print(len(szenen), 'Szenen,', n, 'Einträge,', sum(1 for s in szenen.values() for i in s['items'] if i.get('e')), 'bearbeitbar,', len(os.listdir(OUT + '/img')), 'Bilder')
