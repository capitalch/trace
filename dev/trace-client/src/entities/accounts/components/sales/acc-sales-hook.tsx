import { _, MegaDataContext, useContext, useEffect, useState } from './redirect'
function useAccSales() {
    const [,setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)

    useEffect(() => {
        initSalesMegaData()
    }, [])

    function initSalesMegaData(isForced: boolean = false) {
        const sales: any = megaData?.accounts.sales
        if (_.isEmpty(sales) || isForced) {
            sales.isRetailSales = true
            sales.autoRefNo = '123'
        }
    }

    function setCommonMegaDataForSales(){

    }

    return ({megaData, setRefresh })
}
export { useAccSales }