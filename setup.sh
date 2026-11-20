#!/bin/bash
# Richtet eine frische Claude-Sitzung so ein, dass alle Skripte mit den gewohnten Pfaden laufen.
R=$(cd "$(dirname "$0")" && pwd)
ln -sfn "$R/spiel" /home/claude/game
ln -sfn "$R/tools" /home/claude/tools
mkdir -p /home/claude/galerie
pip install --break-system-packages -q playwright ncnn pillow numpy opencv-python-headless 2>/dev/null
echo "Fertig: /home/claude/game -> $R/spiel"
# Upscaler-Modelle (nur fürs Hochskalieren nötig)
mkdir -p /tmp/esr/models
for m in ultrasharp-4x high-fidelity-4x; do for e in param bin; do
  [ -f /tmp/esr/models/$m.$e ] || curl -sSL -o /tmp/esr/models/$m.$e "https://raw.githubusercontent.com/upscayl/upscayl/main/resources/models/$m.$e"; done; done
