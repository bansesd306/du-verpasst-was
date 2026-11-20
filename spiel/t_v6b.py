import asyncio, sys
sys.path.insert(0,'/home/claude/game')
from playwright.async_api import async_playwright
from t_v6 import bis, tap, OUT
async def main():
    jobs=eval(sys.argv[1])
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1000)
        for lab,cond,name,w,nach in jobs:
            if lab: await pg.evaluate(f"Spiel._debug.neustart('{lab}')"); await pg.wait_for_timeout(800)
            await bis(pg,cond,name,wahl=w,nach=nach)
        print('FEHLER:', errs[:15]); await b.close()
asyncio.run(main())
