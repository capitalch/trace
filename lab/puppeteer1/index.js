const puppeteer = require('puppeteer');
// const fs = require('fs')

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://netwoven.com', {
      waitUntil: 'networkidle2',
    });
    await page.pdf({path: 'hn.pdf', format: 'a4'});
  
    await browser.close();
  })();
