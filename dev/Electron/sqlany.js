let sqlAny = require('sqlanywhere')

let conn = sqlAny.createConnection()
let connParams = {
    EngineName: 'server',
    CommLinks: 'tcpip',
    UserId: 'DBA',
    Password: 'sql',
    DatabaseName: 'service'
}
conn.connect(connParams,(err)=>{
    if(err) throw err
    conn.exec('select * from company_master', (error, rows)=>{
        if(error)
            throw error;
        console.log('rows:', rows);
    })
})
console.log('Point 1');