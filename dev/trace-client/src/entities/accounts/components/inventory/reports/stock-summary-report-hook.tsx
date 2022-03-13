import { useRef, useState } from '../redirect'
function useStockSummaryReport() {
    const [, setRefresh] = useState({})
    const meta = useRef({

    })

    return ({ meta, setRefresh })
}
export { useStockSummaryReport }