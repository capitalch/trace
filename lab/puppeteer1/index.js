const puppeteer = require('puppeteer')
const express = require('express')
const cors = require('cors')
const ejs = require('ejs')
const fs = require('fs')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const app = express()
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home', { body: 'xxx', name: 'Sushant' })
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
    const template = fs.readFileSync('./views/home.ejs', 'utf-8')
    const html = ejs.render(template, { name: 'Sushant' })

    ejs.renderFile(
        './views/home.ejs',
        { name: 'Sushant1' },
        async (err, html) => {
            if (err) {
                console.log(err)
            } else {
                const browser = await puppeteer.launch()
                const page = await browser.newPage()

                await page.setContent(html, { waitUntil: 'networkidle0' })
                const buff = await page.pdf({
                    format: 'a4',
                    margin: { left: '30px', top: '50px' }
                })
                res.end(buff)
                await page.close()
            }
        }
    )
})

app.post('/pdf1', async (req, res) => {
    const template = req.body['template']
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle0' })
    const buff = await page.pdf({
        format: 'a4',
        margin: { left: '30px', top: '50px', bottom:'50px', right: '30px' }
    })
    res.json(buff)
    await page.close()
    await browser.close()
})

const server = app.listen(8081, () => {
    const port = server.address().port
    const host = server.address().address
    console.log(`Server lstening at host: ${host}, port:${port}`)
})
