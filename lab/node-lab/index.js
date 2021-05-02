const odbc = require('odbc')
const http = require('http')
const { doConnection } = require('./db-query')

const server = http.createServer((req, res) => {
  res.end('hello')
})

server.listen(3001, async err => {
  console.log('server listening at port 3001')
  await doConnection()
})
