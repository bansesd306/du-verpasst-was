// =====================================================================
//   BILDER: Code → Datei
//   datei leer ("")  = Platzhalter (16:9-Feld mit Code und Beschreibung)
//   stimmung         = Farbe des Platzhalters: nacht, zimmer, party, balkon,
//                      pruefung, morgen, tag, strasse, flur, bad, traum, foto
//   filter           = Claude-Variante eines Bildes (dunkel, lichtaus, nacht)
//   ersatz           = solange die Datei fehlt, dieses Bild zeigen (z. B. andere Gesichter von Lynn)
//   blinzeln         = Bild mit geschlossenen Augen (für Figuren)
//   lichter          = Positionen der Lichterkette (funkeln)
//   Neue Bilder: Datei in den Ordner img/ legen und hier den Namen eintragen.
// =====================================================================
const BILDER = {
  // ---------- Zimmer (fertig) ----------
  N09:  { datei: "img/N09.webp",  text: "Zimmer aus der Tür (Master), Schreibtisch, Lampe an", stimmung: "zimmer" },
  N09T: { datei: "img/N31b.webp", text: "Zimmer bei Tag, leer", stimmung: "tag" },
  N09D: { datei: "img/N09.webp",  text: "N09, Licht aus (Claude-Variante)", filter: "lichtaus" },
  K12:  { datei: "img/K12.webp",  text: "Fensterblick nachts", stimmung: "nacht" },
  L4b:  { datei: "img/L4b.webp",  text: "Fenster offen, Blick nach draußen", stimmung: "nacht" },
  K12N: { datei: "img/K12.webp",  text: "Fensterblick, später Abend (Claude-Variante)", filter: "nacht", fenster: true },
  N04:  { datei: "img/N04.webp",  text: "Schreibtisch mit Handy (Display nach unten)", stimmung: "zimmer", tisch: true },
  B05:  { datei: "img/B05.webp",  text: "Schreibtisch ohne Handy, Lampe an, Kalender", stimmung: "zimmer", tisch: true },
  K10:  { datei: "img/B05.webp",  text: "Schreibtisch (normal hell, Philip 20.11.)", tisch: true },
  L4:   { datei: "img/L4.webp",   text: "Kaffeetasse auf Skript", stimmung: "zimmer", tisch: true },
  N03:  { datei: "img/N03.webp",  text: "Tischecke, zwei Klausuren mit 5,0", stimmung: "zimmer" },
  N1:   { datei: "img/N1.webp",   text: "Bett nachts, Handy neben dem Kissen", stimmung: "nacht", handy: [0.516, 0.664, 0.135, 0.104] },
  SO:   { datei: "img/SO.webp",   text: "Bett bei Tag, Handy leuchtet", stimmung: "tag" },
  N08:  { datei: "img/N08.webp",  text: "Hand an der Zimmertür, innen", stimmung: "zimmer" },
  T:    { datei: "img/T.webp",    text: "Hand an der Zimmertür, außen (dunkel)", stimmung: "nacht" },
  N31a: { datei: "img/N31a.webp", text: "Zeitraffer: Morgen, er im Bett am Handy", stimmung: "morgen" },

  // ---------- Zimmer (noch offen) ----------
  N02:  { datei: "img/N02.webp", text: "Ich-Sicht aus dem Bett nachts: Regal links, Tür geradeaus, Schreibtisch rechts (V8)", stimmung: "nacht" },
  N31b: { datei: "img/N31b.webp", text: "Zeitraffer: Mittag, Bett leer", stimmung: "tag" },
  N31c: { datei: "img/N31c.webp", text: "Zeitraffer: Nachmittag, wieder im Bett am Handy", stimmung: "tag" },
  N31d: { datei: "img/N31d.webp", text: "Abend, er am Schreibtisch, Lampe an", stimmung: "zimmer", tisch: true },
  N06:  { datei: "", text: "Kleiderschrank offen", stimmung: "zimmer" },
  N07:  { datei: "", text: "Blick nach unten aufs Outfit, Schuhe", stimmung: "zimmer" },
  L7: { datei: "", ersatz: "N31d", filter: "dunkel", text: "Schreibtisch von hinten, nur Handylicht", stimmung: "nacht", tisch: true },
  SO1a: { datei: "img/SO1a.webp", text: "Sonntag: Morgen, er am Schreibtisch", stimmung: "morgen", tisch: true },
  SO1b: { datei: "img/SO1b.webp", text: "Sonntag: Mittag, er am Schreibtisch", stimmung: "tag", tisch: true },
  SO1c: { datei: "img/SO1c.webp", text: "Sonntag: Nachmittag, er am Schreibtisch", stimmung: "tag", tisch: true },
  SO1d: { datei: "img/N31d.webp", text: "Sonntag: Abend, er am Schreibtisch, Lampe an", stimmung: "zimmer", tisch: true },
  N38a: { datei: "img/N38a.webp", text: "Rückblende Seminar: mein zerknitterter, leerer Block (V8)", stimmung: "traum" },
  N38b: { datei: "img/N38b.webp", text: "Rückblende Seminar: Lynn kichert hinter der Hand (V8)", stimmung: "traum", figur: true },
  N38:  { datei: "img/N38.webp", text: "Rückblende Seminar: Lynn hält mir den Vierfarb-Stift hin (V8)", stimmung: "traum", figur: true },
  N26:  { datei: "img/N26.webp", text: "Handyfoto: Küche, Jonas mit Becher, Lynn hinten (V8)", stimmung: "foto", zoom: [.515, .5], scharf: "N26s" },
  N26s: { datei: "img/N26s.webp", text: "Handyfoto Küche, Lynn scharf (beim Ranzoomen wird darauf überblendet)", stimmung: "foto", zoom: [.515, .5] },
  B07: { datei: "img/B07.webp", text: "Lenas Story: Selfie mit Konfetti, Lynn klein hinten", stimmung: "foto" },
  N27:  { datei: "img/N27.webp", text: "Handyfoto Gruppe auf dem Sofa, Lynn als Letzte, daneben ein Platz frei (V8)", stimmung: "foto", story: "ganz" },
  N28: { datei: "img/N28.webp", text: "Handyfoto: Tims Wohnzimmer voller Leute", stimmung: "foto" },
  N29:  { datei: "img/N29.webp", text: "Lynns Story: zwei Becher auf dem Balkongeländer, Lichterkette (V8)", stimmung: "balkon" },
  APS: { datei: "img/APS.webp", text: "Afterparty-Story bei Tim", stimmung: "foto" },

  // ---------- Straße ----------
  B10:  { datei: "img/B10.webp", text: "Haustür von außen, Treppe, Laterne", stimmung: "strasse" },
  W0:   { datei: "img/B14.webp", text: "Straße, Partyhaus noch im Nebel", stimmung: "strasse" },
  B15:  { datei: "img/B15.webp", text: "Straße, Partyhaus weit weg", stimmung: "strasse" },
  N11:  { datei: "img/N11.webp", text: "Straße, Haus näher", stimmung: "strasse" },
  N12:  { datei: "img/N12.webp", text: "Straße, Haus ganz nah, Fenster bunt", stimmung: "strasse" },
  B16:  { datei: "img/N12.webp", text: "Haus mit leuchtenden Fenstern, Treppe", stimmung: "strasse" },
  B14:  { datei: "img/B14.webp", text: "Leere Straße, Laternen (Heimweg)", stimmung: "strasse" },

  // ---------- Party ----------
  B09:  { datei: "img/B09.webp", text: "Flur mit Jacken, offene Tür zur Party", stimmung: "flur" },
  SP1: { datei: "img/SP1.webp", text: "Flur spät, Jacken auf dem Boden", stimmung: "flur" },
  N36: { datei: "img/N36.webp", text: "Party-Hub: links Küche, geradeaus Balkon (Lynn hinten), rechts Tanzfläche", stimmung: "party" },
  N13: { datei: "img/N13.webp", text: "Küche: Jonas an der Theke, Lena lacht", stimmung: "party" },
  B12: { datei: "img/B12.webp", text: "Küche: Jonas nah, ernst", stimmung: "party", figur: true },
  N30: { datei: "", text: "Nah: kaputte Bierflasche auf Lenas Teppich", stimmung: "party" },
  TORTE: { datei: "", ersatz: "N13L", text: "Angeschnittene Torte (neu)", stimmung: "party" },
  N35: { datei: "", ersatz: "N35M1", text: "Mia auf der Tanzfläche (Video)", stimmung: "party" },
  N35b: { datei: "img/N35b.webp", text: "Mia nah, hat mich entdeckt", stimmung: "party", figur: true, blinzeln: "N35z" },
  N35c: { datei: "img/N35c.webp", text: "Mia filmt mich, Handy vor meinem Gesicht", stimmung: "party", figur: true },
  N32a: { datei: "img/N35w.webp", text: "Party-Pool: volle Tanzfläche", stimmung: "party", pool: true },
  N32b: { datei: "img/N32b.webp", text: "Mia: TIM! DAS IST MEIN LIED!", stimmung: "party" },
  N32c: { datei: "", ersatz: "B12A", text: "Party-Pool: Jonas auf dem Tisch", stimmung: "party", pool: true },
  N32d: { datei: "img/N32d.webp", text: "Lena mit Torte und Wunderkerzen", stimmung: "party", funken: [[.452,.705],[.503,.632],[.512,.742],[.556,.712]] },
  N32e: { datei: "", ersatz: "N13", text: "Party-Pool: lachende Gruppe, Handy-Blitze", stimmung: "party", pool: true },
  N33: { datei: "img/N33.webp", text: "Wohnzimmer spät, halb leer", stimmung: "party" },
  N16:  { datei: "", text: "Badezimmer, Spiegel, gedämpftes Licht", stimmung: "bad" },
  A1: { datei: "img/A1.webp", text: "Party 00:40, voll, aber müde", stimmung: "party" },
  N17: { datei: "img/N17.webp", text: "Flur: meine Hand nimmt die Jacke vom Haken", stimmung: "flur" },
  N18: { datei: "img/N18.webp", text: "Flur: Lynn kommt aus der Badtür", stimmung: "flur", figur: true },
  N19: { datei: "img/N19.webp", text: "Flur: Lynn nah, strahlt", stimmung: "flur", figur: true },
  N20: { datei: "img/N20.webp", text: "Flur: Lynn geht, schaut zurück", stimmung: "flur", figur: true },
  N21: { datei: "img/N21.webp", text: "Flur: Lynn geht in die Party (dunkler)", stimmung: "flur" },
  AO4:  { datei: "", text: "Blick zurück durchs Wohnzimmer zur Balkontür", stimmung: "party" },

  // ---------- Balkon (Lynn-Testbilder vom 18.11.) ----------
  N14:  { datei: "img/N14.webp",  text: "Balkon nachts, Lynn am Geländer (neutral)", stimmung: "balkon", figur: true, blinzeln: "N14z",
          lichter: [[0.28,0.606],[0.296,0.616],[0.264,0.646],[0.314,0.676],[0.854,0.678],[0.01,0.684],[0.131,0.681],[0.349,0.69],[0.241,0.699],[0.881,0.705],[0.216,0.728],[0.914,0.729],[0.997,0.731],[0.029,0.736],[0.939,0.74],[0.365,0.748],[0.401,0.751],[0.972,0.754],[0.066,0.753],[0.154,0.752],[0.182,0.757],[0.09,0.767],[0.121,0.768],[0.484,0.78],[0.423,0.789],[0.457,0.796]] },
  N14r: { datei: "img/N14r.webp", text: "Lynn redet mit den Händen", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14g: { datei: "img/N14g.webp", text: "Lynn dreht sich weg und geht", stimmung: "balkon", lichterVon: "N14" },
  N14z: { datei: "img/N14z.webp", text: "Lynn, Augen zu (zum Blinzeln)", stimmung: "balkon" },
  N14b: { datei: "img/N14b.webp", text: "Lynn lacht", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14c: { datei: "img/LNN.webp", text: "Lynn nah, hört zu", stimmung: "balkon", figur: true },
  N14d: { datei: "img/LNL.webp", text: "Lynn nah, lächelt frech", stimmung: "balkon", figur: true },
  N14e: { datei: "img/LNN.webp", text: "Lynn nah, leise überrascht", stimmung: "balkon", figur: true },
  N15:  { datei: "img/N15.webp", text: "Balkon leer", stimmung: "balkon", lichterVon: "N14" },
  N29b: { datei: "", text: "Balkon leer, zwei Becher auf dem Geländer", stimmung: "balkon" },
  N34:  { datei: "img/N34.webp", text: "Er und Lynn von hinten auf dem Balkonboden, Leute drinnen (gespiegelt, V8)", stimmung: "balkon" },
  N34b: { datei: "img/N34b.webp", text: "Er und Lynn von hinten auf dem Balkonboden, drinnen leer (gespiegelt, V8)", stimmung: "balkon" },
  N25:  { datei: "img/N25.webp", text: "Prüfungsraum, Lynns Stift auf dem Tisch (V8)", stimmung: "pruefung" },
  N37:  { datei: "img/N37.webp", text: "Jonas lehnt in der Wohnungstür, Pizza in der Hand (V8)", stimmung: "flur", figur: true },
  N36L: { datei: "img/N36L.webp", text: "Party-Hub ohne Lynn", stimmung: "party" },
  N36Z: { datei: "img/N36Z.webp", text: "Blick durch die Balkontür: Lynn allein am Geländer (Zuschnitt, V8)", stimmung: "balkon", figur: true },
  HB1: { datei: "img/HB1.webp", text: "Hub: Ben erzählt Lynn was, sie lacht", stimmung: "party" },
  BR: { datei: "img/BR.webp", text: "Balkon-Gegenblick: allein draußen, drinnen die Party", stimmung: "balkon" },
  B12T: { datei: "img/B12T.webp", text: "Begrüßung: Jonas kommt winkend durch die Tür", stimmung: "flur" },
  B12A: { datei: "img/B12A.webp", text: "Begrüßung: Jonas und Lena lachen", stimmung: "flur" },
  B12B: { datei: "img/B12B.webp", text: "Begrüßung: Jonas mit offenen Armen", stimmung: "flur" },
  N13L: { datei: "img/N13L.webp", text: "Küche: Lena dreht sich zu mir um", stimmung: "party" },
  B12L: { datei: "img/B12L.webp", text: "Küche: Jonas nah, kleines Lächeln", stimmung: "party", figur: true },
  N32dC: { datei: "img/N32dC.webp", text: "Lena versinkt im Cringe", stimmung: "party", funken: [[.452,.705],[.503,.640],[.512,.742],[.557,.705]] },
  N32dP: { datei: "img/N32dP.webp", text: "Wunderkerzen brennen runter", stimmung: "party" },
  N32dA: { datei: "img/N32dA.webp", text: "Wunderkerzen aus, alle jubeln", stimmung: "party" },
  N35M1: { datei: "img/N35M1.webp", text: "Mia mitten in der Menge", stimmung: "party" },
  N35M2: { datei: "img/N35M2.webp", text: "Mia in der Menge, Lücke", stimmung: "party" },
  N35z: { datei: "img/N35z.webp", text: "Mia, Augen zu", stimmung: "party" },
  N35cL: { datei: "img/N35cL.webp", text: "Mia filmt und lacht", stimmung: "party", figur: true },
  N35t: { datei: "img/N35t.webp", text: "Mia tippt aufs Handy", stimmung: "party", figur: true },
  N35n: { datei: "img/N35n.webp", text: "Mia neugierig", stimmung: "party", figur: true },
  N35s: { datei: "img/N35s.webp", text: "Mia skeptisch", stimmung: "party", figur: true },
  N35be: { datei: "img/N35be.webp", text: "Mia bettelt", stimmung: "party", figur: true },
  N35d: { datei: "img/N35d.webp", text: "Mia zeigt drei Finger", stimmung: "party", figur: true },
  N35f: { datei: "img/N35f.webp", text: "Mia ganz nah, flirtet", stimmung: "party", figur: true },
  N35fz: { datei: "img/N35fz.webp", text: "Mia ganz nah, zwinkert", stimmung: "party", figur: true },
  N35w: { datei: "img/N35w.webp", text: "Tanzfläche, Mia ist weg", stimmung: "party" },
  // ---------- Startbildschirm ----------
  START:{ datei: "", text: "Startbild: Handy in der Mitte, drumherum Orte und Entscheidungen", stimmung: "start" },
  // ---- V7: Flur mit Bewegung hinter der Tür, Mia-Montage ----
  FL1: { datei: "img/FL1.webp", text: "Flur, Party hinter der Tür (Bewegung 1)", stimmung: "flur", wechsel: "FL2" },
  FL2: { datei: "img/FL2.webp", text: "Flur, Party hinter der Tür (Bewegung 2)", stimmung: "flur" },
  FL3: { datei: "img/FL3.webp", text: "Flur, eine Frau kommt vorbei", stimmung: "flur" },
  MM01: { datei: "img/MM01.webp", text: "Mia-Montage 1", stimmung: "party" },
  MM02: { datei: "img/MM02.webp", text: "Mia-Montage 2", stimmung: "party" },
  MM03: { datei: "img/MM03.webp", text: "Mia-Montage 3", stimmung: "party" },
  MM04: { datei: "img/MM04.webp", text: "Mia-Montage 4", stimmung: "party" },
  MM05: { datei: "img/MM05.webp", text: "Mia-Montage 5", stimmung: "party" },
  MM06: { datei: "img/MM06.webp", text: "Mia-Montage 6", stimmung: "party" },
  MM07: { datei: "img/MM07.webp", text: "Mia-Montage 7", stimmung: "party" },
  MM08: { datei: "img/MM08.webp", text: "Mia-Montage 8", stimmung: "party" },
  MM09: { datei: "img/MM09.webp", text: "Mia-Montage 9", stimmung: "party" },
  MK1: { datei: "img/MK1.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  MK2: { datei: "img/MK2.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  MK3: { datei: "img/MK3.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  K10H: { datei: "img/K10H.webp", text: "Ich-Sicht am Schreibtisch nachts, Hände auf dem Tisch, Lynns Stift auf dem Buch (V8)", stimmung: "zimmer", tisch: true },
  N38c: { datei: "img/N38c.webp", text: "Rückblende Seminar: Lynn grinst spöttisch rüber (nah) (V8)", stimmung: "traum", figur: true },
  N38n: { datei: "img/N38n.webp", text: "Rückblende Seminar: Lynn ganz nah, Grinsen hinter den Fingern (V8)", stimmung: "traum", figur: true },
  N25L: { datei: "img/N25L.webp", text: "Prüfungsraum fast leer, noch zehn Minuten (V8)", stimmung: "pruefung" },
  N25B: { datei: "img/N25B.webp", text: "Nah: Blatt, Lynns Stift, blaue Mine (V8)", stimmung: "pruefung" },
  N25V: { datei: "img/N25V.webp", text: "Gang vor dem Prüfungsraum, Leute mit Karteikarten (V8)", stimmung: "pruefung" },
  LD1:  { datei: "img/LD1.webp", text: "Lynn-Ende: Lynn gegenüber im Restaurant, Kleid (V8)", stimmung: "restaurant", figur: true },
  TV1:  { datei: "img/TV1.webp", text: "Tim auf der Tanzfläche, Flasche hoch: „Komm einfach mit zu mir!“ (V8)", stimmung: "party", figur: true },
  TV2:  { datei: "img/TV2.webp", text: "Tim mit erhobenem Finger: „Alle Wege führen nach –“ (V8)", stimmung: "party", figur: true },
  TVn:  { datei: "img/TVn.webp", text: "Tim lacht, ganz nah (V8)", stimmung: "party", figur: true },
  H36a: { datei: "img/H36a.webp", text: "Hub, andere Leute, Lynn hinten auf dem Balkon (V8)", stimmung: "party" },
  H36b: { datei: "img/H36b.webp", text: "Hub, Paar auf der Tanzfläche, Lynn hinten (V8)", stimmung: "party" },
};

// =====================================================================
//   TÖNE: Name → Datei (leer = still). vol = Lautstärke (1 = normal)
//   Neue Datei: in den Ordner ton/ legen und hier eintragen.
// =====================================================================
const OVERLAYS = {"B12z": {"basis": "B12", "box": [0.4099, 0.2929, 0.1953, 0.1716]}, "B12g": {"basis": "B12", "box": [0.4146, 0.3946, 0.1896, 0.2295]}, "B12s": {"basis": "B12", "box": [0.4427, 0.4748, 0.1349, 0.2491]}, "N13Lz1": {"basis": "N13L", "box": [0.5974, 0.2276, 0.1766, 0.2659]}, "N13Lz2": {"basis": "N13L", "box": [0.2792, 0.2659, 0.101, 0.1203]}, "N13Ls": {"basis": "N13L", "box": [0.2844, 0.3526, 0.1042, 0.1549]}, "B12Az": {"basis": "B12A", "box": [0.2938, 0.3611, 0.0786, 0.0509]}, "B12Ag": {"basis": "B12A", "box": [0.5589, 0.162, 0.1604, 0.4185]}, "N35cz": {"basis": "N35c", "box": [0.5359, 0.237, 0.2042, 0.2046]}, "N35cs": {"basis": "N35c", "box": [0.5776, 0.3898, 0.1646, 0.2556]}, "N35ck": {"basis": "N35c", "box": [0.5318, 0.2333, 0.2151, 0.1972]}, "N35bg": {"basis": "N35b", "box": [0.5698, 0.2843, 0.1427, 0.1741]}, "N35bs": {"basis": "N35b", "box": [0.5818, 0.3204, 0.1406, 0.2194]}, "N35fl": {"basis": "N35f", "box": [0.3672, 0.112, 0.2755, 0.6861]}, "N35fg": {"basis": "N35f", "box": [0.3688, 0.2287, 0.2594, 0.45]}, "N35fgz": {"basis": "N35f", "box": [0.3682, 0.2278, 0.2625, 0.4519]}, "N19z": {"basis": "N19", "box": [0.5188, 0.2139, 0.2068, 0.2009]}, "N19s": {"basis": "N19", "box": [0.5094, 0.1769, 0.2224, 0.4352]}, "N19t": {"basis": "N19", "box": [0.5089, 0.1787, 0.1901, 0.4213]}, "N19l": {"basis": "N19", "box": [0.5193, 0.1917, 0.1786, 0.3278]}, "N20g": {"basis": "N20", "box": [0.5354, 0.2333, 0.0891, 0.1722]}, "LDz": {"basis": "LD1", "box": [0.4354, 0.188, 0.1307, 0.1204]}, "LDs": {"basis": "LD1", "box": [0.4615, 0.2907, 0.0823, 0.1435]}, "LD2": {"basis": "LD1", "box": [0.4172, 0.0435, 0.1781, 0.3944]}, "LD3": {"basis": "LD1", "box": [0.4375, 0.6287, 0.2839, 0.3713]}, "LD4": {"basis": "LD1", "box": [0.2484, 0.8204, 0.2297, 0.1796]}, "LDw": {"basis": "LD1", "box": [0.4328, 0.0954, 0.1391, 0.313]}, "LDa": {"basis": "LD1", "box": [0.4385, 0.1574, 0.1302, 0.1213]}, "LDh": {"basis": "LD1", "box": [0.376, 0.262, 0.2828, 0.5556]}, "N37z": {"basis": "N37", "box": [0.3943, 0.1546, 0.1104, 0.112]}, "N37s": {"basis": "N37", "box": [0.401, 0.2241, 0.101, 0.175]}, "N37b": {"basis": "N37", "box": [0.3688, 0.0287, 0.137, 0.3148]}, "N38bz": {"basis": "N38b", "box": [0.2141, 0.262, 0.1385, 0.1139]}, "N38bl": {"basis": "N38b", "box": [0.212, 0.2444, 0.1396, 0.2861]}, "TV3": {"basis": "TV1", "box": [0.4682, 0.1685, 0.0693, 0.0972]}};
// Gesichts-Varianten pro Bild: blink (Augen zu), spricht {Sprecher: Variante}, mimik (gelegentlich, wenn niemand spricht)
const VARIANTEN = {
  B12: { blink: ["B12z"], spricht: { Jonas: "B12s" }, mimik: ["B12g"] },
  N13L: { blink: ["N13Lz1", "N13Lz2"], spricht: { Jonas: "N13Ls" } },
  B12A: { blink: ["B12Az"], mimik: ["B12Ag"] },
  N35c: { blink: ["N35cz"], spricht: { Mia: "N35cs" }, mimik: ["N35ck"] },
  N35b: { spricht: { Mia: "N35bs" }, mimik: ["N35bg"] },
  N35f: { spricht: { Mia: "N35fg" } },
  N19: { blink: ["N19z"], spricht: { Lynn: "N19s" } },
  LD1: { blink: ["LDz"], spricht: { Lynn: "LDs" } },
  N37: { blink: ["N37z"], spricht: { Jonas: "N37s" } },
  N38b: { blink: ["N38bz"] },
  TV1: { mimik: ["TV3"] },
};
const TOENE = {
  kerze:           { datei: "ton/kerze.mp3", vol: 1.1 },      // Wunderkerzen auspusten (kai_audio 446030)
  umarmung:        { datei: "ton/umarmung.mp3", vol: 1.2 },   // Jonas’ Umarmung (Philips Aufnahme)
  klopfen:         { datei: "ton/klopfen.mp3", vol: .9 },               // Sophie klopft (Pixabay, Philip)
  treppe:          { datei: "ton/treppenhaus_runter.mp3", vol: .8 },     // Schritte im Treppenhaus
  strasse:         { datei: "ton/strasse_betrunken.mp3", vol: 1 },       // Leute unten auf der Straße
  tasse:           { datei: "ton/teller_abstellen.mp3", sprite: [[2.76, .9], [31.95, .9]], vol: .9 },
  aufraeumen:      { datei: "ton/teller_abstellen.mp3", sprite: [[5.25, 1.4], [10.03, 1.4], [16.65, 1.4], [24.59, 1.4]], vol: .7 },
  regen_strasse:   { datei: "ton/regen_strasse.mp3" },
  mia:             { datei: "ton/mia_lied.mp3", vol: 1 },                // Mias Lied (KI-Song von Philip)
  jubel:           { datei: "ton/crowd_cheers.mp3", vol: .8 },
  schrei:          { datei: "ton/man_screaming.mp3", vol: .55 },
  kotzen:          { datei: "ton/ich_koennt_kotzen.mp3", vol: .5 },
  handy_ablegen:   { datei: "ton/handy_ablegen.mp3", vol: .7 },   // Handy auf den Tisch (kurz, dumpf, synthetisch)
  display_klick:   { datei: "ton/tipp.mp3", sprite: [[0, .09]], vol: .8 },
  bzzz_dumpf:      { datei: "ton/bzzz_tisch.mp3", vol: .55 },
  bzzz_doppel:     { datei: "ton/bzzz.mp3" },                            // Sophie klopft (fehlt noch)
  schief:          { datei: "" },                            // schiefer Gesang aus den Fenstern (fehlt noch)
  // Handy
  bzzz:            { datei: "ton/bzzz.mp3" },              // Nachricht (phone-vibration-96623)
  bzzz_tisch:      { datei: "ton/bzzz_tisch.mp3" },        // Vibration auf dem Tisch (konpeito 305372)
  anruf:           { datei: "ton/anruf.mp3" },             // Anruf (mobile-phone-vibration-77849)
  tipp:            { datei: "ton/tipp.mp3", vol: .9 },     // 8 einzelne Anschläge (wattsapp-29575), fürs Löschen
  tipplauf:        { datei: "ton/tipplauf.mp3", anschlaege: [0.09,0.345,0.58,0.73,0.835,0.915,1.03,1.21,1.475,1.555,1.74,1.82,1.9,2.01,2.11,2.19,2.945,3.115,3.26,3.495,3.715,3.935,4.08,4.24,4.36,4.495,4.655,4.86,5.14,5.445,5.8,6.055,6.26,6.555,6.81] },  // echtes Tippen mit Rhythmus (wattsapp-29575, nur saubere Stellen)
  senden:          { datei: "ton/senden.mp3", vol: .8 },
  klick:           { datei: "ton/lichtschalter.mp3", vol: .35 },  // Display/Stumm (vorläufig Lichtschalter, leise)
  // Zimmer
  lichtschalter:   { datei: "ton/lichtschalter.mp3" },
  stift:           { datei: "ton/stift.mp3", vol: 1.3 },   // Vierfarb-Stift (K16b, Prüfung)
  PR3_stift:       { datei: "ton/PR3_stift.mp3" },         // Stift schreibt
  haken:           { datei: "ton/haken.mp3", sprite: [[0.02, .55], [1.56, .5], [3.01, .62], [4.31, .62]] },   // „Check“: 4 echte Stift-Haken (check-83184)
  blaettern:       { datei: "ton/blaettern.mp3" },
  reissverschluss: { datei: "ton/reissverschluss.mp3" },
  tuer_auf:        { datei: "ton/tuer_auf.mp3", vol: .8 },
  decke1:          { datei: "ton/decke1.mp3", vol: .8 },
  decke2:          { datei: "ton/decke2.mp3", vol: .8 },
  uhr:             { datei: "ton/uhr.mp3" },
  herzschlag:      { datei: "ton/herzschlag.mp3" },
  // Draußen
  haustuer:        { datei: "ton/haustuer.mp3" },
  wind:            { datei: "ton/wind.mp3" },              // draußen laut, im Zimmer leise als Raumton
  schritte:        { datei: "ton/schritte.mp3" },
  // Party
  M1_party:        { datei: "ton/M1_party.mp3" },          // Dance Until Dark
  gemurmel:        { datei: "ton/gemurmel.mp3" },          // House-Party-Stimmen (62063)
  gemurmel2:       { datei: "ton/gemurmel2.mp3" },         // Party-Chatter (6194)
  frauen:          { datei: "ton/frauen.mp3" },            // Frauenstimmen (140260)
  halle:           { datei: "ton/halle.mp3" },             // Crowd talking (138493): Halle nach der Prüfung
  party_fern:      { datei: "ton/party_fern.mp3" },        // muffled party music (Fenster auf)
  lied:            { datei: "ton/lied.mp3", start: 0 },    // Happy Birthday – V8: Ausschnitt 0:13–0:42 der Bar-Aufnahme (dort wird gesungen; vorher 1:58 = nur Gemurmel)
  muffled_party:   { datei: "ton/muffled_party.mp3", vol: 1 },   // Startbildschirm: gedämpfte Partymusik (mccrunchy, Philip)
  glas:            { datei: "ton/glas.mp3" },
  johlen:          { datei: "ton/johlen.mp3", vol: .8 },
  gelaechter:      { datei: "ton/gelaechter.mp3" },
  schloss:         { datei: "ton/schloss.mp3" },
  badtuer:         { datei: "ton/badtuer.mp3" },           // Wasser hört auf, Schloss, Tür (A4)
  schritte_holz:   { datei: "ton/schritte_holz.mp3" },
  lynn_lacht1:     { datei: "ton/lynn_lacht1.mp3" },
  lynn_lacht2:     { datei: "ton/lynn_lacht2.mp3" },
  // Morgen, Prüfung
  voegel:          { datei: "ton/voegel.mp3" },
  raum_tag:        { datei: "ton/raum_tag.mp3" },
  tuerklingel:     { datei: "ton/tuerklingel.mp3" },
  // Übergänge, FoMO-Rahmen
  whoosh_kurz:     { datei: "ton/whoosh_kurz.mp3" },       // Zeitraffer
  whoosh_aufbau:   { datei: "ton/whoosh_aufbau.mp3" },     // vor dem Shutdown
  aufbau_lang:     { datei: "ton/aufbau_lang.mp3", vol: 1 },   // Crashout Weg B: Rauschen baut sich auf, Piepsen, Woosh (8 s, aus Philips Woosh gebaut)
  tippen_laptop:   { datei: "ton/tippen_laptop.mp3", vol: 1 },   // Seminar (freesound_community, Philip)
  lofi_melancholy: { datei: "ton/lofi_melancholy.mp3", vol: 1 }, // Balkon, wenn sie sich hinsetzen (zephiramusic, Philip)
  restaurant_lofi: { datei: "ton/restaurant_lofi.mp3", vol: 1 }, // Restaurant Lynn-Ende (alex-morgan, Philip)
  party_club2:     { datei: "ton/party_club2.mp3", vol: 1 },     // zweiter Party-Song (mondamusic, Philip)
  ende_warm:       { datei: "ton/ende_warm.mp3", vol: 1 },       // Outro Lynn-Ende (andriig „Warm“, Philip)
  flashback:       { datei: "ton/flashback.mp3", vol: .8 },
  abzeichen:       { datei: "ton/abzeichen.mp3" },
  // Musik
  M3_spaet:        { datei: "ton/M3_spaet.mp3" },          // Late Night Breeze
  Outro:           { datei: "ton/Outro.mp3", endeAb: 65 }, // Lost in FOMO – Anfang ab 0:00, Ende ab 1:05
  // fehlt noch (bleibt still):
  jonas_lacht: "", buegel: "", husten: "", stuhl: "",
};

// Testhilfe: Stoppuhr am Ende anzeigen (für die Abgabe auf false stellen)
const TESTMODUS = true;

// Abzeichen: Symbol und Farben (Sammlung, Toast, Endbildschirm)
// Abzeichen: Symbol, Farbe 1, Farbe 2, was man dafür getan hat, vager Hinweis (wenn verpasst)
// „Senden?“: vorläufig „getippt, aber nicht abgeschickt“ – Philip klärt, wofür man es bekommt. Hinweistexte: Philip liest gegen.
const ABZ_STIL = {
  'Planen gehört dazu': ['🗒️', '#8fd3ff', '#2b6c9e', 'Einen Lernplan geschrieben. Statt zu lernen.', 'Auch eine Art, anzufangen.'],
  'Ich lern.': ['🚪', '#a7b3c9', '#4a566e', 'Sophie ging rüber zu Lena. Du hast gelernt. Angeblich.', 'Jemand hat geklopft.'],
  'Rot ist fast leer': ['🖊️', '#ff7a7a', '#a12f3a', 'Lynns Stift noch gehabt. Rot fast leer geschrieben.', 'Vier Farben, eine fast leer.'],
  'Das tut weh': ['🎤', '#ffb36b', '#b2541c', 'Lynn hat dich singen hören. Leider.', 'Manche Töne hört jeder.'],
  'MORITZ!': ['🧯', '#ff5a4f', '#9e1d17', 'Handy weggelegt. Wenigstens das Ende gesehen.', 'Ein Name, den alle rufen.'],
  'Laucharm': ['💪', '#9be37a', '#3f7a22', 'Mitgetanzt. Ein Arm in Mias Video.', 'Irgendwo am Rand bist du drauf.'],
  'Konfetti': ['🧹', '#f7a8e0', '#9a3c86', 'Geblieben, als alle weg waren. Schaufel gehalten.', 'Jemand muss ja aufräumen.'],
  'Außer Reichweite': ['📵', '#9ec2ff', '#3a5ca8', 'Handy auf den Schreibtisch gelegt. Hat nicht gereicht.', 'Abstand ist auch eine Entscheidung.'],
  'Leiser': ['🌙', '#4a5fc1', '#1f2a55', 'Ende: Das Handy hat kaum mitgeredet.', 'Ein Ende mit weniger Display.'],
  'Hier oder da': ['🔀', '#f0a040', '#9a4d12', 'Ende: Halb im Raum, halb im Handy.', 'Ein Ende. Irgendwo dazwischen.'],
  'Blaues Licht': ['📱', '#36b4ff', '#1446a8', 'Ende: Das Display war heller als der Abend.', 'Ein Ende. Heller, als dir lieb ist.'],
  'Mal schauen': ['👀', '#f7cf3c', '#b8860b', 'Du hast Jonas „mal schauen“ geschrieben.', 'Eine Antwort, die keine war.'],
  'Find’s raus': ['🚪', '#3fd08a', '#167a48', 'Du bist an Jonas’ Anruf rangegangen.', 'Es hat geklingelt. Und dann?'],
  'Senden?': ['✉️', '#b77cff', '#5b2aa8', 'Getippt. Und dann doch gelöscht.', 'Ein paar Wörter. Nie angekommen.'],
  'Stumm': ['🔕', '#9aa4b6', '#4a5262', 'Du hast das Handy nachts stumm geschaltet.', 'Manchmal reicht ein Schalter.'],
  'Eine Stunde': ['⏳', '#ffad5c', '#c0571b', 'Afterparty. Nur eine Stunde. Klar.', 'Es gab noch ein Danach.'],
  'Zwischen den Jacken': ['🧥', '#cf9a6a', '#6e4424', 'So spät da, dass nur die Jacken gewartet haben.', 'Zu spät ist auch eine Uhrzeit.'],
  'Musst du dabei gewesen sein': ['🎉', '#ff6fb3', '#a81e66', 'Den Feuerlöscher-Moment verpasst.', 'Alle reden noch davon. Du nicht.'],
  '§ 827': ['⚖️', '#ef5a5f', '#8f1d22', 'Auf der Party an Jura gedacht. Tim haftet.', 'Dein Studium war plötzlich nützlich.'],
  'Gar nicht gemerkt': ['🕑', '#3fd4c6', '#127a71', 'Handy stecken lassen. Auf einmal war es zwei.', 'Irgendwann war die Uhr egal.'],
  'Montagabend': ['🕯️', '#ff8fb1', '#8e2f5a', 'Montagabend. Handy umgedreht, ohne draufzuschauen.', 'Ein Abend nach der Prüfung.'],
};
// (MENUEBILD wird nicht mehr gebraucht: Start und Menü sind jetzt das gezeichnete Zimmer)
const MENUEBILD = 'B15';

// Kurzfilme (stumm, Ton kommt aus dem Spiel)
const FILME = { weg: 'vid/weg.mp4' };
