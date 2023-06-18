import { PurchaseNewStore } from "./purchase-new-store"

function usePurchaseNew() {

    function handleOnTabChange(e:any, newValue: number) {
        PurchaseNewStore.tabValue.value = newValue
    }

    function handleOnReset() {

    }

    return { handleOnReset, handleOnTabChange }
}
export { usePurchaseNew }