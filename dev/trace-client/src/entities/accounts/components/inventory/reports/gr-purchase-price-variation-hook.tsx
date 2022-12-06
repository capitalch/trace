import { _, Box, CloseSharp, clsx, GridCellParams, IconButton, moment, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function usePurchasePriceVariation() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()

    const meta: any = useRef({
        allRows: [],
        // dataPath: 'jsonResult.stock',
        // debounceMessage: 'STOCK-SUMMARY-DEBOUNCE',
        filteredRows: [],
        // getTotals: getTotals,
        // isSearchTextEdited: false,
        // options: {
        //     allOptionsJson: {},
        //     optionsSqlKey: 'get_options_brands_categories_tags',
        //     optionsBrand: [],
        //     selectedBrand: {},
        //     noBrandsLabel: 'No brands',
        //     optionsTag: [],
        //     selectedTag: {},
        //     noTagsLabel: 'No tags',
        //     catTree: [],
        //     selectedCategory: 0,
        //     noCategoriesLabel: 'No categories'
        // },
        setRefresh: setRefresh,
        // searchText: '',
        // searchTextRef: null,
        // selectedAgeingOption: { label: 'Age (all)', value: 0 },
        // selectedRowsObject: {},
        // selectedTagOption: { label: 'All', value: 0 },
        sqlKey: 'get_purchase_price_variation',
        // stockDate: moment().format('YYYY-MM-DD'),
        subTitle: '',
        title: 'purchase price variation',
        // totals: {}
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
            args: {},
        }) || {}
        setId(pre.allRows)
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x })) //its faster
        massageRows(pre.filteredRows)
        // pre.totals = getTotals() || {}
        // pre.filteredRows.push(pre.totals)
        emit('SHOW-LOADING-INDICATOR', false)
        // setRefresh({})

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
                field: 'count',
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
                cellClassName: 'cell-class-padding',
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                valueGetter: (params: any) => `${params.row?.brandName ? params.row.brandName : ''} ${params.row?.catName ? params.row.catName : ''} ${params.row?.label ? params.row.label : params.row.label}`,
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
                headerName: 'Qty',
                headerClassName: 'header-class',
                description: 'Qty',
                field: 'qty',
                type: 'number',
                // valueFormatter: (params: any) => toDecimalFormat(params.value),
                width: 60,
            },
            {
                headerName: 'Price',
                headerClassName: 'header-class',
                description: 'Price',
                field: 'price',
                type: 'number',
                valueFormatter: (params: any) => toDecimalFormat(params.value),
                width: 100,
            },
            {
                headerName: 'Diff',
                headerClassName: 'header-class',
                description: 'Difference in price',
                field: 'diff',
                // type: 'number',
                // valueFormatter: (params: any) => toDecimalFormat(params.value),
                width: 100,
            },
            {
                headerName: 'Account',
                headerClassName: 'header-class',
                description: 'Account name',
                field: '2',
                valueGetter: (params: any) => `${params.row?.accName ? params.row.accName : ''} ${params.row?.contactName ? params.row.contactName : ''}`,
                width: 250,
            },
            {
                headerName: 'Mob / mail',
                headerClassName: 'header-class',
                description: 'Mobile and email',
                field: '3',
                valueGetter: (params: any) => `${params.row?.mobileNumber ? params.row.mobileNumber : ''} ${params.row?.email ? params.row.email : ''}`,
                width: 250,
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
                '& .cell-class-padding': {
                    paddingTop: theme.spacing(0.5),
                    paddingBottom: theme.spacing(.5),
                    fontSize: theme.spacing(1.8),
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .row-bcolor-true': {
                    backgroundColor: theme.palette.neutral.light,
                },
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.bColor) {
            ret = 'row-bcolor-true'
        }
        return (ret)
    }

    function massageRows(rows: any[]) {
        const length = rows.length
        let count = 1
        let bufferProductCode = rows[0].productCode
        let bColor = false
        let bufferPrice = rows[0].price
        for (let i = 0; i < length; i++) {
            const productCode = rows[i].productCode
            const price = rows[i].price

            if (productCode === bufferProductCode) {
                if (price !== bufferPrice) {
                    // rows[i].diff =  ''.concat(String(((price - bufferPrice)/bufferPrice) * 100), '%')
                    rows[i].diff = toDecimalFormat(((price - bufferPrice) / bufferPrice) * 100) + ' %'
                    bufferPrice = price
                }
            } else {
                bColor = !bColor
                bufferProductCode = productCode
                bufferPrice = price
            }

            // if (remarks === 'Opening balance') {
            //     bufferBal = rows[i].debits - rows[i].credits
            //     rows[i].itemIndex = incr()
            //     bColor = !bColor
            // } else if (remarks === 'Summary') {

            // } else {
            //     bufferBal = bufferBal + debits - credits
            //     rows[i].balance = bufferBal
            //     rows[i].productCode = ''
            //     rows[i].product = ''
            // }
            rows[i].bColor = bColor
            rows[i].count = i + 1
        }
        setRefresh({})

        function incr() {
            return (count++)
        }
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
        massageRows(pre.filteredRows)
        // pre.totals = getTotals()
        // pre.filteredRows.push(pre.totals)
        setRefresh({})
    }
    return ({ getColumns, getGridSx, getRowClassName, meta })
}
export { usePurchasePriceVariation }