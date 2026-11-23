# ÜBERGABE (Stand 23.11., 23:15) – für einen neuen Chat/Account HIER ANFANGEN
Repo `bansesd306/du-verpasst-was`, Zweig `v8-9-etappe5` (enthält alles; `main` ist älter, Merge nur auf Philips Go). Zuerst `bash setup.sh`, dann CLAUDE.md lesen.
Hinweis: Die Projekt-Docs (`claude/…`) und Artefakte (Test-Link, Story-Datei, Galerie, Protokoll-DB) gehören dem ALTEN Account und sind im neuen Account nicht sichtbar. Alles Nötige steht deshalb hier. `spiel/story.txt` ist die Wahrheit für alle bereits gebauten Texte.

## Regeln (Philip)
Antworten auf Deutsch, kurz. Bei jeder Option sagen, welche am wenigsten Limit kostet. Bei Bildthemen immer Referenzbilder mitschicken. Gemini-Bildaufträge im festen Format (Pakete à 2–4 Bilder, Ablauf-Text „I attached N reference images …“, Anhänge nach Nummer, „Speichern als: CODE.jpg“, Referenzbilder vorher als Dateien schicken; Lena hellblond, Mia pinke Haare, Lynn dunkel mit Pony; Stil-Absatz: semi-realistic 3D render, polished visual novel CG style, 16:9, no text). Texte nur mit Philips Okay, nur erfundene Namen, keine Weichzeichner über Bildern, Mia in Montagen nie verkleinern, ElevenLabs nur nach Rückfrage. Feedback zu Philips Texten fair, aber relativ hart; Ideen bewerten: schwach / geht so / gut / sehr gut / hervorragend / Meisterwerk (mit Hinweis, was zur nächsten Stufe fehlt). Modell: Philip nutzt Sonnet Mittel zum Besprechen; Hoch nur für die großen Blöcke – sag Bescheid, wann umzustellen. VOR dem Veröffentlichen immer ansagen (lädt offene Seiten neu, bricht seinen Testlauf ab). Öffentlicher Link (zeigt noch V5) nur mit Philips Okay ersetzen. Abgabe: Mo 30.11. Inhaltsstopp Do 26.11. Danach nur noch Fehler.

## Stand Etappe 5b (Commit 4bc785c + Folgecommit)
Gebaut: Mama einmal vor dem Haus (W4, Flag `mama`); Lynn-Posen neu (`proc/v90_lynn.py`); Lynn-Blinzeln nur Augen-Overlay `N14zo`; Mia-Lichtshow ohne Spiegeln; Mia „Wow. Wie nett.“ + Pause, N35n → N35s langsam; Mia zwinkert nur kurz (N35fz → N35f); Ladebalken bei Pausen ausgeblendet (CSS `#sperre.an{opacity:0!important}`); Sprungmenü mit Reitern + lesbaren Titeln (159 Szenen); Fehlerfeld mit Mikrofon-Knopf; Overlays werden vorgeladen. t8 (alle 23 Wege) ohne Fehler.
Test-Link (Slug `5d6f857a-23db-4da8-8501-add017b70699`, ALTER Account) zuletzt veröffentlicht 23.11. 23:05 = Version 1795471401-20a0 = dieser Stand. Lena-Blinzeln (N13L) ist jetzt nur die Augenpartie (Haarfarbe/Kopf springen nicht mehr).
Philip entschied: KEIN zusätzlicher Dialog nach „Wow. Wie nett.“ (zu offensichtlich).

## Noch offen – Fragen an Philip
- Zweites Lena-Selfie (LENA_SELFIE kommt in S3 und in der Paul-Szene auf demselben Weg doppelt; Code/Datei von Philip oder neu generieren; B07 nicht nehmen).
- „Doch noch mal rein“ an der Tür bei Ausgängen vor ca. 23:30?
- N15 (leerer Balkon nach Lynns Gehen) bleibt (Empfehlung) oder streichen.
- Gemini-Bilder Mia-Mund (N35n, N35s, N35d, N35be, N35t, evtl. MIA_GRINST_c) – erst Mundanimation testen. Lampe taucht in N35d plötzlich im Hintergrund auf (Gemini-Edit: Lampe entfernen).

## Noch offen – bauen
- ⚑ z163 Stempel: 5,0 zuerst nicht sichtbar, Stempel auf genau die Stelle, dann 5,0 unten rechts.
- Anruf-Bildschirm (z803): echter Anruf-Screen, grün = Rangehen, rot = Ablehnen, kleiner Knopf oben = wegdrücken (Ton läuft aus, Weg wie „Ablehnen“, kein neuer Text); Klingelton penetranter.
- Handy-Knopf: beim Blick immer genaue Zahl der Benachrichtigungen (alle Apps); ungelesene bleiben auf dem Sperrbildschirm (Android-Vorlage: gestapelte abgerundete Karten, Uhrzeit groß, unten „Löschen“; `quellen/vorschau/ref_sperrbildschirm_android.jpg`). Instagram-Sperrbildschirm: bessere Benachrichtigungen, Statusleisten-Icons, Sperrbild (Gruppenfoto oder Nacht-Hintergrund, Philip wählt).
- Storys laden zu spät (Weiterscrollen, Samstag), etwas länger zeigen. Weg B Shutdown (Z. ~900): Nachrichten langsam beginnen, immer schneller, Vibrieren lauter. Lichter im Haus gegenüber (K12N → N02D; K12 dunkel heller, Hauslichter aus, bleiben aus).
- Schreibsound läuft ins nächste Bild (Sonntag); Uhr Sonntagnacht schnell mitlaufen (09:00 → 22:40 nicht springen); Jubel/Party-Sound bricht beim Handy-Blick ab (ausklingen lassen); Vibrieren vor der Nachricht (bekannt, Sonntag); Montag: Pause vor dem Wecker länger; Lied `lied_neu_tuer.mp3` an der Tür.
- Torte/Becher-Video (Becher hochwerfen sieht komisch aus); z1386 „Musik aus nur wegen Test-Skip?“ prüfen; z511 Instagram zeigt oben anderes Bild; N38c Ausschnitt zu nah (Vorschau `quellen/vorschau/N38c_ausschnitte.jpg`); LP3z-Blinzeln; `@einmal`-Block; t8-Prüfung auf Doppelbilder und doppelte Chat-Nachrichten; Mama-Chat-Reihenfolge visuell prüfen.
- Moritz-Aufnahme, Lernkarten Sonntag, optional Katerfrühstück-Story (siehe CLAUDE.md „Offen nach V8.7“).

## Veröffentlichen/Abgabe
`ABGABE=1 python3 build.py` baut die öffentliche Fassung (ohne Test-Werkzeuge). Test-Fassung: `python3 build.py`. Alle Dateien aus `spiel/dist/` hochladen (Overlay-Bilder werden dynamisch geladen). Im neuen Account braucht es ein NEUES Artefakt (neuer Link; Protokoll-DB beginnt leer). Ziel am Ende: öffentlicher Link zeigt die fertige Version.
