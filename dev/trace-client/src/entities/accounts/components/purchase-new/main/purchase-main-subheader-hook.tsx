import { PurchaseStore } from "../../../stores/purchase-store"
import { useSharedElements } from '../../common/shared-elements-hook'
import { execGenericView, useEffect, useIbuki, useState } from "../../inventory/redirect"

function usePurchaseMainSubheader() {
    const subheader = PurchaseStore.main.subheader
    const header = PurchaseStore.main.header
    const main = PurchaseStore.main
    const { emit } = useIbuki()
    const [, setRefresh] = useState({})

    useEffect(() => {
        PurchaseStore.main.functions.refreshSubheader = doRefresh
    }, [])

    const errorsObject = PurchaseStore.errorsObject
    const { isInvalidGstin } = useSharedElements()
    setErrorsObject()
    PurchaseStore.main.functions.clearSubheaderTotals = handleClearSubHeaderTotals

    function doRefresh() {
        setRefresh({})
    }
    function handleClearSubHeaderTotals() {
        subheader.invoiceAmount.value = 0
        subheader.totalQty.value = 0
        subheader.cgst.value = 0
        subheader.sgst.value = 0
        subheader.igst.value = 0
    }

    function handleLedgerSubledgerPurchase() {
        const purchaseAccount: any = subheader.ledgerSubledgerPurchase
        subheader.purchaseAccId.value = purchaseAccount.accId
    }

    async function handleLedgerSubledgerOther() {
        const otherAccount: any = subheader.ledgerSubledgerOther
        subheader.otherAccId.value = otherAccount.accId
        const accId = otherAccount.accId
        if (!accId) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        const result: any = await execGenericView({
            isMultipleRows: false,
            args: { id: accId },
            sqlKey: 'get_gstin',
        })
        subheader.gstinNumber.value = result?.gstin
        emit('SHOW-LOADING-INDICATOR', false)
    }

    function setErrorsObject() {
        errorsObject.gstinError = () => {
            let ret = ''
            if (header.isGstInvoice.value) {
                if ((!subheader.gstinNumber.value) || isInvalidGstin(subheader.gstinNumber.value)) {
                    ret = 'invalid'
                }
            }
            return (ret)
        }

        errorsObject.invoiceAmountError = () => {
            let ret = ''
            if (!almostEqual(subheader.invoiceAmount.value, main.functions.getComputedInvoiceAmount(), 0.1, 0.99)) {
                ret = 'invalid'
            }
            return (ret)
        }

        errorsObject.cgstSgstIgstError = () => {
            let ret = ''
            if (subheader.sgst.value !== subheader.cgst.value) {
                ret = 'invalid'
            }
            if ((subheader.sgst.value !== 0) && (subheader.igst.value !== 0)) {
                ret = 'invalid'
            }
            if ((header.isGstInvoice.value) && (subheader.invoiceAmount.value !== 0)) {
                if ((subheader.cgst.value === 0) && (subheader.sgst.value === 0) && (subheader.igst.value === 0)) {
                    ret = 'invalid'
                }
            }
            return (ret)
        }

        errorsObject.igstError = () => {
            let ret = ''
            if ((subheader.invoiceAmount.value !== 0) && PurchaseStore.main.lineItemsHeader.isIgst.value && (subheader.igst.value === 0)) {
                ret = 'invalid'
            }
            return (ret)
        }

        errorsObject.totalQtyError = () => {
            let ret = ''
            if (main.functions.getComputedTotalQty() !== subheader.totalQty.value) {
                ret = 'invallid'
            }
            return (ret)
        }

        errorsObject.totalCgstError = () => {
            let ret = ''
            if (!almostEqual(main.functions.getComputedTotalCgst(), subheader.cgst.value, 0.01, .99)) {
                ret = 'invallid'
            }
            return (ret)
        }

        errorsObject.totalSgstError = () => {
            let ret = ''
            if (!almostEqual(main.functions.getComputedTotalSgst(), subheader.sgst.value, .01, .99)) {
                ret = 'invallid'
            }
            return (ret)
        }

        errorsObject.totalIgstError = () => {
            let ret = ''
            if (!almostEqual(main.functions.getComputedTotalSgst(), subheader.sgst.value, .01, .99)) {
                ret = 'invallid'
            }
            return (ret)
        }
    }

    function almostEqual(givenNumber: number, computedNumber: number, tolerancePercent: number = 0.5, toleranceAbs: number = 0.99): boolean {
        const tolerance = Math.max(toleranceAbs, computedNumber * tolerancePercent / 100)
        const ret: boolean = Math.abs(givenNumber - computedNumber) <= tolerance
        return (ret)
    }


    return ({ errorsObject, handleClearSubHeaderTotals, handleLedgerSubledgerPurchase, handleLedgerSubledgerOther })
}
export { usePurchaseMainSubheader }