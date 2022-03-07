import { useStyles } from './xx-grid-hook'
import { _, clsx, useRef } from '../imports/regular-imports'
import {
    FormControlLabel,
    IconButton,
    Typography,
    Box,
    Button,
    TextField,
    Checkbox,
} from '../imports/gui-imports'
import {
    CloseSharp,
    CheckBoxOutlineBlankSharp,
    CheckBoxOutlined,
    DeleteForever,
    Search,
    SyncSharp,
    Edit,
} from '../imports/icons-import'
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

import { useXXGrid } from './xx-grid-hook'
import { useIbuki, useTraceGlobal, utilMethods } from '../imports/trace-imports'

interface SpecialColumnOptions {
    isEdit?: boolean
    isDelete?: boolean
    isHide?: boolean
    isDrillDown?: boolean
    drillDownIbukiMessage?: any
    customColumn1?: any //CustomColumnOptions
}

interface GridActionMessagesOptions {
    addIbukiMessage?: any
    calculateBalanceIbukiMessage?: any
    fetchIbukiMessage?: any
    editIbukiMessage?: any
    justRefreshIbukiMessage?: any
    deleteIbukiMessage?: any
    drillDownIbukiMessage?: any
    resetIbukiMessage?: any
    onDataFetchedIbukiMessage?: any
}

interface XXGridOptions {
    autoFetchData?: boolean
    className?: string
    columns: any[]
    disableSelectionOnClick?: boolean
    editableFields?: string[]
    gridActionMessages?: GridActionMessagesOptions
    hideViewLimit?: boolean

    hideColumnsButton?: boolean
    hideFiltersButton?: boolean
    hideExportButton?: boolean
    hideFilteredButton?: boolean

    isReverseOrderByDefault?: boolean // does reverse of data at fetching
    isReverseOrderChecked?: boolean // does not do reversing of data. Only makes the reverse checkbox as checked
    isShowColBalanceByDefault?: boolean
    jsonFieldPath?: any // if input is a json object then give the path of json field
    postFetchMethod?: any // method to call after fetching of data
    sharedData?: any // data shared with parent
    sqlQueryArgs?: any
    sqlQueryId?: any
    specialColumns: SpecialColumnOptions
    subTitle?: string
    summaryColNames: string[]
    sx?: any
    title?: string
    toShowAddButton?: boolean
    toShowClosingBalance?: boolean
    toShowColumnBalanceCheckBox?: boolean
    toShowDailySummary?: boolean
    toShowOpeningBalance?: boolean
    toShowReverseCheckbox?: boolean
    viewLimit?: string
    xGridProps?: any
}

function XXGrid(gridOptions: XXGridOptions) {
    const {
        className,
        gridActionMessages,
        columns,
        disableSelectionOnClick,
        specialColumns,
        sqlQueryArgs,
        sqlQueryId,
        summaryColNames,
        sx,
        title,
        viewLimit,
    }: any = gridOptions
    let { subTitle } = gridOptions
    const apiRef: any = useGridApiRef()

    gridOptions.sharedData && (gridOptions.sharedData.apiRef = apiRef)
    const {
        fetchRows,
        fillColumnBalance,
        injectDailySummary,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        toggleOrder,
    } = useXXGrid(gridOptions)
    meta.current.searchTextRef = useRef() // To set focus to search box after refresh
    // meta.current.dummyRefFirstTime = useRef()
    const { debounceEmit, emit } = useIbuki()
    const { isMediumSizeDown } = useTraceGlobal()
    const { toDecimalFormat } = utilMethods()
    meta.current.viewLimit = meta.current.viewLimit || viewLimit || 0
    meta.current.isMediumSizeDown = isMediumSizeDown
    const classes = useStyles(meta)
    addSpecialColumns(specialColumns, gridActionMessages)

    return (
        <DataGridPro
            getRowClassName={(params: any) => {
                const summ = params.row.isDailySummary ? 'ledger-summary' : ''
                return summ
            }}
            disableSelectionOnClick={disableSelectionOnClick || true}
            className={clsx(className || '', classes.content)}
            {...gridOptions.xGridProps}
            apiRef={apiRef}
            sx={sx}
            columns={columns}
            rows={meta.current.filteredRows}
            rowHeight={32}
            disableColumnMenu={true}
            components={{
                Toolbar: CustomGridToolbar,
                Footer: CustomGridFooter,
                BooleanCellFalseIcon: CheckBoxOutlineBlankSharp,
                BooleanCellTrueIcon: CheckBoxOutlined
            }}
            checkboxSelection={true}
            componentsProps={{
                toolbar: {
                    value: meta.current.searchText,
                    onChange: (event: any) => {
                        meta.current.searchText = event.target.value
                        meta.current.isSearchTextEdited = true // For not to setfocus search box first time. Otherwise mobit edit pad occurs which takes lot of screen space. Only on click of search box the focus happens
                        meta.current.isMounted && setRefresh({})
                        debounceEmit(
                            'XX-GRID-SEARCH-DEBOUNCE',
                            event.target.value
                        )
                    },
                    clearSearch: () => {
                        meta.current.searchText = ''
                        requestSearch('')
                    },
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
        />
    )

    function CustomGridToolbar(props: any) {
        return (
            <GridToolbarContainer className='custom-toolbar'>
                <Box className='sub-title'>
                    <Typography variant='subtitle2'>{subTitle}</Typography>
                </Box>
                <Box className='main-container'>
                    <Box className="toolbar-left-items">
                        <Typography className="toolbar-title">{title}</Typography>
                        <div>
                            {gridOptions.hideColumnsButton ? undefined : <GridToolbarColumnsButton color="secondary" />}
                            {gridOptions.hideFiltersButton ? undefined : <GridToolbarFilterButton color="secondary" />}
                            {gridOptions.hideExportButton ? undefined : <GridToolbarExport color="secondary" />}
                        </div>

                        {gridOptions.hideFilteredButton ? undefined : <Button
                            variant="text"
                            color="secondary"
                            onClick={() => {
                                onFilteredClick()
                                meta.current.isMounted && setRefresh({})
                            }}>
                            Filtered
                        </Button>}
                        <IconButton
                            className={classes.syncSharpButton}
                            size="medium"
                            color="secondary"
                            onClick={(e: any) => {
                                emit(
                                    gridOptions.gridActionMessages
                                        ?.fetchIbukiMessage,
                                    null
                                )
                            }}>
                            <SyncSharp></SyncSharp>
                        </IconButton>
                        {!!!gridOptions.hideViewLimit && (
                            <div className="view-limit">
                                <span>View</span>
                                <select
                                    value={meta.current.viewLimit || null}
                                    style={{
                                        fontSize: '0.8rem',
                                        width: '4rem',
                                        marginLeft: '0.1rem',
                                    }}
                                    onChange={(e: any) => {
                                        meta.current.viewLimit = e.target.value
                                        fetchRows(sqlQueryId, sqlQueryArgs)
                                        meta.current.isMounted && setRefresh({})
                                    }}>
                                    <option value={'100'}>100</option>
                                    <option value={'1000'}>1000</option>
                                    <option value={'0'}>All</option>
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
                                            toggleOrder()
                                            meta.current.isMounted && setRefresh({})
                                        }}
                                    />
                                }
                                label="Reverse"
                            />
                        )}
                        {!!gridOptions.toShowDailySummary && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={meta.current.isDailySummary}
                                        onChange={(e: any) => {
                                            meta.current.isDailySummary =
                                                e.target.checked
                                            injectDailySummary()
                                        }}
                                    />
                                }
                                label="Daily summary"
                            />
                        )}
                        {!!gridOptions.toShowColumnBalanceCheckBox && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={meta.current.isColumnBalance}
                                        onChange={(e: any) => {
                                            meta.current.isColumnBalance =
                                                e.target.checked
                                            fillColumnBalance()
                                            meta.current.isMounted && setRefresh({})
                                        }}
                                    />
                                }
                                label="Col balance"
                            />
                        )}
                    </Box>
                    <Box className='toolbar-right-items'>
                        {!!gridOptions.toShowAddButton && (
                            <Button
                                className="add-button"
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() =>
                                    emit(
                                        gridOptions.gridActionMessages
                                            ?.addIbukiMessage,
                                        null
                                    )
                                }>
                                Add
                            </Button>
                        )}

                        {/* global filter */}
                        <TextField
                            inputRef={meta.current.searchTextRef}
                            variant="standard"
                            autoComplete='off'
                            // autoFocus={!meta.current.isFirstTime}
                            value={props.value}
                            onChange={props.onChange}
                            placeholder="Search…"
                            className="global-search"
                            InputProps={{
                                startAdornment: <Search fontSize="small" />,
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
                                        <CloseSharp fontSize="small" />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Box>
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
                                marginRight: '0.2rem',
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

    function addSpecialColumns(
        options: SpecialColumnOptions,
        gridActionMessages: GridActionMessagesOptions
    ) {

        if (options.customColumn1 && (!_.isEmpty(options.customColumn1))) {
            const cc = options.customColumn1
            const customColumn1 = {
                ...cc
            }
            columns.push(customColumn1)
        }

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
                                gridActionMessages.deleteIbukiMessage &&
                                emit(
                                    gridActionMessages.deleteIbukiMessage,
                                    params
                                )
                            }
                            aria-label="Delete">
                            <DeleteForever />
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
                disableExport: true, disablePrint: true,
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
                                gridActionMessages.editIbukiMessage &&
                                    emit(
                                        gridActionMessages.editIbukiMessage,
                                        params
                                    )
                            }}
                            aria-label="Edit">
                            <Edit />
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
                            <CloseSharp />
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
                            <Search color="secondary" fontSize="small" />
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
