import { Box, Button } from "@mui/material"
import { ColumnDirective, ColumnsDirective, GridComponent } from "@syncfusion/ej2-react-grids"
import { useEffect, useRef } from "react"
import { _, execGenericView, useSharedElements } from "../inventory/redirect"
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
            allowTextWrap={true}

            gridLines="Both"
            ref={gridRef} 
            // width={gridOptions.widthInPercent || undefined}
            width={gridOptions.width}       
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
                textAlign={column.textAlign}
                type={column.type}
                width={column.width}
                format={column.format}
                // width={100}
            />)
        })
        return (columnDirectives)
    }

    async function loadData() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                isMultipleRows: true,
                sqlKey: gridOptions.sqlKey,
                args: gridOptions.sqlArgs,
                entityName: 'accounts'
            })
            if((!_.isEmpty(ret)) && Array.isArray(ret) && (ret.length > 0)){
                ret.forEach((item:any, index: number)=>{
                    item.index = index + 1
                })
            }
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
    widthInPercent?:string
    width?: number
    // triggerLoadData: string
}

export type ColumnOptions = {
    field: string
    format?: string
    headerText: string
    textAlign?: ColumnTextAlign
    type?: ColumnType
    width?: number
}

export type ColumnTextAlign = 'Center' | 'Justify' | 'Left' | 'Right' 
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'datetime'