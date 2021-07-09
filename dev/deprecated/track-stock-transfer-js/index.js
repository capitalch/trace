const { doAllTransfers } = require('./artifacts/utils')
const http = require('http')

const server = http.createServer((req, res) => {
    res.end('hello')
})

server.listen(3000, async (err) => {
    console.log('server listening at port 3000')
    const sourceConnString = 'DSN=capi2020'
    const destConnString = 'DSN=capi2021'
    const startTime = Date.now()
    await doAllTransfers(sourceConnString, destConnString)
    const endTime = Date.now()
    console.log('Time taken=', (endTime - startTime) / 60000)
    console.log('Inventory transfer is done successfully')
    console.log('Precss CTRL-C to come out of process')
})
