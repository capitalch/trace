import { _, moment, useEffect, useRef, useSharedElements, useState } from './redirect'

function useOpeninfStockNewProduct() {
    const [, setRefresh] = useState({})
    const meta = useRef({
        info: undefined,
        label: undefined
    })
    return ({ meta, setRefresh })
}

export { useOpeninfStockNewProduct }