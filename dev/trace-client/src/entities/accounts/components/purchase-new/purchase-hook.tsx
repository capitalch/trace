import { PurchaseStore } from "./purchase-store"
import { useSharedElements } from "../common/shared-elements-hook"
import { useGranularEffect } from "granular-hooks"
import { useEffect } from "react"

function usePurchase() {
    const { isInvalidDate, accountsMessages } = useSharedElements()
    const errorsObject = PurchaseStore.errorsObject
    const header = PurchaseStore.main.header

    setErrorsObject()

    // useEffect(() => {
    //     setErrorsObject()
    // }, [setErrorsObject])

    function handleOnTabChange(e: any, newValue: number) {
        PurchaseStore.tabValue.value = newValue
    }

    function handleOnReset() {

    }

    function setErrorsObject() {
        errorsObject.tranDateError = () => isInvalidDate(header.tranDate.value) ? accountsMessages.dateRangeAuditLockMessage : ''
        errorsObject.invoiceNoError = () => {
            let error = ''
            if(PurchaseStore.purchaseType==='pur'){
                if(!header.invoiceNo.value){
                    error = 'Required'
                }
            }
            return(error)
        }
    }

    return { handleOnReset, handleOnTabChange }
}
export { usePurchase }