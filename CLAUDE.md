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
- Stand: V8.8 gebaut (22.11. abends), siehe Projekt-Doc `claude/v8-8-stand-bau.md`; davor `claude/v8-7-stand-bau.md`. Ziele: `claude/ziele.md`.
- V8.8-Bildwerkzeug: `proc/v88_bilder.py [a1|a2|neu|tim|handy|balkon|ov]` (wiederholbar; Originale vor dem Aufhellen in `bilder_neu/v88_vorhell/`). Balkonboden: N34/N34a1/N34a2/N34b auf den Bildausschnitt des Videos `dist/vid/N34v.mp4` gebracht (4-s-Schleife, Ton aus).
- V8.8-Technik: Bildliste kennt `video:` (bewegter Hintergrund über dem Standbild), Bildmodus `sehrlangsam` (8 s), `@handy laut`, `@handy livesprich A B SEK`, `@handy story NAME CODE ZEIT | AUFRUFE | TEXT` (Text auf der Story), `@handy storys name=CODE …`, `@effekt heranzoomen 3.5`. Verschreiber `⌫ynn` passiert jetzt mitten im Tippen. `lernstand` (G27, Schwellen LERN_MITTEL/LERN_HOCH). Lena heißt im Handy „Lena 🌻“ (KONTAKTE.name).
- Test-Protokoll (`protokoll.js`, nur TESTMODUS): schreibt in die Artefakt-Datenbank des Test-Links, Sammlung `protokoll` (Dokumente `protokoll/<sitzung>_<nr>`), Knopf ⚑ = Fehler markieren. Lesen: db_list slug 5d6f857a…, collection `protokoll`.
- Öffentliche Fassung bauen: `ABGABE=1 python3 build.py` (TESTMODUS aus: keine Stoppuhr, kein Sprungmenü, kein Protokoll).
- Sprünge/Tests: `Spiel._debug.neustart(LABEL, V => {...})` setzt Variablen vor dem Start (G61); `t_film.py` nutzt das.
- V8.7-Bildwerkzeug: `proc/v87_bilder.py [mia|mia35|lena|dunkel|einzeln]` (wiederholbar: Originale vor dem Abdunkeln in `bilder_neu/v87_vordunkel/`, vor dem Entfernen der Person links in `bilder_neu/v87_vorlinks/`). Mias Text-Story: `proc/v87_mia_story.py`.
- Neue Skript-Befehle (V8.7): `@leer` (Textbox weg), `@effekt lebendig` (Fensterblick), `@handy ungelesen NAME | ZAHL | VORSCHAU`, `@handy story NAME CODE ZEIT | AUFRUFE`, `@ton NAME lp1400 vol1.7`, Musikstufe `mittel`. Erste Story einer Person bleibt mind. 2,5 s. Jeder zweite Handy-Knopf-Blick = 1 Handy-Punkt (max. 3).
- Offen nach V8.7: D10, D26, „MORITZ!“-Aufnahme, N38c-Ausschnitt (Vorschau `quellen/vorschau/N38c_ausschnitte.jpg`), Bilder von Tims Feier (A7), „Umarmung trotzdem“-Bild (A5), BR neu (A4), Gedanken zu den Fotos, Fokuslicht, Lernkarten Sonntag.
- V8.5-Bildwerkzeuge: `proc/v85_prep.py` (Gemini-Uploads → v8_src, KI-Hinweis übermalen) → **NICHT mehr `tools/upscale_sanft.py`** (baut Kachel-Streifen ins Bild, V8.6 entdeckt) – stattdessen Lanczos + leichtes Nachschärfen nach `bilder_neu/v8_hq/` (siehe v8-6-stand-bau.md) → `proc/v85_finish.py` (dist/img + Handyfoto-Fassungen `*_h.webp`, Eintrag `imHandy` in bilder.js). Personenfilter mild: `proc/v85_personen.py` (Originale in `bilder_neu/v85_vorfilter/`, zurück mit `--zurueck`).
