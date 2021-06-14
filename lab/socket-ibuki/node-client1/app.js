const express = require('express')
const PORT = 5001
const app = express()
app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})

const { initSocket } = require('./socket')
const socket = initSocket('', 'node-client1')
socket.ibukiFilterOn('REACT-APP-MESSAGE1', (data) => {
    console.log(data)
})

socket.onReceiveFromPoint((message, data) => {
    console.log(message, ' ', data)
})

// Static files
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.end('Hello')
})

// socketFilterOn('REACT-APP-MESSAGE1').subscribe((d)=>{
//     console.log(d)
// })
