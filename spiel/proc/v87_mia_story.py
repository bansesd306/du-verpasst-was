# V8.7: Mias letzte Story (Samstag 05:12) – nur Text auf dunklem Grund, wie eine Instagram-Text-Story
import numpy as np
from PIL import Image, ImageDraw, ImageFont
W, H = 1080, 1920
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
g = np.zeros((H, W, 3), np.float32) + np.array([14, 11, 18], np.float32)
r = np.sqrt(((x - W * .5) / W) ** 2 + ((y - H * .42) / H) ** 2)
g += np.array([38, 10, 34], np.float32)[None, None] * np.clip(1 - r * 2.2, 0, 1)[..., None]   # ganz leichter pinker Schimmer
im = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8))
d = ImageDraw.Draw(im); f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 74)
t = 'noch wer wach?'; b = d.textbbox((0, 0), t, font=f)
d.text(((W - (b[2] - b[0])) / 2, H * .44), t, font=f, fill=(245, 245, 245))
im.save('/home/claude/game/dist/img/MIA_STORY.webp', 'WEBP', quality=88)
