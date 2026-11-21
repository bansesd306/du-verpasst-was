import sys
from PIL import Image, ImageDraw
pre=sys.argv[1]; idx=[int(x) for x in sys.argv[2].split(',')]; out=sys.argv[3]; cols=int(sys.argv[4]) if len(sys.argv)>4 else 3
w,h=640,360; rows=(len(idx)+cols-1)//cols; s=Image.new('RGB',(w*cols,h*rows))
for k,i in enumerate(idx):
    im=Image.open(f'{pre}_{i:02d}.png').convert('RGB').resize((w,h)); d=ImageDraw.Draw(im); d.rectangle([0,0,34,22],fill=(0,0,0)); d.text((4,4),str(i),fill=(255,255,0))
    s.paste(im,((k%cols)*w,(k//cols)*h))
s.save(out,quality=82)
