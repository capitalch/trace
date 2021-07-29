import { useSharedElements } from '../../common/shared-elements-hook'
import { utilMethods } from '../../../../../common-utils/util-methods'
import { useState } from 'react'

function useAllTransactions() {
    const { getFromBag } = useSharedElements()
    const {toDecimalFormat} = utilMethods()
    // const { AddIcon, Box, emit, getFromBag, NativeSelect, setInBag, Typography, } = useSharedElements()
    // const { execGenericView, toDecimalFormat } = utilMethods()
    // const dateFormat = getFromBag('dateFormat')
    const columns = [
        { headerName: 'Ind', field: 'index', width: 80, disableColumnMenu: true },
        { headerName: 'Id', field: 'id1', width: 90 },
        { headerName: 'Date', field: 'tranDate', width: 120 },
        { headerName: 'Ref', field: 'autoRefNo', width: 200 },
        { headerName: 'Account', field: 'accName', width: 200 },
        {
            headerName: 'Debits',
            field: 'debit',
            type: 'number',
            width: 160,
            valueFormatter: (params:any)=> toDecimalFormat(params.value)
        },
        {
            headerName: 'Credits',
            field: 'credit',
            type: 'number',
            width: 160,
            valueFormatter: (params:any)=> toDecimalFormat(params.value)
        },

        { headerName: 'Instr', field: 'instrNo', width: 160, sortable: false},
        { headerName: 'User ref no', field: 'userRefNo' , width: 160, sortable: false},
        { headerName: 'Remarks', field: 'remarks', width: 200, sortable: false },
        { headerName: 'Line ref no', field: 'lineRefNo', width: 200, sortable: false },
        { headerName: 'Line remarks', field: 'lineRemarks', width: 200, sortable: false },
    ]

    const sqlQueryId = 'get_allTransactions'
    const title = 'All transactions'
    const args = {
        dateFormat: getFromBag('dateFormat'),
        no: null,
    }
    return { args, columns, sqlQueryId, title }
}

export { useAllTransactions }
