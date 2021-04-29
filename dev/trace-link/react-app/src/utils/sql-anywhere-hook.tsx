// import odbc from 'odbc'
import { sqls } from './sqls'
// const isElectron = require('is-electron')

function useSqlAnywhere() {
    async function execSql(
        queryKey: string,
        params: string[],
        databaseName = 'capi2021'
    ) {
        // const connString = 'DSN=capi2021'
        let conn: any = null
        try {
            const connString = `DSN=${databaseName}`
            const odbc = window.require('odbc')
            const conn = await odbc.connect(connString)
            const data = await conn.query(sqls[queryKey], params)
            return data
        } catch (e) {
            console.log(e.message)
        } finally {
            conn && conn.close()
        }
    }

    return { execSql }
}
export { useSqlAnywhere }
