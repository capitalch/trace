import { _, Box, CloseSharp, GridCellParams, IconButton, moment, Typography, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useStockSummaryReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()

    const meta: any = useRef({
        allRows: [],
        dataPath: 'jsonResult.stock',
        debounceMessage: 'STOCK-SUMMARY-DEBOUNCE',
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
        setRefresh: setRefresh,
        searchText: '',
        searchTextRef: null,
        selectedAgeingOption: { label: 'Age (all)', value: 0 },
        selectedRowsObject: {},
        selectedTagOption: { label: 'All', value: 0 },
        sqlKey: 'get_stock_summary',
        stockDate: moment().format('YYYY-MM-DD'),
        subTitle: '',
        title: 'Stock summary',
        totals: {}
    })
    const pre = meta.current

    useEffect(() => {
        if (pre.isSearchTextEdited && pre.searchTextRef.current) {
            pre.searchTextRef.current.focus()
        }
    })

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        fetchData()
        const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
            const requestSearch = d.data[0]
            const searchText = d.data[1]
            requestSearch(searchText)
        })
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
                onDate:
                    pre.stockDate
                    || null,
                days: pre.selectedAgeingOption.value || 0,
                isAll: false, // Only products having some transaction or OP bal are shown
                tagId: pre.selectedTagOption.value
            },
        }) || {}
        setId(pre.allRows)
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x })) //its faster
        pre.totals = getTotals() || {}
        pre.filteredRows.push(pre.totals)
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setId(rows: any[]) {
            let count = 1
            for (const row of rows) {
                row.id1 = row.id
                row.id = incr()
            }
            function incr() {
                return (count++)
            }
        }
    }

    function getAgeingOptions() {
        const ageing = [{
            label: 'Age (all)',
            value: 0
        },
        {
            label: 'Age >= 90 days',
            value: 90
        },
        {
            label: 'Age >= 180 days',
            value: 180
        },
        {
            label: 'Age >= 270 days',
            value: 270
        },
        {
            label: 'Age >= 360 days',
            value: 360
        }
        ]
        return (ageing)
    }

    function getColumns(): any[] {
        return ([
            {
                headerName: 'H',
                description: 'Hide',
                disableColumnMenu: true,
                disableExport: true,
                disableReorder: true,
                filterable: false,
                hideSortIcons: true,
                resizable: false,
                width: 10,
                field: '0',
                renderCell: (params: GridCellParams) => {
                    return (
                        <IconButton
                            title='Hide this row'
                            size="small"
                            color="primary"
                            onClick={() => removeRow(params)}
                            aria-label="hide">
                            <CloseSharp fontSize='small' />
                        </IconButton>
                    )
                },
            },

            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'id',
                width: 60,
            },
            {
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
            // valueGetter is provided so that the data is available in csv export
            {
                cellClassName: 'cell-class-padding',
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                renderCell: (params: any) => <Product params={params} />,
                valueGetter: (params: any) => `${params.row.catName} ${params.row.brandName} ${params.row.label}`,
                width: 200,
            },
            // {
            //     cellClassName: 'cell-class-padding',
            //     headerName: 'Details',
            //     headerClassName: 'header-class',
            //     description: 'Product details',
            //     field: 'info',
            //     renderCell: (params: any) => <ProductDetails params={params} />,
            //     width: 300,
            // },
            {
                headerName: 'Clos',
                headerClassName: 'header-class',
                description: 'Closing',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Gp',
                headerClassName: 'header-class',
                description: 'Gross profit',
                field: 'grossProfit',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Clos val',
                headerClassName: 'header-class',
                description: 'Closing value',
                field: 'closValue',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Age',
                headerClassName: 'header-class',
                description: 'Age of product sold',
                field: 'age',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Pur price',
                headerClassName: 'header-class',
                description: 'Last purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Op',
                headerClassName: 'header-class',
                description: 'Opening',
                field: 'op',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Debits',
                headerClassName: 'header-class',
                field: 'dr',
                type: 'number',
                width: 70,
            },
            {
                headerName: 'Credits',
                headerClassName: 'header-class',
                field: 'cr',
                type: 'number',
                width: 70,
            },
            {
                headerName: 'Op Price',
                headerClassName: 'header-class',
                description: 'Opening price',
                field: 'openingPrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Op value',
                headerClassName: 'header-class',
                field: 'opValue',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },

            {
                headerName: 'Pur date',
                headerClassName: 'header-class',
                description: 'Last purchase date',
                field: 'lastPurchaseDate',
                type: 'date',
                width: 95,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Sal date',
                headerClassName: 'header-class',
                description: 'Last sale date',
                field: 'lastSaleDate',
                type: 'date',
                width: 95,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                description: 'Purchase',
                headerName: 'Purchase',
                headerClassName: 'header-class',
                field: 'purchase',
                type: 'number',
                width: 70,
            },
            {
                description: 'Sale',
                headerName: 'Sale',
                headerClassName: 'header-class',
                field: 'sale',
                type: 'number',
                width: 70,
            },
            {
                description: 'Return (purchase)',
                headerName: 'Ret (purch)',
                headerClassName: 'header-class',
                field: 'purchaseRet',
                type: 'number',
                width: 90,
            },
            {
                description: 'Return (sale)',
                headerName: 'Ret (sale)',
                headerClassName: 'header-class',
                field: 'saleRet',
                type: 'number',
                width: 90,
            },
            {
                description: 'Stock journal debits',
                headerName: 'Dr (stk jrnl)',
                headerClassName: 'header-class',
                field: 'stockJournalDebits',
                type: 'number',
                width: 90,
            },
            {
                description: 'Stock journal credits',
                headerName: 'Cr (stk jrnl)',
                headerClassName: 'header-class',
                field: 'stockJournalCredits',
                type: 'number',
                width: 90,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                p: 1, width: '100%',
                fontSize: theme.spacing(1.8),
                minHeight: theme.spacing(80),
                height: 'calc(100vh - 230px)',
                fontFamily: 'Helvetica',
                '& .footer-row-class': {
                    backgroundColor: theme.palette.grey[300]
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .grid-toolbar': {
                    width: '100%',
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                },
                '& .row-jakar': {
                    color: 'dodgerBlue'
                },
                '& .row-negative-clos': {
                    color: theme.palette.error.dark
                },
                '& .cell-class-padding': {
                    // paddingTop: theme.spacing(0.5),
                    // paddingBottom: theme.spacing(.5),
                    // fontSize: theme.spacing(1.8),
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
        else if (row.age >= 360) {
            ret = 'row-jakar'
        } else if (row.clos < 0) {
            ret = 'row-negative-clos'
        }
        return (ret)
    }

    function getTotals() {
        const rows: any[] = pre.filteredRows
        const totals = rows.reduce((prev: any, curr: any, index: number) => {
            prev.op = prev.op + curr.op
            prev.opValue = prev.opValue + curr.opValue
            prev.dr = prev.dr + curr.dr
            prev.cr = prev.cr + curr.cr
            prev.clos = prev.clos + curr.clos
            prev.closValue = prev.closValue + curr.closValue
            prev.grossProfit = prev.grossProfit + curr.grossProfit
            prev.count++
            return (prev)
        }, {
            opValue: 0, op: 0, dr: 0, cr: 0, clos: 0, closValue: 0, count: 0, grossProfit:0
        })
        totals.id = 'Total'
        return (totals)
    }

    function handleAgeingOptionSelected(selectedOption: { label: string; value: string }) {
        pre.selectedAgeingOption = selectedOption
        fetchData()
    }

    async function handleSelectedTagOption(selectedTagOption: any) {
        pre.selectedTagOption = selectedTagOption
        await fetchData()
        setRefresh({})
    }

    function handleTrim() {
        pre.filteredRows = pre.filteredRows.filter((x:any)=>(x.clos !==0))
        setRefresh({})
    }

    function onSelectModelChange(rowIds: any) {
        const rows = pre.allRows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count ? prev.count + 1 : 1
            prev.closValue = (prev.closValue || 0) + (rows[current - 1]?.closValue || 0)
            return prev
        }, {})
        pre.selectedRowsObject = _.isEmpty(obj) ? {} : obj
        setRefresh({})
    }

    function Product({ params }: any) {
        return (
            <Box sx={{overflow: 'clip'}}>
                {params.row.catName && <Typography component='span' sx={{ fontSize: theme.spacing(1.7) }}>{params.row.catName}</Typography>}
                <Typography component='span' sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>&nbsp;{params.row.brandName}</Typography>
                {params.row.label && <Typography component='span' sx={{  fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.label}</Typography>}
            </Box>
        )
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        )
    }

    function removeRow(params: any) {
        const id = params.id
        if (id === 'Total') { // The row with totals cannot be removed
            return
        }
        const temp = [...pre.filteredRows]
        _.remove(temp, (x: any) => x.id === id)
        pre.filteredRows = temp
        pre.filteredRows.pop()
        pre.totals = getTotals()
        pre.filteredRows.push(pre.totals)
        setRefresh({})
    }

    return ({ fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected,handleSelectedTagOption, handleTrim, meta, onSelectModelChange })
}

export { useStockSummaryReport }