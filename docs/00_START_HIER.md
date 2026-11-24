# START HIER (Stand 23.11., 18:00) – Übergabe für jeden neuen Chat/Account

Diese Dateien sind Kopien der Projekt-Docs („claude/…“) aus Philips Claude-Projekt „FoMO“, damit ein Chat mit nur dem Repo (`bansesd306/du-verpasst-was`, Zweig `main`) auf dem neuesten Stand ist. Wenn Projekt-Docs und diese Kopien abweichen, gilt das Neuere (Datum im Kopf prüfen).

Spiel: „Du verpasst was.“ – Visual Novel zu FoMO (Philip, KSH München, **Abgabe Mo 30.11.**). Technischer Stand: `CLAUDE.md` im Repo-Hauptordner. Zuerst `bash setup.sh`.

## Lesereihenfolge für den Bau V8.9
1. `01_uebergabe-bau-v8-9.md` – Auftrag, Reihenfolge, Warnungen (Laserpointer-Zuordnung!).
2. `02_testfeedback-22-11-abend.md` – Technik-Fehler, Übergänge, Start/Ende.
3. `03_testfeedback-23-11-nacht.md` – 14 entschiedene Punkte + Technik/Timing.
4. `04_textentscheidungen-22-11-nacht.md` – alle Textentscheidungen inkl. Nachträge.
5. `05_laserpointer-flashback.md` – Ablauf/Bilder des Flashbacks.
6. `06_textentwurf-heimweg-tuer.md` – Tür-Szene Abschied ohne Lynn.
7. `07_neue-bilder.md` – alle neuen Bilder und Einsatzorte (`quellen/uploads/`, `quellen/uploads/v89/`).
8. `08_v8-8-stand-bau_gekuerzt.md` – Test-Link, offene Entscheidungen zu Start/Ende.
9. `09_ziele.md` – Endziel/Abnahme.

## Arbeitsweise (Philip)
Antworten auf Deutsch, kurz (Nutzungslimit knapp, Fragen bündeln). Philips Ideen bewerten mit: schwach / geht so / gut / sehr gut / hervorragend / Meisterwerk (und sagen, was zur nächsten Stufe fehlt). Feedback zu seinen Texten fair, aber relativ hart. Nur erfundene Namen. Keine Weichzeichner über Bildern, Mia in Montagen nie verkleinern. ElevenLabs nur nach Rückfrage. Texte nur mit Philips Okay ändern (alles in diesen Docs ist sein Okay). Öffentlichen Link (zeigt noch V5) nur mit Philips Okay ersetzen. Besprechen auf Mittel, Bauen auf Hoch.

## Artefakte (gehören Philips Hauptaccount, von einem anderen Account NICHT erreichbar)
Test-Link-Slug `5d6f857a-23db-4da8-8501-add017b70699` (V8.8 + neue Balkon-Schleife), Galerie `26fa13a7-…`, Story-Datei `9d2f17e7-…`. Ein neuer Account muss die Seite aus `spiel/dist/` neu als Artefakt veröffentlichen (`bash setup.sh`, dann `python3 spiel/build.py` bzw. `ABGABE=1 python3 build.py` für die öffentliche Fassung ohne Testsachen).
