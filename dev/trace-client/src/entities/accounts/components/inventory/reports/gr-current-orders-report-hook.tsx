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
                            // onClick={() => removeRow(params)}
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
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                renderCell: (params: any) => <Product params={params} />,
                valueGetter: (params:any) => `${params.row.catName} ${params.row.brandName} ${params.row.label}`,
                width: 200,
            },
            {
                headerName: 'Stock',
                headerClassName: 'header-class',
                description: 'Current stock',
                field: 'clos',
                type: 'number',
                width: 60,
            },
            {
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
                width: 120,
            },
            {
                headerName: 'Urgent',
                headerClassName: 'header-class',
                description: 'Urgent',
                field: 'isUrgent',
                // type: 'boolean',
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
                // '& .footer-row-class': {
                //     backgroundColor: theme.palette.grey[300]
                // },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                // '& .grid-toolbar': {
                //     width: '100%',
                //     borderBottom: '1px solid lightgrey',
                //     display: 'flex',
                //     flexDirection: 'column',
                //     alignItems: 'start'
                // },
                // '& .row-jakar':{
                //     color: 'dodgerBlue'
                // },
                // '& .row-negative-clos':{
                //     color: theme.palette.error.dark
                // }
            }
        )
    }

    function getTotals() {
        const rows: any[] = pre.filteredRows
        const totals = rows.reduce((prev: any, curr: any, index: number) => {
            // prev.op = prev.op + curr.op
            // prev.opValue = prev.opValue + curr.opValue
            // prev.dr = prev.dr + curr.dr
            // prev.cr = prev.cr + curr.cr
            // prev.clos = prev.clos + curr.clos
            // prev.closValue = prev.closValue + curr.closValue
            // prev.count++
            return (prev)
        }, {
            opValue: 0, op: 0, dr: 0, cr: 0, clos: 0, closValue: 0, count: 0
        })
        totals.id = 'Total'
        return (totals)
    }

    return ({ fetchData, getColumns, getGridSx, meta })
}

export { useCurrentOrdersReport }

function Product({ params }: any) {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {params.row.catName && <Typography sx={{ fontSize: theme.spacing(1.7) }}>{params.row.catName}</Typography>}
            <Typography sx={{ fontSize: theme.spacing(1.7), fontWeight: 'bold' }}>&nbsp;{params.row.brandName}</Typography>                
            {params.row.label && <Typography sx={{display:'inline-block', whiteSpace:'pre-line', fontSize: theme.spacing(1.7) }}>&nbsp;{params.row.label}</Typography>}
        </Box>
    )
}