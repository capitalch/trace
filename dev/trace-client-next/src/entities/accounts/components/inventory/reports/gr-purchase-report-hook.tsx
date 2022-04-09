import { _, CloseSharp, GridCellParams, IconButton, manageEntitiesState, moment, MultiDataContext, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function usePurchaseReport() {
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
        debounceMessage: 'PURCHASE-REPORT-SEARCH-DEBOUNCE',
        endDate: moment().endOf('month').format(isoFormat),
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
        searchText: '',
        searchTextRef: null,
        selectedOption: { label: 'thisMonth', value: 'thisMonth' },
        setRefresh: setRefresh,
        sqlKey: 'get_purchase_report',
        startDate: moment().startOf('month').format(isoFormat),
        subTitle: '',
        title: 'Purchases',
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
                width: 65,
            },
            {
                headerName: 'Pur date',
                headerClassName: 'header-class',
                description: 'Purchase date',
                field: 'tranDate',
                type: 'date',
                width: 95,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Ref no',
                headerClassName: 'header-class',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 145,
            },
            {
                headerName: 'Invoice no',
                headerClassName: 'header-class',
                description: 'Invoice no',
                field: 'userRefNo',
                width: 140,
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
                width: 120
            },
            {
                headerName: 'Qty',
                headerClassName: 'header-class',
                description: 'Qty',
                field: 'qty',
                type: 'number',
                width: 45,
            },
            {
                headerName: 'Pur Price',
                headerClassName: 'header-class',
                description: 'Purchase price',
                field: 'price',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Aggr pur',
                headerClassName: 'header-class',
                description: 'Aggregate purchase',
                field: 'aggrPurchase',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur with gst',
                headerClassName: 'header-class',
                description: 'Purchase with gst',
                field: 'amount',
                type: 'number',
                width: 130,
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
                field: 'purchaseType',
                width: 80
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
                fontSize: theme.spacing(1.7),
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
                '& .row-return': {
                    color: theme.palette.blue.light
                },
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
        else if (row.tranTypeId === 10) {
            ret = 'row-return'            
        }
        return (ret)
    }

    function getPurchasePeriodOptions() {
        const periods: { label: string; value: any }[] = [{ label: 'All', value: 'all' }, { label: 'Today', value: 'today' }, { label: 'Prev day', value: 'prevDay' }, { label: 'This month', value: 'thisMonth' }, { label: 'Prev month', value: 'prevMonth' }]
        const months: { label: string; value: any }[] = [{ label: 'April', value: 4 }, { label: 'May', value: 5 }, { label: 'June', value: 6 }, { label: 'July', value: 7 }, { label: 'August', value: 8 },
        { label: 'September', value: 9 }, { label: 'October', value: 11 }, { label: 'November', value: 11 }, { label: 'December', value: 12, },
        { label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 },]
        return (periods.concat(months))
    }

    async function handleOptionSelected(selectedOption: { label: string; value: any }) {
        pre.selectedOption = selectedOption
        let value = selectedOption.value

        Number.isInteger(value) ? execNumLogic(value) : execStringlogic(value)
        await fetchData()
        function execNumLogic(val: number) {
            const finYearId = finYearObject.finYearId
            const isoStartDate = finYearObject.isoStartDate
            const finStartMonth = moment(isoStartDate).get('month') + 1
            const y = (val < finStartMonth) ? finYearId + 1 : finYearId
            const m = val < 10 ? '0' + val : '' + val
            const isoDate = ''.concat(y + '', '-', m, '-', '01')
            const startDate = moment(isoDate).startOf('month').format(isoFormat)
            const endDate = moment(isoDate).endOf('month').format(isoFormat)
            pre.startDate = startDate
            pre.endDate = endDate
        }

        function execStringlogic(val: string) {
            const obj: any = {
                'all': () => {
                    pre.startDate = finYearObject.isoStartDate
                    pre.endDate = finYearObject.isoEndDate
                },
                'today': () => {
                    pre.startDate = moment().format('YYYY-MM-DD')
                    pre.endDate = pre.startDate
                },
                'prevDay': () => {
                    pre.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
                    pre.endDate = pre.startDate
                },
                'thisMonth': () => {
                    pre.startDate = moment().startOf('month').format('YYYY-MM-DD')
                    pre.endDate = moment().endOf('month').format('YYYY-MM-DD')
                },
                'prevMonth': () => {
                    pre.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                    pre.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                }
            }
            obj[val]()
        }
    }

    function getTotals() {
        const rows: any[] = pre.filteredRows
        const totals = rows.reduce((prev: any, curr: any, index: number) => {
            prev.qty = prev.qty + curr.qty
            prev.cgst = prev.cgst + curr.cgst
            prev.sgst = prev.sgst + curr.sgst
            prev.igst = prev.igst + curr.igst
            prev.amount = prev.amount + curr.amount
            prev.aggrPurchase = prev.aggrPurchase + curr.aggrPurchase
            prev.count++
            return (prev)
        }, { qty: 0, aggrPurchase: 0, cgst: 0, sgst: 0, igst: 0, amount: 0, grossProfit: 0, count: 0 })
        totals.id = 'Total'
        return (totals)
    }

    function onSelectionModelChange(rowIds: any) {
        const rows = pre.allRows
        const obj = rowIds.reduce((prev: any, current: any) => {
            prev.count = prev.count +1
            prev.qty = prev.qty + (rows[current -1]?.qty || 0)
            prev.aggrPurchase = prev.aggrPurchase +(rows[current -1]?.aggrPurchase || 0)
            prev.amount = prev.amount +(rows[current -1]?.amount || 0)
            prev.profit = prev.grossProfit +(rows[current -1]?.grossProfit || 0)
            return prev
        }, { count: 0, qty: 0, aggrPurchase: 0, amount: 0, })
        pre.selectedRowsObject = _.isEmpty(obj) ? {} : obj
        setRefresh({})
    }

    return ({
        fetchData, getColumns, getGridSx,
        getPurchasePeriodOptions, 
        getRowClassName,
        handleOptionSelected, 
        meta, multiData,
        onSelectionModelChange 
    })
}
export { usePurchaseReport }