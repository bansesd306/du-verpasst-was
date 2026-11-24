# FoMO-Wirkung über Effekte, Ton und Layout (Stand 24.11. abends)

Nur Vorschläge, nichts gebaut. Grundlage: alle `@musik`, `@loop`, `@effekt`, `@stille` und Handy-Momente in `spiel/story.txt` (Stand 8a2ffe6) und der Rahmen (Menü/Ende). Nicht gespielt, nur gelesen. Ton und Bild im echten Durchgang konnte ich nicht beurteilen.

## Was schon stark ist (lassen)
- **Happy Birthday als roter Faden:** Das Lied hört man fast nur gedämpft, je nach Weg übers Telefon (Jonas-Anruf), durch die Balkontür, durch die Küchentür. Nur wer in der Küche ist, hört es richtig und singt mit. Das ist FoMO über den Ton, **sehr gut**.
- **Weg zur Party:** Die Musik wird mit jedem Schritt lauter (W1–W4). **Sehr gut.**
- **Handy-Knopf mit Zahl, der bei Neuem pulsiert:** ein ständiger Sog, genau das Gefühl. **Sehr gut.**
- **Weg B:** Tunnel, Shutdown, Lähmung (Knöpfe werden grau). **Hervorragend**, die stärkste Stelle im Spiel ohne Worte.
- **Feuerlöscher:** Man sieht nur Fetzen im Schnittgewitter und kommt zu spät. **Sehr gut.**
- **Herzschlag:** Bereicherungsrecht (Sonntagnacht) und beim Aufbruch. Sparsam eingesetzt, **gut**.
- **Ab Samstag fast keine Musik:** Stille, Regen, Raumton. Nach der Party ist die Leere hörbar. **Gut**, so lassen.
- **Balkon-Uhr (neu):** leise weg, hart zurück. **Sehr gut.**
- **Ende:** Bilanz („{n}-mal aufs Handy geschaut, {m}-mal war nichts Neues“) und „du verpasst was“. **Sehr gut.**

## Was es noch verstärken würde (nach Aufwand sortiert)

| # | Idee | Wo | Aufwand | Bewertung |
|---|---|---|---|---|
| 1 | **Die Uhr läuft beim Scrollen sichtbar los.** Beim Weiterscrollen nach der Party springt sie bisher (`@uhr springe Sa 01:52`). Stattdessen soll sie oben schnell hochlaufen, während man Storys schaut. Man sieht, wie das Handy Zeit frisst. | NP_SCROLL (Z. ~2623) | 1 Zeile, Sonnet Mittel | **sehr gut** |
| 2 | **Leiser Bass zu Hause am Freitag.** Zu Hause ist es zwischen 21:20 und 22:45 meist still. Ein kaum hörbarer, gedämpfter Party-Bass (gibt es schon: `oben`/`party_fern`), der nachts leiser wird und bei „Licht aus“ endet. Man hört die ganze Zeit, was man verpasst. | L2–L4, S2–S4 | 4–6 Zeilen, Sonnet Mittel | **sehr gut** |
| 3 | **Die Handy-Zahl steigt still auf dem Balkon.** Während Lynn redet, zählt der Knopf langsam hoch (ohne Pulsieren, ohne Ton). Der Spieler sieht die Versuchung, der Ich-Erzähler ignoriert sie. | GM_START | 3–5 Zeilen, Sonnet Mittel | **sehr gut** (nur ohne Pulsieren, sonst stört es „Gar nicht gemerkt“) |
| 4 | **„Das hast du verpasst“ am Ende.** Auf dem Endbildschirm eine kurze Liste, was es auf *diesem* Weg gab, ohne dass man dabei war: „Das Lied. Den Feuerlöscher. Tims Afterparty. Lynn.“ Die Variablen dafür gibt es schon. Das ist der stärkste Hebel für das Nochmal-Spielen und für den Lernbaustein. | Endbildschirm | mittel (neuer Text, braucht dein Okay), Sonnet Hoch | **hervorragend** |
| 5 | **Zimmer wird kälter, wenn man Party-Storys schaut.** Hinter dem Handy wird das Zimmer etwas dunkler und blasser, solange Party-Bilder laufen. Nach dem Zumachen wird es wieder normal. | alle Story-Blicke zu Hause | mittel (Technik), Sonnet Hoch | **gut** |
| 6 | **Jeder eigene Handy-Blick kostet sichtbar 1–2 Minuten.** | überall | Risiko: verschiebt Uhrzeiten, die Wege bestimmen | **gut**, vor der Abgabe **nicht** machen |

## Musik: Braucht es andere?
Ehrlich: **kaum.** Die Musik ist durchdacht (laut, gedämpft, durchs Telefon, durch Türen). Neue Musik würde ich nur an einer Stelle prüfen:
- **Tims Afterparty** (`spaet`, Late Night Breeze): Das wurde schon im Testfeedback vom 22.11. als unpassend markiert. Sie sollte sich wie die *andere*, fremdere Party anfühlen, ein unbekannter Song und gedämpft, weil er nicht dazugehört. Wenn du einen findest: rein damit. Sonst `party dumpf` statt `spaet` (kostet nichts). **Gut.**
- Samstag bis Montag **keine** neue Musik. Die Stille ist richtig.

## Meine Empfehlung
1 + 2 + 3 zusammen kosten wenig und machen das Spiel spürbar dichter. 4 ist die beste Idee, aber neuer Text, also nur mit deinem Okay vor dem Inhaltsstopp (Do 26.11.).
