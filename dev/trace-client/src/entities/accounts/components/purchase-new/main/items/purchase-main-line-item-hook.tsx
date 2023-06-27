import { produce } from "immer"
import { PurchaseStore, getInstance, purchaseMainlineItemInstance } from "../../purchase-store"
import { signal } from "@preact/signals-react"

function usePurchaseMainLineItem() {
    const lineItems = PurchaseStore.main.lineItems.value

    function handleAddItem(index: number) {
        PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
            // draft.push(purchaseMainlineItemInstance)

            const ins = {
                index: signal(0),
                productCode: signal(''),
                hsn: signal(0),
                productDetails: signal(''),
                gstRate: signal(0),
                clos: signal(0),
                qty: signal(0),
                price: signal(0),
                priceGst: signal(0),
                discount: signal(0),
                subTotal: signal(0),
                amount: signal(0),
                serialNumber: signal(''),
                remarks: signal(''),
                cgst: signal(0),
                sgst: signal(0),
                igst: signal(0)
            }
            draft.splice(0, 0, ins)
            return (draft)
        })
    }

    function handleDeleteItem(e: any, item: any, index: number) {
        PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
            // draft.push(purchaseMainlineItemInstance)
            draft.splice(index - 1, 1)
            return (draft)
        })
    }

    return ({ handleAddItem, handleDeleteItem })
}
export { usePurchaseMainLineItem }