import { MegaDataContext, useContext } from './redirect'
function useCustomerInfo() {
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    
    function handleCustomerSearch() {

    }
    return({handleCustomerSearch})
}

export { useCustomerInfo }