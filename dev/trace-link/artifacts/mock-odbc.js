const odbc = require('odbc')
const { sqls } = require('./mock-sql')
const connString = 'DSN=capi2021'
// odbcConnect()

async function odbcConnect() {
    try {
        const conn = await odbc.connect(connString)
        console.log('Successfully connected')
        const data = await conn.query(sqls['track-sale-sms'],['2021-04-02'])
        console.log(data)
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = { odbcConnect }
