const puppeteer = require('puppeteer')
const express = require('express')
const fs = require('fs')

const app = express()
//(async () => {
// const browser = await puppeteer.launch()
// const page = await browser.newPage()
//     await page.goto('https://netwoven.com', {
//         waitUntil: 'networkidle2',
//     })
//     await page.pdf({ path: 'hn.pdf', format: 'a4' })

//     await browser.close()
// })()

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/pdf', async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const fileBuffer = fs.readFile('./x.pdf', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.end(data)
        }
    })
    browser.close()
    page.close()
})

const server = app.listen(8081, () => {
    const port = server.address().port
    const host = server.address().address
    console.log(`Server lstening at host: ${host}, port:${port}`)
})
