# Screenshots bestimmter Stellen: Sprung zu einer Szene, schnell vorspulen bis zum Zielbild, dann echt warten und knipsen
import asyncio, sys, json
from playwright.async_api import async_playwright
JOBS=json.loads(sys.argv[1]); OUT=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1200)
        n=0
        for job in JOBS:
            label, V, ziele = job['label'], job.get('V',{}), job['ziele']
            await pg.evaluate("Spiel._debug.setSchnell(true)")
            await pg.evaluate(f"Spiel._debug.neustart('{label}')"); await pg.wait_for_timeout(50)
            await pg.evaluate(f"Object.assign(Spiel.V, {json.dumps(V)})")
            for z in ziele:
                t=0; ok=False
                while t<3000:
                    t+=1
                    st=await pg.evaluate("""(z)=>{const a=(window.Spiel&&Spiel._akt)||null; const img=[...document.querySelectorAll('#welt .ebene.an img')].map(i=>i.getAttribute('src')).join(' ');
                      const fz=!!document.querySelector('.fotogross.zoom'); const sel=z.startsWith('#')||z.startsWith('.')?!!document.querySelector(z):false;
                      const txt=document.querySelector('#text')?document.querySelector('#text').textContent:''; return {img,fz,sel,txt,b:[...document.querySelectorAll('#wahl button')].length}}""", z)
                    hit = (z.startswith('img/') and z in st['img']) or (z=='FOTOZOOM' and st['fz']) or st['sel'] or (z.startswith('T:') and z[2:] in st['txt'])
                    if hit: ok=True; break
                    if st['b']: await pg.evaluate("document.querySelectorAll('#wahl button')[0].click()")
                    else: await pg.evaluate("Spiel._debug.tippen()")
                    await pg.wait_for_timeout(25)
                await pg.evaluate("Spiel._debug.setSchnell(false)")
                await pg.wait_for_timeout(job.get('warte',1600))
                n+=1; await pg.screenshot(path=f'{OUT}_{n:02d}.png')
                print(n, label, z, 'OK' if ok else 'NICHT ERREICHT', flush=True)
                await pg.evaluate("Spiel._debug.setSchnell(true)")
        print('ERR', errs[:5])
        await b.close()
asyncio.run(main())
