
const {doAllTransfers} = require('./artifacts/utils')
const http = require('http')

const server = http.createServer((req, res) => {
    res.end('hello')
})

server.listen(3001, async (err) => {
    console.log('server listening at port 3001')
    const sourceConnString = 'DSN=capi2020'
    const destConnString = 'DSN=capi2021'
    // const destConnString = 'DSN=Acc'
    await doAllTransfers(sourceConnString, destConnString)
    console.log('Inventory transfer is done successfully')
    console.log('Precss CTRL-C to come out of process')
})