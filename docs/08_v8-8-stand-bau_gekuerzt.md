# V8.8 – Stand nach dem Bau (22.11.) – GEKÜRZT (Volltext im Projekt-Doc `claude/v8-8-stand-bau.md`)

Test-Link (privat): Slug `5d6f857a-23db-4da8-8501-add017b70699` (V8.8 + neue Balkon-Schleife vom 22.11. 21:14). Öffentlicher Link bleibt V5. Repo main: V8.8 = 4bf5a02. Test: `t8.py` alle 23 Wege ohne Fehler. Lernstand-Schwellen `LERN_MITTEL = 3`, `LERN_HOCH = 6` (Einstellungen oben im Skript). Technische Details: `CLAUDE.md`.

## Start/Ende nach Vorlage (B9) – Unterschiede, die Philip jetzt zurückgestellt haben will (23.11.: „1:1 wie Vorlage“)
1. **Lampe:** im Spiel warmes Licht mit Schirm und seltenem Flackern – Vorlage: grünliches Neonlicht; Philip: Lampe muss richtig leuchten, leicht flackern, Licht am Boden vor dem Fenster, Fenster animieren.
2. **Abzeichen:** Spiel 2 Spalten, größere Schrift, scrollbar – Vorlage 3 Spalten, kleinere Schrift. Zurück zur Vorlage; bei Bedarf Vollbild-Ansicht beim Antippen, dunkler Hintergrund.
3. **Bilanz-Sätze:** im Spiel größer/heller – auf Vorlagengröße bringen.
4. Dunkler Verlauf links (Endbildschirme): schon an die Vorlage angeglichen.
5. Musik: Menü = gedämpfte Party, Enden = FoMO-Lied, Lynn-Ende = „Warm“. Bekannter Fehler: Beim Zurück ins Menü läuft die Endmusik weiter + Menümusik startet zusätzlich → kurz schwarz, Musik aus, Startbildschirm mit passender Musik.

## Nicht gebaut / offen nach V8.8
N (Katerfrühstück-Story) – wie geplant nicht. E20 erledigt (durch Verschreiber, streichen). G50 schwarze Ränder nicht gezielt geprüft. G30 „Traum-Ausstieg hart“ unklar. N34bB (Becher auf dem Fensterbrett) als Reserve. J1-15 (Sahne bei Lena) unverändert.

## Test-Protokoll (nur Test-Link)
`protokoll.js` schreibt in die Artefakt-Datenbank des Test-Links (Sammlung `protokoll`, Dokumente `protokoll/<sitzung>_<nr>`), Knopf ⚑ = Fehler markieren. Öffentliche Fassung: `ABGABE=1 python3 build.py` (keine Stoppuhr, kein Sprungmenü, kein Protokoll).
