import asyncio, sys, json, random
from playwright.async_api import async_playwright
VERBOTEN=['Umdrehen','„Doch bleiben.“','Doch bleiben.','Löschen.']
SZ={
 'A1_flow_zuhause':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Lynn schreiben.','Löschen.','Lynn schreiben.','Senden.','Schlafen.','Nachschauen.','was war mit dem feuerlöscher?? 😂','Anschauen.','Phänomenal.','Senden.','Liegen lassen.'],
 'A2_flow_handyweg':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Handy weg.','Liegen bleiben.','Nichts schreiben.','Nicht.','Scheiße.','Senden.','Liegen lassen.'],
 'A3_ohneflow_zuhause':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Kurz aufs Handy.','Kurz schauen.','Weiter.','Ablehnen.','Nein. Bleiben.','Licht aus.','Nachschauen.','was war mit dem feuerlöscher?? 😂','Anschauen.','Scheiße.','Senden.','Umdrehen.'],
 'A4_fenster_jacke':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Kurz schauen.','Kurz Fenster auf.','Jacke holen.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Küche.','Balkon.','Ignorieren.','Nur kurz schauen.','Handy weg. Zurück zu den anderen.','Ich muss echt nach Hause.','Handy weglegen.','Scheiße.','Senden.','Liegen lassen.'],
 'A5_anruf_hin':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Kurz schauen.','Kurz Fenster auf.','Fenster zu.','Rangehen.','Hingehen.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Balkon.','Ignorieren.','Ignorieren.','Draufschauen.','Okay. Ich komm mit.','Phänomenal.','Senden.','Liegen lassen.'],
 'A6_spaet_heim':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Lynn schreiben.','Senden.','Trotzdem hin.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Nach Hause.','Weiterscrollen.','Anschauen.','Phänomenal.','Senden.','Liegen lassen.'],
 'B1_bleiben_senden':['Weiß noch nicht… mal schauen','Senden.','Noch fünf Minuten.','Noch fünf Minuten.','Antworten.','Senden.','Noch fünf Minuten.','Hierbleiben.','Noch fünf Minuten.','Liegen bleiben.','Nichts schreiben.','Nicht.','Beschissen.','Senden.','Liegen lassen.'],
 'B2_bleiben_loeschen':['Weiß noch nicht… mal schauen','Senden.','Noch fünf Minuten.','Noch fünf Minuten.','Antworten.','Löschen.','Noch fünf Minuten.','Hierbleiben.','Noch fünf Minuten.','Nachschauen.','Nichts schreiben.','Anschauen.','Scheiße.','Senden.','Liegen lassen.'],
 'B3_bleiben_spaeter':['Weiß noch nicht… mal schauen','Senden.','Noch fünf Minuten.','Noch fünf Minuten.','Später.','Noch fünf Minuten.','Hierbleiben.','Noch fünf Minuten.','Liegen bleiben.','Nichts schreiben.','Nicht.','Beschissen.','Senden.','Liegen lassen.'],
 'B4_frueh_hin':['Weiß noch nicht… mal schauen','Senden.','Aufstehen und lernen.','Weiter.','Okay. Ich geh doch.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Balkon.','Nur kurz schauen.','Tanzfläche.','Mittanzen.','Handy weg. Zurück zu den anderen.','Ich muss echt nach Hause.','Handy weglegen.','Scheiße.','Senden.','Liegen lassen.'],
 'B5_s4_hin':['Weiß noch nicht… mal schauen','Senden.','Noch fünf Minuten.','Noch fünf Minuten.','Antworten.','Senden.','Okay. Ich geh doch.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Küche.','Balkon.','Ignorieren.','Nur kurz schauen.','Handy weg. Zurück zu den anderen.','Ich muss echt nach Hause.','Handy weglegen.','Scheiße.','Senden.','Liegen lassen.'],
 'S1_spaet_heim':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Lynn schreiben.','Senden.','Trotzdem hin.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Nach Hause.','Weiterscrollen.','Anschauen.','Scheiße.','Senden.','Liegen lassen.'],
 'S2_spaet_bleiben':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Jetzt noch hin.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Noch bleiben.','Handy weglegen.','Anschauen.','Phänomenal.','Senden.','Liegen lassen.'],
 'S3_spaet_tim':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Kurz aufs Handy.','Kurz schauen.','Weiter.','Ablehnen.','Nein. Bleiben.','Jetzt noch hin.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Mit zu Tim.','Anschauen.','Phänomenal.','Senden.','Liegen lassen.'],
 'S4_spaet_umdrehen':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Kurz schauen.','Weiter.','Rangehen.','Hingehen.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Umdrehen','Nach Hause.','Liegen bleiben.','Nichts schreiben.','Nicht.','Scheiße.','Senden.','Liegen lassen.'],
 'S5_spaet_umdrehen_flow':['Nee, ich glaub ich bin raus. Muss echt noch lernen 😕','Senden.','Nein.','Weiter.','Weiter.','Jetzt noch hin.','Licht aus. Gehen.','Nach vorne gehen','Umdrehen','Nach Hause.','Liegen bleiben.','Nichts schreiben.','Nicht.','Scheiße.','Senden.','Liegen lassen.'],
 'C1_kueche_balkon_mit':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Küche.','Balkon.','Nur kurz schauen.','Story posten: Beste Party 🎉','Okay. Ich komm mit.','Phänomenal.','Senden.','Liegen lassen.'],
 'C2_gluecklich':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Tanzfläche.','Mittanzen.','Balkon.','Ignorieren.','Ignorieren.','Stecken lassen.','Gute Nacht sagen.','Gute Nacht sagen.','Lynn, willst du mich heiraten?','Handy weglegen.','Anschauen.','Scheiße.','Senden.','Liegen lassen.'],
 'C3_balkon_kueche_schaumal':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Balkon.','Ignorieren.','Nur kurz schauen.','Küche.','Schauen, wer gerade wo ist.','Vielleicht … ich schau mal.','Nein. Jetzt geh ich wirklich …','Beschissen.','Senden.','Liegen lassen.'],
 'C4_bad_handyweg':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Küche.','Tanzfläche.','Zurück an den Rand.','Handy weg. Zurück zu den anderen.','Nur kurz auf den Balkon.','Weiterscrollen.','Nicht.','Phänomenal.','Senden.','Liegen lassen.'],
 'C5_umdrehen_bett':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Umdrehen','Nach Hause.','Aufs Bett.','Okay. Ich geh doch.','Nach vorne gehen','Nach vorne gehen','Nach vorne gehen','Küche.','Tanzfläche.','Zurück an den Rand.','Story posten: Beste Party 🎉','Gehen.','Weiterscrollen.','Anschauen.','Phänomenal.','Senden.','Liegen lassen.'],
 'C6_doch_bleiben':['Okay. Ich komm!','Senden.','Doch bleiben.','Hinsetzen.','Kurz schauen.','Kurz Fenster auf.','Fenster zu.','Rangehen.','Nein. Bleiben.','Licht aus.','Nachschauen.','was war mit dem feuerlöscher?? 😂','Anschauen.','Scheiße.','Senden.','Liegen lassen.'],
'C7_umdrehen_doch_hin':['Okay. Ich komm!','Senden.','Licht aus. Gehen.','Nach vorne gehen','Nach vorne gehen','Umdrehen','Doch hin.','Nach vorne gehen','Küche.','Tanzfläche.','Mittanzen.','Balkon.','Ignorieren.','Nur kurz schauen.','Handy weg. Zurück zu den anderen.','Ich muss echt nach Hause.','Handy weglegen.','Scheiße.','Senden.','Liegen lassen.'],
}
async def spiel(pg, name, prefs):
    prefs=list(prefs); rnd=random.Random(7); log=[]
    await pg.evaluate("Spiel._debug.setSchnell(true)")
    await pg.evaluate("Spiel._debug.neustart()"); await pg.evaluate("Spiel._debug.nullTexte()")
    t=0
    while t<6000:
        t+=1
        st = await pg.evaluate("""()=>{const s=[...document.querySelectorAll('.schirm.an, #zimmer.an .schirm2.an')].map(x=>x.id);const b=[...document.querySelectorAll('#wahl button')].map(x=>x.textContent);return {s,b}}""")
        if 'z-s-abz' in st['s']:
            r=await pg.evaluate("({vz:Math.round(Spiel._debug.vz), texte:Spiel._debug.textZahl, typ:Spiel.V.typ, ankunft:Spiel.V.ankunft, lynn:Spiel.V.lynn, pfad:Spiel.pfad.join(' → ')})"); r['wahlen']=len(log); r['log']=log
            r['rest']=prefs; return r
        if st['s']:
            await pg.evaluate("()=>{const s=document.querySelector('.schirm.an button, #zimmer.an .schirm2.an button'); if(s) s.click();}")
            await pg.wait_for_timeout(300)
        elif st['b']:
            opts=st['b']; i=None
            if prefs and prefs[0] in opts: i=opts.index(prefs.pop(0))
            if i is None:
                ok=[k for k,o in enumerate(opts) if o not in VERBOTEN]
                i=rnd.choice(ok) if ok else 0
            log.append(opts[i])
            await pg.evaluate(f"document.querySelectorAll('#wahl button')[{i}].click()")
            await pg.wait_for_timeout(60)
        else:
            await pg.evaluate("Spiel._debug.tippen()")
        await pg.wait_for_timeout(20)
    return {'pfad':'TIMEOUT', 'akt':await pg.evaluate("JSON.stringify(Spiel._debug.aktuell)"), 'log':log}
async def lauf(b, namen, out):
    pg = await b.new_page(viewport={'width':1280,'height':720})
    logs=[]
    pg.on('pageerror', lambda e: logs.append(f'PAGEERROR: {e}'))
    pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') and '404' not in m.text else None)
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(400)
    await pg.mouse.click(640,360); await pg.wait_for_timeout(300); await pg.evaluate("document.querySelector('#z-menue .spielen').click()"); await pg.wait_for_timeout(1500)
    for n in namen:
        r=await spiel(pg,n,SZ[n]); out.append((n,r)); print(n, r, flush=True)
    out.append(('_vis', await pg.evaluate("[...Spiel._debug.besuchtL]")))
    out.append(('_err', await pg.evaluate("Spiel._debug.fehlerLog")+logs[:10]))
async def main():
    sel=sys.argv[1:] or list(SZ)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        import os; out=[]; k=int(os.environ.get("K","3"))
        grp=[sel[i::k] for i in range(k)]
        await asyncio.gather(*[lauf(b,g,out) for g in grp if g])
        vis=set(); 
        for n,r in out:
            if n=='_vis': vis|=set(r)
            if n=='_err' and r: print('FEHLER',r)
        pg=await b.new_page(); await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(300)
        alle=set(await pg.evaluate("Object.keys(Spiel.labels)"))
        print('NICHT BESUCHT:', sorted(alle-vis))
        await b.close()
asyncio.run(main())
