import { useSharedElements } from "../../common/shared-elements-hook"
import { PurchaseNewStore } from "../purchase-new-store"

function usePurchaseNewHeader() {
    const header = PurchaseNewStore.main.header
    const errors = PurchaseNewStore.errors
    const { accountsMessages } = useSharedElements()

    function isInValidInvoiceNo() {
        let ret = false
        if (!header.invoiceNo.value) {
            errors.invoiceNo.value = accountsMessages.genericRequired
            ret = true
        }
        return(ret)
    }

    return({isInValidInvoiceNo})
}
export { usePurchaseNewHeader }