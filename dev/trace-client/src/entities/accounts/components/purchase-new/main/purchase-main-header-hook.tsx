import { useSharedElements } from "../../common/shared-elements-hook"
import { getFromBag } from "../../inventory/redirect"
import { PurchaseStore } from "../purchase-store"
import { useGranularEffect } from '../../../../../imports/regular-imports'
import { ErrorSharp } from "@mui/icons-material"

function usePurchaseNewHeader() {
    const header = PurchaseStore.main.header
    // const errors = PurchaseStore.errors
    const { accountsMessages, isInvalidDate } = useSharedElements()

    useGranularEffect(() => {
        setErrors()
        if (isGstinExists()) {
            header.isGstInvoice.value = true
        }

    }, [], [isGstinExists, setErrors])

    function isInValidInvoiceNo() {
        let ret = false
        // errors.invoiceNo.value = ''
        // if (!header.invoiceNo.value) {
        //     errors.invoiceNo.value = accountsMessages.genericRequired
        //     ret = true
        // }
        return (ret)
    }

    function isGstinExists() {
        let ret = false
        const info = getFromBag('unitInfo')
        if (info?.gstin) {
            ret = true
        }
        return (ret)
    }

    function isInvalidTranDate() {
        let ret = false
        // PurchaseStore.errors.tranDate.value =''
        if (isInvalidDate(header.tranDate.value)) {
            ret = true
            // PurchaseStore.errors.tranDate.value = accountsMessages.dateRangeAuditLockMessage
        }
        return (ret)
    }

    function isError() {
        // const errors: any = PurchaseStore.errors
        // const vals: any[] = Object.values(errors)
        // const lineItems:any[] = vals.pop()

        // const isError = vals.some((x: any) => {
        //     console.log(x.value)
        //     return(Boolean(x.value))
        // })
        // return (isError)
    }

    function setErrors() {
        const errors:any = PurchaseStore.errors
        errors.isDateError = ()=>isInvalidDate(header.tranDate.value) || false
        errors.isInvoiceNoError = ()=>{
            
        }

    }

    return ({ isError, isGstinExists, isInValidInvoiceNo, isInvalidTranDate })
}
export { usePurchaseNewHeader }