const express = require('express')
const { usingLinkClient } = require('./link-client')
const PORT = 5002
const app = express()

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})
const { getLink, ibukiFilterOn, onReceiveDataFromPoint } = usingLinkClient()

getLink('http://localhost:5001', 'node-client1').subscribe((link) => {
    ibukiFilterOn('REACT-APP1-MESSAGE').subscribe((d) => {
        console.log(d)
    })

    onReceiveDataFromPoint().subscribe((d) => {
        console.log(d)
    })
})

// Static files
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.end('Hello')
})
