"""Setzt CSS und HTML des Rahmens (Start, Menü, Enden) unter #zimmer:
IDs bekommen „z-“ davor (#bw wird #zimmer), Selektoren werden auf #zimmer begrenzt,
Keyframe-Namen bekommen „z_“ davor. So stört nichts das eigentliche Spiel."""
import re

def _id(name):
    return 'zimmer' if name == 'bw' else 'z-' + name

def _selector(sel):
    teile = []
    for s in sel.split(','):
        s = s.strip()
        if not s:
            continue
        s = re.sub(r'#([A-Za-z][\w-]*)', lambda m: '#' + _id(m.group(1)), s)
        if s == ':root':
            s = '#zimmer'
        elif not s.startswith('#zimmer'):
            s = '#zimmer ' + s
        teile.append(s)
    return ','.join(teile)

def css(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    kf = set(re.findall(r'@keyframes\s+([\w-]+)', text))
    out, i, n = [], 0, len(text)

    def decls(d):
        def ani(m):
            v = m.group(2)
            for k in kf:
                v = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', 'z_' + k, v)
            return m.group(1) + v
        return re.sub(r'(animation(?:-name)?\s*:)([^;}]*)', ani, d)

    def block(text, i, inner=False):
        res = []
        while i < len(text):
            j = text.find('{', i)
            k = text.find('}', i)
            if k != -1 and (j == -1 or k < j):
                return ''.join(res), k + 1
            if j == -1:
                break
            kopf = text[i:j].strip()
            if kopf.startswith('@keyframes'):
                name = kopf.split()[1]
                tiefe, p = 1, j + 1
                while tiefe:
                    if text[p] == '{': tiefe += 1
                    elif text[p] == '}': tiefe -= 1
                    p += 1
                res.append('@keyframes z_' + name + text[j:p])
                i = p
            elif kopf.startswith('@media'):
                inhalt, p = block(text, j + 1, True)
                res.append(kopf + '{' + inhalt + '}')
                i = p
            else:
                e = text.find('}', j)
                res.append(_selector(kopf) + '{' + decls(text[j + 1:e]) + '}\n')
                i = e + 1
        return ''.join(res), len(text)

    return block(text, 0)[0]

def html(text):
    text = re.sub(r'id="([\w-]+)"', lambda m: 'id="' + _id(m.group(1)) + '"', text)
    text = text.replace('url(#displ)', 'url(#z-displ)')
    return text
