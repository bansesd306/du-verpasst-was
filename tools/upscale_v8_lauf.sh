#!/bin/bash
# Jedes Bild in eigenem Prozess (ncnn gibt Speicher sonst nicht frei -> OOM)
for c in "$@"; do
  [ -f /home/claude/game/bilder_neu/v8_hq/$c.png ] && continue
  nice -n 19 python3 /home/claude/tools/upscale_v8.py $c
done
echo FERTIG
