import asyncio
from playwright.async_api import async_playwright
SZ=[('K1',8),('BALKON',4),('MONTAG',3),('ENDE_LYNN',3)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for vw,vh,tag in [(844,390,'quer'),(390,844,'hoch')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh},is_mobile=True,has_touch=True,device_scale_factor=1)
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f'm_{tag}_start.png')
            await pg.mouse.click(vw//2,vh//2); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'm_{tag}_menue.png')
            await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
            for lab,n in SZ:
                await pg.evaluate(f"Spiel._debug.neustart('{lab}')"); await pg.evaluate("Object.assign(Spiel.V,{typ:'gluecklich'})")
                for i in range(n):
                    await pg.wait_for_timeout(1600); await pg.evaluate("Spiel._debug.tippen()")
                await pg.wait_for_timeout(1800)
                await pg.screenshot(path=f'm_{tag}_{lab}.png')
            await pg.close()
        await b.close()
asyncio.run(main())
