import { PurchaseStore } from '../../../stores/purchase-store'
import { AggrOptions, ColumnOptions, GridOptions, GenericSyncfusionGrid, } from '../../purchase-new/generic-syncfusion-grid'

export function BranchTransferView() {

    return (<GenericSyncfusionGrid
        gridOptions={getGridOptions()}
    />)

    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            instance: PurchaseStore.purchaseType,
            sqlKey: 'get_branch_transfer_headers',
            columns: getColumns(),
            sqlArgs: {
                // no: 100,
            },
            onDelete: onPurchaseDelete,
            onEdit: onPurchaseEdit,
            onPreview: onPurchasePreview,
            isDeleteDisabled: false,
            isEditDisabled: false
        }
        return (gridOptions)
    }

    function getAggregates() {
        const aggrs: AggrOptions[] = [
            { field: 'index', type: 'Count', format: 'N0', footerTemplate: (props: any) => <span><b>{props.Count}</b></span> }
            // , { field: 'amount', type: 'Sum', }
            // , { field: 'aggr', type: 'Sum', }
            // , { field: 'cgst', type: 'Sum', }
            // , { field: 'sgst', type: 'Sum', }
            // , { field: 'igst', type: 'Sum', }
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
            , { field: 'amount', headerText: 'Amount', width: 100, type: 'number', format:'N2', textAlign: 'Right'}
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
            , { field: 'lineRemarks', headerText: 'Line remarks', width: 150 }
        ]
        return (columns)
    }

    function onPurchaseDelete() {
        // PurchaseStore.deletePurchase()
    }

    function onPurchaseEdit() {
        // PurchaseStore.editPurchase()
    }

    function onPurchasePreview() {
        // PurchaseStore.previewPurchase()
    }


}