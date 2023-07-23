import { Box, IconButton, Tooltip, Typography, } from "@mui/material"
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import {
    Aggregate, AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective,
    AggregatesDirective, ColumnDirective, ColumnsDirective, GridComponent, Inject
    , PdfExport, ExcelExport, Resize, Search, Toolbar
} from "@syncfusion/ej2-react-grids"
import { FC, useEffect, useRef, useState } from "react"
import { _, execGenericView, useIbuki, useSharedElements } from "../inventory/redirect"
import messages from "../../../../messages.json"
import { Search as SearchIcon } from '../../../../imports/icons-import'
import { useTraceGlobal } from "../masters/redirect"
import { Close, SyncSharp, InsertDriveFile } from "@mui/icons-material"
import { Signal } from "@preact/signals-react"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

function GenericSyncfusionGrid({ gridOptions }: { gridOptions: GridOptions }) {
    const gridRef: any = useRef({})
    const { getCurrentWindowSize } = useTraceGlobal()
    const { emit, filterOn, } = useSharedElements()
    useEffect(() => {
        const subs1 = filterOn('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + gridOptions.instance).subscribe(loadData)
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    return (
        <Box>
            <GridHeader gridOptions={gridOptions} gridRef={gridRef} />
            <GridComponent id='grid'
                allowPdfExport={true}
                allowExcelExport={true}
                allowResizing={true}
                allowSorting={true}
                allowTextWrap={true}
                gridLines="Both"
                ref={gridRef}
                height='calc(100vh - 370px)'
                width={getCurrentWindowSize()}>
                <ColumnsDirective>
                    {getColumnDirectives()}
                </ColumnsDirective>
                <AggregatesDirective>
                    {getAggrDirectives()}
                </AggregatesDirective>
                <Inject services={[Aggregate, ExcelExport, PdfExport, Resize, Search, Toolbar]} />
            </GridComponent>
        </Box>
    )

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
            gridOptions.sqlArgs.no = +gridOptions.viewLimitWrapper.no.value || null
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

function GridHeader({ gridOptions, gridRef }: { gridOptions: GridOptions, gridRef: any }) {
    const { debounceEmit } = useSharedElements()
    const textBoxRef: any = useRef({})
    const [, setRefresh] = useState({})
    const { debounceFilterOn, emit } = useIbuki()

    useEffect(() => {
        const subs1 = debounceFilterOn('GENERIC-SYNCFUSION-GRID-SEARCH' + gridOptions.instance, 1200).subscribe((d: any) => {
            doGridSearch(d.data)
        })
        doGridSearch(gridOptions.searchTextWrapper.text.value)
        return (() => { subs1.unsubscribe() })
    }, [])

    return (<Box mb={1} display='flex' justifyContent='space-between' alignItems='center' >
        <Box display='flex' alignItems='center' >
            <div className="view-limit">
                <Typography component='span' variant="body2">View</Typography>
                <select
                    value={gridOptions.viewLimitWrapper.no.value || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '4rem',
                        marginLeft: '0.2rem',
                    }}
                    onChange={(e: any) => {
                        gridOptions.viewLimitWrapper.no.value = e.target.value
                        emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + gridOptions.instance, '')
                        setRefresh({})
                    }}>
                    <option value={'100'}>100</option>
                    <option value={'1000'}>1000</option>
                    <option value={'0'}>All</option>
                </select>
            </div>
            <Tooltip title='Reload'>
                <IconButton
                    size="medium"
                    color="secondary"
                    onClick={(e: any) => {
                        emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + gridOptions.instance, '')
                    }}>
                    <SyncSharp></SyncSharp>
                </IconButton>
            </Tooltip>
            <Tooltip title='PDF export'>
                <IconButton
                    size="medium"
                    color='warning'
                    onClick={handlePdfExport}>
                    <PictureAsPdfIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title='Excel export'>
                <IconButton
                    size="medium"
                    color='info'
                    onClick={handleExcelExport}>
                    <InsertDriveFile />
                </IconButton>
            </Tooltip>
        </Box>
        <Box display='flex' alignItems='center' >
            <SearchIcon fontSize="small" sx={{ mr: .5 }} />
            <TextBoxComponent value={gridOptions.searchTextWrapper.text.value} type='text' style={{ height: '30px', width: '100%' }} ref={textBoxRef} showClearButton={true} placeholder="Search" input={handleToolbarTextChanged} />
            <IconButton disabled={gridOptions.searchTextWrapper.text.value ? false : true} size="small" sx={{}} onClick={handleClear}>
                <Close sx={{ fontSize: '18px' }} />
            </IconButton>
        </Box>
    </Box>)

    function doGridSearch(searchText: string) {
        if (gridRef.current) {
            gridRef.current.search(searchText)
        }
    }

    function handleExcelExport() {
        gridRef.current.excelExport()
    }

    function handlePdfExport() {
        gridRef.current.pdfExport()
    }

    function handleToolbarTextChanged(e: any) {
        gridOptions.searchTextWrapper.text.value = e.value
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH' + gridOptions.instance, e.value)
    }

    function handleClear() {
        gridOptions.searchTextWrapper.text.value = ''
        setRefresh({})
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH' + gridOptions.instance, '')
    }
}

export type GridOptions = {
    aggregates?: AggrOptions[]
    columns: ColumnOptions[]
    instance: string
    sqlArgs: any
    sqlKey: string
    widthInPercent?: string
    searchTextWrapper: { text: Signal<string> }
    viewLimitWrapper: { no: Signal<number> }
}

export type AggrOptions = {
    field: string
    type: 'Average' | 'Count' | 'Sum' | 'Min' | 'Max'
    footerTemplate?: FC
    format?: 'N2' | 'N0'
}

export type ColumnOptions = {
    field: string
    format?: any
    headerText: string
    textAlign?: ColumnTextAlign
    type?: ColumnType
    width?: number
}

export type ColumnTextAlign = 'Center' | 'Justify' | 'Left' | 'Right'
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'datetime'