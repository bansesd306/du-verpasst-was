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
`cd spiel/dist && python3 -m http.server 8765`, dann `python3 spiel/t8.py` (alle Wege, Spielzeit `vz`) bzw. `t_echt.py WEG` (Echtzeit).

## Veröffentlichen
- Test-Link (privat): Artefakt-Slug `5d6f857a-23db-4da8-8501-add017b70699`. Alle Dateien aus `dist/` hochladen (Overlay-Bilder werden dynamisch geladen!). Öffentlicher Link V5 nur mit Philips Okay ersetzen.
- Galerie: Artefakt-Slug `26fa13a7-d8e2-4e18-b7fb-15d961d90eaf`, Projekt-Doc `claude/bilder-liste.md`.

## Regeln (Philip)
- Antworten auf Deutsch. Nur erfundene Namen. Feedback zu Philips Texten fair, aber relativ hart.
- ElevenLabs nur nach Rückfrage. Keine Weichzeichner über Bilder. Mia in Montagen nie verkleinern.
- Aktuelle Aufgaben: Projekt-Docs `claude/v8-aenderungen-20-11-abend.md`, `claude/story-ideen-20-11-abend.md`, `claude/ziele.md`.
