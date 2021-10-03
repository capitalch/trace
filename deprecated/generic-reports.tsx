import { useEffect } from 'react'
import { useGenericReports, useStyles } from './generic-reports-hook'
import {
    XGrid,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    GridRowId,
    GridRowData,
    useGridApiRef,
    GridCellParams,
} from '@material-ui/x-grid'

import { manageEntitiesState } from '../../../../../common-utils/esm'
import { utilMethods } from '../../../../../common-utils/util-methods'
import { useSharedElements } from '../../common/shared-elements-hook'

function GenericReports({ loadReport }: any) {
    const {
        args,
        columns,
        fetchRows,
        meta,
        onSelectModelChange,
        requestSearch,
        setFilteredSummary,
        setRefresh,
        sqlQueryId,
        summaryColumns,
        title,
    } = useGenericReports(loadReport)
    const apiRef = useGridApiRef()

    const { getCurrentEntity } = manageEntitiesState()
    const { toDecimalFormat } = utilMethods()
    // const entityName = getCurrentEntity()
    const {
        _,
        Button,
        Card,
        CloseIcon,
        DeleteIcon,
        EditIcon,
        emit,
        // NativeSelect,
        IconButton,
        SearchIcon,
        SyncIcon,
        TextField,
        Typography,
    } = useSharedElements()

    const classes = useStyles()

    useEffect(() => {
        // onFilteredClick()
    }, [meta.current.rowModels !== 0])

    addSpecialColumns({
        isRemove: true,
        isEdit: true,
        isDelete: true,
        isDrillDown: true,
    })

    return (
        <Card className={classes.content}>
            <XGrid
                apiRef={apiRef}
                columns={columns}
                rows={meta.current.filteredRows}
                rowHeight={32}
                // disableSelectionOnClick={true}
                components={{
                    Toolbar: CustomGridToolbar,
                    Footer: CustomGridFooter,
                }}
                checkboxSelection={true}
                componentsProps={{
                    toolbar: {
                        value: meta.current.searchText,
                        onChange: (event: any) =>
                            requestSearch(event.target.value),
                        clearSearch: () => requestSearch(''),
                    },
                    footer: {
                        selectedSummary: meta.current.selectedSummary,
                        filteredSummary: meta.current.filteredSummary,
                        allSummary: meta.current.allSummary,
                    },
                }}
                // onRowClick={onRowClick}
                onSelectionModelChange={onSelectModelChange}
                showColumnRightBorder={true}
                showCellRightBorder={true}
            />
        </Card>
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
                    onClick={(e: any) => fetchRows(sqlQueryId, args)}>
                    <SyncIcon></SyncIcon>
                </IconButton>
                <div className="view-limit">
                    <span>View</span>
                    <select
                        // value={getFromBag(loadComponent) || meta.current.no}
                        value={meta.current.viewLimit}
                        style={{
                            fontSize: '0.8rem',
                            width: '4rem',
                            marginLeft: '0.1rem',
                        }}
                        onChange={(e) => {
                            meta.current.viewLimit = e.target.value
                            args['no'] = (meta.current.viewLimit === '0')
                                ? null
                                : meta.current.viewLimit // null for all items in postgresql
                            fetchRows(sqlQueryId, args)
                            meta.current.isMounted && setRefresh({})
                            // setInBag(loadComponent, e.target.value)
                            // getData()
                        }}>
                        <option value={100}>100</option>
                        <option value={1000}>1000</option>
                        <option value={0}>All</option>
                    </select>
                </div>

                {/* </div> */}

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
                    <SelectedCols />
                </div>
            )
            function SelectedCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColumns.map((col: string) => {
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
                    <FilteredCols />
                </div>
            )
            function FilteredCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColumns.map((col: string) => {
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
                    <AllCols />
                </div>
            )
            function AllCols() {
                let k = 1
                function incr() {
                    return k++
                }
                return summaryColumns.map((col: string) => {
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
            for (let col of summaryColumns) {
                prev[col] = (prev[col] || 0.0) + (current[col] || 0.0)
            }
            return prev
        }, {})

        _.isEmpty(obj)
            ? (meta.current.filteredSummary = {})
            : (meta.current.filteredSummary = obj)
        meta.current.isMounted && setRefresh({})
    }

    interface SpecialColumnOptions {
        isEdit?: boolean
        isDelete?: boolean
        isRemove?: boolean
        isDrillDown?: boolean
        isEditMethos?: any
        isDeleteMethod?: any
        editIbukiMessage?: any
        deleteIbukiMessage?: any
        drillDownIbukiMessage?: any
    }
    function addSpecialColumns(options: SpecialColumnOptions) {
        if (options.isDelete) {
            const deleteColumn = {
                headerName: 'D',
                description: 'Delete from database',
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
                            onClick={() => emit(options.deleteIbukiMessage, '')}
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
                            onClick={() => emit(options.editIbukiMessage, '')}
                            aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    )
                },
            }
            columns.unshift(editColumn)
        }

        if (options.isRemove) {
            const removeColumn = {
                headerName: 'R',
                description: 'Remove without delete',
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
                            aria-label="close">
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
                            onClick={() => emit(options.drillDownIbukiMessage, '')}
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
export { GenericReports }
