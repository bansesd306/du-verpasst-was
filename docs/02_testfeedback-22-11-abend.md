# Testfeedback 22.11. abends (V8.8, Test-Protokoll ⚑) – gesammelt, NOCH NICHT GEBAUT

Quelle: Test-Link-Datenbank, Sammlung `protokoll`, Sitzung `20261122174405_d7ty`, 305 Teile, 18:43–20:57 (drei Durchgänge). Zeilen = story.txt V8.8. (Texte sind teils in `04_textentscheidungen-22-11-nacht.md` entschieden – dort gilt der entschiedene Wortlaut.)

## Nachtrag 21:10
- **Balkon-Schleife: ERLEDIGT** (Test-Link 1795378469-5422). 5,4 s am Stück statt Vor-/Zurück, Anfang/Ende weich überblendet; `proc/v88_bilder.py balkon`.
- **Vorlage Sperrbildschirm/Benachrichtigungen (Android):** `quellen/vorschau/ref_sperrbildschirm_android.jpg`, `ref_benachrichtigungen_wischen.jpg`. Große Uhr + Datum, abgerundete Karten (App-Symbol links, Titel fett + Uhrzeit, 2 Zeilen Text, Vorschaubild rechts, Zahl gestapelter Nachrichten rechts), gestapelte Karten derselben App, unten „Löschen“. Beim Herunterziehen: Karten verschwinden nach oben. Grundlage für den neuen Handy-Knopf.
- **Story-Aufbau (Vorlage, echte Story NICHT im Spiel):** Fortschrittsbalken je Teil oben, Name + „vor X Std.“, Schrift auf dem Bild, unten „Nachricht senden“ + Herz + Kommentar + Teilen; Herz wird beim Tippen rot (→ Fotograf-Szene: Herz rot + kleiner Pop).

## Start/Ende
- **Lampe:** richtig leuchten + leicht flackern; Fenster besser animieren; Licht am Boden vor dem Fenster; wie in der Demo (Vorlage). Tisch unlogisch – soll im Raum stehen.
- **Abzeichen:** Formen/Farben der Vorlage sind schöner → zurück zur Vorlage; wenn nötig Vollbild per Tippen, dunkler Hintergrund, gut lesbar.
- **Bilanz:** Sätze auf dem Endbildschirm auf Vorlagengröße.
- **Musik nach dem Ende:** Zurück ins Menü → Endmusik läuft weiter + gedämpfte Musik startet zusätzlich. Wunsch: Bild weg → Musik aus → Startbildschirm mit passender Musik. Endmusik überlappt auch mit FoMO-Soundtrack im Endscreen.

## Fehler (Technik)
- **Lynn-Animation Balkon kaputt** (Z. 1611 N14d, 1728, 1742, 1771): Mund wird größer/verschiebt sich, Hintergrund/Stoff ruckartig hell, Augen ruckartig. Ursache vermutet: Overlays stammen aus abgedunkelten V8.7-Bildern, Grundbilder wieder hell. Fix: neue Posen N14v_* (siehe `07_neue-bilder.md`), Overlays neu schneiden. Wunsch: langsameres Blinzeln/Mund.
- **Lena (N13L, Z. 1427):** beim Blinzeln ruckt der Kopf, Haarfarbe ändert sich.
- **Vibration vor Nachricht** (Bad, Z. 1872): Handy vibriert, Nachricht beim Draufschauen noch nicht da → muss da sein.
- **Storys laden zu spät** (Weiterscrollen Z. 2426, Samstag Z. 2554); Storys etwas länger zeigen.
- **Schritte** (Weg zur Party, Z. 1106): am Ende plötzlich zu schnell, Schrittton läuft weiter, wenn er steht.
- **Jubel/Party-Sound** bricht beim Handy-Blick ab (Z. 1281) → ausklingen lassen.
- **Schreibsound** läuft ins nächste Bild (Sonntag Z. 2906) → erst weitertippen, wenn Ton vorbei.
- **Tipp-Geräusch** (Z. 645, 796, Prüfung): kurzes Tippen ohne Sinn – prüfen.
- **Lernplan Sonntag** (Z. 2897): drittes Recht leuchtet auf – soll normal durchgestrichen werden.
- **Timelapse Sonntag:** Schwarzbilder zwischendurch; Prolog-Zeitraffer ist besser.
- **Sonntag 12:40 Bild zu dunkel** (SO1c/d, Z. 2900). K12 dunkel (Z. 2158) etwas zu dunkel.
- **Blaue Haken bei Lynn verschwinden** (L8, Z. 1026).
- **„214 neue Nachrichten“** (Samstag Z. 2557) stimmt nicht mit der Liste → viele ungelesene im Chat ist ok. Wecker-Ton „piept sehr“ (Z. 2576).
- **„Ich tipp aufs Herz“** (Z. 2938): sichtbar nicht aufs Herz (jetzt entschieden: Satz streichen, Herz rot + Pop).
- **Uhr Sonntagnacht** (Z. 3063): beim Lesen schnell mitlaufen statt springen. Allgemein Sprung 09:00 → 22:40 zu abrupt (Uhr schnell laufen lassen).
- **Handy-Knopf:** fällt zu wenig auf. Wunsch: beim Knopf-Blick immer genaue Zahl der Benachrichtigungen (alle Apps), ungelesene bleiben auf dem Sperrbildschirm (Vorlage siehe oben).
- **Lynns Stift im Prüfungsbild** (Z. 3278): er schreibt, aber der Stift liegt noch auf dem Tisch → nach „Blau.“ aus dem Bild nehmen?
- **Bücher:** alles logischer animieren (Endscreen/Schreibtisch? – nachfragen).

## Ablauf / Übergänge (zu abrupt)
- Prolog (Z. 200): nach „Seit der Fünften …“ Pause, nächste Zeile erst nach Tippen.
- K1 (Z. 241): nach „Wieder perfekt vorbereitet.“ Bild vom Block, etwas weiter weg.
- Torte (Z. 1410): erst aufs Handy schauen, erste Nachricht, wirken lassen, dann Papa-Nachricht.
- Abschied (Z. 2061): Musikwechsel zu abrupt → kurz schwarz, er denkt kurz, dann Musik + Tim (siehe `04_…`).
- Balkon „Nur kurz“ → Heimweg (Z. 2181): siehe `06_textentwurf-heimweg-tuer.md`.
- Afterparty (Z. 2213): Übergang langsamer; Musik dort passt nicht – neu suchen?
- Samstag → Sonntag (Z. 2822): Bett-Szene mit Monolog (siehe `04_…`).
- Ende Jonas „du verpasst was“ (Z. 3399): erst andere Nachrichten lesen, dann oben plötzlich „du verpasst was“.
- Letzter Wecker (Montag): Ton darf richtig aggressiv/schnell piepen.

## Offene Rückfragen – erledigt
E20 (Fall „Lynn statt Partei“) durch Verschreiber erledigt → streichen. „Größere Bilanz“ = Sätze auf dem Endbildschirm.
