import { SxProps } from '@mui/material'
import { _, Box, CloseSharp, clsx, GridCellParams, IconButton, moment, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function usePurchasePriceVariation() {
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
        sqlKey: 'get_purchase_price_variation',
        subTitle: '',
        title: 'Purchase price variation',
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

        function createTagOptions() {
            const tags = pre.options.allOptionsJson?.jsonResult?.tags
            pre.options.optionsTag = tags.map((x: any) => ({ label: x.tagName, value: x.id }))
            const allTags = { label: 'All tags', value: 0 }
            const noTags = { label: pre.options.noTagsLabel, value: null }
            pre.options.optionsTag.unshift(allTags)
            pre.options.optionsTag.unshift(noTags)
            pre.options.selectedTag = noTags
        }
    }

    async function fetchData() {
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
                // align:'right',
                headerName: 'Diff',
                headerClassName: 'header-class',
                description: 'Difference in price',
                field: 'diff',
                type: 'number',
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

    function getGridSx(): SxProps {
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
                '& .grid-toolbar': {
                    width: '100%',
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .row-class-red': {
                    color: theme.palette.error.main
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
        if ((row.absDiff || 0) >= 5) {
            ret = clsx(ret, 'row-class-red')
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
        let bufferProductCode = rows[0].productCode
        let bColor = false
        let bufferPrice = rows[0].price
        for (let i = 0; i < length; i++) {
            const productCode = rows[i].productCode
            const price = rows[i].price

            if (productCode === bufferProductCode) {
                if (price !== bufferPrice) {
                    const diff = ((price - bufferPrice) / bufferPrice) * 100
                    const absDiff = Math.abs(diff)
                    // rows[i].diff =  ''.concat(String(((price - bufferPrice)/bufferPrice) * 100), '%')
                    rows[i].diff = toDecimalFormat(diff) + ' %'
                    rows[i].absDiff = absDiff
                    bufferPrice = price
                }
            } else {
                bColor = !bColor
                bufferProductCode = productCode
                bufferPrice = price
            }

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
    return ({ fetchData, getColumns, getGridSx, getRowClassName, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, meta })
}
export { usePurchasePriceVariation }