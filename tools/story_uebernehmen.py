# Übernimmt Philips Änderungen aus dem Story-Artefakt in spiel/story.txt.
# Ablauf beim Bau:
#   1. db_list (Artefakt 9d2f17e7-d9d1-4e6e-ab48-6fecf368d0d8, Sammlungen „aenderungen“ und „notizen“)
#      -> als JSON-Liste der data-Objekte speichern, z. B. /tmp/aenderungen.json
#   2. python3 tools/story_uebernehmen.py /tmp/aenderungen.json   (schreibt story.txt, Bericht auf stdout)
#   3. Notizen von Hand umsetzen (sind Aufträge in Philips Worten).
#   4. Übernommene Dokumente in der DB nach „erledigt/…“ verschieben und aus „aenderungen“ löschen,
#      dann tools/storydatei.py laufen lassen und das Artefakt neu veröffentlichen (Zeilennummern ändern sich!).
import json, sys, re
STORY = '/home/claude/game/story.txt'
ae = json.load(open(sys.argv[1], encoding='utf-8'))
zeilen = open(STORY, encoding='utf-8').read().split('\n')
bericht = []

def finde(a):
    z = a['zeile'] - 1; orig = a['original'].strip()
    for d in range(0, 60):
        for k in (z - d, z + d):
            if 0 <= k < len(zeilen) and zeilen[k].strip() == orig:
                return k
    return None

# von hinten nach vorn, damit Einfügungen die Nummern davor nicht verschieben
for a in sorted(ae, key=lambda x: -x['zeile']):
    k = finde(a)
    if k is None:
        bericht.append(f"NICHT GEFUNDEN Zeile {a['zeile']}: {a['original']}  -> bitte von Hand"); continue
    roh = zeilen[k]; einr = roh[:len(roh) - len(roh.lstrip())]
    if a.get('geloescht'):
        zeilen[k] = einr + '# (gelöscht von Philip) ' + roh.strip()
        bericht.append(f"gelöscht   {a['zeile']}: {roh.strip()}")
    elif isinstance(a.get('neu'), str):
        alt = a.get('originalText', '')
        if alt and alt in roh:
            zeilen[k] = roh.replace(alt, a['neu'], 1)
            bericht.append(f"geändert   {a['zeile']}: {alt!r} -> {a['neu']!r}")
        else:
            bericht.append(f"VON HAND   {a['zeile']}: {roh.strip()!r} -> {a['neu']!r}")
    if a.get('danach'):
        neu = [einr + x.strip() for x in a['danach'].split('\n') if x.strip()]
        zeilen[k + 1:k + 1] = neu
        bericht.append(f"eingefügt  nach {a['zeile']}: {neu}  (Typ prüfen: Text/Gedanke/Sprecher)")
open(STORY, 'w', encoding='utf-8').write('\n'.join(zeilen))
print('\n'.join(reversed(bericht)) or 'Keine Änderungen.')
