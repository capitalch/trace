// const odbc = require('odbc')
const { sqls } = require('./mock-sql')
const connString = 'DSN=capi2021'
// odbcConnect()

// async function odbcConnect(queryKey, params) {
//     let conn = null
//     try {
//         const conn = await odbc.connect(connString)        
//         const data = await conn.query(sqls[queryKey], params)
//         return (data)
//         // console.log('ok')
//     } catch (e) {
//         console.log(e.message)
//     } finally {
//         conn && conn.close()
//     }
// }

// module.exports = { odbcConnect }
