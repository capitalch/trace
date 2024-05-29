import { Typography } from '@mui/material'
import { _, Box, CloseSharp, GridCellParams, IconButton, manageEntitiesState, moment, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useSalesReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, filterOn } = useIbuki()
    const theme = useTheme()
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
        selectedAgeingOption: { label: 'Age (all)', value: 0 },
        selectedOption: { label: 'Today', value: 'today' },
        selectedTagOption: { label: 'All', value: 0 },
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
        const subs2 = filterOn('TRACE-SERVER-SALES-ADDED-OR-UPDATED').subscribe(() => fetchData(false))
        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        })
    }, [])

    async function fetchData(showWaitCursor: any = true) {
        showWaitCursor && emit('SHOW-LOADING-INDICATOR', true)
        const rows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
                startDate: pre.startDate,
                endDate: pre.endDate,
                days: pre.selectedAgeingOption.value || 0,
                tagId: pre.selectedTagOption.value
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

    function getSalesPeriodOptions() {
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

    async function handleSelectedTagOption(selectedTagOption: any) {
        pre.selectedTagOption = selectedTagOption
        await fetchData()
        setRefresh({})
    }

    function getAgeingOptions() {
        const ageing = [{
            label: 'Age (all)',
            value: 0
        },
        {
            label: 'Age >= 90',
            value: 90
        },
        {
            label: 'Age >= 180',
            value: 180
        },
        {
            label: 'Age >= 270',
            value: 270
        },
        {
            label: 'Age >= 360',
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
                width: 65,
            },
            {
                headerName: 'Sale date',
                headerClassName: 'header-class',
                description: 'Sale date',
                field: 'tranDate',
                type: 'date',
                width: 95,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                cellClassName: 'cell-class-padding',
                headerName: 'Ref no | Accounts',
                headerClassName: 'header-class',
                description: 'Ref no',
                field: 'autoRefNo',
                width: 165,
                renderCell: (params: any) => <RefNoAccounts params={params} />
            },
            {
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
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
            {
                headerName: 'Details',
                headerClassName: 'header-class',
                description: 'Product details',
                field: 'info',
                renderCell: (params: any) => <ProductDetails params={params} />,
                width: 300,
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
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Stock',
                field: 'stock',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Age',
                headerClassName: 'header-class',
                description: 'Age of product sold',
                field: 'age',
                type: 'number',
                width: 65,
            },
            {
                headerName: 'Profit(GP)',
                headerClassName: 'header-class',
                description: 'Gross profit',
                field: 'grossProfit',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale(Gst)',
                headerClassName: 'header-class',
                description: 'Sale with gst',
                field: 'amount',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale(Aggr)',
                headerClassName: 'header-class',
                description: 'Aggregate sale',
                field: 'aggrSale',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale Price',
                headerClassName: 'header-class',
                description: 'Sale price',
                field: 'price',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur Price',
                headerClassName: 'header-class',
                description: 'Purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
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
                headerName: 'Time',
                description: 'Time',
                headerClassName: 'header-class',
                field: 'timestamp',
                type: 'date',
                width: 100,
                valueFormatter: (params: any) => params.value ? moment(params.value).format('hh:mm:ss A') : ''
            },
            {
                headerName: 'Contact',
                description: 'Contact',
                headerClassName: 'header-class',
                field: 'contact',
                width: 200,
            },
            {
                headerName: 'Pr id',
                description: 'Product id',
                headerClassName: 'header-class',
                field: 'productId',
                type: 'number',
                width: 80,
            },
            {
                headerName: 'Common remarks',
                description: 'Common remarks',
                headerClassName: 'header-class',
                field: 'commonRemarks',
                width: 250,
            },
            {
                headerName: 'Line remarks',
                description: 'Line remarks',
                headerClassName: 'header-class',
                field: 'lineRemarks',
                width: 250,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                p: 1,
                width: '100%',
                fontSize: theme.spacing(1.8),
                minHeight: theme.spacing(70),
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
                    color: theme.palette.error.light
                },
                '& .row-loss': {
                    color: theme.palette.error.main
                },
                '& .row-jakar': {
                    color: 'dodgerBlue'
                },
                '& .cell-class-padding':{
                    paddingTop: theme.spacing(0.5),
                    paddingBottom: theme.spacing(.5),
                    fontSize: theme.spacing(1.8),
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
        else if (row.tranTypeId === 9) {
            ret = 'row-sales-return'
        } else if (row.grossProfit < 0) {
            ret = 'row-loss'
        } else if (row.age > 360) {
            ret = 'row-jakar'
        }
        return (ret)
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
            prev.age360Sale = prev.age360Sale + ((curr.age > 360) ? curr.amount : 0)
            prev.age360Aggr = prev.age360Aggr + ((curr.age > 360) ? curr.aggrSale : 0)
            prev.age360GrossProfit = prev.age360GrossProfit + ((curr.age > 360) ? curr.grossProfit : 0)
            return (prev)
        }, { qty: 0, aggrSale: 0, cgst: 0, sgst: 0, igst: 0, amount: 0, grossProfit: 0, count: 0, age360Sale: 0, age360Aggr: 0, age360GrossProfit: 0 })
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
            prev.count = prev.count + 1
            prev.qty = prev.qty + (rows[current - 1]?.qty || 0)
            prev.aggrSale = prev.aggrSale + (rows[current - 1]?.aggrSale || 0)
            prev.amount = prev.amount + (rows[current - 1]?.amount || 0)
            prev.grossProfit = prev.grossProfit + (rows[current - 1]?.grossProfit || 0)
            return prev
        }, { count: 0, qty: 0, aggrSale: 0, amount: 0, grossProfit: 0 })
        pre.selectedRowsObject = _.isEmpty(obj) ? {} : obj
        setRefresh({})
    }

    function Product({ params }: any) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>{params.row.brandName}</Typography>
                {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.catName}</Typography>}
                {params.row.label && <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.label}</Typography>}
            </Box>
        )
    }

    function ProductDetails({ params }: any) {
        return (
            <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>{params.row.info}</Typography>
        )
    }

    function RefNoAccounts({ params }: any) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: theme.spacing(1.6), fontWeight: 'bold' }}>
                    {''.concat((params.row.autoRefNo || ''), params.row.autoRefNo ? ', ' : '')}&nbsp;
                </Typography>
                <Typography sx={{ display: 'inline-block', whiteSpace: 'pre-line', fontSize: theme.spacing(1.6), }}>
                    {params.row.accounts || ''}
                </Typography>
            </Box>
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

    return ({ fetchData, getAgeingOptions, getColumns, getGridSx, getSalesPeriodOptions, getRowClassName, handleAgeingOptionSelected, handleOptionSelected, handleSelectedTagOption, meta, onSelectModelChange })
}
export { useSalesReport }