# Szene in Echtzeit durchklicken und jede Station knipsen: python3 t_film.py LABEL '{"typ":"zuhause"}' MAXSCHRITTE PREFIX [ENDBILD] [WAHLINDEX]
import asyncio, sys, json
from playwright.async_api import async_playwright
LABEL=sys.argv[1]; V=json.loads(sys.argv[2]); MAX=int(sys.argv[3]); PRE=sys.argv[4]; ENDE=sys.argv[5] if len(sys.argv)>5 else ''
WAHL=int(sys.argv[6]) if len(sys.argv)>6 else 0
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and '404' not in m.text else None)
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
        await pg.evaluate(f"Spiel._debug.neustart('{LABEL}', V => Object.assign(V, {json.dumps(V)}))"); await pg.wait_for_timeout(80)
        letzte=None
        for i in range(MAX):
            await pg.wait_for_timeout(1700)
            st=await pg.evaluate("""()=>({img:[...document.querySelectorAll('#welt .ebene.an img')].map(i=>i.getAttribute('src')).join(' '),
               t:(document.querySelector('#textbox.an')||{}).textContent||'', b:[...document.querySelectorAll('#wahl button')].map(x=>x.textContent),
               akt:JSON.stringify(Spiel._debug.aktuell||'').slice(0,90), abz:!!document.querySelector('.schirm.an, #zimmer.an .schirm2.an')})""")
            await pg.screenshot(path=f'{PRE}_{i:02d}.png')
            print(i, st['img'][-28:], '|', st['t'][:70].replace('\n',' '), '|', st['b'], '|', st['akt'], flush=True)
            if ENDE and ENDE in st['img']: break
            if st['abz']: break
            if st['b']:
                k=min(WAHL,len(st['b'])-1); await pg.evaluate(f"document.querySelectorAll('#wahl button')[{k}].click()")
            else: await pg.evaluate("Spiel._debug.tippen()")
        print('ERR', errs[:6])
        await b.close()
asyncio.run(main())
