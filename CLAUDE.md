# „Du verpasst was.“ – Visual Novel zu FoMO (Philip, KSH München, Abgabe Mo 30.11.)

## Einrichten in einer neuen Sitzung
`bash setup.sh` → verlinkt `spiel/` nach `/home/claude/game` und `tools/` nach `/home/claude/tools` (alle Skripte nutzen diese Pfade).

## Aufbau
- `spiel/story.txt` – das komplette Spielskript (DSL, Syntax-Kopf oben in der Datei). Text nur mit Philips Okay ändern; Textquelle ist das Story-Dokument (Claude-Doc `Bj4VSNpgg2gtWiQDKXZPvv`).
- `spiel/engine.js, phone.js, audio.js, bilder.js` – Engine, Handy, Ton, Bild-/Tonliste. `style.css, phone.css`, `rahmen_*` = Menü/Endbildschirme.
- `spiel/build.py` → `spiel/dist/index.html` (+ `dist/img`, `dist/ton`, `dist/fonts`, `dist/vid`).
- `spiel/bilder_neu/`, `spiel/ton_neu/`, `spiel/figuren/` – Quellen. `quellen/uploads/` – alle Originaldateien, die Philip hochgeladen hat.
- `spiel/proc/` – Bildbearbeitung (Gesichts-Overlays, Grading, Handyfotos, Montage).
- `tools/galerie.py` – Bildergalerie neu erzeugen; `tools/upscale*.py` – Hochskalieren (4x-UltraSharp, ncnn, CPU; Modelle: Real-ESRGAN-Release bzw. upscayl/upscayl resources/models).

## Testen
`cd spiel/dist && python3 -m http.server 8765`, dann `python3 spiel/t8.py` (alle Wege, Spielzeit `vz`; `K=1` wenn nebenbei hochskaliert wird, sonst stürzt Chrome wegen Speicher ab) bzw. `t_echt.py WEG` (Echtzeit). Szenen sichtbar prüfen: `t_film.py LABEL '{"typ":"zuhause"}' SCHRITTE /tmp/x` + `t_sheet.py /tmp/x 1,2,3 /tmp/bogen.jpg`; Endbildschirme `t_ende.py`.

## Veröffentlichen
- Test-Link (privat): Artefakt-Slug `5d6f857a-23db-4da8-8501-add017b70699`. Alle Dateien aus `dist/` hochladen (Overlay-Bilder werden dynamisch geladen!). Öffentlicher Link V5 nur mit Philips Okay ersetzen.
- Galerie: Artefakt-Slug `26fa13a7-d8e2-4e18-b7fb-15d961d90eaf`, Projekt-Doc `claude/bilder-liste.md`.

## Story-Datei (Philips Textquelle, seit 20.11. abends)
- Artefakt „Du verpasst was – Story“, Slug `9d2f17e7-d9d1-4e6e-ab48-6fecf368d0d8`: zeigt das ganze Skript lesbar nach Kapiteln und Szenen, Philip ändert Texte direkt darin.
- Philips Änderungen liegen in der Artefakt-Datenbank: Sammlung `aenderungen` (Dokument `z<Zeile>`: original, originalText, neu, geloescht, danach) und `notizen` (pro Szene ein Auftrag in seinen Worten). Lesen mit db_list.
- Beim Bau: Änderungen nach /tmp/aenderungen.json, `python3 tools/story_uebernehmen.py /tmp/aenderungen.json`, Bericht prüfen, Notizen umsetzen. Danach übernommene Dokumente nach `erledigt/…` verschieben und aus `aenderungen` löschen, `python3 tools/storydatei.py` und `story.json` neu ins Artefakt laden (Zeilennummern ändern sich).
- Diese Änderungen sind Philips Okay. Zusätzlich ins Story-Dokument (Claude-Doc) eintragen, wenn sie dort vorkommen.

## Bilder V8 (Pipeline)
`proc/v8_prep.py [ABSCHNITT]` → `bilder_neu/v8_src/` → `tools/upscale_v8_lauf.sh CODES…` (ein Prozess pro Bild, ncnn hält sonst Speicher) → `bilder_neu/v8_hq/` → `proc/v8_finish.py` (Spielbilder + Gesichts-Overlays, schreibt OVERLAYS in bilder.js). v8_src/v8_hq sind nicht im Repo.

## Regeln (Philip)
- Antworten auf Deutsch. Nur erfundene Namen. Feedback zu Philips Texten fair, aber relativ hart.
- ElevenLabs nur nach Rückfrage. Keine Weichzeichner über Bilder. Mia in Montagen nie verkleinern.
- Stand: V8 gebaut (21.11. früh), siehe Projekt-Doc `claude/v8-stand-bau.md` (eingebaut, behoben, offen). Ziele: `claude/ziele.md`.
