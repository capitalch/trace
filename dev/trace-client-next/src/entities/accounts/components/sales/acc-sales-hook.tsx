import { _, MegaDataContext, moment, useContext, useEffect, useState } from './redirect'
function useAccSales() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales: any = megaData?.accounts.sales
    const isoDateFormat = 'YYYY-MM-DD'
    useEffect(() => {
        initSalesMegaData()
    }, [])

    function handleTextChanged( propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }

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
                products:[],
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



    return ({ handleTextChanged, })
}
export { useAccSales }