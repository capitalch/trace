import { Box, IconButton, Tooltip, Typography, } from "@mui/material"
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import {
    Aggregate, AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective,
    AggregatesDirective, ColumnDirective, ColumnsDirective, GridComponent, Inject
    , PdfExport, ExcelExport, Resize, Search, Toolbar,InfiniteScroll, Selection, 
} from "@syncfusion/ej2-react-grids"
import { FC, useEffect, useRef, } from "react"
import { _, execGenericView, useIbuki, useSharedElements } from "../inventory/redirect"
import messages from "../../../../messages.json"
import { Search as SearchIcon } from '../../../../imports/icons-import'
import { useTraceGlobal } from "../masters/redirect"
import { Close, DeleteForever, Edit, SyncSharp, } from "@mui/icons-material"
import { AppStore } from "../../stores/app-store"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons'

function GenericSyncfusionGrid({ gridOptions }: { gridOptions: GridOptions }) {
    const gridRef: any = useRef({})
    const { getCurrentWindowSize } = useTraceGlobal()
    const { emit, filterOn, } = useSharedElements()
    let toShowDeleteButton: boolean = false, toShowEditButton: boolean = false
    if (gridOptions.onDelete) {
        toShowDeleteButton = true
    }
    if (gridOptions.onEdit) {
        toShowEditButton = true
    }

    useEffect(() => {
        const subs1 = filterOn('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + gridOptions.instance).subscribe(loadData)
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    // gridRef.current.rowSelected = (e:RowSelectEventArgs) => {
    //     console.log(e.data)
    // }

    return (
        <Box>
            <GridHeader gridOptions={gridOptions} gridRef={gridRef} />
            <GridComponent id='grid'
                allowPdfExport={true}
                // allowFiltering={true}
                allowExcelExport={true}
                allowResizing={true}
                allowSorting={true}
                allowSelection={true}
                allowTextWrap={true}
                // enableInfiniteScrolling={true}
                // infiniteScrollSettings={infiniteOptions}
                // enableVirtualization={true}
                gridLines="Both"
                ref={gridRef}
                selectionSettings={{enableToggle:true}}
                height='calc(100vh - 380px)' 
                width={getCurrentWindowSize()}>
                <ColumnsDirective>
                    {getColumnDirectives()}
                </ColumnsDirective>
                <AggregatesDirective>
                    {getAggrDirectives()}
                </AggregatesDirective>
                <Inject services={[Aggregate, ExcelExport, InfiniteScroll, PdfExport, Resize, Search, Selection, Toolbar,]} />
            </GridComponent>
        </Box>
    )

    function getAggrDirectives() {
        const aggrs: AggrOptions[] = gridOptions.aggregates || []
        const aggrDirectives =
            <AggregateDirective>
                <AggregateColumnsDirective>
                    {getAggrColDirectives()}
                </AggregateColumnsDirective>
            </AggregateDirective>

        return (aggrDirectives)

        function getAggrColDirectives() {
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

    function editDeleteColumnTemplate(props: any) {
        return (<Box display='flex'>
            {toShowEditButton && <IconButton
                onClick={(e) => handleClickEdit(props)}
                size='small'
                disabled={gridOptions.isEditDisabled}
                color='secondary'>
                <Edit></Edit>
            </IconButton>}
            {toShowDeleteButton && <IconButton
                disabled={gridOptions.isDeleteDisabled}
                onClick={(e) => handleClickDelete(props)}
                size='small'
                color='error'>
                <DeleteForever></DeleteForever>
            </IconButton>}
        </Box>)
    }

    function handleClickDelete(props: any) {
        gridOptions.onDelete && gridOptions.onDelete(props.id)
    }

    function handleClickEdit(props: any) {
        gridOptions.onEdit && gridOptions.onEdit(props.id)
    }

    function getColumnDirectives() {
        const columns: ColumnOptions[] = gridOptions.columns
        const columnDirectives: any[] = columns.map((column: ColumnOptions, index: number) => {
            return (<ColumnDirective
                field={column.field}
                headerText={column.headerText}
                key={index}
                textAlign={column.textAlign}
                type={column.type}
                width={column.width}
                format={column.format}
            // allowFiltering={(column.allowFiltering === undefined) || (column.allowFiltering === true) ? true : false}
            />)
        })
        if (toShowEditButton || toShowDeleteButton) {
            columnDirectives.unshift(<ColumnDirective
                key='E'
                field=""
                headerText=""
                template={editDeleteColumnTemplate}
                width={80}
            />)
        }
        return (columnDirectives)
    }

    async function loadData() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            gridOptions.sqlArgs.no = +AppStore.syncFusionGrid[gridOptions.instance].viewLimit.value || null
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
            // refreshGrid(ret)
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
    const { debounceFilterOn, emit } = useIbuki()

    useEffect(() => {
        const subs1 = debounceFilterOn('GENERIC-SYNCFUSION-GRID-SEARCH' + gridOptions.instance, 1200).subscribe((d: any) => {
            doGridSearch(d.data)
        })
        doGridSearch(AppStore.syncFusionGrid[gridOptions.instance].searchText.value)
        return (() => { subs1.unsubscribe() })
    }, [])

    return (<Box mb={1} display='flex' justifyContent='space-between' alignItems='center' >
        <Box display='flex' alignItems='center' >

            {/* View limit */}
            <div className="view-limit">
                <Typography component='span' variant="body2">View</Typography>
                <select
                    value={AppStore.syncFusionGrid[gridOptions.instance].viewLimit.value || ''}
                    style={{
                        fontSize: '0.8rem',
                        width: '4rem',
                        marginLeft: '0.2rem',
                    }}
                    onChange={(e: any) => {
                        AppStore.syncFusionGrid[gridOptions.instance].viewLimit.value = e.target.value
                        emit('GENERIC-SYNCFUSION-GRID-LOAD-DATA' + gridOptions.instance, '')
                        // setRefresh({})
                    }}>
                    <option value={'100'}>100</option>
                    <option value={'1000'}>1000</option>
                    <option value={'0'}>All</option>
                </select>
            </div>

            {/* Reload */}
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

            {/* PDF export */}
            <Tooltip title='PDF export'>
                <IconButton
                    size="medium"
                    color='warning'
                    onClick={handlePdfExport}>
                    <FontAwesomeIcon icon={faFilePdf} size='sm' color="red" />
                </IconButton>
            </Tooltip>

            {/* Excel Export */}
            <Tooltip title='Excel export'>
                <IconButton
                    size="medium"
                    color='info'
                    onClick={handleExcelExport}>
                    <FontAwesomeIcon icon={faFileExcel} size='sm' color='dodgerBlue' />
                </IconButton>
            </Tooltip>
        </Box>

        {/* Search */}
        <Box display='flex' alignItems='center' >
            <SearchIcon fontSize="small" sx={{ mr: .5 }} />
            <TextBoxComponent value={AppStore.syncFusionGrid[gridOptions.instance].searchText.value} type='text' style={{ height: '30px', width: '100%' }} ref={textBoxRef} showClearButton={true} placeholder="Search" input={handleToolbarTextChanged} />
            <IconButton disabled={AppStore.syncFusionGrid[gridOptions.instance].searchText.value ? false : true} size="small" onClick={handleClear}>
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
        AppStore.syncFusionGrid[gridOptions.instance].searchText.value = e.value
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH' + gridOptions.instance, e.value)
    }

    function handleClear() {
        AppStore.syncFusionGrid[gridOptions.instance].searchText.value = ''
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
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
    itemSelectedAction?: (id: number) => void
    isDeleteDisabled?: boolean
    isEditDisabled?: boolean
}

export type AggrOptions = {
    field: string
    type: 'Average' | 'Count' | 'Sum' | 'Min' | 'Max'
    footerTemplate?: FC
    format?: 'N2' | 'N0'
}

export type ColumnOptions = {
    // allowFiltering?: boolean | undefined
    field: string
    format?: any
    headerText: string
    textAlign?: ColumnTextAlign
    type?: ColumnType
    width?: number
}

export type ColumnTextAlign = 'Center' | 'Justify' | 'Left' | 'Right'
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'datetime'

// function MyPdfIcon() {
//     return (<svg style={{ color: 'red' }}
//         xmlns="http://www.w3.org/2000/svg"
//         width="25" height="25" fill="currentColor"
//         className="bi bi-file-pdf"
//         viewBox="0 0 18 18">
//         <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="red"></path> <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" fill="red">
//         </path>
//     </svg>)
// }