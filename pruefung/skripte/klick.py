import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]; bad=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('response', lambda r: bad.append((r.status,r.url)) if r.status>=400 else None)
        pg.on('requestfailed', lambda r: bad.append(('fail',r.url)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
        last=None; stuck=0
        for i in range(1500):
            await pg.mouse.click(640,560)  # Textbox-Bereich
            if i%3==0:
                await pg.evaluate("(()=>{const bs=document.querySelectorAll('#wahl button'); if(bs.length){bs[Math.floor(Math.random()*bs.length)].click(); bs[0].click();}})()")
            if i%50==0:
                st=await pg.evaluate("JSON.stringify(Spiel._debug.aktuell).slice(0,80)")
                print(i, st, flush=True)
                if st==last: stuck+=1
                else: stuck=0
                last=st
                if await pg.evaluate("!!document.querySelector('.schirm.an, #zimmer.an .schirm2.an')"): print('Ende erreicht'); break
            await pg.wait_for_timeout(25)
        # Zurück-Knopf hämmern
        print('Fehler:',errs[:8]); print('HTTP:',bad[:10])
        await b.close()
asyncio.run(main())
