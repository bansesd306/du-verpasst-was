# Storycheck Lauf 3: Zeit, Wochentage, Entfernungen, Wissensstand (Stand 24.11.)

Grundlage: `spiel/story.txt` (3905 Zeilen, Stand mit Verpasst-Liste und Sonntag-Wahl bei Jonas, 24.11. abends), `engine.js` (Uhr, Karten), `phone.js` (Tage im Handy). **Nur geprüft, nichts am Spiel geändert.** Zeilen = story.txt jetzt.

So habe ich geprüft: Das ganze Skript gelesen und zusätzlich **36 Wege automatisch durchgespielt** (die 23 Testwege aus `t8.py` plus 13 eigene Wege für Sonderfälle). Bei jedem Weg wurde jede Uhrzeit, jeder Text, jede Handy-Nachricht und jede Wahl mitgeschrieben. Alle Uhrzeiten unten stammen aus diesen Läufen, nicht aus dem Kopf.

Die Testläufe liefen auf dem Stand von 17:30. Die Änderungen von heute Abend (Bass von draußen, stille Meldungen, Verpasst-Liste, Wahl bei Jonas am Sonntag) ändern keine Uhrzeit; ich habe sie im Skript nachgeprüft und die Zeilennummern angepasst.

Nicht geprüft: Bilder, Ton, Tempo. Was in den Berichten 1, 2A und 2B schon steht, wiederhole ich nur, wenn es noch offen ist.

Bewertung der Vorschläge: schwach / geht so / gut / sehr gut / hervorragend / Meisterwerk.

---

## Kurzfazit

1. **Das Zeitgerüst hält.** Die Countdown-Karten stimmen bis auf eine, der Weg zu Lena dauert auf jedem Weg gleich lang (17 Minuten), „kurz vor zwölf da“ stimmt, Montag 9:00 bis 12:00 stimmt, die Wochentage im Handy rechnen richtig mit.
2. **Fünf echte Fehler, die man beim Spielen sehen kann** (Abschnitt 4, Z1–Z5): Tim ist schon weg und lädt trotzdem ein; Mia ist schon weg und war trotzdem beim Feuerlöscher; auf dem Balkon verschwindet die Uhr eine Stunde mitten im Satz; die Uhr läuft auf drei Wegen rückwärts; auf einem Weg ruft Jonas zweimal an und erzählt zweimal, dass Lynn gefragt hat.
3. **Vier kleinere Widersprüche** (Z6–Z9): Lenas Selfie zweimal als „neu“, Mias Story „vor 2 Min.“, obwohl Mia weg ist, die Wette (Lynn gewinnt und verliert sie), Feuerlöscher-Zeit je nach Weg 23:20 bis 23:50.
4. **Rückgriffe:** fast alle sind sauber an Bedingungen geknüpft. Zwei laufen ins Leere (Tims „Schon vergessen?“ auf dem Draufschau-Weg, Rom-Witz auf dem Weg Spät → Tim).
5. **Wissensstand passt fast überall.** Lynn weiß von Montag nur dort ohne Erklärung, wo es gewollt ist („Woher weiß sie das mit Montag?“).
6. Fast alles lässt sich **ohne neuen Text** reparieren (Bedingung, Zahl, Uhr ausblenden). Text und damit Patricks Okay brauchen nur Z2, Z7, Z10, Z11 und zwei kleine Sätze (Z15, Z16).

---

## 1. Zeitleiste Freitag pro Weg (aus den Testläufen)

Uhr = was die Uhr im Spiel zeigt. „–“ = kommt auf dem Weg nicht vor.

| Weg (Testname) | 21:07 Antwort | Los | Bei Lena | Räume (Beginn) | Torte/Lied | Feuerlöscher | Lynn geht | Zu Hause | Karte Kap. 4 |
|---|---|---|---|---|---|---|---|---|---|
| A1 Flow, zu Hause | „bin raus“ | – | – | – | 22:45 (Anruf unbemerkt) | – | – | Blaue Haken 00:50 | Sa 00:50 |
| A2 Flow, Handy weg | „bin raus“ | – | – | – | 22:45 (Anruf unbemerkt) | – | – | Handy weg 23:40 | Sa 00:12 |
| A3 / C6 ohne Flow | „bin raus“ / „Ich komm!“ → doch bleiben | – | – | – | 22:45 (im Telefon) | – | – | Licht aus 23:31 | Sa 00:12 |
| A4 Fenster → Jacke | „bin raus“ | 22:38 | 22:58 | Küche 23:01, Balkon 23:16, Bad 23:31 | schon vorbei | **23:31** | 23:45 | 23:57 | Sa 01:14 |
| A5 Anruf → hin, Lynn, Draufschauen | „bin raus“ | 22:47 | 23:07 | Balkon 23:10 → Uhr weg 23:15 | im Telefon 22:45 | (drinnen, unbemerkt) | „Wir gehen!“ ca. 23:30, sie bleibt | Afterparty bis 02:47 | Sa 14:20 |
| X3 Anruf → hin, Küche, Lynn-Weg | „bin raus“ | 22:47 | 23:07 | Küche 23:10, Balkon 23:25 | im Telefon | (unbemerkt) | bleibt | 02:10 | Sa 02:10 |
| A6 / S1 Spät → heim | „bin raus“ | 23:40 | **00:00** | – | – | „vor zehn Minuten“ = **23:50** | „vor zehn Minuten“ = 23:50 | 00:12 | Sa 01:14 |
| S2 Spät → bleiben | „bin raus“ | 23:40 | 00:00 | Konfetti bis 01:20 | – | 23:50 | 23:50 | 01:32 | Sa 01:32 |
| S3 Spät → Tim | „bin raus“ | 23:31 | 23:51 | – | – | 23:41 | 23:41 | Afterparty, Uhr zeigt **23:50** | Sa 14:20 |
| X9 Spät (aus Flow) → Tim | „bin raus“ | 23:40 | 00:00 | – | – | 23:50 | 23:50 | Afterparty, Uhr zeigt **23:50** | Sa 14:20 |
| S4 / S5 / X8 umgedreht | „bin raus“ | 22:47 | – | – | im Telefon | – | – | 22:59–23:21 | Sa 00:12 |
| B1–B3 Bett | „mal schauen“ | – | – | – | Lenas Live „gleich kommt die Torte“ | – | – | Fenster aus bis 01:30 | Sa 01:30 |
| B5 S4 → hin | „mal schauen“ | 22:20 | 22:40 | Küche 22:43, Balkon 22:58, Bad 23:13 | **22:58** | 23:20 | 23:45 | 23:57 | Sa 01:14 |
| C1 Küche, Balkon, mit zu Tim | „Ich komm!“ | 21:20 | 21:40 | Küche 21:43, Balkon 22:45, Bad 23:00 | 22:45 (Uhr springt) | 23:20 | 23:45 | Afterparty 23:50 | Sa 14:20 |
| C2 / X4 Lynn-Weg | „Ich komm!“ | 21:20 | 21:40 | Tanz 21:43 bzw. Balkon 21:43 | 22:45 (Uhr springt **mitten im Gespräch**) | (unbemerkt) | bleibt | 02:10 | Sa 02:10 |
| C3 Balkon zuerst, schauen | „Ich komm!“ | 21:20 | 21:40 | Balkon 21:43, **allein bis 22:55**, Küche 22:55, Bad 23:10 | 22:45 (durch die Tür) | 23:20 | 23:45 | Afterparty | Sa 14:20 |
| C4 / C7 / X10 Küche, Tanz | „Ich komm!“ | 21:20 | 21:40 | Küche, Tanz, Bad | 22:45 | 23:20 | 23:45 | 23:57 | Sa 01:14 |
| X13 Tanz zuerst | „Ich komm!“ | 21:20 | 21:40 | Tanz 21:43 (**Mia geht 21:48**), Küche 22:03 | 22:45 | 23:20 | 23:45 | 23:57 | Sa 01:14 |
| X1 Lynn-Weg, Draufschauen, heim | „Ich komm!“ | 21:20 | 21:40 | Balkon 21:43 | 22:45 | (unbemerkt) | „Wir gehen!“ ca. 23:30, sie bleibt | 00:52 | Sa 01:14 |
| C5 umgedreht → Bett → doch hin | „Ich komm!“ | 21:20, umgedreht 21:28, wieder los 21:58 | 22:15 | Küche, Tanz, Bad | 22:45 | 23:20 | 23:45 | 23:57 | Sa 01:14 |
| X12 Anruf → hin → sofort umgedreht → Bett | „bin raus“ | 22:47 | – | – | im Telefon | – | – | Fenster aus bis 01:30 | Sa 01:30 |

**Was die Tabelle zeigt:**
- Ankunftszeiten gibt es nur in fünf Gruppen: 21:40, 22:15, 22:40, 22:58–23:07, 23:51–00:00. Zwischen 23:10 und 23:50 kommt niemand an. Gut so, das macht die Zeiten berechenbar.
- Torte und Lied sind immer 22:45, außer auf B5 (22:58, weil die Küche erst um 22:43 beginnt). Fällt nicht auf.
- **Feuerlöscher:** 23:20 auf den meisten Wegen, 23:31 auf A4, 23:41 bis 23:50 auf den Spät-Wegen. Siehe Z8.
- **Lynn geht mit Tim:** 23:41 bis 23:50 überall. Passt.

## 2. Samstag bis Montag (für alle Wege gleich, außer wo genannt)

| Zeitpunkt | Zu Hause A | Zu Hause B | Party (früh/spät) | Lynn-Weg | Afterparty |
|---|---|---|---|---|---|
| Aufwachen | Sa 10:32 | Sa 10:32 | Sa 10:32 | Sa 10:32 | **Sa 14:20** |
| Lenas Story „aufräumen“ | „9 Std.“ = ca. 01:30 | gleich | gleich | gleich | „13 Std.“ = 01:20 |
| Samstagabend | 23:10, Wahl Story/Lernen | 23:10, Videos bis So 00:40 | 23:10, Wahl | 23:10, Wahl | entfällt |
| Sonntag | 09:00, Jonas 12:40, dann Sprung auf 22:40 | 09:00, Jonas 12:40, 22:31 | wie A | wie A | wie B |
| Ins Bett | Mo 00:04, Wecker 6:30 | wach bis 01:47, Wecker 6:30/6:35/6:40 | wie B | wie B | wie B |
| Prüfung | 08:40 Halle, 08:58 rein, 11:50 „Noch zehn Minuten“ | gleich | gleich | gleich | gleich |
| Abend | – | – | – | Mo 19:30 mit Lynn | – |

### Countdown-Karten

| Karte | Rechnung bis Mo 9:00 | Stimmt? |
|---|---|---|
| Fr 20:04 „Noch 60 Stunden“ | 60 h 56 min | ✓ (abgerundet) |
| Kapitel 4 (automatisch, 00:12 bis 02:10) | wird ausgerechnet | ✓ |
| Sa 10:32 „Noch 46 Stunden“ | 46 h 28 min | ✓ |
| Sa 14:20 „Noch 42 Stunden“ | 42 h 40 min | ✓ |
| **Sa 23:10 „Noch 34 Stunden“** (Z. 3028) | **33 h 50 min** | ✗ alle anderen runden ab, diese rundet auf. Siehe Z13. |
| So 09:00 „Noch 24 Stunden“ | 24 h | ✓ |
| So 22:40 „Noch 10 Stunden“ | 10 h 20 min | ✓ |
| Mo 08:40 „Noch 20 Minuten“ | 20 min | ✓ |
| „~ Noch 58 Stunden.“ (Z. 1553, Fr 22:45) | 58 h 15 min | stimmt, wird aber **nie gezeigt** (Mama kommt jetzt immer vor dem Haus, der Block in der Küche ist tot) |

### Wochentage und Daten

- Fr 11.01. / Sa 12.01. / So 13.01. / Mo 14.01. sind in Engine, Zettel („Mo, 14.01., 9:00 Uhr“) und Karten gleich. ✓
- Das Handy rechnet „Gestern“, „Dienstag“, „Mittwoch“ richtig mit (am Samstag wird aus „Gestern“ „Donnerstag“). ✓
- Alter Chat Lena (Dienstag): „hab gehört montag ist dein großer tag??“, Papa (Dienstag): „Klausur ist Montag um 9“, Gruppe (Mittwoch): „Freitag bei mir!!“. Alles passt zum Freitag. ✓
- Jonas, 12. Juli: „bin unten. mach auf 🍕“ = Pizza nach dem zweiten 5,0. Passt zu „Nach beiden 5,0 stand er mit Pizza vor meiner Tür.“ (Z. 217) und zum dritten Versuch im Januar. ✓
- Sonntag „pizza heute?“ → „ok 😔 dann montag“ → Montag „Bereit für heute Abend?“ / Pizza an der Tür. ✓
- Klein: **Oma „Sonntag 11:30“** (Z. 97) bleibt im Handy wörtlich „Sonntag“. Am Spiel-Sonntag und -Montag sieht das aus wie „heute“ bzw. „gestern“. Siehe Z14.
- Nur zur Info: Freitag, der 11. Januar, war 2019 und ist wieder 2030. 2027 ist der 11.01. ein Montag. Da das Spiel kein Jahr nennt, ist das egal.

### Entfernungen

| Strecke | Im Spiel | Passt? |
|---|---|---|
| Zimmer → Haustür | 3 min | ✓ |
| Zu Lena | 14 min zu Fuß (W1 +2, W2–W4 je +4), mit Treppe 17 min | ✓ auf allen Wegen gleich |
| „Wenn ich jetzt losgehe, bin ich kurz vor zwölf da.“ (Z. 1108, 23:31) | Ankunft 23:51 | ✓ |
| Heimweg | 12 min (2 min schneller als hin) | ✓ (nachts, allein, egal) |
| Umdrehen | Rückweg = genau die Zeit, die er schon unterwegs war | ✓ |
| Lena → Tim | 23:45 los, 23:50 da (5 min) | ✓, außer auf Spät → Tim (Z4) |
| Musik hören | Fenster: „Irgendwo weit weg Bässe.“ (Z. 728); nach 2 von 14 Minuten: „~ Ich hör schon die Musik.“ (Z. 1221) | geht so (ca. 1 km entfernt). Schon in Lauf 1 (M4), weiter offen, klein. |
| Sophie: „Ich geh jetzt rüber zu Lena.“ (Z. 648) | „rüber“ klingt nach nebenan | klein, lassen |

---

## 3. Wissensstand: wer weiß wann was

### Figuren

| Wer | Weiß was | Woher / ab wann | Passt? |
|---|---|---|---|
| Lynn | dass er vielleicht nicht kommt | Wette mit Jonas, vor dem Abend | ✓ „Du bist ja doch gekommen.“ / „’nen Zehner reicher.“ |
| Lynn | dass Montag seine Prüfung ist | Weg „geschaut“: nicht erzählt → „~ Woher weiß sie das mit Montag?“ (Z. 2408). Lynn-Weg: er erzählt vom dritten Versuch. | ✓ gewollt |
| Lynn | dass Tim Afterparty macht | ist selbst eingeladen | ✓ |
| Jonas | Name „Lynn“ seit Tagen | „Weißt du, wie oft ich den Namen … hören musste?“ (Z. 1504) | ✓ |
| Jonas | „lynn hat nach dir gefragt“ | sagt es einmal pro Weg: Anruf, Chat, Banner im Flow oder in der Flut | ✓, **außer X12: zweimal** (Z5) |
| Jonas | hat gegen ihn gewettet | Ende: „Und gegen wen?“ – „Jonas.“ | ✓, aber Spät-Weg widerspricht (Z7) |
| Tim | lädt ihn ein | Bad-Nachricht 23:20, im Flur „Schon vergessen?“ | ✓, **außer Draufschau-Weg** (Z1) |
| Mia | Feuerlöscher, Moritz | Samstag-Chat: „bauchschmerzen vom lachen“, „DER FORSTER MORITZ“ | **✗ auf allen Tanz-Wegen**, Mia ist vorher weg (Z2) |
| Lena | ob er kommt | „Du bist wirklich gekommen.“ / „schade, dass du nicht da warst“ / „danke für deine nachricht“ | ✓ je nach Weg richtig |
| Lena | alte Fehlversuche | „und diesmal nicht bis 4 uhr lernen“ | ✓ |
| Paul | Hilfe bei Fall 12 | Montag „Danke nochmal für Freitag“ nur, wenn geholfen | ✓ |
| Mama/Papa | Prüfung Montag | Mama einmal vor dem Haus (W4), Montag „Viel Erfolg heute“ | ✓ |

### Was der Spieler gesehen hat (Rückgriffe)

| Rückgriff (Zeile) | Setzt voraus | Bedingung im Skript | Passt? |
|---|---|---|---|
| „Warst du das vorhin? Beim Lied? Der so falsch gesungen hat?“ (1782) | in der Küche mitgesungen | `gesungen` | ✓ |
| „Du hast das Lied verpasst.“ (1794) | nach 22:45 gekommen | `ankunft>22:45` | ✓ |
| „Ey, warte. Schon vergessen? Afterparty. Bei mir.“ (2147) | Tims Nachricht im Bad gelesen **und Tim noch da** | keine | **✗ Draufschau-Weg** (Z1) |
| „Lynn: Jonas kommt. … Mia ist wohl schon da.“ (2184) | Mia ging auf „Party Nummer vier“ | `tanz` | ✓ |
| „~ Woher weiß sie das mit Montag?“ (2408) | Lynn nichts erzählt | `lynn=="geschaut"` | ✓ |
| „~ Genauso schief wie vorhin.“ (2362) | Sänger bei W3 gehört | `heimgedreht && wo>=3` | ✓ |
| „Sie stand da sogar alleine.“ (2691) | Lynn im Flur-Bild auf dem Balkon | Bild N36 zeigt sie | ✓ |
| „Zehn Minuten. … Beide Male.“ (2701) | Spät-Ankunft | `ankunft>23:30` | ✓ |
| „Dreiundzwanzig Benachrichtigungen.“ (2710) | Draufschauen auf dem Balkon | `gm_geschaut` | ✓ |
| „Wegen dem Wetter.“ (2719) | Wetter-Meldung auf dem Balkon | `geschaut` | ✓ |
| „Ich war da. Im Bad.“ (2833) | im Bad gewesen | `imBad` | ✓ |
| „war ich nicht. war woanders“ (2805) | Lynn-Weg | `gluecklich` | ✓ |
| Tim: „zu lynn? 😏“ (2945) | mit Lynn auf dem Balkon | `lynn!=""` | ✓ |
| Tim: „tja. alle wege führen wohl zu tim 😎“ (2939) | Rom-Witz im Flur gehört | keine | geht so: auf **Spät → Tim** fehlt der Witz (Z12) |
| „~ Die vierte war’s dann wohl.“ (2437) | Mias „Party Nummer vieeer“ | `tanz` | ✓ |
| „Doch. In Mias Video. … Dieser Laucharm.“ (2635) | mitgetanzt | `mittanzen` | ✓ |
| „~ Der linke ist meiner.“ (2864) | zwei Becher mit Lynn | `gluecklich` | ✓ |
| Lynn: „Ich wollt dir übrigens schreiben. Zweimal.“ (3885) | Samstag „Lynn schreibt …“ zweimal | `gluecklich` | ✓ |
| Lernplan „Samstag“ im Handy, Sonntag „Datum“ (3265) | Lernplan getippt | `notiz` | ✓ |
| Sonntagnacht Bereicherungsrecht „durchgestrichen“ (3378) | Sonntag SB | B/Afterparty | ✓ |
| Montag „~ Hab ich.“ (3581) | Bereicherungsrecht am Sonntag abgehakt | nicht B/Afterparty | ✓ |
| Paul: „Fall 12 hab ich nur wegen dir gecheckt.“ (3584) | Paul geholfen | `paulGeholfen` | ✓ |
| „Ich denk an den Feuerlöscher.“ (3650) | Party/Afterparty | Typ | ✓ (auf dem Draufschau-Weg nur aus dem Chat bekannt, passt zum Thema) |
| „~ Wie immer.“ (3657) | Spät-Ankunft | `ankunft>23:30` | ✓ |
| „~ Ich denk an zwei Uhr.“ / „Gefühlt hab ich an zwei Uhr gedacht.“ | Lynn-Weg | `gluecklich` | ✓ |
| „Blau.“ (3630) | „Rot ist fast leer.“ | keine | ✓ (ohne Balkon ist es nur eine Farbe, schadet nicht) |

---

## 4. Befunde

### Hoch (sieht man beim normalen Spielen)

**Z1 – Tim ist weg und lädt trotzdem ein (Lynn-Weg mit „Draufschauen“).**
Weg: Balkon, zweimal „Ignorieren.“, dann „Draufschauen.“ (Testläufe A5, X1, X2).
- Ca. 23:30, Z. 1952–1955: Tim!: „Lynn! Wir gehen!“ – Lynn: „Geht schon mal.“
- 00:40, Z. 2147: Tim: „Ey, warte. Schon vergessen? Afterparty. Bei mir.“ – und danach der Rom-Witz.

Tim ist also eine Stunde nach seinem Aufbruch noch in Lenas Flur. Dazu kommt: Auf diesem Weg war er nie im Bad und hat Tims Einladung nie gelesen, „Schon vergessen?“ läuft also auch ins Leere.
**Vorschlag:** In ABSCHIED_A den Tim-Block (Z. 2145–2153, Bild TV0 bis Gelächter) nur zeigen, wenn `lynn!="gm_geschaut"`. Kein neuer Text. Jonas’ „Langweiler.“ und Lynns „Du kommst doch noch mit zu Tim, oder?“ bleiben, die Afterparty wird so trotzdem eingeführt. **Bewertung: sehr gut** (echter Fehler, eine Bedingung). Kosten: fast nichts, Sonnet Mittel.

**Z2 – Mia ist schon weg, war aber laut Samstag-Chat beim Feuerlöscher.**
Weg: alle, die auf die Tanzfläche gehen (ungefähr jeder dritte Party-Spieler).
- Z. 1722: Mia: „Party Nummer vieeer.“ – sie geht (Testlauf X13: um 21:48).
- Feuerlöscher: 23:20.
- Samstag, Z. 2812–2817: Mia: „ich hab immer noch bauchschmerzen vom lachen“ … Jonas: „du warst dabei 😭“ … Mia: „DER FORSTER MORITZ 😭🧯“. Auf dem Lynn-Weg ebenso Z. 2803.

**Vorschlag:** Mit `@wenn tanz` andere Zeilen für Mia, z. B.: Mia: „WAS FÜR EIN FEUERLÖSCHER“ / Mia: „ich war auf party nummer 4 😭“, und die Antwort an Ben kommt von Jonas: „MORITZ 😭“ (gibt es schon im Afterparty-Chat, Z. 2958). Das ist nicht nur eine Reparatur: Mia, die auf drei Partys geht, damit sie nichts verpasst („Ich geh halt immer zuerst.“), verpasst genau den Moment, über den alle reden. **Bewertung: sehr gut** (FoMO-Pointe für eine Nebenfigur, fast geschenkt). Kosten: 3–4 Zeilen, **Text, braucht Patricks Okay.** Wenn kein neuer Text: auf Tanz-Wegen Mias drei Zeilen einfach weglassen (**gut**).

**Z3 – Auf dem Balkon verschwindet eine Stunde mitten im Gespräch.**
Weg: früh angekommen (21:40) und Balkon als erster Raum, oder Tanzfläche und dann Balkon (C2, C3, X1, X4).
- 21:48, Z. 1801: Lynn: „Aber gleich geht’s weiter. Ich darf ja nicht den unangenehmsten Moment des Tages verpassen.“
- Bzzz → „Ignorieren.“ → Z. 1846 `@uhr springe 22:45` → die Uhr oben rennt sichtbar von 21:48 auf 22:45 → Lynn: „Jetzt verpass ich’s doch.“
- Mit „Nur kurz schauen.“ (Z. 1830–1840): „Ich stehe eine Weile allein draußen.“ Die Uhr springt von 21:48 auf 22:45, dann +10. Er steht also **über eine Stunde allein bei 4 Grad** auf dem Balkon.

**Vorschlag:** Die Uhr vor dem Sprung ausblenden (`@uhr verstecken` vor Z. 1834 und Z. 1846) und erst beim Reingehen wieder zeigen (`@uhr zeigen` in HUB_ZURUECK). Die Uhr leuchtet beim Wiederkommen kurz auf, man merkt also, dass Zeit vergangen ist, sieht aber nicht, wie sie mitten im Satz rennt. Passt zum Lynn-Weg, auf dem die Uhr ohnehin verschwindet. Für „eine Weile“ optional „Ich stehe lange allein draußen.“ (Text, Okay nötig). **Bewertung: gut**. Kosten: 2–3 Zeilen Technik.

**Z4 – Die Uhr läuft rückwärts (drei Stellen).**
Die große Uhr (`@analoguhr`) setzt die Zeit fest, auch wenn sie damit zurückgeht. Gemessen:
- Lynn-Weg mit Ankunft 23:07 und Küche oder Tanzfläche vorher (X3, X6): Uhr oben zeigt 23:30 bzw. 23:35, dann kommt die große Uhr mit **23:25** (Z. 1870). 5 bzw. 10 Minuten zurück.
- Spät → „Mit zu Tim.“ (S3, X9): Ankunft bei Lena 23:51 bzw. 00:00, bei Tim zeigt die Uhr **23:50** (Z. 2452). Bis zu 10 Minuten zurück. (Schon in Lauf 1, M6, weiter offen.)
- Nicht schlimm, aber gewollt: Z. 2019 setzt nach 00:20 wieder 23:25, damit die große Uhr von „seiner letzten Uhrzeit“ auf 01:58 springt. Das ist Absicht und passt, weil die Uhr oben versteckt ist.

**Vorschlag:** (a) GM_START: statt fester 23:25 die aktuelle Uhrzeit zeigen und Z. 2019 dieselbe Zeit wieder aufnehmen (kleine Engine-Änderung, z. B. `@analoguhr jetzt`). (b) AFTERPARTY: `@wenn ankunft>23:30` → `@analoguhr Sa 00:15` und `Sa 01:15` statt 23:50 und 00:50. **Bewertung: gut**. Kosten: klein, kein Text.

**Z5 – Jonas ruft zweimal an und sagt zweimal, dass Lynn gefragt hat (Sonderweg).**
Weg X12: „bin raus“ → Anruf um 22:45 ablehnen (Jonas: „lynn hat nach dir gefragt btw“, Z. 905) → „Hingehen.“ → gleich umdrehen → zu Hause vor 23:00 → „Aufs Bett.“ → Weg-B-Flut (Z. 965 und 980): **Jonas ruft wieder an**, und „lynn hat nach dir gefragt btw“ kommt ein zweites Mal als neue Nachricht.
**Vorschlag:** Beim ersten Mal ein Merkzeichen setzen (z. B. `@setze lynnGefragt` in ANRUF_RAN, ANRUF_AB und L5) und in B_UEBER Anruf und Lynn-Zeile nur zeigen, wenn `!lynnGefragt`. Kein Text. **Bewertung: gut**. Kosten: 4 Zeilen Technik. Selten, aber wer es sieht, hält es für einen Fehler.

### Mittel

**Z6 – Lenas Selfie zweimal als „neu“ (Sonderweg).**
Weg X5: Weg B → 21:58 Lenas Story (LENA_SELFIE, Z. 626) → „Okay. Ich geh doch.“ → umdrehen → „Hinsetzen.“ → 22:20 Paul: „hast du ihre story gesehen?? krass 🔥“ → dasselbe Selfie, angeblich „3 Min.“ alt (Z. 694). Es ist aber schon 22 Minuten alt, und er hat es schon gesehen. (Das doppelte Bild steht schon in der Übergabe als offene Frage, die Zeitangabe kommt dazu.)
**Vorschlag:** In S3 `@setze selfieGesehen` und in L4_PAUL bei `selfieGesehen` „22 Min.“ statt „3 Min.“ zeigen. „~ … Was ist daran krass?“ passt dann sogar besser (er kennt es schon). **Bewertung: gut**. Kosten: 3 Zeilen Technik, kein Text.

**Z7 – Die Wette: Lynn gewinnt und verliert dieselbe Wette.**
- Z. 1758 (Balkon): Lynn: „Jetzt bin ich ’nen Zehner reicher.“
- Z. 2328 (Spät, er ist da): Jonas: „Schuldet mir übrigens ’nen Zehner.“
- Z. 3879 (Lynn-Ende): „Worauf hattest du eigentlich gewettet?“ – „Dass du kommst.“

Auf dem Spät-Weg ist er gekommen, trotzdem schuldet Lynn Jonas Geld. Wer beide Wege spielt (und das Spiel will das), merkt es. (Lauf 1, M3, jetzt mit dem Lynn-Ende eindeutig.)
**Vorschlag:** Nur das Lynn-Ende anpassen: Lynn: „Dass du kommst. Solange ich noch da bin.“ Dann stimmen alle drei Stellen, und der Satz wird sogar etwas wärmer. **Bewertung: gut**. Kosten: 1 Zeile, **Text, Okay nötig**.

**Z8 – Der Feuerlöscher passiert je nach Weg zwischen 23:20 und 23:50.**
Gemessen: 23:20 (die meisten Party-Wege), 23:31 (A4), 23:41 (S3), 23:50 (A6, S1, S2, X9: „Vor zehn Minuten“, Z. 2318, bei Ankunft 00:00).
Das Motiv „Zehn Minuten. Beide Male.“ hängt daran, dass Feuerlöscher und Lynns Aufbruch gleich lange her sind. Lynn geht überall um 23:41–23:50, nur der Feuerlöscher ist auf den Party-Wegen eine halbe Stunde früher.
**Vorschlag:** Z. 2037 `@uhr mind 23:20` → `@uhr mind 23:35`. Dann liegt der Feuerlöscher überall zwischen 23:35 und 23:50. Danach kommt sowieso `@uhr mind 23:45`, sonst verschiebt sich nichts. **Bewertung: gut**. Kosten: eine Zahl. (Lauf 1, H5, weiter offen.)

**Z9 – Mias Story „vor 2 Min.“, obwohl Mia schon weg ist.**
Weg: Tanzfläche zuerst, dann „Handy checken.“ (X13). Mia geht um 21:48 (Z. 1722), danach stehst du 15 Minuten auf der Tanzfläche (Z. 1726). Um 22:03 zeigt das Handy: „x.mia.x hat eine Story gepostet · vor 2 Min.“ (Z. 1458) mit dem Flur, in dem du stehst. Man könnte es als Mia-Witz lesen (sie postet, als wäre sie noch da), es wird aber nicht so erzählt.
**Vorschlag:** „vor 20 Min.“ (so war es in `03_testfeedback`, Nr. 9 entschieden). Passt auf allen Wegen, „~ Ich bin doch hier.“ wirkt genauso. **Bewertung: gut**. Kosten: eine Zahl.

**Z10 – „Noch sieben Stunden. Wenn ich jetzt einschlafe.“ (Z. 3500–3501)**
Um 01:47, der Wecker steht auf 6:30. Bis zur Prüfung sind es 7 Stunden, Schlaf bekommt er höchstens 4 Stunden 43 Minuten. Durch „Wenn ich jetzt einschlafe“ liest jeder den Satz als Schlafzeit, und dann ist er falsch.
**Vorschlag:** „~ Noch fünf Stunden. ~ Wenn ich jetzt einschlafe.“ (oder „Noch knapp fünf“). Das ist sogar härter. **Bewertung: gut**. Kosten: 1 Wort, **Text, Okay nötig**.

**Z11 – Entwurf an Lynn „du warst auf einmal weg“ nach zwei Stunden mit ihr (Z. 2901).**
Weg: Lynn-Weg mit „Draufschauen“ und dann heim (X1). Sie saßen bis 00:25 zusammen, Lynn hat sich im Flur verabschiedet („Viel Glück am Montag.“). Am Samstag tippt er „hey, wie war die party noch?“ / „du warst auf einmal weg“. Das passt nicht.
**Vorschlag:** Bei `lynn=="gm_geschaut"` andere Entwürfe, z. B. „sorry wegen dem handy“ / „war schön gestern“. Das greift auch „Dreiundzwanzig Benachrichtigungen“ auf. **Bewertung: gut**. Kosten: 2–3 Zeilen, **Text, Okay nötig**.

### Niedrig

| # | Stelle | Problem | Vorschlag | Bewertung |
|---|---|---|---|---|
| Z12 | Z. 2939 | Spät → „Mit zu Tim.“: Tim schreibt „alle wege führen wohl zu tim 😎“, den Rom-Witz hat man auf diesem Weg nie gehört. | Lassen. Das Sprichwort kennt jeder, der Witz funktioniert auch so. | – |
| Z13 | Z. 3028 | „Noch 34 Stunden“ um 23:10; alle anderen Karten runden ab (33 h 50 min → 33). | „Noch 33 Stunden.“ oder Uhrzeit 23:00. | geht so (rechnet kaum jemand nach), kostet aber nur eine Zahl |
| Z14 | Z. 97 | Oma „Sonntag 11:30“ bleibt im Handy wörtlich. Am Spiel-Sonntag und -Montag wirkt das, als hätte Oma heute bzw. gestern geschrieben. | Datum statt Wochentag: „06.01.“ | gut (eine Zahl) |
| Z15 | Z. 3193 | „Es liegt da seit heute Morgen. Es ist still.“ – um 12:40 hat er Jonas noch „lern“ geschrieben (Z. 3147). | „Es liegt da seit Mittag.“ oder nur „Es ist still.“ | gut, Text |
| Z16 | Z. 1889 | Lynn: „Du hast dich ja nicht mal getraut, mit mir zu reden.“ Im Rückblick haben sie geredet („Schenkung ist Schenkung.“), und gerade reden sie auch. Gemeint ist wohl „seitdem“. | „… dich seitdem ja nicht mal getraut, mich anzuschreiben.“ | geht so → gut, optional |
| Z17 | Z. 2186 / 2337 / 2787 | Lynn um 23:45: „Jonas kommt. Lena, Mia. Und Ben.“ Lena fegt aber um 01:20 noch bei sich Konfetti (Story „aufräumen“). | Lassen („kommt“ kann „später“ heißen). | – |
| Z18 | Z. 1445–1448, 1546–1556, 2308–2310 | Mama-Blöcke in Küche, Flur und Spät-Flur werden nie mehr erreicht (Mama kommt immer schon vor dem Haus). Darin steht „~ Noch 58 Stunden.“ | Aufräumen beim nächsten Bau oder lassen. Schadet nicht. | – |
| Z19 | GM-Weg | Lynn-Weg mit Balkon zuerst: vier Stunden bei 4 Grad draußen (21:43 bis 01:58). | Lassen, „Gar nicht gemerkt“ ist genau der Punkt. | – |
| Z20 | Z. 1221 / 728 | Musik nach 2 von 14 Minuten Weg hören, vom Fenster „weit weg“. | Lauf 1, M4. Klein. | – |
| Z21 | Samstag 09:47 (neu) | „ben.r gefällt dein Beitrag“ auf allen Wegen. Wer im Bad „Beste Party 🎉“ gepostet hat, hat eine Story, keinen Beitrag. Auf den Zuhause-Wegen gibt es keinen Beitrag vom Freitag. | Lassen (kann ein alter Beitrag sein) oder bei `BAD_POSTEN`-Wegen „gefällt deine Story“. | geht so |

### Geprüft und in Ordnung

- „Das war vor einer Stunde.“ (20:04 + Pause → 21:07). ✓
- Pauls Story-Zeit „3 Min.“ auf Weg A (Lena postet um 21:58 ein anderes Bild, das Selfie kommt um 22:17). ✓
- Lenas Live „gleich kommt die Torte!“ kurz vor 22:45, Torte um 22:45, Jonas’ Anruf mit dem Lied um 22:45. ✓
- „Torte schon angeschnitten“ bei Ankunft nach 22:45. ✓
- „Lynn ist vor zehn Minuten mit Tim los“ (Spät) und Abschied im Flur um 23:45 (andere Wege). ✓
- Lynns „Viel Glück am Montag“ und „~ Woher weiß sie das mit Montag?“ nur dort, wo er es ihr nicht erzählt hat. ✓
- Sonntag Weg B/Afterparty: Bereicherungsrecht versucht („Das wusste ich mal.“), dann gestrichen, nachts im PDF „kenn ich nicht“. Passt (wusste er mal, jetzt nicht mehr). ✓
- Bildschirmzeit „letzte Woche“ am Montagmorgen. ✓
- Neu seit heute Abend, mitgeprüft: Verpasst-Liste am Ende (Lied nur, wenn nicht mitgesungen; Mia nur ohne Tanzfläche; Tims Teppich nur ohne Küche; Afterparty „bis 3 Uhr“ passt zu 02:47/03:26; Feuerlöscher für alle, weil ihn niemand ganz sieht). ✓ Sonntag „Liegen lassen“ bei Jonas → Antwort „lern“ erst um 22:31. ✓ Outlook „Erinnerung: Prüfung Mo 9:00“. ✓
- Montag: 3 Stunden Prüfung, „Noch zehn Minuten“ um 11:50. ✓
- Doppelte Meldungen zu Lynn, Lenas Selfie, Mama und Jonas’ Anruf: außer Z5 und Z6 auf keinem der 36 Wege.

---

## 5. Was am wenigsten Limit kostet (Reihenfolge, falls Patrick zustimmt)

**Ohne Text (darf sofort, Sonnet Mittel reicht):**
1. Z1 Tim-Block auf dem Draufschau-Weg weglassen (eine Bedingung).
2. Z8 Feuerlöscher 23:35 (eine Zahl).
3. Z9 Mias Story „vor 20 Min.“ (eine Zahl).
4. Z13 „Noch 33 Stunden“, Z14 Oma „06.01.“ (je eine Zahl).
5. Z3 Uhr auf dem Balkon vor dem Sprung ausblenden (2–3 Zeilen).
6. Z5 Merkzeichen „Lynn hat gefragt“ (4 Zeilen).
7. Z6 Selfie „22 Min.“ (3 Zeilen).
8. Z4 Uhr nie rückwärts (kleine Engine-Änderung + 2 Zeilen).

**Mit Text (braucht Patricks Okay):**
9. Z2 Mia verpasst den Feuerlöscher (3–4 Zeilen). Größter Gewinn in diesem Bericht.
10. Z7 „Dass du kommst. Solange ich noch da bin.“ (1 Zeile).
11. Z10 „Noch fünf Stunden.“ (1 Wort).
12. Z11 Entwürfe nach dem Draufschau-Weg (2 Zeilen).
13. Z15, Z16 nach Lust.

Danach einmal `t8.py` und die Sonderwege aus diesem Bericht (A5, X3, X12, X13) laufen lassen. Inhaltsstopp ist Do 26.11.
