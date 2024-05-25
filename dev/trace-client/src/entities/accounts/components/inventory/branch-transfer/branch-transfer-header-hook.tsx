import Swal from "sweetalert2"
import _ from 'lodash'
import { BranchTransferLineItemType, BranchTransferStore, resetBranchTransferStore } from "../../../stores/branch-transfer-store"
import { genericUpdateMasterDetails, getFromBag, useEffect, useIbuki, useSharedElements, useState, utilMethods } from "../redirect"

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

    function handleOnReset() {
        resetBranchTransferStore()
        emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
    }

    async function handleOnSubmit() {
        if (isFormError()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation error',
                text: 'Something is wrong'
            })
            return
        }
        const tranHeader = getTranHeader()
        const ret = await genericUpdateMasterDetails([tranHeader])
        if (ret.error) {
            console.log(ret.error)
        } else {
            const goToView = BranchTransferStore.goToView
            resetBranchTransferStore()
            emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            if (goToView) {
                BranchTransferStore.tabValue.value = 1
            }
        }
    }

    function getTranHeader() {
        const finYearId = getFromBag('finYearObject')?.finYearId
        const branchId = getFromBag('branchObject')?.branchId || 1
        const obj: any = {
            tableName: 'TranH',
            data: [],
        }
        const item: any = {
            id: header.id || undefined,
            tranDate: header.tranDate.value,
            userRefNo: header.userRefNo.value,
            remarks: header.commonRemarks.value,
            jData: '{}',
            posId: 1,
            finYearId: finYearId,
            branchId: branchId,
            autoRefNo: header.refNo.value,
            tranTypeId: 12,
            details: [],
        }
        const tranDetails: any[] = getTranDetails()
        item.details.push(tranDetails)
        obj.data.push(item)
        return obj
    }

    function getTranDetails() {
        const deletedBranchTransferIds: number[] = []
        const lineItems: BranchTransferLineItemType[] = BranchTransferStore.main.lineItems.value
        const tranDetails: any = {
            tableName: 'BranchTransfer',
            fkeyName: 'tranHeaderId',
            deletedIds: _.isEmpty(BranchTransferStore.main.deletedBranchTransferIds) ? undefined : BranchTransferStore.main.deletedBranchTransferIds
        }
        const data: any[] = []
        for (const item of lineItems) {
            data.push({
                id: item.id,
                productId: item.productId,
                qty: item.qty,
                price: item.price,
                lineRemarks: item.lineRemarks,
                lineRefNo: item.lineRefNo,
                destBranchId: BranchTransferStore.main.destBranchId.value,
                jData: JSON.stringify({
                    serialNumbers: item.serialNumbers
                }),
            })
        }
        tranDetails.data = [...data]
        return (tranDetails)
    }

    function isFormError(): boolean {
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
        return (ret)
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

    return ({ getOptionsArrayOtherThanCurrentBranch, handleOnReset, handleOnSubmit, isFormError })
}