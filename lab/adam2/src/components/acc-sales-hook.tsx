import { _, Box, Button, FormControlLabel, MegaDataContext, moment, Radio, salesMegaData, TextField, Typography, useContext, useEffect, useState, useTheme } from './redirect'

function useAccSales() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const isoDateFormat = 'YYYY-MM-DD'
    let sales = megaData.accounts.sales

    useEffect(() => {
        // initSalesMegaData()
        // setRefresh({})
    }, [])

    function resetSales() {
        Object.assign(megaData.accounts.sales, salesMegaData)
        setRefresh({})
    }

    return ({resetSales})
}
export { useAccSales }