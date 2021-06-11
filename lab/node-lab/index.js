const http = require('http')

const server = http.createServer((req, res) => {
  res.end('hello')
})

server.listen(3000, async err => {
  console.log('server listening at port 3001')
})
