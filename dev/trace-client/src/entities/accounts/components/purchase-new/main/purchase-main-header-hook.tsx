import { useSharedElements } from "../../common/shared-elements-hook"
import { getFromBag, useIbuki } from "../../inventory/redirect"
import { PurchaseLineItemType, PurchaseStore, PurchaseStoreT, resetPurchaseStore } from "../purchase-store"
import { _, useCallback, useEffect, useGranularEffect, useState } from '../../../../../imports/regular-imports'

function usePurchaseMainHeader() {
    const { emit } = useIbuki()
    const { getCurrentComponent } = useSharedElements()
    const { isInvalidDate, accountsMessages } = useSharedElements()
    const header = PurchaseStore.main.header
    const subheader = PurchaseStore.main.subheader

    const isGstinExistsCB = useCallback(isGstinExists, [])
    const setErrorsObjectCB = useCallback(setErrorsObject, [])

    useEffect(() => {
        header.isGstInvoice.value = isGstinExistsCB()
        setErrorsObjectCB()
    }, [isGstinExistsCB, header.isGstInvoice, setErrorsObjectCB])

    function handleOnChangeGstInvoiceCheckbox(e: any) {
        header.isGstInvoice.value = !header.isGstInvoice.value
        PurchaseStore.main.functions.clearSubheaderTotals()
        if (!e.target.checked) {
            subheader.gstinNumber.value = ''
            PurchaseStore.main.lineItems.value.forEach((item: PurchaseLineItemType) => {
                item.hsn.value = 0
                item.gstRate.value = 0
                PurchaseStore.main.functions.computeRow(item)
            })
            PurchaseStore.main.functions.computeSummary()
        }
    }

    function handleOnReset() {
        resetPurchaseStore()
        emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
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

    function isGstinExists() {
        let ret = false
        const info = getFromBag('unitInfo')
        if (info?.gstin) {
            ret = true
        }
        return (ret)
    }

    function setErrorsObject() {
        const errorsObject = PurchaseStore.errorsObject
        errorsObject.tranDateError = () => isInvalidDate(header.tranDate.value) ? accountsMessages.dateRangeAuditLockMessage : ''
        errorsObject.invoiceNoError = () => {
            let error = ''
            if (PurchaseStore.purchaseType === 'pur') {
                if (!header.invoiceNo.value) {
                    error = 'Required'
                }
            }
            return (error)
        }
    }

    function isError(): boolean {
        let ret = true

        return (ret)
    }

    return ({ handleOnChangeGstInvoiceCheckbox, handleOnReset, handleSubmit, isError })
}
export { usePurchaseMainHeader }