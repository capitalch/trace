import { useEffect, useState } from 'react'
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
import { RowingSharp } from '@material-ui/icons'

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
        title,
    } = useGenericReports(loadReport)
    const apiRef = useGridApiRef()

    const { getCurrentEntity } = manageEntitiesState()
    const { toDecimalFormat } = utilMethods()
    const entityName = getCurrentEntity()
    const {
        _,
        Button,
        Card,
        CloseIcon,
        DeleteIcon,
        EditIcon,
        NativeSelect,
        IconButton,
        SearchIcon,
        SyncIcon,
        TextField,
        Typography,
    } = useSharedElements()

    const classes = useStyles()

    console.log('rendered')

    useEffect(() => {
        // onFilteredClick()
    }, [meta.current.rowModels !== 0])

    addSpecialColumns({ isRemove: true, isEdit: true, isDelete: true })

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
                    <GridToolbarDensitySelector color="secondary" />
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
                <span>Last</span>
                <NativeSelect
                    // value={getFromBag(loadComponent) || meta.current.no}
                    value={10}
                    style={{
                        fontSize: '0.8rem',
                        width: '3.3rem',
                        marginLeft: '0.1rem',
                    }}
                    // onChange={(e) => {
                    //     setInBag(loadComponent, e.target.value)
                    //     getData()
                    // }}
                >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={0}>All</option>
                </NativeSelect>
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
                {/* Selected */}
                <div className="common selected">
                    <div>
                        <b>Selected</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.selectedSummary.count}</b> &nbsp;&nbsp;{' '}
                    </div>
                    <div>
                        debit{' '}
                        <b>{toDecimalFormat(props.selectedSummary.debit)}</b>
                        &nbsp;&nbsp;
                    </div>
                    <div>
                        credit{' '}
                        <b>{toDecimalFormat(props.selectedSummary.credit)}</b>
                    </div>
                </div>

                {/* Filtered */}
                <div className="common filtered">
                    <div>
                        <b>Filtered</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.filteredSummary.count}</b> &nbsp;&nbsp;{' '}
                    </div>
                    <div>
                        debit{' '}
                        <b>{toDecimalFormat(props.filteredSummary.debit)}</b>
                        &nbsp;&nbsp;
                    </div>
                    <div>
                        credit{' '}
                        <b>{toDecimalFormat(props.filteredSummary.credit)}</b>
                    </div>
                </div>

                {/* All */}
                <div className="common all">
                    <div>
                        <b>All</b> &nbsp;
                    </div>
                    <div>
                        count <b>{props.allSummary.count}</b> &nbsp;&nbsp;{' '}
                    </div>
                    <div>
                        debit <b>{toDecimalFormat(props.allSummary.debit)}</b>
                        &nbsp;&nbsp;
                    </div>
                    <div>
                        credit <b>{toDecimalFormat(props.allSummary.credit)}</b>
                    </div>
                </div>
            </GridFooterContainer>
        )
    }

    function onFilteredClick() {
        const rowsMap = apiRef.current.getVisibleRowModels()
        const arr: any[] = []
        rowsMap.forEach((value: GridRowData, key: GridRowId) => {
            arr.push(value)
        })
        const obj = arr.reduce((prev: any, current: any) => {
            prev.count = (prev.count || 0) + 1
            prev.debit = (prev.debit || 0.0) + (current.debit || 0.0)
            prev.credit = (prev.credit || 0.0) + (current.credit || 0.0)
            return prev
        }, {})
        _.isEmpty(obj)
            ? (meta.current.filteredSummary = { count: 0, debit: 0, credit: 0 })
            : (meta.current.filteredSummary = obj)
        meta.current.isMounted && setRefresh({})
    }

    interface SpecialColumnOptions {
        isEdit?: boolean
        isDelete?: boolean
        isRemove?: boolean
        isEditMethos?: any
        isDeleteMethod?: any
    }
    function addSpecialColumns(options: SpecialColumnOptions) {
        if (options.isDelete) {
            const deleteColumn = {
                headerName: 'D',
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
                            onClick={() => removeRow(params)}
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
                            onClick={() => removeRow(params)}
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

        function removeRow(params: any) {
            const id = params.id
            const temp = [...meta.current.filteredRows]
            _.remove(temp,(x:any)=>x.id === id)
            // meta.current.filteredRows = temp                       
            // setFilteredSummary()
            // meta.current.isMounted && setRefresh({})
        }
    }
}
export { GenericReports }
