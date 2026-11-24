# Storycheck Lauf 1 – Logik, leere Tage, FoMO, Lynn-Weg (Stand 24.11.)

Grundlage: `spiel/story.txt` (3.672 Zeilen, Stand V8.9/9.0), alle 23 Wege aus `t8.py`, Abzeichen-Texte in `bilder.js`, Endbildschirm in `rahmen.js`. **Nur gelesen, nichts geändert.** Zeilen = story.txt jetzt. Noten und Zeile-für-Zeile-Textqualität kommen in Lauf 2.

Nicht geprüft: Bilder, Ton, Timing und echte Spielzeit (nur das Skript gelesen, nicht gespielt), das alte Story-Dokument (anderer Account), Philips Begleitmaterial/Video.

---

## Kurzfazit

Das Gerüst ist stark. Die Motive sind sauber verknüpft (Stift → „Rot ist fast leer“ → „Blau.“ in der Prüfung; „Zehn Minuten“ vom Prolog bis zur Prüfung; Pizza von Juli bis zum Ende; „Wichtig?“/„Nah.“ → „Unwichtig?“/„Ja.“; „Kausalität“ vom Prolog bis Montag). FoMO kommt am Freitag in allen Formen an, auch dort, wo man es nicht erwartet: **mitten auf der Party** (Mia, Bad, Tims Story). Probleme: eine echte Person im Spiel, eine Szene vermutlich falsch umgebaut, der Sonntag auf Weg B/Afterparty ist fast leer, und der Lynn-Weg kippt an genau einer Stelle (Monolog im Bett) in Kitsch.

---

## 1. Kritisch (vor der Abgabe klären)

**K1 – Echte Person im Spiel: „drachenlordofficial“ (Z. 739, Z. 941).**
Verstößt gegen Philips Regel „nur erfundene Namen“. Dazu kommt: Der echte Drachenlord steht für jahrelanges Mobbing gegen ihn. In einem Hochschul-Lernbaustein über digitale Psychologie kann der Witz so wirken, als würde man sich über ein Mobbing-Opfer lustig machen.
Vorschlag: erfundener Streamer (z. B. `gamerboy_kev` oder `nightlive_tv`), Rest gleich. Kostet fast nichts.

**K2 – Abschied: Entscheidung vermutlich in der falschen Szene umgesetzt.**
In `04_textentscheidungen` steht: **ABSCHIED_O** bekommt „~ … Langweiler.“ + Tim: „Ey, warte. Schon vergessen? Afterparty. Bei mir.“, das alte „Komm einfach mit zu mir!“ wird gestrichen. Eingebaut wurde das in **ABSCHIED_A** (Z. 2066–2070). In ABSCHIED_O steht noch das alte Tim: „Komm einfach mit zu mir!“ (Z. 2177), ohne „~ … Langweiler.“.
Vorschlag: Philip fragen, ob beide Abschiede die neue Fassung bekommen sollen (empfohlen, „Schon vergessen?“ passt auf beiden Wegen, weil man Tims Nachricht im Bad gelesen hat).

---

## 2. Hoch – Story-Logik und verschenkte Stellen (A)

**H1 – Lynn lädt ein, er sagt Ja, dann passiert nichts (Weg „Okay. Ich komm mit.“, Z. 2113 → AFTERPARTY).**
Lynn fragt direkt: „Du kommst doch noch mit zu Tim, oder? … Also, wenn du willst.“ Er sagt zu. Bei Tim steht dann nur „Drüben redet Lynn mit irgendwem. Ich komm nicht durch.“ (Z. 2362), danach kommt von ihr nichts mehr. Auf den Wegen „Eine Stunde. EINE.“/„Nein. Jetzt geh ich wirklich …“ ist das stark (er geht hinterher und kommt nicht ran). Auf dem Ja-Weg wirkt es wie ein vergessener Faden.
Vorschlag (eine Zeile, nur bei `ZU_TIM`): vor „Drüben redet Lynn …“ z. B. „Am Anfang stehen wir noch zusammen. Dann kommen die vom Konzert.“ So sieht man, wie er sie an die Party verliert.

**H2 – Auf dem glücklichen Weg sieht man nicht, dass Lynn auch etwas verpasst.**
Auf allen anderen Wegen geht Lynn gegen 23:45 mit Tim (Z. 2047, 2245). Auf „Gar nicht gemerkt“ bleibt sie bis zwei Uhr auf dem Balkon. Damit verpasst *sie* Tims Afterparty, und zwar mit Absicht. Das ist der Kern des Spiels (man kann sich aussuchen, was man verpasst), aber er wird nicht gezeigt.
Vorschlag (2 Zeilen im GM-Teil, z. B. nach Z. 1815): Tim ruft durch die Tür „Lynn! Wir gehen!“ → Lynn ruft zurück: „Geht schon mal.“ Sie bleibt. Kein Kommentar dazu. Das ist emotional, ohne kitschig zu werden (siehe D).

**H3 – Sonntag auf Weg B und Afterparty ist fast leer, und eine starke Pointe fehlt (SB, Z. 3126–3162).**
Wer am schlechtesten gelernt hat, bekommt den kürzesten Sonntag: Lernplan, drei Themen durchstreichen, „Kommt eh nicht dran.“, Jonas-Pizza, Sprung auf 22:31. Dabei steht die Pointe schon im Skript: Durchgestrichen wird auch **Deliktsrecht** (Punkt 3), und am Montag kommt genau **§ 823 – Deliktsrecht** dran (Z. 3443). Das hat er im Prolog verstanden („Deliktsrecht. Ergibt plötzlich alles Sinn.“). Im Spiel merkt das aber niemand.
Vorschlag (klein): Montag, nur für SB-Wege, nach „A könnte gegen B …“: `~ Deliktsrecht.` … `~ Freitag konnt ich das noch.` So schließt sich der Kreis vom Prolog bis zur Prüfung.

**H4 – Jura-Fall unlogisch (Z. 449–451, Weg A): „M bestellt online einen Kühlschrank, tippt aber 9 statt 900 Euro.“**
Ein Käufer, der sich zu seinen Gunsten vertippt, will nicht anfechten. „Keine Sorge, M. Ich hab dich.“ ergibt so keinen Sinn. Ein Jurist im Publikum merkt das sofort, und damit leidet die Glaubwürdigkeit.
Vorschlag: „V stellt einen Kühlschrank online, tippt aber 9 statt 900 Euro …“ und „Keine Sorge, V. Ich hab dich.“ (§ 119 I, Erklärungsirrtum, stimmt dann).

**H5 – Der Feuerlöscher passiert je nach Weg zu verschiedenen Zeiten.**
Im Bad etwa um 23:20 (Z. 1964). Auf dem Spät-Weg (Ankunft ca. 23:50) heißt es: „Vor zehn Minuten, du hättest ihn sehen sollen!“ (Z. 2237), also gegen 23:40. Wer zweimal spielt (und das Spiel will das ja), kann es merken. Das Motiv „Zehn Minuten. Beide Male.“ ist aber zu gut, um es zu ändern.
Vorschlag: im Bad `@uhr mind 23:35` statt 23:20 prüfen. Wenn das andere Zeiten verschiebt: lassen, das fällt nur wenigen auf.

---

## 3. Mittel – Logik, Unklarheiten, offene Fäden

| # | Stelle | Problem | Vorschlag |
|---|---|---|---|
| M1 | Z. 1856 | „Vor meiner Zwischenprüfung hat meine Schwester Schluss gemacht.“ heißt wörtlich: *die Schwester* hat Schluss gemacht. Gemeint ist wohl, dass sie verlassen wurde (sie heult ja die ganze Nacht). | „… hat der Freund meiner Schwester Schluss gemacht.“ oder „… wurde meine Schwester verlassen.“ |
| M2 | Z. 1718 | „Naja … wenn du lang genug mit deinem Finger schreibst …“: Die Pointe zum Flashback ist nicht klar (warum wird Rot dann leer?) und kann zweideutig klingen. | Philip fragen, was gemeint ist. Wenn es der Stinkefinger ist, eher: „Naja. Du hast ja noch deinen Finger.“ |
| M3 | Z. 1699 / 2247 / 3646 | Wette: Lynn ist „’nen Zehner reicher“, auf dem Spät-Weg „schuldet“ sie Jonas einen. Das passt nur, wenn „rechtzeitig kommen“ gemeint war. Ist bitter und gut, aber nicht eindeutig. | Optional bei Jonas: „Schuldet mir übrigens ’nen Zehner. Zu spät zählt nicht.“ |
| M4 | Z. 619, 699, 1163, 2276 | Wo wohnt Lena? Sophie geht „rüber“, vom Fenster hört man „weit weg Bässe“, der Weg dauert ca. 17 Min., nach 2 Min. „hör ich schon die Musik“, nachts singt jemand unten auf seiner Straße („Von Lena?“). | Nur eins davon angleichen: „Irgendwo Bässe“ statt „weit weg“ reicht. |
| M5 | Z. 1399 | Mias Story im Hub zeigt den Raum „vor 2 Min.“, entschieden war „vor 20 Min.“ (03_…, Nr. 9). | Kurz prüfen. „vor 2 Min.“ ist eigentlich stärker (er schaut sich den Raum an, in dem er steht). |
| M6 | Z. 2371 | Spät-Weg → „Mit zu Tim“: Die Uhr bei Tim zeigt 23:50, obwohl er erst ca. 23:50 bei Lena ankam. | Für `ankunft>23:30` z. B. 00:15 zeigen. |
| M7 | Z. 173 / 207 / 161 | Jura wird mit Punkten (0–18) benotet, nicht mit 5,0. Nur bei einem LL.B. an einer Hochschule gibt es 5,0. | Lassen (KSH-Publikum versteht 5,0 sofort), aber bewusst entscheiden. |
| M8 | Verlauf Z. 133–138 | Jonas: „bist du immer noch jede nacht in dem game drin“ wird angelegt, kommt aber nie wieder. | Entweder streichen oder einmal aufgreifen (z. B. Sonntagnacht ein Spiel-Hinweis auf dem Sperrbildschirm). |
| M9 | Z. 1412, 2000 | Ben wird zweimal mit Herzschlag als Rivale angedeutet und nie aufgelöst. | Okay als Stachel, nicht ausbauen. |
| M10 | Z. 2150 | „Lynn kennt sich bestimmt mit Recht aus.“: Die Ausrede ist schwer zu verstehen (sie studiert ja nicht Jura, „Spar dir deine Jura-Scheiße“). | Klarere Ausrede, z. B. „Lynn hat bestimmt Karteikarten.“ |
| M11 | Z. 3659–3663 | Lynn-Ende: „Unwichtig?“ – „Ja.“ bezieht sich auf **Jonas** („bereit für heute abend?“). Im Monolog hieß es noch „hab ich immer noch Jonas“. | Gewollt? Wenn ja, ist das stark (er verpasst jetzt Jonas). Sonst Absender ändern (Gruppe/Tim). |

**Wer weiß was wann: geprüft, passt.** Jonas’ „lynn hat nach dir gefragt“ kommt nur einmal (Anruf *oder* Chat *oder* Sperrbildschirm im Flow). Lynn weiß auf dem Weg „geschaut“ vom Montag, ohne dass er es ihr gesagt hat. Das ist mit „Woher weiß sie das mit Montag?“ (Z. 2327) bewusst offen und ein guter Grund, nochmal zu spielen. Blaue Haken, Entwürfe und „schreibt …“ passen auf allen Wegen zusammen. Die Countdown-Karten stimmen (60/46/42/34/24/10 Std., „Noch 58 Stunden“ um 22:45).

---

## 4. Tage und Figuren (B)

**Verteilung:** Prolog und Freitag machen rund 70 % des Skripts aus. Samstag, Sonntag und Montag sind je etwa 9–10 %.

| Tag | Zustand | Urteil |
|---|---|---|
| Prolog | dicht, Motive sauber gesetzt (Stempel, „Zeit. Kausalität. Partys.“, zehn Minuten Pause) | gut, nichts nötig |
| Freitag | sehr voll, auf jedem Weg eigene Stellen | gut, eher kürzen als ergänzen (Lauf 2) |
| Samstag | absichtlich Handy-Tag. Stark: „Ich bin auf keinem Foto.“, Mias „noch wer wach?“ um 05:12 mit 2 Aufrufen, Lynns Becher, Lynn tippt zweimal und hört auf. Schwach: auf den Zuhause-Wegen kein einziger Moment ohne Handy zwischen 10:32 und 23:10, dazu Chat, Story, Chat, Story | geht, wirkt aber eintönig. Kein Text nötig, nur ein Bild-/Tonmoment am Schreibtisch dazwischen |
| Sonntag SO | Lernplan, Jonas, Foto-Dump + „Fotograf des Jahres“, „Ich krieg das hin.“ | okay |
| **Sonntag SB** (Weg B, Afterparty) | ca. 10 Zeilen, dann Sprung auf 22:31 | **zu leer**, siehe H3 |
| Sonntagnacht | stark: Lena „du kannst das eh“ → „Wie die letzten zwei Male.“ → gelöscht. Maras PDF als FoMO beim Lernen | gut |
| Montag | stark: Handy aus, Phantom-Vibration in der Prüfung, drei Stufen nach Lernstand | gut |

**Figuren:**
- **Zu dünn, aber gewollt:** Ben (nur Stachel), Papa (ein 👍, passt als Distanz), Sophie (eine Tür-Szene, die sitzt).
- **Lynn auf den Nicht-Lynn-Wegen:** ca. 2 Minuten. Das ist Absicht (man bekommt sie nur ohne Handy), aber dann muss jede ihrer Zeilen sitzen. Siehe H1.
- **Jonas:** Rahmenfigur (Anfang und Ende), sein ehrlicher Moment („Schön, dass du da bist. Glaub mir.“) kommt aber nur, wenn man in die Küche geht. Auf Wegen ohne Küche ist er nur Antreiber im Chat. Kein Muss, aber die größte Lücke bei den Hauptfiguren.
- **Der Ich-Erzähler:** Was passiert, wenn er durchfällt, wird nie konkret („Alles hängt an Montag.“). Ein Satz zu den Folgen würde jede Handy-Entscheidung schwerer machen. Der beste Ort ist der Balkon nach „Letzter.“ – „Oh.“ (Z. 1842–1845): Dort wirkt es schon, ohne dass es ausgesprochen wird. Nur ergänzen, wenn Philip will.
- **Mia:** beste Nebenfigur (drei Partys, „Ich geh halt immer zuerst.“, 05:12 „noch wer wach?“), aber nur auf dem Tanz-Weg. Passt.

---

## 5. FoMO als Hauptthema und Lernbaustein (C)

**Wo FoMO stark ankommt:**
- K1: „glaub mir, du verpasst was“: Titel und Ende verbunden.
- Küche Z. 1454–1459: „Ich war da nicht dabei. … Ich lache trotzdem mit. … Ich weiß nicht.“ Das ist FoMO *vor Ort*, eine der besten Stellen.
- Bad Z. 1980/2018: „Ein anderes Wohnzimmer. Andere Leute. … Sieht voller aus.“ / „Kann ich nicht einfach an beiden Orten sein?“
- Mia: drei Partys „story-mäßig“, „Meistens sind’s dann alle.“
- Paul-Story: Hype gegen Wirklichkeit („Was ist daran krass?“), dann kommt die wirklich krasse Story.
- Hub: „Ich bin doch hier.“ Er schaut auf dem Handy den Raum an, in dem er steht.
- Samstag: „Ich bin auf keinem Foto.“ Stärkster Einzelsatz zum Thema.
- Weg B: Benachrichtigungs-Flut, Shutdown, Lähmung (beide Knöpfe werden grau). Spielerisch die stärkste Umsetzung.
- „Planen gehört ja auch zum Lernen dazu.“: Aufschieben, das sich wie Lernen anfühlt. Sehr gut beobachtet.
- Bilanz am Ende: „{n}-mal von dir aus aufs Handy geschaut. {m}-mal war nichts Neues.“ Das ist der Kern des Lernbausteins (Gewohnheit, Belohnung nur manchmal).

**Wo es verwässert:**
- Mia-Gespräch Z. 1581–1603 (verklagen, Bank-Brief, dreimal heiraten): lustig, aber weg vom Thema. Kürzen in Lauf 2 prüfen.
- Tim/Teppich/§ 827: guter Jura-Witz, aber ohne FoMO. Okay als Atempause.
- Lynn-Weg: Dort ist FoMO absichtlich umgedreht (Freude am Verpassen). Das funktioniert nur, wenn man klar sieht, *was* er verpasst (Feuerlöscher ✓ am Samstag „war ich nicht. war woanders“) und was *sie* verpasst (fehlt, siehe H2).

**Pro Weg:**
| Weg | FoMO spürbar? |
|---|---|
| A mit Flow | ja, durch Gegensatz: im Flow keine FoMO, um 23:40 alles auf einmal. Sehr gut |
| A ohne Flow | ja (Paul, Lena-Story, Fenster, Anruf) |
| B | sehr stark, fast schon Überforderung statt FoMO. Passt aber, weil das eine aus dem anderen kommt |
| Party | stark (Küche, Bad, Mia) |
| Spät | sehr stark („Zehn Minuten. Beide Male.“) |
| Afterparty | gut („Ich war doch gerade noch auf der Party, die alle verpasst haben.“, „Eine Stunde ist keine Stunde“) |
| Lynn | Gegenstück, gewollt. Braucht H2, sonst wirkt es wie „Handy weg = Belohnung Liebe“ |

**Glaubwürdigkeit als Lernbaustein:**
- Gut: Phantom-Vibration (Nacht + Prüfung „Das ist aus. Das liegt da vorne.“), Highlight-Storys gegen Wirklichkeit (Mias halbleerer Flur, 2 Aufrufe um 05:12), FoMO beim Lernen (Maras PDF, „aus dem letzten Durchgang“), Bildschirmzeit-Bericht, Bilanz. Für Dozenten gut erkennbar.
- Risiko 1: K1 (echte Person).
- Risiko 2: Der Lynn-Weg belohnt „Handy zweimal ignorieren“ mit Romantik. Das kann **moralisch** wirken. Das Spiel fängt das gut auf: Prüfung bleibt offen („Weiß ich in sechs Wochen.“), und auch das beste Ende sagt noch „du verpasst was“. H2 würde es weiter abschwächen (Lynn wählt selbst).
- Risiko 3: Jura-Fehler (H4) und 5,0 (M7). Für das KSH-Publikum klein, für Juristen sichtbar.
- Was ich nicht sehe: Erklärt das Spiel selbst irgendwo, was FoMO ist (Begriff, Studie)? Im Skript nicht. Wenn das nur im Video kommt, ist das okay. Dann aber im Video die Spielstellen den Begriffen zuordnen (z. B. Bilanz = Belohnung nur manchmal, Mia = Story-Selbstdarstellung).

---

## 6. Lynn-Weg: zu kitschig? (D)

**Ehrliches Urteil:** Die Dialoge sind meistens **nicht** kitschig, weil fast jeder weiche Satz sofort gebrochen wird. Der Kitsch sitzt an **vier Stellen**, und eine davon ist die größte Schwäche des ganzen Wegs.

**Was gut funktioniert (bitte so lassen):**
- Laserpointer/Stinkefinger: Lynn ist frech, nicht nur lieb.
- „Dann hast du ja zweimal nicht aufgegeben.“ → „… Oder du bist einfach stur.“ Fast Kalenderspruch, aber im selben Atemzug gebrochen.
- „Feigling.“ / „Kein Kommentar.“
- „Wie viele hast du denn noch?“ – „Letzter.“ – „Oh.“ – „Und dann stehst du hier. Auf einem Balkon.“ – „Bereust du’s?“ – „Frag mich Montag.“ Stark, weil kurz.
- Die Schwester-Geschichte: Lynn hat schon einmal *bewusst* etwas verpasst (See, Insta am Morgen, „War mir egal.“). Das spiegelt das Thema, ohne es zu erklären.
- „Okay. Und ich bin auf eine Party gegangen. Bisschen was anderes, oder?“ – „Bisschen.“ Selbstironie statt Pathos.
- „Lynn, willst du mich heiraten?“ – „Entspann dich. Höchstens beim zweiten Date.“ Bricht die Stimmung genau richtig.
- Samstag: Becher-Story, „Der linke ist meiner.“, Lynn tippt zweimal und hört auf. Ohne Worte, sehr stark.
- Montagabend: „Ich wollt dir übrigens schreiben. Zweimal.“ – „Hab’s wieder gelöscht.“ – „… Kenn ich.“ und „Unwichtig?“ – „Ja.“ Bestes Ende im Spiel.

**Wo es kitschig wird:**
1. **Monolog im Bett, Z. 2639–2664 (größtes Problem).** 25 Zeilen, in denen er seine Gefühle *erklärt*, die der Spieler gerade selbst erlebt hat.
   - „Manchmal fühlt sich ein Moment einfach unendlich an. Obwohl man weiß, dass er irgendwann aufhören muss. Aber vielleicht vergisst man eben genau das. Oder will es vergessen. Und lässt es einfach zu.“ Das klingt wie eine Instagram-Bildunterschrift, nicht wie er.
   - „Und irgendwie bin ich ein bisschen stolz auf mich. Dass ich mich diesmal getraut hab.“ Erzählt, statt zu zeigen.
   - „… will ich mich vielleicht doch nicht dran erinnern. Haha.“ Das „Haha“ im eigenen Kopf wirkt unecht.
   - Dazu springt der Text: Gefühl → Krypto-Witz → Philosophie → Lernlust → Jonas → Pizza.
   *(Philip hatte entschieden: „bleibt vorerst unverändert“. Ich empfehle trotzdem zu kürzen.)*
   Vorschlag (nur aus seinen eigenen Sätzen, ca. 8 Zeilen):
   > Ich hör immer noch, wie sie über Tims Krypto-Ding lacht. / … / Auf einmal war es zwei Uhr. Gar nicht gemerkt. / … !3 / Ich glaub, heute hab ich mal nichts verpasst. / … / Und falls das alles schiefgeht … / hab ich immer noch Jonas. / Der kommt dann wieder mit Pizza.
2. **„Jetzt schon.“ (Z. 1926)** auf „Hast du eigentlich schon was vor? Nach deiner Prüfung?“ Das ist der klassische Flirt-Satz aus Liebesfilmen. Das folgende „Montagabend?“ – „Montagabend.“ trägt den Moment allein. Vorschlag: „Jetzt schon.“ durch eine Pause ersetzen (`… !2`) oder durch etwas Typisches von ihm: „Schlafen. Drei Tage.“, dann Lynn: „Und danach?“ – „Montagabend?“
3. **„Länger als nötig.“ (Z. 1955)** Fester Liebesroman-Ausdruck. Das Bild zeigt die Umarmung schon. Vorschlag: nur „Zum Abschied umarmt sie mich.“ + `… !3`.
4. **„Wir lachen beide.“ (Z. 1836)** Leere Zeile wie aus einer Liebeskomödie. Vorschlag: streichen, das Lachen ist als Ton/Bild da.
5. Grenzfall: **„Man verpasst immer irgendwas.“ – „Fragt sich nur, was.“ (Z. 1883–1884)** Das ist die Botschaft des Spiels, laut ausgesprochen. Lynns „Hab ich mich heute natürlich noch gar nicht gefragt.“ rettet es zum Teil. Lassen oder nur „Fragt sich nur, was.“ streichen (dann kommt Lynns Antwort direkt auf die Botschaft und wird zum Witz).

**Wie der Weg emotional wird, ohne kitschig zu werden:**
- **Zeigen, was es kostet, nicht was er fühlt.** Die versteckte Uhr (`@uhr verstecken`) und das zweite Vibrieren, auf das er nicht schaut, wirken schon. Mehr davon, weniger Monolog.
- **Lynn wählt auch** (H2): „Geht schon mal.“ ist mehr Liebeserklärung als jeder Satz im Monolog.
- **Eine verletzliche Stelle von ihm, nicht nur von ihr.** Bisher erzählt Lynn ihre Schwester-Geschichte, seine Angst wird nur zusammengefasst („Ich erzähl ihr vom dritten Versuch.“). Ein ehrlicher Halbsatz von ihm nach „Frag mich Montag.“ reicht.
- **Gegenstände statt Worte:** Stift, Becher, Lippenstift, „LynnA“ in der Prüfung. Das funktioniert schon sehr gut, daran festhalten.

---

## 7. Was am wenigsten Limit kostet (Reihenfolge für den Bau, falls Philip zustimmt)

1. K1 Streamer-Name tauschen (2 Zeilen).
2. K2 Abschied klären (1 Rückfrage, 3 Zeilen).
3. H4 Kühlschrank-Fall (2 Zeilen).
4. D2–D4 „Jetzt schon.“, „Länger als nötig.“, „Wir lachen beide.“ (3 Zeilen).
5. H2 „Geht schon mal.“ (2 Zeilen + evtl. Ton).
6. H1 eine Zeile bei Tim.
7. H3 Montag-Gedanke für SB (2 Zeilen).
8. D1 Monolog kürzen (nur streichen, nichts Neues).
9. M1–M11 nach Lust und Laune.

Für alles bis Punkt 8 reicht Sonnet Mittel. Inhaltsstopp ist Do 26.11.
