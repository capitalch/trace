import { produce } from "immer"
import { PurchaseStore, purchaseMainlineItemInstance } from "../../purchase-store"
import { signal } from "@preact/signals-react"

function usePurchaseMainLineItem() {
    const lineItems = PurchaseStore.main.lineItems.value

    function handleAddItem(index: number) {
        PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
            // draft.push(purchaseMainlineItemInstance)
            draft.splice(0, 0, {...purchaseMainlineItemInstance})
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