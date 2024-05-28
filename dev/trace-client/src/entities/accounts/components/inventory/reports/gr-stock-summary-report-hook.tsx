import { useLayoutEffect } from 'react'
import { _, Box, CloseSharp, clsx, GridCellParams, IconButton, moment, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods, IMegaData, useContext, MegaDataContext, getFromBag } from '../redirect'

function useStockSummaryReport() {
    const [, setRefresh] = useState({})
    const { execGenericView, toDecimalFormat } = utilMethods()
    const { toCurrentDateFormat, getGridReportSubTitle } = utils()
    const { debounceFilterOn, emit, } = useIbuki()
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const inventory: any = megaData.accounts.inventory
    const branchObject = getFromBag('branchObject')
    const meta: any = useRef({
        allRows: [],
        dataPath: 'jsonResult.stock',
        debounceMessage: 'STOCK-SUMMARY-DEBOUNCE',
        filteredRows: [],
        getTotals: getTotals,
        isSearchTextEdited: false,
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
            type: 'brand',
            value: 0 // for all brands
        },
        setRefresh: setRefresh,
        searchText: '',
        searchTextRef: null,
        selectedAgeingOption: { label: 'Age (all)', value: 0 },
        selectedRowsObject: {},
        sqlKey: 'get_stock_summary',
        stockDate: moment().format('YYYY-MM-DD'),
        subTitle: '',
        title: 'Stock summary',
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
        fetchOptionsData()
        inventory.fetchDataMethod = fetchData
        const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
            const requestSearch = d.data[0]
            const searchText = d.data[1]
            requestSearch(searchText)
        })
        return (() => {
            subs1.unsubscribe()
            inventory.fetchDataMethod = undefined
            inventory.isAllBranches = false
            inventory.inventoryReportRefresh({})
        })
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
            pre.options.selectedBrand = allBrands
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
                onDate:
                    pre.stockDate
                    || null,
                days: pre.selectedAgeingOption.value || 0,
                isAll: false, // Only products having some transaction or OP bal are shown
                type: pre.queryArgs.type,
                value: pre.queryArgs.value,
                branchId: inventory.isAllBranches ? null: branchObject.branchId
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

    async function fetchOptionsData() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.options.allOptionsJson = await execGenericView({
            isMultipleRows: false,
            sqlKey: pre.options.optionsSqlKey
        })
        emit('SHOW-LOADING-INDICATOR', false)
        createOptions() // create options arrays for brands, categories and tags
        await fetchData()
    }

    function getAgeingOptions() {
        const ageing = [{
            label: 'Age (all)',
            value: 0
        },
        {
            label: 'Age >= 90 days',
            value: 90
        },
        {
            label: 'Age >= 180 days',
            value: 180
        },
        {
            label: 'Age >= 270 days',
            value: 270
        },
        {
            label: 'Age >= 360 days',
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
            // valueGetter is provided so that the data is available in csv export
            {
                headerName: 'Product',
                headerClassName: 'header-class',
                description: 'Product',
                field: '1',
                valueGetter: (params: any) => `${params.row?.catName ? params.row.catName : ''} ${params.row?.brandName ? params.row.brandName : ''} ${params.row?.label ? params.row.label : params.row.label}`,
                width: '430',
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
                headerName: 'Dr',
                headerClassName: 'header-class',
                field: 'dr',
                type: 'number',
                width: 70,
            },
            {
                headerName: 'Cr',
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
                headerName: 'Gp',
                headerClassName: 'header-class',
                description: 'Gross profit',
                field: 'grossProfit',
                type: 'number',
                width: 120,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Age',
                headerClassName: 'header-class',
                description: 'Age of product sold',
                field: 'age',
                type: 'number',
                width: 60,
            },
            {
                headerName: 'Op Price',
                headerClassName: 'header-class',
                description: 'Opening price',
                field: 'openingPrice',
                type: 'number',
                width: 110,
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
                headerName: 'Clos price',
                headerClassName: 'header-class',
                description: 'Last purchase price',
                field: 'lastPurchasePrice',
                type: 'number',
                width: 110,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
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
                headerName: 'Lst pur dt',
                headerClassName: 'header-class',
                description: 'Last purchase date',
                field: 'lastPurchaseDate',
                type: 'date',
                width: 100,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                headerName: 'Lst sal dt',
                headerClassName: 'header-class',
                description: 'Last sale date',
                field: 'lastSaleDate',
                type: 'date',
                width: 100,
                valueFormatter: (params: any) => toCurrentDateFormat(params.value || '')
            },
            {
                description: 'Purchase',
                headerName: 'Pur',
                headerClassName: 'header-class',
                field: 'purchase',
                type: 'number',
                width: 70,
            },
            {
                description: 'Sale',
                headerName: 'Sal',
                headerClassName: 'header-class',
                field: 'sale',
                type: 'number',
                width: 70,
            },
            {
                description: 'Purchase returns',
                headerName: 'Pur ret',
                headerClassName: 'header-class',
                field: 'purchaseRet',
                type: 'number',
                width: 90,
            },
            {
                description: 'Sale returns',
                headerName: 'Sal ret',
                headerClassName: 'header-class',
                field: 'saleRet',
                type: 'number',
                width: 90,
            },
            {
                description: 'Stock Journal debits',
                headerName: 'Stk Jr Dr',
                headerClassName: 'header-class',
                field: 'stockJournalDebits',
                type: 'number',
                width: 90,
            },
            {
                description: 'Stock journal credits',
                headerName: 'Stk Jr Cr',
                headerClassName: 'header-class',
                field: 'stockJournalCredits',
                type: 'number',
                width: 90,
            },
            {
                description: 'Branch transfer debits',
                headerName: 'Br Trf Dr',
                headerClassName: 'header-class',
                field: 'branchTransferDebits',
                type: 'number',
                width: 90,
            },
            {
                description: 'Branch Transfer credits',
                headerName: 'Br Trf Cr',
                headerClassName: 'header-class',
                field: 'branchTransferCredits',
                type: 'number',
                width: 90,
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
                '& .row-jakar': {
                    color: 'dodgerBlue'
                },
                '& .row-negative-clos': {
                    color: theme.palette.error.dark
                },
                '& .row-alt-bgcolor': {
                    backgroundColor: theme.palette.neutral.light,
                }
            }
        )
    }

    function getRowClassName(e: any) {
        const row = e?.row || {}
        let ret = ''
        if (row.id === 'Total')
            ret = 'footer-row-class'
        else if (row.age >= 360) {
            ret = 'row-jakar'
        } else if (row.clos < 0) {
            ret = 'row-negative-clos'
        }
        if ((row.id % 2) === 0) {
            ret = clsx(ret, 'row-alt-bgcolor')
        }

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
            prev.grossProfit = prev.grossProfit + curr.grossProfit
            prev.count++
            return (prev)
        }, {
            opValue: 0, op: 0, dr: 0, cr: 0, clos: 0, closValue: 0, count: 0, grossProfit: 0
        })
        totals.id = 'Total'
        totals.catName = ''
        totals.brandName = ''
        totals.label = ''
        return (totals)
    }

    function handleAgeingOptionSelected(selectedOption: { label: string; value: string }) {
        pre.selectedAgeingOption = selectedOption
        fetchData()
    }

    // async function handleSelectedTagOption(selectedTagOption: any) {
    //     pre.selectedTagOption = selectedTagOption
    //     await fetchData()
    //     setRefresh({})
    // }

    function handleSelectedBrand(selectedBrand: any) {
        pre.options.selectedBrand = selectedBrand
        pre.queryArgs.type = 'brand'
        pre.queryArgs.value = selectedBrand.value

        pre.options.selectedCategory = 999999
        pre.options.selectedTag = { value: null, label: pre.options.noTagsLabel }
        fetchData()
    }

    function handleSelectedCategory(selectedCategory: any) {
        pre.options.selectedCategory = selectedCategory
        pre.queryArgs.type = 'cat'
        pre.queryArgs.value = selectedCategory

        pre.options.selectedBrand = { value: null, label: pre.options.noBrandsLabel }
        pre.options.selectedTag = { value: null, label: pre.options.noTagsLabel }
        fetchData()
    }

    function handleSelectedTag(selectedTag: any) {
        pre.options.selectedTag = selectedTag
        pre.queryArgs.type = 'tag'
        pre.queryArgs.value = selectedTag.value

        pre.options.selectedCategory = 999999
        pre.options.selectedBrand = { value: null, label: pre.options.noBrandsLabel }
        fetchData()
    }

    function handleTrim() {
        pre.filteredRows = pre.filteredRows.filter((x: any) => (x.clos !== 0))
        setRefresh({})
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

    return ({ fetchData, getAgeingOptions, getColumns, getGridSx, getRowClassName, handleAgeingOptionSelected, handleSelectedBrand, handleSelectedCategory, handleSelectedTag, handleTrim, meta, onSelectModelChange })
}

export { useStockSummaryReport }
