// import odbc from 'odbc'
import { sqls } from './sqls'
import isElectron from 'is-electron'
let odbc: any
if(isElectron()){
    odbc = window.require('odbc')
    console.log('odbc loaded')
}

function useSqlAnywhere(databaseName: string) {
    async function execSql(queryKey: string, params: string[]) {
        let conn: any = null
        try {
            const connString = `DSN=${databaseName}`
            let data = undefined
            if(isElectron()){
                conn = await odbc.connect(connString)
                data = await conn.query(sqls[queryKey], params)
            }
            
            return data
        } catch (e) {
            throw e
        } finally {
            conn && conn.close()
        }
    }

    return { execSql }
}
export { useSqlAnywhere }

// const win: any = window
// const config = win.config
// const databaseName = config['database']
