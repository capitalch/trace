import { PurchaseLineItemType, PurchaseStore, } from "../../purchase-store"
// import { signal } from "@preact/signals-react"
// import { useEffect } from "react"
import { _, useIbuki, utilMethods } from "../../../inventory/redirect"
// import Big from "big.js"

function usePurchaseLineItem(item: PurchaseLineItemType) {
    // const lineItems: PurchaseLineItemType[] = PurchaseStore.main.lineItems.value
    const { emit } = useIbuki()
    const { execGenericView, } = utilMethods()

    async function doSearchOnProductCodeOrUpc(value: string) {
        if (!value) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        try {
            const result: any = await execGenericView({
                sqlKey: 'get_product_on_product_code_upc',
                isMultipleRows: false,
                args: {
                    productCodeOrUpc: value,
                },
            })
            if (_.isEmpty(result)) {
                PurchaseStore.main.functions.clearLineItem(item)
            } else {
                PurchaseStore.main.functions.populateLineItem(item,result)
                PurchaseStore.main.functions.computeRow(item)
                PurchaseStore.main.functions.computeSummary()
                // computeRow()
            }

        } catch (e: any) {
            console.log(e.message)
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }


    function handleDeleteItem(e: any, item: PurchaseLineItemType, index: number) {
        // if (PurchaseStore.main.lineItems.value.length === 1) {
        //     return
        // }
        // PurchaseStore.main.lineItems.value = produce(PurchaseStore.main.lineItems.value, (draft: any[]) => {
        //     draft.splice(index, 1)
        //     return (draft)
        // })
        // PurchaseStore.main.functions.computeSummary()
    }


    return ({ doSearchOnProductCodeOrUpc, handleDeleteItem, })
}
export { usePurchaseLineItem }