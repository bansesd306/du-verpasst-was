# Alle Szenen im Sprungmenü (⏭) anspringen, je Weg, kurz weiterspielen: JS-Fehler, Hänger, fehlende Ziele finden.
import asyncio, sys, json, random, os
from playwright.async_api import async_playwright
SCHRITTE = int(os.environ.get('N', '60'))
async def teste(pg, weg, l):
    logs = []
    h = lambda e: logs.append(f'PAGEERROR: {e}'); pg.on('pageerror', h)
    await pg.evaluate(f"Spiel._debug.setSchnell(true); Sprung.springen({json.dumps(l)}, {json.dumps(weg)})"); await pg.wait_for_timeout(300)
    rnd = random.Random(l); start = await pg.evaluate("Spiel._debug.aktuell ? Spiel._debug.aktuell.nr : -1"); stand = 0; alt = start
    for i in range(SCHRITTE):
        st = await pg.evaluate("""()=>({s:[...document.querySelectorAll('.schirm.an')].map(x=>x.id), b:document.querySelectorAll('#wahl button').length, nr:Spiel._debug.aktuell?Spiel._debug.aktuell.nr:-1, t:[...document.querySelectorAll('.toast,#toast')].map(x=>x.textContent).join(' ')})""")
        if 'Sprungziel' in st['t']: logs.append('TOAST ' + st['t'][:80]); break
        if st['s']: break
        if st['b']: await pg.evaluate(f"document.querySelectorAll('#wahl button')[{rnd.randrange(st['b'])}].click()")
        else: await pg.evaluate("Spiel._debug.tippen()")
        await pg.wait_for_timeout(120)
        stand = stand + 1 if st['nr'] == alt else 0; alt = st['nr']
        if stand > 40: logs.append(f'HAENGT bei Zeile {st["nr"]+1}'); break
    pg.remove_listener('pageerror', h)
    fl = await pg.evaluate("Spiel._debug.fehlerLog.splice(0)")
    return logs + [str(x) for x in fl]
async def lauf(b, w, ergebnis):
    pg = await b.new_page(viewport={'width': 1280, 'height': 720})
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(400)
    await pg.mouse.click(640, 360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
    szenen = await pg.evaluate("Sprung.kapitel.flatMap(k=>k.abs.flatMap(a=>a.szenen))")
    for i, l in enumerate(szenen):
        f = await teste(pg, w, l)
        if f: ergebnis.append((w, l, f[:3])); print('FEHLER', w, l, f[:3], flush=True)
        if i % 30 == 0: print(w, i, '/', len(szenen), flush=True)
async def main():
    wege = sys.argv[1:] or ['Zuhause A', 'Zuhause B', 'Party', 'Lynn glücklich', 'Afterparty']
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
        e = []; await asyncio.gather(*[lauf(b, w, e) for w in wege])
        print('fertig, Fehler:', len(e)); await b.close()
asyncio.run(main())
