import { BranchTransferLineItemType, BranchTransferStore, resetBranchTransferStore } from "../../../stores/branch-transfer-store"
import { getFromBag, useEffect, useIbuki, useSharedElements, useState } from "../redirect"

export function useBranchTransferheader() {
    const { emit } = useIbuki()
    const header = BranchTransferStore.main.header
    const [, setRefresh] = useState({})
    const { isInvalidDate, accountsMessages, getCurrentComponent } = useSharedElements()

    useEffect(() => {
        setErrorsObject()
    }, [])

    function getOptionsArrayOtherThanCurrentBranch() {
        const branches: any[] = getFromBag('branches')
        const branchObject = getFromBag('branchObject')
        const currentBranchId = branchObject.branchId
        const filteredBranches = branches.filter((branch: any) => branch.branchId !== currentBranchId)
        const options: any[] = filteredBranches.map((branch: any) => {
            return { label: branch.branchName, code: branch.branchId }
        })
        options.unshift({ label: '--- Select branch ---', code: '' })
        return (options)
    }

    function handleOnReset(){
        resetBranchTransferStore()
        emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
    }

    
    function isFormError(): boolean{
        let ret = true
        const errorsObject = BranchTransferStore.errorsObject
        const err = errorsObject.tranDateError()
        || errorsObject.destBranchError()
        const lineItemsError = BranchTransferStore.main.lineItems.value.reduce((acc: any, lineItem: BranchTransferLineItemType) => {
            return acc 
            || errorsObject.qtyError(lineItem) 
            || errorsObject.productDetailsError(lineItem) 
            || errorsObject.productCodeError(lineItem)
            || errorsObject.isSlNoError(lineItem)
        }, false)
        ret = Boolean(err || lineItemsError)
        return(ret)
    }

    function setErrorsObject() {
        const errorsObject = BranchTransferStore.errorsObject
        errorsObject.tranDateError = () => {
            return (isInvalidDate(header.tranDate.value) ? accountsMessages.dateRangeAuditLockMessage : '')
        }
        errorsObject.destBranchError = () => {
            return (BranchTransferStore.main.destBranchId.value ? '' : accountsMessages.destBranchRequired)
        }
        setRefresh({})
    }

    return ({ getOptionsArrayOtherThanCurrentBranch,handleOnReset, isFormError })
}