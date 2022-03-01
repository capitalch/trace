import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeninfStockNewProduct() {
    const [, setRefresh] = useState({})
    const { emit, genericUpdateMasterNoForm, getFromBag } = useSharedElements()
    const finYearId = getFromBag('finYearObject')?.finYearId
    const branchId = getFromBag('branchObject')?.branchId || 1
    const meta = useRef({
        id: undefined,
        info: undefined,
        gstRate: 0.00,
        hsn: undefined,
        label: undefined,
        upcCode: '',
        unitOfMeasurement: 1,
        selectedBrand: undefined,
        selectedCategory: undefined,
    })
    const pre: any = meta.current
    useEffect(() => {

    })

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
                data: {
                    id: pre.id,
                    catId: pre?.selectedCategory?.value || undefined,
                    hsn: pre.hsn,
                    brandId: pre.brandId,
                    info: pre.info,
                    unitId: '',
                    label: pre.label,
                    upcCode: pre.upcCode,
                    gstRate: pre.gstRate,
                    finYearId: finYearId,
                    branchId: branchId
                }
            })
            // partialResetMeta()
            setRefresh({})
            emit('XX-GRID-HOOK-FETCH-OPENING-STOCK', '') // to refresh the grid of op balances
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

export { useOpeninfStockNewProduct }