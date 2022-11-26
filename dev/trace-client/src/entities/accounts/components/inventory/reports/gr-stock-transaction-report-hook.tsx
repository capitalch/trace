import { _, Box, CloseSharp, GridCellParams, IconButton, moment, Typography, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'
function useStockTransactionReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()

    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        // getTotals: getTotals,
        setRefresh: setRefresh,
        sqlKey: 'get_stock_transactions',
        subTitle: '',
        title: 'Stock transactions',
        totals: {}
    })
    const pre = meta.current

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        fetchData()
    }, [])

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
            },
        }) || {}
        setId(pre.allRows)
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x })) //its faster
        massageRows(pre.filteredRows)
        // pre.totals = getTotals() || {}
        // pre.filteredRows.push(pre.totals)
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

    function getColumns() {
        return ([
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'id',
                width: 60,
            },

            {
                cellClassName: getCellClassName,
                headerName: 'Pr code',
                headerClassName: 'header-class',
                description: 'Product code',
                field: 'productCode',
                width: 80,
            },
            {
                cellClassName: getCellClassName,
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: 'product',
                width: 200,
            },
            {
                headerName: 'Date',
                headerClassName: 'header-class',
                description: 'Transaction date',
                field: 'tranDate',
                type: 'date',
                width: 100,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                // cellClassName: 'cell-class-bold',
                headerName: 'Debits',
                headerClassName: 'header-class',
                description: 'Debits',
                field: 'debits',
                type: 'number',
                width: 80,
                // valueFormatter: (params: any) => params.value ? params.value : '' //toCurrentDateFormat(params.value || '')
            },
            {
                // cellClassName: 'cell-class-bold',
                headerName: 'Credits',
                headerClassName: 'header-class',
                description: 'Credits',
                field: 'credits',
                type: 'number',
                width: 80,
                // valueFormatter: (params: any) => params.value ? params.value : ''
            },
            {
                // cellClassName: 'cell-class-bold',
                headerName: 'Balance',
                headerClassName: 'header-class',
                description: 'Balance',
                field: 'balance',
                type: 'number',
                width: 80,
            },
            {
                headerName: 'Type',
                headerClassName: 'header-class',
                description: 'Transaction type',
                field: 'tranType',
                width: 120,
            },
            {
                cellClassName: 'cell-class-padding',
                headerName: 'Remarks',
                headerClassName: 'header-class',
                description: 'Remarks',
                field: 'remarks',
                width: 400,
            },
        ])
    }

    function getCellClassName(params: GridCellParams<number>) {
        console.log(params)
        const remarks = params.row.remarks
        let ret = ''
        if (['Summary', 'Opening balance'].includes(remarks)) {
            ret = 'cell-class-padding'
        } else {
            ret = 'cell-class-white'
        }
        return (ret)
    }

    function getGridSx() {
        return (
            {
                p: 1, width: '100%',
                fontSize: theme.spacing(1.7),
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
                '& .cell-class-padding': {
                    paddingTop: theme.spacing(1),
                    paddingBottom: theme.spacing(1),
                    // fontSize: theme.spacing(1.8),
                },
                '& .cell-class-bold': {
                    fontWeight: 'bold'
                },
                // '& .row-class-opening': {
                //     backgroundColor: theme.palette.grey[200]
                // },
                '& .row-class-summary': {
                    backgroundColor: theme.palette.yellow.light,
                    fontWeight: 'bold',
                    // color: theme.palette.getContrastText(theme.palette.lightBlue.main)
                },
                '& .cell-class-white': {
                    color: theme.palette.common.white,
                },
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        // if (row.tranType === 'Opening') {
        //     ret = 'row-class-opening'
        // }
        // else 
        if (row.remarks === 'Summary') {
            ret = 'row-class-summary'
        }

        return (ret)
    }

    function massageRows(rows: any[]) {
        const length = rows.length
        let bufferBal = 0
        for (let i = 0; i < length; i++) {
            const remarks = rows[i].remarks
            const debits = rows[i].debits
            const credits = rows[i].credits
            if( remarks === 'Opening balance'){
                bufferBal = rows[i].debits - rows[i].credits
            } else if(remarks === 'Summary'){
                
            } else {
                bufferBal = bufferBal + debits - credits
                rows[i].balance = bufferBal
            }
        }
        setRefresh({})
    }

    return ({ fetchData, getColumns, getGridSx, getRowClassName, meta })
}
export { useStockTransactionReport }