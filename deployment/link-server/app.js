const socket = require('socket.io')
const puppeteer = require('puppeteer')
const bcrypt = require('bcrypt')
const express = require('express')
const config = require('./config.json')
const messages = require('./messages.json')
const PORT = 5001
const app = express()
const { startLinkServer } = require('./link-server')
server = app.listen(PORT, function () {
    console.log(`Listening on port ${server.address().port}`)
})

app.use(express.static('public'))
app.use(express.json())
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

app.get('/', (req, res) => {
    res.end('Hello')
})

app.get('/token', (req, res) => {
    const key = config.authKey
    bcrypt.hash(key, 10, function (err, hash) {
        console.log(hash)
        res.status(200).send(messages['infoTokenGenerated'])
    })
})

app.use('/pdf', (req, res, next) => {
    const token = req?.body?.['token']
    if (token) {
        bcrypt.compare(config.authKey, token, (err, value) => {
            if (!value) {
                req.body['template'] = '<div>Invalid token</div>'
                console.log(messages['errInvalidToken'])
            }
            next()
        })
    } else {
        req.body['template'] = '<div>Invalid token</div>'
        console.log(messages['errInvalidToken'])
        next()
    }
})

app.post('/pdf', async (req, res) => {
    const template = req.body['template']
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle0' })
    const buff = await page.pdf({
        format: 'a4',
        margin: { left: '30px', top: '50px', bottom: '50px', right: '30px' }
    })
    res.json(buff)
    await page.close()
    await browser.close()
})

const io = socket(server)
startLinkServer(io)

app.use((err, req, res, next) => {
    if (!res.headersSent) {
        res.status(422).send(err.message)
    }
    console.log(err.message)
    logger.doLog('error', err.message, { place: messages.errApp })
})
