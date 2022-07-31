const puppeteer = require('puppeteer')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const handlebars = require('express-handlebars')

const app = express()
app.use(cors())
app.set('view engine', 'handlebars')
app.engine(
    'handlebars',
    handlebars.engine({
        layoutsDir: __dirname + '/views/layouts'
    })
);

app.get('/', (req, res) => {
    res.render('main', { layout: 'index' })
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

app.get('/pdf1', async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('http://localhost:8081',  {waitUntil: 'networkidle2',})
    const buff = await page.pdf({format: 'a4' })
    res.end(buff)
    browser.close()
    page.close()
})

const server = app.listen(8081, () => {
    const port = server.address().port
    const host = server.address().address
    console.log(`Server lstening at host: ${host}, port:${port}`)
})

//(async () => {
// const browser = await puppeteer.launch()
// const page = await browser.newPage()
//     await page.goto('https://netwoven.com', {
//         waitUntil: 'networkidle2',
//     })
//     await page.pdf({ path: 'hn.pdf', format: 'a4' })

//     await browser.close()
// })()
