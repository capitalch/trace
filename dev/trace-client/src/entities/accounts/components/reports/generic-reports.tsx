import { useEffect, useState, useRef } from 'react'
// import MaterialTable from 'material-table'
import {
    // escapeRegExp,
    XGrid,
    GridApi,
    GridToolbar,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooter,
    GridFooterContainer,
    useGridApiRef,
    GridRowId,
    GridRowData,
} from '@material-ui/x-grid'
// import { escapeRegExp,} from '@material-ui/data-grid'

import { Theme, createStyles, makeStyles, Box, Button } from '@material-ui/core'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import { useSharedElements } from '../common/shared-elements-hook'
import { useAllTransactions } from './helpers/all-transactions'
// import { GridRowData, useGridSlotComponentProps } from '@material-ui/data-grid'

function GenericReports({ loadReport }: any) {
    const [, setRefresh] = useState({})
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const meta: any = useRef({
        filteredRows: [],
        filteredSummary: {
            count: 0,
            debit: 0,
            credit: 0,
        },
        totalSummary: {
            count: 0,
            debits: 0,
            credits: 0,
        },
        isMounted: false,
        rows: [],
        selectedSummary: {
            count: 0,
            debits: 0,
            credits: 0,
        },
        searchText: '',
        selectedRowsCount: 0,
        selectedTotal: 0,
    })
    const { args, columns, sqlQueryId, title } = selectLogic[loadReport]()
    const apiRef = useGridApiRef()
    // const { getCurrentWindowSize } = useTraceGlobal()
    const { getCurrentEntity } = manageEntitiesState()
    const { execGenericView, toDecimalFormat } = utilMethods()
    const entityName = getCurrentEntity()
    const {
        _,
        Card,
        CloseIcon,
        emit,
        getFromBag,
        NativeSelect,
        IconButton,
        SearchIcon,
        TextField,
        Typography,
    } = useSharedElements()
    // const dateFormat = getFromBag('dateFormat')
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        fetchRows(sqlQueryId, args)

        return () => {
            meta.current.isMounted = false
        }
    }, [])

    console.log('rendered')

    return (
        <Card className={classes.content}>
            <XGrid
                apiRef={apiRef}
                columns={columns}
                rows={meta.current.filteredRows}
                rowHeight={32}
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
                        totalSummary: meta.current.totalSummary,
                    },
                }}
                onRowClick={onRowClick}
                onSelectionModelChange={onSelectModelChange}
                // onFilterModelChange={onFilterModelChange}
                showColumnRightBorder={true}
                showCellRightBorder={true}
            />
        </Card>
    )

    function requestSearch(searchValue: string) {
        // setSearchText(searchValue)
        meta.current.searchText = searchValue
        const searchRegex = new RegExp(searchValue, 'i')
        const filteredRows = meta.current.rows.filter((row: any) => {
            return Object.keys(row).some((field) => {
                const temp = row[field] ? row[field].toString() : ''
                // return searchRegex.test(row[field].toString())
                return searchRegex.test(temp)
            })
        })
        meta.current.filteredRows = filteredRows
        meta.current.isMounted && setRefresh({})
        // setRows(meta.current.filteredRows)
    }

    function onSelectModelChange(rowIds: any) {
        const rows = meta.current.rows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count ? prev.count + 1 : 1
            prev.debits = prev.debits
                ? prev.debits + rows[current - 1].debit
                : rows[current - 1].debit || 0.0
            prev.credits = prev.credits
                ? prev.credits + rows[current - 1].credit
                : rows[current - 1].credit || 0.0
            return prev
        }, {})

        meta.current.selectedSummary = _.isEmpty(obj)
            ? { count: 0, debits: 0.0, credits: 0.0 }
            : obj

        meta.current.isMounted && setRefresh({})
    }

    function onFilteredClick() {
        const rowsMap = apiRef.current.getVisibleRowModels()
        const arr: any[] = []
        rowsMap.forEach((value: GridRowData, key: GridRowId) => {
            arr.push(value)
        })
        const obj = arr.reduce((prev: any, current: any) => {
            // prev.count = prev.count || 0
            // prev.debit = prev.debit || 0.00
            // prev.credit = prev.credit || 0.00
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

    function onRowClick(e: any, f: any) {
        console.log(meta.current)
        console.log('Filter count:', apiRef.current.getVisibleRowModels())
    }

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
                    onClick={onFilteredClick}>
                    Filtered
                </Button>
                {/* <div> */}
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
                <div style={{ display: 'flex' }}>
                    <div>Selected: </div>
                    <div> Rows: {props.selectedSummary.count}, </div>
                    <div>
                        {' '}
                        Debits: {toDecimalFormat(
                            props.selectedSummary.debits
                        )},{' '}
                    </div>
                    <div>
                        {' '}
                        Credits:{' '}
                        {toDecimalFormat(props.selectedSummary.credits)}
                    </div>
                </div>
                {/* Filtered */}
                <div style={{ display: 'flex' }}>
                    <div>Filtered: </div>
                    <div> Rows: {props.filteredSummary.count}, </div>
                    <div>
                        {' '}
                        Debits: {toDecimalFormat(
                            props.filteredSummary.debit
                        )},{' '}
                    </div>
                    <div>
                        {' '}
                        Credits: {toDecimalFormat(props.filteredSummary.credit)}
                    </div>
                </div>

                {/* Total */}
                <div style={{ display: 'flex' }}>
                    <div>Total: </div>
                    <div> Rows: {props.totalSummary.count}, </div>
                    <div>
                        {' '}
                        Debits: {toDecimalFormat(
                            props.totalSummary.debits
                        )},{' '}
                    </div>
                    <div>
                        {' '}
                        Credits: {toDecimalFormat(props.totalSummary.credits)}
                    </div>
                </div>

                {/* <span>Selected rows count:{props.selectedRowsCount}</span>
                <span>Count of rows:{props?.totalSummary?.count}</span>
                <span>Total debits:{props?.totalSummary?.debits}</span>
                <span>Total credits:{props?.totalSummary?.credits}</span> */}
            </GridFooterContainer>
        )
    }

    async function fetchRows(queryId: string, arg: any) {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret: any[] = await execGenericView({
            isMultipleRows: true,
            sqlKey: queryId,
            args: arg,
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        let i = 1
        function incr() {
            return i++
        }
        const tot = {
            debits: 0,
            credits: 0,
            count: 0,
        }
        const temp: any[] = ret.map((x: any) => {
            x['id1'] = x.id
            x.id = incr()
            tot.debits = tot.debits + x.debit
            tot.credits = tot.credits + x.credit
            return x
        })
        tot.count = ret?.length
        if (ret) {
            meta.current.rows = temp
            meta.current.filteredRows = [...meta.current.rows]
            meta.current.totalSummary = tot
            meta.current.isMounted && setRefresh({})
        }
    }
}
export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 163px)',
            width: '100%',
            marginTop: '5px',
            '& .custom-toolbar': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: '1.5rem',
                borderBottom: '1px solid lightgrey',
                '& .toolbar-title': {
                    color: 'dodgerblue',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                },
                '& .global-search': {
                    marginLeft: 'auto',
                    marginRight: '1rem',
                },
            },
            '& .custom-footer': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                justifyContent: 'flexStart',
            },
            // '& .select': {
            //     fontSize: '0.8rem',
            //     minWidth: '4rem',
            // },
        },
    })
)

// <div className="custom-toolbar">
//     <Typography className='toolbar-title'>{title}</Typography>
//     <GridToolbar />
//     <Box className='toolbar-selected-summary'>
//         <Typography color='secondary'>Selected debits:</Typography>
//         <Typography color='secondary'>Selected credits:</Typography>
//     </Box>
//     <CustomRowCounter />
// </div>
// function MyText() {
//     const [myText, setMyText] = useState('')
//     return (
//         <TextField
//             value={myText}
//             onChange={
//                 (e: any) => {
//                     meta.current.searchText = e.target.value
//                     // meta.current.isMounted && setRefresh({})
//                     setMyText(e.target.value)
//                     meta.current.isMounted && setRefresh({})
//                     // meta.current.myText = e.target.value
//                     // meta.current.isMounted && setRefresh({})
//                 }
//             }
//         />
//     )
// }
