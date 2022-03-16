import { _, CloseSharp, GridCellParams, IconButton, moment, MultiDataContext, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useStockSummaryAgeingReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()
    const multiData: any = useContext(MultiDataContext)

    const meta: any = useRef({
        allRows: [],
        dataPath: 'jsonResult.stock',
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
        origJsonData: {},
        parentRefresh: setRefresh,
        searchText: '',
        searchTextRef: null,
        selectedAgeingOption: { label: 'All stock', value: 0 },
        selectedRowsObject: {},
        sqlKey: 'getJson_stock_summary',
        subTitle: '',
        title: 'Stock summary with ageing',
        totals: {}
    })
    const pre = meta.current

    useEffect(() => {
        if (pre.isSearchTextEdited && pre.searchTextRef.current) {
            pre.searchTextRef.current.focus()
        }
    })

    useEffect(() => {
        multiData.generic.stockOnDate = moment().format('YYYY-MM-DD')
        pre.subTitle = getGridReportSubTitle()
        fetchData()
        const subs1 = debounceFilterOn('STOCK-SUMMARY-AGEING-DEBOUNCE').subscribe((d: any) => {
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
        pre.origJsonData = await execGenericView({
            isMultipleRows: false,
            sqlKey: pre.sqlKey,
            args: {
                onDate:
                    multiData?.generic?.stockOnDate
                    || null, days: pre.selectedAgeingOption.value || 0
            },
        }) || {}

        const rows: any[] = _.get(pre.origJsonData, pre.dataPath, []) || []
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

    function getAgeingOptions() {
        const ageing = [{
            label: 'All stock',
            value: 0
        },
        {
            label: 'Stock >= 90 days',
            value: 90
        },
        {
            label: 'Stock >= 180 days',
            value: 180
        },
        {
            label: 'Stock >= 270 days',
            value: 270
        },
        {
            label: 'Stock >= 360 days',
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
                field: 'label'
            },
            {
                headerName: 'Op Price',
                headerClassName: 'header-class',
                description: 'Opening price',
                field: 'openingPrice',
                type: 'number',
                width: 100,
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
                headerName: 'Clos',
                headerClassName: 'header-class',
                description: 'Closing',
                field: 'clos',
                type: 'number',
                width: 60,
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
                headerName: 'Pur price(Lst)',
                headerClassName: 'header-class',
                description: 'Last purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur dt(Lst)',
                headerClassName: 'header-class',
                description: 'Last purchase date',
                field: 'lastPurchaseDate',
                type: 'date',
                width: 90,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Sal dt(Lst)',
                headerClassName: 'header-class',
                description: 'Last sale date',
                field: 'lastSaleDate',
                type: 'date',
                width: 90,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Pr id',
                description: 'Product id',
                headerClassName: 'header-class',
                field: 'productId',
                type: 'number',
                width: 60,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                border: '4px solid orange',
                p: 1, width: '100%',
                fontSize: theme.spacing(1.5),
                minHeight: theme.spacing(80),
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
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
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
            prev.count++
            return (prev)
        }, {
            opValue: 0, op: 0, dr: 0, cr: 0, clos: 0, closValue: 0, count: 0
        })
        totals.id = 'Total'
        return (totals)
    }

    function handleAgeingOptionSelected(selectedOption: { label: string; value: string }) {
        pre.selectedAgeingOption = selectedOption
        fetchData()
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

    function removeRow(params: any) {
        const id = params.id
        const temp = [...pre.filteredRows]
        _.remove(temp, (x: any) => x.id === id)
        pre.filteredRows = temp
        pre.totals = getTotals()
        setRefresh({})
    }

    return ({ fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, meta, multiData, onSelectModelChange })
}

export { useStockSummaryAgeingReport }