const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
    res.end('hello')
})

async function pup() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const html = fs.readFileSync(`${__dirname}/template3.html`, 'utf8')
    await page.setContent(html, {
        waitUntil: 'domcontentloaded'
      })
    // await page.goto('https://blog.risingstack.com', {
    //     waitUntil: 'networkidle0',
    // })
    const pdf = await page.pdf({ format: 'A4', path:'abc.pdf' })
    await browser.close()
}
pup()

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.geeksforgeeks.org/');
//     await page.screenshot({ path: 'GFG.png' });
//     await browser.close();
// })();

server.listen(3000, async (err) => {
    console.log('server listening at port 3001')
})


// const startDate = Date.now()
// let endDate