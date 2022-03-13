import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeningStockWorkBench() {
    const [, setRefresh] = useState({})
    const { emit, execGenericView, filterOn, genericUpdateMasterNoForm, getFromBag, setInBag } = useSharedElements()
    const finYearId = getFromBag('finYearObject')?.finYearId
    const branchId = getFromBag('branchObject')?.branchId || 1
    const today = moment().format('YYYY-MM-DD')
    const meta: any = useRef({
        filteredBrands: [],
        filteredCategories: [],
        filteredProducts: [], // for labels
        id: undefined,
        lastPurchaseDate: today,
        openingPrice: 0,
        qty: 0,
        selectedBrand: undefined,
        selectedCategory: undefined,
        selectedProduct: undefined,
        showDialog: false,
        dialogConfig: {
            title: 'Add new product',
        }
    })
    const pre = meta.current
    useEffect(() => {
        loadProducts()
        const subs1 = filterOn('OPENING-STOCK-XX-GRID-EDIT-CLICKED').subscribe(handleEdit)
        const subs2 = filterOn('OPENING-STOCK-WORK-BENCH-HOOK_PRODUCT-UPSERTED-AT-SERVER').subscribe(onProductUpsertedAtServer)
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

    function handleCloseDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function handleEdit(d: any) {
        const row = d.data?.row
        pre.id = row.id1

        pre.selectedCategory = {}
        pre.selectedBrand = {}
        pre.selectedProduct = {}

        const selectedCategory = { label: row.catName, value: row.catId }
        onCategoryChanged(selectedCategory)

        const selectedBrand = { label: row.brandName, value: row.brandId }
        onBrandChanged(selectedBrand)

        const selectedProduct = { label: row.label, value: row.productId }
        onProductChanged(selectedProduct)

        pre.qty = row.qty
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

    function handleNewProduct() {
        pre.showDialog = true
        setRefresh({})
    }

    async function handleSubmit() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await genericUpdateMasterNoForm({
                tableName: 'ProductOpBal',
                customCodeBlock: pre.id ? undefined : 'upsert_opening_stock', // If id is there then just do edit. Otherwise check if this product already entered. If entered then increase its qty otherwise do insert
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
            emit('XX-GRID-HOOK-FETCH-OPENING-STOCK', '') // to refresh the grid of op balances
            emit('SHOW-LOADING-INDICATOR', false)
        } catch (e: any) {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    async function loadProducts() {
        let products = getFromBag('products')
        if (_.isEmpty(products)) {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret: any = await execGenericView({
                isMultipleRows: false,
                sqlKey: 'getJson_brands_categories_products_units',
                args: { no: null },
            })
            products = ret?.jsonResult?.products || []
            const categories = ret?.jsonResult?.categories || []
            const brands = ret?.jsonResult?.brands || []
            const units = ret?.jsonResult?.units || []
            setInBag('products', products)
            setInBag('categories', categories)
            setInBag('brands', brands)
            setInBag('units', units)
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
        pre.filteredProducts = pre?.products.filter((x: any) => ((x.brandId === selectedItem.value) && (x.catId === pre?.selectedCategory?.value))).map((x: any) => ({ label: x.label, value: x.id }))
        setRefresh({})
    }

    function onCategoryChanged(selectedItem: any) {
        pre.selectedCategory = selectedItem
        pre.selectedBrand = { label: '', value: undefined }
        pre.selectedProduct = { label: '', value: undefined }
        pre.filteredProducts = pre?.products.filter((x: any) => ((x.catId === selectedItem.value) && (x.brandId === pre?.selectedBrand?.value))).map((x: any) => ({ label: x.label, value: x.id }))
        fillFilteredBrands()
        setRefresh({})

        function fillFilteredBrands() {
            const filteredBrands = pre?.products.filter((x: any) => (x.catId === selectedItem.value)).map((x: any) =>
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

    function onProductUpsertedAtServer(){
        pre.products = getFromBag('products')
        // onCategoryChanged(pre.selectedCategory)
        onBrandChanged(pre.selectedBrand)
    }

    // Used to retain the last value saved
    function partialResetMeta() {
        pre.lastPurchaseDate = today
        pre.openingPrice = 0
        pre.qty = 0
        pre.selectedProduct = { label: '', value: undefined }
        pre.id = undefined
    }

    return ({ checkError, handleCloseDialog, handleNewProduct, handleReset, handleSubmit, meta, onBrandChanged, onCategoryChanged, onProductChanged, setRefresh })

}

export { useOpeningStockWorkBench }