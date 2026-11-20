import asyncio, sys
from playwright.async_api import async_playwright
OUT='/tmp/shots/'
async def tap(pg): await pg.evaluate("Spiel._debug.tippen()")
async def state(pg):
    return await pg.evaluate("""()=>({b:[...document.querySelectorAll('#wahl button')].map(x=>x.textContent), t:document.querySelector('#text').textContent})""")
async def bis(pg, cond, name, maxs=60, wahl=None, nach=0):
    """tippt weiter, bis cond (JS) wahr ist, dann Screenshot"""
    wahl=list(wahl or [])
    for i in range(maxs*5):
        if await pg.evaluate(cond):
            await pg.wait_for_timeout(nach); await pg.screenshot(path=OUT+name+'.png'); return True
        st=await state(pg)
        if st['b']:
            w=wahl.pop(0) if wahl else st['b'][0]
            idx=st['b'].index(w) if w in st['b'] else 0
            await pg.evaluate(f"document.querySelectorAll('#wahl button')[{idx}].click()")
        else: await tap(pg)
        await pg.wait_for_timeout(200)
    print('NICHT ERREICHT', name); await pg.screenshot(path=OUT+name+'_FEHL.png'); return False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and '404' not in m.text else None)
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        await pg.mouse.click(640,360); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelector('#z-menue .spielen').click()")
        await pg.wait_for_timeout(3500); await pg.screenshot(path=OUT+'01_vorspann_3s.png')
        await pg.wait_for_timeout(5000); await pg.screenshot(path=OUT+'02_karte_8s.png')
        await pg.wait_for_timeout(2500); await pg.screenshot(path=OUT+'03_karte_countdown.png')
        await tap(pg); await pg.wait_for_timeout(3000); await pg.screenshot(path=OUT+'04_prolog.png')
        await bis(pg, "document.querySelector('#klausur').classList.contains('an')", '05_klausur', nach=2600)
        await bis(pg, "document.querySelector('#text').textContent.includes('Zehn Minuten')", '06_zehnminuten', nach=1500)
        jobs=[('L2',"document.querySelector('#karteikarten .kk')",'07_karteikarten',[],600),
              ('S2_SCHLUMMER',"document.querySelectorAll('.n-liste div').length>=3",'08_notizen',[],1500),
              ('S3_SCHLUMMER',"document.querySelector('[data-app=karussell]') && document.querySelector('[data-app=karussell]').classList.contains('an')",'09_karussell',[],600),
              ('S4_ANTWORT',"document.querySelector('.c-eingabe .txt') && document.querySelector('.c-eingabe .txt').textContent.length>8",'10_antwort',[],1800),
              ('A_OHNEFLOW',"document.querySelector('#text').textContent.includes('leiht')",'11_tippfehler',[],2200),
              ('PARTY_ANKUNFT',"document.querySelector('#schwarz').classList.contains('schnell')",'12_umarmung',[],0),
              ('PARTY_ANKUNFT',"document.querySelector('#wahl button')",'13_wahl',[],300),
              ('KUECHE',"document.querySelector('.funken')",'14_funken',['Küche.'],800),
              ('BAD_WEG',"document.querySelector('#zuruf').classList.contains('an')",'15_zuruf',[],250),
              ('SO',"document.querySelector('#lernplan').classList.contains('an') && document.querySelectorAll('#lernplan li.ok').length>=2",'16_lernplan',[],500),
              ('B05TEST',None,None,[],0)]
        for lab,cond,name,w,nach in jobs:
            if not cond: continue
            await pg.evaluate(f"Spiel._debug.neustart('{lab}')"); await pg.wait_for_timeout(800)
            await bis(pg,cond,name,wahl=w,nach=nach)
        print('FEHLER:', errs[:15])
        await b.close()
if __name__=="__main__": asyncio.run(main())
