import moment from 'moment'
import { _, MegaDataContext, useContext, useEffect, useState } from './redirect'
function useAccSales() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const isoDateFormat = 'YYYY-MM-DD'
    useEffect(() => {
        initSalesMegaData()
    }, [])

    function handleTextChanged(sales: any, propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }

    function initSalesMegaData(isForced: boolean = false) {
        const sales: any = megaData?.accounts.sales
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
                items: [],
                paymentMethods: [],
                saleVariety: 'r',
                shipTo: {},
                tranDate: moment().format(isoDateFormat),
                userRefNo: undefined,
            }
            Object.assign(sales, salesObj)
        }
    }

    function setCommonSalesMegaData() {

    }



    return ({ handleTextChanged, megaData, setRefresh })
}
export { useAccSales }