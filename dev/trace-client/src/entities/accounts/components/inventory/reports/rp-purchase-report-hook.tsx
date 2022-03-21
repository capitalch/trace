import { _, CloseSharp, GridCellParams, IconButton, manageEntitiesState, moment, MultiDataContext, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function usePurchaseReport(){
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()
    const multiData: any = useContext(MultiDataContext)
    const { getFromBag } = manageEntitiesState()
    const finYearObject = getFromBag('finYearObject')
    const isoFormat = 'YYYY-MM-DD'

    const meta: any = useRef({
        allRows: [],
        debounceMessage: 'SALES-REPORT-SEARCH-DEBOUNCE',
        endDate: moment().format(isoFormat),
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
        searchText: '',
        searchTextRef: null,
        selectedOption: { label: 'Today', value: 'today' },
        setRefresh: setRefresh,
        sqlKey: 'get_sale_report',
        startDate: moment().format(isoFormat),
        subTitle: '',
        title: 'Sales',
        totals: {},
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
        let count = 1
        emit('SHOW-LOADING-INDICATOR', true)
        const rows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
                startDate: pre.startDate,
                endDate: pre.endDate
            },
        }) || []
        setId(rows)
        pre.allRows = rows
        pre.filteredRows = rows.map((x: any) => ({ ...x })) //its faster
        pre.totals = getTotals() || {}
        pre.filteredRows.push(pre.totals)
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})

        function setId(rows: any[]) {
            for (const row of rows) {
                row.id1 = row.id
                row.id = incr()
            }
            function incr() {
                return (count++)
            }
        }
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
                headerName: 'Sale date',
                headerClassName: 'header-class',
                description: 'Sale date',
                field: 'tranDate',
                type: 'date',
                width: 90,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
            {
                headerName: 'Category',
                headerClassName: 'header-class',
                field: 'catName'
            },
            {
                headerName: 'Brand',
                headerClassName: 'header-class',
                field: 'brandName'
            },
            {
                headerName: 'Label',
                headerClassName: 'header-class',
                field: 'label',
                width: 110
            },
            {
                headerName: 'Qty',
                headerClassName: 'header-class',
                description: 'Qty',
                field: 'qty',
                type: 'number',
                width: 40,
            },
            {
                headerName: 'Sale Price',
                headerClassName: 'header-class',
                description: 'Sale price',
                field: 'price',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Aggr sale',
                headerClassName: 'header-class',
                description: 'Aggregate sale',
                field: 'aggrSale',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale with gst',
                headerClassName: 'header-class',
                description: 'Sale with gst',
                field: 'amount',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Profit(GP)',
                headerClassName: 'header-class',
                description: 'Gross profit',
                field: 'grossProfit',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur Price',
                headerClassName: 'header-class',
                description: 'Purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Gst%',
                headerClassName: 'header-class',
                description: 'Gst rate',
                field: 'gstRate',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Cgst',
                headerClassName: 'header-class',
                description: 'Cgst',
                field: 'cgst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sgst',
                headerClassName: 'header-class',
                description: 'Sgst',
                field: 'sgst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Igst',
                headerClassName: 'header-class',
                description: 'Igst',
                field: 'igst',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Type',
                headerClassName: 'header-class',
                field: 'saleType',
                width: 60
            },
            {
                headerName: 'Pr id',
                description: 'Product id',
                headerClassName: 'header-class',
                field: 'productId',
                type: 'number',
                width: 80,
            },
        ])

        function removeRow(params: any) {
            const id = params.id
            const temp = [...pre.filteredRows]
            _.remove(temp, (x: any) => x.id === id)
            pre.filteredRows = temp
            pre.totals = getTotals()
            setRefresh({})
        } 
    }

    function getGridSx() {
        return (
            {
                p: 1, width: '100%',
                fontSize: theme.spacing(1.5),
                minHeight: theme.spacing(60),
                height: 'calc(100vh - 230px)',
                fontFamily: 'sans-serif',
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
                    paddingBottom: theme.spacing(0.5),
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                },
                '& .row-sales-return': {
                    color:theme.palette.blue.light
                },
                '& .row-loss': {
                    color: theme.palette.error.main
                }
            }
        )
    }

    function getTotals() {
        const rows: any[] = pre.filteredRows
        const totals = rows.reduce((prev: any, curr: any, index: number) => {
            prev.qty = prev.qty + curr.qty
            prev.cgst = prev.cgst + curr.cgst
            prev.sgst = prev.sgst + curr.sgst
            prev.igst = prev.igst + curr.igst
            prev.amount = prev.amount + curr.amount
            prev.aggrSale = prev.aggrSale + curr.aggrSale
            prev.grossProfit = prev.grossProfit + curr.grossProfit
            prev.count++
            return (prev)
        }, { qty: 0, aggrSale: 0, cgst: 0, sgst: 0, igst: 0, amount: 0, grossProfit: 0, count: 0 })
        totals.id = 'Total'
        return (totals)
    }

    return ({ fetchData, getColumns, getGridSx, 
        // getSalesPeriodOptions, getRowClassName, handleOptionSelected, 
        meta, multiData, 
        // onSelectModelChange 
    })
}
export {usePurchaseReport}