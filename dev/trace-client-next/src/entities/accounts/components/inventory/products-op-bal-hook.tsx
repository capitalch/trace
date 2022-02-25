import {
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { DataGridPro, useGridApiRef, } from '../../../../imports/gui-imports'

function useProductsOpBal() {
    const meta = useRef({

    })
    const { } = useSharedElements()
    useEffect(() => {

        return (() => {

        })

    }, [])

    function getXXGridAttributes() {
        const sqlQueryId = ''
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
        const title = 'Stock opening balance'
        return ({actionMessages, columns, sqlQueryArgs, sqlQueryId, summaryColNames, specialColumns, title })
    }

    return ({ getXXGridAttributes })

}

export { useProductsOpBal }