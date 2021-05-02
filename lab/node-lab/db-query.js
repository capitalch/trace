const odbc = require('odbc')

async function doConnection () {
  try {
    const connString = 'DSN=capi2021'
    try {
    const conn = await odbc.connect(connString)
    const sql1 = 'select * from acc_main'
    const ret = await conn.query(sql1)
    // console.log(ret)
    } catch(e){
        console.log(e.message)
    } finally{
        console.log('finally block')
    }
    
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = { doConnection }
