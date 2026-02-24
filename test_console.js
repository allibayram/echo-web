import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching puppeteer...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));

    console.log('Navigating to http://localhost:5173/');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Navigating to http://localhost:5173/agent');
    await page.goto('http://localhost:5173/agent', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Ekran gormemiz icin elementleri listele
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 100));
    console.log("Body text sample on /agent:", bodyText);

    console.log('Navigating to http://localhost:5173/lot/51');
    await page.goto('http://localhost:5173/lot/51', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
    console.log("Finished.");
})();
