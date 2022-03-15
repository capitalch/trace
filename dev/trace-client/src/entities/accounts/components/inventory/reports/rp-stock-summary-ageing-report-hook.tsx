import { _, useEffect, useIbuki, useRef, useState, utils, utilMethods } from '../redirect'

function useStockSummaryAgeingReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
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
        sqlKey: 'getJson_stock_summary',
        sqlArgs: { date: '2021-12-30' },
        subTitle: '',
        title: 'Stock summary with ageing',
        // summaryPath: 'jsonResult.summary',
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
        const subs1 = debounceFilterOn('XXX').subscribe((d: any) => {
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
            args: pre.sqlArgs,
        }) || {}

        const rows: any[] = _.get(pre.origJsonData, pre.dataPath, [])
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
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'id',
                width: 60,
            },
            {
                headerName: 'Pr id',
                description: 'Product id',
                headerClassName: 'header-class',
                field: 'productId',
                width: 70,
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
            // {
            //     headerName: 'Pur Ret',
            //     field: 'purchaseRet',
            //     type: 'number',
            //     width: 60,
            // },
            // {
            //     headerName: 'Sal ret',
            //     field: 'saleRet',
            //     type: 'number',
            //     width: 60,
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
                headerName: 'Clos val',
                headerClassName: 'header-class',
                description: 'Closing value',
                field: 'closValue',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Lst pur price',
                headerClassName: 'header-class',
                description: 'Last purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Lst pur dt',
                headerClassName: 'header-class',
                description: 'Last purchase date',
                field: 'lastPurchaseDate',
                type: 'date',
                width: 90,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Lst sal dt',
                headerClassName: 'header-class',
                description: 'Last sale date',
                field: 'lastSaleDate',
                type: 'date',
                width: 90,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            }
        ])
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

    return ({ fetchData, getColumns, getRowClassName, meta })
}

export { useStockSummaryAgeingReport }