import { useSharedElements } from "../../common/shared-elements-hook"
import { getFromBag } from "../../inventory/redirect"
import { PurchaseStore, PurchaseStoreT } from "../purchase-store"
import { _, useCallback, useEffect, useGranularEffect, useState } from '../../../../../imports/regular-imports'

function usePurchaseMainHeader() {
    const [, setRefresh] = useState({})
    const header = PurchaseStore.main.header
    const subheader = PurchaseStore.main.subheader
    // const errorsObject = PurchaseStore.errorsObject
    // const { accountsMessages, isInvalidDate } = useSharedElements()

    const isGstinExistsCB = useCallback(isGstinExists, [])
    useEffect(() => {
        header.isGstInvoice.value = isGstinExistsCB()
    }, [isGstinExistsCB, header.isGstInvoice])

    function isGstinExists() {
        let ret = false
        const info = getFromBag('unitInfo')
        if (info?.gstin) {
            ret = true
        }
        return (ret)
    }

    function handleSubmit() {
        const data = {
            refNo: header.refNo.value,
            tranDate: header.tranDate.value,
            userRefNo: header.invoiceNo.value,
            commonRemarks: header.commonRemarks.value,
            isGstInvoice: header.isGstInvoice.value,
            purchase: subheader.ledgerSubledgerPurchase
        }
    }

    function handleOnReset() {
        header.id = undefined
        header.invoiceNo.value = undefined
        header.tranDate.value = undefined
        header.commonRemarks.value = undefined
        header.isGstInvoice.value = true
    }

    return ({ handleOnReset, handleSubmit })
    // return ({errorsObject, isGstinExists, })
}
export { usePurchaseMainHeader }