# Bau-Plan nach der V8-Prüfung (für den nächsten Bau)

Reihenfolge = Wichtigkeit. Jede Zeile ist ein fertiger Auftrag. Texte in „…“ sind Vorschläge – Philip entscheidet (Story-Datei oder Chat).
Schon direkt eingebaut (V8.1): siehe `BERICHT.md`, Abschnitt „Direkt eingebaut“.

## 🔴 Zuerst (vor jedem Test mit anderen Leuten)

**T1 – Speicher: Das Spiel lädt ~35 Min. Audio komplett entpackt in den Arbeitsspeicher (≈ 800 MB).**
Gemessen in Chrome: Renderer-Speicher springt nach dem ersten Klick von ~0,5 auf ~1,5 GB. Auf iPhones (Safari) droht „Diese Webseite wurde neu geladen“ mitten im Spiel. Erst Philip am eigenen iPhone einen kompletten Party-Weg spielen lassen. Bau-Lösung (in dieser Reihenfolge, jeweils testen):
1. Lange Dateien (> 40 s: Outro, M1_party, M3_spaet, lofi_melancholy, restaurant_lofi, ende_warm, raum_tag, halle, muffled_party, wind, mia_lied, party_fern, gemurmel2, strasse, gemurmel, regen) **nicht** in `Ton.init()` vorladen, sondern bei Kapitelbeginn (`@kapitel`) die Musik/Loops des Kapitels laden und die des vorigen Kapitels freigeben (`delete P[k]; delete ladend[k]`). `loop()` kann schon nachladen; `musikStart`/`outro` brauchen dasselbe `lade(k).then(…)`-Muster wie `intro()`.
2. Raumton-Loops (raum_tag, halle, wind, regen, gemurmel*, party_fern) nach dem Dekodieren in Mono umrechnen (halbiert den Speicher, hörbar egal bei Raumton). Keine mp3 neu kodieren (Encoder-Lücke → Knacken in Schleifen).
3. Ziel: < 300 MB Audio gleichzeitig. Messen mit `pruefung/skripte/mem.py` (Renderer-RSS vor/nach dem ersten Klick).

**B1 – Sechs graue Platzhalter mit Code-Schild** (N06, N07, N16, N30, AO4, N29b) – Bilder machen (Gemini-Pakete A–C unten). Notlösung, falls die Zeit fehlt (alles sicher, ohne Text):
- N06, N07 → `@schwarz` (Bügel- und Reißverschluss-Ton tragen die Szene)
- N30 → `@schwarz` bleibt einfach stehen (der Glas-Ton trägt), oder N13 mit `@effekt wackeln`
- N16 → Ersatz N09 dunkel geht nicht (falscher Ort) → besser schwarz mit gedämpfter Musik
- AO4 → `H36b`, N29b → `BR`

## 🟠 Story (Philip entscheidet den Wortlaut)

**A1 – Afterparty: Lynn kommt nicht vor** (`AFTERPARTY`, nach „Alle lachen über einen Moment, den ich nicht kenne.“, nur wenn `lynn=="geschaut"` oder Ankunft > 23:30):
- Lynn sitzt auf der anderen Seite. Neben Ben.
- Einmal schaut sie rüber.
- … (2 s)
- Ich schau aufs Handy.
(Ohne Bild-Neubau. Zahlt auf Tims „zu lynn? 😏“ und „Da hinten. Das bin ich. Glaub ich.“ ein.)

**A2 – Sonntag Party-Wege „~ Da. Das bin ich.“** – auf keinem Dump-Bild ist er zu sehen. Entweder Bild mit seiner Schulter (Paket B, Task 4) oder Text: Party-Wege „~ Wieder nicht drauf.“ / glücklicher Weg „~ Brauch ich auch nicht.“

**A3 – Samstag Lynn-Entwurf auf dem „Viel Glück“-Weg** (`M4B`, `vielglueck`): statt „du warst auf einmal weg“ → „danke fürs glück wünschen 🙈“ (löscht) → „woher wusstest du das mit montag?“ (löscht) → „hey“ (löscht).

**A4 – Lynn-Ende** „Ich wollt dir übrigens schreiben. Zweimal.“ → „Ich wollt dir am Wochenende schreiben. Zweimal.“ (sie hat ihm auf diesem Weg ja „viel glück“ und „und?“ geschrieben).

**A5 – Start-Hinweis mit Thema?** Jetzt: „Kopfhörer, Ton an, Querformat · ca. 20 Minuten“. Der Prüfauftrag will auch das Thema. Vorschlag (leise, ohne Spoiler) in der zweiten Zeile: „Ein Spiel über FoMO – die Angst, etwas zu verpassen.“ Oder bewusst nur im Abspann/Video.

## 🟠 Bilder

**B2 – Sonntag: Regen-Ton, Sonne im Fenster** (SO, SO1a–c): entweder `@loop regen an` in `SO`/`SB` streichen (Uhr-Ticken reicht), oder SO/SO1a–c nachgraden (Fenster grau, Licht kühler, nur Farbe – kein Weichzeichner).
**B3 – N25V „Flur“ ist der Prüfungssaal selbst** → neues Bild (Paket C, Task 3).
**B4 (optional)** – Lynn trägt im Seminar Brille + Stern-Spange, auf der Party/im Restaurant nicht. Per Gemini-Edit die Stern-Spange in N14 und LD1 ergänzen (dann passt es ohne Brille).
**B5 (optional)** – N28 (Tims Wohnzimmer) sieht wie Lenas Party aus. Edit: anderes Licht (kühleres Blau/LED-Streifen), dunkles Sofa, keine Lichterketten.

## 🟡 Technik / Feinschliff (sicher, beim nächsten Bau)
- C1 – `GM_START`: `@uhr 23:25` → `@uhr mind 23:25` (versteckte Uhr läuft sonst bei später Ankunft rückwärts; nach Änderung C2 einmal spielen).
- C2 – Telefon-Klingel (`anruf`, −10,5 LUFS) ist der lauteste Ton im Spiel. Ggf. Loop-Lautstärke `klingel` 1 → .7.
- C3 – Textbox am Handy quer bei offenem Handy nur ~13 px Schrift. Mindestgröße für kleine Bildschirme (`@media (max-height: 430px)`: Textbox-Schrift ≥ 15 px).
- C4 – Stoppuhr (Testmodus) nach dem Ende entfernen (steht schon in v8-stand-bau).
- C5 – Abspann: Quelle von `lied.mp3` (Bar-Aufnahme Happy Birthday) und Werkzeug für Mias Lied nachtragen (Philip weiß, woher).
- C6 – Alte Sprungmarken `B_LAEHM_HIN`/`B_LAEHM_BLEIB` löschen (werden nie erreicht).

## Töne zum Selbersuchen (Pixabay, Suchbegriffe)
| Wo | Ton | Suchbegriff |
|---|---|---|
| Montag „Er hält den Knopf gedrückt. Display schwarz.“ | kurzer Ausschalt-Ton / Haptik | „phone power off“, „phone shutdown sound“ |
| Lynn-Ende, rote Mine über den Tisch | Plastik über Holz schieben | „slide object wooden table“ |
| Pizza-Ende N37 | Pizzakarton | „pizza box open“, „cardboard box“ |
| Prüfung N25 → N25L (Zeitraffer) | Stühle rücken, Schritte, Tür | „chairs moving classroom“, „exam hall people leaving“ |
| Sonntag (wenn Regen bleibt) | Regen am Fenster innen | „rain on window inside room“ |
| Wut-Geräusche (alte Idee) | Faust auf Matratze/Tisch | „punch pillow“, „fist hit table“ |
| Aufbruch N06 | Kleiderbügel/Schranktür | „wardrobe door open“, „clothes hanger“ |

## Gemini-Aufträge (Referenzbilder liegen in `pruefung/gemini/`, Dateiname = Reihenfolge)

### Paket A – Zimmer, Aufbruch (N06, N07)
**Anhängen (in dieser Reihenfolge):** 1. N09, 2. N08

```
I attached 2 reference images, numbered in the order I uploaded them. Below are several image tasks. Create ONLY task 1 now. When I write ‚weiter‘, create the next task. If I ask for a change instead, change the image you just made and stay on that task.

Task 1 – N06: Same room as attached image 1, same style, same evening lighting from the desk lamp. First-person view standing in front of an open wooden wardrobe: a few shirts and hoodies on hangers, one black t-shirt hanging slightly crooked, a messy pile of clothes on the shelf below. My hand reaches for a hanger: realistic hands, five fingers, same sleeve as in attached image 2. No face visible. Style: semi-realistic 3D render in a polished visual novel CG style, smooth clean shading, slightly stylized realistic proportions, soft cinematic lighting, natural colors. Clearly a 3D render, not a photo, not anime, not Pixar. 16:9 landscape. No text, no letters, no logos, no watermark.

Task 2 – N07: Same room and lighting as attached image 1. First-person view looking down at my own outfit: dark jeans, a plain dark shirt, white sneakers on the wooden floor, a sock lying next to them. Only body from chest down visible, no face, no mirror. Realistic hands, five fingers. Same style as task 1. 16:9 landscape. No text, no letters, no logos, no watermark.
```

**Speichern als:** Task 1 → `N06.jpg`, Task 2 → `N07.jpg`

### Paket B – Party (N16, N30, AO4, optional Foto mit Schulter)
**Anhängen (in dieser Reihenfolge):** 1. N36, 2. A1, 3. N13

```
I attached 3 reference images, numbered in the order I uploaded them. Below are several image tasks. Create ONLY task 1 now. When I write ‚weiter‘, create the next task. If I ask for a change instead, change the image you just made and stay on that task.

Task 1 – N16: The small bathroom of the apartment from attached image 1, same style, same old building. Door closed, muted cold light from one ceiling lamp, a little pink party light leaking in under the door. Sink with a mirror; the mirror is seen at an angle and shows only tiles and a towel, no person, no reflection of anyone. A few cups and a phone charger on the sink edge, a fogged window. Quiet, slightly lonely mood. Style: semi-realistic 3D render in a polished visual novel CG style, smooth clean shading, soft cinematic lighting, natural colors. Clearly a 3D render, not a photo, not anime, not Pixar. 16:9 landscape. No text, no letters, no logos, no watermark.

Task 2 – N30: Close-up on the living room floor of the party from attached image 1: a broken brown beer bottle on a patterned rug, beer soaking into the rug, shards, a few confetti pieces, red party cups nearby. Pink and warm party light, shallow depth of field, feet of people at the edge of the frame. Same style as task 1. 16:9 landscape. No text, no letters, no logos, no watermark.

Task 3 – AO4: Same apartment as attached images 1 and 2, same lighting, later in the night. View from the hallway back through the living room towards the open balcony door at the far end. The living room is half empty, confetti and cups on the floor, a few people dancing in the middle; through the balcony door you see the string lights on the railing and the dark city, nobody on the balcony. Same style as task 1. 16:9 landscape. No text, no letters, no logos, no watermark.

Task 4 – N32s (optional): Party photo in the kitchen from attached image 3, taken with a phone flash: the blonde young woman from attached image 3 laughs with two friends holding red cups. At the very left edge of the frame only the shoulder and arm of a young man in a dark shirt are visible, cut off, no face. Flash look, slightly overexposed, like a real party snapshot. Same style as task 1. 16:9 landscape. No text, no letters, no logos, no watermark.
```

**Speichern als:** Task 1 → `N16.jpg`, Task 2 → `N30.jpg`, Task 3 → `AO4.jpg`, Task 4 → `N32s.jpg`

### Paket C – Balkon leer und Flur vor der Prüfung (N29b, N25V)
**Anhängen (in dieser Reihenfolge):** 1. N15, 2. N29, 3. N25

```
I attached 3 reference images, numbered in the order I uploaded them. Below are several image tasks. Create ONLY task 1 now. When I write ‚weiter‘, create the next task. If I ask for a change instead, change the image you just made and stay on that task.

Task 1 – N29b: Edit attached image 1: add two red party cups standing on the balcony railing, like in attached image 2, one slightly in front of the other. The balcony stays empty, no people. Change nothing else. 16:9 landscape.

Task 2 – N25V: A corridor in the same old university building as attached image 3, same style, same cold morning daylight. Long hallway with stone floor and tall windows on the left, a closed heavy wooden double door at the end (the exam room). Students in winter jackets wait along the wall, some sitting on the floor, flipping through index cards, one with headphones, one pacing. Nervous, quiet morning mood. Realistic hands, five fingers. Style: semi-realistic 3D render in a polished visual novel CG style, smooth clean shading, slightly stylized realistic proportions, soft cinematic lighting, natural colors. Clearly a 3D render, not a photo, not anime, not Pixar. 16:9 landscape. No text, no letters, no logos, no watermark.
```

**Speichern als:** Task 1 → `N29b.jpg`, Task 2 → `N25V.jpg`

Fertige Bilder einfach in den Chat schicken – Claude baut sie ein und erneuert die Galerie.
