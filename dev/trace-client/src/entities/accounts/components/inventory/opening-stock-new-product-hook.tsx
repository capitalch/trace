import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeninfStockNewProduct() {
    const [, setRefresh] = useState({})
    const meta = useRef({
        info: undefined,
        gstRate:0.00,
        hsn: undefined,
        label: undefined,
        upcCode: ''
    })
    return ({ meta, setRefresh })
}

export { useOpeninfStockNewProduct }