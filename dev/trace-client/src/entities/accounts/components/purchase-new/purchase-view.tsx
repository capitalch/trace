import { useEffect, useRef } from 'react'
import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../imports/gui-imports'
import { fdata } from "./fakedata";
import {
    AggregatesDirective, AggregateDirective, AggregateColumnsDirective,
    AggregateColumnDirective, ColumnsDirective, ColumnDirective, GridComponent, Inject,
} from '@syncfusion/ej2-react-grids'

import { Aggregate } from '@syncfusion/ej2-react-grids'
import { execGenericView, manageEntitiesState } from '../inventory/redirect';

function PurchaseView() {
    const theme = useTheme()
    const { getCurrentEntity, getFromBag } = manageEntitiesState()
    const gridRef: any = useRef({})
    const entityName = getCurrentEntity()

    const footerCount = (props: any) => {
        return (<span>Count: {props.Count}</span>)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (<Box sx={{ mt: theme.spacing(2) }}>
        <GridComponent
            ref={gridRef}
            dataSource={fdata}
            height={500}
            gridLines="Both"
        // rowSelected={(row: any) => {
        //     console.log(row.data)
        //     console.log(gridRef.current.getSelectedRecords())
        // }}
        // rowDeselected={(row: any) => {
        //     console.log(row.data)
        //     console.log(gridRef.current.getSelectedRecords())
        // }}
        >
            <ColumnsDirective>
                <ColumnDirective type='checkbox' width='15' />
                <ColumnDirective field='id' width='120' headerText="Order ID" />
                <ColumnDirective field='first_name' width='100' headerText="First name" />
                <ColumnDirective field='last_name' width='100' textAlign="Right" headerText="Last name ID" />
                <ColumnDirective field='email' width='100' format="C2" textAlign="Left" headerText="Email" />
                <ColumnDirective field='gender' width='50' headerText="Gender" valueAccessor={undefined} />
                {/* <ColumnDirective field='actions' width='30' headerText="Actions" template={myTemplate} /> */}
            </ColumnsDirective>
            <AggregatesDirective>
                <AggregateDirective>
                    <AggregateColumnsDirective>
                        <AggregateColumnDirective field="id" type='Count' footerTemplate={footerCount} />
                    </AggregateColumnsDirective>
                </AggregateDirective>
            </AggregatesDirective>
            <Inject services={[Aggregate]} />
        </GridComponent>
    </Box>)

    async function loadData() {
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_sale_purchase_headers',
            args: {
                tranTypeId: 5,
                no: 100,
                accId:'%',
                tranDc: 'D'
            },
            entityName: entityName
        })
        console.log(ret)
    }
}
export { PurchaseView }