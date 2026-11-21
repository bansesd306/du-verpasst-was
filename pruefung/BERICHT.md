# Prüfbericht V8 (21.11.2026, früh – automatische Prüfung)

Grundlage: Commit `1176545` (V8) + `8f8d186`. Skript komplett gelesen, alle 22 Testwege automatisch durchgespielt, alle Spielbilder als Kontaktbogen gesichtet, einzelne Szenen im Browser geknipst.
Abgelehnte/entschiedene Punkte aus `story-entscheidungen-20-11`, `textentscheidungen-19-11`, `story-vorschlaege-v8` wurden nicht erneut vorgeschlagen (z. B. „große Liebe“ bleibt, Monolog „Gar nicht gemerkt“ bleibt, Pausen bleiben).
Philips Story-Datei: `aenderungen` und `notizen` waren leer – nichts doppelt.

Legende: 🔴 kritisch · 🟠 wichtig · 🟡 Feinschliff · ✅ direkt eingebaut

---

## 1. Story-Lücken & Logikfehler

### 🔴 1.1 Afterparty: Lynn ist da – und kommt nicht vor
Auf zwei Wegen geht er **wegen Lynn** zu Tim: „Okay. Ich komm mit.“ (sie hat ihn selbst eingeladen) und Spät-Weg „Mit zu Tim.“ (Jonas: „Die ist vor zehn Minuten mit Tim los.“). In `AFTERPARTY` steht dann kein Wort über sie, am Samstag frotzelt Tim „zu lynn? 😏“. Wer sie eingeladen hat, fragt sich: Wo war sie? Hat er mit ihr geredet?
Das ist eigentlich der stärkste Moment des Wegs (er ist da, sie ist da – und er ist trotzdem nicht bei ihr). Vorschlag (2–3 Boxen, nach „Alle lachen über einen Moment, den ich nicht kenne.“):
- Lynn sitzt auf der anderen Seite. Neben Ben.
- Einmal schaut sie rüber.
- … (2 s)
- Ich schau aufs Handy.
→ BAUPLAN A1. Bild: N28 reicht (Lynn nicht nötig), optional ein Ausschnitt.

### 🟠 1.2 Sonntag Party-Wege: „~ Da. Das bin ich.“ ohne Bild, auf dem er ist
Im Foto-Dump (N32d, N27, N26, N32a) ist er auf keinem Bild – „Da. Das bin ich.“ läuft ins Leere. Auf dem glücklichen Weg widerspricht es zusätzlich „Ich bin auf keinem Foto.“ (Freitagnacht). Zwei Lösungen: (a) ein fünftes Bild mit seiner Schulter am Rand (Gemini-Auftrag G4), oder (b) Text auf den Party-Wegen ändern zu: „~ Wieder nicht drauf.“ … (2 s) – auf dem glücklichen Weg: „~ Brauch ich auch nicht.“ → BAUPLAN A2.

### 🟠 1.3 Samstag, Lynn-Chat-Entwurf passt nicht auf dem „Viel Glück“-Weg
`M4B`, Party-Weg: Entwurf „du warst auf einmal weg“. Auf dem Weg „Ich muss echt nach Hause.“ ist aber **er** gegangen, nicht sie (sie hat ihm sogar „Viel Glück am Montag“ gewünscht). Vorschlag für `vielglueck`: „danke fürs glück wünschen 🙈“ → löscht → „woher wusstest du das mit montag?“ → löscht. Greift „Woher weiß sie das mit Montag?“ auf. → BAUPLAN A3.

### 🟠 1.4 Lynn-Ende: „Ich wollt dir übrigens schreiben. Zweimal. – Hab’s wieder gelöscht.“
Auf genau diesem Weg **hat** sie ihm geschrieben („viel glück 🍀“ und „und? 🙂“). Wer genau liest, stolpert. Vorschlag: „Ich wollt dir am Wochenende schreiben. Zweimal.“ (macht klar: vor dem Montag). → BAUPLAN A4 (Text = Philip).

### ✅ 1.5 „gehst du noch zu tim?“ – woher weiß er von Tims Afterparty?
Weg A mit Flow: Er schreibt Lynn um 23:40 „gehst du noch zu tim?“, hat aber nie von einer Afterparty gelesen (Tims Nachricht kommt nur im Bad). **Eingebaut:** Unter den Benachrichtigungen in `L5` steht jetzt zusätzlich „Lenas Geburtstag 🎂 · Tim: afterparty bei mir später?? 🔥“. Bereitet auch auf dem Spät-Weg Jonas’ „mit Tim los. Afterparty.“ vor.

### ✅ 1.6 Gruppenmitglieder
In der Pizza-Umfrage stimmen Sophie, Max und Leo ab, im Gruppenkopf standen aber nur „Jonas, Lena, Tim, Mia, Lynn, Ben“. **Eingebaut:** Kopfzeile „Jonas, Lena, Tim, Mia, Lynn, Ben, Sophie, Max, Leo“.

### ✅ 1.7 „Ich lern’.“ / „Ich lern.“
Anruf: „Zuhause. Ich lern’.“ – bei Sophie und im Abzeichen „Ich lern.“ ohne Apostroph. **Vereinheitlicht** auf „Ich lern.“

### Geprüft und in Ordnung
- Alle Countdown-Karten stimmen (Fr 20:04 „60 Std.“, Fr 22:45 „58“, Sa 10:32 „46“, Sa 14:20 „42“, Sa 23:10 „34“, So 09:00 „24“, Mo 08:40 „20 Min.“). Fr 11.01. → Mo 14.01. stimmt mit dem Zettel überein.
- Spät-Weg-Zeitregel (Feuerlöscher und Lynns Aufbruch genau 10 Min. vor Ankunft) ist sauber umgesetzt; `@karte auto` verhindert rückwärts laufende Uhren (L10 00:50 → Nacht).
- Paul: Freitag Lerngruppe Fall 12 (Chat „Gestern 21:47“ + Freitag) → Montag „Fall 12 hab ich nur wegen dir gecheckt“ ✓.
- Pizza-Rückgriff: Chat Jonas „12. Juli · bin unten. mach auf 🍕“ passt zu „Nach beiden 5,0 stand er mit Pizza vor meiner Tür.“ ✓
- Keine Sackgassen: alle 22 Testwege erreichen den Abzeichen-Bildschirm. Alle Wahlen führen weiter.
- Wette: Lynn „’nen Zehner reicher“ ↔ Jonas „Schuldet mir übrigens ’nen Zehner“ (Spät) ↔ Lynn-Ende „gegen Jonas“ ✓.

### 🟡 1.8 Kleinere Story-Beobachtungen (Feinschliff, nur Vorschläge)
- `GM_START` setzt die (versteckte) Uhr hart auf 23:25 – bei später Ankunft mit Küche + Tanzfläche liegt die Uhr schon bei ~23:45. Unsichtbar, aber Rückblick/Abspann könnten falsche Zeiten zeigen. Technisch: `@uhr mind 23:25`. → BAUPLAN C1 (sicher, aber ich wollte die Zeitlogik des Lynn-Wegs nicht ohne Sichttest ändern).
- Monolog Lynn-leer („Einfach den Stift zurückgeben.“) – stark. Bleibt.
- Kernbotschaft: kommt an, ohne zu predigen. Die drei „Schauen ist richtig“-Stellen (Lena, Paul, Montag) wirken. Einzige Stelle, die erklärt statt zeigt, ist weiterhin der Monolog „Gar nicht gemerkt“ (bleibt laut Philip).

---

## 2. Bilder

### 🔴 2.1 Sechs Stellen zeigen noch graue Platzhalter mit Code-Schild
Im Spiel sichtbar (geknipst, z. B. Bad: graues Bild mit „N16 – Badezimmer, Spiegel, gedämpftes Licht“):
| Code | Stelle | Wer sieht es |
|---|---|---|
| **N06** | Aufbruch: „Ich zieh das Shirt aus …“ | **alle Party-Wege** |
| **N07** | Aufbruch: „Passt. Glaub ich.“ | **alle Party-Wege** |
| **N16** | Bad: „Ich schließe ab. Hier ist es leiser.“ | **alle Party-Wege außer Spät/Lynn** |
| **N30** | Küche: Tims Bier, kaputte Flasche | alle mit Küche |
| **AO4** | Abschied ohne Lynn: Blick zurück | Wege ohne Balkon |
| **N29b** | „Nur kurz auf den Balkon.“ (leer, zwei Becher) | Abschied ohne Lynn |
Zusätzlich mit Ersatzbild (kein Platzhalter, aber nicht das gemeinte Motiv): L7 (→ N31d dunkel), TORTE (→ N13L), N32c (→ B12A), N32e (→ N13).
Ziel „Keine Platzhalter“ ist damit **nicht erfüllt**. Gemini-Aufträge: BAUPLAN G1–G6. Notlösung, falls die Zeit fehlt: N06/N07 schwarz mit Tönen (Bügel, Reißverschluss sind schon da), N30 schwarz (Glas-Ton trägt), AO4 → H36b, N29b → N29 (zwei Becher, Lynns Story-Bild als Querformat-Ausschnitt). → BAUPLAN B1.

### 🟠 2.2 N25V: „Flur vor dem Prüfungsraum“ ist derselbe Saal wie der Prüfungsraum
N25V zeigt dieselbe Halle (Holzdecke, Rundbogentür, Fenster links) wie N25/N25L, nur mit Leuten auf dem Boden. Wirkt, als warte man **im** Prüfungsraum. Neuer Auftrag G7 (echter Flur mit geschlossener Tür „Hörsaal …“/Raumschild) oder N25V stärker beschneiden (nur Leute mit Karteikarten, ohne Decke/Tür).

### 🟠 2.3 Sonntag: Regen-Ton, aber Sonne im Fenster
`SO` und `SB` spielen `@loop regen an`, die Bilder SO, SO1a–c zeigen blauen Himmel mit Sonne. Entweder Regen-Loop raus (Sonntag still, nur Uhr) oder SO1a–c grau/bedeckt nachgraden (ohne Weichzeichner, nur Farbe/Helligkeit, Fenster-Ausschnitt). → BAUPLAN B2.

### 🟡 2.4 Kleinere Bild-Beobachtungen
- Lynn: im Seminar (N38a–N38) mit Brille und Stern-Haarspange, auf der Party und im Restaurant ohne beides. Lässt sich erklären (Kontaktlinsen), fällt aufmerksamen Spielern aber auf. Ggf. die Spange in N14/LD1 per Gemini ergänzen (G8, optional).
- N34/N34b: Lynn von hinten wirkt eher braun- als schwarzhaarig (nachts okay).
- N28 (Tims Wohnzimmer) sieht fast aus wie Lenas Party (gleiche Lichterketten). Text sagt „Ein anderes Wohnzimmer.“ – optional anderer Look (blaueres Licht, Sofa, weniger Lichterketten).
- N12: beide Stockwerke voller Partyfenster – Lena feiert scheinbar im ganzen Haus. Passt zu „Die Fenster sind ganz bunt“, ist aber übertrieben; okay lassen.
- BR (Balkon allein) hat Ziegelwand und andere Brüstung als N14/N15 – anderer Balkon. Nur bei genauem Hinsehen.
- Lenas Haarfarbe in älteren Bildern (bekannt, siehe v8-stand-bau).
- Stil insgesamt einheitlich (halb realistisch, glatt). Ausreißer: N03/L4 (Zettel-Nahaufnahmen) sind etwas „malerischer“, fällt nicht störend auf. KI-Schrift ist nur auf N25B sichtbar (Handschrift unleserlich – passt, weil schnelle Klausurschrift).
- Zuschnitt Handy hochkant: noch zu prüfen in Abschnitt 6.

---

## 3. Technik

### 🔴 3.1 Arbeitsspeicher: alle Töne werden komplett entpackt (~800 MB)
`Ton.init()` lädt und dekodiert beim ersten Klick **alle 63 Tondateien** (zusammen ~35 Minuten Audio). Entpackt sind das bei 48 kHz Stereo rund 800 MB. Gemessen (Chrome, `pruefung/skripte/mem.py`): Renderer-Speicher vor dem Klick ~530 MB, 5–30 s danach ~1 540 MB. Am Laptop geht das, **auf iPhones kann Safari den Tab neu laden** (Spiel startet von vorn). Das passt auch zur Beobachtung, dass Chrome beim parallelen Hochskalieren abstürzt. Außerdem lädt man so am Handy sofort 35 MB über mobile Daten. → BAUPLAN T1 (Nachladen pro Kapitel + Mono für Raumtöne). **Bitte als Erstes am eigenen iPhone einen ganzen Party-Weg spielen.**

### ✅ 3.2 iPhone-Stummschalter
Web Audio bleibt am iPhone stumm, wenn der Stumm-Schalter an ist – viele Testspieler hätten dann gar keinen Ton. **Eingebaut** (`audio.js`, `init`): `navigator.audioSession.type = 'playback'` (Safari 16.4+, ältere Geräte ignorieren es gefahrlos).

### Geprüft und in Ordnung
- **Alle 22 Testwege** laufen bis zum Abzeichen-Bildschirm, **keine Konsolenfehler**. Nicht besucht werden nur die toten Sprungmarken `B_LAEHM_HIN/BLEIB` und `S4_LIVE_LOESCHEN` (Live-Kommentar löschen; Code identisch mit dem getesteten Lena-Löschen).
- **Fehlende Dateien:** keine. Einziger 404 ist `favicon.ico` (lokal, auf dem Artefakt egal).
- **Schnelles Mehrfachklicken:** 1 500 Klicks im 25-ms-Takt + beide Wahlknöpfe gleichzeitig doppelt angeklickt (L3, Balkon, M5): kein Hänger, nur eine Wahl zählt, Handy-Punkte stimmen.
- **Offline:** keine externen Adressen in `index.html` (Schriften lokal) – läuft ohne Internet, sobald die Dateien da sind.
- **Größe:** `index.html` 369 KB, Bilder 14 MB, Töne 35 MB, Videos 2 MB (gesamt ~51 MB). Bilder werden nach Bedarf geladen.
- **Hochformat:** zeigt „Bitte drehen – das Spiel läuft im Querformat.“ ✓

### Spieldauer pro Weg (V8, automatischer Lauf)
`vz` = Tippzeit + Pausen + 1 s je Box (Engine-Messung). „geschätzt“ = vz + 1,5 s Lesen je Box + 3 s je Entscheidung.
| Weg | vz (Min.) | Boxen | Wahlen | geschätzt (Min.) | Ende |
|---|---|---|---|---|---|
| A2 Flow, Handy weg | 11,1 | 157 | 13 | **15,6** | zuhause · Pizza |
| A3 ohne Flow zu Hause | 11,5 | 141 | 16 | **15,8** | zuhause |
| S3 spät → Tim | 11,2 | 178 | 17 | 16,5 | Afterparty |
| A1 Flow zu Hause | 12,2 | 163 | 17 | 17,2 | zuhause |
| S4/S5 umgedreht | 12,3–12,4 | 170–174 | 17–20 | 17,6 | zuhause |
| C6 „Doch bleiben“ | 12,6 | 160 | 19 | 17,5 | zuhause |
| S1/A6 spät heim | 12,6–12,8 | 188 | 19 | 18,2–18,4 | Party |
| B1–B3 Weg B | 13,3–14,1 | 154–156 | 20–21 | 18,2–19,0 | zuhause |
| C1, C3, A5 Afterparty | 12,6–13,2 | 210–232 | 15–21 | 18,6–19,8 | Afterparty |
| C2 Gar nicht gemerkt | 13,7 | 244 | 22 | 20,9 | Lynn-Ende |
| C4, C7, B4 Party | 14,6–15,0 | 232–241 | 18–22 | 21,3–21,9 | Party |
| A4, C5, B5 Party lang | 16,1–17,8 | 245–267 | 24–25 | 23,9–25,7 | Party |
**Kein Weg unter 14 Minuten** (kürzester ≈ 15½ Min. bei echtem Lesen). Ziel „um die 20“ erreichen die Party-Wege, die Zuhause-Wege A liegen bei 15–17.

## 4. Animationen (Stichprobe: Start, Menü, K1, Balkon, Montag, Bad, Lynn-Ende)
- Grundsätzlich reich animiert (Zeitraffer, Gesichts-Overlays mit Blinzeln/Sprechen für Jonas, Lena, Mia, Lynn; Karten-Ziffern, Stroboskop, Traumfilter, Handy-Wackeln). Keine Ruckler oder Fehler in den Stichproben.
- 🟠 Die sechs Platzhalter (2.1) sind gleichzeitig die einzigen Stellen ohne jede Bewegung – mit Bildern lösen sich auch diese.
- 🟡 Prüfung „Uhr läuft schnell bis 11:50“: N25 → N25L ist eine Überblendung; schöner wäre ein Zeitraffer mit 2–3 Zwischenstufen (Leute verschwinden nacheinander) – geht mit N25 + Overlay-Masken ohne neue Bilder, Ton „Stühle rücken“ dazu.
- 🟡 Lynn-Ende: die rote Mine (LD3) erscheint als Gesichts-/Bild-Overlay. Ein kurzes Hineinschieben von rechts (0,6 s, `translateX`) würde die Geste „Sie schiebt etwas über den Tisch“ zeigen statt nur erscheinen lassen.
- 🟡 Tim (TV1/TV2/TVn) hat kein Blinzeln (TV3 existiert als Overlay, ist aber nirgends benutzt).

## 5. Töne
### ✅ 5.1 Lautstärken angeglichen (gemessen in LUFS)
| Ton | vorher | nachher | Grund |
|---|---|---|---|
| `party_club2` (Abschied, Tim) | vol 1 → −9 LUFS, Spitzen +3,4 dB (übersteuert) | **vol .6** → ≈ −13,5 | war 7 dB lauter als die Partymusik M1 (−16), Sprung beim Abschied; Übersteuern weg. Bleibt bewusst etwas lauter. |
| `muffled_party` (Startbildschirm) | vol 1 (×.9) → ≈ −8 LUFS | **vol .5** → ≈ −13 | Menü war lauter als das ganze Spiel. |
Zurücknehmen: in `spiel/bilder.js` bei `TOENE` die beiden `vol`-Werte wieder auf 1 setzen.
### Geprüft
- Schleifen: alle Dateien beginnen und enden bei Pegel ~0 → kein Knacken an der Nahtstelle (ob eine hörbare „Delle“ entsteht, wo eine Datei aus- und einblendet, konnte ich nicht hören – bitte bei `halle`, `raum_tag`, `wind` mal 2 Min. stehen lassen).
- Weitere Ausreißer: `anruf` (Klingel, −10,5 LUFS) lauteste Datei – als Anruf vertretbar, BAUPLAN C2. `restaurant_lofi` und `mia` sind im Code schon passend gedämpft.
- Fehlende Töne: Liste im BAUPLAN („Töne zum Selbersuchen“).

## 6. Bedienung
- Querformat Handy (844×390): Bild als 16:9 mit schwarzen Rändern, alles sichtbar, Knöpfe oben links erreichbar. Mit offenem Handy wird die Textbox schmal, Schrift ~13 px – lesbar, aber klein (BAUPLAN C3).
- Hochformat: Dreh-Hinweis ✓. Startbildschirm und Menü gut lesbar.
- Zurück-Knopf („Hättest du wohl gern, oder?“) ist Absicht; schnelles Antippen erzeugt keine Fehler.

## 7. Abgabe
### ✅ Abspann ergänzt (`@text credits` in story.txt)
- Musik: „Muffled Party“ (mccrunchy) fehlte (läuft im Startbildschirm) → ergänzt.
- „Mias Lied: KI-generiert“ ergänzt.
- Schriften mit Lizenz ergänzt: Bricolage Grotesque, Caveat, Patrick Hand, Reenie Beanie (SIL Open Font License), Permanent Marker (Apache 2.0) – Google Fonts.
- Noch offen (Philip weiß es): Quelle der Happy-Birthday-Bar-Aufnahme (`lied.mp3`), mit welchem Werkzeug Mias Lied gemacht wurde (BAUPLAN C5).
### ✅ Start-Hinweis
„Kopfhörer, Ton an, Querformat“ → „Kopfhörer, Ton an, Querformat · ca. 20 Minuten“. Thema bewusst nicht ergänzt (Geschmack, BAUPLAN A5).

## 8. Feinschliff
- Pausen: keine Stelle gefunden, an der zwei nicht wegtippbare „…“-Boxen direkt hintereinander ohne Grund stehen (L10 „… !4 / … !3“ ist mit Herzschlag gewollt).
- Sprache: Haupttext sauber, Jugendsprache stimmig („Wegen dem Wetter“, „handel ich ihm … raus“ bewusst gelassen). Chats nicht angefasst.

---

## Direkt eingebaut (V8.1) – alles zum Zurücknehmen

| Datei / Zeile | alt | neu |
|---|---|---|
| story.txt Z. 43 | `@text start_hinweis = Kopfhörer, Ton an, Querformat` | `… Querformat · ca. 20 Minuten` |
| story.txt Z. 70 (Abspann) | „… „Warm“ (Andrii G.) – Pixabay // <b>Geräusche:</b> …“ | „… „Warm“ (Andrii G.), „Muffled Party“ (mccrunchy) – Pixabay // <b>Mias Lied:</b> KI-generiert // <b>Geräusche:</b> … // <b>Schriften:</b> Bricolage Grotesque, Caveat, Patrick Hand, Reenie Beanie (SIL Open Font License), Permanent Marker (Apache 2.0) – Google Fonts //“ |
| story.txt Z. 72 (Gruppenkopf) | `Jonas, Lena, Tim, Mia, Lynn, Ben` | `Jonas, Lena, Tim, Mia, Lynn, Ben, Sophie, Max, Leo` |
| story.txt Z. 754 (Anruf) | Ich: „Zuhause. Ich lern’.“ | Ich: „Zuhause. Ich lern.“ |
| story.txt nach Z. 881 (L5, neu) | – | `@benachrichtigung WhatsApp \| Lenas Geburtstag 🎂 \| Tim: afterparty bei mir später?? 🔥` |
| bilder.js TOENE | `party_club2 … vol: 1`, `muffled_party … vol: 1` | `vol: .6`, `vol: .5` |
| audio.js `init()` | – | `navigator.audioSession.type = 'playback'` (iPhone-Stummschalter) |

Story-Dokument (Claude-Doc): Die Änderungen betreffen Abspann, Startzeile, Gruppenkopf, eine Benachrichtigung und ein Apostroph – siehe Hinweis in FORTSCHRITT, ob sie dort eingetragen wurden.
