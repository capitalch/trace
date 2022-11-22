import { _, Box, CloseSharp, GridCellParams, IconButton, moment, Typography, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useCurrentOrdersReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        getTotals: getTotals,
        setRefresh: setRefresh,
        sqlKey: 'get_current_orders',
        subTitle: '',
        title: 'Current orders',
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
                // onDate:
                //     pre.stockDate
                //     || null,
                // days: pre.selectedAgeingOption.value || 0,
                // isAll: false // Only products having some transaction or OP bal are shown
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

    function getColumns() {
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
                cellClassName: 'cell-class-product',
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: 'product',
                renderCell: (params: any) => <Product params={params} />,
                valueGetter: (params: any) => `${params.row.brandName} ${params.row.catName} ${params.row.label}`,
                width: 200,
            },
            {
                cellClassName: 'cell-class-product',
                headerName: 'Details',
                headerClassName: 'header-class',
                description: 'Product details',
                field: 'info',
                width: 200,
            },
            {
                cellClassName: 'cell-class-stock',
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Current stock',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
                cellClassName: 'cell-class-order',
                headerName: 'Order',
                headerClassName: 'header-class',
                description: 'Final order',
                field: 'finalOrder',
                type: 'number',
                width: 80,
            },
            {
                headerName: 'Value',
                headerClassName: 'header-class',
                description: 'Order value',
                field: 'orderValue',
                type: 'number',
                valueFormatter: (params: any) => params.value ? toDecimalFormat(params.value) : '',
                width: 120,
            },
            {
                headerName: 'Urgent',
                headerClassName: 'header-class',
                description: 'Urgent',
                field: 'isUrgent',
                valueGetter: (params:any) => `${params.row.isUrgent ? 'Yes' : 'No'}`,
                width: 80,
            },
        ])
    }

    function getGridSx() {
        return (
            {
                p: 1,
                width: '100%',
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
                '& .cell-class-order':{
                    fontWeight:'bold',
                    fontSize: theme.spacing(2.0)
                },
                '& .cell-class-product': {
                    paddingTop: theme.spacing(0.5),
                    paddingBottom: theme.spacing(.5)
                },
                '& .cell-class-stock': {
                    color: theme.palette.grey[400]
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
            prev.clos = prev.clos + curr.clos
            prev.finalOrder = prev.finalOrder + curr.finalOrder
            prev.orderValue = prev.orderValue + curr.orderValue
            return (prev)
        }, {
            clos: 0, finalOrder: 0, orderValue: 0
        })
        totals.id = 'Total'
        // totals.clos = ''
        totals.product = ''
        return (totals)
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

    return ({ fetchData, getColumns, getGridSx, getRowClassName, meta })
}

export { useCurrentOrdersReport }

function Product({ params }: any) {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>{params.row.brandName ? params.row.brandName : ''}</Typography>&nbsp;
            <Typography sx={{ fontSize: theme.spacing(1.7), }}>{params.row.catName ? params.row.catName : ''}</Typography>&nbsp;
            {params.row.label && <Typography sx={{ display: 'inline-block', fontSize: theme.spacing(1.7) }}>{params.row.label ? params.row.label : ''}</Typography>}
        </Box>
    )
}