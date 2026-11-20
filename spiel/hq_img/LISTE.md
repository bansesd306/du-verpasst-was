# Hochskalieren: Auswahl (Stand 20.11.)

Grundlage: alle im Spiel benutzten Bilder aus `claude/bilder-liste.md`, in voller Größe (`spiel/dist/img/CODE.webp`) angesehen.
Ehrliche Einschätzung vorweg: Die meisten Bilder sind im Vollbild ausreichend scharf. Matschig wirken vor allem Szenen mit viel Kleindetail (Papier, Bücher, Wandtexturen).

## Auswahl (wird hochskaliert)

| Code | Begründung | Status |
|---|---|---|
| L4 | Schreibtisch: Papier- und Buchtext, Stifte, Dosen verschmiert; Detail wirkt „gemalt“ | fertig |
| SO | Bett bei Tag: Wand-, Stoff- und Regaltexturen weich, wirkt plastikartig | fertig |
| N09 | Weitwinkel Zimmer: Bücher, Papiere, Regal, Fensterblick nur Fleck | fertig |
| N03 | Zwei Klausuren: Text auf den Blättern und Zetteln unleserlich-weich | fertig |
| B05 | Schreibtisch mit Kalender/Zetteln: Papiertext weich | fertig |
| L4b | Offenes Fenster: Dachziegel/Fassade weich, leichte Videokompression | fertig |
| N1 | Bett nachts: Stofffalten und Regal weich (dunkel, Gewinn eher klein) | fertig |

## Bewusst gelassen

- **Absichtlich unscharf (Tiefenunschärfe/Stilmittel):** N15, N35w, B09, N28 (Handyfoto, absichtlich verwaschen, Farbartefakte kämen nur schärfer heraus).
- **Gesichts-/Nahaufnahmen, im Vollbild scharf genug:** B12, B12A, B12B, B12L, B12T, N13, N13L, N14, N14g, LNL, N19, N20, N35b, N35c, N35cL, N35d, N35f, N35fz, N35n, N35s, N35t, N35be, N35M1, N35M2, N32b, MM01–MM09, MK1–MK3 (Mia-Montagen; Hintergrund absichtlich unscharf).
- **Straße/Außen, scharf genug:** B10, B14, B15 (schon fertig), BR, K12, N11, N12.
- **Party-Hub/Küche, scharf genug:** A1, HB1, N32d, N32dA, N32dC, N32dP, N33, N36, N36L, N31a–N31d, SO1a–SO1d (Spielfassung ok).
- **Dunkle Flurbilder (viel Schwarz, Skalieren brächte kaum etwas):** FL1, FL2, FL3, N17, N18, N20, N21, SP1, T, N08.
- **Sonstige:** N25 (Prüfungsraum, scharf genug), N26 (Handyfoto, wird nur klein im Handy gezeigt), B07, APS (Handy-Bilder, 810×1080).
- **Gesichts-Overlays** (kleine Dateien wie N19z, B12Az …) werden vom Skript automatisch mit dem Hauptbild skaliert.

## Ergebnisse

Alle 7 Bilder fehlerfrei gerechnet (Ähnlichkeit zur Spielfassung ≥ 0,998, jeweils ca. 4,5 Minuten), Größe unverändert 1920×1072.
Quelle: L4b aus dem Original-Upload, alle anderen aus der Spielfassung (Original passte nicht eindeutig).

- **Deutlich besser:** N09 (Kanten, Zettel, Lampe), L4 (Tasse, Stift, Spirale), L4b (Dachziegel/Fassade).
- **Moderat:** SO, N1, B05.
- **Mit Vorbehalt:** In L4, N03 und B05 werden kleine Papiertexte zu härteren, strichartigen Linien (Skalierer „erfindet“ Schrift). Im Vollbild unauffällig, bei 1:1-Zoom sichtbar. Falls das stört: im Spiel die Spielfassung dieser Bilder behalten.
- **Nicht behoben:** Kleiner Glitch unten links in L4b (Bildfehler im Original) bleibt.
- Beim Lauf für N1 hat das Skript wegen des Namenspräfixes zusätzlich die Gesichts-Overlays von N13L und N19 mitgerechnet; diese habe ich wieder gelöscht, weil deren Hauptbilder bewusst nicht skaliert wurden.
