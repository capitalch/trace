import { _, Box, Button, FormControlLabel, MegaDataContext, moment, Radio, TextField, Typography, useContext, useEffect, useState, useTheme } from './redirect'

function useAccSales() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const isoDateFormat = 'YYYY-MM-DD'
    const sales = megaData.accounts.sales

    useEffect(() => {
        initSalesMegaData()
    }, [])

    // function handleTextChanged( propName: string, e: any) {
    //     sales[propName] = e.target.value
    //     setRefresh({})
    // }

    // function handleSalesReset() {
    //     initSalesMegaData(true)
    // }

    function initSalesMegaData(isForced: boolean = false) {

        if (_.isEmpty(sales) || isForced) {
            setSalesMegaData(sales)
            setRefresh({})
        }

        function setSalesMegaData(sales: any) {
            const salesObj = {
                autoRefNo: undefined,
                billTo: {},
                commonRemarks: undefined,
                gstin: undefined,
                paymentMethods: [],
                products: [],
                saleVariety: 'r',
                shipTo: {},
                tranDate: moment().format(isoDateFormat),
                userRefNo: undefined,
            }
            Object.assign(sales, salesObj)
        }
    }

    return ({initSalesMegaData})
}
export { useAccSales }