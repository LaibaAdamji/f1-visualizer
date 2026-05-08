const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const host = process.env.DEV_HOST || 'http://localhost:5175';
  const routes = ['/', '/drivers', '/teams', '/races', '/standings'];

  for (const r of routes) {
    const url = `${host}${r}`;
    console.log('Capturing', url);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const name = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_');
    const outPath = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('Saved', outPath);
  }

  await browser.close();
  console.log('All screenshots saved to', outDir);
})();
