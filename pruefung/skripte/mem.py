import asyncio, subprocess
from playwright.async_api import async_playwright
def rss():
    out=subprocess.run("ps -eo rss,args | grep -i 'type=renderer' | grep -v grep",shell=True,capture_output=True,text=True).stdout
    return sum(int(l.split()[0]) for l in out.splitlines() if l.strip())//1024
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':720})
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(1500)
        print('vor Klick MB',rss())
        await pg.mouse.click(640,360)
        for i in range(6):
            await pg.wait_for_timeout(5000); print(f'{(i+1)*5}s nach Klick MB',rss())
        n=await pg.evaluate("typeof Ton!=='undefined' && Ton._debug ? 1:0"); 
        await b.close()
asyncio.run(main())
