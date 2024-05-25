import { useEffect } from 'react'
import _ from 'lodash'
import { AggrOptions, ColumnOptions, GridOptions, GenericSyncfusionGrid, } from '../../purchase-new/generic-syncfusion-grid'
import { BranchTransferLineItemType, BranchTransferStore,  getEmptyBranchTransferLineItem } from '../../../stores/branch-transfer-store'
import { accountsMessages, execGenericView, useSharedElements, utilMethods } from '../../inventory/redirect';
import { AppStore } from '../../../stores/app-store';
import { BranchTransferPreview } from './branch-transfer-preview';
// import { getEmptyPurchaseLineItem } from '../../../stores/purchase-store';

export function BranchTransferView() {
    const currentInstance = 'branchTransfer'
    const { emit, confirm, genericUpdateMaster, }: any = useSharedElements()
    const { isControlDisabled } = utilMethods()
    const isDeleteDisabled = isControlDisabled('salespurchases-purchase-delete')
    const isEditDisabled = isControlDisabled('salespurchases-purchase-edit')

    useEffect(() => {
        if (BranchTransferStore.tabValue.value === 1) {
            emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + currentInstance, undefined)
        }
    }, [BranchTransferStore.tabValue.value])

    return (<GenericSyncfusionGrid
        gridOptions={getGridOptions()}
    />)

    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            instance: 'branchTransfer',
            sqlKey: 'get_branch_transfer_headers',
            columns: getColumns(),
            sqlArgs: {
            },
            onDelete: onBranchTransferDelete,
            onEdit: onBranchTransferEdit,
            onPreview: onBranchTransferPreview,
            isDeleteDisabled: false,
            isEditDisabled: false
        }
        return (gridOptions)
    }

    function getAggregates() {
        const aggrs: AggrOptions[] = [
            { field: 'index', type: 'Count', format: 'N0', footerTemplate: (props: any) => <span><b>{props.Count}</b></span> }
            , { field: 'amount', type: 'Sum', format: 'N2', }
        ]
        return (aggrs)
    }

    function getColumns(): ColumnOptions[] {
        const columns: ColumnOptions[] = [
            { field: 'index', headerText: '#', width: 70 }
            , { field: 'tranDate', headerText: 'Date', type: 'date', width: 95, format: { type: 'date', format: 'dd/MM/yyyy', } }
            , { field: 'autoRefNo', headerText: 'Auto ref no', width: 170 }
            , { field: 'sourceBranchName', headerText: 'Source branch', width: 200 }
            , { field: 'destBranchName', headerText: 'Dest branch', width: 200 }
            , { field: 'userRefNo', headerText: 'User ref no', width: 200 }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'serialNumbers', headerText: 'Serial No', width: 150 }
            , { field: 'productCodes', headerText: 'Product codes', width: 150 }
            , { field: 'amount', headerText: 'Amount', width: 100, type: 'number', format: 'N2', textAlign: 'Right' }
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
            , { field: 'lineRemarks', headerText: 'Line remarks', width: 150 }
        ]
        return (columns)
    }

    function onBranchTransferDelete(id: number) {
        const options: any = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        confirm(options)
            .then(async () => {
                emit('SHOW-LOADING-INDICATOR', true)
                await genericUpdateMaster({
                    deletedIds: [id],
                    tableName: 'TranH',
                })
                emit('SHOW-LOADING-INDICATOR', false)
                emit('SHOW-MESSAGE', {})
                emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + currentInstance, undefined)
            }).catch((e:any) => { 
                console.log(e)
            }).finally(() => {
                emit('SHOW-LOADING-INDICATOR', false)
            })
    }

    async function onBranchTransferEdit(id: number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_branch_transfer_on_id',
            args: { id: id }
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!_.isEmpty(ret)) {
            BranchTransferStore.tabValue.value = 0
            BranchTransferStore.goToView = true // After submit operation, go back to view
            prepareBranchTransferStore(ret)
        }
    }

    async function onBranchTransferPreview(id:number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_branch_transfer_on_id',
            args: { id: id }
        })
        if(_.isEmpty(ret?.jsonResult)) {
            alert('No data found')
            return
        }

        AppStore.modalDialogA.isCentered = true
        AppStore.modalDialogA.title.value = 'Branch transfer Preview'
        AppStore.modalDialogA.body.value = () => <BranchTransferPreview branchTransferData={ret.jsonResult}  />
        AppStore.modalDialogA.maxWidth.value = 'md'
        AppStore.modalDialogA.isOpen.value = true
        emit('SHOW-LOADING-INDICATOR', false)
    }

    function prepareBranchTransferStore(data: any, isEdit = true){
        const res: any = data.jsonResult
        const tranH: any = res.tranH
        const branchTransfer: any[] = res.branchTransfer

        const main = BranchTransferStore.main
        const header = main.header
        const firstRow: any = branchTransfer[0]
        
        main.destBranchId.value = firstRow.destBranchId
        header.id = tranH.id
        header.refNo.value = tranH.autoRefNo
        header.tranDate.value = tranH.tranDate
        header.userRefNo.value = tranH.userRefNo
        header.commonRemarks.value = tranH.remarks

        const lineItems: BranchTransferLineItemType[] = branchTransfer.map((item: any) => {
            const lineItem: BranchTransferLineItemType = getEmptyBranchTransferLineItem()
            lineItem.id = item.id
            lineItem.productCodeOrUpc.value = ''
            lineItem.productCode.value = item.productCode
            lineItem.upcCode.value = ''
            lineItem.productId.value = item.productId
            lineItem.productDetails.value = `${item.catName} ${item.brandName} ${item.label}`
            lineItem.destBranchId.value = item.destBranchId
            lineItem.qty.value = item.qty
            lineItem.price.value = item.price
            lineItem.amount.value = item.qty * item.price
            lineItem.serialNumbers.value = item.serialNumbers
            lineItem.lineRemarks.value = item.lineRemarks
            lineItem.lineRefNo.value = item.lineRefNo
            return lineItem
        })
        BranchTransferStore.main.lineItems.value = lineItems
        BranchTransferStore.goToView = true
    }
}
