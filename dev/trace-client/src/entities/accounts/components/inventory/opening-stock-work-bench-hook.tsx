import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeningStockWorkBench() {
    const [, setRefresh] = useState({})
    const { emit, execGenericView, filterOn, genericUpdateMasterNoForm, getFromBag, setInBag } = useSharedElements()
    const products = getFromBag('products')
    const finYearId = getFromBag('finYearObject')?.finYearId
    const branchId = getFromBag('branchObject')?.branchId || 1
    const today = moment().format('YYYY-MM-DD')
    const meta: any = useRef({
        filteredBrands: [],
        filteredCategories: [],
        filteredProducts: [], // for labels
        lastPurchaseDate: today,
        openingPrice: 0,
        qty: 0,
        selectedBrand: undefined, // { label: '', value: undefined }
        selectedCategory: undefined, //{ label: '', value: undefined }
        selectedProduct: undefined, // { label: '', value: undefined }
        id: undefined,
    })
    const pre = meta.current
    useEffect(() => {
        loadProducts()
        const subs1 = filterOn('OPENING-STOCK-XX-GRID-EDIT-CLICKED').subscribe(handleEdit)
        // const subs1 = filterOn('OPENING-STOCH-WORK-BENCH-HOOK-EDIT-OPENING-STOCK').subscribe(handleEdit)
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    function checkError() {
        const categoryError = !!!pre?.selectedCategory?.value
        const brandError = !!!pre?.selectedBrand?.value
        const productError = !!!pre?.selectedProduct?.value
        const qtyError = pre?.qty === 0
        const error = categoryError || brandError || productError || qtyError
        return (error)
    }

    function handleEdit(d: any) {
        const row = d.data?.row
        pre.id = row.id1

        pre.selectedCategory = {}
        pre.selectedBrand = {}
        pre.selectedProduct = {}

        // const selectedCategory = {label:row.catName, value:row.catId}
        // onCategoryChanged(selectedCategory)
        pre.selectedCategory.label = row.catName
        pre.selectedCategory.value = row.catId

        // const selectedBrand = {label: row.brandName, value: row.brandId}
        // onBrandChanged(selectedBrand)
        pre.selectedBrand.label = row.brandName
        pre.selectedBrand.value = row.brandId

        // const selectedProduct = {label: row.label, value: row.productId}
        // onProductChanged(selectedProduct)
        pre.selectedProduct.label = row.label
        pre.selectedProduct.value = row.productId

        pre.qty = row. qty
        pre.openingPrice = row.openingPrice
        pre.lastPurchaseDate = row.lastPurchaseDate

        setRefresh({})
    }

    function handleReset() {
        pre.filteredBrands = []
        pre.filteredProducts = []
        pre.lastPurchaseDate = today
        pre.openingPrice = 0
        pre.qty = 0
        pre.selectedCategory = { label: '', value: undefined }
        pre.selectedBrand = { label: '', value: undefined }
        pre.selectedProduct = { label: '', value: undefined }
        pre.id = undefined
        setRefresh({})
    }

    async function handleSubmit() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await genericUpdateMasterNoForm({
                tableName: 'ProductOpBal',
                // updateCodeBlock: 'upsert_opening_stock',
                customCodeBlock: 'upsert_opening_stock',
                data: {
                    id: pre.id,
                    productId: pre.selectedProduct?.value,
                    qty: pre?.qty,
                    openingPrice: pre?.openingPrice,
                    lastPurchaseDate: pre?.lastPurchaseDate,
                    jData: null,
                    finYearId: finYearId,
                    branchId: branchId
                }
            })
            partialResetMeta()
            setRefresh({})
            emit('SHOW-LOADING-INDICATOR', false)
        } catch (e: any) {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    async function loadProducts() {
        if (_.isEmpty(products)) {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                isMultipleRows: true,
                // sqlKey: 'getJson_brands_categories_products'
                sqlKey: 'get_products',
                args: { no: null },
            })
            setInBag('products', ret || [])
            emit('SHOW-LOADING-INDICATOR', false)
        }
        pre.products = getFromBag('products')
        fillFilteredCategories()
        setRefresh({})

        function fillFilteredCategories() {
            const categories = pre?.products.map((x: any) => ({ label: x.catName, value: x.catId })) || []
            pre.filteredCategories = _.uniqBy(categories, (x: any) => x.value).sort((a: any, b: any) => {
                if (a.label > b.label) return 1
                if (a.label < b.label) return -1
                return 0
            })
        }
    }

    function onBrandChanged(selectedItem: any) {
        pre.selectedBrand = selectedItem
        pre.selectedProduct = { label: '', value: undefined }
        pre.filteredProducts = products.filter((x: any) => ((x.brandId === selectedItem.value) && (x.catId === pre?.selectedCategory?.value))).map((x: any) => ({ label: x.label, value: x.id }))
        setRefresh({})
    }

    function onCategoryChanged(selectedItem: any) {
        pre.selectedCategory = selectedItem
        pre.selectedBrand = { label: '', value: undefined }
        pre.selectedProduct = { label: '', value: undefined }
        pre.filteredProducts = products.filter((x: any) => ((x.catId === selectedItem.value) && (x.brandId === pre?.selectedBrand?.value))).map((x: any) => ({ label: x.label, value: x.id }))
        fillFilteredBrands()
        setRefresh({})

        function fillFilteredBrands() {
            const filteredBrands = products.filter((x: any) => (x.catId === selectedItem.value)).map((x: any) =>
            ({
                label: x.brandName,
                value: x.brandId
            }))
            const uniques = _.uniqBy(filteredBrands, (x: any) => x.value)
            pre.filteredBrands = uniques.sort((a: any, b: any) => {
                if (a.label > b.label) return 1
                if (a.label < b.label) return -1
                return 0
            })
        }
    }

    function onProductChanged(selectedItem: any) {
        pre.selectedProduct = selectedItem
        setRefresh({})
    }

    // Used to retain the last value saved
    function partialResetMeta() {
        pre.lastPurchaseDate = today
        pre.openingPrice = 0
        pre.qty = 0
        pre.selectedProduct = { label: '', value: undefined }
        pre.id = undefined
    }

    return ({ checkError, handleReset, handleSubmit, meta, onBrandChanged, onCategoryChanged, onProductChanged, setRefresh })

}

export { useOpeningStockWorkBench }