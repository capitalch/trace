import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeninfStockNewProduct() {
    const [, setRefresh] = useState({})
    const { getFromBag } = useSharedElements()
    const meta = useRef({
        info: undefined,
        gstRate: 0.00,
        hsn: undefined,
        label: undefined,
        upcCode: '',
        unitOfMeasurement:1
    })

    function getCategories(){
        const categories: any[] = getFromBag('categories')
        return(categories.map((x:any)=>({
            label: x.label,
            value: x.id
        })))
    }

    function getUnitOptions() {
        const units: any[] = getFromBag('units')
        return (units.map((x: any) => (
            <option key={x.id} value={x.id}>{x.unitName}</option>
        )))
    }
    return ({ getCategories, getUnitOptions, meta, setRefresh })
}

export { useOpeninfStockNewProduct }