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
