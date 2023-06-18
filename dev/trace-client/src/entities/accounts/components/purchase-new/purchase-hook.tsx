import { PurchaseStore } from "./purchase-store"

function usePurchase() {

    function handleOnTabChange(e:any, newValue: number) {
        PurchaseStore.tabValue.value = newValue
    }

    function handleOnReset() {

    }

    return { handleOnReset, handleOnTabChange }
}
export { usePurchase }