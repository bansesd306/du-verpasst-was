const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, modus, ...rest] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('probe.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  if (modus === 'still') {
    for (const t of rest) { await p.evaluate(t => render(t), +t); await p.screenshot({ path: `still_${t}.jpg`, quality: 80, type: 'jpeg' }); }
  } else {
    const fps = 30, dauer = +rest[0];
    for (let i = 0; i < dauer * fps; i++) { await p.evaluate(t => render(t), i / fps); await p.screenshot({ path: `f/${String(i).padStart(4, '0')}.jpg`, quality: 90, type: 'jpeg' }); }
  }
  await b.close();
})();
