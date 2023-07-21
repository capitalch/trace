import { Box, Button, TextField } from "@mui/material"
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { Aggregate, AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective, ColumnDirective, ColumnsDirective, GridComponent, Inject, Search } from "@syncfusion/ej2-react-grids"
import { FC, useEffect, useRef } from "react"
import { _, execGenericView, useSharedElements } from "../inventory/redirect"
import messages from "../../../../messages.json"

function GenericSyncfusionGrid({ gridOptions }: { gridOptions: GridOptions }) {
    const gridRef: any = useRef({})
    const { emit, filterOn, debounceFilterOn } = useSharedElements()

    useEffect(() => {
        const subs1 = filterOn('GENERIC-SYNCFUSION-GRID-LOAD-DATA').subscribe(loadData)
        const subs2 = debounceFilterOn('GENERIC-SYNCFUSION-GRID-SEARCH', 1200).subscribe((d: any) => {
            if (gridRef.current) {
                gridRef.current.search(d.data)
            }
        })
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        })
    }, [])

    return (<Box>
        <GridHeader />
        <GridComponent
            allowSorting={true}
            allowTextWrap={true}
            gridLines="Both"
            ref={gridRef}
            width={gridOptions.width}>
            <ColumnsDirective>
                {getColumnDirectives()}
            </ColumnsDirective>
            <AggregatesDirective>
                {getAggrDirectives()}
            </AggregatesDirective>
            <Inject services={[Aggregate, Search]} />
        </GridComponent>
    </Box>)

    function getAggrDirectives() {
        const aggrs: AggrOptions[] = gridOptions.aggregates || []
        const aggrDirectives =
            <AggregateDirective>
                <AggregateColumnsDirective>
                    {getAggrDirectives()}
                </AggregateColumnsDirective>
            </AggregateDirective>

        return (aggrDirectives)

        function getAggrDirectives() {
            const defaultFooterTemplate: FC = (props: any) => <span><b>{props.Sum}</b></span>
            const ds: any[] = aggrs.map((aggr: AggrOptions, index: number) => {
                return (<AggregateColumnDirective
                    key={index}
                    field={aggr.field}
                    type={aggr.type}
                    footerTemplate={aggr.footerTemplate || defaultFooterTemplate}
                    format={aggr.format || 'N2'}
                />)
            })
            return (ds)
        }
    }

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
            if ((!_.isEmpty(ret)) && Array.isArray(ret) && (ret.length > 0)) {
                ret.forEach((item: any, index: number) => {
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
    const { debounceEmit } = useSharedElements()
    const textBoxRef: any = useRef({})

    useEffect(() => {
        textBoxRef.current.addIcon('append', 'fa fa-search')
    }, [])

    return (<Box mb={2}>
        <Button size="small" variant="text">Test</Button>
        <TextBoxComponent style={{ height: '30px' }} width={250} ref={textBoxRef} showClearButton placeholder="Search" input={handleToolbarTextChanged} />
        <input type='text' style={{ height: '30px' }} />
    </Box>)

    function handleToolbarTextChanged(e: any) {
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH', e.value)
    }
}

export type GridOptions = {
    aggregates?: AggrOptions[]
    columns: ColumnOptions[]
    sqlArgs: any
    sqlKey: string
    widthInPercent?: string
    width?: number
}

export type AggrOptions = {
    field: string
    type: 'Average' | 'Count' | 'Sum' | 'Min' | 'Max'
    footerTemplate?: FC
    format?: 'N2' | 'N0'
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