const express = require('express')
const { usingZestClient } = require('./zest-client')
const PORT = 5001
const app = express()

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})
const {initLink, ibukiFilterOn, onReceiveDataFromPoint} = usingZestClient()

initLink('http://localhost:5000', 'node-client1')

ibukiFilterOn('REACT-APP1-MESSAGE').subscribe((d) => {
    console.log(d)
})

onReceiveDataFromPoint().subscribe((d) => {
    console.log(d)
})

// Static files
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.end('Hello')
})

// socketFilterOn('REACT-APP-MESSAGE1').subscribe((d)=>{
//     console.log(d)
// })

// socket.ibukiFilterOn('REACT-APP-MESSAGE1', (data) => {
//     console.log(data)
// })

// socket.onReceiveFromPoint((message, data) => {
//     console.log(message, ' ', data)
// })
