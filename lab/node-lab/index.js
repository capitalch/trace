const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname,'public')))
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('cache-control', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, A' +
            'ccess-Control-Allow-Origin,x-access-token'
    )
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

const PORT = 5002
server = app.listen(PORT, function () {
    console.log(`Listening on port ${server.address().port}`)
})

let browser
(async () => {
    browser = await puppeteer.launch()
})()

async function pup () {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    // const html = await fs.readFileAsync(`${__dirname}/public/template2.html`, 'utf8')
    const html = await fs.promises.readFile(path.join(__dirname,'public','template2.html'), 'utf8')
    
    await page.setContent(html, {
        waitUntil: 'domcontentloaded'
    })
    await page.addStyleTag({path:'public/style.scss'})
    const pdf = await page.pdf({ format: 'A4', path: 'abc.pdf', printBackground: true,  })    
    await browser.close()
    return pdf
}
// pup()

app.get('/', async (req, res) => {
    const pdf = await pup()
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
	res.send(pdf)
    // res.end('Hello')
})

app.get('/invoice', async(req,res)=>{
    const file = path.join(__dirname,'public', 'template2.html')
    res.sendFile(file)
})

app.use((err, req, res, next) => {
    if (!res.headersSent) {
        res.status(422).send(err.message)
    }
    console.log(err.message)
    logger.doLog('error', err.message, { place: messages.errApp })
})




// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.geeksforgeeks.org/');
//     await page.screenshot({ path: 'GFG.png' });
//     await browser.close();
// })();

// server.listen(3000, async (err) => {
//     console.log('server listening at port 3001')
// })

// const startDate = Date.now()
// let endDate
