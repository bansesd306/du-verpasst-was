# Endbildschirme durchklicken: python3 t_ende.py '{"typ":"gluecklich"}' PREFIX
import asyncio, sys, json
from playwright.async_api import async_playwright
V=json.loads(sys.argv[1]); PRE=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
        await pg.evaluate("Spiel._debug.neustart('ENDE')"); await pg.evaluate(f"Object.assign(Spiel.V,{json.dumps(V)})")
        for i in range(14):
            await pg.wait_for_timeout(2600)
            await pg.screenshot(path=f'{PRE}_{i:02d}.png')
            info=await pg.evaluate("""()=>{const s=document.querySelector('.schirm.an, #zimmer.an .schirm2.an, .schirm2.an');const bs=s?[...s.querySelectorAll('button')].filter(x=>x.offsetParent).map(x=>x.textContent.trim()):[];return {id:s?s.id:'',bs}}""")
            print(i, info, flush=True)
            if info['bs']:
                # nicht "Beenden"/"Nochmal" klicken
                ok=[k for k,t in enumerate(info['bs']) if not any(w in t for w in ['Beenden','Nochmal','Neu'])]
                if not ok: break
                await pg.evaluate(f"(()=>{{const s=document.querySelector('.schirm.an, #zimmer.an .schirm2.an, .schirm2.an');[...s.querySelectorAll('button')].filter(x=>x.offsetParent)[{ok[0]}].click()}})()")
            else:
                await pg.evaluate("Spiel._debug.tippen()")
        print('ERR',errs[:4]); await b.close()
asyncio.run(main())
