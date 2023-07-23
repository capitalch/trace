import { useEffect, useRef } from 'react'
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
// import { Aggregate,
//     AggregatesDirective, AggregateDirective, AggregateColumnsDirective,
//     AggregateColumnDirective, ColumnsDirective, ColumnDirective, GridComponent, Inject,
// } from '@syncfusion/ej2-react-grids'
import { execGenericView, manageEntitiesState, useSharedElements } from '../inventory/redirect';
import { PurchaseStore } from '../../stores/purchase-store';
import { AggrOptions, ColumnOptions, GenericSyncfusionGrid, GridOptions } from './generic-syncfusion-grid'
import { AppStore } from '../../stores/app-store';

function PurchaseView() {
    const theme = useTheme()
    const { emit } = useSharedElements()
    // const { getCurrentEntity, getFromBag } = manageEntitiesState()

    useEffect(() => {
        if (PurchaseStore.tabValue.value === 1) {
            emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + PurchaseStore.purchaseType, undefined)
        }
    }, [PurchaseStore.tabValue.value])

    return (<Box mt={2}>
        <GenericSyncfusionGrid gridOptions={getGridOptions()} />
    </Box>)

    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            instance: PurchaseStore.purchaseType,
            searchTextWrapper: AppStore.misc.purchase.grid.searchTextWrapper,
            viewLimitWrapper: AppStore.misc.purchase.grid.viewLimitWrapper,
            sqlKey: 'get_purchase_headers',
            columns: getColumns(),
            // searchText: PurchaseStore.view.searchText,
            sqlArgs: {
                tranTypeId: 5,
                no: 100
            },
        }
        return (gridOptions)
    }

    function getAggregates() {
        const aggrs: AggrOptions[] = [
            { field: 'index', type: 'Count', format: 'N0', footerTemplate: (props: any) => <span><b>{props.Count}</b></span> }
            , { field: 'amount', type: 'Sum', }
            , { field: 'aggr', type: 'Sum', }
            , { field: 'cgst', type: 'Sum', }
            , { field: 'sgst', type: 'Sum', }
            , { field: 'igst', type: 'Sum', }
        ]
        return (aggrs)
    }

    function getColumns(): ColumnOptions[] {
        const columns: ColumnOptions[] = [
            { field: 'index', headerText: '#', width: 70 }
            , { field: 'tranDate', headerText: 'Date', type: 'date', width: 100, format: {type:'date', format:'dd/MM/yyyy'}}
            , { field: 'autoRefNo', headerText: 'Ref no', width: 170 }
            , { field: 'userRefNo', headerText: 'Invoice no', width: 200 }
            , { field: 'amount', headerText: 'Amount', textAlign: 'Right', type: 'number', width: 130, format: 'N2' }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'aggr', headerText: 'Aggr', textAlign: 'Right', width: 130, format: 'N2' } //numeric with 2 decimals
            , { field: 'cgst', headerText: 'Cgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'sgst', headerText: 'Sgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'igst', headerText: 'Igst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'serialNumbers', headerText: 'Serial No', width: 150 }
            , { field: 'productCodes', headerText: 'Product codes', width: 150 }
            , { field: 'hsns', headerText: 'Hsn codes', width: 150 }
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
        ]
        return (columns)
    }
}
export { PurchaseView }
