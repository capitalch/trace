import clsx from 'clsx'
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
        options: {
            allOptionsJson: {},
            optionsSqlKey: 'get_options_brands_categories_tags',
            optionsBrand: [],
            selectedBrand: {},
            noBrandsLabel: 'No brands',
            optionsTag: [],
            selectedTag: {},
            noTagsLabel: 'No tags',
            catTree: [],
            selectedCategory: 0,
            noCategoriesLabel: 'No categories'
        },
        queryArgs: {
            type: '',
            value: null
        },
        setRefresh: setRefresh,
        sqlKey: 'get_stock_transactions',
        subTitle: '',
        title: 'Stock transactions',
        totals: {}
    })
    const pre = meta.current

    useEffect(() => {
        pre.subTitle = getGridReportSubTitle()
        fetchOptionsData()
        // fetchData()
    }, [])

    function createOptions() {
        createBrandOptions()
        createTagOptions()
        createCategoryOptions()
        setRefresh({})

        function createBrandOptions() {
            const brands = pre.options.allOptionsJson?.jsonResult?.brands
            pre.options.optionsBrand = brands.map((x: any) => ({ label: x.brandName, value: x.id }))
            const allBrands = { label: 'All brands', value: 0 }
            const noBrands = { label: pre.options.noBrandsLabel, value: null }
            pre.options.optionsBrand.unshift(allBrands)
            pre.options.optionsBrand.unshift(noBrands)
            pre.options.selectedBrand = noBrands
        }

        function createTagOptions() {
            const tags = pre.options.allOptionsJson?.jsonResult?.tags
            pre.options.optionsTag = tags.map((x: any) => ({ label: x.tagName, value: x.id }))
            const allTags = { label: 'All tags', value: 0 }
            const noTags = { label: pre.options.noTagsLabel, value: null }
            pre.options.optionsTag.unshift(allTags)
            pre.options.optionsTag.unshift(noTags)
            pre.options.selectedTag = noTags
        }

        function createCategoryOptions() {
            const temp: any[] = pre.options.allOptionsJson?.jsonResult?.categories
            const cats = temp.map((x: any) => ({ key: x.id, label: x.catName, parentId: x.parentId, isLeaf: x.isLeaf, data: x.id }))
            const dict: any = {}
            for (const cat of cats) {
                dict[cat.key] = cat
            }
            for (const cat of cats) {
                if (cat.parentId) {
                    const parent = dict[cat.parentId]
                    if (parent) {
                        if (!parent.children) {
                            parent.children = []
                        }
                        parent.children.push(cat)
                    }
                }
            }
            const catTree = cats.filter((x: any) => (x.parentId === null))
            pre.options.catTree = [...catTree]
            const allCategories = { key: 0, label: 'All categories', isLeaf: true, parentId: null }
            const noCategories = { key: 999999, label: pre.options.noCategoriesLabel, isLeaf: true, parentId: null }
            pre.options.catTree.unshift(allCategories)
            pre.options.catTree.unshift(noCategories)
            pre.options.selectedCategory = 999999
        }

    }

    async function fetchData() {
        if ((pre.queryArgs.value === 999999) || (pre.queryArgs.value === null)) { // 999999is for no categories
            pre.filteredRows = []
            setRefresh({})
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows = await execGenericView({
            isMultipleRows: true,
            sqlKey: pre.sqlKey,
            args: {
                type: pre.queryArgs.type,
                value: pre.queryArgs.value
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

    async function fetchOptionsData() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.options.allOptionsJson = await execGenericView({
            isMultipleRows: false,
            sqlKey: pre.options.optionsSqlKey
        })
        emit('SHOW-LOADING-INDICATOR', false)
        createOptions() // create options arrays for brands, categories and tags
    }

    function getColumns() {
        return ([
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Index',
                field: 'itemIndex',
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
                headerName: 'Price',
                headerClassName: 'header-class',
                description: 'Price',
                field: 'price',
                type: 'number',
                valueFormatter: (params: any) => toDecimalFormat(params.value),
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
                '& .row-class-bold': {
                    fontWeight: 'bold',
                },
                '& .row-bcolor-true': {
                    backgroundColor: theme.palette.neutral.light,
                },
                '& .row-bcolor-true-bold': {
                    backgroundColor: theme.palette.neutral.light,
                    fontWeight: 'bold',
                },
                "& .MuiDataGrid-row:hover": {
                    backgroundColor: theme.palette.action.focus
                },
                '& .row-red': {
                    color: theme.palette.error.dark,
                    // color: theme.palette.getContrastText(theme.palette.error.light)
                },
                '& .p-treeselect': {
                    marginLeft: theme.spacing(1)
                    // fontSize: theme.spacing(1.0)
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        const balance = row?.balance || 0
        let ret = ''
        if (row.remarks === 'Summary') {
            if (row.bColor) {
                ret = 'row-bcolor-true-bold'
            } else {
                ret = 'row-class-bold'
            }
        } else {
            if (row.bColor) {
                ret = 'row-bcolor-true'
            }
        }
        if (balance < 0) {
            ret = 'row-red'
        }
        return (ret)
    }

    function handleSelectedBrand(selectedBrand: any) {
        pre.options.selectedBrand = selectedBrand
        pre.queryArgs.type = 'brand'
        pre.queryArgs.value = selectedBrand.value

        pre.options.selectedCategory = 999999
        pre.options.selectedTag = { value: null, label: pre.options.noTagsLabel }       
        setRefresh({})
        fetchData()
    }

    function handleSelectedCategory(selectedCategory: any) {
        pre.options.selectedCategory = selectedCategory
        pre.queryArgs.type = 'cat'
        pre.queryArgs.value = selectedCategory

        pre.options.selectedBrand = { value: null, label: pre.options.noBrandsLabel }
        pre.options.selectedTag = { value: null, label: pre.options.noTagsLabel }        
        setRefresh({})
        fetchData()
    }

    function handleSelectedTag(selectedTag: any) {
        pre.options.selectedTag = selectedTag
        pre.queryArgs.type = 'tag'
        pre.queryArgs.value = selectedTag.value

        pre.options.selectedCategory = 999999
        pre.options.selectedBrand = { value: null, label: pre.options.noBrandsLabel }
        setRefresh({})
        fetchData()
    }

    function massageRows(rows: any[]) {
        const length = rows.length
        let count = 1
        let bufferBal = 0
        let bColor = false
        for (let i = 0; i < length; i++) {
            const remarks = rows[i].remarks
            const debits = rows[i].debits
            const credits = rows[i].credits
            if (remarks === 'Opening balance') {
                bufferBal = rows[i].debits - rows[i].credits
                rows[i].itemIndex = incr()
                bColor = !bColor
                // rows[i].bColor = bColor
            } else if (remarks === 'Summary') {

            } else {
                bufferBal = bufferBal + debits - credits
                rows[i].balance = bufferBal
                // rows[i].bColor = bColor
                rows[i].productCode = ''
                rows[i].product = ''
            }
            rows[i].bColor = bColor
        }
        setRefresh({})

        function incr() {
            return (count++)
        }
    }

    return ({ fetchData, getColumns, getGridSx, getRowClassName, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta })
}
export { useStockTransactionReport }