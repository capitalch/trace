import { PurchaseStore } from '../../../stores/purchase-store'

function usePurchaseMain() {
    function handleOnSubmit(values: any) {
        console.log(values)
        const invoiceNo =  PurchaseStore.main.header.invoiceNo.value
        console.log(invoiceNo)
    }
    return({handleOnSubmit})
}
export { usePurchaseMain }