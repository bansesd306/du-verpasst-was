import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
        for lab in ['L3','BALKON_IGN1','M5']:
            await pg.evaluate(f"Spiel._debug.neustart('{lab}')")
            for i in range(80):
                n=await pg.evaluate("document.querySelectorAll('#wahl button').length")
                if n: break
                await pg.evaluate("Spiel._debug.tippen()"); await pg.wait_for_timeout(300)
            await pg.evaluate("(()=>{const bs=[...document.querySelectorAll('#wahl button')]; bs.forEach(x=>x.click()); bs.forEach(x=>x.click());})()")
            await pg.wait_for_timeout(2500)
            st=await pg.evaluate("({pfad:Spiel.pfad.join('>'),akt:JSON.stringify(Spiel._debug.aktuell).slice(0,90), V:JSON.stringify(Spiel.V).slice(0,200)})")
            print(lab, st)
        # Zurück-Knopf schnell
        for i in range(30):
            await pg.evaluate("(()=>{const r=document.querySelector('#rueck, .rueck, [data-rueck]'); if(r) r.click();})()"); await pg.wait_for_timeout(30)
        print('Fehler', errs[:5])
        await b.close()
asyncio.run(main())
