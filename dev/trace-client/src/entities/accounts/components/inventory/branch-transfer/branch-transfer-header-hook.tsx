import { BranchTransferStore } from "../../../stores/branch-transfer-store"
import { getFromBag, useEffect, useSharedElements, useState } from "../redirect"

export function useBranchTransferheader() {
    const header = BranchTransferStore.main.header
    const [,setRefresh] = useState({})
    const { isInvalidDate, accountsMessages } = useSharedElements()
    useEffect(() => {
        setErrorsObject()
        setRefresh({})
    }, [])

    setErrorsObject()

    function getOptionsOtherThanCurrentBranch() {
        const branches: any[] = getFromBag('branches')
        const branchObject = getFromBag('branchObject')
        const currentBranchId = branchObject.branchId
        const filteredBranches = branches.filter((branch: any) => branch.branchId !== currentBranchId)
        const options: any[] = filteredBranches.map((branch: any) => {
            return <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>
        })
        options.unshift(<option key={0} value={''}>--- Select branch ---</option>)
        return (options)
    }

    function getOptionsArrayOtherThanCurrentBranch(){
        const branches: any[] = getFromBag('branches')
        const branchObject = getFromBag('branchObject')
        const currentBranchId = branchObject.branchId
        const filteredBranches = branches.filter((branch: any) => branch.branchId !== currentBranchId)
        const options: any[] = filteredBranches.map((branch: any) => {
            return {label: branch.branchName, code: branch.branchId}
        })
        options.unshift({label: '--- Select branch ---', code: ''})
        return (options)
    }

    function setErrorsObject() {
        const errorsObject = BranchTransferStore.errorsObject
        errorsObject.tranDateError = () => {
            return (isInvalidDate(header.tranDate.value) ? accountsMessages.dateRangeAuditLockMessage : '')
        }
        errorsObject.destBranchError = () => {
            return (BranchTransferStore.main.destBranchId.value ? '' : accountsMessages.destBranchRequired )
        }
    }

    return ({ getOptionsOtherThanCurrentBranch , getOptionsArrayOtherThanCurrentBranch})
}