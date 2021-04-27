const odbc = require('odbc')
const { sqls } = require('./mock-sql')
const connString = 'DSN=capi2021'
// odbcConnect()

async function odbcConnect(queryKey, params) {
    try {
        const conn = await odbc.connect(connString)
        // const data = await conn.query(sqls['track-sale-sms'],['2021-04-02'])
        const data = await conn.query(sqls[queryKey],params)
        console.log(data)
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = { odbcConnect }
