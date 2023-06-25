// import {FormikHelpers} from '../../../../../imports/regular-imports'
import { PurchaseStore } from '../purchase-store'

function usePurchaseMain() {
    function handleOnSubmit(values: any) {
        console.log(values)
        const invoiceNo =  PurchaseStore.main.header.invoiceNo.value
        console.log(invoiceNo)
    }
    return({handleOnSubmit})
}
export { usePurchaseMain }