import { _, MegaDataContext, useContext, useEffect } from './redirect'
function useAccSales() {
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

    return ({ })
}
export { useAccSales }