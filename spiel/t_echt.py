import asyncio, sys, time, random
from playwright.async_api import async_playwright
sys.path.insert(0,'.')
import importlib.util
spec=importlib.util.spec_from_file_location('t8','t8.py')
src=open('t8.py').read().split('async def spiel')[0]
ns={}; exec(src,ns); SZ=ns['SZ']; VERBOTEN=ns['VERBOTEN']
async def main(name):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':720})
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(400)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(800)
        await pg.evaluate("Spiel._debug.neustart(); Spiel._debug.nullTexte()")
        prefs=list(SZ[name]); rnd=random.Random(7); t0=time.time(); n=0
        while time.time()-t0<2400:
            st=await pg.evaluate("""()=>({s:[...document.querySelectorAll('.schirm.an, #zimmer.an .schirm2.an')].map(x=>x.id), b:[...document.querySelectorAll('#wahl button')].map(x=>x.textContent), w:document.querySelector('#weiter')?.classList.contains('an')})""")
            if 'z-s-abz' in st['s']: break
            if st['s']:
                await pg.evaluate("()=>{const s=document.querySelector('.schirm.an button, #zimmer.an .schirm2.an button'); if(s) s.click();}")
            elif st['b']:
                await pg.wait_for_timeout(2500); opts=st['b']; i=None
                if prefs and prefs[0] in opts: i=opts.index(prefs.pop(0))
                if i is None:
                    ok=[k for k,o in enumerate(opts) if o not in VERBOTEN]; i=rnd.choice(ok) if ok else 0
                await pg.evaluate(f"document.querySelectorAll('#wahl button')[{i}]?.click()")
            elif st['w']:
                await pg.wait_for_timeout(1000); await pg.evaluate("Spiel._debug.tippen()")
            await pg.wait_for_timeout(150)
        echt=time.time()-t0; vz=await pg.evaluate("Spiel._debug.vz")
        print(name,'echt %.1f min'%(echt/60),'vz %.1f min'%(vz/60), flush=True); await b.close()
asyncio.run(main(sys.argv[1]))
