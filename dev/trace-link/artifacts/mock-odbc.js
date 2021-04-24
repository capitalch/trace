const odbc = require('odbc')
const connString = 'DSN=capi2021'
// odbcConnect()

async function odbcConnect () {
  try {
    const conn = await odbc.connect(connString)
    console.log('Successfully connected')
    const data = await conn.query('select * from bill_memo')
    console.log(data)
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {odbcConnect}
