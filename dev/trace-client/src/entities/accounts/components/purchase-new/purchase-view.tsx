import { useEffect, useRef } from 'react'
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import { fdata } from "./fakedata";
import {
    AggregatesDirective, AggregateDirective, AggregateColumnsDirective,
    AggregateColumnDirective, ColumnsDirective, ColumnDirective, GridComponent, Inject,
} from '@syncfusion/ej2-react-grids'

import { Aggregate } from '@syncfusion/ej2-react-grids'
import { execGenericView, manageEntitiesState, useSharedElements } from '../inventory/redirect';
import { PurchaseStore } from '../../stores/purchase-store';
import { ColumnOptions, GenericSyncfusionGrid, GridOptions } from './generic-syncfusion-grid';
import { getGridDefaultColumnTypes } from '@mui/x-data-grid-pro';

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
            sqlKey: 'get_purchase_headers',
            columns: getColumns(),
            sqlArgs: {
                tranTypeId: 5,
                no: 100
            },
        }
        return (gridOptions)
    }

    function getColumns(): ColumnOptions[] {
        const columns: ColumnOptions[] = [
            { field: 'tranDate', headerText: 'Date', }
            , { field: 'autoRefNo', headerText: 'Ref no' }
            , { field: 'userRefNo', headerText: 'Invoice no' }
            , { field: 'productDetails', headerText: 'Product details' }
            , { field: 'amount', headerText: 'Amount' }
            , { field: 'serialNumbers', headerText: 'Serial No' }
            , { field: 'productCodes', headerText: 'Product codes' }
            , { field: 'hsns', headerText: 'Hsn codes' }
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