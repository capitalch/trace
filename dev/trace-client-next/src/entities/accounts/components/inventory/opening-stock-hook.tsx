import {
    _,
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { DataGridPro, useGridApiRef, } from '../../../../imports/gui-imports'

function useOpeningStock() {
    const [,setRefresh] = useState({})
    const meta = useRef({
        title: 'Opening stock (New / Edit)'
    })
    const { emit, execGenericView, getFromBag, setInBag } = useSharedElements()
    const stock = getFromBag('stock')
    useEffect(() => {
        if (_.isEmpty(stock)) {
            loadStock()
        }
        return (() => {

        })

    }, [])
    const finYearObject = getFromBag('finYearObject')

    async function loadStock() {
        emit('SHOW-LOADING-INDICATOR', true)
        const ret: any = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_brands_categories_products'
        })
        setInBag('stock', ret.jsonResult || undefined)
        emit('SHOW-LOADING-INDICATOR', false)
        setRefresh({})
    }

    function getXXGriArtifacts() {
        const sqlQueryId = 'get_stock_op_bal'
        const sqlQueryArgs = {}
        const columns: any[] = []
        const actionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-OPENING-STOCK',
            editIbukiMessage: 'OPENING-STOCK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'OPENING-STOCK-XX-GRID-DELETE-CLICKED'
        }
        const summaryColNames: any[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const title = ''.concat('Opening stock view ', '(Year ', finYearObject.startDate, '-', finYearObject.endDate, ')')
        return ({ actionMessages, columns, sqlQueryArgs, sqlQueryId, summaryColNames, specialColumns, title })
    }

    return ({ getXXGriArtifacts, meta })

}

export { useOpeningStock }