import { Box, Button } from "@mui/material"
import { ColumnDirective, ColumnsDirective, GridComponent } from "@syncfusion/ej2-react-grids"
import { useEffect, useRef } from "react"
import { execGenericView, useSharedElements } from "../inventory/redirect"
import messages from "../../../../messages.json"

function GenericSyncfusionGrid({ gridOptions }: { gridOptions: GridOptions }) {
    const gridRef: any = useRef({})
    const { emit , filterOn} = useSharedElements()
    
    useEffect(() => {
        const subs1 = filterOn('GENERIC-SYNCFUSION-GRID-LOAD-DATA').subscribe(loadData)
        return(()=>{
            subs1.unsubscribe()
        })
    }, [])

    return (<Box>
        <GridHeader />
        <GridComponent
            allowSorting={true}
            gridLines="Both"
            ref={gridRef}
        >
            <ColumnsDirective>
                {getColumnDirectives()}
            </ColumnsDirective>
        </GridComponent>
    </Box>)

    function getColumnDirectives() {
        const columns: ColumnOptions[] = gridOptions.columns
        const columnDirectives = columns.map((column: ColumnOptions, index: number) => {
            return (<ColumnDirective
                field={column.field}
                headerText={column.headerText}
                key={index}
                width={column.width || 100}
            />)
        })
        return (columnDirectives)
    }

    async function loadData() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                isMultipleRows: true,
                sqlKey: gridOptions.sqlKey,
                args: gridOptions.sqlArgs,
                entityName: 'accounts'
            })
            emit('SHOW-LOADING-INDICATOR', false)
            gridRef.current.dataSource = ret
        } catch (error: any) {
            emit('SHOW-MESSAGE', {
                message: messages.errorInOperation,
                severity: 'error',
                duration: null,
            })
        }
    }
}

export { GenericSyncfusionGrid }

function GridHeader() {
    return (<Box>
        <Button size="small" variant="text">Test</Button>
    </Box>)
}

export type GridOptions = {
    columns: ColumnOptions[]
    sqlArgs: any
    sqlKey: string
    // triggerLoadData: string
}

export type ColumnOptions = {
    field: string
    headerText: string
    width?: number
}