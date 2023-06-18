// import {FormikHelpers} from '../../../../../imports/regular-imports'
import { PurchaseNewStore } from '../purchase-new-store'

function usePurchaseNewMain() {
    function handleOnSubmit(values: any) {
        console.log(values)
        const invoiceNo =  PurchaseNewStore.main.header.invoiceNo.value
        console.log(invoiceNo)
    }
    return({handleOnSubmit})
}
export { usePurchaseNewMain }