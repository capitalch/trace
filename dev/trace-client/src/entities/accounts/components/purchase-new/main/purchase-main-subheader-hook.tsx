import { PurchaseStore } from "../purchase-store"
import { useSharedElements } from '../../common/shared-elements-hook'

function usePurchaseMainSubheader() {
    const errorsObject = PurchaseStore.errorsObject
    const subheader = PurchaseStore.main.subheader
    const header = PurchaseStore.main.header
    const main = PurchaseStore.main

    const { isInvalidGstin } = useSharedElements()
    setErrorsObject()

    function handleClearSubHeaderNumbers(){
        subheader.invoiceAmount.value = 0
        subheader.totalQty.value = 0
        subheader.cgst.value = 0
        subheader.sgst.value = 0
        subheader.igst.value = 0
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
            if (!almostEqual(subheader.invoiceAmount.value, main.computedInvoiceAmount)) {
                ret = 'invalid'
            }
            return (ret)
        }

        errorsObject.totalQtyError = () => {
            let ret = ''
            if (main.computedTotalQty !== subheader.totalQty.value) {
                ret = 'invallid'
            }
            return (ret)
        }

        errorsObject.totalCgstError = ()=>{
            let ret = ''
            if(!almostEqual(subheader.cgst.value, main.computedCgst)){
                ret = 'invalid'
            }
            return(ret)
        }

        errorsObject.totalSgstError = ()=>{
            let ret = ''
            if(!almostEqual(subheader.sgst.value, main.computedSgst)){
                ret = 'invalid'
            }
            return(ret)
        }

        errorsObject.totalIgstError = ()=>{
            let ret = ''
            if(!almostEqual(subheader.igst.value, main.computedIgst)){
                ret = 'invalid'
            }
            return(ret)
        }
    }

    function almostEqual(givenNumber: number, computedNumber: number, tolerancePercent: number = 0.5, toleranceAbs: number = 0.99): boolean {
        const tolerance = Math.max(toleranceAbs, computedNumber * tolerancePercent / 100)
        const ret: boolean = Math.abs(givenNumber - computedNumber) <= tolerance
        return (ret)
    }


    return ({ errorsObject, handleClearSubHeaderNumbers })
}
export { usePurchaseMainSubheader }