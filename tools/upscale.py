import ncnn, numpy as np, sys, time
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]; M=sys.argv[3] if len(sys.argv)>3 else 'realesrgan-x4plus'; T=192; P=12
net=ncnn.Net(); net.opt.use_vulkan_compute=False; net.opt.num_threads=2
net.load_param('/tmp/esr/models/'+M+'.param'); net.load_model('/tmp/esr/models/'+M+'.bin')
img=np.asarray(Image.open(src).convert('RGB'),dtype=np.float32)/255.
H,W,_=img.shape; out=np.zeros((H*4,W*4,3),np.float32); t0=time.time()
for y in range(0,H,T):
  for x in range(0,W,T):
    y0,x0=max(0,y-P),max(0,x-P); y1,x1=min(H,y+T+P),min(W,x+T+P)
    tile=np.ascontiguousarray(img[y0:y1,x0:x1].transpose(2,0,1))
    ex=net.create_extractor(); ex.input('data',ncnn.Mat(tile))
    _,o=ex.extract('output'); o=np.array(o).transpose(1,2,0)
    oy,ox=(y-y0)*4,(x-x0)*4; h=min(T,H-y)*4; w=min(T,W-x)*4
    out[y*4:y*4+h,x*4:x*4+w]=o[oy:oy+h,ox:ox+w]
  print(f'{y}/{H} {time.time()-t0:.0f}s',flush=True)
Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8)).save(dst,quality=95)
