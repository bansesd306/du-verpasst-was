set -e
U=/mnt/user-data/uploads; O=/home/claude/game/dist/ton
f(){ ls $U/$1* | head -1; }
# $1 quelle  $2 ziel  $3 start  $4 dauer  $5 lautheit  $6 zusatzfilter  $7 kanäle
mk(){ src=$(f $1); fl="loudnorm=I=$5:TP=-1.5:LRA=11"; [ -n "$6" ] && fl="$6,$fl"
  ffmpeg -v error -y -ss $3 -t $4 -i "$src" -af "$fl,afade=t=in:d=0.01,areverse,afade=t=in:d=0.04,areverse" -ac ${7:-1} -ar 44100 -c:a libmp3lame -q:a 4 $O/$2.mp3; }
mk 729653b2 bzzz 0 1.2 -14
mk a1070c7c anruf 0 29.5 -16
mk 0bc0f7b3 stift 0 0.48 -18
mk f1450411 PR3_stift 47 5 -22
mk f1450411 haken 46.9 0.45 -20
mk 3d1f24e8 blaettern 0 0.62 -18
mk 0df62866 reissverschluss 0 3 -20
mk eb45e485 tuer_auf 0 2.5 -20
mk 55fd9b51 haustuer 0 1.03 -18
mk 255d9ebe wind 0 100 -26
mk 968ccabb raum_tag 0 120 -30
# schritte + schritte_lauf: aus 3cc39560 (Kies) mit tools/schritte_kies.py gleichmäßig neu gesetzt (V8.2), dann loudnorm -20
mk 62af7029 schritte_holz 0 4.6 -22
mk 2cfd056b johlen 0 7.9 -20
mk 1c3e708e glas 0 1.58 -16
mk 37d8e7b9 gelaechter 0 10.5 -18
mk c2d93d35 gemurmel 30 60 -26
mk d01d7fbb lied 118 30 -18
mk 34e66ba9 tuerklingel 0.95 3.9 -16
mk 143f0c86 voegel 0 22 -26
mk 5759aced herzschlag 0 11.3 -18
mk e3967de0 uhr 0 8.09 -26
mk 4779a956 lichtschalter 0 0.57 -16
mk 3e4cea76 decke1 9.8 1.5 -22
mk 3e4cea76 decke2 12.3 1.1 -22
mk bce015d4 schloss 0 1.03 -18
mk 616484da abzeichen 0 0.6 -18
mk 1151f0bd lynn_lacht1 1.4 1.3 -22
mk 1151f0bd lynn_lacht2 8.4 1.1 -22
mk 9c6b8f8a whoosh_kurz 0 1.0 -20
mk 0ff1b1b8 whoosh_aufbau 0 2.32 -14
mk 260f6414 flashback 0 1.7 -18
mk 55fcb9b2 party_fern 0 60 -20
# Badtür A4: Wasser (gedämpft) + Schloss/Klinke/Tür
mk 4684b5ee _wasser 14 5.5 -24 "lowpass=f=1400,aecho=0.8:0.6:40:0.25"
mk bfbebae5 _badtuer 0 5.66 -18
ffmpeg -v error -y -i $O/_wasser.mp3 -i $O/_badtuer.mp3 -filter_complex "[1:a]asplit[a][b];[a]atrim=0:3.7,lowpass=f=1800[c];[b]atrim=3.7,asetpts=PTS-STARTPTS[d];[c][d]concat=n=2:v=0:a=1[t];[0:a][t]concat=n=2:v=0:a=1" -ac 1 -c:a libmp3lame -q:a 4 $O/badtuer.mp3
rm $O/_wasser.mp3 $O/_badtuer.mp3
# Tippen: Sprite aus 8 Klicks + Senden
src=$(f d509c960)
i=0; for t in 0.94 1.27 1.53 1.76 1.91 2.10 2.38 2.73; do ffmpeg -v error -y -ss $t -t 0.09 -i "$src" -af "afade=t=out:st=0.06:d=0.03" -ac 1 -ar 44100 $O/_k$i.wav; i=$((i+1)); done
ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.16 $O/_s.wav
args=""; n=0; for i in 0 1 2 3 4 5 6 7; do args="$args -i $O/_k$i.wav -i $O/_s.wav"; n=$((n+2)); done
fc=""; for j in $(seq 0 $((n-1))); do fc="$fc[$j:a]"; done
ffmpeg -v error -y $args -filter_complex "${fc}concat=n=$n:v=0:a=1,loudnorm=I=-22:TP=-1.5" -ac 1 -c:a libmp3lame -q:a 4 $O/tipp.mp3
mk d509c960 senden 4.10 0.25 -20
rm $O/_*.wav
# Musik (stereo)
mk 66950ba3 M1_party 0 184.2 -16 "" 2
mk 2fc32c28 M3_spaet 0 171 -20 "" 2
mk f1f96f25 Outro 0 204.2 -18 "" 2
# ---- Runde 3 (19.11.) ----
ffmpeg -v error -y -t 1.2 -i "$(f 4b694681)" -af "volume=20dB,alimiter=limit=0.89:attack=2:release=40,afade=t=out:st=1.15:d=0.05" -ac 1 -ar 44100 -c:a libmp3lame -q:a 4 $O/bzzz.mp3  # +6 dB lauter als Runde 2
mk be6441de haken 0.88 5.0 -18
mk 4d1acade gemurmel 0 51 -24
mk c2d93d35 gemurmel2 30 60 -26
mk a33c149a frauen 0 19.4 -24
mk d6b8310e halle 0 120 -26
# Tippen mit echtem Rhythmus: 0–15,4 s, laute Ausreißer abgesenkt
src=$(f f578f91d)
ffmpeg -v error -y -ss 0 -t 15.45 -i "$src" -af "volume=0.42:enable='between(t,3.24,3.42)+between(t,5.73,5.92)+between(t,11.19,11.37)',loudnorm=I=-22:TP=-1.5" -ac 1 -ar 44100 -c:a libmp3lame -q:a 4 $O/tipplauf.mp3
i=0; for t in 0.375 0.63 0.86 1.01 1.195 1.31 1.49 2.475; do ffmpeg -v error -y -ss $t -t 0.09 -i "$src" -af "afade=t=out:st=0.06:d=0.03" -ac 1 -ar 44100 $O/_k$i.wav; i=$((i+1)); done
ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.16 $O/_s.wav
args=""; n=0; for i in 0 1 2 3 4 5 6 7; do args="$args -i $O/_k$i.wav -i $O/_s.wav"; n=$((n+2)); done
fc=""; for j in $(seq 0 $((n-1))); do fc="$fc[$j:a]"; done
ffmpeg -v error -y $args -filter_complex "${fc}concat=n=$n:v=0:a=1,loudnorm=I=-22:TP=-1.5" -ac 1 -c:a libmp3lame -q:a 4 $O/tipp.mp3
rm $O/_*.wav
# ---- Runde 4 (19.11., 06:00) ----
# Vibration auf dem Tisch (konpeito 305372), kräftig
ffmpeg -v error -y -t 0.98 -i "$(f a776f79f)" -af "volume=6dB,alimiter=limit=0.92:attack=2:release=40,afade=t=out:st=0.9:d=0.08" -ac 1 -ar 44100 -c:a libmp3lame -q:a 4 $O/bzzz_tisch.mp3
# Tippen: nur die sauberen Stellen (ohne Pieptöne bei 3,3/5,8/6,9/7,1 s und den Block 11–13 s)
src=$(f f578f91d)
ffmpeg -v error -y -i "$src" -filter_complex "[0:a]atrim=0.3:3.1,asetpts=PTS-STARTPTS[a];[0:a]atrim=8.0:10.5,asetpts=PTS-STARTPTS[b];[0:a]atrim=13.7:15.45,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1,loudnorm=I=-20:TP=-1.5" -ac 1 -ar 44100 -c:a libmp3lame -q:a 4 $O/tipplauf.mp3
