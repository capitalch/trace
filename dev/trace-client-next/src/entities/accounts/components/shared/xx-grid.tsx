import { useStyles } from './xx-grid-hook'
import {_} from '../../../../imports/regular-imports'
import {Box,FormControlLabel,
    IconButton,  Typography,
    Button, TextField,
    Checkbox,} from '../../../../imports/gui-imports'
import { CloseIcon,
    DeleteIcon, SearchIcon,
    SyncIcon,
    EditIcon,} from '../../../../imports/icons-import'
// import {
//     DataGrid,
//     GridToolbarFilterButton,
//     GridToolbarExport,
//     GridToolbarContainer,
//     GridToolbarColumnsButton,
//     GridFooterContainer,
//     GridRowId,
//     GridRowData,
//     useGridApiRef,
//     GridCellParams,
// } from '@mui/x-data-grid'

import {
    DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    GridRowId,
    GridRowData,
    useGridApiRef,
    GridCellParams,
} from '@mui/x-data-grid-pro'

import { useSharedElements } from './shared-elements-hook'
import { useXXGrid } from './xx-grid-hook'

interface SpecialColumnOptions {
    isEdit?: boolean
    isDelete?: boolean
    isHide?: boolean
    isDrillDown?: boolean
    editIbukiMessage?: any
    deleteIbukiMessage?: any
    drillDownIbukiMessage?: any
}

interface XXGridOptions {
    autoFetchData?: boolean
    columns: any[]
    hideViewLimit?: boolean
    sqlQueryArgs?: any
    sqlQueryId?: any
    summaryColNames: string[]
    toShowClosingBalance?: boolean
    toShowColumnBalance?: boolean
    toShowDailySummary?: boolean
    toShowOpeningBalance?: boolean
    toShowReverseCheckbox?: boolean
    title: string
    specialColumns: SpecialColumnOptions
    xGridProps?: any
    jsonFieldPath?: any // if input is a json object then give the path of json field
}

function XXGrid(gridOptions: XXGridOptions) {
    const { columns, sqlQueryArgs, sqlQueryId, summaryColNames, title } =
        gridOptions
    const apiRef: any = useGridApiRef()
    const {
        fetchRows,
        fillColumnBalance,
        injectDailySummary,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        toggleReverseOrder,
    } = useXXGrid(gridOptions)
    const {
        emit,
        toDecimalFormat,
    } = useSharedElements()

    const classes = useStyles(meta)
    const specialColumns = gridOptions.specialColumns
    addSpecialColumns(specialColumns)

    return (

        <DataGridPro
            getRowClassName={(params: any) => {
                const summ = params.row.isDailySummary ? 'ledger-summary':''
                return (summ)
            }}
            className={classes.content}
            {...gridOptions.xGridProps}
            apiRef={apiRef}
            columns={columns}
            rows={meta.current.filteredRows}
            rowHeight={32}
            // autoHeight={true}
            // disableSelectionOnClick={true}
            components={{
                Toolbar: CustomGridToolbar,
                Footer: CustomGridFooter,
            }}
            checkboxSelection={true}
            componentsProps={{
                toolbar: {
                    value: meta.current.searchText,
                    onChange: (event: any) => requestSearch(event.target.value),
                    clearSearch: () => requestSearch(''),
                },
                footer: {
                    selectedSummary: meta.current.selectedSummary,
                    filteredSummary: meta.current.filteredSummary,
                    allSummary: meta.current.allSummary,
                },
            }}
            onSelectionModelChange={onSelectModelChange}
            showColumnRightBorder={true}
            showCellRightBorder={true}

            // onPageChange= {()=>{}}
            // onRowsPerPageChange={()=>{}}
        />
        // </div>
    )

    function CustomGridToolbar(props: any) {
        return (
            <GridToolbarContainer className="custom-toolbar">
                <Typography className="toolbar-title">{title}</Typography>
                <div>
                    <GridToolbarColumnsButton color="secondary" />
                    <GridToolbarFilterButton color="secondary" />
                    {/* <GridToolbarDensitySelector color="secondary" /> */}
                    <GridToolbarExport color="secondary" />
                </div>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                        onFilteredClick()
                        meta.current.isMounted && setRefresh({})
                    }}>
                    Filtered
                </Button>
                <IconButton
                    className={classes.syncIconButton}
                    size="medium"
                    color="secondary"
                    onClick={(e: any) => fetchRows(sqlQueryId, sqlQueryArgs)}>
                    <SyncIcon></SyncIcon>
                </IconButton>
                {!!!gridOptions.hideViewLimit && (
                    <div className="view-limit">
                        <span>View</span>
                        <select
                            value={meta.current.viewLimit}
                            style={{
                                fontSize: '0.8rem',
                                width: '4rem',
                                marginLeft: '0.1rem',
                            }}
                            onChange={(e) => {
                                meta.current.viewLimit = e.target.value
                                sqlQueryArgs['no'] =
                                    meta.current.viewLimit === '0'
                                        ? null
                                        : meta.current.viewLimit // null for all items in postgresql
                                fetchRows(sqlQueryId, sqlQueryArgs)
                                meta.current.isMounted && setRefresh({})
                            }}>
                            <option value={100}>100</option>
                            <option value={1000}>1000</option>
                            <option value={0}>All</option>
                        </select>
                    </div>
                )}
                {!!gridOptions.toShowReverseCheckbox && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={meta.current.isReverseOrder}
                                onChange={(e: any) => {
                                    meta.current.isReverseOrder =
                                        e.target.checked
                                        toggleReverseOrder()
                                }}
                            />
                        }
                        label="Reverse"
                    />
                )}
                {
                    (!!gridOptions.toShowDailySummary) && <FormControlLabel
                        control={
                            <Checkbox
                                checked={meta.current.isDailySummary}
                                onChange={(e: any) => {
                                    meta.current.isDailySummary = e.target.checked
                                    injectDailySummary()
                                }}
                            />
                        }
                        label="Daily summary"
                    />
                }
                {
                    ((!!gridOptions.toShowColumnBalance) && <FormControlLabel
                    control={
                        <Checkbox
                            checked={meta.current.isColumnBalance}
                            onChange={(e: any) => {
                                meta.current.isColumnBalance = e.target.checked
                                fillColumnBalance()
                            }}
                        />
                    }
                    label="Col balance"
                />)
                }

                {/* global filter */}
                <TextField
                    variant="standard"
                    autoFocus
                    value={props.value}
                    onChange={props.onChange}
                    placeholder="Search…"
                    className="global-search"
                    InputProps={{
                        startAdornment: <SearchIcon fontSize="small" />,
                        endAdornment: (
                            <IconButton
                                title="Clear"
                                aria-label="Clear"
                                size="small"
                                style={{
                                    visibility: props.value
                                        ? 'visible'
                                        : 'hidden',
                                }}
                                onClick={props.clearSearch}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        ),
                    }}
                />
            </GridToolbarContainer>
        )
    }

    function CustomGridFooter(props: any) {
        return (
            <GridFooterContainer className="custom-footer">
                <SelectedMarkup />
                <FilteredMarkup />
                <AllMarkup />
                {gridOptions.toShowClosingBalance && <ClosingBalanceMarkup />}
            </GridFooterContainer>
        )

        function SelectedMarkup() {
            return (
                <div className="common selected">
                    <div>
                        <b>Selected</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.selectedSummary['count']}</b>{' '}
                        &nbsp;&nbsp;{' '}
                    </div>
                    {SelectedCols()}
                </div>
            )
            function SelectedCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColNames.map((col: string) => {
                    return (
                        <div key={incr()}>
                            {col}{' '}
                            <b>{toDecimalFormat(props.selectedSummary[col])}</b>
                            &nbsp;&nbsp;
                        </div>
                    )
                })
            }
        }
        function ClosingBalanceMarkup() {
            return (
                <div style={{ display: 'flex' }}>
                    <div>
                        <b>Closing</b>&nbsp;
                    </div>
                    <div>
                        <b>
                            <ClosingBalance />
                        </b>
                    </div>
                </div>
            )
            function ClosingBalance() {
                const clos: number =
                    (props.allSummary['debit'] || 0.0) -
                    (props.allSummary['credit'] || 0.0)
                const absClos = toDecimalFormat(Math.abs(clos))
                const suffix = clos < 0 ? 'Cr' : 'Dr'

                return (
                    <div>
                        <span>{absClos}</span>&nbsp;
                        <span
                            style={{
                                color: suffix === 'Dr' ? 'inherit' : 'red',
                            }}>
                            {suffix}&nbsp;
                        </span>
                    </div>
                )
            }
        }

        function FilteredMarkup() {
            return (
                <div className="common filtered">
                    <div>
                        <b>Filtered</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.filteredSummary['count']}</b>{' '}
                        &nbsp;&nbsp;{' '}
                    </div>
                    {FilteredCols()}
                    {/* <FilteredCols /> */}
                </div>
            )
            function FilteredCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColNames.map((col: string) => {
                    return (
                        <div key={incr()}>
                            {col}{' '}
                            <b>{toDecimalFormat(props.filteredSummary[col])}</b>
                            &nbsp;&nbsp;
                        </div>
                    )
                })
            }
        }

        function AllMarkup() {
            return (
                <div className="common all">
                    <div>
                        <b>All</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.allSummary['count']}</b> &nbsp;&nbsp;{' '}
                    </div>
                    {AllCols()}
                    {/* <AllCols /> */}
                </div>
            )

            function AllCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColNames.map((col: string) => {
                    return (
                        <div key={incr()}>
                            {col}{' '}
                            <b>{toDecimalFormat(props.allSummary[col])}</b>
                            &nbsp;&nbsp;
                        </div>
                    )
                })
            }
        }
    }

    function onFilteredClick() {
        const rowsMap = apiRef.current.getVisibleRowModels()
        const arr: any[] = []
        rowsMap.forEach((value: GridRowData, key: GridRowId) => {
            arr.push(value)
        })
        const obj = arr.reduce((prev: any, current: any) => {
            prev.count = (prev.count || 0) + 1
            for (let col of summaryColNames) {
                prev[col] = (prev[col] || 0.0) + (current[col] || 0.0)
            }
            return prev
        }, {})

        _.isEmpty(obj)
            ? (meta.current.filteredSummary = {})
            : (meta.current.filteredSummary = obj)
        meta.current.isMounted && setRefresh({})
    }

    function addSpecialColumns(options: SpecialColumnOptions) {
        if (options.isDelete) {
            const deleteColumn = {
                headerName: 'D',
                description: 'Delete forever',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '2',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            size="small"
                            color="secondary"
                            className="delete"
                            onClick={() =>
                                options.deleteIbukiMessage &&
                                emit(options.deleteIbukiMessage, params)
                            }
                            aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    )
                },
            }
            columns.unshift(deleteColumn)
        }

        if (options.isEdit) {
            const editColumn = {
                headerName: 'E',
                description: 'Edit',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '1',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => {
                                options.editIbukiMessage &&
                                    emit(options.editIbukiMessage, params)
                            }}
                            aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    )
                },
            }
            columns.unshift(editColumn)
        }

        if (options.isHide) {
            const removeColumn = {
                headerName: 'H',
                description: 'Hide',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '0',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => removeRow(params)}
                            aria-label="hide">
                            <CloseIcon />
                        </IconButton>
                    )
                },
            }
            columns.unshift(removeColumn)
        }

        if (options.isDrillDown) {
            const drillDownColumn = {
                headerName: 'D',
                description: 'Drill down',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 20,
                field: '3',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                                emit(options.drillDownIbukiMessage, params)
                            }
                            aria-label="close">
                            <SearchIcon color="secondary" fontSize="small" />
                        </IconButton>
                    )
                },
            }
            columns.unshift(drillDownColumn)
        }

        function removeRow(params: any) {
            const id = params.id
            const temp = [...meta.current.filteredRows]
            _.remove(temp, (x: any) => x.id === id)
            meta.current.filteredRows = temp
            setFilteredSummary()
            meta.current.isMounted && setRefresh({})
        }
    }
}

export { XXGrid }