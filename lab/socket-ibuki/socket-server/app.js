const socket = require('socket.io')
const express = require('express')
const PORT = 5000
const app = express()
const {useSocket} = require('./socket')
server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static('public'))

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('cache-control', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, A' +
        'ccess-Control-Allow-Origin,x-access-token')
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

const io = socket(server)
useSocket(io)

app.use((err, req, res, next) => {
    if(!(res.headersSent)){
        res.status(422).send(err.message)
    }
    console.log(err.message)
    logger.doLog('error', err.message, { place: messages.errApp })
})