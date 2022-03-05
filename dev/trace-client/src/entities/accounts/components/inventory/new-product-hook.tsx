import { _, useEffect, useRef, useSharedElements, useState, utilMethods } from './redirect'

function useNewProduct(onClose: any, product: any = {}) {
    const [, setRefresh] = useState({})
    const { emit, genericUpdateMasterNoForm, getFromBag } = useSharedElements()
    const finYearId = getFromBag('finYearObject')?.finYearId
    const branchId = getFromBag('branchObject')?.branchId || 1
    const {extractAmount} = utilMethods()
    const meta = useRef({
        id: undefined,
        info: null,
        gstRate: 0.00,
        hsn: null,
        label: undefined,
        upcCode: null,
        unitId: 1,
        selectedBrand: undefined,
        selectedCategory: undefined,
        salePrice: 0,
        salePriceGst: 0,
        maxRetailPrice: 0,
        dealerPrice: 0,
        purPriceGst: 0,
        purPrice: 0,
    })
    const pre: any = meta.current

    useEffect(() => {
        console.log(product)
        if (!_.isEmpty(product)) {
            pre.id = product.id1
            pre.info = product.info
            pre.gstRate = product.gstRate
            pre.hsn = product.hsn
            pre.label = product.label
            pre.upcCode = product.upcCode
            pre.unitId = product.unitId
            pre.selectedBrand = { label: product.brandName, value: product.brandId }
            pre.selectedCategory = { label: product.catName, value: product.catId }
            pre.salePrice = product.salePrice
            pre.salePriceGst = product.salePriceGst
            pre.maxRetailPrice = product.maxRetailPrice
            pre.dealerPrice = product.dealerPrice
            pre.purPriceGst = product.purPriceGst
            pre.purPrice = product.purPrice
            setRefresh({})
        }
    }, [])

    function checkError() {
        const isCatError = !Boolean(pre?.selectedCategory?.value)
        const isBrandError = !Boolean(pre?.selectedBrand?.value)
        const isLabelError = !Boolean(pre?.label)
        const error = isCatError || isBrandError || isLabelError
        return (error)
    }

    function getUnitOptions() {
        const units: any[] = getFromBag('units') || []
        return (units.map((x: any) => (
            <option key={x.id} value={x.id}>{x.unitName}</option>
        )))
    }

    async function handleSubmit() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await genericUpdateMasterNoForm({
                tableName: 'ProductM',
                customCodeBlock: 'insert_product_block',
                data: {
                    id: pre.id || null,
                    catId: pre?.selectedCategory?.value || undefined,
                    hsn: pre.hsn,
                    brandId: pre?.selectedBrand.value || undefined,
                    jData: null,
                    info: pre.info,
                    isActive: true,
                    unitId: pre.unitId,
                    label: pre.label,
                    upcCode: pre.upcCode,
                    gstRate: pre.gstRate,
                    finYearId: finYearId,
                    branchId: branchId,
                    salePrice: extractAmount(pre.salePrice),
                    salePriceGst: extractAmount(pre.salePriceGst),
                    maxRetailPrice: extractAmount(pre.maxRetailPrice),
                    dealerPrice: extractAmount(pre.dealerPrice),
                    purPriceGst: extractAmount(pre.purPriceGst),
                    purPrice: extractAmount(pre.purPrice),
                }
            })
            ret && onClose()
            emit('SHOW-LOADING-INDICATOR', false)
        } catch (e: any) {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    function onBrandChanged(selectedItem: any) {
        pre.selectedBrand = selectedItem
        setRefresh({})
    }

    function onCategoryChanged(selectedItem: any) {
        pre.selectedCategory = selectedItem
        setRefresh({})
    }

    return ({ checkError, getUnitOptions, handleSubmit, meta, onBrandChanged, onCategoryChanged, setRefresh })
}

export { useNewProduct }