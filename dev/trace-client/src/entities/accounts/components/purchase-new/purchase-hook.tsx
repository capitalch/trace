import { PurchaseStore,} from "../../stores/purchase-store"
import { useSharedElements } from "../common/shared-elements-hook"
// import { useGranularEffect } from "granular-hooks"
import { useEffect } from "react"
import { _, execGenericView } from "../inventory/redirect"

function usePurchase(drillDownEditAttributes: any) {
    const { emit } = useSharedElements()
    useEffect(() => {
        if (drillDownEditAttributes?.tranHeaderId) {
            loadPurchase(drillDownEditAttributes.tranHeaderId)
        }
    }, [])

    function handleOnTabChange(e: any, newValue: number) {
        PurchaseStore.tabValue.value = newValue
    }

    async function loadPurchase(id: number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: { id: id }
        })
        
        emit('SHOW-LOADING-INDICATOR', false)
        if (!_.isEmpty(ret)) {
            PurchaseStore.tabValue.value = 0
            PurchaseStore.goToView = false // After submit operation, the view is loaded
            PurchaseStore.closeOnSubmit = true
            PurchaseStore.main.functions.preparePurchaseStore(ret)
        }
    }

    return { handleOnTabChange, }
}
export { usePurchase }