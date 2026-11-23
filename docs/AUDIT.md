# Fehlerdurchlauf V8.9 (Etappe 5) – 23.11.2026

Nur geprüft, nichts geändert. Grundlage: Zweig `v8-9-etappe5` (Stand `ea37161`), Test-Fassung und Abgabe-Fassung lokal gebaut.

**Was lief:**
- `t8.py`: alle 23 Wege. Keine Sackgasse, kein Timeout, keine JS-Fehler.
- Eigener Lauf aller 23 Wege mit Mitschnitt von Protokoll und allen Chats: doppelte Texte und Bilder, Chat-Reihenfolge, Uhrzeiten.
- Gesichts-Overlays von Lena, Lynn, Mia, Jonas, Ben und Tim jeweils vorher/nachher.
- Layout auf Handy (quer und hoch), Tablet 4:3 und Laptop.
- Endbildschirme.
- Abgabe-Fassung (`ABGABE=1`) in einer Kopie gebaut. `dist/` im Repo ist unverändert.

Referenzbilder liegen in den Projektdateien unter `audit/`: `ov_lynn.jpg`, `ov_rest.jpg`, `ende_bogen.jpg`, `bogen_tablet.jpg`, `bogen_handy_quer.jpg`.

---

## KRITISCH

### K1. Das neue V8.9-Ende („wie Pizza, dann Bzzz“) wird nie gespielt
`story.txt` definiert `== ENDE_TWIST` zweimal: in Z. 3509 und in Z. 3556. Die Engine nimmt immer die **letzte** Definition einer Sprungmarke.
- Der V8.9-Block (Z. 3509–3555) ist damit toter Code: Halle aus, N09T, „Zu Hause … Endlich.“, „Und jetzt wieder warten, bis –“, dann Bzzz.
- Alle Spieler sehen weiter das alte Twist-Ende in der Prüfungshalle (Z. 3556 ff.).
- Am Ende des ersten Blocks steht außerdem noch einmal die alte Verteilung (`-> ENDE_TWIST` / `-> ENDE_PIZZA`, Z. 3546–3553). Sie sieht nach einem Einfügefehler aus. Würde nur der zweite Kopf gelöscht, liefe der Block in eine Schleife.

**Behebung:** nur die Struktur, kein Text: den alten Block oder den alten Kopf entfernen und die doppelte Verteilung streichen. Danach prüfen, dass Blaues Licht, Lynn-Twist und „Hier oder da“ jeweils richtig enden.

### K2. Treppenhaus-Schritte (V8.9) bleiben stumm
`@ton treppenhaus_runter` (Z. 2204 und 2309) sucht in `TOENE` nach dem Schlüssel `treppenhaus_runter`. Die Datei ist dort aber unter dem Schlüssel **`treppe`** eingetragen (`bilder.js` Z. 257). Dadurch ist auf jedem Weg aus dem Haus nichts zu hören.

**Behebung:** im Skript `@ton treppe` schreiben oder in `bilder.js` einen zweiten Schlüssel anlegen.

---

## WICHTIG

### W1. Der Lernstand unterscheidet kaum
Werte aus `t8.py`:
- Alle Wege über A enden mit **lern = 6**, also ≥ `LERN_HOCH`. Das gilt auch für A3 mit 6 Handy-Punkten und dem Ende „Blaues Licht“. Der Spieler hört dort: „Ich glaub … das war’s. Im guten Sinn.“ (Z. 3495), obwohl er den Abend am Handy verbracht hat. Das widerspricht sich.
- Die Wege über B haben immer **lern = 0**, selbst wenn man zu Hause bleibt.
- Die Wege über C haben ebenfalls 0.
- Die Mitte (3–5) erreichen nur die Spät-, Party- und Afterparty-Wege.

**Vorschlag:**
- Den Lernstand bei hohen Handy-Punkten deckeln oder die Punkte abziehen.
- Wer auf B zu Hause bleibt, sollte wenigstens „mittel“ erreichen können.
- Die Schwellen bitte von Philip festlegen lassen.

### W2. Alle B-Wege enden mit „Blaues Licht“
B1, B2, B3 und B5 enden jeweils mit 6–7 Punkten. Ein „leiseres“ Ende ist auf B in t8 nicht erreichbar. Gewollt? Wenn nicht: die Punkte in `B_SCHLUSS` und bei „Noch fünf Minuten“ prüfen.

### W3. Wege, die t8 nie besucht
- `S4_LIVE_LOESCHEN` („Löschen.“, Z. 796) und `SN_UMDREHEN` („Umdrehen.“, Z. 3285) sind echte Wahlen, werden aber nie getestet, weil `t8.py` „Löschen“ und „Umdrehen“ meidet. Beide sollten einmal von Hand oder mit `t_film.py` angesehen werden.
- `B_LAEHM_*` ist bewusst totes Erbe.
- `MAMA` wird nur per `@rufe` erreicht und deshalb nicht gezählt.

### W4. Ladezeit beim ersten Start
- `Ton.init` lädt **alle** Töne, zusammen 37,8 MB, auch die Musikdateien zu je etwa 4 MB.
- Dazu kommen 28,9 MB Bilder und 4,3 MB Videos.
- Auf dem Handy über Mobilfunk dauert der erste Start dadurch spürbar.

**Vorschlag:** die Musik erst laden, wenn sie gebraucht wird, und die großen MP3s neu kodieren (z. B. 96 kbit/s Mono für Geräusche).

---

## KLEIN

**Story und Text**
- **Laufweg doppelt (C5):** Nach „Umdrehen“ → „Doch hin“ kommen „Kalt. Die Luft riecht nach nassem Laub.“ und „~ Ich hör schon die Musik.“ ein zweites Mal wörtlich.
- **Bild doppelt gesetzt:** Dasselbe Bild wird direkt hintereinander erneut gesetzt (z. B. N02 Z. 188→199, N36 Z. 1339→1362, N02D Z. 2518→2573, SO Z. 2679→2873, K10P Z. 3058→3071). Dabei gibt es jedes Mal eine neue Überblendung, und die Textbox verschwindet kurz. Bitte beim Durchspielen darauf achten, ob es flackert.
- **Uhr springt zurück:** S3 zeigt kurz 23:51 → 23:50 (Z. 2364).
- **Antworten auf „Wie hast du dich gerade gefühlt?“** werden nirgends gespeichert, auch nicht im Protokoll. Das ist schade für die Auswertung.
- **„Leiser“ im Endbildschirm:** Auch das Lynn-Ende zählt als „Leiser“ („Ende 1 von 3“). Das ist so gewollt, wirkt aber für Spieler wie dasselbe Ende.

**Handy**
- **Story-Herz bleibt rot:** `storyHerz()` setzt das Herz auf rot, aber weder `story()` noch `Handy.reset()` setzen es zurück. Nach SO4 und beim zweiten Durchgang ist es schon rot.
- **Suchfeld in WhatsApp:** Der Platzhalter wechselt von „Meta AI fragen oder suchen“ zu „🔍  Fragen Sie Meta AI oder suchen Sie“, und die Lupe (SVG) verschwindet.
- **Oma-Chat:** Die Tagesmarke „Sonntag“ ist am Sonntag selbst und am Montag missverständlich. Besser „Gestern“ bzw. „Heute“.
- **„Galerie“-Benachrichtigung:** Sie hat kein App-Symbol.

**Ton und Bilder**
- **Ton:** `buegel` ist leer (AUFBRUCH). Der Kommentar zu `bzzz_doppel` ist veraltet.
- **Overlays:** Alle sind sauber (siehe `ov_lynn.jpg` und `ov_rest.jpg`).
  - Lynn N14c/N14d (LNz, LNLz): Das Overlay deckt die obere Bildhälfte ab, am Rand mit noch ~22 % Deckkraft. Auf dem Standbild ist kein Sprung zu sehen, im Spiel beim Blinzeln aber kurz prüfen.
  - LP3z hat noch kein Blinzel-Overlay (bekannt).
  - TV1 und TV3 haben einen feinen hellen Strich rechts an der Schläfe. Er ist schon im Grundbild.

**Aufräumen**
- Ungenutzt: `ZEIT_B`, `ZEIT_PARTY`, `ZEIT_A`.
- Ungenutzte Dateien in `dist/`: B15, B15b, N11, N12, `vid/weg_*.jpg` (0,9 MB).

**Test-Fassung**
- Auf dem 4:3-Tablet überdecken die Testknöpfe (⛶ ⏭ ⚑) oben rechts die Bühne (siehe `bogen_tablet.jpg`). In der Abgabe-Fassung gibt es sie nicht.
- Spracheingabe im Fehlerfeld (Web Speech) läuft im Artefakt-Rahmen vermutlich nicht. Die Artefakt-Fähigkeit `dictation` wäre die Alternative.
- Im Fehlerprotokoll dürfen standardmäßig nur Personen mit mindestens Mitwirkenden-Recht schreiben. Fremde Tester mit reinem Leselink können nichts eintragen.
- Beim Start gibt es ein bis zwei 404-Meldungen in der Konsole, wahrscheinlich `favicon.ico`. Ohne Folgen.

---

## Ohne Befund
- **Sackgassen:** keine auf allen 23 Wegen. Jeder Weg erreicht die Abzeichen-Seite.
- **Chats:** keine doppelte Blase und keine rückwärts laufende Uhrzeit innerhalb eines Tages (alle 13 Chats, alle Wege). Wiederholungen wie „ja klar 😂“ (Jonas) und „Zehn Minuten.“ / „Wo war ich?“ sind bewusste Rückgriffe.
- **Layout:** Handy quer (844×390), Tablet 1024×768 (mit Rand) und Laptop zeigen keine Querscroll-Leiste und keine JS-Fehler. Handy hoch zeigt den Drehen-Hinweis.
- **Startbildschirm, Menü, Handy und Textbox:** in Ordnung.
- **Endbildschirme** (Ende, Stoppuhr, Gefühlsfrage, Abzeichen): Sie bauen sich ohne Fehler auf.
- **Abgabe-Fassung:** `TESTMODUS = false`. Kein ⏭, kein ⚑, keine Stoppuhr, kein Protokoll. Startet ohne JS-Fehler auf Laptop und Handy quer. (`Spiel._debug` ist weiter vorhanden, aber nicht sichtbar. Unkritisch.)

---

## Noch nicht geprüft (braucht Echtzeit oder Ohren)
- Lautstärken und Abbrüche der Musik im echten Tempo (`t_echt.py`). Die bekannten Punkte aus der Übergabe sind: Jubel abgeschnitten, Tippgeräusch läuft ins nächste Bild, Pause vor dem Wecker.
- Animationen im echten Tempo: Lynn-Blinzeln, Mia-Lichtshow, Heranzoomen.
- Tippfehler im ganzen Skript. Es wurde nur stichprobenartig gelesen, ohne Befund.
