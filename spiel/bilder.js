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
  K12:  { datei: "img/K12.webp",  text: "Fensterblick nachts", stimmung: "nacht", fensterLichter: ["K12_fa", "K12_fb", "K12_fc", "K12_fd", "K12_fe", "K12_ff"] },
  L4b:  { datei: "img/L4b.webp",  text: "Fenster offen, Blick nach draußen", stimmung: "nacht" },
  K12N: { datei: "img/K12.webp",  text: "Fensterblick, später Abend (Claude-Variante); V8.9: Fenster gegenüber gehen einzeln aus (proc/v90_fenster_aus.py mit K12_aus)", filter: "nacht", fensterLichter: ["K12_fa", "K12_fb", "K12_fc", "K12_fd", "K12_fe", "K12_ff"] },
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
  N1L:  { datei: "img/N1L.webp", text: "Blick vom Schreibtisch aufs Bett, Licht an, kein Handy auf dem Bett (Gemini, V8.5)", stimmung: "zimmer" },
  N02D: { datei: "img/N02D.webp", text: "Ich-Sicht aus dem Bett, Licht aus (Gemini, V8.5)", stimmung: "nacht", bett: true, handy: [0.46, 0.86, 0.09, 0.1], fernLicht: ["96%", "60%"] },
  N02:  { datei: "img/N02.webp", text: "Ich-Sicht aus dem Bett nachts: Regal links, Tür geradeaus, Schreibtisch rechts (V8)", stimmung: "nacht", bett: true, handy: [0.46, 0.86, 0.09, 0.1], fernLicht: ["96%", "60%"] },
  N31b: { datei: "img/N31b.webp", text: "Zeitraffer: Mittag, Bett leer", stimmung: "tag" },
  N31c: { datei: "img/N31c.webp", text: "Zeitraffer: Nachmittag, wieder im Bett am Handy", stimmung: "tag" },
  N31d: { datei: "img/N31d.webp", text: "Abend, er am Schreibtisch, Lampe an", stimmung: "zimmer", tisch: true },
  N06:  { datei: "img/N06.webp", text: "Kleiderschrank offen (Gemini, KI-Hinweis übermalt, V8.5)", stimmung: "zimmer" },
  N07:  { datei: "img/N07.webp", text: "Ich-Sicht auf dem Bett, angezogen mit Jacke und Schuhen – Heimkommen (Gemini, V8.5)", stimmung: "nacht" },
  L7: { datei: "img/L7.webp", text: "Schreibtisch, Lampe aus, Handy leuchtet auf dem Buch (Gemini, V8.5)", stimmung: "nacht", tisch: true, handy: [0.54, 0.68, 0.14, 0.12] },
  MO_KAFFEE: { datei: "img/MO_KAFFEE.webp", text: "Montag früh: Küchentisch, Kaffee, Toast, Handy, Jacke (Gemini, V8.5)", stimmung: "morgen" },
  SO1a: { datei: "img/SO1a.webp", text: "Sonntag: Morgen, er am Schreibtisch", stimmung: "morgen", tisch: true },
  SO1b: { datei: "img/SO1b.webp", text: "Sonntag: Mittag, er am Schreibtisch", stimmung: "tag", tisch: true },
  SO1c: { datei: "img/SO1c.webp", text: "Sonntag: Nachmittag, er am Schreibtisch", stimmung: "tag", tisch: true },
  SO1d: { datei: "img/SO1d.webp", text: "Sonntag: Abend, er am Schreibtisch, Lampe an (wie SO1a–c mit Türrahmen, V8.8)", stimmung: "zimmer", tisch: true },
  N38a: { datei: "img/N38a.webp", text: "Rückblende Seminar: mein zerknitterter, leerer Collegeblock (Gemini, V8.5)", stimmung: "traum" },
  N38b: { datei: "img/N38b.webp", text: "Rückblende Seminar: Lynn kichert hinter der Hand (V8)", stimmung: "traum", figur: true },
  N38:  { datei: "img/N38.webp", text: "Rückblende Seminar: Lynn hält mir den Vierfarb-Stift hin (V8)", stimmung: "traum", figur: true },
  N26:  { datei: "img/N26s.webp", text: "Handyfoto: Küche, Jonas mit Becher, Lynn hinten (V8.9, Patrick 24.11.: Lynn scharf wie der Rest – nur sie unscharf wirkte unlogisch; alte Fassung img/N26.webp)", stimmung: "foto", zoom: [.515, .5] },
  N26s: { datei: "img/N26s.webp", text: "Handyfoto Küche, Lynn scharf (beim Ranzoomen wird darauf überblendet)", stimmung: "foto", zoom: [.515, .5] },
  B07: { datei: "img/B07.webp", text: "Lenas Story: Selfie mit Konfetti, Lynn klein hinten", stimmung: "foto" },
  N27:  { datei: "img/N27.webp", text: "Handyfoto Gruppe auf dem Sofa, Lynn als Letzte, daneben ein Platz frei (V8)", stimmung: "foto", story: "ganz" },
  N28: { datei: "img/N28.webp", text: "Handyfoto: Tims Wohnzimmer voller Leute", stimmung: "foto" },
  N29:  { datei: "img/N29.webp", text: "Lynns Story: zwei Becher auf dem Balkongeländer, Lichterkette (V8)", stimmung: "balkon" },
  APS: { datei: "img/APS.webp", text: "Afterparty-Story bei Tim", stimmung: "foto" },

  // ---------- V8.7: Mia (Person links entfernt) und Lena nah ----------
  MIA_HANDY: { datei: "img/MIA_HANDY.webp", text: "Mia schaut aufs Handy, getroffen (V8.7)", stimmung: "party", figur: true },
  MIA_HANDY_LEER: { datei: "img/MIA_HANDY_LEER.webp", text: "Mia aufs Handy, Raum leer, nur Konfetti (V8.7, stiller Moment)", stimmung: "party", figur: true },
  MIA_GRINST: { datei: "img/MIA_GRINST.webp", text: "Mia lacht breit (V8.7)", stimmung: "party", figur: true },
  MIA_GRINST_b: { datei: "img/MIA_GRINST_b.webp", text: "Mia lächelt, traurige Brauen – überspielt es (V8.7)", stimmung: "party", figur: true },
  MIA_GRINST_c: { datei: "img/MIA_GRINST_c.webp", text: "Mia grinst (V8.7)", stimmung: "party", figur: true },
  MIA_SMIRK: { datei: "img/MIA_SMIRK.webp", text: "Mia, freches kleines Lächeln (V8.7)", stimmung: "party", figur: true },
  MIA_LEER: { datei: "img/MIA_LEER.webp", text: "Mia smirk, Raum leer (V8.7, Reserve)", stimmung: "party", figur: true },
  MIA_LEER_TASCHE: { datei: "img/MIA_LEER_TASCHE.webp", text: "Mia smirk, Tasche über der Schulter, Raum leer (V8.7, Reserve)", stimmung: "party", figur: true },
  MIA_STORY: { datei: "img/MIA_STORY.webp", text: "Mias letzte Story 05:12: nur Text „noch wer wach?“ (V8.7, Claude)", stimmung: "foto" },
  LENA_NAH: { datei: "img/LENA_NAH.webp", text: "Küche: Lena ganz nah nach der Umarmung (V8.7)", stimmung: "party", figur: true },

  // ---------- Straße ----------
  B10:  { datei: "img/B10.webp", text: "Haustür von außen, Treppe, Laterne", stimmung: "strasse" },
  W0:   { datei: "img/W0g.webp", text: "Straße wie das Ende des Weg-Videos, Partyhaus klein im Nebel (Gemini, Patrick 26.11. abends)", stimmung: "strasse" },
  B15:  { datei: "img/HAUS_WEIT_a.webp", text: "Straße, Partyhaus weit weg", stimmung: "strasse" },
  N11:  { datei: "img/HAUS_WEIT.webp", text: "Straße, Haus näher", stimmung: "strasse" },
  N12:  { datei: "img/HAUS_MITTE.webp", text: "Straße, Haus nah (Ausschnitt HAUS_WEIT, Zwischenschritt vor HAUS)", stimmung: "strasse" },
  B16:  { datei: "img/HAUS.webp", imHandy: "img/N12_h.webp", text: "Haus mit leuchtenden Fenstern, Treppe", stimmung: "strasse" },
  B14:  { datei: "img/B14.webp", text: "Leere Straße, Laternen (Heimweg)", stimmung: "strasse" },

  // ---------- Party ----------
  B09:  { datei: "img/B09.webp", text: "Flur mit Jacken, offene Tür zur Party", stimmung: "flur" },
  SP1: { datei: "img/SP1.webp", text: "Flur spät, Jacken auf dem Boden", stimmung: "flur" },
  N36: { datei: "img/N36.webp", text: "Party-Hub: links Küche, geradeaus Balkon (Lynn hinten), rechts Tanzfläche", stimmung: "party" },
  N13: { datei: "img/N13.webp", imHandy: "img/N13_h.webp", text: "Küche: Jonas an der Theke, Lena lacht", stimmung: "party" },
  B12: { datei: "img/B12.webp", text: "Küche: Jonas nah, ernst", stimmung: "party", figur: true },
  N30: { datei: "img/N30.webp", text: "Nah: kaputte Bierflasche auf Lenas Teppich (Gemini, V8.5)", stimmung: "party" },
  TORTE: { datei: "img/TORTE.webp", imHandy: "img/TORTE_h.webp", text: "Angeschnittene Torte in der Küche (Gemini, V8.5)", stimmung: "party" },
  N35: { datei: "", ersatz: "N35M1", text: "Mia auf der Tanzfläche (Video)", stimmung: "party" },
  N35b: { datei: "img/N35b.webp", text: "Mia nah, hat mich entdeckt", stimmung: "party", figur: true, blinzeln: "N35z" },
  N35c: { datei: "img/N35c.webp", text: "Mia filmt mich, Handy vor meinem Gesicht", stimmung: "party", figur: true },
  N32a: { datei: "img/N35w.webp", imHandy: "img/N35w_h.webp", text: "Party-Pool: volle Tanzfläche", stimmung: "party", pool: true },
  N32b: { datei: "img/N32b.webp", imHandy: "img/N32b_h.webp", text: "Mia: TIM! DAS IST MEIN LIED!", stimmung: "party" },
  N32c: { datei: "img/N32c.webp", imHandy: "img/N32c_h.webp", text: "Party-Pool: Jonas auf dem Tisch (Gemini v3, V8.5)", stimmung: "party", pool: true },
  N32d: { datei: "img/N32d.webp", imHandy: "img/N32d_h.webp", text: "Lena mit Torte und Wunderkerzen", stimmung: "party", funken: [[.452,.705],[.503,.632],[.512,.742],[.556,.712]] },
  N32e: { datei: "img/N32e.webp", imHandy: "img/N32e_h.webp", text: "Party-Pool: lachende Gruppe in der Küche, Handy-Blitze (Gemini, V8.5)", stimmung: "party", pool: true },
  MIA_SELFIE: { datei: "img/MIA_SELFIE.webp", imHandy: "img/MIA_SELFIE_h.webp", posHandy: "60% 50%", text: "Mias Selfie in der Küche, Zunge raus; Tim, Jonas, Lena dahinter (Gemini, V8.5)", stimmung: "foto" },
  BALKON_GRUPPE: { datei: "img/BALKON_GRUPPE.webp", imHandy: "img/BALKON_GRUPPE_h.webp", text: "Gruppenfoto Balkon: Lena, Tim (Zigarette), Lynn (Zunge raus) (Gemini, V8.5)", stimmung: "foto" },
  N33: { datei: "img/N33.webp", imHandy: "img/N33_h.webp", text: "Wohnzimmer spät, halb leer", stimmung: "party" },
  N16:  { datei: "img/N16.webp", text: "Badezimmer, Partylicht unter der Tür (Gemini, V8.5)", stimmung: "bad" },
  A1: { datei: "img/A1.webp", imHandy: "img/A1_h.webp", text: "Party 00:40, voll, aber müde", stimmung: "party" },
  N17: { datei: "img/N17.webp", text: "Flur: meine Hand nimmt die Jacke vom Haken", stimmung: "flur" },
  N18: { datei: "img/N18.webp", text: "Flur: Lynn kommt aus der Badtür", stimmung: "flur", figur: true },
  N19: { datei: "img/N19.webp", text: "Flur: Lynn nah, strahlt", stimmung: "flur", figur: true },
  N19n: { datei: "img/N19n.webp", text: "Flur: Lynn nah, normaler Blick, Mund zu (Gemini, V8.7)", stimmung: "flur", figur: true },
  N20: { datei: "img/N20.webp", text: "Flur: Lynn geht, schaut zurück", stimmung: "flur", figur: true },
  N21: { datei: "img/N21.webp", text: "Flur: Lynn geht in die Party (dunkler)", stimmung: "flur" },
  AO4:  { datei: "img/AO4.webp", text: "Blick zurück: Küche links, Balkontür Mitte, Tanzfläche rechts (Gemini, V8.5)", stimmung: "party" },

  // ---------- Balkon (Lynn-Testbilder vom 18.11.) ----------
  // V9.1 (Patrick 26.11.): neue Bilder
  TAG1: { datei: "img/TAG1.webp", text: "Schreibtisch bei Tag, Hände auf dem Tisch, Handy rechts (Patrick 25.11.)", stimmung: "tag", tisch: true, handy: [0.84, 0.71, 0.14, 0.16] },
  // V9.2 (Patrick 26.11. abends): Gemini-Zwischenbilder, genau auf die Basisbilder ausgerichtet (proc/v92_zwischen.py)
  N14hh: { datei: "img/N14hh.webp", text: "Lynn, Hände halb oben (Zwischenbild zu den Hand-Posen)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14gr: { datei: "img/N14gr.webp", text: "Lynn, leichtes Grinsen, Kopf geneigt", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14ru: { datei: "img/N14ru.webp", text: "Lynn schaut kurz runter, leises Lächeln", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14dw: { datei: "img/N14dw.webp", text: "Lynn fängt an, sich wegzudrehen (vor N14g)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14zg: { datei: "img/N14zg.webp", text: "Lynn mit zwei Bechern, leichtes Grinsen", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14zs: { datei: "img/N14zs.webp", text: "Lynn mit zwei Bechern, nippt", stimmung: "balkon", figur: true, lichterVon: "N14" },
  MIA_GR: { datei: "img/MIA_GR.webp", text: "Mia grinst (Ausschnitt wie N35n)", stimmung: "party", figur: true },
  MIA_SM: { datei: "img/MIA_SM.webp", text: "Mia, verschmitztes Lächeln (Ausschnitt wie N35n)", stimmung: "party", figur: true },
  MIA_SM2: { datei: "img/MIA_SM2.webp", text: "Mia, verschmitzt, Kopf leicht geneigt", stimmung: "party", figur: true },
  MIA_GEN: { datei: "img/MIA_GEN.webp", text: "Mia genervt, leicht beleidigt (Gemini, Patrick 27.11.)", stimmung: "party", figur: true, blinzeln: "MIA_GENz" },
  MIA_GENz: { datei: "img/MIA_GENz.webp", text: "Mia genervt, Augen zu (Blinzeln)", stimmung: "party" },
  MIA_GENn: { datei: "img/MIA_GENn.webp", text: "Mia genervt, Nahaufnahme (kurzer Einschub)", stimmung: "party", figur: true },
  MIA_GENh: { datei: "img/MIA_GENh.webp", text: "Mia genervt mit Handy in der Hand (Reserve)", stimmung: "party", figur: true },
  MIA_TILT: { datei: "img/MIA_TILT.webp", text: "Mia neigt den Kopf, verspielt", stimmung: "party", figur: true },
  MIA_HAND: { datei: "img/MIA_HAND.webp", text: "Mia hebt die Hand (vor den drei Fingern N35d)", stimmung: "party", figur: true },
  N14w: { datei: "img/N14w.webp", text: "Lynn am Geländer winkt („Geht schon mal.“)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14be: { datei: "img/N14be.webp", text: "Lynn am Geländer mit rotem Becher, lächelt (Augen-zu-Overlay N14bez)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14zb: { datei: "img/N14zb.webp", text: "Lynn kommt zurück, zwei rote Becher, hält ihm einen hin (Weg Warten)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  BALKON_AUSSEN: { datei: "img/BALKON_AUSSEN.webp", text: "Balkon-Totale von außen: er mit Kapuze am Geländer, Lynn mit Becher an der Tür", stimmung: "balkon" },
  N19sk: { datei: "img/N19sk.webp", text: "Flur: Lynn skeptisch („Dann schau halt.“)", stimmung: "flur", figur: true },
  TIM_SCHLAEFT: { datei: "img/TIM_SCHLAEFT.webp", imHandy: "img/TIM_SCHLAEFT_h.webp", text: "Afterparty: Tim schläft mit Sonnenbrille auf dem Sofa, alle filmen", stimmung: "party" },
  N14:  { datei: "img/N14.webp",  text: "Balkon nachts, Lynn am Geländer (neutral); 25.11.: Haare bewegen sich leicht (proc/v90_haare.py, Veo)", stimmung: "balkon", figur: true,
          // 25.11. abends: Haar-Video (vid/N14_haar.mp4) raus – verzerrt Hals und Gesicht (Patrick)
          lichter: [[0.28,0.606],[0.296,0.616],[0.264,0.646],[0.314,0.676],[0.854,0.678],[0.01,0.684],[0.131,0.681],[0.349,0.69],[0.241,0.699],[0.881,0.705],[0.216,0.728],[0.914,0.729],[0.997,0.731],[0.029,0.736],[0.939,0.74],[0.365,0.748],[0.401,0.751],[0.972,0.754],[0.066,0.753],[0.154,0.752],[0.182,0.757],[0.09,0.767],[0.121,0.768],[0.484,0.78],[0.423,0.789],[0.457,0.796]] },
  N14r: { datei: "img/N14r.webp", text: "Lynn redet mit den Händen", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14m: { datei: "img/N14m.webp", text: "Lynn redet, Mund offen, ohne Hände (Gemini, V8.5)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14h: { datei: "img/N14h.webp", text: "Lynn mit Händen, Mund zu (Gemini, V8.5)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14rz: { datei: "img/N14rz.webp", text: "Lynn mit Händen, lächelt (Gemini, V8.5)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14g: { datei: "img/N14g.webp", text: "Lynn dreht sich weg und geht", stimmung: "balkon", lichterVon: "N14" },
  N14z: { datei: "img/N14z.webp", text: "Lynn, Augen zu (zum Blinzeln)", stimmung: "balkon" },
  N14b: { datei: "img/N14b.webp", text: "Lynn lacht", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14c: { datei: "img/LNN2.webp", text: "Lynn nah, hört zu, leises Lächeln (Patrick 25.11., ersetzt LNN)", stimmung: "balkon", figur: true, hell: 1.07 },
  N14d: { datei: "img/LNL2.webp", text: "Lynn nah, lächelt frech (Patrick 25.11., ersetzt LNL)", stimmung: "balkon", figur: true, hell: 1.07 },
  N14e: { datei: "img/LNU.webp", text: "Lynn nah, leise überrascht (LNU, Gemini, V8.8)", stimmung: "balkon", figur: true },
  N14t: { datei: "img/N14t.webp", text: "Lynn redet, Kopf leicht geneigt (Gemini, V8.8)", stimmung: "balkon", figur: true, hell: 1.12, lichterVon: "N14" },
  N14s: { datei: "img/N14s.webp", text: "Lynn lächelt still (Gemini, V8.8)", stimmung: "balkon", figur: true, hell: 1.12, lichterVon: "N14" },
  N14k: { datei: "img/N14k.webp", text: "Lynn schaut, Mund leicht offen (Gemini, V8.8)", stimmung: "balkon", figur: true, hell: 1.12, lichterVon: "N14" },
  N15:  { datei: "img/N15.webp", text: "Balkon leer", stimmung: "balkon", lichterVon: "N14" },
  N29b: { datei: "img/N29b.webp", text: "Balkon (Fenster-Fassung) leer, zwei rote Becher auf dem Geländer, drinnen Party (Gemini, V8.8)", stimmung: "balkon" },
  HAUS: { datei: "img/HAUS.webp", text: "Partyhaus von vorn, 5 Stockwerke, Party oben + Balkon mit Lichterkette (Gemini V8.9)", stimmung: "strasse" },
  HAUS_WEIT: { datei: "img/HAUS_WEIT.webp", text: "Straße, Partyhaus näher, Balkon deutlich (Gemini V8.9)", stimmung: "strasse" },
  HAUS_WEIT_a: { datei: "img/HAUS_WEIT_a.webp", text: "Straße, Partyhaus weit weg (Gemini V8.9)", stimmung: "strasse" },
  TREPPE_HELL: { datei: "img/TREPPE_HELL.webp", text: "Treppenhaus von unten, Partylicht von oben (Hinweg)", stimmung: "flur" },
  TREPPE: { datei: "img/TREPPE.webp", text: "Treppenhaus dunkel (Rückweg, 2 Uhr)", stimmung: "flur" },
  N29n: { datei: "img/N29n.webp", text: "Balkon: Becher nah, Lippenstift an einem (Gemini V8.9)", stimmung: "balkon" },
  HW_TUER: { datei: "img/HW_TUER.webp", text: "Hand an der Balkontür-Klinke (Gemini V8.9)", stimmung: "balkon" },
  TV0: { datei: "img/TV0.webp", text: "Tim zeigt auf sich: „Schon vergessen? Afterparty. Bei mir.“ (Gemini V8.9)", stimmung: "party", figur: true },
  JONAS_TISCH: { datei: "img/JONAS_TISCH.webp", text: "Jonas steht auf dem Tisch, Becher hoch, alle grölen (Story, 9:16, V8.9)", stimmung: "foto" },
  LENA_SELFIE: { datei: "img/LENA_SELFIE.webp", text: "Lena-Selfie auf der Party, Kussmund (Weg B, V8.9)", stimmung: "foto" },
  LP3: { datei: "img/LP3.webp", text: "Rückblende Hörsaal: Lynn neutral, schaut nach vorn", stimmung: "traum", figur: true, blinzeln: "LP3z" },
  LP3z: { datei: "img/LP3z.webp", text: "Rückblende Hörsaal: Lynn Augen zu (Blinzeln)", stimmung: "traum", figur: true },
  LP4: { datei: "img/LP4.webp", text: "Rückblende Hörsaal: Lynn, Braue hoch, schelmisch", stimmung: "traum", figur: true },
  LP5: { datei: "img/LP5.webp", text: "Rückblende Hörsaal: roter Laserpunkt auf Lynns Wange", stimmung: "traum", figur: true },
  LP6: { datei: "img/LP6.webp", text: "Rückblende Hörsaal: Lynn Nahaufnahme mit Laser", stimmung: "traum", figur: true },
  LP7: { datei: "img/LP7.webp", text: "Rückblende Hörsaal: Lynn redet, Laser auf der Wange", stimmung: "traum", figur: true },
  LP8: { datei: "img/LP8.webp", text: "Rückblende Hörsaal: Lynn greift nach dem Pointer", stimmung: "traum", figur: true },
  LP9: { datei: "img/LP9.webp", text: "Rückblende Hörsaal: Lynns Stinkefinger", stimmung: "traum", figur: true },
  LP10: { datei: "img/LP10.webp", text: "Rückblende Hörsaal: Lynn hält sich lachend die Hand vor den Mund (V8.9)", stimmung: "traum", figur: true },
  LP11: { datei: "img/LP11.webp", text: "Rückblende Hörsaal: Lynn lächelt leicht, Mund zu, wie LP2 aber ruhiger (Patrick 25.11.)", stimmung: "traum", figur: true },
  LP2: { datei: "img/LP2.webp", text: "Rückblende Hörsaal: Lynn lächelt kurz", stimmung: "traum", figur: true },
  BALKON_LEER: { datei: "img/BALKON_LEER.webp", text: "Balkon leer, Lichterkette, Stadt (Gemini, V8.5 – Reserve)", stimmung: "balkon" },
  N34:  { datei: "img/N34.webp", text: "Er und Lynn von hinten auf dem Balkonboden, großes Fenster, Party drinnen (V8.8)", stimmung: "balkon" },
  N34v: { datei: "img/N34.webp", video: "vid/N34v.mp4", text: "Wie N34, als bewegter Hintergrund (Veo-Video, 4-s-Schleife, V8.8)", stimmung: "balkon" },
  LNS:  { datei: "img/LNS.webp",  text: "Lynn nah, lächelt (Gemini, Patrick 27.11.)", stimmung: "balkon", figur: true, hell: 1.09 },
  LNSt: { datei: "img/LNSt.webp", text: "Lynn nah, traurig, Blick gesenkt (Gemini, Patrick 27.11.)", stimmung: "balkon", figur: true, hell: 1.09 },
  LNSl1: { datei: "img/LNSl1.webp", text: "Lynn nah, lächelt (Gemini, Patrick 28.11., für Jokes)", stimmung: "balkon", figur: true, hell: 1.08 },
  LNSl2: { datei: "img/LNSl2.webp", text: "Lynn nah, kleines Schmunzeln (Gemini, Patrick 28.11., für Jokes)", stimmung: "balkon", figur: true, hell: 1.09 },
  LNSn: { datei: "img/LNSn.webp", text: "Lynn nah, ruhig neutral (Gemini, Patrick 28.11.)", stimmung: "balkon", figur: true, hell: 1.09 },
  LNSe: { datei: "img/LNSe.webp", text: "Lynn nah, ernst (Gemini, Patrick 27.11., zweite Fassung in richtiger Größe)", stimmung: "balkon", figur: true, hell: 1.09 },
  N34Ll: { datei: "img/N34Ll.webp", text: "Wie N34L, lächelt dezent (Gemini, Patrick 27.11.)", stimmung: "balkon", figur: true, blinzeln: "N34Llz" },
  N34Llz: { datei: "img/N34Llz.webp", text: "N34Ll mit geschlossenen Augen", stimmung: "balkon", figur: true },
  N14lb: { datei: "img/N14lb.webp", text: "Zwischenbild: Lynns Lachen beginnt (Gemini, Patrick 27.11.)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N14la: { datei: "img/N14la.webp", text: "Zwischenbild: Lynns Lachen klingt aus (Gemini, Patrick 27.11.)", stimmung: "balkon", figur: true, lichterVon: "N14" },
  N35sn: { datei: "img/N35sn.webp", text: "Zwischenbild: Mia halb skeptisch, halb neugierig (Gemini, Patrick 27.11.)", stimmung: "party", figur: true },
  N35nz: { datei: "img/N35nz.webp", text: "Mia neugierig, Augen zu (Blinzeln)", stimmung: "party" },
  N34L:  { datei: "img/N34L.webp",  text: "Lynn sitzt auf dem Balkonboden, schaut dich an, roter Becher (Gemini, Patrick 25.11.)", stimmung: "balkon", figur: true },
  N34Lt: { datei: "img/N34Lt.webp", text: "Wie N34L, sie trinkt und lächelt hinter dem Becher (Gemini, Patrick 25.11.)", stimmung: "balkon", figur: true },
  N34Ls: { datei: "img/N34Ls.webp", text: "Wie N34L, sie schaut in die Stadt (Gemini, Patrick 25.11.)", stimmung: "balkon", figur: true },
  N34S1: { datei: "img/N34S1.webp", text: "Beide sitzen an der Hauswand unter dem Partyfenster, er von hinten (Gemini, Patrick 25.11.)", stimmung: "balkon", fahrtZiel: [0.68, 0.78] },
  N34S2: { datei: "img/N34S2.webp", text: "Beide an der Wand, Plätze getauscht (Gemini, Patrick 25.11.)", stimmung: "balkon", fahrtZiel: [0.66, 0.74] },
  N34S3: { datei: "img/N34S3.webp", text: "Weit: beide sitzen sich am Geländer gegenüber, Fenster rechts (Gemini, Patrick 25.11.)", stimmung: "balkon", fahrtZiel: [0.4, 0.7] },
  N34S4: { datei: "img/N34S4.webp", text: "Von oben: beide am Geländer, sie lächelt ihn an (Gemini, Patrick 25.11.)", stimmung: "balkon", fahrtZiel: [0.38, 0.66] },
  N34S5: { datei: "img/N34S5.webp", text: "Nah: er von hinten, sie am Geländer lächelt ihn an (Gemini, Patrick 25.11.)", stimmung: "balkon", figur: true },
  N34Z2: { datei: "img/N34Z2.webp", text: "Zeitraffer wie N34S1, gleiche Plätze, sie lacht, Becher am Boden (Gemini, Hintergrund aus N34S1, Patrick 25.11.)", stimmung: "balkon" },
  N34Z3: { datei: "img/N34Z3.webp", text: "Zeitraffer wie N34S1, jetzt beide hinten am Geländer von hinten, Becher am Boden (Gemini, Hintergrund aus N34S1, Patrick 25.11.)", stimmung: "balkon" },
  N34Z4: { datei: "img/N34Z4.webp", text: "Wie N34Z3, Party drinnen fast leer, gedimmtes Licht (Gemini, nur Fenster getauscht, Patrick 25.11.)", stimmung: "balkon" },
  N34Z3a: { datei: "img/N34Z3a.webp", text: "Wie N34Z3, er zieht den Arm zurück, traut sich nicht (arm_um_versuch4, Patrick 25.11.)", stimmung: "balkon" },
  N34ZA: { datei: "img/N34ZA.webp", text: "Vorstellung beim Date: Arm um sie, Hand auf ihrer Schulter, sie lehnt noch nicht (Gemini arm_versuch3, Patrick 25.11.)", stimmung: "balkon" },
  N34ZB: { datei: "img/N34ZB.webp", text: "Vorstellung: sie lehnt sich an ihn, Party geht (Gemini, Patrick 25.11.)", stimmung: "balkon" },
  N34Z5: { datei: "img/N34Z5.webp", text: "Zeitraffer-Ende: fast leer, eine allein mit Handy im Fenster (Gemini, Patrick 25.11.)", stimmung: "balkon" },
  N34a1: { datei: "img/N34a1.webp", text: "Balkonboden: drinnen schon weniger Leute (V8.8)", stimmung: "balkon" },
  N34a2: { datei: "img/N34a2.webp", text: "Balkonboden: drinnen fast leer (V8.8)", stimmung: "balkon" },
  N34b: { datei: "img/N34b.webp", text: "Er und Lynn von hinten auf dem Balkonboden, drinnen leer (Fenster-Fassung, V8.8)", stimmung: "balkon" },
  N34bB: { datei: "img/N34bB.webp", text: "Wie N34b, Becher auf dem Fensterbrett (Reserve, V8.8)", stimmung: "balkon" },
  N25:  { datei: "img/N25.webp", text: "Prüfungsraum, Lynns Stift auf dem Tisch (V8)", stimmung: "pruefung" },
  N37:  { datei: "img/N37.webp", text: "Jonas lehnt in der Wohnungstür, Pizza in der Hand (V8)", stimmung: "flur", figur: true },
  N36L: { datei: "img/N36L.webp", text: "Party-Hub ohne Lynn", stimmung: "party" },
  N36Z: { datei: "img/N36Z.webp", text: "Blick durch die Balkontür: Lynn allein am Geländer (Zuschnitt, V8)", stimmung: "balkon", figur: true },
  HB1: { datei: "img/HB1.webp", text: "Hub: Ben erzählt Lynn was, sie lacht", stimmung: "party" },
  BR: { datei: "img/BR.webp", text: "Balkon von außen: Fenster und offene Flurtür, Party drinnen (Gemini, V8.8)", stimmung: "balkon" },
  B12T: { datei: "img/B12T.webp", text: "Begrüßung: Jonas kommt winkend durch die Tür", stimmung: "flur" },
  B12A: { datei: "img/B12A.webp", imHandy: "img/B12A_h.webp", text: "Begrüßung: Jonas und Lena lachen", stimmung: "flur" },
  B12B: { datei: "img/B12B.webp", text: "Begrüßung: Jonas mit offenen Armen", stimmung: "flur" },
  N13L: { datei: "img/N13L.webp", imHandy: "img/N13L_h.webp", text: "Küche: Lena dreht sich zu mir um", stimmung: "party" },
  B12L: { datei: "img/B12L.webp", text: "Küche: Jonas nah, kleines Lächeln", stimmung: "party", figur: true },
  N32dC: { datei: "img/N32dC.webp", text: "Lena versinkt im Cringe", stimmung: "party", funken: [[.452,.705],[.503,.640],[.512,.742],[.557,.705]] },
  N32dP: { datei: "img/N32dP.webp", text: "Wunderkerzen brennen runter", stimmung: "party" },
  N32dA: { datei: "img/N32dA.webp", imHandy: "img/N32dA_h.webp", text: "Wunderkerzen aus, alle jubeln", stimmung: "party" },
  N35M1: { datei: "img/N35M1.webp", imHandy: "img/N35M1_h.webp", text: "Mia mitten in der Menge", stimmung: "party" },
  N35M2: { datei: "img/N35M2.webp", text: "Mia in der Menge, Lücke", stimmung: "party" },
  N35z: { datei: "img/N35z.webp", text: "Mia, Augen zu", stimmung: "party" },
  N35cL: { datei: "img/N35cL.webp", text: "Mia filmt und lacht", stimmung: "party", figur: true },
  N35t: { datei: "img/N35t.webp", text: "Mia tippt aufs Handy", stimmung: "party", figur: true },
  N35n: { datei: "img/N35n.webp", text: "Mia neugierig", stimmung: "party", figur: true, blinzeln: "N35nz" },
  N35s: { datei: "img/N35s.webp", text: "Mia skeptisch", stimmung: "party", figur: true },
  N35be: { datei: "img/N35be.webp", text: "Mia bettelt", stimmung: "party", figur: true },
  N35d: { datei: "img/N35d.webp", text: "Mia zeigt drei Finger", stimmung: "party", figur: true },
  N35f: { datei: "img/N35f.webp", text: "Mia ganz nah, flirtet", stimmung: "party", figur: true },
  N35fz: { datei: "img/N35fz.webp", text: "Mia ganz nah, zwinkert", stimmung: "party", figur: true },
  N35w: { datei: "img/N35w.webp", imHandy: "img/N35w_h.webp", text: "Tanzfläche, Mia ist weg", stimmung: "party" },
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
  MD1: { datei: "img/MD1.webp", text: "Mia-Daumenkino 1 (Gemini, Patrick 27.11.)", stimmung: "party" },
  MD2: { datei: "img/MD2.webp", text: "Mia-Daumenkino 2 (Gemini, Patrick 27.11.)", stimmung: "party" },
  MD3: { datei: "img/MD3.webp", text: "Mia-Daumenkino 3 (Gemini, Patrick 27.11.)", stimmung: "party" },
  MD4: { datei: "img/MD4.webp", text: "Mia-Daumenkino 4 (Gemini, Patrick 27.11.)", stimmung: "party" },
  MK1: { datei: "img/MK1.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  MK2: { datei: "img/MK2.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  MK3: { datei: "img/MK3.webp", text: "Mia-Montage gespiegelt", stimmung: "party" },
  K10P: { datei: "img/K10P.webp", text: "Wie K10H, Handy liegt umgedreht rechts auf dem Tisch (Gemini, V8.8)", stimmung: "zimmer", tisch: true, ohneHaende: "K10O", handy: [0.84, 0.71, 0.14, 0.16] },
  K10H: { datei: "img/K10H.webp", text: "Ich-Sicht am Schreibtisch nachts, Hände auf dem Tisch, Lynns Stift auf dem Buch (V8)", stimmung: "zimmer", tisch: true, ohneHaende: "K10O" },
  K10O: { datei: "img/K10O.webp", text: "Wie K10H, aber ohne Hände auf dem Tisch (er hält das Handy) (V8.2)", stimmung: "zimmer", tisch: true, mitHaenden: "K10H" },
  N38c: { datei: "img/N38c.webp", text: "Rückblende Seminar: Lynn grinst spöttisch rüber (nah) (V8)", stimmung: "traum", figur: true },
  N38n: { datei: "img/N38n.webp", text: "Rückblende Seminar: Lynn ganz nah, Grinsen hinter den Fingern (V8)", stimmung: "traum", figur: true },
  N25L: { datei: "img/N25L.webp", text: "Prüfungsraum fast leer, noch zehn Minuten (V8)", stimmung: "pruefung" },
  N25B: { datei: "img/N25B.webp", text: "Nah: Blatt, Lynns Stift, blaue Mine (V8)", stimmung: "pruefung" },
  N25V: { datei: "img/N25V.webp", text: "Gang vor dem Prüfungsraum, Leute mit Karteikarten (V8)", stimmung: "pruefung" },
  LD1:  { datei: "img/LD1.webp", text: "Lynn-Ende: Lynn gegenüber im Restaurant, Kleid (V8)", stimmung: "restaurant", figur: true },
  TV1:  { datei: "img/TV1.webp", text: "Tim auf der Tanzfläche, Flasche hoch: „Komm einfach mit zu mir!“ (V8)", stimmung: "party", figur: true },
  TV2:  { datei: "img/TV2.webp", text: "Tim mit erhobenem Finger: „Alle Wege führen nach –“ (V8)", stimmung: "party", figur: true },
  TVn:  { datei: "img/TVn.webp", text: "Tim lacht, ganz nah (V8)", stimmung: "party", figur: true },
  H36a: { datei: "img/H36a.webp", imHandy: "img/H36a_h.webp", text: "Hub, andere Leute, Lynn hinten auf dem Balkon (V8)", stimmung: "party" },
  H36b: { datei: "img/H36b.webp", imHandy: "img/H36b_h.webp", text: "Hub, Paar auf der Tanzfläche, Lynn hinten (V8)", stimmung: "party" },
  // ---------- V8.8 (Bauliste J/A) ----------
  FEUER: { datei: "img/FEUER.webp", imHandy: "img/FEUER_h.webp", text: "Party Sekunden nach dem Feuerlöscher: leichter Pulvernebel, alle lachen, Balkon leer (Gemini, V8.8)", stimmung: "party" },
  LENA_FEGT: { datei: "img/LENA_FEGT.webp", imHandy: "img/LENA_FEGT_h.webp", text: "Ich-Sicht ~01:20: er hält die Schaufel, Lena fegt Konfetti (Gemini, V8.8)", stimmung: "party" },
  A1W: { datei: "img/A1W.webp", text: "Jonas, Lena und Tim winken zum Abschied (Gemini, V8.8)", stimmung: "party" },
  TIM2: { datei: "img/TIM2.webp", imHandy: "img/TIM2_h.webp", text: "Tims Selfie von seiner Feier, er klein hinten (Gemini, V8.8)", stimmung: "foto" },
  TIM_FEIER_1: { datei: "img/TIM_FEIER_1.webp", imHandy: "img/TIM_FEIER_1_h.webp", text: "Tims Feier: Tim filmt (dunkler/kühler, V8.8)", stimmung: "foto" },
  TIM_FEIER_2: { datei: "img/TIM_FEIER_2.webp", imHandy: "img/TIM_FEIER_2_h.webp", text: "Tims Feier: Tims Selfie (V8.8)", stimmung: "foto" },
  TIM_FEIER_3: { datei: "img/TIM_FEIER_3.webp", imHandy: "img/TIM_FEIER_3_h.webp", text: "Tims Feier: Mias Gruppenselfie (V8.8)", stimmung: "foto" },
  TIM_FEIER_4: { datei: "img/TIM_FEIER_4.webp", imHandy: "img/TIM_FEIER_4_h.webp", text: "Tims Feier: Mias Selfie (V8.8)", stimmung: "foto" },
  SA1: { datei: "img/SA1.webp", text: "Samstag: Bar, Jonas und Tim (Handyvideo 9:16, V8.8)", stimmung: "foto" },
  SA2: { datei: "img/SA2.webp", text: "Samstag: Mia auf der Bank, Menge (Handyvideo 9:16, V8.8)", stimmung: "foto" },
  SA3: { datei: "img/SA3.webp", text: "Samstag: Theke, anstoßen (Handyvideo 9:16, V8.8)", stimmung: "foto" },
  LAUCH: { datei: "img/LAUCH.webp", text: "Mias Video, sein dünner Arm am Rand (9:16, V8.8)", stimmung: "foto" },
  LIVE1: { datei: "img/LIVE1.webp", imHandy: "img/LIVE1_h.webp", text: "Lenas Live: Partyraum (9:16, V8.8)", stimmung: "foto" },
  LIVE2: { datei: "img/LIVE2.webp", imHandy: "img/LIVE2_h.webp", text: "Lenas Live: Lena und Tim (9:16, V8.8)", stimmung: "foto" },
  LIVE3: { datei: "img/LIVE3.webp", imHandy: "img/LIVE3_h.webp", text: "Lenas Live: Lena redet, Tim mit Becher (9:16, V8.8)", stimmung: "foto" },
  LIVE3z: { datei: "img/LIVE3z.webp", imHandy: "img/LIVE3z_h.webp", text: "Lenas Live: wie LIVE3, Lenas Mund zu (V8.9, Patrick 24.11.: beim Reden wechselt nur der Mund, Tims Becher bleibt oben)", stimmung: "foto" },
  BAD_POST: { datei: "img/BAD_POST.webp", text: "Seine Story aus dem Bad: Handyfoto vom Flur zur Party (Ausschnitt B09, V8.8)", stimmung: "foto" },
};

// =====================================================================
//   TÖNE: Name → Datei (leer = still). vol = Lautstärke (1 = normal)
//   Neue Datei: in den Ordner ton/ legen und hier eintragen.
// =====================================================================
const OVERLAYS = {"B12z": {"basis": "B12", "box": [0.4099, 0.2929, 0.1953, 0.1716]}, "B12g": {"basis": "B12", "box": [0.4146, 0.3946, 0.1896, 0.2295]}, "B12s": {"basis": "B12", "box": [0.4427, 0.4748, 0.1349, 0.2491]}, "N13Lz1": {"basis": "N13L", "box": [0.5974, 0.2276, 0.1766, 0.2659]}, "N13Lz2": {"basis": "N13L", "box": [0.2792, 0.2659, 0.101, 0.1203]}, "N13Ls": {"basis": "N13L", "box": [0.2844, 0.3526, 0.1042, 0.1549]}, "B12Az": {"basis": "B12A", "box": [0.2938, 0.3611, 0.0786, 0.0509]}, "B12Ag": {"basis": "B12A", "box": [0.5589, 0.162, 0.1604, 0.4185]}, "N35cz": {"basis": "N35c", "box": [0.5359, 0.237, 0.2042, 0.2046]}, "N35cs": {"basis": "N35c", "box": [0.5776, 0.3898, 0.1646, 0.2556]}, "N35ck": {"basis": "N35c", "box": [0.5318, 0.2333, 0.2151, 0.1972]}, "N35bg": {"basis": "N35b", "box": [0.5698, 0.2843, 0.1427, 0.1741]}, "N35bs": {"basis": "N35b", "box": [0.5818, 0.3204, 0.1406, 0.2194]}, "N35fl": {"basis": "N35f", "box": [0.3672, 0.112, 0.2755, 0.6861]}, "N35fg": {"basis": "N35f", "box": [0.3688, 0.2287, 0.2594, 0.45]}, "N35fgz": {"basis": "N35f", "box": [0.3682, 0.2278, 0.2625, 0.4519]}, "N19z": {"basis": "N19", "box": [0.5188, 0.2139, 0.2068, 0.2009]}, "N19s": {"basis": "N19", "box": [0.5094, 0.1769, 0.2224, 0.4352]}, "N19t": {"basis": "N19", "box": [0.5089, 0.1787, 0.1901, 0.4213]}, "N19l": {"basis": "N19", "box": [0.5193, 0.1917, 0.1786, 0.3278]}, "N20g": {"basis": "N20", "box": [0.5354, 0.2333, 0.0891, 0.1722]}, "LDz": {"basis": "LD1", "box": [0.4354, 0.188, 0.1307, 0.1204]}, "LDs": {"basis": "LD1", "box": [0.4615, 0.2907, 0.0823, 0.1435]}, "LD2": {"basis": "LD1", "box": [0.4172, 0.0435, 0.1781, 0.3944]}, "LD3": {"basis": "LD1", "box": [0.4375, 0.6287, 0.2839, 0.3713]}, "LD4": {"basis": "LD1", "box": [0.2484, 0.8204, 0.2297, 0.1796]}, "LDw": {"basis": "LD1", "box": [0.4328, 0.0954, 0.1396, 0.313]}, "LDa": {"basis": "LD1", "box": [0.438, 0.1574, 0.1307, 0.1213]}, "LDh": {"basis": "LD1", "box": [0.3766, 0.263, 0.2823, 0.5546]}, "N37z": {"basis": "N37", "box": [0.3932, 0.1546, 0.1115, 0.1213]}, "N37s": {"basis": "N37", "box": [0.401, 0.225, 0.1021, 0.1741]}, "N37b": {"basis": "N37", "box": [0.3693, 0.0287, 0.1365, 0.3148]}, "N38bz": {"basis": "N38b", "box": [0.2135, 0.262, 0.1391, 0.113]}, "N38bl": {"basis": "N38b", "box": [0.2115, 0.2444, 0.1401, 0.2861]}, "TV3": {"basis": "TV1", "box": [0.4682, 0.1685, 0.0693, 0.0972]}, "LENA_NAH_z": {"basis": "LENA_NAH", "box": [0.4495, 0.2972, 0.1734, 0.1694]}, "LENA_NAH_s": {"basis": "LENA_NAH", "box": [0.4557, 0.2685, 0.1578, 0.3611]}, "LENA_NAH_l": {"basis": "LENA_NAH", "box": [0.4547, 0.2685, 0.1526, 0.3611]}, "N19nz": {"basis": "N19n", "box": [0.5292, 0.2352, 0.1922, 0.1435]}, "N19nl": {"basis": "N19n", "box": [0.5245, 0.3426, 0.0573, 0.1333]}, "N14zo": {"basis": "N14", "box": [0.5766, 0.2108, 0.1505, 0.1129]}, "N35ns": {"basis": "N35n", "box": [0.5948, 0.35, 0.1115, 0.1676]}, "N35ss": {"basis": "N35s", "box": [0.6036, 0.3498, 0.0964, 0.166]}, "MIA_GRINST_cs": {"basis": "MIA_GRINST_c", "box": [0.4526, 0.3639, 0.1031, 0.1611]}, "N35bes": {"basis": "N35be", "box": [0.5917, 0.35, 0.1292, 0.1694]}, "N35ts": {"basis": "N35t", "box": [0.599, 0.3537, 0.0948, 0.1565]}, "LNN2z": {"basis": "N14c", "box": [0.4042, 0.2948, 0.199, 0.1297]}, "LNL2z": {"basis": "N14d", "box": [0.4047, 0.2463, 0.1974, 0.1772]}, "N14bez": {"basis": "N14be", "box": [0.4828, 0.2593, 0.1672, 0.1139]}, "LNN2s": {"basis": "N14c", "box": [0.4286, 0.4487, 0.1505, 0.1959]}, "LNSez": {"basis": "LNSe", "box": [0.3979, 0.2836, 0.2026, 0.1511]}, "N35fla": {"basis": "N35f", "box": [0.3672, 0.112, 0.2755, 0.6861]}, "N35flm": {"basis": "N35f", "box": [0.3672, 0.112, 0.2755, 0.6861]}};
// Gesichts-Varianten pro Bild: blink (Augen zu), spricht {Sprecher: Variante}, mimik (gelegentlich, wenn niemand spricht)
const VARIANTEN = {
  N35t: { spricht: { Mia: "N35ts" } },   // V8.9 Gemini-Mund
  N35be: { spricht: { Mia: "N35bes" } },   // V8.9 Gemini-Mund
  MIA_GRINST_c: { spricht: { Mia: "MIA_GRINST_cs" } },   // V8.9 Gemini-Mund
  N35s: { spricht: { Mia: "N35ss" } },   // V8.9 Gemini-Mund
  N35n: { spricht: { Mia: "N35ns" } },   // V8.9 Gemini-Mund
  N14: { blink: ["N14zo"] },
  B12: { blink: ["B12z"], spricht: { Jonas: "B12s" }, mimik: ["B12g"] },
  N13L: { blink: ["N13Lz1", "N13Lz2"], spricht: { Jonas: "N13Ls" } },
  B12A: { blink: ["B12Az"], mimik: ["B12Ag"] },
  N35c: { blink: ["N35cz"], spricht: { Mia: "N35cs" }, mimik: ["N35ck"] },
  N35b: { spricht: { Mia: "N35bs" }, mimik: ["N35bg"] },
  N35f: { spricht: { Mia: "N35fg" } },
  N19: { blink: ["N19z"], spricht: { Lynn: "N19s" } },
  N19n: { blink: ["N19nz"] },
  N14c: { blink: ["LNN2z"], spricht: { Lynn: "LNN2s" } },   // V9.3b: redet (Patrick 27.11.)
  LNSe: { blink: ["LNSez"] },
  N14d: { blink: ["LNL2z"] },  N14be: { blink: ["N14bez"] },
  LD1: { blink: ["LDz"], spricht: { Lynn: "LDs" } },
  N37: { blink: ["N37z"], spricht: { Jonas: "N37s" } },
  N38b: { blink: ["N38bz"] },
  TV1: { mimik: ["TV3"] },
  LENA_NAH: { blink: ["LENA_NAH_z"], spricht: { Lena: "LENA_NAH_s" }, mimik: ["LENA_NAH_l"] },
};
const TOENE = {
  kerze:           { datei: "ton/kerze.mp3", vol: 1.1 },      // Wunderkerzen auspusten (kai_audio 446030)
  umarmung:        { datei: "ton/umarmung.mp3", vol: 1.2 },   // Jonas’ Umarmung (Philips Aufnahme)
  feuerloescher:   { datei: "ton/feuerloescher.mp3", vol: .45 }, // Gemini-Prüfung 26.11.: −7 dB (klang wie im selben Raum)  // Bad, durch die Tür (V8.7, Hörprobe von Philip abgenommen)
  stempel:         { datei: "ton/stempel.mp3", vol: 1 },                 // Patrick 27.11.: dumpfer Stempel statt Türklopfen
  klopfen:         { datei: "ton/klopfen.mp3", vol: .9 },               // Sophie klopft (Pixabay, Philip)
  treppe:          { datei: "ton/treppenhaus_runter.mp3", vol: 1.4 }, // Gemini-Prüfung 26.11.: +5 dB     // Schritte im Treppenhaus
  strasse:         { datei: "ton/strasse_betrunken.mp3", vol: .4 }, // Gemini-Prüfung 26.11.: −8 dB + Tiefpass 800 im Skript       // Leute unten auf der Straße
  tasse:           { datei: "ton/teller_abstellen.mp3", sprite: [[2.76, .9], [31.95, .9]], vol: 1.5 }, // Gemini-Prüfung 26.11.: +4 dB
  aufraeumen:      { datei: "ton/teller_abstellen.mp3", sprite: [[5.25, 1.4], [10.03, 1.4], [16.65, 1.4], [24.59, 1.4]], vol: 1.4 }, // Gemini-Prüfung 26.11.: +6 dB (Datei falsch: Geschirr statt Fegen, Ersatz offen)
  regen_strasse:   { datei: "ton/regen_strasse.mp3" },
  mia:             { datei: "ton/mia_lied.mp3", vol: .84 },  // Gemini-Prüfung 26.11.: −1,5 dB                // Mias Lied (KI-Song von Philip)
  jubel:           { datei: "ton/crowd_cheers.mp3", vol: .3 }, // Gemini-Prüfung 26.11.: −8,5 dB (Stadion-Jubel war lauter als die Party)
  schrei:          { datei: "ton/man_screaming.mp3", vol: .55 },
  kotzen:          { datei: "ton/ich_koennt_kotzen.mp3", vol: .5 },
  handy_ablegen:   { datei: "ton/handy_ablegen.mp3", vol: 1.3 }, // Gemini-Prüfung 26.11.: +5 dB   // Handy auf den Tisch (kurz, dumpf, synthetisch)
  display_klick:   { datei: "ton/tipp.mp3", sprite: [[0, .09]], vol: .8 },
  bzzz_dumpf:      { datei: "ton/bzzz_tisch.mp3", vol: .55 },
  bzzz_doppel:     { datei: "ton/bzzz.mp3" },                            // Sophie klopft (fehlt noch)
  schief:          { datei: "" },                            // schiefer Gesang aus den Fenstern (fehlt noch)
  // Handy
  bzzz:            { datei: "ton/bzzz.mp3" },              // Nachricht (phone-vibration-96623)
  bzzz_tisch:      { datei: "ton/bzzz_tisch.mp3" },        // Vibration auf dem Tisch (konpeito 305372)
  anruf:           { datei: "ton/anruf.mp3", vol: .4 }, // Gemini-Prüfung 26.11.: −8 dB (Schreckmoment)             // Anruf (mobile-phone-vibration-77849)
  tipp:            { datei: "ton/tipp.mp3", vol: .9 },     // 8 einzelne Anschläge (wattsapp-29575), fürs Löschen
  tipplauf:        { datei: "ton/tipplauf.mp3", anschlaege: [0.09,0.345,0.58,0.73,0.835,0.915,1.03,1.21,1.475,1.555,1.74,1.82,1.9,2.01,2.11,2.19,2.945,3.115,3.26,3.495,3.715,3.935,4.08,4.24,4.36,4.495,4.655,4.86,5.14,5.445,5.8,6.055,6.26,6.555,6.81] },  // echtes Tippen mit Rhythmus (wattsapp-29575, nur saubere Stellen)
  senden:          { datei: "ton/senden.mp3", vol: .8 },
  klick:           { datei: "ton/lichtschalter.mp3", vol: .35 },  // Display/Stumm (vorläufig Lichtschalter, leise)
  // Zimmer
  lichtschalter:   { datei: "ton/lichtschalter.mp3" },
  stift:           { datei: "ton/stift.mp3", vol: .45 }, // Gemini-Prüfung 26.11.: −9 dB (Spitze)   // Vierfarb-Stift (K16b, Prüfung)
  PR3_stift:       { datei: "ton/PR3_stift.mp3" },         // Stift schreibt
  haken:           { datei: "ton/haken.mp3", sprite: [[0.02, .55], [1.56, .5], [3.01, .62], [4.31, .62]] },   // „Check“: 4 echte Stift-Haken (check-83184)
  blaettern:       { datei: "ton/blaettern.mp3" },
  reissverschluss: { datei: "ton/reissverschluss.mp3", vol: .45 }, // Gemini-Prüfung 26.11.: −7 dB
  tuer_auf:        { datei: "ton/tuer_auf.mp3", vol: .8 },
  decke1:          { datei: "ton/decke1.mp3", vol: .8 },
  decke2:          { datei: "ton/decke2.mp3", vol: .8 },
  uhr:             { datei: "ton/uhr.mp3" },
  herzschlag:      { datei: "ton/herzschlag.mp3" },
  // Draußen
  haustuer:        { datei: "ton/haustuer.mp3" },
  tuer_klack:      { datei: "ton/tuer_klack.mp3" },
  wind:            { datei: "ton/wind.mp3" },              // draußen laut, im Zimmer leise als Raumton
  schritte:        { datei: "ton/schritte.mp3" },        // 4 Schritte, gleichmäßig (Kies, V8.2)
  schritte_lauf:   { datei: "ton/schritte_lauf.mp3" },   // nahtlose Schleife 16 Schritte (Kamerafahrt Weg)
  // Party
  M1_party:        { datei: "ton/M1_party.mp3" },          // Dance Until Dark
  gemurmel:        { datei: "ton/gemurmel.mp3" },          // House-Party-Stimmen (62063)
  gemurmel2:       { datei: "ton/gemurmel2.mp3" },         // Party-Chatter (6194)
  frauen:          { datei: "ton/frauen.mp3" },            // Frauenstimmen (140260)
  halle:           { datei: "ton/halle.mp3" },             // Crowd talking (138493): Halle nach der Prüfung
  party_fern:      { datei: "ton/party_fern.mp3" },        // muffled party music (Fenster auf)
  lied:            { datei: "ton/lied.mp3", start: 0 },    // Happy Birthday – V8: Ausschnitt 0:13–0:42 der Bar-Aufnahme (dort wird gesungen; vorher 1:58 = nur Gemurmel)
  muffled_party:   { datei: "ton/muffled_party.mp3", vol: .2 }, // Gemini-Prüfung 26.11.: −8 dB, Übergang ins Menü   // Startbildschirm: gedämpfte Partymusik (mccrunchy, Philip)
  glas:            { datei: "ton/glas.mp3" },
  johlen:          { datei: "ton/johlen.mp3", vol: .8 },
  gelaechter:      { datei: "ton/gelaechter.mp3", vol: .45 }, // Gemini-Prüfung 26.11.: −7 dB (Ersatz offen)
  schloss:         { datei: "ton/schloss.mp3" },
  badtuer:         { datei: "ton/badtuer.mp3" },           // Wasser hört auf, Schloss, Tür (A4)
  schritte_holz:   { datei: "ton/schritte_holz.mp3" },
  tinnitus:        { datei: "ton/tinnitus.mp3" },
  ausatmen:        { datei: "ton/ausatmen.mp3", vol: .8 },   // V8.9 Sonntag vor „Ruhe.“ (Pixabay, freesound_community „sigh“, von Patrick)          // V8.6 Kater: hohes Pfeifen beim Aufwachen (synthetisch)
  lynn_lacht1:     { datei: "ton/lynn_lacht1.mp3" },
  lynn_lacht2:     { datei: "ton/lynn_lacht2.mp3", vol: .55 }, // Gemini-Prüfung 26.11.: −5 dB, so laut wie lynn_lacht1
  // Morgen, Prüfung
  voegel:          { datei: "ton/voegel.mp3" },
  wecker:          { datei: "ton/wecker.mp3", vol: 2.2 }, // Gemini-Prüfung 26.11.: +9 dB (war flüsterleise)  // Handywecker Montag früh (alarm-327234, Philip, 7 s)
  raum_tag:        { datei: "ton/raum_tag.mp3" },
  tuerklingel:     { datei: "ton/tuerklingel.mp3" },
  // Übergänge, FoMO-Rahmen
  whoosh_kurz:     { datei: "ton/whoosh_kurz.mp3" },       // Zeitraffer
  whoosh_aufbau:   { datei: "ton/whoosh_aufbau.mp3" },     // vor dem Shutdown
  aufbau_lang:     { datei: "ton/aufbau_lang.mp3", vol: 1 },
  aufbau_shutdown: { datei: "ton/aufbau_shutdown.mp3", vol: 1 },   // V8.9 (Patrick 24.11.): wie aufbau_lang, Piepen steigt bis zum Woosh, am Ende harter Schnitt in die Stille   // Crashout Weg B: Rauschen baut sich auf, Piepsen, Woosh (8 s, aus Philips Woosh gebaut)
  tippen_laptop:   { datei: "ton/tippen_laptop.mp3", vol: 1 },   // Seminar (freesound_community, Philip)
  lernflow:        { datei: "ton/lernflow.mp3", vol: 1 },   // Freitag Lern-Flow (Patrick 26.11., ersetzt dort das Lofi)
  lofi_melancholy: { datei: "ton/lofi_melancholy.mp3", vol: 1 }, // Balkon, wenn sie sich hinsetzen (zephiramusic, Philip)
  restaurant_lofi: { datei: "ton/restaurant_lofi.mp3", vol: 1 }, // Restaurant Lynn-Ende (alex-morgan, Philip)
  party_club2:     { datei: "ton/party_club2.mp3", vol: .45 }, // Gemini-Prüfung 26.11.: −2,5 dB     // zweiter Party-Song (mondamusic, Philip)
  ende_warm:       { datei: "ton/ende_warm.mp3", vol: 1 },       // Outro Lynn-Ende (andriig „Warm“, Philip)
  flashback:       { datei: "ton/flashback.mp3", vol: .8 },
  abzeichen:       { datei: "ton/abzeichen.mp3" },
  // Musik
  M3_spaet:        { datei: "ton/M3_spaet.mp3" },          // Late Night Breeze
  tim_party:       { datei: "ton/tim_party.mp3" },         // Tims Afterparty: Club Trance (HumanStudioed, Patrick 24.11.)
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
  // Patrick 24.11.: Hinweis auf das Easter Egg (FORster MOritz = FoMO), ohne es zu verraten
  'MORITZ!': ['🧯', '#ff5a4f', '#9e1d17', 'Forster Moritz. Ein sehr gewöhnlicher Name, nicht wahr?', 'Ein Name, den alle rufen.'],
  'Laucharm': ['💪', '#9be37a', '#3f7a22', 'Mitgetanzt. Ein Arm in Mias Video.', 'Irgendwo am Rand bist du drauf.'],
  'Konfetti': ['🧹', '#f7a8e0', '#9a3c86', 'Geblieben, als alle weg waren. Schaufel gehalten.', 'Jemand muss ja aufräumen.'],
  'Außer Reichweite': ['📵', '#9ec2ff', '#3a5ca8', 'Handy auf den Schreibtisch gelegt. Hat nicht gereicht.', 'Abstand ist auch eine Entscheidung.'],
  'Leiser': ['🌙', '#4a5fc1', '#1f2a55', 'Ende: Das Handy hat kaum mitgeredet.', 'Ein Ende mit weniger Display.'],
  'Blaues Licht': ['📱', '#36b4ff', '#1446a8', 'Ende: Das Display war heller als der Abend.', 'Ein Ende. Heller, als dir lieb ist.'],
  'Mal schauen': ['👀', '#f7cf3c', '#b8860b', 'Du hast Jonas „mal schauen“ geschrieben.', 'Eine Antwort, die keine war.'],
  'Find’s raus': ['🚪', '#3fd08a', '#167a48', 'Du bist an Jonas’ Anruf rangegangen.', 'Es hat geklingelt. Und dann?'],
  'Senden?': ['✉️', '#b77cff', '#5b2aa8', 'Getippt. Und dann doch gelöscht.', 'Ein paar Wörter. Nie angekommen.'],
  'Stumm': ['🔕', '#9aa4b6', '#4a5262', 'Du hast das Handy nachts stumm geschaltet.', 'Manchmal reicht ein Schalter.'],
  'Eine Stunde': ['⏳', '#ffad5c', '#c0571b', 'Afterparty. Nur eine Stunde. Klar.', 'Es gab noch ein Danach.'],
  'Fotograf des Jahres': ['📷', '#ffd36b', '#8a5a14', 'Kein einziges Foto gemacht. Warst ja nicht da.', 'Ein Preis für Bilder, die andere gemacht haben.'],
  'Zwischen den Jacken': ['🧥', '#cf9a6a', '#6e4424', 'So spät da, dass nur die Jacken gewartet haben.', 'Zu spät ist auch eine Uhrzeit.'],
  'Musst du dabei gewesen sein': ['🎉', '#ff6fb3', '#a81e66', 'Den Feuerlöscher-Moment verpasst.', 'Alle reden noch davon. Du nicht.'],
  '§ 827': ['⚖️', '#ef5a5f', '#8f1d22', 'Auf der Party an Jura gedacht. Tim haftet.', 'Dein Studium war plötzlich nützlich.'],
  'Gar nicht gemerkt': ['🕑', '#3fd4c6', '#127a71', 'Handy stecken lassen. Auf einmal war es zwei.', 'Irgendwann war die Uhr egal.'],
  'Montagabend': ['🕯️', '#ff8fb1', '#8e2f5a', 'Ende: Montagabend. Handy umgedreht, ohne draufzuschauen.', 'Ein Abend nach der Prüfung.'],
};
// (MENUEBILD wird nicht mehr gebraucht: Start und Menü sind jetzt das gezeichnete Zimmer)
const MENUEBILD = 'B15';

// Kurzfilme (stumm, Ton kommt aus dem Spiel)
const FILME = { weg: 'vid/weg.mp4' };

// V9.3b (Patrick 27.11.): Zwischenbilder – bei einem Gesichtswechsel von A nach B kommt kurz das Zwischenbild
const ZWISCHEN = {
  // Patrick 27.11.: Lynns Lachen wechselt auf einmal wie in der Demo (Zwischenbilder N14lb/N14la raus – Ton kam verzögert)
  'N35s>N35n': 'N35sn', 'N35n>N35s': 'N35sn',
};

