import { useEffect, useRef } from 'react'
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import {
    AggregatesDirective, AggregateDirective, AggregateColumnsDirective,
    AggregateColumnDirective, ColumnsDirective, ColumnDirective, GridComponent, Inject,
} from '@syncfusion/ej2-react-grids'

import { Aggregate } from '@syncfusion/ej2-react-grids'
import { execGenericView, manageEntitiesState, useSharedElements } from '../inventory/redirect';
import { PurchaseStore } from '../../stores/purchase-store';
import { AggrOptions, ColumnOptions, ColumnTextAlign, GenericSyncfusionGrid, GridOptions } from './generic-syncfusion-grid'

function PurchaseView() {
    const theme = useTheme()
    const { emit } = useSharedElements()
    // const { getCurrentEntity, getFromBag } = manageEntitiesState()

    useEffect(() => {
        if (PurchaseStore.tabValue.value === 1) {
            emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA', undefined)
        }
    }, [PurchaseStore.tabValue.value])

    return (<Box sx={{ mt: theme.spacing(2) }}>
        <GenericSyncfusionGrid gridOptions={getGridOptions()} />
    </Box>)


    function getGridOptions(): GridOptions {
        const gridOptions: GridOptions = {
            aggregates: getAggregates(),
            sqlKey: 'get_purchase_headers',
            columns: getColumns(),
            sqlArgs: {
                tranTypeId: 5,
                no: 100
            },
            width: 2100,
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
            , { field: 'tranDate', headerText: 'Date', type: 'date', width: 100, format: 'dd/MM/yyyy' }
            , { field: 'autoRefNo', headerText: 'Ref no', width: 170 }
            , { field: 'userRefNo', headerText: 'Invoice no', width: 200 }
            , { field: 'amount', headerText: 'Amount', textAlign: 'Right', type: 'number', width: 130, format: 'N2' }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'aggr', headerText: 'Aggr', textAlign: 'Right', width: 130, format: 'N2' } //numeric with 2 decimals
            , { field: 'cgst', headerText: 'Cgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'sgst', headerText: 'Sgst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'igst', headerText: 'Igst', textAlign: 'Right', width: 110, format: 'N2' }
            , { field: 'serialNumbers', headerText: 'Serial No' }
            , { field: 'productCodes', headerText: 'Product codes', width: 150 }
            , { field: 'hsns', headerText: 'Hsn codes', width: 150 }
            , { field: 'remarks', headerText: 'Remarks', width: 150 }
        ]
        return (columns)
    }
}
export { PurchaseView }

// const gridRef: any = useRef({})
//     const entityName = getCurrentEntity()

// const footerCount = (props: any) => {
//     return (<span>Count: {props.Count}</span>)
// }

// useEffect(() => {
//     if (PurchaseStore.tabValue.value === 1) {
//         loadData()
//     }
// }, [PurchaseStore.tabValue.value])

// async function loadData() {
//     const ret = await execGenericView({
//         isMultipleRows: true,
//         sqlKey: 'get_purchase_headers',
//         args: {
//             tranTypeId: 5,
//             no: 100,
//         },
//         entityName: entityName
//     })
//     console.log(ret)
//     gridRef.current.dataSource = ret
// }

// function getColumnsDirective() {
//     const cols: any[] = []
//     let idx = 1
//     cols.push(<ColumnDirective key={idx++} field='tranDate' width={theme.spacing(16)} headerText='Date' />)
//     cols.push(<ColumnDirective key={idx++} field='autoRefNo' headerText='RefNo' />)
//     cols.push(<ColumnDirective key={idx++} field='userRefNo' headerText='Invoice no' />)
//     cols.push(<ColumnDirective key={idx++} field='remarks' headerText='remarks' />)
//     cols.push(<ColumnDirective key={idx++} field='labels' headerText='Labels' />)
//     cols.push(<ColumnDirective key={idx++} field='SerialNumbers' headerText='Ser nos' />)

//     return (cols)
// }

// {/* <GridComponent
// ref={gridRef}
// // dataSource={fdata}
// height={500}
// gridLines="Both"

// >
// <ColumnsDirective>
//     {getColumnsDirective()}
// </ColumnsDirective>
// <AggregatesDirective>
//     <AggregateDirective>
//         <AggregateColumnsDirective>
//             <AggregateColumnDirective field="id" type='Count' footerTemplate={footerCount} />
//         </AggregateColumnsDirective>
//     </AggregateDirective>
// </AggregatesDirective>
// <Inject services={[Aggregate]} />
// </GridComponent> */}