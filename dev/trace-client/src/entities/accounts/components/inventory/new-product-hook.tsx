import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useNewProduct(onClose: any) {
    const [, setRefresh] = useState({})
    const { emit, genericUpdateMasterNoForm, getFromBag } = useSharedElements()
    const finYearId = getFromBag('finYearObject')?.finYearId
    const branchId = getFromBag('branchObject')?.branchId || 1
    const meta = useRef({
        info: null,
        gstRate: 0.00,
        hsn: null,
        label: undefined,
        upcCode: null,
        unitOfMeasurement: 1,
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

    function checkError() {
        const isCatError = !Boolean(pre?.selectedCategory?.value)
        const isBrandError = !Boolean(pre?.selectedBrand?.value)
        const isLabelError = !Boolean(pre?.label)
        const error = isCatError || isBrandError || isLabelError
        return (error)
    }

    function getUnitOptions() {
        const units: any[] = getFromBag('units')
        return (units.map((x: any) => (
            <option key={x.id} value={x.id}>{x.unitName}</option>
        )))
    }

    async function handleSubmit() {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await genericUpdateMasterNoForm({
                tableName: 'ProductM',
                // customCodeBlock: pre.id ? undefined : 'upsert_opening_stock', // If id is there then just do edit. Otherwise check if this product already entered. If entered then increase its qty otherwise do insert
                customCodeBlock: 'insert_product_block',
                data: {
                    id: undefined,
                    catId: pre?.selectedCategory?.value || undefined,
                    hsn: pre.hsn,
                    brandId: pre?.selectedBrand.value || undefined,
                    jData: null,
                    info: pre.info,
                    isActive: true,
                    unitId: pre.unitOfMeasurement,
                    label: pre.label,
                    upcCode: pre.upcCode,
                    gstRate: pre.gstRate,
                    finYearId: finYearId,
                    branchId: branchId,
                    salePrice: pre.salePrice,
                    salePriceGst: pre.salePriceGst,
                    maxRetailPrice: pre.maxRetailPrice,
                    dealerPrice: pre.dealerPrice,
                    purPriceGst: pre.purPriceGst,
                    purPrice: pre.purPrice,
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