import odbc from 'odbc'
import { sqls } from './sqls'
// const isElectron = require('is-electron')

function useSqlAnywhere() {
    const connString = 'DSN=capi2021'
    async function execSql(queryKey: string, params: string[]) {
        try {
            const conn = await odbc.connect(connString)
            const data = await conn.query(sqls[queryKey], params)
            return data
        } catch (e) {
            console.log(e.message)
        }
    }

    return { execSql }
}
export { useSqlAnywhere }

